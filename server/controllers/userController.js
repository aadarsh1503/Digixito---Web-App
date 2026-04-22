import User from "../models/User.js";
import Task from "../models/Task.js";

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: "user" }).select("-password").sort({ createdAt: -1 });

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const [total, todo, inProgress, done] = await Promise.all([
          Task.countDocuments({ user: user._id }),
          Task.countDocuments({ user: user._id, status: "todo" }),
          Task.countDocuments({ user: user._id, status: "in-progress" }),
          Task.countDocuments({ user: user._id, status: "done" }),
        ]);
        return { ...user.toObject(), taskStats: { total, todo, inProgress, done } };
      })
    );

    res.json(usersWithStats);
  } catch (err) {
    next(err);
  }
};
