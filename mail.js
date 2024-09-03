const Imap = require('imap');
const { simpleParser } = require('mailparser');

// Create an IMAP connection
const imap = new Imap({
  user: 'sqcpack.in@outlook.com',
  password: 'sqcpack.in@outlook.com',
  host: 'outlook.office365.com', // IMAP server address
  port: 993, // IMAP port (usually 993 for secure IMAP)
  tls: true, // Use TLS for secure connection
});

// Function to handle new email arrivals
function handleNewEmail(message) {
  console.log('New email received:');
  console.log('From:', message.from.text);
  console.log('Subject:', message.subject);
  console.log('Date:', message.date);
  // You can perform your desired actions on the email here
}

// Connect to the IMAP server
imap.connect();

imap.once('ready', () => {
  // Open the inbox
  imap.openBox('INBOX', false, (err, mailbox) => {
    if (err) throw err;

    // Search for unseen emails
    imap.search(['UNSEEN'], (searchErr, results) => {
      if (searchErr) throw searchErr;

      // Fetch unseen emails
      const fetch = imap.fetch(results, { bodies: '', markSeen: true });
      fetch.on('message', (msg) => {
        msg.on('body', (stream) => {
          simpleParser(stream, (parseErr, message) => {
            if (parseErr) throw parseErr;
            handleNewEmail(message);
          });
        });
      });

      fetch.once('end', () => {
        console.log('No more new emails.');
        imap.end(); // Close the IMAP connection
      });
    });
  });
});

imap.once('error', (err) => {
  console.error('IMAP error:', err);
});

// Start listening for incoming emails
imap.on('mail', () => {
  console.log('New email received.');
});
