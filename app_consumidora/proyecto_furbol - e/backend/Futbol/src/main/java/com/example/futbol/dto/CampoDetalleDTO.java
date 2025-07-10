package com.example.futbol.dto;

import java.math.BigDecimal;
import java.util.List;

public class CampoDetalleDTO {
    private Long id;
    private String nombre;
    private String ubicacion;
    private String descripcion;
    private BigDecimal precioHora;
    private List<ReservaDTO> reservas;
    private List<ValoracionDTO> valoraciones;

    public CampoDetalleDTO(Long id, String nombre, String ubicacion, String descripcion, 
                          BigDecimal precioHora, List<ReservaDTO> reservas, List<ValoracionDTO> valoraciones) {
        this.id = id;
        this.nombre = nombre;
        this.ubicacion = ubicacion;
        this.descripcion = descripcion;
        this.precioHora = precioHora;
        this.reservas = reservas;
        this.valoraciones = valoraciones;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public BigDecimal getPrecioHora() { return precioHora; }
    public void setPrecioHora(BigDecimal precioHora) { this.precioHora = precioHora; }

    public List<ReservaDTO> getReservas() { return reservas; }
    public void setReservas(List<ReservaDTO> reservas) { this.reservas = reservas; }

    public List<ValoracionDTO> getValoraciones() { return valoraciones; }
    public void setValoraciones(List<ValoracionDTO> valoraciones) { this.valoraciones = valoraciones; }
} 