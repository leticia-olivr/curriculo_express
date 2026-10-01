# Curriculo Express

Estrutura inicial de uma API REST em Node.js, Express.js e JavaScript. A
integração futura com PostgreSQL/NeonDB ainda não foi configurada.

## Requisitos

- Node.js 18 ou superior
- npm

## Instalação

Na raiz do projeto, instale as dependências:

```bash
npm install
```

Copie `.env.example` para `.env` e ajuste as variáveis conforme necessário.

## Execução

Modo de desenvolvimento, com reinicialização automática pelo nodemon:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

Por padrão, o servidor utiliza a porta `3000`. Para verificar se está
funcionando, abra `http://localhost:3000/` no navegador ou execute:

```bash
curl http://localhost:3000/
```

A resposta esperada é um JSON com a mensagem `API Curriculo Express funcionando.`.