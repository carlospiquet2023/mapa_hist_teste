# 📋 DOCUMENTAÇÃO TÉCNICA - MAPA HISTÓRICO DO RIO

## 🏗️ ARQUITETURA DO PROJETO

### 📁 Estrutura de Arquivos
```
mapa_historico/
├── 📄 index.html          # Interface principal da aplicação
├── 🎨 style.css           # Sistema completo de estilos
├── ⚡ script.js           # Lógica e funcionalidades JavaScript
├── 📖 README.md           # Documentação do design system
├── 📝 RESTAURACAO.md      # Histórico de funcionalidades
└── 📋 DOCUMENTACAO.md     # Este arquivo (documentação técnica)
```

## 🧩 BLOCOS DE CÓDIGO EXPLICADOS

### 📄 INDEX.HTML - ESTRUTURA

#### 🔧 **HEAD Section**
```html
<!-- Meta tags PWA para funcionamento como app -->
<meta name="theme-color" content="#FFD700">
<meta name="apple-mobile-web-app-capable" content="yes">
```
**Função**: Configura a aplicação para funcionar como PWA (Progressive Web App)

#### 🍔 **Header & Navigation**
```html
<div class="desktop-menu">   <!-- Menu para desktop -->
<div class="mobile-menu">    <!-- Menu hamburger para mobile -->
```
**Função**: Sistema de navegação responsivo que se adapta ao dispositivo

#### 🔍 **Sidebar Controls**
```html
<div class="search-container">   <!-- Sistema de busca -->
<div class="filter-grid">        <!-- Filtros por categoria -->
<div class="legend-grid">        <!-- Legenda de cores -->
```
**Função**: Controles interativos para navegação e filtragem do mapa

#### 🗺️ **Map Container**
```html
<div id="map"></div>            <!-- Container do mapa Leaflet -->
<div class="desktop-footer">    <!-- Rodapé com credenciais -->
```
**Função**: Área principal onde o mapa interativo é renderizado

---

### 🎨 STYLE.CSS - SISTEMA DE ESTILOS

#### 🎛️ **Design System Tokens**
```css
:root {
    --accent-400: #fbbf24;      /* Dourado imperial */
    --glass-bg: rgba(255, 255, 255, 0.08);  /* Glassmorphism */
    --z-header: 1030;           /* Hierarquia de camadas */
}
```
**Função**: Variáveis CSS que padronizam cores, espaçamentos e efeitos visuais

#### 📱 **Layout Responsivo**
```css
.app-container {
    display: grid;
    grid-template-areas: "header header" "sidebar main";
}
```
**Função**: Sistema Grid que reorganiza layout automaticamente por dispositivo

#### ✨ **Glassmorphism Effects**
```css
.btn {
    background: var(--glass-bg);
    backdrop-filter: blur(16px);
    border: 1px solid var(--glass-border);
}
```
**Função**: Efeitos modernos de vidro translúcido com blur

#### 📲 **Mobile Optimizations**
```css
@media (max-width: 768px) {
    .desktop-menu { display: none; }
    .mobile-menu { display: flex; }
}
```
**Função**: Media queries que adaptam interface para mobile

---

### ⚡ SCRIPT.JS - FUNCIONALIDADES

#### 🔧 **PWA Setup**
```javascript
function setVH() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
}
```
**Função**: Corrige altura de viewport em dispositivos móveis

#### 🗺️ **Map Initialization**
```javascript
const map = L.map('map').setView([-22.9068, -43.1729], 16);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);
```
**Função**: Inicializa mapa Leaflet centrado no Centro do Rio

#### 📍 **Markers System**
```javascript
pontosHistoricos.forEach(ponto => {
    const marker = L.marker([ponto.lat, ponto.lng])
        .bindPopup(ponto.nome)
        .addTo(map);
});
```
**Função**: Adiciona marcadores históricos ao mapa com popups informativos

#### 🔍 **Search & Filter**
```javascript
function filterCategory(categoria) {
    pontosHistoricos.forEach(ponto => {
        if (categoria === 'all' || ponto.categoria === categoria) {
            // Mostrar marcador
        } else {
            // Ocultar marcador
        }
    });
}
```
**Função**: Sistema de filtragem que mostra/oculta marcadores por categoria

