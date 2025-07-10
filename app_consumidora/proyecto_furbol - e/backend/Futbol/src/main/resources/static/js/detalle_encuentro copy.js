// MIO

// Obtener el nombre del campo desde la URL
function obtenerNombreCampo() {
    const urlParams = new URLSearchParams(window.location.search);
    const idCampo = urlParams.get('id');
    
    if (!idCampo) {
        console.warn('No se encontró ID del campo en la URL');
        return null;
    }
    
    return `Campo ${idCampo}`;
}










//////////////////// seguro //////////////////
// Función para obtener el nombre del día
function getDiaSemana(dia) {
    return ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'][dia];
}

// Actualizar el grid de disponibilidad
function actualizarGridDisponibilidad(reservas) {
    const slots = document.querySelectorAll('.bbq2__slot');
    slots.forEach(slot => {
        slot.classList.remove('occupied');
        slot.classList.add('available');
    });

    reservas.forEach(reserva => {
        const horaInicio = parseInt(reserva.horaInicio?.split(':')[0]);
        const horaFin = parseInt(reserva.horaFin?.split(':')[0]);

        for (let h = horaInicio; h < horaFin; h++) {
            const slot = document.querySelector(`.bbq2__slot[data-time="${h}:00"]`);
            if (slot) {
                slot.classList.remove('available');
                slot.classList.add('occupied');
            }
        }
    });
}

// Al hacer clic en una fecha
function actualizarFechaSeleccionada(fecha) {
    const diaSemana = getDiaSemana(fecha.getDay());
    const dia = fecha.getDate();
    const mes = fecha.getMonth() + 1;
    const año = fecha.getFullYear();
    const fechaFormateada = `${año}-${mes.toString().padStart(2, '0')}-${dia.toString().padStart(2, '0')}`;

    document.getElementById('selected-date').textContent = `Madrid, ${diaSemana} ${dia}.`;

    cargarReservasDelDia(fechaFormateada)
        .then(reservas => actualizarGridDisponibilidad(reservas));
}

// Generar botones dinámicamente
function generarBotonesFecha() {
    const fechaActual = new Date();
    const dateSlider = document.querySelector('.date-slider');
    dateSlider.innerHTML = '';

    for (let i = 0; i < 7; i++) {
        const fecha = new Date();
        fecha.setDate(fechaActual.getDate() + i);

        const diaSemana = getDiaSemana(fecha.getDay());
        const dia = fecha.getDate();

        const button = document.createElement('button');
        button.className = 'date-slide';
        button.setAttribute('data-fecha', fecha.toISOString().split('T')[0]);
        button.innerHTML = `<div>${diaSemana}</div><h1>${dia}</h1>`;

        if (i === 0) button.classList.add('active');

        button.addEventListener('click', () => {
            document.querySelectorAll('.date-slide').forEach(b => b.classList.remove('active'));
            button.classList.add('active');
            generarBotonesDisponibilidad();
        });

        dateSlider.appendChild(button);
    }

    // Agregar event listeners a los date-slides
    document.querySelectorAll('.date-slide').forEach(dateSlide => {
        dateSlide.addEventListener('click', () => {
            const grid = document.querySelector('.bbq2__availability');
            if (!grid) return;

            grid.classList.remove('fade-in');
            grid.classList.add('fade-out');

            setTimeout(() => {
                grid.innerHTML = '';
                grid.classList.remove('fade-out');
                grid.classList.add('fade-in');
                generarBotonesDisponibilidad();
            }, 500);
        });
    });
}

// Al hacer clic en slot
    function handleSlotClick(e) {
        const slot = e.currentTarget;
        if (!slot.classList.contains('occupied')) {
            slot.classList.toggle('selected');
        }
    }
