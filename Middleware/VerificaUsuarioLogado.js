function VerificaUsuarioLogado(req, res, next) {
  if (req.session.loggedIn) {
    const usuario = req.session.usuario;
    if (usuario.permissao) {
      res.login;
      return next();
    } else {
      return res.render("login", { message: { error: "Usuário não tem permissão." } });
    }
  } else {
    return res.render("login", {
      message: { error: "Você precisa estar logado para acessar essa página." },
    });
  }
}

module.exports = VerificaUsuarioLogado;
