const { response } = require("express");
const Usuario = require("../models/usuario");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../helpers/generar-jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  const { correo, password } = req.body;

  try {
    // Verificar si el email existe

    const usuario = await Usuario.findOne({ correo });
    if (!usuario) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - correo",
      });
    }

    // Si el usuario esta activo
    if (!usuario.estado) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - estado: false",
      });
    }

    // Verificar la contraseña
    const validPassword = bcryptjs.compareSync(password, usuario.password);
    if (!validPassword) {
      return res.status(400).json({
        msg: "Usuario / Password no son correctos - password",
      });
    }

    // Generar el JWT
    const token = await generarJWT(usuario.id);

    res.json({
      usuario,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Hable con el administrador",
    });
  }
};

const googleLogin = async (req, res = response) => {
  
  
  const { credential } = req.body;
  //console.log(credential);
  try {
    
    const { correo, nombre, img } = await googleVerify(credential);
    
    let usuario = await Usuario.findOne({ correo });
    
    if( !usuario ) {
        //Tengo que crearlo
        const data = {
            nombre,
            correo,
            password: ':P',
            img,
            google: true

        };
        usuario = new Usuario( data );
        
        await usuario.save();
    }

    //Si el usuario en DB
    if( !usuario.estado ) {
        return res.status(401).json({
            msg: 'Hable con el administrador, usuario bloqueado'
        });
    }
    
    // Generar el JWT
    const token = await generarJWT(usuario.id);

    //console.log(googleUser);

    res.json({
      usuario,
      token
      //credential
    });
  } catch (error) {
    res.status(400).json({
      msg: "Token de Google no es válido",
    });
  }
};

module.exports = {
  login,
  googleLogin,
};
