const db = require('_helpers/db');
const Device = require('./device.model.js');
const { startOfDay, endOfDay } = require('date-fns');

module.exports = {
    create,
    update,
    delete: _delete,
    getAllDevices,
    getDevicesCreatedToday
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
  
    const devices = await Device.find({
      createdAt: {
        $gte: todayStart,
        $lte: todayEnd
      }
    });
  
    return devices;
  }
  