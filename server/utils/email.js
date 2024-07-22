const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    '960465863169-99bl4c3t83eqdjim6tdvshr2b2huij06.apps.googleusercontent.com',
    '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',
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: '1//04FEhn6VMaxQJCgYIARAAGAQSNwF-L9Irm76QPp09_FrXBbNqzoTAXiQvAAgxW9VhxTyhQEWwfW311nL1Svu--_WUfsv1jv4EiXY',
  });

  try {
    const accessToken = await oauth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'aarnavsingh836@gmail.com',
        clientId: '221550616731-a8f7vihmac254gsti4a4ahkt60ijftqe.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04X91d0TPMs-JCgYIARAAGAQSNwF-L9IroWvIAJS0SRZrraYLlbiTxS2z6vQUXjsDHmDCTW85P3VsdFAP0CcvfKzZh7PebZ7JFcI',
        accessToken: accessToken.token,
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