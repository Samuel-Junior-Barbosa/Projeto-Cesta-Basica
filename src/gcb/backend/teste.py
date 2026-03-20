import hashlib
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["argon2"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(password: str, password_hash: str) -> bool:
    return pwd_context.verify(password, password_hash)


if __name__ == '__main__':

    senha = 'operador'
    hash = ''
    hash_gerado = hash_password(senha)
    print(" HASH GERADO DA SENHA: ", hash_gerado, flush=1)
    print(senha, verify_password(senha, hash), flush=1)