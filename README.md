# Full-Stack Movie App (Diagnostic Assignment)

## Project Overview
This is a simple full-stack movie application built using Vanilla JavaScript for the frontend and pure Node.js (without Express) for the backend. The project allows users to view a list of movies, see specific details, and add new movies to a local JSON database.

---

## Features
- **Backend:** Pure Node.js API with custom routing.
- **Frontend:** Responsive UI using HTML, CSS, and Vanilla JS.
- **Database:** JSON file read/write operations.
- **Operations:** GET all movies, GET movie by ID, and POST new movie.

---

## How to Run 

### 1. Backend:
```
bash
cd backend
node server.js

```
### 2. Frontend:
Open frontend/index.html in your browser (preferably using Live Server in VS Code).

API Endpoints / نقاط اتصال الواجهة البرمجية
GET /movies: Fetch all movies.

GET /movies/:id: Fetch a single movie by ID.

POST /movies: Add a new movie.


###
Challenges Faced 
The main challenge was handling routes and parsing the request body without using Express.js. Implementing manual CORS headers was also a key learning point.