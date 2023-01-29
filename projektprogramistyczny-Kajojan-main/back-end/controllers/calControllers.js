const User = require("../models/user");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { options, use } = require("../routes/cal");
const user = require("../models/user");
const multer = require("multer");

const storagee = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    cb(null, "./files");
  },
  filename: (req, file, cb) => {
    console.log(file);
    cb(null, Date.now() + file.originalname);
  },
});

const upload = multer({ storage: storagee });

const file = async (req, res) => {
  res.send(req.file.filename);
};

const getCallendars = async (req, res) => {
  const { user_id } = req.params;
  const cals = await User.find({ user_id: user_id }, { callendars: 1, _id: 0 });

  res.status(200).json(cals);
};

// const getAllEvents = async (req, res) => {
//   const { user_id, cal_id } = req.params;
//   const cal = await User.find(
//     { user_id: user_id },
//     { _id: 0, callendars: { $elemMatch: { cal_id: cal_id } } }
//   );

//   res.status(200).json(cal);
// };

const getAllEvents = async (req, res) => {
  const { user_id, cal_id } = req.params;
  const cal = await User.aggregate([
    {
      $match: {
        user_id: user_id,
        "callendars.cal_id": cal_id,
      },
    },
    {
      $project: {
        callendars: {
          $filter: {
            input: "$callendars",
            as: "calendar",
            cond: {
              $eq: [
                "$$calendar.cal_id",
                cal_id
              ],
            },
          },
        },
      },
    },
    {
      $project: {
        events: {
          $map: { input: "$callendars.cal", as: "event", in: "$$event" },
        },
      },
    },
  ]);
  res.status(200).json(cal);
};

const createUser = async (req, res) => {
  const { user_id, name, lastname, email, password } = req.body;
  const salt = await bcrypt.genSalt();
  const passwordHash = await bcrypt.hash(password, salt);

  const token = jwt.sign(
    {
      user: user_id,
    },
    process.env.JWT_SECRET
  );

  const userCkeck = await User.find({ email: email });
  if (userCkeck.length == 0) {
    try {
      const user = await User.create({
        user_id,
        name,
        lastname,
        email,
        password: passwordHash,
      });
      res
        .cookie("token", token, {
          httpOnly: true,
        })
        .send();
    } catch (error) {
      res.json({ status: "error", error: "Duplicate email" });
    }
  } else {
    res.json({ status: "error", error: "Duplicate email" });
  }
};

const deleteEvent = async (req, res) => {
  const { user_id, cal_id, month_id, day_id, event_id } = req.params;
  const num = parseInt(month_id, 10);
  const num2 = parseInt(day_id, 10);

  const cal = await User.updateMany(
    {},
    {
      $unset: {
        ["callendars.$[element].cal." +
        num +
        "." +
        num2 +
        ".event." +
        event_id]: "",
      },
    },
    { arrayFilters: [{ "element.cal_id": cal_id }] }
  );
  const dayData = await User.aggregate([
    { $match: { user_id: user_id } },
    {
      $project: {
        _id: 0,
        cal: {
          $filter: {
            input: "$callendars",
            as: "cal",
            cond: { $eq: ["$$cal.cal_id", cal_id] },
          },
        },
      },
    },
  ]);

  const allcall = await User.find(
    { user_id: user_id },
    { callendars: 1, _id: 0 }
  );
  res.status(200).json({ event: dayData[0].cal[0], allcal: allcall });
};

const addEvent = async (req, res) => {
  const { user_id, cal_id, month_id, day_id, event_id } = req.params;
  const event = req.body;
  console.log(event);
  const cal = await User.updateMany(
    {},
    {
      $push: {
        ["callendars.$[element].cal." + month_id + "." + day_id + ".event"]:
          event,
      },
    },
    { arrayFilters: [{ "element.cal_id": cal_id }] }
  );

  const dayData = await User.aggregate([
    { $match: { user_id: user_id } },
    {
      $project: {
        _id: 0,
        cal: {
          $filter: {
            input: "$callendars",
            as: "cal",
            cond: { $eq: ["$$cal.cal_id", cal_id] },
          },
        },
      },
    },
  ]);

  const allcall = await User.find(
    { user_id: user_id },
    { callendars: 1, _id: 0 }
  );
  console.log(allcall);
  res.status(200).json({ event: dayData[0].cal[0], allcal: allcall });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const check = await User.find({ email: email });
    if (check) {
      const paswordCorret = await bcrypt.compare(password, check[0].password);
      if (!paswordCorret) {
        return res.status(401).json({ message: "Wrong  password" });
      }
      const token = jwt.sign(
        {
          user: check[0].user_id,
        },
        process.env.JWT_SECRET
      );

      res
        .cookie("token", token, {
          httpOnly: true,
        })
        .status(200)
        .json(check);
    } else {
      res.status(401).json({ message: "Wrong Email od password" });
    }
  } catch {
    res.status(400).json({ error: "Wrong" });
  }
};

const loggedIn = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json(false);

    jwt.verify(token, process.env.JWT_SECRET);
    const data = await User.find({ user_id: jwt.decode(token).user });
    res.send({ status: true, data: data[0] });
  } catch (err) {
    res.json({ status: false });
  }
};

const logout = async (req, res) => {
  res
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(0),
      secure: true,
      sameSite: "none",
    })
    .send();
};

