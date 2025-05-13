document.addEventListener('DOMContentLoaded', () => {
    const container = document.querySelector('.testimonials');
    const dotsContainer = document.querySelector('.testimonial-dots');
    if (!container || !dotsContainer) {
        return;
    }

    const allTestimonials = [
        { text: 'A Bonelli Films elevou nossa história corporativa a um espetáculo audiovisual inesquecível, combinando direção de arte impecável, trilha sonora envolvente e narrativa emocionante que cativou todos os espectadores.', img: 32, name: 'Ana Paula Pereira', role: '@anapaulap23' },
        { text: 'Detalhes cinematográficos e trilha sonora impecável deram vida à nossa marca.', img: 45, name: 'Rodrigo Souza', role: '@rodrigotechBR' },
        { text: 'Captaram cada emoção, cada sorriso e transformaram isso em narrativa inesquecível que permanece em nossa memória.', img: 68, name: 'Fernanda Lima', role: '@f.lima.ofc' },
        { text: 'O documentário personalizado da Bonelli Films superou todas as expectativas com storytelling refinado e reconhecimento nacional.', img: 58, name: 'Marcelo Rocha', role: '@marcelo.rocha.vfx' },
        { text: 'Emoção pura transbordou em cada frame quando a Bonelli Films documentou nosso evento com sensibilidade e maestria extraordinárias.', img: 5, name: 'Juliana Rodrigues', role: '@ju_rodrigues' },
        { text: 'Narrativa envolvente e estética impactante deram à nossa campanha uma cara nova.', img: 15, name: 'Rafael Santos', role: '@rafaels_gfx' },
        { text: 'Impulsei engajamento em 60% em apenas uma semana com vídeos de alta qualidade.', img: 25, name: 'Camila Ferreira', role: '@camila_4real' },
        { text: 'Mix de áudio perfeito e cortes dinâmicos tornaram nosso conteúdo verdadeiramente profissional.', img: 35, name: 'Diego Almeida', role: '@diegoalmeida_io' },
        { text: 'A Bonelli Films superou expectativas ao capturar imagens aéreas impressionantes e momentos íntimos que emocionaram toda a equipe.', img: 47, name: 'Bruna Carvalho', role: '@brunaca_rvalho' },
        { text: 'Cada cena contava nossa essência com acabamento cinematográfico primoroso.', img: 61, name: 'Felipe Santos', role: '@felipes90' },
        { text: 'O cuidado na captação de áudio e vídeo gerou muitos elogios nas redes sociais.', img: 24, name: 'Larissa Lima', role: '@larissavids' },
        { text: 'Pós-produção com cores vibrantes e ritmo intenso elevou nosso padrão audiovisual.', img: 26, name: 'Sofia Ribeiro', role: '@sofia.ribeiro' },
        { text: 'Vídeos motivacionais internos inspiraram novos projetos e fortaleceram o espírito de equipe.', img: 63, name: 'Carlos Mendes', role: '@carlosm_dsss' },
        { text: 'Campanha com cores vibrantes e motion design cuidadoso deu personalidade única à nossa marca.', img: 11, name: 'Lucas Mendes', role: '@lucas.mendes' },
        { text: 'Direção de arte impecável capturou nossa identidade de forma única.', img: 12, name: 'Mariana Costa', role: '@marianacosta_art' },
        { text: 'Transições suaves mantiveram a atenção do público do início ao fim.', img: 13, name: 'Pedro Alves', role: '@pedroalvesss' },
        { text: 'Tratamento de cor magistral ressaltou cada detalhe cinematograficamente.', img: 14, name: 'Isabela Nunes', role: '@isabelafilm' },
        { text: 'A Bonelli Films elevou nossa história corporativa a espetáculo audiovisual inesquecível, combinando direção, som e emoção.', img: 32, name: 'Ana Paula Pereira', role: '@anapaulap23' },
        { text: 'Detalhes cinematográficos deram vida à nossa marca e emocionaram espectadores.', img: 45, name: 'Rodrigo Souza', role: '@rodrigotechBR' },
        { text: 'Emoções capturadas com maestria permanecerão em nossa memória.', img: 68, name: 'Fernanda Lima', role: '@f.lima.ofc' },
        { text: 'Documentário personalizado superou todas as expectativas com storytelling refinado.', img: 58, name: 'Marcelo Rocha', role: '@marcelo.rocha.vfx' }
    ];

    let currentTestimonialIndex = 0;
    let touchStartX = 0;
    let touchEndX = 0;
    let isTransitioning = false;
    let _boundHandleMobileScroll = null; // To store the bound scroll handler

    function isMobileView() {
        return window.innerWidth < 768;
    }

    function handleMobileScrollEffectLogic() {
        if (!isMobileView()) return;

        // Handle active testimonial card (beam of light glow effect)
        const activeTestimonialCard = container.querySelector('.testimonial-track .card.active');
        if (activeTestimonialCard) {
            const rect = activeTestimonialCard.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const cardCenterY = rect.top + rect.height / 2;
            const viewportCenterY = viewportHeight / 2;
            const normalizedDistance = (cardCenterY - viewportCenterY) / viewportCenterY;
            let glowStrength = Math.max(0, 1 - Math.abs(normalizedDistance));
            glowStrength = glowStrength * glowStrength;
            const glowYPos = 70 - normalizedDistance * 10;

            activeTestimonialCard.style.setProperty('--glow-y-pos', `${glowYPos.toFixed(0)}%`);
            activeTestimonialCard.style.setProperty('--glow-color-intensity', (glowStrength * 0.65).toFixed(3));
            activeTestimonialCard.style.setProperty('--glow-border-intensity', (glowStrength * 0.55).toFixed(3));
        }

        // Handle contact cards
        const contactCards = document.querySelectorAll('.contact-option');
        if (contactCards.length > 0) {
            const viewportHeight = window.innerHeight;
            const viewportCenterY = viewportHeight / 2;

            contactCards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const cardCenterY = rect.top + rect.height / 2;
                const normalizedDistance = (cardCenterY - viewportCenterY) / viewportCenterY;
                let glowStrength = Math.max(0, 1 - Math.abs(normalizedDistance));
                glowStrength = glowStrength * glowStrength; // Focus effect in the center
                const glowYPos = 70 - normalizedDistance * 10; 

                // Always set glow variables for the beam effect
                card.style.setProperty('--glow-y-pos', `${glowYPos.toFixed(0)}%`);
                card.style.setProperty('--glow-color-intensity', (glowStrength * 0.65).toFixed(3));
                card.style.setProperty('--glow-border-intensity', (glowStrength * 0.55).toFixed(3));
                
                // Threshold for being "centered" to activate "clicked" state
                const threshold = viewportHeight * 0.20; 

                if (rect.top < viewportHeight && rect.bottom > 0 && Math.abs(cardCenterY - viewportCenterY) < threshold) {
                    card.classList.add('scroll-activated-hover');
                } else {
                    card.classList.remove('scroll-activated-hover');
                }
            });
        }
    }

    function resetCardGlowStyles(cardElement) {
        if (cardElement) {
            cardElement.style.setProperty('--glow-y-pos', '70%');
            cardElement.style.setProperty('--glow-color-intensity', '0');
            cardElement.style.setProperty('--glow-border-intensity', '0');
        }
    }

    function resetContactOptionActiveState(contactCardElement) {
        if (contactCardElement) {
            contactCardElement.classList.remove('scroll-activated-hover');
        }
    }

    function setupMobileScrollEffect() {
        if (!_boundHandleMobileScroll) {
            _boundHandleMobileScroll = handleMobileScrollEffectLogic;
        }
        window.addEventListener('scroll', _boundHandleMobileScroll, { passive: true });
        handleMobileScrollEffectLogic(); // Initial check
    }

    function removeMobileScrollEffect() {
        if (_boundHandleMobileScroll) {
            window.removeEventListener('scroll', _boundHandleMobileScroll);
        }
        const testimonialCards = container.querySelectorAll('.testimonial-track .card');
        testimonialCards.forEach(card => resetCardGlowStyles(card));
        
        const contactCards = document.querySelectorAll('.contact-option');
        contactCards.forEach(card => {
            resetCardGlowStyles(card); // Reset glow variables
            resetContactOptionActiveState(card); // Remove class
        });
    }

    function displayTestimonials() {
        container.innerHTML = '';
        dotsContainer.innerHTML = '';
        isTransitioning = false;

        if (isMobileView()) {
            dotsContainer.style.display = 'flex'; // Ensure dots container is visible on mobile
            // Create navigation elements
            const prevButton = document.createElement('button');
            prevButton.className = 'testimonial-arrow prev-arrow';
            prevButton.innerHTML = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/></svg>';
            
            const nextButton = document.createElement('button');
            nextButton.className = 'testimonial-arrow next-arrow';
            nextButton.innerHTML = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z"/></svg>';
            
            const currentDot = document.createElement('span');
            currentDot.className = 'testimonial-dot active';

            // Add event listeners for arrows
            prevButton.addEventListener('click', () => {
                if (isTransitioning) return; // Prevent action if already transitioning
                showTestimonial((currentTestimonialIndex - 1 + allTestimonials.length) % allTestimonials.length);
            });
            
            nextButton.addEventListener('click', () => {
                if (isTransitioning) return; // Prevent action if already transitioning
                showTestimonial((currentTestimonialIndex + 1) % allTestimonials.length);
            });

            // Append navigation elements
            dotsContainer.appendChild(prevButton);
            dotsContainer.appendChild(currentDot);
            dotsContainer.appendChild(nextButton);

            // Rest of mobile view setup
            const track = document.createElement('div');
            track.className = 'testimonial-track'; // For swipe
            allTestimonials.forEach((item, index) => {
                const card = createCard(item);
                card.style.display = 'flex'; // Ensure all cards are flex for layout and transition
                // Initial positioning for slide effect
                if (index === currentTestimonialIndex) {
                    card.classList.add('active');
                } else if (index === currentTestimonialIndex - 1) {
                    card.classList.add('prev');
                } else if (index === currentTestimonialIndex + 1) {
                    card.classList.add('next');
                }
                track.appendChild(card);
            });
            container.appendChild(track);
            // Add swipe listeners only in mobile view
            container.addEventListener('touchstart', handleTouchStart, false);
            container.addEventListener('touchmove', handleTouchMove, false);
            container.addEventListener('touchend', handleTouchEnd, false);
            setupMobileScrollEffect(); // Add scroll listener for reflective effect

        } else {
            // Desktop: Original multi-column layout
            removeMobileScrollEffect(); // Remove scroll listener if not in mobile view
            container.removeEventListener('touchstart', handleTouchStart, false);
            container.removeEventListener('touchmove', handleTouchMove, false);
            container.removeEventListener('touchend', handleTouchEnd, false);
            dotsContainer.style.display = 'none'; // Hide dots on desktop

            const columnsCount = 5;
            const testimonialsByColumn = [[], [], [], [], []];
            allTestimonials.forEach((item, index) => {
                testimonialsByColumn[index % columnsCount].push(item);
            });
            
            for (let i = 0; i < columnsCount; i++) {
                const col = document.createElement('div');
                col.className = 'column';
                const track = document.createElement('div');
                track.className = 'track';

                if (testimonialsByColumn[i]) {
                    testimonialsByColumn[i].forEach(item => {
                        const card = createCard(item);
                        track.appendChild(card);
                    });
                }

                if (track.children.length > 0) {
                    Array.from(track.children).forEach(node => track.appendChild(node.cloneNode(true)));
                }
                col.appendChild(track);
                container.appendChild(col);
            }
        }
    }

    function createCard(item) {
        const card = document.createElement('div');
        card.className = 'card';
        
        const textEl = document.createElement('p');
        textEl.className = 'text';
        textEl.textContent = item.text;
        
        const footer = document.createElement('div');
        footer.className = 'footer';
        
        const imgEl = document.createElement('img');
        imgEl.className = 'avatar';
        imgEl.src = `https://i.pravatar.cc/40?img=${item.img}`;
        imgEl.alt = `Avatar ${item.name}`;
        
        const info = document.createElement('div');
        info.className = 'author-info';
        
        const nameEl = document.createElement('p');
        nameEl.className = 'name';
        nameEl.textContent = item.name;
        
        const roleEl = document.createElement('p');
        roleEl.className = 'role';
        roleEl.textContent = item.role;
        
        info.append(nameEl, roleEl);
        footer.append(imgEl, info);
        card.append(textEl, footer);
        return card;
    }

    function showTestimonial(index) {
        if (isMobileView()) {
            if (isTransitioning) return;
            isTransitioning = true;

            const track = container.querySelector('.testimonial-track');
            if (!track) {
                isTransitioning = false;
                return;
            }
            const cards = track.querySelectorAll('.card');
            
            const oldActiveCard = track.querySelector('.card.active');
            if (oldActiveCard) {
                resetCardGlowStyles(oldActiveCard);
            }
            
            cards.forEach((card, i) => {
                card.classList.remove('active', 'prev', 'next');
                if (i === index) {
                    card.classList.add('active');
                } else if (i === index - 1 || (index === 0 && i === cards.length - 1)) {
                    card.classList.add('prev');
                } else if (i === index + 1 || (index === cards.length - 1 && i === 0)) {
                    card.classList.add('next');
                }
            });

            currentTestimonialIndex = index;

            handleMobileScrollEffectLogic(); 

            setTimeout(() => {
                isTransitioning = false;
                handleMobileScrollEffectLogic(); 
            }, 500);
        } else {
            const cards = container.querySelectorAll('.testimonial-track .card');
            const dots = dotsContainer.querySelectorAll('.testimonial-dot');

            cards.forEach((card, i) => {
                if (i < index) {
                    card.style.transform = 'translateX(-100%)';
                } else if (i > index) {
                    card.style.transform = 'translateX(100%)';
                } else {
                    card.style.transform = 'translateX(0)';
                }
            });

            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
            currentTestimonialIndex = index;
        }
    }

    function handleTouchStart(event) {
        if (isTransitioning) return;
        touchStartX = event.touches[0].clientX;
    }

    function handleTouchMove(event) {
        if (isTransitioning) return;
        touchEndX = event.touches[0].clientX;
    }

    function handleTouchEnd() {
        if (isTransitioning) return;

        if (touchStartX - touchEndX > 75) {
            showTestimonial((currentTestimonialIndex + 1) % allTestimonials.length);
        } else if (touchEndX - touchStartX > 75) {
            showTestimonial((currentTestimonialIndex - 1 + allTestimonials.length) % allTestimonials.length);
        }
        touchStartX = 0;
        touchEndX = 0;
    }
    
    displayTestimonials();
    window.addEventListener('resize', displayTestimonials);
});