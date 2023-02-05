const { rawListeners } = require('../models/Url');
const Url = require('../models/Url');
//const { nanoid } = require("nanoid");

const leerUrls = async (req, res) => {
    try {
        const urls = await Url.find({user: req.user.id}).lean();
        res.render("home", {urls: urls});
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/")
    }
    
};

const agregarUrl = async(req, res) => {
    const {origin, shortURL} = req.body;

    try {
        const url = new Url({
            origin:origin,
            shortURL: shortURL,
            user: req.user.id})            
            await url.save();
            res.redirect('/');
    } catch (error) {
        req.flash("mensajes", [{msg: errors.message}]);
        return res.redirect("/")
    }

};

const eliminarUrl = async(req, res) =>{
    const {id} = req.params;
    
    try {
        
        const url = await Url.findById(id)
        if(!url.user.equals(req.user.id)){
            throw new Error("Url de otra base de datos")
        }

        await url.remove()

        res.redirect("/");

    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/")
    }
}

const editarUrlForm = async (req, res) =>{
    const { id } = req.params; 

    try {
        const url = await Url.findById(id).lean();

        if(!url.user.equals(req.user.id)){
            throw new Error("Url de otra base de datos")
        }

        
        res.render('home', {url})
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/")
    }
}

const editarUrl = async (req, res) =>{
    const { id } = req.params; 
    const {shortURL} = req.body;

    try {
        const url = await Url.findById(id)
        if(!url.user.equals(req.user.id)){
            throw new Error("Url de otra base de datos")
        }

        await url.updateOne({shortURL})

        //await Url.findByIdAndUpdate(id, {shortURL: shortURL})
        res.redirect('/')
    } catch (error) {
        req.flash("mensajes", [{msg: errors.message}]);
        return res.redirect("/")
    }
};

const redir = async(req, res) =>{
    const {shortURL} = req.params

    try {
        const urlDB = await Url.findOne({shortURL: shortURL})
        res.redirect(urlDB.origin)
    } catch (error) {
        req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/")
    }
}

module.exports = {
    leerUrls,
    agregarUrl,
    eliminarUrl,
    editarUrlForm,
    editarUrl,
    redir
};