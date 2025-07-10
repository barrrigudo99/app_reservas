class ScrollSelector extends HTMLElement {
  connectedCallback() {
    this.idCampo = new URLSearchParams(window.location.search).get('id');
    //alert(this.idCampo)

    this.innerHTML = `
      <style>
        .scroll-wrapper {
          background-color: white;
          padding: 20px;
          margin: 40px 0;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
          border: 4px solid #3b82f6;
        }

        .scroll-grid {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: min-content;
          gap: 10px;
          overflow-x: auto;
          padding: 10px;
          background-color: #ffff;
          border: 1px solid #ddd;
          border-radius: 6px;
          margin-bottom: 20px;
        }

        .scroll-grid button {
          font-size: 0.85em;
          padding: 6px 10px;
          min-width: 60px;
          background-color: #e0e7ff;
          border: 1px solid #a5b4fc;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .scroll-grid button.activo {
          background-color: #0fa447;
        }


        .scroll-grid button.occupied {
          background-color: #f87171;
          border-color: #dc2626;
          color: white;
          cursor: not-allowed;
        }

        #botones-a button {
          font-size: 0.9em;
          padding: 6px 10px;
          min-width: 60px;
          background-color: transparent;
          border: none;
          cursor: pointer;
        }

        #botones-a button.date-slide.active {
          border-bottom: 3px solid #3b82f6;
          color: #1d4ed8; 
        }

        .fade-out {
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .fade-in {
          opacity: 1;
          transition: opacity 0.3s ease;
        }

        .fecha-seleccionada-label {
          margin-bottom: 5px;
          font-weight: bold;
          font-size: 1.1em;
          color: #333;
        }

        .fecha-iso-label {
          font-size: 0.95em;
          color: #666;
          margin-bottom: 10px;
        }

        .boton-reserva button {
          padding: 12px 30px;
          font-size: 1em;
          font-weight: bold;
          background-color: #3b82f6;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        .boton-reserva button:hover {
          background-color: #2563eb;
          transform: translateY(-2px);
          box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
        }
      </style>

      <div class="scroll-wrapper">
        <div class="fecha-seleccionada-label" id="fecha-label">Seleccione un día</div>
        <div class="fecha-iso-label" id="iso-label"></div>
        <div class="date-slider overflow-x-auto mb-4" id="botones-a"></div>
        <div class="scroll-grid fade-in" id="botones-b"></div>

        <div class="boton-reserva">
         <button id="btnReservar">Reservar</button>
        </div>

      </div>
    `;


    



    this.botonesA = this.querySelector('#botones-a');
    this.botonesB = this.querySelector('#botones-b');
    this.fechaLabel = this.querySelector('#fecha-label');
    this.isoLabel = this.querySelector('#iso-label');
    this.btn_reserva = this.querySelector('#boton-reserva');

    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id'); // ejemplo: 1
  

    // C
    // Al hacer clic en el botón, redirigir con el mismo id
    
    const btnReservar = this.querySelector('#btnReservar');

    btnReservar.addEventListener('click', async () => {



      


      /**
       * 
       */
    
      const campoId = this.idCampo;
      const usuarioId = localStorage.getItem("idUsuario"); // cambia esto según el usuario logueado
      const fecha = this.isoLabel.textContent.split(': ')[1]; // extrae solo la fecha del label
      let activo;
      let diaSeleccionado;
      /*
      */
      let horasSeleccionadas = [];
      this.botonesB.querySelectorAll('.bbq2__slot.available.selected').forEach(btn => {
        horasSeleccionadas.push(btn.getAttribute('data-time'));
      });

      if (this.botonesA) {
        activo = this.botonesA.querySelector('.date-slide.active');
        diaSeleccionado = activo ? activo.getAttribute('data-fecha') : null;
      } else {
        console.warn("this.botonesA no está definido o aún no está en el DOM");
      }
         


      
      
      
      if (horasSeleccionadas.length === 0) {
        alert("Selecciona al menos una hora para reservar.");
        return;
      }

      

    
      // Obtener horaInicio y horaFin
      const horaInicio = horasSeleccionadas[0];
      const horaFin = horasSeleccionadas[horasSeleccionadas.length-1];

/*
      console.log(horasSeleccionadas)
      console.log("campoId:", campoId);
      console.log("usuarioId:", usuarioId);
      console.log("fecha:", fecha);
      console.log("horaInicio:", horaInicio);
      console.log("diaSeleccionado:", diaSeleccionado);
      //console.log("horaFin:", sumarUnaHora(horaFin));
    */
      


      
    

    /* constatnte para asignar datos a la consulta desde el frontend al backend 
    */ 
      const reservaDTO = {
        campoId: campoId,
        usuarioId: usuarioId,
        fecha: fecha,
        horaInicio: horaInicio,
        horaFin: sumarUnaHora(horaFin),
      };
      

      //alert("reservaDTO: " + JSON.stringify(reservaDTO, null, 2));

      
    
      /*
      try {
        const response = await fetch('http://localhost:8081/api/reservas', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(reservaDTO)
        });
    
        if (!response.ok) {
          const errorMsg = await response.text();
          throw new Error(errorMsg);
        }
    
        console.log("Reserva creada correctamente");
        alert("Reserva creada correctamente")
        window.location.href = `pago.html?id=${campoId}`;
      } catch (error) {
        console.error("Error al crear la reserva:", error);
        alert("No se pudo crear la reserva: " + error.message);
      }*/
      const url = `pago.html?id=${campoId}&fecha=${diaSeleccionado}&horas=${horasSeleccionadas.join(",")}`;
      window.location.href = url;
    });
    // C
    
    
    this.fechas = [];
    this.renderBotonesA();
    this.renderBotonesB(new Date());
  }

  renderBotonesA() {
    const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sabado'];
    const hoy = new Date();

    for (let i = 0; i < 12; i++) {
      const fecha = new Date(hoy);
      fecha.setDate(hoy.getDate() + i);
      this.fechas[i] = fecha;
      const diaSemana = diasSemana[fecha.getDay()];
      const dia = fecha.getDate();
      const texto = `${diaSemana} ${dia}`;

      const btn = document.createElement('button');
      btn.textContent = texto;
      btn.addEventListener('click', () => {
        const iso = fecha.toISOString().split('T')[0];
        this.fechaLabel.textContent = `Seleccionado: ${texto}`;
        this.isoLabel.textContent = `Fecha ISO para backend: ${iso}`;

        this.botonesA.querySelectorAll('button').forEach(b => b.classList.remove('boton-dia-activo'));
        btn.classList.add('boton-dia-activo');

        this.handleBotonAClick(fecha);
      });
      this.botonesA.appendChild(btn);
    }
  }

  handleBotonAClick(fecha) {
    this.botonesB.classList.remove('fade-in');
    this.botonesB.classList.add('fade-out');

    setTimeout(() => {
      this.renderBotonesB(fecha);
      this.botonesB.classList.remove('fade-out');
      this.botonesB.classList.add('fade-in');
    }, 1000);
  }

  async renderBotonesB(fecha) {
    this.botonesB.innerHTML = '';
    const fechaIso = fecha.toISOString().split('T')[0];
    const ocupadas = new Set();

    if (this.idCampo) {
      try {
        const response = await fetch(`http://localhost:8081/api/reservas/campo/${this.idCampo}/fecha/${fechaIso}`);
        const reservas = await response.json();
        reservas.forEach(r => {
          const inicio = parseInt(r.horaInicio.split(":"[0]));
          const fin = parseInt(r.horaFin.split(":"[0]));
          for (let h = inicio; h < fin; h++) {
            ocupadas.add(h.toString().padStart(2, '0') + ':00');
          }
          //console.log(ocupadas)
        });
      } catch (e) {
        console.error("Error cargando reservas:", e);
      }
    }

    for (let i = 0; i < 24; i++) {
      const hora = i.toString().padStart(2, '0') + ':00';
      const btn = document.createElement('button');
      btn.textContent = hora;
      
    
      if (ocupadas.has(hora)) {
        btn.classList.add('occupied');
        btn.disabled = true;
      } else {
        // Si no está ocupada, permitir seleccionar y alternar clase activa
        btn.addEventListener('click', () => {
          btn.classList.toggle('activo');
        });
      }
    
      this.botonesB.appendChild(btn);
    }
    
  }
}

customElements.define('componente-disponibilidad', ScrollSelector);

function sumarUnaHora(hora) {
  // Limpiar espacios
  hora = hora.trim();

  // Obtener horas y minutos
  const horas = parseInt(hora.substring(0, 2), 10);
  const minutos = parseInt(hora.substring(2, 4), 10);

  // Crear un objeto Date cualquiera (la fecha no importa)
  const fecha = new Date();
  fecha.setHours(horas);
  fecha.setMinutes(minutos);

  // Sumar 1 hora
  fecha.setHours(fecha.getHours() + 1);

  // Formatear de nuevo como HHmm
  const nuevaHora = fecha.getHours().toString().padStart(2, '0') +
                    fecha.getMinutes().toString().padStart(2, '0');

  return nuevaHora;
}



