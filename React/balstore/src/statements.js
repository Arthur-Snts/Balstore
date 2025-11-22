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
                body: JSON.stringify({ loja_cadastra: loja })
            });

            if (!res.ok) {
                return { success: false, status: res.status };
            }

            const data = await res.json();
            return { success: true, loja: data.loja };}
