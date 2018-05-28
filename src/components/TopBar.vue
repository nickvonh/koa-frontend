<template>
	<div :class="{'top-bar':true, hidden}">
		<ul class="nav-items">
          <li v-for="(collection,key) in collections" :key="key" class="nav-item">
            <button @click="selectCollection(collection)" class="links">
              {{collection.title}}
            </button>
			<hr>
          </li>
        </ul>
		<img :src="menuIcon" class="menu-icon" @click="hidden=!hidden"/>
	</div>
</template>
<script>
import hamburger from '../assets/hamburger.svg'
import exit from '../assets/exit.svg'
export default {
	name: 'top-bar',
	props: ['collections'],
	data(){
		return {
			hidden: true
		}
	},
	computed:{
		menuIcon(){
			return this.hidden ? hamburger : exit
		}
	},
	methods : {
		selectCollection(collection){
			this.activeCollection = collection.handle;
			this.$router.push({name: 'Collection', params: {collection : collection.handle}});

			this.hidden = true
		}
  	}
}
</script>
<style lang="stylus">
.nav-items
	hr
		display none
.menu-icon
	display none
	height 20px
	transition .2s linear
@media screen and (max-width:800px)
	.top-bar
		position absolute
		top 0px
		left 0
		display flex
		z-index 999999999999999999
		height 100vh
		transition .2s linear
		transform translateX(0)
		.nav-items
			background rgba(255,255,255,.98)
			display flex
			flex-direction column
			align-items flex-start
			width 200px
			margin 0
			hr
				display block
			.nav-item
				line-height 2em
				font-size 2em
				width 100%
				margin 0
				text-align left
		.menu-icon
			position absolute
			top 10px
			right 10px
			display block
		&.hidden
			transform translateX(-100%)
			.menu-icon
				right -40px
</style>
