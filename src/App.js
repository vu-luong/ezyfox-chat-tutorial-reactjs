import './App.css';
import React, {Component} from "react";
import SocketProxy from "./socket/SocketProxy";
import LoginView from "./view/LoginView/LoginView";
import {toast} from "react-toastify";
import "react-toastify/dist/ReactToastify.css"
import {Route} from "react-router-dom";
import MessageView from "./view/MessageView/MessageView";
import Mvc from "mvc-es6";

toast.configure()
class App extends Component {

    constructor(props) {
        super(props);

        this.socketProxy = SocketProxy.getInstance();
        this.socketProxy.setup();

        this.mvc = Mvc.getInstance();
        this.mvc.newController("router");
        this.mvc.newController("chat");
    }

    componentDidMount() {
        let routerController = this.mvc.getController("router");
        let {history} = this.props;
        routerController.addDefaultView("navigate", viewURI => {
            history.push(viewURI);
        });
    }

    render() {
        return (
            <div className="w-100 vh-100">
                <Route exact path="/login" render={(props) => <LoginView {...props}/>}/>
                <Route exact path="/message" render={(props) => <MessageView {...props}/>}/>
            </div>
        );
    }

}

export default App;
