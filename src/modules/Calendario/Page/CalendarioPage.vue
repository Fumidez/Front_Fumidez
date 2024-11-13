<template>
  <div>
    <vue-cal :events="events" default-view="month">
      <template #event="{ event }">
        <div class="vuecal__event-title" v-html="event.title"></div>
        <em class="vuecal__event-time">
          <strong>Event start:</strong>
          <span>{{ event.start.formatTime() }}</span>
          <br />
          <strong>Event end:</strong>
          <span>{{ event.end.formatTime() }}</span>
        </em>
      </template>
    </vue-cal>
  </div>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import axios from "axios";
import { consultarOrdenSimpleFachada } from "../../OrdenTrabajo/helpers/OrdenTrabajoHelper";
export default {
  components: { VueCal },
  data() {
    return {
      events: [
      ],
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
          const day = String(date.getDate()+1).padStart(2, "0");

          // Divide hour en horas y minutos
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

        return {
          start: formatDate(startDate, orden.hora),
          end: formatDate(endDate, addOneHour(orden.hora)),
          title: `Orden #${orden.numeroOrden}`,
        };

      });

      console.log(this.events);
    },
  },
};
</script>