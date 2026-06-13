(function () {
  function $(selector, root) {
    return (root || document).querySelector(selector);
  }

  function $all(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var toggle = $('.menu-toggle');
  var panel = $('.mobile-panel');
  if (toggle && panel) {
    toggle.addEventListener('click', function () {
      panel.classList.toggle('open');
    });
  }

  var hero = $('[data-hero-slider]');
  if (hero) {
    var slides = $all('.hero-slide', hero);
    var dots = $all('.hero-dot', hero);
    var index = 0;
    var timer = null;
    var show = function (next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('active', i === index);
      });
    };
    var start = function () {
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5000);
    };
    var restart = function () {
      if (timer) {
        window.clearInterval(timer);
      }
      start();
    };
    var prev = $('[data-hero-prev]', hero);
    var next = $('[data-hero-next]', hero);
    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }
    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }
    dots.forEach(function (dot) {
      dot.addEventListener('click', function () {
        show(Number(dot.getAttribute('data-slide')) || 0);
        restart();
      });
    });
    show(0);
    start();
  }

  $all('[data-filter-panel]').forEach(function (panelNode) {
    var search = $('[data-card-search]', panelNode);
    var region = $('[data-filter-region]', panelNode);
    var type = $('[data-filter-type]', panelNode);
    var year = $('[data-filter-year]', panelNode);
    var list = $('[data-card-list]');
    if (!list) {
      return;
    }
    var cards = $all('.movie-card, .rank-row', list);
    var run = function () {
      var keyword = search ? search.value.trim().toLowerCase() : '';
      var regionValue = region ? region.value : '';
      var typeValue = type ? type.value : '';
      var yearValue = year ? year.value : '';
      cards.forEach(function (card) {
        var text = [card.getAttribute('data-title'), card.getAttribute('data-region'), card.getAttribute('data-type'), card.getAttribute('data-year'), card.getAttribute('data-tags')].join(' ').toLowerCase();
        var ok = true;
        if (keyword && text.indexOf(keyword) === -1) {
          ok = false;
        }
        if (regionValue && card.getAttribute('data-region') !== regionValue) {
          ok = false;
        }
        if (typeValue && card.getAttribute('data-type') !== typeValue) {
          ok = false;
        }
        if (yearValue && card.getAttribute('data-year') !== yearValue) {
          ok = false;
        }
        card.classList.toggle('is-hidden', !ok);
      });
    };
    [search, region, type, year].forEach(function (node) {
      if (node) {
        node.addEventListener('input', run);
        node.addEventListener('change', run);
      }
    });
  });

  var searchResults = document.getElementById('searchResults');
  var searchInput = document.getElementById('searchInput');
  if (searchResults && window.MOVIE_SEARCH_DATA) {
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q') || '';
    if (searchInput) {
      searchInput.value = q;
      searchInput.addEventListener('input', function () {
        renderSearch(searchInput.value);
      });
    }
    var cardHtml = function (item) {
      var tags = item.tags.slice(0, 2).map(function (tag) {
        return '<span>' + escapeHtml(tag) + '</span>';
      }).join('');
      return '<article class="movie-card">' +
        '<a class="card-link" href="' + item.url + '">' +
        '<span class="poster-wrap"><img src="' + item.cover + '" alt="' + escapeHtml(item.title) + '" loading="lazy"><span class="poster-shade"></span><span class="play-mark">▶</span><span class="tag-row">' + tags + '</span></span>' +
        '<span class="card-copy"><strong>' + escapeHtml(item.title) + '</strong><em>' + escapeHtml(item.oneLine) + '</em><span class="meta-line">' + escapeHtml(item.year) + ' · ' + escapeHtml(item.region) + '</span></span>' +
        '</a></article>';
    };
    var renderSearch = function (term) {
      var keyword = (term || '').trim().toLowerCase();
      var items = window.MOVIE_SEARCH_DATA.filter(function (item) {
        if (!keyword) {
          return true;
        }
        return [item.title, item.region, item.type, item.year, item.genre, item.tags.join(' '), item.oneLine].join(' ').toLowerCase().indexOf(keyword) !== -1;
      }).slice(0, 120);
      if (items.length === 0) {
        searchResults.innerHTML = '<div class="empty-state">没有找到相关影片</div>';
      } else {
        searchResults.innerHTML = items.map(cardHtml).join('');
      }
    };
    renderSearch(q);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"]/g, function (char) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;'
      }[char];
    });
  }
})();
