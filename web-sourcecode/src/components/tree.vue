<template>
  <ul class="tree-menu" v-bind:class="[{toplevel: depth == 0}, 'level-'+depth]" :data-label="label">
    <b style="padding:20px" v-if="depth == 0 && parentdata.cachedinitdata[parentdata.currentinit]">{{parentdata.cachedinitdata[parentdata.currentinit].locations.title}}</b>
    <li>
      <button v-if="label" v-bind:class="[{selected: selected}, {lowestlocation:!nodes}, 'menuelement']" v-bind:id="id" @click="toggleChildren">
        <span v-if="nodes" v-bind:class="[showChildren ? 'toggleup' : 'toggledown']" class="toggle"></span>
        <span v-html="label"></span>
        <span v-if="currentcount">{{currentcount}}</span>
      </button>
      <tree-menu v-show="showChildren || depth == 0"
        v-for="node in nodes" v-bind:key="node.title" 
        :nodes="node.children"
        :parents="{'desc': parentDescription, 'title': parentTitle}"
        :parentdata="parentdata" 
        :label="node.title"
        :id="node.id"
        :description="node.description"
        :depth="depth + 1"
        @addtocounts="addToCount(0)"
        @clickLocation="clickLocation"
      ></tree-menu>   
    </li>  
  </ul>
</template>
<script>
/* eslint-disable no-console */
import shared from './componentFunctions'

  export default { 
    props: [ 'label', 'nodes', 'depth', 'id', 'parentdata', 'description', 'parents'],
    data() {
      return {
        showChildren: false,
        currentcount: '',
        selected: false,
        caretdirection: this.showChildren ? 'down' : 'up',
        parentDescription: '',
        parentTitle: ''
      }
    },
    name: 'tree-menu',
    watch: {
      'parentdata.counts': {
        handler: function(data) {
          this.currentcount = shared.getCounts(data, this.id);
        },
        deep: true
      },
      'parentdata.location': {
        handler: function(data) {
          if (!this.nodes){
            this.selected = this.id == data;
          }
        },
        deep: true
      },
    },
    created() {      
      this.currentcount = shared.getCounts(this.parentdata.counts, this.id);
      this.selected = this.id == this.parentdata.location;
    },
    methods: {
      addToCount: function(){
        this.$emit('addtocounts', 0)
      },
      clickLocation: function(data){
        this.$emit('clickLocation', data)
      },
      toggleChildren() {
        this.showChildren = !this.showChildren;
        this.parentTitle = this.parents.title ? this.parents.title + ' | ' + this.label : this.label;
        this.parentDescription = this.description ? this.description : this.parents.desc;
        this.$emit('clickLocation', {'description': this.parentDescription, 'id': this.id, 'title': this.parentTitle, 'nodes': this.nodes, 'index': this.depth})
        if (!this.nodes){
          this.addToCount();
        }
      }
    }
  }
</script>
<style>
.toplevel {
  padding: 0;
}

.tree-menu {
  list-style-type: none;
  text-align: left;
}

.toggle {
  font-family: "Font Awesome 5 Free";
  display: inline-block;
  padding-right: 5px;
  vertical-align: initial;
  font-weight: 400;
}

.toggleup:after { 
  content: "\f146"; 
  background: none;
}

.toggledown:after {
  content: "\f0fe";
}

.menuelement {
  color: blue;
  font-size: 19.5px;
  padding-top: .25em!important;
  padding-bottom: .25em!important;
  appearance: none;
  background: none!important;
  border: none;
  word-break: break-all;
  cursor: pointer;
}
</style>