package com.example.futbol.service;

import com.example.futbol.model.Pago;
import com.example.futbol.model.Reserva;
import com.example.futbol.repository.PagoRepository;
import com.example.futbol.repository.ReservaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.math.BigDecimal;

@Service
public class PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private ReservaRepository reservaRepository;

    public Pago crearPago(Long reservaId, String metodo) {
        Optional<Reserva> reserva = reservaRepository.findById(reservaId);
        if (!reserva.isPresent()) {
            throw new RuntimeException("Reserva no encontrada");
        }

        // Calcular el monto basado en la duración de la reserva
        Reserva r = reserva.get();
        long horas = r.getHoraFin().getHour() - r.getHoraInicio().getHour();
        BigDecimal monto = r.getCampo().getPrecioHora().multiply(new BigDecimal(horas));

        Pago pago = new Pago();
        pago.setReserva(r);
        pago.setMonto(monto);
        pago.setFechaPago(LocalDateTime.now());
        pago.setMetodo(metodo);
        pago.setEstado("pendiente");

        return pagoRepository.save(pago);
    }

    public Pago actualizarEstadoPago(Long pagoId, String estado) {
        Optional<Pago> pago = pagoRepository.findById(pagoId);
        if (!pago.isPresent()) {
            throw new RuntimeException("Pago no encontrado");
        }
        Pago p = pago.get();
        p.setEstado(estado);
        return pagoRepository.save(p);
    }

    public List<Pago> obtenerPagosPorFecha(LocalDateTime inicio, LocalDateTime fin) {
        return pagoRepository.findByFechaPagoBetween(inicio, fin);
    }

    public List<Pago> obtenerPagosPorMetodo(String metodo) {
        return pagoRepository.findByMetodo(metodo);
    }

    public Pago obtenerPagoPorReserva(Long reservaId) {
        Optional<Reserva> reserva = reservaRepository.findById(reservaId);
        if (!reserva.isPresent()) {
            throw new RuntimeException("Reserva no encontrada");
        }
        return pagoRepository.findByReserva(reserva.get());
    }
} 