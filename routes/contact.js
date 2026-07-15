const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, error: 'Please provide all required fields' });
    }

    if (!process.env.ZOHO_EMAIL || !process.env.ZOHO_PASSWORD) {
      console.error('Zoho credentials missing in environment variables');
      return res.status(500).json({ success: false, error: 'Server email configuration is missing' });
    }

    console.log('Attempting to send email via Zoho...');

    // Configure Zoho SMTP transporter
    const transporter = nodemailer.createTransport({
      host: 'smtp.zoho.in', // Or smtp.zoho.com depending on region
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: process.env.ZOHO_EMAIL,
        pass: process.env.ZOHO_PASSWORD
      }
    });

    const mailOptions = {
      from: process.env.ZOHO_EMAIL, // Must be the same as auth user in Zoho
      to: process.env.ZOHO_EMAIL, // Send the contact form to yourself (or another admin email)
      replyTo: email, // Set the reply-to address to the user's email
      subject: `New Contact Form Submission: ${subject || 'General Inquiry'}`,
      html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ success: true, data: 'Message sent successfully' });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ success: false, error: 'Failed to send message. Please try again later.' });
  }
});

module.exports = router;
