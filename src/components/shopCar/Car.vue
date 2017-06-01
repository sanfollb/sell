<template>
<div>
  <div class="car">
   <div class="content" @click="toggleList">
   	<div class="content-left">
   		<div class="logo-wrapper">
   			<div class="logo" :class="{'highlight':totalCount>0}">
   				<i class="icon-shopping_cart" :class="{'highlight':totalCount>0}"></i>
   			</div>
   			<div class="num" v-show="totalCount>0">{{totalCount}}</div>
   		</div>
   		<div class="price" :class="{'highlight':totalPrice>0}">¥{{totalPrice}}元</div>
   		<div class="desc">另需配送费¥{{deliveryPrice}}元</div>
   	</div>
   	<div class="content-right" @click.stop.prevent="payMoney">
   		<div class="pay" :class="payClass">
   			{{payDesc}}
   		</div>
   	</div>
   </div>
   <div class="ball-container">
    <template v-for="(ball,index) in balls">
      <transition v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:after-enter="afterEnter" name="list">
      <div v-if="ball.show" class="ball">
      	<div class="inner inner-hook"></div>
      </div>
      </transition>	
    </template>
   </div>
   <transition name="fold">
   	<div class="shopcart-list" v-show="listShow">
   	 <div class="shopcart-header">
   	  <h1 class="shopcart-title">购物车</h1>
   	  <span class="shopcart-empty" @click="empty">清空</span>	
   	 </div>
   	 <div class="shopcart-content" ref="shopcart-content">
   	  <ul>
   	  	<li class="food border-1px" v-for="(food, index) in selectFoods">
   	  		<span class="food-name">{{food.name}}</span>
   	  		<div class="food-price">
   	  			<span>¥{{food.price*food.count}}</span>
   	  		</div>
   	  		<div class="cartcontrol-wrapper">
   	  			<control :food="food"></control>
   	  		</div>
   	  	</li>
   	  </ul>	
   	 </div>
    </div>
   </transition>
  </div>
  <transition name="fade">
   <div @click="hideMask" class="list-mask" v-show="listShow"></div>
  </transition>
  <cash ref="cash-pay" :select-foods="selectFoods"></cash>
 </div>
</template>

<script>
import Control from '../carcontrol/Control';
import BScroll from 'better-scroll';
import Cash from '../cash/Cash';

export default {
  name: 'car',
  data () {
     return {
     	balls: [
     	{
     		show: false
     	},
     	{
     		show: false
     	},
     	{
     		show: false
     	},
     	{
     		show: false
     	},
     	{
     		show: false
     	}
     	],
     	dropBalls: [],
     	fold: true
     };
  },
  props: {
  	selectFoods: {
       type: Array,
       default () {
      	 return [];
      }
  	},
  	deliveryPrice: {
  		type: Number,
  		default: 0
  	},
  	minPrice: {
  		type: Number,
  		default: 0
  	}
  },
  components: {
       Control,
       Cash
  },
  computed: {
  	totalPrice () {
  		let total = 0;
  		this.selectFoods.forEach((food) => {
           total += food.price * food.count;
  		});
  		return total;
  	},
  	totalCount () {
  		let count = 0;
  		this.selectFoods.forEach((food) => {
           count += food.count;
  		});
  		return count;
  	},
  	payDesc () {
  		if (this.totalPrice === 0) {
  			return `¥${this.minPrice}元起送`;
  		} else if (this.totalPrice < this.minPrice) {
  			let diff = this.minPrice - this.totalPrice;
  			return `还差¥${diff}元起送`;
  		} else {
  			return '去结算';
  		}
  	},
  	payClass () {
  		if (this.totalPrice < this.minPrice) {
  			return 'not-enough';
  		} else {
  			return 'enough';
  		}
  	},
    listShow () {
    	if (!this.totalCount) {
    		this.fold = true;
    		return false;
    	}
    	let show = !this.fold;
    	if (show) {
    		this.$nextTick(() => {
    			if (!this.scroll) {
    			 this.scroll = new BScroll(this.$refs['shopcart-content'], {click: true});
    			} else {
    				this.scroll.refresh();
    			}
    		});
    	}
    	return show;
    }
  },
  methods: {
  	drop (el) {
        for (let i = 0; i < this.balls.length; i++) {
        	let ball = this.balls[i];
        	if (!ball.show) {
        		ball.show = true;
        		ball.el = el;
        		this.dropBalls.push(ball);
        		return;
        	}
        }
  	},
  	empty () {
         this.selectFoods.forEach((food) => {
            food.count = 0;
         });
  	},
  	hideMask () {
         if (!this.totalCount) {
    		return;
    	}
    	this.fold = !this.fold;
  	},
  	payMoney () {
         if (this.totalPrice < this.minPrice) {
         	return;
         }
         this.$refs['cash-pay'].show();
  	},
    beforeEnter (el) {
    	console.log(11);
        let count = this.balls.length;
        while (count--) {
        	let ball = this.balls[count];
        	if (ball.show) {
        		/* eslint-disable no-unused-vars */
        		let rect = ball.el.getBoundingClientRect();
        		let x = rect.left - 32;
        		let y = -(window.innerHeight - rect.top - 22);
        		el.style.display = '';
        		el.style.webkitTransform = `translate3d(0, ${y}px, 0)`;
        		el.style.transform = `translate3d(0, ${y}px, 0)`;
        		let inner = el.getElementsByClassName('inner-hook')[0];
        		inner.style.webkitTransform = `translate3d(${x}px, 0, 0)`;
                inner.style.transform = `translate3d(${x}px, 0, 0)`;
        	}
        }
    },
    enter (el, done) {
    	console.log(22);
    	/* eslint-disable no-unused-vars */
    	 let rf = el.offsetHeight;
    	this.$nextTick(() => {
                    el.style.webkitTransform = 'translate3d(0, 0, 0)';
                    el.style.transform = 'translate3d(0, 0, 0)';
                    let inner = el.getElementsByClassName('inner-hook')[0];
                    inner.style.webkitTransform = 'translate3d(0, 0, 0)';
                    inner.style.transform = 'translate3d(0, 0, 0)';
                    el.addEventListener('transitionend', done);
        });
    },
    afterEnter (el) {
    	console.log(33);
         let ball = this.dropBalls.shift();
         if (ball) {
        	ball.show = false;
        	el.style.display = 'none';
        }
    },
    toggleList () {
    	if (!this.totalCount) {
    		return;
    	}
    	this.fold = !this.fold;
    }
  }
};
</script>

