import Model from '../models/default.model';

class FoodController extends Model {
    async getHome(req, res, next) {
        return res.json({
            api: 'live'
        })
    }
    async addFood(req, res) {
        const { name } = req.body;
        const foodModel = super.food();

        foodModel.create({
            name
        }, (err, res) => {
            console.log('Err:: ', err)
            console.log('Result:: ', res)
        })

        return res.json({
            msg: 'success',
            error: false
        })
    }
}

export default FoodController;