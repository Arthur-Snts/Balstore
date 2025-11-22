// ======================================================================================
// LOGIN CLIENTE
// ======================================================================================
export async function renovarAccessToken() {
    const refresh = localStorage.getItem("refresh_token");

    if (!refresh) return { success: false, reason: "no_refresh" };

    for (let attempt = 1; attempt <= 2; attempt++) {
        try {
            const res = await fetch("http://localhost:8000/clientes/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ refresh_token: refresh })
            });

            if (!res.ok) {
                return { success: false, status: res.status };
            }

            const data = await res.json();
            localStorage.setItem("token", data.access_token);
            return { success: true, token: data.access_token };
        } catch (err) {
            console.warn(`renovarAccessToken: tentativa ${attempt} falhou`, err);
            if (attempt === 2) {
                return { success: false, reason: "network_error" };
            }
            await new Promise(r => setTimeout(r, 300));
        }
    }
}

export async function verificar_token_cliente(navigate) {
    let token = localStorage.getItem("token");

    if (!token) {
        navigate("/login");
        return null;
    }

    try {
        let res = await fetch("http://localhost:8000/clientes/tracking/status", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.status === 401) {
            const renov = await renovarAccessToken();

            if (!renov.success) {
                if (renov.reason === "no_refresh") {
                    localStorage.removeItem("token");
                    localStorage.removeItem("refresh_token");
                    navigate("/login");
                    return null;
                }
                if (renov.status === 401) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("refresh_token");
                    navigate("/login");
                    return null;
                }
                console.warn("Renovação falhou, mantendo refresh_token (erro):", renov);
                navigate("/login");
                return null;
            }
            res = await fetch("http://localhost:8000/clientes/tracking/status", {
                headers: { "Authorization": `Bearer ${renov.token}` }
            });
        }

        if (!res.ok) {
            navigate("/login");
            return null;
        }

        const data = await res.json();
        return data.user;
    } catch (err) {
        console.error("Erro ao verificar token:", err);
        navigate("/login");
        return null;
    }
}


// ======================================================================================
// LOGIN LOJISTA
// ======================================================================================
export async function renovarAccessTokenLojista() {
    const refresh = localStorage.getItem("refresh_token_loja");

    if (!refresh) return { success: false, reason: "no_refresh" };

    for (let attempt = 1; attempt <= 2; attempt++) {
        try {
            const res = await fetch("http://localhost:8000/lojas/refresh", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ refresh_token: refresh })
            });

            if (!res.ok) {
                return { success: false, status: res.status };
            }

            const data = await res.json();
            localStorage.setItem("token_loja", data.access_token);
            return { success: true, token: data.access_token };
        } catch (err) {
            console.warn(`renovarAccessToken: tentativa ${attempt} falhou`, err);
            if (attempt === 2) {
                return { success: false, reason: "network_error" };
            }
            await new Promise(r => setTimeout(r, 300));
        }
    }
}

export async function verificar_token_loja(navigate) {
    let token = localStorage.getItem("token_loja");

    if (!token) {
        navigate("/login");
        return null;
    }

    try {
        let res = await fetch("http://localhost:8000/lojas/tracking/status", {
            headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.status === 401) {
            const renov = await renovarAccessToken();

            if (!renov.success) {
                if (renov.reason === "no_refresh") {
                    localStorage.removeItem("token_loja");
                    localStorage.removeItem("refresh_token_loja");
                    navigate("/login");
                    return null;
                }
                if (renov.status === 401) {
                    localStorage.removeItem("token_loja");
                    localStorage.removeItem("refresh_token_loja");
                    navigate("/login");
                    return null;
                }
                console.warn("Renovação falhou, mantendo refresh_token (erro):", renov);
                navigate("/login");
                return null;
            }
            res = await fetch("http://localhost:8000/lojas/tracking/status", {
                headers: { "Authorization": `Bearer ${renov.token}` }
            });
        }

        if (!res.ok) {
            navigate("/login");
            return null;
        }

        const data = await res.json();
        return data.user;
    } catch (err) {
        console.error("Erro ao verificar token:", err);
        navigate("/login");
        return null;
    }
}
// ======================================================================================
// POST CLIENTE
// ======================================================================================
export async function postcliente(cliente) {
    const res = await fetch("http://localhost:8000/clientes", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(cliente)
            });

            if (!res.ok) {
                const data = await res.json();
                return { success: false, status: data.detail };
            }

            const data = await res.json();
            return { success: true, cliente: data.cliente };
}

