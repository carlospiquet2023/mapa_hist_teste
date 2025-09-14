/*
==========================================================================
🗺️ MAPA HISTÓRICO DO RIO DE JANEIRO - LÓGICA DA APLICAÇÃO
==========================================================================

📝 DESCRIÇÃO:
   Sistema completo de mapa interativo para exploração histórica
   do Centro do Rio de Janeiro com recursos educacionais avançados

🎯 FUNCIONALIDADES PRINCIPAIS:
   - Intro de vídeo fullscreen responsiva
   - Mapa interativo com Leaflet.js
   - Filtragem por categorias históricas
   - Sistema de busca avançado
   - Interface responsiva PWA
   - Conteúdo educacional rico

📱 COMPATIBILIDADE:
   - Progressive Web App (PWA)
   - Mobile-first responsive design
   - Touch gestures otimizados
   - Standalone app support

👨‍💻 AUTOR: Carlos Antonio de Oliveira Piquet
🏢 CNPJ: 27.658.099/0001-70
� CONTATO: carlospiquet.projetos@gmail.com
📅 CRIAÇÃO: Setembro 2024
⚖️ COPYRIGHT: © 2024 - Todos os direitos reservados

🛡️ OBRA AUTORAL PROTEGIDA POR DIREITOS AUTORAIS
   Uso não autorizado é expressamente proibido.

==========================================================================
*/

//=============================================================================
// 🎬 INTRO DE VÍDEO
//=============================================================================

/**
 * CONTROLADOR DA INTRO DE VÍDEO - VERSÃO SIMPLIFICADA
 * Gerencia o vídeo de introdução sem travamentos
 */
function initVideoIntro() {
    const overlay = document.getElementById('videoIntroOverlay');
    const video = document.getElementById('introVideo');
    const soundToggle = document.getElementById('soundToggle');
    const soundIcon = document.getElementById('soundIcon');
    const skipButton = document.getElementById('skipVideo');
    
    if (!overlay || !video) {
        console.log('Elementos de vídeo não encontrados');
        return;
    }
    
    // Detecta se é dispositivo móvel
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    
    // Configuração básica do vídeo
    video.playsInline = true;
    video.volume = 0.8;
    
    // Em dispositivos móveis, inicia sempre mudo devido às políticas dos navegadores
    if (isMobile) {
        video.muted = true;
        console.log('Dispositivo móvel detectado - iniciando vídeo mudo');
    } else {
        video.muted = false;
    }
    
    // Função para remover overlay
    const removeOverlay = () => {
        overlay.classList.add('fade-out');
        setTimeout(() => {
            if (overlay.parentNode) {
                overlay.parentNode.removeChild(overlay);
            }
        }, 1000);
    };
    
    // Botão de pular
    if (skipButton) {
        skipButton.addEventListener('click', removeOverlay);
    }
    
    // Controle de som otimizado para mobile
    if (soundToggle && soundIcon) {
        // Configuração inicial do botão baseada no estado do vídeo
        const updateSoundButton = () => {
            if (video.muted) {
                soundIcon.className = 'fas fa-volume-mute';
                soundToggle.title = 'Ativar Som';
                if (isMobile) soundToggle.style.animation = 'pulse 2s infinite';
                return;
            }
            soundIcon.className = 'fas fa-volume-up';
            soundToggle.title = 'Desligar Som';
            soundToggle.style.animation = '';
        };
        
        // Configuração inicial
        updateSoundButton();
        
        soundToggle.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Previne múltiplos cliques rapidamente
            if (soundToggle.disabled) return;
            soundToggle.disabled = true;
            
            setTimeout(() => {
                soundToggle.disabled = false;
            }, 300);
            
            if (video.muted) {
                // Ativar som
                video.muted = false;
                video.volume = 0.8;
                
                // Em mobile, precisa de interação do usuário para funcionar
                if (isMobile) {
                    // Força o play para "quebrar" a política de autoplay
                    video.play().then(() => {
                        console.log('Som ativado com sucesso no mobile');
                    }).catch(err => {
                        console.log('Não foi possível ativar som:', err);
                        video.muted = true; // Volta para mudo se não conseguir
                    });
                }
            } else {
                // Mutar som
                video.muted = true;
            }
            
            updateSoundButton();
        });
    }
    
    // Tentar reproduzir vídeo - estratégia diferente para mobile e desktop
    const startVideo = () => {
        video.play().then(() => {
            console.log('Vídeo iniciado com sucesso');
            if (isMobile) console.log('Mobile: vídeo iniciado mudo, aguardando interação do usuário');
            // Garantir volume adequado quando não estiver mudo
            if (!video.muted) video.volume = 0.8;
        }).catch(error => {
            console.log('Erro ao reproduzir vídeo:', error);
            
            // Fallback: força modo mudo
            video.muted = true;
            if (soundToggle && soundIcon) {
                soundIcon.className = 'fas fa-volume-mute';
                soundToggle.title = 'Ativar Som';
                if (isMobile) {
                    soundToggle.style.animation = 'pulse 2s infinite';
                }
            }
            
            video.play().catch(finalError => {
                console.log('Erro total ao reproduzir vídeo:', finalError);
                removeOverlay();
            });
        });
    };
    
    // Inicia o vídeo
    startVideo();
    
    // Otimização especial para dispositivos móveis
    if (isMobile) {
        // Detecta primeira interação do usuário para "quebrar" políticas de autoplay
        const enableSoundOnFirstInteraction = () => {
            // Só executa se o vídeo estiver mudo
            if (video.muted && video.paused === false) {
                console.log('Primeira interação detectada - tentando ativar som automaticamente');
                video.muted = false;
                video.volume = 0.8;
                
                // Atualiza o botão
                if (soundToggle && soundIcon) {
                    soundIcon.className = 'fas fa-volume-up';
                    soundToggle.title = 'Desligar Som';
                    soundToggle.style.animation = '';
                }
            }
            
            // Remove os listeners após primeira interação
            document.removeEventListener('touchstart', enableSoundOnFirstInteraction);
            document.removeEventListener('click', enableSoundOnFirstInteraction);
        };
        
        // Adiciona listeners para primeira interação
        document.addEventListener('touchstart', enableSoundOnFirstInteraction, { once: true });
        document.addEventListener('click', enableSoundOnFirstInteraction, { once: true });
    }
    
    // Quando terminar, remove overlay
    video.addEventListener('ended', removeOverlay);
    video.addEventListener('error', removeOverlay);

    // Configuração simples de legendas
    let subtitlesEnabled = true;
    const customSubtitles = document.getElementById('customSubtitles');
    
    if (customSubtitles) {
        const subtitleData = [
            { start: 6, end: 9, text: "Sejam todos bem-vindos ao Mapa Histórico do Rio." },
            { start: 9, end: 11.5, text: "Aqui, vamos explorar o passado da cidade" },
            { start: 11.5, end: 13, text: "de forma prática e visual," },
            { start: 13, end: 14.5, text: "trazendo a história à vida." }
        ];
        
        const showSubtitles = () => {
            const currentTime = video.currentTime;
            let currentSubtitle = null;
            
            for (let subtitle of subtitleData) {
                if (currentTime >= subtitle.start && currentTime <= subtitle.end) {
                    currentSubtitle = subtitle;
                    break;
                }
            }
            
            if (currentSubtitle && subtitlesEnabled) {
                customSubtitles.textContent = currentSubtitle.text;
                customSubtitles.classList.add('show');
            } else {
                customSubtitles.classList.remove('show');
            }
        };
        
        video.addEventListener('timeupdate', showSubtitles);
    }
}

//=============================================================================
// 📱 PWA & OTIMIZAÇÕES MOBILE
//=============================================================================

/**
 * INICIALIZAÇÃO DA APLICAÇÃO
 * Configura otimizações específicas para dispositivos móveis e PWA
 */
document.addEventListener('DOMContentLoaded', function() {
    
    // Inicializar intro de vídeo
    initVideoIntro();

    // ================= Acessibilidade e Tela Cheia =================
    initAccessibility();
    initFullscreenButtons();
    
    /**
     * DETECÇÃO DE DISPOSITIVO
     * Identifica se está rodando em mobile ou como PWA standalone
     */
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone;
    
    /**
     * CONFIGURAÇÃO DE VIEWPORT DINÂMICO
     * Ajusta altura da viewport para lidar com barras de navegação móveis
     */
    function setVH() {
        // Usa visual viewport quando disponível para refletir altura útil
        const h = (window.visualViewport?.height || window.innerHeight);
        const vh = h * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
        document.documentElement.style.setProperty('--app-height', `${h}px`);
    }
    
    // Aplicar configurações de viewport
    setVH();
    window.addEventListener('resize', () => {
        setVH();
        // Se o mapa já existir, força recálculo do Leaflet
        if (window.map && typeof window.map.invalidateSize === 'function') {
            setTimeout(() => window.map.invalidateSize(), 0);
        }
    });
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            setVH();
            if (window.map && typeof window.map.invalidateSize === 'function') {
                window.map.invalidateSize();
            }
        }, 200); // pequeno atraso para estabilizar o layout
    });
    
    /**
     * OTIMIZAÇÕES PARA PWA
     * Configurações específicas quando rodando como aplicativo standalone
     */
    if (isStandalone) {
        document.body.classList.add('pwa-mode');
        
        // Prevenir zoom em inputs no iOS
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('focus', () => {
                const viewport = document.querySelector('meta[name="viewport"]');
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
            });
            input.addEventListener('blur', () => {
                const viewport = document.querySelector('meta[name="viewport"]');
                viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, user-scalable=no, viewport-fit=cover');
            });
        });
    }
    
    /**
     * OTIMIZAÇÕES ESPECÍFICAS PARA MOBILE
     * Melhora performance e experiência em dispositivos touch
     */
    if (isMobile) {
        document.body.classList.add('mobile-device');
        
        // Prevenir scroll bounce no iOS
        document.addEventListener('touchmove', function(e) {
            // Permitir scroll apenas em elementos específicos
            if (e.target.closest('.modal-content, .sidebar, #map')) {
                return;
            }
            e.preventDefault();
        }, { passive: false });
        
        // Otimizar performance de touch
        document.addEventListener('touchstart', function() {}, { passive: true });
    }
});

//=============================================================================
// ♿ Acessibilidade: painel e preferências
//=============================================================================
function initAccessibility() {
    const a11yBtn = document.getElementById('a11yBtn');
    const a11yPanel = document.getElementById('a11yPanel');
    const a11yClose = document.getElementById('a11yClose');
    if (!a11yBtn || !a11yPanel) return;

    // Controles
    const chkContrast = document.getElementById('a11yContrast');
    const chkDyslexia = document.getElementById('a11yDyslexia');
    const chkReduceMotion = document.getElementById('a11yReduceMotion');
    const chkHighlight = document.getElementById('a11yHighlight');
    const chkMute = document.getElementById('a11yMuteMedia');
    const fontPlus = document.getElementById('fontPlus');
    const fontMinus = document.getElementById('fontMinus');
    const fontReset = document.getElementById('fontReset');

    const state = loadA11yState();
    applyA11yState(state);

    // Abrir/fechar painel
    const closePanel = () => {
        a11yPanel.removeAttribute('open');
        try { a11yPanel.close(); } catch {}
        a11yBtn.setAttribute('aria-expanded', 'false');
        // Garantir que o botão se mantenha acessível
        setTimeout(() => a11yBtn.focus(), 10);
        // Remover backdrop se houver
        const backdrop = document.querySelector('.a11y-backdrop');
        if (backdrop) backdrop.remove();
    };
    
    const openPanel = () => {
        // Adicionar backdrop para fechar ao clicar fora
        const backdrop = document.createElement('div');
        backdrop.className = 'a11y-backdrop';
        backdrop.addEventListener('click', closePanel);
        document.body.appendChild(backdrop);
        
        // Abrir painel
        a11yPanel.setAttribute('open', '');
        try { a11yPanel.show(); } catch {}
        a11yBtn.setAttribute('aria-expanded', 'true');
        // Manter o foco no painel para navegação por teclado
        setTimeout(() => a11yPanel.focus(), 50);
    };
    
    const togglePanel = () => {
        const open = a11yPanel.hasAttribute('open');
        if (open) {
            closePanel();
        } else {
            openPanel();
        }
    };
    a11yBtn.addEventListener('click', togglePanel);
    a11yClose?.addEventListener('click', togglePanel);
    a11yPanel.addEventListener('keydown', (e) => { if (e.key === 'Escape') togglePanel(); });

    // Teclado: Alt + A abre/fecha
    document.addEventListener('keydown', (e) => {
        if (e.altKey && (e.key === 'a' || e.key === 'A')) {
            e.preventDefault();
            togglePanel();
        }
    });

    // Bind inputs
    bindToggle(chkContrast, 'contrast', (v) => document.body.classList.toggle('high-contrast', v));
    bindToggle(chkDyslexia, 'dyslexia', (v) => document.body.classList.toggle('dyslexia-font', v));
    bindToggle(chkReduceMotion, 'reduceMotion', (v) => document.body.classList.toggle('reduced-motion', v));
    bindToggle(chkHighlight, 'highlight', (v) => document.body.classList.toggle('highlight-focus', v));
    bindToggle(chkMute, 'muteMedia', (v) => setMediaMuted(v));
    
    // Leitor de tela
    const chkScreenReader = document.getElementById('a11yScreenReader');
    const chkAutoRead = document.getElementById('a11yAutoRead');
    const speechRateSlider = document.getElementById('speechRate');
    const speechRateValue = document.getElementById('speechRateValue');
    const screenReaderOptions = document.getElementById('screenReaderOptions');
    
    // Exibir/ocultar opções do leitor de tela
    if (chkScreenReader && screenReaderOptions) {
        bindToggle(chkScreenReader, 'screenReader', (v) => {
            toggleScreenReader(v);
            screenReaderOptions.style.display = v ? 'block' : 'none';
        });
        
        // Estado inicial
        const state = loadA11yState();
        screenReaderOptions.style.display = state.screenReader ? 'block' : 'none';
    }
    
    // Leitura automática ao passar o mouse
    if (chkAutoRead) {
        bindToggle(chkAutoRead, 'autoRead', (v) => {
            setAutoRead(v);
        });
    }
    
    // Velocidade da fala
    if (speechRateSlider && speechRateValue) {
        // Inicializar valor do slider
        const state = loadA11yState();
        const rate = state.speechRate || 1;
        speechRateSlider.value = rate;
        speechRateValue.textContent = `${rate}x`;
        
        // Atualizar ao mudar o slider
        speechRateSlider.addEventListener('input', () => {
            const rate = parseFloat(speechRateSlider.value);
            speechRateValue.textContent = `${rate.toFixed(1)}x`;
            
            const s = loadA11yState();
            s.speechRate = rate;
            saveA11yState(s);
        });
    }

    // Fonte
    fontPlus?.addEventListener('click', () => adjustFontSize(0.05));
    fontMinus?.addEventListener('click', () => adjustFontSize(-0.05));
    fontReset?.addEventListener('click', () => setFontScale(1));
    
    // Botão de redefinição de emergência
    const resetAllBtn = document.getElementById('resetAllSettings');
    if (resetAllBtn) {
        resetAllBtn.addEventListener('click', resetAllAccessibilitySettings);
    }
}

function bindToggle(el, key, apply) {
    if (!el) return;
    const state = loadA11yState();
    el.checked = !!state[key];
    apply(!!state[key]);
    el.addEventListener('change', () => {
        const s = loadA11yState();
        s[key] = el.checked;
        saveA11yState(s);
        apply(el.checked);
    });
}

