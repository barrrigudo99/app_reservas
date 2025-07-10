document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Aquí puedes agregar la lógica para procesar el login
    console.log('Email:', email);
    console.log('Contraseña:', password);
}); 