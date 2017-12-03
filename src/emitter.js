

class EventEmitter {
    constructor() {
        this._events = new Map();
    }
    on(event, listener){
        if(!this._events.has(event))
            this._events.set(event, new Set());
        this._events.get(event).add(listener);
    }
    once(event, listener){
        if(!this._events.has(event))
            this._events.set(event, new Set());

        let foo = (...args) => {
            this.off(event, foo);
            listener(...args);
        }
        this.on(event, foo);
    }
    off(event, listener){
        if(this._events.has(event)) {
            if(listener)
                this._events.get(event).delete(listener)
            else
                this._events.get(event).clear()
        }
    }
    emit(event, ...data){
        if(this._events.has(event))
            for(let listener of this._events.get(event))
               listener(...data);
    }
}

export default EventEmitter
