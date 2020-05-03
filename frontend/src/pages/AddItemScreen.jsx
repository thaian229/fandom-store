import React from "react";
import { Upload, Modal, Button, Form, Input, InputNumber, Col, Row, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import FormItem from "antd/lib/form/FormItem";

const { Option } = Select;

function getBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

const children = [];
{
    children.push(<Option key="K-Album">K-Album</Option>);
    children.push(<Option key="K-Merchandise">K-Merchandise</Option>);
    children.push(<Option key="K-Concert">K-Concert</Option>);
    children.push(<Option key="K-Keyring">K-Keyring</Option>);
    children.push(<Option key="K-Artbook">K-Artbook</Option>);
    children.push(<Option key="K-Photocard">K-Photocard</Option>);
    children.push(<Option key="K-Slogan">K-Slogan</Option>);
    children.push(<Option key="K-Other">K-Other</Option>);
    children.push(<Option key="J-Album">J-Album</Option>);
    children.push(<Option key="J-Merchandise">J-Merchandise</Option>);
    children.push(<Option key="J-Concert">J-Concert</Option>);
    children.push(<Option key="J-Keyring">J-Keyring</Option>);
    children.push(<Option key="J-Artbook">J-Artbook</Option>);
    children.push(<Option key="J-Photocard">J-Photocard</Option>);
    children.push(<Option key="J-Slogan">J-Slogan</Option>);
    children.push(<Option key="J-Other">J-Other</Option>);
}

const layout = {
    labelCol: { span: 6 },
    wrapperCol: { span: 18 },
};

const validateMessages = {
    required: '${label} is required!',
    types: {
        number: '${label} is not valid!',
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
            is_admin: false
        },
        data: {
            prod_name: '',
            price: 0,
            image_url: [],
            description: '',
            stock: 0,
            tags: ''
        },
        previewVisible: false,
        previewImage: '',
        previewTitle: '',
        fileList: [],
        thumbnail: [],
        previewVisibleT: false,
        previewImageT: '',
        previewTitleT: '',
        finalImgUrls: [],
    }

    adminCheck = () => {
        if (this.state.currentUser.email) {
            fetch("http://localhost:3001/api/users/checkAdmin", {
                credentials: "include",
                method: "GET"
            })
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    this.setState({
                        currentUser: {
                            ...this.state.currentUser,
                            is_admin: data.data.is_admin
                        }
                    })
                    if (!data.data.is_admin) {
                        window.location.pathname = "/"
                    }
                })
        } else {
            window.location.pathname = "/login"
        }
    }

    componentWillMount() {
        this.adminCheck()
    }

    handleCancelImg = () => this.setState({ previewVisible: false });

    handlePreviewImg = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
            previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChangeImg = ({ fileList }) => { this.setState({ fileList }); console.log(this.state.fileList) }

    handleCancelImgT = () => this.setState({ previewVisibleT: false });

    handlePreviewImgT = async file => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        this.setState({
            previewImageT: file.url || file.preview,
            previewVisibleT: true,
            previewTitleT: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
        });
    };

    handleChangeImgT = ({ fileList }) => this.setState({ thumbnail: fileList });

    itemCreate = () => {
        console.log(this.state)
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

    getImageUrlsAndCreate = (event) => {
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
                const finalImgUrls = []
                finalImgUrls.push(data.imgUrl)
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
                            finalImgUrls.push(item)
                        })
                        this.setState({
                            data: {
                                ...this.state.data,
                                image_url: finalImgUrls
                            }
                        })
                        this.itemCreate()
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

    handleChangeCategories = value => {
        this.setState({
            data: {
                ...this.state.data,
                tags: value
            }
        });
        console.log(value)
    };

    handleProdNameChange = event => {
        event.preventDefault()
        this.setState({
            data: {
                ...this.state.data,
                prod_name: event.target.value
            }
        });
    }

    handlePriceChange = value => {
        this.setState({
            data: {
                ...this.state.data,
                price: value
            }
        });
    }

    handleStockChange = value => {
        this.setState({
            data: {
                ...this.state.data,
                stock: value
            }
        });
    }

    handleDescriptionChange = event => {
        event.preventDefault()
        this.setState({
            data: {
                ...this.state.data,
                description: event.target.value
            }
        });
    }

    onFinish = () => {
        this.getImageUrlsAndCreate();
    }

    render() {

        const { previewVisible, previewImage, fileList, previewTitle, thumbnail, previewVisibleT, previewImageT, previewTitleT } = this.state;
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">Upload</div>
            </div>
        );

        return (

            <Row align="middle" justify="space-around" style={{ paddingTop: "50px" }}>
                {this.state.currentUser.is_admin ? (
                    <Col sm={{ span: 22 }} lg={{ span: 18 }} style={{ padding: "5px" }} style={{ borderWidth: "1px", borderStyle: "solid", borderColor: "#ceebeb", borderRadius: "50px", backgroundColor: "#fcffff" }}>
                        {/* <Button onClick={this.getImageUrls}>TEST</Button> */}
                        <Form {...layout} name="nest-messages" onFinish={event => { this.onFinish() }} validateMessages={validateMessages} style={{ margin: "10px", paddingRight: "20px" }}>
                            <Row align="middle" justify="space-around">
                                <Col>
                                    <h1>
                                        ADD NEW PRODUCT
                            </h1>
                                </Col>
                            </Row>
                            <Form.Item name={['product', 'prod_name']} label="Product Name" rules={[{ required: true }]}>
                                <Input style={{ maxWidth: "700px" }} onChange={this.handleProdNameChange} />
                            </Form.Item>
                            <FormItem label="Product Image" name={['product', 'prodImgs']} rules={[{ required: true }]} labelCol={{ ...layout.labelCol }}>
                                <Upload
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    listType="picture-card"
                                    fileList={fileList}
                                    onPreview={this.handlePreviewImg}
                                    onChange={this.handleChangeImg}
                                >
                                    {fileList.length >= 4 ? null : uploadButton}
                                </Upload>
                            </FormItem>
                            <Modal
                                visible={previewVisible}
                                title={previewTitle}
                                footer={null}
                                onCancel={this.handleCancelImg}
                            >
                                <img alt="example" style={{ width: '100%' }} src={previewImage} />
                            </Modal>
                            <FormItem label="Thumbnail" name={['product', 'thumbnail']} rules={[{ required: true }]} labelCol={{ ...layout.labelCol }}>
                                <Upload
                                    action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                                    listType="picture-card"
                                    fileList={thumbnail}
                                    onPreview={this.handlePreviewImgT}
                                    onChange={this.handleChangeImgT}
                                >
                                    {thumbnail.length >= 1 ? null : uploadButton}
                                </Upload>
                            </FormItem>
                            <Modal
                                visible={previewVisibleT}
                                title={previewTitleT}
                                footer={null}
                                onCancel={this.handleCancelImgT}
                            >
                                <img alt="example" style={{ width: '100%' }} src={previewImageT} />
                            </Modal>
                            <Form.Item name={['product', 'price']} label="Price (USD)" rules={[{ type: 'number', min: 0, required: true }]}>
                                <InputNumber
                                    defaultValue={0}
                                    formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                    onChange={this.handlePriceChange} />
                            </Form.Item>
                            <Form.Item name={['product', 'stock']} label="Stock" rules={[{ type: 'number', min: 0, required: true }]}>
                                <InputNumber
                                    defaultValue={0}
                                    onChange={this.handleStockChange} />
                            </Form.Item>
                            <Form.Item name={['product', 'tags']} label="Category" rules={[{ required: true }]}>
                                <Select
                                    mode="single"
                                    style={{ width: "100%", maxWidth: "700px" }}
                                    placeholder="Please select"
                                    onChange={this.handleChangeCategories}
                                >
                                    {children}
                                </Select>
                            </Form.Item>
                            <Form.Item name={['product', 'description']} label="Description" rules={[{ required: true }]}>
                                <Input.TextArea style={{ maxWidth: "700px" }} onChange={this.handleDescriptionChange} />
                            </Form.Item>
                            <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 11 }}>
                                <Button type="primary" htmlType="submit">
                                    Submit
                            </Button>
                            </Form.Item>
                        </Form>
                    </Col>
                ) : null}
            </Row>
        )
    }
}

export default AddItemScreen;