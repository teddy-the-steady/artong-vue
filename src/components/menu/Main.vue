<template>
  <div class="info">
    <div class="container0">
      <div class="container1">
        <div class="intro-title">
          Open
          Art NFT
          Marketplace
        </div>
        <div class="intro-content">
          Lorem ipsum dolor sit amet, consectetur Arcu fames nisi malesuada vitae accumsan egestas. Quis sed pharetra lacus sed malesuada dui augue egestas. Arcu nisl egestas massa morbi fringilla facilisis eget. Eleifend tempus in ultricies suspendisse egestas.Lorem ipsum dolor sit amet,     
        </div>
        <button class="start-btn">Start contributing</button>
      </div>
      <div class="container1-2">
        <img class="category-img" src="../../assets/icons/category.svg" width="67px" height="22px"/>
        <div class="nft-name">NFT Name</div>
        <div class="nft-name-img"></div>
        <div class="container1-2-bottom">
          <div class="container1-2-bottom-left">
            <div class="container1-2-bottom-title">Collection</div>
            <div class="container1-2-bottom-content">
              <div class="container1-2-bottom-left-content-img"></div>
              <div class="container1-2-bottom-content-name">Collection Name</div>
            </div>
          </div>
          <div class="container1-2-bottom-right">
            <div class="container1-2-bottom-title">Created by</div>
            <div class="container1-2-bottom-content">
              <div class="container1-2-bottom-right-content-img"></div>
              <div class="container1-2-bottom-content-name">@Nickname</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- show your creativity -->
    <div class="container2">
      <div class="title">
        Show your Creativity
      </div>
     
      <div class="row">
        <!-- Wallet connection -->
        <div class="container2-component">
          <img class="intro-img" src="../../assets/icons/wallet-passes-app.svg">
          <div class="subtitle">
            Wallet connection
          </div>
          <div class="content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Arcu fames nisi malesuada vitae accumsan egestas. Quis sed pharetra lacus sed malesuada dui augue egestas. Arcu nisl egestas massa morbi fringilla facilisis eget. Eleifend tempus in ultricies suspendisse egestas.
          </div>
        </div>
        <!-- Create your collection -->
        <div class="container2-component">
          <img class="intro-img" src="../../assets/icons/100-add-folder.svg">
          <div class="subtitle">
            Create your project
          </div>
          <div class="content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Arcu fames nisi malesuada vitae accumsan egestas. Quis sed pharetra lacus sed malesuada dui augue egestas. Arcu nisl egestas massa morbi fringilla facilisis eget. Eleifend tempus in ultricies suspendisse egestas.
          </div>
        </div>
        <!-- Add you NFTs -->
        <div class="container2-component">
          <img class="intro-img" src="../../assets/icons/fine-arts1.svg">
          <div class="subtitle">
            Add you NFTs
          </div>
          <div class="content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Arcu fames nisi malesuada vitae accumsan egestas. Quis sed pharetra lacus sed malesuada dui augue egestas. Arcu nisl egestas massa morbi fringilla facilisis eget. Eleifend tempus in ultricies suspendisse egestas.
          </div>
        </div>
        <!-- Share the collection -->
        <div class="container2-component">
          <img class="intro-img" src="../../assets/icons/102-blockchain.svg">
          <div class="subtitle">
            Share the collection
          </div>
          <div class="content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Arcu fames nisi malesuada vitae accumsan egestas. Quis sed pharetra lacus sed malesuada dui augue egestas. Arcu nisl egestas massa morbi fringilla facilisis eget. Eleifend tempus in ultricies suspendisse egestas.
          </div>
        </div>
      </div>
      
 
    </div> <!--this is the end of container2-->
    <div class="container3">
      <div class="button-block">
        <img class="button-block-img" src="../../assets/icons/folder-plus.svg" >
        <div class="button-block-title">
          Create new collection
        </div>
        <div class="button-block-description">
          Create Your Own NFT Collection
        </div>
      </div>
      <div class="button-block">
        <img class="button-block-img" src="../../assets/icons/plus-circle.svg">
        <div class="button-block-title">
          Create new collection
        </div>
        <div class="button-block-description">
          Create Your Own NFT Collection
        </div>
      </div>
    </div> <!--end of container3-->
    <div class="container4">
      <div class="top-container">      
        <div class="curated-collections">Curated Collections</div>
        <div class="url" href="">View more</div>
      </div>
      <CuratedCollection></CuratedCollection>
    </div> <!--end of container4-->
    
    <BuyAndSell></BuyAndSell>
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
import ProjectPageProfile_small from '../profile/ProjectPageProfile_small.vue'
import CuratedCollection from '../CollectionCard/CuratedCollection.vue'
import BuyAndSell from '../CollectionCard/BuyAndSell.vue'

