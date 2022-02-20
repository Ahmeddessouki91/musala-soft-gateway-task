const Joi = require('joi');
const mongoose = require("mongoose");
const {Schema } = require("mongoose");

const gateway = mongoose.model(
  "Gateway",
  new Schema({
    serial_number: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    name: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 50,
    },
    ip_address: {
      type: String,
      required: true,
    },
    devices: [{
      type: Schema.Types.ObjectId,
      ref: 'Device'
    }],
  })
);

function validateGateway(gateway) {
  const schema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    serial_number: Joi.string().min(5).max(50).required(),
    ip_address: Joi.string().ip({ version: "ipv4" }),
  });

  return schema.validate(gateway);
}

exports.Gateway = gateway;
exports.validate = validateGateway;
