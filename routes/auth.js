const { Router } = require("express");
const { check } = require("express-validator");
const { login, googleLogin } = require("../controllers/auth");

const { validarCampos } = require("../middlewares/validar-campos");

const router = Router();

router.post(
  "/login",
  [
    check("correo", "El correo es obligatorio").isEmail(),
    check("password", "La contraseña es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  login
);

router.post(
  "/googleLogin",
  [
    check("credential", "El id_token es necesario").not().isEmpty(),
    validarCampos,
  ],
  googleLogin
);

module.exports = router;
