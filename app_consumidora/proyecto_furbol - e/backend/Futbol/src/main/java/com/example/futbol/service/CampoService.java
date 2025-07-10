package com.example.futbol.service;

import com.example.futbol.model.Campo;
import com.example.futbol.repository.CampoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class CampoService {

    private static final Logger logger = LoggerFactory.getLogger(CampoService.class);

    @Autowired
    private CampoRepository campoRepository;

    public List<Campo> obtenerTodosLosCampos() {
        try {
            logger.info("Consultando todos los campos en la base de datos");
            List<Campo> campos = campoRepository.findAll();
            logger.info("Se encontraron {} campos", campos.size());
            return campos;
        } catch (Exception e) {
            logger.error("Error al consultar campos en la base de datos", e);
            throw new RuntimeException("Error al obtener los campos", e);
        }
    }

    public Campo obtenerCampoPorId(Long id) {
        try {
            logger.info("Buscando campo con id: {}", id);
            return campoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("No se encontró el campo con id: " + id));
        } catch (Exception e) {
            logger.error("Error al buscar campo con id: {}", id, e);
            throw new RuntimeException("Error al buscar el campo", e);
        }
    }

    public Campo crearCampo(Campo campo) {
        try {
            logger.info("Creando nuevo campo: {}", campo.getNombre());
            return campoRepository.save(campo);
        } catch (Exception e) {
            logger.error("Error al crear campo", e);
            throw new RuntimeException("Error al crear el campo", e);
        }
    }

    public Campo actualizarCampo(Long id, Campo campoActualizado) {
        try {
            logger.info("Actualizando campo con id: {}", id);
            Campo campoExistente = obtenerCampoPorId(id);
            campoExistente.setNombre(campoActualizado.getNombre());
            campoExistente.setUbicacion(campoActualizado.getUbicacion());
            campoExistente.setDescripcion(campoActualizado.getDescripcion());
            campoExistente.setPrecioHora(campoActualizado.getPrecioHora());
            return campoRepository.save(campoExistente);
        } catch (Exception e) {
            logger.error("Error al actualizar campo con id: {}", id, e);
            throw new RuntimeException("Error al actualizar el campo", e);
        }
    }

    public void eliminarCampo(Long id) {
        try {
            logger.info("Eliminando campo con id: {}", id);
            if (!campoRepository.existsById(id)) {
                throw new RuntimeException("No se encontró el campo con id: " + id);
            }
            campoRepository.deleteById(id);
        } catch (Exception e) {
            logger.error("Error al eliminar campo con id: {}", id, e);
            throw new RuntimeException("Error al eliminar el campo", e);
        }
    }
} 