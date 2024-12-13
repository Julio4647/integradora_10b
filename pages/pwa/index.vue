<template>
  <div>
    <nav class="navbar navbar-expand-lg">
      <div class="container-fluid">
        <a class="navbar-brand text-white" href="#">Gestión de Dispositivos</a>
        <button
          class="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarNav">
          <ul class="navbar-nav">
            <li class="nav-item">
              <a class="nav-link active" aria-current="page" href="#">Home</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>

    <div class="container my-5">
      <div class="text-center mb-5">
        <h1 class="fw-bold">Gestión de Dispositivos</h1>
        <p class="text-muted">Administra dispositivos de forma eficiente</p>
        <button id="addUserBtn" class="btn btn-primary btn-lg shadow-sm" @click="toggleForm('deviceForm')">Agregar Dispositivo</button>
      </div>

      <!-- Formulario para agregar un nuevo dispositivo -->
      <div id="deviceForm" class="card p-4 shadow-sm" v-show="showDeviceForm">
        <h3 class="mb-3">Agregar Dispositivo</h3>
        <form @submit.prevent="addDevice">
          <div class="mb-3">
            <input type="text" id="modelDevice" class="form-control" placeholder="Modelo" v-model="newDevice.model" required />
          </div>
          <div class="mb-3">
            <input type="text" id="brandDevice" class="form-control" placeholder="Marca" v-model="newDevice.brand" required />
          </div>
          <div class="mb-3">
            <input type="text" id="numberSerialDevice" class="form-control" placeholder="Número de Serie" v-model="newDevice.serialNumber" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Seleccione un tipo de dispositivo:</label>
            <select id="deviceType" name="deviceType" class="form-select" v-model="newDevice.type">
              <option value="1">LAPTOP</option>
              <option value="2">DESKTOP</option>
              <option value="3">TABLET</option>
              <option value="4">SMARTPHONE</option>
              <option value="5">SMARTWATCH</option>
              <option value="6">VIDEOGAME_CONSOLE</option>
              <option value="7">SPEAKER</option>
            </select>
          </div>
          <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-success me-2">Guardar</button>
            <button type="button" class="btn btn-secondary" @click="resetForm">Cancelar</button>
          </div>
        </form>
      </div>

      <!-- Formulario para editar un dispositivo -->
      <div id="editDeviceForm" class="card p-4 shadow-sm" v-show="showEditForm">
        <h3 class="mb-3">Editar Dispositivo</h3>
        <form @submit.prevent="updateDevice">
          <div class="mb-3">
            <input type="text" id="editmodelDevice" class="form-control" placeholder="Modelo" v-model="editDevice.model" required />
          </div>
          <div class="mb-3">
            <input type="text" id="editbrandDevice" class="form-control" placeholder="Marca" v-model="editDevice.brand" required />
          </div>
          <div class="mb-3">
            <input type="text" id="editnumberSerialDevice" class="form-control" placeholder="Número de Serie" v-model="editDevice.serialNumber" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Seleccione un tipo de dispositivo:</label>
            <select id="editdeviceType" name="deviceType" class="form-select" v-model="editDevice.type">
              <option value="1">LAPTOP</option>
              <option value="2">DESKTOP</option>
              <option value="3">TABLET</option>
              <option value="4">SMARTPHONE</option>
              <option value="5">SMARTWATCH</option>
              <option value="6">VIDEOGAME_CONSOLE</option>
              <option value="7">SPEAKER</option>
            </select>
          </div>
          <div class="d-flex justify-content-end">
            <button type="submit" class="btn btn-warning me-2">Actualizar</button>
            <button type="button" class="btn btn-secondary" @click="resetForm">Cancelar</button>
          </div>
        </form>
      </div>

      <!-- Lista de dispositivos -->
      <div id="userList">
        <div class="table-responsive">
          <table class="table table-bordered table-striped shadow-sm">
            <thead class="table-dark">
              <tr>
                <th>Tipo</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody id="tableList">
              <tr v-for="(device, index) in devices" :key="index">
                <td>{{ device.type }}</td>
                <td>{{ device.brand }}</td>
                <td>{{ device.model }}</td>
                <td>
                  <button class="btn btn-warning btn-sm me-2" @click="editDeviceInfo(index)">Editar</button>
                  <button class="btn btn-danger btn-sm" @click="deleteDevice(index)">Eliminar</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PouchDB from "pouchdb";
