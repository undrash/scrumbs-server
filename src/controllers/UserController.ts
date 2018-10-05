

import { Router, Request, Response, NextFunction } from "express";

import Record from "../models/Record";
import {IUser} from "../models/IUser";
import User from "../models/User";
import Log from "../models/Log";






class UserController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }


    public login( req: Request, res: Response, next: NextFunction ) {

        console.info( "Login request arrived." );

        const email: string = req.body.email;
        const password: string = req.body.password;

        console.info( "Email: " + email );
        console.info( "Password: " + password );


        User.findOne( { email: email } )
            .then( (user: IUser) => {

                if ( ! user ) {
                    res.send( { success: false, message: "The email provided is not registered." } );
                    return;
                }

                user.comparePassword( password, (err, isMatch) => {
                    if ( err ) throw err;

                    if ( isMatch ) {

                        res.send( {
                            success: true,
                            message: user.email + " logged in successfully with password " + password,
                            userId: user._id,
                            firstName: user.firstName,
                            lastName: user.lastName,
                            email: user.email,
                        } );

                    } else {
                        res.send( { success: false, message: "Invalid password for user: " + user.email } );
                    }
                })
            })


    }




    public routes() {
        this.router.post( "/login", this.login );
    }


}


const userController: UserController = new UserController();
userController.routes();

export default userController.router;
