<template>
<main>
<scroller lock-x height="100%" :bounce=false ref="scrollerBottom">
<center id="buy">
  <div class="goods">
    <a href="javascript:;">
      <img v-lazy="goods_list.image" />
      <ul>
        <li>{{goods_list.title}}</li>
        <li>{{goods_list.name}}</li>
        <li><i>{{goods_list.amount}}</i></li>
      </ul>
    </a>
  </div>
  <div class="form">
    <group title="收件人姓名">
      <x-input v-model="form.fullname" placeholder="请填写收件人姓名"></x-input>
    </group>
    <group title="收件人电话">
      <x-input v-model="form.telephone" placeholder="请填写收件人电话"></x-input>
    </group>
    <group title="所在地区">
      <x-address title="" v-model="form.area"  :list="addressData" placeholder="请选择地址" ></x-address>
    </group>
    <group title="详情地址">
      <x-input v-model="form.address" placeholder="请选择地址"></x-input>
    </group>
  </div>
</center>
</scroller>
<footer><span><i>0.00</i></span><em @click="receive">免费领取</em></footer>
</main>
</template>

<script>
import { http,$_GET} from '../../assets/script/com.js'
import {AlertModule,Scroller,Group,XAddress,XInput,ChinaAddressV4Data} from 'vux'
export default {
  components:{AlertModule,Scroller,Group,XAddress,XInput},
  data() {
      return {
          user:{},
          goods_list:{},
          form:{
            fullname:'',
            area:[],
            telephone:'',
            address:'',
            id:'',
          },
          addressData:ChinaAddressV4Data,
      };
  },
  created(){
      this.user = http.getLogin();
  },
  mounted()
  {
    window.onresize = () => {
      _self.$refs.scrollerBottom.reset();
    };
    this.onLoad();
  },
  methods:{
      //获取商品详情
      onLoad()
      {
          var _self = this;
          http.post({
              uri:'Shop/Order/confirm_order',
              data:{
                  goods_id: $_GET['id'],//11
                  uid: this.user.uid,
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
                      _self.$set(_self,'goods_list',e.body.goods_list);
                      _self.$set(_self,'form',e.body.address_info);

                      // _self.form.area = [e.body.address_info.province_id, e.body.address_info.city_id, e.body.address_info.area_id];
                      // _self.form.address = e.body.address_info.province_name + e.body.address_info.area_name + e.body.address_info.address;


                  }
              }
          })
      },

      //免费领取
      receive ()
      {
          var _self = this;
          http.post({
              uri:'Shop/Order/sub_order',
              data:{
                  uid: this.user.uid,
                  address_id: this.form.id,
                  goods_id: $_GET['id'],
                  fullname: this.form.fullname,
                  telephone: this.form.telephone,
                  area_id: this.form.area[2],
                  address : this.form.address,
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
                      AlertModule.show({
                          title:'提示',
                          content:"领取成功！"
                      });
                  }
              }
          })
      },

    //选择地区
    onShadowChange (ids, names) {
        console.log(ids)
    },
    logHide (str) {
        console.log('on-hide', str)
    },
    logShow (str) {
        console.log('on-show')
    }

  }
}
</script>

<style>
@import "../../assets/style/common.css";
main{ height: 100%; display:flex; flex-direction: column;}
#buy{ text-align: left; flex: 1;}
#buy .goods{ }
#buy .goods a{height:1.8rem; background: #FFFFFF; display:flex; flex-direction:row; align-items:center; padding: 0.3rem;}
#buy .goods a img{ width: 1.8rem; height: 1.8rem;}
#buy .goods a ul{ height: 1.8rem; margin-left: 0.1rem; flex: 1; display:flex; flex-direction: column;}
#buy .goods a ul li:nth-of-type(1){ height: 0.6rem; line-height: 0.3rem; font-size: 0.28rem;}
#buy .goods a ul li:nth-of-type(2){ height: 0.5rem; line-height: 0.5rem; margin-top: 0.2rem;}
#buy .goods a ul li:nth-of-type(3){ height: 0.5rem; line-height: 0.5rem;}
#buy .goods a ul li:nth-of-type(3) i{font-size:0.36rem; color:#ED5736;}
#buy .goods a ul li:nth-of-type(3) i:before{ content: '￥';}
#buy .goods:after{ content: ''; height: 0.16rem; display: block; clear: both; background: url(https://lmaopay.oss-cn-qingdao.aliyuncs.com/res/yTwoLevelList/94.png) center center no-repeat; background-size: 7.5rem;}
#buy .goods img{ height: 1.8rem;}
#buy .form{ margin-top: 0.3rem;}
footer{ height: 1rem; background: #FFFFFF; display:flex; flex-direction:row;}
footer span{ height: 1rem; flex: 1; display:flex; flex-direction:row; justify-content:center; align-items:center; font-size: 0.26rem;}
footer span:before{ content: '需支付：'; font-size: 0.24rem; vertical-align: middle; margin-top: -0.04rem;}
footer span i{font-size: 0.26rem; vertical-align: middle; padding-top: 0.02rem;}
footer em{ height: 1rem; width:2.5rem; line-height: 1rem; text-align: center; font-size: 0.26rem; color: #FFFFFF; background:#ED5736;}
</style>
