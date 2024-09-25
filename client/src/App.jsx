import React, { useState } from "react";
import "./App.css";
import * as XLSX from "xlsx";
import QRCode from "qrcode";
import Logo from "./assets/logo-qr.png";
import Certificate from "./Certificate";
import html2canvas from "html2canvas";
import jsPDF from "jspdf"; 

const BASE_URL = 'https://7244-176-16-82-123.ngrok-free.app'

const App = () => {
  const [excelData, setExcelData] = useState([]);
  const [documentType, setDocumentType] = useState("certificate");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [currentData, setCurrentData] = useState(null);

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

  const handleGenerate = () => {
    console.log("Current Data:", currentData);
    if (excelData.length === 0 || !documentType) {
      alert("Please upload an Excel file and select a document type.");
      return;
    }
  
    const dataToEncode = `Name: ${currentData.Name}, Course: ${currentData.Course}, Date: ${currentData.Date}`;
    generateQRCode(dataToEncode).then(() => {
      uploadCertificateAsPDF();
    });
  };
  
  // Fn to generate and upload the certificate as a PDF
  const uploadCertificateAsPDF = () => {
    const certificateElement = document.querySelector(".certificate-container");
  
    if (certificateElement) {
      html2canvas(certificateElement, { scale: 2 }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
  
        const pdf = new jsPDF({
          orientation: "landscape",
          unit: "px",
          format: [canvas.width, canvas.height],
        });
  
        pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  
        // Convert PDF to Blob
        const pdfBlob = pdf.output("blob");
  
        // Create FormData to send the PDF as a file
        const formData = new FormData();
        formData.append("fileData", pdfBlob, "certificate.pdf");
        formData.append("fileType", "application/pdf");  
  
        fetch(`${BASE_URL}/api/upload`, {
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
        </select>

        <button onClick={handleGenerate} className="generate-button">
          Generate
        </button>
      </div>

      {currentData && qrCodeUrl && (
        <>
          <Certificate
            name={currentData.Name}
            course={currentData.Course}
            date={currentData.Date}
            qrCodeUrl={qrCodeUrl}
          />
        </>
      )}
    </div>
  );
};

export default App;
