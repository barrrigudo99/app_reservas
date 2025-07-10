// Función para obtener el nombre del campo desde la URL
function obtenerIdCampo() {
    const urlParams = new URLSearchParams(window.location.search);
    const idCampo = urlParams.get('id');
    
    if (!idCampo) {
        console.warn('No se encontró ID del campo en la URL');
        return null;
    }
    
    return idCampo;
}

// Función para obtener el nombre del día
function getDiaSemana(dia) {
    return ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'][dia];
}

// Función para cargar las horas disponibles desde el backend
async function cargarHorasDisponibles(campoID, fecha) {
    try {
        const response = await fetch(`http://localhost:8081/api/disponibilidad/campo/${campoID}/fecha/${fecha}/horas-disponibles`);
        
        if (!response.ok) {
            const errorMsg = await response.text();
            throw new Error(errorMsg);
        }

        const horasDisponibles = await response.json();
        console.log("Horas Disponibles:", horasDisponibles);
        
        // Actualizar el grid de disponibilidad
        const grid = document.querySelector('.scroll-grid.fade-in');
        grid.innerHTML = ''; // Limpiar grid
        
        Object.keys(horasDisponibles).forEach(campo => {
            horasDisponibles[campo].forEach(hora => {
                const button = document.createElement('button');
                button.className = 'bbq2__slot available';
                //button.textContent = hora;
                button.setAttribute('data-time', formatearHora(hora));
                button.addEventListener('click', handleSlotClick);
                grid.appendChild(button);
            });
        });

    } catch (error) {
        console.error("Error al cargar horas disponibles:", error);
    }
}

// Función para generar botones de fechas
function generarBotonesFecha() {
    const fechaActual = new Date();
    const dateSlider = document.querySelector('.date-slider');
    dateSlider.innerHTML = '';

    for (let i = 0; i < 7; i++) {
        const fecha = new Date();
        fecha.setDate(fechaActual.getDate() + i);

        const diaSemana = getDiaSemana(fecha.getDay());
        const dia = fecha.getDate().toString().padStart(2, '0');
        const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
        const year = fecha.getFullYear();
        const fechaFormateada = `${dia}-${mes}-${year}`;

        const button = document.createElement('button');
        button.className = 'date-slide';
        button.setAttribute('data-fecha', fechaFormateada);
        button.innerHTML = `<div>${diaSemana}</div><h1>${dia}</h1>`;

        if (i === 0) button.classList.add('active');

        button.addEventListener('click', () => {
            // Actualizar el botón activo
            document.querySelectorAll('.date-slide').forEach(b => b.classList.remove('active'));
            button.classList.add('active');

            // Cargar las horas disponibles para el campo y la fecha seleccionada
            const campoID = obtenerIdCampo();
            cargarHorasDisponibles(campoID, fechaFormateada);
        });

        dateSlider.appendChild(button);
    }

    // Cargar las horas para la primera fecha automáticamente
    const primerBoton = document.querySelector('.date-slide.active');
    if (primerBoton) {
        const campoID = obtenerIdCampo();
        const fecha = primerBoton.getAttribute('data-fecha');
        cargarHorasDisponibles(campoID, fecha);
    }
}


// Función para manejar el clic en un slot
function handleSlotClick(e) {
    const slot = e.currentTarget;
    if (!slot.classList.contains('occupied')) {
        slot.classList.toggle('selected');
    }
}

//

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








//

// Cargar los detalles del campo al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    generarBotonesFecha();
    showContent();
    cargarDetallesCampo();
});

// Formatear hora
function formatearHora(hora) {
    if (!hora || hora.length !== 4) return '';
    return hora.slice(0, 2) + ':' + hora.slice(2);
}