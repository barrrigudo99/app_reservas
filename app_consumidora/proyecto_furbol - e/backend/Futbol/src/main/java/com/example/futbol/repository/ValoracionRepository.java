package com.example.futbol.repository;

import com.example.futbol.model.Valoracion;
import com.example.futbol.model.Usuario;
import com.example.futbol.model.Campo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ValoracionRepository extends JpaRepository<Valoracion, Long> {
    List<Valoracion> findByUsuario(Usuario usuario);
    List<Valoracion> findByCampo(Campo campo);
    List<Valoracion> findByPuntuacion(Integer puntuacion);
} 