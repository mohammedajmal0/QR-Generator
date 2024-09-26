import html2pdf from "html2pdf.js";
import QRCode from "qrcode";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./App.css";
import Certificate from "./Certificate";

const BASE_URL = 'http://localhost:9098'

const App = () => {
  const [excelData, setExcelData] = useState([]);
  const [documentType, setDocumentType] = useState("certificate");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [currentData, setCurrentData] = useState(null);
  const [generatedCertificates, setGeneratedCertificates] = useState([]);

  // Handle Excel file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);

      // Set Excel data
      setExcelData(jsonData);

      // Check if there is data in the Excel file
      if (jsonData.length > 0) {
        setCurrentData(jsonData[0]);
      } else {
        alert("No data found in the uploaded Excel file.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Handle QR code generation
  const generateQRCode = async (data) => {
    try {
      const url = await QRCode.toDataURL(data);
      setQrCodeUrl(url);
    } catch (err) {
      console.error("Failed to generate QR code", err);
    }
  };

  const handleGenerate =  async () => {
    console.log("Current Data:", currentData);
    if (excelData.length === 0 || !documentType) {
      alert("Please upload an Excel file and select a document type.");
      return;
    }

    const generatedData = [];
    for(const row of excelData){
      const uniqueId = `qrId-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
    
        // Generate a unique ID for each row (or use an existing field)
        const dataToEncode = uniqueIdGenerator(); 
        
  
        // Generate QR code (assuming generateQRCode is an async function)
        await generateQRCode(dataToEncode);
  
        // Add QR code data to the row (if needed)
        generatedData.push({
          ...row,
          uniqueId,
          qrCodeUrl,
        });
        
    }

    setGeneratedCertificates(generatedData);
    // const dataToEncode = uniqueIdGenerator();
    // generateQRCode(dataToEncode).then(() => {
    //   uploadCertificateAsPDF();
    // });
  };
  
  

  const uniqueIdGenerator= ()=>{
    return `qrId : ${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  

  // const uploadCertificates = (certificates) => {
  //   certificates.forEach((cert) => {
  //     // Create a new PDF document
  //     const pdf = new jsPDF({
  //       orientation: "landscape",
  //       unit: "px",
  //       format: "a4", // A4 size paper
  //     });
  
  //     // Add text content to the PDF
  //     pdf.setFontSize(24);
  //     pdf.text(`Certificate of Completion`, 100, 50);
  //     pdf.setFontSize(16);
  //     pdf.text(`This certifies that`, 100, 100);
  //     pdf.setFontSize(20);
  //     pdf.text(cert.Name, 100, 130); // Student Name
  //     pdf.setFontSize(16);
  //     pdf.text(`has completed the course`, 100, 160);
  //     pdf.text(cert.Course, 100, 190); // Course Name
  //     pdf.text(`Date: ${cert.Date}`, 100, 220); // Date
  
  //     // Add the QR Code image if available
  //     if (cert.qrCodeUrl) {
  //       const qrImage = new Image();
  //       qrImage.src = cert.qrCodeUrl;
  
  //       qrImage.onload = () => {
  //         // Draw QR Code image at specified position
  //         pdf.addImage(qrImage, "PNG", 100, 250, 50, 50); // Change dimensions as needed
  
  //         // Convert PDF to Blob
  //         const pdfBlob = pdf.output("blob");
  
  //         // Create FormData to send the PDF as a file
  //         const formData = new FormData();
  //         formData.append("file", pdfBlob, `${cert.usn}.pdf`); // Use {usn}.pdf as filename
  //         formData.append("fileType", "application/pdf");
  
  //         // Upload the PDF to the server
  //         fetch(`${BASE_URL}/api/upload?fileName=${cert.usn}`, {
  //           method: "POST",
  //           body: formData,
  //         })
  //           .then((response) => response.json())
  //           .then((data) => {
  //             console.log("Certificate uploaded successfully:", data);
  //           })
  //           .catch((error) => {
  //             console.error("Error uploading certificate:", error);
  //           });
  //       };
  //     } else {
  //       // Convert PDF to Blob if no QR code
  //       const pdfBlob = pdf.output("blob");
  
  //       // Create FormData to send the PDF as a file
  //       const formData = new FormData();
  //       formData.append("file", pdfBlob, `${cert.usn}.pdf`); // Use {usn}.pdf as filename
  //       formData.append("fileType", "application/pdf");
  
  //       // Upload the PDF to the server
  //       fetch(`${BASE_URL}/api/upload?fileName=${cert.usn}`, {
  //         method: "POST",
  //         body: formData,
  //       })
  //         .then((response) => response.json())
  //         .then((data) => {
  //           console.log("Certificate uploaded successfully:", data);
  //         })
  //         .catch((error) => {
  //           console.error("Error uploading certificate:", error);
  //         });
  //     }
  //   });
  // };

  const uploadCertificates = (certificates) => {
    console.log("uploading..........")
    certificates.forEach((cert) => {
      const certificateElement = document.getElementById(`cert-${cert.uniqueId}`);
      
      if (certificateElement) {
        // Use html2pdf to generate PDF from HTML
        const opt = {
          margin: 1,
          filename: `${cert.usn}.pdf`, // File name based on the 'usn'
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 10 }, // Adjust scale for better quality
          jsPDF: { unit: 'in', format: 'A4', orientation: 'landscape' } // Orientation based on your requirement
        };
        
        // Generate PDF and upload it to the server
        html2pdf()
          .from(certificateElement)
          .set(opt)
          .output('blob') // Output the PDF as a Blob to be uploaded
          .then((pdfBlob) => {
            // Create FormData to send the PDF as a file
            const formData = new FormData();
            formData.append("file", pdfBlob, `${cert.usn}.pdf`);
            formData.append("fileType", "application/pdf");
  
            fetch(`${BASE_URL}/api/upload?fileName=${cert.usn}`, {
              method: "POST",
              body: formData,
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("Certificate uploaded successfully:", data);
              })
              .catch((error) => {
                console.error("Error uploading certificate:", error);
              });
          });
      }
    });
  };
  

  return (
    <div className="App">
      <h1 className="app-title">QR Code Generator for Certificate</h1>

      <div className="upload-section">
        {/* File Upload */}
        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="file-input"
        />

        {/* Select Document Type */}
        <select
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value)}
          className="document-select"
        >
          <option value="certificate">Certificate</option>
          <option value="certificate2">Certificate2</option>
        </select>

        <button onClick={handleGenerate} className="generate-button">
          Generate
        </button>
      </div>


      {/* {currentData && qrCodeUrl && (
        <>
          <Certificate
            name={currentData.Name}
            course={currentData.Course}
            date={currentData.Date}
            qrCodeUrl={qrCodeUrl}
          />
        </>
      )} */}
       {/* Render Generated Certificates */}
       {generatedCertificates.map((cert, index) => (
        <div key={index} id={`cert-${cert.uniqueId}`} className="certificate-container">
          <Certificate
            name={cert.Name}
            course={cert.Course}
            date={cert.Date}
            qrCodeUrl={cert.qrCodeUrl}
          />
        </div>
      ))}

      <button onClick={() => uploadCertificates(generatedCertificates)} className="upload-button">
        Upload All Certificates
      </button>
    </div>
  );
};

export default App;