function setMediaMuted(muted) {
    document.querySelectorAll('video, audio').forEach(m => {
        m.muted = muted;
        if (muted && !m.paused) m.pause();
    });
}

function adjustFontSize(delta) {
    const s = loadA11yState();
    const current = s.fontScale || 1;
    // Limita o tamanho máximo a 1.3 e incrementos menores para melhor controle
    const next = Math.min(1.3, Math.max(0.8, +(current + delta).toFixed(2)));
    setFontScale(next);
}

function setFontScale(scale) {
    const s = loadA11yState();
    s.fontScale = scale;
    saveA11yState(s);
    document.documentElement.style.setProperty('font-size', `${16 * scale}px`);
    
    // Atualizar o botão de reset com a porcentagem atual
    const fontResetBtn = document.getElementById('fontReset');
    if (fontResetBtn) {
        const percent = Math.round(scale * 100);
        fontResetBtn.textContent = `${percent}%`;
        
        // Destacar visualmente se não estiver no padrão
        if (scale !== 1) {
            fontResetBtn.classList.add('active-size');
            
            // Atualiza os botões +/- para mostrar quais opções ainda estão disponíveis
            const fontPlus = document.getElementById('fontPlus');
            const fontMinus = document.getElementById('fontMinus');
            
            if (fontPlus) {
                fontPlus.disabled = scale >= 1.3;
                fontPlus.classList.toggle('disabled', scale >= 1.3);
            }
            
            if (fontMinus) {
                fontMinus.disabled = scale <= 0.8;
                fontMinus.classList.toggle('disabled', scale <= 0.8);
            }
        } else {
            fontResetBtn.classList.remove('active-size');
            
            // Reset dos botões
            const fontPlus = document.getElementById('fontPlus');
            const fontMinus = document.getElementById('fontMinus');
            
            if (fontPlus) {
                fontPlus.disabled = false;
                fontPlus.classList.remove('disabled');
            }
            
            if (fontMinus) {
                fontMinus.disabled = false;
                fontMinus.classList.remove('disabled');
            }
        }
    }
}

function loadA11yState() {
    try { return JSON.parse(localStorage.getItem('a11yState') || '{}'); } catch { return {}; }
}
function saveA11yState(state) {
    try { localStorage.setItem('a11yState', JSON.stringify(state)); } catch {}
}
function applyA11yState(s) {
    if (!s) return;
    
    if (s.fontScale) {
        document.documentElement.style.setProperty('font-size', `${16 * s.fontScale}px`);
        // Atualizar o botão de reset com a porcentagem atual
        const fontResetBtn = document.getElementById('fontReset');
        if (fontResetBtn) {
            const percent = Math.round(s.fontScale * 100);
            fontResetBtn.textContent = `${percent}%`;
            if (s.fontScale !== 1) {
                fontResetBtn.classList.add('active-size');
            }
        }
    }
    
    if (s.contrast) document.body.classList.add('high-contrast');
    if (s.dyslexia) document.body.classList.add('dyslexia-font');
    if (s.reduceMotion) document.body.classList.add('reduced-motion');
    if (s.highlight) document.body.classList.add('highlight-focus');
    if (s.muteMedia) setMediaMuted(true);
    if (s.screenReader) toggleScreenReader(true);
    if (s.autoRead) setAutoRead(true);
}

// Variáveis globais para o leitor de tela
let currentSpeech = null;
let isScreenReaderActive = false;
let isAutoReadActive = false;

// Função para ativar/desativar o leitor de tela
function toggleScreenReader(active) {
    isScreenReaderActive = active;
    
    if (active) {
        initScreenReader();
    } else {
        stopSpeaking();
        removeClickListeners();
    }
}

// Inicializa o leitor de tela
function initScreenReader() {
    if (!window.speechSynthesis) {
        alert("Desculpe, seu navegador não suporta a API de Síntese de Voz.");
        return;
    }
    
    // Adicionar ouvintes de clique para elementos interativos
    addClickListeners();
}

// Adiciona ouvintes de clique a elementos interativos
function addClickListeners() {
    // Remover qualquer listener anterior
    removeClickListeners();
    
    // Adicionar listener para todos elementos clicáveis
    document.addEventListener('click', handleScreenReaderClick);
    
    // Se a leitura automática estiver ativa, adicionar ouvintes de hover
    if (isAutoReadActive) {
        document.addEventListener('mouseover', handleScreenReaderHover);
    }
}

// Remove os ouvintes de eventos
function removeClickListeners() {
    document.removeEventListener('click', handleScreenReaderClick);
    document.removeEventListener('mouseover', handleScreenReaderHover);
}

// Configura a leitura automática ao passar o mouse
function setAutoRead(active) {
    isAutoReadActive = active;
    
    if (active && isScreenReaderActive) {
        document.addEventListener('mouseover', handleScreenReaderHover);
    } else {
        document.removeEventListener('mouseover', handleScreenReaderHover);
    }
}

// Lida com cliques para leitura
function handleScreenReaderClick(event) {
    if (!isScreenReaderActive) return;
    
    // Ignora cliques em elementos do painel de acessibilidade
    if (event.target.closest('.a11y-panel')) return;
    
    const element = getRelevantElement(event.target);
    if (element) {
        speakElement(element);
    }
}

// Lida com hover para leitura automática
function handleScreenReaderHover(event) {
    if (!isScreenReaderActive || !isAutoReadActive) return;
    
    // Ignora hover em elementos do painel de acessibilidade
    if (event.target.closest('.a11y-panel')) return;
    
    const element = getRelevantElement(event.target);
    if (element && isSignificantElement(element)) {
        speakElement(element);
    }
}

// Obtém o elemento mais relevante para leitura
function getRelevantElement(target) {
    // Verificar se o elemento é interativo
    if (target.tagName === 'BUTTON' || 
        target.tagName === 'A' || 
        target.tagName === 'INPUT' || 
        target.tagName === 'SELECT' || 
        target.tagName === 'TEXTAREA') {
        return target;
    }
    
    // Para outros elementos, procurar o contêiner com conteúdo significativo
    let current = target;
    while (current !== document.body) {
        // Verificar headings
        if (current.tagName === 'H1' || 
            current.tagName === 'H2' || 
            current.tagName === 'H3' || 
            current.tagName === 'H4' || 
            current.tagName === 'H5' || 
            current.tagName === 'H6' ||
            current.tagName === 'P' ||
            current.className === 'info-panel' ||
            current.className === 'curiosity-item') {
            return current;
        }
        
        // Verificar aria-label
        if (current.getAttribute('aria-label')) {
            return current;
        }
        
        // Verificar role
        if (current.getAttribute('role')) {
            return current;
        }
        
        current = current.parentElement;
    }
    
    return target; // Retorna o alvo original se nenhum contêiner relevante for encontrado
}

// Verifica se um elemento é significativo o suficiente para leitura automática
function isSignificantElement(element) {
    // Para leitura automática, só queremos elementos significativos
    return (
        element.tagName === 'H1' || 
        element.tagName === 'H2' || 
        element.tagName === 'H3' || 
        element.tagName === 'H4' || 
        element.tagName === 'H5' || 
        element.tagName === 'H6' ||
        element.tagName === 'BUTTON' ||
        element.tagName === 'A' ||
        element.className === 'info-title' ||
        element.getAttribute('aria-label')
    );
}

// Faz a leitura do texto do elemento
function speakElement(element) {
    // Parar qualquer leitura atual
    stopSpeaking();
    
    // Destacar elemento sendo lido
    removeHighlights();
    element.classList.add('screen-reader-highlight');
    
    // Obter texto para leitura
    let textToSpeak = getTextToSpeak(element);
    
    if (!textToSpeak) return;
    
    // Criar nova instância de fala
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    
    // Configurar velocidade da fala baseada nas preferências
    const state = loadA11yState();
    utterance.rate = state.speechRate || 1;
    
    // Configurar idioma para português do Brasil
    utterance.lang = 'pt-BR';
    
    // Evento de finalização
    utterance.onend = function() {
        element.classList.remove('screen-reader-highlight');
        currentSpeech = null;
    };
    
    // Armazenar referência e iniciar fala
    currentSpeech = utterance;
    window.speechSynthesis.speak(utterance);
}

// Remove todos os destaques de leitura
function removeHighlights() {
    document.querySelectorAll('.screen-reader-highlight').forEach(el => {
        el.classList.remove('screen-reader-highlight');
    });
}

// Extrai o texto mais apropriado para leitura de um elemento
function getTextToSpeak(element) {
    // Verificar aria-label primeiro
    if (element.getAttribute('aria-label')) {
        return element.getAttribute('aria-label');
    }
    
    // Verificar aria-labelledby
    const labelledById = element.getAttribute('aria-labelledby');
    if (labelledById) {
        const labelElement = document.getElementById(labelledById);
        if (labelElement) {
            return labelElement.textContent;
        }
    }
    
    // Botões com ícones, tentar encontrar texto alternativo
    if (element.tagName === 'BUTTON' && !element.textContent.trim()) {
        // Verificar por i.fa-* e tentar inferir um nome
        const icon = element.querySelector('i[class*="fa-"]');
        if (icon) {
            const classList = Array.from(icon.classList);
            const faClass = classList.find(c => c.startsWith('fa-'));
            if (faClass) {
                return faClass.replace('fa-', '').replace(/-/g, ' ');
            }
        }
    }
    
    // Para links e botões, ler tanto o texto quanto o title
    if (element.tagName === 'A' || element.tagName === 'BUTTON') {
        let text = element.textContent.trim();
        if (element.title) {
            text = text ? `${text} - ${element.title}` : element.title;
        }
        return text;
    }
    
    // Para painéis de informação, ler o título primeiro
    if (element.className === 'info-panel') {
        const title = element.querySelector('.info-title');
        if (title) {
            return title.textContent + ". Clique novamente para mais detalhes.";
        }
    }
    
    // Para itens de curiosidade, ler o título primeiro
    if (element.className === 'curiosity-item') {
        const title = element.querySelector('h4');
        if (title) {
            return title.textContent + ". " + element.textContent.replace(title.textContent, '');
        }
    }
    
    // Para outros elementos, usar o texto interno
    return element.textContent.trim();
}

// Para a fala atual
function stopSpeaking() {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    
    if (currentSpeech) {
        currentSpeech = null;
        removeHighlights();
    }
}

