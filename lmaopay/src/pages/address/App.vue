<template>
<main>
<scroller lock-x height="100%" :bounce=false ref="scrollerBottom">
<center id="address">
  <div class="form">
    <group title="收件人姓名">
      <x-input v-model="form.name" placeholder="请输入收件人姓名"></x-input>
    </group>
    <group title="收件人电话">
      <x-input v-model="form.telephone" placeholder="请输入收件人电话"></x-input>
    </group>
    <group title="所在地区">
      <x-address title="" v-model="form.area" :list="addressData" placeholder="请选择地址" ></x-address>
    </group>
    <group title="详情地址">
      <x-input v-model="form.address" placeholder="请选择地址"></x-input>
    </group>
  </div>
</center>
</scroller>
<footer @click="submit">提交保存</footer>
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
          form:{
            name:'',
            area:[],
            telephone:'',
            address:''
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
  },
  methods:{
    submit()
    {
      var _self = this;
      http.post({
        uri:'Member/Address/add_address',
        data:{
            uid: this.user.uid,
            fullname: _self.form.name,
            telephone: _self.form.telephone,
            address: _self.form.address,
            area_id: _self.form.area[2],
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
                  content:"保存成功！"
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
#address{ text-align: left; flex: 1;}
#address .form{ margin-top: 0.3rem;}
footer{ height: 1rem; background: #ED5736; text-align: center; line-height: 1rem; color: #FFFFFF; font-size: 0.32rem;}
</style>
