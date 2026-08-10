package com.cmms.service;

import lombok.RequiredArgsConstructor;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String verificationUrl) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(toEmail);
        message.setSubject("Verificación de Correo - CMMS");
        message.setText("Bienvenido a la plataforma CMMS.\n\n" +
                "Por favor, haga clic en el siguiente enlace para verificar su cuenta y activar su acceso:\n" +
                verificationUrl + "\n\n" +
                "Si no solicitó esta cuenta, puede ignorar este correo.");
        
        mailSender.send(message);
    }
}
