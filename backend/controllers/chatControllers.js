const e = require("express");
const asyncHandler = require("express-async-handler");

const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    res.status(400);
    throw new Error("UserId not sent as part of params");
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "-password",
  });

  if (isChat.length > 0) {
    res.status(200);
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);

      const fullChat = await Chat.findById(createdChat._id).populate(
        "users",
        "-password"
      );

      res.status(200).send(fullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

const fetchChat = asyncHandler(async (req, res) => {
  try {
    Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "-password",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const createGroupChat = asyncHandler(async (req, res) => {
  const { users, name } = req.body;

  if (!users || !name) {
    res.status(400).send("Please fill all the fields");
  }

  let usersArray = JSON.parse(users);

  if (usersArray.length < 2) {
    throw new Error("Need atleast 2 people to create Group chat");
  }

  usersArray.push(req.user);

  try {
    const groupChat = await Chat.create({
      chatName: name,
      isGroupChat: true,
      users: usersArray,
      groupAdmin: req.user,
    });

    const fullChat = await Chat.findById(groupChat._id)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).send(fullChat);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  try {
    const updatedChat = await Chat.findByIdAndUpdate(
      chatId,
      {
        chatName,
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (updatedChat) {
      res.status(200).json(updatedChat);
    } else {
      throw new Error("No chat found");
    }
  } catch (error) {
    throw new Error(error.message);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    const validateUser = await User.findById(userId);
    if (!validateUser) {
      res.status(400).send("No User found");
    }

    /* const userExist = await Chat.findById(chatId).find({
      users: { $elemMatch: { $eq: userId } },
    });

    if (userExist) {
      res.status(400).send("User already part of the group chat");
    } */

    const added = await Chat.findByIdAndUpdate(
      chatId,
      {
        $push: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (added) {
      res.status(200).json(added);
    } else {
      res.status(400).send("No Chat found");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  try {
    /* const validateUser = await User.findById(userId);
    if (!validateUser) {
      res.status(400).send("No User found");
    } */

    const removed = await Chat.findByIdAndUpdate(
      chatId,
      {
        $pull: { users: userId },
      },
      {
        new: true,
      }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (removed) {
      res.status(200).json(removed);
    } else {
      res.status(400).send("No Chat found");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = {
  accessChat,
  fetchChat,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
