<template>
	<div>
		<!-- 面包屑导航区 -->
		<el-breadcrumb separator="/">
			<el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
			<el-breadcrumb-item><a href="/">权限管理</a></el-breadcrumb-item>
			<el-breadcrumb-item>权限列表</el-breadcrumb-item>
		</el-breadcrumb>
		<!-- 列表数据 -->
		<el-card>
			<el-table :data="rightsList" border stripe>
				<el-table-column type="index"></el-table-column>
				<el-table-column label="权限名称" prop="authName"></el-table-column>
				<el-table-column label="路径" prop="path"></el-table-column>
				<el-table-column label="权限等级" prop="level">
					<template slot-scope="scope">
						<el-tag v-if="scope.row.level === '0'">一级</el-tag>
						<el-tag  v-else-if="scope.row.level === '1'" type="success">二级</el-tag>
						<el-tag v-else="scope.row.level === '2'" type="waring">三级</el-tag>
					</template>
				</el-table-column>
			</el-table>
		</el-card>
	</div>
</template>

<script>
	export default {
		data() {
			return {
				rightsList: []
			}
		},
		created() {
			// 获取权限列表数据
			this.getRightsList()
		},
		methods: {
			async getRightsList() {
				const {data: res} = await this.$http.get('rights/list')
				if (res.meta.status !== 200) return this.$message.error('获取列表失败!')
				this.rightsList = res.data
			}
		}
	}
</script>


<style lang="less" scpoed>
</style>