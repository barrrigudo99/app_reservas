package com.example.futbol.controller;

import com.example.futbol.dto.ReservaDTO;
import com.example.futbol.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "*")
public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @PutMapping("/{id}/pagar")
    public ResponseEntity<String> pagarReserva(@PathVariable Long id) {
        try {
            reservaService.pagarReserva(id);
            return ResponseEntity.ok("Reserva pagada correctamente.");
        } catch (RuntimeException e) {
            if (e instanceof IllegalStateException) {
                return ResponseEntity.badRequest().body(e.getMessage());
            }
            return ResponseEntity.notFound().build();
        }
    }

    //obtener reservas por campo y fecha
    @GetMapping("/campo/{idCampo}/fecha/{fecha}")
    public ResponseEntity<List<ReservaDTO>> obtenerReservasPorCampoYFecha(
            @PathVariable Long idCampo,
            @PathVariable @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate fecha) {
        try {
            List<ReservaDTO> reservas = reservaService.obtenerReservasPorCampoYFecha(idCampo, fecha);
            return ResponseEntity.ok(reservas);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    //CREAR RESERVA
    @PostMapping
    public ResponseEntity<?> crearReserva(@RequestBody ReservaDTO reservaDTO) {
        System.err.println("puñeta");
        try {
            reservaService.crearReserva(
                reservaDTO.getCampoId(),
                reservaDTO.getUsuarioId(),
                reservaDTO.getFecha(),
                reservaDTO.getHoraInicio(),
                reservaDTO.getHoraFin()
            );
            System.err.println("reservaDTO: . "+reservaDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body("Reserva creada con éxito");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage()+" puta");
        }
    }

    

    
}
