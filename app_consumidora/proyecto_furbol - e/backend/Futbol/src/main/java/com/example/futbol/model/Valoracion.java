package com.example.futbol.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "valoraciones")
public class Valoracion {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "id_campo", nullable = false)
    private Campo campo;

    @Column(nullable = false)
    private Integer puntuacion;

    @Column(columnDefinition = "TEXT")
    private String comentario;

    @Column(name = "fecha_valoracion")
    private LocalDateTime fechaValoracion;

    // Getters y Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }

    public Campo getCampo() { return campo; }
    public void setCampo(Campo campo) { this.campo = campo; }

    public Integer getPuntuacion() { return puntuacion; }
    public void setPuntuacion(Integer puntuacion) { this.puntuacion = puntuacion; }

    public String getComentario() { return comentario; }
    public void setComentario(String comentario) { this.comentario = comentario; }

    public LocalDateTime getFechaValoracion() { return fechaValoracion; }
    public void setFechaValoracion(LocalDateTime fechaValoracion) { this.fechaValoracion = fechaValoracion; }

    @PrePersist
    protected void onCreate() {
        fechaValoracion = LocalDateTime.now();
    }
} 