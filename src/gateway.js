import  'es6-promise/auto';
import EventEmitter from './emitter';

const EXPECTED_CLOSE = 1000;

class Gateway extends EventEmitter {
    constructor({url, engine}){
        super();
        this._url = url;
        this._ws = null;
        this._reconnect = true;
        this._is_open = false;
        this._engine = engine || global.WebSocket;
    }
    open(){
        return new Promise((resolve, reject) => {
            try{
                this._ws = new this._engine(this._url);
                this._ws.onopen = () => {
                    this.emit('websocket_open');
                    this._is_open = true;
                    resolve();
                }
                this._ws.onclose = (event) => {
                    const { code } = event;
                    this.clear(event);
                    if(code !== EXPECTED_CLOSE)
                        this.reconnect();
                }
                this._ws.onerror = (err) => {
                    this.emit('websocket_error', err);
                    reject(err);
                }
                this._ws.onmessage = (event) => {
                    var {type, id, payload} = JSON.parse(event.data);
                    if(id !== undefined)
                        this.emit(type, id, payload);
                    else
                        this.emit(type, payload)
                }
            }catch(err){
                reject(err);
            }
        });
    }
    close() {
        return new Promise((resolve, reject) => {
            if (this._ws) {
                this._ws.onclose = ((event) => {
                    this.clear(event);
                    resolve();
                });
                this.ws.close();
            }
            else {
                reject(new Error('WebSocket hasn not been initialized'));
            }
        });
    }
    async reconnect(){
        if(this._reconnect == false)
            return;

        try {
            await this.open();
            this.emit('websocket_reconnect');
        }
        catch (err){
            setTimeout(() => {
                this.reconnect();
            }, 500);
        }
    }
    clear(event){
        this.emit('websocket_close', event);
        this._is_open = false;
        this._ws = null;
    }
    send(message){
        // make sure the message is a string
        if(typeof message === 'object')
            message = JSON.stringify(message)
        // return a promise object to signal message was sent or not
        return new Promise((resolve, reject) => {
            if(this._ws === null || !this.is_open)
                reject('Websocket is not open');
            else{
                this._ws.send(message);
                resolve();
            }
        });
    }
    get is_open(){
        return this._is_open;
    }
}

export default Gateway