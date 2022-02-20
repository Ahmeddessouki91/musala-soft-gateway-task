const request = require("supertest");
const { Gateway } = require("../models/gateway");
const mongoose = require("mongoose");

let server;
const gateways = [
  {
    name: "Gateway 1",
    serial_number: "KDepjuUU",
    ip_address: "192.168.1.1",
  },
  {
    name: "Gateway 2",
    serial_number: "SSJ8sL7t",
    ip_address: "192.168.2.1",
  },
];

describe("[Gateways] /api/gateways", () => {
  beforeEach(() => {
    server = require("../index");
  });
  afterEach(async () => {
    await server.close();
    await Gateway.remove({});
  });

  describe("GET /", () => {
    test("should return all gateways", async () => {
      await Gateway.collection.insertMany(gateways);

      const res = await request(server).get("/api/gateways");

      expect(res.status).toBe(200);
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "Gateway 1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "Gateway 2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    test("should return a gateway if valid id is passed", async () => {
      const gateway = new Gateway(gateways[0]);
      await gateway.save();

      const res = await request(server).get("/api/gateways/" + gateway._id);

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", gateway.name);
    });

    test("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/gateways/1");

      expect(res.status).toBe(404);
    });

    test("should return 404 if no gateway with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/api/gateways/" + id);

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    const exec = ({ name, serial_number, ip_address }) => {
      return request(server).post("/api/gateways").send({
        name,
        serial_number,
        ip_address,
      });
    };

    test("should return 400 if ip address is invalid", async () => {
      const res = await exec({ ...gateways[0], ip_address: "1234" });

      expect(res.status).toBe(400);
    });

    test("should return 400 if serial number is already exist!", async () => {
      await new Gateway(gateways[0]).save();

      const res = await exec({
        ...gateways[1],
        ip_address: gateways[0].serial_number,
      });

      expect(res.status).toBe(400);
    });

    test("should return the gateway if it is valid", async () => {
      const res = await exec({ ...gateways[0] });
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "Gateway 1");
    });
  });

  describe("PUT /:id", () => {
    let gateway;

    const exec = async ({ id, name, ip_address, serial_number }) => {
      return await request(server)
        .put("/api/gateways/" + id)
        .send({ name, ip_address, serial_number });
    };

    beforeEach(async () => {
      gateway = new Gateway(gateways[0]);
      await gateway.save();
    });

    test("should return 404 if id is invalid", async () => {
      const res = await exec({ ...gateways[0], id: 1 });

      expect(res.status).toBe(404);
    });

    test("should return 404 if gateway with the given id was not found", async () => {
      const id = mongoose.Types.ObjectId().toHexString();
      const res = await exec({ ...gateways[0], id });

      expect(res.status).toBe(404);
    });

    test("should return 400 if ip address is invalid", async () => {
      const res = await exec({
        ...gateways[0],
        id: gateway._id,
        ip_address: "123",
      });
      expect(res.status).toBe(400);
    });

    test("should update the gateway if input is valid", async () => {
      await exec({
        ...gateways[0],
        id: gateway._id,
        name: "Gateway 1 Updated",
      });

      const updatedGateway = await Gateway.findById(gateway._id);

      expect(updatedGateway.name).toBe("Gateway 1 Updated");
    });
  });
});
