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
// GET Carrinho
// ======================================================================================
export async function getcarrinho(cli_id) {
    const res = await fetch(`http://localhost:8000/carrinhos/${cli_id}`)

            if (!res.ok) {
                try {
                    const data = await res.json();
                    return { success: false, status: data.detail };
                } catch (e) {
                    return { success: false, status: 'error' };
                }
            }

            const data = await res.json();
            return { success: true, carrinho: data };
}

// ======================================================================================
// PUT Carrinho (atualiza quantidade)
// ======================================================================================
export async function putcarrinho(car_id, qnt_nova) {
    const res = await fetch(`http://localhost:8000/carrinhos/${car_id}?qnt_nova=${qnt_nova}`, {
        method: "PUT",
    });

    if (!res.ok) {
        try {
            const data = await res.json();
            return { success: false, status: data.detail };
        } catch (e) {
            return { success: false, status: 'error' };
        }
    }

    const data = await res.json();
    return { success: true, qnt_nova: data.qnt_nova };
}

// ======================================================================================
// DELETE Carrinho
// ======================================================================================
export async function deletecarrinho(car_id) {
    const res = await fetch(`http://localhost:8000/carrinhos/${car_id}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        try {
            const data = await res.json();
            return { success: false, status: data.detail };
        } catch (e) {
            return { success: false, status: 'error' };
        }
    }

    return { success: true };
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
// GET ENDEREÇO
// ======================================================================================
export async function getendereco(cli_id) {
    const res = await fetch(`http://localhost:8000/enderecos/?cli_id=${cli_id}`)

            if (!res.ok) {
                const data = await res.json();
                return { success: false, status: data.detail };
            }

            const data = await res.json();
            return { success: true, endereco: data };
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

// ======================================================================================
// GET Clientes
// ======================================================================================
export async function getclientes(nome) {
    const res = await fetch(`http://localhost:8000/clientes?cli_nome=${nome}`)

            if (!res.ok) {
                const data = await res.json();
                return { success: false, status: data.detail };
            }

            const data = await res.json();
            return { success: true, clientes: data };}

// ======================================================================================
// GET Favoritos de um Cliente
// ======================================================================================
export async function getfavoritos(cli_id) {
    const res = await fetch(`http://localhost:8000/favoritos/${cli_id}`)

            if (!res.ok) {
                const data = await res.json();
                return { success: false, status: data.detail };
            }

            const data = await res.json();
            return { success: true, favoritos: data };
}

// ======================================================================================
// GET Cliente por ID
// ======================================================================================
export async function getcliente(cli_id) {
    const res = await fetch(`http://localhost:8000/clientes?cli_id=${cli_id}`)

            if (!res.ok) {
                const data = await res.json();
                return { success: false, status: data.detail };
            }

            const data = await res.json();
            // backend pode retornar lista ou um único registro
            if (Array.isArray(data)) {
                return { success: true, cliente: data[0] || null };
            }
            return { success: true, cliente: data };
}

// ======================================================================================
// GET Amigos
// ======================================================================================
export async function getamigos(cli_id) {
    const res = await fetch(`http://localhost:8000/amigos/${cli_id}`)

            if (!res.ok) {
                const data = await res.json();
                return { success: false, status: data.detail };
            }

            const data = await res.json();
            return { success: true, amigos: data };}


// ======================================================================================
// POST Amigo
// ======================================================================================
export async function postamigo(amigo_id, cliente_id) {
    const res = await fetch("http://localhost:8000/amigos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                // amigo_de: remetente (cliente_id)
                // amigo: destinatário (amigo_id)
                body: JSON.stringify({
                    amigo_de: cliente_id,
                    amigo: amigo_id,
                    solicitacao: "Pendente"
                })
            });

            if (!res.ok) {
                const data = await res.json();
                return { success: false, status: data.detail };
            }

            const data = await res.json();
            return { success: true, amigo: data.amigo };
}

// ======================================================================================
// PUT Amigo (atualiza status)
// ======================================================================================
export async function putamigo(cli_id, status_novo, amigo_id) {
    const res = await fetch(`http://localhost:8000/amigos/${cli_id}?status_novo=${encodeURIComponent(status_novo)}&amigo_id=${amigo_id}`, {
        method: "PUT",
    });

    if (!res.ok) {
        const data = await res.json();
        return { success: false, status: data.detail };
    }

    const data = await res.json();
    return { success: true, mensagem: data.mensagem };
}

// ======================================================================================
// DELETE Amigo
// ======================================================================================
export async function deleteamigo(cli_id, amigo_exclui) {
    const res = await fetch(`http://localhost:8000/amigos/${cli_id}?amigo_exclui=${amigo_exclui}`, {
        method: "DELETE",
    });

    if (!res.ok) {
        const data = await res.json();
        return { success: false, status: data.detail };
    }

    return { success: true };
}

// ======================================================================================
// POST compra
// ======================================================================================

export async function postCompra(cli_id, valor_compra, cod_pagamento, frete, listaProdutos, end_id) {
        
        const compra = {
            valor: valor_compra,
            cod_pagamento: cod_pagamento,
            frete:frete,
            cliente_id: cli_id,
            end_id: end_id
        }
        const res = await fetch(`http://localhost:8000/compras/${cli_id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                compra_cadastra: compra,
                produtos: listaProdutos
            })
        });

        if (!res.ok) {
        const data = await res.json();
        return { success: false, status: data.detail };
        }

        const data = await res.json();
        return { success: true, compra: data.Compra };
}


// ======================================================================================
// GET compra
// ======================================================================================

export async function getCompras(cli_id) {

        const res = await fetch(`http://localhost:8000/compras/${cli_id}`)

        if (!res.ok) {
        const data = await res.json();
        return { success: false, status: data.detail };
        }

        const data = await res.json();
        return { success: true, compras: data };
}

// ======================================================================================
// POST Comentario
// ======================================================================================

export async function postComentario(conteudo, avaliacao, cli_id, pro_id) {
        
        const comentario = {
            conteudo: conteudo,
            avaliacao: avaliacao,
            cliente_id:cli_id,
            produto_id: pro_id
        }
        const res = await fetch(`http://localhost:8000/comentarios`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(comentario)
        });

        if (!res.ok) {
        const data = await res.json();
        return { success: false, status: data.detail };
        }

        const data = await res.json();
        return { success: true, comentario: data.comentario };
}