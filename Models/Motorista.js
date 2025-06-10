const Sequelize = require("sequelize");
const connection = require("../Database/dbMysql");
const Motorista = connection.define('motorista', {

  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  nomeCompleto: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  telefone: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  CNH: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  email: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  filial:{
    type: Sequelize.STRING,
    allowNull: true,
  },
  cargo:{
    type: Sequelize.STRING,
    allowNull: true,
  },
  senha: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  CPF: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  fotoPerfil: {
    type: Sequelize.STRING,
    allowNull: true,
  }
});

// Motorista.sync({ force: true });
module.exports = Motorista;