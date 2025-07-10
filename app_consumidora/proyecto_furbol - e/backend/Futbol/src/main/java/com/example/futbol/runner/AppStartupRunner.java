package com.example.futbol.runner;

import com.example.futbol.model.Reserva;
import com.example.futbol.dto.ReservaDTO;
import com.example.futbol.service.ReservaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.util.List;
import com.example.futbol.utilities.AppUtilities;
import com.example.futbol.repository.ReservaRepository;
import com.example.futbol.utilities.ExcelExporter;

@Component
public class AppStartupRunner implements CommandLineRunner {

    @Autowired
    private ReservaService reservaService;
    @Autowired
    private ReservaRepository reservaRepository;

    @Override
    public void run(String... args) {
        List<Reserva> reservas = reservaService.obtenerTodasLasReservas();
        List<ReservaDTO> reservasDTO = AppUtilities.toDTOList(reservas);
        reservas.forEach(System.out::println); // O manejar la lógica que necesites

        // Guardar las reservas en un archivo JSON
        AppUtilities.guardarComoJson(reservasDTO, "app/reservas/reservas.json");    

        // Exportar las reservas a un archivo Excel
        ExcelExporter.exportarReservasAExcel(reservas, "app/reservas/reservas_desde_bbdd.xlsx");
    }

 


}
