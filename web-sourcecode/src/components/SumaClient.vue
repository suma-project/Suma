<template>
  <div>
    <div class="header_content">
      <button v-on:click="menuShown = !menuShown" class="headerbuttons leftalign menubutton" aria-label="toggle menu">
        <i class="fas fa-bars" v-if="!menuShown"></i>
        <i class="fas fa-times" v-else></i>
      </button>
      <button v-on:click="resetCounts()" class="headerbuttons leftalign" aria-label="Abandon all counts">
        <span class="buttontext">Abandon All Counts</span>
        <i class="fas fa-trash-alt toolbar-icons"></i>
      </button>
      <button v-on:click="undoLastCount()" class="headerbuttons leftalign" aria-label="Undo last count">
        <span class="buttontext">Undo Last Count</span>
        <i class="fas fa-undo toolbar-icons"></i>
      </button>
      <button v-on:click="toggleDebugWindow" v-if="debug" class="headerbuttons rightalign">show debug</button>
      <button v-on:click="submitCounts()" class="headerbuttons rightalign" aria-label="finish collecting">
        <span class="buttontext">Finish collecting</span>
        <i class="fas fa-check-circle toolbar-icons"></i>
      </button>
    </div>
    <transition name="sidebar">
      <div class="selectbuttons" v-if="menuShown">
        <div class="alldropdowns">
          <select aria-label="initiative dropdown" id="initiativeDropdown" v-model="currentinit" v-on:change="updateInit()">
            <option disabled value="">Select an initiative</option>
            <option v-bind:value="item.initiativeId" v-for="item in initresults" v-bind:key="item.initiativeId" v-html="item.initiativeTitle">
            </option>
          </select>
          <span v-for="(childlist, index) in children" v-bind:key="index" v-bind:id="'locationtree-' + index">
            <select aria-label="tree element dropdown" v-model="childinit[index]" v-on:change="updateChild(index)">
              <option disabled :value="undefined">Please select one</option>
              <option v-bind:value="child.id" v-for="child in childlist" v-bind:key="child.id">
                <span v-html="child.title"></span>
                <span v-if="!child.children">{{ getCounts(child.id) }}</span>
              </option>
            </select>
          </span>
        </div>
      </div>
    </transition>
    <div v-bind:class="[menuShown ? 'counts' : 'fullpagecounts']" v-if="showcounts">
      <h3 v-html="this.locationtitle" id="current_loc_label"></h3>
      <form @submit.prevent="addToCount(1)">
        <div v-if="Object.keys(activities).length > 0" class="activities">
          <div v-for="(value, key) in activities" v-bind:key="key" class="activityGroup" v-bind:class="{required: value.required}">
            <h3 class="activityTitle">
              <span v-html="value.title"></span>
              <span v-if="value.required" class="requiredicon">*</span>
              <span v-if="value.allowMulti" class="instructions"> (Choose one or more)</span>
              <span v-else class="instructions"> (Select one)</span>
            </h3>
            <div id="activityButton" v-for="activitygroup in value.options" v-bind:key="activitygroup.id">
              <label>
                <input type="checkbox" v-bind:name="value.id" v-on:click="requiredFieldsCheck()" class="button" v-if="value.allowMulti" v-bind:id="activitygroup.id" v-bind:value="activitygroup.id" v-model="activityvaluesmulti">
                <input type="radio" v-bind:name="value.id" v-on:click="deselect(activitygroup.id, key)" v-else-if="!value.allowMulti" v-bind:id="activitygroup.id" v-bind:value="activitygroup.id" v-model="activityvalues[key]">
                <span v-html="activitygroup.title"></span>
              </label>
            </div>
          </div>
        </div>
        <button type="submit" v-bind:disabled="!buttonClickable" v-bind:enabled="buttonClickable" class="countButton">Count{{ getCounts(location) }}</button>
      </form>
    </div>
    <div v-else>
      No current location
    </div>
      <div id='debugger' class='debug' v-if="debug" hidden style="position: fixed;
    bottom: 0;
    margin-left: 25%;">
        <p>If we finish now, this is sent to the sumaserver:</p>
        <p>{{ syncCountDict }}</p>
      </div>
  </div>
