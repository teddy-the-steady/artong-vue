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
      <div class="featured-creator">Featured Creators</div>
      <FeaturedCreator class=""></FeaturedCreator>
    </div> <!--end of container4-->
    <div class="container5">
      <div class="top-container">      
        <div class="buy-and-sell">Buy And Sell</div>
        <div class="url" href="">View more</div>
      </div>
      <BuyAndSell></BuyAndSell>
      <div class="top-container2">      
        <div class="recent-contribution">Recent Contributionl</div>
        <div class="url" href="">View more</div>
      </div>
      <RecentContribution></RecentContribution>
      <div class="top-container2">
        <div class="recent-contribution">Recent Contributionll</div>
        <div class="url" href="">View more</div>
      </div>
      <div class="recent-contribution-card">
        <table>
          <tr>
            <td>User</td>
            <td>Record</td>
            <td>Recent</td>
          </tr>
          <tr v-for="i in 5" :key="i">
            <td><ContentsProfile></ContentsProfile></td>
            <td class="recent">0.25</td>
          </tr>
        </table>
      </div>
    </div> <!--end of container5-->
    <div class="container6">
      <div class="img">
        <img src="../../assets/icons/artong-logo.svg"/>
      </div>
      <!-- <table class="bottom-table">
        <tr>
          <td>Learn</td>
          <td>Company</td>
          <td>Connect</td>
        </tr>
      </table> -->
      <div class="bottom-table">
        <ol class="first-row">
          <li>Learn</li>
          <li>Create</li>
          <li>Collect</li>
          <li>Sell</li>
        </ol>
      </div>  
    </div>
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
import CuratedCollection from '../CollectionCard/CuratedCollection.vue'
import BuyAndSell from '../CollectionCard/BuyAndSell.vue'
import RecentContribution from '../CollectionCard/RecentContribution.vue'
import FeaturedCreator from '../CollectionCard/FeaturedCreator.vue'
import ContentsProfile from '../profile/ContentsProfile.vue'

export default {
  name: 'Main',
  mixins: [headerActivate],
  components:{
    CuratedCollection,
    BuyAndSell,
    RecentContribution,
    FeaturedCreator,
    ContentsProfile
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
    
    margin-left: 16px;
    text-align: left;
  }
  .url{
    width: 58px;
    height: 14px;

    margin-right: 16px;
    margin-left:auto;
    margin-top: 16px;

    font-family: $item-font;
    font-style: $item-font-style;
    font-weight: 500;
    font-size: 12px;
    line-height: 14px;
    text-decoration-line: underline;
    color: $profile-border-red;
  }
  .featured-creator{
    margin-top: 60px;
    margin-left: 16px;
    margin-bottom: 24px;
    
    font-family: 'Mustica Pro';
    font-style: normal;
    font-weight: 600;
    font-size: 22px;
    color: #B3B3B3;
    text-align: left;
  }
  .container5{
    margin-top: 48px;
    .top-container{
      .buy-and-sell{
        width: 200px;
        height: 30px;

        font-family: 'Mustica Pro';
        font-style: $item-font-style;
        font-weight: 600;
        font-size: 22px;
        line-height: 30px;

        color: $artong-black;
        
        margin-left: 16px;
        text-align: left;
      }
    }
    .top-container2{
      margin-top: 112px;
      display:flex;
      flex-direction: row;
      .recent-contribution{
        width: 200px;
        height: 30px;

        font-family: 'Mustica Pro';
        font-style: $item-font-style;
        font-weight: 600;
        font-size: 22px;
        line-height: 30px;

        color: $artong-black;
        
        margin-left: 16px;
        text-align: left;
      }
    }
    .recent-contribution-card{
      height:425px;
      width: 90%;
      border: 1px solid #F2F2F2;
      box-shadow: 2px 2px 12px rgba(0, 0, 0, 0.14);
      border-radius: 24px;
      margin-left:auto;
      margin-right:auto;
      margin-top:24px;
      padding: 32px 24px 32px 24px;

      table {
        width: 100%;
        //border-top: 1px solid #444444;
        border-collapse: collapse;
        th, td {
          border-bottom: 1px solid #CCCCCC;
          padding: 21px;
          text-align:left;

          font-family: $item-font;
          font-style: $item-font-style;
          font-weight: 500;
          font-size: 14px;
        }
      }
    }
  }
  // 화면이 작은 경우 recent 범주가 안 보이게
  .recent-contribution-card > table > tr > td:nth-child(3){
    display:none;
  }
  .recent{
    font-family: $item-font;
    font-style: $item-font-style;
    font-weight: 400;
    font-size: 14px;
    color: #333333;
  }
  .container6{
    margin-top:48px;
    background-color: $artong-black;
    height:282px;
    .img{
      text-align:left; // artong 로고 왼쪽 정렬을 위해
      img{
        margin-top:24px;
        margin-left:24px;
      }
    }
    .bottom-table{
     flex-direction: row;
     .first-row{
      li{
        font-family: $item-font;
        font-style: $item-font-style;
        font-weight: 400;
        font-size: 14px;
        color: #CCCCCC;
      }
     } 
    }
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
  .featured-creator{
    margin-top:60px;
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


  
</style>
