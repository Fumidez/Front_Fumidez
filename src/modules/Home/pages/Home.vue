<template>
    <div class="home-container">
     
  
      <!-- Contenido Principal -->
      <main class="main-content">
        <section class="welcome-section">
          <h1>Bienvenido a Fumidez</h1>
          <p>Soluciones efectivas para el control de plagas.</p>
          <button @click="redirectToLogin">Iniciar Sesión</button>
        </section>
  
        <section class="features-section">
          <div class="feature">
            <img src="../assets/feature1.png" alt="Feature 1" />
            <h2>Servicio Profesional</h2>
            <p>Ofrecemos servicios de alta calidad para proteger tu negocio.</p>
          </div>
          <div class="feature">
            <img src="../assets/feature2.png" alt="Feature 2" />
            <h2>Atención al Cliente</h2>
            <p>Nuestro equipo está disponible para ayudarte en todo momento.</p>
          </div>
          <div class="feature">
            <img src="../assets/feature3.png" alt="Feature 3" />
            <h2>Tecnología Avanzada</h2>
            <p>Utilizamos las últimas tecnologías para garantizar resultados efectivos.</p>
          </div>
        </section>
      </main>
  
      <!-- Pie de Página (opcional) -->
      <footer class="footer">
        <p>&copy; 2024 Fumidez. Todos los derechos reservados.</p>
      </footer>
    </div>
  </template>
  
  <script>
  // Asegúrate de importar el componente Header
  
  export default {
    name: "Home",
    components: {
      Header
    },
    methods: {
      redirectToLogin() {
        this.$router.push('/login');
      }
    }
  };
  </script>
  
  <style scoped>
  .home-container {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }
  
  .main-content {
    flex: 1;
    padding: 2rem;
    background-color: #f0f4f8;
  }
  
  .welcome-section {
    text-align: center;
    margin-bottom: 3rem;
  }
  
  .welcome-section h1 {
    font-size: 2.5rem;
    color: #181C71;
    margin-bottom: 1rem;
  }
  
  .welcome-section p {
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 2rem;
  }
  
  .welcome-section button {
    padding: 0.75rem 1.5rem;
    background-color: #181C71;
    color: white;
    font-size: 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .welcome-section button:hover {
    background-color: #4a5d92;
  }
  
  .features-section {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    gap: 2rem;
  }
  
  .feature {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;
    width: 30%;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .feature img {
    width: 60px;
    height: 60px;
    margin-bottom: 1rem;
  }
  
  .feature h2 {
    font-size: 1.5rem;
    color: #181C71;
    margin-bottom: 0.5rem;
  }
  
  .feature p {
    font-size: 1rem;
    color: #555;
  }
  
  .footer {
    background-color: #181C71;
    color: white;
    text-align: center;
    padding: 1rem 0;
  }
  </style>
  