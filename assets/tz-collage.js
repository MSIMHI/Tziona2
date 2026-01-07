document.addEventListener('DOMContentLoaded', () => {
    const videoBtns = document.querySelectorAll('.tz-collage-video-btn');
    const videoModal = document.getElementById('tz-video-modal');
    const modalClose = document.getElementById('tz-video-modal-close');
    const iframe = document.querySelector('.tz-video-modal-content iframe');

    videoBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const videoUrl = btn.getAttribute('data-video-url');
            if (videoUrl && videoModal && iframe) {
                iframe.src = videoUrl;
                videoModal.classList.add('is-active');
                document.body.style.overflow = 'hidden';
            }
        });
    });

    if (modalClose && videoModal) {
        modalClose.addEventListener('click', () => {
            videoModal.classList.remove('is-active');
            if (iframe) iframe.src = '';
            document.body.style.overflow = '';
        });
    }

    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                videoModal.classList.remove('is-active');
                if (iframe) iframe.src = '';
                document.body.style.overflow = '';
            }
        });
    }
});
