import React from "react";
import { } from "antd";

class ProductScreen extends React.Component {
    state = {
        prod_id: undefined,
        prod_data: {},
        cmt_data: [],
        recommend_data: [],
        currentUser: {
            is_admin: false,
        },
    };

    componentWillMount() {
        const is_admin = window.localStorage.getItem("is_admin");
        if (is_admin) {
            this.setState({
                currentUser: {
                    is_admin: is_admin,
                },
            });
        }
    }

    componentDidMount() {
        // fetch all
        const { prod_id } = this.props.match.params;
        this.setState({
            prod_id: prod_id,
        });
        // fetch product details
        fetch(`http://localhost:3001/api/posts/getItem/${prod_id}`, {
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
                    prod_data: data.data,
                });
                // fetch comment of product
                fetch(`http://localhost:3001/api/posts/getAllComment/${prod_id}`, {
                    method: 'GET',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                    .then((res) => {
                        return res.json();
                    })
                    .then((data) => {
                        this.setState({
                            cmt_data: data.data,
                        });
                        // fetch related products
                        fetch(`http://localhost:3001/api/posts/getRecommended?tag=${this.state.prod_data.tags}`, {
                            method: 'GET',
                            credentials: 'include',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                        })
                            .then((res) => {
                                return res.json();
                            })
                            .then((data) => {
                                this.setState({
                                    recommend_data: data.data,
                                });
                                console.log(this.state);
                            })
                            .catch((error) => {
                                console.log(error)
                            });
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            })
            .catch((error) => {
                console.log(error)
            });
    }

    render() {
        return (
            <div></div>
        )
    }
}

export default ProductScreen;