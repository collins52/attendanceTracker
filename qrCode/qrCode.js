const loginUrl = "https://attendance-tracker-two-omega.vercel.app/AttendanceForm/attendanceForm.html"; // Replace with your actual login page URL

  const qrcode = new QRCode(document.getElementById("qrCode"), {
    text: loginUrl,
    width: 128,
    height: 128,
    colorDark: "#ffffff",
    colorLight: "#2563EB",
    correctLevel: QRCode.CorrectLevel.H
  });
