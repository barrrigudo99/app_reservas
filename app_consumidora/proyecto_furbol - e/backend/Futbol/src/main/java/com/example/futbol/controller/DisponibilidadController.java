package com.example.futbol.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.futbol.model.Disponibilidad;
import com.example.futbol.repository.DisponibilidadRepository;
import org.bson.types.ObjectId;
import java.util.Map;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/disponibilidad")
public class DisponibilidadController {
    
    @Autowired
    private DisponibilidadRepository disponibilidadRepository;

    // Obtener todas las disponibilidades
    @GetMapping
    public ResponseEntity<List<Disponibilidad>> getAllDisponibilidad() {
        List<Disponibilidad> disponibilidades = disponibilidadRepository.findAll();
        return ResponseEntity.ok(disponibilidades);
    }

    // Obtener disponibilidades por nombre
    @GetMapping("/nombre/{nombre}")
    public ResponseEntity<List<Disponibilidad>> getDisponibilidadByNombre(@PathVariable String nombre) {
        List<Disponibilidad> disponibilidades = disponibilidadRepository.findByNombre(nombre);
        if (!disponibilidades.isEmpty()) {
            return ResponseEntity.ok(disponibilidades);
        } else {
            return ResponseEntity.status(404).body(disponibilidades);
        }
    }

    // Obtener disponibilidad por ID
    @GetMapping("/id/{id}")
    public ResponseEntity<?> getDisponibilidadById(@PathVariable String id) {
        try {
            // Convertir el ID a ObjectId antes de buscar
            ObjectId objectId = new ObjectId(id);
            Optional<Disponibilidad> disponibilidad = disponibilidadRepository.findById(objectId.toString());
            
            if (disponibilidad.isPresent()) {
                return ResponseEntity.ok(disponibilidad.get());
            } else {
                return ResponseEntity.status(404).body("No se encontró disponibilidad con el ID: " + id);
            }
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body("El ID proporcionado no es un ObjectId válido: " + id);
        }
    }

    // Obtener disponibilidades por campoID
    @GetMapping("/campo/{campoID}")
    public ResponseEntity<List<Disponibilidad>> getDisponibilidadByCampoID(@PathVariable int campoID) {
        List<Disponibilidad> disponibilidades = disponibilidadRepository.findByCampoID(campoID);
        
        if (!disponibilidades.isEmpty()) {
            return ResponseEntity.ok(disponibilidades);
        } else {
            return ResponseEntity.status(404).body(disponibilidades);
        }
    }

    // Crear nueva disponibilidad
    @PostMapping
    public ResponseEntity<Disponibilidad> createDisponibilidad(@RequestBody Disponibilidad disponibilidad) {
        Disponibilidad nuevaDisponibilidad = disponibilidadRepository.save(disponibilidad);
        return ResponseEntity.status(201).body(nuevaDisponibilidad);
    }

    // Eliminar disponibilidad por ID
    @DeleteMapping("/id/{id}")
    public ResponseEntity<?> deleteDisponibilidadById(@PathVariable String id) {
        try {
            ObjectId objectId = new ObjectId(id);
            disponibilidadRepository.deleteById(objectId.toString());
            return ResponseEntity.status(204).build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body("El ID proporcionado no es un ObjectId válido: " + id);
        }
    }

    // Actualizar disponibilidad por ID
    @PutMapping("/id/{id}")
    public ResponseEntity<?> updateDisponibilidadById(@PathVariable String id, @RequestBody Disponibilidad disponibilidad) {
        try {
            ObjectId objectId = new ObjectId(id);
            disponibilidad.setId(objectId);
            Disponibilidad updatedDisponibilidad = disponibilidadRepository.save(disponibilidad);
            return ResponseEntity.ok(updatedDisponibilidad);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(400).body("El ID proporcionado no es un ObjectId válido: " + id);
        }
    }

    // Obtener horas disponibles para un campo específico
    // Controlador para buscar horas disponibles por campoID y fecha
// Controlador para buscar horas disponibles por campoID y fecha
@GetMapping("/campo/{campoID}/fecha/{fecha}/horas-disponibles")
public ResponseEntity<?> getHorasDisponibles(@PathVariable int campoID, @PathVariable String fecha) {
    // Convertir la fecha a formato dd/MM/yyyy para que coincida con MongoDB
    fecha = fecha.replace("-", "/");

    List<Disponibilidad> disponibilidades = disponibilidadRepository.findByCampoIDAndDiaActual(campoID, fecha);
    
    if (disponibilidades.isEmpty()) {
        return ResponseEntity.status(404).body("No se encontró disponibilidad para el campoID: " + campoID + " en la fecha: " + fecha);
    }

    Disponibilidad disponibilidad = disponibilidades.get(0);
    Map<String, List<String>> horasDisponibles = disponibilidad.getHorasDisponibles();

    return ResponseEntity.ok(horasDisponibles);
}




}
