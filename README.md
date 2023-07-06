# 微信小程序企业级商城项目
微信小程序企业级商城是一款面向企业的全功能电子商务平台，基于uni-app平台开发，旨在为企业提供一站式的移动商城解决方案。该商城具有完整的购物流程、商品展示、订单管理、用户中心等功能，能够帮助企业快速构建自己的品牌商城，并提供优质的购物体验给用户。

## 项目结构
<img src="https://github.com/HLH0423/uni-shop/assets/54101102/f2f995b9-723b-42d3-9adf-eaacf0289aab" width="800">

## 首页
<img src="https://github.com/HLH0423/uni-shop/assets/54101102/6c69cf16-8825-4aef-a481-0f3300b20650" width="400">

## 分类
<img src="https://github.com/HLH0423/uni-shop/assets/54101102/b8052830-c359-4e1f-bfda-ba3f30efc6bd" width="400">

## 购物车
<img src="https://github.com/HLH0423/uni-shop/assets/54101102/b9e31107-297d-42c9-bc06-1f476a272112" width="400">

## 我的
### 一键登录
<img src="https://github.com/HLH0423/uni-shop/assets/54101102/17dd03d3-b728-44b1-8641-517e90c9e820" width="400">

### 用户信息
<img src="https://github.com/HLH0423/uni-shop/assets/54101102/4f250ef5-fb8f-49b8-a54f-cd859074f481" width="400">

## 商品搜索
搜索吸顶：将搜索组件固定在页面顶部，不会被轮播图等区域覆盖
######
搜索建议：提供根据关键词查询商品的功能
######
搜索历史：保证最新搜索的关键词在最前面且不出现重复关键词
######
<img src="https://github.com/HLH0423/uni-shop/assets/54101102/a1673c05-be15-4e02-bb90-2bd666ef5799" width="200">
<img src="https://github.com/HLH0423/uni-shop/assets/54101102/94b7a1ad-b754-43e6-85e4-c8490828cb4b" width="200">
<img src="https://github.com/HLH0423/uni-shop/assets/54101102/4e01ce29-9b99-4637-ac08-b01e7e47777c" width="200">

## 商品列表
### 展示商品信息
<img src="https://github.com/HLH0423/uni-shop/assets/54101102/0d99c313-bdec-4103-a85d-292e39a40c5a" width="300">

### 上拉加载更多
<img src="https://github.com/HLH0423/uni-shop/assets/54101102/6a0990c8-9675-42ea-be16-e9adb871244f" width="300">

### 下拉刷新页面
<img src="https://github.com/HLH0423/uni-shop/assets/54101102/a58782bf-3b2d-4dae-9aac-418b5d387aed" width="300">

### 点击跳转详情页
<img src="https://github.com/HLH0423/uni-shop/assets/54101102/7bfa88ef-8865-435a-b710-7f267789cd09" width="300">

## 加入购物车
<img src="https://github.com/HLH0423/uni-shop/assets/54101102/2356e519-7781-42be-bf88-ab2341a77367" width="200">
<img src="https://github.com/HLH0423/uni-shop/assets/54101102/2b1e4619-233e-4253-8833-408b0a90fd5b" width="200">

## 微信支付
该部分功能由于权限问题只能完成代码实现，不能进行效果展示
###

```sh
// 点击了结算按钮
settlement() {
  // 先判断是否勾选了要结算的商品
  if(!this.checkedCount) return uni.$showMsg('请选择要结算的商品！')
  // 再判断用户是否选择了收货地址
  if(!this.addstr) return uni.$showMsg('请选择收货地址')
  
  // if(!this.token) return uni.$showMsg('请先登录！')
  if(!this.token) return this.delayNavigate()
  this.payOrder()
},

async payOrder() {
  // 1. 创建订单
  // 1.1 组织订单的信息对象
  const orderInfo = {
    // 开发期间，注释掉真实的订单价格，
    // order_price: this.checkedGoodsAmount,
    // 写死订单总价为 1 分钱
    order_price: 0.01,
    consignee_addr: this.addstr,
    goods: this.cart.filter(x => x.goods_state).map(x => ({ goods_id: x.goods_id, goods_number: x.goods_count, goods_price: x.goods_price }))
  }
  // 1.2 发起请求创建订单
  const {data : res} = await uni.$http.post('/api/public/v1/my/orders/create', orderInfo)
  
  if(res.meta.status !== 200) return uni.$showMsg('创建订单失败！')
  // 1.3 得到服务器响应的“订单编号”
  const orderNumber = res.message.order_number
  
  // 2. 订单预支付
  // 2.1 发起请求获取订单的支付信息
  const {data : res2} = await uni.$http.post('/api/public/v1/my/orders/req_unifiedorder', {order_number:orderNumber})
  // 2.2 预付订单生成失败
  if(res2.meta.status !== 200) return uni.$showMsg('预付订单生成失败！')
  // 2.3 得到订单支付相关的必要参数
  const payInfo = res2.message
  
  // 3. 发起微信支付
  // 3.1 调用 uni.requestPayment() 发起微信支付
  const [err, succ] = await uni.requestPayment(payInfo)
  // 3.2 未完成支付
  if(err) return uni.$showMsg('订单未支付！')
  // 3.3 完成了支付，进一步查询支付的结果
  const {data: res3} = await uni.$http.post('/api/public/v1/my/orders/chkOrder', {order_number:orderNumber})
  // 3.4 检测到订单未支付
  if(res3.meta.status !== 200) return uni.$showMsg('订单未支付！')
  // 3.5 检测到订单支付完成
  uni.showToast({
    title: '支付完成！',
    icon: 'success'
  })
}
```






