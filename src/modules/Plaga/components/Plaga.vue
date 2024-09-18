<template>
    <div class="container">
        <h2>Plagas</h2>
        <div class="content">
            <div class="form-container">
                <div class="form-group">
                    <label for="tipoPlaga">Tipo de Plaga</label>
                    <input type="text" id="tipoPlaga" v-model="plaga.tipoPlaga" required>
                </div>
                <div class="form-group">
                    <label for="informeId">ID Informe</label>
                    <input type="number" id="informeId" v-model="plaga.informeId" required>
                </div>
                <button v-if="!actualizarDato" class="btn" @click="ingresar">Crear Plaga</button>
                <button v-else class="btn" @click="actualizar">Actualizar Plaga</button>
                <button v-if="actualizarDato" class="btn" @click="cambiarEstado">Cambiar a modo de ingreso</button>
            </div>
            <div class="plaga-list-container">
                <div class="plaga-list-header">
                    <span class="header-item">ID</span>
                    <span class="header-item">Tipo de Plaga</span>
                    <span class="header-item">ID Informe</span>
                    <span class="header-item">Acciones</span>
                </div>
                <ul class="plaga-list">
                    <li v-for="plaga in plagas" :key="plaga.id" class="plaga-item">
                        <span>{{ plaga.id }}</span>
                        <span>{{ plaga.tipoPlaga }}</span>
                        <span>{{ plaga.informeId }}</span>
                        <div class="action-buttons">
                            <button class="btn" @click="cambiarCampos(plaga.id)">Editar</button>
                            <button class="btn btn-danger" @click="eliminar(plaga.id)">Eliminar</button>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script>
import {
    crearPlagaFachada,
    obtenerTodosLosPlagasFachada,
    actualizarPlagaFachada,
    eliminarPlagaFachada,
    obtenerPlagaFachada
} from '../helpers/plagasHelpers';

export default {
    data() {
        return {
            plaga: {
                id: null,
                tipoPlaga: "",
                informeId: null
            },
            plagas: [],
            actualizarDato: false
        };
    },
    methods: {
        async ingresar() {
            if (this.plaga.tipoPlaga && this.plaga.informeId) {
                try {
                    await crearPlagaFachada(this.plaga);
                    alert("Plaga creada");
                    this.resetPlaga();
                    this.buscarPlagas();
                } catch (error) {
                    console.error("Error al crear la plaga:", error);
                }
            } else {
                alert("Faltan llenar campos");
            }
        },
        async actualizar() {
            if (this.plaga.tipoPlaga && this.plaga.informeId) {
                try {
                    await actualizarPlagaFachada(this.plaga.id, this.plaga);
                    alert("Plaga actualizada");
                    this.buscarPlagas();
                    this.resetPlaga();
                    this.actualizarDato = false;
                } catch (error) {
                    console.error("Error al actualizar la plaga:", error);
                }
            } else {
                alert("Faltan llenar campos");
            }
        },
        async eliminar(id) {
            try {
                await eliminarPlagaFachada(id);
                alert("Plaga eliminada");
                this.buscarPlagas();
            } catch (error) {
                console.error("Error al eliminar la plaga:", error);
            }
        },
        async buscarPlagas() {
            try {
                const response = await obtenerTodosLosPlagasFachada();
                this.plagas = response;
            } catch (error) {
                console.error("Error al obtener las plagas:", error);
            }
        },
        async cambiarCampos(id) {
            try {
                let plagaData = await obtenerPlagaFachada(id);
                this.plaga = plagaData;
                this.actualizarDato = true;
            } catch (error) {
                console.error("Error al cargar los datos de la plaga:", error);
            }
        },
        cambiarEstado() {
            this.actualizarDato = !this.actualizarDato;
            this.resetPlaga();
        },
        resetPlaga() {
            this.plaga = {
                id: null,
                tipoPlaga: "",
                informeId: null
            };
        }
    },
    mounted() {
        this.buscarPlagas();
    }
};
</script>

<style scoped>
.container {
    background-color: #121212;
    color: #ffffff;
    padding: 20px;
    border-radius: 8px;
    max-width: 1200px;
    margin: 0 auto;
}

h2 {
    color: #f0f0f0;
    margin-bottom: 20px;
}

.content {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-container {
    background-color: #1e1e1e;
    padding: 20px;
    border-radius: 8px;
}

.form-group {
    margin-bottom: 15px;
}

label {
    display: block;
    margin-bottom: 5px;
    color: #b0b0b0;
}

input[type="text"],
input[type="number"] {
    width: 100%;
    padding: 8px;
    border: 1px solid #444;
    border-radius: 4px;
    background-color: #333;
    color: #fff;
}

.btn {
    background-color: #6200ea;
    color: #ffffff;
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 10px;
}

.btn:hover {
    background-color: #3700b3;
}

.btn-danger {
    background-color: #b00020;
}

.btn-danger:hover {
    background-color: #790000;
}

.plaga-list-container {
    background-color: #1e1e1e;
    padding: 20px;
    border-radius: 8px;
}

.plaga-list-header {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    background-color: #333;
    padding: 10px;
    border-radius: 4px;
    margin-bottom: 10px;
}

.header-item {
    text-align: left;
    font-weight: bold;
    color: #f0f0f0;
}

.plaga-list {
    list-style-type: none;
    padding: 0;
    margin: 0;
}

.plaga-item {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #444;
    background-color: #2c2c2c;
    border-radius: 4px;
    margin-bottom: 10px;
}

.action-buttons {
    display: flex;
    gap: 10px;
}
</style>