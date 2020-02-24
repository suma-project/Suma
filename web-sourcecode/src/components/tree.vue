<template>
  <ul class="tree-menu" v-bind:class="[{toplevel: depth == 0}, 'level-'+depth]" :data-label="label">
    <li v-if="label" v-bind:class="{selected: selected}" v-bind:id="id" @click="toggleChildren">
      <span v-if="nodes" v-bind:class="[showChildren ? 'toggleup' : 'toggledown']" class="toggle"></span>
      <span v-html="label"></span>
      <span v-if="currentcount">{{currentcount}}</span>
    </li>  
    <tree-menu v-show="showChildren || depth == 0"
      v-for="node in nodes" v-bind:key="node.title" 
      :nodes="node.children"
      :parentdata="parentdata" 
      :label="node.title"
      :id="node.id"
      :depth="depth + 1"
      @addtocounts="addToCount(0)"
      @clickLocation="clickLocation"
    ></tree-menu>   
  </ul>
</template>
<script>
/* eslint-disable no-console */
  export default { 
    props: [ 'label', 'nodes', 'depth', 'id', 'parentdata'],
    data() {
      return {
        showChildren: false,
        currentcount: '',
        selected: false,
        caretdirection: this.showChildren ? 'down' : 'up'
      }
    },
    name: 'tree-menu',
    watch: {
      'parentdata.counts': {
        handler: function() {
          this.getCounts(this.id);
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
      this.getCounts(this.id);
      this.selected = this.id == this.parentdata.location;
    },
    methods: {
      addToCount: function(){
        this.$emit('addtocounts', 0)
      },
      clickLocation: function(data){
        this.$emit('clickLocation', data)
      },
      getCounts: function(location) {
        var currentcount = "";
        var init = this.parentdata.currentinit;
        if (this.parentdata.counts[init]){
          var allcounts = this.parentdata.counts[init]['counts'].filter(element => element.location == location);
          var computecounts = allcounts.filter(elem => elem.number != "0").length;
          if (computecounts > 0){
            currentcount = ` (${computecounts}) `;
          } else if(allcounts.filter(elem => elem.number == "0").length > 0){
            currentcount = " (0) ";
          }
        }
        this.currentcount = currentcount;
      },
      toggleChildren() {
        this.showChildren = !this.showChildren;
        this.$emit('clickLocation', {'id': this.id, 'title': this.label, 'nodes': this.nodes, 'index': this.depth})
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

li {
  word-break: break-all;
  cursor: pointer;
}
</style>