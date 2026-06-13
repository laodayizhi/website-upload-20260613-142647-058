(function () {
    function initialize(container) {
        var video = container.querySelector('video');
        var cover = container.querySelector('.player-cover');
        if (!video) {
            return;
        }
        var stream = video.getAttribute('data-stream');
        var hls = null;
        var attached = false;

        function attachStream() {
            if (attached || !stream) {
                return;
            }
            attached = true;
            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hls = new window.Hls({ enableWorker: true, lowLatencyMode: true });
                hls.loadSource(stream);
                hls.attachMedia(video);
            } else {
                video.src = stream;
            }
        }

        function startVideo() {
            attachStream();
            container.classList.add('is-playing');
            if (cover) {
                cover.hidden = true;
            }
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {
                    container.classList.remove('is-playing');
                    if (cover) {
                        cover.hidden = false;
                    }
                });
            }
        }

        if (cover) {
            cover.addEventListener('click', startVideo);
        }

        video.addEventListener('play', function () {
            container.classList.add('is-playing');
            if (cover) {
                cover.hidden = true;
            }
        });

        video.addEventListener('error', function () {
            container.classList.remove('is-playing');
        });

        window.addEventListener('beforeunload', function () {
            if (hls) {
                hls.destroy();
            }
        });
    }

    document.querySelectorAll('[data-player]').forEach(initialize);
})();
