const Joi = require("joi");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const deviceSchema = new Schema({
  vendor: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 255,
  },
  status: {
    type: String,
    enum: ["Online", "Offline"],
    default: "Offline",
  },
  gateway: {
    type: Schema.Types.ObjectId,
    ref: "Gateway",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Device = mongoose.model("Device", deviceSchema);

function validateDevice(device) {
  const schema = Joi.object({
    vendor: Joi.string().min(5).max(50).required(),
    status: Joi.string().valid("Online", "Offline"),
  });

  return schema.validate(device);
}

exports.Device = Device;
exports.deviceSchema = deviceSchema;
exports.validate = validateDevice;
