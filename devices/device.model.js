const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        deviceId: { 
            type: DataTypes.STRING, 
            primaryKey: true,
            defaultValue: () => 'DEV' + (Math.floor(Math.random() * 9000) + 1000).toString() 
        },
        deviceName: { type: DataTypes.STRING, allowNull: false },
        parameter1: { type: DataTypes.STRING },
        parameter2: { type: DataTypes.STRING },
        parameter3: { type: DataTypes.STRING },
        parameter4: { type: DataTypes.STRING },
        UserId: { type: DataTypes.INTEGER, allowNull: false }

    };

    const options = {
        timestamps: true,
        underscored: true,
        paranoid: true
    };

    return sequelize.define('Device', attributes, options);
}
