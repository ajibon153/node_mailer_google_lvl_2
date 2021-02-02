const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const exphbs = require('express-handlebars');
// const handlebars = require('express-handlebars').create({
//   layoutsDir: path.join(__dirname, 'views'),
//   partialsDir: path.join(__dirname, 'views/partials'),
//   defaultLayout: 'layout',
//   extname: 'hbs',
// });
const nodemailer = require('nodemailer');

const app = express();

// View engine setup
app.engine(
  'handlebars',
  exphbs({
    layoutsDir: path.join(__dirname, 'views'),
  })
);
app.set('view engine', 'handlebars');
app.set('views', 'views');

// Static folder
app.use('/public', express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  // res.render('contact');
  res.render('contact', { title: 'Contact', layout: 'contact' });
  // res.send('he');
});

app.post('/send', (req, res) => {
  console.log('req', req.body);
  const output = `
  <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${req.body.name}</li>
      <li>Company: ${req.body.company}</li>
      <li>Email: ${req.body.email}</li>
      <li>Phone: ${req.body.phone}</li>
    </ul>
    <h3>Message</h3>
    <p>${req.body.message}</p>
  `;
  // async..await is not allowed in global scope, must use a wrapper
  async function main() {
    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      secure: false, // true for 465, false for other ports
      auth: {
        user: '', // generated ethereal user
        pass: '', // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"Test Nodemailer " <ajifake153@gmail.com>', // sender address
      to: req.body.email, // list of receivers
      subject: 'Node Contact Requerst', // Subject line
      text: 'Hello world?', // plain text body
      html: output, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    if (info) {
      res.render('contact', {
        title: 'Contact',
        layout: 'contact',
        msg: 'Email has been sent',
      });
    } else {
      res.render('contact', {
        title: 'Contact',
        layout: 'contact',
        msg: 'Email failed to sent',
      });
    }
  }

  main().catch(console.error);
});

app.listen(5000, () => console.log('Server started...'));
