<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
			<el-breadcrumb-item>角色列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图 -->
		<el-card>
			<!-- 添加角色按钮 -->
			<el-row>
				<el-col>
					<el-button type="primary">添加角色</el-button>
				</el-col>
			</el-row>
			<!-- 角色列表数据 -->
			<el-table :data="rolesList" border stripe>
				<el-table-column type="expand">
					<template slot-scope="scope">
						<el-row :class="['bdbottom', i1 ===0 ? 'bdtop': '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
							<!-- 渲染一级权限 -->
							<el-col :span="5">
								<el-tag closable @close="removeRightById(scope.row,item1.id)">{{item1.authName}}</el-tag>
								<el-icon class="el-icon-caret-right"></el-icon>
							</el-col>
							<!-- 渲染二级三级权限 -->
							<el-col :span="19">
								<el-row :class="[i2 ===0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
									<!-- 二级权限 -->
									<el-col :span="6">
										<el-tag closable @close="removeRightById(scope.row,item2.id)" type="success">{{item2.authName}}</el-tag>
										<el-icon class="el-icon-caret-right"></el-icon>
									</el-col>
									<!-- 三级权限 -->
									<el-col :span="18">
										<el-tag @close="removeRightById(scope.row,item3.id)" closable type="warning" v-for="(item3, i3) in item2.children">{{item3.authName}}</el-tag>
									</el-col>
								</el-row>
							</el-col>
						</el-row>
					</template>
				</el-table-column>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="角色名称" prop="roleName"></el-table-column>
				<el-table-column label="角色描述" prop="roleDesc"></el-table-column>
				<el-table-column label="操作">
					<template slot-scope="scope">
						<el-button type="primary" icon="el-icon-edit" size="small" @click="shwoEditDialog(scope.row.id)">编辑</el-button>
						<el-button type="warning" icon="el-icon-setting" size="small" @click="showSetRightDialog(scope.row)">分配权限</el-button>
						<el-button type="danger" icon="el-icon-delete" size="small" @click="removeUserById(scope.row.id)">删除</el-button>
					</template>
				</el-table-column>
			</el-table>
		</el-card>

		<!-- 分配权限对话框 -->
		<el-dialog title="分配权限"  :visible.sync="setRightVisible" width="50%" @close="setRightDialogClosed">
			<el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" default-expand-all :default-checked-keys="defKeys"></el-tree>
			<span slot="footer" class="dialog-footer">
		    <el-button @click="setRightVisible = false">取 消</el-button>
		    <el-button type="primary" @click="">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
export default {
	data() {
		return {
			rolesList: [],
			// 控制分配权限对话框显示
			setRightVisible: false,
			// 所有权限数组
			rightsList: [],
			// 树形控件
			treeProps: {
				label: 'authName',
				children: 'children'
			},
			//默认选中权限数组ID
			defKeys: []
		}
	},
	created() {
		this.getRolesList()
	}, 
	methods: {
		async getRolesList() {
			const {data: res} = await this.$http.get('roles')
			if (res.meta.status !== 200) return this.$message.error('获取列表失败！')
				console.log(res)
			this.rolesList = res.data
		}, 

		// 根据ID删除对应的权限
		async removeRightById(role, rightId) {
			// 弹框提示是否删除
			const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).catch(error => error)
	        if (confirmResult !== 'confirm') return this.$message.info('取消了删除')
	        const {data: res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
	    	if (res.meta.status !== 200) {
	    		return this.$message.error('删除权限失败！')
	    	}
	    	role.children = res.data
		},
		// 展示分配权限对话框
		async showSetRightDialog(role) {
			const {data: res} = await this.$http.get('rights/tree')
			if (res.meta.status !== 200) return this.$message.error('获取权限列表失败！')
			this.rightsList = res.data
			// 递归获取三级节点ID
			this.getleafKeys(role, this.defKeys)
			this.setRightVisible = true
		},
		// 通过递归函数 获取角色下的所有三级权限id 保存到 defKeys 数组中
		getleafKeys(node, arr) {
			// 如果当前节点不包含children属性 就是三级
			if (!node.children) {
				return arr.push(node.id)
			}
			node.children.forEach(item => this.getleafKeys(item, arr))
		},
		// 监听关闭分配对话框关闭
		setRightDialogClosed() {
			this.defKeys = []
		}
	}
}
</script>

<style lang="less" scoped>
.el-tag {
	margin: 7px;
}
.bdtop {
	border-top: 1px solid #eee;
}
.bdbottom {
	border-bottom: 1px solid #eee;
}
.vcenter {
	display: flex;
	align-items: center;
}
</style>