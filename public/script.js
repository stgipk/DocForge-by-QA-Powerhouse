function generateDocument(type, format) {
    // Replace with your server endpoint
    fetch(`/generate-document?type=${type}&format=${format}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${type}_${format}_document.${format === 'pdf' ? 'pdf' : format === 'word' ? 'docx' : 'xlsx'}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => {
            console.error("Error generating document:", error);
        });
}

function duplicateDocument(format) {
    // Replace with your server endpoint
    fetch(`/duplicate-document?format=${format}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.blob();
        })
        .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `duplicate_document.${format === 'jpg' ? 'jpg' : 'pdf'}`;
            document.body.appendChild(a);
            a.click();
            a.remove();
        })
        .catch(error => {
            console.error("Error duplicating document:", error);
        });
}
