const Event = require("../Model/potd");
const mongoose = require("mongoose");

//create
module.exports.createEvent = async (req, res) => {
  const {
    name,
    createdAt,
    publishedAt,
    linkToProblem,
    usersAnswered,
    tags,
    solutionLink,
  } = req.body;

  try {
    const event = await Event.create({
      name,
      createdAt,
      publishedAt,
      linkToProblem,
      usersAnswered,
      tags,
      solutionLink,
    });
    res.status(200).json(event);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

//get all
module.exports.getAllEvents = async (req, res) => {
  const event = await Event.find({}).sort({ createdAt: -1 });
  res.status(200).json(event);
};

//get by id
module.exports.getEvent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such event" });
  }

  const event = await Event.findById(id);
  if (!event) {
    return res.status(404).json({ error: "No such event" });
  }
  res.status(200).json(event);
};

//update
module.exports.updateEvent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such event" });
  }

  const event = await Event.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );

  if (!event) {
    return res.status(400).json({ error: "No such event" });
  }
  res.status(200).json(event);
};

//delete
module.exports.deleteEvent = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such event" });
  }

  const event = await Event.findOneAndDelete({ _id: id });
  if (!event) {
    return res.status(400).json({ error: "No such event" });
  }
  res.status(200).json(event);
};
