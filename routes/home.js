const express = require('express');
const { leerUrls, agregarUrl, eliminarUrl, editarUrlForm, editarUrl, redir } = require('../controllers/homeController');
const { formPerfil, editarFotoPerfil } = require('../controllers/perfilController');
const urlValidar = require('../middlewares/urlValida');
const verificarUsuario = require('../middlewares/verificarUsuario');

const router = express.Router()

router.get('/',verificarUsuario ,leerUrls);
router.post("/",verificarUsuario,urlValidar, agregarUrl);
router.get("/eliminar/:id", verificarUsuario, eliminarUrl);
router.get("/editar/:id",verificarUsuario, editarUrlForm);
router.post("/editar/:id",verificarUsuario, editarUrl);
router.get("/perfil",verificarUsuario, formPerfil);
router.post("/perfil",verificarUsuario, editarFotoPerfil)
router.get("/:shortURL", redir);


module.exports = router;