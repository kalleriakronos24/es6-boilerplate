import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true
    },
    thumb: {
        type: String
    },
    price: {
        type: Number
    },
    discount: {
        type: Number
    },
    imgCollection: [],
    description: {
        type: String
    },
    type: {
        type: String
    },
    by: {
        type: String
    },

})

const FoodSchema = mongoose.model('food', foodSchema);

export default FoodSchema;