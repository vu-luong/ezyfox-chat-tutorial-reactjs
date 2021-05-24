// Singleton Class
import Ezy from "ezyfox-es6-client";

class SocketProxy {
    static instance = null;

    static getInstance() {
        if (!SocketProxy.instance) {
            SocketProxy.instance = new SocketProxy();
        }

        return SocketProxy.instance;
    }

    setup() {
        let config = new Ezy.ClientConfig();
        config.zoneName = "chat-tutorial";
        config.reconnect.enable = false;

        let clients = Ezy.Clients.getInstance();
        let client = clients.newDefaultClient(config);
        let setup = client.setup;

        // Define handlers
        let disconnectionHandler = new Ezy.DisconnectionHandler();
        disconnectionHandler.preHandle = (event) => {
            console.log('Received disconnection command from server');
            console.log(event);
        }

        // Register handlers
        setup.addEventHandler(Ezy.EventType.DISCONNECTION, disconnectionHandler);

        return client;
    }

    connect() {
        let url = "ws://localhost:2208/ws";
        let client = this.getClient();
        client.connect(url);
    }

    getClient() {
        let clients = Ezy.Clients.getInstance();
        return clients.getDefaultClient();
    }
}

export default SocketProxy;