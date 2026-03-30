const API_URL = 'http://localhost:5000/movies'; 

// العناصر
const movieGrid = document.getElementById('movieGrid');
const modal = document.getElementById('modal');
const movieForm = document.getElementById('movieForm');
const formSection = document.getElementById('formSection');
const openFormBtn = document.getElementById('openFormBtn');
const closeFormBtn = document.getElementById('closeFormBtn');
const closeModal = document.getElementById('closeModal');

// فتح وإغلاق النموذج
openFormBtn.onclick = () => formSection.classList.remove('hidden');
closeFormBtn.onclick = () => formSection.classList.add('hidden');
closeModal.onclick = () => modal.classList.add('hidden');

// إغلاق المودال عند الضغط خارجه
window.onclick = (event) => {
    if (event.target == modal) modal.classList.add('hidden');
}

// جلب الأفلام
async function loadMovies() {
    movieGrid.innerHTML = '<p class="status">Loading movies...</p>';
    try {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Server error');
        const movies = await res.json();
        render(movies);
    } catch (err) {
        movieGrid.innerHTML = `<p class="error">Failed to connect to server: ${err.message}</p>`;
    }
}

function render(movies) {
    if (movies.length === 0) {
        movieGrid.innerHTML = '<p class="status">No movies in your vault.</p>';
        return;
    }
    movieGrid.innerHTML = movies.map(m => `
        <div class="card" onclick="viewDetails(${m.id})">
            <div class="rating-badge">${(m.vote_average || 0).toFixed(1)}</div>
            <h3>${m.title}</h3>
            <p class="meta">${(m.release_date || '').toString().split('/').pop()} • ${(m.genres || 'N/A').split(',')[0]}</p>
        </div>
    `).join('');
}

async function viewDetails(id) {
    try {
        const res = await fetch(`${API_URL}/${id}`);
        if (!res.ok) throw new Error('Movie not found');
        const m = await res.json();
        
        document.getElementById('movieDetails').innerHTML = `
            <div class="modal-header">
                <h2>${m.title}</h2>
                <p class="tagline">${m.tagline || ''}</p>
            </div>
            <div class="modal-body">
                <p><strong>Genres:</strong> ${m.genres || 'N/A'}</p>
                <p><strong>Rating:</strong> ⭐ ${m.vote_average || 0} / 10</p>
                <p><strong>Duration:</strong> ${m.runtime || 0} min</p>
                <p class="description">${m.overview || 'No description available.'}</p>
            </div>
            <button class="btn-delete" onclick="deleteMovie(${m.id})">Remove from list</button>
        `;
        modal.classList.remove('hidden');
    } catch (err) {
        alert(err.message);
    }
}

async function deleteMovie(id) {
    if (confirm('Are you sure you want to delete this movie?')) {
        try {
            await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
            modal.classList.add('hidden');
            loadMovies();
        } catch (err) {
            alert('Failed to delete movie.');
        }
    }
}

movieForm.onsubmit = async (e) => {
    e.preventDefault();
    
    const newMovie = {
        title: document.getElementById('title').value,
        year: document.getElementById('year').value,
        rating: document.getElementById('rating').value,
        overview: document.getElementById('description').value,
        genres: document.getElementById('genre').value
    };

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMovie)
        });

        if (res.ok) {
            movieForm.reset();
            formSection.classList.add('hidden');
            loadMovies();
        } else {
            const errorData = await res.json();
            alert(`Error: ${errorData.message}`);
        }
    } catch (err) {
        alert('Failed to add movie. Check server connection.');
    }
};

// التشغيل الابتدائي
loadMovies();
