const { Gateway } = require("./models/gateway");
const { Device } = require("./models/device");
const mongoose = require("mongoose");
const config = require("config");

const data = [
  {
    name: "Gateway 1",
    serial_number: "KDepjuUU",
    ip_address: "192.168.1.1",
    devices: [
      { vendor: "Ahmed", status: "Online" },
      { vendor: "Mohamed", status: "Offline" },
    ],
  },
  {
    name: "Gateway 2",
    serial_number: "SSJ8sL7t",
    ip_address: "192.168.2.1",
    devices: [
      { vendor: "Ashraf", status: "Offline" },
      { vendor: "Sarah", status: "Online" },
    ],
  },
];

async function seed() {
  await mongoose.connect(config.get("db"));

  await Device.deleteMany({});
  await Gateway.deleteMany({});

  try {
    for (let g of data) {
      let gateway = await new Gateway({
        name: g.name,
        serial_number: g.serial_number,
        ip_address: g.ip_address
      });
      
      await gateway.save();

      const dbgateway = await Gateway.findById({_id: gateway._id});

       g.devices.forEach(async(e)=>{
         let device = new Device({...e,gateway:dbgateway._id});
         await device.save();
         dbgateway.devices.push(device);
       });

       await dbgateway.save();
    }
    console.info("Done!");
  } catch (ex) {
    console.error("Error: " + ex.message);
  } finally {
    mongoose.disconnect();
  }
}
seed();
