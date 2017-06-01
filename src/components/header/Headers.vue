<template>
  <div class="headers">
   <div class="content-wrapper">
   	<div class="avatar">
   		<img width="64" height="64" :src="seller.avatar">
   	</div>
   	<div class="content">
   		<div class="title">
   			<span class="brand"></span>
   			<span class="name">{{seller.name}}</span>
   		</div>
   		<div class="description">
   		 {{seller.description}}/{{seller.deliveryTime}}分钟送达
   		</div>
   		<div v-if="seller.supports" class="support">
   			<span class="icon" :class="classMap[seller.supports[0].type]"></span>
   			<span class="text">{{seller.supports[0].description}}</span>
   		</div>
   	</div>
    <div v-if="seller.supports" class="support-count" @click="showDetail">
      <span class="count">{{seller.supports.length}}个</span>
      <i class="icon-keyboard_arrow_right"></i>
    </div>
   </div>
   <div class="bulletin-wrapper" @click="showDetail">
   	<span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
    <i class="icon-keyboard_arrow_right"></i>
   </div>
   <div class="background">
     <img :src="seller.avatar" width="100%" height="100%">
   </div>
   <transition name = "fade">
   <div v-show="detailShow" class="detail">
     <div class="detail-wrapper clearfix">
       <div class="detail-main">
          <h1 class="name">{{seller.name}}</h1>
          <div class="star-wrapper">
          <star :size="48" :score="seller.score"></star>
          </div>
          <div class="title">
            <div class="line"></div>
            <div class="text">优惠信息</div>
            <div class="line"></div>
          </div>
          <ul v-if="seller.supports" class="supports">
            <li class="support-item" v-for="(item,index) in seller.supports">
              <span class="icon" :class="classMap[seller.supports[index].type]"></span>
              <span class="text">{{seller.supports[index].description}}</span>
            </li>
          </ul>
          <div class="title">
            <div class="line"></div>
            <div class="text">商家公告</div>
            <div class="line"></div>
          </div>
          <div class="bulletin">
            <p class="contents">{{seller.bulletin}}</p>
          </div>
       </div>
     </div>
     <div class="detail-close" @click="hideDetail">
       <i class="icon-close"></i>
     </div>
   </div>
   </transition>
  </div>
</template>

<script>
import Star from '../star/Star';

export default {
  name: 'headers',
  data () {
     return {
       detailShow: false
     };
  },
  components: {
      Star
  },
  created () {
     this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  },
  methods: {
      showDetail () {
        this.detailShow = true;
      },
      hideDetail () {
        this.detailShow = false;
      }
  },
  props: {
     seller: {
  	   type: Object
  	}
  }
};
</script>

<style scoped>
.headers{
  color: #fff;
  position: relative;
  background: rgba(7,17,27,0.5);
  overflow: hidden;
}
.content-wrapper{
  padding: 24px 12px 18px 24px;
  font-size: 0;
  position: relative;
}
.avatar{
  vertical-align: top;
}
.avatar img{
  border-radius: 2px;
}
.avatar,.content{
  display: inline-block;
}
.content{
  margin-left: 16px;
}
.title{
  margin: 2px 0 8px 0;
}
.title .brand{
  width: 30px;
  height: 18px;
  display: inline-block;
  background-image: url('brand@2x.png');
  background-size: 30px 18px;
  background-repeat: no-repeat;
  vertical-align: top;
}
.title .name{
  margin-left: 6px;
  font-size: 16px;
  line-height: 18px;
  font-weight: bold;
}
.description{
  margin-bottom: 10px;
  line-height: 12px;
  font-size: 12px;
}
.support .icon{
  display: inline-block;
  vertical-align: top;
  width: 12px;
  height: 12px;
  margin-right: 4px;
  background-size: 12px 12px;
  background-repeat: no-repeat;
}
.support .text{
  font-size: 10px;
  line-height: 12px;
}
.support-count{
  position: absolute;
  right: 12px;
  bottom: 14px;
  padding: 0 8px;
  height: 24px;
  line-height: 24px;
  border-radius: 14px;
  background: rgba(0,0,0,0.2);
  text-align: center;
}
.support-count .count{
  vertical-align: top;
  font-size: 10px;
}
.support-count .icon-keyboard_arrow_right{
  font-size: 10px;
  line-height: 24px;
  margin-left: 2px;
}

