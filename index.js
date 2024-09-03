const { google } = require('googleapis');
const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const errorHandler = require('./_middleware/error-handler');

const credentials = require('./credentials.json');
const fs = require('fs');

const { OAuth2Client } = require('google-auth-library');

const processedEmailsFile = 'processedEmails.json';


// Initialize processed email IDs from the file or create an empty array
let processedEmails = [];

// Load processed email IDs from the file (if the file exists)
try {
    const data = fs.readFileSync(processedEmailsFile, 'utf8');
    processedEmails = JSON.parse(data);
  } catch (err) {
    console.error('Error reading processed emails file:', err);
  }



const { client_id, client_secret, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// const oauth2Client = new OAuth2Client(client_id, client_secret, redirect_uris[0]);

  // Assuming you have stored the access token in a variable
const accessToken = 'ya29.a0AfB_byDmYaYpfwFLc_ZMes11cxU9-WLo2TRLYGLbWa-65-JBygLAE4JF9PdqBQmU3JyiiU6XmaehwqupVnu0LVFYUKWsxqK7Lh8py0uBOsglRj6trpSQmAX3YqgzLiDtE78akWVatx02RUxEtUx5ihavKpNAOcDY-HnfGAaCgYKAT4SARASFQGOcNnCbTbB2OvPc6buQAsbFKso8A0173';


// Set the access token in the OAuth2 client
oAuth2Client.setCredentials({ access_token: accessToken });



// Configure Gmail API
const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });





async function checkForNewEmails() {
    try {
      const senderEmail = 'sharath.kumar@joulestowatts.com';
  
      const res = await gmail.users.messages.list({
        userId: 'me',
        q: `is:unread from:${senderEmail}`,
      });
  
      const messages = res.data.messages;
      if (messages && messages.length > 0) {
        for (const message of messages) {
          const emailId = message.id;
  
          // Check if the email ID is in the processed emails object
          if (!processedEmails[emailId]) {
            // If not processed, mark it as processed and set the count to 1
            processedEmails[emailId] = 1;
            console.log(`New email received with ID: ${emailId}`);
            console.log('SMS API Call for sms')
            // Perform your activity for this email, e.g., mark as read, process, etc.
          } else {
            // If already processed, increment the count
            processedEmails[emailId];
            // console.log(`Email with ID ${emailId} has been received ${processedEmails[emailId]} times.`);
          }
        }
  
        // Save the updated processed emails object to the file
        fs.writeFileSync(processedEmailsFile, JSON.stringify(processedEmails), 'utf8');
      } else {
        console.log(`No new emails from ${senderEmail} found.`);
      }
    } catch (error) {
      console.error('Error checking for new emails:', error);
    }
  }
  
  

// Run the checkForNewEmails function at regular intervals (e.g., every 10 minutes)
const intervalInMilliseconds = 10 * 1000; // 10 seconds
setInterval(checkForNewEmails, intervalInMilliseconds);

// Start your Express app
const port = 3000;
app.use(bodyParser.json());
app.use(cors());
// global error handler
app.use(errorHandler);


app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
