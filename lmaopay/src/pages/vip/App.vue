<template>
<scroller lock-x height="100%" :bounce=false ref="scrollerBottom">
<center id="vip">
  <div class="header">

  </div>
  <div class="rights">
    <div class="main">
      <div class="head"></div>
      <ul class="icon">
        <li><img v-lazy="'https://lmaopay.oss-cn-qingdao.aliyuncs.com/res/yTwoLevelList/24.png'"><em>全世界爆点礼包免费领</em></li>
        <li><img v-lazy="'https://lmaopay.oss-cn-qingdao.aliyuncs.com/res/yTwoLevelList/25.png'"><em>自用省钱分享赚钱</em></li>
        <li><img v-lazy="'https://lmaopay.oss-cn-qingdao.aliyuncs.com/res/yTwoLevelList/26.png'"><em>会员线下特惠价格低</em></li>
        <li><img v-lazy="'https://lmaopay.oss-cn-qingdao.aliyuncs.com/res/yTwoLevelList/27.png'"><em>一次支付两次收获</em></li>
      </ul>
    </div>
  </div>
  <div class="paybut" v-if="user.group_id==1"><a href="javascript:;" @click="pay()">限时￥91</a></div>
  <div class="vipone">
    <div class="head"><em>猫王卡权益一</em><i>甄选商品免费领取</i></div>
    <ul>
      <li v-for="item in goods">
        <a :href="'buy.html?id='+item.goods_id">
          <img :src="item.image" />
          <div class="title">{{item.title}}</div>
          <div class="buter">
            <i>{{item.amount}}</i>
            <em>立即领取</em>
          </div>
        </a>
      </li>
    </ul>
  </div>
  <div class="viptwo">
    <div class="head"><em>猫王卡权益二</em><i>懒猫还款红包￥200</i></div>
    <div class="main">
      <img v-lazy="'https://lmaopay.oss-cn-qingdao.aliyuncs.com/res/yTwoLevelList/28.png'" />
    </div>
  </div>
</center>
</scroller>
</template>

<script>
import {Scroller,AlertModule} from 'vux'
import { http,$_GET} from '../../assets/script/com.js'
export default {
  components: {Scroller,AlertModule},
	data(){
		return {
      user:{},
      state:0,
      goods:[{},{}]
		};
	},

	mounted ()
	{
    window.onresize = () => {
        return (() => {
          _self.$refs.scrollerBottom.reset()
        })();
      };
    this.user = http.getLogin();
    this.onLoad();
	},
	methods:{
    onLoad()
    {
      let _self = this;

      http.post({
        uri:'Member/Member/vipshop',
        data:{
          uid:this.user.uid,
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
            _self.state = e.body.state;
            _self.goods = e.body.goods;
            if(_self.goods.goods_id == 1)
            {

            }
          }
        }
      })
    },
    pay()
    {
      let _self = this;

      let user  = http.getLogin();

      if (typeof(user.pid) == 'undefined' || user.pid == 0){
        window.location.href = 'recommend.html'
      }

      http.post({
        uri:'Member/Member/upgrade_pay',
        data:{
          uid:user.uid,
          pay_type:3,
          group_id:5,
          invite_code:user.invite_code
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
            WeixinJSBridge.invoke(
              'getBrandWCPayRequest',
              JSON.parse(e.body.pay_info),
              function(res)
              {
                if(typeof(res.err_code)=="undefined")
                {
                  if(res.err_msg=='get_brand_wcpay_request:ok')
                  {
                    if(localStorage.setItem('userinfo',null))
                    {
                      window.location.href = "vipok.html";
                    }
                  }
                  else
                  {
                    AlertModule.show({
                      title:'提示',
                      content:'支付失败'
                    });
                  }
                }
                else
                {
                   AlertModule.show({
                     title:'提示',
                     content:res.err_code
                   });
                }
              }
            );
          }
        }
      })
    }
  }
}
</script>

