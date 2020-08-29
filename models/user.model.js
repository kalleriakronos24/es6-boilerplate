import mongoose from 'mongoose';

const userModel = new mongoose.Schema({
    fullname : {
        type : String
    },
    email : {
        type : String
    },
    password : {
        type : String
    },
    address : {
        type : String
    },
    isMembership : Boolean,
    membershipUntil : {
        type : String
    },
    accountCreated : {
        type : String
    },
    profilImg : String,
    bookmark : [],
    productPurchased : Number,
    isVerified : Boolean,
    orderHistory : [],
    activeOrder: []
})