export default {
  data() {
    return {
      showDeviceForm: false,
      showEditForm: false,
      devices: [],
      newDevice: {
        model: "",
        brand: "",
        serialNumber: "",
        type: "1",
      },
      editDevice: {
        model: "",
        brand: "",
        serialNumber: "",
        type: "1",
      },
      editIndex: null,
      dbOnline: new PouchDB("onlineDB"),
      dbOffline: new PouchDB("offlineDB"),
      apiUrl: "http://ec2-107-23-52-108.compute-1.amazonaws.com:8008/api-sigser/device/",
    };
  },
  methods: {
    toggleForm(formId) {
      this.resetForm();
      if (formId === "deviceForm") this.showDeviceForm = !this.showDeviceForm;
    },
    resetForm() {
      this.showDeviceForm = false;
      this.showEditForm = false;
      this.newDevice = { model: "", brand: "", serialNumber: "", type: "1" };
      this.editDevice = { model: "", brand: "", serialNumber: "", type: "1" };
      this.editIndex = null;
    },
    async getUsers() {
      if (navigator.onLine) {
        try {
          const response = await fetch(this.apiUrl);
          const data = await response.json();
          await this.syncLocalDB(data.data || []);
          this.loadUsers(data.data || []);
        } catch (error) {
          console.error("Error al cargar datos desde la API:", error);
          alert("No se pudieron cargar los datos desde el servidor.");
        }
      } else {
        try {
          const localData = await this.dbOnline.allDocs({ include_docs: true });
          const users = localData.rows.map((row) => row.doc);
          this.loadUsers(users);
        } catch (error) {
          console.error("Error al cargar datos desde PouchDB:", error);
          alert("No se pudieron cargar los datos locales.");
        }
      }
    },
    async syncLocalDB(data) {
      for (const item of data) {
        try {
          const existing = await this.dbOnline.get(String(item.id)).catch(() => null);
          if (!existing || JSON.stringify(existing) !== JSON.stringify(item)) {
            await this.dbOnline.put({ ...item, _id: String(item.id) });
          }
        } catch (error) {
          console.error("Error al sincronizar datos locales:", error);
        }
      }
    },
    loadUsers(users) {
      this.devices = users.map((user) => ({
        id: user.id,
        type: user.deviceType?.name || "N/A",
        brand: user.brand || "N/A",
        model: user.model || "N/A",
      }));
    },
    addDevice() {
      this.devices.push({ ...this.newDevice });
      this.resetForm();
    },
    editDeviceInfo(index) {
      this.editIndex = index;
      this.editDevice = { ...this.devices[index] };
      this.showEditForm = true;
      this.showDeviceForm = false;
    },
    updateDevice() {
      if (this.editIndex !== null) {
        this.devices.splice(this.editIndex, 1, { ...this.editDevice });
        this.resetForm();
      }
    },
    deleteDevice(index) {
      this.devices.splice(index, 1);
    },
  },
  mounted() {
    if (navigator.serviceWorker) {
      navigator.serviceWorker.register("/pwa/service-worker.js").then(() => {
        if (Notification.permission !== "granted") {
          Notification.requestPermission();
        }
      });
    }
    this.getUsers();
    window.addEventListener("online", this.getUsers);
    window.addEventListener("offline", () => {
      console.log("Conexión perdida");
    });
  },
};
</script>

<style scoped>
body {
  background-color: #e3f2fd;
}

.navbar {
  background-color: #0d6efd;
}

.navbar .nav-link {
  color: #fff !important;
}

.navbar .nav-link:hover {
  background-color: #0056b3;
}

.card {
  border-radius: 15px;
}

table {
  width: 100%;
  margin-top: 20px;
}

table th,
table td {
  text-align: center;
  vertical-align: middle;
}

#userList {
  margin-top: 30px;
}
</style>
