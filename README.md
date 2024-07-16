# Boilerplate CRUD DynamoDB

Boilerplate para criação de aplicações CRUD usando Amazon DynamoDB, incluindo funções Lambda, API Gateway e infraestrutura como código com AWS CDK.

## Características

- **Operações CRUD Completas**: Implementação completa das operações de criação, leitura, atualização e exclusão com DynamoDB.
- **AWS SDK**: Utilização do AWS SDK para integração com DynamoDB.
- **Funções Lambda**: Uso de AWS Lambda para lógica de backend serverless.
- **API Gateway**: Configuração do API Gateway para expor as funções Lambda como endpoints HTTP.
- **Infraestrutura como Código (IaC)**: Definição da infraestrutura AWS usando AWS Cloud Development Kit (CDK).
- **Boas Práticas**: Estrutura de código organizada e modular para facilitar a manutenção e a escalabilidade.

## Requisitos

- Node.js
- AWS CLI configurado
- AWS CDK instalado
- Conta AWS configurada

## Instalação

1. Clone o repositório:
    ```sh
    git clone https://github.com/seu-usuario/boilerplate-crud-dynamodb.git
    cd boilerplate-crud-dynamodb
    ```

2. Instale as dependências:
    ```sh
    npm install
    ```

## Uso

### Desenvolvimento Local

Para iniciar o servidor localmente:
```sh
npm run start
```

### Deploy para AWS

Para fazer o deploy da aplicação na AWS:
```sh
cdk deploy
```

## Estrutura do Projeto

- **/src**: Código fonte da aplicação.
- **/cdk**: Definições da infraestrutura com AWS CDK.
- **/scripts**: Scripts auxiliares para operações comuns.

## Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença

Este projeto está licenciado sob a licença MIT. Consulte o arquivo [LICENSE](./LICENSE) para obter mais informações.

---
