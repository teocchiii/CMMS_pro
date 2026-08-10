package com.cmms.service.impl;

import com.cmms.exception.ResourceNotFoundException;
import com.cmms.model.WorkOrder;
import com.cmms.repository.WorkOrderRepository;
import com.cmms.service.WorkOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class WorkOrderServiceImpl implements WorkOrderService {

    private final WorkOrderRepository workOrderRepository;

    @Override
    public Page<WorkOrder> getAllWorkOrders(Pageable pageable) {
        return workOrderRepository.findAll(pageable);
    }

    @Override
    public WorkOrder getWorkOrderById(Long id) {
        return workOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("WorkOrder", "id", id));
    }

    @Override
    public Page<WorkOrder> getWorkOrdersByStatus(WorkOrder.Status status, Pageable pageable) {
        return workOrderRepository.findByStatus(status, pageable);
    }

    @Override
    @Transactional
    public WorkOrder createWorkOrder(WorkOrder workOrder) {
        if (workOrder.getStatus() == null) {
            workOrder.setStatus(WorkOrder.Status.PENDIENTE);
        }
        
        // Link parts properly to this order
        if (workOrder.getPartsUsed() != null) {
            workOrder.getPartsUsed().forEach(part -> part.setWorkOrder(workOrder));
        }
        
        return workOrderRepository.save(workOrder);
    }

    @Override
    @Transactional
    public WorkOrder updateWorkOrder(Long id, WorkOrder workOrderDetails) {
        WorkOrder workOrder = getWorkOrderById(id);
        
        workOrder.setEquipment(workOrderDetails.getEquipment());
        workOrder.setAssignedTo(workOrderDetails.getAssignedTo());
        workOrder.setType(workOrderDetails.getType());
        workOrder.setPriority(workOrderDetails.getPriority());
        workOrder.setDescription(workOrderDetails.getDescription());
        workOrder.setDiagnosis(workOrderDetails.getDiagnosis());
        workOrder.setSolution(workOrderDetails.getSolution());
        workOrder.setScheduledDate(workOrderDetails.getScheduledDate());
        workOrder.setEstimatedCost(workOrderDetails.getEstimatedCost());
        workOrder.setActualCost(workOrderDetails.getActualCost());
        
        // Update parts (simplified for this example)
        workOrder.getPartsUsed().clear();
        if (workOrderDetails.getPartsUsed() != null) {
            workOrderDetails.getPartsUsed().forEach(part -> {
                part.setWorkOrder(workOrder);
                workOrder.getPartsUsed().add(part);
            });
        }
        
        return workOrderRepository.save(workOrder);
    }

    @Override
    @Transactional
    public WorkOrder changeStatus(Long id, WorkOrder.Status newStatus) {
        WorkOrder workOrder = getWorkOrderById(id);
        workOrder.setStatus(newStatus);
        
        if (newStatus == WorkOrder.Status.EN_PROGRESO && workOrder.getStartedAt() == null) {
            workOrder.setStartedAt(LocalDateTime.now());
        } else if (newStatus == WorkOrder.Status.COMPLETADA) {
            workOrder.setCompletedAt(LocalDateTime.now());
        }
        
        return workOrderRepository.save(workOrder);
    }

    @Override
    @Transactional
    public void deleteWorkOrder(Long id) {
        WorkOrder workOrder = getWorkOrderById(id);
        workOrderRepository.delete(workOrder);
    }
}
