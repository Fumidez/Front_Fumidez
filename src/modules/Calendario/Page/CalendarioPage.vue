<template>
  <div class="calendar-container">
    <vue-cal :events="events" default-view="month" @event-click="handleEventClick">
      <template #event="{ event }">
        <div class="vuecal__event-title" v-html="event.title" :class="{ 'orden-trabajo': event.isOrdenTrabajo }"></div>
        <em class="vuecal__event-time">
          <strong>Event start:</strong>
          <span>{{ event.start.formatTime() }}</span>
          <br />
          <strong>Event end:</strong>
          <span>{{ event.end.formatTime() }}</span>
        </em>
      </template>
    </vue-cal>
    <!-- Modal for event details -->
    <div v-if="selectedEvent" class="event-details-modal">
      <div class="modal-content">
        <span class="close-btn" @click="closeModal">&times;</span>
        <h3>{{ selectedEvent.title }}</h3>
        <p><strong>Fecha:</strong> {{ selectedEvent.start.format() }}</p>
        <p><strong>Persona Encargada:</strong> {{ selectedEvent.persona }}</p>
        <p><strong>Cliente:</strong> {{ selectedEvent.cliente }}</p> <!-- Added client information -->
        <p><strong>Descripción:</strong> {{ selectedEvent.descripcion }}</p>
        <p><strong>Work hour:</strong> {{ selectedEvent.workHour }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import axios from "axios";
import { consultarOrdenSimpleFachada } from "../../OrdenTrabajo/helpers/OrdenTrabajoHelper";
import { buscarClientePorIdFachada } from "../../Cliente/helpers/ClienteHelper";

export default {
  components: { VueCal },
  data() {
    return {
      events: [],
      selectedEvent: null, // Track selected event for modal display
    };
  },

  mounted() {
    this.created();
  },

  methods: {
    async created() {
      const data = await consultarOrdenSimpleFachada();
      console.log(data);
      this.events = data.map((orden) => {
        const startDate = new Date(orden.fecha);
        const endDate = new Date(orden.fecha);
        const formatDate = (date, hour) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate() + 1).padStart(2, "0");

          // Divide hour in hours and minutes
          const [hours, minutes] = hour.split(":");

          return `${year}-${month}-${day} ${hours}:${minutes}`;
        };
        const addOneHour = (hourString) => {
          const [hours, minutes, seconds] = hourString.split(":").map(Number);
          const date = new Date();
          date.setHours(hours, minutes, seconds);
          date.setHours(date.getHours() + 1);

          const newHours = String(date.getHours()).padStart(2, "0");
          const newMinutes = String(date.getMinutes()).padStart(2, "0");

          return `${newHours}:${newMinutes}:00`;
        };

        const startFormatted = formatDate(startDate, orden.hora);
        const endFormatted = formatDate(endDate, addOneHour(orden.hora));

        // Calculate the duration (work hour) by subtracting start and end dates
        const startTime = new Date(startFormatted);
        const endTime = new Date(endFormatted);
        const durationMinutes = (endTime - startTime) / 60000; // Duration in minutes
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        const workHour = `${hours}h ${minutes}m`;
        console.log(orden);

        return {
          start: startFormatted,
          end: endFormatted,
          title: `Orden #${orden.numeroOrden}`,
          persona: ` `,
          cliente: `${orden.idClientes}`, // Added client information
          descripcion: orden.descripcion || "No description available", // Add description if available
          workHour: workHour, // Calculated work hour
          isOrdenTrabajo: true, // Indicador para aplicar un estilo especial
        };
      });

      console.log(this.events);
    },

    async handleEventClick(event) {
      if (!event.cliente) {
        console.error("El cliente no está definido en el evento:", event);
        return; 
      }

      try {
        const cliente = await buscarClientePorIdFachada(event.cliente);
        const datos = {
          ...event,
          persona: cliente.personaEncargada,
          cliente: cliente.nombre,
        };
        this.selectedEvent = datos;
      } catch (error) {
        console.error("Error al buscar cliente por ID:", error);
      }
    },
    closeModal() {
      this.selectedEvent = null;
    },
  },
};
</script>

<style scoped>
/* General styling for the calendar container */
.calendar-container {
  margin: 0 auto;
  width: 95%;
  max-width: 1200px;
  font-family: Arial, sans-serif;
  position: relative;
}

/* Styling for each event */
.vuecal__event {
  padding: 20px;
  font-size: 18px;
  border-radius: 8px;
  background: linear-gradient(145deg, #0078d4, #005a9e);
  color: white;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  justify-content: center;
  position: relative;
  z-index: 1;
  overflow: hidden;
  transition: all 0.3s ease;
  height: 150px;
  width: 100%;
}

.vuecal__event:hover {
  background: linear-gradient(145deg, #005a9e, #0078d4);
  transform: scale(1.05);
}

/* Specific styling for orden de trabajo events */
.vuecal__event.orden-trabajo {
  background: linear-gradient(145deg, #0078d4, #005a9e);
  height: 180px;
  padding: 30px;
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.vuecal__event.orden-trabajo:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
}

/* Styling for the event title */
.vuecal__event-title {
  font-weight: bold;
  font-size: 20px;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Styling for the event time */
.vuecal__event-time {
  font-size: 16px;
  color: #d3d3d3;
  text-transform: capitalize;
}

/* Modal styling */
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
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  width: 80%;
  max-width: 500px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  animation: slideIn 0.3s ease;
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
  color: #ff4d4d;
}

/* Responsive design adjustments */
@media (max-width: 768px) {
  .vuecal__day {
    height: 120px;
  }

  .vuecal__event {
    font-size: 14px;
    padding: 15px;
  }

  .modal-content {
    padding: 20px;
    max-width: 90%;
  }
}

/* Keyframe animation for modal */
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
