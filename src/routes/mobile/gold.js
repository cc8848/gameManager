import React from 'react';
import { Form, Icon, Input, Button, Checkbox,message } from 'antd';
import reactMixin from 'react-mixin';
import Reflux from 'reflux';
import Pubsub from 'pubsub-js';
const FormItem = Form.Item;
import {Actions,Store} from '../../models/recharge';
import './index.less';
import request from '../../utils/request'

class GoldMobile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isLogin: false
        }
    }

    componentDidMount(){
        var t = this;
        request('/api/user/state')
		.then((data)=>{
			if (data.code !== 200) {
				message.error('未登录,请登录',1,function(){
					window.location.href = '/#/login?path=/gold_mobile'
				});
			} else {
				t.setState({
					isLogin: true
				})
                Actions.getRechargeList(1,100);
			}
		})
    }

    handleSubmit = (e) => {
        var  t = this;
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (values.number.toString() === '0') {
                return message.error('金币数量不能为0')
            }
            if (!err) {
                if (confirm('你确定要给手机号: '+ values.mobile + ' 发放: ' + values.number + ' 万金币吗?')) {
                    values.number = values.number * 10000;
                    Actions.addGold(values,function(data){
                        if (data.data === true) {
                            message.success('金币发放成功!')
                            Actions.getRechargeList(1,20);
                            t.setState({
                                ModelVisible: false
                            })
                        }
                    })
                }
            }
        });
    }

    render() {
        var t = this;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="gold_mobile">
                {
                    t.state.isLogin ? 
                    <div style={{
                        width: '100%'
                    }}>
                        <Form onSubmit={this.handleSubmit} className="login-form">
                            <FormItem>
                            {getFieldDecorator('mobile', {
                                rules: [{ required: true, message: '请输入手机号' }],
                            })(
                                <Input placeholder="手机号" />
                            )}
                            </FormItem>
                            <FormItem>
                            {getFieldDecorator('number', {
                                rules: [{ required: true, message: '请输入金币数量' }],
                            })(
                                <Input placeholder="金币数量/万" />
                            )}
                            </FormItem>
                            <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                发放金币
                            </Button>
                            </FormItem>
                        </Form>
                        <div className="list">
                            {
                                t.state.Recharge.chargeList.data.map((item)=>{
                                    return <div className="item">
                                        <p>ID: <span>{item.id}</span></p>
                                        <p>手机号: <span>{item.userPhone}</span></p>
                                        <p>微信昵称|游戏昵称: <span>{item.wxName} | {item.userName}</span></p>
                                        <p>金币数量: <span>{item.moneyNum/10000}万</span></p>
                                    </div>
                                })
                            }
                        </div>
                    </div> : <div>未登录</div>
                }
            </div>
        )
    }
}

GoldMobile.propTypes = {
};
reactMixin.onClass(GoldMobile, Reflux.connect(Store, 'Recharge'))

const _GoldMobile = Form.create()(GoldMobile);

module.exports = _GoldMobile;
