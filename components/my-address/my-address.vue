<template>
	<view>
		<!-- 选择收货地址的盒子 -->
		<view class="address-choose-box" v-if="JSON.stringify(address) ==='{}'">
		  <button type="primary" size="mini" class="btnChooseAddress" @click="chooseAddress">请选择收货地址+</button>
		</view>
		
		<!-- 渲染收货信息的盒子 -->
		<view class="address-info-box" v-else @click="chooseAddress">
		  <view class="row1">
		    <view class="row1-left">
		      <view class="username">收货人：{{address.userName}}</view>
		    </view>
        <view class="row1-right">
          <view class="phone">电话：{{address.telNumber}}</view>
          <uni-icons type='arrowright' size='16'></uni-icons>
        </view>
		  </view>
      <view class="row2">
        <view class="row2-left">收货地址:</view>
        <view class="row2-right">{{addstr}}</view>
      </view>
		</view>
		
		<!-- 底部边框线 -->
    <image src="/static/cart_border@2x.png" class="address-border"></image>
	</view>
</template>

<script>
  import { mapState, mapGetters, mapMutations} from 'vuex'
	export default {
		data() {
			return {
				// address:{}
			};
		},
    
    computed:{
      ...mapState('m_user', ['address']),
      // 将 m_user 模块中的 addstr 映射到当前组件中使用
      ...mapGetters('m_user', ['addstr']),

    },
    
    methods:{
      ...mapMutations('m_user', ['updateAddress']),
      // 选择收货地址
      async chooseAddress() {
        // 1. 调用小程序提供的 chooseAddress() 方法，即可使用选择收货地址的功能
        // 返回值是一个数组：第1项为错误对象；第2项为成功之后的收货地址对象
        const [err, succ] = await uni.chooseAddress().catch(err => err)
        // 2. 用户成功的选择了收货地址
        if(err === null && succ.errMsg === 'chooseAddress:ok') {
          // 更新 vuex 中的收货地址
          this.updateAddress(succ)
        }
        if (err && (err.errMsg === 'chooseAddress:fail auth deny' || err.errMsg === 'chooseAddress:fail authorize no response')) {
          // 通过调用这个方法，让用户重新授权
          this.reAuth()
        }
      },
      
      // 调用此方法，重新发起收货地址的授权
      async reAuth() {
        // 3.1 提示用户对地址进行授权
        const [err2, confirmResult] = await uni.showModal({
          content:'检测到您没打开地址权限，是否去设置打开？',
          confirmText:'确认',
          cancelText:'取消',
        })
        // 3.2 如果弹框异常，则直接退出
        if(err2) return;
        // 3.3 如果用户点击了 “取消” 按钮，则提示用户 “您取消了地址授权！”
        if(confirmResult.cancel) return uni.$showMsg('您取消了地址授权');
        // 3.4 如果用户点击了 “确认” 按钮，则调用 uni.openSetting() 方法进入授权页面，让用户重新进行授权
        if(confirmResult.confirm) return uni.openSetting({
          // 3.4.1 授权结束，需要对授权的结果做进一步判断
          success: (settingResult) => {
            if(settingResult.authSetting['scope.address']) return uni.$showMsg('授权成功！请选择地址')
            // 3.4.3 地址授权的值等于 false，提示用户 “您取消了地址授权
            if(!settingResult.authSetting['scope.address']) return uni.$showMsg('您取消了地址授权！')
          }
        })
      }
    }
	}
</script>

<style lang="scss">
// 底部边框线的样式
.address-border {
  display: block;
  width: 100%;
  height: 5px;
}
  
.address-choose-box {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 90px;
}

.address-info-box {
  font-size: 12px;
  height: 90px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0 5px;
  
  .row1 {
    display: flex;
    justify-content: space-between;
    .row1-right {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
  
  .row2 {
    display: flex;
    align-items: center;
    margin-top: 10px;
    .row2-left {
      white-space: nowrap;
    }
    .row2-right {}
  }
}
</style>
