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
      <button v-on:click="submitCounts()" class="headerbuttons rightalign" aria-label="finish collecting">
        <span class="buttontext">Finish collecting</span>
        <i class="fas fa-check-circle toolbar-icons"></i>
      </button>
    </div>
    <transition name="sidebar">
      <div class="selectbuttons" v-show="menuShown">
        <div class="alldropdowns">
          <select aria-label="initiative dropdown" id="initiativeDropdown" v-model="currentinit" v-on:change="updateInit()">
            <option disabled value="">Select an initiative</option>
            <option v-bind:value="item.initiativeId" v-for="item in initresults" v-bind:key="item.initiativeId" v-html="item.initiativeTitle">
            </option>
          </select>
          <tree-menu :key="currentinit" v-if="children.length > 0" @updatechildinit="updatechildinit"
          @addtocounts="addToCount(0)"
          :parentdata="$data"
          :nodes="children" :depth="0"></tree-menu>
        </div>
      </div>
    </transition>
    <div id="countsform" v-bind:class="[menuShown ? 'sidebarcounts' : 'fullpagecounts']">
      <div v-if="showcounts">
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
      <div v-else class="noloc">
        No current location
      </div>
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
import treeMenu from './tree'

var _ = require('lodash');

export default {
  name: 'SumaClient',
  components: {treeMenu},
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
      children: {},
      activities: {},
      childinit: {},
      counts: {},
      location: '',
      activityvalues: {},
      activityvaluesmulti: [],
      showcounts: false,
      locationtitle: '',
      buttonClickable: false,
      menuShown: true
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
    }
  },
  methods: {
    updatechildinit: function(data){
      if (!data.nodes){
        this.location = data.id;
        this.showcounts = true;
      }
      this.singleLocation(data.nodes);
      this.cleanValues();
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
      this.children = this.initdata.locations.children;
      //combine activityGroup data and initdata.activities in a object so the data is all together
      var activitykeys = this.initdata.activityGroups;
      var activities = _.groupBy(this.initdata.activities, 'groupId');

      this.location = '';
      this.showcounts = false;
      this.activities = {};
      for (var key in activities){
        var dictvalue = activitykeys.filter(elem => elem.id == key)[0];
        dictvalue['options'] = activities[key];
        this.activities[key] = dictvalue;
      }

      //Check to see if any required fields in the activies 
      this.buttonClickable = Object.keys(this.activities).map(elem => this.activities[elem].required).indexOf(true) == -1;
      this.singleLocation(this.children)
    },
    singleLocation: function(children) {
      if (children && children.length == 1) {
        this.$nextTick(() => {
          document.getElementById(children[0].id).click();
        })
      }
    },
    cleanValues: function(){
      this.resetActivityChecks();
      this.createLocationTitle();
    },
    createLocationTitle: function() {
      this.$nextTick(() => {
      var ullist = document.querySelector("ul > .selected");
      var titleposition = {}
      if (ullist) {
        var classposition = parseInt(ullist.closest("ul").className.replace("tree-menu", "").replace("level-", "").trim());
        while (classposition > 0){
          var title = ullist.closest(`ul.level-${classposition}`).getAttribute('data-label');
          titleposition[classposition] = title;
          classposition -= 1
        }
      }
      this.locationtitle = Object.values(titleposition).join(" | ")
      })
    },
    resetActivityChecks: function() {
      //unchecks all activities
      this.activityvalues = {};
      this.activityvaluesmulti = [];
      document.body.scrollTop = 0;
      document.documentElement.scrollTop = 0;
      this.requiredFieldsCheck();
    },
    sendCounts: function(syncObj, totals) {
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
          const locations = _.uniq(_.flatten(totals['locations'])).length;
          const total = totals['counts'];
          swal({
            title: "Counts submitted!",
            text: `${total} ${pluralize('counts',total)} (including "zero" counts) covering ${locations} ${pluralize('locations', locations)} in ${sessions} ${pluralize('initiatives',sessions)} has been sent to the server`,
            icon: "success"
          })
          this.clearCounts(true);
        }
      })
      .catch(error => {
        this.syncError();
        console.log(error);
      });
    },
    submitCounts: function(){
      //get data    
      localforage.getItem('queuedcounts').then((counts) => {
        var currentcounts = Object.values(this.counts);
        var allcounts = counts ? counts.concat(currentcounts) : currentcounts;
        localforage.setItem('queuedcounts', allcounts);
        var totals = _.reduce(allcounts, function(total, session) {
            total['counts'] += session.counts.length;
            total['locations'].push(session.counts.map(count => count.location))
            return total;
          }, {'counts': 0, 'locations': []})
        if (allcounts.length !== 0 && totals['counts'] !== 0){
          let syncObj = this.syncCountDict(allcounts);
          this.sendCounts(syncObj, totals);
        }
      })
      .then(() => { })
      .catch(function(err){
        console.error('There was an error '+err);
      });
    },
    syncError: function(){
      this.clearCounts()
      swal(`Sync error`,`Error sending data to server. This may be caused by issues including server outages and Wi-Fi \
            connectivity problems. The data will be retained by the browser. Please contact an administrator if \
            this doesn't resolve itself soon.`, "error");
    },
    clearCounts: function(clearqueue=false) {
      var initresults = this.initresults;
      var cachedinitdata = this.cachedinitdata;
      Object.assign(this.$data, this.$options.data.call(this));
      this.initresults = initresults;   
      this.cachedinitdata = cachedinitdata; 
      if (clearqueue){
        localforage.setItem('queuedcounts', []);
      }
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
        var removeitem = this.counts[this.currentinit]['counts'].filter(elem => elem.location == this.location).pop()
        if (removeitem){
          this.counts[this.currentinit]['counts'] = _.without(this.counts[this.currentinit]['counts'], removeitem)
        }
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
    },
    syncCountDict: function(counts) {
      var buildDict = JSON.stringify({
        'version': this.appVersion, 'device': this.device, 
        'sessions': counts
      });
      return buildDict;
    }
  }
}
</script>

