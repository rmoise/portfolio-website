const express = require('express');
const app = express();
const keys = require('./config/keys');
var cors = require('cors')
app.use(cors());


const nodemailer = require('nodemailer');

const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.static('public'))
app.use(express.json())

app.get('/', (req, res)=> {
res.sendFile(__dirname + '/public/contact.html')
})

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