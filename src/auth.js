
import Resource from './resource';

class AuthResource extends Resource {
    constructor(uri, gateway, headers={}, timeout=REQUEST_TIMEOUT){
        super(uri, gateway, headers, timeout)

    }
    get user(){ 

    }

    signIn(credentials){

    }
    signOut(){
        
    }
}