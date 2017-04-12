import React from 'react';
import { Layout, Menu, Icon, Dropdown,message } from 'antd';
import {Link} from 'react-router';
const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
import request from '../utils/request'
import './LayoutPage.less';
import Pubsub from 'pubsub-js';

class LayoutPage extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			selectedKeys: [],
			user: '未登录...',
			isLogin: false,
		}
	}

	componentDidMount(){
		var t = this;
		Pubsub.subscribe('layoutCurrent',this.setCurrent.bind(this))
		request('/api/user/state')
		.then((data)=>{
			if (data.code !== 200) {
				message.error('未登录,请登录',1,function(){
					window.location.href = '/#/login'
				});
			} else {
				t.setState({
					user: data.data.email,
					isLogin: true
				})
			}
		})
	}

	setCurrent(name,key){
		var _key = [];
		_key.push(key)
		this.setState({
			selectedKeys: _key
		})
	}

    render(){
		var t = this;
		const menu = (
			<Menu>
				<Menu.Item key="0">
					<a>修改密码</a>
				</Menu.Item>
				<Menu.Divider />
				<Menu.Item key="1">
					<a href="/#/login">退出登录</a>
				</Menu.Item>
			</Menu>
		);
		return (
			<Layout>
				<Sider
				trigger={null}
				collapsible
				collapsed={this.props.collapsed}
				>
				<div className="logo">
					<span>传奇扑克游戏后台</span>
				</div>
				<Menu theme="dark" mode="inline" defaultOpenKeys={['sub1','sub2','sub3','sub4']} selectedKeys={t.state.selectedKeys}>
					<SubMenu title={<span><Icon type="solution" /><span>赛事</span></span>} key="sub1">
						<Menu.Item key="m1"><Link to="/"><Icon type="line-chart" />赛事管理</Link></Menu.Item>
						<Menu.Item key="m2"><Link to="/sng"><Icon type="file-text" />SNG模板</Link></Menu.Item>
					</SubMenu>
					<SubMenu title={<span><Icon type="bulb" /><span>奖品配置</span></span>} key="sub2">
						<Menu.Item key="h1"><Link to="/prize"><Icon type="plus" />创建奖品</Link></Menu.Item>
						<Menu.Item key="h2"><Icon type="clock-circle-o" />发奖记录</Menu.Item>
					</SubMenu>
					<SubMenu title={<span><Icon type="pay-circle" /><span>充值管理</span></span>} key="sub3">
						<Menu.Item key="s3_1"><Link to="/recharge"><Icon type="clock-circle-o" />充值记录</Link></Menu.Item>
						<Menu.Item key="s3_2"><Link to="/gold"><Icon type="clock-circle-o" />金币发放记录</Link></Menu.Item>
					</SubMenu>
					<SubMenu title={<span><Icon type="pay-circle" /><span>管理员</span></span>} key="sub4">
						<Menu.Item key="s4_1"><Link><Icon type="clock-circle-o" />操作记录</Link></Menu.Item>
						<Menu.Item key="s4_2"><Link><Icon type="clock-circle-o" />修改密码</Link></Menu.Item>
						<Menu.Item key="s4_3"><Link><Icon type="clock-circle-o" />权限分配</Link></Menu.Item>
						<Menu.Item key="s4_4"><Link to="/login"><Icon type="clock-circle-o" />退出登录</Link></Menu.Item>
					</SubMenu>
				</Menu>
				</Sider>
				<Layout>
				<Header style={{ background: '#fff', padding: 0 }}>
					<Dropdown overlay={menu} trigger={['click']}>
						<a className="ant-dropdown-link" href="#" style={{
						float: 'right',
						marginRight: '1rem'
					}}>
							{t.state.user} <Icon type="down" />
						</a>
					</Dropdown>
				</Header>
				<Content style={{ margin: '24px 16px', padding: 24, background: '#fff'}}>
					{this.state.isLogin ? this.props.children : <div style={{
						    width: '100%',
							textAlign: 'center',
							color: '#bdbdbd',
							fontSize: '2rem'
					}}>Error: 未登录!</div>}
				</Content>
				</Layout>
			</Layout>
			)
		}
	}

LayoutPage.propTypes = {
};

export default LayoutPage;
