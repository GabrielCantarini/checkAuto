const Sequelize = require('sequelize');
// const dbAcesso = new Sequelize('gestaoFrota','root','sucesso',{
const dbAcesso = new Sequelize('gestaoFrota','root','',{
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-04:00'
});
module.exports = dbAcesso;