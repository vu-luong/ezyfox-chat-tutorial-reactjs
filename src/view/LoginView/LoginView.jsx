import React from "react";
import {Button, Form, Card} from "react-bootstrap";
import '../../css/login.css';
import SocketProxy from "../../socket/SocketProxy";

class LoginView extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            username: "",
            password: ""
        }
    }

    _onUsernameChange = (e) => {
        this.setState({username: e.target.value});
    }

    _onPasswordChange = (e) => {
        this.setState({password: e.target.value});
    }

    _onLoginClick = () => {
        console.log('_onLoginClick');
        console.log('username: ', this.state.username);
        console.log('password: ', this.state.password);

        let client = SocketProxy.getInstance();
        client.defineLoginRequest(this.state.username, this.state.password);
        client.connect();
    }

    render() {
        return (
            <div className="login-wrapper">
                <Card className="login-card">
                    <Card.Title>Login</Card.Title>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control placeholder="Enter username"
                                      onChange={this._onUsernameChange}/>
                    </Form.Group>

                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Enter password"
                                      onChange={this._onPasswordChange}/>
                    </Form.Group>

                    <Button className="login-button" onClick={this._onLoginClick}>
                        Login
                    </Button>
                </Card>
            </div>
        );
    }

}

export default LoginView;