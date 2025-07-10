package com.example.futbol.service;

import com.example.futbol.model.Reserva;
import com.example.futbol.model.Campo;
import com.example.futbol.model.Usuario;
import com.example.futbol.repository.ReservaRepository;
import com.example.futbol.repository.CampoRepository;
import com.example.futbol.repository.UsuarioRepository;
import com.example.futbol.utilities.AppUtilities;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.LocalTime;         
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import com.example.futbol.dto.ReservaDTO;

@Service
public class ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private CampoRepository campoRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    public Reserva crearReserva(Long campoId, Long usuarioId, LocalDate fecha, LocalTime horaInicio, LocalTime horaFin) {
        Optional<Campo> campo = campoRepository.findById(campoId);
        Optional<Usuario> usuario = usuarioRepository.findById(usuarioId);
        
        if (!campo.isPresent() || !usuario.isPresent()) {
            throw new RuntimeException("Campo o usuario no encontrado");
        }

        // Verificar si el campo está disponible
        if (estaReservado(campoId, fecha, horaInicio, horaFin)) {
            throw new RuntimeException("El campo ya está reservado para esta fecha y hora");
        }

        Reserva reserva = new Reserva();
        reserva.setCampo(campo.get());
        reserva.setUsuario(usuario.get());
        reserva.setFecha(fecha);
        reserva.setHoraInicio(horaInicio);
        reserva.setHoraFin(horaFin);
        reserva.setEstado("pendiente");

        return reservaRepository.save(reserva);
    }

    public boolean estaReservado(Long campoId, LocalDate fecha, LocalTime horaInicio, LocalTime horaFin) {
        Optional<Campo> campo = campoRepository.findById(campoId);
        if (!campo.isPresent()) {
            throw new RuntimeException("Campo no encontrado");
        }

        List<Reserva> reservas = reservaRepository.findByCampoAndFecha(campo.get(), fecha);
        for (Reserva reserva : reservas) {
            if (reserva.getEstado().equals("confirmada") &&
                ((horaInicio.isAfter(reserva.getHoraInicio()) && horaInicio.isBefore(reserva.getHoraFin())) ||
                (horaFin.isAfter(reserva.getHoraInicio()) && horaFin.isBefore(reserva.getHoraFin())) ||
                (horaInicio.equals(reserva.getHoraInicio()) || horaFin.equals(reserva.getHoraFin())))) {
                return true;
            }
        }
        return false;
    }

    public List<Reserva> obtenerReservasPorUsuario(Long usuarioId) {
        Optional<Usuario> usuario = usuarioRepository.findById(usuarioId);
        if (!usuario.isPresent()) {
            throw new RuntimeException("Usuario no encontrado");
        }
        return reservaRepository.findByUsuario(usuario.get());
    }

    public List<Reserva> obtenerReservasPorCampo(Long campoId) {
        Optional<Campo> campo = campoRepository.findById(campoId);
        if (!campo.isPresent()) {
            throw new RuntimeException("Campo no encontrado");
        }
        return reservaRepository.findByCampo(campo.get());
    }

    public Reserva actualizarEstadoReserva(Long reservaId, String estado) {
        Optional<Reserva> reserva = reservaRepository.findById(reservaId);
        if (!reserva.isPresent()) {
            throw new RuntimeException("Reserva no encontrada");
        }
        Reserva r = reserva.get();
        r.setEstado(estado);
        return reservaRepository.save(r);
    }

    public void eliminarReserva(Long reservaId) {
        if (!reservaRepository.existsById(reservaId)) {
            throw new RuntimeException("Reserva no encontrada");
        }
        reservaRepository.deleteById(reservaId);
    }

    // Método para obtener todas las reservas
    public List<Reserva> obtenerTodasLasReservas() {
        return reservaRepository.findAll();
    }

    // Método para pagar una reserva
    public void pagarReserva(Long idReserva) {
        Reserva reserva = reservaRepository.findById(idReserva)
                .orElseThrow(() -> new RuntimeException("Reserva no encontrada"));
    
        if (!reserva.getEstado().equalsIgnoreCase("pendiente")) {
            throw new IllegalStateException("La reserva no se puede pagar. Estado actual: " + reserva.getEstado());
        }
    
        reserva.setEstado("pagada");
        reservaRepository.save(reserva);
    }

    
    public List<ReservaDTO> obtenerReservasPorFecha(LocalDate fecha) {
        List<Reserva> reservas = reservaRepository.findByFecha(fecha);
        return reservas.stream()
            .map(AppUtilities::toDTO)
            .collect(Collectors.toList());
    }

    public List<ReservaDTO> obtenerReservasPorCampoYFecha(Long campoId, LocalDate fecha) {
        Optional<Campo> campo = campoRepository.findById(campoId);
        if (!campo.isPresent()) {
            throw new RuntimeException("Campo no encontrado");
        }
    
        List<Reserva> reservas = reservaRepository.findByCampoAndFecha(campo.get(), fecha);
        return reservas.stream()
            .map(AppUtilities::toDTO)
            .collect(Collectors.toList());
    }
    
        // ✅ Cambiar contraseña SIN encriptación
        public void cambiarPassword(Long id, String actual, String nueva) {
            Usuario usuario = usuarioRepository.findById(id).orElse(null);
    
            if (!actual.equals(usuario.getPassword())) {
                throw new RuntimeException("La contraseña actual no es correcta");
            }
    
            usuario.setPassword(nueva);
            usuarioRepository.save(usuario);
        }
    
    
} 