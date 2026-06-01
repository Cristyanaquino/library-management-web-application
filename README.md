# 📚 Library Management Web Application

Um sistema web moderno para gerenciamento de empréstimos de livros em biblioteca. Construído com React, TypeScript, Tailwind CSS e Supabase.

## 🎯 Funcionalidades

- ✅ **Autenticação**: Registro e login seguros com Supabase Auth
- 📖 **Catálogo de Livros**: Visualizar livros disponíveis com filtro por gênero
- 🔍 **Busca**: Procurar livros por título, autor ou gênero
- 📋 **Empréstimos**: Sistema completo de solicitação e gerenciamento de empréstimos
- 👤 **Perfil do Usuário**: Gerenciar informações pessoais
- 🔐 **Segurança**: Row Level Security (RLS) no banco de dados
- 📱 **Responsivo**: Design mobile-first com Tailwind CSS

## 🛠️ Tecnologias

- **Frontend**: React 19, TypeScript, Vite
- **Estilo**: Tailwind CSS, Shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth)
- **Formulários**: React Hook Form + Zod
- **Roteamento**: React Router v7
- **API**: Supabase JS Client

## 📦 Requisitos

- Node.js 18+
- npm ou yarn
- Conta Supabase (gratuita em [supabase.com](https://supabase.com))

## 🚀 Como Rodar

### 1. Clonar o repositório

```bash
git clone https://github.com/Cristyanaquino/library-management-web-application.git
cd library-management-web-application
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Configurar variáveis de ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
VITE_SUPABASE_URL=https://seu-project-url.supabase.co
VITE_SUPABASE_ANON_KEY=sua-anon-key-aqui
```

Obtenha essas credenciais no [Supabase Dashboard](https://supabase.com/dashboard) → Settings → API

### 4. Configurar Banco de Dados

No **Supabase SQL Editor**, execute:

```sql
-- Execute o arquivo supabase/schema.sql
-- Depois execute o arquivo supabase/seed.sql
```

Ou copie todo o conteúdo de `supabase/schema.sql` e `supabase/seed.sql` no SQL Editor do Supabase.

### 5. Rodar em desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## 📁 Estrutura do Projeto

```
src/
├── components/       # Componentes React reutilizáveis
│   ├── books/       # Componentes de livros
│   ├── layout/      # Layout principal
│   ├── loans/       # Gerenciamento de empréstimos
│   └── ui/          # Componentes UI base
├── pages/           # Páginas da aplicação
├── lib/             # Utilitários e configurações
├── hooks/           # Custom React hooks
├── utils/           # Funções utilitárias
├── App.tsx          # Componente raiz
└── main.tsx         # Entry point
```

## 🔐 Segurança

- Autenticação com JWT (Supabase Auth)
- Row Level Security (RLS) em todas as tabelas
- Variáveis de ambiente para credenciais
- PKCE flow para autenticação OAuth

## 📊 Banco de Dados

### Tabelas

- **profiles**: Dados do usuário
- **books**: Catálogo de livros
- **loans**: Histórico de empréstimos

### Políticas RLS

- Usuários só podem ver seus próprios dados
- Todos podem visualizar o catálogo de livros
- Usuários só podem gerenciar seus próprios empréstimos

## 🎨 Componentes UI

Componentes customizados baseados em Shadcn/ui:

- Button
- Input
- Select
- Badge
- Textarea
- Label

## 📝 Scripts Disponíveis

```bash
npm run dev      # Iniciar servidor de desenvolvimento
npm run build    # Build para produção
npm run preview  # Preview do build
```

## 🚀 Deploy

### Vercel (Recomendado)

1. Faça push para o GitHub
2. Conecte seu repositório no [Vercel](https://vercel.com)
3. Configure as variáveis de ambiente
4. Deploy automático ao fazer push

### Outras Plataformas

- Netlify
- GitHub Pages (requer ajustes de build)
- Railway
- Render

## 🐛 Troubleshooting

### Erro: "Supabase not configured"
Verifique se as variáveis de ambiente estão corretas no `.env.local`

### Erro de autenticação
Certifique-se que o URL de callback está configurado no Supabase:
- Settings → Authentication → URL Configuration

### Livros não aparecem
Execute o `seed.sql` no Supabase SQL Editor

## 📄 Licença

MIT

## 👤 Autor

Cristyan Aquino

## 🤝 Contribuições

Contribuições são bem-vindas! Abra uma issue ou pull request.

## 📧 Contato

Para dúvidas ou sugestões, abra uma issue no repositório.

---

**Desenvolvido com ❤️ usando React + Supabase**
