import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

// Fix for ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

// Configure CORS with explicit options
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true)

    const allowedOrigins = [
      'https://www.rmoise.com',
      'http://127.0.0.1:5500',
      'http://localhost:3000',
      'http://localhost:5500'
    ]

    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}

app.use(cors(corsOptions))

// Serve static files from the current directory
app.use(express.static('.'))

// Middleware to parse JSON and URL-encoded data
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// POST route for sending emails
app.post('/api/send-email', async (req, res) => {
  const { name, email, message } = req.body

  // Validate input
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Missing required fields' })
  }

  // Create a transporter object using SMTP transport
  const transporter = nodemailer.createTransporter({
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

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err)
  res.status(500).json({ error: 'Internal server error' })
})

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`)
})
