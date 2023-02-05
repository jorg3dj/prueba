const {URL} = require("url");

const urlValidar = (req, res, next) => {
    try {
        const { origin } = req.body;
        const urlFrontend = new URL(origin);
        if(urlFrontend.origin != "null"){
            return next();
        }else{
            throw new Error("no valida 😨")
        }

    } catch (error) {
       req.flash("mensajes", [{msg: error.message}]);
        return res.redirect("/");
    }

}

module.exports = urlValidar