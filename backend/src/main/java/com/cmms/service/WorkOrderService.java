package com.cmms.service;

import com.cmms.model.WorkOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface WorkOrderService {
    Page<WorkOrder> getAllWorkOrders(Pageable pageable);
    WorkOrder getWorkOrderById(Long id);
    Page<WorkOrder> getWorkOrdersByStatus(WorkOrder.Status status, Pageable pageable);
    WorkOrder createWorkOrder(WorkOrder workOrder);
    WorkOrder updateWorkOrder(Long id, WorkOrder workOrderDetails);
    WorkOrder changeStatus(Long id, WorkOrder.Status newStatus);
    void deleteWorkOrder(Long id);
}
