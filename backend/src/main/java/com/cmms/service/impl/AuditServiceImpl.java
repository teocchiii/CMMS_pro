package com.cmms.service.impl;

import com.cmms.model.AuditLog;
import com.cmms.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import com.cmms.service.AuditService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuditServiceImpl implements AuditService {

    private final AuditLogRepository auditLogRepository;

    public void logAction(String entityName, Long entityId, String action, String oldValues, String newValues) {
        String username = "SYSTEM";
        
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !authentication.getPrincipal().equals("anonymousUser")) {
            username = authentication.getName();
        }

        AuditLog log = AuditLog.builder()
                .entityName(entityName)
                .entityId(entityId)
                .action(action)
                .oldValues(oldValues)
                .newValues(newValues)
                .performedBy(username)
                .build();

        auditLogRepository.save(log);
    }
}
