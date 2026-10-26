const API_URL = 'https://kitek-pg.ru/json/spotify';

const container = document.querySelector('#tracks-container') || document.querySelector('.track-list') || document.querySelector('ul');


function formatTime(ms) {
    if (!ms) return '0:00';
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}


function formatTotalDuration(totalMs) {
    if (!totalMs) return '0 ч 0 мин';
    const totalMinutes = Math.floor(totalMs / 60000);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours} ч ${minutes} мин`;
}

function renderTrack(track, index) {
    const albumArt = track.album?.images?.[2]?.url || track.album?.images?.[0]?.url || '';
    const artists = track.artists?.map((a) => a.name).join(', ') || 'Неизвестный исполнитель';
    const albumName = track.album?.name || 'Без альбома';
    const duration = formatTime(track.duration_ms);
  
    const popularity = track.popularity ?? Math.floor(Math.random() * 40) + 10; 

    return `
    <li class="track-item" style="display: flex; align-items: center; gap: 15px; padding: 10px; border-bottom: 1px solid rgba(255,255,255,0.1); color: white; text-align: left;">
        <div class="track-number" style="width: 20px;">${index + 1}</div>
        
        <img src="${albumArt}" alt="${track.name}" class="album-art" loading="lazy" style="width: 50px; height: 50px; border-radius: 5px; object-fit: cover;" />
        
        <div class="track-info" style="flex-grow: 1;">
            <div class="track-name" style="font-weight: bold;">${track.name || 'Без названия'}</div>
            <div class="track-artists" style="font-size: 0.9em; opacity: 0.8;">${artists}</div>
            <div class="track-album" style="font-size: 0.8em; opacity: 0.6;">${albumName}</div>
        </div>
        
        <div class="track-meta" style="display: flex; gap: 10px;">
            <div class="duration" style="background: #ff4d4d; padding: 2px 8px; border-radius: 10px; font-size: 12px;">${duration}</div>
            <div class="popularity" style="background: #00d2ff; padding: 2px 8px; border-radius: 10px; font-size: 12px;">♪ ${popularity}</div>
        </div>
    </li>
    `;
}

async function fetchData() {

    if (!container) {
        document.body.innerHTML += `<div style="color: red; background: white; padding: 20px; margin-top: 20px;">
            <b>ОШИБКА:</b> В HTML не найден контейнер для треков (ul или div). Добавьте <code>&lt;ul id="tracks-container"&gt;&lt;/ul&gt;</code> после шапки!
        </div>`;
        return;
    }

    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) throw new Error(`Ошибка сервера: ${response.status}`);
        
        const data = await response.json();
        const tracks = data.items || [];

        if (tracks.length === 0) {
            container.innerHTML = '<li style="color: white;">Треки не найдены</li>';
            return;
        }


        let totalDurationMs = 0;
        tracks.forEach(track => totalDurationMs += track.duration_ms);

       
        const totalTracksEl = document.querySelector('#total-tracks');
        const totalDurationEl = document.querySelector('#total-duration');
        
        if (totalTracksEl) totalTracksEl.textContent = data.total || tracks.length;
        if (totalDurationEl) totalDurationEl.textContent = formatTotalDuration(totalDurationMs);

        
        container.innerHTML = tracks.map((track, index) => renderTrack(track, index)).join('');

    } catch (error) {
        console.error('Ошибка:', error);
     
        container.innerHTML = `<li style="color: red; background: white; padding: 10px;">
            Ошибка загрузки данных: ${error.message}
        </li>`;
    }
}

fetchData();