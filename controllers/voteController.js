const User = require('../models/User');

exports.voteLeader = async (req, res) => {
  try {
    const leader = await User.findById(req.params.id);
    if (!leader) return res.redirect('/leaders');

    if (!leader.votes.includes(req.user._id)) {
      leader.votes.push(req.user._id);
      await leader.save();
    }

    res.redirect('/leaders');
  } catch (err) {
    console.error(err);
    res.redirect('/leaders');
  }
};

exports.listLeaders = async (req, res) => {
  try {
    const users = await User.find().sort({ 'votes.length': -1 });
    res.render('leaders', { users, user: req.user });
  } catch (err) {
    console.error(err);
    res.redirect('/');
  }
};
