<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="/">用户管理</a></el-breadcrumb-item>
			<el-breadcrumb-item>用户列表</el-breadcrumb-item>
		</el-breadcrumb>
		<el-card class="box-card">
			<el-row :gutter="20">
				<el-col :span="8">
					<el-input placeholder="请输入内容" class="input-with-select" v-model="queryInfo.query" clearable @clear="getUserList">
						<el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
					</el-input>
				</el-col>
				<el-col :span="4">
					<el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
				</el-col>
			</el-row>
			<!-- 列表数据 -->
			<el-table :data="userlist" border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="姓名" prop="username"></el-table-column>
				<el-table-column label="邮箱" prop="email"></el-table-column>
				<el-table-column label="电话" prop="mobile"></el-table-column>
				<el-table-column label="角色" prop="role_name"></el-table-column>
				<el-table-column label="状态">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
					</template>
				</el-table-column>
				<el-table-column label="操作" >
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="mini" @click="shwoEditDialog(scope.row.id)"></el-button>
						<el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
							<el-button type="primary" icon="el-icon-setting" size="mini"></el-button>
						</el-tooltip>
						<el-button type="danger" icon="el-icon-delete" size="mini"></el-button>
					</template>
				</el-table-column>
			</el-table>
			<!-- 分页 -->
			<el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="queryInfo.pagenum"
		      :page-sizes="[1, 2, 5, 10]"
		      :page-size="queryInfo.pagesize"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="total">
		    </el-pagination>
		</el-card>

		<!-- 添加用户对话框 -->
		<el-dialog
		  title="添加用户"
		  :visible.sync="addDialogVisible"
		  width="50%" @close="addDialogClosed">
		  <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
			  <el-form-item label="用户名" prop="username">
			    <el-input v-model="addForm.username"></el-input>
			  </el-form-item>
			  <el-form-item label="密码" prop="password">
			    <el-input v-model="addForm.password"></el-input>
			  </el-form-item>
			  <el-form-item label="邮箱" prop="email">
			    <el-input v-model="addForm.email"></el-input>
			  </el-form-item>
			  <el-form-item label="手机号" prop="mobile">
			    <el-input v-model="addForm.mobile"></el-input>
			  </el-form-item>
			</el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addUser">确 定</el-button>
		  </span>
		</el-dialog>

		<!-- 修改用户对话框 -->
		<el-dialog
		  title="修改用户信息"
		  :visible.sync="editDialogVisible"
		  width="50%" @close="editDialogClosed">
		  <el-form ref="editFormRef" :model="editForm" :rules="editRules" label-width="70px" class="demo-ruleForm">
			  <el-form-item label="用户名" prop="username">
			    <el-input v-model="editForm.username" disabled></el-input>
			  </el-form-item>
			  <el-form-item label="邮箱" prop="email">
			    <el-input v-model="editForm.email"></el-input>
			  </el-form-item>
			  <el-form-item label="手机号" prop="mobile">
			    <el-input v-model="editForm.mobile"></el-input>
			  </el-form-item>
			</el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="editDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="editUserInfo()">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>
<script>
export default {
	data() {
		// 验证邮箱规则
		var checkEmail = (rule, value, callback) => {
			const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-z0-9_-])+(\.[a-zA-z0-9_])+/
			if (regEmail.test(value)) {
				return callback()
			} 
			callback(new Error('请输入合法邮箱'))
		}

		// 验证手机号规则
		var checkMobile = (rule, value, callback) => {
			const regMobile = /^(0|86|17951)?(13[0-9]|15[0123456789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
			if (regMobile.test(value)) {
				return callback()
			}
			callback(new Error('请输入正确手机号'))
		}

		return {
			queryInfo: {
				query: '',
				pagenum: 1,
				pagesize: 5
			},
			userlist: [],
			total: 0,
			addDialogVisible: false,
			addForm: {
				username: '',
				password: '',
				email: '', 
				mobile: ''
			},
			addFormRules: {
				username: [
				{required: true, message: '请输入用户名',  trigger: 'blur'}, 
				{ min: 3, max: 10, message: '用户名的长度在3-10个字符之间', trigger: 'blur'}
				], 
				password: [
				{required: true, message: '请输入密码',  trigger: 'blur'}, 
				{ min: 6, max: 15, message: '密码的长度在6-15个字符之间', trigger: 'blur'}
				],
				email: [
				{required: true, message: '请输入邮箱',  trigger: 'blur'},
				{validator: checkEmail, trigger: 'blur'}
				], 
				mobile: [
				{required: true, message: '请输入手机号',  trigger: 'blur'},
				{validator: checkMobile, trigger: 'blur'}
				], 
			},
			editDialogVisible: false,
			editForm: {},
			// 修改用户信息验证规则
			editRules:{
				email: [
					{required: true, message: '请输入邮箱', trigger: 'blur'},
					{validator: checkEmail, trigger: 'blur'}
				],
				mobile: [
					{required: true, message: '请输入手机号', trigger: 'blur'},
					{validator: checkMobile, trigger: 'blur'}
				]
			}
		}
	},
	created() {
		this.getUserList()
	},
	methods: {
		async getUserList () {
			const { data: res } = await this.$http.get('users', { 
				params: this.queryInfo
			})
			if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
			this.userlist = res.data.users
			this.total = res.data.total
		},
		// 监听pagesize变化
		handleSizeChange (newSize) {
			this.queryInfo.pagesize = newSize
			this.getUserList()
		}, 
		// 监听页码值 改变事件
		handleCurrentChange (newPage) {
			this.queryInfo.pagenum = newPage
			this.getUserList()
		},
		async userStateChanged (userinfo) {
			console.log(userinfo)
			const {data: res} = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
			if (res.meta.status !== 200) {
				userinfo.msg_state = !userinfo.msg_state
				this.$message.error('更新用户状态失败！')
			}
			this.$message.success('更新成功。')
		},
		// 监听关闭对话框
		addDialogClosed() {
			this.$refs.addFormRef.resetFields();
		},
		// 提交表单
		async addUser() {
			// 预校验
			this.$refs.addFormRef.validate(async(valid) => {
				if (!valid) {
					this.$message.error('验证失败！')
					return 
				}
				const {data: res} = await this.$http.post('users', this.addForm)
				if (res.meta.status !== 201) {
					return this.$message.error('添加用户失败！')
				}
				this.$message.success('添加成功！')
				this.addDialogVisible = false
				this.getUserList()
				})
			
		},
		// 编辑用户信息
		async shwoEditDialog(id) {
			this.editDialogVisible = true
			const {data: res} = await this.$http.get('users/' + id)
			if (res.meta.status !== 200) {
				return this.$message.error('获取信息失败！')
			}
			this.editForm = res.data

		},
		// 监听关闭对话框
		editDialogClosed() {
			this.$refs.editFormRef.resetFields();
		},
		// 修改用户信息预验证
		editUserInfo() {
			this.$refs.editFormRef.validate(async valid => {
				if (!valid) return
				//发起请求修改
				const {data: res} = await this.$http.put('users/' + this.editForm.id, this.editForm)
				if(res.meta.status !== 200){
					return this.$message.error('更新失败！')
				}
				this.editDialogVisible = false
				this.getUserList()
				this.$message.success('更新成功。')
			})
			
		}
	}
}
</script>

<style lang="less" scope>

</style>