from fastapi import APIRouter
import requests

router = APIRouter(prefix="/document", tags=["document"])

def validar_cpf(cpf: str) -> bool:
    cpf = ''.join(filter(str.isdigit, cpf))

    if len(cpf) != 11:
        return False

    if cpf == cpf[0] * 11:
        return False

    # Primeiro dígito
    soma = sum(int(cpf[i]) * (10 - i) for i in range(9))
    dig1 = (soma * 10 % 11) % 10
    if dig1 != int(cpf[9]):
        return False

    # Segundo dígito
    soma = sum(int(cpf[i]) * (11 - i) for i in range(10))
    dig2 = (soma * 10 % 11) % 10
    if dig2 != int(cpf[10]):
        return False

    return True

@router.get("/")
def validate_document(cpf: str = None,cnpj:str = None):
    if cpf:
        if validar_cpf(cpf):
            return {"valid": True, "type": "cpf", "message": "CPF válido matematicamente"}
        else:
            return {"valid": False, "type": "cpf", "message": "CPF inválido"}

    if cnpj:
        url = f"https://brasilapi.com.br/api/cnpj/v1/{cnpj}"
        response = requests.get(url)

        if response.status_code == 200:
            return {"valid": True, "type": "cnpj", "data": response.json()}
        else:
            return {"valid": False, "type": "cnpj", "message": "CNPJ não encontrado"}
