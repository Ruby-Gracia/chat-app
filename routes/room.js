const router = require("express").Router();
const roomlists = require("../models/Room");
const User = require("../models/User");
const Message = require("../models/Message");
var mongo = require("mongodb");

/**
 * @swagger
 * /rooms/createroom:
 *  post:
 *    summary: Create Room
 *    description: Create a new room
 *    parameters:
 *      - name: name
 *        in: body
 *        type: string
 *        required: true
 *    responses:
 *      '200':
 *        description: Will get newly added room
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                  description: id of room
 *                  example: 2342ddasa
 *                name:
 *                  type: string
 *                  description: name of room
 *                  example: Room 1
 */

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

/**
 * @swagger
 * /rooms:
 *  get:
 *    summary: Get Rooms
 *    description: Get all rooms
 *    responses:
 *      '200':
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              properties:
 *              - _id:
 *                  type: string
 *                  description: id of room
 *                  example: 2342ddasa
 *                roomName:
 *                  type: string
 *                  description: name of room
 *                  example: Room 1
 */

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

/**
 * @swagger
 * /rooms/enterroom:
 *  post:
 *    summary: Enter Room
 *    description: Enter into a room
 *    parameters:
 *      - in: body
 *        name: user
 *        description: The room to enter.
 *        schema:
 *          type: object
 *          required:
 *            - userName
 *            - roomId
 *          properties:
 *            userName:
 *              type: string
 *            roomId:
 *              type: string
 *    responses:
 *      '200':
 *        description: Will enter a room
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                  description: id of room
 *                  example: 2342ddasa
 *                userName:
 *                  type: string
 *                  description: name of user
 *                  example: Ruby
 *                roomId:
 *                  type: string
 *                  description: Room Id
 *                  example: 2342ddasa
 */

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

/**
 * @swagger
 * /rooms/sendmessage:
 *  post:
 *    summary: Send Message
 *    description: send a message
 *    parameters:
 *      - in: body
 *        name: user
 *        description: send message in a room.
 *        schema:
 *          type: object
 *          required:
 *            - userName
 *            - roomId
 *          properties:
 *            roomId:
 *              type: string
 *            userId:
 *              type: string
 *            message:
 *              type: string
 *    responses:
 *      '200':
 *        description: user will send a Message
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                  description: id of room
 *                  example: 2342ddasa
 *                roomId:
 *                  type: string
 *                  description: Room Id
 *                  example: 2342ddasa
 *                userId:
 *                  type: string
 *                  description: user Id
 *                  example: 2342ddasa
 *                message:
 *                  type: string
 *                  description: message sent by user
 *                  example: Hello
 */

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

/**
 * @swagger
 * /rooms/messageshistory/{roomId}:
 *  get:
 *    summary: Get Messages History
 *    description: Get Messages History of a Room
 *    parameters:
 *      - in: path
 *        name: roomId
 *        schema:
 *          type: string
 *          required: true
 *          description: Numeric ID of the room
 *    responses:
 *      '200':
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              properties:
 *              - _id:
 *                  type: string
 *                  description: id of room
 *                  example: 2342ddasa
 */

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

/**
 * @swagger
 * /rooms/{userId}:
 *  delete:
 *    summary: Logout
 *    description: Logout from a room
 *    parameters:
 *      - in: path
 *        name: userId
 *        schema:
 *          type: string
 *          required: true
 *          description: Numeric ID of the user to logout
 *    responses:
 *      '200':
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              properties:
 *              - _id:
 *                  type: string
 *                  description: id of user
 *                  example: 2342ddasa
 */

router.delete("/:id", async (req, res) => {
  const user = await User.findByIdAndRemove(req.params.id);

  res.status(200).json({
    success: true,
    data: user,
  });
});

module.exports = router;
