const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        deviceId: { 
            type: DataTypes.STRING, 
            primaryKey: true,
            defaultValue: () => 'DEV' + (Math.floor(Math.random() * 9000) + 1000).toString() 
        },
        parameterName1: { type: DataTypes.STRING },
        parameterName2: { type: DataTypes.STRING },
        parameterName3: { type: DataTypes.STRING },
        parameterName4: { type: DataTypes.STRING },
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
