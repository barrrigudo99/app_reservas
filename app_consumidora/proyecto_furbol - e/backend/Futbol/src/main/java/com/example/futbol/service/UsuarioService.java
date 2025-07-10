package com.example.futbol.service;

import com.example.futbol.model.Usuario;
import com.example.futbol.repository.UsuarioRepository;
import com.example.futbol.dto.UsuarioDTO;
import com.example.futbol.utilities.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public Usuario registrarUsuario(Usuario usuario) {
        Usuario existente = usuarioRepository.findByEmail(usuario.getEmail());
        if (existente != null) {
            throw new RuntimeException("El email ya está registrado");
        }
        usuario.setRol("USUARIO");
        return usuarioRepository.save(usuario);
    }

    public String login(String email, String password) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        if (!password.equals(usuario.getPassword())) {
            throw new RuntimeException("Contraseña incorrecta");
        }
        
        // Generar el token JWT
        return jwtUtil.generateToken(email);
    }

    public UsuarioDTO obtenerUsuarioPorId(Long id) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        return new UsuarioDTO(usuario.getId(), usuario.getNombre(), usuario.getEmail(), usuario.getRol());
    }

    public Usuario actualizarUsuario(Long id, Usuario usuarioActualizado) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        usuario.setNombre(usuarioActualizado.getNombre());
        
        if (usuarioActualizado.getPassword() != null && !usuarioActualizado.getPassword().isEmpty()) {
            usuario.setPassword(usuarioActualizado.getPassword());
        }
        
        return usuarioRepository.save(usuario);
    }
    

    public void eliminarUsuario(Long id) {
        if (!usuarioRepository.existsById(id)) {
            throw new RuntimeException("Usuario no encontrado");
        }
        usuarioRepository.deleteById(id);
    }

    public Usuario obtenerUsuarioPorEmail(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email);
        
        if (usuario == null) {
            throw new RuntimeException("Usuario no encontrado");
        }
        
        return usuario;
    }

    //

    private Usuario obtenerUsuarioEntity(Long id) {
        return usuarioRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
    }
    
/* 
    @Autowired
    private PasswordEncoder passwordEncoder;
    public void cambiarPassword(Long id, String actual, String nueva) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        if (!passwordEncoder.matches(actual, usuario.getPassword())) {
            throw new RuntimeException("La contraseña actual no es correcta");
        }
        usuario.setPassword(passwordEncoder.encode(nueva));
        usuarioRepository.save(usuario);
    }
*/

    public void actualizarEmail(Long id, String nuevoEmail) {
        Usuario usuario = obtenerUsuarioEntity(id);
        if (usuarioRepository.existsByEmail(nuevoEmail)) {
            throw new RuntimeException("El email ya está en uso");
        }
        usuario.setEmail(nuevoEmail);
        usuarioRepository.save(usuario);
    }


    // ✅ Cambiar contraseña SIN encriptación
    public void cambiarPassword(Long id, String actual, String nueva) {
        Usuario usuario = obtenerUsuarioEntity(id);

        if (!actual.equals(usuario.getPassword())) {
            throw new RuntimeException("La contraseña actual no es correcta");
        }

        usuario.setPassword(nueva);
        usuarioRepository.save(usuario);
    }

    
}
