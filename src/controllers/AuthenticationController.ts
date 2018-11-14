
import { Router, Request, Response, NextFunction } from "express";

import * as jwt from "jwt-simple";
import * as passport from "passport";
import * as moment from "moment";
import { Strategy, ExtractJwt } from "passport-jwt";
import { IUser } from "../models/interfaces/IUser";
import User from "../models/User";
import * as nodemailer from "nodemailer";
import * as fs from "fs";


class AuthenticationController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.post( "/login", this.login );
        this.router.post( "/sign-up", this.signUp );
        this.router.post( "/forgot", this.forgotPassword );
        this.router.get( "/reset/:token", this.getResetPassword );
        this.router.post( "/reset/:token", this.postResetPassword );
    }



    public initialize() {
        passport.use("jwt", this.getStrategy() );
        return passport.initialize();
    }



    public authenticate = (callback) => passport.authenticate("jwt", { session: false, failWithError: true }, callback );



    private login = async (req: Request, res: Response) => {

        try {
            let user = await User.findOne({ "email": req.body.email } ).exec();

            console.log( user );

            if ( user === null ) throw "User not found";

            let success = await user.comparePassword( req.body.password );

            console.log( "success: " + success );

            if ( success === false ) throw "";

            res.status( 200 ).json({
                success: true,
                userData: {
                    user: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName },
                tokenData: this.genToken( user )
            });

        } catch (err) {
            res.status( 401 ).json( { success: false, message: "Invalid credentials", errors: err } );
        }
    };



    private signUp = async (req: Request, res: Response, next: NextFunction) => {

        const { firstName, lastName, email, password, language } = req.body;

        if ( ! firstName || ! lastName || ! email || ! password || ! language ) {
            res.status( 400 ).json( { success: false, message: "Missing parameters at sign up." } );
            return;
        }

        const user = new User({
            firstName,
            lastName,
            email,
            password,
            language
        });

        user.save()
            .then( () => res.status( 200 ).json( {
                success: true,
                userData: {
                    user: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName },
                tokenData: this.genToken( user )
            }))
            .catch( next );

    };



    private forgotPassword = async (req: Request, res: Response, next: NextFunction) => {

        const { email } = req.body;

        User.findOne( { email } )
            .then( (user) => {

                
                if(!user&&email.user){

                }


                if ( ! user ) {
                    res.status( 404 ).json( { success: false, message: `The user associated with the email address ${ email } was not found in our database.` } );
                    return;
                }

                const smtpTransport = nodemailer.createTransport({
                    service: "Gmail",
                    auth: {
                        user: "gasparandr@gmail.com",
                        pass: process.env.GMAILPW,
                    }
                });

                const mailOptions = {
                    to: "akonradtomi@gmail.com",
                    subject: "Node.js Password Reset",
                    text: `Aasdasda dasdsa dasdasdas ${ req.headers.host }${ process.env.API_BASE }authentication/reset/${  this.genEmailToken( user ) }`
                };

                smtpTransport.sendMail( mailOptions, (err) => {
                    if ( err ) next( err );

                    console.log( "mail sent" );

                    res.status( 200 ).json( { success: true, message: `An e-mail has been sent to ${ user.email } with further instructions.` } );
                })

            })
            .catch( next );


    };



    private getResetPassword = async(req: Request, res: Response, next: NextFunction) => {
        const { token } = req.params;

        console.log( `Reset password token ${ token }` );

        res.sendFile( "reset-password.html",{ root: './templates' } );


    };



    private postResetPassword = async(req: Request, res: Response, next: NextFunction) => {
        const { token } = req.params;

        const { password, confirm } = req.body;



        console.log( `Reset password token ${ token }` );
        console.log( `Reset password is ${ password } and confirm is ${ confirm }`);

        res.sendFile( "reset-password.html",{ root: './templates' } );


    };



    private genToken(user: IUser): Object {

        let expires = moment().utc().add({ days: 7 }).unix();

        let token = jwt.encode({
            exp: expires,
            email: user.email
        }, process.env.JWT_SECRET );

        return {
            token: "JWT " + token,
            expires: moment.unix(expires).format()
        };


    }



    private genEmailToken(user: IUser): string {

        let expires = moment().utc().add({ hours: 1 }).unix();

        return jwt.encode({
            exp: expires,
            email: user.email
        }, process.env.EMAIL_SECRET );

    }



    private getStrategy(): Strategy {

        const params = {
            secretOrKey: process.env.JWT_SECRET,
            jwtFromRequest: ExtractJwt.fromAuthHeaderWithScheme("jwt"),
            passReqToCallback: true
        };

        return new Strategy(params, (req, payload: any, done) => {
            User.findOne({ "email": payload.email }, (err, user) => {

                if ( err ) {
                    return done(err);
                }

                if ( user === null ) {
                    return done( null, false, { message: "The user in the token was not found" } );
                }

                return done( null, { _id: user._id, email: user.email } );
            });
        });

    }

}


export default new AuthenticationController();