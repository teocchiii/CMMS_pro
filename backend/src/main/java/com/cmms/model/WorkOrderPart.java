package com.cmms.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "work_order_parts")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkOrderPart {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "work_order_id", nullable = false)
    @JsonIgnore
    private WorkOrder workOrder;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "spare_part_id", nullable = false)
    private SparePart sparePart;

    @Min(1)
    private Integer quantityUsed;
}
