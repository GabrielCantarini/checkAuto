const express = require('express');
const session = require('express-session');
const { Op } = require('sequelize');
const router = express.Router();
const sharp = require('sharp');
const moment = require('moment');
const Veiculo = require('../Models/Veiculo');
const Fiscal = require('../Models/Fiscal');
const Motorista = require('../Models/Motorista');
const AbastecimentoSexta = require('../Models/AbastecimentoSexta');
const AbastecimentoSegunda = require('../Models/AbastecimentoSegunda');
const Checklist = require('../Models/Checklist');

const VerificaSessao = require('../Middleware/VerificaUsuarioLogadoMotorista');

const fs = require('fs');
const multer = require('multer');
const path = require('path');


router.use(session({
  secret: 'cp@Al%B@b$$MXsMSj391AAAAAz',
  resave: false,
  saveUninitialized: true
}));

router.use('public/img/uploads/motorista', VerificaSessao, express.static(path.join(__dirname, 'motorista')));
sharp.cache(false);


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/uploads/motorista');
  },
  filename: function (req, file, cb) {

    cb(null, Date.now() + path.extname(file.originalname));
  }
});



const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const fileTypes = /\.(jpeg|jpg|png)$/i;
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png'];

    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedMimeTypes.includes(file.mimetype);

    if (extname && mimetype) {
      return cb(null, true);
    } else {
      cb('Erro: Apenas imagens são permitidas!');
    }
  }
});

router.get('/logout', (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) {
        return res.render('painel', { message: { error: 'Erro ao encerrar a sessão' }, daysOfWeek: [], eventsByDay: [] });
      }
      res.redirect('/user');
    });
  } catch (error) {
    console.error('Erro inesperado no logout:', error);
    res.redirect('/');
  }
});


