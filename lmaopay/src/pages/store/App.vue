<template>
<scroller lock-x height="100%" :bounce=false ref="scrollerBottom">
  <center id="store">
    <div class="store">{{item.mchname}}</div>
    <div class="image">
      <ul>
        <li v-for="img in item.headimgurl"><img v-lazy="img"></li>
      </ul>
    </div>
    <div class="time icon-clock">
      <em><i>{{item.time_show}}</i></em>
      <a :href="'tel:'+item.telephone" class="icon-phone"></a>
    </div>
    <div class="address icon-location-outline">
      <em><u>南坪商圈</u><i>{{item.address}}</i></em>
      <a>{{geoDistance(latitude,longitude,106.54041,29.40268)}}Km</a>
    </div>
    <div class="menu">
      <ul>
        <li class="on"><a href="javascript:;"><em>爆点礼包</em></a></li>
        <li><a href="javascript:;"><em>特惠套餐</em></a></li>
        <li><a href="javascript:;"><em>菜品</em></a></li>
        <li><a href="javascript:;"><em>商家服务</em></a></li>
      </ul>
      <div class="item" id="burst">
        <div class="head"><em>爆点礼包</em><i>猫王卡免单</i></div>
        <div class="main" v-if="bdgift!=''">
          <img :src="bdgift.image" />
          <div class="info">
            <h3>{{bdgift.name}}</h3>
            <div class="name">{{bdgift.name}}</div>
            <div class="price"><i>{{bdgift.amount}}</i><s>{{bdgift.amount}}</s></div>
          </div>
          <div class="buts"><a :href="'item.html?id='+bdgift.id">立即领取</a></div>
        </div>
        <div class="main" v-else>
          <div class="empty">商家未开通爆点权益</div>
        </div>
      </div>
      <div class="item" id="odds">
        <div class="head"><em>特惠套餐</em><i>自用省钱，分享赚钱</i></div>
        <div class="main">
          <ol v-if="gift.length > 0">
            <li v-for="row in gift">
              <a :href="'item.html?id='+row.id">
                <img v-lazy="row.image" />
                <div class="info">
                  <h3>{{row.name}}</h3>
                  <div class="name">{{row.second_name}}</div>
                  <div class="price"><i>{{row.amount}}</i><s>{{row.amount * 1.5}}</s></div>
                </div>
              </a>
            </li>
          </ol>
          <div class="empty" v-else>商家未开通特惠权益</div>
        </div>
      </div>
      <div class="item" id="food">
        <div class="head"><em>菜品</em></div>
        <div class="main">
          <ol>
            <li v-for="item in dish_list"><img v-lazy="item.image"><em>{{item.name}}</em></li>
          </ol>
        </div>
      </div>
      <div class="item" id="serv">
        <div class="head"><em>商家服务</em></div>
        <div class="main">
          <ol>
            <li v-for="item in serv">{{item.name}}</li>
          </ol>
        </div>
      </div>
    </div>

  </center>
</scroller>
</template>

