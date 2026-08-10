package com.cmms.controller;

import com.cmms.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/summary")
    public ResponseEntity<Map<String, Object>> getSummaryKpis() {
        return ResponseEntity.ok(dashboardService.getSummaryKpis());
    }

    @GetMapping("/orders-by-status")
    public ResponseEntity<Map<String, Long>> getOrdersByStatus() {
        return ResponseEntity.ok(dashboardService.getOrdersByStatus());
    }

    @GetMapping("/equipment-status")
    public ResponseEntity<Map<String, Long>> getEquipmentByStatus() {
        return ResponseEntity.ok(dashboardService.getEquipmentByStatus());
    }
}
