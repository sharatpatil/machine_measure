const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize');
const deviceService = require('./device.service');
const nodemailer = require('nodemailer');
const ExcelJS = require('exceljs');
const qs = require('qs');
const axios = require('axios');
const configService = require('../config/config.service');
const { Op } = require('sequelize');


const fs = require('fs');

const emailTemplate = fs.readFileSync('view/mail_templates/device_created.html', 'utf-8');

const twilio = require('twilio');
const { decodeBase64 } = require('bcryptjs');
const { Parameter } = require('twilio/lib/twiml/VoiceResponse');
const accountSid = 'AC8e77af3cdc4978fb3a3e9ea45f5d2728';
const authToken = 'ba7640d41d11626969548e953b6d106a';
const client = twilio(accountSid, authToken);

// routes
router.post('/', authorize(), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);


// Define the route that triggers the function
router.get('/send_alert', async (req, res) => {
  const part = req.query.part;
  const parameter = req.query.parameter;
  const values = req.query.values;

  if (!part || !parameter || !values) {
    return res.status(400).json({ error: 'Missing required query parameters' });
  }

  try {
    const result = await myTriggeredFunction(part, parameter, values);
    res.json({ message: 'Alert sent successfully', details: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error sending alert' });
  }
});

// Define the function that sends an SMS using 2Factor.in API
async function myTriggeredFunction(part, parameter, values) {
  try {
    const data = qs.stringify({
      'module': 'TRANS_SMS',
      'apikey': '8f9f930b-01f3-11ee-addf-0200cd936042',
      'to': '916364124241',
      'from': 'PQSIVM',
      'msg': `Data Points Outside the Limits. Following are the details
    Part Number: ${part}
    Parameter Name: ${parameter}
    Value: ${values} -PQSI`
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://2factor.in/API/R1/',
      headers: {},
      data: data
    };

    const response = await axios(config);
    console.log(JSON.stringify(response.data));
    return response.data;
  } catch (error) {
    console.error(error);
    throw error; // Re-throw the error to be caught by the caller
  }
}



router.get('/generate-excel', async (req, res) => {
  try {
    const devices = await deviceService.getDevicesCreatedToday();
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

  let hasData = false;

  data.forEach(row => {
    const rowData = [
      row.id || '',
      row.deviceId || '',
      row.deviceNumber1 || '',
      row.indenfier || '',
      row.parameterName1 || '',
      row.parameter1 || '',
      row.parameterName2 || '',
      row.parameter2 || '',
      row.parameterName3 || '',
      row.parameter3 || '',
      row.parameterName4 || '',
      row.parameter4 || '',
      row.parameterName5 || '',
      row.parameter5 || '',
      row.parameterName6 || '',
      row.parameter6 || '',
      row.parameterName7 || '',
      row.parameter7 || '',
      row.parameterName8 || '',
      row.parameter8 || '',
      row.parameterName9 || '',
      row.parameter9 || '',
      row.parameterName10 || '',
      row.parameter10 || '',
      row.createdAt || ''
    ];

    worksheet.addRow(rowData);

    // Check if any row value is present
    if (!hasData && Object.values(row).some(val => val !== null && val !== undefined && val !== '')) {
      hasData = true;
    }
  });

  if (hasData) {
    const headers = [
      'S.No',
      'Device ID',
      'Part Number',
      'Component ID',
      'Parameter Name',
      '1',
      'Parameter Name',
      '2',
      'Parameter Name',
      '3',
      'Parameter Name',
      '4',
      'Parameter Name',
      '5',
      'Parameter Name',
      '6',
      'Parameter Name',
      '7',
      'Parameter Name',
      '8',
      'Parameter Name',
      '9',
      'Parameter Name',
      '10',
      'Date'
    ];

    worksheet.spliceRows(1, 0, headers);
  }

  return workbook.xlsx.writeBuffer();
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
    to: ['sharathkumarpatil06@gmail.com','support@sqcpack.co.in','nandapqsystems@gmail.com','product@pqsi.co.in'],
    subject: 'IDS Data Report',
    text: 'Please find attached today data report',
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
    indenfier:Joi.string(),
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
      parameter10,
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

    let hasExceededLimits = false;

    for (let i = 0; i < parameters.length; i++) {
      const { paramName, paramValue } = parameters[i];

      if(paramValue){
      const { upperLimit, lowerLimit } = await getLimits(i + 1);
      

      
      if (paramValue && (paramValue < lowerLimit || paramValue > upperLimit)) {

        hasExceededLimits = true;

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
          to: ['sharathkumarpatil06@gmail.com','support@sqcpack.co.in','nandapqsystems@gmail.com',' product@pqsi.co.in'],
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

         const phoneNumber = ['+916364124241','+919382740517'];
    const smsMessage = `Data Point Outside the Limits with the following details \n Part Number: ${deviceNumber1} \n Parameter Name: ${paramName} \n Value: ${paramValue}`;


    const smsPromises = phoneNumber.map((phoneNumber) => {
      

      client.messages
      .create({
        body: smsMessage,
        from: '+12187789426',
        to: phoneNumber
      })
      .then((message) => console.log('SMS sent:', message.sid))
      .catch((error) => console.error('SMS error:', error));
    });

    // try {
    //   const result = await myTriggeredFunction(deviceNumber1, paramName, paramValue);
    //   if(result){
    //     console.log('SMS sent:',result);
    //   }
     
    // } catch (error) {
    //   console.error('SMS error:', error);
     
    // }
    
   

      }
    }
  }
   

    res.json({
      device,
      hasExceededLimits // Include the flag in the response
    });
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
