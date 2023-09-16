//Importación de dependencias y configuraciones principales.
import express, { json } from 'express';
import db from '../src/database/movies.json'
import fs from 'fs'
import { randomUUID } from 'node:crypto'

const PORT = 45000;
const app = express();

// ------------------| MIDDLEWARES |------------------- //
// Middleware para poder procesar el body de las request.
app.use(json());

// --------------------| ROUTING |--------------------- //
// Armen acá todo el ruteo de los endpoints.

app.get('/api', (req, res) => {
    res.json({ message: db.info });
});

app.get('/api/movies', (req, res) => {
    res.json({ message: db.movies })
});


app.get('/api/movies/:id', (req, res) => {
    const { id } = req.params;
    const movieData = db.movies;
    const movieFound = movieData.find((movie: any) => movie.id == id);

    res.json({ response: movieFound })
});


app.get('*', (req, res) => {
    res.status(404).json('Resource not found!')

});


app.post('/api/movies', (req, res) => {
    //res.json(req.body); Status: 200 OK
    //res.status(201).json(req.body); //Status: 201 Created

    const { name, year, director, cast, rating } = req.body;
    const id = randomUUID();

    const movieData = db.movies;
    movieData.push({ id, name, year, director, cast, rating });

    fs.writeFileSync('./src/database/movies.json', JSON.stringify(db));

    res.status(201).json({
        id, name,
    });
})

app.post('*', (req, res) => {
    res.status(404).json('Resource not found!')

});

app.patch('/api/movies/:id', (req, res) => {
    const { id } = req.params;
    const { name, year, director, cast, rating } = req.body;

    // Encuentra la película en la base de datos por su ID
    const movieData = db.movies;
    const movieToUpdate = movieData.find((movie: any) => movie.id == id);

    if (!movieToUpdate) {
        return res.status(404).json({ error: 'Película no encontrada' });
    }

    // Actualiza los campos proporcionados en el cuerpo de la solicitud
    if (name) {
        movieToUpdate.name = name;
    }
    if (year) {
        movieToUpdate.year = year;
    }
    if (director) {
        movieToUpdate.director = director;
    }
    if (cast) {
        movieToUpdate.cast = cast;
    }
    if (rating) {
        movieToUpdate.rating = rating;
    }

    // Guarda la base de datos actualizada
    fs.writeFileSync('./src/database/movies.json', JSON.stringify(db));

    res.json({ message: 'Película actualizada con éxito', updatedMovie: movieToUpdate });
});

// ---------------------| SERVER |--------------------- //

// Poner a la escucha al servidor.
app.listen(PORT, () => {
    console.log('Server listening on port', PORT);
});













