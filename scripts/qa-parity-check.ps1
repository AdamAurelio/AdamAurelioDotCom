<#
.SYNOPSIS
  QA-vs-prod parity check for adamaurelio.com.

.DESCRIPTION
  Proves the Synology QA environment reproduces prod's (CloudFront) observable
  HTTP behavior. The build artifact is already identical in both (same
  `vite build`), so the only thing that can drift is the *serving layer*, whose
  config is hand-maintained in three places that must agree:

    - prod : infra/response-headers-policy.json + CloudFront custom error responses
    - QA   : nginx.conf            (Docker / Container Manager)
    - QA   : Apache .htaccess      (Web Station)

  This script compares the LIVE responses of both environments against each
  other, so drift shows up no matter which side changed. It checks:

    1. The security header set (CSP, HSTS, X-Frame-Options, etc.)
    2. SPA deep-link fallback  (GET /resume -> 200 text/html)
    3. index.html is not cached (Cache-Control: no-cache...)
    4. Hashed assets are cached hard (Cache-Control: ...immutable)

  Exit code 0 = parity, 1 = drift (so it can gate CI or a pre-deploy check).

.PARAMETER QaUrl
  Base URL of the QA site. Use HTTPS for a true comparison -- HSTS is only
  emitted over HTTPS, so over http://<nas-ip>:8080 the HSTS row will (correctly)
  flag. Default: https://qa.adamaurelio.com

.PARAMETER ProdUrl
  Base URL of prod. Default: https://adamaurelio.com

.EXAMPLE
  ./scripts/qa-parity-check.ps1

.EXAMPLE
  ./scripts/qa-parity-check.ps1 -QaUrl http://192.168.1.50:8080
#>
[CmdletBinding()]
param(
    [string]$QaUrl   = 'https://qa.adamaurelio.com',
    [string]$ProdUrl = 'https://adamaurelio.com'
)

# The security headers prod and QA must BOTH emit. Keep in sync with
# infra/response-headers-policy.json and nginx.conf -- but this check is what
# actually guarantees they stay in sync.
$SecurityHeaders = @(
    'Content-Security-Policy',
    'Strict-Transport-Security',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'Referrer-Policy',
    'Permissions-Policy'
)

$script:Failures = 0

function Get-Response {
    param([string]$Url)
    try {
        return Invoke-WebRequest -Uri $Url -UseBasicParsing -MaximumRedirection 0 -TimeoutSec 20
    } catch {
        # A non-2xx (or a blocked redirect) still carries a usable response object.
        if ($_.Exception.Response) { return $_.Exception.Response }
        Write-Host "  ! request to $Url failed: $($_.Exception.Message)" -ForegroundColor Red
        return $null
    }
}

function Get-Header {
    param($Response, [string]$Name)
    if ($null -eq $Response) { return '' }
    $v = $Response.Headers[$Name]
    if ($null -eq $v) { return '' }
    if ($v -is [array]) { $v = ($v -join ', ') }
    return ([string]$v -replace '\s+', ' ').Trim()
}

function Get-StatusCode {
    param($Response)
    if ($null -eq $Response) { return 0 }
    return [int]$Response.StatusCode
}

function Compare-Value {
    param([string]$Label, [string]$Qa, [string]$Prod)
    if ($Qa -ceq $Prod -and $Qa -ne '') {
        Write-Host ("  [ OK ] {0}" -f $Label) -ForegroundColor Green
    } else {
        $script:Failures++
        Write-Host ("  [FAIL] {0}" -f $Label) -ForegroundColor Red
        Write-Host ("         QA   : {0}" -f $(if ($Qa   -eq '') { '<missing>' } else { $Qa   }))
        Write-Host ("         prod : {0}" -f $(if ($Prod -eq '') { '<missing>' } else { $Prod }))
    }
}

Write-Host ""
Write-Host "QA-vs-prod parity check" -ForegroundColor Cyan
Write-Host ("  QA   : {0}" -f $QaUrl)
Write-Host ("  prod : {0}" -f $ProdUrl)

if ($QaUrl -like 'http://*') {
    Write-Host "  note : QA is HTTP, so Strict-Transport-Security will not be present (expected)." -ForegroundColor Yellow
}

