# Currículo Express

## Objetivo

API REST para cadastrar dados pessoais e profissionais e consultar o currículo completo de uma pessoa.

## Tecnologias

- Node.js 18 ou superior, Express 4 e JavaScript
- PostgreSQL no NeonDB
- `pg`, `dotenv` e `nodemon`

## Instalação e configuração

Na raiz do projeto, instale as dependências e crie o arquivo local de configuração:

```bash
npm install
cp .env.example .env
```

Configure o `.env` com a porta e a connection string PostgreSQL do Neon:

```env
PORT=3000
DATABASE_URL=postgresql://USUARIO:SENHA@HOST_DO_NEON/NOME_DO_BANCO?sslmode=require
```

No painel do Neon, abra o projeto, selecione **Connect** e copie a connection string completa. Substitua o exemplo em `.env` e mantenha os parâmetros SSL fornecidos. Não compartilhe nem versione esse arquivo; `.env` já está listado no `.gitignore`.

## Schema e dados de exemplo

Com `psql` instalado, os comandos abaixo solicitam a URL sem exibi-la enquanto é digitada. Execute-os no Bash, a partir da raiz do projeto:

```bash
read -r -s -p "Connection string do Neon: " DATABASE_URL; printf '\n'; export DATABASE_URL
psql "$DATABASE_URL" -f database/schema.sql
psql "$DATABASE_URL" -f database/seed.sql
unset DATABASE_URL
```

Execute o `schema.sql` antes do `seed.sql`. O seed cadastra duas pessoas e dados demonstrativos relacionados; execute-o uma única vez em cada banco vazio.

## Iniciar a API

```bash
npm run dev
```

Para executar sem reinicialização automática, use `npm start`. A API usa a porta `3000` por padrão, ou o valor configurado em `PORT`. Ao iniciar, testa a conexão com `SELECT 1`. A rota `GET http://localhost:3000/` verifica se o Express está respondendo.

## Endpoints

Todos os endpoints usam o prefixo `http://localhost:3000`. `PUT` recebe o objeto completo do recurso, no mesmo formato do exemplo de `POST`.

| Entidade | Endpoints |
| --- | --- |
| Pessoa | `POST /api/pessoas`, `GET /api/pessoas`, `GET /api/pessoas/:id`, `PUT /api/pessoas/:id`, `DELETE /api/pessoas/:id` |
| Formação | `POST /api/formacoes`, `GET /api/formacoes`, `GET /api/formacoes/:id`, `PUT /api/formacoes/:id`, `DELETE /api/formacoes/:id` |
| Experiência | `POST /api/experiencias`, `GET /api/experiencias`, `GET /api/experiencias/:id`, `PUT /api/experiencias/:id`, `DELETE /api/experiencias/:id` |
| Projeto | `POST /api/projetos`, `GET /api/projetos`, `GET /api/projetos/:id`, `PUT /api/projetos/:id`, `DELETE /api/projetos/:id` |
| Habilidade | `POST /api/habilidades`, `GET /api/habilidades`, `GET /api/habilidades/:id`, `PUT /api/habilidades/:id`, `DELETE /api/habilidades/:id` |
| Certificação | `POST /api/certificacoes`, `GET /api/certificacoes`, `GET /api/certificacoes/:id`, `PUT /api/certificacoes/:id`, `DELETE /api/certificacoes/:id` |
| Currículo completo | `GET /api/curriculos/:pessoaId` |

Datas devem usar `AAAA-MM-DD`. Campos opcionais podem ser enviados como `null`. `pessoa_id` deve referenciar uma pessoa existente.

## Exemplos de requisições

Para as requisições `POST` e `PUT`, use `Content-Type: application/json` e selecione **Body > raw > JSON** no Postman. Primeiro crie uma pessoa ou consulte `GET /api/pessoas` e use seu `id` nos exemplos relacionados.

**Pessoa — `POST /api/pessoas`**

```json
{
	"nome": "Ana Souza",
	"email": "ana.souza@example.com",
	"telefone": null,
	"cidade": "Recife",
	"estado": "PE",
	"resumo": "Desenvolvedora backend",
	"linkedin": null,
	"github": null
}
```

**Formação — `POST /api/formacoes`**

```json
{
	"pessoa_id": 1,
	"instituicao": "Universidade Exemplo",
	"curso": "Sistemas para Internet",
	"grau": "Tecnólogo",
	"data_inicio": "2024-02-01",
	"data_fim": null,
	"status": "em andamento",
	"descricao": null
}
```

**Experiência — `POST /api/experiencias`**

```json
{
	"pessoa_id": 1,
	"empresa": "Empresa Exemplo",
	"cargo": "Desenvolvedora Backend",
	"data_inicio": "2025-01-01",
	"data_fim": null,
	"atual": true,
	"descricao": "Desenvolvimento de APIs REST"
}
```

**Projeto — `POST /api/projetos`**

```json
{
	"pessoa_id": 1,
	"nome": "API de currículo",
	"descricao": "API para organizar informações profissionais",
	"tecnologias": ["Node.js", "PostgreSQL"],
	"url": null,
	"repositorio": "https://github.com/exemplo/curriculo",
	"data_inicio": "2025-02-01",
	"data_fim": null
}
```

**Habilidade — `POST /api/habilidades`**

```json
{
	"pessoa_id": 1,
	"nome": "JavaScript",
	"nivel": "Intermediário",
	"categoria": "Backend"
}
```

**Certificação — `POST /api/certificacoes`**

```json
{
	"pessoa_id": 1,
	"nome": "Fundamentos de PostgreSQL",
	"instituicao": "Instituto Exemplo",
	"data_conclusao": "2025-06-20",
	"validade": null,
	"url": null
}
```

**Currículo completo — `GET /api/curriculos/1`**

Retorna `pessoa`, `formacoes`, `experiencias`, `projetos`, `habilidades` e `certificacoes`. Para consultar, use o `id` de uma pessoa existente.

## Entidades e relacionamentos

- `pessoas` armazena os dados pessoais e é a entidade principal.
- `formacoes`, `experiencias_profissionais`, `projetos`, `habilidades` e `certificacoes` possuem `pessoa_id` como chave estrangeira para `pessoas.id`.
- Uma pessoa pode ter vários registros de cada entidade relacionada. Ao remover a pessoa, os registros relacionados são removidos em cascata.
- O nome da habilidade é único por pessoa.

## Estrutura do projeto

```text
database/
	schema.sql
	seed.sql
src/
	app.js
	server.js
	controllers/
	database/connection.js
	models/
	routes/
```

Controllers validam as requisições, models executam consultas PostgreSQL e routes mapeiam os endpoints.

## Testar no Postman

1. Inicie a API e crie uma requisição HTTP no Postman.
2. Use `http://localhost:3000` seguido do endpoint desejado e selecione o método indicado na tabela.
3. Para `POST` e `PUT`, envie o JSON do exemplo em **Body > raw > JSON**. Para `GET` e `DELETE`, não envie corpo.
4. Use primeiro o `POST /api/pessoas`; utilize o `id` retornado nos exemplos das demais entidades e no endpoint de currículo.