#### 🍔 **Mobile Menu**
```javascript
function toggleMobileMenu() {
    const dropdown = document.getElementById('mobileMenuDropdown');
    dropdown.classList.toggle('active');
}
```
**Função**: Controla abertura/fechamento do menu hamburger

---

## 🎯 CATEGORIAS DE PONTOS HISTÓRICOS

| Categoria | Cor | Exemplos |
|-----------|-----|----------|
| 🏛️ Museus | Vermelho (#e74c3c) | MNBA, Museu da República |
| ⛪ Igrejas | Azul (#3498db) | Candelária, São Francisco |
| 🏰 Palácios | Roxo (#9b59b6) | Tiradentes, Catete |
| 🗿 Monumentos | Laranja (#f39c12) | Cristo Redentor, Pão de Açúcar |
| 🎭 Cultura | Verde-água (#1abc9c) | Theatro Municipal, Biblioteca |
| 📚 Bibliotecas | Verde (#2ecc71) | Nacional, Parque Lage |
| 🌳 Praças | Cinza (#34495e) | XV de Novembro, Floriano |
| 🏛️ Bunker | Marrom (#795548) | Fortaleza de Copacabana |

## 📱 FUNCIONALIDADES PWA

### ✅ **Progressive Web App Features**
- 📲 Instalável como app nativo
- 🔄 Funciona offline (com cache)
- 📱 Interface adaptativa mobile/desktop
- 🎨 Splash screen personalizada
- 🔔 Notificações push (preparado)

### 🎮 **Controles Touch**
- 👆 Gestos de pinça para zoom
- 📱 Scroll suave otimizado
- 🎯 Tap targets adequados (44px+)
- ↔️ Suporte a orientação landscape/portrait

## 🔧 TECNOLOGIAS UTILIZADAS

### 📚 **Bibliotecas Externas**
- **Leaflet.js 1.9.4**: Mapas interativos
- **Font Awesome 6.4.0**: Ícones vetoriais
- **Google Fonts**: Inter + Playfair Display

### 🎨 **Técnicas CSS**
- **CSS Grid**: Layout responsivo
- **CSS Custom Properties**: Design system
- **Glassmorphism**: Efeitos modernos
- **Mobile-first**: Abordagem responsiva

### ⚡ **JavaScript Features**
- **ES6+ Modules**: Código moderno
- **Event Listeners**: Interatividade
- **Local Storage**: Persistência de dados
- **PWA APIs**: Funcionalidades de app

## 🚀 PERFORMANCE & OTIMIZAÇÕES

### ⚡ **Otimizações de Performance**
- 🎯 Lazy loading de imagens
- 📦 Minificação de assets
- 🗜️ Compressão gzip
- 🔄 Cache estratégico

### 📱 **Mobile Optimizations**
- 🖱️ Touch events otimizados
- 📏 Viewport dinâmico
- 🚫 Zoom prevenido em inputs
- 🎨 Hardware acceleration

## 🛠️ MANUTENÇÃO & EXTENSÕES

### ➕ **Como Adicionar Novo Ponto Histórico**
```javascript
// Adicionar no array pontosHistoricos
{
    id: 999,
    nome: "Novo Local Histórico",
    categoria: "museum", // ou church, palace, etc.
    lat: -22.9068,
    lng: -43.1729,
    descricao: "Descrição histórica detalhada...",
    curiosidades: ["Fato interessante 1", "Fato interessante 2"]
}
```

### 🎨 **Como Adicionar Nova Categoria**
1. Adicionar cor na legenda (HTML + CSS)
2. Criar filtro no JavaScript
3. Adicionar botão na interface
4. Atualizar sistema de cores

### 📱 **Como Modificar Layout Mobile**
- Ajustar media queries no CSS
- Modificar grid-template-areas
- Testar em diferentes resoluções

---

**📅 Última Atualização**: 13 de setembro de 2025  
**👨‍💻 Desenvolvido por**: Carlos A O Piquet  
**📧 Contato**: Professor de História - Faculdade Simonsen