</template>

<script>
/* eslint-disable no-console */
/*global baseInitUrl, initiativeUrl, syncUrl*/
import axios from 'axios';
import localforage from 'localforage';
import DeviceDetector from "device-detector-js";
import swal from 'sweetalert';
import pluralize from 'pluralize';

var _ = require('lodash');

export default {
  name: 'SumaClient',
  data: function() {
    return {
      initresults: '',
      currentinit: '',
      initdata: '',
      cachedinitdata: {},
      initurl: initiativeUrl,
      baseiniturl: baseInitUrl,
      syncurl: syncUrl,
      appVersion: process.env.VUE_APP_VERSION,
      device: '',
      children: [],
      activities: {},
      childinit: {},
      counts: {},
      location: '',
      activityvalues: {},
      activityvaluesmulti: [],
      showcounts: false,
      locationtitle: '',
      buttonClickable: false,
      menuShown: true,
      debug: process.env.NODE_ENV === 'development'
    }
  },
  created() {
    this.getDeviceData();

    //load and submit any old counts
    this.loadCounts();

    this.loadInitInfo();

    this.loadInitData();
  },
  updated() {

  },
  watch: {
    cachedinitdata: function (data) {
      localforage.setItem('cachedinitdata', data);
    },
    counts: {
      handler: function() {
        localforage.setItem('counts', this.counts);
      },
      deep: true
    },
    children: {
      handler: function() {
        if (this.showcounts) {
          this.addToCount(0)
        }
      },
      deep: true
    } 
  },
  methods: {
    toggleDebugWindow: function() {
      let debugview = document.getElementById('debugger');
      debugview.hidden = !debugview.hidden;
    },
    getDeviceData: function() {
      // Get device type (Mac, iPad, etc.)
      const deviceDetector = new DeviceDetector();
      const userAgent = navigator.userAgent;
      const device = deviceDetector.parse(userAgent); 
      this.device = device.os.name;
    },
    requiredFieldsCheck: function(){
      //check to see if all elements with the class .required have been checked.
      this.$nextTick(() => {
        const ag = document.querySelectorAll('div.activityGroup.required');
        var checked = Array.from(ag).map(elem => elem.querySelectorAll('input:checked').length);
        //set buttonclickable based on if any of the required elements do not have a checked item (length of 0)
        this.buttonClickable = checked.indexOf(0) == -1;
      });
    },
    loadCounts: function(){
      //get counts field from indexDB, load into data
      localforage.getItem('counts').then((counts) => {
        if(counts != null){
          this.counts = counts;
          return true;
        } else {
          return false;
        }
      })
      .then((savedCounts) => { if(savedCounts){this.submitCounts();} })
      .catch(function(err){
        console.error('There was an error '+err);
      });
    },
    loadInitData: function(){
      localforage.getItem('cachedinitdata').then((cache) => {
        if(cache != null) {
          //remove any cached initiatives last retrieved > an hour ago
          this.cachedinitdata = _.omitBy(cache, (val) => Date.now() - val.retrieved > 1000*60*60);
        }
      });
    },
    loadInitInfo: function(){
      localforage.getItem('initcache').then((cache) => {
        //get new initiatives info if cache is empty or last retrieved > an hour ago
        if(cache === null || Date.now() - cache.retrieved > 1000*60*60){
          axios.get(this.baseiniturl).then((response) => {
            if(response.data){
              this.initresults = response.data;
              localforage.setItem('initcache', {retrieved: Date.now(), initresults: response.data});
            }
          }).catch(function(err){
            console.error('There was an error '+err);
          });
        } else {
          // console.log(cache);
          this.initresults = cache.initresults;
        }
      });
    },
    updateInit: function() {
      if (Object.keys(this.cachedinitdata).indexOf(this.currentinit) > -1){
        this.populateInitData(this.cachedinitdata[this.currentinit])
      } else {
        axios.get(`${this.initurl}${this.currentinit}`).then(response => {
          this.populateInitData(response.data)
          this.$set(this.cachedinitdata,this.currentinit, _.set(response.data, 'retrieved', Date.now()));
        })
      }
    },
    populateInitData:function(data){
      this.initdata = data;
      this.children = [this.initdata.locations.children];
      this.cleanValues(-1, this.children[0], data)

      //combine activityGroup data and initdata.activities in a object so the data is all together
      var activitykeys = this.initdata.activityGroups;
      var activities = _.groupBy(this.initdata.activities, 'groupId');

      this.activities = {}
      for (var key in activities){
        var dictvalue = activitykeys.filter(elem => elem.id == key)[0];
        dictvalue['options'] = activities[key];
        this.activities[key] = dictvalue;
      }

      //Check to see if any required fields in the activies 
      this.buttonClickable = Object.keys(this.activities).map(elem => this.activities[elem].required).indexOf(true) == -1;
    },
    updateChild: function(index) {
      //get children at location index (locations are in tree format)
      //i.e. {'id': 340, 'title':'Location title', 'children': [{'id': 341, 'title': 'location area 1', 'children': []}]}
      var childchild = this.children[index].filter(element => element.id == this.childinit[index])[0].children;
      // Used to remove child elements not having to do with the newly selected child
      this.children = this.children.splice(0, index+1);
      childchild ? this.children[index+1] = childchild : ''
      this.cleanValues(index, childchild);
    },
    cleanValues: function(index, childchild, data=false){
      //If the changed child had children, remove those children
      //childinit is a object populated by the dropdowns, its keys are the index in the location tree and the value is the identifier
      for (var key in this.childinit){
        if (key > index){
          this.childinit[key] = undefined
        }
      }
      //Add any children of new location to childinit list
      childchild && childchild.length == 1 ? this.childinit[index+1] = childchild[0].id : '';
      //find largest key with a value
      var activekeys = Object.keys(this.childinit).filter(element => !_.isUndefined(this.childinit[element]))
      var maxKey = _.max(activekeys);
      //set location to lowest location in hierarchy
      this.location = this.childinit[maxKey];
      this.createLocationTitle(data, activekeys);
      this.showCounts();
      this.resetActivityChecks();
    },
    createLocationTitle: function(data, activekeys) {
      var initData = data ? data : this.cachedinitdata[this.currentinit];
      this.locationtitle = initData.initiativeTitle;
      for (var i=0; i<activekeys.length; i++){
        var key = activekeys[i];
        //get titles from children list that populates dropdowns using the childinit which is the model and stores selected dropdowns.
        var nexttitle = this.children[key].filter(element => element.id == this.childinit[key])[0].title
        this.locationtitle += ' | ' + nexttitle
      }
    },
    showCounts: function(){
      //Show counts if selected dropdowns (childinit) equals the length of the children list
      this.showcounts = _.reject(Object.values(this.childinit), _.isUndefined).length == this.children.length;
    },
    resetActivityChecks: function() {
      //unchecks all activities
      this.activityvalues = {};
      this.activityvaluesmulti = [];
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      this.requiredFieldsCheck();
    },
    submitCounts: function(){
      //get data
      let syncObj = this.syncCountDict;
      if (syncObj === ''){
        return null;
      }
      axios({
        method: 'POST',
        url: this.syncurl,
        headers: { 'content-type': 'application/x-www-form-urlencoded'},
        data: `json=${syncObj}`,
      }).then(response => {
        //handle response
        if (response.data != 'Transaction Complete'){
          this.syncError();
        } else {
          //notify user of the response
          //tell them what was sent? if so, parse syncObject for relevant info
          var parsedObject = JSON.parse(syncObj);
          const sessions = parsedObject.sessions.length;
          var totals = _.reduce(parsedObject.sessions, function(total, session) {
            total['counts'] += session.counts.length;
            total['locations'].push(session.counts.map(count => count.location))
            return total;
          }, {'counts': 0, 'locations': []})
          const locations = _.uniq(_.flatten(totals['locations'])).length;
          const total = totals['counts'];
          swal({
            title: "Counts submitted!",
            text: `${total} ${pluralize('counts',total)} (including "zero" counts) covering ${locations} ${pluralize('locations', locations)} in ${sessions} ${pluralize('initiatives',sessions)} has been sent to the server`,
            icon: "success"
          })
          this.clearCounts();
        }
      })
      .catch(error => {
        this.syncError();
        console.log(error);
      });

    },
    syncError: function(){
      swal(`Sync error`,`Error sending data to server. This may be caused by issues including server outages and Wi-Fi \
            connectivity problems. The data will be retained by the browser. Please contact an administrator if \
            this doesn't resolve itself soon.`, "error");
    },
    clearCounts: function() {
      var initresults = this.initresults;
      var cachedinitdata = this.cachedinitdata;
      Object.assign(this.$data, this.$options.data.call(this));
      this.initresults = initresults;   
      this.cachedinitdata = cachedinitdata;  
    },
    resetCounts: function(){
      swal({
        title: 'Abandon Session',
        text: "Are you sure you want to delete the data you've just collected? All data you've collected will be deleted permanently.",
        buttons: { delete: { text: "DELETE", value: "delete", }, cancel: "Keep Collecting",}
      }).then(parameters => {
        if (parameters == "delete") {
          this.clearCounts();    
        } 
      }).catch(err => {
      console.log(err)
      });
    },
    undoLastCount: function(){
      if (this.counts[this.currentinit] && this.counts[this.currentinit]['counts'].length > 0){
        this.counts[this.currentinit]['counts'].pop();
      }
      this.resetActivityChecks();
    },
    getCounts: function(location) {
      var currentcount = "";
      if (this.counts[this.currentinit]){
        var allcounts = this.counts[this.currentinit]['counts'].filter(element => element.location == location);
        var computecounts = allcounts.filter(elem => elem.number != "0").length;
        if (computecounts > 0){
          currentcount = ` (${computecounts}) `;
        } else if(allcounts.filter(elem => elem.number == "0").length > 0){
          currentcount = " (0) ";
        }
      } 
      return currentcount;
    },
    addToCount: function(number){
      //called when count button pressed; adds new counts for each initiative
      var timestamp = Math.round(Date.now() / 1000);
      var activities = this.activityvaluesmulti.concat(Object.values(this.activityvalues));
      var countDict = this.counts[this.currentinit] ? this.counts[this.currentinit] : {'counts':[], 'initiativeID': this.currentinit, 'startTime': timestamp}; 
      var location = this.location;
      _.remove(countDict['counts'], function(elem) {
        return elem.location == location && elem.number == "0";
      });
      countDict['counts'].push({'timestamp': timestamp,'location': this.location, 'activities': activities, 'number': number});
      countDict['endTime'] = timestamp;
      this.$set(this.counts,this.currentinit, countDict);
      this.resetActivityChecks();
    },
    deselect: function(id, key){
      //deselects radio buttons if user clicks on selected radio button
      if (id == this.activityvalues[key]){
        this.activityvalues[key] = '';
      }
      this.requiredFieldsCheck();
    }
  },
  computed:  {
    syncCountDict: function() {
      var counts = Object.values(this.counts);
      var buildDict = JSON.stringify({
        'version': this.appVersion, 'device': this.device, 
        'sessions': counts
      });
      return counts.length > 0 ? buildDict : '';
    }
  }
    
}
</script>

