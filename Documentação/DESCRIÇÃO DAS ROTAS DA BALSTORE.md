# **DESCRIÇÃO DAS ROTAS DA BALSTORE**

- get(“/cliente”): Faz Login de um Cliente  
- post(“/cliente”): Faz Cadastro de um Cliente  
- put(“/cliente”): Atualiza dados de um Cliente  
- delete(“/cliente”): Deleta um Cliente

- get(“/loja”): Faz Login de uma Loja  
- post(“/loja”): Faz Cadastro de uma Loja  
- put(“/loja”): Atualiza dados de uma Loja  
- delete(“/loja”): Deleta uma Loja

- get(“/loja/{produto\_id}”): Retorna um Produto de uma Loja  
- post(“/loja/cadastro\_produto”): Cadastra um Produto em uma Loja  
- put(“/loja/{produto\_id}”): Atualiza dados de um Produto  
- delete(“/loja/{produto\_id}”): Deleta um Produto

- get(“/carrinho/{cliente\_id}”): Retorna os Produtos no Carrinho de um Cliente  
- delete(“/carrinho/{cliente\_id”): Deleta um Produto do Carrinho de um Cliente  
- post(“/carrinho/{cliente\_id”): Coloca um Produto no Carrinho de um Cliente

- post(“/amigo/{cliente\_id}”): Cadastra um Amigo a um Cliente  
- get(“/amigo/{cliente\_id}”): Retorna todos os Amigos de um Cliente  
- delete(“/amigo/{cliente\_id}”): Deleta um Amigo de um Cliente  
    
- get(“/comentario/{produto\_id}”): Retorna Comentarios de um Produto  
- post(“/loja/cadastro\_produto”): Cadastra um Comentário em um Produto  
- put(“/loja/{produto\_id}”): Atualiza um Comentário de um Produto  
- delete(“/loja/{produto\_id}”): Deleta um Comentário

- get(“/favorito/{cliente\_id}”): Retorna os favoritos de um Cliente  
- post(“/favorito/{cliente\_id}”): Adiciona um Produto aos favoritos de um Cliente  
- delete(“/favorito/{cliente\_id}”): Deleta um Produto dos favoritos de um Cliente