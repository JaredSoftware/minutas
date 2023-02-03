/*
Inicializa las variables necesarias para el sistema de renderizado
*/

module.exports = (req, res,next) => {

    res.locals.view = {};
    res.locals.view.path = 'maintenance.ejs';
    res.locals.view.data = {};

    next()

}