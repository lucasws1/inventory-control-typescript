# 🚀 Guia de Deploy - Inventory Control

## 📋 Pré-requisitos

### 1. Variáveis de Ambiente

Configure estas variáveis na plataforma de deploy:

```bash
# Database
DATABASE_URL="postgresql://user:password@host:port/database"

# NextAuth
AUTH_GOOGLE_ID="seu_google_client_id"
AUTH_GOOGLE_SECRET="seu_google_client_secret"
NEXTAUTH_SECRET="sua_chave_secreta_aleatoria_32_chars"
NEXTAUTH_URL="https://seudominio.com"

# Ambiente
NODE_ENV="production"
```

### 2. Configurar Google OAuth

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Vá para **APIs & Services > Credentials**
3. Edite seu OAuth 2.0 Client ID
4. Adicione em **Authorized redirect URIs**:
   ```
   https://seudominio.com/api/auth/callback/google
   ```

## 🔧 Verificação Pré-Deploy

Execute o script de verificação:

```bash
pnpm deploy:check
```

## 🚀 Opções de Deploy

### 1. Vercel (Recomendado)

#### Vantagens:

- Integração perfeita com Next.js
- Deploy automático via Git
- CDN global
- SSL automático

#### Passos:

1. **Criar conta no Vercel**
2. **Conectar repositório GitHub**
3. **Adicionar PostgreSQL:**
   - Opção 1: Vercel Postgres
   - Opção 2: Supabase (gratuito)
   - Opção 3: Railway PostgreSQL

4. **Configurar variáveis de ambiente:**
   - Dashboard Vercel > Settings > Environment Variables
   - Adicionar todas as variáveis listadas acima

5. **Build Commands:**

   ```bash
   # Build Command: (padrão do Next.js)
   next build

   # Install Command:
   pnpm install
   ```

6. **Deploy:**
   - Push para branch main
   - Deploy automático

### 2. Railway

#### Vantagens:

- PostgreSQL incluído
- Preços competitivos
- Interface simples

#### Passos:

1. **Conectar repositório no Railway**
2. **Adicionar PostgreSQL service**
3. **Configurar variáveis de ambiente**
4. **Deploy automático**

### 3. Render

#### Vantagens:

- Tier gratuito disponível
- PostgreSQL gratuito
- SSL automático

#### Limitações:

- Pode hibernar após inatividade
- Performance limitada no tier gratuito

## 📦 Comandos de Deploy

### Verificação pré-deploy:

```bash
pnpm deploy:check
```

### Migrations em produção:

```bash
pnpm db:deploy
```

### Gerar Prisma Client otimizado:

```bash
pnpm db:generate
```

## 🔧 Configurações Específicas

### Prisma em Produção

O projeto está configurado para gerar o Prisma Client otimizado:

```bash
# Usado automaticamente no build
prisma generate --no-engine
```

### NextAuth

- Configurado para usar database sessions
- Suporte a Google OAuth
- Redirecionamento automático pós-login

### Middleware

- Proteção de rotas automática
- Redirecionamento para login quando necessário

## 📊 Monitoramento Pós-Deploy

### Verificações:

1. **Autenticação:** Teste login com Google
2. **Banco de dados:** Verifique CRUD operations
3. **Performance:** Teste carregamento das páginas
4. **Responsividade:** Teste em diferentes dispositivos

### Logs:

- Vercel: Dashboard > Functions > Logs
- Railway: Dashboard > Deployments > Logs
- Render: Dashboard > Logs

## 🛠️ Troubleshooting

### Problemas Comuns:

1. **Erro de DATABASE_URL:**
   - Verificar format da URL
   - Testar conexão

2. **Erro de NextAuth:**
   - Verificar NEXTAUTH_SECRET
   - Confirmar URLs de callback

3. **Erro de build:**
   - Verificar dependências
   - Executar `pnpm build` localmente

4. **Erro 500:**
   - Verificar logs da aplicação
   - Verificar variáveis de ambiente

## 🔄 Atualizações Futuras

Para atualizações:

1. Faça push para branch main
2. Deploy automático será executado
3. Migrations serão executadas automaticamente (configurar hook se necessário)

## 📞 Suporte

Para problemas específicos:

- Verificar documentação da plataforma escolhida
- Consultar logs de deploy
- Testar localmente primeiro
