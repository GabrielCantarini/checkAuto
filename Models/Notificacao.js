const Sequelize = require("sequelize");
const connection = require("../Database/dbMysql");
const Notificacao = connection.define('notificacao', {

  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  titulo: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  descricao: {
    type: Sequelize.TEXT,
    allowNull: true,
  }
});

// Notificacao.sync({ force: true });
module.exports = Notificacao;