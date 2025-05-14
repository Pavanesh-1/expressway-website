const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// ✅ Serve static files from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));

// ❌ REMOVE this, it's optional and may conflict
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

// ✅ Contact form handler
app.post("/contact", async (req, res) => {
  const { name, from, to, phone } = req.body;

  if (!name || !from || !to || !phone) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"ExpressWay" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECEIVER || process.env.EMAIL_USER,
    subject: "🚚 New Delivery Request - ExpressWay",
    text: `Name: ${name}\nPhone: ${phone}\nFrom: ${from}\nTo: ${to}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error("Email error:", error);
    res.status(500).json({ error: "Failed to send email." });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

