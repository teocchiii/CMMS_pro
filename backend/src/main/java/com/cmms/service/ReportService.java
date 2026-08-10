package com.cmms.service;

import java.io.ByteArrayInputStream;

public interface ReportService {
    ByteArrayInputStream generateEquipmentPdfReport();
    ByteArrayInputStream generateEquipmentExcelReport();
}
