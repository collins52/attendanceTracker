const loginUrl = "https://5tqqgsff-5501.euw.devtunnels.ms/AttendanceForm/attendanceForm.html"; // Replace with your actual login page URL

  const qrcode = new QRCode(document.getElementById("qrCode"), {
    text: loginUrl,
    width: 128,
    height: 128,
    colorDark: "#ffffff",
    colorLight: "#2563EB",
    correctLevel: QRCode.CorrectLevel.H
  });