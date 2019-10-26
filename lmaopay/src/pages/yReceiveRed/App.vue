<template>
  <!--领取还款红包-->
  <main>
    <center>
      <div class="yrece">
        <input type="text" placeholder="请输入领取的手机号" ref="mobile"><br/>
        <button @click="receiveRed()">立即领取</button>
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
        },
        methods: {

            receiveRed()
            {
                var _self = this;
                http.post({
                    uri:'Award/receive_redpacket',
                    data:{
                        mobile: _self.$refs.mobile.value,
                        uid: this.user.uid,
                        money: 200,
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
                                content:"领取成功"
                            });
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
  center .yrece {margin-top: .3rem;}
  center .yrece input {width: 6.4rem; height: .9rem; color: #999999; border: .01rem solid #F2F2F2; border-radius: .45rem;font-size: .28rem; font-weight: 500; padding-left: .5rem;}
  center .yrece button {width: 6.9rem; height: .9rem; border-radius: .45rem; background-color: #EA5504; font-size: .32rem; font-weight: bold; color: white; margin-top: .2rem; border: 0;}
</style>
