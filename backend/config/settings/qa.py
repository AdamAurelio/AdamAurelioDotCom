"""
QA/Testing environment settings
"""

from .base import *

DEBUG = False

# Add your Synology NAS IP here
ALLOWED_HOSTS = [
    'localhost',
    '127.0.0.1',
    env('QA_HOST', default=''),  # Your Synology IP or hostname
]

# CORS settings for QA
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3001',
    f"http://{env('QA_HOST', default='localhost')}:3001",
]
CORS_ALLOW_CREDENTIALS = True

# Database - uses environment variables from .env.qa
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': env('DB_NAME', default='adamaurelio_qa'),
        'USER': env('DB_USER', default='postgres'),
        'PASSWORD': env('DB_PASSWORD'),
        'HOST': env('DB_HOST', default='db'),
        'PORT': env('DB_PORT', default='5432'),
    }
}

# Email backend for QA
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'INFO',
            'class': 'logging.FileHandler',
            'filename': BASE_DIR / 'logs' / 'qa.log',
            'formatter': 'verbose',
        },
        'console': {
            'class': 'logging.StreamHandler',
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['file', 'console'],
        'level': 'INFO',
    },
}

# Ensure logs directory exists
os.makedirs(BASE_DIR / 'logs', exist_ok=True)
