require('./config/config');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');


const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
    // parse application/json
app.use(bodyParser.json())

// Configuración global de Rutas
app.use(require('./routes/index'));

// Conceder permisos para que la carpeta public sea accedida
app.use(express.static(path.resolve(__dirname, '../public')));

mongoose.connect(process.env.URLDB, { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
    (err, resp) => {

        if (err) throw err;
        console.log('Base de datos ONLINE');

    });

app.listen(process.env.PORT, () => {
    console.log('Escuchando el puerto', process.env.PORT);
});