const path = require('path');
const ejs = require('ejs');
const fs = require('fs');
const renderPartial = require(path.resolve(__dirname, 'render-partials.js')).renderPartial;
const config = require(path.resolve(process.cwd() , 'config.js' ));

module.exports = ( req, res, next ) => {

    try {
        
        // Funciones y servicios requeridas en las vistas
        res.locals.view.data.renderPartial = renderPartial;
        res.locals.view.data.config = config;

        // Renderizado de las vistas
        let _viewPath = res.locals.view.path;
        let _html = fs.readFileSync(_viewPath).toString();
            _html = ejs.render(_html, res.locals.view.data);
        res.send(_html);

    } catch (error) {
        error.message += ` -> In render :: render `;
        next(error);        
    }
}