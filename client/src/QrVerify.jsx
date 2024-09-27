import { Jimp } from 'jimp';
import { PDFDocument } from 'pdf-lib';
import QrReader from 'qrcode-reader';
import React, { useState } from 'react';
import './QrVerifyComponent.css';

const QrVerifyComponent = () => {
  const [qrData, setQrData] = useState('');
  const [info, setInfo] = useState(null);

  const handleFileUpload = async (e) => {
    const uploadedFile = e.target.files[0];
    if (!uploadedFile) return;

    const fileExtension = uploadedFile.name.split('.').pop().toLowerCase();

    if (fileExtension === 'pdf') {
      const pdfBuffer = await uploadedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(pdfBuffer);
      const page = pdfDoc.getPage(0);
      const { width, height } = page.getSize();
      const pngImage = await page.renderToPng();
      // Assuming you have a method to convert to image
      const img = await Jimp.read(pngImage);
      extractQRCode(img);
    } else {
      console.log("file ",fileExtension)
      const img = await Jimp.read(uploadedFile);
      console.log(img)
      extractQRCode(img);
    }
  };

  const extractQRCode = (image) => {
    const qr = new QrReader();
    qr.callback = (err, value) => {
      if (err) {
        console.error(err);
        return;
      }
      setQrData(value.result);
      fetchInfoFromBackend(value.result); // Fetch data based on QR
    };
    qr.decode(image.bitmap);

    console.log(qrData,"qr daratattftftftfttft")
  };

  const fetchInfoFromBackend = async (qrCode) => {
    // Your fetch logic here
  };
  
  return (
    <div className="qr-verify-container">
      <h2>QR Code Verification</h2>
      
      {/* File Upload Section */}
      <input
        type="file"
        accept=".pdf,.jpg,.jpeg,.png"
        onChange={handleFileUpload}
        className="file-input"
      />

      

      {/* Display QR Data and Info */}
      {qrData && (
        <div className="qr-info-box">
          <h3>QR Code Data:</h3>
          <p>{qrData}</p>
        </div>
      )}

      {info && (
        <div className="info-box">
          <h3>Fetched Information:</h3>
          <pre>{JSON.stringify(info, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default QrVerifyComponent;
