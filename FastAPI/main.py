from config import app
from fastapi import HTTPException
from typing import List


@app.get('/clientes')
def login_clientes(cli_email:str, cli_senha:str, session:SessionDep) -> Usuario | str:
    clientes = clientes_all(session=session)
    for cliente in clientes:
        if cliente.email == cli_email:
            if cliente.senha == cli_senha:
                return cliente
            return {"mensagem": "Senha Incorreta"}
        return {"mensagem": "Email inexistente"}

# -------------------------------------------------------------------------------  