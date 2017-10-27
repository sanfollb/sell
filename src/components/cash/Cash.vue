<template>
 <transition name="move">
  <div v-show="showFlag" ref="cash" class="cash">
    <div class="cash-content" ref="cash-content">
     <div>
      <div class="header border-1px">
    	    <div class="icon">
    		   <span @click.stop.prevent="hide" class="icon-arrow_lift"></span>
    	    </div>
    	    <div class="header-content">
    		  <span class="info">确认订单</span>
    	    </div>
      </div>
    	<div class="address-wrapper">
    		<div class="name">
    		 <span>收货人：</span>
    		 <span>{{payment.info}}</span>
    		</div>
    		<div class="address">
    		 <span>收货地址：</span>
    		 <span>{{payment.address}}</span>
    		</div>
    	</div>
    	<split></split>
    	<div class="time-wrapper">
    	  <div class="time border-1px">
    		  <div class="time-title">送达时间</div>
    		  <div v-if="payment.arriveTime" class="time-content">
    		    <span v-show="stand" class="time-old">尽快送达</span>
    			  <span class="time-pre">{{chosenTime}}</span><span @click.stop.prevent="showDetail" class="icon-keyboard_arrow_right"></span>
    		  </div>
    	  </div>
    	  <div class="words">
    		  <span class="words-title">买家留言：</span>
    		  <div class="words-content">
    			  <input type="text" name="words" placeholder="口味偏好等要求">
    		  </div>
    	  </div>
      </div>
      <split></split>
      <div class="title border-1px">
            <div class="avatar">
            	<img width="16" height="16" :src="payment.avatar">
            </div>
        	<span class="seller-name">{{payment.name}}</span>
      </div>
      <div class="food border-1px">
        	<ul>
        		<li class="food-item" v-for="(food, index) in selectFoods">
        			<span class="food-name">{{food.name}}</span>
   	  		        <div class="food-price">
   	  		          <span class="count">x{{food.count}}</span>
   	  			      <span class="price">¥{{food.price*food.count}}</span>
   	  		        </div>
        		</li>
        	</ul>
      </div>
      <div class="detail">
        	<ul>
        	  <li class="detail-item">
        		<span class="detail-name">商品总价</span>
        		<div class="price-wrapper">
   	  			  <span>¥{{totalPrice}}</span>
   	  		    </div>
   	  		   </li>
   	  		   <li class="detail-item">
        		<span class="detail-name">在线支付立减优惠</span>
        		<div class="price-wrapper">
   	  			  <span>-¥{{deliveryPrices}}</span>
   	  		    </div>
   	  		   </li>
   	  		   <li class="detail-item">
        		<span class="detail-name">配送费</span>
        		<div class="price-wrapper">
   	  			  <span>¥{{payment.deliveryPrice}}</span>
   	  		    </div>
   	  		   </li>
        	</ul>
      </div>
     </div> 
    </div>
    <div class="pay">
      <div class="pay-left">
        <div class="pay-price">合计：¥{{payPrice}}元</div>
      </div>
      <div class="pay-right">
        <div @click.stop.prevent="payMoney" class="pay-content">确认付款</div>
      </div>
    </div>
    <transition name="fade">
    <div v-show="detailShow" class="time-detail">
      <div class="detail-wrapper">
        <ul v-if="payment.arriveTime">
          <li class="time-item border-1px" v-for="(item, index) in payment.arriveTime">
            <div class="selected-time" @click="choose(item, index)">
              <input type="radio" name="time">
            </div>
            <span class="select-time">{{item.desc}}</span>
          </li>
        </ul>
      </div>
    </div>
    </transition> 
  </div>
 </transition>
</template>

<script>
import Split from '../split/Split';
import BScroll from 'better-scroll';

