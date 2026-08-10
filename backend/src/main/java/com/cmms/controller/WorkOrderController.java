package com.cmms.controller;

import com.cmms.model.WorkOrder;
import com.cmms.service.WorkOrderService;
import com.cmms.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/work-orders")
@RequiredArgsConstructor
public class WorkOrderController {

    private final WorkOrderService workOrderService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<Page<WorkOrder>> getAllWorkOrders(Pageable pageable, java.security.Principal principal) {
        if (principal != null) {
            var user = userRepository.findByUsername(principal.getName());
            if (user.isPresent() && com.cmms.model.User.Role.TECHNICIAN.equals(user.get().getRole())) {
                return ResponseEntity.ok(workOrderService.getWorkOrdersByAssignee(user.get().getId(), pageable));
            }
        }
        return ResponseEntity.ok(workOrderService.getAllWorkOrders(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkOrder> getWorkOrderById(@PathVariable Long id) {
        return ResponseEntity.ok(workOrderService.getWorkOrderById(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<WorkOrder> createWorkOrder(@Valid @RequestBody WorkOrder workOrder, java.security.Principal principal) {
        if (principal != null) {
            userRepository.findByUsername(principal.getName()).ifPresent(workOrder::setReportedBy);
        }
        WorkOrder created = workOrderService.createWorkOrder(workOrder);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WorkOrder> updateWorkOrder(@PathVariable Long id, @Valid @RequestBody WorkOrder workOrder) {
        return ResponseEntity.ok(workOrderService.updateWorkOrder(id, workOrder));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<WorkOrder> changeStatus(@PathVariable Long id, @RequestParam WorkOrder.Status status) {
        return ResponseEntity.ok(workOrderService.changeStatus(id, status));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteWorkOrder(@PathVariable Long id) {
        workOrderService.deleteWorkOrder(id);
        return ResponseEntity.noContent().build();
    }
}
