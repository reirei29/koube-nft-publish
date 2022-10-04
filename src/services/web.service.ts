import http from 'http';
import express, { Express } from "express"
import BaseCommon from "../commons/base.common"
import {apiRoutes} from "../routes/api.route"

export default class WebService extends BaseCommon{
    private router: Express;
    private httpServer: any;

    constructor() {
        super("Web Service")
        this.router = express()

        this.router.use(express.urlencoded({ extended: false }));
        this.router.use(express.json());
        /*tthis.router.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', '*');
            res.header('Access-Control-Allow-Headers', 'origin, X-Requested-With,Content-Type,Accept, Authorization');
            if (req.method === 'OPTIONS') {
                res.header('Access-Control-Allow-Methods', 'GET PATCH DELETE POST');
                return res.status(200).json({});
            }
            next();
        });*/
        
        this.router.use(express.static(__dirname + '/public'))

        this.router.use('/api', apiRoutes)

        this.router.use((req, res, next) => {
            let error = new Error('URL NOT FOUND');
            return res.status(404).json({
                message: error.message
            });
        });
    }

    public StartListen(port:number) {
        this.httpServer = http.createServer(this.router)
        this.httpServer.listen(port, ()=> this.logInfo(`The server is running on port ${port}`))
    }

}