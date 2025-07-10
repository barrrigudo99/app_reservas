package com.example.futbol.dto;

import java.math.BigDecimal;

public class CampoDTO {
    private Long id;
    private String nombre;
    private String ubicacion;
    private BigDecimal precioHora;

    public CampoDTO(Long id, String nombre, String ubicacion, BigDecimal precioHora) {
        this.id = id;
        this.nombre = nombre;
        this.ubicacion = ubicacion;
        this.precioHora = precioHora;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }

    public BigDecimal getPrecioHora() { return precioHora; }
    public void setPrecioHora(BigDecimal precioHora) { this.precioHora = precioHora; }
} 