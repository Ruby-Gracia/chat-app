const router = require("express").Router();
const roomlists = require("../models/Room");
const User = require("../models/User");
const Message = require("../models/Message");
var mongo = require("mongodb");

router.post("/createroom", async (req, res) => {
  const addRoom = await new roomlists({
    roomName: req.body.roomName,
  });
  addRoom.save().then((room) => {
    res.status(200).json({
      success: true,
      data: room,
    });
  });
});

router.get("/", async (req, res) => {
  await roomlists.find({}, (error, rooms) => {
    if (error) {
      throw error;
    }
    res.status(200).json({
      success: true,
      data: rooms,
    });
  });
});

router.post("/enterroom", async (req, res) => {
  const roomId = req.body.roomId;
  if (roomId.match(/^[0-9a-fA-F]{24}$/)) {
    const addUser = await new User({
      userName: req.body.userName,
      roomId: req.body.roomId,
    });
    let roomDetail = await roomlists.find({ _id: req.body.roomId });
    addUser.save().then((user) => {
      res.status(200).json({
        success: true,
        data: {
          user,
          roomName: roomDetail[0].roomName,
        },
      });
    });
  } else {
    res.status(500).json({
      success: false,
      data: null,
    });
  }
});

router.post("/sendmessage", async (req, res) => {
  const sendMessage = await new Message({
    roomId: req.body.roomId,
    userId: req.body.userId,
    message: req.body.message,
  });
  sendMessage.save().then((message) => {
    res.status(200).json({
      success: true,
      data: message,
    });
  });
});

router.get("/messageshistory/:id", async (req, res) => {
  await Message.find({ roomId: req.params.id })
    .sort({ createdAt: 1 })
    .populate([
      {
        path: "roomId",
        model: "roomlists",
      },
      {
        path: "userId",
        model: "User",
      },
    ])
    .exec((error, messages) => {
      if (error) {
        throw error;
      }
      res.status(200).json({
        success: true,
        data: messages,
      });
    });
});

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = router;
