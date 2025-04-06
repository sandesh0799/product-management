const mongoose = require("mongoose");
const bcrypt = require('bcryptjs')
const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }
},{
    timestamps: true,
})

userSchema.pre('save', async function (next) {
    if (this.isModified('email') && !validateEmail(this.email)) {
        return next(new Error('Invalid email format'));
    }
    next();
})

function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
}

const User = mongoose.model('User', userSchema);
module.exports = User;
