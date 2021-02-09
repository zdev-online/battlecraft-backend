const _route    = require('express').Router();
const User      = require('../database/models/User');
const jwt       = require('../utils/jwt');

_route.post('/:id', (req, res) => {
    try {
        let user = await User.findOne({ where: { id: req.params.id } });
        if(!user){ return res.status(404).json({ message: 'User not found!' }); }
        delete user.password;
        delete user.donateMoney;
        delete user.username;
        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: 'Server error' });
    }
});
_route.post('/changepassword', async (req, res) => {
    try {
        if(!req.body){ return res.status(400).json({ message: 'Password empty' }); }
        if(!req.body.new_password){ return res.status(400).json({ message: 'Password invalid' }); }
        if(!req.body.new_password){ return res.status(400).json({ message: 'Password invalid' }); }
        if(!req.body.old_password){ return res.status(400).json({ message: 'Old Password empty' }); }
        if(!req.body.old_password.length){ return res.status(400).json({ message: 'Old Password invalid' }); }
        if(!req.body.old_password_accept){ return res.status(400).json({ message: 'Old Password invalid' }); }
        if(!req.body.old_password_accept.length){ return res.status(400).json({ message: 'Old Password invalid' }); }
        if(req.old_password != req.old_password_accept){ return res.status(400).json({ message: "Old password invalid" })}
        let user    = await User.findOne({ where: { username: req.user.username } });
        if(user.checkPassword(req.body.new_password)){ return res.status(400).json({ message: "Passwords equals" }); }
        user.password = req.body.new_password;
        await user.save();
        let token   = jwt.getToken({ user: user.toJSON() });
        return res.json({ token, user: user.toJSON() });
    } catch (error) {
        return res.status(500).json({ message: "Couldn't change password" });
    }
});
_route.post('/changeskin', (req, res) => {});

module.exports = _route;