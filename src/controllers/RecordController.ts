

import { Router, Request, Response, NextFunction } from "express";

import Blocker from "../models/Blocker";
import Record from "../models/Record";
import Log from "../models/Log";


class RecordController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }



    public routes() {
        this.router.delete( "/delete", this.deleteRecord );
        this.router.post( "/create", this.createRecord );
        this.router.put( "/edit", this.editRecord );
        this.router.get( "/:id", this.getRecords );
    }



    public createRecord(req: Request, res: Response, next: NextFunction) {
        const { name, owner } = req.body;

        console.info( "name" );
        console.info( name );

        console.info( "owner" );
        console.info( owner );

        const record = new Record({
            name: name,
            owner: owner
        });

        record.save()
            .then( () => res.send( { success: true, record: record, message: "Record " + name + " successfully created."   } ) )
            .catch( next );
    }



    public editRecord(req: Request, res: Response, next: NextFunction) {
        const { recordId, name } = req.body;

        Record.findByIdAndUpdate( recordId, { name } )
            .then( () => {
                return Blocker.update( { record: recordId }, { label: name }, { multi: true } );
            })
            .then( () => res.send( { success: true, message: "Record successfully updated." } ) )
            .catch( next );
    }



    public deleteRecord(req: Request, res: Response, next: NextFunction) {
        const recordId: string = req.params.id;

        console.log( "Delete record request arrived for record " + recordId );

        Record.findByIdAndRemove( recordId )
            .then( () => res.send( { success: true, message: "Record successfully deleted." } ) )
            .catch( next );
    }



    public getRecords(req: Request, res: Response, next: NextFunction) {
        const userId: string = req.params.id;

        console.log( "Get records request arrived." );

        Record.find( { owner: userId } )
            .then( (records) => {

                let promises = [];

                let userRecords = [];

                for ( let i = 0; i < records.length; i++ ) {
                    userRecords.push( { record: records[i] } );

                    let p = Log.find({ record: records[i]._id })
                        .populate( "Notes" )
                        .then( (logs) => {
                            userRecords[i].logs = logs;
                        });

                    promises.push( p );
                }


                Promise.all( promises )
                    .then( () => {
                        console.log( "userRecords" );
                        console.log( userRecords );

                        res.send( {
                            success: true,
                            userRecords: userRecords
                        } );
                    });

            });
    }



}



export default new RecordController().router;