<template>
  <div class="control">
  <transition name="slide-fade">
  <div @click.stop.prevent="decreaseCart($event)" class="cart-decrease icon-remove_circle_outline" v-show="food.count>0"></div>
  </transition>
   <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
   <div @click.stop.prevent="addCart($event)" class="cart-increase icon-add_circle"></div>
  </div>
</template>

<script>
import Vue from 'vue';
import Bus from '../../common/js/eventBus.js';

export default {
  name: 'control',
  props: {
  	food: {
  		type: Object
  	}
  },
  methods: {
  	addCart (event) {
        if (!event._constructed) {
        	return;
        }
        if (!this.food.count) {
        	Vue.set(this.food, 'count', 1);
        	this.food.count = 1;
        } else {
        	this.food.count++;
        }
        console.log(event.target);
        Bus.$emit('cart-add', event.target);
  	},
  	decreaseCart (event) {
        if (!event._constructed) {
        	return;
        }
        if (this.food.count) {
        	this.food.count--;
        }
  	}
  }
};
</script>

<style scoped>
.control{
	font-size: 0;
}
.cart-count{
	display: inline-block;
	vertical-align: top;
	width: 12px;
	padding-top: 6px;
	line-height: 24px;
	text-align: center;
	font-size: 10px;
	color: rgb(147,153,159);
}
.cart-increase,.cart-decrease{
	display: inline-block;
	line-height: 24px;
	font-size: 24px;
	padding: 6px;
	color: rgb(0,160,220);
}
.slide-fade-enter-active,.slide-fade-leave-active{
	transition: all 0.4s linear;
}
.slide-fade-enter,.slide-fade-leave-active{
	opacity: 0;
	transform: translate3d(24px, 0, 0);
}
</style>
