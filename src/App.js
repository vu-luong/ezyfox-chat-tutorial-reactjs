import './App.css';
import React, {Component} from "react";
import SocketProxy from "./socket/SocketProxy";
import LoginView from "./view/LoginView/LoginView";

class App extends Component {

    constructor(props) {
        super(props);

        this.socketProxy = SocketProxy.getInstance();
        this.socketProxy.setup();
    }

    render() {
        return (
            <div className="container">
                <LoginView/>
            </div>
        );
    }

}

export default App;
