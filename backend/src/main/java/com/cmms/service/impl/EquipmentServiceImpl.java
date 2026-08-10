package com.cmms.service.impl;

import com.cmms.exception.ResourceNotFoundException;
import com.cmms.model.Equipment;
import com.cmms.repository.EquipmentRepository;
import lombok.RequiredArgsConstructor;
import com.cmms.service.EquipmentService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class EquipmentServiceImpl implements EquipmentService {

    private final EquipmentRepository equipmentRepository;

    public Page<Equipment> getAllEquipment(Pageable pageable) {
        return equipmentRepository.findAll(pageable);
    }

    public Equipment getEquipmentById(Long id) {
        return equipmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment", "id", id));
    }

    public Equipment getEquipmentByCode(String code) {
        return equipmentRepository.findByCode(code)
                .orElseThrow(() -> new ResourceNotFoundException("Equipment", "code", code));
    }

    @Transactional
    public Equipment createEquipment(Equipment equipment) {
        if (equipmentRepository.existsByCode(equipment.getCode())) {
            throw new IllegalArgumentException("Equipment with code " + equipment.getCode() + " already exists");
        }
        return equipmentRepository.save(equipment);
    }

    @Transactional
    public Equipment updateEquipment(Long id, Equipment equipmentDetails) {
        Equipment equipment = getEquipmentById(id);
        
        equipment.setName(equipmentDetails.getName());
        equipment.setDescription(equipmentDetails.getDescription());
        equipment.setLocation(equipmentDetails.getLocation());
        equipment.setCategory(equipmentDetails.getCategory());
        equipment.setStatus(equipmentDetails.getStatus());
        equipment.setManufacturer(equipmentDetails.getManufacturer());
        equipment.setModel(equipmentDetails.getModel());
        equipment.setSerialNumber(equipmentDetails.getSerialNumber());
        equipment.setPurchaseDate(equipmentDetails.getPurchaseDate());
        equipment.setWarrantyExpiry(equipmentDetails.getWarrantyExpiry());
        equipment.setInstallationDate(equipmentDetails.getInstallationDate());
        
        return equipmentRepository.save(equipment);
    }

    @Transactional
    public void deleteEquipment(Long id) {
        Equipment equipment = getEquipmentById(id);
        // Soft delete could be implemented here instead of hard delete
        // equipment.setStatus(Equipment.Status.DADO_DE_BAJA);
        // equipmentRepository.save(equipment);
        equipmentRepository.delete(equipment);
    }
}
