

import { Router, Request, Response, NextFunction } from "express";
import Member from "../models/Member";





class MemberController {

    router: Router;


    constructor() {
        this.router = Router();
        this.routes();
    }


    public routes() {
        this.router.get( '/', this.getMembers );
    }



    public getMembers(req: Request, res: Response, next: NextFunction) {
        const userId = req.app.get( "user" )._id;

        Member.find( { owner: userId } )
            .populate( "teams" )
            .then( members => res.status( 200 ).json( { success: true, members } ) )
            .catch( next );
    }






}



export default new MemberController().router;