export default {
  name: 'Main',
  mixins: [headerActivate],
  components:{
    ProjectPageProfile_small,
    CuratedCollection,
    BuyAndSell
  },
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/variables';

  //@media (max-width:1080px)
    // container0 빈 div
  .container1{
    display: flex;
    flex-direction: column;

    margin-left:16px;
    margin-right:16px;
    margin-top: 48px;
    row-gap: 48px;
  }
  .intro-title{
    width: 295px;
    height: 216px;

    font-family: 'Mustica Pro';
    font-style: $item-font-style;
    font-weight: 600;
    font-size: 52px;
    line-height: 72px;
    text-transform: capitalize;

    color: $artong-black;

    text-align:left;    
  }
  .intro-content{
    width: 91.1%;
    //height: 133px;

    font-family: $item-font;
    font-style: $item-font-style;
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;

    color: #4D4D4D; //
    align-self:stretch;

    text-align:left;
  }
  .start-btn{
    padding: 15px 24px 16px;
    width: 161px;
    height: 48px;

    background: $artong-black;
    border-radius: 5px;
    text-transform: none;
    margin-bottom:48px;
  }
  .container1-2{
    display:none;
  }
  //show your creativity
  .container2{
    display: flex;
    flex-direction: column;
    margin-top: 48px;
  }

  .title{
    width: 308px;
    height: 44px;

    font-family: 'Mustica Pro';
    font-style: $item-font-style;
    font-weight: 600;
    font-size: 32px;
    line-height: 44px;
    margin: auto;
    margin-bottom: 48px;

    color: $artong-black;
  }
  .intro-img{
    width: 32px;
    height: 32px;
    margin: auto;
    margin-bottom:16px;
  }
  .subtitle{
    width: 185px;
    height: 24px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 600;
    font-size: 20px;
    line-height: 24px;

    color: $artong-black;

    margin: auto;
    margin-bottom: 16px;
  }
  .content{
    width: 91.1%;
    max-width: 432px;
    //height: 168px;

    font-family: 'Pretendard';
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;
    
    text-align: center;

    color: #4D4D4D;

    margin:auto;
    margin-bottom:40px;
  }
  .container3{
    display: flex;
    flex-direction:column;
    row-gap: 40px;
    margin-top: 48px;
    margin-bottom: 48px;
  }
  .button-block{
    width: 91.1%;
    height: 160px;

    background: $artong-white;
    border: 1px solid $profile-border-gray;
    box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.14);
    border-radius: 14px;

    margin:auto;

    // 격자
    background-image: linear-gradient(90deg, rgba(242,46,62,0.1) 1px, transparent 1px), linear-gradient(0deg, rgba(242,46,62,0.1) 1px, transparent 1px);
    background-size: 32px 32px;
  }

  .button-block-img{
    width: 24px;
    height: 24px;

    margin: auto;
    margin-top: 25px;
  }
  .button-block-title{
    width: 181px;
    height: 22px;

    font-family: $item-font;
    font-style: $item-font-style;
    font-weight: 600;
    font-size: 18px;
    line-height: 22px;

    color: $artong-black;

    margin:auto;
    margin-top: 10.4px;
    margin-bottom: 8px;
    
  }
  .button-block-description{
    width: 248px;
    height: 48px; 

    font-family: $item-font;
    font-style: $item-font-style;
    font-weight: 400;
    font-size: 16px;
    line-height: 150%;

    color: #4D4D4D;

    margin:auto;
    margin-bottom: 25px;
  }

  // width over 1080px
  @media(min-width: 1080px)and(max-width:1920px){
    .container0{
      display: flex;
      flex-direction: row;
      
      margin-top: 96px;
      // 중앙정렬..??
      margin-left: 11.1%;
      margin-right: 11.1%;
    }
    .container1{
    flex-basis: 420px;
  }

  .container1-2{
    display: flex;
    flex-direction: column;
    flex-basis: 420px;
    gap: 10px;
    //
    height: 553px;
  }
  .nft-name{
    font-family: $item-font;
    font-style: $item-font-style;
    font-weight: 700;
    font-size: 24px;
    text-align: left;

    color: $artong-black;

    margin-bottom: 6px;
  }
  .nft-name-img{
    width: 400px;
    height: 400px;
    
    background-color:$artong-black;

    border-radius: 14px;

    margin-bottom: 6px;
  }
  .container1-2-bottom{
    display:flex;
    flex-direction:row;

  }
  .container1-2-bottom-left{
    display: flex;
    flex-direction: column;
    //gap: 8px;
    flex-basis: 200px;
  }  
  .conatiner1-2-bottom-right{
    display: flex;
    flex-direction: column;
    //gap: 8px;    
    flex-basis: 200px;
  }
  .container1-2-bottom-title{
    font-family: $item-font;
    font-style: $item-font-style;
    font-weight: 600;
    font-size: 18px;
    
    margin-bottom:8px;
    text-align: left;

    color: $artong-black;
  }/////////여기까지 _variable.scss 파일이랑 연결했음
  .container1-2-bottom-content{
    display: flex;
    flex-direction: row;
    gap:8px;
  }
  .container1-2-bottom-left-content-img{
    width: 32px;
    height: 32px;
    border-radius: 4px;

    background-color: $artong-black;
  }
  .container1-2-bottom-right-content-img{
    width: 32px;
    height: 32px;
    background-color: $artong-black;
    border-radius: 999px;
  }
  .container1-2-bottom-content-name{
    font-family: $item-font;
    font-style: $item-font-style;
    font-weight: 500;
    font-size: 14px;
    text-align:left;
    margin-top:auto;
    margin-bottom:auto;
    color: $artong-black;
  }
  //show your creativity
  .container2{
    margin-top: 192px;
  }
  .row{
    display:flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 80px;

    width: 560px;
    height: 688px;// 필요없을수도

    margin-left:auto;
    margin-right:auto;
  }
  .container2-component{
    display:flex;
    flex-direction: column;
    gap: 16px;
    width: 240px;
  }
  .title{
    margin-bottom: 96px;
  }
  .intro-img{
    margin-bottom:0px;
  }
  .subtitle{
    margin-bottom:0px;
  }
  .content{
    margin-bottom:0px;
  }
  .container3{
    display: flex;
    flex-direction:row;
    column-gap: 40px;
    margin-top: 96px;
    margin-bottom: 96px;
    width: 696px;
    margin-left:auto;
    margin-right:auto;
  }
  .button-block{
    width: 328px;
  }
  }
  @media (min-width:1920px){
    .container0{
      display: flex;
      flex-direction: row;
      
      margin-top: 96px;
      // 중앙정렬..??
      margin-left: auto;
      margin-right: auto;
    }
    .container1{
    flex-basis: 420px;
  }
  .container1-2{
    display: flex;
    flex-direction: column;
    flex-basis: 420px;
    gap: 10px;
    //
    height: 553px;
  }
  .nft-name{
    font-family: $item-font;
    font-style: $item-font-style;
    font-weight: 700;
    font-size: 24px;
    text-align: left;

    color: $artong-black;

    margin-bottom: 6px;
  }
  .nft-name-img{
    width: 400px;
    height: 400px;
    
    background-color:$artong-black;

    border-radius: 14px;

    margin-bottom: 6px;
  }
  .container1-2-bottom{
    display:flex;
    flex-direction:row;

  }
  .container1-2-bottom-left{
    display: flex;
    flex-direction: column;
    //gap: 8px;
    flex-basis: 200px;
  }  
  .conatiner1-2-bottom-right{
    display: flex;
    flex-direction: column;
    //gap: 8px;    
    flex-basis: 200px;
  }
  .container1-2-bottom-title{
    font-family: $item-font;
    font-style: $item-font-style;
    font-weight: 600;
    font-size: 18px;
    
    margin-bottom:8px;
    text-align: left;

    color: $artong-black;
  }
  .container1-2-bottom-content{
    display: flex;
    flex-direction: row;
    gap:8px;
  }
  .container1-2-bottom-left-content-img{
    width: 32px;
    height: 32px;
    border-radius: 4px;

    background-color: $artong-black;
  }
  .container1-2-bottom-right-content-img{
    width: 32px;
    height: 32px;
    background-color: $artong-black;
    border-radius: 999px;
  }
  .container1-2-bottom-content-name{
    font-family: $item-font;
    font-style: $item-font-style;
    font-weight: 500;
    font-size: 14px;
    text-align:left;
    margin-top:auto;
    margin-bottom:auto;
    color: $artong-black;
  }
  //show your creativity
  .container2{
    margin-top: 192px;
  }
  .row{
    display:flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 80px;

    width: 1200px;
    height: 304px;// 필요없을수도

    margin-left:auto;
    margin-right:auto;
  }
  .container2-component{
    display:flex;
    flex-direction: column;
    gap: 16px;
    width: 240px;
  }
  .intro-img{
    margin-bottom:0px;
  }
  .subtitle{
    margin-bottom: 0px;
  }
  .content{
    margin-bottom:0px;
  }
  .container3{
    display: flex;
    flex-direction:row;
    column-gap: 40px;
    margin-top: 96px;
    margin-bottom: 96px;
    width: 696px;
    margin-left:auto;
    margin-right:auto;
  }
  .button-block{
    width: 328px;
  }
  }

  // curated collections
  .container4{
    //width: 360px;
    height: 983px;

    background: $artong-black;

    padding-top: 48px;
  }
  .top-container{
    display:flex;
    flex-direction: row;
  }
  .curated-collections{
    width: 200px;
    height: 30px;

    font-family: 'Mustica Pro';
    font-style: $item-font-style;
    font-weight: 600;
    font-size: 22px;
    line-height: 30px;

    color: #B3B3B3;
    
    margin-left: 24px;
  }
  .url{
    width: 58px;
    height: 14px;

    margin-left: 54px;
    margin-top: 16px;

    font-family: $item-font;
    font-style: $item-font-style;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-decoration-line: underline;
    color: $profile-border-red;
  }
  .collection-card{
    width: 330px;
    height: 453px;

    border: 1px solid #333333;
    border-radius: 15px;
    margin-left: 16px;
    margin-top: 24px;
  }
</style>
