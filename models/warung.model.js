import mongoose from 'mongoose';


const warungSchema = new mongoose.Schema({
    name: String,
    address: {
        lat: Number,
        long: Number,
        addr: String,

    },
    offers: [],
    promotions: [],
    subscription: String
})