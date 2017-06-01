<template>
  <div class="ratingselect">
   <div class="rating-type border-1px">
   	<span @click="select(2, $event)" class="block positive" :class="{'active':selectedType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
   	<span @click="select(0, $event)" class="block positive" :class="{'active':selectedType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
   	<span @click="select(1, $event)" class="block negative" :class="{'active':selectedType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
   </div>
   <div @click="toggleContent" class="switch" :class="{'on':onlyContents}">
   	<span class="icon-check_circle"></span>
   	<span class="text">只看有内容的评价</span>
   </div>
  </div>
</template>

<script>
import Bus from '../../common/js/eventBus.js';
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;
export default {
  name: 'ratingselect',
  data () {
     return {
      // 防止直接修改父级传下的props，可用data或computed媒介过度
      selectedType: this.selectType,
      onlyContents: this.onlyContent
     };
  },
  props: {
  	ratings: {
  		type: Array,
  		default () {
  			return [];
  		}
  	},
  	selectType: {
  		type: Number,
  		default: ALL
  	},
  	onlyContent: {
  		type: Boolean,
  		default: false
  	},
  	desc: {
  		type: Object,
  		default () {
  			return {
  				all: '全部',
  				positive: '满意',
                negative: '不满意'
  			};
  		}
  	}
  },
  computed: {
    positives () {
    	return this.ratings.filter((rating) => {
           return rating.rateType === POSITIVE;
    	});
    },
    negatives () {
        return this.ratings.filter((rating) => {
           return rating.rateType === NEGATIVE;
    	});
    }
  },
  methods: {
  	select (type, event) {
       if (!event._constructed) {
       	return;
       }
       this.selectedType = type;
       Bus.$emit('ratingtype-select', type);
  	},
  	toggleContent (event) {
  		if (!event._constructed) {
       	return;
       }
       this.onlyContents = !this.onlyContents;
       Bus.$emit('content-toggle', this.onlyContents);
  	}
  }
};
</script>

<style scoped>
.rating-type{
	padding: 18px 0;
	margin: 0 18px;
	position: relative;
	font-size: 0;
}
.rating-type:after{
   display: block;
   position: absolute;
   left: 0;
   bottom: 0;
   width: 100%;
   border-top: 1px solid rgba(7,17,27,0.1);
   content: ''; 
}
.block{
   display: inline-block;
   padding: 8px 12px;
   font-size: 12px;
   margin-right: 8px;
   border-radius: 1px;
   line-height: 16px;
   color: rgb(77, 85, 93);
}
.block.active{
   color: #fff;
}
.block.positive{
	background: rgba(0, 160, 220, 0.2);
}
.block.positive.active{
	background: rgb(0, 160, 220);
}
.block.negative{
	background: rgba(77, 85, 93, 0.2);
}
.block.negative.active{
	background: rgb(77, 85, 93);
}
.count{
	font-size: 8px;
	margin-left: 2px;
}
.switch{
	padding: 12px 18px;
	line-height: 24px;
	font-size: 0;
	border-bottom: 1px solid rgba(7, 17, 27, 0.1);
	color: rgb(147, 153, 159);
}
.switch .icon-check_circle{
	display: inline-block;
	vertical-align: top;
    margin-right: 4px;
    font-size: 24px;
}
.switch .text{
	display: inline-block;
	vertical-align: top;
	font-size: 12px;
}
.switch.on .icon-check_circle{
    color: #00c850;
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
