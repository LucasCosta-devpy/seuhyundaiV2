# 🚗 Hyundai Creta Landing Page - Ação Entre Amigos

Uma landing page **ultra-profissional** desenvolvida com as mais modernas tecnologias web para promover a ação entre amigos do Hyundai Creta 2025.

## 🚀 **Tecnologias Utilizadas**

### **Frontend Framework**
- **React 18** - Biblioteca JavaScript moderna
- **TypeScript** - Tipagem estática para maior robustez
- **Vite** - Build tool extremamente rápida

### **Styling & UI**
- **Tailwind CSS** - Framework CSS utility-first
- **Framer Motion** - Animações fluidas e profissionais
- **Glass Morphism** - Efeitos visuais modernos
- **CSS Custom Properties** - Sistema de design escalável

### **Funcionalidades Avançadas**
- **Intersection Observer API** - Animações baseadas em scroll
- **Custom Hooks** - Lógica reutilizável
- **Analytics Integration** - Google Analytics + Facebook Pixel
- **Responsive Design** - Mobile-first approach
- **Performance Optimized** - Lazy loading e code splitting

## 📁 **Estrutura do Projeto**

```
seuhyundai/
├── 📄 index.html                 # HTML principal
├── 📄 package.json              # Dependências e scripts
├── 📄 vite.config.ts            # Configuração do Vite
├── 📄 tailwind.config.js        # Configuração do Tailwind
├── 📄 tsconfig.json             # Configuração do TypeScript
│
├── 📁 src/
│   ├── 📄 main.tsx              # Ponto de entrada da aplicação
│   ├── 📄 App.tsx               # Componente principal
│   │
│   ├── 📁 components/           # Componentes React
│   │   ├── 📁 ui/               # Componentes de interface
│   │   │   ├── Button.tsx       # Botão premium com animações
│   │   │   ├── Card.tsx         # Card com glass morphism
│   │   │   ├── FloatingPromo.tsx # Botão flutuante
│   │   │   └── PromoModal.tsx   # Modal promocional
│   │   │
│   │   └── 📁 sections/         # Seções da página
│   │       ├── Header.tsx       # Cabeçalho com navbar
│   │       ├── Hero.tsx         # Seção hero cinematográfica
│   │       ├── ParticipationLevels.tsx # Níveis de participação
│   │       ├── ImageCarousel.tsx # Carousel de imagens
│   │       ├── PrizeDetails.tsx # Detalhes dos prêmios
│   │       ├── VideoSection.tsx # Seção de vídeo
│   │       ├── Testimonials.tsx # Depoimentos
│   │       ├── ExtraAction.tsx  # Ação extra
│   │       ├── PreviousActions.tsx # Ações anteriores
│   │       ├── SocialMedia.tsx  # Redes sociais
│   │       └── Footer.tsx       # Rodapé
│   │
│   ├── 📁 hooks/                # Hooks customizados
│   │   ├── useAnalytics.ts      # Hook para analytics
│   │   ├── useIntersectionObserver.ts # Hook para scroll animations
│   │   └── useScrollAnimation.ts # Hook para animações de scroll
│   │
│   ├── 📁 types/                # Tipos TypeScript
│   │   └── index.ts             # Definições de tipos
│   │
│   ├── 📁 utils/                # Utilitários
│   │   └── cn.ts                # Função para combinar classes CSS
│   │
│   ├── 📁 styles/               # Estilos CSS
│   │   └── index.css            # Estilos principais
│   │
│   └── 📁 assets/               # Assets organizados
│       ├── index.ts             # Configuração de assets
│       ├── 📁 img/              # Imagens
│       └── 📁 videos/           # Vídeos
```

## 🎨 **Características do Design**

### **Visual Premium**
- ✅ **Glass Morphism** - Efeitos de vidro modernos
- ✅ **Gradientes Animados** - Cores vibrantes e dinâmicas
- ✅ **Micro-interações** - Feedback visual em todos os elementos
- ✅ **Tipografia Fluida** - Escala responsiva com clamp()
- ✅ **Sombras Avançadas** - Sistema de elevação profissional

