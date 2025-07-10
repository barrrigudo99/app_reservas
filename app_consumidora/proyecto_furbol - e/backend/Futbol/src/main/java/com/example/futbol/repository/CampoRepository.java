package com.example.futbol.repository;

import com.example.futbol.model.Campo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CampoRepository extends JpaRepository<Campo, Long> {
    Campo findByNombre(String nombre);
} 