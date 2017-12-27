import chai, { expect } from 'chai';
import sinon from 'sinon';
import { WebSocket, Server } from 'mock-socket';
import Gateway from '../src/gateway';

chai.should();

let gateway, socket_server;
const SOCKET_URL = 'ws://localhost:8090';

describe('Given an instance of gateway', () => {
    before( () => {
        socket_server = new Server(SOCKET_URL);
        socket_server.on('message', (message) => {
            // echo the message back
            socket_server.send(
                JSON.stringify({
                    type: 'echo',
                    payload: 'i got: '+ message
                }));
        });    
    });
    beforeEach(() => {
        gateway = new Gateway({
            url: SOCKET_URL,
            engine: WebSocket
        });
    });
    describe('When Gateway is initialized', ()=> {
        it('should open a websocket and resolve promise', async () => {
            return new Promise((resolve) => {
                gateway.open().then(() => {
                    expect(gateway.isOpen).to.equal(true);
                    resolve('Websocket opened');
                });                
            });
        })
        it('should fail to send a message without opening a socket', async () => {
            return new Promise((resolve) => {
                gateway.send("I'm kind of a big deal").catch((err) => {
                    expect(err).to.equal('Websocket is not open');
                    resolve();
                });                
            });

        })
        it('should get an echo reply from server after gateway sends message', async () => {
            const msg = "I'm kind of a big deal";
            return new Promise((resolve, reject ) => {
                gateway.open().then(async () => {
                    gateway.on('echo', (data) => {
                        expect(data).to.equal('i got: '+ msg);
                        resolve('Message returned');
                    });
                    // send message
                    gateway.send(msg);
                });
            });
        })
        it('should manage to send multiple requests simultaneously', async() => {
            await gateway.open();
            await gateway.send('one two three');
            await gateway.send('four five six');
        })
    })
    after(()=> {
        socket_server.stop();
        socket_server.close();
    })

});