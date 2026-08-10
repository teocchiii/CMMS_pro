package com.cmms.service.impl;

import com.cmms.model.Equipment;
import com.cmms.repository.EquipmentRepository;
import com.cmms.service.ReportService;
import com.lowagie.text.Document;
import com.lowagie.text.Element;
import com.lowagie.text.FontFactory;
import com.lowagie.text.Paragraph;
import com.lowagie.text.Phrase;
import com.lowagie.text.Chunk;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;

@Service
public class ReportServiceImpl implements ReportService {

    private final EquipmentRepository equipmentRepository;

    public ReportServiceImpl(EquipmentRepository equipmentRepository) {
        this.equipmentRepository = equipmentRepository;
    }

    @Override
    public ByteArrayInputStream generateEquipmentPdfReport() {
        List<Equipment> equipmentList = equipmentRepository.findAll();
        Document document = new Document();
        ByteArrayOutputStream out = new ByteArrayOutputStream();

        try {
            PdfWriter.getInstance(document, out);
            document.open();

            com.lowagie.text.Font fontTitle = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            fontTitle.setSize(18);
            Paragraph title = new Paragraph("Reporte de Equipos CMMS", fontTitle);
            title.setAlignment(Paragraph.ALIGN_CENTER);
            document.add(title);
            document.add(Chunk.NEWLINE);

            PdfPTable table = new PdfPTable(6);
            table.setWidthPercentage(100);
            
            // Header
            String[] headers = {"ID", "Código", "Nombre", "Categoría", "Estado", "Fabricante"};
            com.lowagie.text.Font fontHeader = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
            for (String header : headers) {
                PdfPCell cell = new PdfPCell(new Phrase(header, fontHeader));
                cell.setHorizontalAlignment(Element.ALIGN_CENTER);
                table.addCell(cell);
            }

            // Data
            for (Equipment eq : equipmentList) {
                table.addCell(String.valueOf(eq.getId()));
                table.addCell(eq.getCode());
                table.addCell(eq.getName());
                table.addCell(eq.getCategory().name());
                table.addCell(eq.getStatus().name());
                table.addCell(eq.getManufacturer() != null ? eq.getManufacturer() : "N/A");
            }

            document.add(table);
            document.close();
        } catch (Exception e) {
            e.printStackTrace();
        }

        return new ByteArrayInputStream(out.toByteArray());
    }

    @Override
    public ByteArrayInputStream generateEquipmentExcelReport() {
        List<Equipment> equipmentList = equipmentRepository.findAll();
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Equipos");

            // Header row
            Row headerRow = sheet.createRow(0);
            String[] headers = {"ID", "Código", "Nombre", "Categoría", "Estado", "Fabricante"};
            
            CellStyle headerStyle = workbook.createCellStyle();
            org.apache.poi.ss.usermodel.Font headerFont = workbook.createFont();
            headerFont.setBold(true);
            headerStyle.setFont(headerFont);
            
            for (int col = 0; col < headers.length; col++) {
                Cell cell = headerRow.createCell(col);
                cell.setCellValue(headers[col]);
                cell.setCellStyle(headerStyle);
            }

            // Data rows
            int rowIdx = 1;
            for (Equipment eq : equipmentList) {
                Row row = sheet.createRow(rowIdx++);
                row.createCell(0).setCellValue(eq.getId());
                row.createCell(1).setCellValue(eq.getCode());
                row.createCell(2).setCellValue(eq.getName());
                row.createCell(3).setCellValue(eq.getCategory().name());
                row.createCell(4).setCellValue(eq.getStatus().name());
                row.createCell(5).setCellValue(eq.getManufacturer() != null ? eq.getManufacturer() : "N/A");
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }
}
