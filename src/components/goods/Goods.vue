<template>
 <div>
  <div class="goods">
   <div class="menu-wrapper" ref='menu-wrapper'>
   	<ul>
   		<li v-for="(item,index) in goods" class="menu-item" :class="{'current':currentIndex===index}" @click="selectMenu(index, $event)">
   			<span class ='menu-text border-1px'>
   			  <span v-show="item.type>0" class="menu-icon" :class="classMap[item.type]"></span>{{item.name}}
   			</span>
   		</li>
   	</ul>
   </div>
   <div class="foods-wrapper" ref='foods-wrapper'>
   	<ul>
   	  <li v-for="(item,index) in goods" class="food-list food-list-hook">
   	  	<h1 class="food-title">{{item.name}}</h1>
   	  	<ul>
   	  	  <li @click="selectFood(food, $event)" v-for="(food,index) in item.foods" class="food-item border-1px">
   	  	  	<div class="food-icon">
   	  	  		<img width="57" height="57" :src="food.icon">
   	  	  	</div>
   	  	  	<div class="food-content">
   	  	  		<h2 class="food-name">{{food.name}}</h2>
   	  	  		<p class="food-desc">{{food.description}}</p>
   	  	  		<div class="food-extra">
   	  	  			<span class="count">月售{{food.sellCount}}份</span>
   	  	  			<span>好评率{{food.rating}}%</span>
   	  	  		</div>
   	  	  		<div class="food-price">
   	  	  			<span class="now">¥{{food.price}}</span><span class="old" v-show="food.oldPrice">¥{{food.oldPrice}}</span>
   	  	  		</div>
   	  	  		<div class="cartcontrol-wrapper">
   	  	  			<control :food="food"></control>
   	  	  		</div>
   	  	  	</div>
   	  	  </li>	
   	  	</ul>
   	  </li>	
   	</ul>
   </div>
   <car ref="shop-cart" :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></car>
  </div>
  <food ref="select-food" :food="selectedFood"></food>
 </div> 
</template>

<script>
import BScroll from 'better-scroll';
import Car from '../shopCar/Car';
import Control from '../carcontrol/Control';
import Bus from '../../common/js/eventBus.js';
import Food from '../food/Food';

  const ERR_OK = 0;
export default {
  name: 'goods',
  components: {
      Car,
      Control,
      Food
  },
  props: {
  	seller: {
      type: Object
  	}
  },
  data () {
    return {
    	goods: [],
    	listHeight: [],
    	scrollY: 0,
    	selectedFood: {}
    };
  },
  computed: {
     currentIndex () {
     	for (let i = 0; i < this.listHeight.length; i++) {
     		let height1 = this.listHeight[i];
     		let height2 = this.listHeight[i + 1];
     		if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
               return i;
     		}
     	}
     	return 0;
     },
     selectFoods () {
     	let foods = [];
     	this.goods.forEach((good) => {
     		good.foods.forEach((food) => {
     			if (food.count) {
     				foods.push(food);
     			}
     		});
     	});
     	return foods;
     }
  },
  methods: {
  	selectMenu (index, event) {
  		if (!event._constructed) {
  			return;
  		}
  		let foodList = this.$refs['foods-wrapper'].getElementsByClassName('food-list-hook');
  		let el = foodList[index];
  		this.foodsScroll.scrollToElement(el, 300);
       console.log(index);
  	},
  	selectFood (food, event) {
        if (!event._constructed) {
  			return;
  		}
  		this.selectedFood = food;
  		this.$refs['select-food'].show();
  	},
     _initScroll () {
     	this.menuScroll = new BScroll(this.$refs['menu-wrapper'], {click: true});
     	this.foodsScroll = new BScroll(this.$refs['foods-wrapper'], {click: true, probeType: 3});
     	this.foodsScroll.on('scroll', (pos) => {
            this.scrollY = Math.abs(Math.round(pos.y));
     	});
     },
     _calculateHeight () {
     	let foodList = this.$refs['foods-wrapper'].getElementsByClassName('food-list-hook');
     	let height = 0;
     	this.listHeight.push(height);
        for (let i = 0; i < foodList.length; i++) {
        	let item = foodList[i];
        	height += item.clientHeight;
        	this.listHeight.push(height);
        }
     },
     _drop (target) {
     	// 体验优化，异步执行下落动画
     	 this.$nextTick(() => {
           this.$refs['shop-cart'].drop(target);
     	});
     }
  },
  created () {
  	   this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  	   this.axios.get('/api/goods').then((response) => {
       response = response.data;
       if (response.errno === ERR_OK) {
        this.goods = response.data;
        this.$nextTick(() => {
          this._initScroll();
          this._calculateHeight();
     });
    }
  	   Bus.$on('cart-add', target => {
  	   	  this._drop(target);
  	   });
  });
 }
};
</script>

