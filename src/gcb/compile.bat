

poetry run pyinstaller backend\server.py \
--icon=icone.png \
--add-data "static:static" \
--hidden-import fastapi \
--hidden-import uvicorn \
--hidden-import PySide6 \
--hidden-import uvicorn \
--hidden-import argon2-cffi \
--hidden-import passlib.handlers.argon2 \
--onedir