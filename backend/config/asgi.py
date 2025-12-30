"""
ASGI config for AdamAurelio.com project.
"""

import os

from django.core.asgi import get_asgi_application

# Determine environment and set appropriate settings module
environment = os.getenv('DJANGO_ENV', 'development')

if environment == 'production':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.production')
elif environment == 'qa':
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.qa')
else:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

application = get_asgi_application()
