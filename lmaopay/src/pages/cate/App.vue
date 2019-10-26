<template>
<main>
<header><em>附近优惠</em><span>{{address}}</span></header>
<scroller lock-x height="100%" @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="200">
<center id="cate">
  <div class="list">
    <ul>
      <li v-for="item in marchant_list" class="row">
        <a :href="'item.html?id='+item.id">
        <img v-lazy="item.image">
          <div class="info">
            <div class="tit">
              <h3>{{item.name}}</h3>
              <i>{{item.distance}}</i>
            </div>
            <div class="second">{{item.second_name}}</div>
            <div class="buy">
              <div class="price"><s>{{item.amounts}}</s><i>{{item.vipamount}}</i></div>
              <div class="buttom">立即购买</div>
            </div>
          </div>
        </a>
      </li>
    </ul>
  </div>
  <load-more tip="loading" show=false></load-more>
</center>
</scroller>
</main>
</template>

<script>
import {Scroller,AlertModule,LoadMore} from 'vux'
import wx from 'weixin-js-sdk';
import { http,$_GET} from '../../assets/script/com.js'
export default {
  components: {Scroller,AlertModule,LoadMore},
	data(){
		return {
      latitude:0,
      longitude:0,
      address:'',
      page:1,
      onFetching: false,
      marchant_list:[]
		};
	},
  created(){
    this.onLoad();
  },
	mounted ()
	{
		this.$nextTick(() => {
      this.$refs.scrollerBottom.reset({top: 0})
    })
	},
	methods:{
    onLoad()
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
            debug:false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
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
                _self.getPageLoad();
              }
            });
          });
        }
      })
    },
    getPageLoad()
    {
      this.onFetching = true
      let _self = this;
      http.post({
        uri:'Home/Home/loadmore',
        data:{
          latitude:_self.latitude,
          longitude:_self.longitude,
          merchat_cate_id:$_GET['id'],
          page:_self.page
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
            _self.address = e.body.address
            let marchant_list = e.body.marchant_list;
            if(typeof(marchant_list)!='undefined' && marchant_list.length > 0)
            {
              for(var row in marchant_list)
              {
                _self.marchant_list.push(marchant_list[row]);
              }
              _self.$nextTick(() => {
                _self.$refs.scrollerBottom.reset()
              })
              _self.page += 1
            }
          }
          setTimeout(()=>{
            _self.onFetching = false
          },1000)
        }
      })
    },
    onScrollBottom ()
    {
      if (this.onFetching ==false && this.page > 1) {
        this.getPageLoad();
      }
    }
	}
}
</script>

<style>
@import "../../assets/style/common.css";
main{ height: 100%; width: 7.5rem; margin: 0 auto; display:flex; flex-direction: column;}
header{ height:0.3rem; padding:0.25rem 0.3rem; line-height:0.3rem; display:flex; flex-direction:row; background:#FFF}
header em{ height:0.3rem; padding-left:0.1rem; border-left:0.04rem solid #EA5504; font-weight:bold; font-size:0.3rem; flex:1;}
#cate .list{ text-align: left;}
#cate .list ul{ padding:0.3rem;}
#cate .list ul li{ margin-bottom:0.3rem;}
#cate .list ul li.row a{ border-radius:0.15rem; height:100%; display:flex;  flex-direction:column; overflow:hidden;}
#cate .list ul li.row a img{ height:6.9rem; width: 6.9rem;}
#cate .list ul li.row a .info{ flex:1; background:#FFF; padding:0 0.15rem;}
#cate .list ul li.row a .info .tit{ height:0.6rem; line-height:0.6rem; display:flex;  flex-direction:row;}
#cate .list ul li.row a .info .tit h3{ flex:1;}
#cate .list ul li.row a .info .tit i{ font-family:'宋体'}
#cate .list ul li.row a .info .tit i:before{ content:'距离您'; vertical-align:middle; margin-right:0.05rem;}
#cate .list ul li.row a .info .second{ height: 0.4rem; line-height: 0.4rem;}
#cate .list ul li.row a .info .buy{ height: 0.8rem; display:flex; flex-direction:row; align-items:center;}
#cate .list ul li.row a .info .buy .price{ flex: 1; display:flex; flex-direction:row; align-items:center;}
#cate .list ul li.row a .info .buy .price s:before,#index .list ul a .info .buy .price i:before{ content: '￥';}
#cate .list ul li.row a .info .buy .price s{font-size:0.26rem; color: #979797; margin-right: 0.15rem;}
#cate .list ul li.row a .info .buy .price i{font-size:0.36rem; color: #FF0000;}
#cate .list ul li.row a .info .buy .buttom{ height: 0.46rem; line-height: 0.46rem; color: #FFFFFF; background: #FF0000; padding: 0 0.15rem; border-radius: 0.46rem;}
</style>
