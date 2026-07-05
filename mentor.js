document.addEventListener('DOMContentLoaded', () => {
    // ===== Theme Toggle =====
    const themeToggle = document.querySelector('.theme-toggle');
    const html = document.documentElement;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    }

    const getCurrentTheme = () => {
        const saved = html.getAttribute('data-theme');
        if (saved) return saved;
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const current = getCurrentTheme();
            const next = current === 'dark' ? 'light' : 'dark';
            html.setAttribute('data-theme', next);
            localStorage.setItem('theme', next);
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'd' && !e.ctrlKey && !e.metaKey && !e.altKey) {
            const target = e.target;
            if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
                const current = getCurrentTheme();
                const next = current === 'dark' ? 'light' : 'dark';
                html.setAttribute('data-theme', next);
                localStorage.setItem('theme', next);
            }
        }
    });

    // ===== Smooth Scroll =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const offset = 80;
                const position = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: position, behavior: 'smooth' });
            }
        });
    });

    // ===== Carousel =====
    const track = document.querySelector('.m-carousel-track');
    const cards = document.querySelectorAll('.m-testimonial-card');
    const prevBtn = document.querySelector('.m-prev');
    const nextBtn = document.querySelector('.m-next');
    const dotsContainer = document.getElementById('carousel-dots');

    if (!track || cards.length === 0) return;

    const trackContainer = document.querySelector('.m-carousel-track-container');
    let currentIndex = 0;
    let cardsPerView = getCardsPerView();
    let totalPages = Math.ceil(cards.length / cardsPerView);

    function getCardsPerView() {
        const width = window.innerWidth;
        if (width <= 650) return 1;
        if (width <= 900) return 2;
        return 3;
    }

    function isNativeScroll() {
        // Mobile CSS switches the track container to overflow-x scroll.
        return window.innerWidth <= 650;
    }

    function buildDots() {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.className = 'm-dot' + (i === currentIndex ? ' active' : '');
            dot.setAttribute('aria-label', 'Go to slide group ' + (i + 1));
            dot.addEventListener('click', () => goTo(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateButtons() {
        if (prevBtn) prevBtn.disabled = currentIndex === 0;
        if (nextBtn) nextBtn.disabled = currentIndex >= totalPages - 1;
    }

    function updateDots() {
        const dots = dotsContainer.querySelectorAll('.m-dot');
        dots.forEach((d, i) => d.classList.toggle('active', i === currentIndex));
    }

    function goTo(index) {
        currentIndex = Math.max(0, Math.min(index, totalPages - 1));

        const gap = parseFloat(getComputedStyle(track).gap) || 0;
        const cardWidth = cards[0].offsetWidth;

        if (isNativeScroll()) {
            // Let native horizontal scroll + scroll-snap drive position on mobile;
            // clear any transform left over from the desktop layout.
            track.style.transform = 'none';
            if (trackContainer) {
                trackContainer.scrollTo({
                    left: currentIndex * (cardWidth + gap),
                    behavior: 'smooth'
                });
            }
        } else {
            const shift = currentIndex * cardsPerView * (cardWidth + gap);
            track.style.transform = 'translateX(-' + shift + 'px)';
        }

        updateButtons();
        updateDots();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => goTo(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goTo(currentIndex + 1));

    function onResize() {
        const newPerView = getCardsPerView();
        if (newPerView !== cardsPerView) {
            cardsPerView = newPerView;
            totalPages = Math.ceil(cards.length / cardsPerView);
            currentIndex = Math.min(currentIndex, totalPages - 1);
            buildDots();
        }
        goTo(currentIndex);
    }

    window.addEventListener('resize', onResize);

    // Sync dots with native swipe on mobile.
    if (trackContainer) {
        let scrollRaf = null;
        trackContainer.addEventListener('scroll', () => {
            if (!isNativeScroll()) return;
            if (scrollRaf) cancelAnimationFrame(scrollRaf);
            scrollRaf = requestAnimationFrame(() => {
                const gap = parseFloat(getComputedStyle(track).gap) || 0;
                const cardWidth = cards[0].offsetWidth || 1;
                const idx = Math.round(trackContainer.scrollLeft / (cardWidth + gap));
                if (idx !== currentIndex) {
                    currentIndex = Math.max(0, Math.min(idx, totalPages - 1));
                    updateDots();
                }
            });
        }, { passive: true });
    }

    buildDots();
    goTo(0);
});
