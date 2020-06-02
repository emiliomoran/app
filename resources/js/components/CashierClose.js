import React, { useState, useEffect } from "react";
import {
    Form,
    Row,
    Col,
    Button,
    Input,
    DatePicker,
    TimePicker,
    InputNumber,
    Table,
    Modal
} from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import moment from "moment";
import axios from "axios";
import Utils from "../utils/Utils";
import Message from "../utils/Message";

const dateFormat = "YYYY/MM/DD";
const timeFormat = "HH:mm";

const ExpenseForm = ({ visible, onCreate, onCancel }) => {
    const [form] = Form.useForm();
    return (
        <Modal
            visible={visible}
            title="Nuevo gasto"
            okText="Agregar"
            cancelText="Cancelar"
            onCancel={onCancel}
            onOk={() => {
                form.validateFields()
                    .then(values => {
                        form.resetFields();
                        onCreate(values);
                    })
                    .catch(info => {
                        console.log("Validate Failed:", info);
                    });
            }}
        >
            <Form form={form} layout="vertical" name="formExpense">
                <Form.Item
                    name="name"
                    label="Name"
                    rules={[
                        {
                            required: true,
                            message: "Ingrese un nombre!"
                        }
                    ]}
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="value"
                    label="Valor"
                    rules={[
                        {
                            required: true,
                            message: "Ingrese un valor!"
                        }
                    ]}
                >
                    <InputNumber
                        formatter={value =>
                            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                        }
                        parser={value => value.replace(/\$\s?|(,*)/g, "")}
                        min={0}
                        step={0.1}
                        style={{ width: "100%" }}
                    />
                </Form.Item>
            </Form>
        </Modal>
    );
};

