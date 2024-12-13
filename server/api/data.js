export default (req, res) => {
    let dataStore = [
      { id: 1, name: 'Pelicula 1', description: 'Descripción de la película 1' },
      { id: 2, name: 'Pelicula 2', description: 'Descripción de la película 2' },
    ];
   
    if (req.method === 'GET') {
      if (req.url === '/') {
        res.status(200).json(dataStore); // Obtener todos los datos
      } else {
        const id = parseInt(req.url.split('/').pop(), 10);
        const item = dataStore.find(d => d.id === id);
        item ? res.status(200).json(item) : res.status(404).json({ message: 'Elemento no encontrado' });
      }
    } else if (req.method === 'POST') {
      const { name, description } = req.body;
      const newItem = {
        id: dataStore.length ? dataStore[dataStore.length - 1].id + 1 : 1,
        name,
        description,
      };
      dataStore.push(newItem);
      res.status(201).json(newItem);
    } else {
      res.status(405).json({ message: 'Método no permitido' });
    }
  };