const config = require('config.json');
const mysql = require('mysql2/promise');
const { Sequelize } = require('sequelize');

module.exports = db = {};

initialize();

async function initialize() {
    // create db if it doesn't already exist
    // const { host, port, user, password, database } = config.database;

    // console.log(port,host,user,password,database)

    const config = {
        host: 'sql.freedb.tech',
        user: 'freedb_machine_measure',
        password: '3mX*ANS5rvb57sr',
        database: 'freedb_machine_measure'
    };
    const connection = await mysql.createConnection(config);
    // const connection = await mysql.createConnection({ host, port, user, password });


    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);

    // connect to db
    // const sequelize = new Sequelize(config.database, config.user, config.password, { dialect: 'mysql' });
    const sequelize = new Sequelize('freedb_machine_measure', 'freedb_machine_measure', '3mX*ANS5rvb57sr', {
        host: 'sql.freedb.tech',
        dialect: 'mysql'
      });

    // init models and add them to the exported db object
    db.User = require('../users/user.model')(sequelize);






    // init models and add them to the exported db object
    db.Device = require('../devices/device.model')(sequelize);

    // sync all models with database
    await sequelize.sync();


}

