const option = {
  definition: {
    info: {
      title: "ChatApp Swagger Test",
      version: "1.0.0",
    },
    servers: ["http://localhost:5000"],
  },
  apis: ["./routes/room.js"],
};

module.exports = option;