const ERR_OK = 0;
export default {
  name: 'cash',
  data () {
  	return {
       payment: {},
       showFlag: false,
       detailShow: false,
       stand: true
  	};
  },
  props: {
     selectFoods: {
       type: Array,
       default () {
      	 return [];
      }
    }
  },
  components: {
  	Split
  },
  computed: {
  	totalPrice () {
  		let total = 0;
  		this.selectFoods.forEach((food) => {
           total += food.price * food.count;
  		});
  		return total;
  	},
  	payPrice () {
  		let tt = 0;
  		tt = this.totalPrice - this.deliveryPrices + this.payment.deliveryPrice;
  		return tt;
  	},
  	deliveryPrices () {
  		let price = 0;
  		if (this.totalPrice > 20 && this.totalPrice < 30) {
  			price = 4;
  		} else if (this.totalPrice >= 30 && this.totalPrice < 50) {
  			price = 15;
  		} else {
  			price = 25;
  		}
  		return price;
  	},
    chosenTime () {
      let msy = '';
      this.payment.arriveTime.forEach((val) => {
         if (val.type === 0) {
          msy = val.desc;
         }
      });
      return msy;
    }
  },
  methods: {
    show () {
      this.showFlag = true;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs['cash-content'], {click: true});
        } else {
          this.scroll.refresh();
        }
      });
    },
    hide () {
      if (!event._constructed) {
        return;
      }
    	this.showFlag = false;
    },
    showDetail () {
      if (!event._constructed) {
        return;
      }
      this.detailShow = true;
    },
    choose (item, index) {
      this.payment.arriveTime.forEach((val) => {
         val.type = 1;
      });
      item.type = 0;
      if (item.exp) {
        this.stand = true;
      } else {
        this.stand = false;
      }
      this.detailShow = false;
    },
    payMoney () {
      alert('已下单成功，待商家接单');
    }
  },
  watch: {
    payment: function () {
      let sss = document.getElementsByName('time');
      this.$nextTick(() => {
          for (let i = 0; i < sss.length; i++) {
          sss[0].checked = 'checked';
        }
      });
    }
  },
  created () {
  	this.axios.get('/api/payment').then((response) => {
       response = response.data;
       if (response.errno === ERR_OK) {
        this.payment = response.data;
    }
  });
 }
};
</script>

