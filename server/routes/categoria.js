const express = require('express');
const app = express();

// Middlewares
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');

const Categoria = require('../models/categoria');

// ====================================
// Obtener todas las categorías
// ====================================
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find()
        .sort('descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, categoriasDB) => {
            if (err) {
                return res.status(400).json({
                    ok: true,
                    err
                });
            }

            res.json({
                ok: true,
                categorias: categoriasDB
            });
        });

});

// ==============================
// Devuelve categoría por ID
// ==============================
app.get('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;

    Categoria.findById(id, (err, categoria) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoria) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria
        });
    });
});
// ===================================
// Crear categoría
// ===================================
app.post('/categoria', verificaToken, (req, res) => {
    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!categoriaDB) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });
    });
});

// ==================================
// Actualizar categoría por ID
// ==================================
app.put('/categoria/:id', verificaToken, (req, res) => {
    let id = req.params.id;
    let body = req.body;

    let descCategoria = {
        descripcion: body.descripcion
    };

    Categoria.findByIdAndUpdate(id, descCategoria, { new: true, runValidators: true }, (err, categoriaActualizada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaActualizada) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaActualizada
        });
    });
});

// ===================================
// Eliminar categoría de la BD
// ===================================
app.delete('/categoria/:id', [verificaToken, verificaAdminRole], (req, res) => {
    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaBorrada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!categoriaBorrada) {
            return res.status(400).json({
                ok: false,
                mesagge: `No se pudo eliminar ya que no existe categoría con id ${id}`
            });
        }

        res.json({
            ok: true,
            categoria: categoriaBorrada
        })
    });
});


module.exports = app;