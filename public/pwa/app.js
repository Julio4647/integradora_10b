// Configuración inicial
if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/pwa/service-worker.js')
        .then(() => {
            if (Notification.permission !== 'granted') {
                Notification.requestPermission();
            }
        });
}

// Bases de datos locales
const dbOnline = new PouchDB('onlineDB'); // Para operaciones locales sincronizadas
const dbOffline = new PouchDB('offlineDB'); // Para solicitudes fallidas

// Elementos del DOM
const userListElement = document.getElementById('tableList');
const userForm = document.getElementById('deviceForm');
const editForm = document.getElementById('editDeviceForm');

document.getElementById('addUserBtn').addEventListener('click', () => {
    document.getElementById('deviceForm').style.display = 'block'; // Mostrar formulario de agregar
    document.getElementById('editDeviceForm').style.display = 'none'; // Ocultar formulario de edición
});

// URL de la API
//const apiUrl = 'http://localhost:8008/api-sigser/device/';
const apiUrl = 'http://ec2-107-23-52-108.compute-1.amazonaws.com:8008/api-sigser/device/';


// Verificar conexión a Internet
function isOnline() {
    return navigator.onLine;
}

// Cargar usuarios al iniciar
// Cargar usuarios (online/offline)
async function getUsers() {
    if (isOnline()) {
        console.log('Conexión detectada, cargando desde la API...');
        try {
            const response = await fetch(apiUrl);
            const data = await response.json();
            await syncLocalDB(data.data || []); // Sincroniza con PouchDB
            loadUsers(data.data || []); // Cargar datos en el DOM
        } catch (error) {
            console.error('Error al cargar datos desde la API:', error);
            alert('No se pudieron cargar los datos desde el servidor.');
        }
    } else {
        console.log('Sin conexión, cargando datos desde PouchDB...');
        try {
            const localData = await dbOnline.allDocs({ include_docs: true });
            const users = localData.rows.map(row => row.doc); // Extraer documentos de PouchDB
            loadUsers(users); // Cargar datos en el DOM
        } catch (error) {
            console.error('Error al cargar datos desde PouchDB:', error);
            alert('No se pudieron cargar los datos locales.');
        }
    }
}

// Sincronizar datos online con PouchDB
async function syncLocalDB(data) {
    console.log('Sincronizando datos con PouchDB...');
    for (const item of data) {
        try {
            const existing = await dbOnline.get(String(item.id)).catch(() => null);
            if (!existing || JSON.stringify(existing) !== JSON.stringify(item)) {
                await dbOnline.put({ ...item, _id: String(item.id) }); // Guardar en PouchDB
            }
        } catch (error) {
            console.error('Error al sincronizar datos locales:', error);
        }
    }
}


// Sincronizar base de datos local con datos remotos
async function syncLocalDB(data) {
    console.log('Sincronizando datos con la base de datos local...');
    for (const item of data) {
        try {
            const existing = await dbOnline.get(String(item.id)).catch(() => null);
            if (!existing) {
                // Si el documento no existe, guárdalo directamente
                await dbOnline.put({ ...item, _id: String(item.id) });
            } else if (JSON.stringify(existing) !== JSON.stringify(item)) {
                // Si el documento existe, actualiza con la revisión correcta
                await dbOnline.put({ ...item, _id: String(item.id), _rev: existing._rev });
            }
        } catch (error) {
            console.error('Error al sincronizar datos locales:', error);
        }
    }
}

// Mostrar usuarios en la UI
function loadUsers(users) {
    console.log('Cargando usuarios en el DOM...');
    const userListElement = document.getElementById('tableList');
    userListElement.innerHTML = ''; // Limpiar la lista existente
    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.deviceType?.name || 'N/A'}</td>
            <td>${user.model || 'N/A'}</td>
            <td>${user.brand || 'N/A'}</td>
            <td>
                <button class="btn btn-warning btn-sm" onclick="editUser('${user.id}')">Editar</button>
                <button class="btn btn-danger btn-sm" onclick="deleteUser('${user.id}')">Eliminar</button>
            </td>
        `;
        userListElement.appendChild(row);
    });
}

async function editUser(id) {
    try {
        // Obtener los datos actuales del usuario desde PouchDB
        const device = await dbOnline.get(String(id));

        // Mostrar el formulario de edición y cargar datos
        document.getElementById('deviceForm').style.display = 'none';
        document.getElementById('editDeviceForm').style.display = 'block';

        document.getElementById('editmodelDevice').value = device.model || '';
        document.getElementById('editbrandDevice').value = device.brand || '';
        document.getElementById('editnumberSerialDevice').value = device.serialNumber || '';
        document.getElementById('editdeviceType').value = device.deviceType?.id || '';

        // Configurar el formulario para guardar los cambios
        document.getElementById('editFormContent').onsubmit = async (e) => {
            e.preventDefault(); // Prevenir recarga

            const updatedDevice = {
                id: device.id,
                model: document.getElementById('editmodelDevice').value,
                brand: document.getElementById('editbrandDevice').value,
                serialNumber: document.getElementById('editnumberSerialDevice').value,
                deviceType: { id: parseInt(document.getElementById('editdeviceType').value) },
            };

            if (isOnline()) {
                try {
                    // Actualizar en el servidor
                    const response = await fetch(`${apiUrl}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedDevice),
                    });

                    if (response.ok) {
                        // Sincronizar con PouchDB
                        await dbOnline.put({ ...updatedDevice, _id: String(updatedDevice.id) });
                        alert('Usuario actualizado correctamente');
                        resetForm();
                        getUsers(); // Recargar usuarios
                    } else {
                        console.error('Error al actualizar usuario:', await response.json());
                        alert('No se pudo actualizar el usuario.');
                    }
                } catch (error) {
                    console.error('Error al realizar la petición para editar usuario:', error);
                    alert('Ocurrió un error al actualizar el usuario.');
                }
            } else {
                console.log('Modo offline, actualizando localmente...');
                try {
                    // Actualizar localmente en PouchDB
                    const existingDoc = await dbOnline.get(String(updatedDevice.id));
                    await dbOnline.put({ ...updatedDevice, _id: existingDoc._id, _rev: existingDoc._rev });

                    // Guardar petición pendiente para sincronizar luego
                    saveFailedRequest('PUT', apiUrl, updatedDevice);

                    alert('Usuario actualizado localmente. Sincronización pendiente.');
                    resetForm();
                    getUsers(); // Recargar usuarios locales
                } catch (error) {
                    console.error('Error al actualizar usuario localmente:', error);
                }
            }
        };
    } catch (error) {
        console.error('Error al cargar el usuario para editar:', error);
        alert('No se pudo cargar el usuario para editar.');
    }
}
// Agregar usuario (online/offline)

