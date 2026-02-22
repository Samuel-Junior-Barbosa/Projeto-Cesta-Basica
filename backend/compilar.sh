
read -sp "Confirmar a limpeza das pastas de BUILD e DIST: [s/n] " resposta
echo "$resposta"

if [ "$resposta" == "s" ]; then
    echo "DELETANDO PASTA COM ARQUIVOS"
    rm -rf ./dist
    rm -rf ./build
fi





pyinstaller server.py \
--icon=icone.png \
--add-data "static:static" \
--hidden-import fastapi \
--hidden-import uvicorn \
--hidden-import PySide6 \
--hidden-import uvicorn \
--onedir