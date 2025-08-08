# **Requisitos Funcionais e Não Funcionais**

## **REQUISITOS FUNCIONAIS**

### **1\. AutoCadastro**

**Perfis:**

* Usuário Padrão  
  **Fluxo do Cliente:**  
* O sistema deve impedir o cadastro de CPFs inválidos ou inexistentes.  
* Não será permitido mais de um cadastro vinculado ao mesmo CPF.  
* Dados inválidos deverão ser rejeitados no processo de cadastro.  
  **Fluxo do Lojista:**  
* O sistema deve impedir o cadastro de CNPJs inválidos ou inexistentes.  
* Não será permitido mais de um cadastro vinculado ao mesmo CNPJ.  
* Dados inválidos deverão ser rejeitados no processo de cadastro.

  ### **2\. Loja**

  **Perfis:**  
* Cliente  
* Lojista  
  **Fluxo de Cadastro de Produtos (Lojista):**  
* O sistema deve permitir o envio de imagens associadas aos produtos no momento do cadastro.  
  **Fluxo de Edição de Produtos (Lojista):**  
* O lojista poderá editar nome, descrição, preço, imagens e quantidade em estoque dos produtos cadastrados.  
* Todas as alterações devem passar por validação antes de serem aplicadas.  
* Deve haver uma confirmação antes da finalização das alterações.  
  **Fluxo de Exclusão de Produtos (Lojista):**  
* O sistema deve solicitar uma confirmação do lojista antes da exclusão definitiva do produto.  
* Produtos com pedidos em andamento não poderão ser excluídos.  
  **Fluxo de Atendimento ao Cliente (SAC) – Cliente e Lojista:**  
* Deve haver um canal de comunicação direta entre cliente e lojista dentro da plataforma, permitindo o envio e recebimento de mensagens relacionadas aos produtos e pedidos.

  ### **3\. Estoque**

  **Perfis:**  
* Lojista  
  **Fluxo de Controle de Estoque:**  
* O sistema deve permitir ao lojista ajustar a quantidade de itens em estoque manualmente.  
* As atualizações devem ser registradas com data e hora da modificação.  
  **Fluxo de Monitoramento de Estoque:**  
* O sistema deve emitir alertas quando o estoque de um produto atingir níveis críticos.  
* Deve ser possível visualizar relatórios de entrada e saída de produtos por período.

  ### **4\. Página Inicial (Home)**

  **Perfis:**  
* Usuário Padrão  
* Cliente  
* Lojista  
  **Fluxo da Home (Usuário não autenticado):**  
* Produtos que estejam sem estoque não deverão ser exibidos na listagem inicial.  
  **Fluxo da Home (Cliente):**  
* Exibir um feed de produtos personalizados com base nos acessos e preferências do usuário.  
* Permitir favoritar produtos e categorias.  
* Exibir comentários e avaliações de outros usuários sobre os produtos.  
* Implementar sistema de busca por nome e categoria de produto.  
* Permitir aplicação de filtros como preço, marca, lojista, entre outros.  
* Permitir que o cliente comente e avalie produtos adquiridos.  
* Permitir que o cliente remova seus próprios comentários.  
* Permitir adicionar produtos ao carrinho diretamente da interface da home.

  **Fluxo da Home (Lojista):**

* O sistema deverá exibir estatísticas de visualizações e vendas dos produtos cadastrados.  
* Deverá permitir o acesso rápido às funcionalidades de edição, exclusão e atualização de estoque dos produtos.

  ### **5\. Carrinho de Compras**

  **Perfis:**  
* Cliente  
  **Fluxo do Carrinho:**  
* Deve permitir adicionar e remover produtos do carrinho.  
* O sistema deve impedir a finalização da compra sem que haja ao menos um item no carrinho.

  ### **6\. Pagamento**

  **Perfis:**

* Cliente  
  **Fluxo de Pagamento:**  
* O sistema deve permitir ao cliente selecionar entre diferentes métodos de pagamento, tais como Pix, cartão de crédito, cartão de débito ou boleto bancário.  
* A finalização da compra só será possível mediante a seleção de uma forma de pagamento válida.  
* O valor final da compra, incluindo descontos ou acréscimos, deverá ser exibido de forma clara antes da conclusão do pedido.

  ## 

  ## **REQUISITOS NÃO FUNCIONAIS**

* A interface do sistema deve ser visualmente atrativa, visando a permanência prolongada do usuário.  
* Deve haver segurança reforçada no processo de compra, com validação em todas as etapas críticas.  
* O desempenho do sistema deve permitir uma navegação fluida, sem atrasos perceptíveis.  
* As senhas dos usuários devem ser protegidas por meio de criptografia segura.  
* A interface deve ser intuitiva e acessível, inclusive para usuários sem conhecimentos técnicos.  
* O sistema deve ser compatível com os principais navegadores modernos (Chrome, Firefox, Edge, Safari).  
* A funcionalidade de busca deve retornar resultados em até 1 minuto em condições normais..  
* As informações de pagamento, especialmente os dados do cartão, devem ser criptografadas.  
* Ações como remoções e confirmações de compra devem ser acompanhadas de alertas de confirmação.  
  