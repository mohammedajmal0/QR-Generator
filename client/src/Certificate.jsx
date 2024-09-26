// import React from 'react';
// import './App.css'; 

// const Certificate = ({ name, course, date, qrCodeUrl }) => {
//     console.log(name, course,date,qrCodeUrl);
    
//   return (
//     <div className="certificate-container">
//       <Icon />
//       <p className="byline">Certificate of Completion</p>

//       <div className="content">
//         <p>Awarded to</p>
//         <h1>{name}</h1>
//         <p>for completing:</p>
//         <h2>{course}</h2>
//       </div>

//       {date && (
//         <p className="date">
//           Issued on <span className="bold">{date}</span>
//         </p>
//       )}

//       <div className="qrCode">
//         <img src={qrCodeUrl} alt="Qr Code" />
//       </div>

//     </div>
//   );
// };

// const Icon = () => (
//   <svg width="99" height="139" viewBox="0 0 99 139" fill="none" xmlns="http://www.w3.org/2000/svg">
//     <path d="M0 0H99V138.406L52.1955 118.324L0 138.406V0Z" fill="white" />
//     <path d="M25.4912 83.2515C25.4912 79.4116 27.0222 75.7289 29.7474 73.0137C32.4727 70.2985 36.1689 68.7731 40.0229 68.7731C43.877 68.7731 47.5732 70.2985 50.2984 73.0137C53.0236 75.7289 54.5546 79.4116 54.5546 83.2515M40.0229 59.724C40.0229 55.8841 41.5539 52.2014 44.2791 49.4862C47.0044 46.7709 50.7006 45.2455 54.5546 45.2455C58.4087 45.2455 62.1049 46.7709 64.8301 49.4862C67.5553 52.2014 69.0863 55.8841 69.0863 59.724V83.2515" stroke="#0379FF" strokeWidth="10.6193" />
//   </svg>
// );

// export default Certificate;
import React from 'react';
import './App.css';

const Certificate = ({name, course, date, qrCodeUrl}) => {
  return (
    <div className="certificate-container">
      <div className="certificate-header">
        <h1 className="university-name">University Name</h1>
        <p className="certificate-title">Certificate of Completion</p>
      </div>

      <div className="certificate-body">
        <p className="content-text">This is to certify that</p>
        <h2 className="recipient-name">{name}</h2>
        <p className="content-text">has successfully completed the course</p>
        <h3 className="course-name">{course}</h3>
        <p className="issued-date">
          Issued on <span className="bold">{date}</span>
        </p>
      </div>

      <div className="certificate-footer">
        <div className="signature-section">
          <p className="signature-label">Authorized Signature</p>
          <div className="signature-line"></div>
        </div>
        <div className="qrCode-section">
          <img
            src={qrCodeUrl}
            alt="QR Code"
            className="qrCode"
          />
        </div>
      </div>
    </div>
  );
};

export default Certificate;