router.post('/uploadChecklistSex', VerificaSessao, upload.single('imagem'), async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');

    const { dataAbastecimento, km, valor, veiculo: numeroPlaca } = req.body;
    const motoristaId = req.session.usuario.id;

    function deletaImage() {
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, err => { if (err) console.error('Erro ao deletar imagem:', err); });
      }
    }

    const veiculos = await Veiculo.findAll({
      where: { idMotorista: motoristaId },
      attributes: ['marcaModelo', 'numeroPlaca']
    });
    const mapVeiculos = veiculos.map(item => ({
      marcaModelo: item.marcaModelo,
      numeroPlaca: item.numeroPlaca
    }));

    if (!dataAbastecimento || !km || !valor || !numeroPlaca) {
      deletaImage();
      return res.render('criarChecklistSexta', {
        message: { type: 'warning', title: 'Erro!', text: 'Todos os campos são obrigatórios.' },
        veiculos: mapVeiculos
      });
    }

    const dataMoment = moment(dataAbastecimento, 'YYYY-MM-DD');
    const diaSemana = dataMoment.isoWeekday();

    if (diaSemana !== 5 && diaSemana !== 6) {
      deletaImage();
      return res.render('criarChecklistSexta', {
        message: { type: 'error', title: 'Erro!', text: 'A data informada não é válida (somente sexta ou sábado).' },
        veiculos: mapVeiculos
      });
    }

    const dataFormatada = dataMoment.format('YYYY-MM-DD');
    const correspondingMonday = (diaSemana === 5)
      ? dataMoment.clone().add(3, 'days').format('YYYY-MM-DD')
      : dataMoment.clone().add(2, 'days').format('YYYY-MM-DD');


    const motorista = await Motorista.findOne({ where: { id: motoristaId } });
    const veiculo = await Veiculo.findOne({ where: { numeroPlaca } });

    if (!motorista || !veiculo) {
      deletaImage();
      return res.render('criarChecklistSexta', {
        message: { type: 'error', title: 'Erro!', text: 'Motorista ou veículo não encontrado.' },
        veiculos: mapVeiculos
      });
    }

    if (!req.file || !req.file.filename) {
      deletaImage();
      return res.render('criarChecklistSexta', {
        message: { type: 'error', title: 'Erro!', text: 'Imagem é obrigatória.' },
        veiculos: mapVeiculos
      });
    }

    let checklistRecord = await Checklist.findOne({
      where: {
        idMotorista: motorista.id,
        monday: correspondingMonday
      }
    });


    if (checklistRecord) {
      if (checklistRecord.friday && diaSemana === 6) {
        deletaImage();
        return res.render('criarChecklistSexta', {
          message: {
            type: 'warning',
            title: 'Aviso!',
            text: `Já existe checklist cadastrado nesta semana na sexta-feira (${moment(checklistRecord.friday).format('DD/MM/YYYY')}).`
          },
          veiculos: mapVeiculos
        });
      }

      if (checklistRecord.saturday && diaSemana === 5) {
        deletaImage();
        return res.render('criarChecklistSexta', {
          message: {
            type: 'warning',
            title: 'Aviso!',
            text: `Já existe checklist cadastrado nesta semana no sábado (${moment(checklistRecord.saturday).format('DD/MM/YYYY')}).`
          },
          veiculos: mapVeiculos
        });
      }

      // Se tentar cadastrar o mesmo dia de novo (duplicado)
      if ((diaSemana === 5 && checklistRecord.friday) || (diaSemana === 6 && checklistRecord.saturday)) {
        deletaImage();
        return res.render('criarChecklistSexta', {
          message: {
            type: 'warning',
            title: 'Aviso!',
            text: `Checklist já cadastrado para esse dia (${dataFormatada}).`
          },
          veiculos: mapVeiculos
        });
      }
    }

    const dataAtual = moment().format('DD-MM-YYYY');
    const outputPath = `public/img/uploads/motorista/checklist-${dataAtual}-${req.file.filename}`;
    const outPathBD = '../' + outputPath.slice(7);

    sharp.cache(false);
    await sharp(req.file.path)
      .jpeg({ quality: 20 })
      .toFile(outputPath);
    fs.unlink(req.file.path, err => { if (err) console.error('Erro ao deletar imagem:', err); });

    if (checklistRecord) {
      if (diaSemana === 5) {
        checklistRecord.friday = dataFormatada;
        checklistRecord.fridayStatus = true;
      } else {
        checklistRecord.saturday = dataFormatada;
        checklistRecord.saturdayStatus = true;
      }
      await checklistRecord.save();
    } else {
      const novoChecklist = {
        idMotorista: motorista.id,
        idVeiculo: veiculo.id
      };
      if (diaSemana === 5) {
        novoChecklist.friday = dataFormatada;
        novoChecklist.fridayStatus = true;
        novoChecklist.monday = correspondingMonday;
      } else {
        novoChecklist.saturday = dataFormatada;
        novoChecklist.saturdayStatus = true;
        novoChecklist.monday = correspondingMonday;
      }
      checklistRecord = await Checklist.create(novoChecklist);
    }

    await AbastecimentoSexta.create({
      valorTotal: valor,
      kilometragem: km,
      fotoNivelCombustivel: outPathBD,
      idVeiculo: veiculo.id,
      idMotorista: motorista.id,
      idChecklist: checklistRecord.id
    });

    return res.render('data', {
      message: { type: 'success', title: 'Sucesso!', text: 'Checklist cadastrado com sucesso!' }
    });

  } catch (err) {
    console.error(err);
    if (req.file && req.file.path) {
      fs.unlink(req.file.path, () => { });
    }
    const veiculos = await Veiculo.findAll({
      where: { idMotorista: req.session.usuario.id },
      attributes: ['marcaModelo', 'numeroPlaca']
    });
    const mapVeiculos = veiculos.map(item => ({
      marcaModelo: item.marcaModelo,
      numeroPlaca: item.numeroPlaca
    }));
    return res.render('criarChecklistSexta', {
      message: { type: 'error', title: 'Erro!', text: 'Erro ao salvar checklist.' },
      veiculos: mapVeiculos
    });
  }
});


