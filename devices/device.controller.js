const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize');
const deviceService = require('./device.service');
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');

const configService = require('../config/config.service');
const { Op } = require('sequelize');


const fs = require('fs');

const emailTemplate = fs.readFileSync('view/mail_templates/device_created.html', 'utf-8');

const twilio = require('twilio');
const { decodeBase64 } = require('bcryptjs');
const accountSid = 'ACe24509a394076def91e05141acf4dd71';
const authToken = 'f2f4b25020cbd10a6b5cdaf1176f8985';
const client = twilio(accountSid, authToken);

// routes
router.post('/', authorize(), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

// Define the API endpoint
// router.get('/generate-excel', async (req, res) => {
//   try {
//     const devices = await deviceService.getAllDevices();
//     const excelFilePath = await generateExcel(devices);
//     sendEmailWithAttachment(excelFilePath);
//     res.send('Email sent with Excel attachment.');
//   } catch (error) {
//     console.log('Error:', error);
//     res.status(500).json({ error: 'Failed to generate and send email' });
//   }
// });

router.get('/generate-excel', async (req, res) => {
  try {
    const devices = await deviceService.getAllDevices();
    const excelBuffer = await generateExcel(devices);
    sendEmailWithAttachment(excelBuffer);
    res.send('Email sent with Excel attachment.');
  } catch (error) {
    console.log('Error:', error);
    res.status(500).json({ error: 'Failed to fetch data from the database' });
  }
});

module.exports = router;



async function generateExcel(data) {
  const ExcelJS = require('exceljs');
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Device Data');

  const headers = [
    'ID',
    'Device ID',
    'Device Number 1',
    'Device Number 2',
    'Device Number 3',
    'Device Number 4',
    'Parameter Name 1',
    'Parameter Name 2',
    'Parameter Name 3',
    'Parameter Name 4',
    'Parameter Name 5',
    'Parameter Name 6',
    'Parameter Name 7',
    'Parameter Name 8',
    'Parameter Name 9',
    'Parameter Name 10',
    'Device Name',
    'Parameter 1',
    'Parameter 2',
    'Parameter 3',
    'Parameter 4',
    'Parameter 5',
    'Parameter 6',
    'Parameter 7',
    'Parameter 8',
    'Parameter 9',
    'Parameter 10',
    'User ID',
    'Created At',
    'Updated At'
  ];

  worksheet.addRow(headers);

  data.forEach(row => {
    const rowData = [
      row.id,
      row.deviceId,
      row.deviceNumber1,
      row.deviceNumber2,
      row.deviceNumber3,
      row.deviceNumber4,
      row.parameterName1,
      row.parameterName2,
      row.parameterName3,
      row.parameterName4,
      row.parameterName5,
      row.parameterName6,
      row.parameterName7,
      row.parameterName8,
      row.parameterName9,
      row.parameterName10,
      row.deviceName,
      row.parameter1,
      row.parameter2,
      row.parameter3,
      row.parameter4,
      row.parameter5,
      row.parameter6,
      row.parameter7,
      row.parameter8,
      row.parameter9,
      row.parameter10,
      row.UserId,
      row.createdAt,
      row.updatedAt
    ];

    console.log(row);

    worksheet.addRow(rowData);
  });

  const excelBuffer = await workbook.xlsx.writeBuffer();
  return excelBuffer;
}



function sendEmailWithAttachment(excelBuffer) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'sqcpack.co.in@gmail.com',
      pass: 'sxiyujgfvijcwdrv'
    }
  });

  const mailOptions = {
    from: 'sqcpack.co.in@gmail.com',
    to: 'sharathkumarpatil06@gmail.com',
    subject: 'Excel Attachment',
    text: 'Please find attached the Excel file.',
    attachments: [
      {
        filename: 'generated.xlsx',
        content: excelBuffer
      }
    ]
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
}


function createSchema(req, res, next) {
  const schema = Joi.object({
    deviceName: Joi.string(),
    deviceNumber1: Joi.string(),
    deviceNumber2: Joi.string(),
    deviceNumber3: Joi.string(),
    deviceNumber4: Joi.string(),
    parameterName1: Joi.string(),
    parameterName2: Joi.string(),
    parameterName3: Joi.string(),
    parameterName4: Joi.string(),
    parameterName5: Joi.string(),
    parameterName6: Joi.string(),
    parameterName7: Joi.string(),
    parameterName8: Joi.string(),
    parameterName9: Joi.string(),
    parameterName10: Joi.string(),
    parameter1: Joi.string(),
    parameter2: Joi.string(),
    parameter3: Joi.string(),
    parameter4: Joi.string(),
    parameter5: Joi.string(),
    parameter6: Joi.string(),
    parameter7: Joi.string(),
    parameter8: Joi.string(),
    parameter9: Joi.string(),
    parameter10: Joi.string(),
    lowerlimit: Joi.number(),
    upperlimit: Joi.number()
  });
  validateRequest(req, next, schema);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'sqcpack.co.in@gmail.com',
    pass: 'sxiyujgfvijcwdrv'
  }
});

