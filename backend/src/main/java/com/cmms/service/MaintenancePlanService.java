package com.cmms.service;

import com.cmms.model.MaintenancePlan;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface MaintenancePlanService {
    Page<MaintenancePlan> getAllPlans(Pageable pageable);
    MaintenancePlan getPlanById(Long id);
    Page<MaintenancePlan> getPlansByEquipmentId(Long equipmentId, Pageable pageable);
    MaintenancePlan createPlan(MaintenancePlan plan);
    MaintenancePlan updatePlan(Long id, MaintenancePlan planDetails);
    void deletePlan(Long id);
}
