<template>
<scroller lock-x height="100%" :bounce=false ref="scrollerBottom">
  <center id="usecode">
    <div class="header">
      <a href="javascript:;">
        <img v-lazy="item.gift_info.image" />
        <div class="info">
          <h3>{{item.gift_info.name}}</h3>
          <em>{{item.time_lon}}</em>
          <i>{{item.amount}}</i>
        </div>
      </a>
    </div>
    <div class="qrcode">
      <div class="image">
        <img v-lazy="codeurl" />
      </div>
    </div>
    <div class="mhinfo">
      <div class="info">
        <ul>
          <li>{{store.mchname}}</li>
          <li>{{store.address}}</li>
        </ul>
        <a v-if="store.telephone!=''" :href="'tel:'+store.telephone" class="icon-phone"></a>
        <a v-else href="javascript:;" class="icon-phone"></a>
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
      codeurl:'',
      user:{},
      item:{
        image:'',
      },
      store:{}
		};
	},
  created(){
    this.user = http.getLogin();
  },
	mounted ()
	{
    this.onLoad();
    this.codeurl = http.get({uri:'Member/Coupon/gift_qrcode',data:{id:$_GET['id']}},true);
	},
	methods:{
    onLoad()
    {
      let _self = this;
      http.post({
        uri:'Member/Coupon/gift_detail',
        data:{
          uid:this.user.uid,
          id:$_GET['id'],
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
            _self.item = e.body.gift_info;
            _self.store = e.body.gift_info.marchant_info;
            //_self.$set(_self,'store',e.body.marchant_info);
          }
        }
      })
    }
  }
}
</script>

<style>
@import "../../assets/style/common.css";
#usecode .header{ height:1.4rem; padding: 0.3rem; background: #FFFFFF; }
#usecode .header a{display:flex; flex-direction:row; justify-content:center; align-items:center; height: 100%;}
#usecode .header a:after{content: '\e945'; font-family: 'fontello'; font-size: 0.36rem; color: #979797;}
#usecode .header a img{ height: 1.4rem; width: 1.4rem; border-radius: 0.1rem;}
#usecode .header a .info{ flex: 1; margin-left:0.15rem; display:flex; flex-direction:column; text-align: left; margin-right: 0.2rem;}
#usecode .header a .info h3{ height: 0.6rem; line-height: 0.3rem; font-size: 0.26rem; font-weight: normal;}
#usecode .header a .info em{ height: 0.4rem; line-height: 0.4rem; color: #; font-size: 0.30rem; display:flex; flex-direction:row; align-items:center;}
#usecode .header a .info em:before{ content: '有效期：'; color: #979797; font-size: 0.26rem;}
#usecode .header a .info i{ height: 0.4rem; line-height: 0.4rem; color:#EA5504; font-size: 0.30rem; display:flex; flex-direction:row; align-items:center;}
#usecode .header a .info i:before{ content: '价值：'; color: #979797; font-size: 0.26rem;}

#usecode .qrcode{ margin-top: 0.3rem; background: #FFFFFF; padding: 0.3rem; text-align: left;}
#usecode .qrcode:before{ content: '商家扫码'; display: block; height: 0.5rem; font-size:0.3rem; font-weight: bold;}
#usecode .qrcode .image{ width:4.2rem; height: 4.2rem; padding: 0.3rem; margin: 0 auto;}
#usecode .qrcode .image img{ width: 4.2rem; height: 4.2rem; display: block;}

#usecode .mhinfo{ margin-top: 0.3rem; background: #FFFFFF; padding: 0.3rem; text-align: left;}
#usecode .mhinfo:before{ content: '商家信息'; display: block; height: 0.5rem; font-size:0.3rem; font-weight: bold;}
#usecode .mhinfo .info{display:flex; flex-direction:row; align-items:center; padding: 0.3rem 0;}
#usecode .mhinfo .info ul{ flex: 1;}
#usecode .mhinfo .info ul li{ height: 0.4rem; line-height: 0.4rem; font-size: 0.26rem;}

#usecode .mhinfo .info a{ width: 0.8rem; height: 0.8rem; line-height: 0.8rem; text-align: center; font-size: 0.4rem; color: #EA5504;}
</style>
