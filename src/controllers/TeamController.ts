
import { Router, Request, Response, NextFunction } from "express";

import Team from "../models/Team";





class TeamController {

    router: Router;


    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.get( '/', this.getTeams );
    }



    public getTeams(req: Request, res: Response, next: NextFunction) {
        const userId = req.app.get( "user" )._id;

        Team.find( { owner: userId } )
            .then( teams => {
                res.status( 200 ).json( { success: true, teams } );
            })
            .catch( next );
    }






}



export default new TeamController().router;