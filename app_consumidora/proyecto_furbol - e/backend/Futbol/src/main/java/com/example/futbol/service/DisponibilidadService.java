package com.example.futbol.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import com.example.futbol.model.Disponibilidad;
import com.example.futbol.repository.DisponibilidadRepository;



@Service
public class DisponibilidadService {
    @Autowired
    private DisponibilidadRepository disponibilidadRepository;

    // Obtener todas las entradas de Adelfas
    public List<Disponibilidad> getAllDisponibilidad() {
        return disponibilidadRepository.findAll();
    }

    // Obtener una Adelfa por ID
    public Optional<Disponibilidad> getDisponibilidadById(String id) {
        return disponibilidadRepository.findById(id);
    }

    // Obtener las horas disponibles para un campo específico en una Adelfa
    public List<String> getHorasDisponibles(String disponibilidadId, String campo) {
        Optional<Disponibilidad> disponibilidadOpt = disponibilidadRepository.findById(disponibilidadId);
        if (disponibilidadOpt.isPresent()) {
            Map<String, List<String>> horasDisponibles = disponibilidadOpt.get().getHorasDisponibles();
            return horasDisponibles.getOrDefault(campo, List.of());
        }
        return List.of();
    }

    // Obtener las horas ocupadas para un campo específico en una Adelfa
    public List<String> getHorasOcupadas(String disponibilidadId, String campo) {
        Optional<Disponibilidad> disponibilidadOpt = disponibilidadRepository.findById(disponibilidadId);
        if (disponibilidadOpt.isPresent()) {
            Map<String, List<String>> horasOcupadas = disponibilidadOpt.get().getHorasOcupadas();
            return horasOcupadas.getOrDefault(campo, List.of());
        }
        return List.of();
    }

    // Guardar una nueva Adelfa
    public Disponibilidad saveDisponibilidad(Disponibilidad disponibilidad) {
        return disponibilidadRepository.save(disponibilidad);
    }

    // Actualizar una Adelfa existente
    public Disponibilidad updateDisponibilidad(Disponibilidad disponibilidad) {
        if (disponibilidad.getId() == null) {
            throw new IllegalArgumentException("El ID no puede ser nulo para actualizar una Adelfa.");
        }
        return disponibilidadRepository.save(disponibilidad);
    }

    // Eliminar una Adelfa por ID
    public void deleteDisponibilidad(String id) {
        disponibilidadRepository.deleteById(id);
    }
}
