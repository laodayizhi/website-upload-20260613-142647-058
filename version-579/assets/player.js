(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('.js-player'));
  players.forEach(function (player) {
    var video = player.querySelector('video');
    var overlay = player.querySelector('.player-overlay');
    if (!video) {
      return;
    }
    var url = video.getAttribute('data-video-url');
    if (url) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
      } else if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(url);
        hls.attachMedia(video);
      } else {
        video.src = url;
      }
    }
    var hideOverlay = function () {
      if (overlay) {
        overlay.classList.add('is-hidden');
      }
    };
    var showOverlay = function () {
      if (overlay && video.currentTime === 0) {
        overlay.classList.remove('is-hidden');
      }
    };
    var start = function () {
      var playPromise = video.play();
      hideOverlay();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {
          if (overlay) {
            overlay.classList.remove('is-hidden');
          }
        });
      }
    };
    if (overlay) {
      overlay.addEventListener('click', start);
    }
    video.addEventListener('click', function (event) {
      if (event.target === video) {
        if (video.paused) {
          start();
        } else {
          video.pause();
        }
      }
    });
    video.addEventListener('play', hideOverlay);
    video.addEventListener('ended', showOverlay);
  });
})();
