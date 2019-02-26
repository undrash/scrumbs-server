
import { Request, Response, NextFunction } from "express";





export default (req: Request, res: Response, next: NextFunction) => {
    if ( ! req.app.get( "user" )._id ) {
        return res.status( 401 ).json( { success: false, message: "Authentication required." } );
    }

    next();
};