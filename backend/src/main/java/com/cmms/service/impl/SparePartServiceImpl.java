package com.cmms.service.impl;

import com.cmms.exception.ResourceNotFoundException;
import com.cmms.model.SparePart;
import com.cmms.repository.SparePartRepository;
import lombok.RequiredArgsConstructor;
import com.cmms.service.SparePartService;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class SparePartServiceImpl implements SparePartService {

    private final SparePartRepository sparePartRepository;

    public Page<SparePart> getAllSpareParts(Pageable pageable) {
        return sparePartRepository.findAll(pageable);
    }

    public SparePart getSparePartById(Long id) {
        return sparePartRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("SparePart", "id", id));
    }

    public Page<SparePart> getLowStockParts(Pageable pageable) {
        return sparePartRepository.findLowStockParts(pageable);
    }

    @Transactional
    public SparePart createSparePart(SparePart sparePart) {
        if (sparePartRepository.existsByCode(sparePart.getCode())) {
            throw new IllegalArgumentException("Spare Part with code " + sparePart.getCode() + " already exists");
        }
        return sparePartRepository.save(sparePart);
    }

    @Transactional
    public SparePart updateSparePart(Long id, SparePart sparePartDetails) {
        SparePart sparePart = getSparePartById(id);
        
        sparePart.setName(sparePartDetails.getName());
        sparePart.setDescription(sparePartDetails.getDescription());
        sparePart.setStockQuantity(sparePartDetails.getStockQuantity());
        sparePart.setMinimumStock(sparePartDetails.getMinimumStock());
        sparePart.setUnitCost(sparePartDetails.getUnitCost());
        sparePart.setSupplier(sparePartDetails.getSupplier());
        
        return sparePartRepository.save(sparePart);
    }

    @Transactional
    public void deleteSparePart(Long id) {
        SparePart sparePart = getSparePartById(id);
        sparePartRepository.delete(sparePart);
    }
}
