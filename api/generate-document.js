const { PDFDocument, rgb } = require('pdf-lib');
const { Document, Packer, Paragraph } = require('docx');
const ExcelJS = require('exceljs');
const fs = require('fs');

module.exports = async (req, res) => {
    const { type, format } = req.query;
    let filePath;

    try {
        switch (type) {
            case 'unique':
                if (format === 'pdf') {
                    const pdfDoc = await PDFDocument.create();
                    const page = pdfDoc.addPage([600, 400]);
                    page.drawText(`Unique PDF Document - ID: ${Date.now()}`, {
                        x: 50,
                        y: 350,
                        size: 30,
                        color: rgb(0, 0, 0),
                    });
                    filePath = `generated_documents/unique_document_${Date.now()}.pdf`;
                    fs.writeFileSync(filePath, await pdfDoc.save());
                } else if (format === 'word') {
                    const doc = new Document({
                        sections: [{
                            properties: {},
                            children: [
                                new Paragraph({
                                    text: `Unique Word Document - ID: ${Date.now()}`,
                                    heading: 'Heading1',
                                }),
                            ],
                        }],
                    });
                    filePath = `generated_documents/unique_document_${Date.now()}.docx`;
                    const buffer = await Packer.toBuffer(doc);
                    fs.writeFileSync(filePath, buffer);
                } else if (format === 'excel') {
                    const workbook = new ExcelJS.Workbook();
                    const worksheet = workbook.addWorksheet('Unique Excel');
                    worksheet.getCell('A1').value = `Unique Excel Document - ID: ${Date.now()}`;
                    filePath = `generated_documents/unique_document_${Date.now()}.xlsx`;
                    await workbook.xlsx.writeFile(filePath);
                }
                break;
            case 'blank':
                // Handle blank document generation
                break;
            // Add other cases for different document types
            default:
                return res.status(400).send('Invalid document type');
        }

        res.download(filePath, (err) => {
            if (err) {
                console.error(err);
                res.status(500).send('Error downloading file');
            } else {
                console.log(`File sent: ${filePath}`);
            }
        });
    } catch (error) {
        console.error("Error generating document:", error);
        res.status(500).send('Error generating document');
    }
};
