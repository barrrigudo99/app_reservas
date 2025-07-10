package com.example.futbol.repository;

import com.example.futbol.model.Reserva;
import com.example.futbol.model.Usuario;
import com.example.futbol.model.Campo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    List<Reserva> findByUsuario(Usuario usuario);
    List<Reserva> findByCampo(Campo campo);
    List<Reserva> findByFecha(LocalDate fecha);
    List<Reserva> findByEstado(String estado);
    List<Reserva> findByCampoAndFecha(Campo campo, LocalDate fecha);
} 