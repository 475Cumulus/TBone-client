import  'es6-promise/auto';
import EventEmitter from './emitter';

const EXPECTED_CLOSE = 1000;

class Gateway extends EventEmitter {
    constructor({url}){
        super();
        this._url = url;
        this._ws = null;
        this._reconnect = true;
    }

    open(){
        return new Promise(async (resolve, reject) => {
            this._ws = new WebSocket(this.url);
            this._ws.onopen = () => {
                this.emit('websocket_open');
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
                var message = JSON.parse(event.data);
                var event_name = message.event;
                var data = message.data;
                if(_.isFunction(this[event_name]))
                    this[event_name].call(this, data)
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
        this._ws = null;
    }
}

export default Gateway