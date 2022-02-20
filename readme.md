## Description

This sample project is managing gateways - master devices that control multiple peripheral devices.
Your task is to create a REST service (JSON/HTTP) for storing information about these gateways and their associated devices. This information must be stored in the database.
When storing a gateway, any field marked as “to be validated” must be validated and an error returned if it is invalid. Also, no more that 10 peripheral devices are allowed for a gateway.
The service must also offer an operation for displaying information about all stored gateways (and their devices) and an operation for displaying details for a single gateway. Finally, it must be possible to add and remove a device from a gateway.

Each gateway has:

- a unique serial number (string),
- human-readable name (string),
- IPv4 address (to be validated),
- multiple associated peripheral devices.
  Each peripheral device has:
- a UID (number),
- vendor (string),
- date created,
- status - online/offline.

## Setup

Make sure to follow all these steps exactly as explained below. Do not miss any steps or you won't be able to run this application.

### Install MongoDB

To run this project, you need to install the latest version of MongoDB Community Edition first.

https://docs.mongodb.com/manual/installation/

Once you install MongoDB, make sure it's running.

### Install the Dependencies

Next, from the project folder, install the dependencies:

    npm i

### Populate the Database

    node seed.js

### Run the Tests

You're almost done! Run the tests to make sure everything is working:

    npm test

All tests should pass.

### Start the Server

    node index.js

This will launch the Node server on port 3000. If that port is busy, you can set a different point in config/default.json.

# Project structure

```
|── config
│   ├── default.json
│   └── test.json
├── middlewares
│   └── async.js
|   └── error.js
|   └── validateObjectId.js
├── models
│   ├── gateway.js
│   └── device.js
├── routes
│   └── gateways.js
├── tests
│   └── post.test.js
├── index.js
├── seed.js
├── package.json
├── README.md
└── ...
```
