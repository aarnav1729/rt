const nodemailer = require('nodemailer');
const { google } = require('googleapis');

const OAuth2 = google.auth.OAuth2;

const createTransporter = async () => {
  const oauth2Client = new OAuth2(
    '221550616731-a8f7vihmac254gsti4a4ahkt60ijftqe.apps.googleusercontent.com',
    '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',
    'https://developers.google.com/oauthplayground'
  );

  oauth2Client.setCredentials({
    refresh_token: '1//04LtZ4fGHRljUCgYIARAAGAQSNwF-L9IrNl7kfaglnsupRWGqDUEd8fDPiS6n7cQxbdNpYzK4ZQ_DY6AT_JZJ1felwxbUS8uFJhM',
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
        refreshToken: '1//04LtZ4fGHRljUCgYIARAAGAQSNwF-L9IrNl7kfaglnsupRWGqDUEd8fDPiS6n7cQxbdNpYzK4ZQ_DY6AT_JZJ1felwxbUS8uFJhM',
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
