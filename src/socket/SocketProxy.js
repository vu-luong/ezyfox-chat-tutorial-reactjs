// Singleton Class
import Ezy from "ezyfox-es6-client";
import {toast} from "react-toastify";
import Mvc from "mvc-es6";
import {AppCommand} from "./SocketConstants";

class SocketProxy {
    static instance = null;

    static getInstance() {
        if (!SocketProxy.instance) {
            SocketProxy.instance = new SocketProxy();
        }

        return SocketProxy.instance;
    }

    constructor() {
        this.connection = {
            username: "",
            password: ""
        }
    }

    setup() {
        let mvc = Mvc.getInstance();
        let config = new Ezy.ClientConfig();
        config.zoneName = "chat-tutorial";
        config.reconnect.enable = false;

        let clients = Ezy.Clients.getInstance();
        let client = clients.newDefaultClient(config);
        let setup = client.setup;

        // Define handlers
        let handshakeHandler = new Ezy.HandshakeHandler();
        handshakeHandler.getLoginRequest = () => {
            let username = this.connection.username;
            let password = this.connection.password;
            let zoneName = config.zoneName;
            let data = [];
            return [zoneName, username, password, data];
        }

        let loginSuccessHandler = new Ezy.LoginSuccessHandler();
        loginSuccessHandler.handleLoginSuccess = () => {
            let appAccessData = ["chat-tutorial", []];
            this.getClient().sendRequest(Ezy.Command.APP_ACCESS, appAccessData);
        }

        let appAccessHandler = new Ezy.AppAccessHandler();
        appAccessHandler.postHandle = (app, data) => {
            toast.success("Access app successfully: " + app.name + ": " + data);
            // Navigate to the MessageView page
            let routerController = mvc.getController("router");
            routerController.updateViews("navigate", "/message");
        }

        let loginErrorHandler = new Ezy.LoginErrorHandler();
        loginErrorHandler.handleLoginError = (event) => {
            console.log("Logged in with error: ", event[1]);
            toast.error("User logged in with error: " + event[1]);
        }

        let disconnectionHandler = new Ezy.DisconnectionHandler();
        disconnectionHandler.preHandle = (event) => {
            console.log('Received disconnection command from server');
            console.log(event);
        }

        // Register handlers
        setup.addEventHandler(Ezy.EventType.DISCONNECTION, disconnectionHandler);
        setup.addDataHandler(Ezy.Command.HANDSHAKE, handshakeHandler);
        setup.addDataHandler(Ezy.Command.LOGIN, loginSuccessHandler);
        setup.addDataHandler(Ezy.Command.LOGIN_ERROR, loginErrorHandler);
        setup.addDataHandler(Ezy.Command.APP_ACCESS, appAccessHandler);

        let setupApp = setup.setupApp("chat-tutorial");
        setupApp.addDataHandler(AppCommand.GET_ALL_USERS, (app, data) => {
            let chatController = mvc.getController("chat");
            chatController.updateViews("addAllUsers", data);
        });

        setupApp.addDataHandler(AppCommand.GET_CHANNEL, (app, data) => {
            const {channelId, chatLogs} = data;
            console.log('Received getchannel response, channelId = ', channelId);
            let chatController = mvc.getController("chat");
            chatController.updateViews("changeTargetChannel", channelId);
            chatController.updateViews(
                "updateChatLogs",
                {chatLogs: chatLogs, channelId: channelId});
        });

        setupApp.addDataHandler(AppCommand.SEND_MESSAGE, (app, data) => {
            const {channelId, chatLogs} = data;
            console.log('Receive SEND_MESSAGE response');
            console.log("channelId: ", channelId);
            console.log("chatLogs: ", chatLogs);
            let chatController = mvc.getController("chat");
            chatController.updateViews(
                "updateChatLogs",
                {chatLogs: chatLogs, channelId: channelId});
        });

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

    defineLoginRequest(username, password) {
        this.connection = {
            username: username,
            password: password
        }
    }
}

export default SocketProxy;