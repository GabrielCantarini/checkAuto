function VerificaUsuarioLogado(req, res, next) {
  

  if (req.session && req.session.loggedIn) {  
    return next();  

  } else {
    console.log("Usuário não autenticado, redirecionando para login.");
    return res.redirect('/user'); 
  }
}

module.exports = VerificaUsuarioLogado;
