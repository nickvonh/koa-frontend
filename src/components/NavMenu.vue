<template>
	<div :class="{'nav-menu':true, hidden}">
		<ul class="nav-items" v-if="!hidden">
          <li v-for="(collection,key) in collections" :key="key" class="nav-item" @click="selectCollection(collection)">
            <div class="links">
              {{collection.title}}
            </div>
          </li>
        </ul>
		<!-- <div v-html="menuIcon" class="menu-icon" @click="hidden=!hidden"/> -->
		<i class="icon-menu-vertical">
			<svg class="menu-icon" @click="hidden=!hidden">
				<use xlink:href="#icon-menu-vertical"></use>
			</svg>
		</i>
	</div>
</template>
<script>
import hamburger from '../assets/menu.svg'
import exit from '../assets/exit.svg'
export default {
	name: 'nav-menu',
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
	transition .2s ease
.nav-menu
	position relative
	.nav-items
		display flex
		flex-direction column
		align-items flex-start
		margin 0
		position fixed
		bottom 55px
		left 13px
		z-index 1000
		background rgba(255,255,255,0.6)
		border-radius 5px
		.nav-item
			margin 15px
			text-align left
			background #53577c
			border-radius 5px
			.links
				color white
				font-size 1rem
				padding .5rem
	.menu-icon
		border-radius 5px
		position fixed
		bottom 10px
		left 15px
		z-index 1000
		cursor pointer
		transition .4s ease
		width 1.5rem
		height 1.5rem
		padding .25rem
		filter hue-rotate(35deg) brightness(0.6)
			svg
			transform scale(0.8)
</style>
