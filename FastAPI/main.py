from config import app
import fastapi_swagger_dark as fsd
import fastapi
from fastapi import Response
from datetime import datetime

router = fastapi.APIRouter()

fsd.install(router)
app.include_router(router)


from routers.amigos import router as amigos
from routers.carrinhos import router as carrinhos
from routers.categorias import router as categorias
from routers.clientes import router as clientes
from routers.comentarios import router as comentarios
from routers.compras import router as compras
from routers.enderecos import router as enderecos
from routers.favoritos import router as favoritos
from routers.lojas import router as lojas
from routers.notificacoes import router as notificacoes
from routers.produtos import router as produtos
from services.payment import router as payment
from fastapi.staticfiles import StaticFiles




app.include_router(amigos)
app.include_router(carrinhos)
app.include_router(categorias)
app.include_router(clientes)
app.include_router(comentarios)
app.include_router(compras)
app.include_router(enderecos)
app.include_router(favoritos)
app.include_router(lojas)
app.include_router(notificacoes)
app.include_router(produtos)
app.include_router(payment)

app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")



@app.get("/sitemap.xml", response_class=Response)
def sitemap():
    base_url = "https://balstore.com.br"

    # pega TODAS as rotas registradas
    all_routes = []
    for route in app.routes:
        if hasattr(route, "path") and route.path not in ["/openapi.json", "/docs", "/redoc", "/sitemap.xml"]:
            # ignora arquivos estáticos
            if not any(route.path.endswith(ext) for ext in [".css", ".js", ".ico", ".png", ".jpg", ".jpeg"]):
                # ignora rotas dinâmicas /users/{id}
                if "{" not in route.path:
                    all_routes.append(route.path)

    # remove duplicatas mantendo a ordem
    unique_routes = list(dict.fromkeys(all_routes))

    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

    today = datetime.utcnow().date()
    for path in unique_routes:
        xml += f"  <url>\n"
        xml += f"    <loc>{base_url}{path}</loc>\n"
        xml += f"    <lastmod>{today}</lastmod>\n"
        xml += f"  </url>\n"

    xml += "</urlset>"

    return Response(content=xml, media_type="application/xml")









