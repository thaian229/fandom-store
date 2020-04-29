import React from "react";
import { Button } from "antd";

class LoginScreen extends React.Component {
    
    handleLogin = () => {
        fetch(`http://localhost:3001/api/users/login`, {
            credentials: "include",
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: "thaian229@gmail.com",
                password: '22114455'
            })
        })
            .then(res => {
                console.log(res);
                return res.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch(err => {
                if (err) {
                    console.log(err);
                    window.alert(err.message);
                }
            });
    }

    render() {
        return (
            <div style={{ margin: "60px" }}>
                {this.state.currentUser.id ? <h1>Loged in</h1> : <h1>Not loged in</h1>}
                <Button onClick={this.handleLogin}>Login</Button>
            </div>
        )
    }
}

export default LoginScreen;