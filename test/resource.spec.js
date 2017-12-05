import chai, { expect } from 'chai';
import sinon from 'sinon';
import { WebSocket, Server } from 'mock-socket';
import { Gateway, Resource } from '../src';


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
    handle_request(data) {
        if(data.method=='GET'){
            if(data.args && data.args.response == false)
                return;
            this.send_response(data.id, {
                first_name: 'Ron',
                last_name: 'Burgundy'
            });
        }else if(data.method=='POST')
            this.send_response(data.id, data.body)
    }
    send_response(id, data){
        this.send(
            JSON.stringify({
                type: 'response',
                id: id,
                payload: data
            })
        );    
    }
}

describe('Given a socket server and a gateway', () => {
    before( async () => {
        return new Promise((resolve, reject) => {
            // create websocket server to provide responses             
            socket_server = new ApiServer(SOCKET_URL); 
            // create websocket client gateway
            gateway = new Gateway({
                url: SOCKET_URL,
                engine: WebSocket
            });
            gateway.open().then(() =>{
                // create resource for some uri
                resource = new Resource('/api/person/', gateway, 500);    
                resolve('Gateway is open and ready');           
            }).catch((event) => {
                reject(event.data);
            });
        });
    });
    describe('after resource is initialized', ()=> {
        it('should receive a response when a GET request with no params is sent', async () => {
            return new Promise((resolve, reject) => {
                resource.get().then((response) => {
                    expect(response).to.include({
                        first_name: 'Ron',
                        last_name: 'Burgundy'
                    })
                    resolve();
                }).catch((err) => {
                    reject( new Error(err));
                });               
            });
        })
        it('Should receive a timeout for a request that does not respond', async () => {
            return new Promise((resolve, reject) => {
                resource.get({response: false})
                    .then((response)=> reject(new Error('response received')))
                    .catch((err) => {
                        expect(err.message).to.equal('Request timeout');
                        resolve();
                });   
            });
        });
    })
});