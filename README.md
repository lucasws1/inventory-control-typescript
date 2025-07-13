# 📦 Sistema de Controle de Estoque

Sistema completo de controle de estoque desenvolvido com Next.js 15, TypeScript, Prisma e NextAuth. Focado em práticas comerciais brasileiras com interface em português e formatação de moeda em Real.

## 🚀 Tecnologias

- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS, Shadcn/ui
- **Backend**: Prisma ORM, PostgreSQL, NextAuth v5
- **Autenticação**: Google OAuth
- **Deploy**: Vercel

## 📋 Funcionalidades

- ✅ **Gestão de Produtos**: CRUD completo com controle de preços
- ✅ **Gestão de Clientes**: Cadastro com email e telefone
- ✅ **Controle de Estoque**: Movimentações (compra, venda, ajustes)
- ✅ **Sistema de Vendas**: Invoices com múltiplos produtos
- ✅ **Dashboard Interativo**: Gráficos e relatórios
- ✅ **Autenticação Segura**: Login via Google
- ✅ **Multi-tenant**: Dados isolados por usuário
- ✅ **Interface Responsiva**: Mobile-first design

## 📁 Estrutura do Projeto

```
├── app/                    # Next.js App Router
│   ├── (dashboard)/       # Rotas protegidas
│   ├── api/               # API Routes
│   └── lib/               # Server actions
├── components/            # Componentes React
│   ├── ui/                # Componentes base (Shadcn)
│   ├── forms/             # Formulários
│   └── modals/            # Modais
├── contexts/              # React Contexts
├── lib/                   # Configurações (auth, prisma)
├── prisma/                # Schema e migrations
├── types/                 # Tipos TypeScript
└── utils/                 # Utilitários
```

## 🏗️ Arquitetura

### Padrões Principais

- **Server Actions**: Todas operações CRUD em `app/lib/actions.ts`
- **Context Pattern**: Estado global via `DataContext` e `ModalContext`
- **Modal System**: Sistema centralizado de modais com Promise-based results
- **Multi-tenancy**: Isolamento de dados por `userId`

### Fluxo de Dados

1. `DataContext` carrega todos os dados via `/api/data`
2. Cache client-side para performance
3. Mutações via Server Actions → `refreshData()` → UI atualizada

## 📊 Banco de Dados

### Modelos Principais

- **User**: Dados do usuário (NextAuth)
- **Customer**: Clientes
- **Product**: Produtos
- **Invoice**: Vendas
- **InvoiceItem**: Itens das vendas
- **StockMovement**: Movimentações de estoque

### Relacionamentos

- Todos modelos incluem `userId` para isolamento
- Relações configuradas com CASCADE para data integrity
- Tipos `*WithRelations` para dados pré-carregados

## 🔐 Segurança

- ✅ Autenticação obrigatória (middleware)
- ✅ Isolamento de dados por usuário
- ✅ Validação Zod em todas entradas
- ✅ CSRF protection (NextAuth)
- ✅ Variáveis de ambiente para secrets
