# 🚗 Hyundai Creta 2025 - Ação Entre Amigos

Landing page profissional para ação entre amigos com HTML, CSS e JavaScript puros.

## ✨ Características

- 🎯 **HTML/CSS/JS Puro** - Sem frameworks, máxima performance
- 📱 **100% Responsivo** - Funciona perfeitamente em todos os dispositivos
- ⚡ **Carregamento Ultra-Rápido** - Otimizado para velocidade
- 🎨 **Design Moderno** - Interface elegante e profissional
- 📊 **Analytics Integrado** - Google Analytics, Facebook Pixel e GTM
- 🔄 **Carrossel Interativo** - Galeria de imagens do veículo
- 🎬 **Suporte a Vídeos** - Seção de depoimentos e explicações
- ♿ **Acessível** - Navegação por teclado e suporte a leitores de tela

## 📁 Estrutura do Projeto

```
├── index.html                 # Página principal
├── assets/
│   ├── css/
│   │   └── style.css         # Estilos CSS puros
│   ├── js/
│   │   └── script.js         # JavaScript funcional
│   ├── img/                  # Imagens do projeto
│   │   ├── logo.jpg
│   │   ├── car1.jpeg
│   │   ├── car2.jpeg
│   │   └── ...
│   └── videos/               # Vídeos
│       ├── dona.mp4
│       └── rifinha-relâmpago-01-Rodrigo.mp4
├── .github/
│   └── workflows/
│       └── deploy.yml        # Deploy automático
└── README.md
```

## 🚀 Deploy

O projeto está configurado para deploy automático no GitHub Pages:

1. **Push para main** - Deploy automático
2. **Sem build** - HTML estático direto
3. **URL:** `https://lucascosta-devpy.github.io/seuhyundaiteste/`

## 🛠️ Desenvolvimento Local

Simplesmente abra o arquivo `index.html` em qualquer navegador moderno:

```bash
# Servidor local simples (opcional)
python -m http.server 8000
# ou
npx serve .
```

## 🎯 Funcionalidades

### 🖼️ Carrossel de Imagens
- Navegação automática (5s)
- Controles manuais (setas e dots)
- Navegação por teclado
- Preload das imagens

### 📊 Analytics
- **Google Analytics 4** - Métricas detalhadas
- **Facebook Pixel** - Conversões e remarketing  
- **Google Tag Manager** - Gestão centralizada
- **Eventos customizados** - Scroll, cliques, vídeos

### 🎬 Vídeos
- Controles nativos HTML5
- Tracking de interações
- Poster personalizado
- Responsivo

### 📱 Responsividade
- **Mobile First** - Otimizado para celular
- **Breakpoints:** 480px, 768px, 1200px
- **Touch friendly** - Botões e controles adequados
- **Performance móvel** - Carregamento otimizado

## 🔧 Personalização

### 🎨 Cores e Estilo
Edite as variáveis CSS em `assets/css/style.css`:

```css
:root {
  --primary-color: #3b82f6;
  --secondary-color: #10b981;
  --accent-color: #fbbf24;
}
```

### 🔗 Links e URLs
Configure em `assets/js/script.js`:

```javascript
const CONFIG = {
    participationUrl: 'https://rumomaisumarota.com.br/meucretadosonhos',
    // Outros links...
};
```

### 📊 Analytics IDs
Configure no `index.html`:

```html
<!-- Google Analytics -->
gtag('config', 'SEU-GA-ID');

<!-- Facebook Pixel -->
fbq('init', 'SEU-PIXEL-ID');

<!-- Google Tag Manager -->
'GTM-SEU-GTM-ID'
```

## 📈 Performance

### ⚡ Métricas Esperadas
- **First Contentful Paint:** < 1.5s
- **Largest Contentful Paint:** < 2.5s  
- **Cumulative Layout Shift:** < 0.1
- **First Input Delay:** < 100ms

### 🔧 Otimizações Incluídas
- ✅ CSS minificado e otimizado
- ✅ JavaScript com lazy loading
- ✅ Imagens otimizadas e preload
- ✅ Animations com GPU acceleration
- ✅ Scroll throttling
- ✅ Intersection Observer para animações

## 🌐 Compatibilidade

### Navegadores Suportados
- ✅ Chrome 80+
- ✅ Firefox 75+  
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers

### Funcionalidades Modernas
- CSS Grid e Flexbox
- Intersection Observer
- ES6+ JavaScript
- HTML5 Video
- CSS Custom Properties

## 📞 Suporte

Para dúvidas ou suporte:
- **Email:** contato@rumomaisumarota.com.br
- **WhatsApp:** +55 11 99999-9999

## 📄 Licença

Este projeto é propriedade de **Rumo Mais Uma Rota**.
Todos os direitos reservados © 2024.

---

**🎊 Landing page profissional, leve e eficiente!**