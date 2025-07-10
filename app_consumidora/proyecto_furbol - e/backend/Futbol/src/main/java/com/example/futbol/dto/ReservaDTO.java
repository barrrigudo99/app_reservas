package com.example.futbol.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public class ReservaDTO {
    private Long id;
    private Long campoId;
    private String campoNombre;
    private Long usuarioId;
    private String usuarioNombre;
    private LocalDate fecha;
    private LocalTime horaInicio;
    private LocalTime horaFin;
    private String estado;

    public ReservaDTO(Long id, Long campoId, String campoNombre, Long usuarioId, String usuarioNombre,
                     LocalDate fecha, LocalTime horaInicio, LocalTime horaFin, String estado) {
        this.id = id;
        this.campoId = campoId;
        this.campoNombre = campoNombre;
        this.usuarioId = usuarioId;
        this.usuarioNombre = usuarioNombre;
        this.fecha = fecha;
        this.horaInicio = horaInicio;
        this.horaFin = horaFin;
        this.estado = estado;
    }

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getCampoId() { return campoId; }
    public void setCampoId(Long campoId) { this.campoId = campoId; }

    public String getCampoNombre() { return campoNombre; }
    public void setCampoNombre(String campoNombre) { this.campoNombre = campoNombre; }

    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }

    public String getUsuarioNombre() { return usuarioNombre; }
    public void setUsuarioNombre(String usuarioNombre) { this.usuarioNombre = usuarioNombre; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }

    public LocalTime getHoraInicio() { return horaInicio; }
    public void setHoraInicio(LocalTime horaInicio) { this.horaInicio = horaInicio; }

    public LocalTime getHoraFin() { return horaFin; }
    public void setHoraFin(LocalTime horaFin) { this.horaFin = horaFin; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
} 