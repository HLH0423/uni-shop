export default {
  // 为当前模块开启命名空间
  namespaced: true,
  
  // 模块state数据
  state: ()=>({
    // 购物车的数组，用来存储购物车中每个商品的信息对象
    // 每个商品的信息对象，都包含如下 6 个属性：
    // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
    cart:JSON.parse(uni.getStorageSync('cart') || '[]')
  }),
  
  // 模块的 mutations 方法
  mutations: {
    // 实现加入购物车的功能
    addToCart(state, goods) {
      const findReasult = state.cart.find((x)=> x.goods_id === goods.goods_id)
      if(!findReasult) {
        state.cart.push(goods)
      } else {
        findReasult.goods_count++
      }
      this.commit('m_cart/saveToStorage')
    },
    
    // 更新购物车中商品的勾选状态
    updateGoodsState(state, goods) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      const findReasult = state.cart.find(x => x.goods_id === goods.goods_id)
      // 有对应的商品信息对象
      if(findReasult) {
        // 更新对应商品的勾选状态
        findReasult.goods_state = goods.goods_state
        // 持久化存储到本地
        this.commit('m_cart/saveToStorage')
      }
    },
    
    
    // 更新购物车中商品的数量
    updateGoodsCount(state, goods) {
      // 根据 goods_id 查询购物车中对应商品的信息对象
      const findReasult = state.cart.find(x => x.goods_id === goods.goods_id)
      // 有对应的商品信息对象
      if(findReasult) {
        // 更新对应商品的勾选状态
        findReasult.goods_count = goods.goods_count
        // 持久化存储到本地
        this.commit('m_cart/saveToStorage')
      }
    },
    
    // 根据 ID 从购物车中删除对于的商品信息
    removeGoodsById(state, goods_id) {
      // 调用数组的 fliter 方法进行过滤
      state.cart = state.cart.filter( x => x.goods_id !== goods_id)
      // 持久化存储到本地
      this.commit('m_cart/saveToStorage')
    },
    
    // 将购物车中的数据持久化存储到本地
    saveToStorage(state) {
      uni.setStorageSync('cart', JSON.stringify(state.cart))
    },
    
    // 更新所有商品的勾选状态
    updateAllGoodsState(state, newState) {
      state.cart.forEach( x => x.goods_state = newState)
      this.commit('m_cart/saveToStorage')
    }

  },
  
  // 模块的 getters 属性
  getters: {
    // 购物车中所有商品的总数量
    total(state) {
      let c = 0
      state.cart.forEach(goods => c += goods.goods_count)
      return c
    },
    
    // 购物车中已勾选商品的总数量
    checkoutCount(state) {
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count, 0)
    },
    
    // 已勾选商品的总价
    checkedGoodsAmount(state) {
      return state.cart.filter(x => x.goods_state).reduce((total, item) => total += item.goods_count * item.goods_price, 0).toFixed(2)
    }
  },
}