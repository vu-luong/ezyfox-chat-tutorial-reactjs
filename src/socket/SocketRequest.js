import Ezy from "ezyfox-es6-client";
import {AppCommand} from "./SocketConstants";

class SocketRequest {
    static instance = null;

    static getInstance() {
        if (!SocketRequest.instance) {
            SocketRequest.instance = new SocketRequest();
        }

        return SocketRequest.instance;
    }

    getClient() {
        let clients = Ezy.Clients.getInstance();
        return clients.getDefaultClient();
    }

    getApp() {
        let client = this.getClient();
        let appManager = client.getAppManager();
        return appManager.getApp();
    }

    getAllUsersRequest() {
        this.getApp().sendRequest(AppCommand.GET_ALL_USERS, {});
    }

    getChannelRequest(users) {
        this.getApp().sendRequest(AppCommand.GET_CHANNEL, {users});
    }
}

export default SocketRequest;