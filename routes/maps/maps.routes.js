const express = require("express");
const router = express.Router();

// Requires official Node.js MongoDB Driver 3.0.0+

//controlador
const { findU, dahsboard, makeTables, indicadores, llamadas,updatedash, out, file } = require("../../controllers/pageControler");

router.get("/minuta/:file", file);

router.get("/dashboard", dahsboard)

module.exports = router;