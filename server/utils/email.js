const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const dotenv = require('dotenv');

dotenv.config();

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  const accessToken = await new Promise((resolve, reject) => {
    oauth2Client.getAccessToken((err, token) => {
      if (err) {
        reject("Failed to create access token :(");
      }
      resolve(token);
    });
  });

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.EMAIL_USER,
      accessToken,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    },
  });

  return transporter;
};

const sendEmail = async (recipient, subject, text) => {
  const emailTransporter = await createTransporter();
  
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: recipient,
    subject,
    text,
  };

  emailTransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log('Error while sending email:', error);
    }
    console.log('Email sent: ' + info.response);
  });
};

module.exports = { sendEmail };