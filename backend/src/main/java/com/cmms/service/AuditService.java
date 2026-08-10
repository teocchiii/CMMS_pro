package com.cmms.service;

public interface AuditService {
    void logAction(String entityName, Long entityId, String action, String oldValues, String newValues);
}
