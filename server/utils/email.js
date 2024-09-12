const nodemailer = require('nodemailer');
const { google } = require('googleapis');

// OAuth2 credentials
const CLIENT_ID = '221550616731-a8f7vihmac254gsti4a4ahkt60ijftqe.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04iO-4coLgkniCgYIARAAGAQSNwF-L9IrSHNsw0KH3YEyvGVNr1JS1NGk38ufcKLEm1Qp4Xe9jgPsxgipKii-g7fAuIxAwd1nRLY';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Set the refresh token to the OAuth2 client
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// Function to create and return a transporter with a fresh access token
const createTransporter = async () => {
  try {
    // Use the refresh token to get a new access token
    const { token: accessToken } = await oAuth2Client.getAccessToken();

    // Create a transporter with the updated access token
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'aarnavsingh836@gmail.com',  // Replace with your email
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken,
      },
    });

    return transporter;
  } catch (error) {
    console.error('Error creating transporter:', error.message);
    throw new Error('Failed to create transporter with a refreshed token');
  }
};

// Function to send an email using the transporter
const sendEmail = async (recipient, subject, text) => {
  try {
    // Create a transporter with a fresh token
    const emailTransporter = await createTransporter();

    const mailOptions = {
      from: 'aarnavsingh836@gmail.com', 
      to: recipient,
      subject,
      text,
    };

    // Send the email using the transporter
    emailTransporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error while sending email:', error);
        return;
      }
      console.log('Email sent:', info.response);
    });
  } catch (error) {
    console.error('Error in sendEmail:', error.message);
  }
};

module.exports = { sendEmail };
