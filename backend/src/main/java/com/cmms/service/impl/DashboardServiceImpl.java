package com.cmms.service.impl;

import com.cmms.model.Equipment;
import com.cmms.model.WorkOrder;
import com.cmms.repository.EquipmentRepository;
import com.cmms.repository.WorkOrderRepository;
import com.cmms.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class DashboardServiceImpl implements DashboardService {

    private final EquipmentRepository equipmentRepository;
    private final WorkOrderRepository workOrderRepository;

    @Override
    public Map<String, Object> getSummaryKpis() {
        Map<String, Object> kpis = new HashMap<>();
        kpis.put("totalEquipment", equipmentRepository.count());
        kpis.put("pendingOrders", workOrderRepository.countByStatus(WorkOrder.Status.PENDIENTE));
        kpis.put("inProgressOrders", workOrderRepository.countByStatus(WorkOrder.Status.EN_PROGRESO));
        kpis.put("completedOrders", workOrderRepository.countByStatus(WorkOrder.Status.COMPLETADA));
        return kpis;
    }

    @Override
    public Map<String, Long> getOrdersByStatus() {
        Map<String, Long> stats = new HashMap<>();
        for (WorkOrder.Status status : WorkOrder.Status.values()) {
            stats.put(status.name(), workOrderRepository.countByStatus(status));
        }
        return stats;
    }

    @Override
    public Map<String, Long> getEquipmentByStatus() {
        Map<String, Long> stats = new HashMap<>();
        // In a real app we'd use a grouped JPQL query, for now doing it simple:
        for (Equipment.Status status : Equipment.Status.values()) {
            long count = equipmentRepository.findAll().stream()
                    .filter(e -> e.getStatus() == status)
                    .count();
            stats.put(status.name(), count);
        }
        return stats;
    }
}
