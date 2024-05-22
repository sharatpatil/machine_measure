const db = require('_helpers/db');
const Device = require('./device.model.js');
const { startOfDay, endOfDay } = require('date-fns');
const Sequelize = require('sequelize');
const moment = require('moment');

const { Op } = Sequelize;

module.exports = {
    create,
    update,
    delete: _delete,
    getAllDevices,
    getDevicesCreatedToday,
    getAllDevicesByField,
    getTop10DevicesByField
};

async function create(deviceParam, userId) {
    // add the UserId to deviceParam object before saving it to database
    deviceParam.UserId = userId;

    // create a new device instance using the Device model and provided deviceParam
    const device = await db.Device.create(deviceParam);
    
    return device.toJSON();
}

async function update(id, deviceParam) {
    const device = await getDeviceById(id);

    // copy deviceParam properties to device
    Object.assign(device, deviceParam);

    // save the updated device to database
    await device.save();

    return device.toJSON();
}

async function _delete(id) {
    const device = await  db.Device.getDeviceById(id);
    await device.destroy();
}

// helper functions

async function getDeviceById(id) {
    const device = await  db.Device.findByPk(id);
    if (!device) throw 'Device not found';
    return device;
}

async function getAllDevices() {
    const devices = await db.Device.findAll();
    return devices;
  }
  

  async function getDevicesCreatedToday() {
    const todayStart = startOfDay(new Date()); // Get the start of the current day
    const todayEnd = endOfDay(new Date()); // Get the end of the current day
  
    const devices = await db.Device.findAll({
      where: {
        created_at: {
          [Op.between]: [todayStart, todayEnd],
        },
      },
    });
  
    return devices;
  }

  async function getAllDevicesByField(fieldName) {
    try {
      // Query the database to get devices based on the specified field
      const devices = await  db.Device.findAll({
        attributes: ['createdAt', fieldName], // Include only createdAt and the specified field
        raw: true, // Return plain JSON objects
      });

      return devices;
    } catch (error) {
      throw error;
    }
  }


  async function getTop10DevicesByField(fieldName) {
    try {
      // Query the database to get the top 10 devices based on the specified field
      const devices = await db.Device.findAll({
        attributes: ['createdAt', fieldName], // Include only createdAt and the specified field
        order: [['createdAt', 'DESC']], // Order by createdAt in descending order
        limit: 10, // Limit the results to 10
        raw: true, // Return plain JSON objects
      });
  
      // Format the createdAt dates
      const formattedDevices = devices.map(device => ({
        ...device,
        createdAt: moment(device.createdAt).format('YYYY-MM-DD'),
      }));
  
      return formattedDevices;
    } catch (error) {
      throw error;
    }
  }