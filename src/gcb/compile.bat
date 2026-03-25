
cd .\frontend

call npm run build
cd .\dist

move assets\* ..\..\backend\static\assets
move index.html ..\..\backend\static

cd ..\..\

poetry run pyinstaller backend\server.py ^
--icon=icone.ico ^
--add-data "backend\static:static" ^
--hidden-import fastapi ^
--hidden-import uvicorn ^
--hidden-import PySide6 ^
--hidden-import uvicorn ^
--hidden-import argon2-cffi ^
--hidden-import passlib.handlers.argon2 ^
--onedir ^
--windowed