// Crear slots para cada hora
const slots = [];
// Crear una sola fila de slots
for (let i = 7; i <= 24; i++) {
    slots.push({
        start: i,
        end: i + 1,
        type: 'slot' // Todos empiezan como disponibles (verde)
    });
}

// Función para crear un slot
function crearSlot(start, end, type) {
    const slot = document.createElement('div');
    const width = 50; // 50px por hora (igual que en el CSS)
    const left = (start - 7) * 50; // Ajustamos el left para que empiece desde las 7
    
    slot.className = `bbq2__slot ${type}`;
    slot.style.left = `${left}px`;
    slot.style.width = `${width}px`;
    
    // Agregar información del slot
    slot.dataset.start = start;
    slot.dataset.end = end;
    slot.dataset.type = type;
    
    // Agregar evento de clic
    slot.addEventListener('click', () => toggleSlot(slot));
    
    return slot;
}

// Función para alternar el tipo de slot
function toggleSlot(slot) {
    const currentType = slot.dataset.type;
    const newType = currentType === 'slot' ? 'hole' : 'slot';
    
    slot.dataset.type = newType;
    slot.className = `bbq2__slot ${newType}`;
    
    // Actualizar datos
    const start = parseInt(slot.dataset.start);
    const end = parseInt(slot.dataset.end);
    const slotIndex = slots.findIndex(s => s.start === start && s.end === end);
    if (slotIndex !== -1) {
        slots[slotIndex].type = newType;
    }
}

// Función para crear las horas
function crearHoras() {
    const hoursContainer = document.querySelector('.bbq2__hours');
    for (let i = 7; i <= 24; i++) {
        const hour = document.createElement('div');
        hour.className = 'bbq2__hour';
        hour.textContent = i.toString().padStart(2, '0');
        hoursContainer.appendChild(hour);
    }
}

// Función para crear los slots
function crearSlots() {
    const slotsContainer = document.querySelector('.bbq2__slots');
    const resource = document.createElement('div');
    resource.className = 'bbq2__slots-resource';
    
    slots.forEach(slot => {
        resource.appendChild(crearSlot(slot.start, slot.end, slot.type));
    });
    
    slotsContainer.appendChild(resource);
}

// Función para inicializar el calendario
function inicializarCalendario() {
    crearHoras();
    crearSlots();
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarCalendario); 