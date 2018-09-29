const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const User = require("../models/user");
const Group = require("../models/group");
const Channel = require("../models/channel");

var Book = require("../models/Book.js");

/** GET API heath check */
router.get("/health/get", (req, res, next) => {
  res.send("api works");
});

/* GET ALL Users */
router.get("/user", function(req, res, next) {
  // console.log("ddd");
  User.find(function(err, products) {
    if (err) return next(err);
    res.json(products);
  });
});

/* GET ALL Groups */
router.get("/group", function(req, res, next) {
  // console.log("ddd");
  Group.find(function(err, products) {
    if (err) return next(err);
    res.json(products);
  });
});

/* GET ALL Channels */
router.get("/channel", function(req, res, next) {
  let groupId = req.query.groupId;
  Channel.find({ group: groupId }, function(err, products) {
    if (err) return next(err);
    res.json(products);
  });
});

/** get user information*/
router.get("/user/:userId", (req, res, next) => {
  const id = req.params.userId;
  User.findById(id)
    .populate("groups", "groupName _id")
    .populate("channels", "channelName _id")
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          userInfo: doc
        });
      } else {
        res.status(404).json({
          message: "No valid entry found for provided ID"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

/** delete user */
router.get("/user/delete/:userId", (req, res, next) => {
  console.log("delete user");
  User.findById(req.params.userId, function(err, user) {
    return user.remove(function(err) {
      if (!err) {
        // Group.update(
        //   { _id: { $in: user.groups } },
        //   { $pull: { members: user._id } },
        //   function(err, numberAffected) {
        //     console.log(numberAffected);
        //   }
        // );
        Channel.update(
          { _id: { $in: user.channels } },
          { $pull: { members: user._id } },
          function(err, numberAffected) {
            console.log(numberAffected);
          }
        );
        res.status(200).json({
          message: "user deleted"
        });
      } else {
        res.status(500).json({
          error: err
        });
      }
    });
  });
});

/** create new user*/
router.post("/user", (req, res, next) => {
  User.find({ username: req.body.username })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "user exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              // _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              username: req.body.username,
              // superAdmin: false,
              type: req.body.type,
              password: hash,
              groups: [],
              channels: []
            });
            user
              .save()
              .then(result => {
                res.status(201).json({
                  message: "User created",
                  userInfo: result
                });
                // Group.update(
                //   { _id: req.body.groupId },
                //   { $push: { members: { _id: result._id } } }
                // )
                //   .exec()
                //   .then(result => {
                //     console.log("group update");
                //   });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

/** change user type */
router.post("/user/changetype", (req, res, next) => {
  let type = req.body.type;
  let username = req.body.username;
  console.log("changetype");
  console.log(req);
  User.updateOne({ username: username }, { $set: { type: type } }, function(
    err,
    numberAffected
  ) {
    console.log(err);
  });
});

/** User sign up, for super admin creation only, will be remove from UI */
router.post("/signup", (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Mail exists"
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          if (err) {
            return res.status(500).json({
              error: err
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              username: req.body.username,
              password: hash,
              superAdmin: true,
              groups: [],
              channels: []
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "User created",
                  createdUser: {
                    _id: result._id,
                    username: result.username,
                    email: result.email
                  }
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          }
        });
      }
    });
});

router.get("/logout", (req, res, next) => {
  delete req.session.authenticated;
  delete req.session.username;
  delete req.session.userId;
  delete req.session.type;
});

/** User login */
router.post("/login", (req, res, next) => {
  User.find({ username: req.body.username })
    .populate("channels", "_id channelName")
    .populate("groups", "_id groupName")
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          req.session.authenticated = true;
          req.session.username = req.body.username;
          req.session.userId = user[0]._id;
          req.session.type = user[0].type;
          return res.status(200).json({
            message: "Auth successful",
            userInfo: {
              userId: user[0]._id,
              username: user[0].username,
              type: user[0].type,
              // superAdmin: user[0].superAdmin,
              channels: user[0].channels,
              groups: user[0].groups
            }
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

/** create new group */
router.post("/groups", (req, res, next) => {
  Group.find({ groupName: req.body.name })
    .exec()
    .then(group => {
      if (group.length >= 1) {
        return res.status(409).json({
          message: "group exists"
        });
      } else {
        const group = new Group({
          // _id: new mongoose.Types.ObjectId(),
          name: req.body.name,
          admin: req.body.userId,
          members: []
        });
        console.log(group);
        group
          .save()
          .then(result => {
            console.log(result);
            res.status(201).json({
              message: "Created group successfully",
              createdGroup: {
                groupName: result.groupName,
                _id: result._id,
                admin: result.admin,
                members: result.members
              }
            });

            User.update(
              { _id: req.body.userId },
              { $push: { groups: result._id } }
            )
              .exec()
              .then(result => {
                console.log("user information update");
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err
                });
              });
          })
          .catch(err => {
            console.log(err);
            res.status(500).json({
              error: err
            });
          });
      }
    });
});

/** GET group by id */
router.get("/groups/:groupId", (req, res, next) => {
  const id = req.params.groupId;
  Group.findById(id)
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          group: doc
        });
      } else {
        res.status(404).json({
          message: "No valid entry found for provided ID"
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

/** add group member*/
router.post("/groups/addUser", (req, res, next) => {
  const userId = req.body.userId;
  const groupId = req.body.groupId;
  Group.update({ _id: groupId }, { $push: { members: { _id: userId } } })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "group members update"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  User.update({ _id: userId }, { $push: { groups: { _id: groupId } } })
    .exec()
    .then(result => {
      console.log("user information updated");
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

/** update group admin*/
router.post("/groups/update", (req, res, next) => {
  const userId = req.body.userId;
  const groupId = req.body.groupId;
  Group.update({ _id: groupId }, { $set: { admin: { _id: userId } } })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "group admin update"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

/** delete group by id */
router.get("/groups/delete/:groupId", (req, res, next) => {
  const id = req.params.groupId;
  Group.findById(id, function(err, group) {
    return group.remove(function(err) {
      if (!err) {
        User.update(
          { _id: { $in: group.members } },
          { $pull:  group._id },
          function(err, numberAffected) {
            console.log(numberAffected);
          }
        );
        Channel.remove({ group: group._id }, function(err, numberAffected) {
          console.log(numberAffected);
        });
        res.status(200).json({
          message: "group deleted"
        });
      } else {
        res.status(500).json({
          error: err
        });
      }
    });
  });
});

//OK
/** add exist user to channel*/
router.post("/channel/add", (req, res, next) => {
  const channelId = req.body.channelId;
  const userId = req.body.userId;
  Channel.updateOne({ _id: channelId }, { $push: { members: { _id: userId } } })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User has been added to channel"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  User.update({ _id: userId }, { $push: { channels: { _id: channelId } } })
    .exec()
    .then(result => {
      console.log("channel has been added to user");
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

/** Delete user from channel*/
router.post("/channel/delete", (req, res, next) => {
  const channelId = req.body.channelId;
  const userId = req.body.userId;
  console.log(channelId);
  console.log(userId);
  Channel.update({ _id: channelId }, { $pull: { members: userId } })
    .exec()
    .then(result => {
      console.log(result);
      console.log("channel updated");
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  User.updateOne({ _id: userId }, { $pull: { channels:channelId } })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: "User has been removed from channel"
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

//[TODO] bug:
/** create new channel*/
router.post("/channel", (req, res, next) => {
  const channel = new Channel({
    // _id: new mongoose.Types.ObjectId(),
    group: req.body.group,
    name: req.body.channelName,
    members: [req.body.userId],
    conversation: []
  });
  channel
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: "Created channel successfully",
        createdChannel: {
          channelName: result.name,
          _id: result._id
        }
      });
      Group.update(
        {_id:req.body.group},{$push:{members:result._id}}
      ).exec().then(result => console.log(result));
      User.update(
        { _id: req.body.userId },
        { $push: { channels: { _id: result._id } } }
      )
        .exec()
        .then(result => {
          console.log("channel has been added to user");
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            error: err
          });
        });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});

/** GET channel by id */
router.get("/channel/:channelId", (req, res, next) => {
  const id = req.params.channelId;
  Channel.findById(id)
    .exec()
    .then(doc => {
      console.log("From database", doc);
      if (doc) {
        res.status(200).json({
          channel: doc
        });
      } else {
        res
          .status(404)
          .json({ message: "No valid entry found for provided ID" });
      }
    })
    .catch(err => {
      console.log("ddd");
      console.log(err);
      res.status(500).json({ error: err });
    });
});

/** Delete channel by id*/
router.get("/channel/delete/:channelId", (req, res, next) => {
  const id = req.params.channelId;
  Channel.findById(id, function(err, channel) {
    return channel.remove(function(err) {
      if (!err) {
        User.update(
          { _id: { $in: channel.members } },
          { $pull: channel._id  },
          function(err, numberAffected) {
            console.log(numberAffected);
          }
        );
        Group.update({ _id: id }, { $pull: id }, function(
          err,
          numberAffected
        ) {
          console.log(numberAffected);
        });
        res.status(200).json({
          message: "channel deleted"
        });
      } else {
        res.status(500).json({
          error: err
        });
      }
    });
  });
});

module.exports = router;
