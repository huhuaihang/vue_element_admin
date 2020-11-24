<template>
	<el-container class="home-container">
		<el-header>
			<div>
				<img src="../assets/logo.png" alt="">
				<span>VUE-ELEMENT-UI 后台管理系统</span>
			</div>
			<el-button type="info" @click="logout()">退出</el-button>
		</el-header>
		<el-container>
			<el-aside :width="isCallapse? '64px' : '200px'">
				<div class="toggle-button" @click="toggleCollapse"><|||></div>
				<el-menu
					default-active="2"
					class="el-menu-vertical-demo"
					background-color="#545c64"
					text-color="#fff"
					active-text-color="#409BFF" :unique-opened="true" :collapse="isCallapse" 
					:collapse-transition="false" :router="true" :default-active="activePath">
					<el-submenu v-for="item in menulist" :key="item.id" :index="item.id + ''">
						<template slot="title">
							<i :class="iconList[item.id]"></i>
							<span>{{item.authName}}</span>
						</template>
						<el-menu-item v-for="subItem in item.children" :index="'/'+subItem.path"
						:key="subItem.id" @click="saveNavState('/'+subItem.path)">
							<template slot="title">
							<i class="el-icon-menu"></i>
							<span>{{subItem.authName}}</span>
						</template>
						</el-menu-item>
					</el-submenu>
				</el-menu>
			</el-aside>
			<el-main>
				<router-view></router-view>
			</el-main>
		</el-container>
	</el-container>
	
</template>

<script>
export default {
	data() {
		return {
			iconList: {
				'125': 'el-icon-user-solid',
				'103': 'el-icon-s-grid',
				'102': 'el-icon-s-order',
				'101': 'el-icon-s-goods',
				'145': 'el-icon-s-marketing',
			},
			menulist: [],
			isCallapse: false,
			activePath: ''
		}
	},
	created() {
		this.getMenuList()
		this.activePath = window.sessionStorage.getItem('activePath');
	},
	methods:{
		logout() {
			window.sessionStorage.clear()
			this.$router.push('/login')
		},
		async getMenuList() {
			const { data: res} = await this.$http.get('menus')
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg) 
			this.menulist = res.data
			console.log(this.menulist)
		},
		toggleCollapse() {
			this.isCallapse = !this.isCallapse
		},
		saveNavState(activePath) {
			window.sessionStorage.setItem('activePath', activePath)
			this.activePath = activePath
		}
	}
}
</script>

<style lang="less" scoped>
.home-container {
	height: 100%;	
}
.el-header{
	background-color: #99CCFF;
	display: flex;
	justify-content: space-between;
	padding-left: 0;
	align-items: center;
	color: #fff;
	font-size: 20px;
	> div {
		display: flex;
		align-items: center;
		span {
			margin-left: 5px;
			/*align-items: center;*/
		}
	}
}
.el-aside{
	background-color:#545c64;
	.el-menu {
		border-right: none;
	}
}
.el-main{
	background-color:#fff;
}
.toggle-button {
	background-color: #4a5064;
	font-size: 10px;
	color: #fff;
	text-align: center;
	letter-spacing: 0.2rem;
	cursor: pointer;
}
</style>