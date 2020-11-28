<template>
	<div>
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="/">商品管理</a></el-breadcrumb-item>
			<el-breadcrumb-item>商品分类</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 卡片视图区域 -->
		<el-card>
			<el-row>
				<el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
			</el-row>
			<!-- 表格列表区 -->
			<tree-table class="treeTable" :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" :show-index="true" index-text="#" border :show-row-hover="false">
				<!-- 是否有效 -->
				<template slot="isok" slot-scope="scope">
					<i v-if="scope.row.cat_deleted === false" class="el-icon-success" style="color: lightgreen"></i>
					<i v-else class="el-icon-error" style="color: red"></i>
				</template>
				<!-- 排序 -->
				<template slot="order" slot-scope="scope">
					<el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
					<el-tag v-else-if="scope.row.cat_level === 1" size="mini" type="success">二级</el-tag>
					<el-tag v-else size="mini" type="warning">三级</el-tag>
				</template>
				<!-- 操作 -->
				<template slot="opt" slot-scope="scope">
					<el-button type="primary" size="mini" icon="el-icon-edit">编辑</el-button>
					<el-button icon="el-icon-delete" type="danger" size="mini">删除</el-button>
				</template>
			</tree-table>
			<!-- 分页区域 -->
			 <el-pagination
		      @size-change="handleSizeChange"
		      @current-change="handleCurrentChange"
		      :current-page="queryInfo.pagenum"
		      :page-sizes="[1, 2, 3, 5]"
		      :page-size="queryInfo.pagesize"
		      layout="total, sizes, prev, pager, next, jumper"
		      :total="total">
		    </el-pagination>
		</el-card>

		<!-- 添加分类对话框 -->
		<el-dialog
		  title="添加分类"
		  :visible.sync="addCateDialogVisible"
		  width="50%" @close="addCateDialogClosed">
		  <el-form :model="addCateForm" :rules="addCateRules" ref="addCateRef" label-width="100px">
		    <el-form-item label="分类名称" prop="cat_name">
		      <el-input v-model="addCateForm.cat_name"></el-input>
		    </el-form-item>
		    <el-form-item label="父级分类">
		    	<!-- options指定数据源 -->
		    	<!-- props 用来指定配置对象 -->
		      <el-cascader
			    v-model="selectedKeys"
			    :options="parentCateList"
			    :props="cascaderProps"
			    @change="parentCateChanged" clearable
			    :change-on-select="true"></el-cascader>
		    </el-form-item>
		  </el-form>
		  <span slot="footer" class="dialog-footer">
		    <el-button @click="addCateDialogVisible = false">取 消</el-button>
		    <el-button type="primary" @click="addCate">确 定</el-button>
		  </span>
		</el-dialog>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				//查询条件
				queryInfo: {
					type: 3,
					pagenum: 1,
					pagesize: 5
				},
				// 商品分类列表数据
				catelist: [],
				// 列表数据总行数
				total: 0,
				// table 指定列名称
				columns:[
					{
						label: '分类名称',
						prop: 'cat_name'
					},
					{
						label: '是否有效',
						prop: 'cat_deltetd',
						type: 'template',
						// 当前列使用模板名称
						template: 'isok'
					},
					{
						label: '排序',
						type: 'template',
						// 当前列使用模板名称
						template: 'order'
					},
					{
						label: '操作',
						type: 'template',
						// 当前列使用模板名称
						template: 'opt'
					}
				],
				// 控制添加分类对话框显示隐藏
				addCateDialogVisible: false,
				// 添加分类的数据表单
				addCateForm: {
					cat_name: '',
					cat_pid: 0,
					cat_level: 0
				},
				// 添加分类的表单验证规则对象
				addCateRules: {
					cat_name: [
						{required: true, message: '请输入分类名称', trigger:'blur'}
					]
				},
				//父级分类列表
				parentCateList: [],
				// 指定级联选择器配置对象
				cascaderProps: {
					value: 'cat_id', // 选中的
					label: 'cat_name', // 看到的
					children: 'children' // 父子嵌到关系
				},
				// 选中的父级分类ID数组
				selectedKeys: []
			}
		},
		created() {
			this.getCateList()
		},
		methods: {
			async getCateList() {
				const {data:res} = await this.$http.get('categories', { params: this.queryInfo})
				if (res.meta.status !== 200) {
					return this.$message.error('获取数据列表失败！')
				}
				console.log(res.data)
				this.catelist = res.data.result
				this.total = res.data.total
			},
			//监听pagesize 变化
			handleSizeChange(newSize) {
				this.queryInfo.pagesize = newSize
				this.getCateList()
			},
			// 监听pagenum 变化
			handleCurrentChange(newPage) {
				this.queryInfo.pagenum = newPage
				this.getCateList()
			},
			// 添加分类对话框显示
			showAddCateDialog() {
				this.getParentCateList()
				this.addCateDialogVisible = true
			},
			// 获取父级分类的列表
			async getParentCateList() {
				const {data: res} = await this.$http.get('categories', {params:{type:2}})
				if (res.meta.status !== 200) {
					return this.$message.error('获取列表失败！')
				}
				this.parentCateList = res.data
			},
			// 分类选择发生变化 触发
			parentCateChanged() {
				// 如果selectedKeys 数组中length 大于0
				// 反之 就说明没有选中任何父级分类
				if (this.selectedKeys.length > 0) {
					this.addCateForm.cat_pid = this.selectedKeys[this.selectedKeys.length - 1]
					this.addCateForm.cat_level = this.selectedKeys.length
					return
				} else {
					this.addCateForm.cat_pid = 0
					this.addCateForm.cat_level = 0
				}
			},
			// 提交 添加分类
			async addCate() {
				this.$refs.addCateRef.validate(async valid => {
					if (!valid) return
					const {data:res}  = await this.$http.post('categories', this.addCateForm)
					console.log(res)
					if (res.meta.status !== 201) {
						return this.$message.error('添加分类失败')
					}
					this.$message.success('添加成功。')
					this.getCateList()
					this.addCateDialogVisible = false
				})
				
			},
			// 监听对话框关闭 清空数据
			addCateDialogClosed() {
				this.$refs.addCateRef.resetFields()
				this.selectedKeys = []
				this.addCateForm.cat_level = 0
				this.addCateForm.cat_pid = 0
			}
		}
	}
</script>

<style lang="less" socped>
.treeTable {
	margin-top: 15px;
}
.el-cascader {
	width: 100%
}
</style>