const Sequelize = require("sequelize");
const connection = require('../Database/dbMysql');
const AbastecimentoSegunda = connection.define('abastecimentoSegunda', {

  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  valorTotal: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  kilometragem: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  numeroNotaFiscal: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  fotoNotaFiscal: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  fotoNivelCombustivel: {
    type: Sequelize.STRING,
    allowNull: true,
  }
});

// Abastecimento.sync({ force: true });
module.exports = AbastecimentoSegunda;