/*
// Manejo del botón reservar
    function handleReservation() {
        const selectedSlots = document.querySelectorAll('.bbq2__slot.selected');
        if (!selectedSlots.length) {
            alert('Selecciona al menos un horario');
            return;
        }

        selectedSlots.forEach(slot => {
            slot.classList.remove('selected');
            slot.classList.add('occupied');
        });

        const btn = document.getElementById('signup-button');
        btn.textContent = 'Reservado';
        btn.disabled = true;
        btn.classList.add('active', 'bg-green-600');
        btn.classList.remove('hover:bg-blue-700');

        const idCampo = obtenerIdCampo();
        setTimeout(() => {
            window.location.href = `/fronted/html/pago.html?id=1`;
        }, 1000);

            // hacer reserva
    }
*/




        /* FUNCIONALIDAD BOTON AZUL Y OBTENER DATOS DEL CAMPO */

        // Función para obtener el ID del campo de la URL
        function obtenerIdCampo() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('id');
        }

        // Función para cargar los detalles del campo
        function cargarDetallesCampo() {
            const idCampo = obtenerIdCampo();
            if (!idCampo) return;

            fetch(`http://localhost:8081/api/campos/${idCampo}`)
                .then(res => res.ok ? res.json() : Promise.reject("Error al obtener detalles"))
                .then(campo => {
                    // Nombre del campo en el título
                    document.querySelector('.info-container h3').textContent = campo.nombre;

                    // Ubicación como enlace a Google Maps
                    const ubicacionLink = document.querySelector('.info-container p a');
                    ubicacionLink.textContent = campo.ubicacion;
                    ubicacionLink.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(campo.ubicacion)}`;

                    // Precio en el span con clase .precio
                    const precioSpan = document.querySelector('.info-container .precio');
                    if (precioSpan) {
                        precioSpan.textContent = `Precio: ${campo.precioHora}€`;
                    }
                })
                .catch(() => {
                    document.querySelector('.info-container').innerHTML = `
                        <div style="color:red; text-align:center;">
                            Error al cargar los detalles del campo.
                        </div>
                    `;
                });
        }




        // Consultar reservas desde backend
        async function cargarReservasDelDia(fecha) {
            const idCampo = obtenerIdCampo();
            if (!idCampo) return [];
            try {
                const response = await fetch(`http://localhost:8081/api/reservas/campo/${idCampo}/fecha/${fecha}`);
                if (!response.ok) return [];
                return await response.json();
            } catch (e) {
                console.error('Error al obtener reservas:', e);
                return [];
            }
        }







/*
// Iniciar todo al cargar
document.addEventListener('DOMContentLoaded', () => {
    cargarDetallesCampo();
    actualizarFechaSeleccionada(new Date());
    generarBotonesFecha();
    obtenerNombreCampo();

    // Slots
    document.querySelectorAll('.bbq2__slot').forEach(slot => {
        slot.addEventListener('click', handleSlotClick);
        if (!slot.classList.contains('occupied')) {
            slot.classList.add('available');
        }
    });

    document.getElementById('signup-button').addEventListener('click', handleReservation);
});*/

