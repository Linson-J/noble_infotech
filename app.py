import os
import django
from django.core.management import call_command

# Initialize Django settings
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'noble_infotech.settings')
django.setup()

# Run database migrations automatically at startup
try:
    print("Automatically running database migrations...")
    call_command('migrate', interactive=False)
    print("Migrations completed successfully.")
except Exception as e:
    print(f"Auto-migration failed: {e}")

# Run collectstatic automatically at startup
try:
    print("Automatically collecting static files...")
    call_command('collectstatic', interactive=False, clear=False)
    print("Collectstatic completed successfully.")
except Exception as e:
    print(f"Auto-collectstatic failed: {e}")

# Expose WSGI application callable
from noble_infotech.wsgi import application as app
