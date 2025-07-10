document.addEventListener('DOMContentLoaded', function() {
    // Llamar a cargarCampos cuando se carga la página
    cargarCampos();
});

// Función para mostrar el estado de carga
function mostrarEstadoCarga(mensaje) {
    const tablaCampos = document.getElementById('tablaCampos');
    if (tablaCampos) {
        tablaCampos.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-4 text-center">
                    <div class="flex items-center justify-center">
                        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mr-2"></div>
                        <span class="text-gray-600">${mensaje}</span>
                    </div>
                </td>
            </tr>
        `;
    }
}

// Función para mostrar mensaje de error
function mostrarError(mensaje) {
    const tablaCampos = document.getElementById('tablaCampos');
    if (tablaCampos) {
        tablaCampos.innerHTML = `
            <tr>
                <td colspan="4" class="px-6 py-4 text-center">
                    <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong class="font-bold">Error:</strong>
                        <span class="block sm:inline">${mensaje}</span>
                    </div>
                </td>
            </tr>
        `;
    }
}

// Función para cargar los campos
function cargarCampos() {
    const tablaCampos = document.getElementById('tablaCampos');
    if (!tablaCampos) {
        console.error('No se encontró el elemento tablaCampos');
        return;
    }

    // Mostrar estado de carga
    mostrarEstadoCarga('Cargando campos...');

    console.log('Iniciando llamada a la API...');
    fetch('http://localhost:8081/api/campos')
        .then(response => {
            console.log('Respuesta recibida:', response);
            if (!response.ok) {
                console.error('Error en la respuesta:', response.status, response.statusText);
                throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
            }
            return response.json();
        })
        .then(campos => {
            console.log('Datos recibidos:', campos);
            if (!campos || campos.length === 0) {
                console.log('No hay campos disponibles');
                mostrarError('No hay campos disponibles en este momento');
                return;
            }

            // Limpiar la tabla
            tablaCampos.innerHTML = '';

            // Crear filas para cada campo
            campos.forEach(campo => {
                console.log('Procesando campo:', campo);
                const fila = document.createElement('tr');
                fila.className = 'hover:bg-gray-50 cursor-pointer';
                fila.onclick = () => window.location.href = `detalle_encuentro.html?id=${campo.id}`;
                
                fila.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                            <div class="flex-shrink-0 h-10 w-10">
                            </div>
                            <div class="ml-4">
                                <div class="text-sm font-medium text-gray-900">${campo.nombre}</div>
                            </div>
                        </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${campo.ubicacion}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">${campo.precioHora}€</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            Disponible
                        </span>
                    </td>
                `;
                tablaCampos.appendChild(fila);
            });
        })
        .catch(error => {
            console.error('Error completo:', error);
            console.error('Stack trace:', error.stack);
            mostrarError(`Error al cargar los campos: ${error.message}`);
        });
}

// Cargar los campos cuando la página se cargue
document.addEventListener('DOMContentLoaded', function() {
    const tablaCampos = document.getElementById('tablaCampos');
    
    // Contenido predeterminado de los campos
    const contenidoPredeterminado = `
        <tr class="hover:bg-gray-50 cursor-pointer" onclick="window.location.href='detalle_encuentro.html'">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">Campo 1</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">Calle Miramelindos, 5</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">5.99€</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Error de conexión
                </span>
            </td>
        </tr>
        <tr class="hover:bg-gray-50 cursor-pointer" onclick="window.location.href='detalle_encuentro.html'">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">Campo 2</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">Calle Miramelindos, 5</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">5.99€</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Error de conexión
                </span>
            </td>
        </tr>
        <tr class="hover:bg-gray-50 cursor-pointer" onclick="window.location.href='detalle_encuentro.html'">
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10">
                    </div>
                    <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">Campo 3</div>
                    </div>
                </div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">Calle Miramelindos, 5</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-gray-900">5.99€</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                    Error de conexión
                </span>
            </td>
        </tr>
    `;
    

}); 

