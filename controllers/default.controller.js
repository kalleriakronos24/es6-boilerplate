/**
 * @description import all controller in your application in here
 */
import FoodController from './food.controller';

class Controller {
    food() {
        return new FoodController();
    }
}


export default Controller;