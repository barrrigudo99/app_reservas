class CustomNavbar extends HTMLElement {
  connectedCallback() {
      // Obtener el nombre del usuario desde el token JWT
      let nombreUsuario = "Usuario";
      const token = localStorage.getItem("token");

      if (token) {
          try {
              const payload = JSON.parse(atob(token.split(".")[1]));
              nombreUsuario = payload.sub || "Usuario";
          } catch (error) {
              console.error("Error al decodificar el token:", error);
          }
      }

      // Crear Shadow DOM para encapsular estilos
      const shadowRoot = this.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = `
      <style>
          * {
              box-sizing: border-box;
              margin: 0;
              padding: 0;
          }

          .navbar {
              height: 60px;
              display: flex;
              justify-content: space-around;
              align-items: center;
              background-color: rgb(70, 182, 96);
              color: white;
              padding: 10px 0;
              position: fixed;
              bottom: 0;
              left: 0;
              width: 100%;
              border-top-left-radius: 12px;
              border-top-right-radius: 12px;
              z-index: 1000;
              font-family: Arial, sans-serif;
          }

          .nav-links {
              list-style: none;
              display: flex;
              justify-content: space-around;
              align-items: center;
              width: 100%;
              margin: 0;
              padding: 0;
          }

          .nav-links a {
              color: white;
              text-decoration: none;
              font-size: 1.2em;
              display: flex;
              flex-direction: column;
              align-items: center;
              transition: transform 0.2s ease;
              line-height: 1;
          }

          .nav-links a:hover {
              transform: scale(1.1);
          }

          .nav-links a span {
              font-size: 0.75em;
              margin-top: 5px;
          }

          /* Ocultar el nombre de usuario en dispositivos móviles */
          .nombre-usuario {
              display: none;
          }

          /* Mostrar en tabletas y escritorios */
          @media (min-width: 768px) {
              .nombre-usuario {
                  display: inline;
              }

              .navbar {
                  position: fixed;
                  top: 0;
                  bottom: auto;
                  border-bottom-left-radius: 12px;
                  border-bottom-right-radius: 12px;
                  border-top-left-radius: 0;
                  border-top-right-radius: 0;
                  flex-direction: row;
                  justify-content: space-between;
                  padding: 15px 30px;
                  width: 100%;
              }

              .nav-links {
                  flex-direction: row;
                  width: auto;
                  gap: 20px;
              }

              .nav-links a {
                  flex-direction: row;
                  font-size: 1em;
              }

              .nav-links a span {
                  margin-left: 5px;
                  font-size: 1em;
              }

              /* Añadir margen superior al body para evitar solapamientos */
              :host-context(body) {
                  padding-top: 80px; /* Ajusta esto si tu navbar es más alto */
              }
          }
      </style>

      <nav class="navbar">
          <ul class="nav-links">
              <li><a href="#"><span>🏠</span><span class="nombre-usuario">Inicio</span></a></li>
              <li><a href="pantalla_inicio.html"><img src="recursos/iconos/icon-football.svg" alt="Icono fútbol"><span class="nombre-usuario">Eventos</span></a></li>
              <li><a href="perfil.html"><span>👤</span><span class="nombre-usuario">Perfil: ${nombreUsuario}</span></a></li>
          </ul>
      </nav>
      `;
  }
}

customElements.define('custom-navbar', CustomNavbar);
