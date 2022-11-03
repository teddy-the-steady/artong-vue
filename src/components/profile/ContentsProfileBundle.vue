<template>
    <ol class="profile-bundle"> <!--이거 하는 중이었음-->
      <li><ContentsProfile :needUserName="needUserName"></ContentsProfile></li>
      <li><ContentsProfile :needUserName="needUserName"></ContentsProfile></li>
      <li><ContentsProfile :needUserName="needUserName"></ContentsProfile></li>
      <li><ContentsProfile :needUserName="needUserName"></ContentsProfile></li>
      <li><ContentsProfile :needUserName="needUserName"></ContentsProfile></li>
    </ol>
</template>
<script>
    import ContentsProfile from './ContentsProfile.vue';

    export default{
        name: 'ContentsProfileBundle',
        components:{
            ContentsProfile
        },
        data(){
            return{
                needUserName: false,
            }
        }
    }
</script>

<style lang="scss" scopde>
    .profile-bundle{
    display: flex;
    flex-direction: row;
    position: relative;
  }
  ol{ // profile-bundle
    list-style:none;
    padding-left:0px;
    margin-top:0px;
  }
  li{
    float:left;
  }
  ol li:first-child{
    position:relative;
    left:0px;
    z-index: 5;
  }
  ol li:nth-child(2){
    position: relative;
    left: -4px;
    z-index: 4;
  }
  ol li:nth-child(3){
    position:relative;
    left: -8px;
    z-index: 3;
  }
  ol li:nth-child(4){
    position:relative;
    left:-12px;
    z-index: 2;
  }
  ol li:nth-child(5){
    position:relative;
    left:-16px;
    z-index: 1;
  }
</style>