const aws = require('aws-sdk');

let secrets;
if (process.env.NODE_ENV == 'production') {
    secrets = process.env; 
} else {
    secrets = require('./secrets'); 
}

const ses = new aws.SES({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
    region: 'eu-west-1'
});

exports.sendEmail = (recipient, message, subject) => {
    return ses.sendEmail({
        Source: "Andrea Arias <andrea@spiced.academy>",
        Destination: {
            ToAddresses: [recipient]
        },
        Message: {
            Body: {
                Text: {
                    Data: message
                }
            },
            Subject: {
                Data: subject
            }
        }
    })
        .promise()
        .then(() => console.log("it worked!"))
        .catch(err => console.log(err));
};