<style scoped>
.cash{
	position: fixed;
	left: 0;
	top: 0;
	z-index: 60;
	width: 100%;
  height: 100%;
	background: #fff;
	transform: translate3d(0, 0, 0);
}
.move-enter-active,.move-leave-active{
	transition: all 0.2s linear;
}
.move-enter,.move-leave-active{
	transform: translate3d(100%, 0, 0);
}
.cash-content{
  position: fixed;
  left: 0;
  top: 0;
  bottom: 50px;
  width: 100%;
}
.header{
	position: relative;
	padding: 6px 0 12px 0;
}
.header:after{
   display: block;
   position: absolute;
   left: 0;
   bottom: 0;
   width: 100%;
   border-top: 1px solid rgba(7,17,27,0.1);
   content: ''; 
}
.icon{
	display: inline-block;
	vertical-align: top;
	padding: 5px 20px;
	border-right: 1px solid rgba(7,17,27,0.1);
}
.icon-arrow_lift{
	color: blue;
	font-weight: 700;
}
.header-content{
	display: inline-block;
	vertical-align: top;
	padding: 5px 15px;
	font-weight: 700;
}
.address-wrapper{
	padding: 20px 30px;
}
.name{
	padding: 5px 0;
	line-height: 16px;
	font-size: 16px;
}
.address{
	padding: 5px 0;
	line-height: 15px;
	font-size: 15px;
}
.time-wrapper{
    padding: 12px 15px;
}
.time{
	padding: 5px 3px 12px 3px;
	font-size: 16px;
	line-height: 18px;
	position: relative;
}
.time:after{
   display: block;
   position: absolute;
   left: 0;
   bottom: 0;
   width: 100%;
   border-top: 1px solid rgba(7,17,27,0.1);
   content: ''; 
}
.time-content{
	position: absolute;
	top: 5px;
	right: 0;
}
.time-old{
	padding-right: 5px;
	border-right: 2px solid rgb(7,17,27);
}
.icon-keyboard_arrow_right{
	font-size: 16px;
  padding: 5px;
  color: rgba(7,17,27,0.6);
}
.words{
	padding: 12px 3px 0 3px;
	font-size: 16px;
	line-height: 16px;
}
.words-title{
	display: inline-block;
	vertical-align: top;
}
.words-content{
	display: inline-block;
	vertical-align: top;
}
.title{
	position: relative;
	padding: 15px 0;
	margin: 0 15px;
}
.title:after{
   display: block;
   position: absolute;
   left: 0;
   bottom: 0;
   width: 100%;
   border-top: 1px solid rgba(7,17,27,0.1);
   content: ''; 
}
.avatar{
	display: inline-block;
	vertical-align: top;
	padding: 3px 3px;
}
.avatar img{
	width: 16px;
	height: 16px;
	border-radius: 50%;
}
.seller-name{
	display: inline-block;
	vertical-align: top;
	padding: 3px 3px;
}
.food{
	position: relative;
	margin: 0 15px;
	padding-bottom: 15px;
}
.food:after{
   display: block;
   position: absolute;
   left: 0;
   bottom: 0;
   width: 100%;
   border-top: 1px solid rgba(7,17,27,0.1);
   content: '';  
}
.food-item{
	position: relative;
	padding: 12px 0;
	box-sizing: border-box;
}
.food-name{
	line-height: 24px;
	font-size: 14px;
	color: rgb(7, 17, 27);
}
.food-price{
	position: absolute;
	right: 10px;
	bottom: 12px;
	line-height: 24px;
	font-size: 14px;
	font-weight: 700;
	color: rgb(7, 17, 27);
}
.count{
    margin-right: 20px;
}
.detail{
	padding: 10px 15px 0 15px;
}
.detail-item{
	position: relative;
	padding: 10px 0;
	box-sizing: border-box;
}
.detail-name{
	line-height: 24px;
	font-size: 14px;
	color: rgb(7, 17, 27);
}
.price-wrapper{
	position: absolute;
	right: 10px;
	bottom: 12px;
	line-height: 24px;
	font-size: 14px;
	font-weight: 700;
	color: rgb(7, 17, 27);
}
.pay{
	display: flex;
	position: fixed;
	right: 0;
	bottom: 0;
	z-index: 70;
	width: 100%;
	height: 48px;
}
.pay-left{
    flex: 1
}
.pay-price{
	padding-right: 5px;
	height: 48px;
	line-height: 48px;
	text-align: right;
	background: #fff;
	color: rgb(240, 20, 20);
}
.pay-right{
	flex: 0 0 105px;
	width: 105px;
}
.pay-content{
	height: 48px;
	line-height: 48px;
	text-align: center;
	font-size: 15px;
	color: #fff;
	font-weight: 700;
	background: rgb(240, 20, 20);
}
.time-detail{
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100;
  width: 100%;
  height: 100%;
  background: rgba(7, 17, 27, 0.6);
}
.fade-enter-active,.fade-leave-active{
  transition: all 0.5s;
}
.fade-enter,.fade-leave-active{
  opacity: 0;
  background: rgba(7, 17, 27, 0);
}
.detail-wrapper{
  width: 80%;
  padding: 10px 0;
  margin: 10% auto;
  background: #fff;
}
.time-item{
  position: relative;
  padding: 12px 16px;
}
.time-item:after{
   display: block;
   position: absolute;
   left: 0;
   bottom: 0;
   width: 100%;
   border-top: 1px solid rgba(7,17,27,0.1);
   content: '';  
}
.time-item:last-child:after{
  display: none;
}
.selected-time{
  position: absolute;
  display: inline-block;
  vertical-align: top;
  right: 0;
  top: 0;
  padding: 14px 16px;
}
.select-time{
  display: inline-block;
  vertical-align: top;
}

@media (-webkit-min-device-pixel-ratio: 1.5),(min-device-pixel-ratio: 1.5){
  .border-1px::after{
    -webkit-transform: scaleY(0.7);
    transform: scaleY(0.7);
  }
}

@media (-webkit-min-device-pixel-ratio: 2),(min-device-pixel-ratio: 2){
  .border-1px::after{
    -webkit-transform: scaleY(0.5);
    transform: scaleY(0.5);
  }
}
</style>
