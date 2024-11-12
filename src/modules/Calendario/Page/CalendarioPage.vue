<template>
    <div>
      <vue-cal
        :events="events"
        default-view="month"
        @event-click="onEventClick"
      />
    </div>
  </template>
  
  <script>
  import VueCal from 'vue-cal';
  import 'vue-cal/dist/vuecal.css';
  import axios from 'axios';
  
  export default {
    components: { VueCal },
    data() {
      return {
        events: []
      };
    },
    async created() {
      const { data } = await axios.get("http://localhost:7070/app-orden/orden");
      this.events = data.map(orden => ({
        start: new Date(orden.fecha),
        title: `Orden #${orden.numeroOrden}: ${orden.descripcion}`,
        id: orden.id
      }));
    },
    methods: {
      onEventClick(event) {
        alert(`Detalle de la orden: ${event.title}`);
        this.enviarRecordatorio(event.id);
      },
      async enviarRecordatorio(id) {
        await axios.post(`http://localhost:7070/orden/recordatorio/${id}`);
        alert("Recordatorio enviado");
      }
    }
  };
  </script>
  