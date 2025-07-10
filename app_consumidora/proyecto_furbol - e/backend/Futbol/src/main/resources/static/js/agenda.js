// Datos de ejemplo (en un caso real, vendrían del backend)
const horarios = [
    { hora: '10:00', disponible: true, participantes: 0, maxParticipantes: 16 },
    { hora: '11:00', disponible: true, participantes: 0, maxParticipantes: 16 },
    { hora: '12:00', disponible: true, participantes: 0, maxParticipantes: 16 },
    { hora: '13:00', disponible: true, participantes: 0, maxParticipantes: 16 },
    { hora: '14:00', disponible: true, participantes: 0, maxParticipantes: 16 },
    { hora: '15:00', disponible: true, participantes: 0, maxParticipantes: 16 },
    { hora: '16:00', disponible: true, participantes: 0, maxParticipantes: 16 },
    { hora: '17:00', disponible: true, participantes: 0, maxParticipantes: 16 },
    { hora: '18:00', disponible: true, participantes: 0, maxParticipantes: 16 },
    { hora: '19:00', disponible: true, participantes: 0, maxParticipantes: 16 }
];

// Función para crear una tarjeta de horario
function crearTarjetaHorario(horario) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'match-card';
    
    const estado = horario.disponible ? 
        `<span class="estado disponible">Disponible</span>` : 
        `<span class="estado lleno">Lleno</span>`;
    
    const plazas = horario.maxParticipantes - horario.participantes;
    
    tarjeta.innerHTML = `
        <div class="d-flex">
            <div class="d-flex flex-column justify-content-between">
                <h5 class="text-primary m-0">${horario.hora}</h5>
                <div>
                    <h6 class="m-0" style="line-height: 0.5;">8v8</h6>
                    <small class="text-muted" style="line-height: 0.1;">Fútbol</small>
                </div>
            </div>

            <div class="d-flex flex-column justify-content-between w-100 pl-2">
                <h5 class="m-0 font-weight-bold">Madrid Río Arganzuela 🏞️</h5>
                <div class="d-flex align-items-center">
                    <img class="avatar rounded-circle mr-2" src="https://s3.eu-central-1.amazonaws.com/if7sports.media/1726663424517-27a035315a1e5c0cbe508308b671190f2e0ebc2fa50a56ff22bf2ec97a9c37587f80e4adea4c6bfecb2f7c57956baae2" />
                    <div>
                        <div class="text-dark" style="font-size: 14px;">Victor Beirao</div>
                        <div class="text-muted small">Organizador</div>
                    </div>
                </div>
            </div>

            <div class="d-flex flex-column justify-content-between pl-2 text-right">
                <h5 class="text-muted m-0">4.99€</h5>
                <div>
                    <h6 class="m-0" style="line-height: 0.5;">${plazas}/${horario.maxParticipantes}</h6>
                    <small class="text-muted" style="line-height: 0.1;">Plazas</small>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-between border-top pt-2 mt-2">
            <div class="text-primary d-flex align-items-center cursor-pointer">
                📍 <small class="ml-1">Ubicación</small>
            </div>
            ${estado}
            ${horario.disponible ? `
                <button class="btn-reservar" onclick="reservarHorario('${horario.hora}')">
                    Reservar
                </button>
            ` : ''}
        </div>
    `;
    
    return tarjeta;
}

// Función para cargar todos los horarios
function cargarHorarios() {
    const contenedor = document.getElementById('horarios-container');
    contenedor.innerHTML = ''; // Limpiar contenedor
    
    horarios.forEach(horario => {
        contenedor.appendChild(crearTarjetaHorario(horario));
    });
}

// Función para reservar un horario
function reservarHorario(hora) {
    const horario = horarios.find(h => h.hora === hora);
    if (horario && horario.disponible) {
        horario.participantes++;
        if (horario.participantes >= horario.maxParticipantes) {
            horario.disponible = false;
        }
        cargarHorarios(); // Recargar la vista
    }
}

// Cargar horarios cuando la página se cargue
document.addEventListener('DOMContentLoaded', cargarHorarios); 