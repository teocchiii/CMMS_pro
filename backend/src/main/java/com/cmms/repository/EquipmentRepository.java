package com.cmms.repository;

import com.cmms.model.Equipment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EquipmentRepository extends JpaRepository<Equipment, Long> {
    
    Optional<Equipment> findByCode(String code);
    
    Page<Equipment> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    Page<Equipment> findByCategory(Equipment.Category category, Pageable pageable);
    
    Page<Equipment> findByStatus(Equipment.Status status, Pageable pageable);
    
    boolean existsByCode(String code);
}
