class EditarPerfil extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
        <style>
          :root {
            --accent-color: #17c964;
            --bg-color: #0a0a23;
            --input-bg: #1c1c3a;
            --text-color: #ffffff;
          }

          .modal-wrapper {
            background-color: var(--bg-color);
            color: var(--text-color);
            border-radius: 10px;
            width: 100%;
            padding: 1rem;
          }

          .section {
            margin-bottom: 1rem;
          }

          .section h5 {
            margin: 0;
            padding: 0.5rem;
            background-color: #131340;
            cursor: pointer;
            border-radius: 5px;
            color: var(--accent-color);
          }

          .section-content {
            display: none;
            margin-top: 1rem;
          }

          .form-group {
            margin-bottom: 1rem;
          }

          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            color: var(--accent-color);
          }

          .form-group input,
          .form-group select,
          .form-group textarea {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid var(--accent-color);
            border-radius: 6px;
            background-color: var(--input-bg);
            color: var(--text-color);
          }

          ion-button {
            display: block;
            width: 100%;
            padding: 0.75rem;
            background-color: var(--accent-color);
            border: none;
            color: #000;
            border-radius: 6px;
            font-size: 1rem;
            cursor: pointer;
          }

          ion-button[style*="background-color: #ff4d4d;"] {
            background-color: #ff4d4d !important;
            color: white;
          }
        </style>

  
        <div class="modal-wrapper">
          <h4>Editar perfil</h4>
  
          <div class="section">
            <h5 onclick="this.nextElementSibling.style.display = (this.nextElementSibling.style.display === 'block' ? 'none' : 'block')">Actualizar tu información</h5>
            <div class="section-content">
              <div class="form-group">
                <label for="nameId">Nombre de usario</label>
                <input type="text" id="nameId" />
              </div>

  
    
              <ion-button disabled>Actualizar</ion-button>
            </div>
          </div>
  
          <div class="section">
            <h5 onclick="this.nextElementSibling.style.display = (this.nextElementSibling.style.display === 'block' ? 'none' : 'block')">Actualizar email</h5>
            <div class="section-content">
              <p><strong>Email actual:</strong> carlosbarrientoslopez@gmail.com</p>
              <div class="form-group">
                <label for="newMail">Introduzca nuevo email</label>
                <input type="email" id="newMail" placeholder="example@domain.com" />
              </div>
              <ion-button disabled>Enviar</ion-button>
            </div>
          </div>
  
          <div class="section">
            <h5 onclick="this.nextElementSibling.style.display = (this.nextElementSibling.style.display === 'block' ? 'none' : 'block')">Cambiar contraseña</h5>
            <div class="section-content">
              <div class="form-group">
                <label for="passwordPast">Contraseña actual</label>
                <input type="password" id="passwordPast" placeholder="Mín 6 caract." />
              </div>
              <div class="form-group">
                <label for="passwordUpdate">Contraseña nueva</label>
                <input type="password" id="passwordUpdate" placeholder="Mín 6 caract." />
              </div>
              <ion-button disabled>Cambiar</ion-button>
            </div>
          </div>
  
          <div class="section">
            <h5 onclick="this.nextElementSibling.style.display = (this.nextElementSibling.style.display === 'block' ? 'none' : 'block')">Eliminar cuenta</h5>
            <div class="section-content">
              <p>¿Seguro que quieres eliminar tu cuenta? 😔</p>
              
              <ion-button style="background-color: #ff4d4d;">Eliminar</ion-button>
            </div>
          </div>
        </div>
      `;
    }
  }
  
  customElements.define('editar-perfil', EditarPerfil);
  