<template>
	<view>
		<view class="login-container">
		  <!-- 提示登录的图标 -->
      <uni-icons type='contact-filled' size="100" color='#AFAFAF'></uni-icons>
      <!-- 登录按钮 -->
      <button type="primary" class="btn-login" open-type="getUserInfo" @getuserinfo="getUserInfo">一键登录</button>
      <!-- 登陆提示 -->
      <text class="tips-text">登录后尽享更多权益</text>
		</view>
	</view>
</template>

<script>
  import { mapState, mapMutations } from 'vuex'
	export default {
		data() {
			return {
				
			};
		},
    
    computed: {
      ...mapState('m_user', ['redirectInfo']),
    },
    
    methods:{
      // 调用 mapMutations 辅助方法，把 m_user 模块中的 updateUserInfo 映射到当前组件中使用
      ...mapMutations('m_user', ['updateUserInfo', 'updateToken', 'updateRedirectInfo']),
      
      // 用户授权之后，获取用户的基本信息
      getUserInfo(e) {     
        console.log('getUserInfo', e)
        // 判断是否获取用户信息成功
        if(e.detail.errMsg === 'getUserInfo:fail auth deny') {
          return uni.$showMsg('您取消了登录授权！')
        }
        // 3. 将用户的基本信息存储到 vuex 中
        this.updateUserInfo(e.detail.userInfo)
        
        // 获取登录成功后的 Token 字符串
        this.getToken(e.detail)
      },
      
      // 调用登录接口，换取永久的 token
      async getToken(info) {
        // 获取 code 对应的值
        const [err, res] = await uni.login().catch( err => err)
        console.log('getToken', res)
        if(err || res.errMsg !== 'login:ok') {
          return uni.$showMsg('登录失败！')
        }
        
        // 准备参数对象
        const query = {
          code: res.code,
          encryptedData: info.encryptedData,
          iv: info.iv,
          rawData: info.rawData,
          signature: info.signature
        }
      
        // 换取 token
        const { data: loginResult } = await uni.$http.post('/api/public/v1/users/wxlogin', query)
        console.log('loginResult', loginResult)
        
        if(loginResult.meta.status !== 200) return uni.$showMsg('登录失败！')
        
        // 更新 vuex 中的 token
        this.updateToken(loginResult.message.token)
        // 判断 vuex 中的 redirectInfo 是否为 null
        // 如果不为 null，则登陆成功之后，需要重新导航到对应的页面
        this.uni.navigateBack()
      },
      
      // 返回登陆之前的页面
      navigateBack() {
        if(this.redirectInfo && this.redirectInfo.openType === 'swicthTab') {
          uni.switchTab({
            url: this.redirectInfo.from,
            complete: ()=>{
              this.updateRedirectInfo(null)
            }
          })
        }
      }
    }
	}
</script>

<style lang="scss">
  .login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 750rpx ;
    background-color: #F8F8F8;
    position: relative;
    overflow: hidden;
    
    &::after {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      bottom: 0;
      height: 40px;
      width: 100%;
      background-color: white;
      border-radius: 100%;
      transform: translateY(50%);
    }
    
    .btn-login {
      width: 90%;
      border-radius: 100px;
      margin: 15px 0;
      background-color: #C00000;
    }
    .tips-text {
      color: gray;
      font-size: 12px;
    }
  }
</style>
