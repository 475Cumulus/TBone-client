import chai from 'chai';
import { Gateway } from '../lib/tbone.js';

let gateway;

describe('Given an instance of gateway', () => {
    beforeEach(() => {
        gateway = new Gateway({
            url: 'ws://localhost:8000/ws/'
        });
    });
    describe('When Gateway is initialized', ()=> {
        it('should open a websocket', () => {

        })
    })

});