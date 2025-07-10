  class EditarPerfil extends HTMLElement {
    connectedCallback() {
      const shadow = this.attachShadow({ mode: "open" });

      shadow.innerHTML = `

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
              background-color: #000000;
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
                <p><strong>Email actual:</strong> ${recuperar_email_Token(localStorage.getItem("token"))} </p>
                <div class="form-group">
                  <label for="newMail">Introduzca nuevo email</label>
                  <input type="email" id="newMail" placeholder="introduzca su email nuevo" autocomplete="off">
                  
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

      setTimeout(() => {
        const idUsuario = localStorage.getItem("idUsuario");
        const token = localStorage.getItem('token');
        console.log("golas");


        // ACTUALIZAR NOMBRE
        shadow.querySelectorAll("ion-button")[0].disabled = false;
        shadow.querySelectorAll("ion-button")[0].addEventListener("click", async () => {
          const nombre = shadow.querySelector("#nameId").value;
          try {
            const response = await fetch(`http://localhost:8081/api/usuarios/${idUsuario}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
              body: JSON.stringify({ nombre })
            });
            alert("Nombre actualizado");
          } catch {
            alert("Error actualizando nombre");
          }
        });

        // ACTUALIZAR EMAIL
        shadow.querySelectorAll("ion-button")[1].disabled = false;
        shadow.querySelectorAll("ion-button")[1].addEventListener("click", async () => {
          const email = shadow.querySelector("#newMail").value;
          try {
            const response = await fetch(`http://localhost:8081/api/usuarios/${idUsuario}/email`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ email })
            });
            const msg = await response.text();
            alert(":"+msg);
             // redirigir a perfil
            location.href = "index.html";
          } catch {
            alert("Error actualizando email");
          }
        
        });

        // CAMBIAR CONTRASEÑA
        shadow.querySelectorAll("ion-button")[2].disabled = false;
        shadow.querySelectorAll("ion-button")[2].addEventListener("click", async () => {
          const actual = shadow.querySelector("#passwordPast").value;
          const nueva = shadow.querySelector("#passwordUpdate").value;
          try {
            const response = await fetch(`http://localhost:8081/api/usuarios/${idUsuario}/password`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ actual, nueva })
            });
            if (!response.ok) {
              const msg = await response.text();
              console.error("Error desde backend:", msg);
              alert(`Error: ${msg}`);
              return;
            }
            alert(await response.text());
          } catch {
            alert("Error cambiando contraseña");
          }
        });

        // ELIMINAR CUENTA
        shadow.querySelectorAll("ion-button")[3].addEventListener("click", async () => {
          if (!confirm("¿Seguro que quieres eliminar tu cuenta?")) return;
          try {
            const response = await fetch(`http://localhost:8081/api/usuarios/${idUsuario}`, {
              method: "DELETE"
            });
            if (response.ok) {
              alert("Cuenta eliminada");
              // redirigir o cerrar sesión
              location.href = "index.html";
            } else {
              alert("Error al eliminar cuenta");
            }
          } catch {
            alert("Error al eliminar cuenta");
          }
        });
      }, 0);
    
    
      ///

      function recuperar_email_Token(token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log(payload.sub);
        return payload.sub;
      }
      
      
      
  

    
    
    
    }
  }

  customElements.define("editar-perfil", EditarPerfil);


