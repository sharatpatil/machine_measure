const db = require('_helpers/db');

module.exports = {
  getAll,
  getById,
  create,
  update,
  delete: _delete,
  findOne
};

async function getAll() {
  return await db.Config.findAll();
}

async function getById(id) {
  return await getConfig(id);
}

async function create(params) {
  await db.Config.create(params);
}

async function update(id, params) {
  const config = await getConfig(id);
  Object.assign(config, params);
  await config.save();
  return config;
}

async function _delete(id) {
  const config = await getConfig(id);
  await config.destroy();
}

async function getConfig(id) {
  const config = await db.Config.findByPk(id);
  if (!config) throw 'Config not found';
  return config;
}

async function findOne(params) {
    console.log(params)
  const config = await db.Config.findOne({ where: params });
  if (!config) throw 'Config not found';
  return config;
}
