(() => {
    const video = document.querySelector('[data-video-player]');
    const playLayer = document.querySelector('[data-play-layer]');

    if (!video || typeof sourceUrl === 'undefined') {
        return;
    }

    let initialized = false;
    let hlsInstance = null;

    const setupPlayer = () => {
        if (initialized) {
            return;
        }
        initialized = true;

        if (video.canPlayType('application/vnd.apple.mpegurl')) {
            video.src = sourceUrl;
            return;
        }

        if (typeof Hls !== 'undefined' && Hls.isSupported()) {
            hlsInstance = new Hls({
                maxBufferLength: 36,
                enableWorker: true
            });
            hlsInstance.loadSource(sourceUrl);
            hlsInstance.attachMedia(video);
            return;
        }

        video.src = sourceUrl;
    };

    const startPlayback = () => {
        setupPlayer();
        if (playLayer) {
            playLayer.classList.add('is-hidden');
        }
        video.controls = true;
        const playPromise = video.play();
        if (playPromise && typeof playPromise.catch === 'function') {
            playPromise.catch(() => {});
        }
    };

    if (playLayer) {
        playLayer.addEventListener('click', startPlayback);
    }

    video.addEventListener('click', () => {
        if (video.paused) {
            startPlayback();
        }
    });

    video.addEventListener('play', () => {
        if (playLayer) {
            playLayer.classList.add('is-hidden');
        }
    });

    window.addEventListener('pagehide', () => {
        if (hlsInstance) {
            hlsInstance.destroy();
        }
    });
})();