router.post('/uploadChecklistSegunda', VerificaSessao, upload.single('imagem'), async (req, res) => {
  try {
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');

    const { dataAbastecimento, km, valor, veiculo: numeroPlaca } = req.body;
    const motoristaId = req.session.usuario.id;

    function deletaImage() {
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, err => {
          if (err) console.error('Erro ao deletar imagem:', err);
        });
      }
    }

    const veiculos = await Veiculo.findAll({
      where: { idMotorista: motoristaId },
      attributes: ['marcaModelo', 'numeroPlaca']
    });
    const mapVeiculos = veiculos.map(item => ({
      marcaModelo: item.marcaModelo,
      numeroPlaca: item.numeroPlaca
    }));

    if (!dataAbastecimento || !km || !valor || !numeroPlaca) {
      deletaImage();
      return res.render('criarChecklistSegunda', {
        message: { type: 'warning', title: 'Erro!', text: 'Todos os campos são obrigatórios.' },
        veiculos: mapVeiculos
      });
    }

    const mondayDateMoment = moment(dataAbastecimento, 'YYYY-MM-DD');
    if (mondayDateMoment.isoWeekday() !== 1) {
      deletaImage();
      return res.render('criarChecklistSegunda', {
        message: { type: 'error', title: 'Erro!', text: 'A data informada não é uma segunda-feira.' },
        veiculos: mapVeiculos
      });
    }

    const mondayDate = mondayDateMoment.format('YYYY-MM-DD');
    const fridayAnterior = mondayDateMoment.clone().subtract(2, 'days').format('YYYY-MM-DD');
    const saturdayAnterior = mondayDateMoment.clone().subtract(1, 'days').format('YYYY-MM-DD');

    const motorista = await Motorista.findOne({ where: { id: motoristaId } });
    const veiculo = await Veiculo.findOne({ where: { numeroPlaca } });

    if (!motorista || !veiculo) {
      deletaImage();
      return res.render('criarChecklistSegunda', {
        message: { type: 'error', title: 'Erro!', text: 'Motorista ou veículo não encontrado.' },
        veiculos: mapVeiculos
      });
    }

    if (!req.file || !req.file.filename) {
      deletaImage();
      return res.render('criarChecklistSegunda', {
        message: { type: 'error', title: 'Erro!', text: 'Imagem é obrigatória.' },
        veiculos: mapVeiculos
      });
    }

    // Busca checklist da mesma segunda ou da sexta/sábado anteriores
    let checklistRecord = await Checklist.findOne({
      where: {
        idMotorista: motorista.id,
        [Op.or]: [
          { monday: mondayDate },
          { friday: fridayAnterior },
          { saturday: saturdayAnterior }
        ]
      }
    });

    // Verificação de duplicidade
    if (checklistRecord) {
      const mondayRegistrada = checklistRecord.monday
        ? moment(checklistRecord.monday).format('YYYY-MM-DD')
        : null;

      if (mondayRegistrada === mondayDate && checklistRecord.mondayStatus) {
        deletaImage();
        return res.render('criarChecklistSegunda', {
          message: {
            type: 'warning',
            title: 'Aviso!',
            text: `Checklist de segunda já cadastrado para ${moment(mondayDate).format('DD/MM/YYYY')}.`
          },
          veiculos: mapVeiculos
        });
      }

      if (
        (checklistRecord.friday || checklistRecord.saturday) &&
        mondayRegistrada === mondayDate &&
        checklistRecord.mondayStatus
      ) {
        deletaImage();
        return res.render('criarChecklistSegunda', {
          message: {
            type: 'warning',
            title: 'Aviso!',
            text: `Checklist da semana já foi fechado na segunda ${moment(mondayDate).format('DD/MM/YYYY')}.`
          },
          veiculos: mapVeiculos
        });
      }
    }

    const dataAtual = moment().format('DD-MM-YYYY');
    const outputPath = `public/img/uploads/motorista/checklist-${dataAtual}-${req.file.filename}`;
    const outPathBD = '../' + outputPath.slice(7);

    sharp.cache(false);
    await sharp(req.file.path).jpeg({ quality: 20 }).toFile(outputPath);
    fs.unlink(req.file.path, err => {
      if (err) console.error('Erro ao deletar imagem:', err);
    });

    if (checklistRecord) {
      checklistRecord.monday = mondayDate;
      checklistRecord.mondayStatus = true;
      await checklistRecord.save();
    } else {
      checklistRecord = await Checklist.create({
        monday: mondayDate,
        mondayStatus: true,
        idMotorista: motorista.id,
        idVeiculo: veiculo.id
      });
    }

    await AbastecimentoSegunda.create({
      valorTotal: valor,
      fotoNivelCombustivel: outPathBD,
      kilometragem: km,
      idVeiculo: veiculo.id,
      idMotorista: motorista.id,
      idChecklist: checklistRecord.id
    });

    return res.render('data', {
      message: { type: 'success', title: 'Sucesso!', text: 'Checklist de segunda cadastrado com sucesso!' }
    });

  } catch (err) {
    console.error(err);
    if (req.file && req.file.path) fs.unlink(req.file.path, () => { });
    const veiculos = await Veiculo.findAll({
      where: { idMotorista: req.session.usuario.id },
      attributes: ['marcaModelo', 'numeroPlaca']
    });
    const mapVeiculos = veiculos.map(item => ({
      marcaModelo: item.marcaModelo,
      numeroPlaca: item.numeroPlaca
    }));
    return res.render('criarChecklistSegunda', {
      message: { type: 'error', title: 'Erro!', text: 'Erro ao salvar checklist de segunda.' },
      veiculos: mapVeiculos
    });
  }
});



