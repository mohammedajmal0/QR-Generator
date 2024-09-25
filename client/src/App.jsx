import QRCode from "qrcode";
import React, { useState } from "react";
import * as XLSX from "xlsx";
import "./App.css";
import Certificate from "./Certificate";

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


      const updatedData = jsonData.map((row, index) => ({
        ...row,
        uniqueId: uniqueIdGenerator(), // Add the unique ID here
      }));

      // Set Excel data
      setExcelData(updatedData);

      // Check if there is data in the Excel file
      if (updatedData.length > 0) {
        setCurrentData(updatedData[0]); 
      } else {
        alert("No data found in the uploaded Excel file.");
      }
  
      // Optionally, you can store the updated data (e.g., in local storage, a database, or a server)
      
    };

    reader.readAsArrayBuffer(file);
  };

  const saveExcelFile = async (data, originalFileName) => {
    // Convert JSON back to a worksheet
    const worksheet = XLSX.utils.json_to_sheet(data);
  
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
  
    // Write workbook to binary format
    const fileData = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  
    // Create a Blob for the updated file
    const blob = new Blob([fileData], { type: "application/octet-stream" });
  
    // Create a link element to trigger file download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `updated_${originalFileName}`; // Modify filename if needed
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const uniqueIdGenerator=async ()=>{
    return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
  }

  // Handle QR code generation
  const generateQRCode = async (data) => {
    try {
      const url = await QRCode.toDataURL(data);
      setQrCodeUrl(url);
    } catch (err) {
      console.error("Failed to generate QR code", err);
    }
  };

  // Handle form submission (Generate certificate)
  const handleGenerate = async () => {
    console.log("Current Data:", currentData);
    if (excelData.length === 0 || !documentType) {
      alert("Please upload an Excel file and select a document type.");
      return;
    }
    await saveExcelFile(updatedData, file.name);
    const dataToEncode = `Name: ${currentData.Name}, Course: ${currentData.Course}, Date: ${currentData.Date}`; // Modify according to Excel column names
    generateQRCode(dataToEncode); // Generate QR code based on data
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
        <Certificate
          name={currentData.Name}
          course={currentData.Course}
          date={currentData.Date}
          qrCodeUrl={qrCodeUrl}
        />
      )}
    </div>
  );
};

export default App;
