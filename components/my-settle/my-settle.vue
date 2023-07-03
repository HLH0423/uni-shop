<template>
	<view class="my-settle-container">
		<!-- 全选 -->
    <label class="radio" @click="changeAllState">
      <radio color="#C00000" :checked="isFullCheck">
        <text>全选</text>
      </radio>
    </label>
    
    <!-- 合计 -->
    <view class="amount-box">
      合计:<text class="amount">￥{{checkedGoodsAmount}}</text>
    </view>
    
    
    <!-- 结算 -->
    <view class="btn-settle">结算（{{checkoutCount}}）</view>
	</view>
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				
			};
		},
    
    computed:{
      ...mapGetters('m_cart',['checkoutCount', 'total', 'checkedGoodsAmount']),
      isFullCheck() {
        return this.total === this.checkoutCount
      }
    },
    
    methods: {
      ...mapMutations('m_cart', ['updateAllGoodsState']),
      
      // 修改购物车中所有商品的选中状态
      changeAllState() {
        this.updateAllGoodsState(!this.isFullCheck)
      }
    }
	}
</script>

<style lang="scss">
.my-settle-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: cyan;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-left: 8px;
  font-size: 14px;
  background-color: white;
  
  .radio {
    display: flex;
    align-items: center;
  }
  
  .amount-box {
    .amount {
      color: #C00000;
      font-weight: bold;
    }
  }
  
  .btn-settle {
    background-color: #C00000;
    height: 50px;
    color: white;
    line-height: 50px;
    text-align: center;
    min-width: 100px;
    padding: 0 10px;
  }
  

}
</style>
