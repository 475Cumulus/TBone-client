import chai, { expect } from 'chai';
import sinon from 'sinon';
import { WebSocket, Server } from 'mock-socket';
import Gateway from '../src/gateway';
import Resource from '../src/resource';


chai.should();

const SOCKET_URL = 'ws://localhost:8090';
let resource, gateway, socket_server;

class ApiServer extends Server {
    /*
    Implements a simple api server on top of a mock-socket server
    */
    constructor(...opts){
        super(...opts);
        this.on('message', (message) => {
            const data = JSON.parse(message);
            if(data.type==='request'){
                this.handle_request(data);               
            }            
        });
    }
    send_response(key, status, data){
        this.send(
            JSON.stringify({
                type: 'response',
                key: key,
                status: status,
                payload: data
            })
        );    
    }
}

let init = async (server_class) => {
    socket_server = new server_class(SOCKET_URL); 
    // create websocket client gateway
    debugger;
    gateway = new Gateway({
        url: SOCKET_URL,
        engine: WebSocket
    });
    await gateway.open();
    resource = new Resource('/api/person/', gateway, 500);  
}

describe('Given a socket server and a gateway', () => {
    afterEach(()=>{
        socket_server.stop();
        socket_server.close();
    }) 
    describe('after resource is initialized', async ()=> {
        it('should receive a response when a GET request with no params is sent', async () => {
            await init(class extends ApiServer {
                handle_request(data) {
                    this.send_response(data.key, 200, {
                        first_name: 'Ron',
                        last_name: 'Burgundy'
                    });
                }
            });
            return new Promise((resolve, reject) => {
                resource.get().then((response) => {
                    expect(response.status).to.equal(200);
                    expect(response.payload).to.include({
                        first_name: 'Ron',
                        last_name: 'Burgundy'
                    })
                    resolve();
                }).catch((err) => {
                    reject( new Error(err));
                });               
            });
        })
        it('Should receive a timeout for a GET request that does not respond', async () => {
            await init(class extends ApiServer {
                handle_request(data) {}
            });
            return new Promise((resolve, reject) => {
                resource
                .get()
                .then((response)=> reject(new Error('response received')))
                .catch((err) => {
                    expect(err.message).to.equal('Request timeout');
                    resolve();
                });   
            });
        })
        it('Should receive a response to a POST request, bearing the payload that was posted', async () => {
            await init(class extends ApiServer {
                handle_request(data) {
                    this.send_response(data.key, 201, data.body);
                }
            });
            return new Promise((resolve, reject) => {
                resource.post({}, {
                    first_name: 'Ron',
                    last_name: 'Burgundy'      
                }).then((response) => {
                    expect(response.status).to.equal(201);
                    expect(response.payload).to.include({
                        first_name: 'Ron',
                        last_name: 'Burgundy'
                    });
                    resolve();
                }).catch((err) => {
                    reject( new Error(err));
                });    
            });
        })
        it('Should receive a 404 not-found for an invalid resource', async () => {
            await init(class extends ApiServer {
                handle_request(data) {
                    this.send_response(data.key, 404, {});
                }
            });
            return new Promise((resolve, reject) => {
                resource.get().then((response)=> {
                    expect(response.status).to.equal(404);
                    resolve();
                }).catch((err) => {
                    reject( new Error(err));
                }); 
            });
        });
    })
});