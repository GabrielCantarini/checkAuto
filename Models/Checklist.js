const Sequelize = require("sequelize");
const connection = require('../Database/dbMysql');
const Checklist = connection.define('checklist', {

    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: true,
        primaryKey: true
    },
    friday: {
        type: Sequelize.DATEONLY,
        allowNull: true,
    },
    saturday: {
        type: Sequelize.DATEONLY,
        allowNull: true
    },
    saturdayStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    fridayStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },
    monday: {
        type: Sequelize.DATEONLY,
        allowNull: true,
    },
    mondayStatus: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
    },

});

// Checklist.sync({ force: true });
module.exports = Checklist;