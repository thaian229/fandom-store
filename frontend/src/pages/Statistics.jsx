import React from 'react';
import { Donut, Column, Liquid } from '@ant-design/charts';
import { Row, Col, Card, Statistic, Tabs, Table } from 'antd';
import Item from 'antd/lib/list/Item';

const { TabPane } = Tabs;

class Statistics extends React.Component {
    state = {
        currentUser: {
            email: window.localStorage.getItem("email"),
            id: window.localStorage.getItem("id"),
            is_admin: false
        },
        total_sale: 0,
        this_month_sale: 0,
        user_number: 0,
        product_data: [0, 0, 0, 0],
        revenue_data: [0, 0, 0, 0],
        sale_for_conversion: 0,
        views_for_conversion: 1,
        a_data: [],
        k_data: [],
        j_data: [],
        viewRanking: [],
        saleRanking: [],
        loyalCustomers: []
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

    componentDidMount() {
        // verify login
        if (!this.state.currentUser.id) {
            window.alert('Access Denied, Please Login')
            window.location.pathname = `/login`
        }
        else { //fetch
            fetch(`http://localhost:3001/api/stats/getFirstRow`, {
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
                        total_sale: data.data.total_sale,
                        this_month_sale: data.data.this_month_sale,
                        user_number: data.data.user_number,
                    })
                })
                .catch((err) => {
                    console.log(err)
                })

            fetch(`http://localhost:3001/api/stats/getColChart`, {
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
                    console.log(data.data)
                    this.setState({
                        product_data: data.data.product_data,
                        revenue_data: data.data.revenue_data
                    })
                })
                .catch((err) => {
                    console.log(err)
                })

            fetch(`http://localhost:3001/api/stats/getConversionRate`, {
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
                    console.log(data.data)
                    this.setState({
                        sale_for_conversion: data.data.total_sold,
                        views_for_conversion: data.data.total_views
                    })
                })
                .catch((err) => {
                    console.log(err)
                })

            fetch(`http://localhost:3001/api/stats/getDonut`, {
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
                    console.log(data.data)
                    this.setState({
                        a_data: data.data.a_data,
                        k_data: data.data.k_data,
                        j_data: data.data.j_data,
                    })
                })
                .catch((err) => {
                    console.log(err)
                })

            fetch(`http://localhost:3001/api/stats/ranking`, {
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
                    console.log(data.data)
                    this.setState({
                        viewRanking: data.data.viewRanking,
                        saleRanking: data.data.saleRanking
                    })
                })
                .catch((err) => {
                    console.log(err)
                })

            fetch(`http://localhost:3001/api/stats/loyalCustomers`, {
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
                    console.log(data.data)
                    this.setState({
                        loyalCustomers: data.data.data
                    })
                })
                .catch((err) => {
                    console.log(err)
                })
        }
    }

    render() {
        console.log(this.state)
        const dataColP = [
            {
                Quater: 'Q1',
                Products: this.state.product_data[0],
            },
            {
                Quater: 'Q2',
                Products: this.state.product_data[1],
            },
            {
                Quater: 'Q3',
                Products: this.state.product_data[2],
            },
            {
                Quater: 'Q4',
                Products: this.state.product_data[3],
            }
        ];

        const dataColR = [
            {
                Quater: 'Q1',
                Revenue: this.state.revenue_data[0],
            },
            {
                Quater: 'Q2',
                Revenue: this.state.revenue_data[1],
            },
            {
                Quater: 'Q3',
                Revenue: this.state.revenue_data[2],
            },
            {
                Quater: 'Q4',
                Revenue: this.state.revenue_data[3],
            }
        ];

        const dataDonut = [];
        const dataDonutK = [];
        const dataDonutJ = [];
        let sum = 0;
        let sumk = 0;
        let sumj = 0;
        this.state.a_data.forEach(item => {
            dataDonut.push({
                type: item.tags,
                value: item.sum,
            })
            sum += parseInt(item.sum);
        })
        if (this.state.a_data[0]) {
            if (sum < this.state.a_data[0].total)
                dataDonut.push({
                    type: `Others`,
                    value: this.state.a_data[0].total - sum
                })
        }

        this.state.k_data.forEach(item => {
            dataDonutK.push({
                type: item.tags,
                value: item.sum,
            })
            sumk += parseInt(item.sum);
        })
        if (this.state.k_data[0]) {
            if (sum < this.state.k_data[0].total)
                dataDonutK.push({
                    type: `Others`,
                    value: this.state.k_data[0].total - sum
                })
        }

        this.state.j_data.forEach(item => {
            dataDonutJ.push({
                type: item.tags,
                value: item.sum,
            })
            sumj += parseInt(item.sum);
        })
        if (this.state.j_data[0]) {
            if (sum < this.state.j_data[0].total)
                dataDonutJ.push({
                    type: `Others`,
                    value: this.state.j_data[0].total - sum
                })
        }

        const vRanking = [];
        let i = 1;
        this.state.viewRanking.forEach(element => {
            vRanking.push({
                'key': i,
                'name': <a href={'http://localhost:3000/product/' + element.id}>{element.prod_name}</a>,
                'id': element.id,
                'views': element.views
            })
            i++;
        });

        const sRanking = [];

        i = 1;

        this.state.saleRanking.forEach(element => {
            sRanking.push({
                'key': i,
                'name': <a href={'http://localhost:3000/product/' + element.id}>{element.prod_name}</a>,
                'id': element.id,
                'sold': element.sold
            })
            i++;
        });



        const loyalCustomersData = []

        i = 1;

        this.state.loyalCustomers.forEach(element => {
            loyalCustomersData.push({
                'key': i,
                'name': element.full_name,
                'email': element.email,
                'tel_num': element.tel_num,
                'spent': element.spent
            })
            i++;
        });

        const vColumns = [
            {
                title: 'Ranking',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: 'Products Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: 'Views',
                dataIndex: 'views',
                key: 'views',
            },
        ];

        const sColumns = [
            {
                title: 'Ranking',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: 'Products Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'ID',
                dataIndex: 'id',
                key: 'id',
            },
            {
                title: 'Sold',
                dataIndex: 'sold',
                key: 'sold',
            },
        ];

        const cColumns = [
            {
                title: '',
                dataIndex: 'key',
                key: 'key',
            },
            {
                title: 'Full Name',
                dataIndex: 'name',
                key: 'name',
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
            },
            {
                title: 'Phone Number',
                dataIndex: 'tel_num',
                key: 'tel_num',
            },
            {
                title: 'Spent',
                dataIndex: 'spent',
                key: 'spent',
            },
        ];

        const configColP = {
            title: {
                visible: false,
            },
            description: {
                visible: false,
            },
            forceFit: true,
            data: dataColP,
            padding: 'auto',
            xField: 'Quater',
            yField: 'Products',
            conversionTag: {
                visible: true,
            },
        };

        const configColR = {
            title: {
                visible: false,
            },
            description: {
                visible: false,
            },
            forceFit: true,
            data: dataColR,
            padding: 'auto',
            xField: 'Quater',
            yField: 'Revenue',
            conversionTag: {
                visible: true,
            },
        };

        const configCircle = {
            forceFit: true,
            title: {
                visible: false,
                text: 'TITLE',
            },
            description: {
                visible: false,
                text: 'DESCRIPTION',
            },
            statistic: {
                visible: true,
                content: {
                    value: `${this.state.a_data[0] ? this.state.a_data[0].total : 0}`,
                    name: 'Sales',
                },
            },
            label: {
                visible: false,
            },
            legend: {
                visible: true,
                position: 'right',
            },
            radius: 0.8,
            padding: 0,
            data: dataDonut,
            angleField: 'value',
            colorField: 'type',
        };

        const configCircle2 = {
            forceFit: true,
            title: {
                visible: false,
                text: 'TITLE',
            },
            description: {
                visible: false,
                text: 'DESCRIPTION',
            },
            statistic: {
                visible: true,
                content: {
                    value: `${this.state.k_data[0] ? this.state.k_data[0].k_total : 0}`,
                    name: 'Sales',
                },
            },
            label: {
                visible: false,
            },
            legend: {
                visible: true,
                position: 'right',
            },
            radius: 0.8,
            padding: 0,
            data: dataDonutK,
            angleField: 'value',
            colorField: 'type',
        };

        const configCircle3 = {
            forceFit: true,
            title: {
                visible: false,
                text: 'TITLE',
            },
            description: {
                visible: false,
                text: 'DESCRIPTION',
            },
            statistic: {
                visible: true,
                content: {
                    value: `${this.state.j_data[0] ? this.state.j_data[0].j_total : 0}`,
                    name: 'Sales',
                },
            },
            label: {
                visible: false,
            },
            legend: {
                visible: true,
                position: 'right',
            },
            radius: 0.8,
            padding: 0,
            data: dataDonutJ,
            angleField: 'value',
            colorField: 'type',
        };

        const configLiquids = {
            title: {
                visible: false,
            },
            description: {
                visible: false,
            },
            // padding: '100px',
            min: 0,
            max: parseInt(this.state.views_for_conversion),
            value: parseInt(this.state.sale_for_conversion),
            statistic: {
                formatter: value => `${((100 * value) / parseInt(this.state.views_for_conversion)).toFixed(1)}%`,
            },
        };

        return (
            <div
                style={{
                    backgroundImage: "linear-gradient(to bottom, #001529, #FCAE58)",
                    padding: "50px 4vw 70px 4vw",
                    minHeight: "100vh"
                }}>
                <Row
                    align="top"
                    justify='space-around'
                    style={{
                        paddingTop: "50px",
                        paddingBottom: "50px",
                        backgroundColor: "#fdfdfd",
                        borderRadius: "10px"
                    }}>
                    <Col span={6}>
                        <Card bordered={true} style={{ width: '100%' }}>
                            <Statistic title="Revenue" value={this.state.total_sale} />

                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={true} style={{ width: '100%' }}>
                            <Statistic title="Month Revenue" value={this.state.this_month_sale} />

                        </Card>
                    </Col>
                    <Col span={6}>
                        <Card bordered={true} style={{ width: '100%' }}>
                            <Statistic title="Users" value={this.state.user_number} />
                        </Card>
                    </Col>
                    <Col span={22} style={{ marginTop: '50px' }}>
                        <Card bordered={true} style={{ width: '100%' }}>
                            <Tabs type="card">
                                <TabPane tab="Product" key="1">
                                    <div style={{ height: "30px" }}></div>
                                    <Column {...configColP} />
                                </TabPane>
                                <TabPane tab="Revenue" key="2">
                                    <div style={{ height: "30px" }}></div>
                                    <Column {...configColR} />
                                </TabPane>
                            </Tabs>
                        </Card>
                    </Col>
                    <Col span={7} align="left" style={{ marginTop: '50px' }}>
                        <Card title="Conversion rate" bordered={true} style={{ width: '100%' }}>
                            <Liquid {...configLiquids} />
                        </Card>
                    </Col>
                    <Col span={13} align="left" style={{ marginTop: '50px' }}>
                        <Card bordered={true} style={{ width: '100%' }}>
                            <Tabs type="card" style={{ maxWidth: "800px" }}>
                                <TabPane tab="Total" key="1">
                                    <Donut {...configCircle}></Donut>
                                </TabPane>
                                <TabPane tab="K-Market" key="2">
                                    <Donut {...configCircle2}></Donut>
                                </TabPane>
                                <TabPane tab="J-Market" key="3">
                                    <Donut {...configCircle3}></Donut>
                                </TabPane>
                            </Tabs>
                        </Card>
                    </Col>
                    <Col span={10} align="left" style={{ marginTop: '50px' }}>
                        <Card title="View Ranking" bordered={true} style={{ width: '100%' }}>
                            <Table dataSource={vRanking} columns={vColumns} pagination={false} />
                        </Card>
                    </Col>
                    <Col span={10} align="left" style={{ marginTop: '50px' }}>
                        <Card title="Sale Ranking" bordered={true} style={{ width: '100%' }}>
                            <Table dataSource={sRanking} columns={sColumns} pagination={false} />
                        </Card>
                    </Col>
                    <Col span={22} align="left" style={{ marginTop: '50px' }}>
                        <Card title="Loyal Customers" bordered={true} style={{ width: '100%' }}>
                            <Table dataSource={loyalCustomersData} columns={cColumns} pagination={false} />
                        </Card>
                    </Col>
                </Row>
            </div >
        );
    }
};
export default Statistics;

