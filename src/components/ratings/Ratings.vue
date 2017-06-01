<template>
  <div class="ratings" ref="ratings-main">
    <div class="ratings-content">
    	<div class="overview">
    		<div class="overview-left">
    			<h1 class="score">{{seller.score}}</h1>
    			<div class="title">综合评分</div>
    			<div class="rank">高于周边商家{{seller.rankRate}}%</div>
    		</div>
    		<div class="overview-right">
    			<div class="score-wrapper">
    				<span class="score-title">服务态度</span>
    				<star :size="36" :score="seller.serviceScore"></star>
    				<span class="score-total">{{seller.serviceScore}}</span>
    			</div>
    			<div class="score-wrapper">
    			    <span class="score-title">商品评分</span>
    				<star :size="36" :score="seller.foodScore"></star>
    				<span class="score-total">{{seller.foodScore}}</span>
    			</div>
    			<div class="delivery-wrapper">
    				<span class="delivery-title">送达时间</span>
    				<span class="delivery-time">{{seller.deliveryTime}}分钟</span>
    			</div>
    		</div>
    	</div>
    	<split></split>
    	<ratingselect :select-type="selectType" :only-content="onlyContent" :ratings="ratings"></ratingselect>
    	<div class="rating-wrapper">
    		<ul>
    			<li v-show="needShow(rating.rateType, rating.text)" v-for="(rating, index) in ratings" class="rating-item border-1px">
    				<div class="avatar">
    					<img width="28" height="28" :src="rating.avatar">
    				</div>
    				<div class="content">
    					<h1 class="user-name">{{rating.username}}</h1>
    					<div class="star-wrapper">
    						<star :size="24" :score="rating.score"></star>
    						<span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
    					</div>
    					<p class="text">{{rating.text}}</p>
    					<div class="recommend" v-show="rating.recommend && rating.recommend.length">
    						<span class="icon-thumb_up"></span>
    						<span class="item" v-for="(item, index) in rating.recommend">{{item}}</span>
    					</div>
    					<div class="time">
    						{{rating.rateTime | formatDate}}
    					</div>
    				</div>
    			</li>
    		</ul>
    	</div>
    </div>
  </div>
</template>

<script>
import Split from '../split/Split';
import Ratingselect from '../ratingselect/Ratingselect';
import Star from '../star/Star';
import {format} from '../../common/js/date.js';
import BScroll from 'better-scroll';
import Bus from '../../common/js/eventBus.js';

const ALL = 2;
const ERR_OK = 0;
export default {
  name: 'ratings',
  data () {
    return {
    	ratings: [],
    	selectType: ALL,
    	onlyContent: true
    };
  },
  created () {
       this.axios.get('/api/ratings').then((response) => {
       response = response.data;
       if (response.errno === ERR_OK) {
        this.ratings = response.data;
        this.$nextTick(() => {
            this.ratingScroll = new BScroll(this.$refs['ratings-main'], {click: true});
        });
      }
     });
       Bus.$on('ratingtype-select', type => {
  	   	  this.selectType = type;
  	   	  this.$nextTick(() => {
  	   	  	this.ratingScroll.refresh();
  	   	  });
  	   });
      Bus.$on('content-toggle', onlyContents => {
  	   	  this.onlyContent = onlyContents;
  	   	  this.$nextTick(() => {
  	   	  	this.ratingScroll.refresh();
  	   	  });
  	   });
  },
  components: {
  	Star,
  	Split,
  	Ratingselect
  },
  props: {
  	seller: {
  		type: Object
  	}
  },
  methods: {
    needShow (type, text) {
        if (this.onlyContent && !text) {
        	return false;
        }
        if (this.selectType === ALL) {
        	return true;
        } else {
        	return type === this.selectType;
        }
  	}
  },
  filters: {
    formatDate (time) {
        let date = new Date(time);
        return format(date, 'yyyy-MM-dd hh:mm');
    }
  }
};
</script>

<style scoped>
.ratings{
	position: absolute;
	top: 174px;
	bottom: 0;
	left: 0;
	width: 100%;
	overflow: hidden;
}
.overview{
	display: flex;
	padding: 18px 0;
}
.overview-left{
	flex: 0 0 137px;
	padding: 6px 0;
	width: 137px;
	border-right: 1px solid rgba(7, 17, 27, 0.1);
	text-align: center;
}
.overview-right{
	flex: 1;
	padding: 6px 0 6px 24px;
}
.score{
	line-height: 28px;
	font-size: 24px;
	margin-bottom: 6px;
	color: rgb(255, 153, 0);
}
.title{
	line-height: 12px;
	font-size: 12px;
	margin-bottom: 8px;
	color: rgb(7, 17, 27); 
}
.rank{
	line-height: 10px;
	font-size: 10px;
	color: rgb(147, 153, 159);
}
.score-wrapper{
	margin-bottom: 8px;
	font-size: 0;
}
.score-title{
	line-height: 18px;
	display: inline-block;
	vertical-align: top;
	font-size: 12px;
	color: rgb(7, 17, 27);
}
.star{
	display: inline-block;
	margin: 0 12px;
	vertical-align: top;
}
.score-total{
	line-height: 18px;
    display: inline-block;
	vertical-align: top;
	font-size: 12px;
	color: rgb(255, 153, 0);
}
.delivery-wrapper{
	font-size: 0;
}
.delivery-title{
	line-height: 18px;
	font-size: 12px;
	color: rgb(7, 17, 27);
}
.delivery-time{
	margin-left: 12px;
	font-size: 12px;
	color: rgb(147, 153, 159);
}
.rating-wrapper{
	padding: 0 18px;
}
.rating-item{
    display: flex;
    padding: 18px 0;
    position: relative;
}
.rating-item:after{
   display: block;
   position: absolute;
   left: 0;
   bottom: 0;
   width: 100%;
   border-top: 1px solid rgba(7,17,27,0.1);
   content: ''; 
}
.rating-item:last-child:after{
	display: none;
}
.avatar{
	flex: 0 0 28px;
	width: 28px;
	margin-right: 12px;
}
.avatar img{
	border-radius: 50%;
}
.content{
	position: relative;
	flex: 1;
}
.user-name{
	margin-bottom: 4px;
	line-height: 12px;
	font-size: 10px;
	color: rgb(7, 17, 27);
}
.star-wrapper{
	margin-bottom: 6px;
	font-size: 0;
}
.star{
	display: inline-block;
	vertical-align: top;
	margin-right: 6px;
}
.delivery{
	display: inline-block;
	vertical-align: top;
	font-size: 10px;
	line-height: 12px;
	color: rgb(147, 153, 159);
}
.text{
	line-height: 18px;
	margin-bottom: 8px;
	color: rgb(7, 17, 27);
	font-size: 12px;
}
.recommend{
	line-height: 16px;
	font-size: 0;
}
.icon-thumb_up,.item{
	display: inline-block;
	margin: 0 8px 4px 0;
	font-size: 9px;
}
.icon-thumb_up{
	color: rgb(0, 160, 220);
}
.item{
	padding: 0 6px;
	border: 1px solid rgba(7, 17, 27, 0.1);
	border-radius: 1px;
	color: rgb(147, 153, 159);
	background: #fff;
}
.time{
	position: absolute;
	top: 0;
	right: 0;
	line-height: 12px;
	font-size: 10px;
	color: rgb(147, 153, 159);
}
@media only screen and (max-width: 320px){
	.overview-left{
		flex: 0 0 120px;
		width: 120px;
	}
	.overview-right{
		padding-left: 6px;
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
