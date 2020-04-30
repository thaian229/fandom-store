import React from "react";
import { Form, Input, Tooltip, Checkbox, Button, Alert } from "antd";
import { QuestionCircleOutlined } from '@ant-design/icons';

import './RegisterScreen.css';

class RegisterScreen extends React.Component {
    state = {
        email: '',
        password: '',
        full_name: '',
        tel_num: '',
        err: '',
    };

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
        fetch(`http://localhost:3001/api/users/register`, {
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

        //const [form] = Form.useForm();
        const onFinish = values => {
            console.log('Received values of form: ', values);
        };

        return (
            <div className='pageRegister'>
                <div className='registerBox'>
                    <div>
                        <div className='register'>
                            Register
                   </div>
                        <Form
                            {...layout}
                            //form={form}
                            name="register"
                            onFinish={() => this.handleFormSubmit()}
                            scrollToFirstError
                        >
                            <div className='inputRegister'>
                                <Form.Item
                                    name="email"
                                    label="E-mail"
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
                                        placeholder="This email will be used for login!"
                                        onChange={this.handleEmailChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="password"
                                    label="Password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your password!',
                                        },
                                    ]}
                                    hasFeedback
                                >
                                    <Input.Password
                                        placeholder="Password must be at least 6 characters"
                                        onChange={this.handlePasswordChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="confirm"
                                    label="Confirm Password"
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
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item
                                    name="fullName"
                                    label={
                                        <span>
                                            Nickname&nbsp;
                            <Tooltip title="What do you want others to call you?">
                                                <QuestionCircleOutlined />
                                            </Tooltip>
                                        </span>
                                    }
                                    rules={[{ required: true, message: 'Please input your fullname!', whitespace: true }]}
                                >
                                    <Input
                                        onChange={this.handleNameChange}
                                    />
                                </Form.Item>

                                <Form.Item
                                    name="phone"
                                    label="Phone Number"
                                    rules={[{ required: true, message: 'Please input your phone number!' }]}
                                >
                                    <Input
                                        placeholder="We will contact to you through this phone number!"
                                        onChange={this.handlePhoneNumChange}
                                    />
                                </Form.Item>
                            </div>

                            <Form.Item
                                name="agreement"
                                valuePropName="checked"
                                rules={[
                                    { validator: (_, value) => value ? Promise.resolve() : Promise.reject('Should accept agreement') },
                                ]}
                                {...tailLayout}
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
                                {...tailLayout}
                            >
                                <Button type="primary" htmlType="submit">
                                    Register
                        </Button>
                            </Form.Item>

                            <Form.Item
                                {...tailLayout}
                            >
                                Already had an account? <a href="\login">Login here</a>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div >
        )
    }
}

export default RegisterScreen;