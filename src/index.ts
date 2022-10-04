import WebService from "./services/web.service"
require('dotenv').config();

let webService = new WebService()

webService.StartListen(8022)