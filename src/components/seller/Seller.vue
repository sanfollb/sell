<template>
  <div class="seller" ref="seller">
    <div class="seller-content">
    	<div class="overview">
    		<h1 class="title">{{seller.name}}</h1>
    		<div class="desc border-1px">
    			<star :size="36" :score="seller.score"></star>
    			<span class="text">({{seller.ratingCount}})</span>
    			<span class="text">月售{{seller.sellCount}}单</span>
    		</div>
    		<ul class="remark">
    			<li class="block">
    				<h2>起送价</h2>
    				<div class="content">
    					<span class="stress">{{seller.minPrice}}</span>元
    				</div>
    			</li>
    			<li class="block">
    				<h2>商家配送</h2>
    				<div class="content">
    					<span class="stress">{{seller.deliveryPrice}}</span>元
    				</div>
    			</li>
    			<li class="block">
    				<h2>平均配送时间</h2>
    				<div class="content">
    					<span class="stress">{{seller.deliveryTime}}</span>分钟
    				</div>
    			</li>
    		</ul>
    		<div class="favorite" @click="toggleFavorite">
    			<span class="icon-favorite" :class="{'active':favorite}"></span>
    			<span class="favorite-text">{{favoriteText}}</span>
    		</div>
    	</div>
    	<split></split>
    	<div class="bulletin">
    		<h1 class="bulletin-title">公告与活动</h1>
    		<div class="content-wrapper border-1px">
    			<p class="bulletin-content">{{seller.bulletin}}</p>
    		</div>
            <ul v-if="seller.supports" class="supports">
              <li class="support-item border-1px" v-for="(item,index) in seller.supports">
                <span class="icon" :class="classMap[seller.supports[index].type]"></span>
                <span class="text">{{seller.supports[index].description}}</span>
              </li>
            </ul>
    	</div>
    	<split></split>
        <div class="pics">
        	<h1 class="pics-title">商家实景</h1>
        	<div class="pics-wrapper" ref="pics-wrapper">
        		<ul class="pics-list" ref="pics-list">
        			<li class="pic-item" v-for="(pic, index) in seller.pics">
        				<img :src="pic" width="120" height="90">
        			</li>
        		</ul>
        	</div>
        </div>
        <split></split>
        <div class="info">
        	<h1 class="info-title border-1px">商家信息</h1>
        	<ul>
        		<li class="info-item border-1px" v-for="(info, index) in seller.infos">{{info}}</li>
        	</ul>
        </div>
    </div>
  </div>
</template>

<script>
import Star from '../star/Star';
import Split from '../split/Split';
import BScroll from 'better-scroll';
import {saveToLocal, loadFromLocal} from '../../common/js/store.js';

export default {
  name: 'seller',
  props: {
  	seller: {
  		type: Object
  	}
  },
  data () {
     return {
     	favorite: (() => {
     		return loadFromLocal(this.seller.id, 'favorite', false);
     	})()
     };
  },
  computed: {
  	favoriteText () {
  		return this.favorite ? '已收藏' : '收藏';
  	}
  },
  components: {
  	Star,
  	Split
  },
  created () {
     this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
  },
  mounted () {
  	 console.log(this.seller);
     this._initScroll();
     this._initPicScroll();
  },
  updated () {
        this._initScroll();
        this._initPicScroll();
  },
  methods: {
  	toggleFavorite (event) {
        if (!event._constructed) {
        	return;
        }
        this.favorite = !this.favorite;
        saveToLocal(this.seller.id, 'favorite', this.favorite);
  	},
  	_initScroll () {
  		 if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.seller, {click: true});
  		 } else {
  		 	this.scroll.refresh();
  		 }
  	},
  	_initPicScroll () {
        if (this.seller.pics) {
  		let picWidth = 120;
  		let margin = 6;
  		let width = (picWidth + margin) * this.seller.pics.length - margin;
  		this.$refs['pics-list'].style.width = width + 'px';
  		this.$nextTick(() => {
  			if (!this.picScroll) {
               this.picScroll = new BScroll(this.$refs['pics-wrapper'], {scrollX: true, eventPassthrough: 'vertical'});
  			} else {
  				this.picScroll.refresh();
  			}
  		});
  	 }
  	}
  }
};
</script>

