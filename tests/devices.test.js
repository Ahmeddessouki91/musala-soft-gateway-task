const request = require("supertest");
const { Device } = require("../models/device");
const { Gateway } = require("../models/gateway");
const mongoose = require("mongoose");

let server;
const devices = [
  {
    vendor: "Vendor 1",
    status: "Online",
  },
  {
    vendor: "Vendor 2",
    status: "Online",
  },
  {
    vendor: "Vendor 3",
    status: "Online",
  },
  {
    vendor: "Vendor 4",
    status: "Online",
  },
  {
    vendor: "Vendor 5",
    status: "Online",
  },
  {
    vendor: "Vendor 6",
    status: "Online",
  },
  {
    vendor: "Vendor 7",
    status: "Online",
  },
  {
    vendor: "Vendor 8",
    status: "Online",
  },
  {
    vendor: "Vendor 9",
    status: "Online",
  },
];

describe("[Devices] /api/gateways", () => {
  let gateway;
  beforeEach(async () => {
    server = require("../index");

    gateway = await new Gateway({
      name: "Gateway 1",
      serial_number: "KDepjuUU",
      ip_address: "192.168.1.1",
    }).save();

    gateway = await Gateway.findById({ _id: gateway._id });

    devices.forEach(async (e) => {
      let device = new Device({ ...e, gateway: gateway._id });
      await device.save();
      gateway.devices.push(device);
    });

    gateway = await gateway.save();
  });
  afterEach(async () => {
    await server.close();
    await Gateway.remove({});
    await Device.remove({});
  });

  describe("POST /:id/devices", () => {
    const exec = ({ vendor, status, gatewayId }) => {
      return request(server)
        .post(`/api/gateways/${gatewayId}/devices`)
        .send({ vendor, status });
    };
    test("should return 404 if invalid gateway id", async () => {
      const res = await exec({
        vendor: "Vendor 10",
        status: "Offline",
        gatewayId: mongoose.Types.ObjectId().toHexString(),
      });

      expect(res.status).toBe(404);
    });

    test("should return 400 if gateway has 10 devices!", async () => {
      let device = new Device({
        vendor: "Vendor 10",
        status: "Online",
        gateway: gateway._id,
      });

      await device.save();

      gateway.devices.push(device);
      await gateway.save();

      const res = await exec({
        vendor: "Vendor 11",
        status: "Offline",
        gatewayId: gateway._id,
      });

      expect(res.status).toBe(400);
    });

    test("should return the device if it is valid", async () => {
      const res = await exec({
        vendor: "Vendor 10",
        status: "Offline",
        gatewayId: gateway._id.toHexString(),
      });

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("vendor", "Vendor 10");
    });
  });
  describe("DELETE /devices/:id", () => {
    const exec = (deviceId) => {
      return request(server).delete(`/api/gateways/devices/${deviceId}`).send();
    };

    test("should return 404 if id is invalid", async () => {
      const res = await exec(1);

      expect(res.status).toBe(404);
    });

    test("should return 404 if no gateway or device with the given id was found", async () => {
      const res = await exec(mongoose.Types.ObjectId());

      expect(res.status).toBe(404);
    });

    test("should delete the device if input is valid", async () => {
      let device = await Device.findOne({});

      const res = await exec(device._id);

      const deviceInDb = await Device.findById(device._id);

      expect(deviceInDb).toBeNull();
      expect(res.status).toBe(200);
    });
  });
});
