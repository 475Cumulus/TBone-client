import  'es6-promise/auto';

import Gateway from './gateway';
import Resource from './resource'; 

class TBone {
    constructor(){
        this._gateway = null;
        this._headers = {
            Authorization : "Token amitn"
        };
    }
    get gateway(){
        return this._gateway;
    }
    initialize(config){
        this._gateway = new Gateway(config);
        // await gateway.open();
        // load token from local storage

        this._gateway.on('websocket_open', (ws)=>{
            console.log('websocket is open', ws);
        });
        this._gateway.on('websocket_error', (err)=>{
            console.log('websocket error', err);
        });
        this._gateway.on('websocket_reconnect', ()=>{
            console.log('websocket reconnect');
        });
    }
    resource(url){
        return new Resource(url, this._gateway, this._headers);
    }
    authenticate(data){

    }
}
let tbone = new TBone();

export default tbone; 