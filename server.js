const express = require('express');
const app = express();
const keys = require('./config/keys');
var cors = require('cors')



const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.static('public'))
app.use(express.json())

app.get('/', (req, res)=> {
res.sendFile(__dirname + '/public/contact.html')
})

const allowedOrigins = [
    'https://rmoise.github.io/portfolio-website/Public/contact.html',
];


app.use(
    cors({
        origin: (origin, callback) => {
            if (!origin) return callback(null, true);
            if (allowedOrigins.indexOf(origin) === -1) {
                // If a specific origin isn’t found on the list of allowed origins
                let message = 'The CORS policy for this application doesn’t allow access from origin ' + origin;
                return callback(new Error(message), false);
            }
            return callback(null, true);
        }
    })
);

app.post('/', (req, res) =>{
    console.log(req.body);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: keys.google.user,
            pass: keys.google.pass
        }
    })

    const mailOptions = {
        from: req.body.email,
        to: 'roderickfmoise@gmail.com',
        subject: `Message from ${req.body.email}`,
        text: req.body.message
    }

    transporter.sendMail(mailOptions, (error, info)=>{
        if(error){
            console.log(error);
            res.send('error');
        }else {
            console.log('Email sent: ' + info.response)
            res.send('success')
        }
    })
})

app.listen(PORT, ()=>{
    console.log(`Server running on port ${PORT}`)
})