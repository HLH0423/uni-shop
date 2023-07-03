<template>
	<view v-if="goods_info.goods_name" class="goods-detail-container">
    <!-- 轮播图区域 -->
    <swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
      <swiper-item v-for="(item, i) in goods_info.pics" :key="i">
        <image :src="item.pics_big" @click="preview(i)"></image>
      </swiper-item>
    </swiper>
    
    <!-- 商品信息区域 -->
    <view class="goods-info-box">
      <!-- 商品价格 -->
      <view class="price">￥{{goods_info.goods_price}}</view>
      <!-- 信息主体区域 -->
      <view class="goods-info-body">
        <!-- 商品名字 -->
        <view class="goods-name">{{goods_info.goods_name}}</view>
        <!-- 收藏 -->
        <view class="favi">
          <uni-icons type='star' size='18' color="gray"></uni-icons>
          <text>收藏</text>
        </view>
      </view>
      <!-- 运费 -->
      <view class="yf">快递：免运费</view>
    </view>
    
    <!-- 商品详情信息 -->
    <rich-text :nodes="goods_info.goods_introduce"></rich-text>
    
    <!-- 商品导航组件 -->
    <view class="goods_nav">
      <uni-goods-nav :fill="true" :options="options" @click="onClick" @buttonClick="buttonClick" />
    </view>
	</view>
</template>

<script>
  // 从 vuex 中按需导出 mapState 辅助方法
  import { mapState, mapMutations, mapGetters } from 'vuex'
  // 导入自己封装的 mixin 模块
  import badgeMix from '@/mixins/tabbar-badge.js'
  
	export default {
    // 将 badgeMix 混入到当前的页面中进行使用
    mixins:[badgeMix],
    computed: {
      // 调用 mapState 方法，把 m_cart 模块中的 cart 数组映射到当前页面中，作为计算属性来使用
      // ...mapState('模块的名称', ['要映射的数据名称1', '要映射的数据名称2'])
      ...mapState('m_cart', []),
    },
    
    // 使用普通函数的形式定义的 watch 侦听器，在页面首次加载后不会被调用。
    // 因此导致了商品详情页在首次加载完毕之后，不会将商品的总数量显示到商品导航区域
    // 为了防止这个上述问题，可以使用对象的形式来定义 watch 侦听器
    watch:{
      total:{
        // handler 属性用来定义侦听器的 function 处理函数
        handler(newVal) {
          const findReasult = this.options.find(x => x.text === '购物车')
          if(findReasult) {
            findReasult.info = newVal
          }
        },
        // immediate 属性用来声明此侦听器，是否在页面初次加载完毕后立即调用
        immediate:true
      }
    },
    
    
		data() {
			return {
				// 商品详情对象
        goods_info:{},
        
        // 左侧按钮组的配置对象
        options: [{
              icon: 'shop',
              text: '店铺',
              infoBackgroundColor:'#007aff',
              infoColor:"red"
            }, {
              icon: 'cart',
              text: '购物车',
              info: 0
            },
          ],
          
          // 右侧按钮组的配置对象
          buttonGroup: [{
              text: '加入购物车',
              backgroundColor: '#ff0000',
              color: '#fff'
            },
            {
              text: '立即购买',
              backgroundColor: '#ffa200',
              color: '#fff'
            }
          ]     
			};
		},
   
    
    onLoad(options) {
      const goods_id = options.goods_id
      this.getGoodsDetail(goods_id)
    },
    
    methods:{
      // 把 m_cart 模块中的 addToCart 方法映射到当前页面使用
      ...mapMutations('m_cart', ['addToCart']),
      
      // 定义请求商品详情数据的方法
      async getGoodsDetail(goods_id) {
        const {data : res} = await uni.$http.get('/api/public/v1/goods/detail',{goods_id})
        if(res.meta.status !== 200) return uni.$showMsg()
        res.message.goods_introduce = res.message.goods_introduce.replace(/<img/g, '<img style="display:block;"').replace(/webp/g,'jpg')
        this.goods_info = res.message
      },
      
      // 实现轮播图的预览效果
      preview(i) {
        // 调用 uni.previewImage() 方法预览图片
        uni.previewImage({
          // 预览时，默认显示图片的索引
          current:i,
          // 所有图片 url 地址的数组
          urls:this.goods_info.pics.map(x=>x.pics_big)
        })
      },
      
      
      onClick(e) {
        if(e.content.text === '购物车') {
          uni.switchTab({
            url:'../../pages/cart/cart'
          })
        }
      },
      
      // 右侧按钮的点击事件处理函数
      buttonClick(e) {
        // 判断是否点击了 加入购物车 按钮
        if(e.content.text === '加入购物车') {
          // { goods_id, goods_name, goods_price, goods_count, goods_small_logo, goods_state }
          const goods = {
            goods_id: this.goods_info.goods_id,
            goods_name: this.goods_info.goods_name,
            goods_price: this.goods_info.goods_price,
            goods_count: 1,
            goods_small_logo: this.goods_info.goods_small_logo,
            goods_state: true,
          }
          // 通过 this 调用映射过来的 addToCart 方法，把商品信息对象存储到购物车中
          this.addToCart(goods)
        }
      },
      

    }
	}
</script>

<style lang="scss">
  swiper{
    height: 750rpx;
    image{
      width: 100%;
      height: 100%;
    }
  }
  
  .goods-info-box {
    padding: 10px;
    padding-right: 0;
    
    .price {
      color: #C00000;
      font-size: 18px;
      margin: 10px 0;
    }
    .goods-info-body {
      display: flex;
      justify-content: space-between;
      .goods-name {
        font-size: 13px;
        margin-right: 10px;
      }
      .favi {
        width: 120px;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        border-left: 1px solid #efefef;
        color: gray;
      }
    }
    .yf {
      margin: 10px 0;
      font-size: 12px;
      color: gray;
    }
    
    .goods-detail-container {
      padding-bottom: 50px;
    }
    
    .goods_nav {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
    }
  }
</style>