<style>
@import "../../assets/style/common.css";
#vip .header{ height:6rem ; background-image: url(https://lmaopay.oss-cn-qingdao.aliyuncs.com/res/yTwoLevelList/21.jpg); background-repeat: no-repeat; background-position: center; background-size:7.5rem;}
#vip .rights{ height: 1.80rem; position: relative; background: #FFFFFF;}
#vip .rights .main{ height:2.4rem; width:6.3rem; display:flex; flex-direction:column; padding: 0.3rem; border-radius:0.15rem; position: absolute; left: 0.3rem; top: -1.5rem; background-image: url(https://lmaopay.oss-cn-qingdao.aliyuncs.com/res/yTwoLevelList/22.png); background-position: center; background-repeat: no-repeat; background-size: 6.9rem;}
#vip .rights .main .head{ height:0.8rem; background-image: url(https://lmaopay.oss-cn-qingdao.aliyuncs.com/res/yTwoLevelList/23.png); background-position:left center; background-repeat: no-repeat; background-size: 2.2rem;}
#vip .rights .main .icon{ flex: 1; display:flex; flex-direction:row;}
#vip .rights .main .icon li{ flex: 1; display:flex; flex-direction:column; justify-content:center; align-items:center;}
#vip .rights .main .icon li img{ width: 0.72rem; height: 0.72rem;}
#vip .rights .main .icon li em{ margin-top: 0.15rem; line-height: 0.3rem; width: 80%;}
#vip .vipone{ background: #FFFFFF; text-align: left;}
#vip .vipone .head{ height: 0.6rem; padding: 0 0.3rem; line-height: 0.6rem; color: #999899;}
#vip .vipone .head em{ font-size: 0.3rem; font-weight: bold; color: #323333; margin-right: 0.3rem;}
#vip .vipone ul{ padding: 0 0.2rem;}
#vip .vipone ul:after{ clear:both; content:''; display:block; height: 0.3rem;}
#vip .vipone ul li{ height: 4.8rem; width: 3.55rem; display: block; float: left; margin-top: 0.3rem;}
#vip .vipone ul li a{ height: 100%; width: 3.35rem; margin: 0 auto; background: #F2F2F2; display: block; border-radius: 0.1rem; overflow: hidden;}
#vip .vipone ul li a img{ height:3.35rem; width: 3.35rem; display: block; overflow: hidden;}
#vip .vipone ul li a .title{ height: 0.7rem; line-height: 0.35rem; overflow: hidden; margin-top: 0.1rem; padding: 0 0.2rem;}
#vip .vipone ul li a .buter{ height: 0.65rem; display:flex; flex-direction:row; align-items:center; padding: 0 0.2rem;}
#vip .vipone ul li a .buter i{ color: #EA5504; font-size: 0.3rem; flex: 1;}
#vip .vipone ul li a .buter i:before{ content:'￥'; vertical-align:middle}
#vip .vipone ul li a .buter em{ width: 1.5rem; height: 0.4rem;line-height: 0.4rem; color: #FFFFFF; background: #EA5504; text-align: center; border-radius: 0.4rem;}

#vip .viptwo{ background: #FFFFFF; text-align: left; padding-top: 0.3rem;}
#vip .viptwo .head{ height: 0.6rem; padding: 0 0.3rem; line-height: 0.6rem; color: #999899;}
#vip .viptwo .head em{ font-size: 0.3rem; font-weight: bold; color: #323333; margin-right: 0.3rem;}
#vip .viptwo .main{ padding: 0.3rem;}
#vip .viptwo .main a{ display: block; height: 2.8rem; overflow: hidden;}
#vip .viptwo .main img{ width: 100%; height: 2.8rem; display: block; border-radius: 0.15rem;}


#vip .paybut{ height:0.7rem; text-align:center; background: #FFFFFF; padding:0.5rem 0;}
#vip .paybut a{ font-size: 0.34rem; display: inline-block; width:2.5rem; height: 0.7rem; line-height:0.7rem; color: #FFFFFF; background: #FF0000; padding: 0 0.15rem; border-radius: 0.35rem;}

</style>
