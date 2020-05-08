const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const { verificaToken, verificaAdminRole } = require('../middlewares/autenticacion');
const _ = require('underscore');

const Usuario = require('../models/usuario');

app.get('/usuario', verificaToken, function(req, res) {
    let limite = req.query.limite;
    limite = Number(limite);

    let desde = req.query.desde;
    desde = Number(desde);

    Usuario.find({ estado: true }, 'nombre email role img google estado')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            Usuario.count({ estado: true }, (err, total) => {
                res.json({
                    ok: true,
                    usuarios,
                    total
                });
            });
        });
});

app.post('/usuario', [verificaToken, verificaAdminRole], function(req, res) {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        });
    });

});

app.put('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {
    // uso librería underscore(_) q expande funcionalidades a JS, usando método pick el cual regresa una copia
    // del objeto devolviendo los campos que deseo que el usuario vea
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    let id = req.params.id;

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioActualizado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            usuario: usuarioActualizado
        });
    });

});

app.delete('/usuario/:id', [verificaToken, verificaAdminRole], function(req, res) {
    let id = req.params.id;
    let actualizaEstado = {
            estado: false
        }
        // Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
    Usuario.findByIdAndUpdate(id, actualizaEstado, { new: true }, (err, usuarioBorrado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioBorrado) {
            return res.status(400).json({
                ok: false,
                mesagge: `No se pudo eliminar ya que no existe usuario con id ${id}`
            });
        }

        res.json({
            ok: true,
            eliminado: usuarioBorrado
        });
    });
});

module.exports = app;