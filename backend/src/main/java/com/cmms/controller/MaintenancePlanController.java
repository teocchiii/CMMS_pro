package com.cmms.controller;

import com.cmms.model.MaintenancePlan;
import com.cmms.service.MaintenancePlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/maintenance-plans")
@RequiredArgsConstructor
public class MaintenancePlanController {

    private final MaintenancePlanService planService;

    @GetMapping
    public ResponseEntity<Page<MaintenancePlan>> getAllPlans(Pageable pageable) {
        return ResponseEntity.ok(planService.getAllPlans(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<MaintenancePlan> getPlanById(@PathVariable Long id) {
        return ResponseEntity.ok(planService.getPlanById(id));
    }

    @GetMapping("/equipment/{equipmentId}")
    public ResponseEntity<Page<MaintenancePlan>> getPlansByEquipment(@PathVariable Long equipmentId, Pageable pageable) {
        return ResponseEntity.ok(planService.getPlansByEquipmentId(equipmentId, pageable));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<MaintenancePlan> createPlan(@Valid @RequestBody MaintenancePlan plan) {
        MaintenancePlan created = planService.createPlan(plan);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<MaintenancePlan> updatePlan(@PathVariable Long id, @Valid @RequestBody MaintenancePlan plan) {
        return ResponseEntity.ok(planService.updatePlan(id, plan));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deletePlan(@PathVariable Long id) {
        planService.deletePlan(id);
        return ResponseEntity.noContent().build();
    }
}
