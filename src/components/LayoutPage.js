import React from 'react';
import { Layout, Menu, Icon } from 'antd';
import {Link} from 'react-router';
const { Header, Sider, Content } = Layout;
const SubMenu = Menu.SubMenu;
import './LayoutPage.less';
import Pubsub from 'pubsub-js';

class LayoutPage extends React.Component{
	constructor(props){
		super(props)
		this.state = {
			selectedKeys: []
		}
	}

	componentDidMount(){
		Pubsub.subscribe('layoutCurrent',this.setCurrent.bind(this))
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
				<Menu theme="dark" mode="inline" defaultOpenKeys={['sub1','sub2']} selectedKeys={t.state.selectedKeys}>
					<SubMenu title={<span><Icon type="solution" /><span>赛事</span></span>} key="sub1">
						<Menu.Item key="m1"><Link to="/"><Icon type="line-chart" />赛事管理</Link></Menu.Item>
						<Menu.Item key="m2"><Link to="/sngtemp"><Icon type="file-text" />SNG模板</Link></Menu.Item>
					</SubMenu>
					<SubMenu title={<span><Icon type="bulb" /><span>奖品配置</span></span>} key="sub2">
						<Menu.Item key="h1"><Link to="/prize"><Icon type="plus" />创建奖品</Link></Menu.Item>
						<Menu.Item key="h2"><Icon type="clock-circle-o" />发奖记录</Menu.Item>
					</SubMenu>
				</Menu>
				</Sider>
				<Layout>
				<Header style={{ background: '#fff', padding: 0 }}>
				</Header>
				<Content style={{ margin: '24px 16px', padding: 24, background: '#fff'}}>
					{this.props.children}
				</Content>
				</Layout>
			</Layout>
			)
		}
	}

LayoutPage.propTypes = {
};

export default LayoutPage;
