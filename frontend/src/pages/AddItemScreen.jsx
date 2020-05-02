import React from "react";
import { Upload, Modal, Button, Form, Input, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FormItem from "antd/lib/form/FormItem";

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const validateMessages = {
    required: '${label} is required!',
    types: {
        email: '${label} is not validate email!',
        number: '${label} is not a validate number!',
    },
    number: {
        range: '${label} must be between ${min} and ${max}',
    }
}

class AddItemScreen extends React.Component {
    state = {
        currentUser: {
            email: window.sessionStorage.getItem("email"),
            id: window.sessionStorage.getItem("id"),
            is_admin: window.sessionStorage.getItem("is_admin") === "true"
        },
        data: {

        },
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
        thumbnail: [],
        previewVisibleT: false,
        previewImageT: '',
        previewTitleT: '',
        finalImgUrls: []
    }

    componentWillMount() {
        if (!this.state.currentUser.email || !this.state.currentUser.id) {
            window.location.pathname = "/login"
        } else if (!this.state.currentUser.is_admin) {
            window.location.pathname = "/"
        }
    }

    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChange = ({ fileList }) => { this.setState({ fileList }); console.log(this.state.fileList) }

    handleCancelT = () => this.setState({ previewVisibleT: false });

    handlePreviewT = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImageT: file.url || file.preview,
            previewVisibleT: true,
            previewTitleT: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChangeT = ({ fileList }) => this.setState({ thumbnail: fileList });

    itemCreate = () => {
        fetch(`http://localhost:3001/api/posts/addItem`, {
            credentials: "include",
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                prod_name: this.state.data.prod_name,
                price: this.state.data.price,
                image_url: this.state.data.image_url,
                description: this.state.data.description,
                stock: this.state.data.stock,
                tags: this.state.data.tags
            }),
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                if (data.success === true)
                    window.location.pathname = "/";
                else console.log(data)
            })
            .catch(err => {
                if (err) {
                    console.log(err);
                    window.alert(err.message);
                }
            });
    }

    getImageUrls = (event) => {
        event.preventDefault();
        let formDataProd = new FormData()
        let formDataThumbnail = new FormData()

        formDataThumbnail.append('image', this.state.thumbnail[0].originFileObj)
        this.state.fileList.map(item => {
            formDataProd.append('image', item.originFileObj);
        })

        console.log(formDataThumbnail)
        console.log(formDataProd)

        fetch(`http://localhost:3001/api/uploads/post/thumbnail`, {
            credentials: "include",
            method: "POST",
            headers: {
                'Accept': 'application/json',
            },
            body: formDataThumbnail,
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log(data.imgUrl)
                this.state.finalImgUrls.push(data.imgUrl)
                fetch(`http://localhost:3001/api/uploads/post/productImg`, {
                    credentials: "include",
                    method: "POST",
                    headers: {
                        'Accept': 'application/json',
                    },
                    body: formDataProd,
                })
                    .then(res2 => {
                        return res2.json();
                    })
                    .then(data2 => {
                        console.log(data2.imgUrls);
                        data2.imgUrls.map(item => {
                            this.state.finalImgUrls.push(item)
                        })
                    })
                    .catch(er => {
                        if (er) {
                            console.log(er);
                            window.alert(er.message);
                        }
                    });
            })
            .catch(err => {
                if (err) {
                    console.log(err);
                    window.alert(err.message);
                }
            });

        console.log(this.state.finalImgUrls)

    }

    onFinish = () => { }

    render() {

        const { previewVisible, previewImage, fileList, previewTitle, thumbnail, previewVisibleT, previewImageT, previewTitleT } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (
            <div>

                <Button onClick={this.getImageUrls}>TEST</Button>
                <Form {...layout} name="nest-messages" onFinish={this.onFinish()} validateMessages={validateMessages}>
                    <FormItem>
                        <Upload
                            name={['product', 'prodImgs']}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType="picture-card"
                            fileList={fileList}
                            onPreview={this.handlePreview}
                            onChange={this.handleChange}
                        >
                            {fileList.length >= 4 ? null : uploadButton}
                        </Upload>
                        <Modal
                            visible={previewVisible}
                            title={previewTitle}
                            footer={null}
                            onCancel={this.handleCancel}
                        >
                            <img alt="example" style={{ width: '100%' }} src={previewImage} />
                        </Modal>
                    </FormItem>
                    <FormItem>
                        <Upload
                            name={['product', 'thumbnail']}
                            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                            listType="picture-card"
                            fileList={thumbnail}
                            onPreview={this.handlePreviewT}
                            onChange={this.handleChangeT}
                        >
                            {thumbnail.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal
                            visible={previewVisibleT}
                            title={previewTitleT}
                            footer={null}
                            onCancel={this.handleCancelT}
                        >
                            <img alt="example" style={{ width: '100%' }} src={previewImageT} />
                        </Modal>
                    </FormItem>
                    <Form.Item name={['product', 'name']} label="Product Name" rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['product', 'email']} label="Price" rules={[{ type: 'email' }]}>
                        <Input />
                    </Form.Item>
                    <Form.Item name={['product', 'age']} label="Age" rules={[{ type: 'number', min: 0, max: 99 }]}>
                        <InputNumber />
                    </Form.Item>
                    <Form.Item name={['product', 'website']} label="Website">
                        <Input />
                    </Form.Item>
                    <Form.Item name={['product', 'introduction']} label="Introduction">
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                        <Button type="primary" htmlType="submit">
                            Submit
                    </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}

export default AddItemScreen;