package com.cmms.repository;

import com.cmms.model.WorkOrder;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {
    Page<WorkOrder> findByStatus(WorkOrder.Status status, Pageable pageable);
    Page<WorkOrder> findByType(WorkOrder.Type type, Pageable pageable);
    Page<WorkOrder> findByPriority(WorkOrder.Priority priority, Pageable pageable);
    Page<WorkOrder> findByEquipmentId(Long equipmentId, Pageable pageable);
    
    // For Dashboard
    long countByStatus(WorkOrder.Status status);
    
    List<WorkOrder> findByStatusAndScheduledDateIsNotNull(WorkOrder.Status status);
}
