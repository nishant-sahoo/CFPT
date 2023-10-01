const Event = require("../Model/event");
const ProblemSet = require("../Model/problemSet");
const Problem = require("../Model/problem");
const Tag = require("../Model/tag");
const User = require("../Model/user");
const authController = require("./authController");

//Create Events , Problemsets , Problems and Tags......
module.exports.createEvent = async (req, res) => {
  Event.create(
    {
      eventName: req.body.eventName,
      isArchived: req.body.isArchived,
    },
    (err, event) => {
      if (err) {
        console.log(err);
        return res.status(500).send("There was a problem creating the event.");
      }
      res.status(200).send({ event: event, id: event._id });
    }
  );
};
module.exports.createProblemset = async (req, res) => {
  ProblemSet.create(
    {
      problemSetName: req.body.name,
      createdBy: req.userId,
    },
    (err, problemset) => {
      if (err) {
        // console.log(user + "\n" + err);
        return res
          .status(500)
          .send("There was an issue creating the problemset.");
      }
      Event.findOneAndUpdate(
        { _id: req.params.id },
        { $push: { allProblems: problemset._id } },
        { new: true, useFindAndModify: false },
        function (err, result) {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .send("There was an issue in adding problemset to event.");
          }
        }
      );
      res.status(200).send({ problemset: problemset, id: problemset._id });
    }
  );
};
module.exports.addProblem = async (req, res) => {
  Problem.create(
    {
      name: req.body.name,
      id: req.body.id,
      rating: req.body.rating,
    },
    (err, problem) => {
      if (err) {
        console.log(err);
        return res.status(500).send("There was an issue creating the problem.");
      }
      ProblemSet.findByIdAndUpdate(
        req.params.id,
        { $push: { problems: problem._id } },
        { new: true, useFindAndModify: false },
        function (err, result) {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .send("There was an issue adding the problem to problemset.");
          }
        }
      );
      res.status(200).send({ problem: problem, id: problem._id });
    }
  );
};

module.exports.addTag = async (req, res) => {
  Tag.findOne({ tag: req.body.tag }, function (er, result) {
    //Do your action here..
    if (er) {
      console.log(err);
      return res.status(500).send("There was an issue creating the tag.");
    }
    if (!result) {
      Tag.create(
        {
          tag: req.body.tag,
        },
        (err, tag) => {
          if (err) {
            console.log(err);
            return res.status(500).send("There was an issue creating the tag.");
          }
          Problem.findByIdAndUpdate(
            req.params.id,
            { $push: { tags: tag._id } },
            { new: true, useFindAndModify: false },
            function (err, value) {
              if (err) {
                console.log(err);
                return res
                  .status(500)
                  .send("There was an issue adding the tag to problem.");
              }
              res.status(200).send({ problem: value, id: tag._id });
            }
          );
        }
      );
    } else {
      Problem.findByIdAndUpdate(
        req.params.id,
        { $push: { tags: result._id } },
        { new: true, useFindAndModify: false },
        function (err, value) {
          if (err) {
            console.log(err);
            return res
              .status(500)
              .send("There was an issue adding the tag to problem.");
          }
          res.status(200).send({ problem: value, id: result._id });
        }
      );
    }
  });
};

//Reading Events , Problemsets , Problems and Tags......

//Fetching All
module.exports.getAllEvents = async (req, res) => {
  Event.find({}, (err, events) => {
    if (err) {
      console.log(err);
      return res.status(500).send("There was a problem creating the event.");
    }
    res.status(200).send({ event: events });
  });
};

module.exports.getAllProblemSets = async (req, res) => {
  ProblemSet.find({}, (err, problemsets) => {
    if (err) {
      console.log(err);
      return res.status(500).send("There was a problem fetching all PS.");
    }
    res.status(200).send({ problemset: problemsets });
  });
};

module.exports.getAllProblems = async (req, res) => {
  Problem.find({}, (err, problems) => {
    if (err) {
      console.log(err);
      return res.status(500).send("There was a problem fetching all problems.");
    }
    res.status(200).send({ problem: problems });
  });
};

module.exports.getAllTags = async (req, res) => {
  Tag.find({}, (err, tags) => {
    if (err) {
      console.log(err);
      return res.status(500).send("There was a problem fetching all tags.");
    }
    res.status(200).send({ tag: tags });
  });
};

//Fetch by ID

module.exports.getEvent = async (req, res) => {
  Event.findById(req.params.id, (err, event) => {
    if (err) {
      console.log(err);
      return res.status(500).send("There was a problem fetching the event.");
    }
    res.status(200).send({ event: event });
  });
};

