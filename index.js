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

// Multer configuration to handle image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Folder where images will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const uploadDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}


const upload = multer({ storage });

// Endpoint to handle property posting with image uploads
app.post('/api/post-property', upload.array('images'), async (req, res) => {
  const {
    title,
    description,
    price,
    location,
    poster,
    buildingType,
    bedrooms,
    bathrooms,
  } = req.body;

  const uploadedImages = req.files; // Array of uploaded images

  // Create a transporter using your email service
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or any other email service
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Prepare attachments for images
  const attachments = uploadedImages.map((image) => {
    return {
      filename: image.filename,
      path: image.path, // Path to the saved file
    };
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: 'proptechdevelopment@gmail.com', // Change to your recipient email
    subject: 'New Property Submission',
    html: `
      <h1>Property Details</h1>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Description:</strong> ${description}</p>
      <p><strong>Price:</strong> ₹${price}</p>
      <p><strong>Location:</strong> ${location}</p>
      <p><strong>Posted By:</strong> ${poster}</p>
      <p><strong>Building Type:</strong> ${buildingType}</p>
      <p><strong>Bedrooms:</strong> ${bedrooms}</p>
      <p><strong>Bathrooms:</strong> ${bathrooms}</p>
    `,
    attachments, // Add image attachments
  };

  try {
    await transporter.sendMail(mailOptions);
    
    // Optionally, you can delete the uploaded files after sending the email
    uploadedImages.forEach((image) => {
      fs.unlink(image.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    });

    res.status(200).json({ message: 'Property details sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
