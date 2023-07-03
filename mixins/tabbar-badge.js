  // 从 vuex 中按需导出 mapGetters 辅助方法
  import { mapGetters } from 'vuex'
  
  export default {
    computed: {
      // 调用 mapGetters 方法，把 m_cart 模块中的 total 数组映射到当前页面中，作为计算属性来使用
      // ...mapGetters('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
      ...mapGetters('m_cart', ['total'])
    },
    
    watch:{
      total() {
        this.setBadge()
      }
    },
    
    // 在页面刚展示的时候，设置数字徽标
    onShow() {
      this.setBadge()
    },
    
    methods:{
      // 为 tabBar 设置数字徽标
      setBadge() {
        // 调用 uni.setTabBarBadge() 方法，为购物车设置右上角的徽标
        uni.setTabBarBadge({
          index:2,  // 索引
          text:this.total + ''  // 注意：text 的值必须是字符串，不能是数字
        })
      }
    }
  }