<script>
import {Scroller} from 'vux'
import wx from 'weixin-js-sdk';
import { http,$_GET} from '../../assets/script/com.js'
export default {
  components: {Scroller},
	data(){
		return {
      latitude:0,
      longitude:0,
      distance:0,
      item:{
        mchname:'',
        headimgurl:[]
      },
      dish_list:[{}],
      serv:[],
      bdgift:'',
      gift:[],
      details:''
		};
	},

	created()
	{
    this.onWxConfig();
	},
  mounted(){
    this.onLoad();
  },
	methods:{
    onWxConfig()
    {
      let _self = this;
      http.post({
        uri:'Home/Home/wxJssdk',
        data:{
          url:window.location.href
        },
        callback:function(e)
        {
          wx.config({
            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            appId:e.body.appId, // 必填，公众号的唯一标识
            timestamp:e.body.timestamp , // 必填，生成签名的时间戳
            nonceStr:e.body.nonceStr, // 必填，生成签名的随机串
            signature:e.body.signature,// 必填，签名
            jsApiList: ['getLocation'] // 必填，需要使用的JS接口列表
          });
          wx.ready(function ()
          {
            wx.getLocation({
              type: 'gcj02',
              success: function (res)
              {
                _self.latitude = res.latitude;
                _self.longitude = res.longitude;
              }
            });
          });
        }
      })
    },
    onLoad()
    {
      let _self = this;
      http.post({
        uri:'Merchant/Merchant/merchant_detail',
        data:{
          mchid:$_GET['id'],
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
            _self.$set(_self,'item',e.body.marchant);
            _self.$set(_self,'dish_list',e.body.dish_list);
            _self.$set(_self,'serv',e.body.service_list);
            _self.$set(_self,'gift',e.body.gift);
            _self.$set(_self,'bdgift',e.body.bdgift[0]);
          }
        }
      })
    },
    geoDistance(lat1, lng1, lat2, lng2)
    {
      function rad(d) {
        return d * Math.PI / 180.0;
      }
      let radLat1 = rad(lat1);
      let radLat2 = rad(lat2);
      let a = radLat1 - radLat2;
      let b = rad(lng1) - rad(lng2);
      let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
      s = s * 6378.137;// EARTH_RADIUS;
      s = Math.round(s * 10000) / 1000; //输出为公里
      return s;
    }
  }
}
</script>

<style>
@import "../../assets/style/common.css";
main{ height: 100%; width: 7.5rem; margin: 0 auto; display:flex; flex-direction: column;}
#store{ text-align: left;}
#store .store{ height:0.6rem; padding: 0.2rem 0.3rem 0 0.3rem; background: #FFFFFF; font-size: 0.32rem; line-height: 0.6rem;}
#store .image{ padding: 0.3rem; background: #FFFFFF; height: 2.5rem; overflow: hidden;}
#store .image ul{ height: 2.5rem; width:calc(2.6rem * 6);}
#store .image ul li{ float: left; width: 2.5rem; height: 2.5rem; margin-right: 0.2rem;}
#store .image ul li img{ display: block; width: 2.5rem; height: 2.5rem; border-radius: 0.15rem;}

#store .time{ height:1rem; padding: 0 0.3rem; background: #FFFFFF; display:flex; flex-direction:row; justify-content:center; align-items:center;}
#store .time:before{ font-size: 0.32rem;}
#store .time em{ flex: 1; padding-left: 0.2rem; border-right: 1px solid #E7E7E7; display:flex; flex-direction:column;}
#store .time em:before{ content: '营业时间'; font-size: 0.28rem; height: 0.4rem;}
#store .time em i{ color: #999999;}
#store .time a{ text-align: center; width: 1.5rem;}
#store .time a:before{ font-size: 0.42rem; color: #EA5504;}

#store .address{ height:1rem; padding: 0 0.3rem; border-top: 1px solid #F2F2F2; background: #FFFFFF; display:flex; flex-direction:row; justify-content:center; align-items:center;}
#store .address:before{ font-size: 0.32rem; }
#store .address em{ flex: 1; padding-left: 0.2rem; border-right: 1px solid #E7E7E7; display:flex; flex-direction:column;}
#store .address em u{ font-size: 0.28rem; height: 0.4rem;}
#store .address em i{ color: #999999;}
#store .address a{ text-align: center; width: 1.5rem;  font-family: '宋体';}

#store .menu{ margin-top: 0.3rem;}
#store .menu ul{ height: 0.8rem; padding:0 0.3rem; display:flex; flex-direction: row;  background: #FFFFFF;}
#store .menu ul li{ flex: 1; height: 100%;}
#store .menu ul li a{ height: 0.75rem; line-height: 0.75rem; font-size: 0.28rem; display: block; text-align: center; border-bottom: 0.05rem solid #FFFFFF;}
#store .menu ul li.on a{ border-bottom: 0.05rem solid #EA5504; color: #EA5504;}

#store .menu .item{ margin-bottom: 0.3rem; background: #FFFFFF; padding: 0 0.3rem;}
#store .menu .item .head{ height: 0.7rem; line-height: 0.7rem; padding: 0.2rem 0;}
#store .menu .item .head em{ font-size: 0.3rem; margin-right: 0.4rem;}
#store .menu .item .head i{ color: #999999;}
#store .menu .item .main{ padding-bottom: 0.3rem;}

