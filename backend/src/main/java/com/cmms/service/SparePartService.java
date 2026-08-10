package com.cmms.service;

import com.cmms.model.SparePart;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface SparePartService {
    Page<SparePart> getAllSpareParts(Pageable pageable);
    SparePart getSparePartById(Long id);
    Page<SparePart> getLowStockParts(Pageable pageable);
    SparePart createSparePart(SparePart sparePart);
    SparePart updateSparePart(Long id, SparePart sparePartDetails);
    void deleteSparePart(Long id);
}
