package com.cmms.repository;

import com.cmms.model.MaintenancePlan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface MaintenancePlanRepository extends JpaRepository<MaintenancePlan, Long> {
    Page<MaintenancePlan> findByEquipmentId(Long equipmentId, Pageable pageable);
    List<MaintenancePlan> findByActiveTrueAndNextExecutionBefore(LocalDate date);
}