// Limpar todas as configurações de acessibilidade
function resetAllAccessibilitySettings() {
    // Parar o leitor de tela se estiver ativo
    stopSpeaking();
    toggleScreenReader(false);
    
    // Remover do localStorage
    try { localStorage.removeItem('a11yState'); } catch {}
    
    // Remover classes do body
    document.body.classList.remove('high-contrast', 'dyslexia-font', 'reduced-motion', 'highlight-focus');
    
    // Resetar tamanho da fonte para o padrão
    document.documentElement.style.setProperty('font-size', '16px');
    
    // Atualizar botão de tamanho
    const fontResetBtn = document.getElementById('fontReset');
    if (fontResetBtn) {
        fontResetBtn.textContent = '100%';
        fontResetBtn.classList.remove('active-size');
    }
    
    // Reset dos botões de fonte
    const fontPlus = document.getElementById('fontPlus');
    const fontMinus = document.getElementById('fontMinus');
    
    if (fontPlus) {
        fontPlus.disabled = false;
        fontPlus.classList.remove('disabled');
    }
    
    if (fontMinus) {
        fontMinus.disabled = false;
        fontMinus.classList.remove('disabled');
    }
    
    // Reset do slider de velocidade da fala
    const speechRateSlider = document.getElementById('speechRate');
    const speechRateValue = document.getElementById('speechRateValue');
    if (speechRateSlider) speechRateSlider.value = 1;
    if (speechRateValue) speechRateValue.textContent = '1.0x';
    
    // Ocultar opções de leitor de tela
    const screenReaderOptions = document.getElementById('screenReaderOptions');
    if (screenReaderOptions) screenReaderOptions.style.display = 'none';
    
    // Desmarcar todas as caixas de seleção
    document.querySelectorAll('#a11yPanel input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Habilitar mídias
    setMediaMuted(false);
    
    // Fechar o painel com animação de confirmação
    const a11yPanel = document.getElementById('a11yPanel');
    if (a11yPanel?.hasAttribute('open')) {
        // Adicionar classe de feedback visual
        a11yPanel.classList.add('reset-success');
        
        // Remover backdrop
        const backdrop = document.querySelector('.a11y-backdrop');
        if (backdrop) backdrop.remove();
        
        // Pequeno delay para mostrar o feedback antes de fechar
        setTimeout(() => {
            a11yPanel.removeAttribute('open');
            try { a11yPanel.close(); } catch {}
            a11yPanel.classList.remove('reset-success');
            const a11yBtn = document.getElementById('a11yBtn');
            if (a11yBtn) {
                a11yBtn.setAttribute('aria-expanded', 'false');
                // Garantir que o botão se mantenha acessível
                setTimeout(() => a11yBtn.focus(), 50);
            }
        }, 800);
    }
}

//=============================================================================
// ⛶ Tela Cheia
//=============================================================================
function initFullscreenButtons() {
    const desktopBtn = document.getElementById('fullscreenBtn');
    const mobileBtn = document.getElementById('fullscreenBtnMobile');
    const setIcon = (isFs) => {
        const iconD = document.getElementById('fullscreenIcon');
        const iconM = document.getElementById('fullscreenIconMobile');
        iconD && (iconD.className = isFs ? 'fas fa-compress' : 'fas fa-expand');
        iconM && (iconM.className = isFs ? 'fas fa-compress' : 'fas fa-expand');
        desktopBtn?.setAttribute('aria-label', isFs ? 'Sair de tela cheia' : 'Ativar tela cheia');
        mobileBtn?.setAttribute('aria-label', isFs ? 'Sair de tela cheia' : 'Ativar tela cheia');
        desktopBtn?.setAttribute('aria-pressed', String(isFs));
        mobileBtn?.setAttribute('aria-pressed', String(isFs));
    };

    async function toggleFullscreen() {
        try {
            if (!document.fullscreenElement) {
                await document.documentElement.requestFullscreen();
                setIcon(true);
            } else {
                await document.exitFullscreen();
                setIcon(false);
            }
        } catch (e) { console.warn('Tela cheia não suportada', e); }
        if (window.map?.invalidateSize) setTimeout(() => window.map.invalidateSize(), 300);
    }

    desktopBtn?.addEventListener('click', toggleFullscreen);
    mobileBtn?.addEventListener('click', toggleFullscreen);
    document.addEventListener('fullscreenchange', () => setIcon(!!document.fullscreenElement));
}

//=============================================================================
// 🏛️ BASE DE DADOS HISTÓRICOS
//=============================================================================

/**
 * PONTOS HISTÓRICOS DO CENTRO DO RIO
 * Array com todos os locais históricos, suas coordenadas e informações
 */
const pontosHistoricos = [
    {
        id: 1,
        nome: "Museu Nacional de Belas Artes",
        categoria: "museum",
        coords: [-22.908728, -43.175951],
        periodo: "1937",
        descricao: "Principal museu de artes visuais do país, abriga a maior coleção de arte brasileira do século XIX e início do XX.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "🎨 Possui mais de 20.000 obras, incluindo a famosa 'Primeira Missa no Brasil' de Victor Meirelles",
            "🏛️ Prédio projetado pelo arquiteto francês Grandjean de Montigny",
            "👑 Muitas obras vieram da coleção particular de D. João VI"
        ]
    },
    {
        id: 2,
        nome: "Subsolo da Praça dos Expedicionários",
        categoria: "bunker",
        coords: [-22.90664, -43.17225],
        periodo: "1942 e 1943",
        descricao: "O subsolo da Praça dos Expedicionários, localizada no Centro do Rio de Janeiro, abriga um dos antigos abrigos antiaéreos construídos durante a Segunda Guerra Mundial. Esses espaços subterrâneos foram projetados para proteger a população civil em caso de bombardeios, em uma época em que o Brasil, aliado aos Estados Unidos, entrou no conflito após ataques de submarinos alemães na costa brasileira.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "🚨 Função preventiva – Apesar de terem sido construídos, os abrigos nunca chegaram a ser usados para ataques reais, já que o Rio de Janeiro não sofreu bombardeios durante a guerra.",
            "🏗️ Estrutura resistente – O abrigo da Praça dos Expedicionários foi projetado em concreto armado, com entradas e saídas estratégicas, ventilação e capacidade para abrigar centenas de pessoas em caso de emergência.",
            "👥 Memória pouco conhecida – Muitos cariocas passam pela praça sem imaginar que, sob seus pés, existe um espaço ligado diretamente à história da Segunda Guerra e à preparação do Brasil para um possível ataque aéreo."
        ]
    },
    {
        id: 3,
        nome: "Igreja da Candelária",
        categoria: "church",
        coords: [-22.900849, -43.177794],
        periodo: "1609",
        descricao: "Uma das igrejas mais importantes do Rio, construída em honra de Nossa Senhora da Candelária, padroeira dos navegadores.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "⛪ Construção levou mais de 250 anos para ser concluída",
            "🎨 Interior decorado com mármores de Carrara e pinturas de João Zeferino da Costa",
            "🕊️ Local da famosa 'Chacina da Candelária' em 1993"
        ]
    },
    {
        id: 4,
        nome: "Theatro Municipal",
        categoria: "culture",
        coords: [-22.908992, -43.176677],
        periodo: "1909",
        descricao: "Principal casa de espetáculos do Rio, inspirado na Ópera de Paris, é um símbolo da Belle Époque carioca.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "🎭 Inaugurado em 1909, inspirado na Ópera de Paris",
            "🎨 Decoração interna com pinturas de Eliseu Visconti",
            "🎵 Palco de grandes artistas como Caruso, Nijinsky e Isadora Duncan"
        ]
    },
    {
        id: 5,
        nome: "Arcos da Lapa",
        categoria: "monument",
        coords: [-22.913034, -43.179956],
        periodo: "1750",
        descricao: "Aqueduto colonial que se tornou símbolo do Rio de Janeiro, hoje serve como viaduto para o bondinho de Santa Teresa.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "🚰 Originalmente um aqueduto que trazia água para o centro",
            "🚋 Desde 1896 serve como viaduto para os bondes de Santa Teresa",
            "🎨 Cenário de inúmeros filmes e cartões-postais do Rio"
        ]
    },
    {
        id: 6,
        nome: "Paço Imperial",
        categoria: "palace",
        coords: [-22.903589, -43.174169],
        periodo: "1743",
        descricao: "Antigo palácio dos governadores coloniais e depois residência da família real portuguesa no Brasil.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "👑 Residência de D. João VI quando chegou ao Brasil em 1808",
            "📜 Local onde foi assinada a Lei Áurea em 1888",
            "🎨 Hoje funciona como centro cultural com exposições"
        ]
    },
    {
        id: 7,
        nome: "Mosteiro de São Bento",
        categoria: "church",
        coords: [-22.897070, -43.177943],
        periodo: "1590",
        descricao: "Um dos mais antigos mosteiros do Brasil, fundado pelos monges beneditinos, guardião de tesouros artísticos coloniais.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "🎵 Mantém a tradição dos cantos gregorianos há mais de 400 anos",
            "🏗️ Interior é um dos mais ricos exemplos do barroco brasileiro",
            "📚 Possui uma das mais antigas bibliotecas do Brasil"
        ]
    },
    {
        id: 8,
        nome: "Casa França-Brasil",
        categoria: "culture",
        coords: [-22.900557, -43.175937],
        periodo: "1820",
        descricao: "Antigo mercado colonial transformado em centro cultural, exemplo da arquitetura neoclássica no Brasil.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "🏛️ Projeto do arquiteto francês Grandjean de Montigny",
            "🛒 Era o antigo mercado da cidade no século XIX",
            "🎨 Hoje abriga exposições de arte contemporânea"
        ]
    },
    {
        id: 9,
        nome: "Forte de Copacabana",
        categoria: "monument",
        coords: [-22.986439, -43.187200],
        periodo: "1914",
        descricao: "Fortificação militar construída para defender a entrada da Baía de Guanabara, palco da revolta dos 18 do Forte.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "⚔️ Palco da histórica 'Revolta dos 18 do Forte' em 1922",
            "🔫 Possui canhões Krupp de 1906 ainda preservados",
            "🌊 Oferece uma das vistas mais espetaculares de Copacabana"
        ]
    },
    {
        id: 10,
        nome: "Real Gabinete Português de Leitura",
        categoria: "culture",
        coords: [-22.905354, -43.182213],
        periodo: "1887",
        descricao: "Biblioteca com a maior coleção de literatura portuguesa fora de Portugal, em edifício de arquitetura neomanuelina.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "📚 Maior acervo de literatura portuguesa fora de Portugal",
            "🏰 Arquitetura neomanuelina única no Rio de Janeiro",
            "📖 Possui mais de 350.000 volumes raros"
        ]
    },
    {
        id: 11,
        nome: "Centro Cultural Banco do Brasil",
        categoria: "culture",
        coords: [-22.901052, -43.176287],
        periodo: "1906",
        descricao: "Antigo edifício do Banco do Brasil transformado em um dos principais centros culturais do país.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "🏛️ Arquitetura eclética do início do século XX",
            "🎨 Um dos centros culturais mais visitados do Brasil",
            "💰 Era a sede do Banco do Brasil até os anos 1960"
        ]
    },
    {
        id: 12,
        nome: "Confeitaria Colombo",
        categoria: "culture",
        coords: [-22.90087, -43.17652],
        periodo: "1894",
        descricao: "Histórica confeitaria que preserva a Belle Époque carioca, frequentada pela elite da época.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "☕ Frequentada por escritores como Machado de Assis",
            "🪞 Espelhos belgas e móveis importados da Europa",
            "🍰 Receitas tradicionais preservadas há mais de 100 anos"
        ]
    },
    {
        id: 13,
        nome: "Biblioteca Nacional",
        categoria: "library",
        coords: [-22.909703, -43.175377],
        periodo: "1810",
        descricao: "Maior biblioteca da América Latina, criada por D. João VI. Possui um dos maiores acervos bibliográficos do mundo.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "📚 Mais de 15 milhões de itens no acervo",
            "👑 Origem no acervo real trazido pela família real portuguesa",
            "🏛️ Edifício atual inaugurado em 1910, projeto eclético de Francisco Marcelino de Souza Aguiar"
        ]
    },
    {
        id: 14,
        nome: "Arquivo Nacional",
        categoria: "library",
        coords: [-22.906500, -43.190767],
        periodo: "1838",
        descricao: "Importante instituição que preserva a memória documental do Brasil, com documentos desde o período colonial.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "📜 Maior arquivo público da América Latina",
            "⚖️ Guarda documentos fundamentais da história do Brasil",
            "🏛️ Localizado no antigo prédio da Casa da Moeda"
        ]
    },
    {
        id: 15,
        nome: "Palácio Tiradentes",
        categoria: "palace",
        coords: [-22.903901, -43.173876],
        periodo: "1926",
        descricao: "Antiga sede da Câmara dos Deputados e da Assembleia Legislativa do Estado do Rio de Janeiro, hoje abriga o poder legislativo estadual.",
        curiosidades: [
            "🏛️ Construído no local onde Tiradentes foi enforcado em 1792",
            "⚖️ Sede da Câmara dos Deputados de 1926 a 1960",
            "🎨 Belíssimo hall com vitrais e escadaria em mármore"
        ],
        linhaTempo: [
            {
                ano: "1792",
                titulo: "Execução de Tiradentes",
                descricao: "Local onde Joaquim José da Silva Xavier foi enforcado",
                imagem: "https://via.placeholder.com/300x200/8B0000/FFFFFF?text=Execução+Tiradentes+1792"
            },
            {
                ano: "1926",
                titulo: "Construção do Palácio",
                descricao: "Inauguração como sede da Câmara dos Deputados",
                imagem: "https://via.placeholder.com/300x200/4169E1/FFFFFF?text=Inauguração+Palácio+1926"
            },
            {
                ano: "1960",
                titulo: "Mudança da Capital",
                descricao: "Brasília torna-se capital, palácio muda função",
                imagem: "https://via.placeholder.com/300x200/FFD700/000000?text=Mudança+Capital+1960"
            },
            {
                ano: "2024",
                titulo: "Atualidade",
                descricao: "Sede da Assembleia Legislativa do Estado do Rio",
                imagem: "https://via.placeholder.com/300x200/32CD32/FFFFFF?text=ALERJ+Atual+2024"
            }
        ],
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ]
    },
    {
        id: 16,
        nome: "Palácio Duque de Caxias",
        categoria: "palace",
        coords: [-22.902824, -43.189016],
        periodo: "1941",
        descricao: "Antigo Ministério da Guerra, hoje Comando Militar do Leste. Importante edifício da arquitetura oficial brasileira.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "⚔️ Era a sede do Ministério da Guerra até 1999",
            "🏛️ Arquitetura art déco dos anos 1940",
            "🎖️ Nome homenageia o Duque de Caxias, patrono do Exército"
        ]
    },
    {
        id: 17,
        nome: "Igreja de São Francisco da Penitência",
        categoria: "church",
        coords: [-22.906899, -43.179261],
        periodo: "1773",
        descricao: "Igreja famosa por seu interior completamente revestido em ouro, considerada uma das mais belas do Brasil colonial.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "✨ Interior completamente folheado a ouro",
            "🎨 Pinturas no teto de Caetano da Costa Coelho",
            "⛪ Construída pela Ordem Terceira de São Francisco"
        ]
    },
    {
        id: 18,
        nome: "Igreja do Carmo da Antiga Sé",
        categoria: "church",
        coords: [-22.90329, -43.17543],
        periodo: "1761",
        descricao: "Antiga catedral do Rio de Janeiro onde D. Pedro I foi coroado imperador do Brasil em 1822.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "👑 Local da coroação de D. Pedro I como imperador em 1822",
            "💒 Casamento de D. Pedro I com D. Leopoldina em 1817",
            "⛪ Foi a catedral do Rio até 1976"
        ]
    },
    {
        id: 24,
        nome: "Centro Cultural PGE-RJ (Antigo Convento do Carmo)",
        categoria: "culture",
        coords: [-22.90366, -43.17567],
        periodo: "Século XVII",
        descricao: "O Centro Cultural PGE-RJ está situado no histórico e restaurado antigo Convento do Carmo, um edifício do século XVII que foi residência de D. Maria I e é uma das mais antigas construções do Rio de Janeiro.",
        curiosidades: [
            "🏰 Antigo Convento do Carmo, uma das construções mais antigas do Rio de Janeiro",
            "👑 Serviu como residência da rainha D. Maria I durante a vinda da Família Real",
            "🎨 Abriga a exposição 'Composição Carioca' e outros espaços culturais",
            "📚 Possui quatro bibliotecas, cinco salas de aula e uma sala de debate",
            "🍽️ Conta com bistrô e tours guiados pelo edifício histórico",
            "🎭 Promove arte brasileira e democratiza o acesso à cultura",
            "🏛️ Restaurado pela PGE-RJ para valorizar o patrimônio histórico"
        ],
        linhaTempo: [
            {
                ano: "1761",
                titulo: "Construção Original",
                descricao: "Convento do Carmo é fundado pelos frades carmelitas",
                imagem: "https://via.placeholder.com/300x200/8B4513/FFFFFF?text=Convento+Original+1761"
            },
            {
                ano: "1808",
                titulo: "Residência Real",
                descricao: "Serviu como residência da rainha D. Maria I",
                imagem: "https://via.placeholder.com/300x200/4169E1/FFFFFF?text=Residência+Real+1808"
            },
            {
                ano: "1950",
                titulo: "Século XX",
                descricao: "Período de declínio e necessidade de restauração",
                imagem: "https://via.placeholder.com/300x200/696969/FFFFFF?text=Período+Declínio+1950"
            },
            {
                ano: "2010",
                titulo: "Centro Cultural",
                descricao: "Restaurado e transformado em centro cultural pela PGE-RJ",
                imagem: "https://via.placeholder.com/300x200/32CD32/FFFFFF?text=Centro+Cultural+2010"
            }
        ],
        galeria: [
            "https://i.imgur.com/vguYQN3.jpeg",
            "https://i.imgur.com/oiSL0zO.jpeg",
            "https://i.imgur.com/HcgtYAb.jpeg"
        ]
    },
    {
        id: 19,
        nome: "Museu de Arte do Rio (MAR)",
        categoria: "museum",
        coords: [-22.89658, -43.18196],
        periodo: "2013",
        descricao: "Museu dedicado à arte, cultura e história do Rio de Janeiro, localizado na revitalizada Praça Mauá.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "🎨 Integra dois edifícios: o Palacete Dom João VI e a Escola do Olhar",
            "🌊 Foca na arte e cultura carioca em diálogo com o mundo",
            "🏗️ Parte do projeto de revitalização da zona portuária"
        ]
    },
    {
        id: 20,
        nome: "Museu do Amanhã",
        categoria: "museum",
        coords: [-22.89385, -43.17941],
        periodo: "2015",
        descricao: "Museu de ciências aplicadas que explora as possibilidades de construção do futuro a partir das escolhas de hoje.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "🚀 Projeto arquitetônico futurista de Santiago Calatrava",
            "🌱 Foco em sustentabilidade e futuro da humanidade",
            "💧 Estrutura que coleta água da chuva e usa energia solar"
        ]
    },
    {
        id: 21,
        nome: "Museu Histórico Nacional",
        categoria: "museum",
        coords: [-22.90553, -43.16967],
        periodo: "1922",
        descricao: "Um dos museus mais completos sobre a história do Brasil, instalado no antigo Arsenal de Guerra e Forte de Santiago.",
        galeria: [
            "https://i.imgur.com/vguYQN3.jpeg",
            "https://i.imgur.com/oiSL0zO.jpeg",
            "https://i.imgur.com/HcgtYAb.jpeg"
        ],
        curiosidades: [
            "🏰 Localizado no antigo Arsenal de Guerra da Ponta do Calabouço",
            "⚔️ Maior acervo de história do Brasil",
            "🎭 Criado em 1922 para as comemorações do centenário da Independência"
        ]
    },
    {
        id: 22,
        nome: "Praça XV",
        categoria: "square",
        coords: [-22.90270, -43.17331],
        periodo: "1743",
        descricao: "Marco histórico da cidade, palco de importantes eventos da história brasileira, próxima ao Paço Imperial.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "👑 Local de desembarque da família real portuguesa em 1808",
            "🎪 Palco da Proclamação da República em 1889",
            "⛲ Chafariz do Mestre Valentim, uma das primeiras obras de arte pública do Brasil"
        ]
    },
    {
        id: 23,
        nome: "Ilha Fiscal",
        categoria: "square",
        coords: [-22.89615, -43.16694],
        periodo: "1889",
        descricao: "Pequena ilha na Baía de Guanabara, famosa pelo último grande baile do Império brasileiro em 1889.",
        galeria: [
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg",
            "https://i.imgur.com/aAQt0f3.jpeg"
        ],
        curiosidades: [
            "💃 Palco do famoso 'Baile da Ilha Fiscal' em 9 de novembro de 1889",
            "👑 Último grande evento social do Império, dias antes da Proclamação da República",
            "🏰 Construção em estilo neogótico, projeto de Adolfo del Vecchio"
        ]
    }
];

