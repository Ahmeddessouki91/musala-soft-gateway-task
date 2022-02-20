const { Router } = require("express");
const router = Router();
const validateObjectId = require("../middleware/validateObjectId");
const gatewayConroller = require("../controllers/gateway.controller");
const deviceConroller = require("../controllers/device.conroller");

router.get("/", gatewayConroller.getAll);
router.post("/", gatewayConroller.createOne);
router.put("/:id", validateObjectId, gatewayConroller.updateOne);
router.get("/:id", validateObjectId, gatewayConroller.getOne);
router.delete("/:id", validateObjectId, gatewayConroller.deleteOne);

router.post("/:id/devices", validateObjectId, deviceConroller.createOne);
router.delete("/devices/:id", validateObjectId, deviceConroller.deleteOne);

module.exports = router;
