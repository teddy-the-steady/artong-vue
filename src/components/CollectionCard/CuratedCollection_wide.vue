<template>
    <div class="wrapper">
        <div class="top">
            <ProjectPageProfile_wrapped></ProjectPageProfile_wrapped>
            <div clas="collection-name">Collection Name</div>
        </div>
        <div class="middle">
            <ContentsProfileBundle></ContentsProfileBundle>
            <div class="nickName">@nickName +4</div>
        </div>
        <div class="description">
            From Dominican Republic and the web. Their work includes computer drawings, installations and audiovisuals. Founder of From Dominican Republic and the web. Their work includes computer drawings, installations and audiovisuals. Founder ofFrom Dominican Republic and the web. Their work includes computer drawinthe web. Their work includes cothe web. Their work includes computer drawinthe web. Their work includes computer ...
        </div>
    </div>
</template>
<script>
    import ProjectPageProfile_wrapped from '../profile/ProjectPageProfile_wrapped.vue';
    import ContentsProfileBundle from '../profile/ContentsProfileBundle.vue';

    export default{
        name: 'CuratedCollection',
        components:{
            ProjectPageProfile_wrapped,
            ContentsProfileBundle
        }
    }
</script>

<style lang="scss" scoped>
@import '../../assets/scss/variables';

.wrapper{
    
}
</style>