
import { Router, Request, Response, NextFunction } from "express";

import Member from "../models/Member";
import Team from "../models/Team";





class TeamController {

    router: Router;


    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.get( '/', this.getTeams );
        this.router.post( '/', this.createTeam );
    }



    public getTeams(req: Request, res: Response, next: NextFunction) {
        const userId = req.app.get( "user" )._id;

        Team.find( { owner: userId } )
            .then( teams => {
                res.status( 200 ).json( { success: true, teams } );
            })
            .catch( next );
    }



    public createTeam = async (req: Request, res: Response, next: NextFunction) => {
        const userId = req.app.get( "user" )._id;

        const { name, members } = req.body;

        if ( ! name ) {
            res.status( 422 ).json( { success: false, message: "Name property is required at team creation." } );
            return;
        }

        const team = new Team({
            name,
            owner: userId
        });

        await team.save();

        Member.update(
            { _id: { $in: members } },
            {  $push: { teams: team._id } },
            { multi: true }
        )
            .then( members => res.status( 200 ).json( { success: true, team, members } ) )
            .catch( next );

    }



}



export default new TeamController().router;