import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// Configure CORS
app.use(
  cors({
    origin: ['https://www.rmoise.com', 'http://127.0.0.1:5500'], // Added 127.0.0.1:5500
    methods: ['GET', 'POST'],
  }),
)

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// POST route for sending emails
app.post('/api/send-email', async (req, res) => {
  const { name, email, message } = req.body

  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransport({
    service: 'Gmail', // Replace with your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  // Email options
  const mailOptions = {
    from: email,
    to: 'roderickfmoise@gmail.com', // Replace with your email address
    subject: `Contact Form Submission from ${name}`,
    text: message,
    html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> ${email}</p><p><strong>Message:</strong> ${message}</p>`,
  }

  try {
    // Send the email
    await transporter.sendMail(mailOptions)
    res.status(200).json({ message: 'Message sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    res.status(500).json({ error: 'Failed to send message' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
