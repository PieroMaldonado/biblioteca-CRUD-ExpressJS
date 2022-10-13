var express = require('express');
var router = express.Router();
const librosController = require("../controllers/librosController");
const {body} = require('express-validator');
const cargar = require('../middleware/multer');
const authentication = require('../middleware/authentication');

/* GET home page. */
router.get('/', authentication.ifNotLoggedin,librosController.index);
router.get('/crear',authentication.ifNotLoggedin, librosController.crear);
router.post("/",authentication.ifNotLoggedin,cargar.single("archivo"),
[
    body('nombre')
    .notEmpty()
    .withMessage('Debe escribir un nombre')
],
librosController.guardar);
router.post('/eliminar/:id', authentication.ifNotLoggedin,librosController.eliminar);
router.get('/editar/:id', authentication.ifNotLoggedin,librosController.editar);
router.post("/actualizar", authentication.ifNotLoggedin,cargar.single("archivo"),
[
    body('nombre')
    .notEmpty()
    .withMessage('Debe escribir un nombre')
],
librosController.actualizar);

module.exports = router;