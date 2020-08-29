import { Router } from 'express'
import Controller from '../controllers/default.controller';

const router = Router();

class FoodRoute extends Controller {
    route() {
        return [
            router.get('/home', super.food().getHome),
            router.post('/add', super.food().addFood)
        ]
    }
}

export {
    FoodRoute
}