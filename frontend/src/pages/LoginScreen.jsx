import React from "react";
import { Form, Input, Button, Alert, Row, Col } from "antd";
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import '../styles/LoginScreen.css';
const logo = '../styles/LOGOsquare.png';


class LoginScreen extends React.Component {
    state = {
        localUser: {
            email: window.localStorage.getItem("email"),
            id: window.localStorage.getItem("id"),
            ava_url: window.localStorage.getItem("ava_url"),
            full_name: window.localStorage.getItem("full_name"),
        },
        email: "",
        id: "",
    };

    componentDidMount() {
        const divs = document.querySelectorAll("span")
        for (let i = 0; i < divs.length; i++) {
            divs[i].style.background = "transparent";
            divs[i].style.opacity = 1;
            divs[i].style.border = "none";
            divs[i].style.outline = "none";
        }
        const formInput = document.querySelectorAll(".loginBox .ant-input");
        console.log(formInput)
        for (let i = 0; i < formInput.length; i++) {
            formInput[i].style.background = "rgba(0, 0, 0, 0)";
            formInput[i].style.opacity = 1;
            formInput[i].style.border = "none";
            formInput[i].style.outline = "none";
        }
        const placeholder = document.querySelectorAll(".loginBox .ant-input");
    }


    handleEmailChange = (event) => {
        this.setState({
            email: event.target.value,
        });
    };

    handlePasswordChange = (event) => {
        this.setState({
            password: event.target.value,
        });

    };

    handleFormSubmit = (event) => {
        //event.preventDefault();
        fetch(`http://localhost:3001/api/users/login`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
            }),
        })
            .then((res) => {
                //console.log(res.json);
                return res.json();
            })
            .then((data) => {
                if (!data.success) {
                    this.setState({
                        err: data.message,
                    });
                } else {
                    // save current user to session storage
                    window.localStorage.setItem('email', data.data.email);
                    window.localStorage.setItem('id', data.data.id);
                    window.localStorage.setItem('ava_url', data.data.ava_url);
                    window.localStorage.setItem('full_name', data.data.full_name);
                    // redirect user  
                    window.location.href = '/';
                }
            })
            .catch((error) => {
                console.log(error);
                this.setState({
                    err: error.message,
                });
            });
    };
    render() {

        const onFinishFailed = errorInfo => {
            //console.log('Failed:', errorInfo);
        };

        return (
            <div className='pageLogin'>
                <Row align="center">
                    <Col xs={18} xl={8} align="center">
                        <div className="loginBox">
                            <div className='greeting'>
                                {/* <img src={logo}/> */}
                            </div>
                            <div className='inputLogin'>
                                <Form className='inputForm'
                                    style={{
                                        width: "80%",
                                    }}
                                    //label="E-mail"
                                    onFinish={this.handleFormSubmit}
                                    //{...layout}
                                    name="basic"
                                    initialValues={{
                                        remember: true,
                                    }}
                                    //onFinish={onFinish}
                                    onFinishFailed={onFinishFailed}
                                >
                                    <Form.Item

                                        name="email"
                                        rules={[
                                            {
                                                type: 'email',
                                                message: 'The input is not valid E-mail!',
                                            },
                                            {
                                                required: true,
                                                message: 'Please input your email!',
                                            },
                                        ]}
                                    >
                                        <Input size='large'

                                            prefix={
                                                <UserOutlined
                                                    style={{
                                                        marginRight: "5px"
                                                    }}
                                                />}
                                            placeholder="Email"
                                            onChange={this.handleEmailChange}
                                        />
                                    </Form.Item>

                                    <Form.Item
                                        //label="Password"
                                        name="password"
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Please input your password!',
                                            },
                                        ]}
                                    >
                                        <Input.Password
                                            prefix={
                                                <LockOutlined
                                                    style={{
                                                        marginRight: "5px"
                                                    }} />}
                                            size='large'
                                            placeholder="Password"
                                            onChange={this.handlePasswordChange}
                                        />
                                    </Form.Item>

                                    <div className='errorLogin'>
                                        {this.state.err ? (
                                            <Alert
                                                message={this.state.err}
                                                type="error"
                                                showIcon
                                            />
                                        ) : null}
                                    </div>

                                    <Form.Item //{...tailLayout}
                                    >
                                        <Button className='loginButton' type="link" shape='round' htmlType="submit" block ghost size='large'>
                                            Login
                                    </Button>
                                    </Form.Item>

                                    <Form.Item //{...tailLayout} 
                                        className='dontHaveAccount'
                                    >
                                        Don't have an account? <a href="/register">Register here</a>
                                    </Form.Item>

                                </Form>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default LoginScreen;

