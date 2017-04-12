import React from 'react';
import { Form, Icon, Input, Button, Checkbox,message } from 'antd';
import reactMixin from 'react-mixin';
import Reflux from 'reflux';
import { Actions, Store } from '../../models/login';
import Pubsub from 'pubsub-js';
const FormItem = Form.Item;
import './index.less';

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            
        }
    }

    componentDidMount(){
        Actions.logOut()
    }

    handleSubmit = (e) => {
        var t = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                Actions.login(values,(data)=>{
                    if (data.code === 200) {
                        return message.success('登录成功!',1,()=>{
                            if (t.props.location.query.path) {
                                return window.location.href = '/#' + t.props.location.query.path
                            }
                            window.location.href = '/#/';                            
                        });
                    }
                    message.error('登录失败');
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div style={{
                margin: 'auto'
            }}>
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem>
                    {getFieldDecorator('userName', {
                        rules: [{ required: true, message: '请输入邮箱' }],
                    })(
                        <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="邮箱" />
                    )}
                    </FormItem>
                    <FormItem>
                    {getFieldDecorator('password', {
                        rules: [{ required: true, message: '请输入密码' }],
                    })(
                        <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="密码" />
                    )}
                    </FormItem>
                    <FormItem>
                    {getFieldDecorator('remember', {
                        valuePropName: 'checked',
                        initialValue: true,
                    })(
                        <Checkbox>忘记密码</Checkbox>
                    )}
                    <a className="login-form-forgot" href="">Forgot password</a>
                    <Button type="primary" htmlType="submit" className="login-form-button">
                        Log in
                    </Button>
                    </FormItem>
                </Form>
            </div>
        )
    }
}

Login.propTypes = {
};
reactMixin.onClass(Login, Reflux.connect(Store, 'Login'))

const _Login = Form.create()(Login);

module.exports = _Login;
