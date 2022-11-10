<template>
    <carousel 
        :perPage="1.1"
        :autoplay="true"
        :autoplayHoverPause="true"
        :loop="true"
        :scrollPerPage="false"
        paginationColor="#B3B3B3"
        paginationActiveColor="#F22E3E"
    >
        <slide v-for="i in testNumber" :key="i">
            <div class="wrapper">
                <div class="top">
                    <ProjectPageProfile_wrapped class="profile"></ProjectPageProfile_wrapped>
                    <div class="category">category</div>
                </div>
                <div class="description">NFT art name</div>
                <div class="bottom">
                    <ContentsProfileBundle class="bundle"></ContentsProfileBundle>
                    <div class="nickName">@nickName +4</div>
                </div>
            </div>
        </slide>
    </carousel>
</template>
<script>
    import ProjectPageProfile_wrapped from '../profile/ProjectPageProfile_wrapped.vue';
    import ContentsProfileBundle from '../profile/ContentsProfileBundle.vue';

    export default{
        name: 'CuratedCollection',
        components:{
            ProjectPageProfile_wrapped,
            ContentsProfileBundle
        },
        data(){
            return{
                testNumber: 5 // for문을 돌리기 위해 임의로 collection card 수를 잡음
            }
        }
        // methods: {
        //     handleSlideClick(dataset)=>{
        //         console.log(dataset.index, dataset.name)
        //     }
        // }
    }
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.wrapper{
    border: 1px solid #333333;
    border-radius: 15px;
    margin: 24px 16px;

    .top{
        display: flex;
        flex-direction: row;
        margin-top: 24px;

        .profile{
            margin-left:24px;
        }
        .category{
            margin-left:90px;
            width:92px;
            height:25px;

            border: 1px solid $profile-border-red;
            border-radius: 999px;

            font-family: $item-font;
            font-style: $item-font-style;
            font-weight: 500;
            font-size: 14px;
            line-height:25px;
            color: $profile-border-red;
        }
    }
    .description{
        margin-top: 213px;
        font-family: 'Mustica Pro';
        font-style: normal;
        font-weight: 600;
        font-size: 32px;
        line-height: 44px;
        color: $artong-white;
    }
    .bottom{
        display: flex;
        margin: 16px 0;
        height: 32px;
        .bundle{
            margin-left:35px;
        }
        .nickName{
            font-family: $item-font;
            font-style: $item-font-style;
            font-weight: 500;
            font-size: 14px;
            line-height: 32px;
            color: $artong-white;
        }
    }
}
</style>