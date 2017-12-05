import 'es6-promise/auto';
import EventEmitter from './emitter';

const REQUEST_TIMEOUT = 30000; // 30 seconds

class Resource extends EventEmitter {
    constructor(uri, gateway, timeout=REQUEST_TIMEOUT){
        super();
        this._uri = uri;
        this._gateway = gateway;
        debugger;
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
        let generate_id = (length) =>{
            var text = '';
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for(var i = 0; i < length; i++) 
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        }
        return new Promise((resolve, reject) => {
            const req = {
                type: 'request',
                id: generate_id(12),
                href: this._uri,
                method, args, body,
            }
            if(this._gateway == null)
                reject(new Error('Gateway not available'));
    
            else if(this._gateway.is_open){
                // create an listener function which removes itself
                // when the response with the correct id has arrived
                // TODO: add timeout
                let timeout;
                let foo = (id, data) => {
                    if(id==req.id){
                        this._gateway.off('response', foo);
                        clearInterval(timeout);
                        resolve(data);  
                    }                  
                }
                this._gateway.on('response', foo);
                this._gateway.send(JSON.stringify(req)).catch(err => reject(err)); 
                timeout = setTimeout(()=> {
                    reject(new Error('Request timeout'))
                }, this._timeout);               
            }else
                reject(new Error('Gateway is not open'))
        });
    }

}

export default Resource