// ===== CONFIGURAÇÃO DO MAPA =====
let map;
let marcadores = [];
let filtroAtivo = 'all';

// Cores por categoria
const coresCategorias = {
    museum: '#3498db',
    bunker: '#e74c3c',
    monument: '#f39c12',
    church: '#9b59b6',
    palace: '#1abc9c',
    culture: '#e67e22',
    fort: '#27ae60',
    library: '#9932CC',
    square: '#20B2AA'
};

// Curiosidades por categoria
const curiosidadesCategorias = {
    all: {
        titulo: "Centro Histórico do Rio de Janeiro",
        curiosidade: "O centro histórico do Rio possui mais de 400 anos de história e é considerado Patrimônio Cultural da Humanidade pela UNESCO! Aqui você encontrará desde construções coloniais do século XVI até arquitetura moderna do século XXI."
    },
    museum: {
        titulo: "Museus do Rio",
        curiosidade: "O Rio possui mais de 80 museus! Desde o Museu Nacional de Belas Artes com sua coleção imperial até museus ultra-modernos como o Museu do Amanhã, a cidade oferece um verdadeiro tesouro cultural."
    },
    bunker: {
        titulo: "Bunkers da Segunda Guerra",
        curiosidade: "Durante a Segunda Guerra Mundial, o Rio construiu diversos abrigos antiaéreos após os ataques alemães aos navios brasileiros. Estes bunkers podiam proteger centenas de pessoas e possuem paredes de concreto de até 2 metros de espessura!"
    },
    monument: {
        titulo: "Monumentos Históricos",
        curiosidade: "Os monumentos do centro do Rio contam a história de mais de 4 séculos! Dos aquedutos coloniais aos marcos republicanos, cada estrutura representa um período único da história brasileira."
    },
    church: {
        titulo: "Igrejas Históricas",
        curiosidade: "O Rio possui algumas das igrejas mais antigas e ricas do Brasil! A Igreja de São Francisco da Penitência tem seu interior completamente folheado a ouro, enquanto a Igreja do Carmo foi palco da coroação de D. Pedro I."
    },
    palace: {
        titulo: "Palácios",
        curiosidade: "Os palácios do centro guardam memórias da época imperial! O Paço Imperial foi residência da família real portuguesa e testemunhou eventos históricos como a assinatura da Lei Áurea em 1888."
    },
    culture: {
        titulo: "Espaços Culturais",
        curiosidade: "O centro do Rio é um dos maiores pólos culturais da América Latina! Do histórico Theatro Municipal inspirado na Ópera de Paris até centros culturais modernos, a região oferece arte e cultura para todos os gostos."
    },
    library: {
        titulo: "Bibliotecas e Arquivos",
        curiosidade: "O Rio abriga a maior biblioteca da América Latina! A Biblioteca Nacional possui mais de 15 milhões de itens, incluindo manuscritos raros trazidos pela família real portuguesa em 1808."
    },
    square: {
        titulo: "Praças e Espaços Públicos",
        curiosidade: "As praças do centro são palcos da história brasileira! A Praça XV testemunhou a chegada da família real em 1808 e a Proclamação da República em 1889. Já a Ilha Fiscal foi cenário do último grande baile do Império!"
    }
};

// ===== INICIALIZAR MAPA =====
function initMap() {
    // Criar mapa centrado no centro do Rio
    map = L.map('map').setView([-22.9068, -43.1729], 15);

    // Adicionar camada de satélite (Esri)
    L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19
    }).addTo(map);

    // Criar marcadores
    criarMarcadores();

    // Esconder loading e garantir recálculo de tamanho do mapa
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
        // Garante que o Leaflet calcule o tamanho correto após animações/layout
        setTimeout(() => {
            if (map && typeof map.invalidateSize === 'function') {
                map.invalidateSize();
            }
        }, 150);
    }, 800);
}

// ===== CRIAR MARCADORES =====
function criarMarcadores() {
    pontosHistoricos.forEach(ponto => {
        // Criar ícone personalizado
        const iconHtml = `
            <div style="
                background-color: ${coresCategorias[ponto.categoria] || '#FFD700'};
                width: 25px;
                height: 25px;
                border-radius: 50%;
                border: 3px solid white;
                box-shadow: 0 2px 10px rgba(0,0,0,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: bold;
                font-size: 12px;
            ">${ponto.id}</div>
        `;

        const marcador = L.marker(ponto.coords, {
            icon: L.divIcon({
                className: 'marcador-personalizado',
                html: iconHtml,
                iconSize: [25, 25],
                iconAnchor: [12, 12]
            })
        }).addTo(map);

        // Popup com informações completas - contraste garantido usando !important no CSS
        let popupContent = `
            <div class="popup-container">
                <h3 class="popup-title">${ponto.nome}</h3>
                <p class="popup-subtitle">📅 ${ponto.periodo}</p>`;
        
        // Adicionar galeria de imagens se existir
        if (ponto.galeria && ponto.galeria.length > 0) {
            popupContent += `
                <div class="popup-galeria">
                    ${gerarGaleriaImagens(ponto.galeria)}
                </div>`;
        }
        
        popupContent += `
                <p class="popup-description">${ponto.descricao}</p>
                <button onclick="mostrarDetalhes(${ponto.id})" class="popup-button">
                    📖 Ver Detalhes Completos
                </button>
            </div>
        `;
        
        marcador.bindPopup(popupContent);
        
        // Evento para inicializar a galeria quando o popup for aberto
        marcador.on('popupopen', function() {
            inicializarGaleriaImagens();
        });

        // Evento de clique
        marcador.on('click', () => {
            mostrarDetalhes(ponto.id);
        });

        // Armazenar marcador
        marcador.pontoData = ponto;
        marcadores.push(marcador);
    });
}

// ===== GERAR GALERIA DE IMAGENS =====
function gerarGaleriaImagens(galeria) {
    if (!galeria || galeria.length === 0) return '';
    
    return `
        <div class="imagens-galeria-container">
            <div class="imagens-galeria-scroll" id="galeria-scroll">
                ${galeria.map((imagem, index) => `
                    <div class="imagem-item" style="--index: ${index}; position: relative; left: 0;">
                        <img src="${imagem}" alt="Imagem histórica ${index + 1}" class="imagem-galeria" loading="eager" onerror="this.onerror=null; this.src='https://via.placeholder.com/300x200/CCCCCC/333333?text=Imagem+${index+1}';">
                    </div>
                `).join('')}
            </div>
            <div class="galeria-controles">
                ${galeria.map((_, index) => `
                    <span class="galeria-indicador" data-index="${index}" onclick="mudarImagemGaleria(this, ${index})"></span>
                `).join('')}
            </div>
        </div>
    `;
}

// ===== GERAR GALERIA DA LINHA DO TEMPO =====
function gerarGaleriaLinhaTempo(linhaTempo) {
    if (!linhaTempo || linhaTempo.length === 0) return '';
    
    return `
        <div class="timeline-gallery">
            <h4 class="timeline-title">
                <i class="fas fa-history"></i>
                Linha do Tempo
            </h4>
            <div class="timeline-container">
                ${linhaTempo.map((periodo, index) => `
                    <div class="timeline-item" data-index="${index}">
                        <div class="timeline-image">
                            <img src="${periodo.imagem}" 
                                 alt="${periodo.titulo}" 
                                 onclick="abrirImagemGaleria(${index}, ${JSON.stringify(linhaTempo).replace(/"/g, '&quot;')})"
                                 style="width: 100%; height: 120px; object-fit: cover; border-radius: 8px; cursor: pointer; transition: transform 0.3s ease;">
                        </div>
                        <div class="timeline-content">
                            <span class="timeline-year">${periodo.ano}</span>
                            <h5 class="timeline-period-title">${periodo.titulo}</h5>
                            <p class="timeline-description">${periodo.descricao}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// ===== ABRIR IMAGEM DA GALERIA =====
function abrirImagemGaleria(index, linhaTempo) {
    const modal = document.createElement('div');
    modal.className = 'image-modal';
    modal.innerHTML = `
        <div class="modal-backdrop" onclick="fecharImagemGaleria()"></div>
        <div class="modal-content">
            <button class="modal-close" onclick="fecharImagemGaleria()">
                <i class="fas fa-times"></i>
            </button>
            <div class="modal-gallery">
                <div class="gallery-navigation">
                    <button class="nav-btn prev" onclick="navegarGaleria(-1)" ${index === 0 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="nav-btn next" onclick="navegarGaleria(1)" ${index === linhaTempo.length - 1 ? 'disabled' : ''}>
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
                <div class="gallery-image">
                    <img src="${linhaTempo[index].imagem}" alt="${linhaTempo[index].titulo}">
                </div>
                <div class="gallery-info">
                    <h3>${linhaTempo[index].ano} - ${linhaTempo[index].titulo}</h3>
                    <p>${linhaTempo[index].descricao}</p>
                </div>
                <div class="gallery-thumbnails">
                    ${linhaTempo.map((periodo, i) => `
                        <img src="${periodo.imagem}" 
                             alt="${periodo.titulo}"
                             class="thumbnail ${i === index ? 'active' : ''}"
                             onclick="navegarParaImagem(${i})">
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    modal.galeriaAtual = linhaTempo;
    modal.indiceAtual = index;
    
    // Animate in
    setTimeout(() => modal.classList.add('active'), 10);
}

// ===== NAVEGAÇÃO DA GALERIA =====
function navegarGaleria(direcao) {
    const modal = document.querySelector('.image-modal');
    if (!modal) return;
    
    const novoIndice = modal.indiceAtual + direcao;
    if (novoIndice >= 0 && novoIndice < modal.galeriaAtual.length) {
        navegarParaImagem(novoIndice);
    }
}

function navegarParaImagem(indice) {
    const modal = document.querySelector('.image-modal');
    if (!modal) return;
    
    modal.indiceAtual = indice;
    const periodo = modal.galeriaAtual[indice];
    
    // Atualizar imagem
    const img = modal.querySelector('.gallery-image img');
    img.src = periodo.imagem;
    img.alt = periodo.titulo;
    
    // Atualizar informações
    const info = modal.querySelector('.gallery-info');
    info.innerHTML = `
        <h3>${periodo.ano} - ${periodo.titulo}</h3>
        <p>${periodo.descricao}</p>
    `;
    
    // Atualizar thumbnails
    modal.querySelectorAll('.thumbnail').forEach((thumb, i) => {
        thumb.classList.toggle('active', i === indice);
    });
    
    // Atualizar botões de navegação
    const prevBtn = modal.querySelector('.nav-btn.prev');
    const nextBtn = modal.querySelector('.nav-btn.next');
    prevBtn.disabled = indice === 0;
    nextBtn.disabled = indice === modal.galeriaAtual.length - 1;
}

// ===== FECHAR GALERIA =====
function fecharImagemGaleria() {
    const modal = document.querySelector('.image-modal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => modal.remove(), 300);
    }
}

// ===== MOSTRAR DETALHES =====
function mostrarDetalhes(id) {
    const ponto = pontosHistoricos.find(p => p.id === id);
    if (!ponto) return;

    // Centralizar no ponto
    map.setView(ponto.coords, 17);

    // Mostrar informações na sidebar
    const infoSection = document.getElementById('infoSection');
    infoSection.style.display = 'block';
    
    // Verificar se o ponto tem linha do tempo e galeria
    const temLinhaTempo = ponto.linhaTempo && ponto.linhaTempo.length > 0;
    const temGaleria = ponto.galeria && ponto.galeria.length > 0;
    
    infoSection.innerHTML = `
        <div class="info-panel">
            <h3 class="info-title">${ponto.nome}</h3>
            <p class="info-subtitle">📅 ${ponto.periodo}</p>
            
            ${temGaleria ? gerarGaleriaImagens(ponto.galeria) : ''}
            
            <p class="info-description">${ponto.descricao}</p>
            
            ${temLinhaTempo ? gerarGaleriaLinhaTempo(ponto.linhaTempo) : ''}
            
            <div class="curiosities-grid">
                ${ponto.curiosidades.map(curiosidade => `
                    <div class="curiosity-item">
                        <p class="curiosity-text">${curiosidade}</p>
                    </div>
                `).join('')}
            </div>
            
            <button class="back-btn" onclick="voltarInicio()">
                <i class="fas fa-arrow-left"></i>
                Voltar
            </button>
        </div>
    `;
    
    // Inicializar a galeria de imagens se existir
    if (temGaleria) {
        inicializarGaleriaImagens();
    }
}

// ===== FUNÇÕES DE NAVEGAÇÃO =====
function voltarInicio() {
    map.setView([-22.9068, -43.1729], 15);
    
    // Hide info panel
    const infoSection = document.getElementById('infoSection');
    infoSection.style.display = 'none';
    infoSection.innerHTML = '';
    
    // Reset filters
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelector('.filter-btn').classList.add('active');
    filtroAtivo = 'all';
    aplicarFiltros();
}

function resetMap() {
    voltarInicio();
}

function resetView() {
    resetMap();
}

function toggleSidebar() {
    // Mobile functionality if needed
    console.log('Sidebar toggle - new design already responsive');
}

// ===== MOSTRAR CURIOSIDADE DA CATEGORIA =====
function mostrarCuriosidadeCategoria(categoria) {
    const info = curiosidadesCategorias[categoria];
    if (!info) return;

    const infoSection = document.getElementById('infoSection');
    infoSection.style.display = 'block';
    infoSection.innerHTML = `
        <div class="info-panel">
            <h3 class="info-title">${info.titulo}</h3>
            <p class="info-description">${info.curiosidade}</p>
            
            <div class="curiosity-item">
                <p class="curiosity-text">💡 Clique nos marcadores <span style="color: ${coresCategorias[categoria] || '#FFD700'};">●</span> para descobrir mais detalhes!</p>
            </div>
            
            <button class="back-btn" onclick="voltarInicio()">
                <i class="fas fa-arrow-left"></i>
                Voltar
            </button>
        </div>
    `;
}

