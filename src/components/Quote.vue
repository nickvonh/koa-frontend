<template>
    <div class="quote" :style="{'background-image' : `url(${background})`}">
      <h1 :style="{'filter' : `hue-rotate(${rotate}deg)`}">{{copy}}</h1>
    </div>
</template>
<script>


export default {
  name : 'quote',
  props: ['background', 'copy'],
  data () {
      return {
          rotate : -90
      }
  },
  mounted(){
      let forward = true
      setInterval(()=>{
            if(this.rotate >= 90){
                forward = false
            }
            if(this.rotate <= -90){
                forward = true
            }

            if(!!forward){
                this.rotate += 1
            }else{
                this.rotate -= 1
            }
      },150)
  }
}
</script>
<style lang="stylus">
.quote
  width 100%
  height 200px
  background-size 100%
  background-position-y 200%
  background-attachment fixed
  background-repeat no-repeat
  display flex
  align-items center
  justify-content center
  h1
    height 100%
    width calc(100% - 40px)
    padding 0px 20px
    margin 0
    // background rgba(80, 84, 204, 0.49)
    // color white
    display flex
    justify-content center
    align-items center
@media screen and (max-width 800px)
  .quote
    background-size cover
    background-position-y 50%
    background-position-x 50%
</style>
