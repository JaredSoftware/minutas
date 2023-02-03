const mongoose = require("mongoose");
const { Schema } = mongoose;

const tipificaciones_selector = new Schema({
  vdn: { type: Array },
  skill: { type: Array },
  number_skill: { type: Array },
  nombre_skill: { type: String },
  tipificacion: { type: String },
});

module.exports = mongoose.model(
  "tipificaciones_selector",
  tipificaciones_selector,
  "tipificaciones_selector"
);
