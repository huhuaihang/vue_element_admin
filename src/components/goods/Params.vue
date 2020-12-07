<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
			<el-breadcrumb-item>参数列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区域 -->
		<el-card>
			<!-- 警告区域 -->
			<el-alert title="注意：只能设置三级分类相关" type="warning" :closable="false" show-icon></el-alert>
			<!-- 选择商品分类区域 -->
			<el-row class="cat_opt">
				<el-col>
					<span>选择商品分类</span>
					<!-- 选择商品分类级联选择框 -->
					<el-cascader
					    v-model="selectedCatKeys"
					    :options="catelist"
					    :props="cateProps"
					    @change="handleChange"></el-cascader>
				</el-col>
			</el-row>
			<!-- tab 页签区域 -->
			<el-tabs v-model="activeName" @tab-click="handleTabClick">
				<!-- 动态参数面板 -->
			    <el-tab-pane label="动态参数" name="many">
				    <el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加参数</el-button>
				    <!-- 动态参数表格 -->
				    <el-table :data="manyTableData" border stripe>
				    	<!-- 展开行 -->
						<el-table-column type="expand">
							<template slot-scope="scope">
								<el-tag closable v-for="(item, i) in scope.row.attr_vals" :key="i" @close="handleClose(i, scope.row)">{{item}}</el-tag>
								<el-input
								  class="input-new-tag"
								  v-if="scope.row.inputVisible"
								  v-model="scope.row.inputValue"
								  ref="saveTagInput"
								  size="small"
								  @keyup.enter.native="handleInputConfirm(scope.row)"
								  @blur="handleInputConfirm(scope.row)"
								>
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>
				    	<!-- 索引列 -->
				    	<el-table-column type="index"></el-table-column>
				    	<el-table-column label="参数名称" prop="attr_name"></el-table-column>
				    	<el-table-column label="操作">
				    		<template slot-scope="scope">
				    		<el-button size="mini" type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.attr_id)">编辑</el-button>
				    		<el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>	
				    		</template>
				    	</el-table-column>
				    </el-table>
			    </el-tab-pane>
			    <!-- 静态属性面板 -->
			    <el-tab-pane label="静态属性" name="only">
			    	<el-button type="primary" size="mini" :disabled="isBtnDisabled" @click="addDialogVisible = true">添加属性</el-button>
			    	<!-- 静态属性表格 -->
				    <el-table :data="onlyTableData" border stripe>
				    	<!-- 展开行 -->
						<el-table-column type="expand">
							<template slot-scope="scope">
								<el-tag closable v-for="(item, i) in scope.row.attr_vals" :key="i" @close="handleClose(i, scope.row)">{{item}}</el-tag>
								<el-input
								  class="input-new-tag"
								  v-if="scope.row.inputVisible"
								  v-model="scope.row.inputValue"
								  ref="saveTagInput"
								  size="small"
								  @keyup.enter.native="handleInputConfirm(scope.row)"
								  @blur="handleInputConfirm(scope.row)"
								>
								</el-input>
								<el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
							</template>
						</el-table-column>
				    	<!-- 索引列 -->
				    	<el-table-column type="index"></el-table-column>
				    	<el-table-column label="属性名称" prop="attr_name"></el-table-column>
				    	<el-table-column label="操作">
				    		<template slot-scope="scope">
				    		<el-button size="mini" type="primary" icon="el-icon-edit"@click="showEditDialog(scope.row.attr_id)">编辑</el-button>
				    		<el-button size="mini" type="danger" icon="el-icon-delete" @click="removeParams(scope.row.attr_id)">删除</el-button>	
				    		</template>
				    	</el-table-column>
				    </el-table>
			    </el-tab-pane>
			</el-tabs>
		</el-card>

		<!-- 添加动态参数/静态属性 对话框 -->
		<el-dialog
		  :title="'添加' + this.titleText"
		  :visible.sync="addDialogVisible"
		  width="50%" @close="addDialogClosed">
	        <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px" class="demo-ruleForm">
		        <el-form-item :label="titleText" prop="attr_name">
		        <el-input v-model="addForm.attr_name"></el-input>
		      </el-form-item>
	        </el-form>
		    <span slot="footer" class="dialog-footer">
		    <el-button @click="addDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addParams">确 定</el-button>
		    </span>
		</el-dialog>
		<!-- 修改动态参数/静态属性 对话框 -->
		<el-dialog
		  :title="'修改' + this.titleText"
		  :visible.sync="editDialogVisible"
		  width="50%" @close="editDialogClosed">
	        <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px" class="demo-ruleForm">
		        <el-form-item :label="titleText" prop="attr_name">
		        <el-input v-model="editForm.attr_name"></el-input>
		      </el-form-item>
	        </el-form>
		    <span slot="footer" class="dialog-footer">
		    <el-button @click="editDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="editParams">确 定</el-button>
		    </span>
		</el-dialog>
	</div>
	</div>
