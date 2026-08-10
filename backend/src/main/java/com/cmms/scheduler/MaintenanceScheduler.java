package com.cmms.scheduler;

import com.cmms.model.MaintenancePlan;
import com.cmms.model.SparePart;
import com.cmms.repository.MaintenancePlanRepository;
import com.cmms.repository.SparePartRepository;
import com.cmms.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class MaintenanceScheduler {

    private final MaintenancePlanRepository planRepository;
    private final SparePartRepository sparePartRepository;
    private final NotificationService notificationService;

    // Run every day at 8 AM
    @Scheduled(cron = "0 0 8 * * *")
    public void checkUpcomingMaintenance() {
        LocalDate nextWeek = LocalDate.now().plusDays(7);
        List<MaintenancePlan> upcomingPlans = planRepository.findByActiveTrueAndNextExecutionBefore(nextWeek);

        for (MaintenancePlan plan : upcomingPlans) {
            notificationService.sendMaintenanceReminder(
                    plan.getEquipment().getName(),
                    plan.getNextExecution().toString()
            );
        }
    }

    // Run every day at 9 AM
    @Scheduled(cron = "0 0 9 * * *")
    public void checkLowStock() {
        Page<SparePart> lowStockParts = sparePartRepository.findLowStockParts(PageRequest.of(0, 100));
        for (SparePart part : lowStockParts) {
            notificationService.sendLowStockAlert(part.getName(), part.getStockQuantity());
        }
    }
}