<style scoped>

.goods{
  display: flex;
  position: absolute;
  top: 174px;
  bottom: 46px;
  width: 100%;
  overflow: hidden;
}
.menu-wrapper{
	flex: 0 0 80px;
	width: 80px;
	background: #f3f5f7;
}
.menu-wrapper .menu-item{
	display: table;
	height: 54px;
	width: 56px;
	line-height: 14px;
	padding: 0 12px;
}
.menu-item.current{
	position: relative;
	z-index: 10;
	margin-top: -1px;
	background: #fff;
	font-weight: 700;
}
.menu-icon{
	display: inline-block;
    display: inline-block;
    vertical-align: top;
    width: 12px;
    height: 12px;
    margin-right: 2px;
    background-size: 12px 12px;
    background-repeat: no-repeat;
}
.menu-icon.decrease{
  background-image: url('decrease_3@2x.png');
}
.menu-icon.discount{
  background-image: url('discount_3@2x.png');
}
.menu-icon.guarantee{
  background-image: url('guarantee_3@2x.png');
}
.menu-icon.invoice{
  background-image: url('invoice_3@2x.png');
}
.menu-icon.special{
  background-image: url('special_3@2x.png');
}
.menu-text{
	display: table-cell;
	width: 56px;
	vertical-align: middle;
	font-size: 12px;
	position: relative;
}
.menu-text:after{
   display: block;
   position: absolute;
   left: 0;
   bottom: 0;
   width: 100%;
   border-top: 1px solid rgba(7,17,27,0.1);
   content: '';
}
.foods-wrapper{
	flex: 1;
}
.food-title{
	padding-left: 14px;
	height: 26px;
	line-height: 26px;
	border-left: 2px solid #d9dde1;
	font-size: 12px;
	color: rgb(147,153,159);
	background: #f3f5f7;
}
.food-item{
	display: flex;
	margin: 18px;
	position: relative;
	padding-bottom: 18px;
}
.food-item:last-child{
	margin-bottom: 0;
}
.food-item:after{
	display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    border-top: 1px solid rgba(7,17,27,0.1);
    content: '';
}
.food-item:last-child:after{
    display: none;
}
.food-icon{
    flex: 0 0 57px;
    margin-right: 10px;
}
.food-content{
	flex: 1;
}
.food-name{
	margin: 2px 0 8px 0;
	height: 14px;
	line-height: 14px;
	font-size: 14px;
	color: rgb(7,17,27);
}
.food-desc,.food-extra{
	line-height: 10px;
	font-size: 10px;
	color: rgb(147,153,159);
}
.food-desc{
    margin-bottom: 8px;
    line-height: 12px;
}
.food-extra .count{
    margin-right: 12px;
}
.food-price{
	font-weight: 700;
	line-height: 24px;
}
.food-price .now{
	margin-right: 8px;
	font-size: 14px;
	color: rgb(240,20,20);
}
.food-price .old{
	text-decoration: line-through;
	font-size: 10px;
	color: rgb(147,153,159);

}
.cartcontrol-wrapper{
	position: absolute;
	right: 0;
	bottom: 12px;
}


@media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3){
.menu-icon.decrease{
  background-image: url('decrease_3@3x.png');
}
.menu-icon.discount{
  background-image: url('discount_3@3x.png');
}
.menu-icon.guarantee{
  background-image: url('guarantee_3@3x.png');
}
.menu-icon.invoice{
  background-image: url('invoice_3@3x.png');
}
.menu-icon.special{
  background-image: url('special_3@3x.png');
}

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
