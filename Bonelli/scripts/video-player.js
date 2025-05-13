function playVideo(container) {
    const videoWrapper = container.parentElement;
    const video = videoWrapper.querySelector(".video-real");

    container.style.display = "none"; // esconde thumbnail
    video.style.display = "block";    // mostra vídeo
    video.play();                     // inicia reprodução
}