<style lang="scss">
@import url('https://use.fontawesome.com/releases/v5.5.0/css/all.css');

$header_padding: 10;
$select_padding: $header_padding*2;
$sidebar_width: 25%;
$button_fontsize: 1em;

.activities {
  display: flex;
  flex-wrap: wrap;
}

.activityGroup {
  border: 1px solid DarkGray;
  border-radius: 5px;
  padding: 2px 5px 5px;
  margin: 10px;
  flex: 1 1 calc(50% - 20px);
  text-align: center;
  padding: 12px;
  box-sizing: border-box;
}

#activityButton {
  margin:4px;
  background-color:#EFEFEF;
  border-radius:4px;
  border:1px solid #D0D0D0;
  width: auto;
  display: inline-block;
}

#activityButton label {
  width:auto;
}

#activityButton span, .headerbuttons {
  text-align:center;
  padding:13px 10px;
  display:inline-block;
  border-radius:4px;
  background: #D7EBF9;
  color: #184A67;
  font-weight: bold;
  border: 1px solid #aed0ea;
}

.headerbuttons {
  font-size: #{$button_fontsize};
  margin: 0px 10px 0px;
}

#activityButton input {
  position:absolute;
  opacity: 0;
  margin-top: 2%;
}

#activityButton input:hover + span {
  background-color:#add7ed;
}