<style scoped>
.seller{
	position: absolute;
	top: 174px;
	bottom: 0;
	left: 0;
	width: 100%;
	overflow: hidden;
}
.overview{
	position: relative;
	padding: 18px;
}
.title{
	margin-bottom: 8px;
	line-height: 14px;
	color: rgb(7, 17, 27);
	font-size: 14px;
	font-weight: 700;
}
.desc{
	padding-bottom: 18px;
	font-size: 0;
	position: relative;
}
.desc:after{
   display: block;
   position: absolute;
   left: 0;
   bottom: 0;
   width: 100%;
   border-top: 1px solid rgba(7,17,27,0.1);
   content: ''; 
}
.star{
	display: inline-block;
	vertical-align: top;
	margin-right: 8px;
}
.text{
	display: inline-block;
	line-height: 18px;
	vertical-align: top;
	margin-right: 12px;
	font-size: 10px;
	color: rgb(77, 85, 93);
}
.remark{
    display: flex;
    padding-top: 18px;
}
.remark .block{
    flex: 1;
    text-align: center;
    border-right: 1px solid rgba(7, 17, 27, 0.1);
}
.remark .block:last-child{
	border: none;
}
.favorite{
	position: absolute;
	width: 50px;
	right: 11px;
	top: 18px;
	text-align: center;
}
.icon-favorite{
	display: block;
	margin-bottom: 4px;
	line-height: 24px;
	font-size: 24px;
	color: #d4d6d9;
}
.icon-favorite.active{
	color: rgb(240, 20, 20);
}
.favorite-text{
	line-height: 10px;
	font-size: 10px;
	color: rgb(77, 85, 93);
}
h2{
    margin-bottom: 4px;
    line-height: 10px;
    font-size: 10px;
    color: rgb(147, 153, 159);
}
.content{
	line-height: 24px;
	font-size: 10px;
	color: rgb(7, 17, 27);
}
.content .stress{
	font-size: 24px;
}
.bulletin{
    padding: 18px 18px 0 18px;
}
.bulletin-title{
	margin-bottom: 8px;
	line-height: 14px;
	color: rgb(7, 17, 27);
	font-size: 14px;
	font-weight: 700;
}
.content-wrapper{
	padding: 0 12px 16px 12px;
	position: relative;
}
.content-wrapper:after{
   display: block;
   position: absolute;
   left: 0;
   bottom: 0;
   width: 100%;
   border-top: 1px solid rgba(7,17,27,0.1);
   content: '';  
}
.bulletin-content{
	line-height: 24px;
	font-size: 12px;
	color: rgb(240, 20, 20);
}
.support-item{
	padding: 16px 12px;
	font-size: 0;
	position: relative;
}
.support-item:after{
   display: block;
   position: absolute;
   left: 0;
   bottom: 0;
   width: 100%;
   border-top: 1px solid rgba(7,17,27,0.1);
   content: ''; 
}
.support-item:last-child:after{
	display: none;
}
.icon{
	display: inline-block;
	width: 16px;
	height: 16px;
	vertical-align: top;
	margin-right: 6px;
	background-size: 16px 16px;
	background-repeat: no-repeat;
}
.icon.decrease{
  background-image: url('decrease_4@2x.png');
}
.icon.discount{
  background-image: url('discount_4@2x.png');
}
.icon.guarantee{
  background-image: url('guarantee_4@2x.png');
}
.icon.invoice{
  background-image: url('invoice_4@2x.png');
}
.icon.special{
  background-image: url('special_4@2x.png');
}
.text{
	line-height: 16px;
	font-size: 12px;
	color: rgb(7, 17, 27);
}
.pics{
	padding: 18px;
}
.pics-title{
	margin-bottom: 12px;
	line-height: 14px;
	color: rgb(7, 17, 27);
	font-size: 14px;
}
.pics-wrapper{
	width: 100%;
	overflow: hidden;
	white-space: nowrap;
}
.pics-list{
	font-size: 0
}
.pic-item{
	display: inline-block;
	margin-right: 6px;
	width: 120px;
	height: 90px;
}
.pic-item:last-child{
	margin: 0;
}
.info{
	padding: 18px 18px 0 18px;
	color: rgb(7, 17, 27);
}
.info-title{
	padding-bottom: 12px;
	line-height: 14px;
	font-size: 14px;
	position: relative;
}
.info-title:after{
   display: block;
   position: absolute;
   left: 0;
   bottom: 0;
   width: 100%;
   border-top: 1px solid rgba(7,17,27,0.1);
   content: '';  
}
.info-item{
	padding: 16px 12px;
	line-height: 16px;
	position: relative;
	font-size: 12px;
}
.info-item:after{
   display: block;
   position: absolute;
   left: 0;
   bottom: 0;
   width: 100%;
   border-top: 1px solid rgba(7,17,27,0.1);
   content: '';  
}
.info-item:last-child:after{
	display: none;
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
@media (-webkit-min-device-pixel-ratio: 3),(min-device-pixel-ratio: 3){
.icon.decrease{
  background-image: url('decrease_4@3x.png');
}
.icon.discount{
  background-image: url('discount_4@3x.png');
}
.icon.guarantee{
  background-image: url('guarantee_4@3x.png');
}
.icon.invoice{
  background-image: url('invoice_4@3x.png');
}
.icon.special{
  background-image: url('special_4@3x.png');
}
}
</style>
