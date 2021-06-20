import React from "react";

class MessageBubble extends React.Component {

    render() {
        const {isMe, message} = this.props;
        let bg = isMe ? "bg-primary" : "bg-secondary";
        let align = isMe ? "align-self-end" : "align-self-start";
        return (
            <p className={"text-light message-bubble text-break " + bg + " " + align}>
                {message}
            </p>
        );
    }

}

export default MessageBubble;