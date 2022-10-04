var conexion = require('../config/conexion.js');
var libro = require('../model/libro');
var borrar = require("fs");
const { validationResult } = require('express-validator');

module.exports={
    index:function (req,res){
        libro.obtener(conexion, function(err,datos){
            //console.log(datos);
            res.render('libros/index', {title: 'Aplicación', libros: datos });
        });
    },
    crear:function (req,res){
        res.render('libros/crear');
    },
    guardar:function (req,res){
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            errors.array().forEach(error => {
                req.flash('error', error.msg)
            });
            res.render('libros/crear', {messages: req.flash()});
            return;
        }
        if (!req.file) {
            return res.status(422).json({ message: 'Please add an image!' });
        }        
        libro.insertar(conexion, req.body, req.file, function(err){
            res.redirect('/libros');
        });
    },
    eliminar:function (req,res){
        console.log("Recepción de datos");
        console.log(req.params.id);
        libro.retornarDatosID(conexion,req.params.id, function(err,registros){
            var nombreImagen = "public/images/"+(registros[0].imagen);
            if(borrar.existsSync(nombreImagen)){
                borrar.unlinkSync(nombreImagen);
            }
            libro.borrar(conexion, req.params.id, function(err){
                res.redirect('/libros');
            });
        });
    },
    editar:function(req,res){
        libro.retornarDatosID(conexion,req.params.id,function(err,registros){
            //console.log(registros[0]);
            res.render('libros/editar', {libro:registros[0]});
        });
    },
    actualizar:function(req,res){
        if(req.file){
            if(req.file.filename){
                libro.retornarDatosID(conexion, req.body.id, function(err,registros){
                    var nombreImagen = "public/images/"+(registros[0].imagen);
                    if(borrar.existsSync(nombreImagen)){
                        borrar.unlinkSync(nombreImagen);
                    }
                    libro.actualizarArchivo(conexion, req.body, req.file, function(err){
                    });
                });
            }
        }else{
            if(req.file){
            return res.status(422).json({ message: 'Please add an image!' });}
        }

        if(req.body.nombre){
            libro.actualizar(conexion, req.body, function(err){});
        }
        res.redirect('/libros');
    }
}