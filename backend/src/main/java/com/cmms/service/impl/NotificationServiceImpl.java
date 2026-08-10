package com.cmms.service.impl;

import com.cmms.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final JavaMailSender mailSender;

    @Override
    public void sendEmail(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom("noreply@cmms.com");
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
        } catch (Exception e) {
            System.err.println("Error sending email: " + e.getMessage());
        }
    }

    @Override
    public void sendLowStockAlert(String partName, int currentStock) {
        String subject = "Alerta de Stock Bajo: " + partName;
        String text = "El repuesto " + partName + " ha alcanzado el nivel de stock crítico. Stock actual: " + currentStock;
        sendEmail("admin@cmms.com", subject, text);
    }

    @Override
    public void sendMaintenanceReminder(String equipmentName, String date) {
        String subject = "Recordatorio de Mantenimiento: " + equipmentName;
        String text = "El equipo " + equipmentName + " tiene un mantenimiento programado para la fecha: " + date;
        sendEmail("admin@cmms.com", subject, text);
    }
}
