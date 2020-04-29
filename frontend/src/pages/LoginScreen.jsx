import React from "react";
import { Button } from "antd";

class LoginScreen extends React.Component {

    state = {
        currentUser: {
            email: window.sessionStorage.getItem("email"),
            id: window.sessionStorage.getItem("id"),
            is_admin: window.sessionStorage.getItem("is_admin")
        },
    }

    login = () => {

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
                window.sessionStorage.setItem("email", data.data.email);
                window.sessionStorage.setItem("id", data.data.id);
                window.sessionStorage.setItem("is_admin", data.data.is_admin);

                this.setState({
                    currentUser: {
                        email: data.data.email,
                        id: data.data.id,
                        is_admin: data.data.is_admin
                    }
                })
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
                <Button onClick={this.login}>Login</Button>
            </div>
        )
    }
}

export default LoginScreen;
