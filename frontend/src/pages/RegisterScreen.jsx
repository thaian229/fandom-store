import React from "react";
import { Form, Input, Tooltip, Checkbox, Button, Alert, Col, Row } from "antd";
import { QuestionCircleOutlined } from '@ant-design/icons';

import '../styles/RegisterScreen.css';

class RegisterScreen extends React.Component {
    state = {
        email: '',
        password: '',
        full_name: '',
        tel_num: '',
        err: '',
    };

    componentDidMount() {
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

    handleNameChange = (event) => {
        this.setState({
            full_name: event.target.value,
        });
    };

    handlePhoneNumChange = (event) => {
        this.setState({
            tel_num: event.target.value,
        });
    };

    handleFormSubmit = (event) => {
        fetch(`http://192.168.68.120:3001/api/users/register`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                full_name: this.state.full_name,
                tel_num: this.state.tel_num,
            }),
        })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                if (!data.success) {
                    this.setState({
                        err: data.message,
                    });
                } else {
                    // redirect user
                    window.location.href = '/login';
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
        const onFinish = values => {
            console.log('Received values of form: ', values);
        };

        return (
            <div className='pageRegister'>
                <Row 
                align="center"
                style={{
                    margin: "auto"
                }}
                >
                    <Col xs={18} xl={8} align="center">
                        <div className='registerBox'>
                            <div className='register' >
                                REGISTER
                            </div>

                            <Form className='registerForm'
                                //{...layout}
                                //form={form}
                                align="center"
                                style={{
                                    marginTop: "30px",
                                    width: "80%"
                                }}
                                name="register"
                                onFinish={() => this.handleFormSubmit()}
                                scrollToFirstError
                            >
                                <Form.Item
                                    name="email"
                                    //label="E-mail"
                                    rules={[
                                        {
                                            type: 'email',
                                            message: 'The input is not valid E-mail!',
                                        },
                                        {
                                            required: true,
                                            message: 'Please input your E-mail!',
                                        },
                                    ]}
                                >
                                    <Input
                                        style={{
                                            borderRadius: "15px"
                                        }}
                                        type="large"
                                        placeholder="Email"
                                        onChange={this.handleEmailChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    //label="Password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your password!',
                                        },
                                    ]}
                                    hasFeedback
                                >
                                    <Input.Password
                                        style={{
                                            borderRadius: "15px"
                                        }}
                                        placeholder="Password (6 or more characters)"
                                        onChange={this.handlePasswordChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="confirm"
                                    //label="Confirm Password"
                                    dependencies={['password']}
                                    hasFeedback
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please confirm your password!',
                                        },
                                        ({ getFieldValue }) => ({
                                            validator(rule, value) {
                                                if (!value || getFieldValue('password') === value) {
                                                    return Promise.resolve();
                                                }
                                                return Promise.reject('The two passwords that you entered do not match!');
                                            },
                                        }),
                                    ]}
                                >
                                    <Input.Password style={{
                                        borderRadius: "15px"
                                    }} placeholder="Confirm password" />
                                </Form.Item>

                                <Form.Item
                                    name="fullName"
                                    rules={[{ required: true, message: 'Please input your fullname!', whitespace: true }]}
                                >
                                    <Input
                                        style={{
                                            borderRadius: "15px"
                                        }}
                                        placeholder="Fullname"
                                        onChange={this.handleNameChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="phone"
                                    //label="Phone Number"
                                    rules={[{ required: true, message: 'Please input your phone number!' }]}
                                >
                                    <Input
                                        style={{
                                            borderRadius: "15px"
                                        }}
                                        placeholder="Phone Number"
                                        onChange={this.handlePhoneNumChange}
                                    />
                                </Form.Item>
                                <Form.Item
                                    name="agreement"
                                    valuePropName="checked"
                                    rules={[
                                        { validator: (_, value) => value ? Promise.resolve() : Promise.reject('Should accept agreement') },
                                    ]}
                                >
                                    <Checkbox>
                                        I have read the <a href="">agreement</a>
                                    </Checkbox>
                                </Form.Item>

                                <div className='errorRegister'>
                                    {this.state.err ? (
                                        <Alert
                                            message={this.state.err}
                                            type="error"
                                            showIcon
                                        />
                                    ) : null}
                                </div>

                                <Form.Item
                                >
                                    <Button className='registerButton' type="link" shape='round' htmlType="submit" block ghost size='large'>
                                        Register
                                    </Button>
                                </Form.Item>

                                <Form.Item className='haveAccount'
                                >
                                    Already had an account? <a href="\login">Login here</a>
                                </Form.Item>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div >
        )
    }
}

export default RegisterScreen;