
require( "dotenv" ).config();

import * as compression from "compression";
import * as bodyParser from "body-parser";
import * as mongoose from "mongoose";
import * as express from "express";
import * as logger from "morgan";
import * as helmet from "helmet";
import * as cors from "cors";

import Authentication from "./controllers/AuthenticationController";
import BlockerController from "./controllers/BlockerController";
import RecordController from "./controllers/RecordController";
import UserController from "./controllers/UserController";
import NoteController from "./controllers/NoteController";
import DataHelper from "./helpers/DataHelper";





class Server {

    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
        this.errors();
    }



    public config() {

        const MONGO_URI = "mongodb://localhost/scrumbs-ts";

        mongoose.set( "useCreateIndex", true );
        mongoose.connect( MONGO_URI || process.env.MONGODB_URI, { useNewUrlParser: true } );


        this.app.use( bodyParser.urlencoded( { extended: true } ) );
        this.app.use( bodyParser.json() );
        this.app.use( logger( "dev" ) );
        this.app.use( compression() );
        this.app.use( helmet() );
        this.app.use( cors() );

        this.app.use( Authentication.initialize() );

        this.app.all( process.env.API_BASE + "*", (req, res, next) => {

            //TODO: Remove @ release
            if ( req.path.includes( process.env.API_BASE + "data/populate" ) ) return next();
            if ( req.path.includes( process.env.API_BASE + "data/drop" ) ) return next();


            if ( req.path.includes( process.env.API_BASE + "authentication/login" ) ) return next();
            if ( req.path.includes( process.env.API_BASE + "authentication/sign-up" ) ) return next();
            if ( req.path.includes( process.env.API_BASE + "authentication/forgot" ) ) return next();
            if ( req.path.includes( process.env.API_BASE + "authentication/reset" ) ) return next();

            return Authentication.authenticate( (err, user, info) => {

                if ( err ) { return next( err ); }

                if ( ! user ) {
                    if ( info.name === "TokenExpiredError" ) {
                        return res.status( 401 ).json( { message: "Your token has expired. Please generate a new one!" } );
                    } else {
                        return res.status( 401 ).json( { message: info.message } );
                    }
                }

                this.app.set( "user", user );

                return next();

            })(req, res, next);
        });

    }



    public routes() {
        let router: express.Router;
        router = express.Router();

        this.app.use( '/', router );

        this.app.use( process.env.API_BASE + "authentication/", Authentication.router );

        this.app.use( "/api/v1/blockers", BlockerController );
        this.app.use( "/api/v1/records", RecordController );
        this.app.use( "/api/v1/users", UserController );
        this.app.use( "/api/v1/notes", NoteController );
        this.app.use( "/api/v1/data", DataHelper );
    }



    public errors() {
        this.app.use( (err, req, res, next) => {
            res.status( 422 ).json( { success: false, message: err.message } );
        });
    }

}



export default new Server().app;