from config import app
from routers.amigos import router as amigos
from routers.carrinhos import router as carrinhos
from routers.clientes import router as clientes
from routers.comentarios import router as comentarios
from routers.enderecos import router as enderecos
from routers.favoritos import router as favoritos
from routers.lojas import router as lojas
from routers.produtos import router as produtos


app.include_router(amigos)
app.include_router(carrinhos)
app.include_router(clientes)
app.include_router(comentarios)
app.include_router(enderecos)
app.include_router(favoritos)
app.include_router(lojas)
app.include_router(produtos)













