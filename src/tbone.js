import 'es6-promise/auto';

const STATE = {
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
}

import Gateway from './gateway';
import Resource from './resource'; 

class TBone {
    static get gateway(){
        return null;
    }
    static initialize({uri}){
        _gateway = new Gateway();

    }

    static resource(uri){
        return new Resource(uri, _gateway);
    }

    static authenticate(data){

    }
}


/*

// initialize at the start of the app
tbone.initialize(config); 

// create resource
var resource = tbone.resource('/api/chatrooms/room/')

// resource get
tbone.resource('/api/chatrooms/room/').get().then((data) => {
    
});

// resource post
tbone.resource('/api/chatrooms/room/').post({
    name: 'food',
    title: 'I am so hungry'
}).then((data)=> {
    
});

// listen to updates
tbone.resource('/api/chatrooms/room').on('resource_create', (data)=>{
    
})

// authenticate
tbone.authenticate(data).then(() => {
    
})


*/
