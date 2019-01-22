

import { Router, Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";


import User from "../models/User";
import Team from "../models/Team";
import Member from "../models/Member";
import Note from "../models/Note";



class DataHelper {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.get( "/populate", this.populate );
        this.router.get( "/drop", this.drop );
    }



    public populate(req: Request, res: Response, next: NextFunction) {
        console.info("Collections populate has been initiated." );

        /** USER */
        const andrei = new User({
            firstName: "Andrei",
            lastName: "Gaspar",
            email: "andrei@planeeet.com",
            password: "asd123"
        });

        const team1 = new Team({
            name: "Scrum Team",
            owner: andrei,
            isDefault: true
        });


        const memberJohn = new Member({
            name: "John",
            owner: andrei
        });


        const noteJohn1 = new Note({
            owner: andrei,
            member: memberJohn,
            content: "John note 1"
        });


        const noteJohn2 = new Note({
            owner: andrei,
            member: memberJohn,
            content: "John note 2"
        });

        memberJohn.teams.push( team1._id );
        memberJohn.notes.push( noteJohn1._id );
        memberJohn.notes.push( noteJohn2._id );


        Promise.all([
            andrei.save(),
            team1.save(),
            memberJohn.save(),
            noteJohn1.save(),
            noteJohn2.save()
        ])
            .then( () => res.send( "Database successfully populated." ) )
            .catch( next );

    }



    public drop(req: Request, res: Response, next: NextFunction) {
        console.info("Collections drop has been initiated." );

        const { users, teams, members, notes, invitations } = mongoose.connection.collections;

        if ( ! users )          res.send( "Users collection not found" );
        if ( ! teams )          res.send( "Records collection not found" );
        if ( ! members )        res.send( "Logs collection not found" );
        if ( ! notes )          res.send( "Logs collection not found" );

        users.drop( () => {
            teams.drop( () => {
                members.drop( () => {

                    if ( ! invitations ) {
                        res.send( "Collections dropped" );
                    } else {
                        invitations.drop( () => {
                            res.send( "Collections dropped" );
                        })
                    }

                });
            });
        });

    }

}



export default new DataHelper().router;
