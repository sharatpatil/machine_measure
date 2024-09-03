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
        user: 'freedb_ids_msg',
        password: 'B&?C*6tCs*x7j9Z',
        database: 'freedb_IDS_msg' 
    };
    const connection = await mysql.createConnection(config);
    // const connection = await mysql.createConnection({ host, port, user, password });


    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);

    // connect to db
    // const sequelize = new Sequelize(config.database, config.user, config.password, { dialect: 'mysql' });
    const sequelize = new Sequelize('freedb_IDS_msg', 'freedb_ids_msg', 'B&?C*6tCs*x7j9Z', {
        host: 'sql.freedb.tech',
        dialect: 'mysql'
      });

    // init models and add them to the exported db object
    db.User = require('../users/user.model')(sequelize);






    // init models and add them to the exported db object
    db.Device = require('../devices/device.model')(sequelize);

    //init models and add them to the exported db object
    db.Config = require('../config/config.model')(sequelize);

    // sync all models with database
    await sequelize.sync();


}


// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('devices', 'sa', 'sa123', {
//   host: 'LAPTOP-DRN6DAFN\SQLEXPRESS', // Replace with the server name of the remote server
//   dialect: 'mssql',
//   dialectOptions: {
//     encrypt: true, // Use this if you're connecting to a server with a self-signed certificate
//   },
// });

// (async () => {
//   try {
//     await sequelize.authenticate();
//     console.log('Connected to SQL Server');

//     // Perform your database operations here

//     await sequelize.close();
//     console.log('Connection closed');
//   } catch (error) {
//     console.error('Error:', error);
//   }
// })();

