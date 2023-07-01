<template>
	<view class="goods_list">
		<view v-for="(item, i) in goodsList" :key="i" @click="gotoDetail(item)">
      <my-goods :goods="item"></my-goods>
    </view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
        // 请求参数对象
				queryObj:{
          // 查询关键词
          query:'',
          // 商品分类Id
          cid:'',
          // 页码值
          pagenum:1,
          // 每页显示多少条数据
          pagesize:10
        },
        
        // 商品列表的数据
        goodsList:[],
        // 总数量，用来实现分页
        total:0,
        // 是否正在请求数据
        isloading:false
			};
		},
    
    onLoad(options) {
      this.queryObj.query = options.query || ''
      this.queryObj.cid = options.cid || ''
      // 调用获取商品列表数据的方法
      this.getGoodsList()
    },
    
    methods:{
      // 获取商品列表数据的方法
      async getGoodsList(cd) {
        this.isloading = true
        const {data:res} = await uni.$http.get('/api/public/v1/goods/search',this.queryObj)
        if(res.meta.status !== 200) return uni.$showMsg()
        this.isloading = false
        // 只要数据请求完毕，就立即按需调用 cb 回调函数
        cd && cd()
        // 为数据赋值：通过展开运算符的形式，进行新旧数据的拼接
        this.goodsList = [...this.goodsList, ...res.message.goods]
        this.total = res.message.total
      },
      
      gotoDetail(item) {
        uni.navigateTo({
          url:'/subpkg/goods_detail/goods_detail?goods_id='+item.goods_id
        })
      }
    },
    
    // 监听页面的上拉触底事件
    onReachBottom() {
      if(this.queryObj.pagenum * this.queryObj.pagesize >= this.total) return uni.$showMsg('数据加载完毕！')
      if(this.isloading) return
      this.queryObj.pagenum++
      this.getGoodsList()
    },
    
    
    // 监听页面的下拉刷新事件
    onPullDownRefresh() {
      // 重置关键数据
      this.queryObj.pagenum = 1
      this.total = 0
      this.isloading = false
      this.goodsList = []
      // 重新发起请求
      this.getGoodsList(()=>{
        // 停止当前页面的下拉刷新
        uni.stopPullDownRefresh()
      })
    }
	}
</script>

<style lang="scss">

</style>
