import React, { useState } from "react";
import ReactDOM from "react-dom";
import "antd/dist/antd.css";
import { Row, Col, Layout } from "antd";
import { ExceptionOutlined } from "@ant-design/icons";

//Components
import CashierOpen from "./CashierOpen";
import CashierClose from "./CashierClose";

const { Content } = Layout;

const App = () => {
    const [showClose, setShowClose] = useState(false);

    return (
        <Layout style={{ height: "100vh" }}>
            <Content>
                <br></br>
                <Row align="middle">
                    <Col lg={12} md={12} sm={24}>
                        <CashierOpen setShowClose={setShowClose} />
                    </Col>
                    <Col lg={12} md={12} sm={24}>
                        {showClose ? (
                            <CashierClose />
                        ) : (
                            <span style={{ fontSize: 30 }}>
                                <ExceptionOutlined style={{ fontSize: 50 }} />{" "}
                                No existe información para mostrar
                            </span>
                        )}
                    </Col>
                </Row>
            </Content>
        </Layout>
    );
};

ReactDOM.render(<App />, document.getElementById("app"));