const addCal = async (req, res) => {
  const { user_id } = req.params;
  const { data, seUser_id, seUsersCal_id, role } = req.body;
  const check = await User.findOne({ user_id: user_id }, { lastname: 1 });
  if (check != null) {
    try {
      const user = await User.updateOne(
        { user_id: user_id },
        { $push: { callendars: data } }
      );
      if (seUser_id != null || seUsersCal_id != null) {
        const updateUsers = await User.updateMany(
          {},
          {
            $push: {
              ["callendars.$[element].users." + role]: [
                user_id,
                check.lastname,
              ],
            },
          },
          { arrayFilters: [{ "element.cal_id": seUsersCal_id }] }
        );
      }

      const dayData = await User.aggregate([
        { $match: { user_id: seUser_id } },
        {
          $project: {
            _id: 0,
            cal: {
              $filter: {
                input: "$callendars",
                as: "cal",
                cond: { $eq: ["$$cal.cal_id", seUsersCal_id] },
              },
            },
          },
        },
      ]);
      res.status(200).json(dayData[0]);
    } catch (error) {
      res.json({ status: "error", error: "User not find" });
    }
  } else {
    res.json({ status: "error", error: "User not find" });
  }
};

const deleteCal = async (req, res) => {
  const { user_id, cal_id } = req.params;
  // const cal = await User.updateOne(
  //   { "callendars.cal_id": cal_id},
  //   {
  //     $unset: {
  //       ["callendars." ]: "",
  //     },
  //   }
  // );
  const cal = await User.updateMany(
    {},
    { $pull: { callendars: { cal_id: cal_id } } }
  );

  const dayData = await User.find(
    { user_id: user_id },
    { callendars: 1, _id: 0 }
  );
  res.status(200).json(dayData);
};

const editevent = async (req, res) => {
  const { user_id, cal_id, month_id, day_id, event_id } = req.params;
  const event = req.body;
  console.log(event);
  const cal = await User.updateMany(
    {},
    {
      $set: {
        ["callendars.$[element].cal." +
        month_id +
        "." +
        day_id +
        ".event." +
        event_id]: event,
      },
    },
    {
      arrayFilters: [{ "element.cal_id": cal_id }],
    }
  );

  const dayData = await User.aggregate([
    { $match: { user_id: user_id } },
    {
      $project: {
        _id: 0,
        cal: {
          $filter: {
            input: "$callendars",
            as: "cal",
            cond: { $eq: ["$$cal.cal_id", cal_id] },
          },
        },
      },
    },
  ]);
  const allcall = await User.find(
    { user_id: user_id },
    { callendars: 1, _id: 0 }
  );
  res.status(200).json({ event: dayData[0].cal[0], allcal: allcall });
};

const deluser = async (req, res) => {
  const { user_id, cal_id, role, index } = req.params;

  const deletcal = await User.updateOne(
    { user_id: user_id },
    { $pull: { callendars: { cal_id: cal_id } } }
  );

  const cal = await User.updateMany(
    {},
    {
      $unset: {
        ["callendars.$[element].users." + role + "." + index]: "",
      },
    },
    { arrayFilters: [{ "element.cal_id": cal_id }] }
  );

  const allcall = await User.findOne({ "callendars.cal_id": cal_id });
  res.status(200).json(allcall.callendars.filter((a) => a.cal_id == cal_id));
};

const changerole = async (req, res) => {
  const { user_id, cal_id, role, index } = req.params;
  const newRole = req.body.role;
  const user = req.body.user;
  try {
    const cal = await User.updateMany(
      {},
      {
        $pull: {
          ["callendars.$[element].users." + role]: user,
        },
        $push: { ["callendars.$[element].users." + newRole]: user },
      },
      { arrayFilters: [{ "element.cal_id": cal_id }] }
    );

    const allcall = await User.findOne({ "callendars.cal_id": cal_id });

    res.status(200).json(allcall.callendars.filter((a) => a.cal_id == cal_id));
  } catch (error) {
    res.status(400).json(error);
  }
};

const raport = async (req, res) => {
  const { user_id } = req.params;

  const merge = (a, b) => {
    const mergedArray = [];

    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < b.length; j++) {
        if (a[i].cal_id === b[j]._id) {
          mergedArray.push({ ...a[i], ...b[j] });
        }
      }
    }
    return mergedArray;
  };
  try {
    const users = await User.aggregate([
      { $match: { user_id: user_id } },
      { $unwind: "$callendars" },
      {
        $group: {
          _id: "$callendars.cal_id",
          count_admin: {
            $sum: {
              $size: {
                $filter: {
                  input: "$callendars.users.admin",
                  as: "user",
                  cond: { $ne: ["$$user", null] },
                },
              },
            },
          },
          count_reader: {
            $sum: {
              $size: {
                $filter: {
                  input: "$callendars.users.reader",
                  as: "user",
                  cond: { $ne: ["$$user", null] },
                },
              },
            },
          },
          count_spec: {
            $sum: {
              $size: {
                $filter: {
                  input: "$callendars.users.spec",
                  as: "user",
                  cond: { $ne: ["$$user", null] },
                },
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          cal_id: "$_id",
          count_admin: 1,
          count_reader: 1,
          count_spec: 1,
        },
      },
    ]);
    const event = await User.aggregate([
      { $match: { user_id: user_id } },
      { $unwind: "$callendars" },
      { $unwind: "$callendars.cal" },
      {
        $group: {
          _id: "$callendars.cal_id",
          eventCount: {
            $sum: {
              $reduce: {
                input: {
                  $filter: {
                    input: "$callendars.cal.event",
                    cond: { $ne: ["$$this", null] },
                  },
                },
                initialValue: 0,
                in: { $add: ["$$value", { $size: "$$this" }] },
              },
            },
          },
        },
      },
    ]);
    //

    res.status(200).json(merge(users, event));
  } catch {
    res.status(400);
  }
};

module.exports = {
  raport,
  createUser,
  getCallendars,
  getAllEvents,
  deleteEvent,
  addEvent,
  login,
  addCal,
  deleteCal,
  editevent,
  logout,
  loggedIn,
  deluser,
  changerole,
  file,
  upload,
};
