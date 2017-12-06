import 'es6-promise/auto';
import EventEmitter from './emitter';

const REQUEST_TIMEOUT = 30000; // 30 seconds

class Response {
    constructor(status, payload){
        this.props = {status, payload}
        Object.freeze(this);
    }
    get status(){
        return this.props.status;
    }
    get payload(){
        return this.props.payload;
    }
}

class Resource extends EventEmitter {
    constructor(uri, gateway, timeout=REQUEST_TIMEOUT){
        super();
        this._uri = uri;
        this._gateway = gateway;
        this._timeout = timeout;
    }

    get(args){
        return this._make_request('GET', args);
    }

    post(args, body){
        return this._make_request('POST', args, body);
    }

    put(args, body){
        return this._make_request('POST', args, body);
    }

    patch(args, body){
        return this._make_request('POST', args, body);
    }

    delete(args, body){
        return this._make_request('POST', args, body);
    }

    _make_request(method, args, body){
        let generate_key = (length) =>{
            var text = '';
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for(var i = 0; i < length; i++) 
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        }
        return new Promise((resolve, reject) => {
            const req = {
                type: 'request',
                key: generate_key(12),
                href: this._uri,
                method, args, body,
            }
            if(this._gateway == null)
                reject(new Error('Gateway not available'));
    
            else if(this._gateway.is_open){
                // create an listener function which removes itself
                // when the response with the correct id has arrived
                let timeout_handle;
                let foo = (key, status, data) => {
                    if(key==req.key){ // if the request key matches the response id ...
                        // cancel listener 
                        this._gateway.off('response', foo);
                        clearTimeout(timeout_handle);
                        // check status
                        resolve(new Response(status, data));  
                    }                  
                }
                this._gateway.on('response', foo);
                this._gateway.send(JSON.stringify(req)).catch(err => reject(err)); 
                timeout_handle = setTimeout(()=> {
                    reject(new Error('Request timeout'))
                }, this._timeout);               
            }else
                reject(new Error('Gateway is not open'))
        });
    }
}

export default Resource