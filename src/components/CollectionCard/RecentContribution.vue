<template>
    <carousel 
        :per-page="1" 
        :navigate-to="someLocalProperty" 
        :mouse-drag="false" 
        :autoplay="true" 
        :autoplayHoverPause="true"
        :loop="true"
        paginationColor="#B3B3B3"
        paginationActiveColor="#F22E3E"
    >
        <slide class="component">
            <!-- data-index="0"
            data-name="MySlideName"
            @slideclick="handleSlideClick"> -->
            Slide 1 Content
        </slide>
        <slide>
            Slide 2 Content
        </slide>
        <slide>

        </slide>
    </carousel>
</template>
<script>
    export default{
        name: 'CollectionCard',
        // methods: {
        //     handleSlideClick(dataset)=>{
        //         console.log(dataset.index, dataset.name)
        //     }
        // }
    }
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.component{
    width: 330px;
    height: 453px;

    border: 1px solid #333333;
    border-radius: 15px;
    margin-left: 16px;
    margin-top: 24px;
}
</style>