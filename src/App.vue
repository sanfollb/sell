<template>
  <div id="app">
  <Headers :seller="seller"></Headers>
  <div class="tab border-1px">
  <div class="tab-item"><router-link to="Goods" >商品</router-link></div>
  <div class="tab-item"><router-link to="Ratings" >评论</router-link></div>
  <div class="tab-item"><router-link to="Seller" >商家</router-link></div>
  </div>
  <div class="main-content">
  <keep-alive><router-view :seller="seller"></router-view></keep-alive>
  </div>
  </div>
</template>

<script>
import Headers from './components/header/Headers';
import {urlParse} from './common/js/util.js';
const ERR_OK = 0;

export default {
  name: 'app',
  components: {Headers},
  data () {
      return {
        seller: {
          id: (() => {
            let queryParam = urlParse();
            return queryParam.id;
          })()
        }
      };
  },
  created () {
     this.axios.get('/api/seller?id=' + this.seller.id).then((response) => {
      response = response.data;
      if (response.errno === ERR_OK) {
        this.seller = Object.assign({}, this.seller, response.data);
      }
     });
  }
};
</script>

<style>

body,html{
  line-height: 1;
  font-weight: 200;
  font-family: 'PingFang SC','STHeitiSC-Light','Helvetica-Light',arial,sans-serif;
}
.clearfix{
   display: inline-block;
}
.clearfix:after{
  display: block;
  content: '.';
  height: 0;
  line-height: 0;
  clear: both;
  visibility: hidden;
}

.tab{
  display: flex;
  width: 100%;
  height: 40px;
  line-height: 40px;
  position: relative;
}
.tab:after{
   display: block;
   position: absolute;
   left: 0;
   bottom: 0;
   width: 100%;
   border-top: 1px solid rgba(7,17,27,0.1);
   content: ''; 
}
.tab .tab-item{
  flex: 1;
  text-align: center;
}
.tab-item a{
  display: block;
  font-size: 14px;
  color: rgb(77,85,93);
}
.tab-item a.active{
  color: rgb(240,20,20);
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
