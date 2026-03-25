
pyinstaller backend/server.py \
--icon=icone.png \
--add-data "backend/static:static" \
--hidden-import fastapi \
--hidden-import uvicorn \
--hidden-import PySide6 \
--hidden-import uvicorn \
--onedir