### **Animações Profissionais**
- ✅ **Scroll Animations** - Elementos aparecem ao rolar
- ✅ **Hover Effects** - Transformações 3D suaves
- ✅ **Loading States** - Feedback visual para carregamento
- ✅ **Parallax Effects** - Movimento em camadas
- ✅ **Keyframe Animations** - Animações CSS complexas

### **UX Avançada**
- ✅ **Mobile-First** - Design responsivo perfeito
- ✅ **Touch Optimized** - Otimizado para dispositivos móveis
- ✅ **Accessibility** - Suporte a leitores de tela
- ✅ **Performance** - Carregamento rápido e otimizado
- ✅ **SEO Friendly** - Meta tags e estrutura semântica

## 🚀 **Como Executar**

### **Pré-requisitos**
- Node.js 18+ 
- npm ou yarn

### **Instalação**
```bash
# Clone o repositório
git clone <repository-url>
cd seuhyundai

# Instale as dependências
npm install

# Execute em modo desenvolvimento
npm run dev

# Build para produção
npm run build

# Preview da build
npm run preview
```

## 📊 **Analytics & Tracking**

- **Google Analytics 4** - Tracking avançado de eventos
- **Facebook Pixel** - Conversões e remarketing
- **Google Tag Manager** - Gerenciamento centralizado de tags
- **Custom Events** - Tracking de interações específicas

## 🎯 **Funcionalidades Implementadas**

### **Componentes Interativos**
- [x] Botões com animações shimmer e pulse
- [x] Cards com glass morphism e hover effects
- [x] Carousel de imagens com navegação suave
- [x] Modal promocional com timer
- [x] Botão flutuante com animações avançadas

### **Seções da Página**
- [x] Hero cinematográfico com parallax
- [x] Níveis de participação com combos
- [x] Galeria de imagens do veículo
- [x] Detalhes dos prêmios
- [x] Seção de vídeo explicativo
- [x] Depoimentos de ganhadores
- [x] Ação extra promocional
- [x] Histórico de ações anteriores
- [x] Links para redes sociais
- [x] Footer com elementos de confiança

### **Recursos Avançados**
- [x] Sistema de analytics completo
- [x] Hooks customizados para funcionalidades
- [x] Animações baseadas em scroll
- [x] Design system com variáveis CSS
- [x] Tipagem TypeScript completa
- [x] Performance otimizada

## 🔧 **Configurações**

### **Variáveis de Ambiente**
Crie um arquivo `.env.local` com:
```env
VITE_GA_ID=G-D9XB7PXRPT
VITE_FB_PIXEL_ID=551167542275548
VITE_GTM_ID=GTM-NN7B7TL6
```

### **Customização**
- **Cores**: Edite `tailwind.config.js` e `src/styles/index.css`
- **Conteúdo**: Modifique os componentes em `src/components/sections/`
- **Assets**: Adicione imagens em `src/assets/img/` e vídeos em `src/assets/videos/`
- **Analytics**: Configure os IDs no `index.html` e hooks

## 📱 **Responsividade**

- **Mobile**: 320px - 640px
- **Tablet**: 641px - 1024px  
- **Desktop**: 1025px+
- **4K**: 1440px+

## 🎪 **Performance**

- ⚡ **Vite** - Build extremamente rápida
- 🗜️ **Code Splitting** - Carregamento otimizado
- 🖼️ **Image Optimization** - Formatos modernos
- 📦 **Tree Shaking** - Remoção de código não utilizado
- 💾 **Lazy Loading** - Carregamento sob demanda

## 📄 **Licença**

Este projeto é propriedade privada da **Rumo Mais Uma Rota**.

---

**Desenvolvido com ❤️ usando as mais modernas tecnologias web**

🚀 **React** • 📘 **TypeScript** • ⚡ **Vite** • 🎨 **Tailwind CSS** • 🎭 **Framer Motion**
