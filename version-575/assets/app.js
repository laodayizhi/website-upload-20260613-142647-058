(function () {
    var header = document.querySelector('[data-header]');
    var toggle = document.querySelector('[data-menu-toggle]');

    function updateHeader() {
        if (!header) {
            return;
        }
        if (window.scrollY > 40) {
            header.classList.add('is-scrolled');
        } else {
            header.classList.remove('is-scrolled');
        }
    }

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });

    if (toggle && header) {
        toggle.addEventListener('click', function () {
            header.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('[data-search-form]').forEach(function (form) {
        form.addEventListener('submit', function (event) {
            var input = form.querySelector('input[name="q"]');
            if (!input || !input.value.trim()) {
                event.preventDefault();
                window.location.href = './search.html';
            }
        });
    });

    var hero = document.querySelector('[data-hero]');
    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var current = 0;

        function showSlide(index) {
            if (!slides.length) {
                return;
            }
            current = (index + slides.length) % slides.length;
            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('active', slideIndex === current);
            });
            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('active', dotIndex === current);
            });
        }

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                var index = Number(dot.getAttribute('data-hero-dot')) || 0;
                showSlide(index);
            });
        });

        window.setInterval(function () {
            showSlide(current + 1);
        }, 5200);
    }

    var params = new URLSearchParams(window.location.search);
    var q = (params.get('q') || '').trim().toLowerCase();
    var filterInput = document.querySelector('[data-filter-input]');
    var cards = Array.prototype.slice.call(document.querySelectorAll('[data-card]'));
    var empty = document.querySelector('[data-empty]');

    if (filterInput && q) {
        filterInput.value = q;
    }

    function filterCards() {
        if (!filterInput || !cards.length) {
            return;
        }
        var value = filterInput.value.trim().toLowerCase();
        var visible = 0;
        cards.forEach(function (card) {
            var haystack = (card.getAttribute('data-title') || '').toLowerCase();
            var matched = !value || haystack.indexOf(value) !== -1;
            card.style.display = matched ? '' : 'none';
            if (matched) {
                visible += 1;
            }
        });
        if (empty) {
            empty.classList.toggle('show', visible === 0);
        }
    }

    if (filterInput) {
        filterInput.addEventListener('input', filterCards);
        filterCards();
    }
})();
