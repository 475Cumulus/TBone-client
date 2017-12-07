
import chai from 'chai';
import sinon from 'sinon';
import EventEmitter from '../src/emitter';

let emitter, spy;

describe('Given an instance of EventEmitter', () => {
    beforeEach(() => {
        emitter = new EventEmitter();
        spy = sinon.spy();
    });
    describe('When I emit an event', () => {
        it('should invoke the callback', () => {
            emitter.on('some_event', spy);
            emitter.emit('some_event');
            sinon.assert.calledOnce(spy);
        })
        it('should pass arguments to the callbacks', () => {
            emitter.on('some_event', spy);
            emitter.emit('some_event', 'ron', 'burgundy');
            sinon.assert.calledOnce(spy);
            sinon.assert.calledWith(spy, 'ron', 'burgundy');
        })
        it('should not response to event when listener removed', () => {
            emitter.on('some_event', spy);
            emitter.emit('some_event');
            sinon.assert.calledOnce(spy);
            emitter.off('some_event', spy);
            emitter.emit('some_event');
            sinon.assert.calledOnce(spy); // the previous call, before off 
        })
        it('should call a single callback only once per emission', () => {
            emitter.on('some_event', spy);
            emitter.on('some_event', spy); // hook the same callback twice
            emitter.emit('some_event');
            sinon.assert.calledOnce(spy);
        })
        it('should emit the event only once when using the once single event method', () =>{
            emitter.once('some_event', spy);
            emitter.emit('some_event');
            emitter.emit('some_event');
            sinon.assert.calledOnce(spy);
        })

    });
});
