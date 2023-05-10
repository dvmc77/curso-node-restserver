
const validarCampos = require('../middlewares/validar-campos');
const validarJWT = require('../middlewares/validad-jwt');
const ValidarRoles = require('../middlewares/validar-roles');


module.exports = {
    ...validarCampos,
    ...validarJWT,
    ...ValidarRoles
}