<style scoped>
.car{
	position: fixed;
	left: 0;
	bottom: 0;
	z-index: 50;
	width: 100%;
	height: 48px;
}
.content{
    display: flex;
    background: #141d27;
    font-size: 0;
}
.content-left{
	flex: 1;
}
.logo-wrapper{
	display: inline-block;
	position: relative;
	top: -10px;
	margin: 0 12px;
	padding: 6px;
	width: 56px;
	height: 56px;
	box-sizing: border-box;
	vertical-align: top;
	border-radius: 50%;
	background: #141d27;
}
.logo{
	width: 100%;
	height: 100%;
	border-radius: 50%;
	text-align: center;
	background: #2b343c;
}
.logo.highlight{
	background: rgb(0,160,220);
}
.logo .icon-shopping_cart{
	line-height: 44px;
	font-size: 24px;
	color: #80858a;
}
.icon-shopping_cart.highlight{
	color: #fff;
}
.num{
	position: absolute;
	top: 0;
	right: 0;
	width: 24px;
	height: 16px;
	line-height: 16px;
	text-align: center;
	border-radius: 16px;
	font-size: 9px;
	font-weight: 700;
	color: #fff;
	background: rgb(240,20,20);
	box-shadow: 0 4px 8px 0 rgba(0,0,0,0.4);
}
.price{
	display: inline-block;
	vertical-align: top;
	margin-top: 12px;
	line-height: 24px;
	box-sizing: border-box;
	padding-right: 12px;
	border-right: 1px solid rgba(255,255,255,0.1);
	font-size: 16px;
	font-weight: 700;
	color: rgba(255,255,255,0.4);
}
.price.highlight{
	color: #fff;
}
.desc{
	display: inline-block;
	vertical-align: top;
	line-height: 24px;
	margin: 12px 0 0 12px;
	color: rgba(255,255,255,0.4);
	font-size: 10px;
}
.content-right{
	flex: 0 0 105px;
	width: 105px;
}
.pay{
	height: 48px;
	line-height: 48px;
	text-align: center;
	font-size: 12px;
	color: rgba(255,255,255,0.4);
	font-weight: 700;
	background: #2b333b;
}
.pay.not-enough{
	background: #2b333b;
}
.pay.enough{
	background: #00b43c;
	color: #fff;
}
.ball{
	position: fixed;
	left: 32px;
	bottom: 22px;
	z-index: 200;
}
.inner{
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: rgb(0,160,220);
}
.ball.list-enter-active{
	transition: all 0.4s cubic-bezier(.49, -.29, .75, .41);
}
.ball.list-enter-active .inner{
	transition: all 0.4s linear;
}
.shopcart-list{
	position: absolute;
	left: 0;
	top: 0;
	z-index: -1;
	width: 100%;
	transform: translate3d(0, -100%, 0);
}
.fold-enter-active,.fold-leave-active{
	transition: all 0.5s;
}
.fold-enter,.fold-leave-active{
	transform: translate3d(0, 0, 0);
}
.shopcart-header{
	height: 40px;
	line-height: 40px;
	padding: 0 18px;
	background: #f3f5f7;
	border-bottom: 1px solid rgba(7, 17, 27, 0.1);
}
.shopcart-title{
	float: left;
	font-size: 14px;
	color: rgb(7, 17, 27);
}
.shopcart-empty{
	float: right;
	font-size: 12px;
	color: rgb(0, 160, 220);
}
.shopcart-content{
	padding: 0 18px;
	max-height: 217px;
	overflow: hidden;
	background: #fff;
}
.food{
	position: relative;
	padding: 12px 0;
	box-sizing: border-box;
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
.food-name{
	line-height: 24px;
	font-size: 14px;
	color: rgb(7, 17, 27);
}
.food-price{
	position: absolute;
	right: 90px;
	bottom: 12px;
	line-height: 24px;
	font-size: 14px;
	font-weight: 700;
	color: rgb(240, 20, 20);
}
.cartcontrol-wrapper{
	position: absolute;
	right: 0;
	bottom: 6px;
}
.list-mask{
	position: fixed;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	z-index: 40;
	filter: blur(10px);
	background: rgba(7, 17, 27, 0.6);
}
.fade-enter-active,.fade-leave-active{
	transition: all 0.5s;
}
.fade-enter,.fade-leave-active{
	opacity: 0;
	background: rgba(7, 17, 27, 0);
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
