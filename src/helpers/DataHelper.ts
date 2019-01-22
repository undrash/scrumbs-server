

import { Router, Request, Response, NextFunction } from "express";
import * as mongoose from "mongoose";






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
    }



    public drop(req: Request, res: Response, next: NextFunction) {
        console.info("Collections drop has been initiated." );
    }

}



export default new DataHelper().router;
