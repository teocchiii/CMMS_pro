package com.cmms.service;

import java.util.Map;

public interface DashboardService {
    Map<String, Object> getSummaryKpis();
    Map<String, Long> getOrdersByStatus();
    Map<String, Long> getEquipmentByStatus();
}
