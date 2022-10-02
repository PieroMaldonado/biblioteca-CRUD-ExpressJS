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
    }
}