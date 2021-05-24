import './App.css';
import React, {Component} from "react";
import SocketProxy from "./socket/SocketProxy";

class App extends Component {

    constructor(props) {
        super(props);

        this.socketProxy = SocketProxy.getInstance();
        this.socketProxy.setup();
    }

    render() {
        return (
            <div className="App">
                <button onClick={this._onConnectClick}>
                    Connect to server
                </button>
            </div>
        );
    }

    _onConnectClick = () => {
        let socketProxy = SocketProxy.getInstance();
        socketProxy.connect();
    }
}

export default App;
