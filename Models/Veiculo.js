const Sequelize = require("sequelize");
const connection = require("../Database/dbMysql");
const Veiculo = connection.define('veiculo', {

  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  numeroPlaca: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  marcaModelo: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  cor: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  foto1Veiculo: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  foto2Veiculo: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  foto3Veiculo: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  foto4Veiculo: {
    type: Sequelize.STRING,
    allowNull: true,
  }
});

// Veiculo.sync({ force: true });
module.exports = Veiculo;