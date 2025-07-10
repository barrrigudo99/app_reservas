package com.example.futbol.model;

import org.bson.types.ObjectId;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;

import java.util.List;
import java.util.Map;

@Document(collection = "disponibilidad")
public class Disponibilidad {
    @Id
    private ObjectId id;

    @Field("dia_actual")
    private String diaActual;

    @Field("nombre")
    private String nombre;

    @Field("campoID")
    private int campoID;

    @Field("Horas disponibles")
    private Map<String, List<String>> horasDisponibles;

    @Field("Horas ocupadas")
    private Map<String, List<String>> horasOcupadas;

    // Getters y Setters

    public ObjectId getId() {
        return id;
    }

    public void setId(ObjectId id) {
        this.id = id;
    }

    public String getDiaActual() {
        return diaActual;
    }

    public void setDiaActual(String diaActual) {
        this.diaActual = diaActual;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public int getCampoID() {
        return campoID;
    }

    public void setCampoID(int campoID) {
        this.campoID = campoID;
    }

    public Map<String, List<String>> getHorasDisponibles() {
        return horasDisponibles;
    }

    public void setHorasDisponibles(Map<String, List<String>> horasDisponibles) {
        this.horasDisponibles = horasDisponibles;
    }

    public Map<String, List<String>> getHorasOcupadas() {
        return horasOcupadas;
    }

    public void setHorasOcupadas(Map<String, List<String>> horasOcupadas) {
        this.horasOcupadas = horasOcupadas;
    }


    @Override
    public String toString() {
        return "Disponibilidad{" +
                "id=" + id +
                ", diaActual='" + diaActual + '\'' +
                ", nombre='" + nombre + '\'' +
                ", campoID=" + campoID +
                ", horasDisponibles=" + horasDisponibles +
                ", horasOcupadas=" + horasOcupadas +
                '}';
    }
}
