const express = require('express');
const session = require('express-session');
const router = express.Router();
const moment = require('moment');
const VerificaLogon = require('../Middleware/VerificaUsuarioLogado');
const Checklists = require('../Models/Checklist');
const Motorista = require('../Models/Motorista');
const Veiculo = require('../Models/Veiculo');
const abastecimentoSegunda = require('../Models/AbastecimentoSegunda');
const abastecimentoSexta = require('../Models/AbastecimentoSexta');
const { where } = require('sequelize');



router.use(session({
  secret: 'cp@Al%B@b$$MXsMSj391AAAAAz',
  resave: false,
  saveUninitialized: true
}));

router.get('/detalhe/:id', VerificaLogon, async (req, res) => {
  try {
    const ChecklistId = req.params.id;
    const checklist = await Checklists.findOne({
      where: {
        id: ChecklistId
      }
    });

    if (!checklist) {
      return res.status(404).send('Checklist não encontrado');
    }

    const idMotorista = checklist.idMotorista;
    const motorista = await Motorista.findOne({
      where: {
        id: idMotorista
      }
    });

    const veiculo = await Veiculo.findOne({
      where: {
        id: checklist.idVeiculo
      }
    });

    let SegundaFeira = await abastecimentoSegunda.findOne({
      where: {
        idChecklist: ChecklistId
      }
    });

    let SextaFeira = await abastecimentoSexta.findOne({
      where: {
        idChecklist: ChecklistId
      }
    });

    // Verificando se SextaFeira ou SegundaFeira estão vazios, caso sim, definindo como um objeto vazio
    if (!SextaFeira) {
      SextaFeira = {};
    }
    if (!SegundaFeira) {
      SegundaFeira = {};
    }
    
    res.render('detalheChecklist', { checklist, motorista, veiculo, SegundaFeira, SextaFeira });

  } catch (error) {

    res.status(500).send('Erro no servidor');
  }
});


module.exports = router;