router.get('/ChecklistSexta', VerificaSessao, async (req, res) => {
  try {
    const motoristaId = req.session.usuario.id;

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');


    const veiculos = await Veiculo.findAll({
      where: { idMotorista: motoristaId },

      attributes: ['marcaModelo', 'numeroPlaca'],
    });


    const mapVeiculos = veiculos.map(checklist => ({

      marcaModelo: checklist.marcaModelo,
      numeroPlaca: checklist.numeroPlaca,

    }));



    const message = {}
    res.render('criarChecklistSexta', {
      veiculos, mapVeiculos, message
    });

  } catch (err) {

    res.status(500).send('Erro ao buscar checklists.');
  }
});

router.get('/ChecklistSegunda', VerificaSessao, async (req, res) => {
  try {
    const motoristaId = req.session.usuario.id;

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');


    const veiculos = await Veiculo.findAll({
      where: { idMotorista: motoristaId },

      attributes: ['marcaModelo', 'numeroPlaca'],
    });


    const mapVeiculos = veiculos.map(checklist => ({

      marcaModelo: checklist.marcaModelo,
      numeroPlaca: checklist.numeroPlaca,

    }));



    const message = {}
    res.render('criarChecklistSegunda', {
      veiculos, mapVeiculos, message
    });

  } catch (err) {

    console.log(err);
    res.status(500).send('Erro ao buscar checklists.');
  }
});



router.get('/data', VerificaSessao, async (req, res) => {

  try {

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');
    let nomeUsuario = req.session.usuario.nomeCompleto;

    const message = {};
    res.render('data', {message: {}, nomeUsuario });

  } catch (err) {
    const message = {};
    res.status(500).render('data', {
      message: { type: 'error', title: 'Erro!', text: 'Alguma Coisa Deu Errado, Por Favor Tente Novamente!' },
    });
  }
});

module.exports = router;