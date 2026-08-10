package com.cmms.service;

import com.cmms.model.Equipment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface EquipmentService {
    Page<Equipment> getAllEquipment(Pageable pageable);
    Equipment getEquipmentById(Long id);
    Equipment getEquipmentByCode(String code);
    Equipment createEquipment(Equipment equipment);
    Equipment updateEquipment(Long id, Equipment equipmentDetails);
    void deleteEquipment(Long id);
}
