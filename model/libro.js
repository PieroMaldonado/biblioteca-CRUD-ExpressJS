module.exports={
    obtener:function(conexion,funcion){
        conexion.query("SELECT * FROM libros", funcion);
    },
    insertar:function(conexion, datos, archivos, funcion){
        conexion.query("INSERT INTO libros (nombre, imagen) VALUES (?,?)",[datos.nombre, archivos.filename], funcion);
    },
    retornarDatosID:function(conexion, id, funcion){
        conexion.query("SELECT * FROM libros WHERE id=?",[id], funcion);
    },
    borrar:function(conexion, id, funcion){
        conexion.query("DELETE FROM libros WHERE id=?",[id], funcion);
    },
    actualizar:function(conexion, datos, funcion){
        conexion.query("UPDATE libros SET nombre=? WHERE id=?",[datos.nombre, datos.id], funcion);
    },
    actualizarArchivo:function(conexion, datos, archivo, funcion){
        conexion.query("UPDATE libros SET imagen=? WHERE id=?",[archivo.filename, datos.id], funcion);
    }
}