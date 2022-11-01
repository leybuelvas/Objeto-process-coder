const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../models/User");
const isValidPassword = (user, password) =>
  bcrypt.compareSync(password, user.password);
const createHash = (password) =>
  bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);



/* Un middleware que se utilizará para autenticar al usuario. */
passport.use(
  "login",
  new LocalStrategy((username, password, done) => {
    User.findOne({ username }, (error, user) => {
      if (error) return done(error);
      if (!user)
        return done(null, false, {
          message: "Usuario y/o contraseña incorrectos",
        });
      if (!isValidPassword(user, password))
        return done(null, false, {
          message: "Usuario y/o contraseña incorrectos",
        });
      return done(null, user);
    });
  })
);


/* Creación de una nueva estrategia para el proceso de registro. */
passport.use(
  "signup",
  new LocalStrategy(
    {
      passReqToCallback: true,
    },
    (req, username, password, done) => {
      User.findOne({ username: username }, (error, user) => {
        if (error)
          return done(error, user, {
            message: "Error al intentar registrar el usuario",
          });
        if (user) return done(null, false, { message: "El usuario ya existe" });
        const newUser = { username, password: createHash(password) };
        User.create(newUser, (error, userWithId) => {
          if (error)
            return done(error, user, { message: "Error creando usuario" });
          return done(null, userWithId, { message: "Usuario registrado" });
        });
      });
    }
  )
);


passport.serializeUser((user, done) => done(null, user._id));
passport.deserializeUser((id, done) => User.findById(id, done));


/*
 * Si el usuario está autenticado, continúe con la siguiente función de la cadena. De lo contrario,
 * redirija al usuario a la página de inicio de sesión.
 */
const checkAuthentication = (req, res, next) => {
  if (req.isAuthenticated()) next();
  else res.redirect("/login");
};


module.exports = checkAuthentication;
