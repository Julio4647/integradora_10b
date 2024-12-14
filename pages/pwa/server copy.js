const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// Middleware para permitir CORS
app.use(cors({
  origin: 'http://localhost:3000', // Puedes cambiar esto a "*" para permitir desde cualquier origen
  methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Middleware para parsear JSON y formularios
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Simulación de base de datos en memoria para pruebas
let dataStore = [
  { id: 1, name: 'Pelicula 1', description: 'Descripción de la película 1' },
  { id: 2, name: 'Pelicula 2', description: 'Descripción de la película 2' },
];

// Obtener todos los datos
app.get('/api/data', (req, res) => {
  res.json(dataStore);
});

// Obtener un elemento por ID
app.get('/api/data/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const item = dataStore.find(d => d.id === id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ message: 'Elemento no encontrado' });
  }
});

// Crear un nuevo elemento
app.post('/api/data', (req, res) => {
  const { name, description } = req.body;
  const newItem = {
    id: dataStore.length ? dataStore[dataStore.length - 1].id + 1 : 1,
    name,
    description,
  };
  dataStore.push(newItem);
  res.status(201).json(newItem);
});

// Actualizar un elemento por ID
app.put('/api/data/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, description } = req.body;
  const itemIndex = dataStore.findIndex(d => d.id === id);

  if (itemIndex !== -1) {
    dataStore[itemIndex] = { id, name, description };
    res.json(dataStore[itemIndex]);
  } else {
    res.status(404).json({ message: 'Elemento no encontrado' });
  }
});

// Eliminar un elemento por ID
app.delete('/api/data/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const itemIndex = dataStore.findIndex(d => d.id === id);

  if (itemIndex !== -1) {
    dataStore.splice(itemIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).json({ message: 'Elemento no encontrado' });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
