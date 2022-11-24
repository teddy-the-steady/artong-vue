<template>
  <div class="info">
    <div class="container0-box">
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
      <div class="container4-box">
        <div class="top-container">      
          <div class="curated-collections">Curated Collections</div>
          <div class="url" href="">View more</div>
        </div>
        <div class="test">{{width}}</div>
        <CuratedCollection v-if="1" class="curated-collection" :width=getWidth()></CuratedCollection>
        <CuratedCollectionWide v-else-if="width<1440"></CuratedCollectionWide>
        <div class="featured-creator">Featured Creators</div>
        <FeaturedCreator></FeaturedCreator>
      </div>
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
            <td class="record">3 contributions/week</td>
            <td class="recent">0.25</td>
          </tr>
        </table>
      </div>
    </div> <!--end of container5-->
    <div class="container6">
      <div class="img">
        <svg class="logo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1690 300">
          <g>
              <path d="M1614.9,90c41.48,0,75.1,33.62,75.1,75.1v-35.11c0-71.79-58.2-129.99-129.99-129.99h0c-6.8,0-13.49,.52-20.01,1.53-62.3,9.62-110,63.48-110,128.48v40c0,16.18,2.96,31.67,8.37,45.95,13.18,34.87,40.92,62.58,75.81,75.72,8.24,3.1,16.88,5.4,25.82,6.78,6.52,1.01,13.19,1.53,19.99,1.53h0c16.18,0,31.67-2.97,45.97-8.37,34.85-13.17,62.54-40.89,75.7-75.74,5.01-13.29,7.92-27.61,8.3-42.56-.89-29.6-25.14-53.33-54.96-53.33s-55,24.62-55,55v15c0,11.05-8.95,20-20,20s-20-8.95-20-20v-25.1c0-41.37,33.53-74.9,74.9-74.9Z"/>
              <path d="M805,0h-189.84c-30.46,0-55.16,24.69-55.16,55.16h0c0,30.29,24.55,54.84,54.84,54.84h.34c1.77-26.64,17.43-49.47,39.81-61.32,10.46-5.54,22.38-8.68,35.04-8.68h0c39.73,0,72.22,30.92,74.78,70h-.06c-2.53-28.03-26.07-50-54.76-50h0c-28.69,0-52.24,21.97-54.76,50h-.24V244.84c0,30.46,24.69,55.16,55.16,55.16h0c30.29,0,54.84-24.55,54.84-54.84V110h40c30.38,0,55-24.62,55-55h0c0-30.38-24.62-55-55-55Z"/>
              <path d="M130.01,0h0c-6.8,0-13.49,.52-20.01,1.53C47.7,11.16,0,65.01,0,130.01v114.83c0,30.46,24.69,55.16,55.16,55.16h0c30.29,0,54.84-24.55,54.84-54.84v-80.26c0-41.37,33.53-74.9,74.9-74.9h0c41.48,0,75.1,33.62,75.1,75.1v-35.11C260,58.2,201.8,0,130.01,0Z"/>
              <path d="M205,120h0c-30.38,0-55,24.62-55,55v69.84c0,30.46,24.69,55.16,55.16,55.16h0c30.29,0,54.84-24.55,54.84-54.84v-70.16c0-30.38-24.62-55-55-55Z"/>
              <path d="M1355,0h-75c-6.8,0-13.48,.53-20,1.53-62.3,9.62-110,63.48-110,128.48v114.83c0,30.46,24.69,55.16,55.16,55.16h0c30.29,0,54.84-24.55,54.84-54.84v-100.26c0-19.67,7.6-37.56,20-50.93,5.73-6.17,12.49-11.38,20-15.34,.13-.07,.26-.13,.4-.2,10.33-5.37,22.06-8.43,34.5-8.43h0c1.72,0,3.41,.08,5.1,.19,1.92,.13,3.82,.32,5.7,.59-25.93,4.38-45.68,26.92-45.7,54.1v.04h0v120c0,13.33,4.74,25.55,12.61,35.08,10.1,12.22,25.37,20,42.46,20h.16c17.05,0,32.27-7.79,42.31-20,7.78-9.46,12.45-21.56,12.45-34.76V55c0-30.38-24.62-55-55-55Z"/>
              <path d="M1000,0h0c-71.8,0-130,58.2-130,130v40c0,71.8,58.2,130,130,130h0c71.8,0,130-58.2,130-130v-40c0-71.8-58.2-130-130-130Zm55,158.46c0,30.38-24.62,55-55,55h0c-30.38,0-55-24.62-55-55v-16.92c0-30.38,24.62-55,55-55h0c30.38,0,55,24.62,55,55v16.92Z"/>
              <path d="M485,0h-150c-30.38,0-55,24.62-55,55V244.84c0,30.46,24.69,55.16,55.16,55.16h0c30.29,0,54.84-24.55,54.84-54.84v-100.26c0-19.67,7.6-37.56,20-50.93,5.73-6.17,12.49-11.38,20-15.34,10.42-5.5,22.29-8.63,34.9-8.63h0c1.72,0,3.41,.08,5.1,.19,1.92,.13,3.82,.32,5.7,.59-25.93,4.38-45.68,26.92-45.7,54.1v.04c0,30.42,24.66,55.08,55.08,55.08h.16c27.13,0,49.64-19.73,53.99-45.62,.41-2.47,.66-4.99,.73-7.56,.03,1.05,.04,2.11,.04,3.17V55c0-30.38-24.62-55-55-55Z"/>
              <path d="M485.08,190h-.16c-17.94,0-33.86,8.6-43.89,21.9-6.93,9.19-11.04,20.62-11.04,33.02,0,13.33,4.74,25.55,12.61,35.08,10.1,12.22,25.37,20,42.46,20h.16c17.05,0,32.27-7.79,42.31-20,7.78-9.46,12.45-21.56,12.45-34.76v-.31c0-8.98-2.17-17.44-5.98-24.92-9.08-17.8-27.58-30-48.94-30Z"/>
          </g>
      </svg>
      </div>
      <!-- <table class="bottom-table">
        <tr>
          <td>Learn</td>
          <td>Company</td>
          <td>Connect</td>
        </tr>
      </table> -->
      <div class="bottom-link">
        <div class="bottom-table">
          <ol class="column first-column">
            <li>Learn</li>
            <li>Create</li>
            <li>Collect</li>
            <li>Sell</li>
          </ol>
          <ol class="column second-column">
            <li>Company</li>
            <li>About</li>
            <li>Careers</li>
            <li>Help Center</li>
          </ol>
          <ol class="column third-column">
            <li>Connect</li>
            <li>Twitter</li>
            <li>Instagram</li>
            <li>Discord</li>
          </ol>
        </div>
        <div class="bottom-left">
          <div class="bottom-word">Privacy Info</div>  
          <div class="bottom-word">Terms of Service</div>
        </div>
      </div>
    </div>
    <div></div>
    <CuratedCollectionWide></CuratedCollectionWide>
  </div>
