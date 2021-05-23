/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
const mongoose = require('mongoose');
const argon = require('argon2');
const jwt = require('jsonwebtoken');
const CustomError = require('../functions/errorHandler');
const crypto = require('crypto');

const { Schema } = mongoose;

const UserSchema = new Schema({
    firstName: {
        type: String,
        minlength: 3,
        maxlength: 30,
        required: true
    },
    lastName: {
        type: String,
        minlength: 3,
        maxlength: 30,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validator: {
            validate: function (v) {
                return /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(v);
            }
        }
    },
    phoneNumber: {
        type: String,
        unique: true,
        validator: {
            validate: function (v) {
                return /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(v);
            }
        }
    },
    password: {
        type: String,
        minlength: 8,
        required: true
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    address: {
        type: String,
    },
    dob: {
        type: Date
    },
    gender: {
        type: String
    },
    nationality: {
        type: String
    },
    wishList: [
        {
            type: Schema.Types.ObjectId,
            ref: 'products',
        }
    ],
    role: {
        type: String,
        enum: ['user', 'admin', 'vendor'],
        required: true,
    },
    statusCode: {
        type: Number,
    },
    isEmailVerfied: {
        type: Boolean,
        default: false
    },
    resetPasswordToken: {
        type: String,
    },

    resetPasswordExpires: {
        type: Date,
    }
}, {
    toJSON: {
        transform: (doc, ret) => {
            delete ret.password;
            return ret;
        },
        virtuals: true
    },
    toObject: {
        virtuals: true
    },
    versionKey: false,
    collection: 'users'
});

//return virtual data of user called id equals _id not saved in mongo database
UserSchema.virtual('id').get(function () {
    return this._id.toHexString();
});
//middleware to hash password before save function called
UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await argon.hash(this.password);
    next();
});
//middleware to hash password before update function called if updated password
UserSchema.pre('findOneAndUpdate', async function preSave(next) {
    if (!this._update.password) {
        return;
    }
    this._update.password = await argon.hash(this._update.password);
    next();
});
//function to verfiy hashed password with entered return true if equals
UserSchema.methods.validatePassword = async function (password) {
    return await argon.verify(this.password, password);
};
//function to Create Access Token
UserSchema.methods.generateTokenAccess = async function () {
    try {
        return token = jwt.sign({
            email: this.email,
            id: this.id
        },
            process.env.ACCESS_TOKEN_SECERT,
            { expiresIn: '1h' }
        );
    } catch (err) {
        new CustomError(err.toString(), 400);
    }
};
//function to Generate Passowrd Reset Token
UserSchema.methods.generatePasswordReset = async function () {
    this.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordExpires = Date.now() + 3600000; //expires in an hour
    this.save();
};

const users = mongoose.model('User', UserSchema);
module.exports = users;