#activityButton input:checked + span {
  background-color:#3BAAE3;
  color:#fff;
}

#activityButton input:checked:hover + span {
  background-color:#3BAAE3;
  color:#fff;
}

.instructions {
  margin-top: 1px;
}

.activityTitle {
  padding-bottom: 0px;
  margin-bottom: 0px;
}

.countButton {
  font-size: 3.5em;
  border-radius: 4px;
  padding: 15px 32px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  margin-top: 20px;
}

#current_loc_label {
  font-size: 1.6em;
  border-bottom: 1px dotted;
  text-align: center;
  margin: 0px;
  padding: .5em;
}

select {
  font-size: 1.25rem;
  text-align: center;
}

.requiredicon {
  color:red;
}

body {
  margin: 0px;
}

.header_content {
  background-color: #A2ADBC;
  width: 100%;
  margin-left: 0%;
  margin-right: 0%;
  top: 0;
  position: sticky;
  z-index: 3;
  display: inline-block;
  padding: #{$header_padding}px 0px #{$header_padding}px;
}

.selectbuttons {
  height: calc(100% - #{$select_padding}px); /* Full-height: remove this if you want "auto" height */
  width: #{$sidebar_width}; /* Set the width of the sidebar */
  position: fixed; /* Fixed Sidebar (stay in place on scroll) */
  z-index: 1; /* Stay on top */
  top: calc(#{$button_fontsize} + #{$select_padding}px); /* Stay at the top */
  left: 0;
  background-color: #D9E2E1; /* Black */
  overflow-x: hidden; /* Disable horizontal scroll */
  margin-top: #{$select_padding}px;
  transition-timing-function: ease;
}

.selectbuttons select {
  max-width: 90%;
  width: auto;
}
.counts {
  width: 100%;
  padding-left: #{$sidebar_width};
  box-sizing: border-box;
}

.rightalign {
  float: right;
}
.leftalign {
  float: left;
}

.alldropdowns {
  margin-top: 20px;
}

.counts, .fullpagecounts {
  transition: 1s;
}
.sidebar-leave-active,
.sidebar-enter-active {
  transition: 1s;
}
.sidebar-enter {
  transform: translate(-100%, 0);
}
.sidebar-leave-to {
  transform: translate(-100%, 0);
}

.menubutton {
  font-size: 2em;
  width: 1.5em;
  padding: 0px;
  border: 0px solid white;
  background: none;
  margin-top: 5px;
}

.toolbar-icons {
  display: none
}

@media (max-width: 600px) {
  .headerbuttons:not(.menubutton) {
    font-size: .7em;
  }
}

@media (max-width: 499px) {
  .toolbar-icons {
    display: block;
  }
  .headerbuttons:not(.menubutton) {
    font-size: 1em;
  }
  .buttontext {
    display: none;
  }
}

@media (max-width: 240px) {
  .headerbuttons:not(.menubutton) {
    font-size: .7em;
    margin: 0px 3px 0px;
  }
  .menubutton {
    font-size: 1.5em;
  }
}
</style>
