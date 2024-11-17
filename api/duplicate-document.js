const path = require('path');

module.exports = (req, res) => {
    const { format } = req.query;

    let filePath;

    if (format === 'pdf') {
        filePath = path.join(__dirname, 'uploads', 'duplicate.pdf');
    } else if (format === 'jpg') {
        filePath = path.join(__dirname, 'uploads', 'duplicate.jpg');
    } else {
        return res.status(400).send('Invalid format');
    }

    res.download(filePath, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error downloading file');
        } else {
            console.log(`File sent: ${filePath}`);
        }
    });
};
