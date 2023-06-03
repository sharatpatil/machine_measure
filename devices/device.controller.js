const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize');
const deviceService = require('./device.service');
const nodemailer = require('nodemailer');

const fs = require('fs');

const emailTemplate = fs.readFileSync('view/mail_templates/device_created.html', 'utf-8');

const twilio = require('twilio');
const accountSid = 'ACe24509a394076def91e05141acf4dd71';
const authToken = 'ac550a7c944dcda6aff7501d12be8da0';
const client = twilio(accountSid, authToken);

// routes
router.post('/', authorize(), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

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

  
    async function create(req, res, next)  {
    try {
      const device = await deviceService.create(req.body, req.user.id);

      const { deviceNumber1,deviceNumber2,deviceNumber3,deviceNumber4,parameter1, parameter2, parameter3, parameter4,parameter5, parameter6, parameter7, parameter8, parameter9, parameter10, upperlimit, lowerlimit } = req.body;

      // Check conditions for sending email

      console.log("lowerlimit",req.body)
      console.log("upperlimit",upperlimit)
      if (
        (parameter1 <= lowerlimit || parameter1 >= upperlimit) ||
        (parameter2 <= lowerlimit || parameter2 >= upperlimit) ||
        (parameter3 <= lowerlimit || parameter3 >= upperlimit) ||
        (parameter4 <= lowerlimit || parameter4 >= upperlimit) ||
        (parameter5 <= lowerlimit || parameter5 >= upperlimit) ||
        (parameter6 <= lowerlimit || parameter6 >= upperlimit) ||
        (parameter7 <= lowerlimit || parameter7 >= upperlimit) ||
        (parameter8 <= lowerlimit || parameter8 >= upperlimit) ||
        (parameter9 <= lowerlimit || parameter9 >= upperlimit) ||
        (parameter10 <= lowerlimit || parameter10 >= upperlimit)
      ) {

            // Generate email body from template
      const emailBody = emailTemplate
      .replace('{{deviceNumber1}}', deviceNumber1) 
      .replace('{{deviceNumber2}}', deviceNumber2) 
      .replace('{{deviceNumber3}}', deviceNumber3) 
      .replace('{{deviceNumber4}}', deviceNumber4) 
      .replace('{{parameter1}}', parameter1)
      .replace('{{parameter2}}', parameter2)
      .replace('{{parameter3}}', parameter3)
      .replace('{{parameter4}}', parameter4)
      .replace('{{parameter5}}', parameter5)
      .replace('{{parameter6}}', parameter6)
      .replace('{{parameter7}}', parameter7)
      .replace('{{parameter8}}', parameter8)
      .replace('{{parameter9}}', parameter9)
      .replace('{{parameter10}}', parameter10)
      .replace('{{lowerlimit}}', lowerlimit)
      .replace('{{upperlimit}}', upperlimit);

        // Send email
        const mailOptions = {
          from: 'j2wcampaign@joulestowatts.co',
          to: 'sharath.kumar@joulestowatts.com',
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
      }


      // Send SMS notification
    const phoneNumber =  ['+916364124241', '+918754428811'];// Replace with the recipient's phone number
    const smsMessage = 'A new device has been created with Outside limit.'; // Replace with your SMS content

    client.messages.create({
      body: smsMessage,
      from: '+13612669261', // Replace with your Twilio phone number
      to: phoneNumber
    })
    .then(message => console.log('SMS sent:', message.sid))
    .catch(error => console.error('SMS error:', error));

   
  
      res.json(device);
    } catch (error) {
      next(error);
    }
  };
  

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
