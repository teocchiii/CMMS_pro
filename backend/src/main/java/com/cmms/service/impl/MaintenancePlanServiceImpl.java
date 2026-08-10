package com.cmms.service.impl;

import com.cmms.exception.ResourceNotFoundException;
import com.cmms.model.MaintenancePlan;
import com.cmms.repository.MaintenancePlanRepository;
import com.cmms.service.MaintenancePlanService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class MaintenancePlanServiceImpl implements MaintenancePlanService {

    private final MaintenancePlanRepository planRepository;

    @Override
    public Page<MaintenancePlan> getAllPlans(Pageable pageable) {
        return planRepository.findAll(pageable);
    }

    @Override
    public MaintenancePlan getPlanById(Long id) {
        return planRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("MaintenancePlan", "id", id));
    }

    @Override
    public Page<MaintenancePlan> getPlansByEquipmentId(Long equipmentId, Pageable pageable) {
        return planRepository.findByEquipmentId(equipmentId, pageable);
    }

    @Override
    @Transactional
    public MaintenancePlan createPlan(MaintenancePlan plan) {
        return planRepository.save(plan);
    }

    @Override
    @Transactional
    public MaintenancePlan updatePlan(Long id, MaintenancePlan planDetails) {
        MaintenancePlan plan = getPlanById(id);
        
        plan.setName(planDetails.getName());
        plan.setDescription(planDetails.getDescription());
        plan.setFrequency(planDetails.getFrequency());
        plan.setNextExecution(planDetails.getNextExecution());
        plan.setActive(planDetails.isActive());
        
        return planRepository.save(plan);
    }

    @Override
    @Transactional
    public void deletePlan(Long id) {
        MaintenancePlan plan = getPlanById(id);
        planRepository.delete(plan);
    }
}
