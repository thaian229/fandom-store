import React from "react";
import { Form, Input, Button, Alert } from "antd";
//import { UserOutlined, LockOutlined } from '@ant-design/icons';

import '../styles/LoginScreen.css';

class LoginScreen extends React.Component {
    state = {
        localUser: {
            email: window.sessionStorage.getItem("email"),
            id: window.sessionStorage.getItem("id"),
            ava_url: window.sessionStorage.getItem("ava_url"),
            full_name: window.sessionStorage.getItem("full_name"),
        },
        email: "",
        id: "",
    };

    componentWillMount() {
        // if (this.state.localUser.email && this.state.localUser.id) {
        //     fetch(`http://localhost:3001/api/users/restoreSession`, {
        //         method: 'POST',
        //         credentials: 'include',
        //         headers: {
        //             'Content-Type': 'application/json',
        //         },
        //         body: JSON.stringify({
        //             id: this.state.localUser.id,
        //             email: this.state.localUser.email,
        //             is_admin: this.state.localUser.is_admin,
        //             ava_url: this.state.localUser.ava_url,
        //             full_name: this.state.localUser.full_name,
        //         }),
        //     })
        //         .then((res) => {
        //             return res.json();
        //         })
        //         .then((data) => {
        //             if(!data.success) {
        //                 console.log('false to restore session')
        //             } else {
        //                 window.location.href = '/';
        //             }
        //         })
        //         .catch((err) => {
        //             console.log(err)
        //         });
        // }
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
                    window.sessionStorage.setItem('email', data.data.email);
                    window.sessionStorage.setItem('id', data.data.id);
                    window.sessionStorage.setItem('ava_url', data.data.ava_url);
                    window.sessionStorage.setItem('full_name', data.data.full_name);
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
        const layout = {
            labelCol: {
                span: 7,
            },
            wrapperCol: {
                span: 16,
            },
        };
        const tailLayout = {
            wrapperCol: {
                offset: 8,
                span: 16,
            },
        };
        //const onFinish = values => {
        //console.log('Success:', values);
        //};

        const onFinishFailed = errorInfo => {
            //console.log('Failed:', errorInfo);
        };

        return (
            <div className='pageLogin'>
                <div className="loginBox">
                    <div className='greeting'>
                        Wellcome
                </div>
                    <div className='inputLogin'>
                        <Form
                            onFinish={this.handleFormSubmit}
                            {...layout}
                            name="basic"
                            initialValues={{
                                remember: true,
                            }}
                            //onFinish={onFinish}
                            onFinishFailed={onFinishFailed}
                        >
                            <Form.Item
                                label="E-mail"
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
                                <Input
                                    placeholder="Email"
                                    onChange={this.handleEmailChange}
                                />
                            </Form.Item>

                            <Form.Item
                                label="Password"
                                name="password"
                                rules={[
                                    {
                                        required: true,
                                        message: 'Please input your password!',
                                    },
                                ]}
                            >
                                <Input.Password
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

                            <Form.Item {...tailLayout}>
                                <Button type="primary" htmlType="submit">
                                    Login
                  </Button>
                            </Form.Item>

                            <Form.Item {...tailLayout}>
                                Don't have account? <a href="/register">Register here</a>
                            </Form.Item>

                        </Form>
                    </div>
                </div>
            </div>
        );
    }
}

export default LoginScreen;

