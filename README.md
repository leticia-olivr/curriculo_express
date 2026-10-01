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

## PostgreSQL no Neon

No painel do Neon, abra o projeto e use **Connect** para copiar a connection
string PostgreSQL. Cole a string completa no valor de `DATABASE_URL` do arquivo
`.env` (não no `.env.example`). Mantenha os parâmetros de conexão e SSL
fornecidos pelo Neon. O arquivo `.env` é ignorado pelo Git; não publique essa
string.

Ao iniciar a API com `npm run dev` ou `npm start`, o servidor executa `SELECT 1`
para testar a conexão. Uma conexão bem-sucedida exibe `Conexão com PostgreSQL
estabelecida.` no terminal. Se `DATABASE_URL` estiver vazia ou inválida, o
terminal informa que a variável não está configurada ou exibe o erro de conexão.