# --- 1. Security headers (on the root document) -------------------------------
Write-Host "`nSecurity headers (/)" -ForegroundColor Cyan
$qaRoot   = Get-Response $QaUrl
$prodRoot = Get-Response $ProdUrl
foreach ($h in $SecurityHeaders) {
    Compare-Value $h (Get-Header $qaRoot $h) (Get-Header $prodRoot $h)
}

# --- 2. SPA deep-link fallback ------------------------------------------------
Write-Host "`nSPA deep-link fallback (/resume -> 200 text/html)" -ForegroundColor Cyan
$qaDeep   = Get-Response ("{0}/resume" -f $QaUrl.TrimEnd('/'))
$prodDeep = Get-Response ("{0}/resume" -f $ProdUrl.TrimEnd('/'))
foreach ($pair in @(@{n='QA';r=$qaDeep}, @{n='prod';r=$prodDeep})) {
    $code = Get-StatusCode $pair.r
    $ct   = Get-Header $pair.r 'Content-Type'
    if ($code -eq 200 -and $ct -like 'text/html*') {
        Write-Host ("  [ OK ] {0}: {1} {2}" -f $pair.n, $code, $ct) -ForegroundColor Green
    } else {
        $script:Failures++
        Write-Host ("  [FAIL] {0}: {1} {2} (expected 200 text/html)" -f $pair.n, $code, $ct) -ForegroundColor Red
    }
}

# --- 3. index.html must not be cached -----------------------------------------
Write-Host "`nindex.html cache policy (no-cache)" -ForegroundColor Cyan
$qaIndex   = Get-Response ("{0}/index.html" -f $QaUrl.TrimEnd('/'))
$prodIndex = Get-Response ("{0}/index.html" -f $ProdUrl.TrimEnd('/'))
foreach ($pair in @(@{n='QA';r=$qaIndex}, @{n='prod';r=$prodIndex})) {
    $cc = Get-Header $pair.r 'Cache-Control'
    if ($cc -match 'no-cache|no-store|max-age=0') {
        Write-Host ("  [ OK ] {0}: {1}" -f $pair.n, $cc) -ForegroundColor Green
    } else {
        $script:Failures++
        Write-Host ("  [FAIL] {0}: '{1}' (expected no-cache/no-store)" -f $pair.n, $cc) -ForegroundColor Red
    }
}

# --- 4. Hashed assets must be cached hard -------------------------------------
Write-Host "`nHashed asset cache policy (immutable / long max-age)" -ForegroundColor Cyan
$assetPath = $null
if ($qaRoot -and $qaRoot.Content) {
    $m = [regex]::Match($qaRoot.Content, '/assets/[A-Za-z0-9_.\-]+\.(?:js|css)')
    if ($m.Success) { $assetPath = $m.Value }
}
if (-not $assetPath) {
    Write-Host "  [SKIP] could not find an /assets/ URL in the root HTML" -ForegroundColor Yellow
} else {
    Write-Host ("  asset: {0}" -f $assetPath)
    $qaAsset   = Get-Response ("{0}{1}" -f $QaUrl.TrimEnd('/'),   $assetPath)
    $prodAsset = Get-Response ("{0}{1}" -f $ProdUrl.TrimEnd('/'), $assetPath)
    foreach ($pair in @(@{n='QA';r=$qaAsset}, @{n='prod';r=$prodAsset})) {
        $cc = Get-Header $pair.r 'Cache-Control'
        if ($cc -match 'immutable|max-age=(?:[0-9]{6,})') {
            Write-Host ("  [ OK ] {0}: {1}" -f $pair.n, $cc) -ForegroundColor Green
        } else {
            $script:Failures++
            Write-Host ("  [FAIL] {0}: '{1}' (expected immutable / long max-age)" -f $pair.n, $cc) -ForegroundColor Red
        }
    }
}

# --- Summary ------------------------------------------------------------------
Write-Host ""
if ($script:Failures -eq 0) {
    Write-Host "PARITY OK -- QA mirrors prod." -ForegroundColor Green
    exit 0
} else {
    Write-Host ("DRIFT -- {0} check(s) failed. Reconcile nginx.conf / .htaccess with infra/response-headers-policy.json." -f $script:Failures) -ForegroundColor Red
    exit 1
}
