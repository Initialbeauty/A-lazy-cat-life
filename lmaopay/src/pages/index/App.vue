<template>
<transition name="slide">
 <router-view/>
</transition>
</template>

<script>
</script>

<style>
@import "../../assets/style/common.css";
main{ height: 100%; width: 7.5rem; margin: 0 auto; display:flex; flex-direction: column;}
center{ flex: 1;}
footer{ height: 0.98rem; background: #FFFFFF; display:flex; flex-direction: row;}
footer a{ flex: 1; text-align: center; display:flex; flex-direction: column; justify-content:center; align-items:center;}
footer a:before{ content: ''; width:0.48rem; height:0.48rem; background-position: center center; background-size: 0.48rem; background-repeat: no-repeat;}
footer a:nth-of-type(1):before{ background-image: url(https://lmaopay.oss-cn-qingdao.aliyuncs.com/res/yTwoLevelList/9.png);}
footer a:nth-of-type(2):before{ background-image: url(https://lmaopay.oss-cn-qingdao.aliyuncs.com/res/yTwoLevelList/10.png);}
footer a:nth-of-type(3):before{ background-image: url(https://lmaopay.oss-cn-qingdao.aliyuncs.com/res/yTwoLevelList/11.png);}
footer a:nth-of-type(1).on:before{ background-image: url(https://lmaopay.oss-cn-qingdao.aliyuncs.com/res/yTwoLevelList/9.png);}
footer a:nth-of-type(2).on:before{ background-image: url(https://lmaopay.oss-cn-qingdao.aliyuncs.com/res/yTwoLevelList/9.png);}
footer a:nth-of-type(3).on:before{ background-image: url(https://lmaopay.oss-cn-qingdao.aliyuncs.com/res/yTwoLevelList/9.png);}
</style>
