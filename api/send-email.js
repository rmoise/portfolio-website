import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Credentials', true);
    res.setHeader('Access-Control-Allow-Origin', 'https://www.rmoise.com'); // Adjust this if needed
    res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.status(200).end();
    return;
  }

  if (req.method === 'POST') {
    // Log the incoming request body for debugging
    console.log('Received request body:', req.body);

    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      console.error('Validation error: All fields are required');
      return res.status(400).json({ error: 'All fields are required' });
    }

    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: email,
        to: process.env.EMAIL_USER,
        subject: `Contact Form Submission from ${name}`,
        text: `Message from ${name} (${email}):\n\n${message}`,
      };

      // Log mail options for debugging
      console.log('Sending email with options:', mailOptions);

      await transporter.sendMail(mailOptions);

      res.status(200).json({ message: 'Email sent successfully' });
    } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).json({ error: 'Failed to send email' });
    }
  } else {
    console.error(`Method ${req.method} Not Allowed`);
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
