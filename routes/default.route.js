/**
 * @description import all route in your application in here
 */
import { FoodRoute } from './food.route';
import { HomeRouter } from './home.route'

class Route {
    route() {
        return [
            new FoodRoute().route(),
            new HomeRouter().route()
        ]
    }
}

export {
    Route
}