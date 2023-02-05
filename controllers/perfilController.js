const User = require("../models/User");
const Jimp = require("jimp")
const formidable = require ('formidable')
const fs = require('fs')
const path = require('path')

module.exports.formPerfil = async (req, res) =>{
    try {
        const user = await User.findById(req.user.id)
        return res.render("perfil", {user: req.user, imagen: user.imagen})
    } catch (error) {
        req.flash("mensajes", [{msg: "error al leer el usuario"}])
        return res.redirect("/perfil")
    }
};



module.exports.editarFotoPerfil = async (req, res) => {
    
    const form = new formidable.IncomingForm()
    form.maxFileSize = 50 * 1024 * 1024 //5mb

    form.parse(req, async(err, fields, files) =>{
        
        try {
            if(err){
                req.flash("mensajes", [{ msg: "falló formidable" }]);
                return res.redirect("/perfil");
            }

            const file = files.myFile

            if(file.originalFilename === ""){
                throw new Error('Por favor agrega una imagen')
            }

            const imageTypes = [
                "image/jpeg",
                "image/png",
                "image/webp",
                "image/gif",
            ];

            if (!imageTypes.includes(file.mimetype)) {
                throw new Error("Formato de imagen no compatible.");
            }

            if(file.size > 50 * 1024 * 1024){
                throw new Error('Imagen demasiado grande. Maximo 5Mb')
            }

            const extencion = file.mimetype.split("/")[1]
            const dirFile = path.join(
                __dirname,
                `../public/img/perfil/${req.user.id}.${extencion}`)

            fs.renameSync(file.filepath, dirFile)

            const image = await Jimp.read(dirFile)
            image
            .resize(200, 200)
            .quality(80)
            .writeAsync(dirFile)


            const user = await User.findById(req.user.id);
            user.imagen = `${req.user.id}.${extencion}`
            
            await user.save()
            return res.redirect("/perfil")

        } catch (error) {
            req.flash("mensajes", [{msg: error.message}])
            return res.redirect("/perfil")
        }
    })
}