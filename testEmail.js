import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const mailOptions = {
  from: 'test@example.com',
  to: 'roderickfmoise@gmail.com',
  subject: 'Test Email',
  text: 'This is a test email',
  html: '<p>This is a test email</p>'
};

async function sendTestEmail() {
  try {
    await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully');
  } catch (error) {
    console.error('Error sending test email:', error);
  }
}

sendTestEmail();
