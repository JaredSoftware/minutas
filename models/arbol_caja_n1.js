const mongoose = require("mongoose");

const schema1 = new mongoose.Schema(
  {
    nombre_skill: { type: String },
    idn: { type: String },
    nombre: { type: String },
    escalamiento: { type: String }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const schema2 = new mongoose.Schema(
  {
    parent: { type: String },
    idn: { type: String },
    nombre: { type: String },
    escalamiento: { type: String }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const schema3 = new mongoose.Schema(
  {
    parent: { type: String },
    idn: { type: String },
    nombre: { type: String },
    escalamiento: { type: String }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const schema4 = new mongoose.Schema(
  {
    parent: { type: String },
    idn: { type: String },
    nombre: { type: String },
    escalamiento: { type: String }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const schema5 = new mongoose.Schema(
  {
    parent: { type: String },
    idn: { type: String },
    nombre: { type: String },
    escalamiento: { type: String }
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

module.exports = mongoose.model("arbol_arbol_PQRS_SALUD_n1", schema1, "arbol_arbol_PQRS_SALUD_n1");
module.exports = mongoose.model("arbol_arbol_PQRS_SALUD_n2", schema2, "arbol_arbol_PQRS_SALUD_n2");
module.exports = mongoose.model("arbol_arbol_PQRS_SALUD_n3", schema3, "arbol_arbol_PQRS_SALUD_n3");
module.exports = mongoose.model("arbol_arbol_PQRS_SALUD_n4", schema4, "arbol_arbol_PQRS_SALUD_n4");
module.exports = mongoose.model("arbol_arbol_PQRS_SALUD_n5", schema5, "arbol_arbol_PQRS_SALUD_n5");