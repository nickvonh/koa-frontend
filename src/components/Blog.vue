<template>
    <div class="blog">
        <vue-markdown :source="md"></vue-markdown>
    </div>
</template>
<script>
import VueMarkdown from 'vue-markdown'
export default {
    name : 'blog',
    components: { VueMarkdown },
    data () {
        return {
            md : `# Check back soon
## we've got some cool things in the works <3`
        }
    },
    methods : {
    }
}
</script>
<style lang="stylus">
.blog
    max-width 600px
    margin 0 auto
    text-align center
    padding 5% 10%
    p
        font-size .85em
        line-height 1.7em
</style>
