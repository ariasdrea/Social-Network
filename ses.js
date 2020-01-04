const aws = require('aws-sdk');

let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; // in prod the secrets are environment variables
} else {
    secrets = require('./secrets'); // in dev they are in secrets.json which is listed in .gitignore
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: 'eu-west-1'
});

ses.sendEmail({
    Source: "Andrea Arias <andrea@spiced.academy>",
    Destination: {
        ToAddresses: ["ariasdrea@gmail.com"]
    },
    Message: {
        Body: {
            Text: {
                Data: "Hi, this is test"
            }
        },
        Subject: {
            Data: "Ses email testing"
        }
    }
})
    .promise()
    .then(() => console.log("it worked!"))
    .catch(err => console.log(err));