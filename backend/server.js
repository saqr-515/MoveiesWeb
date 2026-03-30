const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 5000;
const DATA_FILE = path.join(__dirname, 'movies.json');

if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, '[]');
}

console.log("Starting server setup...");

const server = http.createServer((req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    // جلب كل الأفلام
    if (req.url === '/movies' && req.method === 'GET') {
        const data = fs.readFileSync(DATA_FILE, 'utf8');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(data || '[]');
        return;
    }

    // جلب فيلم واحد (إضافة هامة للتكليف)
    if (req.url.startsWith('/movies/') && req.method === 'GET') {
        const id = parseInt(req.url.split('/')[2]);
        const movies = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
        const movie = movies.find(m => m.id === id);
        if (movie) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify(movie));
        }
        res.writeHead(404);
        return res.end(JSON.stringify({ message: "Movie not found" }));
    }

    // إضافة فيلم
    if (req.url === '/movies' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk.toString());
        req.on('end', () => {
            try {
                const movies = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
                const item = JSON.parse(body);
                
                // Mapping fields to match JSON structure
                const newMovie = {
                    id: Date.now(),
                    title: item.title,
                    vote_average: parseFloat(item.rating) || 0,
                    release_date: item.year ? `1/1/${item.year}` : '', // Formatting to match existing data
                    overview: item.overview || '',
                    genres: item.genres || '',
                    tagline: '',
                    runtime: 0
                };

                movies.push(newMovie);
                fs.writeFileSync(DATA_FILE, JSON.stringify(movies, null, 2));
                res.writeHead(201, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(newMovie));
            } catch (e) {
                res.writeHead(400);
                res.end(JSON.stringify({ message: "Invalid JSON" }));
            }
        });
        return;
    }

    // حذف فيلم
    if (req.url.startsWith('/movies/') && req.method === 'DELETE') {
        const id = parseInt(req.url.split('/')[2]);
        let movies = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8') || '[]');
        const originalLength = movies.length;
        movies = movies.filter(m => m.id !== id);
        
        if (movies.length < originalLength) {
            fs.writeFileSync(DATA_FILE, JSON.stringify(movies, null, 2));
            res.writeHead(200);
            res.end(JSON.stringify({ message: "Deleted" }));
        } else {
            res.writeHead(404);
            res.end(JSON.stringify({ message: "Movie not found" }));
        }
        return;
    }

    res.writeHead(404);
    res.end('Not Found');
});

// تشغيل السيرفر مرة واحدة فقط
server.listen(PORT, () => {
    console.log(`🚀 Server is running on: http://localhost:${PORT}`);
});