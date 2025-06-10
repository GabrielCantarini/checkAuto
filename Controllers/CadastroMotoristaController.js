const express = require('express');
const session = require('express-session');
const Motorista = require('../Models/Motorista');
const router = express.Router();
const VerificaSessao = require('../Middleware/VerificaUsuarioLogadoMotorista');
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const sharp = require('sharp');
const moment = require('moment');

router.use(session({
  secret: 'cp@Al%B@b$$MXsMSj391AAAAAz',
  resave: false,
  saveUninitialized: true
}));


router.use('public/img/uploads/motorista', express.static(path.join(__dirname, 'motorista')));
sharp.cache(false);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/uploads/motorista/perfil');
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


router.get('/cadastro-motorista', (req, res) => {
  res.render('cadastroMotorista');
});

router.post('/cad-motorista', upload.single('fotoPerfil'), async (req, res) => {
  try {


    function deletaImage() {
      if (req.file && req.file.path) {
        fs.unlink(req.file.path, err => { if (err) console.error('Erro ao deletar imagem:', err); });
      }
    }

    if (!req.file || !req.file.filename) {
      deletaImage();
      return console.log('upload n deu certo');

    }
      const dataAtual = moment().format('DD-MM-YYYY');
        const outputPath = `public/img/uploads/motorista/perfil-${dataAtual}-${req.file.filename}`;
        const outPathBD = '../' + outputPath.slice(7);    
      
   sharp.cache(false);
       await sharp(req.file.path)
         .jpeg({ quality: 20 })
         .toFile(outputPath);
       fs.unlink(req.file.path, err => { if (err) console.error('Erro ao deletar imagem:', err); });

  } catch (error) {
    console.error('Erro no processamento da imagem:', error);
    return res.render('cadastroMotorista', {
      message: { type: 'error', title: 'Erro!', text: 'Erro ao processar imagem.' }
    });
  }

});








module.exports = router;