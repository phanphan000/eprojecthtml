function openVideo() {
    const popup = document.getElementById('video-popup');
    const frame = document.getElementById('youtube-frame');
    frame.src = "https://www.youtube.com/embed/z5toCqsceFo?si=5okfcpYu8xnxzTHs";
    popup.style.display = "flex";
}

function closeVideo() {
    const popup = document.getElementById('video-popup');
    const frame = document.getElementById('youtube-frame');
    frame.src = ""; // Stop the video
    popup.style.display = "none";
}
document.querySelector('#ad-banner .close-btn').addEventListener('click', () => {
    document.getElementById('ad-banner').style.display = 'none';
  });