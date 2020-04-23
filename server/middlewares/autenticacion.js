const jwt = require('jsonwebtoken');

// ===============================
// Verifica Token
// ===============================
const verificaToken = (req, res, next) => {
    const token = req.get('token');


    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido'
                }
            });
        }

        req.usuario = decoded.usuario;
        next();
    });

}

// ===============================
// Verifica AdminRole
// ===============================
const verificaAdminRole = (req, res, next) => {
    const usuario = req.usuario;
    const adminRole = usuario.role;


    if (adminRole === 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es administrador'
            }
        });
    }
}

module.exports = {
    verificaToken,
    verificaAdminRole
}