const CashierClose = () => {
    const [data, setData] = useState([]);
    const [visible, setVisible] = useState(false);
    const [totalSales, setTotalSales] = useState(0.0);
    const [valueCash, setValueCash] = useState(0.0);
    const [valueCard, setValueCard] = useState(0.0);
    const [valueOpen, setValueOpen] = useState(0.0);
    const [totalCashier, setTotalCashier] = useState(0.0);
    const [loading, setLoading] = useState(false);
    const [showBtn, setShowBtn] = useState(true);

    const [form] = Form.useForm();

    useEffect(() => {
        axios
            .get("/api/v1/has/open/cashier/balance")
            .then(response => {
                console.log(response);
                setValueCard(
                    Utils.parseToDollars(parseFloat(response.data.card))
                );
                setValueOpen(
                    Utils.parseToDollars(parseFloat(response.data.value))
                );
                setTotalCashier(
                    Utils.parseToDollars(
                        parseFloat(response.data.close) +
                            parseFloat(response.data.value)
                    )
                );
                form.setFieldsValue({
                    value_card: Utils.parseToDollars(
                        parseFloat(response.data.card)
                    ),
                    value_open: Utils.parseToDollars(
                        parseFloat(response.data.value)
                    ),
                    value_close: Utils.parseToDollars(
                        parseFloat(response.data.close) +
                            parseFloat(response.data.value)
                    )
                });
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    const onChangeCash = value => {
        console.log(value);
        setValueCash(value);
        setTotalSales(value + valueCard);
        setTotalCashier(value + valueCard + valueOpen);
        form.setFieldsValue({
            value_sales: value + valueCard,
            value_close: value + valueCard + valueOpen
        });
    };

    const onChangeCard = value => {
        console.log(value);
        setValueCard(value);
        setTotalSales(value + valueCash);
        setTotalCashier(value + valueCash + valueOpen);
        form.setFieldsValue({
            value_sales: value + valueCash,
            value_close: value + valueCash + valueOpen
        });
    };

    const onChangeOpen = value => {
        console.log(value);
        setValueOpen(value);
        setTotalCashier(totalSales + value);
        form.setFieldsValue({
            value_close: totalSales + value
        });
    };

    const onFinish = values => {
        setLoading(true);
        console.log("Received values of form: ", values);
        const expenses = [];
        data.map(item =>
            expenses.push({
                name: item.name,
                value: Utils.parseToCents(item.value)
            })
        );
        const body = {
            date_close: moment(values.date_open).format("YYYY/MM/DD"),
            hour_close: moment(values.hout_open).format("HH:mm"),
            value_card: Utils.parseToCents(values.value_card),
            value_cash: Utils.parseToCents(values.value_cash),
            value_close: Utils.parseToCents(values.value_close),
            value_open: Utils.parseToCents(values.value_open),
            value_sales: Utils.parseToCents(values.value_sales),
            expenses: expenses
        };
        console.log(body);
        axios
            .post("api/v1/cashier/balance/close/day", body)
            .then(response => {
                console.log(response);
                Message.success(response.data.msg);
                setLoading(false);
                setShowBtn(false);
            })
            .catch(error => {
                console.log(error);
                Message.error("Error en cierre de caja");
                setLoading(false);
            });
    };

    const onCreate = values => {
        console.log("Received values of form: ", values);
        setVisible(false);
        values.key = values.name;
        setData([...data, values]);
    };

    const onRemove = key => {
        console.log(key);
        setData(data.filter(item => item.key !== key));
    };

    const columns = [
        {
            title: "Nombre",
            dataIndex: "name",
            key: "name"
        },
        {
            title: "Valor",
            dataIndex: "value",
            key: "value",
            render: text => <span>$ {text}</span>
        },
        {
            title: "Acción",
            dataIndex: "action",
            key: "action",
            render: (text, record) => (
                <DeleteOutlined onClick={() => onRemove(record.key)} />
            )
        }
    ];

    return (
        <Row>
            <Col
                lg={{ span: 14, offset: 5 }}
                md={{ span: 14, offset: 5 }}
                sm={{ span: 14, offset: 5 }}
                xs={{ span: 22, offset: 1 }}
            >
                <h4>Cierre de caja</h4>
                <br></br>

                <Form
                    form={form}
                    name="cashierClose"
                    onFinish={onFinish}
                    layout={"vertical"}
                    initialValues={{
                        value_close: 0,
                        value_open: 0,
                        value_cash: 0,
                        value_card: 0,
                        value_sales: 0
                    }}
                >
                    <Row>
                        <Col lg={11} md={11} sm={24}>
                            <Form.Item
                                name="date_close"
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
                                />
                            </Form.Item>
                        </Col>
                        <Col lg={2} md={2} sm={24}></Col>
                        <Col lg={11} md={11} sm={24}>
                            <Form.Item
                                name="hora_close"
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
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={11} md={11} sm={24}>
                            <Form.Item
                                name="value_cash"
                                label="Ventas en efectivo"
                                rules={[
                                    {
                                        required: true,
                                        message: "Ingrese un valor!"
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
                                    onChange={onChangeCash}
                                />
                            </Form.Item>
                        </Col>
                        <Col lg={2} md={2} sm={24}></Col>
                        <Col lg={11} md={11} sm={24}>
                            <Form.Item
                                name="value_card"
                                label="Ventas por tarjeta"
                                rules={[
                                    {
                                        required: true,
                                        message: "Ingrese un valor!"
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
                                    onChange={onChangeCard}
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <h4>Valores para cierre de caja</h4>
                    <br></br>
                    <Row>
                        <Col lg={11} md={11} sm={24}>
                            <Form.Item
                                name="value_sales"
                                label="Total en ventas"
                                rules={[
                                    {
                                        required: true,
                                        message: "Ingrese un valor!"
                                    }
                                ]}
                            >
                                <InputNumber
                                    disabled
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
                                />
                            </Form.Item>
                        </Col>
                        <Col lg={2} md={2} sm={24}></Col>
                        <Col lg={11} md={11} sm={24}>
                            <Form.Item
                                name="value_open"
                                label="Total apertura"
                                rules={[
                                    {
                                        required: true,
                                        message: "Ingrese un valor!"
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
                                    onChange={onChangeOpen}
                                    disabled
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row>
                        <Col lg={11} md={11} sm={24}>
                            <Form.Item
                                name="value_close"
                                label="Total de caja"
                                rules={[
                                    {
                                        required: true,
                                        message: "Ingrese un valor!"
                                    }
                                ]}
                            >
                                <InputNumber
                                    disabled
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
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <h4>Gastos</h4>
                    <Row>
                        <Col lg={24} md={24}>
                            <Table columns={columns} dataSource={data} />
                        </Col>
                    </Row>
                    <br></br>
                    {showBtn && (
                        <>
                            <Row>
                                <Col
                                    lg={{ span: 10, offset: 7 }}
                                    md={{ span: 10, offset: 7 }}
                                    sm={{ span: 10, offset: 7 }}
                                    xs={{ span: 22, offset: 1 }}
                                >
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            onClick={() => {
                                                setVisible(true);
                                            }}
                                            style={{ width: "100%" }}
                                        >
                                            Agregar gasto
                                        </Button>
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
                                    <Form.Item>
                                        <Button
                                            type="primary"
                                            htmlType="submit"
                                            style={{ width: "100%" }}
                                            loading={loading}
                                        >
                                            Cerrar con $ {totalCashier}
                                        </Button>
                                    </Form.Item>
                                </Col>
                            </Row>
                        </>
                    )}
                </Form>
            </Col>
            <ExpenseForm
                key={data.length}
                visible={visible}
                onCreate={onCreate}
                onCancel={() => {
                    setVisible(false);
                }}
            />
        </Row>
    );
};

export default CashierClose;
