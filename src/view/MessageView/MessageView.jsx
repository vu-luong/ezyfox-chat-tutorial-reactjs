import React from "react";
import './style.css'
import SocketRequest from "../../socket/SocketRequest";
import Mvc from 'mvc-es6';
import UserListView from "./UserListView";
import MessageBubble from "./MessageBubble";
import SocketProxy from "../../socket/SocketProxy";

class MessageView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allUsers: [],
            targetUser: null,
            targetChannel: null,
            message: "",
            chatLogs: null
        }

        let mvc = Mvc.getInstance();
        this.chatController = mvc.getController("chat");
        this.me = SocketProxy.getInstance().connection.username;
    }

    componentDidMount() {
        this.chatController.addDefaultView("addAllUsers", (allUsers) => {
            this.addAllUsers(allUsers);
        });

        this.chatController.addDefaultView("changeTargetUser", (target) => {
            this.updateTargetUser(target);
        });

        this.chatController.addDefaultView("changeTargetChannel", (target) => {
            this.updateTargetChannel(target);
        });

        this.chatController.addDefaultView("updateChatLogs", ({chatLogs, channelId}) => {
            if (channelId === this.state.targetChannel) {
                this.updateChatLogs(chatLogs);
            }
        });

        SocketRequest.getInstance().getAllUsersRequest();
    }

    addAllUsers(allUsers) {
        this.setState({allUsers});
    }

    updateTargetUser(target) {
        this.setState({targetUser: target});
    }

    updateTargetChannel(target) {
        let newTarget = target ? target : 0;
        this.setState({targetChannel: newTarget});
    }

    updateChatLogs(chatLogs) {
        this.setState({chatLogs: chatLogs});
    }

    _onMessageChange = (e) => {
        this.setState({"message": e.target.value});
    }

    _onSendMessageClick = (e) => {
        let message = this.state.message;

        if (!message) {
            return;
        }

        this.setState({message: ""});
        this.sendMessage(message);
    }

    sendMessage(message) {
        const {targetChannel} = this.state;
        SocketRequest.getInstance().sendMessageRequest(targetChannel, message);
    }

    _onEnter = (e) => {
        if (e.key === 'Enter') {
            this._onSendMessageClick(e);
        }
    }

    render() {
        const {allUsers, targetUser, targetChannel, chatLogs} = this.state;

        return (
            <div className="w-100 h-100">
                <div className="d-flex h-100">
                    <div className="user-list sidebar">
                        <div className="d-flex flex-column h-100 align-items-center">
                            <h3>Users</h3>
                            <UserListView users={allUsers} chatTarget={targetUser}/>
                        </div>
                    </div>

                    <div className="container chat-section">
                        <h1 className="h2">
                            {"Chat Channel Id: " + targetChannel}
                        </h1>
                        <div className="overflow-auto chat-text-panel">
                            {
                                chatLogs?.map((log, i) =>
                                    <MessageBubble key={i} isMe={this.me === log.sender} message={log.message}/>
                                )
                            }
                        </div>
                        <div className="chat-panel">
                            <input
                                type="text"
                                placeholder="Aa"
                                value={this.state.message}
                                onChange={this._onMessageChange}
                                onKeyDown={this._onEnter}
                                className="form-control chat-input"/>
                            <button
                                type="button"
                                className="btn btn-primary chat-button"
                                onClick={this._onSendMessageClick}>
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

}

export default MessageView;