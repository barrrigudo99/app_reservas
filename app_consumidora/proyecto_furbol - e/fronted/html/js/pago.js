document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem("token");
    const payButton = document.getElementById('pay-button');

    // Obtener el ID de la reserva de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const campoId = urlParams.get('id');

    if (!campoId) {
        alert('No se ha encontrado el ID del campo ,'+campoId);

       // window.location.href = 'pantalla_inicio.html';
       // return;
    }

    // Consultar y obtener precio
      // Supongamos que este endpoint devuelve los datos del campo por su id
    fetch(`http://localhost:8081/api/campos/${campoId}`)
    .then(response => response.json())
    .then(data => {
        alert(JSON.stringify(data, null, 2));
        const precio = data.precioHora;
        document.querySelector('.amount').textContent = `${precio}€`;
    })
    .catch(error => {
        console.error('Error al obtener el precio:', error);
    });
    
    /*
    payButton.addEventListener('click', async function() {
        try {
            console.log('Iniciando pago para la reserva:', reservaId);
            const response = await fetch(`http://localhost:8081/api/reservas/${reservaId}/pagar`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const result = await response.text();
                console.log('Pago exitoso:', result);
                alert('Pago realizado con éxito');
                window.location.href = 'pantalla_inicio.html';
            } else {
                const errorText = await response.text();
                console.error('Error en el pago:', response.status, errorText);
                
                if (response.status === 400) {
                    alert(errorText || 'La reserva ya ha sido pagada o no existe');
                } else if (response.status === 404) {
                    alert('No se encontró la reserva');
                } else {
                    alert('Error al procesar el pago. Por favor, intente nuevamente.');
                }
            }
        } catch (error) {
            console.error('Error en la petición:', error);
            alert('Error de conexión. Por favor, verifique su conexión a internet e intente nuevamente.');
        }
    });
    */

    payButton.addEventListener('click', async function() {
        realizarReserva(campoId);
    });


}); 

async function realizarReserva(campoId) {
    const usuarioId = localStorage.getItem("idUsuario");
    const fecha = formatearFecha(obtenerFecha());
    const horas = obtenerHoras();
  
    console.log("Haciendo reserva múltiple...");
    console.log("campoId:", campoId);
    console.log("usuarioId:", usuarioId);
    console.log("fecha:", fecha);
    console.log("horas seleccionadas:", horas);
  
    if (!horas.length) {
      alert("No hay horas seleccionadas.");
      return;
    }
  
    try {
      for (const horaInicio of horas) {
        const horaFin = sumarUnaHora(horaInicio);
  
        const reservaDTO = {
          campoId: campoId,
          usuarioId: usuarioId,
          fecha: fecha,
          horaInicio: horaInicio,
          horaFin: horaFin
        };
  
        console.log("Enviando reserva:", reservaDTO);
  
        const response = await fetch(`http://localhost:8081/api/reservas`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify(reservaDTO)
        });
  
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Error en la reserva de ${horaInicio}: ${errorText}`);
        }
      }
  
      //alert('Todas las reservas se realizaron correctamente');
      window.location.href = 'pantalla_inicio.html';
  
    } catch (error) {
      console.error('Error al crear reservas:', error);
      alert('Error al crear una o más reservas: ' + error.message);
    }
  }
  
async function login(){
    // Ejemplo completo en JavaScript (frontend)
const login = async () => {
    /*const email = document.querySelector("#email").value;
    const password = document.querySelector("#password").value;*/
  
    const response = await fetch("http://localhost:8080/api/usuarios/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });
    

  
    if (response.ok) {
      const data = await response.json(); // ← Aquí llega tu LoginResponse
      const token = data.token;
      const usuario = data.usuario; // ← Este es el UsuarioDTO
  
      // Guardas el token en localStorage para futuras peticiones
      localStorage.setItem("token", token);
      localStorage.setItem("usuario", JSON.stringify(usuario));
  
      console.log("Token JWT:", token);
      console.log("Usuario:", usuario);
  
      // Rediriges si quieres
    } else {
      const error = await response.text();
      alert("Login fallido: " + error);
    }
  };

    
}

function obtenerFecha(){
        // Obtener la fecha desde los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const fecha = params.get("fecha");

    return fecha;
}

function obtenerHoras(){
    // Obtener las horas desde los parámetros de la URL
    const params = new URLSearchParams(window.location.search);
    const horas = params.get("horas"); // Ejemplo: "1730"

    // Separar por coma y transformar al formato HH:mm
    const horasArray = horas
    ? horas.split(",").map(hora => hora.slice(0, 2) + "" + hora.slice(2))
    : [];

    return horasArray;
}

function sumarUnaHora(horaStr) {
    const [horas, minutos] = horaStr.split(":").map(Number);
  
    const fecha = new Date();
    fecha.setHours(horas);
    fecha.setMinutes(minutos);
  
    fecha.setHours(fecha.getHours() + 1); // Sumar 1 hora
  
    const hh = fecha.getHours().toString().padStart(2, "0");
    const mm = fecha.getMinutes().toString().padStart(2, "0");
  
    return `${hh}:${mm}`;
}

function formatearFecha(fechaStr) {
    const [dia, mes, anio] = fechaStr.split("-");
    return `${anio}-${mes}-${dia}`;
}
  
  
