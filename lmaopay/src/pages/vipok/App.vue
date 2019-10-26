<template>
  <!--支付完成-->
  <main>
    <center>
      <div class="pay">
        <img src="https://lmaopay.oss-cn-qingdao.aliyuncs.com/res/yTwoLevelList/30.png" ><br/>
        <em>支付完成</em><br/>
        <span>恭喜你成为猫王卡用户，一卡在手吃遍全球</span>
      </div>
      <hr/>

      <div class="rights_one">
        <em>猫王卡权益一</em>
        <span>甄选商品免费领取</span>
        <ul>
          <li v-for="goods_list in user.order_info.goods_list" >
            <a :href="'buy.html?id='+goods_list.goods_id">
              <img :src="goods_list.image">
              <span>{{goods_list.title}}</span>
              <span>￥{{goods_list.amount}}</span>
              <button>免费领取</button>
            </a>
          </li>
        </ul>
      </div>

      <div class="viptwo">
        <div class="head"><em>猫王卡权益二</em><i>懒猫还款红包￥200</i></div>
        <div class="main" @click="receiveRed">
          <img v-lazy="'https://lmaopay.oss-cn-qingdao.aliyuncs.com/res/yTwoLevelList/28.png'" />
        </div>
      </div>

    </center>

  </main>
</template>

<script>
    import { http,$_GET} from '../../assets/script/com.js'
    import {AlertModule} from 'vux'
    export default {
        components: {AlertModule},
        data() {
            return {
                user: {},
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
                        }
                    }
                })
            },
            //点击领取红包
            receiveRed(){
                window.location.href = 'yReceiveRed.html';
            },

        }
    }
</script>

<style>
@import "../../assets/style/common.css";
main{overflow-y: auto; -webkit-overflow-scrolling: touch; background-color: white;}
center .pay {margin-top: .3rem;}
center .pay img {width: 2rem; }
center .pay em {font-size: .36rem; font-weight: bold; color: #000000;}
center .pay span {font-size: .24rem; font-weight: 500; color: #000000; display: inline-block; margin-top: .1rem;}
center hr {border: 0; height: .2rem; background-color: #F2F2F2; margin-top: .2rem;}

center .rights_one {text-align: left; width: 6.9rem; margin-top: .3rem;}
center .rights_one em {font-size: .3rem; font-weight: bold; color: #323333;}
center .rights_one span {display: inline-block; margin-left: .3rem; font-size: .24rem; font-weight: bold; color: #999899;}
center .rights_one ul {margin: .2rem 0;}
center .rights_one ul li {width: 3.36rem; height: 4.8rem; background-color: #F2F2F2; margin-top: .2rem; display: inline-block; margin-left: .04rem;  position: relative;}
center .rights_one ul li img {width: 3.36rem; height: 3.36rem;}
center .rights_one ul li span:nth-of-type(1) {font-size: .24rem; font-weight: 500; color: #333333; display: inline-block; margin-top: .05rem;width: 3.08rem; margin-left: 0.1rem;}
center .rights_one ul li span:nth-of-type(2) {font-size: .3rem; font-weight: bold; color: #EA5504; display: inline-block; top: 4.2rem; left: -.25rem; position: absolute;}
center .rights_one ul li button {width: 1.5rem; height: .36rem; border-radius: .16rem; display: inline-block; color: white; position: absolute; top: 4.23rem; left: 1.7rem; background-color: #EA5504; border: 0; line-height: .36rem;}

 .viptwo{ background: #FFFFFF; text-align: left; padding-top: 0.3rem;}
 .viptwo .head{ height: 0.6rem; padding: 0 0.3rem; line-height: 0.6rem; color: #999899;}
 .viptwo .head em{ font-size: 0.3rem; font-weight: bold; color: #323333; margin-right: 0.3rem;}
 .viptwo .main{ padding: 0.3rem;}
 .viptwo .main a{ display: block; height: 2.8rem; overflow: hidden;}
 .viptwo .main img{ width: 100%; height: 2.8rem; display: block; border-radius: 0.15rem;}

</style>
