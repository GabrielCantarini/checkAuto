const express = require('express');
const session = require('express-session');
const router = express.Router();
const moment = require('moment');
const { Op } = require('sequelize');
const Checklist = require('../Models/Checklist');
const Motorista = require('../Models/Motorista');
const VerificaUsuarioLogado = require('../Middleware/VerificaUsuarioLogado');

router.use(session({
  secret: 'cp@Al%B@b$$MXsMSj391AAAAAz',
  resave: false,
  saveUninitialized: true
}));

router.get('/date', VerificaUsuarioLogado, async (req, res) => {

  try {

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');

    const data = req.query.date;
    

    if (!data) {
      const data = moment().day(5).format('YYYY-MM-DD');
      
      return res.redirect(`/date?date=${data}`)
    }

    const friday = moment(data, 'YYYY-MM-DD').format('YYYY-MM-DD');
    const saturday = moment(friday, 'YYYY-MM-DD').add(1, 'days').format('YYYY-MM-DD');
    const monday = moment(friday, 'YYYY-MM-DD').add(3, 'days').format('YYYY-MM-DD');


    const motoristas = await Motorista.findAll({
      attributes: ['id', 'nomeCompleto', 'telefone', 'CNH', 'email', 'CPF', 'cargo', 'filial'],
    });


    const checklists = await Checklist.findAll({       
      where: {
        [Op.or]: [
          {
            friday: {
              [Op.between]: [
                moment(friday).endOf('day').toDate(),
                moment(monday).startOf('day').toDate(),
              ]
            }
          },  
          {
            saturday: {
              [Op.between]: [
                moment(saturday).endOf('day').toDate(),
                moment(monday).startOf('day').toDate(),
              ]
            }
          },       
          {
            monday: {
              [Op.between]: [
                moment(friday).endOf('day').toDate(),
                moment(monday).startOf('day').toDate(),
              ]
            }
          }
        ]
      },
      include: [
        {
          model: Motorista,
          as: 'motorista',
          attributes: ['id', 'nomeCompleto', 'telefone', 'CNH', 'email', 'CPF', 'filial', 'cargo'],
        }
      ],
      attributes: ['id', 'friday', 'fridayStatus', 'mondayStatus', 'monday','saturday', 'saturdayStatus'],
    });
    
   


    const checklistsMap = checklists.reduce((acc, checklist) => {
      acc[checklist.motorista?.id] = {
        idAgendamento: checklist.id,
        fridayStatus: checklist.fridayStatus,
        saturdayStatus: checklist.saturdayStatus,
        mondayStatus: checklist.mondayStatus,
      };
      return acc;
    }, {});


    const listaMotoristas = motoristas.map(motorista => ({
      idMotorista: motorista.id,
      nomeCompleto: motorista.nomeCompleto,
      email: motorista.email || 'Não informado',
      telefone: motorista.telefone || 'Não informado',
      fridayStatus: checklistsMap[motorista.id]?.fridayStatus || null,
      saturdayStatus: checklistsMap[motorista.id]?.saturdayStatus || null,
      mondayStatus: checklistsMap[motorista.id]?.mondayStatus || null,
      idAgendamento: checklistsMap[motorista.id]?.idAgendamento || null,
      cargo: motorista.cargo || 'Não informado', 
      filial: motorista.filial || 'Não informado',
    }));

    return res.render('fiscal', { checklists: listaMotoristas, friday, monday, saturday,message: null });

  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: 'Erro interno do servidor' });

  }
});


module.exports = router;