<style lang="scss">
$header_padding: 10;
$select_padding: $header_padding*2;
$sidebar_width: 35%;
$button_fontsize: 1em;
$header_height: 3em;

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
  font-family: "Helvetica Neue", Arial, "Liberation Sans", FreeSans, sans-serif;
}

.header_content {
  background-color: #A2ADBC;
  width: 100%;
  margin-left: 0%;
  margin-right: 0%;
  right: 0;
  top: 0;
  position: fixed;
  z-index: 3;
  display: inline-block;
  padding: #{$header_padding}px 0px #{$header_padding}px;
  height: #{$header_height};
}

.selectbuttons {
  height: calc(100% - #{$header_height} - #{$select_padding}px);
  width: #{$sidebar_width}; 
  position: fixed; 
  z-index: 1; 
  top: calc(#{$header_height} + #{$select_padding}px);
  left: 0;
  background-color: #D9E2E1; /* Black */
  overflow-x: hidden; /* Disable horizontal scroll */
  transition-timing-function: ease;
}

.selectbuttons select {
  max-width: 98%;
  width: auto;
}

#countsform {
  width: 100%;
  margin-top: calc(#{$header_height} + #{$select_padding}px);
  transition: 1s;
}

.sidebarcounts {
  padding: 0px 0px 20px #{$sidebar_width};
  box-sizing: border-box;
}

.rightalign {
  float: right;
}
.leftalign {
  float: left;
}

.alldropdowns {
  margin: 20px 0px 20px 0px;
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
  li {
    font-size: .5em!important;
  }
  ul {
    transform: scale(1);
  }
  ul:not(.toplevel) {
    padding: 0px 10px 0px 10px!important;
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
  ul {
    transform: scale(1);
  }
  ul:not(.toplevel) {
    padding: 0px 10px 0px 10px!important;
  }
}

ul:not(.toplevel) {
  padding: 0px 20px 0px 20px;
}

.selected {
  font-weight: bold;
}

li {
  color: blue;
  margin-bottom: .1em;
  font-size: 19.5px;
}

.noloc {
  padding-top: 20px;
  font-size: 2em;
}
</style>
