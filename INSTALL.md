# 🚀 Guia de Instalação - Hyundai Creta Landing Page

## 📋 **Pré-requisitos**

Antes de começar, certifique-se de ter instalado:

- **Node.js** versão 18 ou superior ([Download](https://nodejs.org/))
- **npm** ou **yarn** (já vem com o Node.js)
- **Git** ([Download](https://git-scm.com/))

## 🛠️ **Instalação Passo a Passo**

### **1. Clone ou baixe o projeto**
```bash
# Se você tem o Git instalado:
git clone <url-do-repositorio>
cd seuhyundai

# OU baixe o ZIP e extraia na pasta desejada
```

### **2. Instale as dependências**
```bash
# Usando npm (recomendado):
npm install

# OU usando yarn:
yarn install
```

### **3. Configure as variáveis de ambiente**
```bash
# Copie o arquivo de exemplo:
copy env.example .env.local

# Edite o arquivo .env.local com suas configurações
```

### **4. Execute o projeto**
```bash
# Modo desenvolvimento (recomendado para testes):
npm run dev

# O projeto estará disponível em: http://localhost:3000
```

## 🌐 **Deploy para Produção**

### **Build do projeto**
```bash
# Gerar build otimizada:
npm run build

# Os arquivos estarão na pasta 'dist/'
```

### **Preview da build**
```bash
# Testar a build localmente:
npm run preview

# Disponível em: http://localhost:4173
```

## 📁 **Estrutura de Pastas**

Após a instalação, sua estrutura será:

```
seuhyundai/
├── node_modules/           # Dependências (criada automaticamente)
├── dist/                   # Build de produção (criada com npm run build)
├── src/                    # Código fonte
├── public/                 # Arquivos públicos
├── package.json            # Configurações do projeto
├── vite.config.ts          # Configuração do Vite
├── tailwind.config.js      # Configuração do Tailwind
└── tsconfig.json           # Configuração do TypeScript
```

## ⚙️ **Scripts Disponíveis**

```bash
npm run dev          # Servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview da build
npm run lint         # Verificar código
npm run type-check   # Verificar tipos TypeScript
```

## 🔧 **Configurações Importantes**

### **Analytics**
No arquivo `.env.local`, configure:
```env
VITE_GA_ID=seu-google-analytics-id
VITE_FB_PIXEL_ID=seu-facebook-pixel-id
VITE_GTM_ID=seu-google-tag-manager-id
```

### **URLs de Redirecionamento**
```env
VITE_PURCHASE_URL=https://sua-pagina-de-compra.com
VITE_EXTRA_ACTION_URL=https://sua-acao-extra.com
```

## 🎨 **Personalização**

### **Cores e Estilos**
- Edite `tailwind.config.js` para cores
- Modifique `src/styles/index.css` para estilos customizados

### **Conteúdo**
- Textos: Edite os componentes em `src/components/sections/`
- Imagens: Substitua em `src/assets/img/`
- Vídeos: Substitua em `src/assets/videos/`

### **Assets (Imagens e Vídeos)**
Organize seus arquivos nas pastas corretas:
- `src/assets/img/` - Todas as imagens
- `src/assets/videos/` - Todos os vídeos

## 🐛 **Resolução de Problemas**

### **Erro: "Module not found"**
```bash
# Limpe o cache e reinstale:
rm -rf node_modules package-lock.json
npm install
```

### **Erro: "Port 3000 is already in use"**
```bash
# Use uma porta diferente:
npm run dev -- --port 3001
```

### **Imagens não carregam**
- Verifique se estão na pasta `src/assets/img/`
- Confirme os nomes dos arquivos no `src/assets/index.ts`

### **TypeScript Errors**
```bash
# Verificar tipos:
npm run type-check

# Instalar tipos faltantes:
npm install @types/node --save-dev
```

## 📞 **Suporte**

Se encontrar algum problema:

1. **Verifique os pré-requisitos** - Node.js 18+
2. **Limpe o cache** - `rm -rf node_modules && npm install`
3. **Verifique o console** - Procure por erros no navegador
4. **Consulte a documentação** - README.md

## ✅ **Checklist Pós-Instalação**

- [ ] Node.js 18+ instalado
- [ ] Dependências instaladas (`npm install`)
- [ ] Variáveis de ambiente configuradas (`.env.local`)
- [ ] Projeto rodando (`npm run dev`)
- [ ] Página abrindo no navegador
- [ ] Imagens carregando corretamente
- [ ] Vídeos funcionando
- [ ] Analytics configurado (se aplicável)

---

**🎉 Parabéns! Sua landing page profissional está pronta!**

Acesse http://localhost:3000 para ver o resultado.
