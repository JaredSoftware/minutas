const { Router } = require("express");
const router = Router();

//selector
router.use(require("./maps/maps.routes"));

module.exports = router;