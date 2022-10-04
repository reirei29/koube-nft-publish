import Log4js from "log4js"
import Log4jsConfigure from "../config/log4js.json"

export default class BaseCommon{
    public logger:any

    constructor(_service_name:string) {
      Log4js.configure(Log4jsConfigure)
      this.logger = Log4js.getLogger(_service_name)

      //this.logInfo(`[${_service_name}] is inited`)
    }
    
    public logInfo(_msg:any) {
      this.logger.info(_msg)
    }

    public logDebug(_msg:any) {
      this.logger.debug(_msg)
    }

    public logError(_msg:any) {
      this.logger.error(_msg)
    }

    protected onError(_msg:any) {
      let datetime = new Date()
      this.logger.error(`${datetime} [onError]:${_msg}`)
    }

    protected onException(_msg:any){
      let datetime = new Date()
      this.logger.error(`${datetime} [onException]:${_msg}`)
    }

    protected onInfo(_msg:any){
      let datetime = new Date()
      this.logger.error(`${datetime} [onInfo]:${_msg}`)
    }
}