(() => {
    const menuButton = document.querySelector('[data-menu-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('is-open');
        });
    }

    const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
    const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));

    if (slides.length > 0) {
        let activeIndex = 0;
        const showSlide = (index) => {
            activeIndex = (index + slides.length) % slides.length;
            slides.forEach((slide, slideIndex) => {
                slide.classList.toggle('is-active', slideIndex === activeIndex);
            });
            dots.forEach((dot, dotIndex) => {
                dot.classList.toggle('is-active', dotIndex === activeIndex);
            });
        };

        dots.forEach((dot, dotIndex) => {
            dot.addEventListener('click', () => showSlide(dotIndex));
        });

        showSlide(0);
        window.setInterval(() => showSlide(activeIndex + 1), 5200);
    }

    const filterBox = document.querySelector('[data-movie-filter]');
    const yearBox = document.querySelector('[data-year-filter]');
    const typeBox = document.querySelector('[data-type-filter]');
    const cards = Array.from(document.querySelectorAll('[data-search]'));

    if (filterBox && cards.length > 0) {
        const params = new URLSearchParams(window.location.search);
        const query = params.get('q');
        if (query) {
            filterBox.value = query;
        }

        const applyFilter = () => {
            const keyword = (filterBox.value || '').trim().toLowerCase();
            const year = yearBox ? yearBox.value : '';
            const type = typeBox ? typeBox.value : '';

            cards.forEach((card) => {
                const searchText = (card.getAttribute('data-search') || '').toLowerCase();
                const cardYear = card.getAttribute('data-year') || '';
                const cardType = card.getAttribute('data-type') || '';
                const keywordMatched = !keyword || searchText.includes(keyword);
                const yearMatched = !year || cardYear === year;
                const typeMatched = !type || cardType === type;
                card.classList.toggle('hidden-card', !(keywordMatched && yearMatched && typeMatched));
            });
        };

        filterBox.addEventListener('input', applyFilter);
        if (yearBox) {
            yearBox.addEventListener('change', applyFilter);
        }
        if (typeBox) {
            typeBox.addEventListener('change', applyFilter);
        }
        applyFilter();
    }
})();
