from setuptools import setup

setup(
    name='my_fastapi_react_app',
    version='1.0',
    packages=['my_fastapi_react_app'],  # Substitua pelo nome do seu pacote
    install_requires=[
        'fastapi',
        'uvicorn',
        'aiofiles',
    ],
    entry_points={
        'console_scripts': ['my_fastapi_react_app=main:app'],  # Altere conforme necessário
    },
)
