<template>
	<div class="login_container">
		<div class="login_box">
			<div class="avatar_box">
				<img src="../assets/logo.png">
			</div>
			<el-form ref="loginFormRef" label-width="0px" class="login_form" :model="form" :rules="rules">
				<el-form-item prop="username">
					<el-input v-model="form.username" prefix-icon="el-icon-user-solid" ></el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input type="password" v-model="form.password" prefix-icon="el-icon-lock"></el-input>
				</el-form-item>
				<el-form-item class="btns">
					<el-button type="primary" @click="login">登录</el-button>
					<el-button type="info" @click="resetLoginForm">重置</el-button>
				</el-form-item> 
			</el-form>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			// 绑定表单数据
			form: {
				username: 'admin',
				password: ''
			},
			// 表单验证规则
			rules: {
				username: [
					{ required: true, message: '请输入登录账号', trigger: 'blur' },
            		{ min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
				],
				password: [
					{ required: true, message: '请输入密码', trigger: 'blur' },
            		{ min: 5, max: 10, message: '密码长度在 5 到 10 个字符', trigger: 'blur' }
				]
			}
		}
	},
	methods: {
		resetLoginForm() {
			this.$refs.loginFormRef.resetFields();
		},
		login() {
			this.$refs.loginFormRef.validate(async(valid) => {
				if(!valid) return;
				const { data: res } = await this.$http.post("login", this.form);
				if (res.meta.status !== 200) return this.$message.error("登录失败");
				this.$message.success('成功');
				window.sessionStorage.setItem("token", res.data.token);
				this.$router.push('/Home');
			});
		}
	}
};
</script>

<style lang="less" scoped>
.login_container{
	height: 100%;
	/*ackground-color: #2b4b6b;*/
	background-color: #1E90FF;
}
.login_box {
	width: 450px;
	height: 300px;
	background-color: #fff;
	border-radius: 3px;
	position: absolute;
	left: 50%;
	top: 50%;
	transform: translate(-50%, -50%);
	.avatar_box {
		height: 130px;
		width: 130px;
		border: 1px solid #eee;
		border-radius: 50%;
		padding: 10px;
		box-shadow: 0 0 10px #ddd;
		position: absolute;
		left: 50%;
		transform: translate(-50%, -50%);
		background-color: #fff;
		img {
			width: 100%;
			height: 100%;
			border-radius: 50%;
			background-color: #eee;
		}
	}
}
.login_form {
	position: absolute;
	bottom: 0;
	width: 100%;
	padding: 0 20px;
	box-sizing: border-box;
}
.btns {
	display: flex;
	justify-content: flex-end;
}
</style>