// ===== MOSTRAR HISTÓRIA DO RIO DE JANEIRO =====
function mostrarHistoriaRJ() {
    // Remover classe active de todos os filtros
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    
    // Mostrar todos os pontos
    filtroAtivo = 'all';
    aplicarFiltros();

    const infoSection = document.getElementById('infoSection');
    infoSection.style.display = 'block';
    infoSection.innerHTML = `
        <div class="info-panel">
            <h3 class="info-title">🏛️ História do Rio de Janeiro</h3>
            <p class="info-subtitle">Dos povos indígenas à cidade maravilhosa</p>
            
            <!-- Vídeo Histórico -->
            <div style="margin-bottom: 20px; text-align: center;">
                <video controls style="width: 100%; max-width: 300px; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,123,255,0.3);">
                    <source src="https://i.imgur.com/3SMRrOl.mp4" type="video/mp4">
                    Seu navegador não suporta o elemento de vídeo.
                </video>
            </div>
            
            <div style="background: linear-gradient(135deg, rgba(0,123,255,0.1), rgba(25,25,112,0.1)); border: 1px solid rgba(0,123,255,0.3); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                <h4 style="color: var(--primary-400); margin-bottom: 12px; font-size: 1.1rem; text-align: center;">🗓️ Linha do Tempo da História Carioca</h4>
            </div>
            
            <div class="curiosities-grid">
                <!-- Período Pré-Colonial -->
                <div class="curiosity-item">
                    <h4 style="color: var(--primary-400); margin-bottom: 10px; font-size: 1rem; cursor: pointer; text-decoration: underline;" onclick="mostrarPeriodoHistorico('precolonial')">🌿 Período Pré-Colonial (até 1565)</h4>
                    <div style="margin-left: 10px;">
                        <p class="curiosity-text">• <strong>Povos Tupinambás:</strong> Habitantes originais da região</p>
                        <p class="curiosity-text">• <strong>Chegada dos Portugueses (1502):</strong> Expedição de Gaspar de Lemos</p>
                        <p class="curiosity-text">• <strong>Invasões Francesas:</strong> França Antártica (1555-1567)</p>
                        <p class="curiosity-text">• <strong>Estácio de Sá (1565):</strong> Fundação da cidade</p>
                    </div>
                </div>
                
                <!-- Período Colonial -->
                <div class="curiosity-item">
                    <h4 style="color: var(--primary-400); margin-bottom: 10px; font-size: 1rem; cursor: pointer; text-decoration: underline;" onclick="mostrarPeriodoHistorico('colonial')">⛪ Período Colonial (1565-1808)</h4>
                    <div style="margin-left: 10px;">
                        <p class="curiosity-text">• <strong>São Sebastião do Rio de Janeiro:</strong> Nome oficial da cidade</p>
                        <p class="curiosity-text">• <strong>Porto do Açúcar:</strong> Principal porto exportador do Brasil</p>
                        <p class="curiosity-text">• <strong>Ouro de Minas:</strong> Rio como porta de entrada e saída</p>
                        <p class="curiosity-text">• <strong>Arquitetura Colonial:</strong> Igrejas, conventos e casarões</p>
                    </div>
                </div>
                
                <!-- Período Imperial -->
                <div class="curiosity-item">
                    <h4 style="color: var(--primary-400); margin-bottom: 10px; font-size: 1rem; cursor: pointer; text-decoration: underline;" onclick="mostrarPeriodoHistorico('imperial')">👑 Período Imperial (1808-1889)</h4>
                    <div style="margin-left: 10px;">
                        <p class="curiosity-text">• <strong>Chegada da Corte (1808):</strong> Rio vira capital do Império Português</p>
                        <p class="curiosity-text">• <strong>Independência (1822):</strong> Capital do Império do Brasil</p>
                        <p class="curiosity-text">• <strong>Reformas Urbanas:</strong> Modernização da cidade</p>
                        <p class="curiosity-text">• <strong>Abolição da Escravatura (1888):</strong> Assinada no Paço Imperial</p>
                    </div>
                </div>
                
                <!-- Período Republicano -->
                <div class="curiosity-item">
                    <h4 style="color: var(--primary-400); margin-bottom: 10px; font-size: 1rem; cursor: pointer; text-decoration: underline;" onclick="mostrarPeriodoHistorico('republicano')">🏛️ Período Republicano (1889-1960)</h4>
                    <div style="margin-left: 10px;">
                        <p class="curiosity-text">• <strong>Proclamação da República (1889):</strong> Fim do Império</p>
                        <p class="curiosity-text">• <strong>Reforma Pereira Passos (1902-1906):</strong> "Bota-abaixo" - modernização urbana</p>
                        <p class="curiosity-text">• <strong>Revolta da Vacina (1904):</strong> Resistência popular às reformas sanitárias</p>
                        <p class="curiosity-text">• <strong>Capital Federal:</strong> Sede do governo brasileiro</p>
                    </div>
                </div>
                
                <!-- Era Moderna -->
                <div class="curiosity-item">
                    <h4 style="color: var(--primary-400); margin-bottom: 10px; font-size: 1rem; cursor: pointer; text-decoration: underline;" onclick="mostrarPeriodoHistorico('moderno')">🌆 Era Moderna (1960-presente)</h4>
                    <div style="margin-left: 10px;">
                        <p class="curiosity-text">• <strong>Transferência da Capital (1960):</strong> Brasília torna-se capital</p>
                        <p class="curiosity-text">• <strong>Estado da Guanabara (1960-1975):</strong> Cidade-estado independente</p>
                        <p class="curiosity-text">• <strong>Fusão com o Estado do Rio (1975):</strong> Rio de Janeiro atual</p>
                        <p class="curiosity-text">• <strong>Patrimônio Mundial (2012):</strong> Paisagem Cultural Carioca - UNESCO</p>
                        <p class="curiosity-text">• <strong>Olimpíadas (2016):</strong> Primeira cidade sul-americana a sediar</p>
                    </div>
                </div>
                
                <!-- Curiosidades Gerais -->
                <div class="curiosity-item">
                    <h4 style="color: var(--primary-400); margin-bottom: 8px; font-size: 1rem;">🎭 Cultura e Tradições</h4>
                    <p class="curiosity-text">• <strong>Carnaval Carioca:</strong> Maior festa popular do mundo</p>
                    <p class="curiosity-text">• <strong>Samba:</strong> Nasceu nos morros cariocas no início do século XX</p>
                    <p class="curiosity-text">• <strong>Bossa Nova:</strong> Movimento musical nascido em Ipanema</p>
                    <p class="curiosity-text">• <strong>Cristo Redentor:</strong> Uma das 7 Maravilhas do Mundo Moderno</p>
                    <p class="curiosity-text">• <strong>Copacabana e Ipanema:</strong> Praias mundialmente famosas</p>
                </div>
                
                <!-- Locais Históricos no Mapa -->
                <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px; margin: 15px 0;">
                    <h4 style="color: var(--primary-400); margin-bottom: 10px; font-size: 1rem;">🗺️ Principais Locais Históricos no Mapa</h4>
                    <p style="color: var(--neutral-200); font-size: 0.85rem; line-height: 1.4;">
                        🏛️ <strong>Paço Imperial:</strong> Sede do poder colonial e imperial<br>
                        ⛪ <strong>Mosteiro de São Bento:</strong> Joia do barroco brasileiro<br>
                        🏛️ <strong>Palácio Tiradentes:</strong> Assembleia Legislativa<br>
                        📚 <strong>Biblioteca Nacional:</strong> Acervo da família real<br>
                        🎭 <strong>Teatro Municipal:</strong> Símbolo da Belle Époque carioca<br>
                        ⛪ <strong>Catedral Metropolitana:</strong> Arquitetura moderna única
                    </p>
                </div>
            </div>
            
            <button class="back-btn" onclick="voltarInicio()">
                <i class="fas fa-arrow-left"></i>
                Voltar
            </button>
        </div>
    `;
}

// ===== MOSTRAR FAMÍLIA IMPERIAL =====
function toggleImperialFamily() {
    mostrarFamiliaImperial();
}

function mostrarFamiliaImperial() {
    // Remover classe active de todos os filtros
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    
    // Mostrar todos os pontos
    filtroAtivo = 'all';
    aplicarFiltros();

    const infoSection = document.getElementById('infoSection');
    infoSection.style.display = 'block';
    infoSection.innerHTML = `
        <div class="info-panel">
            <h3 class="info-title">👑 Família Imperial Brasileira</h3>
            <p class="info-subtitle">Quem você quer conhecer?</p>
            
            <!-- Vídeo Histórico -->
            <div style="margin-bottom: 20px; text-align: center;">
                <video controls style="width: 100%; max-width: 300px; border-radius: 8px; box-shadow: 0 4px 15px rgba(255,215,0,0.3);">
                    <source src="https://i.imgur.com/JfbP540.mp4" type="video/mp4">
                    Seu navegador não suporta o elemento de vídeo.
                </video>
            </div>
            
            <div style="background: linear-gradient(135deg, rgba(255,215,0,0.1), rgba(184,134,11,0.1)); border: 1px solid rgba(255,215,0,0.3); border-radius: 12px; padding: 16px; margin-bottom: 20px;">
                <h4 style="color: var(--accent-400); margin-bottom: 12px; font-size: 1.1rem; text-align: center;">📜 Principais da Família Real e Imperial do Brasil</h4>
            </div>
            
            <div class="curiosities-grid">
                <!-- Reino Unido de Portugal, Brasil e Algarves -->
                <div class="curiosity-item">
                    <h4 style="color: var(--accent-400); margin-bottom: 10px; font-size: 1rem;">🔹 Reino Unido de Portugal, Brasil e Algarves (1808–1822)</h4>
                    <div style="margin-left: 10px;">
                        <p class="curiosity-text">
                            <strong style="cursor: pointer; color: var(--accent-400); text-decoration: underline;" onclick="mostrarDetalhesPersonagem('djoao6')">👑 D. João VI (1767–1826)</strong> – Rei de Portugal e depois do Reino Unido.
                        </p>
                        <p class="curiosity-text">
                            <strong style="cursor: pointer; color: var(--accent-400); text-decoration: underline;" onclick="mostrarDetalhesPersonagem('carlota')">👸 D. Carlota Joaquina (1775–1830)</strong> – Rainha consorte.
                        </p>
                        <p class="curiosity-text" style="margin-top: 8px;"><em>Filho mais importante:</em></p>
                        <p class="curiosity-text">
                            <strong style="cursor: pointer; color: var(--accent-400); text-decoration: underline;" onclick="mostrarDetalhesPersonagem('pedro1')">🤴 D. Pedro de Alcântara (1798–1834)</strong> → Futuro D. Pedro I.
                        </p>
                    </div>
                </div>
                
                <!-- Império do Brasil -->
                <div class="curiosity-item">
                    <h4 style="color: var(--accent-400); margin-bottom: 10px; font-size: 1rem;">🔹 Império do Brasil (1822–1889)</h4>
                    <div style="margin-left: 10px;">
                        <p class="curiosity-text">
                            <strong style="cursor: pointer; color: var(--accent-400); text-decoration: underline;" onclick="mostrarDetalhesPersonagem('pedro1')">👑 D. Pedro I (1798–1834)</strong> – Primeiro Imperador do Brasil, proclamou a Independência (1822).
                        </p>
                        <p class="curiosity-text">
                            <strong style="cursor: pointer; color: var(--accent-400); text-decoration: underline;" onclick="mostrarDetalhesPersonagem('leopoldina')">👸 D. Leopoldina da Áustria (1797–1826)</strong> – Imperatriz, apoiou a Independência.
                        </p>
                        <p class="curiosity-text" style="margin-top: 8px;"><em>Filho mais importante:</em></p>
                        <p class="curiosity-text">
                            <strong style="cursor: pointer; color: var(--accent-400); text-decoration: underline;" onclick="mostrarDetalhesPersonagem('pedro2')">🤴 D. Pedro II (1825–1891)</strong> – Segundo e último Imperador do Brasil.
                        </p>
                    </div>
                </div>
                
                <!-- Segundo Reinado -->
                <div class="curiosity-item">
                    <h4 style="color: var(--accent-400); margin-bottom: 10px; font-size: 1rem;">🔹 Segundo Reinado (1840–1889)</h4>
                    <div style="margin-left: 10px;">
                        <p class="curiosity-text">
                            <strong style="cursor: pointer; color: var(--accent-400); text-decoration: underline;" onclick="mostrarDetalhesPersonagem('pedro2')">👑 D. Pedro II (1825–1891)</strong> – Governou por quase 50 anos.
                        </p>
                        <p class="curiosity-text">
                            <strong style="cursor: pointer; color: var(--accent-400); text-decoration: underline;" onclick="mostrarDetalhesPersonagem('teresa')">👸 D. Teresa Cristina (1822–1889)</strong> – Imperatriz, chamada de "Mãe dos Brasileiros".
                        </p>
                        <p class="curiosity-text" style="margin-top: 8px;"><em>Filha mais importante:</em></p>
                        <p class="curiosity-text">
                            <strong style="cursor: pointer; color: var(--accent-400); text-decoration: underline;" onclick="mostrarDetalhesPersonagem('isabel')">👸 Princesa Isabel (1846–1921)</strong> – Herdeira do trono, assinou a Lei Áurea (1888).
                        </p>
                    </div>
                </div>
                
                <!-- Contexto Histórico -->
                <div class="curiosity-item">
                    <h4 style="color: var(--accent-400); margin-bottom: 8px; font-size: 1rem;">🏛️ Contexto Histórico</h4>
                    <p class="curiosity-text">A Família Imperial Brasileira governou o Império do Brasil entre 1822 e 1889, desde a Independência do Brasil pelo então Príncipe Real, Pedro Alcântara de Bragança, que depois foi aclamado imperador como Pedro I do Brasil, até a deposição de Pedro II durante a Proclamação da República, em 1889.</p>
                </div>
                
                <!-- Casa de Orléans e Bragança -->
                <div class="curiosity-item">
                    <h4 style="color: var(--accent-400); margin-bottom: 8px; font-size: 1rem;">🏰 Casa de Orléans e Bragança</h4>
                    <p class="curiosity-text">Após a Proclamação da República, em 1889, e o fim da monarquia, a família imperial deixou de existir enquanto instituição do Estado. A Casa de Orléans e Bragança é tida por parte dos monarquistas como a atual dinastia imperial brasileira, com dois ramos: o <strong>Ramo de Petrópolis</strong> e o <strong>Ramo de Vassouras</strong>.</p>
                </div>
            </div>
            
            <!-- Locais Imperiais no Mapa -->
            <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 15px; margin: 15px 0;">
                <h4 style="color: var(--accent-400); margin-bottom: 10px; font-size: 1rem;">🗺️ Locais Imperiais no Mapa</h4>
                <p style="color: var(--neutral-200); font-size: 0.85rem; line-height: 1.4;">
                    🏛️ <strong>Paço Imperial:</strong> Residência de D. João VI<br>
                    ⛪ <strong>Igreja do Carmo:</strong> Coroação de D. Pedro I<br>
                    🏛️ <strong>Palácio Tiradentes:</strong> Construído onde Tiradentes foi executado<br>
                    📖 <strong>Biblioteca Nacional:</strong> Acervo trazido pela família real
                </p>
            </div>
            
            <button class="back-btn" onclick="voltarInicio()">
                <i class="fas fa-arrow-left"></i>
                Voltar
            </button>
        </div>
    `;
}

