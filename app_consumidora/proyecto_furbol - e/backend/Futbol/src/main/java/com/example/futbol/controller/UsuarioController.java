package com.example.futbol.controller;

import com.example.futbol.model.Usuario;
import com.example.futbol.service.UsuarioService;
import com.example.futbol.dto.UsuarioDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@CrossOrigin(origins = "*")
public class UsuarioController {

    @Autowired
    private UsuarioService usuarioService;

    @PostMapping("/registro")
    public ResponseEntity<?> registrarUsuario(@RequestBody Usuario usuario) {
        try {
            Usuario nuevoUsuario = usuarioService.registrarUsuario(usuario);
            return ResponseEntity.ok(nuevoUsuario);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
/* 
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario usuario) {
        try {
            String token = usuarioService.login(usuario.getEmail(), usuario.getPassword());
            return ResponseEntity.ok().body(token);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
*/
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody Usuario usuario) {
    try {
        String token = usuarioService.login(usuario.getEmail(), usuario.getPassword());

        // Obtener el usuario completo desde la base de datos
        Usuario usuarioAutenticado = usuarioService.obtenerUsuarioPorEmail(usuario.getEmail());

        // Crear el DTO
        UsuarioDTO usuarioDTO = new UsuarioDTO(
            usuarioAutenticado.getId(),
            usuarioAutenticado.getNombre(),
            usuarioAutenticado.getEmail(),
            usuarioAutenticado.getRol()
        );

        // Devolver token + usuario
        return ResponseEntity.ok(Map.of(
            "token", token,
            "usuario", usuarioDTO
        ));
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerUsuario(@PathVariable Long id) {
        try {
            UsuarioDTO usuario = usuarioService.obtenerUsuarioPorId(id);
            return ResponseEntity.ok(usuario);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarUsuario(@PathVariable Long id, @RequestBody Usuario usuario) {
        try {
            Usuario actualizado = usuarioService.actualizarUsuario(id, usuario);
            UsuarioDTO dto = new UsuarioDTO(actualizado.getId(), actualizado.getNombre(), actualizado.getEmail(), actualizado.getRol()); // 👈 convierte a DTO
            return ResponseEntity.ok(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarUsuario(@PathVariable Long id) {
        try {
            usuarioService.eliminarUsuario(id);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/email")
    public ResponseEntity<?> actualizarEmail(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String nuevoEmail = body.get("email");
            usuarioService.actualizarEmail(id, nuevoEmail);
            return ResponseEntity.ok("Email actualizado correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PatchMapping("/{id}/password")
    public ResponseEntity<?> cambiarPassword(@PathVariable Long id, @RequestBody Map<String, String> body) {
        try {
            String actual = body.get("actual");
            String nueva = body.get("nueva");
            usuarioService.cambiarPassword(id, actual, nueva);

            //usuarioService.cambiarPassword(id, actual, nueva);
            return ResponseEntity.ok("Contraseña cambiada correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }



    // 
} 