function showContent(tab) {
    // Obtener los botones
    const infoButton = document.querySelector('button[onclick="showContent(\'info\')"]');
    const commentsButton = document.querySelector('button[onclick="showContent(\'comments\')"]');
    
    // Quitar la clase 'active' y el atributo 'aria-selected' de ambos botones
    infoButton.classList.remove('active', 'border-blue-500', 'text-blue-600');
    infoButton.setAttribute('aria-selected', 'false');
    commentsButton.classList.remove('active', 'border-blue-500', 'text-blue-600');
    commentsButton.setAttribute('aria-selected', 'false');
    
    // Añadir la clase 'active' y el atributo 'aria-selected' al botón seleccionado
    if (tab === 'info') {
        infoButton.classList.add('active', 'border-blue-500', 'text-blue-600');
        infoButton.setAttribute('aria-selected', 'true');
    } else if (tab === 'comments') {
        commentsButton.classList.add('active', 'border-blue-500', 'text-blue-600');
        commentsButton.setAttribute('aria-selected', 'true');
    }

    // Obtener los contenedores
    const mainContainer = document.querySelector('.container.mx-auto.px-3.py-4');
    const seccionComentarios = document.querySelector('.seccion-comentarios');

    if (tab === 'comments') {
        // Si no existe la sección de comentarios, crearla
        if (!seccionComentarios) {
            const newSeccion = document.createElement('div');
            newSeccion.className = 'seccion-comentarios';
            newSeccion.innerHTML = `
                <div class="comentarios-container">
                    <h2>Deja tu comentario</h2>
                    <form id="comentarioForm">
                        <textarea id="comentarioTexto" placeholder="Escribe aquí tu opinión..."></textarea>
                        <button type="submit">Publicar</button>
                    </form>
                    <div id="comentariosLista"></div>
                </div>
            `;
            mainContainer.parentNode.insertBefore(newSeccion, mainContainer);
        }

        // Ocultar el contenedor principal y mostrar la sección de comentarios
        mainContainer.style.display = 'none';
        document.querySelector('.seccion-comentarios').style.display = 'block';

        // Añadir los estilos para los comentarios
        const style = document.createElement('style');
        style.textContent = `
            .comentarios-container {
                max-width: 600px;
                margin: auto;
                background: white;
                padding: 20px;
                border-radius: 12px;
                box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }

            .comentarios-container h2 {
                text-align: center;
                margin-bottom: 20px;
            }

            .comentarios-container textarea {
                width: 100%;
                padding: 10px;
                border-radius: 8px;
                border: 1px solid #ccc;
                resize: vertical;
                min-height: 100px;
                margin-bottom: 10px;
            }

            .comentarios-container button {
                background-color: #28a745;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
            }

            .comentarios-container button:hover {
                background-color: #218838;
            }

            .comentario {
                background: #f9f9f9;
                border-left: 5px solid #28a745;
                padding: 10px 15px;
                border-radius: 8px;
                margin-top: 10px;
            }
        `;
        document.head.appendChild(style);

        // Añadir la funcionalidad de los comentarios
        const form = document.getElementById('comentarioForm');
        const textarea = document.getElementById('comentarioTexto');
        const comentariosLista = document.getElementById('comentariosLista');

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            const texto = textarea.value.trim();
            if (texto !== '') {
                const div = document.createElement('div');
                div.classList.add('comentario');
                div.textContent = texto;
                comentariosLista.prepend(div);
                textarea.value = '';
            }
        });

    } else {
        // Mostrar el contenedor principal y ocultar la sección de comentarios
        mainContainer.style.display = 'block';
        if (seccionComentarios) {
            seccionComentarios.style.display = 'none';
        }
    }
}

// Función para generar los botones del scroll-grid dinámicamente
function generarBotonesDisponibilidad() {

    console.log("generarBotonesDisponibilidad")

    const idCampo = obtenerIdCampo();
    const grid = document.querySelector('.scroll-grid.fade-in');
    
    if (!idCampo || !grid) return;

    // Limpiar el grid antes de llenarlo
    grid.innerHTML = '';

    // Obtener las horas disponibles desde el backend
    fetch(`http://localhost:8081/api/disponibilidad/campo/${idCampo}/horas-disponibles`)
        .then(res => res.ok ? res.json() : Promise.reject("Error al obtener horas disponibles"))
        .then(horasDisponibles => {
            // Generar los botones dinámicamente
            Object.keys(horasDisponibles).forEach(campo => {
                horasDisponibles[campo].forEach(hora => {
                    const button = document.createElement('button');
                    button.className = 'bbq2__slot available';
                    button.textContent = hora;
                    button.setAttribute('data-time', hora);
                    button.addEventListener('click', handleSlotClick);
                    grid.appendChild(button);
                });
            });
        })
        .catch(err => console.error(err));
}

// Manejar el clic en un slot
function handleSlotClick(e) {
    const slot = e.currentTarget;
    if (!slot.classList.contains('occupied')) {
        slot.classList.toggle('selected');
    }
}

// Cargar los detalles del campo al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    cargarDetallesCampo();
    generarBotonesFecha();
    generarBotonesDisponibilidad();
});


