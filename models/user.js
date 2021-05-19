/* eslint-disable no-undef */
/* eslint-disable no-useless-escape */
const mongoose = require('mongoose');
const argon = require('argon2');
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
        required: true,
    },
    statusCode: {
        type: Number,
    },
    isEmailVerfied: {
        type: Boolean,
        default: false
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
UserSchema.pre('save', async function preSave(next) {
    this.password = await argon.hash(this.password);
    next();
});
//middleware to hash password before update function called if updated password
UserSchema.pre('findOneAndUpdate', async function preSave(next) {
    if (!this._update.password) {
        return;
    }
    this._update.password = argon.hash(this._update.password);
    next();
});
//function to verfiy hashed password with entered return true if equals
UserSchema.methods.validatePassword = function validatePassword(password) {
    return argon.verify(password, this.password);
};

const users = mongoose.model('User', UserSchema);
module.exports = users;