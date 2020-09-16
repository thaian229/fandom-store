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
    children.push(<Option key="J-Photobook">J-Photobook</Option>);
    children.push(<Option key="J-Illustration">J-Illustration</Option>);
    children.push(<Option key={"J-NovelAndManga"}>J-Novel{"&"}Manga</Option>);
    children.push(<Option key="J-Fashion">J-Fashion</Option>);
    children.push(<Option key="J-Figure">J-Figure</Option>);
    children.push(<Option key="J-Other">J-Other</Option>);
    children.push(<Option key="J-Audio">J-Audio</Option>);
    children.push(<Option key="J-Video">J-Video</Option>);
    children.push(<Option key="J-Game">J-Game</Option>);
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

class EditItemScreen extends React.Component {
    state = {
        currentUser: {
            email: window.localStorage.getItem("email"),
            id: window.localStorage.getItem("id"),
            is_admin: false
        },
        prod_id: window.location.href.split("/")[window.location.href.split("/").length - 1],
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
        submitLoading: false,
    }

    adminCheck = () => {
        if (this.state.currentUser.email) {
            fetch("http://192.168.68.120:3001/api/users/checkAdmin", {
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

    getItem = () => {
        fetch(`http://192.168.68.120:3001/api/posts/getItem/${this.state.prod_id}`, {
            credentials: "include",
            method: "GET"
        })
            .then(res => {
                return res.json();
            })
            .then(data => {
                console.log(data)
                const fileList = []
                const thumbnail = []
                data.data.image_url.map((item, index) => {
                    if (index === 0) {
                        thumbnail.push({
                            uid: -index,
                            name: item.split('/')[item.split('/').length - 1],
                            status: 'done',
                            url: item,
                            old: true,
                        })
                    } else {
                        fileList.push({
                            uid: -index,
                            name: item.split('/')[item.split('/').length - 1],
                            status: 'done',
                            url: item,
                            old: true,
                        })
                    }
                })
                this.setState({
                    data: {
                        prod_name: data.data.prod_name,
                        price: data.data.price,
                        image_url: data.data.image_url,
                        description: data.data.description,
                        stock: data.data.stock,
                        tags: data.data.tags
                    },
                    thumbnail: thumbnail,
                    fileList: fileList
                })
                console.log(this.state)
            })
            .catch(err => {
                if (err) {
                    console.log(err);
                    window.alert(err.message);
                }
            });
    }

    componentWillMount() {
        this.adminCheck()
        this.getItem()
    }

    componentDidMount() {
        console.log(this.state.prod_id)

        console.log(this.state)
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

    updateItem = (finalImgUrls) => {
        fetch(`http://192.168.68.120:3001/api/posts/editItem`, {
            credentials: "include",
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: this.state.prod_id,
                prod_name: this.state.data.prod_name,
                price: this.state.data.price,
                image_url: finalImgUrls,
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
                    // console.log(true)
                    window.location.pathname = "/";
                else console.log(data)
            })
            .catch(e => {
                if (e) {
                    console.log(e);
                    window.alert(e.message);
                }
            });
    }

    getProdUrls = async (formDataProd, oldItem, finalImgUrls) => {
        oldItem.map(item => {
            finalImgUrls.push(item);
        })
        console.log(formDataProd)
        if (formDataProd) {
            fetch(`http://192.168.68.120:3001/api/uploads/post/productImg`, {
                credentials: "include",
                method: "POST",
                headers: {
                    'Accept': 'application/json',
                },
                body: formDataProd,
            })
                .then(res => {
                    return res.json();
                })
                .then(data => {
                    console.log(data.imgUrls);
                    data.imgUrls.map(item => {
                        finalImgUrls.push(item)
                    })
                    console.log(this.state)
                    this.updateItem(finalImgUrls)
                })
                .catch(er => {
                    if (er) {
                        console.log(er);
                        window.alert(er.message);
                    }
                });
        } else {
            this.updateItem(finalImgUrls);
        }
    }

    getThumbnailUrl = (formDataThumbnail, formDataProd, oldItem, finalImgUrls) => {
        fetch(`http://192.168.68.120:3001/api/uploads/post/thumbnail`, {
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
                finalImgUrls.push(data.imgUrl)
                if (oldItem.length === this.state.data.image_url.length - 1) {
                    oldItem.map(item => {
                        finalImgUrls.push(item)
                    })
                    this.updateItem(finalImgUrls)
                } else {
                    this.getProdUrls(formDataProd, oldItem, finalImgUrls)
                }
            })
            .catch(err => {
                if (err) {
                    console.log(err);
                    window.alert(err.message);
                }
            });
    }

    getImageUrlsAndUpdate = async (event) => {
        let formDataProd = new FormData()
        let formDataThumbnail = new FormData()
        let oldItem = []
        let finalImgUrls = []

        if (!this.state.thumbnail[0].old) {
            formDataThumbnail.append('image', this.state.thumbnail[0].originFileObj)
        } else {
            oldItem.push(this.state.thumbnail[0].url)
        }

        this.state.fileList.map(item => {
            if (!item.old) {
                formDataProd.append('image', item.originFileObj);
            } else {
                oldItem.push(item.url)
            }
        })

        if (!this.state.thumbnail[0].old) {
            this.getThumbnailUrl(formDataThumbnail, formDataProd, oldItem, finalImgUrls)
        } else {
            if (oldItem.length === this.state.fileList.length + 1 && oldItem.length === this.state.data.image_url.length) {
                finalImgUrls = this.state.data.image_url
                this.updateItem(finalImgUrls)
                console.log('here1');
            } else {
                this.getProdUrls(formDataProd, oldItem, finalImgUrls)
                console.log('here2');
                console.log(formDataProd)
            }
        }
    }

    handleChangeCategories = value => {
        this.setState({
            data: {
                ...this.state.data,
                tags: value
            }
        });
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
        this.setState({
            submitLoading: true
        })
        this.getImageUrlsAndUpdate();
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
            <Row align="middle" justify="space-around" style={{ backgroundColor: "#001529", minHeight: "100vh" }}>
                {this.state.data.prod_name && this.state.currentUser.is_admin
                    ? (
                        <Col sm={{ span: 22 }} lg={{ span: 18 }} style={{ padding: "5px" }} style={{ borderWidth: "1px", borderStyle: "solid", borderColor: "#ceebeb", borderRadius: "50px", backgroundColor: "#fcffff" }}>
                            <Form
                                {...layout}
                                name="nest-messages"
                                onFinish={event => { this.onFinish() }}
                                validateMessages={validateMessages}
                                style={{ margin: "10px", paddingRight: "20px" }}
                                initialValues={{
                                    productName: this.state.data.prod_name,
                                    productPrice: this.state.data.price,
                                    productStock: this.state.data.stock,
                                    productTags: this.state.data.tags,
                                    productDescription: this.state.data.description,
                                }}
                            >
                                <Row align="middle" justify="space-around">
                                    <Col>
                                        <h1>
                                            EDIT PRODUCT
                            </h1>
                                    </Col>
                                </Row>
                                <Form.Item name={['productName']} label="Product Name" rules={[{ required: true }]}>
                                    <Input id="nameInput" style={{ maxWidth: "700px" }} onChange={this.handleProdNameChange} />
                                </Form.Item>
                                <FormItem label="Product Image" name={['productImgs']} labelCol={{ ...layout.labelCol }}>
                                    <Upload
                                        action="http://192.168.68.120:3001/api/uploads/post/checkImg"
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
                                <FormItem label="Thumbnail" name={['productThumbnail']} labelCol={{ ...layout.labelCol }}>
                                    <Upload
                                        action="http://192.168.68.120:3001/api/uploads/post/checkImg"
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
                                <Form.Item name={['productPrice']} label="Price (USD)" rules={[{ type: 'number', min: 0, required: true }]}>
                                    <InputNumber
                                        defaultValue={0}
                                        formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                        onChange={this.handlePriceChange} />
                                </Form.Item>
                                <Form.Item name={['productStock']} label="Stock" rules={[{ type: 'number', min: 0, required: true }]}>
                                    <InputNumber
                                        defaultValue={0}
                                        onChange={this.handleStockChange} />
                                </Form.Item>
                                <Form.Item name={['productTags']} label="Category" rules={[{ required: true }]}>
                                    <Select
                                        mode="single"
                                        style={{ width: "100%", maxWidth: "700px" }}
                                        placeholder="Please select"
                                        onChange={this.handleChangeCategories}
                                    >
                                        {children}
                                    </Select>
                                </Form.Item>
                                <Form.Item name={['productDescription']} label="Description" rules={[{ required: true }]}>
                                    <Input.TextArea style={{ maxWidth: "700px" }} onChange={this.handleDescriptionChange} />
                                </Form.Item>
                                <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 11 }}>
                                    <Button type="primary" htmlType="submit" loading={this.state.submitLoading}>
                                        Submit
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Col>
                    )
                    : null}

            </Row>
        )
    }
}

export default EditItemScreen;