package com.cmms.controller;

import com.cmms.model.SparePart;
import com.cmms.service.SparePartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/spare-parts")
@RequiredArgsConstructor
public class SparePartController {

    private final SparePartService sparePartService;

    @GetMapping
    public ResponseEntity<Page<SparePart>> getAllSpareParts(Pageable pageable) {
        return ResponseEntity.ok(sparePartService.getAllSpareParts(pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SparePart> getSparePartById(@PathVariable Long id) {
        return ResponseEntity.ok(sparePartService.getSparePartById(id));
    }

    @GetMapping("/low-stock")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<Page<SparePart>> getLowStockParts(Pageable pageable) {
        return ResponseEntity.ok(sparePartService.getLowStockParts(pageable));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<SparePart> createSparePart(@Valid @RequestBody SparePart sparePart) {
        SparePart created = sparePartService.createSparePart(sparePart);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('SUPERVISOR')")
    public ResponseEntity<SparePart> updateSparePart(@PathVariable Long id, @Valid @RequestBody SparePart sparePart) {
        return ResponseEntity.ok(sparePartService.updateSparePart(id, sparePart));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteSparePart(@PathVariable Long id) {
        sparePartService.deleteSparePart(id);
        return ResponseEntity.noContent().build();
    }
}
