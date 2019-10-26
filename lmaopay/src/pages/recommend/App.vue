<template>
<scroller lock-x height="100%" :bounce=false ref="scrollerBottom">
<center id="recommend">
  <div class="form">
    <input type="number" v-model="invite_code" placeholder="请填写推荐人邀请码" />
  </div>
  <div class="submit"><a href="javascript:;" @click="onSubmit()">立即支付</a></div>
  <div class="explain">无推荐码，请联系官方客服400-139-2881</div>
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
      invite_code:'',
      user:{}
		};
	},

	mounted ()
	{
    this.user = http.getLogin();
	},
	methods:{
    onSubmit()
    {
      let _self = this;

      if(_self.invite_code == '')
      {
        AlertModule.show({
          title:'提示',
          content:'请填写推荐人邀请码'
        });
        return ;
      }
      http.post({
        uri:'Member/Member/upgrade_pay',
        data:{
          uid:this.user.uid,
          pay_type:3,
          group_id:5,
          invite_code:_self.invite_code
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
                    window.location.href = "vipok.html";
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
    },
  }
}
</script>

<style>
@import "../../assets/style/common.css";
body{ background: #FFFFFF;}
#recommend .form{ height:0.9rem; padding: 0.3rem;}
#recommend .form input{ height: 0.88rem; width:5.88rem; border: 1px solid #F2F2F2; border-radius: 0.45rem; line-height: 0.88rem; padding: 0 0.5rem; font-size: 0.32rem;}
#recommend .submit{height: 0.9rem; padding: 0.3rem;}
#recommend .submit a{ display: block; height:100%; border-radius: 0.45rem; background: #EA5504; color: #FFFFFF; font-size:0.32rem; line-height: 0.9rem;}
#recommend .explain{ padding: 0.3rem;}
</style>
