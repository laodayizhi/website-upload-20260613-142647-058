import { H as Hls } from './hls-vendor.js';

(function () {
  var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

  players.forEach(function (player) {
    var video = player.querySelector('video');
    var start = player.querySelector('.player-start');
    var hls = null;

    if (!video) {
      return;
    }

    function showMessage(text) {
      var old = player.querySelector('.player-message');

      if (old) {
        old.remove();
      }

      var message = document.createElement('div');
      message.className = 'player-message';
      message.textContent = text;
      player.appendChild(message);
    }

    function loadStream() {
      var stream = video.getAttribute('data-stream');

      if (!stream) {
        showMessage('该视频暂时无法播放');
        return Promise.resolve();
      }

      if (video.getAttribute('data-ready') === '1') {
        return Promise.resolve();
      }

      video.setAttribute('data-ready', '1');
      video.controls = true;

      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = stream;
        return Promise.resolve();
      }

      if (Hls && Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });

        hls.loadSource(stream);
        hls.attachMedia(video);

        hls.on(Hls.Events.ERROR, function (event, data) {
          if (data && data.fatal) {
            showMessage('播放加载失败，请稍后重试');
          }
        });

        return Promise.resolve();
      }

      showMessage('该设备暂时无法播放');
      return Promise.resolve();
    }

    function playVideo() {
      loadStream().then(function () {
        if (start) {
          start.classList.add('is-hidden');
        }

        var attempt = video.play();

        if (attempt && typeof attempt.catch === 'function') {
          attempt.catch(function () {});
        }
      });
    }

    if (start) {
      start.addEventListener('click', playVideo);
    }

    video.addEventListener('click', function () {
      if (video.paused) {
        playVideo();
      } else {
        video.pause();
      }
    });

    window.addEventListener('beforeunload', function () {
      if (hls) {
        hls.destroy();
      }
    });
  });
})();
