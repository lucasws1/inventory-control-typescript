#!/bin/bash

echo "🚀 Iniciando processo de deploy..."

# Verificar se está no branch main
current_branch=$(git rev-parse --abbrev-ref HEAD)
if [ "$current_branch" != "main" ]; then
    echo "❌ Erro: Você deve estar no branch main para fazer deploy"
    exit 1
fi

# Verificar se há mudanças não commitadas
if [[ -n $(git status --porcelain) ]]; then
    echo "❌ Erro: Há mudanças não commitadas"
    exit 1
fi

# Executar linting
echo "🔍 Verificando linting..."
pnpm lint

# Executar build
echo "🔨 Testando build..."
pnpm build

# Verificar código não utilizado
echo "🧹 Verificando código não utilizado..."
pnpx knip

# Executar testes de tipo
echo "🔍 Verificando tipos..."
npx tsc --noEmit

echo "✅ Pré-deploy concluído com sucesso!"
echo "📋 Próximos passos:"
echo "1. Configure as variáveis de ambiente na plataforma escolhida"
echo "2. Configure o OAuth do Google com a nova URL"
echo "3. Execute as migrations do Prisma: npx prisma migrate deploy"
echo "4. Faça o deploy!" 