// Función para agregar un usuario
document.getElementById('form').addEventListener('submit', addUser);

async function addUser(event) {
    event.preventDefault();

    const newDevice = {
        model: document.getElementById('modelDevice').value,
        brand: document.getElementById('brandDevice').value,
        serialNumber: document.getElementById('numberSerialDevice').value,
        deviceType: { id: parseInt(document.getElementById('deviceType').value) },
    };

    if (isOnline()) {
        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newDevice),
            });

            if (response.ok) {
                alert('Usuario agregado correctamente');
                resetForm();
                getUsers(); // Recargar usuarios
            } else {
                console.error('Error al agregar usuario:', await response.json());
                alert('No se pudo agregar el usuario.');
            }
        } catch (error) {
            console.error('Error al realizar la petición para agregar usuario:', error);
            alert('Ocurrió un error al agregar el usuario.');
        }
    } else {
        console.log('Modo offline, guardando petición...');
        saveFailedRequest('POST', apiUrl, newDevice); // Guardar en PouchDB
        alert('Usuario guardado para sincronización cuando se restablezca la conexión.');
        resetForm();
    }
}

async function deleteUser(id) {
    if (isOnline()) {
        try {
            const response = await fetch(`${apiUrl}${id}`, { method: 'DELETE' });

            if (response.ok) {
                // Eliminar del servidor fue exitoso, ahora eliminar de PouchDB
                await dbOnline.get(id).then(doc => dbOnline.remove(doc));
                alert('Usuario eliminado correctamente');
                getUsers(); // Recargar usuarios
            } else {
                console.error('Error al eliminar usuario:', await response.json());
                alert('No se pudo eliminar el usuario.');
            }
        } catch (error) {
            console.error('Error al realizar la petición para eliminar usuario:', error);
            alert('Ocurrió un error al eliminar el usuario.');
        }
    } else {
        console.log('Modo offline, guardando petición...');
        saveFailedRequest('DELETE', `${apiUrl}${id}`); // Guardar en PouchDB para sincronización
        // Eliminar el dispositivo de PouchDB localmente
        await dbOnline.get(id).then(doc => dbOnline.remove(doc));
        alert('Usuario marcado para eliminar cuando se recupere la conexión.');
        getUsers(); // Refrescar la lista con los datos locales
    }
}
async function saveFailedRequest(method, url, body = null) {
    const failedRequest = {
        _id: new Date().toISOString(), // ID único basado en la hora
        method,
        url,
        body,
        status: 'pending', // Estado pendiente para sincronización
    };

    try {
        await dbOffline.put(failedRequest);
        console.log('Petición guardada en modo offline:', failedRequest);
    } catch (error) {
        console.error('Error al guardar petición en modo offline:', error);
    }
}
// Función para guardar una petición fallida
async function syncFailedRequests() {
    console.log('Intentando sincronizar peticiones pendientes...');
    try {
        const failedRequests = await dbOffline.allDocs({ include_docs: true });
        for (const { doc } of failedRequests.rows) {
            try {
                const options = {
                    method: doc.method,
                    headers: { 'Content-Type': 'application/json' },
                };

                if (doc.body) {
                    options.body = JSON.stringify(doc.body);
                }

                const response = await fetch(doc.url, options);

                if (response.ok) {
                    console.log('Petición sincronizada:', doc);
                    await dbOffline.remove(doc); // Eliminar petición sincronizada

                    // Actualizar en PouchDB online después de sincronizar
                    if (doc.method === 'POST') {
                        const updatedDevice = doc.body;
                        await dbOnline.put({ ...updatedDevice, _id: String(updatedDevice.id) });
                    }
                } else {
                    console.error('Error al sincronizar petición:', await response.json());
                }
            } catch (error) {
                console.error('Error al procesar petición pendiente:', error);
            }
        }
    } catch (error) {
        console.error('Error al obtener peticiones pendientes:', error);
    }
}

// Detectar reconexión a Internet
window.addEventListener('online', () => {
    console.log('Conexión restaurada, sincronizando peticiones...');
    syncFailedRequests();
});
// Restablecer los formularios (ocultarlos)
function resetForm() {
    document.getElementById('deviceForm').style.display = 'none';
    document.getElementById('editDeviceForm').style.display = 'none';
    document.getElementById('form').reset();
    document.getElementById('editFormContent').reset();
}
// Eventos de red
window.addEventListener('online', () => {
    console.log('Conexión restaurada');
    syncFailedRequests();
    getUsers();
});

window.addEventListener('offline', () => {
    console.log('Conexión perdida');
});

// Cargar los usuarios al iniciar
getUsers();