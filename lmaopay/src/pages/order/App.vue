<template>
  <!--物流详情页-->
  <main>
    <center v-if="user.length > 0 ">
      <div class="order">
        <div class="ord">
          <img :src="user.image">
          <div class="twol">
            <em>{{user.title}}</em>
            <span>物流配送中</span><br/>
            <span>数量：{{user.name}}&nbsp;&nbsp;&nbsp;单价：{{user.amount}}</span><br/>
            <span>￥{{user.amount}}</span>
          </div>
        </div>
      </div>
      <hr/>

      <div class="calculate">
        <em>物流信息</em>
      </div>
      <ul class="logistics" >
        <li v-show="logistics.length > 0" v-for="logis in logistics"><div class="log_info"><span class="dis">{{logis.context}}</span><br/><span>{{logis.time}}</span></div></li>
        <li><div class="empty">商家未发货</div></li>
      </ul>
      <hr/>

      <div class="logistics_list">
        <em>订单信息</em>
        <ul>
          <li>订 单 号：{{order_info.orderid}}</li>
          <li>下单时间：{{order_info.create_time}}</li>
          <li>支付方式：商城领取</li>
          <li>实　　付：{{order_info.total_amount}}元</li>
        </ul>
      </div>
    </center>

    <center v-else>
      <div class="nullInfo">
        <img src="https://lmaopay.oss-cn-qingdao.aliyuncs.com/res/yTwoLevelList/99.png">
        <p>暂无订单信息</p>
      </div>
    </center>

  </main>
</template>

<script>
    import { http,$_GET} from '../../assets/script/com.js'
    import {AlertModule} from 'vux'
    import CellBox from "vux/src/components/cell-box/index";
    export default {
        components: {
            CellBox,
            AlertModule},
        data() {
            return {
                user: {},
                logistics: {},
                order_info: {},
            };
        },
        created(){
            this.user = http.getLogin();
        },
        mounted(){
            this.onLoad();
        },
        methods: {
            onLoad()
            {
                var _self = this;
                // var user = http.getUserinfo();
                http.post({
                    uri:'Shop/Order/order_detail',
                    data:{
                        uid: this.user.uid,
                        orderid: $_GET['orderid'],
                    },
                    callback:function(e)
                    {
                        if(e.status==0)
                        {
                            AlertModule.show({
                                title:'提示',
                                content:e.info
                            });
                        }
                        else
                        {
                            _self.$set(_self,'user',e.body.goods_list);
                            _self.$set(_self,'logistics',e.body.logistics);
                            _self.$set(_self,'order_info',e.body.order_info);

                        }
                    }
                })
            },

        }
    }
</script>

<style>
  @import "../../assets/style/common.css";
  main{overflow-y: auto; -webkit-overflow-scrolling: touch; background-color: white;}

  center .order {width: 6.92rem; height: 1.76rem; background-color: white; margin-top: .2rem; text-align: left; position: relative;}
  center .order img {width: 1.25rem; height: 1.25rem; margin-top: .2rem; margin-left: .2rem; display: inline-block;}
  center .order .ord .twol {display: inline-block; margin-left: .25rem; position: absolute; width: 78%; margin-top: .1rem; }
  center .order .ord .twol em,center .calculate em,center .logistics_list em {font-size: .32rem; font-weight: bold; color: #323333;}
  center .order .ord .twol span:nth-of-type(1) {float: right; margin-right: .2rem; font-size: .24rem; font-weight: bold; color: #EA5504;}
  center .order .ord .twol span:nth-of-type(2) {font-size: .24rem; font-weight: bold; color: #999999; margin-top: .05rem;}
  center .order .ord .twol span:nth-of-type(3) {font-size: .32rem; font-weight: bold; color: #EA5504; margin-top: .05rem;}
  center hr {border: 0; height: .2rem; background-color: #F2F2F2;}
  center hr:nth-of-type(2) {margin-top: .8rem;}
  center .calculate {width: 7.16rem; height: .7rem; border-bottom: .01rem solid #F2F2F2; text-align: left; padding-left: .28rem; line-height: .7rem;}
  center .logistics {position: relative; text-align: left; margin-left: .2rem;}
  center .logistics li {border-left: .01rem solid #999999; padding: .5rem .2rem; position: relative;}
  center .logistics li .log_info {position: absolute; top: .82rem; width: 92%; bottom: .2rem;}
  center .logistics li .log_info .dis:before{content: ""; display: inline-block; width: .1rem; height: .1rem; background-color: #333; border-radius: .1rem; margin-right: .05rem; margin-left: -.25rem; vertical-align: middle; }
  center .logistics li:first-child {color: #EA5504;}
  center .logistics_list {width: 6.9rem; text-align: left; margin-top: .2rem;}
  center .logistics_list ul li {margin-top: .15rem;font-size: .24rem; font-weight: bold; color: #666666;}

  center .nullInfo {height: 12.2rem; width: 100%; position: relative; background-color: white;}
  center .nullInfo img, center .nullInfo p  { height: 27%; position: absolute; top: 0; left: 0; right: 0; bottom: 0; margin: auto;}
  center .nullInfo p {top: 7.2rem; font-size: .3rem; color: #999;}
</style>