// Function to retrieve upper limit and lower limit for a given parameter name
async function getLimits(id) {
  const config = await configService.getById(id);
  if (!config) {
    throw new Error(`Config not found for parameter: ${parameterName}`);
  }
  return {
    upperLimit: config.upper_limit,
    lowerLimit: config.lower_limit
  };
}


async function create(req, res, next) {
  try {
    const device = await deviceService.create(req.body, req.user.id);

    const {
      deviceNumber1,
      deviceNumber2,
      deviceNumber3,
      deviceNumber4,
      parameterName1,
      parameterName2,
      parameterName3,
      parameterName4,
      parameterName5,
      parameterName6,
      parameterName7,
      parameterName8,
      parameterName9,
      parameterName10,
      parameter1,
      parameter2,
      parameter3,
      parameter4,
      parameter5,
      parameter6,
      parameter7,
      parameter8,
      parameter9,
      parameter10
    } = req.body;

    const parameters = [
      { paramName: parameterName1, paramValue: parseFloat(parameter1) },
      { paramName: parameterName2, paramValue: parseFloat(parameter2) },
      { paramName: parameterName3, paramValue: parseFloat(parameter3) },
      { paramName: parameterName4, paramValue: parseFloat(parameter4) },
      { paramName: parameterName5, paramValue: parseFloat(parameter5) },
      { paramName: parameterName6, paramValue: parseFloat(parameter6) },
      { paramName: parameterName7, paramValue: parseFloat(parameter7) },
      { paramName: parameterName8, paramValue: parseFloat(parameter8) },
      { paramName: parameterName9, paramValue: parseFloat(parameter9) },
      { paramName: parameterName10, paramValue: parseFloat(parameter10) }
    ];

    for (let i = 0; i < parameters.length; i++) {
      const { paramName, paramValue } = parameters[i];

      if(paramValue){
      const { upperLimit, lowerLimit } = await getLimits(i + 1);
      

      
      if (paramValue && (paramValue < lowerLimit || paramValue > upperLimit)) {
        console.log(paramValue, upperLimit, lowerLimit)

        const emailBody = emailTemplate
          .replace('{{deviceNumber1}}', deviceNumber1 || '')
          .replace('{{deviceNumber2}}', deviceNumber2 || '')
          .replace('{{deviceNumber3}}', deviceNumber3 || '')
          .replace('{{deviceNumber4}}', deviceNumber4 || '')
          .replace('{{paramName}}', paramName || '')
          .replace('{{paramValue}}', paramValue || '');

        const mailOptions = {
          from: 'sqcpack.co.in@gmail.com',
          to: ['sharathkumarpatil06@gmail.com','support@sqcpack.co.in','nandapqsystems@gmail.com'],
          subject: 'Alert: Data Point Outside the Limits',
          html: emailBody
        };

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });

         const phoneNumber = ['+919382740517','+916364124241', '+918754428811'];
    const smsMessage = `Data Point Outside the Limits with the following details \n Part Number: ${deviceNumber1} \n Parameter Name: ${paramName} \n Value: ${paramValue}`;

    // client.messages
    //   .create({
    //     body: smsMessage,
    //     from: '+13612669261',
    //     to: phoneNumber
    //   })
    //   .then((message) => console.log('SMS sent:', message.sid))
    //   .catch((error) => console.error('SMS error:', error));

    const smsPromises = phoneNumber.map((phoneNumber) => {
      

      client.messages
      .create({
        body: smsMessage,
        from: '+13612669261',
        to: phoneNumber
      })
      .then((message) => console.log('SMS sent:', message.sid))
      .catch((error) => console.error('SMS error:', error));
    });
    
   

      }
    }
  }
   

    res.json(device);
  } catch (error) {
    next(error);
  }
}



// async function create(req, res, next) {
//     try {
//         const device = await deviceService.create(req.body, req.user.id);
//         res.json(device);
//     } catch (error) {
//         next(error);
//     }
// }

function updateSchema(req, res, next) {
  const schema = Joi.object({
    deviceName: Joi.string().empty(''),
    parameter1: Joi.string().empty(''),
    parameter2: Joi.string().empty(''),
    parameter3: Joi.string().empty(''),
    parameter4: Joi.string().empty('')
  });
  validateRequest(req, next, schema);
}

async function update(req, res, next) {
  try {
    const device = await deviceService.update(req.params.id, req.body);
    res.json(device);
  } catch (error) {
    next(error);
  }
}

async function _delete(req, res, next) {
  try {
    await deviceService.delete(req.params.id);
    res.json({ message: 'Device deleted successfully' });
  } catch (error) {
    next(error);
  }
}