// ======================================================================================
// POST LOJA
// ======================================================================================
export async function postloja(loja) {
    const res = await fetch("http://localhost:8000/lojas", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(loja)
            });

            if (!res.ok) {
                const data = await res.json();
                return { success: false, status: data.detail };
            }

            const data = await res.json();
            return { success: true, loja: data.loja };}

// ======================================================================================
// GET CATEGORIAS
// ======================================================================================
export async function getcategorias() {
    const res = await fetch("http://localhost:8000/categorias");

            if (!res.ok) {
                const data = await res.json();
                return { success: false, status: data.detail };
            }

            const data = await res.json();
            return { success: true, categorias: data };}

// ======================================================================================
// GET PRODUTOS
// ======================================================================================
export async function getprodutos() {
    const res = await fetch("http://localhost:8000/produtos");

            if (!res.ok) {
                const data = await res.json();
                return { success: false, status: data.detail };
            }

            const data = await res.json();
            return { success: true, produtos: data };}

// ======================================================================================
// GET PRODUTO
// ======================================================================================
export async function getproduto(pro_id) {
    const res = await fetch(`http://localhost:8000/produtos?pro_id=${pro_id}`)

            if (!res.ok) {
                const data = await res.json();
                return { success: false, status: data.detail };
            }

            const data = await res.json();
            return { success: true, produto: data[0] };}

// ======================================================================================
// POST FAVORITO
// ======================================================================================
export async function postfavorito(produto_id, cliente_id) {
    const res = await fetch("http://localhost:8000/favoritos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({produto_id: produto_id, cliente_id: cliente_id})
            });

            if (!res.ok) {
                const data = await res.json();
                return { success: false, status: data.detail };
            }

            const data = await res.json();
            return { success: true, favorito: data.Favorito };}

// ======================================================================================
// DELETE FAVORITO
// ======================================================================================
export async function deletefavorito(fav_id) {
    const res = await fetch(`http://localhost:8000/favoritos/${fav_id}`, {
                method: "DELETE",
                
            });
            if (!res.ok) {
                const data = await res.json();
                return { success: false, status: data.detail };
            }
            return { success: true };}

// ======================================================================================
// POST Carrinho
// ======================================================================================
export async function postcarrinho(produto_id, cliente_id, presente_para, qnt_produto) {
    
    const body =  {"produto_id": produto_id,"cliente_id": cliente_id} ;

    if (presente_para) {
        body.presente_para = presente_para;
    }
    if (qnt_produto) {
        body.qnt_produto = qnt_produto;
    }
    
    const res = await fetch(`http://localhost:8000/carrinhos`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    if (!res.ok) {
        const data = await res.json();
        return { success: false, status: data.detail };
    }

    const data = await res.json();
    return { success: true, carrinho: data.carrinho };
}

// ======================================================================================
// PUT CLIENTE
// ======================================================================================
export async function putcliente(cliente, cli_senha_nova) {
    const body =  {} ;

    if (cliente.nome) {
        body.cli_nome = cliente.nome;
    }
    if (cliente.email) {
        body.cli_email = cliente.email;
    }
    if (cli_senha_nova) {
        body.cli_senha_antiga = cliente.senha;
        body.cli_senha = cli_senha_nova
    }
    const res = await fetch(`http://localhost:8000/clientes/${cliente.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            if (!res.ok) {
                const data = await res.json();
                return { success: false, status: data.detail };
            }

            const data = await res.json();
            return { success: true, cliente: data.cliente };
}

// ======================================================================================
// POST ENDEREÇO
// ======================================================================================
export async function postendereco(endereco) {
    const res = await fetch("http://localhost:8000/enderecos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(endereco)
            });

            if (!res.ok) {
                const data = await res.json();
                return { success: false, status: data.detail };
            }

            const data = await res.json();
            return { success: true, endereco: data.Endereco };
}

// ======================================================================================
// PUT ENDEREÇO
// ======================================================================================
export async function putendereco(endereco) {
    const res = await fetch(`http://localhost:8000/enderecos/${endereco.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(endereco)
            });

            if (!res.ok) {
                const data = await res.json();
                return { success: false, status: data.detail };
            }

            const data = await res.json();
            return { success: true, endereco: data.Endereco };
}

// ======================================================================================
// DELETE ENDEREÇO
// ======================================================================================
export async function deleteendereco(endereco_id) {
    const res = await fetch(`http://localhost:8000/enderecos/${endereco_id}`, {
                method: "DELETE",
                
            });
            if (!res.ok) {
                const data = await res.json();
                return { success: false, status: data.detail };
            }
            return { success: true };}