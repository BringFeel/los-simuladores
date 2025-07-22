function showCard() {
    document.getElementById('infoCard').classList.add('active');
    document.getElementById('overlay').classList.add('active');
}

function closeCard() {
    document.getElementById('infoCard').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
}