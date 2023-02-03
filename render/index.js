const path = require('path');

/**Inicializa las variables para el sistema de renderizado */
const createDefaultData = require(path.resolve(__dirname, 'lib', 'create-default-data.js'));
/**Rnderiza la vista enviada */
const render = require(path.resolve(__dirname, 'lib', 'render.js'));

module.exports = {
    render,
    createDefaultData
}