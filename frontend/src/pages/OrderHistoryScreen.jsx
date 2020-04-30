import React from "react";
import { } from "antd";

class OrderHistoryScreen extends React.Component {
    state = {
        currentUser: {
            email: window.sessionStorage.getItem("email"),
            id: window.sessionStorage.getItem("id"),
            is_admin: window.sessionStorage.getItem("is_admin") === 'true'
        }
    }

    componentDidMount() {
        // verify login
        if (!this.state.currentUser.id) {
            window.alert('Access Denied, Please Login')
            window.location.pathname = `/`
        } else { // fetch orders info
            fetch(`http://localhost:3001/api/users/orderHistory`, {
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
                    console.log(data)
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    render() {
        return (
            <div></div>
        )
    }
}

export default OrderHistoryScreen;