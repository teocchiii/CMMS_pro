package com.cmms.controller;

import com.cmms.model.User;
import com.cmms.model.WorkOrder;
import com.cmms.repository.UserRepository;
import com.cmms.repository.WorkOrderRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class WorkOrderControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WorkOrderRepository workOrderRepository;

    @BeforeEach
    void setUp() {
        workOrderRepository.deleteAll();
        userRepository.deleteAll();

        User admin = User.builder().username("admin_user").email("a@a.com").password("pass").role(User.Role.ADMIN).build();
        User tech1 = User.builder().username("tech_one").email("t1@a.com").password("pass").role(User.Role.TECHNICIAN).build();
        User tech2 = User.builder().username("tech_two").email("t2@a.com").password("pass").role(User.Role.TECHNICIAN).build();

        userRepository.save(admin);
        userRepository.save(tech1);
        userRepository.save(tech2);

        WorkOrder order1 = new WorkOrder();
        order1.setTitle("Order Tech 1");
        order1.setAssignedTo(tech1);
        
        WorkOrder order2 = new WorkOrder();
        order2.setTitle("Order Tech 2");
        order2.setAssignedTo(tech2);

        workOrderRepository.save(order1);
        workOrderRepository.save(order2);
    }

    @Test
    @WithMockUser(username = "admin_user", roles = "ADMIN")
    void getAllWorkOrders_AsAdmin_ReturnsAll() throws Exception {
        mockMvc.perform(get("/api/work-orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)));
    }

    @Test
    @WithMockUser(username = "tech_one", roles = "TECHNICIAN")
    void getAllWorkOrders_AsTechnician_ReturnsOnlyAssigned() throws Exception {
        mockMvc.perform(get("/api/work-orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].title").value("Order Tech 1"));
    }

    @Test
    void getAllWorkOrders_Unauthenticated_ReturnsUnauthorized() throws Exception {
        mockMvc.perform(get("/api/work-orders"))
                .andExpect(status().isUnauthorized()); // Or 403 depending on config
    }
}
