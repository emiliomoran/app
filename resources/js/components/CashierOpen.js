import React, { useState, useEffect } from "react";
import {
    Form,
    Row,
    Col,
    Button,
    Input,
    DatePicker,
    TimePicker,
    InputNumber
} from "antd";
import moment from "moment";
import axios from "axios";
import Utils from "../utils/Utils";
import Message from "../utils/Message";

const { TextArea } = Input;
const dateFormat = "YYYY/MM/DD";
const timeFormat = "HH:mm";

const CashierOpen = props => {
    const { setShowClose } = props;

    const [form] = Form.useForm();
    const [cashier, setCashier] = useState(null);
    const [disabled, setDisabled] = useState(false);
    const [showBtn, setShowBtn] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios
            .get("http://127.0.0.1:8000/api/v1/cashier/balance")
            .then(response => {
                console.log(response);
                if (response.data.results) {
                    setCashier(response.data.results);
                    form.setFieldsValue({
                        date_open: moment(
                            response.data.results.date_open,
                            dateFormat
                        ),
                        hour_open: moment(
                            response.data.results.hour_open,
                            timeFormat
                        ),
                        value_previous_close: Utils.parseToDollars(
                            response.data.results.value_previous_close
                        )
                    });
                } else {
                    setShowBtn(false);
                    setDisabled(true);
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const onFinish = values => {
        setLoading(true);
        console.log("Received values of form: ", values);
        const body = {
            date_open: cashier.date_open,
            hour_open: cashier.hour_open,
            value_previous_close: cashier.value_previous_close,
            value_open: Utils.parseToCents(values.value_open),
            observation: values.observation ? values.observation : ""
        };
        console.log(body);
        axios
            .post("api/v1/cashier/balance/open/day", body)
            .then(response => {
                console.log(response);
                setLoading(false);
                setShowBtn(false);
                setDisabled(true);
                Message.success(response.data.msg);
                setShowClose(true);
            })
            .catch(error => {
                console.log(error);
                setLoading(false);
                Message.error("Error en apertura de caja");
            });
    };

    return (
        <Row>
            <Col
                lg={{ span: 14, offset: 5 }}
                md={{ span: 14, offset: 5 }}
                sm={{ span: 14, offset: 5 }}
                xs={{ span: 22, offset: 1 }}
            >
                <h4>Apertura de caja</h4>
                <br></br>

                <Form
                    form={form}
                    name="cashierOpen"
                    onFinish={onFinish}
                    layout={"vertical"}
                    initialValues={{
                        value_previous_close: 0,
                        value_open: 0
                    }}
                >
                    <Row>
                        <Col lg={11} md={11} sm={24}>
                            <Form.Item
                                name="date_open"
                                label="Fecha (yyyy/mm/dd)"
                                rules={[
                                    {
                                        required: true,
                                        message: "Ingrese una fecha!"
                                    }
                                ]}
                            >
                                <DatePicker
                                    format={dateFormat}
                                    style={{ width: "100%" }}
                                    disabled
                                />
                            </Form.Item>
                        </Col>
                        <Col lg={2} md={2} sm={24}></Col>
                        <Col lg={11} md={11} sm={24}>
                            <Form.Item
                                name="hour_open"
                                label="Hora (hh:mm)"
                                rules={[
                                    {
                                        required: true,
                                        message: "Ingrese una hora!"
                                    }
                                ]}
                            >
                                <TimePicker
                                    format={timeFormat}
                                    style={{ width: "100%" }}
                                    disabled
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={11} md={11} sm={24}>
                            <Form.Item
                                name="value_previous_close"
                                label="Total anterior"
                                rules={[
                                    {
                                        required: true,
                                        message: "Ingrese una total anterior!"
                                    }
                                ]}
                            >
                                <InputNumber
                                    formatter={value =>
                                        `$ ${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                        )
                                    }
                                    parser={value =>
                                        value.replace(/\$\s?|(,*)/g, "")
                                    }
                                    min={0}
                                    step={0.1}
                                    style={{ width: "100%" }}
                                    disabled
                                />
                            </Form.Item>
                        </Col>
                        <Col lg={2} md={2} sm={24}></Col>
                        <Col lg={11} md={11} sm={24}>
                            <Form.Item
                                name="value_open"
                                label="Total inicial"
                                rules={[
                                    {
                                        required: true,
                                        message: "Ingrese un total inicial!"
                                    }
                                ]}
                            >
                                <InputNumber
                                    formatter={value =>
                                        `$ ${value}`.replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                        )
                                    }
                                    parser={value =>
                                        value.replace(/\$\s?|(,*)/g, "")
                                    }
                                    min={0}
                                    step={0.1}
                                    style={{ width: "100%" }}
                                    disabled={disabled}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={24} md={24} sm={24}>
                            <Form.Item name="observation" label="Observaciones">
                                <TextArea
                                    autoSize={{ minRows: 3, maxRows: 5 }}
                                    disabled={disabled}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col
                            lg={{ span: 10, offset: 7 }}
                            md={{ span: 10, offset: 7 }}
                            sm={{ span: 10, offset: 7 }}
                            xs={{ span: 22, offset: 1 }}
                        >
                            {showBtn && (
                                <Button
                                    type="primary"
                                    htmlType="submit"
                                    style={{ width: "100%" }}
                                    loading={loading}
                                >
                                    Enviar
                                </Button>
                            )}
                        </Col>
                    </Row>
                </Form>
            </Col>
        </Row>
    );
};

export default CashierOpen;
