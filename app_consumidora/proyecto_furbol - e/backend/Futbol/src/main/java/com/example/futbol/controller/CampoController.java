package com.example.futbol.controller;

import com.example.futbol.model.Campo;
import com.example.futbol.service.CampoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/campos")
@CrossOrigin(origins = "*")
public class CampoController {

    private static final Logger logger = LoggerFactory.getLogger(CampoController.class);

    @Autowired
    private CampoService campoService;

    @GetMapping
    public ResponseEntity<List<Campo>> obtenerTodosLosCampos() {
        try {
            logger.info("Intentando obtener todos los campos");
            List<Campo> campos = campoService.obtenerTodosLosCampos();
            logger.info("Se encontraron {} campos", campos.size());
            return ResponseEntity.ok(campos);
        } catch (Exception e) {
            logger.error("Error al obtener los campos: ", e);
            return ResponseEntity.internalServerError().body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Campo> obtenerCampoPorId(@PathVariable Long id) {
        try {
            logger.info("Buscando campo con id: {}", id);
            Campo campo = campoService.obtenerCampoPorId(id);
            return ResponseEntity.ok(campo);
        } catch (RuntimeException e) {
            logger.error("Error al buscar campo con id {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Campo> crearCampo(@RequestBody Campo campo) {
        try {
            logger.info("Intentando crear nuevo campo: {}", campo.getNombre());
            Campo nuevoCampo = campoService.crearCampo(campo);
            return ResponseEntity.ok(nuevoCampo);
        } catch (Exception e) {
            logger.error("Error al crear campo: ", e);
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Campo> actualizarCampo(@PathVariable Long id, @RequestBody Campo campo) {
        try {
            logger.info("Intentando actualizar campo con id: {}", id);
            Campo campoActualizado = campoService.actualizarCampo(id, campo);
            return ResponseEntity.ok(campoActualizado);
        } catch (RuntimeException e) {
            logger.error("Error al actualizar campo con id {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCampo(@PathVariable Long id) {
        try {
            logger.info("Intentando eliminar campo con id: {}", id);
            campoService.eliminarCampo(id);
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            logger.error("Error al eliminar campo con id {}: {}", id, e.getMessage());
            return ResponseEntity.notFound().build();
        }
    }
} 