import EventEmitter from './emitter';

class Resource extends EventEmitter {
    constructor(uri, gateway){
        super();
        this._uri = uri;
        this._gateway = gateway;
    }

    get(data){

    }

    post(data){

    }

    put(data){

    }

    patch(data){

    }

    delete(data){

    }

}