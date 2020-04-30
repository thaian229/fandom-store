import React from "react";
import { Avatar, Button, Popover, Input, Form, Tooltip, Upload, Modal } from "antd";
import { QuestionCircleOutlined, PlusOutlined  } from '@ant-design/icons';

import './ProfileScreen.css';

class ProfileScreen extends React.Component {
    state = {
            id: window.sessionStorage.getItem('id'),
            email: window.sessionStorage.getItem('email'),
            full_name: '',
            password: '',
            tel_num: '',
            address: '',
            dob: undefined,
            ava_url: '',
            err: '',
            imageFile: undefined,
            imageSource: '',
            visible: false,
    };

    componentDidMount() {
        if(!this.state.id){
            window.alert('Access Denied, Please Login')
            window.location.pathname = `/login`
        } 
        else{
            fetch(`http://localhost:3001/api/users/profile`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            })
            .then((res) => {
                console.log(res)
                return res.json();
            })
            .then((data) => {
                this.setState({
                    full_name: data.data.full_name,
                    tel_num: data.data.tel_num,
                    address: data.data.address,
                    dob: data.data.dob,
                    ava_url: data.data.ava_url,
                })
                console.log(this.state.full_name);
        console.log(this.state.tel_num);
        console.log(this.state.address);
        console.log(this.state.dob);
        console.log(this.state.ava_url);
                console.log('ok');
            })
            .catch((error) => {
                console.log(error);
            });
        } 
    }

    handleNameChange = (event) => {
        this.setState({
            full_name: event.target.value,
        });
    };

    handlePasswordChange = (event) => {
        this.setState({
            password: event.target.value,
        });
        
    };

    handlePhoneChange= (event) => {
        this.setState({
            tel_num: event.target.value,
        });
    };

    handleAddressChange = (event) => {
        this.setState({
            address: event.target.value,
        });
    };

    handleImageChange = (event) => {
        // console.log(event.target.files[0]);
        const imageFile = event.target.files[0];
        // Change image file to base64 url 
        if (imageFile) {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(imageFile);
            fileReader.onloadend = (data) => { // call back of fileReader
                this.setState({
                    imageFile: imageFile,
                    imageSource: data.currentTarget.result,
                });
            };
        } else {
            this.setState({
                imageFile: undefined,
                imageSource: '',
            });
        }
    };

    showModal = () => {
        this.setState({
          visible: true,
        });
      };
    
      handleOk = (event) => {
        this.setState({
          visible: false,
        });
        event.preventDefault();
        if (!this.state.imageFile) {
            this.setState({
                visible: false,
            });
        } else {
            
            // Upload file and take local path from database
            const formData = new FormData();
            formData.append('image', this.state.imageFile);
            fetch(`http://localhost:3001/api/uploads/post/avatar`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                },
                body: formData,
            })
                .then((res) => {
                    return res.json();
                })
                .then((data) => {
                    console.log(data);
                    this.setState({
                        ava_url: data.imgUrl,
                    });
                    console.log(this.state.ava_url);
                })
                .catch((error) => {
                    this.setState({
                        errMessage: error.message,
                    });
                });
        }
      };
    
      handleCancel = e => {
        console.log(e);
        this.setState({
          visible: false,
        });
      };

    handleFormSubmit = (event) => {
        console.log(this.state.password);
        fetch(`http://localhost:3001/api/users/update`, {
            method: "POST",
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                id: this.state.id,
                full_name: this.state.full_name,
                password: this.state.password,
                tel_num: this.state.tel_num,
                address: this.state.address,
                dob: this.state.dob,
                ava_url: this.state.ava_url,
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
                window.location.href = '/profile';
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
        const { previewVisible, previewImage, imageFile } = this.state;

        const uploadButton = (
            <div>
              <PlusOutlined />
              <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <div className='pageProfile'>
                <div className='profile'>
                    <div className='avatar'>
                    <Popover placement="bottom" content={(
                        <div>
                            <Button type="primary" onClick={this.showModal}>
                                Change avatar
                            </Button>
                            <Modal
                            title="Choose new avatar"
                            visible={this.state.visible}
                            onOk={this.handleOk}
                            onCancel={this.handleCancel}
                            >
                                <div className="col-8">
                                    <div className="form-group">
                                        <label htmlFor='file' className="btn">Select Image</label>
                                        <input
                                            id='file'
                                            type='file'
                                            accept="image/*"
                                            className='form-control'
                                            style={{
                                                color: `transparent`,
                                                margin: `0 auto`,
                                                textIndent: `-999em`,
                                            }}
                                            onChange={this.handleImageChange}
                                        />
                                        {this.state.imageSource ? (
                                            <div style={{ textAlign: `center`, }}>
                                                <img
                                                    src={this.state.imageSource}
                                                    alt='preview image'
                                                    style={{
                                                        height: `400px`,
                                                        width: `auto`,
                                                    }}
                                                />
                                            </div>
                                        ) : null}
                                    </div>
                                </div>
                            </Modal>
                      </div>
                    )}>
                        <Avatar shape="square" size={300} src={this.state.ava_url} />
                    </Popover>,
                        
                    </div>
                    <div className='info'>
                        <Form
                            scrollToFirstError
                            onFinish={this.handleFormSubmit}
                        >
                            <div>

                            <div className='fullname-box'>
                                    <div className='fullName'>
                                        {this.state.full_name}
                                    </div>
                                    <div className='changeName'>
                                        <Popover placement="right" content={(
                                            <Form.Item
                                            name="full-name"
                                            label={
                                            <span>
                                                New name&nbsp;
                                                <Tooltip title="What do you want others to call you?">
                                                    <QuestionCircleOutlined />
                                                </Tooltip>
                                            </span>
                                            }
                                        >
                                                <Input onChange={this.handleNameChange} />
                                        </Form.Item>
                                        )} trigger="click">
                                            <Button size='small'>Change name</Button>
                                        </Popover>
                                    </div>
                                </div>

                                <div className='email'>
                                    Email: {this.state.email}
                                </div>
                                
                                <div className='address-box'>
                                    <div className='address'>
                                        Address: {this.state.address}
                                    </div>
                                    <div className='changeAddress'>
                                        <Popover placement="right" content={(
                                            <Form.Item
                                            name="telNum"
                                            label={
                                            <span>
                                                New Address&nbsp;
                                            </span>
                                            }
                                        >
                                                <Input onChange={this.handleAddressChange} />
                                        </Form.Item>
                                        )} trigger="click">
                                            <Button>Change address</Button>
                                        </Popover>
                                    </div>
                                </div>   

                                <div className='phone-box'>
                                    <div className='phone'>
                                        Phone number: {this.state.tel_num}
                                    </div>
                                    <div className='changePhone'>
                                        <Popover placement="right" content={(
                                            <Form.Item
                                            name="telNum"
                                            label={
                                            <span>
                                                New phone number&nbsp;
                                            </span>
                                            }
                                        >
                                                <Input onChange={this.handlePhoneChange} />
                                        </Form.Item>
                                        )} trigger="click">
                                            <Button>Change phone number</Button>
                                        </Popover>
                                    </div>
                                </div>
                            </div>

                        <div className='changePhone'>
                            <Popover placement="right" content={(
                                <Form>
                                    <Form.Item
                                        name="password"
                                        label="New password"
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
                                </Form>
                                )} trigger="click">
                                    <Button>Change password</Button>
                                </Popover>
                            </div>       

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                Update profile
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
            
        )
    }
}

export default ProfileScreen;