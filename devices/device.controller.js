const express = require('express');
const router = express.Router();
const Joi = require('joi');
const validateRequest = require('_middleware/validate-request');
const authorize = require('_middleware/authorize');
const deviceService = require('./device.service');

// routes
router.post('/', authorize(), createSchema, create);
router.put('/:id', authorize(), updateSchema, update);
router.delete('/:id', authorize(), _delete);

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        deviceName: Joi.string().required(),
        deviceNumber: Joi.string().required(),
        parameterName1: Joi.string(),
        parameterName2: Joi.string(),
        parameterName3: Joi.string(),
        parameterName4: Joi.string(),
        parameter1: Joi.string(),
        parameter2: Joi.string(),
        parameter3: Joi.string(),
        parameter4: Joi.string()
    });
    validateRequest(req, next, schema);
}

async function create(req, res, next) {
    try {
        const device = await deviceService.create(req.body, req.user.id);
        res.json(device);
    } catch (error) {
        next(error);
    }
}

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
