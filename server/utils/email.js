const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const CLIENT_ID = '221550616731-a8f7vihmac254gsti4a4ahkt60ijftqe.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04AM8C4KVKeyqCgYIARAAGAQSNwF-L9IrsF4Lw3Gebn3jJsB5b-1r2oXyh64gHUY3BkkoT84I5GdKTegx9RqAlPeU5Lq0Zw9JzLw';

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const createTransporter = async () => {
  try {
    const accessTokenResponse = await oAuth2Client.getAccessToken();
    const accessToken = accessTokenResponse.token;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'aarnavsingh836@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    return transporter;
  } catch (error) {
    console.error('Error creating transporter:', error);
    throw new Error('Error creating transporter');
  }
};

const sendEmail = async (recipient, subject, text) => {
  try {
    const emailTransporter = await createTransporter();
    const mailOptions = {
      from: 'aarnavsingh836@gmail.com',
      to: recipient,
      subject,
      text,
    };

    emailTransporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error while sending email:', error);
        return;
      }
      console.log('Email sent:', info.response);
    });
  } catch (error) {
    console.error('Error in sendEmail:', error);
  }
};

module.exports = { sendEmail };