<template>
  <div class="calendar-container">
    <v-calendar
      ref="calendar"
      :events="events"
      color="primary"
      :event-color="getEventColor"
      :event-more-text="'Más...'"
      :show-more
      :event-overlap-mode="'stack'"
      :weekdays="[0, 1, 2, 3, 4, 5, 6]"
      type="month"
    >
      <template #event="{ event, timed }">
        <div
          class="vcal-event"
          :class="{ 'orden-trabajo': event.isOrdenTrabajo }"
          style="cursor: pointer;"
          @click="handleEventClick({ event })"
        >
          <div class="vcal-event-title" v-html="event.title"></div>
          <em class="vcal-event-time" v-if="timed">
            <strong>Inicio:</strong> {{ formatTime(event.start) }}<br />
            <strong>Fin:</strong> {{ formatTime(event.end) }}
          </em>
        </div>
      </template>
    </v-calendar>

    <div v-if="selectedEvent" class="event-details-modal" @click.self="closeModal">
      <div class="modal-content">
        <button class="close-btn" @click="closeModal">&times;</button>
        <h3>{{ selectedEvent.title }}</h3>
        <p><strong>Fecha:</strong> {{ formatDate(selectedEvent.start) }}</p>
        <p><strong>Persona Encargada:</strong> {{ selectedEvent.persona }}</p>
        <p><strong>Cliente:</strong> {{ selectedEvent.cliente }}</p>
        <p><strong>Descripción:</strong> {{ selectedEvent.descripcion }}</p>
        <p><strong>Work hour:</strong> {{ selectedEvent.workHour }}</p>
        <p><strong>Usuario:</strong> {{ selectedEvent.usuario }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import { VCalendar } from "vuetify/labs/VCalendar";
import { consultarOrdenSimpleFachada } from "../../OrdenTrabajo/helpers/OrdenTrabajoHelper";
import { buscarClientePorIdFachada } from "../../Cliente/helpers/ClienteHelper";
import { obtenerUsuarioFachada } from "../../Usuario/helpers/UsuarioHelper";

export default {
  components: {
    VCalendar,
  },
  data() {
    return {
      events: [],
      selectedEvent: null,
    };
  },
  mounted() {
    this.loadEvents();
  },
  methods: {
    async loadEvents() {
      const data = await consultarOrdenSimpleFachada();

      const formatDateTime = (date, hour) => {
        const [hours, minutes] = hour.split(":");
        const d = new Date(date);
        d.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        return d;
      };

      this.events = data.map((orden) => {
        const startFormatted = formatDateTime(orden.fecha, orden.hora);
        const endFormatted = formatDateTime(orden.fecha, orden.horaFin);

        const diffMs = endFormatted - startFormatted;
        const diffHrs = Math.floor(diffMs / 3600000);
        const diffMins = Math.round((diffMs % 3600000) / 60000);
        const workHour = `${diffHrs}h ${diffMins}m`;

        return {
          start: startFormatted,
          end: endFormatted,
          name: `Orden ${orden.numeroOrden}`,
          title: `Orden ${orden.numeroOrden}`,
          persona: "",
          cliente: orden.idClientes || null,
          usuario: orden.idUsuarios || null,
          descripcion: orden.descripcion || "No description available",
          workHour,
          isOrdenTrabajo: true,
          color: "primary",
        };
      });
    },

    async handleEventClick({ event }) {
      try {
        let clienteNombre = "Desconocido";
        let personaEncargada = "Desconocida";
        let usuarioNombre = "Desconocido";

        if (event.cliente) {
          const cliente = await buscarClientePorIdFachada(event.cliente);
          clienteNombre = cliente.nombre || "Desconocido";
          personaEncargada = cliente.personaEncargada || "Desconocida";
        }
        if (event.usuario) {
          const usuario = await obtenerUsuarioFachada(event.usuario);
          usuarioNombre = usuario.nombre || "Desconocido";
        }

        this.selectedEvent = {
          ...event,
          cliente: clienteNombre,
          persona: personaEncargada,
          usuario: usuarioNombre,
        };
      } catch (error) {
        this.selectedEvent = { ...event };
      }
    },

    closeModal() {
      this.selectedEvent = null;
    },

    formatTime(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    },

    formatDate(date) {
      if (!date) return "";
      const d = new Date(date);
      return d.toLocaleDateString();
    },

    getEventColor(event) {
      return event.isOrdenTrabajo ? "blue darken-2" : "grey lighten-1";
    },
  },
};
</script>

<style scoped>
.calendar-container {
  margin: 0 auto;
  width: 95%;
  max-width: 1200px;
  font-family: Arial, sans-serif;
  position: relative;
}

.vcal-event {
  padding: 10px;
  font-size: 8px;
  background: linear-gradient(145deg, #0078d4, #005a9e);
  color: #ffffff;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  position: relative;
  z-index: 1;
  overflow: visible;
  height: auto !important;
  min-height: 120px;
  word-break: break-word;
  white-space: normal;
  transition: all 0.3s ease;
  border-radius: 6px;
  cursor: pointer;
}

.vcal-event:hover {
  background: linear-gradient(145deg, #005a9e, #0078d4);
  transform: scale(1.05);
}

.vcal-event.orden-trabajo {
  background: linear-gradient(145deg, #0078d4, #005a9e);
  padding: 15px;
  min-height: 120px;
  height: auto !important;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.vcal-event.orden-trabajo:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

.vcal-event-title {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 5px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  white-space: normal;
  overflow: visible;
}

.vcal-event-time {
  font-size: 16px;
  color: #ff0000;
  text-transform: capitalize;
  margin-top: 5px;
}

/* Modal */
.event-details-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  transition: opacity 0.3s ease;
}

.modal-content {
  background-color: #dddbe5;
  padding: 30px;
  border-radius: 12px;
  width: 80%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
  position: relative;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 24px;
  color: #333;
  cursor: pointer;
  background: transparent;
  border: none;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #645a5a;
}

/* Botones de navegación visuales del calendario */
::v-deep(.v-calendar-header__icons button) {
  background-color: #0078d4 !important;
  color: rgb(57, 4, 4) !important;
  border-radius: 50%;
  width: 45px;
  height: 45px;
  padding: 0;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 24px;
  transition: background-color 0.3s ease, transform 0.2s ease;
  border: none;
  cursor: pointer;
  user-select: none;
}

::v-deep(.v-calendar-header__icons button:hover) {
  background-color: #005a9e !important;
  transform: scale(1.1);
}

::v-deep(.v-calendar-header__icons button:active) {
  background-color: #021e33 !important;
  transform: scale(0.95);
}

::v-deep(.v-calendar-header__icons button .v-icon) {
  color: rgb(105, 0, 0) !important;
  font-size: 28px;
}

/* Responsive */
@media (max-width: 768px) {
  .vcal-event {
    font-size: 14px;
    padding: 15px;
    min-height: 160px;
  }

  .modal-content {
    padding: 20px;
    max-width: 90%;
  }
}

@keyframes slideIn {
  from {
    transform: translateY(-50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
