import os
import sys

if __name__ == "__main__":
    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "rma_ocw_api.settings")
    from django.core.management import execute_from_command_line

    # Colectar archivos estáticos y aplicar migraciones
    execute_from_command_line(["manage.py", "collectstatic", "--noinput"])
    execute_from_command_line(["manage.py", "migrate", "--noinput"])

    # Iniciar el servidor
    execute_from_command_line(["manage.py", "runserver", "127.0.0.1:8000"])