module.exports.getProblemSet = async (req, res) => {
  ProblemSet.findById(req.params.id, (err, problemset) => {
    if (err) {
      console.log(err);
      return res.status(500).send("There was a problem fetching the PS.");
    }
    res.status(200).send({ problemset: problemset });
  });
};

module.exports.getProblem = async (req, res) => {
  Problem.findById(req.params.id, (err, problem) => {
    if (err) {
      console.log(err);
      return res.status(500).send("There was a problem fetching the problem.");
    }
    res.status(200).send({ problem: problem });
  });
};

module.exports.getTag = async (req, res) => {
  Tag.findById(req.params.id, (err, tag) => {
    if (err) {
      console.log(err);
      return res.status(500).send("There was a problem fetching the tag.");
    }
    res.status(200).send({ tag: tag });
  });
};

//Updating Events , Problemsets  and Tags......

module.exports.updateEvent = async (req, res) => {
  Event.findByIdAndUpdate(
    req.params.id,
    { eventName: req.body.eventName, isArchived: req.body.isArchived },
    { new: true },
    (err, event) => {
      if (err) {
        console.log(err);
        return res.status(500).send("There was a problem updating the event.");
      }
      res.status(200).send({ event: event });
    }
  );
};

module.exports.updateProblemSet = async (req, res) => {
  ProblemSet.findByIdAndUpdate(
    req.params.id,
    { problemSetName: req.body.name },
    { new: true },
    (err, problemset) => {
      if (err) {
        console.log(err);
        return res.status(500).send("There was a problem updating the PS.");
      }
      res.status(200).send({ problemset: problemset });
    }
  );
};

module.exports.updateTag = async (req, res) => {
  Tag.findByIdAndUpdate(
    req.params.id,
    { tag: req.body.tag },
    { new: true },
    (err, tag) => {
      if (err) {
        console.log(err);
        return res.status(500).send("There was a problem updating the tag.");
      }
      res.status(200).send({ tag: tag });
    }
  );
};

//Deleting Events, Problemsets, Problems and Tags......

module.exports.deleteEvent = async (req, res) => {
  Event.findByIdAndDelete(req.params.id, (err, event) => {
    if (err) {
      console.log(err);
      return res.status(500).send("There was a problem deleting the event.");
    }
    res.status(200).send({ event: event });
  });
};

module.exports.deleteProblemSet = async (req, res) => {
  try {
    const ps = await ProblemSet.findById(req.params.id);
    console.log(ps);
    Event.updateMany(
      {},
      {
        $pull: {
          allProblems: req.params.id,
        },
      },
      function (err, upd) {
        if (err) {
          console.log(err);
          return res.status(500).send("There was a problem deleting the PS.");
        }
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send("There was a problem deleting the PS.");
  }

  ProblemSet.findByIdAndDelete(req.params.id, (err, problemset) => {
    if (err) {
      console.log(err);
      return res.status(500).send("There was a problem deleting the PS.");
    }
    res.status(200).send({ problemset: problemset });
  });
};

module.exports.deleteProblem = async (req, res) => {
  try {
    const prob = await Problem.findById(req.params.id);
    console.log(prob);
    ProblemSet.updateMany(
      {},
      {
        $pullAll: {
          problems: [{ _id: req.params.id }],
        },
      },
      function (err, upd) {
        if (err) {
          console.log(err);
          return res
            .status(500)
            .send("There was an issue deleting the problem.");
        }
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send("There was an issue  deleting the problem.");
  }
  Problem.findByIdAndDelete(req.params.id, (err, problem) => {
    if (err) {
      console.log(err);
      return res.status(500).send("There was an issue  deleting the problem.");
    }
    res.status(200).send({ problem: problem });
  });
};

module.exports.deleteTag = async (req, res) => {
  try {
    const tag = await Tag.findById(req.params.id);
    console.log(tag);
    Problem.updateMany(
      {},
      {
        $pullAll: {
          tags: [{ _id: req.params.id }],
        },
      },
      function (err, upd) {
        if (err) {
          console.log(err);
          return res.status(500).send("There was a problem deleting the tag.");
        }
      }
    );
  } catch (err) {
    console.log(err);
    return res.status(500).send("There was a problem deleting the tag.");
  }
  Tag.findByIdAndDelete(req.params.id, (err, tag) => {
    if (err) {
      console.log(err);
      return res.status(500).send("There was a problem deleting the tag.");
    }
    res.status(200).send({ tag: tag });
  });
};
