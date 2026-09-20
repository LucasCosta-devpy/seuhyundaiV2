# Rumo Mais Uma Rota — site + painel admin

Projeto reestruturado do zero. Duas páginas:

- **`/`** — página pública (a "vitrine" que você manda pro cliente/lead).
- **`/admin`** — login do painel. Depois de logar vai para `/admin/painel`, onde dá pra editar todo texto e trocar todas as imagens do site.

## Como funciona por trás

- **Frontend:** React + Vite + Tailwind (SPA), em `src/`.
- **Netlify Functions** (`netlify/functions/`): API que o painel usa pra logar, ler/gravar o conteúdo e subir imagens.
- **Netlify DB (Postgres/Neon):** guarda o conteúdo do site (textos, preços, etc) em uma tabela `site_content`.
- **Netlify Blobs:** guarda as imagens (logo, fotos dos destinos, foto da consultora).

Nenhuma imagem/texto fica "hardcoded" — tudo que aparece na página pública vem do banco, editável pelo `/admin`.

---

## Passo a passo para configurar no Netlify

### 1. Deploy do projeto

Se o site já está conectado ao GitHub no Netlify (como na captura que você mandou), basta dar `git push` — o Netlify já vai buildar com o `netlify.toml` que está na raiz do projeto (ele já configura build, functions e redirects, não precisa mexer em nada no painel do Netlify pra isso).

### 2. Ativar o Netlify DB (Postgres/Neon)

1. No painel do site no Netlify, vá em **Data & storage → Netlify Database** (aparece no menu lateral da sua captura de tela).
2. Clique em **Enable/Create database** (ou **Connect**). O Netlify provisiona um banco Postgres (Neon) pra esse site automaticamente.
3. Isso cria sozinho a variável de ambiente `NETLIFY_DATABASE_URL` (às vezes `NETLIFY_DATABASE_URL_UNPOOLED` também) nas **Environment variables** do site — não precisa copiar/colar nada manualmente.
4. Pronto. A função `content.js` cria a tabela `site_content` sozinha na primeira chamada (não precisa rodar migration).

> Se preferir pelo terminal: com o [Netlify CLI](https://docs.netlify.com/cli/get-started/) instalado e o projeto linkado (`netlify link`), rode `netlify db init` dentro da pasta do projeto.

### 3. Ativar o Netlify Blobs

Não precisa ativar nada manualmente — **Netlify Blobs já funciona automaticamente** para qualquer site hospedado no Netlify, sem configuração extra. As funções `upload.js` e `image.js` já usam `getStore()` sem precisar de token, porque isso só funciona quando a função roda dentro do Netlify.

### 4. Configurar as variáveis de ambiente da senha do admin

Vá em **Project configuration → Environment variables** e adicione:

| Variável | Valor | Para que serve |
|---|---|---|
| `ADMIN_PASSWORD` | uma senha forte, ex: `RumoRota2026!` | senha para entrar em `/admin` |
| `AUTH_SECRET` | uma string aleatória longa (ex: gere em https://generate-secret.vercel.app/32) | usada pra assinar o "token" de login, mantém a sessão do admin |

Depois de adicionar, faça um **novo deploy** (Deploys → Trigger deploy) pra elas entrarem em vigor.

### 5. Testar

1. Acesse `https://SEU-SITE.netlify.app/admin`, entre com a `ADMIN_PASSWORD`.
2. Edite os textos, troque logo/fotos, ajuste o WhatsApp e o preço.
3. Clique em **Salvar alterações**.
4. Acesse `https://SEU-SITE.netlify.app/` pra ver a página pública atualizada.

### 6. Domínio

Quando for atualizar o domínio próprio (ex: `rumomaisumarota.com.br`), configure em **Domain management** no painel do Netlify — não precisa mexer em nada no código.

---

## Rodar localmente (opcional, pra mexer no código)

```bash
npm install
npx netlify-cli dev
```

O `netlify dev` sobe o site + as functions juntos (o simples `npm run dev` do Vite sobe só o front, sem as APIs).
Pra ter banco/blobs funcionando localmente, rode `netlify link` primeiro (linkando com o site já criado no Netlify) — assim ele usa o mesmo banco/blobs de produção.
