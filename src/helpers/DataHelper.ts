

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
            name: "Andrei Gaspar",
            email: "andrei@planeeet.com",
            password: "asd123"
        });

        const team1 = new Team({
            name: "Scrum Team",
            owner: andrei,
            isDefault: true
        });


        const memberStephen = new Member({
            name: "Stephen Hodges",
            owner: andrei
        });


        const noteStephen1 = new Note({
            owner: andrei,
            member: memberStephen,
            content: "John note 1"
        });


        const noteStephen2 = new Note({
            owner: andrei,
            member: memberStephen,
            content: "John note 2"
        });

        memberStephen.teams.push( team1._id );
        memberStephen.notes.push( noteStephen1._id );
        memberStephen.notes.push( noteStephen2._id );


        const memberLee = new Member({
            name: "Lee Simon",
            owner: andrei
        });

        memberLee.teams.push( team1._id );


        const memberVictoria = new Member({
            name: "Victoria Terry",
            owner: andrei
        });

        memberVictoria.teams.push( team1._id );


        const memberEstelle = new Member({
            name: "Estelle Cruz",
            owner: andrei
        });

        memberEstelle.teams.push( team1._id );


        const memberSteve = new Member({
            name: "Steve Cannon",
            owner: andrei
        });

        memberSteve.teams.push( team1._id );


        const memberGordon = new Member({
            name: "Gordon Hunt",
            owner: andrei
        });

        memberGordon.teams.push( team1._id );


        const memberCharles = new Member({
            name: "Charles Hughes",
            owner: andrei
        });

        memberCharles.teams.push( team1._id );


        const memberIsabel = new Member({
            name: "Isabel Estrada",
            owner: andrei
        });

        memberIsabel.teams.push( team1._id );


        const team2 = new Team({
            name: "Echipa Racheta",
            owner: andrei
        });

        const memberChiki = new Member({
            name: "Chiki Chan",
            owner: andrei
        });

        memberChiki.teams.push( team2._id );

        const memberJocka = new Member({
            name: "Jocka Mester",
            owner: andrei
        });

        memberJocka.teams.push( team2._id );

        Promise.all([
            andrei.save(),
            team1.save(),
            team2.save(),
            memberStephen.save(),
            noteStephen1.save(),
            noteStephen2.save(),
            memberLee.save(),
            memberVictoria.save(),
            memberEstelle.save(),
            memberSteve.save()
        ])
            .then( () => Promise.all([
                        memberGordon.save(),
                        memberCharles.save(),
                        memberIsabel.save(),
                        memberChiki.save(),
                        memberJocka.save()
                ]))
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
