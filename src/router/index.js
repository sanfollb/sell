import Vue from 'vue';
import Router from 'vue-router';
import Goods from '../components/goods/Goods';
import Ratings from '../components/ratings/Ratings';
import Seller from '../components/seller/Seller';
Vue.use(Router);

export default new Router({
  linkActiveClass: 'active',
  routes: [
    {
      path: '/Goods',
      name: 'Goods',
      component: Goods
    },
    {
      path: '/Ratings',
      name: 'Ratings',
      component: Ratings
    },
    {
      path: '/Seller',
      name: 'Seller',
      component: Seller
    },
    {
      path: '*',
      redirect: '/Goods'
    }
  ]
});
