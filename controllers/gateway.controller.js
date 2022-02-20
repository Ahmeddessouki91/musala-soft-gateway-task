const { Gateway, validate } = require("../models/gateway");
const { Device } = require("../models/device");
const mongoose = require("mongoose");

module.exports = {
  getAll: async (req, res, next) => {
    const gateways = await Gateway.find()
      .populate("devices")
      .select("-__v")
      .sort("name");
    return res.send(gateways);
  },
  getOne: async (req, res, next) => {
    const gateway = await Gateway.findById(req.params.id)
      .populate("devices")
      .select("-__v");

    if (!gateway)
      return res
        .status(404)
        .send("The gateway with the given ID was not found.");

    return res.send(gateway);
  },
  createOne: async (req, res, next) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { serial_number, name, ip_address } = req.body;
    let gateway = await Gateway.findOne({
      serial_number: serial_number,
    });

    if (gateway)
      return res
        .status(400)
        .send(`Getway with serial number: ${serial_number} is already exist!`);

    gateway = await new Gateway({ serial_number, name, ip_address }).save();
    return res.status(201).send(gateway);
  },
  updateOne: async (req, res, next) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const { name, ip_address } = req.body;

    const gateway = await Gateway.findByIdAndUpdate(req.params.id, {
      name,
      ip_address,
    });

    if (!gateway)
      return res
        .status(404)
        .send("The gateway with the given ID was not found.");

    return res.send(gateway);
  },
  deleteOne: async (req, res, next) => {
    const removed = await Gateway.findByIdAndRemove({
      _id: req.params.id,
    });

    await Device.deleteMany({ gateway: req.params.id });

    if (!removed) {
      return res.status(400).end();
    }

    return res.status(200).json(removed);
  },
};
