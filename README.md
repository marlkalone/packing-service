# Packing Service

Este projeto foi criado como parte de um teste técnico e consiste em um microserviço de empacotamento de pedidos. Ele permite:
- Receber um conjunto de pedidos
- Calcular a forma mais adequada de empacotar os pedidos em caixas baseado em suas dimensões e volumes, utilizando a menor quantidade possível de caixas
- Retornar os pedidos devidamente empacotados

Em linhas gerais, o packing service possui uma funcionalidade crucial para plataformas de e-commerce: a lógica de empacotamento

A aplicação foi desenvolvida com **NestJS** e disponibilizada com Docker para facilitar a execução.

---

# Índice

1. [Requisitos de Ambiente](#📋-requisitos-de-ambiente)  
2. [Instruções para Execução](#🔧-instruções-para-execução)  
   1. [Execução via Docker Compose](#execução-via-docker-compose)  
   2. [Rodando Testes](#⚙️-rodando-testes)  
3. [Estrutura de Pastas](#📦-estrutura-de-pastas)  
4. [Descrição das Rotas da API](#descrição-das-rotas-da-api)  
   1. [Documentação](#documentação)
5. [Gerenciamento de Respostas (Formato Padrão)](#gerenciamento-de-respostas-formato-padrão)   
6. [Escolhas Técnicas](#🛠️-escolhas-técnicas)   
   1. [Lógica de Negócio: Algoritmo de Empacotamento (Best-Fit Decreasing)](#1-lógica-de-negócio-algoritmo-de-empacotamento-best-fit-decreasing)  
   2. [Docker](#2-docker)  
   3. [Documentação da API: OpenAPI (Swagger) com Scalar](#3-documentação-da-api-openapi-swagger-com-scalar)  
   4. [Estrutura de Projeto](#4-estrutura-de-projeto)
7. [Autenticação e segurança](#🔐-autenticação-e-segurança)

---

# 📋 Requisitos de Ambiente

- **Docker** e **docker-compose**
- **Postman** (caso queira utilizar para a testagem das rotas)

---

# 🔧 Instruções para Execução

## `Execução via Docker Compose`

### Evite dar npm install ao utilizar o Docker para evitar possíveis problemas.

  ### **1**. Clone o repositório:
  ```bash
  https://github.com/marlkalone/packing-service.git
  ```

  ### **2**. Instale Docker e docker-compose em sua máquina (caso ainda não tenha).

  ### **3**. No diretório do projeto, rode:
  ```bash
  docker compose up --build
  ```

  Isso fará o build da imagem da API (usando o Dockerfile presente) do banco de dados, em seguida subirá dois contêiners:
  - packing_api (nossa aplicação NestJS)
  - packing_db (instância do postgres) 
  ### **4**. Para parar a execução:
  ```bash
  docker compose stop
  ```

A API estará acessível, por padrão, em http://localhost:3000.

---

## ⚙️ Rodando Testes
Para rodar todos os testes unitários no container da aplicação, use:

```bash
docker compose exec api npm run test
```
Você também pode rodar um teste específico passando o caminho:

```bash
docker compose exec api npm run test packing.service.spec.ts
```
Para rodar o teste e2e:

```bash
docker compose exec api npm run test:e2e
```

Para verificar a cobertura dos testes rode o comando:

```bash
docker compose exec api npm run test:cov
```

---

## 📦 Estrutura de Pastas

```
├── dist
├── node_modules
├── public
│   └── logo-l2code.svg
├── src
│   ├── core
│   │   ├── auth
│   │   │   ├── guard
|   |   |   |   └── apiKey.guard.ts
│   │   │   ├── test
|   |   |   |   └── auth.service.spec.ts
│   │   │   ├── auth.module.ts
│   │   │   └── auth.service.ts
│   │   ├── packing
│   │   │   ├── constants
|   |   |   |   └── packing.constants.ts
│   │   │   ├── dto
│   │   │   │   ├── request
|   |   |   |   |   ├── order.dto.ts
|   |   |   |   |   ├── packing-request.dto.ts
|   |   |   |   |   ├── packing-dimension.dto.ts
|   |   |   |   |   └── product.dto.ts
|   |   |   |   └── response
|   |   |   |      └── packing-response.dto.ts
│   │   │   ├── interfaces
|   |   |   |   └── packing.interfaces.ts
│   │   │   ├── test
│   │   │   │   ├── packing.controller.spec.ts
|   |   |   |   └── packing.service.spec.ts
│   │   │   ├── packing.controller.ts
│   │   │   ├── packing.module.ts
│   │   │   └── packing.service.ts
│   ├── health
│   │   ├── dto
│   │   |   └── health-response.dto.ts
│   │   ├── health.controller.spec.ts
│   │   └── health.controller.ts
│   ├── utils
│   │   ├── api-response.dto.ts
│   │   ├── cssDocs.ts
│   │   └── response.interceptor.ts
│   ├── app.module.ts
│   └── main.ts
├── test
│   ├── app.e2e-spec.ts
│   └── jest-e2e.json
├── .dockerignore
├── .env
├── .eslintrc.js
├── .gitignore
├── .prettierrc
├── docker-compose.yml
├── Dockerfile
├── nest-cli.json
├── package-lock.json
├── package.json
├── README.md
├── tsconfig.build.json
└── tsconfig.json
```

---

## **Descrição das rotas da API**

## Documentação

A documentação interativa completa está disponível via Swagger/Scalar após a inicialização da aplicação.

URL da Documentação: http://localhost:3000/docs

Nela será possível:
- Visualizar todos os endpoints
- Testar cada rota diretamente
- Ver esquemas e exemplos de request/response


Importante: Todas as respostas de sucesso da API seguem um formato padrão para garantir consistência, fornecido por um interceptor global. O payload de dados específico de cada rota estará sempre dentro da propriedade data.

### **`GET /`**
#### **Descrição: Verifica a saúde da aplicação. É um endpoint público para monitoramento.**

Exemplo de Requisição cURL (Linux/macOS)
```bash
curl -X GET http://localhost:3000
```
**Exemplo de Resposta:**
```json
{
  "message": "Operação realizada com sucesso.",
  "statusCode": 200,
  "data": {
    "status": "alive"
  }
}
```

### **`POST /packing/calculate`**
Descrição: Endpoint **protegido**. Calcula o empacotamento para uma lista de pedidos. Requer uma API Key válida no cabeçalho X-API-Key

Exemplo de Requisição cURL (Linux/macOS):
```bash
curl -X POST http://localhost:3000/packing/calculate \
-H "Content-Type: application/json" \
-H "X-API-Key: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855" \
-d '{
  "pedidos": [
    {
      "pedido_id": 1,
      "produtos": [
        {
          "produto_id": "PS5",
          "dimensoes": { "altura": 40, "largura": 10, "comprimento": 25 }
        },
        {
          "produto_id": "Volante", 
          "dimensoes": {"altura": 40, "largura": 30, "comprimento": 30}
        }
      ]
    }
  ]
}'
```

Cabeçalho da Requisição:
```bash
X-API-Key: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
```

Body:
```json
{
  "pedidos": [
    {
      "pedido_id": 1,
      "produtos": [
        {
          "produto_id": "PS5",
          "dimensoes": { "altura": 40, "largura": 10, "comprimento": 25 }
        },
        {
          "produto_id": "Volante", 
          "dimensoes": {"altura": 40, "largura": 30, "comprimento": 30}
        }
      ]
    }
  ]
}
```

**Exemplo de Resposta:**
```json
{
  "message": "Operação realizada com sucesso.",
  "statusCode": 200,
  "data": {
    "pedidos": [
      {
        "pedido_id": 1,
        "caixas": [
          {
            "caixa_id": "Caixa 2",
            "produtos": ["PS5, Volante"]
          }
        ]
      }
    ]
  }
}
```

## **Gerenciamento de Respostas (Formato Padrão)**
Para manter a consistência e facilitar o consumo da API por clientes (como um front-end), foi implementado um interceptor global (ResponseInterceptor). Ele garante que todas as respostas da aplicação, tanto de sucesso quanto de erro, sigam uma estrutura JSON previsível.

Essa abordagem elimina surpresas para quem consome a API e deixa claro onde o payload de dados (data) sempre estará.

### Formato padrão de sucesso:

```json

{
  "message": "Mensagem descritiva sobre o resultado da operação.",
  "statusCode": 200,
  "data": {}
}
```
- **message**: Mensagem descritiva sobre o resultado da operação.
- **statusCode**: O código de status HTTP da resposta.
- **data**: O corpo da resposta (payload) retornado pelo endpoint.

### Formato Padrão de Erro:

Exemplo (Erro de validação):

```json
{
  "message": [
      "pedidos must be an array"
  ],
  "statusCode": 400,
  "data": null
}
```

## 🛠️ **Escolhas Técnicas**
### 1. **Lógica de Negócio: Algoritmo de Empacotamento (Best-Fit Decreasing)**
 O coração do desafio é resolver o "Problema de Empacotamento de Caixas" (Bin Packing Problem), que é um problema de otimização combinatória notoriamente complexo (NP-difícil). Uma solução matematicamente perfeita seria computacionalmente inviável para uma API em tempo real.

Por isso, optei por uma abordagem heurística, que busca uma solução ótima de forma eficiente. A estratégia implementada é a Best-Fit Decreasing (BFD):

Decreasing (Decrescente): Primeiro, todos os produtos de um pedido são ordenados por volume, do maior para o menor. Essa etapa é crucial, pois alocar os itens maiores e mais "difíceis" primeiro aumenta drasticamente a chance de que os itens menores restantes possam ser encaixados nos espaços que sobram.

Best-Fit (Melhor Encaixe): Para cada produto, o algoritmo busca a caixa (seja uma já em uso ou uma nova) que o comporte com o menor desperdício de espaço possível. Isso é feito calculando o volume que sobraria em cada opção válida e escolhendo aquela que minimiza essa sobra.

Essa abordagem tende a produzir resultados altamente otimizados, cumprindo o requisito de minimizar o número de caixas de forma consistente.

Limitação Conhecida: É importante notar que a verificação de encaixe é baseada em volume e dimensões individuais (considerando rotações), e não em um cálculo espacial 3D complexo. Esta é uma aproximação prática e performática adequada ao contexto do desafio.

### 2. **Docker**
Para garantir que a aplicação rode de forma consistente em qualquer ambiente, todo o projeto foi containerizado usando Docker e Docker Compose. Isso inclui a API e o banco de dados PostgreSQL. Para o avaliador, isso significa que basta um único comando (docker compose up --build) para ter todo o ambiente configurado e funcionando, eliminando a necessidade de instalar dependências manualmente.

### 3. **Documentação da API: OpenAPI (Swagger) com Scalar**
A documentação é um pilar de qualquer boa API. Utilizei o módulo @nestjs/swagger para gerar automaticamente uma especificação OpenAPI (Swagger) a partir dos decoradores no código. Para a visualização, escolhi o Scalar, uma interface de usuário moderna e limpa que renderiza a especificação de forma interativa, permitindo que qualquer pessoa teste os endpoints diretamente pelo navegador.

### 4. **Estrutura de Projeto**
Dividi o código em módulos de negócio (auth, packing) dentro do diretório src/core. Cada módulo contém seus próprios controllers, services, DTOs e testes, mantendo as responsabilidades bem definidas e isoladas. O diretório src/utils abriga funcionalidades globais e reutilizáveis, como o ResponseInterceptor, que padroniza todas as respostas da API para garantir consistência.


## 🔐 Autenticação e Segurança

A segurança da API é garantida por um sistema de chave de **API KEY**, uma abordagem robusta e comum para a comunicação segura entre servidores, que é o propósito deste microserviço.

---

### 🔓 Rotas Públicas vs. Protegidas

- **Públicas**:
  - `GET /` → Verificação de saúde da aplicação

- **Protegidas**:
  - `POST /packing/calculate` → Endpoint de negócio principal que realiza o cálculo de empacotamento. Requer uma API Key válida para ser acessado.

---

### 🔄 Fluxo de Autenticação

1. O fluxo é simplificado para comunicação entre servidores e não envolve o conceito de "usuários" ou "sessões":
2. A API possui uma única chave secreta pré-configurada (STATIC_API_KEY) através de variáveis de ambiente, que funciona como a "senha mestre" do serviço.
3. Para acessar rotas protegidas, o cliente deve incluir esta chave no cabeçalho HTTP X-API-Key em cada requisição.
4. Se as chaves corresponderem, o acesso é liberado. Caso contrário, a API retorna imediatamente um erro 401 Unauthorized.