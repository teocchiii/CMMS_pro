package com.cmms.repository;

import com.cmms.model.SparePart;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SparePartRepository extends JpaRepository<SparePart, Long> {
    
    Optional<SparePart> findByCode(String code);
    
    Page<SparePart> findByNameContainingIgnoreCase(String name, Pageable pageable);
    
    @Query("SELECT s FROM SparePart s WHERE s.stockQuantity <= s.minimumStock")
    Page<SparePart> findLowStockParts(Pageable pageable);
    
    boolean existsByCode(String code);
}
