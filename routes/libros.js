var express = require('express');
var router = express.Router();
const librosController = require("../controllers/librosController");
const {body} = require('express-validator');

var multer = require('multer');
var fecha = Date.now();
var rutaAlmacen = multer.diskStorage({
    destination:function (request, file, callback){
        callback(null,'./public/images/')
    },
    filename:function (request, file, callback){
        callback(null,fecha+"_"+file.originalname)
    }
});
var cargar = multer({ storage:rutaAlmacen,
    fileFilter: (req, file, cb) => {
    if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg") {
        cb(null, true);
    } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
    }} 
    });

/* GET home page. */
router.get('/', librosController.index);
router.get('/crear', librosController.crear);
router.post("/",cargar.single("archivo"),[
    body('nombre')
    .notEmpty()
    .withMessage('Debe escribir un nombre')
],
librosController.guardar);
router.post('/eliminar/:id',librosController.eliminar);
router.get('/editar/:id',librosController.editar);
router.post("/actualizar",cargar.single("archivo"),[
    body('nombre')
    .notEmpty()
    .withMessage('Debe escribir un nombre')
],librosController.actualizar);

module.exports = router;