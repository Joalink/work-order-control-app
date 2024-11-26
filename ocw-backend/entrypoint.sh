#!/bin/bash

# Run database migrations
python manage.py migrate

# Load fixtures if not already loaded
python manage.py loaddata orders/fixtures/priority.json
python manage.py loaddata orders/fixtures/service.json
python manage.py loaddata orders/fixtures/shifts.json
python manage.py loaddata orders/fixtures/status.json

# Start the Django development server
# python manage.py runserver 0.0.0.0:8000