.icon.decrease{
  background-image: url('decrease_1@2x.png');
}
.icon.discount{
  background-image: url('discount_1@2x.png');
}
.icon.guarantee{
  background-image: url('guarantee_1@2x.png');
}
.icon.invoice{
  background-image: url('invoice_1@2x.png');
}
.icon.special{
  background-image: url('special_1@2x.png');
}

.bulletin-wrapper{
  position: relative;
  height: 28px;
  line-height: 28px;
  padding: 0 22px 0 12px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  background: rgba(7,17,27,0.2);
}
.bulletin-title{
  display: inline-block;
  vertical-align: top;
  margin-top: 8px;
  width: 22px;
  height: 12px;
  background-image: url('bulletin@2x.png');
  background-size: 22px 12px;
  background-repeat: no-repeat;
}
.bulletin-text{
  vertical-align: top;
  margin: 0 4px;
  font-size: 10px;
}
.bulletin-wrapper .icon-keyboard_arrow_right{
  position: absolute;
  font-size: 10px;
  right: 12px;
  top: 8px;
}
.background{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  filter: blur(10px);
}
.detail{
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  overflow: auto;
  background: rgba(7, 17, 27, 0.8);
}
.fade-enter-active, .fade-leave-active{
  transition: all .5s;
}
.fade-enter,.fade-leave-active{
  opacity: 0;
  background: rgba(7, 17, 27, 0);
}

.detail-wrapper{
  min-height: 100%;
  width: 100%;
}
.detail-main{
  margin-top: 64px;
  padding-bottom: 64px; 
}
.detail-main .name{
  line-height: 16px;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  width: 100%;
}
.detail-close{
  position: relative;
  width: 32px;
  height: 32px;
  margin: -64px auto 0 auto;
  clear: both;
  font-size: 32px;
}
.star-wrapper{
  margin-top: 18px;
  padding: 2px 0;
  text-align: center;
}
.detail-main .title{
  display: flex;
  width: 80%;
  margin: 28px auto 24px auto;
}
.detail-main .title .line{
  flex: 1;
  position: relative;
  top: -6px;
  border-bottom: 1px solid rgba(255,255,255,0.2);
}
.detail-main .title .text{
  padding: 0 12px;
  font-size: 14px;
  font-weight: 700;
}
.detail-main .supports{
  width: 80%;
  margin: 0 auto;
}
.detail-main .supports .support-item{
  padding: 0 14px;
  margin-bottom: 12px;
  font-size: 0;
}
.supports .support-item:last-child{
  margin-bottom: 0;
}
.support-item .icon{
  display: inline-block;
  width: 16px;
  height: 16px;
  vertical-align: top;
  margin-right: 6px;
  background-size: 16px 16px;
  background-repeat: no-repeat;
}
.support-item .icon.decrease{
  background-image: url('decrease_2@2x.png');
}
.support-item .icon.discount{
  background-image: url('discount_2@2x.png');
}
.support-item .icon.guarantee{
  background-image: url('guarantee_2@2x.png');
}
.support-item .icon.invoice{
  background-image: url('invoice_2@2x.png');
}
.support-item .icon.special{
  background-image: url('special_2@2x.png');
}
.support-item .text{
  display: inline-block;
  vertical-align: top;
  line-height: 16px;
  font-size: 12px;
}
.detail-main .bulletin{
  width: 80%;
  margin: 0 auto;
}
.detail-main .bulletin .contents{
  padding: 0 12px;
  line-height: 24px;
  font-size: 12px;
}


@media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3){
.title .brand{
     background-image: url('brand@3x.png');
  }
.icon.decrease{
  background-image: url('decrease_1@3x.png');
}
.icon.discount{
  background-image: url('discount_1@3x.png');
}
.icon.guarantee{
  background-image: url('guarantee_1@3x.png');
}
.icon.invoice{
  background-image: url('invoice_1@3x.png');
}
.icon.special{
  background-image: url('special_1@3x.png');
}
.bulletin-title{
  background-image: url('bulletin@3x.png');
}
.support-item .icon.decrease{
  background-image: url('decrease_2@3x.png');
}
.support-item .icon.discount{
  background-image: url('discount_2@3x.png');
}
.support-item .icon.guarantee{
  background-image: url('guarantee_2@3x.png');
}
.support-item .icon.invoice{
  background-image: url('invoice_2@3x.png');
}
.support-item .icon.special{
  background-image: url('special_2@3x.png');
}

}
</style>
