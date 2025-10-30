# **DESCRIÇÃO DAS ROTAS DA BALSTORE**

- get(“/cliente”): Busca ou Faz Login de um Cliente  
- post(“/cliente”): Faz Cadastro de um Cliente  
- put(“/cliente/{cli_id}”): Atualiza dados de um Cliente  
- delete(“/cliente/{cli_id}”): Deleta um Cliente

- get(“/loja”): Busca ou Faz Login de uma Loja  
- post(“/loja”): Faz Cadastro de uma Loja  
- put(“/loja”): Atualiza dados de uma Loja  
- delete(“/loja”): Deleta uma Loja

- get(“/produto”): Retorna de diferentes modos, os produtos, baseado no tanto de parâmetro passados  
- post(“/produto”): Cadastra um Produto  
- put(“/produto/{pro_id}”): Atualiza dados de um Produto  
- delete(“/produto/{pro_id}”): Deleta um Produto

- get(“/carrinho/{cli_id}”): Retorna os Produtos no Carrinho de um Cliente  
- delete(“/carrinho/{car_id}”): Deleta um Produto do Carrinho   
- post(“/carrinho”): Coloca um Produto no Carrinho de um Cliente  
- put(“/carrinho/{car_id}”): Atualiza a quantidade de um Produto no Carrinho

- post(“/amigo/{cli_id}”): Cadastra um Amigo a um Cliente e vice-versa  
- get(“/amigo/{cli_id}”): Retorna todos os Amigos de um Cliente  
- delete(“/amigo/{cli_id}”): Deleta um Amigo de um Cliente  
- put(“/amigo/{cli_id}”): Atualiza o status de uma solicitação de Amizade

- post(“/endereco”): Cadastra um Endereço a uma Loja ou Cliente  
- get(“/endereco”): Pega os Endereços de uma Loja ou Cliente  
- put(“/endereco/{end_id}”): Atualiza um Endereço de uma Loja ou Cliente  
- delete(“/endereco/{end_id}”): Deleta um Endereço de uma Loja ou Cliente  
    
- get(“/favorito/{cli_id}”): Retorna os favoritos de um Cliente  
- post(“/favorito/{cli_id}”): Adiciona um Produto aos favoritos de um Cliente  
- delete(“/favorito/{fav_id}”): Deleta um Produto dos favoritos de um Cliente

- get(“/comentario/{pro_id}”): Retorna Comentarios de um Produto ou de Um Cliente naquele produto  
- post(“/comentario/{pro_id}”): Cadastra um Comentário em um Produto  
- put(“/comentario/{pro_id}”): Atualiza um Comentário de um Produto  
- delete(“/comentario”): Deleta um Comentário

- get(“/compras/{cli_id}”): Retorna Compras de um Cliente 
- post(“/compras/{cli_id}”): Cadastra uma Compra de um Cliente 
- put(“/compras/{com_id}”): Atualiza uma Compra de um Cliente

- get(“/notificacoes/{loj_id}”): Retorna Notificações de uma Loja 
- post(“/notificacoes/{loj_id}”): Cadastra uma Notificação em uma Loja  
- put(“/notificacoes/{not_id}”): Atualiza uma Notificação de uma Loja
- delete(“/notificacoes/{not_id}”): Deleta uma Notificação de uma Loja
 
