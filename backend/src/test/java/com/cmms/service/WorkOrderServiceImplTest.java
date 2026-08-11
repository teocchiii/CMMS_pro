package com.cmms.service;

import com.cmms.model.User;
import com.cmms.model.WorkOrder;
import com.cmms.repository.UserRepository;
import com.cmms.repository.WorkOrderRepository;
import com.cmms.service.impl.WorkOrderServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WorkOrderServiceImplTest {

    @Mock
    private WorkOrderRepository workOrderRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private WorkOrderServiceImpl workOrderService;

    @Mock
    private Authentication authentication;

    @Mock
    private SecurityContext securityContext;

    private User technician;
    private User admin;
    private WorkOrder order1;
    private WorkOrder order2;

    @BeforeEach
    void setUp() {
        technician = User.builder().id(1L).username("tech1").role(User.Role.TECHNICIAN).build();
        admin = User.builder().id(2L).username("admin1").role(User.Role.ADMIN).build();
        
        order1 = new WorkOrder();
        order1.setId(10L);
        order1.setTitle("Fix AC");
        order1.setAssignedTo(technician);

        order2 = new WorkOrder();
        order2.setId(11L);
        order2.setTitle("Fix Heater");
        order2.setAssignedTo(admin);
    }

    @Test
    void getAllWorkOrders_AsTechnician_ReturnsOnlyAssignedOrders() {
        // Setup Security Context
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("tech1");
        
        when(userRepository.findByUsername("tech1")).thenReturn(Optional.of(technician));
        when(workOrderRepository.findByAssignedToId(1L)).thenReturn(Arrays.asList(order1));

        List<WorkOrder> result = workOrderService.getAllWorkOrders();

        assertEquals(1, result.size());
        assertEquals("Fix AC", result.get(0).getTitle());
        verify(workOrderRepository, never()).findAll();
    }

    @Test
    void getAllWorkOrders_AsAdmin_ReturnsAllOrders() {
        // Setup Security Context
        when(securityContext.getAuthentication()).thenReturn(authentication);
        SecurityContextHolder.setContext(securityContext);
        when(authentication.getName()).thenReturn("admin1");
        
        when(userRepository.findByUsername("admin1")).thenReturn(Optional.of(admin));
        when(workOrderRepository.findAll()).thenReturn(Arrays.asList(order1, order2));

        List<WorkOrder> result = workOrderService.getAllWorkOrders();

        assertEquals(2, result.size());
        verify(workOrderRepository).findAll();
        verify(workOrderRepository, never()).findByAssignedToId(anyLong());
    }
}
