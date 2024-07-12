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
    refresh_token: '1//04X91d0TPMs-JCgYIARAAGAQSNwF-L9IroWvIAJS0SRZrraYLlbiTxS2z6vQUXjsDHmDCTW85P3VsdFAP0CcvfKzZh7PebZ7JFcI',
  });

  try {
    const accessToken = await new Promise((resolve, reject) => {
      oauth2Client.getAccessToken((err, token) => {
        if (err) {
          console.error('Failed to create access token:', err);
          reject("Failed to create access token :(");
        }
        resolve(token);
      });
    });

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'aarnavsingh836@gmail.com',
        accessToken: 'ya29.a0AXooCgsLsvBtmsj1pVA5MfqvabOzlbGBH3CRLZFvGcee_TNz-5RBa0BAH7mi3MzfAc1RHV4kBTwHZcocrxEMUE2qUDpw3NUjWNZYXEgotxVOQcsSSsEmFiasYz9nqtXGDRpJIfH1Vhi-XvlSMpy17l3_Ee0NeE0zCKQzaCgYKATwSARISFQHGX2MiBCXtS-M6Td4dyHSze4yyBw0171',
        clientId: '960465863169-99bl4c3t83eqdjim6tdvshr2b2huij06.apps.googleusercontent.com',
        clientSecret: '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',
        refreshToken: '1//04X91d0TPMs-JCgYIARAAGAQSNwF-L9IroWvIAJS0SRZrraYLlbiTxS2z6vQUXjsDHmDCTW85P3VsdFAP0CcvfKzZh7PebZ7JFcI',
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