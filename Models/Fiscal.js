const Sequelize = require("sequelize");
const connection = require('../Database/dbMysql');
const Fiscal = connection.define('fiscal', {

  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: true,
    primaryKey: true
  },
  login: {
    type: Sequelize.STRING,
    allowNull: true,
  },  
  senha: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  nomeCompleto: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  fotoPerfil: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  
  desativado:{
    type: Sequelize.BOOLEAN,
    allowNull: true,
  },
  permissao:{
    type: Sequelize.BOOLEAN,
    allowNull: true,
  }
});

// Fiscal.sync({ force: true });
module.exports = Fiscal;