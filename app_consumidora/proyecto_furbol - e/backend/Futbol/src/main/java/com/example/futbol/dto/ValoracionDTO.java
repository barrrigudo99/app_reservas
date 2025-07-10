package com.example.futbol.dto;

import java.time.LocalDateTime;

public class ValoracionDTO {
    private Long id;
    private Long campoId;
    private String campoNombre;
    private Long usuarioId;
    private String usuarioNombre;
    private Integer puntuacion;
    private String comentario;
    private LocalDateTime fechaValoracion;

    public ValoracionDTO(Long id, Long campoId, String campoNombre, Long usuarioId, String usuarioNombre,
                        Integer puntuacion, String comentario, LocalDateTime fechaValoracion) {
        this.id = id;
        this.campoId = campoId;
        this.campoNombre = campoNombre;
        this.usuarioId = usuarioId;
        this.usuarioNombre = usuarioNombre;
        this.puntuacion = puntuacion;
        this.comentario = comentario;
        this.fechaValoracion = fechaValoracion;
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

    public Integer getPuntuacion() { return puntuacion; }
    public void setPuntuacion(Integer puntuacion) { this.puntuacion = puntuacion; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }

    public LocalDateTime getFechaValoracion() { return fechaValoracion; }
    public void setFechaValoracion(LocalDateTime fechaValoracion) { this.fechaValoracion = fechaValoracion; }
} 