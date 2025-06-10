const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const porta = 5000;
const path = require('path');
const dbConfig = require('./Database/dbMysql');

const LoginController = require('./Controllers/LoginController');
const FiscalController = require('./Controllers/FiscalControlller');

const DetalheController = require('./Controllers/DetalheChecklistController');
const EditarController = require('./Controllers/CriarChecklistController');
const Motorista = require('./Models/Motorista');
const Veiculo = require('./Models/Veiculo');
const AbastecimentoSegunda = require('./Models/AbastecimentoSegunda');
const AbastecimentoSexta = require('./Models/AbastecimentoSexta');
const Notificacao = require('./Models/Notificacao');
const CadastroMotorista = require('./Controllers/CadastroMotoristaController');
const Checklist = require('./Models/Checklist');


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.set('views', path.join(__dirname, '/views'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", LoginController);
app.use("/", FiscalController);
app.use("/", DetalheController);
app.use("/", EditarController);
app.use("/", CadastroMotorista);

Motorista.hasMany(Veiculo, { foreignKey: 'idMotorista' });
Veiculo.belongsTo(Motorista, { foreignKey: 'idMotorista' });

Motorista.hasMany(AbastecimentoSegunda, { foreignKey: 'idMotorista' });
AbastecimentoSegunda.belongsTo(Motorista, { foreignKey: 'idMotorista' });

Motorista.hasMany(AbastecimentoSexta, { foreignKey: 'idMotorista' });
AbastecimentoSexta.belongsTo(Motorista, { foreignKey: 'idMotorista' });

Veiculo.hasMany(Checklist, { foreignKey: 'idVeiculo' });
Checklist.belongsTo(Veiculo, { foreignKey: 'idVeiculo' });

Veiculo.hasMany(AbastecimentoSexta, { foreignKey: 'idVeiculo' });
AbastecimentoSexta.belongsTo(Veiculo, { foreignKey: 'idVeiculo' });

Veiculo.hasMany(AbastecimentoSegunda, { foreignKey: 'idVeiculo' });
AbastecimentoSegunda.belongsTo(Veiculo, { foreignKey: 'idVeiculo' });

Motorista.hasMany(Notificacao, { foreignKey: 'idMotorista' });
Notificacao.belongsTo(Motorista, { foreignKey: 'idMotorista' });

Motorista.hasMany(Checklist, { foreignKey: 'idMotorista', as: 'checklists' });
Checklist.belongsTo(Motorista, { foreignKey: 'idMotorista', as: 'motorista' });


Checklist.hasMany(AbastecimentoSexta, { foreignKey: 'idChecklist' });
AbastecimentoSexta.belongsTo(Checklist, { foreignKey: 'idChecklist' });

Checklist.hasMany(AbastecimentoSegunda, { foreignKey: 'idChecklist' });
AbastecimentoSegunda.belongsTo(Checklist, { foreignKey: 'idChecklist' });



// const syncModels = async () => {
//   try {

//     await dbConfig.authenticate();
//    await dbConfig.sync({ force: true });

//     console.log('Modelos sincronizados com o banco de dados.');
//    } catch (error) {
//     console.error('Erro ao sincronizar modelos:', error);
//   }
//  };
//  syncModels();


app.listen(porta, () => {
  console.log('Servidor Online, porta =>' + porta);
});