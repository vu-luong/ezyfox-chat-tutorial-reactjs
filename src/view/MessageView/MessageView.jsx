import React from "react";
import './style.css'
import SocketRequest from "../../socket/SocketRequest";
import Mvc from 'mvc-es6';
import UserListView from "./UserListView";

class MessageView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            allUsers: [],
            targetUser: null
        }

        let mvc = Mvc.getInstance();
        this.chatController = mvc.getController("chat");
    }

    componentDidMount() {
        this.chatController.addDefaultView("addAllUsers", (allUsers) => {
            this.addAllUsers(allUsers);
        });

        this.chatController.addDefaultView("changeTargetUser", (target) => {
            this.updateTargetUser(target);
        });
        SocketRequest.getInstance().getAllUsersRequest();
    }

    addAllUsers(allUsers) {
        this.setState({allUsers});
    }

    updateTargetUser(target) {
        this.setState({targetUser: target});
    }

    render() {

        const {allUsers, targetUser} = this.state;

        return (
            <div className="w-100 h-100">
                <div className="d-flex h-100">
                    <div className="user-list">
                        <div className="d-flex flex-column h-100 align-items-center">
                            <h3>Users</h3>
                            <UserListView users={allUsers} chatTarget={targetUser}/>
                        </div>
                    </div>

                    <div className="chat-section">
                        Hello
                    </div>
                </div>
            </div>
        );
    }

}

export default MessageView;