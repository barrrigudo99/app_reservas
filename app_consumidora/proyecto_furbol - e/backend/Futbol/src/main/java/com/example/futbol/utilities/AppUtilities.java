package com.example.futbol.utilities;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.example.futbol.dto.ReservaDTO;
import java.util.stream.Collectors;
import java.io.File;
import java.io.IOException;
import java.util.List;
import com.example.futbol.model.Reserva;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.fasterxml.jackson.databind.SerializationFeature;

public class AppUtilities {
    

    public static ReservaDTO toDTO(Reserva reserva) {
        return new ReservaDTO(
            reserva.getId(),
            reserva.getCampo().getId(),              // campoId
            reserva.getCampo().getNombre(),          // campoNombre
            reserva.getUsuario().getId(),            // usuarioId
            reserva.getUsuario().getNombre(),        // usuarioNombre
            reserva.getFecha(),
            reserva.getHoraInicio(),
            reserva.getHoraFin(),
            reserva.getEstado()
        );
    }

    public static List<ReservaDTO> toDTOList(List<Reserva> reservas) {
        return reservas.stream()
                       .map(AppUtilities::toDTO)
                       .collect(Collectors.toList());
    }


    //Método para guardar las reservas en un archivo JSON
    public static void guardarComoJson(List<ReservaDTO> reservasDTO, String rutaArchivo) {
        ObjectMapper mapper = new ObjectMapper();

        // Soporte para LocalDate, LocalTime, etc.
        mapper.registerModule(new JavaTimeModule());
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);

        try {
            File archivo = new File(rutaArchivo);
            archivo.getParentFile().mkdirs(); // crea carpetas si no existen
            mapper.writerWithDefaultPrettyPrinter().writeValue(archivo, reservasDTO);
            System.out.println("✅ Archivo JSON generado en: " + archivo.getAbsolutePath());
        } catch (IOException e) {
            System.err.println("❌ Error al guardar el JSON:");
            e.printStackTrace();
        }
    }  

}
