import express from 'express';
import nodemailer from 'nodemailer';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import cors from 'cors';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/api/post-property', async (req, res) => {
  const {
    title,
    description,
    price,
    location,
    poster,
    buildingType,
    bedrooms,
    bathrooms,
    images,
  } = req.body;

  // Create a transporter using your email service
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or any other email service
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: 'recipient-email@example.com', // Change to your recipient email
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
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Property details sent successfully!' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
