import  'es6-promise/auto';

import Gateway from './gateway';
import Resource from './resource'; 

class TBone {
    constructor(){
        this._gateway = null;
        this._headers = {
            Authorization : "amitn"
        };
    }
    get gateway(){
        return this._gateway;
    }
    initialize(config){
        this._gateway = new Gateway(config);
        // await gateway.open();
        // load token from local storage
    }
    resource(url){
        return new Resource(url, this._gateway, this._headers);
    }
    authenticate(data){

    }
}
let tbone = new TBone();

export default tbone; 