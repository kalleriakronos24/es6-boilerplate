import http from 'http';
import morgan from 'morgan';
import express from 'express';
import bodyParser from 'body-parser';
import cluster from 'cluster';
require('dotenv').config();
import { Route } from '../routes/default.route'
import mongoose from 'mongoose';
import cors from 'cors';

process.on('unhandledRejection', (rejectionErr) => {
    // won't execute
    console.log('unhandledRejection Err::', rejectionErr);
    console.log('unhandledRejection Stack::', JSON.stringify(rejectionErr))
})

process.on('uncaughtException', (uncaughtExc) => {
    console.log('uncaughtException Err::', uncaughtExc);
    console.log('uncaughtException Stack::', JSON.stringify(uncaughtExc));
})

const app = express();
let workers = [];

class App extends Route {
    constructor() {
        super()
    }

    /**
    * Setup number of worker processes to share port which will be defined while setting up the server
    */

    setupWorkerProcesses() {
        // to read number of cores on system

        let numCores = require('os').cpus().length;
        console.log('Master cluster setting up ' + numCores + ' workers');

        // iterate on number of cores need to be utilized by an application
        // current example will utilize all of them

        for (let i = 0; i < numCores; i++) {
            // creating workers and pushing reference in an array
            // these references can be used to receive messages from workers

            workers.push(cluster.fork());

            //to receive messages from worker process

            workers[i].on('message', (msg) => {
                console.log(msg)
            })

        }

        // process is clustered on a core and process id is assigned
        cluster.on('online', (worker) => {
            console.log('Worker ' + worker.process.pid + ' is listening')
        })

        // if any of the worker process dies then start a new one by simply forking another one
        cluster.on('exit', (worker, code, signal) => {
            console.log('Worker ' + worker.process.pid + ' died with code: ' + code + ', and signal: ' + signal);
            console.log('Starting a new worker');
            workers.push(cluster.fork());
            // to receive messages from worker process
            workers[workers.length - 1].on('message', function (message) {
                console.log(message);
            });
        })
    }

    /**
    * Setup an express server and define port to listen all incoming requests for this application
    */

    setUpExpress() {
        // create server
        app.server = http.createServer(app);

        // logger
        app.use(morgan('tiny'));

        // parse application/json
        app.use(bodyParser.json({
            limit: '2000kb'
        }))
        app.use(bodyParser.urlencoded({ extended: false }))
        app.disable('x-powered-by')

        // cross origin configuration

        app.use(cors());
        app.use((req, res, next) => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
            if (req.method == 'OPTIONS') {
                return res.sendStatus(200);
            }
            next();
        });

        // routes
        app.use(super.route());

        // mongodb configuration
        mongoose.set('useNewUrlParser', true);
        mongoose.set('useFindAndModify', false);
        mongoose.set('useUnifiedTopology', true);

        /**
         * @description MongoDB connection
         */
        mongoose.connect(process.env.MONGO_URI)
            .then(() => {
                // start server
                app.server.listen('8000', () => {
                    console.log(`Started server on => http://localhost:${app.server.address().port} for Process Id ${process.pid}`);
                });
            })
            .catch((err) => {
                throw new Error(err)
            })



        // in case of an error
        app.on('error', (appErr, appCtx) => {
            console.error('app error', appErr.stack);
            console.error('on url', appCtx.req.url);
            console.error('with headers', appCtx.req.headers);
        });
    }



    /**
     * Setup server either with clustering or without it
     * @param isClusterRequired Boolean 
     * @constructor
     */

    setupServer(isClusterRequired) {

        // if it is a master process then call setting up worker process
        if (isClusterRequired && cluster.isMaster) {
            this.setupWorkerProcesses();
        } else {
            // to setup server configurations and share port address for incoming requests
            this.setUpExpress();
        }
    }
}





// run the server
new App().setupServer(true);

// export the app (incase for testing purposes)
export default App;