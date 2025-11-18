import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({

    firstName: {
        type: String,
        trim: true,
        minlength: [2, 'firsname can not be less than 2 characters']
    },

    lastName: {
        type: String,
        trim: true,
        minlength: [2, 'lastname can not be less than 2 characters']
    },
    
    profilePicture: {
        type: String,
        default: 'https://via.placeholder.com/150',
    },

    gender: {
        type: String,
        enum: ['MALE', 'FEMALE', 'OTHER'],
    },

    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: [true, 'Email already exists'],
        trim: true,
    },
    
    phone: {
        type: String,
        unique: [true, 'Phone number already exists'],
        required: [true, 'phone number is required'],
        trim: true,
    },

    emailVerificationStatus: {
        type: String,
        default: 'PENDING',
    },
    
    defaultGeoLocation: {
        type: {
            type: String,
            default: 'Point',
        },
        coordinates: {
            type: [Number],
        },
    },

    currentGeoLocation: {
        type: {
            type: String,
            default: 'Point',
        },
        coordinates: {
            type: [Number],
        },
    },
    
    password: {
        type: String,
        required: true,
    },
    
    isSuspended: {
        type: Boolean,
        default: false,
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const UserModel = mongoose.model('User', userSchema);

export default UserModel;