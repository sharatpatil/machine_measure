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
        deviceNumber1:{type:DataTypes.STRING},
        deviceNumber2:{type:DataTypes.STRING},
        deviceNumber3:{type:DataTypes.STRING},
        deviceNumber4:{type:DataTypes.STRING},
        parameterName1: { type: DataTypes.STRING },
        parameterName2: { type: DataTypes.STRING },
        parameterName3: { type: DataTypes.STRING },
        parameterName4: { type: DataTypes.STRING },
        parameterName5: { type: DataTypes.STRING },
        parameterName6: { type: DataTypes.STRING },
        parameterName7: { type: DataTypes.STRING },
        parameterName8: { type: DataTypes.STRING },
        parameterName9: { type: DataTypes.STRING },
        parameterName10: { type: DataTypes.STRING },
        deviceName: { type: DataTypes.STRING, allowNull: false },
        parameter1: { type: DataTypes.STRING },
        parameter2: { type: DataTypes.STRING },
        parameter3: { type: DataTypes.STRING },
        parameter4: { type: DataTypes.STRING },
        parameter5: { type: DataTypes.STRING },
        parameter6: { type: DataTypes.STRING },
        parameter7: { type: DataTypes.STRING },
        parameter8: { type: DataTypes.STRING },
        parameter9: { type: DataTypes.STRING },
        parameter10: { type: DataTypes.STRING },
        indenfier: { type: DataTypes.STRING },
        UserId: { type: DataTypes.INTEGER, allowNull: false }

    };

    const options = {
        timestamps: true,
        underscored: true,
        paranoid: true
    };

    return sequelize.define('Device', attributes, options);
}
