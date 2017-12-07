import Gateway from './gateway';
import Resource from './resource'; 

class TBone {
    constructor(){
        this._gateway = null;
    }
    get gateway(){
        return this._gateway;
    }
    initialize({uri}){
        this._gateway = new Gateway(uri);

        // load token from local storage
    }
    resource(uri){
        return new Resource(uri, _gateway);
    }
    authenticate(data){

    }
}

export default tbone = new TBone();