// Função para mostrar detalhes específicos de cada período histórico do Rio de Janeiro
function mostrarPeriodoHistorico(periodo) {
    const infoSection = document.getElementById('infoSection');
    let detalhes = '';
    
    switch(periodo) {
        case 'precolonial':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Debret_-_Sauvages_civilisés%2C_soldats_indiens_de_première_ligne.jpg/300px-Debret_-_Sauvages_civilisés%2C_soldats_indiens_de_première_ligne.jpg" 
                             alt="Povos Tupinambás" 
                             style="width: 250px; height: 180px; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,123,255,0.4); object-fit: cover;">
                    </div>
                    <h3 class="info-title">🌿 Período Pré-Colonial (até 1565)</h3>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🏹 Os Tupinambás</h4>
                        <p class="curiosity-text">Os Tupinambás eram os habitantes originais da região que hoje conhecemos como Rio de Janeiro. Viviam em aldeias ao longo da costa e tinham uma sociedade complexa e organizada.</p>
                        <p class="curiosity-text"><strong>Características:</strong> Praticavam agricultura, pesca e caça. Cultivavam mandioca, milho e batata-doce.</p>
                        <p class="curiosity-text"><strong>Organização:</strong> Viviam em ocas comunais, liderados por caciques e pajés.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">⛵ Chegada dos Portugueses (1502)</h4>
                        <p class="curiosity-text">Em 1º de janeiro de 1502, a expedição de Gaspar de Lemos avistou a entrada da Baía de Guanabara, pensando que fosse a foz de um rio. Por isso deram o nome de "Rio de Janeiro" (Rio de Janeiro).</p>
                        <p class="curiosity-text"><strong>Erro geográfico:</strong> Na verdade era uma baía, não um rio!</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🇫🇷 França Antártica (1555-1567)</h4>
                        <p class="curiosity-text">Os franceses, liderados por Nicolas Durand de Villegagnon, estabeleceram uma colônia na Ilha de Serigipe (atual Villegagnon) com o apoio dos Tupinambás.</p>
                        <p class="curiosity-text"><strong>Objetivo:</strong> Criar uma base francesa no Brasil e propagar o protestantismo.</p>
                        <p class="curiosity-text"><strong>Conflito:</strong> Portugueses lutaram para expulsar os franceses da região.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">⚔️ Fundação da Cidade (1565)</h4>
                        <p class="curiosity-text">Estácio de Sá, sobrinho do governador-geral Mem de Sá, fundou a cidade de São Sebastião do Rio de Janeiro em 1º de março de 1565, no Morro do Pão de Açúcar.</p>
                        <p class="curiosity-text"><strong>Nome:</strong> Homenagem ao rei D. Sebastião de Portugal.</p>
                        <p class="curiosity-text"><strong>Estratégia:</strong> Localização defensiva para expulsar os franceses.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarHistoriaRJ()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para História do Rio
                    </button>
                </div>
            `;
            break;
            
        case 'colonial':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6c/Debret_-_Rio_de_Janeiro_vu_du_chemin_de_Sainte-Thérèse.jpg/300px-Debret_-_Rio_de_Janeiro_vu_du_chemin_de_Sainte-Thérèse.jpg" 
                             alt="Rio Colonial" 
                             style="width: 250px; height: 180px; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,123,255,0.4); object-fit: cover;">
                    </div>
                    <h3 class="info-title">⛪ Período Colonial (1565-1808)</h3>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🏛️ Consolidação da Cidade</h4>
                        <p class="curiosity-text">Após a expulsão dos franceses, a cidade foi transferida para o atual centro histórico, numa planície mais adequada ao crescimento urbano.</p>
                        <p class="curiosity-text"><strong>Arquitetura:</strong> Construção de igrejas, conventos e casarões no estilo colonial português.</p>
                        <p class="curiosity-text"><strong>Traçado urbano:</strong> Ruas estreitas e irregulares, típicas das cidades coloniais.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🍃 Porto do Açúcar</h4>
                        <p class="curiosity-text">O Rio tornou-se o principal porto de exportação de açúcar do Brasil, trazendo grande prosperidade à cidade.</p>
                        <p class="curiosity-text"><strong>Economia:</strong> Baseada na plantation açucareira e no trabalho escravo.</p>
                        <p class="curiosity-text"><strong>Crescimento:</strong> A riqueza do açúcar financiou a construção de belos edifícios.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">⚱️ Era do Ouro (século XVIII)</h4>
                        <p class="curiosity-text">Com a descoberta de ouro em Minas Gerais, o Rio tornou-se a porta de entrada e saída das riquezas, aumentando ainda mais sua importância.</p>
                        <p class="curiosity-text"><strong>Caminho do Ouro:</strong> Estrada que ligava Minas Gerais ao Rio.</p>
                        <p class="curiosity-text"><strong>Casa da Moeda:</strong> Estabelecida no Rio para cunhar moedas de ouro.</p>
                        <p class="curiosity-text"><strong>Opulência:</strong> Construção de igrejas ricamente decoradas com ouro.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">👥 Sociedade Colonial</h4>
                        <p class="curiosity-text"><strong>Estratificação:</strong> Senhores de engenho, comerciantes, artesãos, escravos e homens livres pobres.</p>
                        <p class="curiosity-text"><strong>Escravidão:</strong> Base da economia e da sociedade colonial.</p>
                        <p class="curiosity-text"><strong>Religiosidade:</strong> Igreja Católica muito influente na vida social.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarHistoriaRJ()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para História do Rio
                    </button>
                </div>
            `;
            break;
            
        case 'imperial':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Debret_-_Desembarque_de_Dona_Leopoldina.jpg/300px-Debret_-_Desembarque_de_Dona_Leopoldina.jpg" 
                             alt="Chegada da Família Real" 
                             style="width: 250px; height: 180px; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,123,255,0.4); object-fit: cover;">
                    </div>
                    <h3 class="info-title">👑 Período Imperial (1808-1889)</h3>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🚢 Chegada da Família Real (1808)</h4>
                        <p class="curiosity-text">A vinda da família real portuguesa transformou o Rio na capital do Império Português, a única capital europeia fora da Europa!</p>
                        <p class="curiosity-text"><strong>Transformações:</strong> Abertura dos portos, criação de instituições, modernização urbana.</p>
                        <p class="curiosity-text"><strong>População:</strong> Cresceu de 50.000 para 100.000 habitantes rapidamente.</p>
                        <p class="curiosity-text"><strong>Cultura:</strong> Chegada de artistas, cientistas e intelectuais europeus.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🇧🇷 Capital do Império do Brasil</h4>
                        <p class="curiosity-text">Após a Independência em 1822, o Rio continuou como capital, agora do novo Império do Brasil.</p>
                        <p class="curiosity-text"><strong>Coroação:</strong> D. Pedro I foi coroado imperador na Igreja do Carmo.</p>
                        <p class="curiosity-text"><strong>Desenvolvimento:</strong> Construção de palácios, teatros e avenidas.</p>
                        <p class="curiosity-text"><strong>Imigração:</strong> Chegada de europeus e crescimento populacional.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🏗️ Reformas Urbanas</h4>
                        <p class="curiosity-text">O Rio passou por grandes transformações para se tornar uma capital moderna e digna do Império.</p>
                        <p class="curiosity-text"><strong>Aqueduto da Carioca:</strong> Abastecimento de água para a cidade.</p>
                        <p class="curiosity-text"><strong>Iluminação:</strong> Primeiros lampiões a gás nas ruas.</p>
                        <p class="curiosity-text"><strong>Transporte:</strong> Primeiras linhas de bonde e estradas de ferro.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">📜 Lei Áurea (1888)</h4>
                        <p class="curiosity-text">A abolição da escravatura foi assinada no Paço Imperial, marcando o fim de mais de 300 anos de escravidão no Brasil.</p>
                        <p class="curiosity-text"><strong>Princesa Isabel:</strong> Assinou a lei na ausência de Pedro II.</p>
                        <p class="curiosity-text"><strong>Transformação social:</strong> Liberdade para mais de 700.000 escravos.</p>
                        <p class="curiosity-text"><strong>Consequências:</strong> Mudanças profundas na sociedade e economia.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarHistoriaRJ()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para História do Rio
                    </button>
                </div>
            `;
            break;
            
        case 'republicano':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Avenida_Central_%28Av._Rio_Branco%29_1905_Augusto_Malta.jpg/300px-Avenida_Central_%28Av._Rio_Branco%29_1905_Augusto_Malta.jpg" 
                             alt="Reforma Pereira Passos" 
                             style="width: 250px; height: 180px; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,123,255,0.4); object-fit: cover;">
                    </div>
                    <h3 class="info-title">🏛️ Período Republicano (1889-1960)</h3>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">📯 Proclamação da República (1889)</h4>
                        <p class="curiosity-text">O fim do Império foi proclamado na Praça da Aclamação (hoje Praça da República), transformando o Rio na capital da nova República.</p>
                        <p class="curiosity-text"><strong>Mudanças:</strong> Fim da monarquia, separação Igreja-Estado, novo regime político.</p>
                        <p class="curiosity-text"><strong>Capital Federal:</strong> Rio continuou como sede do governo nacional.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🏗️ Reforma Pereira Passos (1902-1906)</h4>
                        <p class="curiosity-text">A maior reforma urbana da história do Rio, conhecida como "Bota-abaixo", transformou completamente o centro da cidade.</p>
                        <p class="curiosity-text"><strong>Avenida Central:</strong> Atual Av. Rio Branco, inspirada nos boulevards parisienses.</p>
                        <p class="curiosity-text"><strong>Saneamento:</strong> Combate às epidemias de febre amarela e varíola.</p>
                        <p class="curiosity-text"><strong>Modernização:</strong> Teatro Municipal, Biblioteca Nacional, novos edifícios públicos.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">💉 Revolta da Vacina (1904)</h4>
                        <p class="curiosity-text">A população se rebelou contra a vacinação obrigatória contra a varíola, gerando violentos confrontos nas ruas do Rio.</p>
                        <p class="curiosity-text"><strong>Oswaldo Cruz:</strong> Médico sanitarista responsável pelas reformas de saúde.</p>
                        <p class="curiosity-text"><strong>Resistência popular:</strong> Medo e desconfiança da população pobre.</p>
                        <p class="curiosity-text"><strong>Desfecho:</strong> Governo venceu, mas aprendeu a importância do diálogo social.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🎭 Belle Époque Carioca</h4>
                        <p class="curiosity-text">O início do século XX foi marcado pela elegância, modernidade e efervescência cultural.</p>
                        <p class="curiosity-text"><strong>Teatro Municipal:</strong> Palco da alta cultura carioca.</p>
                        <p class="curiosity-text"><strong>Moda francesa:</strong> Influência europeia nos costumes.</p>
                        <p class="curiosity-text"><strong>Carnaval:</strong> Primeiros blocos e cordões carnavalescos.</p>
                        <p class="curiosity-text"><strong>Imprensa:</strong> Jornais e revistas ilustradas.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🎵 Nascimento do Samba</h4>
                        <p class="curiosity-text">Nas primeiras décadas do século XX, nasceu nos morros cariocas o samba, que se tornaria símbolo da cultura brasileira.</p>
                        <p class="curiosity-text"><strong>"Pelo Telefone" (1917):</strong> Primeiro samba gravado, de Donga.</p>
                        <p class="curiosity-text"><strong>Tia Ciata:</strong> Importante figura na história do samba.</p>
                        <p class="curiosity-text"><strong>Escolas de Samba:</strong> Primeiras agremiações carnavalescas.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarHistoriaRJ()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para História do Rio
                    </button>
                </div>
            `;
            break;
            
        case 'moderno':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/02/Cristo_Redentor_-_Rio_de_Janeiro%2C_Brasil.jpg/200px-Cristo_Redentor_-_Rio_de_Janeiro%2C_Brasil.jpg" 
                             alt="Rio Moderno" 
                             style="width: 250px; height: 180px; border-radius: 12px; box-shadow: 0 8px 25px rgba(0,123,255,0.4); object-fit: cover;">
                    </div>
                    <h3 class="info-title">🌆 Era Moderna (1960-presente)</h3>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🏛️ Perda da Capital (1960)</h4>
                        <p class="curiosity-text">Com a inauguração de Brasília, o Rio perdeu o status de capital federal após quase 200 anos.</p>
                        <p class="curiosity-text"><strong>Impacto:</strong> Redução da importância política, mas manutenção da relevância cultural.</p>
                        <p class="curiosity-text"><strong>Guanabara:</strong> Rio tornou-se estado independente (1960-1975).</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🤝 Fusão (1975)</h4>
                        <p class="curiosity-text">Fusão entre o estado da Guanabara (cidade do Rio) e o antigo estado do Rio de Janeiro.</p>
                        <p class="curiosity-text"><strong>Nova capital:</strong> Rio de Janeiro tornou-se capital do estado unificado.</p>
                        <p class="curiosity-text"><strong>Desafios:</strong> Integração de duas estruturas administrativas diferentes.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🎶 Explosão Cultural</h4>
                        <p class="curiosity-text">O Rio consolidou-se como capital cultural do Brasil, exportando música, cinema e arte para o mundo.</p>
                        <p class="curiosity-text"><strong>Bossa Nova (1950s-60s):</strong> Tom Jobim, João Gilberto, "Garota de Ipanema".</p>
                        <p class="curiosity-text"><strong>Cinema Novo:</strong> Glauber Rocha e o novo cinema brasileiro.</p>
                        <p class="curiosity-text"><strong>Rock in Rio (1985):</strong> Maior festival de música do mundo.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🏆 Grandes Eventos</h4>
                        <p class="curiosity-text">O Rio tornou-se palco de grandes eventos mundiais, projetando a cidade internacionalmente.</p>
                        <p class="curiosity-text"><strong>ECO-92:</strong> Conferência das Nações Unidas sobre meio ambiente.</p>
                        <p class="curiosity-text"><strong>Copa do Mundo (2014):</strong> Final no Maracanã renovado.</p>
                        <p class="curiosity-text"><strong>Olimpíadas (2016):</strong> Primeira cidade sul-americana a sediar.</p>
                        <p class="curiosity-text"><strong>Cristo Redentor:</strong> Eleito uma das 7 Maravilhas do Mundo Moderno (2007).</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🌍 Patrimônio da Humanidade</h4>
                        <p class="curiosity-text">Em 2012, a Paisagem Cultural Carioca foi declarada Patrimônio Mundial da UNESCO.</p>
                        <p class="curiosity-text"><strong>Reconhecimento:</strong> Única cidade do mundo com paisagem urbana protegida pela UNESCO.</p>
                        <p class="curiosity-text"><strong>Elementos:</strong> Montanhas, mar, florestas e arquitetura integrados harmoniosamente.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--primary-400);">🎭 Rio Hoje</h4>
                        <p class="curiosity-text">O Rio continua sendo uma das cidades mais importantes do Brasil e um ícone mundial.</p>
                        <p class="curiosity-text"><strong>Turismo:</strong> Mais de 6 milhões de turistas por ano.</p>
                        <p class="curiosity-text"><strong>Cultura:</strong> Carnaval, museus, teatro, música, gastronomia.</p>
                        <p class="curiosity-text"><strong>Desafios:</strong> Desigualdade social, segurança pública, mobilidade urbana.</p>
                        <p class="curiosity-text"><strong>Futuro:</strong> Projetos de revitalização urbana e sustentabilidade.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarHistoriaRJ()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para História do Rio
                    </button>
                </div>
            `;
            break;
            
        default:
            detalhes = `
                <div class="info-panel">
                    <h3 class="info-title">❌ Período não encontrado</h3>
                    <p class="curiosity-text">Desculpe, não foi possível encontrar informações sobre este período.</p>
                    <button class="back-btn" onclick="mostrarHistoriaRJ()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para História do Rio
                    </button>
                </div>
            `;
    }
    
    infoSection.innerHTML = detalhes;
}

// ===== FILTROS =====
function filterCategory(categoria) {
    // Atualizar botão ativo
    document.querySelectorAll('.filter-btn').forEach(btn => { btn.classList.remove('active'); btn.setAttribute('aria-pressed', 'false'); });
    
    // Encontrar e ativar o botão correto
    const mapByCat = {
        all: 'Todos', museum: 'Museus', church: 'Igrejas', palace: 'Palácios',
        monument: 'Monumentos', culture: 'Cultura', library: 'Bibliotecas', square: 'Praças', bunker: 'Bunker'
    };
    document.querySelectorAll('.filter-btn').forEach(btn => {
        const label = btn.textContent.trim();
        if (label.includes(mapByCat[categoria])) {
            btn.classList.add('active');
            btn.setAttribute('aria-pressed', 'true');
        }
    });
    
    filtroAtivo = categoria;
    aplicarFiltros();
    
    // Mostrar curiosidade da categoria se não for 'all'
    if (categoria !== 'all') {
        mostrarCuriosidadeCategoria(categoria);
    } else {
        // Hide info panel when showing all
        const infoSection = document.getElementById('infoSection');
        infoSection.style.display = 'none';
    }
}

function filterByCategory(categoria, botao) {
    // Atualizar botão ativo
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    botao.classList.add('active');
    
    filtroAtivo = categoria;
    aplicarFiltros();
    
    // Mostrar curiosidade da categoria
    mostrarCuriosidadeCategoria(categoria);
}

function filterLocations() {
    aplicarFiltros();
}

function aplicarFiltros() {
    const searchInput = document.getElementById('searchInput');
    const searchBox = document.getElementById('searchBox');
    let termoBusca = '';
    
    if (searchInput) {
        termoBusca = searchInput.value.toLowerCase();
    } else if (searchBox) {
        termoBusca = searchBox.value.toLowerCase();
    }
    
    marcadores.forEach(marcador => {
        const ponto = marcador.pontoData;
        
        // Verificar categoria
        const matchCategoria = filtroAtivo === 'all' || ponto.categoria === filtroAtivo;
        
        // Verificar busca
        const matchBusca = !termoBusca || 
            ponto.nome.toLowerCase().includes(termoBusca) ||
            ponto.descricao.toLowerCase().includes(termoBusca);
        
        // Mostrar/ocultar marcador
        if (matchCategoria && matchBusca) {
            if (!map.hasLayer(marcador)) {
                marcador.addTo(map);
            }
        } else if (map.hasLayer(marcador)) {
            map.removeLayer(marcador);
        }
    });
}

// ===== EVENT LISTENERS =====
document.addEventListener('DOMContentLoaded', function() {
    initMap();
    
    // Setup search functionality para ambos os inputs
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', aplicarFiltros);
    }
    
    const searchBox = document.getElementById('searchBox');
    if (searchBox) {
        searchBox.addEventListener('input', aplicarFiltros);
    }
});

// Função para mostrar detalhes específicos de cada personagem da Família Imperial
function mostrarDetalhesPersonagem(personagem) {
    const infoSection = document.getElementById('infoSection');
    let detalhes = '';
    
    switch(personagem) {
        case 'djoao6':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <video controls style="width: 250px; height: 200px; border-radius: 12px; box-shadow: 0 8px 25px rgba(255,215,0,0.4); object-fit: cover;">
                            <source src="https://i.imgur.com/ThR5CYX.mp4" type="video/mp4">
                            Seu navegador não suporta o elemento de vídeo.
                        </video>
                    </div>
                    <h3 class="info-title">👑 D. João VI de Portugal</h3>
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">📊 Dados Pessoais</h4>
                        <p class="curiosity-text"><strong>Nome Completo:</strong> João Maria José Francisco Xavier de Paula Luís António Domingos Rafael de Bragança</p>
                        <p class="curiosity-text"><strong>Nascimento:</strong> 13 de maio de 1767, Lisboa, Portugal</p>
                        <p class="curiosity-text"><strong>Morte:</strong> 10 de março de 1826, Lisboa, Portugal</p>
                        <p class="curiosity-text"><strong>Reinado:</strong> 1816–1826 (Portugal), 1815–1822 (Reino Unido)</p>
                        <p class="curiosity-text"><strong>Dinastia:</strong> Casa de Bragança</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🏃‍♂️ A Fuga para o Brasil (1807)</h4>
                        <p class="curiosity-text">Em novembro de 1807, com as tropas de Napoleão se aproximando de Lisboa, D. João VI embarcou com toda a família real portuguesa para o Brasil. Esta foi a primeira vez na história que uma corte europeia se transferiu para uma colônia.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🇧🇷 Transformações no Brasil</h4>
                        <p class="curiosity-text">• Abertura dos portos às nações amigas (1808)</p>
                        <p class="curiosity-text">• Criação do Banco do Brasil (1808)</p>
                        <p class="curiosity-text">• Fundação da Biblioteca Nacional</p>
                        <p class="curiosity-text">• Criação da Impressão Régia</p>
                        <p class="curiosity-text">• Elevação do Brasil a Reino Unido (1815)</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">👨‍👩‍👧‍👦 Vida Familiar</h4>
                        <p class="curiosity-text"><strong>Esposa:</strong> Carlota Joaquina de Bourbon</p>
                        <p class="curiosity-text"><strong>Filhos principais:</strong> Pedro (futuro Pedro I do Brasil), Miguel I de Portugal</p>
                        <p class="curiosity-text"><strong>Curiosidade:</strong> Teve 9 filhos com Carlota Joaquina, mas o casamento era conturbado</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarFamiliaImperial()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para Família Imperial
                    </button>
                </div>
            `;
            break;
            
        case 'carlota':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/1f/Carlota_Joaquina_by_Giuseppe_Troni_%281819%29_-_Ajuda_National_Palace.png/200px-Carlota_Joaquina_by_Giuseppe_Troni_%281819%29_-_Ajuda_National_Palace.png" 
                             alt="D. Carlota Joaquina" 
                             style="width: 200px; height: 250px; border-radius: 12px; box-shadow: 0 8px 25px rgba(255,215,0,0.4); object-fit: cover;">
                    </div>
                    <h3 class="info-title">👸 D. Carlota Joaquina de Bourbon</h3>
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">📊 Dados Pessoais</h4>
                        <p class="curiosity-text"><strong>Nome Completo:</strong> Carlota Joaquina Teresa Cayetana de Bourbon</p>
                        <p class="curiosity-text"><strong>Nascimento:</strong> 25 de abril de 1775, Aranjuez, Espanha</p>
                        <p class="curiosity-text"><strong>Morte:</strong> 7 de janeiro de 1830, Queluz, Portugal</p>
                        <p class="curiosity-text"><strong>Título:</strong> Rainha consorte de Portugal</p>
                        <p class="curiosity-text"><strong>Dinastia:</strong> Casa de Bourbon (nascimento), Casa de Bragança (casamento)</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">💒 Casamento Arranjado</h4>
                        <p class="curiosity-text">Casou-se com D. João VI em 1785, quando tinha apenas 10 anos de idade, em um casamento político entre Espanha e Portugal. O casal nunca teve um relacionamento harmonioso.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🌎 Ambições Americanas</h4>
                        <p class="curiosity-text">Durante a estadia no Brasil, Carlota Joaquina nutriu ambições de se tornar regente das colônias espanholas na América do Sul, aproveitando-se da ocupação napoleônica da Espanha.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">⚡ Personalidade Forte</h4>
                        <p class="curiosity-text">Conhecida por sua personalidade impetuosa e ambiciosa, foi uma figura controversa na corte. Envolveu-se em intrigas políticas e conspirou contra o próprio marido em algumas ocasiões.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">👨‍👩‍👧‍👦 Descendência</h4>
                        <p class="curiosity-text">Mãe de 9 filhos, incluindo Pedro I do Brasil e Miguel I de Portugal. Sua influência na educação dos filhos foi significativa, especialmente na formação política dos príncipes.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarFamiliaImperial()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para Família Imperial
                    </button>
                </div>
            `;
            break;
            
        case 'pedro1':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/14/Pedro_I_do_Brasil_1830.jpg/200px-Pedro_I_do_Brasil_1830.jpg" 
                             alt="D. Pedro I" 
                             style="width: 200px; height: 250px; border-radius: 12px; box-shadow: 0 8px 25px rgba(255,215,0,0.4); object-fit: cover;">
                    </div>
                    <h3 class="info-title">👑 D. Pedro I - O Libertador</h3>
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">📊 Dados Pessoais</h4>
                        <p class="curiosity-text"><strong>Nome Completo:</strong> Pedro de Alcântara Francisco António João Carlos Xavier de Paula Miguel Rafael Joaquim José Gonzaga Pascoal Cipriano Serafim de Bragança e Bourbon</p>
                        <p class="curiosity-text"><strong>Nascimento:</strong> 12 de outubro de 1798, Queluz, Portugal</p>
                        <p class="curiosity-text"><strong>Morte:</strong> 24 de setembro de 1834, Queluz, Portugal</p>
                        <p class="curiosity-text"><strong>Reinado Brasil:</strong> 1822–1831</p>
                        <p class="curiosity-text"><strong>Reinado Portugal:</strong> 1826–1828 (como Pedro IV)</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🇧🇷 Independência do Brasil</h4>
                        <p class="curiosity-text"><strong>7 de setembro de 1822:</strong> Proclamou a Independência do Brasil às margens do Rio Ipiranga, gritando "Independência ou Morte!"</p>
                        <p class="curiosity-text"><strong>1º de dezembro de 1822:</strong> Foi coroado Imperador do Brasil na Igreja do Carmo, no Rio de Janeiro</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">💝 Vida Amorosa</h4>
                        <p class="curiosity-text"><strong>1ª Esposa:</strong> Leopoldina da Áustria (1817-1826) - Arquiduquesa da Áustria</p>
                        <p class="curiosity-text"><strong>2ª Esposa:</strong> Amélia de Leuchtenberg (1829-1834)</p>
                        <p class="curiosity-text"><strong>Amante famosa:</strong> Domitila de Castro (Marquesa de Santos)</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🎵 Talento Musical</h4>
                        <p class="curiosity-text">Compositor talentoso, criou o Hino da Independência do Brasil e várias outras peças musicais. Era também um excelente pianista.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">📜 Constituição de 1824</h4>
                        <p class="curiosity-text">Outorgou a primeira Constituição do Brasil em 1824, que vigorou até 1891. Criou o Poder Moderador, exclusivo do Imperador.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">⚔️ Abdicação e Exílio</h4>
                        <p class="curiosity-text">Abdicou do trono brasileiro em 1831 e retornou a Portugal para lutar pelos direitos de sua filha Maria da Glória ao trono português.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarFamiliaImperial()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para Família Imperial
                    </button>
                </div>
            `;
            break;
            
        case 'leopoldina':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Domingos_Sequeira_007.jpg/200px-Domingos_Sequeira_007.jpg" 
                             alt="D. Leopoldina" 
                             style="width: 200px; height: 250px; border-radius: 12px; box-shadow: 0 8px 25px rgba(255,215,0,0.4); object-fit: cover;">
                    </div>
                    <h3 class="info-title">👸 D. Leopoldina - A Imperatriz Intelectual</h3>
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">📊 Dados Pessoais</h4>
                        <p class="curiosity-text"><strong>Nome Completo:</strong> Maria Leopoldina Josefa Carolina de Habsburgo-Lorena</p>
                        <p class="curiosity-text"><strong>Nascimento:</strong> 22 de janeiro de 1797, Viena, Áustria</p>
                        <p class="curiosity-text"><strong>Morte:</strong> 11 de dezembro de 1826, Rio de Janeiro, Brasil</p>
                        <p class="curiosity-text"><strong>Título:</strong> Imperatriz do Brasil (1822-1826)</p>
                        <p class="curiosity-text"><strong>Dinastia:</strong> Casa de Habsburgo-Lorena</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🎓 Educação Excepcional</h4>
                        <p class="curiosity-text">Recebeu educação privilegiada em Viena, dominando várias línguas e ciências naturais. Era considerada uma das mulheres mais cultas de sua época.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🇧🇷 Papel na Independência</h4>
                        <p class="curiosity-text">Teve papel fundamental na Independência do Brasil, influenciando Pedro I e apoiando ativamente o movimento separatista. Muitos historiadores a consideram co-autora da Independência.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🔬 Interesse Científico</h4>
                        <p class="curiosity-text">Apaixonada por história natural, coletou espécimes da flora e fauna brasileiras que enviou para museus europeus. Contribuiu significativamente para o conhecimento científico sobre o Brasil.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">👶 Maternidade</h4>
                        <p class="curiosity-text">Mãe de 7 filhos, incluindo Pedro II (futuro Imperador do Brasil). Sua morte prematura aos 29 anos foi causada por complicações no parto.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">💔 Casamento Turbulento</h4>
                        <p class="curiosity-text">Sofreu com as traições de Pedro I, especialmente o relacionamento dele com Domitila de Castro. Apesar disso, manteve-se fiel aos deveres imperiais.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarFamiliaImperial()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para Família Imperial
                    </button>
                </div>
            `;
            break;
            
        case 'pedro2':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <video controls style="width: 250px; height: 200px; border-radius: 12px; box-shadow: 0 8px 25px rgba(255,215,0,0.4); object-fit: cover;">
                            <source src="https://i.imgur.com/9O29QG2.mp4" type="video/mp4">
                            Seu navegador não suporta o elemento de vídeo.
                        </video>
                    </div>
                    <h3 class="info-title">👑 D. Pedro II - O Imperador Sábio</h3>
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">📊 Dados Pessoais</h4>
                        <p class="curiosity-text"><strong>Nome Completo:</strong> Pedro de Alcântara João Carlos Leopoldo Salvador Bibiano Francisco Xavier de Paula Leocádio Miguel Gabriel Rafael Gonzaga de Bragança e Bourbon</p>
                        <p class="curiosity-text"><strong>Nascimento:</strong> 2 de dezembro de 1825, Rio de Janeiro, Brasil</p>
                        <p class="curiosity-text"><strong>Morte:</strong> 5 de dezembro de 1891, Paris, França</p>
                        <p class="curiosity-text"><strong>Reinado:</strong> 1831–1889 (58 anos!)</p>
                        <p class="curiosity-text"><strong>Golpe da Maioridade:</strong> 1840 (aos 14 anos)</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🎓 O Imperador Intelectual</h4>
                        <p class="curiosity-text">Falava fluentemente português, francês, alemão, inglês, italiano, espanhol, latim, grego, árabe, hebraico, sânscrito e tupi!</p>
                        <p class="curiosity-text">Correspondía-se com cientistas, filósofos e escritores do mundo todo, incluindo Victor Hugo e Louis Pasteur.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🏛️ Modernização do Brasil</h4>
                        <p class="curiosity-text">• Abolição gradual da escravidão (Lei do Ventre Livre, Lei dos Sexagenários)</p>
                        <p class="curiosity-text">• Expansão das ferrovias</p>
                        <p class="curiosity-text">• Desenvolvimento da educação</p>
                        <p class="curiosity-text">• Incentivo às artes e ciências</p>
                        <p class="curiosity-text">• Criação do Instituto Histórico e Geográfico Brasileiro</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">⚔️ Guerra do Paraguai (1864-1870)</h4>
                        <p class="curiosity-text">Conflito mais sangrento da história sul-americana. O Brasil saiu vitorioso, mas com enormes custos humanos e financeiros que afetaram a popularidade do Império.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">📸 Pioneiro da Fotografia</h4>
                        <p class="curiosity-text">Apaixonado por tecnologia, foi um dos primeiros a usar a fotografia no Brasil. Suas fotos pessoais são importantes registros históricos.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">👨‍👩‍👧‍👦 Vida Familiar</h4>
                        <p class="curiosity-text"><strong>Esposa:</strong> Teresa Cristina das Duas Sicílias</p>
                        <p class="curiosity-text"><strong>Filhos:</strong> Princesa Isabel (herdeira), Princesa Leopoldina, Príncipes Afonso e Pedro Afonso (morreram jovens)</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🏃‍♂️ Proclamação da República (1889)</h4>
                        <p class="curiosity-text">Deposto em 15 de novembro de 1889, aceitou o exílio pacificamente, dizendo: "Se é assim, será uma República desgraçada!" Morreu no exílio em Paris.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarFamiliaImperial()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para Família Imperial
                    </button>
                </div>
            `;
            break;
            
        case 'teresa':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3b/Imperatriz_Teresa_Cristina.jpg/200px-Imperatriz_Teresa_Cristina.jpg" 
                             alt="D. Teresa Cristina" 
                             style="width: 200px; height: 250px; border-radius: 12px; box-shadow: 0 8px 25px rgba(255,215,0,0.4); object-fit: cover;">
                    </div>
                    <h3 class="info-title">👸 D. Teresa Cristina - A Mãe dos Brasileiros</h3>
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">📊 Dados Pessoais</h4>
                        <p class="curiosity-text"><strong>Nome Completo:</strong> Teresa Cristina Maria de Bourbon-Duas Sicílias</p>
                        <p class="curiosity-text"><strong>Nascimento:</strong> 14 de março de 1822, Nápoles, Reino das Duas Sicílias</p>
                        <p class="curiosity-text"><strong>Morte:</strong> 28 de dezembro de 1889, Porto, Portugal</p>
                        <p class="curiosity-text"><strong>Título:</strong> Imperatriz do Brasil (1843-1889)</p>
                        <p class="curiosity-text"><strong>Dinastia:</strong> Casa de Bourbon-Duas Sicílias</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">💒 Casamento por Procuração</h4>
                        <p class="curiosity-text">Casou-se com Pedro II por procuração em 1843, sem nunca tê-lo visto antes. Chegou ao Brasil para descobrir que o imperador havia se decepcionado com sua aparência física.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">❤️ A Mãe dos Brasileiros</h4>
                        <p class="curiosity-text">Ganhou este carinhoso apelido por sua dedicação às obras de caridade e por cuidar dos mais necessitados. Fundou asilos, hospitais e orfanatos.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🏛️ Mecenas das Artes</h4>
                        <p class="curiosity-text">Grande incentivadora das artes no Brasil, promoveu a música, a pintura e a literatura. Apoiou artistas brasileiros e europeus.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🏛️ Descobertas Arqueológicas</h4>
                        <p class="curiosity-text">Apaixonada por arqueologia, patrocinou escavações em Pompéia e Herculano, enviando várias peças para o Brasil. Criou um dos primeiros museus arqueológicos do país.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">👨‍👩‍👧‍👦 Maternidade Dedicada</h4>
                        <p class="curiosity-text">Mãe devotada de quatro filhos: Isabel, Leopoldina, Afonso e Pedro Afonso. Sofreu muito com a morte prematura dos dois príncipes.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">💔 Casamento Infeliz</h4>
                        <p class="curiosity-text">Apesar da frieza inicial de Pedro II, conquistou gradualmente o respeito do marido através de sua bondade e dedicação. O imperador chegou a admirá-la profundamente.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🏃‍♀️ Exílio e Morte</h4>
                        <p class="curiosity-text">Acompanhou Pedro II no exílio após a Proclamação da República. Morreu em Portugal, apenas 43 dias após deixar o Brasil.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarFamiliaImperial()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para Família Imperial
                    </button>
                </div>
            `;
            break;
            
        case 'isabel':
            detalhes = `
                <div class="info-panel">
                    <div style="text-align: center; margin-bottom: 20px;">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Francisca_d%27Orléans-Bragança_%281844-1925%29.jpg/200px-Francisca_d%27Orléans-Bragança_%281844-1925%29.jpg" 
                             alt="Princesa Isabel" 
                             style="width: 200px; height: 250px; border-radius: 12px; box-shadow: 0 8px 25px rgba(255,215,0,0.4); object-fit: cover;">
                    </div>
                    <h3 class="info-title">👸 Princesa Isabel - A Redentora</h3>
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">📊 Dados Pessoais</h4>
                        <p class="curiosity-text"><strong>Nome Completo:</strong> Isabel Cristina Leopoldina Augusta Micaela Gabriela Rafaela Gonzaga de Bragança</p>
                        <p class="curiosity-text"><strong>Nascimento:</strong> 29 de julho de 1846, Rio de Janeiro, Brasil</p>
                        <p class="curiosity-text"><strong>Morte:</strong> 14 de novembro de 1921, Eu, França</p>
                        <p class="curiosity-text"><strong>Título:</strong> Princesa Imperial do Brasil, Herdeira do trono</p>
                        <p class="curiosity-text"><strong>Apelido:</strong> "A Redentora"</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">⚖️ Lei Áurea - 13 de maio de 1888</h4>
                        <p class="curiosity-text">Assinou a Lei Áurea que aboliu definitivamente a escravidão no Brasil, libertando cerca de 700.000 escravos. Por isso recebeu o título de "A Redentora".</p>
                        <p class="curiosity-text">A assinatura aconteceu no Paço Imperial, no Rio de Janeiro, com apenas duas linhas: "Lei nº 3.353 - É declarada extinta desde a data desta lei a escravidão no Brasil".</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">📚 Educação Privilegiada</h4>
                        <p class="curiosity-text">Recebeu educação excepcional, falava várias línguas e tinha profundo interesse por questões sociais e políticas. Era considerada mais preparada para governar que muitos homens de sua época.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">👑 Regências</h4>
                        <p class="curiosity-text">Exerceu três regências durante as viagens de Pedro II ao exterior (1871-1872, 1876-1877, 1887-1888), demonstrando competência administrativa e política.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">💒 Vida Familiar</h4>
                        <p class="curiosity-text"><strong>Marido:</strong> Gastão de Orléans, Conde d'Eu (casaram em 1864)</p>
                        <p class="curiosity-text"><strong>Filhos:</strong> Pedro (1875-1940), Luís (1878-1920), Antônio (1881-1918)</p>
                        <p class="curiosity-text">Seu casamento foi feliz e baseado no amor mútuo, diferentemente dos casamentos arranjados comuns à época.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">⛪ Fé Católica</h4>
                        <p class="curiosity-text">Católica devota, sua fé influenciou suas decisões políticas, especialmente na questão abolicionista. Acreditava que a escravidão era um pecado que deveria ser eliminado.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🌍 Visão Progressista</h4>
                        <p class="curiosity-text">Defendia ideias avançadas para a época: direitos das mulheres, educação popular, abolição da escravidão e modernização do país.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">👑 A Imperatriz que Nunca Foi</h4>
                        <p class="curiosity-text">Com a Proclamação da República em 1889, perdeu o direito ao trono brasileiro. Muitos historiadores acreditam que ela teria sido uma excelente imperatriz.</p>
                    </div>
                    
                    <div class="curiosity-item">
                        <h4 style="color: var(--accent-400);">🏃‍♀️ Exílio na França</h4>
                        <p class="curiosity-text">Viveu no exílio na França por 32 anos até sua morte. Nunca perdeu a esperança de retornar ao Brasil, mas isso nunca aconteceu.</p>
                    </div>
                    
                    <button class="back-btn" onclick="mostrarFamiliaImperial()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para Família Imperial
                    </button>
                </div>
            `;
            break;
            
        default:
            detalhes = `
                <div class="info-panel">
                    <h3 class="info-title">❌ Personagem não encontrado</h3>
                    <p class="curiosity-text">Desculpe, não foi possível encontrar informações sobre este personagem.</p>
                    <button class="back-btn" onclick="mostrarFamiliaImperial()">
                        <i class="fas fa-arrow-left"></i>
                        Voltar para Família Imperial
                    </button>
                </div>
            `;
    }
    
    infoSection.innerHTML = detalhes;
}

// ===== MOBILE MENU FUNCTIONS =====
function toggleMobileMenu() {
    console.log('toggleMobileMenu called'); // Debug
    const dropdown = document.getElementById('mobileMenuDropdown');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    
    console.log('Dropdown found:', dropdown); // Debug
    console.log('Hamburger button found:', hamburgerBtn); // Debug
    
    if (dropdown) {
        dropdown.classList.toggle('active');
        
        // Animar ícone do hamburger
        const icon = hamburgerBtn.querySelector('i');
        if (dropdown.classList.contains('active')) {
            icon.className = 'fas fa-times';
            hamburgerBtn.setAttribute('aria-expanded', 'true');
            console.log('Menu opened'); // Debug
        } else {
            icon.className = 'fas fa-bars';
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            console.log('Menu closed'); // Debug
        }
    } else {
        console.error('Mobile menu dropdown not found!'); // Debug
    }
}

function closeMobileMenu() {
    const dropdown = document.getElementById('mobileMenuDropdown');
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    
    if (dropdown) {
        dropdown.classList.remove('active');
        
        // Resetar ícone do hamburger
        const icon = hamburgerBtn.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-bars';
        }
        if (hamburgerBtn) {
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
    }
}

// Fechar menu mobile ao clicar fora
document.addEventListener('click', function(event) {
    const mobileMenu = document.querySelector('.mobile-menu');
    const dropdown = document.getElementById('mobileMenuDropdown');
    
    if (mobileMenu && dropdown && !mobileMenu.contains(event.target)) {
        closeMobileMenu();
    }
});

// Fechar menu mobile ao redimensionar a tela
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        closeMobileMenu();
    }
});

// Função para inicializar a galeria de imagens com rolagem automática
function inicializarGaleriaImagens() {
    // Seleciona todos os containers de galeria no documento
    const galerias = document.querySelectorAll('.imagens-galeria-container');
    
    // Para cada galeria encontrada
    galerias.forEach(galeria => {
        // Seleciona os indicadores da galeria
        const indicadores = galeria.querySelectorAll('.galeria-indicador');
        const scroll = galeria.querySelector('.imagens-galeria-scroll');
        const imagens = galeria.querySelectorAll('.imagem-item');
        
        // Verificar se as imagens estão visíveis
        if (imagens.length > 0) {
            // Garante que todas as imagens têm display e posicionamento corretos
            imagens.forEach((img, idx) => {
                img.style.display = 'block';
                img.style.flexBasis = '100%';
            });
        }
        
        // Marcar o primeiro indicador como ativo
        indicadores.forEach((indicador, index) => {
            // Remover classe ativo de todos
            indicador.classList.remove('ativo');
            
            // Marcar apenas o primeiro como ativo
            if (index === 0) {
                indicador.classList.add('ativo');
            }
            
            // Adiciona evento de clique para cada indicador
            indicador.addEventListener('click', function() {
                // Remove ativo de todos os indicadores desta galeria
                indicadores.forEach(ind => ind.classList.remove('ativo'));
                // Adiciona ativo ao indicador clicado
                this.classList.add('ativo');
                
                // Move a galeria para a imagem correspondente via scroll
                const index = parseInt(this.getAttribute('data-index'));
                if (scroll) {
                    const alvo = index * scroll.clientWidth;
                    scroll.scrollTo({ left: alvo, behavior: 'smooth' });
                }
            });
        });
        
        // Implementar controle automático baseado na animação CSS
        let currentIndex = 0;
        const totalImages = indicadores.length;
        
        // Atualizar indicadores conforme a animação CSS
        if (totalImages > 1) {
            // Verificamos inicialmente se a animação está funcionando
            if (window.getComputedStyle(scroll).animationName === 'none') {
                console.log('Animação não está aplicada corretamente. Ativando fallback manual.');
                // Ativamos um fallback manual
                let autoScrollInterval;
                
                galeria.addEventListener('mouseenter', function() {
                    autoScrollInterval = setInterval(() => {
                        currentIndex = (currentIndex + 1) % totalImages;
                        const alvo = currentIndex * scroll.clientWidth;
                        scroll.scrollTo({ left: alvo, behavior: 'smooth' });
                        
                        // Atualiza indicadores
                        indicadores.forEach(ind => ind.classList.remove('ativo'));
                        indicadores[currentIndex].classList.add('ativo');
                    }, 3000);
                });
                
                galeria.addEventListener('mouseleave', function() {
                    clearInterval(autoScrollInterval);
                    // Voltamos para a primeira imagem
                    currentIndex = 0;
                    scroll.scrollTo({ left: 0, behavior: 'smooth' });
                    
                    // Atualiza indicadores
                    indicadores.forEach(ind => ind.classList.remove('ativo'));
                    indicadores[0].classList.add('ativo');
                });
            } else {
                // A animação CSS está funcionando, vamos apenas atualizar os indicadores
                galeria.addEventListener('mouseenter', function() {
                    // Iniciar controle dos indicadores quando o mouse entra
                    let animationInterval = setInterval(() => {
                        if (!galeria.matches(':hover')) {
                            clearInterval(animationInterval);
                            return;
                        }
                        
                        // Atualizar indicador ativo
                        indicadores.forEach(ind => ind.classList.remove('ativo'));
                        currentIndex = (currentIndex + 1) % totalImages;
                        indicadores[currentIndex].classList.add('ativo');
                    }, 3000); // Muda a cada 3 segundos
                });
                
                galeria.addEventListener('mouseleave', function() {
                    // Reset para primeira imagem quando sai o mouse
                    setTimeout(() => {
                        currentIndex = 0;
                        indicadores.forEach(ind => ind.classList.remove('ativo'));
                        indicadores[0].classList.add('ativo');
                    }, 100);
                });
            }
        }
    });
}

// Função de manipulação de clique no indicador
function indicadorClickHandler() {
    const index = this.getAttribute('data-index');
    const galeria = this.closest('.imagens-galeria-container');
    
    // Atualiza classe ativa
    galeria.querySelectorAll('.galeria-indicador').forEach(ind => ind.classList.remove('ativo'));
    this.classList.add('ativo');
    
    // Rola para a imagem correspondente
    const scroll = galeria.querySelector('.imagens-galeria-scroll');
    if (scroll) {
        scroll.scrollTo({
            left: scroll.clientWidth * index,
            behavior: 'smooth'
        });
    }
}

// Função para mudar manualmente a imagem da galeria
function mudarImagemGaleria(elemento, index) {
    // Encontra o container da galeria
    const galeria = elemento.closest('.imagens-galeria-container');
    
    // Atualiza a classe ativo nos indicadores
    const indicadores = galeria.querySelectorAll('.galeria-indicador');
    indicadores.forEach(ind => ind.classList.remove('ativo'));
    elemento.classList.add('ativo');
    
    // Encontra o container de scroll
    const scroll = galeria.querySelector('.imagens-galeria-scroll');
    if (!scroll) return;
    
    // Move via scroll real
    const alvo = index * scroll.clientWidth;
    scroll.scrollTo({ left: alvo, behavior: 'smooth' });
}

// Inicializar componentes quando o DOM for carregado
window.addEventListener('DOMContentLoaded', function() {
    // Inicializar as galerias já existentes na página
    inicializarGaleriaImagens();
    
    // Verificar CSS computed styles
    if (mobileMenu) {
        const mobileStyle = window.getComputedStyle(mobileMenu);
        console.log('Mobile menu display:', mobileStyle.display);
    }
    
    if (desktopMenu) {
        const desktopStyle = window.getComputedStyle(desktopMenu);
        console.log('Desktop menu display:', desktopStyle.display);
    }
    
    // Verificar viewport
    console.log('Window width:', window.innerWidth);
    console.log('Screen width:', screen.width);
    console.log('User agent:', navigator.userAgent);
});

//=============================================================================
// 📸 FUNÇÃO MEMÓRIA - PÁGINA DE VÍDEOS E FOTOS
//=============================================================================

/**
 * ABRE PÁGINA DE MEMÓRIAS
 * Função que abre a galeria de fotos históricas do Rio de Janeiro
 */
function abrirMemoria() {
    // Caminho para a galeria de memórias
    const urlMemoria = './galeria-memoria.html';
    
    try {
        // Abre em nova aba
        window.open(urlMemoria, '_blank', 'noopener,noreferrer');
    } catch (error) {
        console.error('Erro ao abrir página de memórias:', error);
        
        // Fallback: redirecionar na mesma aba
        window.location.href = urlMemoria;
    }
}

// Função removida: abrirMemoriaModal - não utilizada
