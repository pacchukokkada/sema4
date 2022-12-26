/* eslint-disable max-len */
const Sib = require('sib-api-v3-sdk');

const client = Sib.ApiClient.instance;

const apiKey = client.authentications['api-key'];
apiKey.apiKey = "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";

const sender = {
  email: 'semaphore2023@gmail.com',
  name: 'Semaphore - 2023',
};
const sendInBlue = (userMail, Tname) => {
  const transactionalEmailApi = new Sib.TransactionalEmailsApi();
  transactionalEmailApi
      .sendTransacEmail({
        subject: 'Semaphore registration confirmation',
        sender,
        to: [
          {
            email: userMail,
          },
        ],
        textContent: 'Semaphore - 2023',
        htmlContent: `<img src="https://lever-client-logos.s3.amazonaws.com/b0677256-76d9-4ff1-a407-ab7b583b77a7-1500059030984.png" width:100%><span style=font-weight:bold;color:#F27970;font-size:45px>Congratulations!</span><span style=font-weight:bold;color:#4E54A4;font-size:45px> You have successfully registered for Semaphore</span><br><span style=font-weight:bold;font-size:30px>Team name: ${Tname}</span><h2 style=color:#44B5AC>A follow up email will be sent once the payment is successful.</h2><h2 style=color:#A563A4>Regards,<br> Team Semaphore - 2023</h2><h1>For any queries please contact:</h1><h2>Joel Joseph: 9008775785</h2><h2>Shravya: 8277503412</h2>`,
        params: {
          role: 'frontend',
        },
      })
      .then(console.log)
      .catch(console.log);
};


module.exports = {sendInBlue};
