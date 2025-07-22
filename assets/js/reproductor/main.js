let episodesData;

let currentSeason = 1;
let currentEpisode = null;
//let isPlaying = false;

function getURLParams() {
    const params = new URLSearchParams(window.location.search);
    const temporada = parseInt(params.get('temporada'));
    const capitulo = parseInt(params.get('capitulo'));
    return { temporada, capitulo };
}

// Initialize the page
function init() {
    const { temporada, capitulo } = getURLParams();

    const isValidSeason = temporada === 1 || temporada === 2;

    const maxEpisodes = { 1: 13, 2: 11 };
    const isValidEpisode = isValidSeason && capitulo >= 1 && capitulo <= maxEpisodes[temporada];

    if (isValidSeason && isValidEpisode) {
        showSeason(temporada);

        setTimeout(() => {
            const episodeData = episodesData[temporada].find(ep => ep.number === capitulo);
            const episodeCards = document.querySelectorAll('.episode-card');
            const card = Array.from(episodeCards).find(card =>
                card.querySelector('.episode-number')?.textContent.includes(`Episodio ${capitulo}`)
            );
            if (episodeData && card) {
                selectEpisode(episodeData, temporada, card);
            }
        }, 100);
    }

    if (isValidSeason && temporada === 2) showSeason(2);
    else showSeason(1);
}

// Show episodes for selected season
function showSeason(season, element) {
    currentSeason = season;

    // Quitar clase 'active' de todos los botones
    document.querySelectorAll('.season-tab').forEach(tab => {
        tab.classList.remove('active');
    });

    // Agregar clase 'active' al botón clickeado
    if (element) element.classList.add('active');

    // Renderizar episodios
    const episodesGrid = document.getElementById('episodesGrid');
    episodesGrid.innerHTML = '';

    episodesData[season].forEach(episode => {
        const episodeCard = createEpisodeCard(episode, season);
        episodesGrid.appendChild(episodeCard);
    });
}


// Create episode card
function createEpisodeCard(episode, season) {
    const card = document.createElement('div');
    card.className = 'episode-card';
    card.onclick = function () {
        selectEpisode(episode, season, this);
    };

    card.innerHTML = `
    <div class="episode-number">Temporada ${season} • Episodio ${episode.number}</div>
    <div class="episode-card-title">${episode.title}</div>
    <div class="episode-card-description">${episode.description}</div>
    <div class="episode-duration">
        ${episode.duration}${episode.new ? ' | <span style="color: yellow;">Nueva Versión</span>' : ''}
    </div>
    <button class="watch-btn">▶ Ver Episodio</button>
    `;

    return card;
}

// Select episode
function selectEpisode(episode, season, cardElement) {
    currentEpisode = { ...episode, season };

    // Update current episode info
    document.getElementById('currentTitle').textContent = episode.title;
    document.getElementById('currentInfo').textContent = `Temporada ${season} • Episodio ${episode.number} • ${episode.duration}`;
    document.getElementById('currentDescription').textContent = episode.description;

    // Update episode cards
    document.querySelectorAll('.episode-card').forEach(card => {
        card.classList.remove('playing');
        const indicator = card.querySelector('.playing-indicator');
        if (indicator) indicator.remove();
    });

    cardElement.classList.add('playing');
    cardElement.innerHTML += '<div class="playing-indicator">REPRODUCIENDO</div>';

    // Update controls
    updateControls();

    playEpisode();

    // Scroll to video
    document.querySelector('.video-section').scrollIntoView({ behavior: 'smooth' });
}

// Play episode
function playEpisode() {
    if (!currentEpisode) {
        alert('Selecciona un episodio primero');
        return;
    }

    isPlaying = true;

    const placeholder = document.querySelector('.video-placeholder');
    placeholder.innerHTML = `
        <iframe src="${currentEpisode.urlPlayer}" frameborder="0"
        width="100%"
        height="100%"
        scrolling="no"
        allowfullscreen=""
        allow="autoplay"></iframe>`;
}

// Previous episode
function previousEpisode() {
    if (!currentEpisode) return;

    const currentSeasonData = episodesData[currentEpisode.season];
    const currentIndex = currentSeasonData.findIndex(ep => ep.number === currentEpisode.number);

    if (currentIndex > 0) {
        const episodeCards = document.querySelectorAll('.episode-card');
        episodeCards[currentIndex - 1].click();
    }

    playEpisode();
    return;
}

// Next episode
function nextEpisode() {
    if (!currentEpisode) return;

    const currentSeasonData = episodesData[currentEpisode.season];
    const currentIndex = currentSeasonData.findIndex(ep => ep.number === currentEpisode.number);

    if (currentIndex < currentSeasonData.length - 1) {
        const episodeCards = document.querySelectorAll('.episode-card');
        episodeCards[currentIndex + 1].click();
    }

    playEpisode();
    return;
}

// Update controls
function updateControls() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (!currentEpisode) {
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        return;
    }

    const currentSeasonData = episodesData[currentEpisode.season];
    const currentIndex = currentSeasonData.findIndex(ep => ep.number === currentEpisode.number);

    prevBtn.disabled = currentIndex === 0;
    nextBtn.disabled = currentIndex === currentSeasonData.length - 1;
}

// Initialize on page load
(async () => {
    const response = await fetch('./assets/js/reproductor/utils/chapters.json');
    episodesData = await response.json();

    init();
})();