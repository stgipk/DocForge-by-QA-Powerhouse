const express = require('express');
const fs = require('fs');
const path = require('path');
const { PDFDocument, rgb } = require('pdf-lib');
const { Document, Packer, Paragraph } = require('docx');
const ExcelJS = require('exceljs');
const multer = require('multer');

// const app = express();
// const PORT = process.env.PORT || 3000;

// Middleware for serving static files
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

// Ensure the uploads directory exists
if (!fs.existsSync('uploads')) {
    fs.mkdirSync('uploads');
}

// // Endpoint to generate documents
// app.get('/api/generate-document', async (req, res) => {
//     const { type, format } = req.query;
//     console.log("Snehil");
    

//     try {
//         let filePath;

//         switch (type) {
//             case 'unique':
//                 if (format === 'pdf') {
//                     console.log("Snehil");
//                     const pdfDoc = await PDFDocument.create();
//                     const page = pdfDoc.addPage([600, 400]);
//                     page.drawText(`Unique PDF Document - ID: ${Date.now()}`, {
//                         x: 50,
//                         y: 350,
//                         size: 30,
//                         color: rgb(0, 0, 0),
//                     });
//                     filePath = `generated_documents/unique_document_${Date.now()}.pdf`;
//                     fs.writeFileSync(filePath, await pdfDoc.save());
//                 } else if (format === 'word') {
//                     const doc = new Document({
//                         sections: [{
//                             properties: {},
//                             children: [
//                                 new Paragraph({
//                                     text: `Unique Word Document - ID: ${Date.now()}`,
//                                     heading: 'Heading1',
//                                 }),
//                             ],
//                         }],
//                     });
//                     filePath = `generated_documents/unique_document_${Date.now()}.docx`;
//                     const buffer = await Packer.toBuffer(doc);
//                     fs.writeFileSync(filePath, buffer);
//                 } else if (format === 'excel') {
//                     const workbook = new ExcelJS.Workbook();
//                     const worksheet = workbook.addWorksheet('Unique Excel');
//                     worksheet.getCell('A1').value = `Unique Excel Document - ID: ${Date.now()}`;
//                     filePath = `generated_documents/unique_document_${Date.now()}.xlsx`;
//                     await workbook.xlsx.writeFile(filePath);
//                 }
//                 break;

//             case 'blank':
//                 if (format === 'pdf') {
//                     const blankPdfDoc = await PDFDocument.create();
//                     filePath = `generated_documents/blank_document_${Date.now()}.pdf`;
//                     fs.writeFileSync(filePath, await blankPdfDoc.save());
//                 } else if (format === 'word') {
//                     const blankDoc = new Document({
//                         sections: [{
//                             properties: {},
//                             children: [],
//                         }],
//                     });
//                     filePath = `generated_documents/blank_document_${Date.now()}.docx`;
//                     const buffer = await Packer.toBuffer(blankDoc);
//                     fs.writeFileSync(filePath, buffer);
//                 } else if (format === 'excel') {
//                     const blankWorkbook = new ExcelJS.Workbook();
//                     filePath = `generated_documents/blank_document_${Date.now()}.xlsx`;
//                     await blankWorkbook.xlsx.writeFile(filePath);
//                 }
//                 break;

//             case 'fillable':
//                 if (format === 'pdf') {
//                     const fillablePdfDoc = await PDFDocument.create();
//                     const page = fillablePdfDoc.addPage([600, 400]);
            
//                     // Create a form
//                     const form = fillablePdfDoc.getForm();
            
//                     // Create a text field
//                     const textField = form.createTextField('textField');
//                     textField.setText('Fillable Text');
//                     textField.addToPage(page, { x: 50, y: 350, width: 300, height: 50 });
            
//                     // Draw a box to represent a checkbox
//                     const checkboxX = 50;
//                     const checkboxY = 300;
//                     page.drawRectangle({
//                         x: checkboxX,
//                         y: checkboxY,
//                         width: 20,
//                         height: 20,
//                         color: rgb(1, 1, 1),
//                         borderColor: rgb(0, 0, 0),
//                         borderWidth: 2,
//                     });
            
//                     // Optionally, label the checkbox
//                     page.drawText('Checkbox', {
//                         x: checkboxX + 30,
//                         y: checkboxY + 2,
//                         size: 12,
//                         color: rgb(0, 0, 0),
//                     });
            
//                     // Save the fillable PDF
//                     filePath = `generated_documents/fillable_document_${Date.now()}.pdf`;
//                     fs.writeFileSync(filePath, await fillablePdfDoc.save());
//                 }
//                 break;
            
                
                

//             case 'non-fillable':
//                 if (format === 'pdf') {
//                     const nonfillablePdfDoc = await PDFDocument.create();
//                     const page = nonfillablePdfDoc.addPage([600, 400]);
//                     page.drawText('Non-Fillable PDF Document', {
//                         x: 50,
//                         y: 350,
//                         size: 30,
//                         color: rgb(0, 0, 0),
//                     });
//                     filePath = `generated_documents/non_fillable_document_${Date.now()}.pdf`;
//                     fs.writeFileSync(filePath, await nonfillablePdfDoc.save());
//                 }
//                 break;

//             default:
//                 return res.status(400).send('Invalid document type');
//         }

//         res.download(filePath, (err) => {
//             if (err) {
//                 console.error(err);
//                 res.status(500).send('Error downloading file');
//             } else {
//                 console.log(`File sent: ${filePath}`);
//             }
//         });
//     } catch (error) {
//         console.error("Error generating document:", error);
//         res.status(500).send('Error generating document');
//     }
// });
// // Endpoint to duplicate documents
// app.get('/api/duplicate-document', (req, res) => {
//     const { format } = req.query;

//     let filePath;

//     if (format === 'pdf') {
//         filePath = path.join(__dirname, 'uploads', 'duplicate.pdf'); // Replace with actual PDF file name
//     } else if (format === 'jpg') {
//         filePath = path.join(__dirname, 'uploads', 'duplicate.jpg'); // Replace with actual image file name
//     } else {
//         return res.status(400).send('Invalid format');
//     }

//     res.download(filePath, (err) => {
//         if (err) {
//             console.error(err);
//             res.status(500).send('Error downloading file');
//         } else {
//             console.log(`File sent: ${filePath}`);
//         }
//     });
// });

// Start the server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });














// const winston = require('winston');

// Configure winston logging
// const logger = winston.createLogger({
//     level: 'info',
//     format: winston.format.combine(
//         winston.format.timestamp(),
//         winston.format.printf(({ timestamp, level, message }) => {
//             return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
//         })
//     ),
//     transports: [
//         new winston.transports.Console(),
//         // Optionally, log to a file
//         new winston.transports.File({ filename: 'app.log' })
//     ]
// }); 

// const morgan = require('morgan');

// HTTP request logging
// app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// app.get('/generate-document', (req, res) => {
//     logger.info('Generate Document endpoint hit');
//     try {
//         // Code to generate a document
//         res.send("Document generated successfully.");
//         logger.info('Document generated successfully');
//     } catch (error) {
//         logger.error(`Error generating document: ${error.message}`);
//         res.status(500).send("Error generating document");
//     }
// });                   

// const isProduction = process.env.NODE_ENV === 'production';

