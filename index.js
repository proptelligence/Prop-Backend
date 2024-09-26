import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Ensure the 'uploads' folder exists (relative path)
const uploadDir = path.resolve(process.cwd(), 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration to handle image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save images to 'uploads/' folder
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const upload = multer({ storage });

// Endpoint to handle property posting with image uploads
app.post('/api/post-property', upload.array('images'), async (req, res) => {
  const { title, description, price, location, poster, buildingType, bedrooms, bathrooms } = req.body;
  const uploadedImages = req.files;

  // Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Attach images to email
  const attachments = uploadedImages.map((image) => ({
    filename: image.filename,
    path: image.path,
  }));

  const mailOptions = {
    from: process.env.EMAIL,
    to: 'proptechdevelopment@gmail.com',
    subject: 'New Property Submission',
    html: `<h1>Property Details</h1>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Price:</strong> ₹${price}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Posted By:</strong> ${poster}</p>
      <p><strong>Building Type:</strong> ${buildingType}</p>
      <p><strong>Bedrooms:</strong> ${bedrooms}</p>
      <p><strong>Bathrooms:</strong> ${bathrooms}</p>`,
    attachments,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Property details sent successfully!' });

    // Optionally delete images after sending email
    uploadedImages.forEach((image) => {
      fs.unlink(image.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
