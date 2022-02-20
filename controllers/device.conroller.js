const { Gateway } = require("../models/gateway");
const { Device, validate } = require("../models/device");

module.exports = {
  createOne: async (req, res, next) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { status, vendor } = req.body;

    const gateway = await Gateway.findById({ _id: req.params.id }).populate(
      "devices"
    );

    if (!gateway) return res.status(404).send("Invalid gateway.");

    if (gateway.devices.length == 10)
      return res
        .status(400)
        .send("You cannot add more than 10 devices in this getway.");

    const device = await new Device({
      vendor,
      status,
      gateway: gateway._id,
    }).save();

    gateway.devices.push(device);

    await gateway.save();

    res.status(201).send(device);
  },
  deleteOne: async (req, res, next) => {
    console.log("DeviceID: " + req.params.id);
    const device = await Device.findByIdAndRemove(req.params.id, {
      new: true,
    });

    console.log(device);
    if (!device)
      return res
        .status(404)
        .send("The device with the given ID was not found.");

    res.send(device);
  },
};
