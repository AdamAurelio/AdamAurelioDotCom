# Backend Directory Structure

backend/
├── config/                     # Django project settings
│   ├── __init__.py
│   ├── asgi.py
│   ├── wsgi.py
│   ├── urls.py                # Main URL configuration
│   └── settings/
│       ├── __init__.py
│       ├── base.py            # Shared settings
│       ├── development.py     # Dev-specific settings
│       ├── qa.py              # QA-specific settings
│       └── production.py      # Production-specific settings
├── apps/                       # Django applications
│   ├── core/                  # Core functionality
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── urls.py
│   ├── blog/                  # Blog application
│   │   ├── __init__.py
│   │   ├── models.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   ├── admin.py
│   │   └── urls.py
│   └── resume/                # Resume/Portfolio app
│       ├── __init__.py
│       ├── models.py
│       ├── views.py
│       ├── serializers.py
│       └── urls.py
├── manage.py
├── requirements.txt
└── pytest.ini
