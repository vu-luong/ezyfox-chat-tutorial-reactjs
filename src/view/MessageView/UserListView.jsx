import React from "react";
import Mvc from "mvc-es6";
import SocketRequest from "../../socket/SocketRequest";

class UserItem extends React.Component {

    constructor(props) {
        super(props);
        this.chatController = Mvc.getInstance().getController("chat");
    }


    _onClick = () => {
        const {user} = this.props;
        SocketRequest.getInstance().getChannelRequest([user.username]);
        this.chatController.updateViews("changeTargetUser", user.id);
    }

    render() {
        const {user, active} = this.props;
        const activeClass = active ? " active" : "";
        return (
            <div>
                <button type="button" className={"user-btn btn btn-link" + activeClass}
                        onClick={this._onClick}>
                    {user.username}
                </button>
            </div>
        );
    }
}

class UserListView extends React.Component {

    render() {
        const {users, chatTarget} = this.props;
        return (
            <ul className="nav flex-column">
                {
                    users.map(
                        (user, i) =>
                            <UserItem user={user} key={i} active={user.id === chatTarget}/>
                    )
                }
            </ul>
        );
    }

}

export default UserListView;