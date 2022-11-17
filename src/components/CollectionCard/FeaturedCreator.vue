<template>
    <carousel 
        :perPage="1.94"
        :autoplay="false"
        :loop="true"
        :scrollPerPage="false"
        :paginationEnabled="false"
    >
        <slide v-for="i in testNumber" :key="i" class="slide">
            <div class="wrapper">
                <div class="top">
                    <div>{{userName}}</div>
                    <ArtistPageProfile :userName="userName" :collectionCount="collectionCount" @setValue="setValue"></ArtistPageProfile>
                </div>
                <div class="bottom">
                    <div>{{collectionCount}} Collections</div>
                </div>
            </div>
        </slide>
    </carousel>
</template>
<script>
    import ArtistPageProfile from '../profile/ArtistPageProfile.vue';

    export default{
        name: 'CuratedCollection',
        components:{
            ArtistPageProfile
        },
        data(){
            return{
                needprojectname: true,
                testNumber: 5, // for문을 돌리기 위해 임의로 collection card 수를 잡음
                userName: "",
                collectionCount: ""
            }
        },
        methods:{
            setValue(username, collectionCount){
                this.userName = username;
                this.collectionCount = collectionCount;
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
    height:214px;
    background-color: #333333;
 
        .top{
            div{
                font-family: $item-font;
                font-style: $item-font-style;
                font-weight: 500;
                font-size: 14px;
                color: $artong-white;

                margin-top:24px;
                margin-bottom:12px;
            }
        }
    
        .bottom{
            div{
                font-family: $item-font;
                font-style: $item-font-style;
                font-weight: 400;
                font-size: 12px;
                line-height: 14px;
                color: #808080;

                margin-top:12px;
            }
        }
}
</style>