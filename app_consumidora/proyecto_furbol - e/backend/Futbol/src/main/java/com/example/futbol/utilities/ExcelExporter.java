package com.example.futbol.utilities;

import com.example.futbol.model.Reserva;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.FileOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.List;

public class ExcelExporter {

    public static void exportarReservasAExcel(List<Reserva> reservas, String rutaArchivo) {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Reservas");

        // Cabecera
        Row header = sheet.createRow(0);
        String[] columnas = {"ID", "Campo", "Usuario", "Fecha", "Hora Inicio", "Hora Fin", "Estado"};
        for (int i = 0; i < columnas.length; i++) {
            Cell cell = header.createCell(i);
            cell.setCellValue(columnas[i]);
        }

        // Contenido
        int fila = 1;
        for (Reserva r : reservas) {
            Row row = sheet.createRow(fila++);
            row.createCell(0).setCellValue(r.getId());
            row.createCell(1).setCellValue(r.getCampo().getNombre());
            row.createCell(2).setCellValue(r.getUsuario().getNombre());
            row.createCell(3).setCellValue(r.getFecha().toString());
            row.createCell(4).setCellValue(r.getHoraInicio().toString());
            row.createCell(5).setCellValue(r.getHoraFin().toString());
            row.createCell(6).setCellValue(r.getEstado());
        }

        // Ajustar ancho columnas
        for (int i = 0; i < columnas.length; i++) {
            sheet.autoSizeColumn(i);
        }

        // Guardar archivo
        try (FileOutputStream out = new FileOutputStream(rutaArchivo)) {
            workbook.write(out);
            workbook.close();
            System.out.println("✅ Excel exportado a: " + rutaArchivo);
        } catch (IOException e) {
            System.err.println("❌ Error al exportar Excel:");
            e.printStackTrace();
        }
    }
}
