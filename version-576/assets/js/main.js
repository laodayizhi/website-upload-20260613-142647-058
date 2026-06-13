(function () {
  var header = document.querySelector('[data-header]');
  var menuButton = document.querySelector('[data-menu-toggle]');
  var mobileNav = document.querySelector('[data-mobile-nav]');

  function updateHeader() {
    if (!header) {
      return;
    }

    if (window.scrollY > 24) {
      header.classList.add('is-scrolled');
    } else {
      header.classList.remove('is-scrolled');
    }
  }

  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', function () {
      mobileNav.classList.toggle('is-open');
    });
  }

  var hero = document.querySelector('[data-hero]');

  if (hero) {
    var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
    var prev = hero.querySelector('[data-hero-prev]');
    var next = hero.querySelector('[data-hero-next]');
    var current = 0;
    var timer = null;

    function showSlide(index) {
      if (!slides.length) {
        return;
      }

      current = (index + slides.length) % slides.length;

      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('is-active', slideIndex === current);
      });

      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('is-active', dotIndex === current);
      });
    }

    function startTimer() {
      clearInterval(timer);
      timer = setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }

    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        var index = Number(dot.getAttribute('data-hero-dot'));
        showSlide(index);
        startTimer();
      });
    });

    if (prev) {
      prev.addEventListener('click', function () {
        showSlide(current - 1);
        startTimer();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        showSlide(current + 1);
        startTimer();
      });
    }

    startTimer();
  }

  var scopes = Array.prototype.slice.call(document.querySelectorAll('[data-search-scope]'));

  scopes.forEach(function (scope) {
    var input = scope.querySelector('[data-card-search]');
    var queryInput = scope.querySelector('[data-query-input]');
    var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-card]'));
    var buttons = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-value]'));
    var activeFilter = 'all';

    if (queryInput) {
      var params = new URLSearchParams(window.location.search);
      var q = params.get('q');

      if (q) {
        queryInput.value = q;
      }
    }

    function applyFilter() {
      var keyword = input ? input.value.trim().toLowerCase() : '';

      cards.forEach(function (card) {
        var haystack = card.textContent.toLowerCase() + ' ' + [
          card.getAttribute('data-title'),
          card.getAttribute('data-genre'),
          card.getAttribute('data-type'),
          card.getAttribute('data-year'),
          card.getAttribute('data-region')
        ].join(' ').toLowerCase();
        var matchesKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        var matchesFilter = activeFilter === 'all' || haystack.indexOf(activeFilter.toLowerCase()) !== -1;

        card.classList.toggle('is-hidden', !(matchesKeyword && matchesFilter));
      });
    }

    if (input) {
      input.addEventListener('input', applyFilter);
      applyFilter();
    }

    buttons.forEach(function (button) {
      button.addEventListener('click', function () {
        activeFilter = button.getAttribute('data-filter-value') || 'all';

        buttons.forEach(function (item) {
          item.classList.toggle('is-active', item === button);
        });

        applyFilter();
      });
    });
  });
})();
