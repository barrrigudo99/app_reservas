package com.example.futbol.repository;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import com.example.futbol.model.Disponibilidad;
import java.util.List;

@Repository
public interface DisponibilidadRepository extends MongoRepository<Disponibilidad, String> {
    List<Disponibilidad> findByNombre(String nombre);
    List<Disponibilidad> findByCampoID(int campoID);
    List<Disponibilidad> findByCampoIDAndDiaActual(int campoID, String diaActual);

    


}



