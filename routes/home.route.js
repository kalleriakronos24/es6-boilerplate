import { Router } from 'express'

const router = Router();

class HomeRouter {
    route() {
        return [
            router.get('/id', (req, res) => {
                return res.send('helo bud')
            })
        ]
    }
}

export {
    HomeRouter
};