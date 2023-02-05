const User = require("../models/User");
const { validationResult } = require('express-validator');
const nodemailer = require("nodemailer")
require('dotenv').config()

const registerForm = (req, res) => {
    res.render('register')
}
const registerUser = async (req, res) => {
    
const errors = validationResult(req)
if(!errors.isEmpty()){
    req.flash("mensajes", errors.array())
    return res.redirect("/auth/register")
}

const {userName, email, password} = req.body;
    try {

        let user = await User.findOne({email: email}); 
        if(user)throw new Error('Ya existe el usuario')
        
        user = new User({userName, email, password, tokenConfirm: "1"})
        await user.save()

        //enviar correo de confirmacion
        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
              user: process.env.USEREMAIL,
              pass: process.env.PASSEMAIL
            }
          });

          await transport.sendMail({
            from: '"Fred Foo 👻" <foo@example.com>',
            to: user.email,
            subject: "verifica tu cuenta de correo",
            html: `<a href="${process.env.PATHHEROKU || 'http://localhost:5000'}/auth/confirmarCuenta/${user.tokenConfirm}">verificar cuenta aquí</a>`,
        });

        req.flash("mensajes", [{msg: "Revisa tu correo elecronico"}])
        return res.redirect('/auth/login');
        
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/auth/register");
    }
};

const confirmarCuenta = async (req, res) => {
    const { tokenConfirm } = req.params;
    
    try {
        
         const user = await User.findOne({tokenConfirm})
         if(!user) throw new Error('No existe este usuario')
         
         user.cuentaConfirmada = true
         user.tokenConfirm = null

         await user.save();

         res.redirect('/auth/login');
    } catch (error) {
        res.send(error.message)
    }
    
}

const loginForm = (req, res) => {
    res.render("login")

}

const loginUser = async (req, res) =>{
    const errors = validationResult(req);
    
    if(!errors.isEmpty()){
        req.flash("mensajes", errors.array())
        return res.redirect('/auth/login') 
    }

    const { email, password} = req.body;

    try {
        
        const user = await User.findOne({email})
        
        if(!user) throw new Error('Email no registrado')

        if(!user.cuentaConfirmada) throw new Error('Falta confirmar email')

        if(!await user.comparePassword(password)) throw new Error('Contraseña invalida')

        //crea session con passports

        req.login(user, function(err){
            if(err) throw new Error('Error session')
            res.redirect('/');
        })

    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/auth/login");
    }
}

const cerrarSesion = (req, res) => {
    req.logout(function(err) {
        if(err) {return next(err)}
        res.redirect("/auth/login");
    });
};


 
module.exports = {
    loginForm,
    loginUser,
    registerForm,
    registerUser,
    confirmarCuenta,
    cerrarSesion
}