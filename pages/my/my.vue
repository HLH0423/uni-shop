<template>
	<view class="my-container">
    <!-- 用户未登录， 显示登录组件 -->
		<!-- <my-login v-if="!token"></my-login> -->
    
    <!-- 用户登录后，显示用户信息组件 -->
    <my-userinfo></my-userinfo>
	</view>
</template>

<script>
  // 导入自己封装的 mixin 模块
  import badgeMix from '@/mixins/tabbar-badge.js'
  import { mapState } from 'vuex'
  
	export default {
    // 将 badgeMix 混入到当前的页面中进行使用
    mixins:[badgeMix],
		data() {
			return {
				
			};
		},
    
    computed:{
      ...mapState('m_user', ['token'])
    }
	}
</script>

<style lang="scss">
  page,
  .my-container{
    height: 100%;
  }
</style>
