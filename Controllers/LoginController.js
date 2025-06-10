const express = require('express');
const session = require('express-session');
const Fiscal = require('../Models/Fiscal');
const Motorista = require('../Models/Motorista');
const router = express.Router();

router.use(session({
  secret: 'cp@Al%B@b$$MXsMSj391AAAAAz',
  resave: false,
  saveUninitialized: true
}));

router.get('/', (req, res, next) => {
  
try{

  let message = {};
  res.render('login', { message });

}catch(err){
  console.log(err)
}
});
router.get('/user', (req, res) => {

  try{

    if(req.session.loggedIn){
      return res.redirect('/data');  
    }
    

    let message = {};
    res.render('loginMotorista', { message });
  
  }catch(err){
    console.log(err)
  }

});


router.post('/login', async (req, res, next) => {
 
  try {

    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '-1');
        
    let login = req.body.login;
    let password = req.body.password;
    
    const usuario = await Fiscal.findOne({ where: { login: login } });
 
    
    if (!usuario) {
      return res.render('login', { message: { error: 'Login ou Senha Inválidos.' } });
    }

    if (usuario && usuario.senha !== password) {
      return res.render('login', { message: { error: 'Login ou Senha Inválidos.' } });
    }

    if (usuario.desativado) {
      return res.render('login', { message: { error: 'Usuário desativado.' } });
    }

    if (!usuario.permissao) {
      return res.render('login', { message: { error: 'Você não tem permissão.' } });
    }
  
    req.session.usuario = usuario;
    req.session.loggedIn = true;

    res.redirect('/date?data=2025-02-02');

    next();

  } catch (error) {
    return res.render('login', { message: { error: error } });
  }

});

router.post('/loginMotorista', async (req, res,next) => {
  try{
    
    const login = req.body.login;
    const password = req.body.password;
    

    const usuarioMotorista = await Motorista.findOne({ where: { email: login } });


    if (!usuarioMotorista) {
      return res.render('loginMotorista', { message: { error: 'Login ou Senha Inválidos.' } });
    }

    if (usuarioMotorista && usuarioMotorista.senha !== password) {
      return res.render('loginMotorista', { message: { error: 'Login ou Senha Inválidos.' } });
    }
    req.session.usuario = usuarioMotorista;
    req.session.loggedIn = true;

    
      res.redirect('/data');
      next();

  }catch(error){
    console.log(error)
  }

});

router.post('/logout', (req, res) => {
  try {
    req.session.destroy(err => {
      if (err) {
         return res.render('painel', { message: { error: 'Erro ao encerrar a sessão' }, daysOfWeek: [], eventsByDay: [] });
      }
      res.redirect('/');
    });
  } catch (error) {
    console.error('Erro inesperado no logout:', error);
    res.redirect('/');
  }
});


module.exports = router;