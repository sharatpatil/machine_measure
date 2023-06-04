
const { DataTypes } = require('sequelize');

module.exports = model;

function model(sequelize) {
    const attributes = {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        parameter_name: { type: DataTypes.STRING, allowNull: false },
        upper_limit: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
        lower_limit: { type: DataTypes.DECIMAL(10, 2), allowNull: false },

    };

    const options = {
        defaultScope: {
            // exclude hash by default
            attributes: { exclude: ['hash'] }
        },
        scopes: {
            // include hash with this scope
            withHash: { attributes: {}, }
        }
    };

    return sequelize.define('Config', attributes, options);
}