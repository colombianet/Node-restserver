const express = require('express');
const app = express();

const { verificaToken } = require('../middlewares/autenticacion');

const Producto = require('../models/producto');

// ======================================
// Obtener todos los productos
// ======================================
app.get('/productos', verificaToken, (req, res) => {
    let limite = req.query.limite || 0;
    limite = Number(limite);

    let desde = req.query.desde || 5;
    desde = Number(desde);

    Producto.find({ disponible: true })
        .skip(desde)
        .limit(limite)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productosDB) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            res.json({
                ok: true,
                productos: productosDB
            })
        });
});


// ======================================
// Obtener productos por ID
// ======================================
app.get('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Producto.findById(id)
        .populate('usuario', 'nombre email')
        .populate('categoria', 'descripcion')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe el ID'
                    }
                });
            }

            res.json({
                ok: true,
                producto: productoDB
            });
        });
});

// ===========================================
// Obtener productos por término de búsqueda
// ===========================================
app.get('/productos/buscar/:termino', verificaToken, (req, res) => {
    let termino = req.params.termino;

    let expresionRegular = new RegExp(termino, 'i');

    Producto.find({ nombre: expresionRegular })
        .populate('categoria', 'descripcion')
        .exec((err, productosDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (productosDB) {
                let productos = productosDB;
                if (productos.length === 0) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: `No hay productos que coincidan con su búsqueda: ${ termino }`
                        }
                    });
                }
            }

            res.json({
                ok: true,
                productos: productosDB
            })
        });
});

// ===========================================
// Crear producto
// ===========================================
app.post('/productos', verificaToken, (req, res) => {
    let body = req.body;
    let idCategoria = req.params.id;

    let producto = new Producto({
        nombre: body.nombre,
        precioUni: body.precioUni,
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria,
        usuario: req.usuario._id
    });

    producto.save((err, productosDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productosDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productosDB
        });
    });
});

// =======================================
// Actualizar producto por ID
// =======================================
app.put('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, productoActualizado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!productoActualizado) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            producto: productoActualizado
        });
    });
});

// ==============================================
// Cambia estado disponible a false (Eliminar)
// ==============================================
app.delete('/productos/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let actualizaEstado = {
            disponible: false
        }
        // Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
    Producto.findByIdAndUpdate(id, actualizaEstado, { new: true }, (err, productoBorrado) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!productoBorrado) {
            return res.status(400).json({
                ok: false,
                mesagge: `No se pudo eliminar ya que no existe producto con id ${id}`
            });
        }

        res.json({
            ok: true,
            eliminado: productoBorrado
        });
    });
});
module.exports = app;