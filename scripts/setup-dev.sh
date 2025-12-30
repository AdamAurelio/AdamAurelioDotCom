#!/bin/bash

# Development Environment Setup Script
# This script sets up the complete development environment

set -e  # Exit on error

echo "🚀 Setting up AdamAurelio.com Development Environment"
echo "=================================================="

# Check if required tools are installed
echo "📋 Checking prerequisites..."

command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Please install Docker Desktop."; exit 1; }
command -v python >/dev/null 2>&1 || { echo "❌ Python is required but not installed. Please install Python 3.11+."; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Please install Node.js 18+."; exit 1; }

echo "✅ All prerequisites are installed"

# Create environment file if it doesn't exist
if [ ! -f .env.dev ]; then
    echo "📝 Creating .env.dev file..."
    cp .env.dev.example .env.dev
    echo "⚠️  Please edit .env.dev and add your configuration values"
    read -p "Press enter to continue after editing .env.dev..."
fi

# Build and start Docker containers
echo "🐳 Starting Docker containers..."
docker-compose -f docker-compose.dev.yml up -d --build

# Wait for database to be ready
echo "⏳ Waiting for database to be ready..."
sleep 10

# Run database migrations
echo "🗄️  Running database migrations..."
docker-compose -f docker-compose.dev.yml exec -T backend python manage.py migrate

# Create superuser if it doesn't exist
echo "👤 Creating superuser..."
docker-compose -f docker-compose.dev.yml exec -T backend python manage.py shell << EOF
from django.contrib.auth import get_user_model
User = get_user_model()
if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@adamaurelio.com', 'admin123')
    print('Superuser created: admin/admin123')
else:
    print('Superuser already exists')
EOF

# Load initial data
echo "📊 Loading sample data..."
docker-compose -f docker-compose.dev.yml exec -T backend python manage.py loaddata initial_data.json || echo "No initial data to load"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo ""
echo "✅ Development environment setup complete!"
echo ""
echo "🌐 Access your application at:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:8000"
echo "   Django Admin: http://localhost:8000/admin (admin/admin123)"
echo ""
echo "📝 Useful commands:"
echo "   Start: docker-compose -f docker-compose.dev.yml up"
echo "   Stop:  docker-compose -f docker-compose.dev.yml down"
echo "   Logs:  docker-compose -f docker-compose.dev.yml logs -f"
echo ""
echo "Happy coding! 🎉"