</template>
<script>
export default {
	data(){
		return {
			// 商品分类
			catelist: [],
			cateProps: {
				value: 'cat_id',
				label: 'cat_name',
				children: 'children',
				expandTrigger: 'hover',
			}, 
			selectedCatKeys:[],
			activeName: 'many',
			// 动态参数数据
			manyTableData: [],
			// 静态属性数据
			onlyTableData: [],
			// 控制添加对话框的隐藏演示
			addDialogVisible: false,
			// 添加参数的表单数据对象
			addForm: {},
			// 添加参数的表单验证规则
			addFormRules: {
				attr_name: [{required: true, message:'请输入参数名称', trigger:"blur"}]
			},
			// 控制修改对话框的隐藏展示
			editDialogVisible: false,
			// 修改参数的表单数据对象
			editForm: {},
			// 修改参数的表单验证规则
			editFormRules: {
				attr_name: [{required: true, message:'请输入参数名称', trigger:"blur"}]
			},
			// 控制添加新标签的文本框和按钮切换显示
			inputVisible: false,
			// 文本框中输入的值 tag标签
			inputValue: ''
		}
	},
	created(){
		this.getCateList()
	},
	methods: {
		async getCateList() {
			const {data: res} = await this.$http.get('categories')
			if (res.meta.status !== 200) {
				return this.$message.error('获取分类列表失败。')
			}
			this.catelist = res.data
		},
		// 监听级联选择框变化
		async handleChange() {
			this.getParamsData()
		},
		// TAB 页签点击事件处理函数
		handleTabClick() {
			this.getParamsData()
		},
		// 获取参数列表数据
		async getParamsData() {
			if (this.selectedCatKeys.length !== 3) {
				this.selectedCatKeys = []
				this.manyTableData = []
				this.onlyTableData = []
				return 
			}
			//根据所选分类的ID 和当前所处的面板 获取对应参数
			const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes`, {params: {sel: this.activeName}})
			if (res.meta.status !== 200) {
				return this.$message.error('获取参数列表失败。')
			}
			res.data.forEach(item => {
				item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
				// 控制文本框的显示与隐藏
				item.inputVisible = false
				// 文本框中输入的值
				item.inputValue = ''
			})
			console.log(res.data)
			if (this.activeName === 'many') {
				this.manyTableData = res.data
			} else {
				this.onlyTableData = res.data
			}
		},
		// 监听 关闭添加参数对话框
		addDialogClosed() {
			this.$refs.addFormRef.resetFields()
		},
		// 提交添加参数表单
		addParams() {
			this.$refs.addFormRef.validate(async (valid) => {
				if (!valid) return 
				const {data: res} = await this.$http.post(`categories/${this.cateId}/attributes`, {attr_name: this.addForm.attr_name, attr_sel: this.activeName})
				if(res.meta.status !== 201) {
					return this.$message.error('添加参数失败！')
				}
				this.$message.success('添加成功。')
				this.addDialogVisible = false
				this.getParamsData()
			})
		},
		// 点击编辑 战士修改的对话框
		async showEditDialog(attr_id) {
			const {data:res} = await this.$http.get(`categories/${this.cateId}/attributes/${attr_id}`, {params:{attr_sel: this.activeName}})
			if (res.meta.status !== 200) {
				return this.$message.error('获取参数失败。')
			}
			this.editForm = res.data
			this.editDialogVisible = true
		},
		// 监听关闭 修改对话框 充值参数
		editDialogClosed() {
			this.$refs.editFormRef.resetFields()
		},
		// 提交添加参数表单
		editParams() {
			this.$refs.editFormRef.validate(async (valid) => {
				if (!valid) return 
				const {data: res} = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {attr_name: this.editForm.attr_name, attr_sel: this.activeName})
				if(res.meta.status !== 200) {
					return this.$message.error('修改参数失败！')
				}
				this.$message.success('修改参数成功。')
				this.editDialogVisible = false
				this.getParamsData()
			})
		},
		// 删除动态参数 静态属性
		async removeParams(attr_id) {
			const confirmResult = await this.$confirm('此操作将永久删除该数据, 是否继续?', '提示', {
	          confirmButtonText: '确定',
	          cancelButtonText: '取消',
	          type: 'warning'
	        }).catch((error) => error);

			if (confirmResult !== 'confirm') {
				this.$message({
	            type: 'info',
	            message: '已取消删除。'
	          });
			} else {
				const {data:res} = await this.$http.delete(`categories/${this.cateId}/attributes/${attr_id}`)
				if (res.meta.status !== 200) {
					this.$message({
		            type: 'error',
		            message: '删除失败!'
		          });
				}
				this.getParamsData()
				this.$message({
		            type: 'success',
		            message: '删除成功!'
		          });
			}
			
		},
		// 文本框 失去焦点 或者按下enter键触发
		async handleInputConfirm(row) {
			console.log('ok');
			// 空值不提交
			if(row.inputValue.trim().length === 0) {
				row.inputValue = ''
				row.inputVisible = false
				return
			}

			row.attr_vals.push(row.inputValue.trim())
			this.saveAttrVals(row)

			row.inputValue = ''
			row.inputVisible = false
		},
		// 点击按钮显示编辑框文本输入框
		showInput(row) {
			row.inputVisible = true
			// 自动获取焦点
			this.$nextTick(_ => {
	          this.$refs.saveTagInput.$refs.input.focus();
	        });
		},
		// 保存属性到数据库
		async saveAttrVals(row) {
			const {data:res} = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`, {
					attr_name: row.attr_name,
					attr_sel: row.attr_sel,
					attr_vals: row.attr_vals.join(' ')
				})
			if (res.meta.status !== 200) {
				return this.$message.error('添加属性失败。')
			}

			this.$message.success('修改参数成功。')
		},
		// 删除对应的参数可选项
		handleClose(i, row) {
			row.attr_vals.splice(i, 1)
			this.saveAttrVals(row)
		}
	},
	computed: {
		// 如果按钮需要禁用返回true 否则返回false
		isBtnDisabled() {
			if (this.selectedCatKeys.length !== 3) {
				return true
			}
			return false
		},
		// 当前选中的三级分类的ID
		cateId() {
			if (this.selectedCatKeys.length === 3) {
				return this.selectedCatKeys[2]
			}
			return null
		},
		// 动态计算的标题
		titleText() {
			if (this.activeName === 'many') {
				return '动态参数'
			} 
			return '静态属性'			
		}
	}
}
</script>

<style lang="less" scope>
.cat_opt {
	margin: 15px 0;
}
.el-tag {
	margin: 5px;
}
.input-new-tag {
	width:120px;
}
</style>