#store #burst .main{ height: 1.2rem; display:flex;  flex-direction: row; justify-content:center; align-items:center;}
#store #burst .main img{ width: 1.2rem; height: 1.2rem;}
#store #burst .main .info{ height:1.2rem; flex: 1; margin-left: 0.15rem;}
#store #burst .main .info h3{ height: 0.5rem; font-size: 0.28rem; line-height: 0.5rem; overflow: hidden;}
#store #burst .main .info .name{ height: 0.3rem;}
#store #burst .main .info .price{ height: 0.4rem; line-height: 0.4rem;}
#store #burst .main .info .price i{ color: #EA5504; font-size: 0.28rem; margin-right: 0.2rem;}
#store #burst .main .info .price i:before{ content: '￥';}
#store #burst .main .info .price s{ color: #979797;}
#store #burst .main .info .price s:before{ content: '￥';}
#store #burst .main .buts{ width: 1.8rem; text-align: center;}
#store #burst .main .buts a{ display: inline-block; height:0.5rem; width: 1.8rem; background: #EA5504; color: #FFFFFF; font-size:0.26rem; line-height: 0.5rem; border-radius: 0.5rem;}
#store #burst .main .empty{ color: #979797;}

#store #odds .main ol li a{ height: 1.2rem; display:flex;  flex-direction: row; justify-content:center; align-items:center;}
#store #odds .main ol li a img{ width: 1.2rem; height: 1.2rem;}
#store #odds .main ol li a .info{ height:1.2rem; flex: 1; margin-left: 0.15rem;}
#store #odds .main ol li a .info h3{ height: 0.5rem; font-size: 0.28rem; line-height: 0.5rem; overflow: hidden;}
#store #odds .main ol li a .info .name{ height: 0.3rem;}
#store #odds .main ol li a .info .price{ height: 0.4rem; line-height: 0.4rem;}
#store #odds .main ol li a .info .price i{ color: #EA5504; font-size: 0.28rem; margin-right: 0.2rem;}
#store #odds .main ol li a .info .price i:before{ content: '￥';}
#store #odds .main ol li a .info .price s{ color: #979797;}
#store #odds .main ol li a .info .price s:before{ content: '￥';}
#store #odds .main ol li a:after{content: '\e945'; font-family: 'fontello'; font-size: 0.36rem; color: #979797;}
#store #odds .main .empty{ height: 1.2rem; color: #979797; line-height: 1.2rem; text-align: center;}

#store #food .main ol{ height:3rem; width:calc(2.4rem * 6);}
#store #food .main ol li{ float: left; width: 2.4rem; height: 3rem; margin-right: 0.2rem;}
#store #food .main ol li img{ display: block; width: 2.4rem; height: 2.4rem; border-radius: 0.15rem;}
#store #food .main ol li em{ height: 0.6rem; display: block; line-height: 0.6rem;}

#store #serv .main ol:after{content: ''; clear: both; display: block; height: 0.3rem;}
#store #serv .main ol li{ height: 0.6rem; line-height: 0.6rem; text-align: center; width: 3.35rem; margin-bottom:0.2rem; background: #F2F2F2; float: left;}
#store #serv .main ol li:nth-of-type(odd){ margin-right: 0.1rem;}
#store #serv .main ol li:nth-of-type(even){ margin-left: 0.1rem;}

footer{ height:1rem; background: #FFFFFF; display:flex; flex-direction:row;}
footer a{ height: 100%; display:flex; flex-direction:column; justify-content:center; align-items:center;}
footer a:before{ font-size: 0.4rem;}
footer a:nth-of-type(1){ width:1.5rem; color: #7b7b7b;}
footer a:nth-of-type(2){ width:1.5rem; color: #DD5410; background: #ffb93e;}
footer a:nth-of-type(3){ flex: 1; color: #FFFFFF; font-size: 0.32rem; background: #DD5410;}
</style>
