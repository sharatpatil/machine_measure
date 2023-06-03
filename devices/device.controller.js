const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize');
const deviceService = require('./device.service');
const nodemailer = require('nodemailer');


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
      user: 'j2wcampaign@joulestowatts.co',
      pass: 'nwvvrnjxuzgvkxfd'
    }
  });

  
    async function create(req, res, next)  {
    try {
      const device = await deviceService.create(req.body, req.user.id);

      const { parameter1, parameter2, parameter3, parameter4,parameter5, parameter6, parameter7, parameter8, parameter9, parameter10, upperlimit, lowerlimit } = req.body;

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
        // Send email
        const mailOptions = {
          from: 'j2wcampaign@joulestowatts.co',
          to: 'sharath.kumar@joulestowatts.com',
          subject: 'New Device Created',
          text: `A new device has been created. & Crossed limits`
        };
  
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.error(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
      }

   
  
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
