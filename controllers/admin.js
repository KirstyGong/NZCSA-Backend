const User = require('../models/User');
const Event = require('../models/Events');
const ErrorResponse = require('../utils/errorResponse');

exports.shwoEventUserInfo = async (req, res, next) => {
  const { eventId } = req.body;
  try {
    const { isAdmin } = req.user;

    if (!isAdmin) {
      return next(new ErrorResponse('You are not admin', 401));
    }
    const event = await Event.findOne({ _id: eventId });

    if (!event) {
      return next(new ErrorResponse('Event not found', 401));
    }

    console.log(event);
    res.send(event.userList);
  } catch (e) {
    next(e);
  }
};

exports.showMemberList = async (req, res, next) => {
  try {
    const { isAdmin } = req.user;
    if (!isAdmin) {
      return next(new ErrorResponse('You are not admin', 401));
    }
    await User.find({}, (error, users) => {
      const userMap = [];
      users.forEach((user) => {
        userMap.push(user);
      });
      res.send(userMap);
    });
  } catch (e) {
    next(e);
  }
};

exports.promoToMember = async (req, res, next) => {
  const { userId } = req.body;

  try {
    const { isAdmin } = req.user;

    if (!isAdmin) {
      return next(new ErrorResponse('You are not admin', 401));
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return next(new ErrorResponse('User not found', 400));
    }

    if (user.isMembership) {
      return next(new ErrorResponse('User is already a member', 400));
    }

    user.isMembership = true;

    await user.save();

    res.status(200).json({
      success: true,
      info: `${userId} has been promoted to membership`,
    });
  } catch (e) {
    next(e);
  }
};

exports.deleteMember = async (req, res, next) => {
  const { userId } = req.params;

  try {
    const { isAdmin } = req.user;

    if (!isAdmin) {
      return next(new ErrorResponse('You are not admin', 401));
    }

    const user = await User.findOne({ _id: userId });

    if (!user) {
      return next(new ErrorResponse('User not found', 400));
    }

    await User.findByIdAndRemove(userId, (error, data) => {
      if (error) {
        return next(error);
      }
      res.status(200).json({
        success: true,
        data: `${userId} Deleted.`,
      });
    });
  } catch (e) {
    next(e);
  }
};