</template>

<script>
import { headerActivate } from '../../mixin'
import CuratedCollection from '../CollectionCard/CuratedCollection.vue'
import BuyAndSell from '../CollectionCard/BuyAndSell.vue'
import RecentContribution from '../CollectionCard/RecentContribution.vue'
import FeaturedCreator from '../CollectionCard/FeaturedCreator.vue'
import ContentsProfile from '../profile/ContentsProfile.vue'
import CuratedCollectionWide from '../CollectionCard/CuratedCollection_wide.vue'

export default {
  name: 'Main',
  mixins: [headerActivate],
  components:{
    CuratedCollection,
    BuyAndSell,
    RecentContribution,
    FeaturedCreator,
    ContentsProfile,
    CuratedCollectionWide
  },
  data(){
    return{
      width:"0",
    }
  },
  methods:{
    getWidth(){
      this.width=window.innerWidth;
      return this.width;
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../../assets/scss/variables';

  //@media (max-width:1080px)
    // container0 빈 div
  .test{
    color:white;
  }
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
      width: 94%;
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
  // 화면이 작은 경우 record 부분이 안 보이게
  @media (max-width:360px) {
    .recent-contribution-card > table > tr > td:nth-child(2){
      display: none;
    }
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
      svg{
        height: 24px;
        width: 133.59px;
        margin-top:24px;
        margin-left:24px;
        fill:$artong-white;
      }
    }
    .bottom-table{
      display: flex;
      flex-direction: row;
      margin-left:24px;
      margin-top:24px;
     .column{
        display: flex;
        flex-direction: column;
        margin-bottom:0px;
        li{
          font-family: $item-font;
          font-style: $item-font-style;
          font-weight: 400;
          font-size: 14px;
          color: #CCCCCC;
          margin-bottom:14px;
          position:static;
          text-align: left;
        }
      }
      .first-column{
        margin-right:56px;
        margin-bottom:10px;
      }
      .second-column{
        margin-right:25px;
      }
    }
    .bottom-word{
      font-family: 'Pretendard';
      font-style: normal;
      font-weight: 500;
      font-size: 14px;
      color: #B3B3B3;
      text-align: left;
      margin-left:24px;
      margin-bottom:16px;
    }
  }
  .bottom-table>.column>li:nth-child(1){
    font-family: 'Mustica Pro';
    font-style: $item-font-style;
    font-weight: 600;
    font-size: 12px;
    color: #808080;
    margin-bottom:16px;
  }


  // width over 1080px
  @media(min-width: 1080px)and(max-width:1920px){
    .container0-box{
      text-align: center;
    }
    .container0{
      flex-direction: row;
      margin-top: 96px;
      display: inline-flex;
    }
    .container1{
      width: 420px;
    }

  .container1-2{
    display: flex;
    flex-direction: column;
    flex-basis: 420px;
    gap: 10px;
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
    flex-basis: 200px;
  }  
  .conatiner1-2-bottom-right{
    display: flex;
    flex-direction: column;
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
    height: 688px;

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
  .container6{
    padding-top:72px;
    padding-bottom:72px;
    .bottom-link{
      display: flex;
      flex-direction: row-reverse;
      
      .bottom-table{
        margin-top:57px;
        .third-column{
          margin-right:61px;
        }
      }
      .bottom-left{
        margin-right:auto;
        margin-top:124px;
      }
    }
    }
  }
  
  @media (min-width:1920px){
    .container0-box{
      text-align: center;
    }
    .container0{
      display: inline-flex;
      flex-direction: row;
      
      margin-top: 96px;
    }
    .container1{
      width: 420px;
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
    .container4-box{
      margin-right:240px;
      margin-left:240px;
    }
    .container5{
      margin-left:240px;
      margin-right:240px;
    }
    .container6{
      padding-top:72px;
      padding-bottom:72px;
      .img{
        margin-left:240px;
        margin-right:240px;
      }
      .bottom-link{
        display: flex;
        flex-direction: row-reverse;
        margin-left:240px;
        margin-right:240px;
        
        .bottom-table{
          margin-top:57px;
          .third-column{
            margin-right:61px;
          }
        }
        .bottom-left{
          margin-right:auto;
          margin-top:124px;
        }
      }
    }
  }


  
</style>
