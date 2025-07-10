async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch("http://localhost:8081/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        if (response.ok) {
            const data = await response.json();
            const token = data.token;
            const usuario = data.usuario;
            
            // Guardar el token y el ID del usuario
            localStorage.setItem("token", token);
            localStorage.setItem("idUsuario", usuario.id); // 👈 ESTA ES LA CLAVE
        
            // Mostrar datos (solo para depuración)
            //alert(`Token: ${token}\n\nUsuario:\nID: ${usuario.id}\nNombre: ${usuario.nombre}\nEmail: ${usuario.email}\nRol: ${usuario.rol}`);
            console.log("Token JWT:", token);
            console.log("Usuario:", usuario);
           // alert("Login exitoso");
            // Redirigir a la pantalla de inicio
            window.location.href = 'pantalla_inicio.html';
        } else {
            const errorMessage = await response.text();
            alert(`Error: ${errorMessage}`);
        }
    } catch (error) {
        console.error("Error en la solicitud de login:", error);
        alert("Error en la conexión con el servidor.");
    }
}
