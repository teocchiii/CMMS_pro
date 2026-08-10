package com.cmms.service;

public interface NotificationService {
    void sendEmail(String to, String subject, String text);
    void sendLowStockAlert(String partName, int currentStock);
    void sendMaintenanceReminder(String equipmentName, String date);
}
