<template>
<main>
  <scroller lock-x height="100%" :bounce=false @on-scroll-bottom="onScrollBottom" ref="scrollerBottom" :scroll-bottom-offst="200">
  <center id="index">
    <div class="banner">
      <swiper auto loop :show-desc-mask="false" :show-dots="false" :aspect-ratio="280/690">
        <swiper-item v-for="(item, index) in banner_list" :key="index">
          <a v-if="item.url!=''" :href="item.url" ><img v-lazy="item.image_url"></a>
          <img v-else v-lazy="item.image_url">
        </swiper-item>
     </swiper>
    </div>
    <div class="cate">
      <ul>
      	<li v-for="item in cate_list"><a :href="'cate.html?id='+item.mch_cate_id"><img v-lazy="item.cate_image"><em>{{item.catename}}</em></a></li>
      </ul>
    </div>
    <div class="homead">
      <a v-for="item in advert_list" :href="item.url"><img v-lazy="item.image_url"></a>
    </div>
    <div class="headlines">
      <ul>
      	<li v-for="item in notice_list"><a :href="item.url"><em>公告</em><span>{{item.abstract}}</span></a></li>
      </ul>
    </div>
    <div class="list">
      <div class="head"><em>附近优惠</em><span>{{address}}</span></div>
      <ul>
      	<li v-for="item in marchant_list">
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
  <vfooter></vfooter>
</main>
</template>

<script>
import {Swiper,SwiperItem,Scroller,LoadMore,AlertModule} from 'vux'
import wx from 'weixin-js-sdk';
import { http,$_GET} from '../../assets/script/com.js'
import vfooter from './vfooter.vue';
export default {
  components: {Swiper,SwiperItem,Scroller,vfooter,LoadMore,AlertModule},
	data(){
		return {
      latitude:0,
      longitude:0,
      address:'',
      page:1,
      onFetching: false,
      bottomCount: 10,
	  banner_list:[{}],
      cate_list:[{},{},{},{},{},{},{},{}],
      advert_list:[{},{}],
      notice_list:[{}],
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
    onLoadwx()
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
                _self.getPageLoad();
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
        uri:'Home/Home/index',
        data:{
          uid:http.getUid(),
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
            _self.$set(_self,'banner_list',e.body.banner_list);
            _self.$set(_self,'cate_list',e.body.cate_list);
            _self.$set(_self,'advert_list',e.body.advert_list);
            _self.$set(_self,'notice_list',e.body.notice_list);
            _self.onLoadwx();
          }
        }
      })
    },
      getPageLoad()
    {
      this.onFetching = true;
      let _self = this;
      http.post({
        uri:'Home/Home/loadmore',
        data:{
          latitude:_self.latitude,
          longitude:_self.longitude,
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
            let marchant_list = e.body.marchant_list;
            _self.address = e.body.address
            if(marchant_list.length > 0)
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
      if (this.onFetching == false && this.page > 1) {
        this.getPageLoad();
      }
    }
	}
}
</script>

<style>
#index{ width: 100%; text-align:left;}
#index .banner{ padding:0.3rem; height:2.8rem; overflow:hidden; background:#FFF}
#index .banner a{ height:2.8rem; display: block; overflow: hidden;}
#index .banner img{ width: 6.9rem; height: 2.8rem; display: block;}

#index .cate{ width:7.2rem; overflow:hidden; padding:0.15rem; background:#FFF}
#index .cate ul li { width:1.8rem; height:1.5rem; float:left;}
#index .cate ul li a{ display:flex; height:100%; flex-direction:column; justify-content:center; align-items:center;}
#index .cate ul li a img{ width:0.8rem; height:0.8rem;}
#index .cate ul li a em{ margin-top:0.1rem}
#index .cate ul:after{ clear:both; content:''; display:block;}

#index .homead{ width:7.1rem; padding:0 0.20rem; height:3.35rem; background:#FFF;}
#index .homead a{ height:3.35rem; width:3.35rem; float:left; margin:0 0.1rem}
#index .homead img{ height:100%; height: 100%;}

#index .headlines{ height:0.4rem; padding:0.2rem 0.3rem; background:#FFF; display:flex; flex-direction:row;}
#index .headlines:before{ content:'懒猫头条'; vertical-align:middle}
#index .headlines ul{ margin-left:0.1rem; height:0.4rem; flex:1;}
#index .headlines a{vertical-align:middle}
#index .headlines a em{ display:inline-block; padding:0.05rem; background:#E8390D; color:#fff; border-radius:0.1rem; margin-right:0.1rem;}

#index .list{ margin-top:0.3rem}
#index .list .head{ height:0.3rem; padding:0.25rem 0.3rem; line-height:0.3rem; display:flex; flex-direction:row; background:#FFF}
#index .list .head em{ height:0.3rem; padding-left:0.1rem; border-left:0.04rem solid #EA5504; font-weight:bold; font-size:0.3rem; flex:1;}
#index .list ul{ padding:0.3rem; }
#index .list ul li{ margin-bottom:0.3rem;}
#index .list ul a{ border-radius:0.15rem; height:100%; display:flex;  flex-direction:column; overflow:hidden;}
#index .list ul a img{ height:6.9rem; width: 6.9rem;}
#index .list ul a .info{ flex:1; background:#FFF; padding:0 0.15rem;}
#index .list ul a .info .tit{ height:0.6rem; line-height:0.6rem; display:flex;  flex-direction:row;}
#index .list ul a .info .tit h3{ flex:1;}
#index .list ul a .info .tit i{ font-family:'宋体'}
#index .list ul a .info .tit i:before{ content:'距离您'; vertical-align:middle; margin-right:0.05rem;}
#index .list ul a .info .second{ height: 0.4rem; line-height: 0.4rem;}
#index .list ul a .info .buy{ height: 0.8rem; display:flex; flex-direction:row; align-items:center;}
#index .list ul a .info .buy .price{ flex: 1; display:flex; flex-direction:row; align-items:center;}
#index .list ul a .info .buy .price s:before,#index .list ul a .info .buy .price i:before{ content: '￥';}
#index .list ul a .info .buy .price s{font-size:0.26rem; color: #979797; margin-right: 0.15rem;}
#index .list ul a .info .buy .price i{font-size:0.36rem; color: #FF0000;}
#index .list ul a .info .buy .buttom{ height: 0.46rem; line-height: 0.46rem; color: #FFFFFF; background: #FF0000; padding: 0 0.15rem; border-radius: 0.46rem;}
</style>
