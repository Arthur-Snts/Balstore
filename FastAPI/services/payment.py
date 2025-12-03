from fastapi import APIRouter
import requests

router = APIRouter(prefix="/pix", tags=["pix"])

from pydantic import BaseModel

class Pagamento(BaseModel):
    cli_nome: str | None = None
    cli_email: str | None = None
    cli_cpf: str | None = None
    amount: float | None = None

@router.post("/")
def create_pix_payment(pagamento:Pagamento):
    headers = {
        "Authorization": "Bearer 304d178f-6cc6-4309-9801-d989dc8d2600a93dadf5416ea4fbda3745c9cfee459eb22a-a2db-4ab5-99af-67e377a45520",
        "Content-Type": "application/json"
    }
    payload = {
        "customer": {
            "name": f"{pagamento.cli_nome}",
            "email": f"{pagamento.cli_email}",
            "tax_id": f"{pagamento.cli_cpf}"
        },
        "qr_codes": [{
            "amount": {"value": int(pagamento.amount * 100)},
            "expiration_date": "2025-12-31T23:59:59Z"
        }]
    }
    r = requests.post("https://sandbox.api.pagseguro.com/orders", json=payload, headers=headers)
    return r.json()