<template>
  <div>
    <div class="header_content">
      <button v-on:click="menuShown = !menuShown" class="headerbuttons leftalign menubutton" aria-label="toggle menu">
        <i class="fas fa-bars" v-if="!menuShown"></i>
        <i class="fas fa-times" v-else></i>
      </button>
      <button v-on:click="resetCounts()" class="headerbuttons leftalign" aria-label="Abandon all counts" v-bind:disabled="hasNoCounts">
        <span class="buttontext">Abandon All Counts</span>
        <i class="fas fa-trash-alt toolbar-icons"></i>
      </button>
      <button v-on:click="undoLastCount()" class="headerbuttons leftalign" aria-label="Undo last count" v-bind:disabled="compCounts===''">
        <span class="buttontext">Undo Last Count</span>
        <i class="fas fa-undo toolbar-icons"></i>
      </button>
      <div v-if="settings.dateTime && settings.dateTime != 'hide'" v-html="datetime" class="datetime filler"></div>
      <div v-if="!settings.dateTime || settings.dateTime == 'hide'" class="filler"></div>
      <button v-on:click="$modal.show('settings')" class="headerbuttons rightalign" aria-label="settings">
        <i class="fas fa-cog"></i>
      </button>
      <button v-on:click="submitCounts()" class="headerbuttons rightalign" aria-label="finish collecting" v-bind:disabled="hasNoCounts">
        <span class="buttontext">Finish collecting</span>
        <i class="fas fa-check-circle toolbar-icons"></i>
      </button>
    </div>
    <modal name="settings">
      <i class="fas fa-times closemodal" v-on:click="$modal.hide('settings')"></i>      
      <h2 class="settingsheader" style="text-align:center;">Settings</h2>
      <div class="settingslist">
        <div>
          <select id="datetime" v-model="settings.dateTime">
            <option value="" disabled>Select Date/Time Option</option>
            <option value="time">Time</option>
            <option value="date">Date</option>
            <option value="true">Date and Time</option>
            <option value="hide">Hide</option>
          </select>
        </div>
        <div>
          <label for="multiCount">Show Multi Count</label>
          <input type="checkbox" id="multiCount" v-model.lazy="settings['multiCount']">
        </div>
        <div>
          <label for="lastCount">Show Last Count</label>
          <input type="checkbox" id="lastCount" v-model.lazy="settings['lastCount']">
        </div>
        <div>
          <label for="requireLocations">Require All Locations</label>
          <input type="checkbox" id="requireLocations" v-model.lazy="settings['requireLocations']">
        </div>
      </div>
    </modal>
    <transition name="sidebar">
      <div class="selectbuttons" v-show="menuShown">
        <div class="alldropdowns">
          <select v-bind:disabled="!requiredLocationsCheck.passed" aria-label="initiative dropdown" id="initiativeDropdown" v-model="currentinit" v-on:change="updateInit()">
            <option disabled value="">Select an initiative</option>
            <option v-bind:value="item.initiativeId" v-for="item in initresults" v-bind:key="item.initiativeId" v-html="item.initiativeTitle">
            </option>
          </select>
          <tree-menu :key="currentinit" v-if="children.length > 0" @clickLocation="clickLocation"
          @addtocounts="addToCount(0)"
          :parentdata="$data"
          :nodes="children" :depth="0"></tree-menu>
        </div>
      </div>
    </transition>
    <div id="countsform" v-bind:class="[menuShown ? 'sidebarcounts' : 'fullpagecounts']">
      <div v-if="showcounts">
        <h3 id="current_loc_label">
          <span v-html="this.locationtitle"></span> 
          <button v-if="compCounts" v-on:click="resetInitCountsByLocation(location)" class="resetloccounts">
            <span class="buttontext">Reset location counts</span>
            <i class="fas fa-ban toolbar-icons"></i>
          </button>
        </h3>
        <div v-if="settings.lastCount && lastCount">Last count for <span v-html="this.locationtitle"></span> recorded at: {{lastCount}}</div>
        <form @submit.prevent="addToCount(countNumber)">
          <div v-if="Object.keys(activities).length > 0" class="activities">
            <div v-for="(value, key) in activities" v-bind:key="key" class="activityGroup" v-bind:class="{required: value.required}">
              <h3 class="activityTitle">
                <span v-html="value.title"></span>
                <span v-if="value.required" class="requiredicon">*</span>
                <span v-if="value.allowMulti" class="instructions"> (Choose one or more)</span>
                <span v-else class="instructions"> (Select one)</span> 
                <i class="fas fa-info-circle " :content='value.description | unescapeFilter' v-if="value.description" v-tippy="{ theme : 'info', arrow: true, interactive : true, placement : 'top' }"></i>
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
          <input type="number" v-if="settings.multiCount" id="inputCount" value="1" min="0" v-model="countNumber"/>
          <button type="submit" v-bind:disabled="!buttonClickable" v-bind:enabled="buttonClickable" class="countButton">Count{{ compCounts }}</button>
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
import swal from 'sweetalert2'
import pluralize from 'pluralize';
import treeMenu from './tree';
import shared from './compontentFunctions';

var _ = require('lodash');

export default {
  name: 'SumaClient',
  components: {treeMenu},
  data: function() {
    return {
      initresults: '',
      currentinit: '',
      cachedinitdata: {},
      initurl: initiativeUrl,
      baseiniturl: baseInitUrl,
      syncurl: syncUrl,
      appVersion: process.env.VUE_APP_VERSION,
      device: '',
      children: [],
      activities: {},
      counts: {},
      location: '',
      activityvalues: {},
      activityvaluesmulti: [],
      showcounts: false,
      locationtitle: '',
      buttonClickable: false,
      menuShown: true,
      settings: this.$route.query,
      countNumber: 1,
      datetime: ''
    }
  },
  created() {
    this.getDeviceData();
    //load and submit any old counts
    this.loadLocalForageData();

    this.loadInitInfo();

    this.loadInitData();
  },
  destroyed() {
    clearInterval(this.interval);    
  },
  watch: {
    currentinit: function(){
      localforage.setItem('currentinit', this.currentinit);
    },
    children: {
      handler: function() {
        localforage.setItem('children', this.children);
      },
      deep: true
    },
    cachedinitdata: function (data) {
      localforage.setItem('cachedinitdata', data);
    },
    counts: {
      handler: function() {
        localforage.setItem('counts', this.counts);
      },
      deep: true
    },
    settings: {
      handler: function(data) {
        if(this.settings.dateTime != 'hide'){
          this.interval = setInterval(() => {
            this.datetime = this.getDateTime();
          },1000); 
        } else {
          clearInterval(this.interval); 
        }
        localforage.setItem('settings', data);
      },
      deep: true
    } 
  },
  methods: {
    clickLocation: function(data){
      if (!data.nodes){
        this.location = data.id;
        this.showcounts = true;
      }
      this.singleLocation(data.nodes);
      this.resetActivityChecks();
      this.createLocationTitle();
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
    loadLocalForageData: function(getItems=['counts', 'settings', 'currentinit', 'children']){
      //get counts field from indexDB, load into data
      for (var i=0; i<getItems.length; i++){
        const item = getItems[i];
        localforage.getItem(item).then((counts) => {
          if(counts != null){
            this[item] = counts;
            return true;
          } else {
            return false;
          }
        })
        .then((savedCounts) => { if(savedCounts && item == 'counts'){this.submitCounts();} })
        .catch(function(err){
          console.error('There was an error '+err);
        });
      }
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
      this.children = [];
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
      this.children = data.locations.children;
      
      //combine activityGroup data and initdata.activities in a object so the data is all together
      var activitykeys = data.activityGroups;
      var activities = _.groupBy(data.activities, 'groupId');

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
      //check to see if there is only one location. 
      //if there is only one location click on that location.
      if (children && children.length == 1) {
        this.$nextTick(() => {
          document.getElementById(children[0].id).click();
        })
      }
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
      this.countNumber = 1;
      document.getElementById('countsform').scrollTop = 0;
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
          swal.fire({
            title: "Counts submitted!",
            text: `${total} ${pluralize('counts',total)} (including "zero" counts) covering ${locations} ${pluralize('locations', locations)} in ${sessions} ${pluralize('initiatives',sessions)} has been sent to the server`,
            icon: "success"
          })
          this.clearCounts(true);
        }
      })
      .catch(error => {
        this.syncError();
        console.log(error.response);
      });
    },
    submitCounts: function(){
      //get data    
      localforage.getItem('queuedcounts').then((counts) => {
        var currentcounts = Object.values(this.counts);
        var allcounts = counts ? counts.concat(currentcounts) : currentcounts;
        localforage.setItem('queuedcounts', allcounts);
        var totals = allcounts.reduce(function(total, session) {
            total['counts'] += shared.getCounts(session, false, false);
            total['locations'].push(session.counts.map(count => count.location))
            return total;
          }, {'counts': 0, 'locations': []})
        var locationscheck = this.requiredLocationsCheck;
        if (allcounts.length !== 0 && totals['counts'] !== 0 && locationscheck.passed){
          let syncObj = this.syncCountDict(allcounts);
          this.sendCounts(syncObj, totals);
        } else if(!locationscheck.passed) {
          swal.fire({
            title: "Missing Locations!",
            html: `${locationscheck.text} is missing a count.
            Make sure all locations have at least a zero count.`,
            icon: "warning"
          })
        }
      })
      .then(() => { })
      .catch(function(err){
        console.error('There was an error '+err);
      });
    },
    syncError: function(){
      this.clearCounts()
      swal.fire(`Sync error`,`Error sending data to server. This may be caused by issues including server outages and Wi-Fi \
            connectivity problems. The data will be retained by the browser. Please contact an administrator if \
            this doesn't resolve itself soon.`, "error");
    },
    clearCounts: function(clearqueue=false) {
      this.counts = {}
      this.loadLocalForageData(['currentinit', 'children']);
      if (clearqueue){
        localforage.setItem('queuedcounts', []);
      }
    },
    resetCounts: function(){
      swal.fire({
        title: 'Abandon Session',
        text: "Are you sure you want to delete the data you've just collected? All data you've collected will be deleted permanently.",
        confirmButtonText: "DELETE",
        cancelButtonText: "Keep Collecting",
        showCancelButton: true,
      }).then(parameters => {
        if (parameters.value == true) {
          this.clearCounts();    
        } 
      }).catch(err => {
        console.log(err)
      });
    },
    cleanEmptyInitCounts: function(){
      this.counts = _.omitBy(this.counts, v => v['counts'].length===0);
    },
    resetInitCountsByLocation: function(locationID){
      _.remove(this.counts[this.currentinit]['counts'], v => v.location === locationID);
      this.cleanEmptyInitCounts();
    },
    undoLastCount: function(){
      if (this.counts[this.currentinit] && this.counts[this.currentinit]['counts'].length > 0){
          let localCounts = this.locationCounts(this.location);
          var removeitem = localCounts.pop();          
          if (removeitem){
            this.counts[this.currentinit]['counts'] = _.without(this.counts[this.currentinit]['counts'], removeitem);
            if(localCounts.length ===0){
             switch(removeitem.number) {
               case 0:
                 this.cleanEmptyInitCounts();
                 break;
               case 1:
                 this.addToCount(0);
                 break;
              }
            }
          }
        }
      this.resetActivityChecks();
    },
    addToCount: function(number){
      //called when count button pressed; adds new counts for each initiative
      var timestamp = Math.round(Date.now() / 1000);
      var activities = this.activityvaluesmulti.concat(Object.values(this.activityvalues));
      var countDict = this.counts[this.currentinit] ? this.counts[this.currentinit] : {'counts':[], 'initiativeID': this.currentinit, 'startTime': timestamp}; 
      var location = this.location;
      _.remove(countDict['counts'], function(elem) {
        return elem.location == location && elem.number == 0;
      });
      let check = number==0 ? countDict['counts'].filter(count => count.location == this.location ).length  == 0 : true;
      if(check) {
        countDict['counts'].push({'timestamp': timestamp,'location': this.location, 'activities': activities, 'number': parseInt(number)});
        countDict['endTime'] = timestamp;
        this.$set(this.counts,this.currentinit, countDict);
      }
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
    },
    getDateTime: function() {
      var now = Date.now()
      var date = new Date(now);
      switch(this.settings.dateTime) {
        case 'time':
          return date.toLocaleTimeString();
        case 'date':
          return date.toDateString();
        default:
          return `${date.toDateString()}<br>${date.toLocaleTimeString()}`;
      }
    },
    locationCounts: function() {
      var counts = ''
      if (this.counts[this.currentinit] && this.counts[this.currentinit]['counts']){
        counts = this.counts[this.currentinit]['counts'].filter(elem => elem.location == this.location);
      }
      return counts
    }
  },
  computed: {
    compCounts: function() {
      return shared.getCounts(this.counts[this.currentinit], this.location)
    },
    hasNoCounts: function() {
      return Object.keys(this.counts).length === 0 && this.counts.constructor === Object;
    },
    lastCount: function(){
      var counts = this.locationCounts();
      var returnvalue = ''
      if (counts.length > 0){
        var timestamp = new Date(counts.pop().timestamp*1000);
        returnvalue = timestamp.toLocaleTimeString()
      }
      return returnvalue
    },
    requiredLocationsCheck: function() {
       if (this.settings.requireLocations) {
         var lowestlevel = Array.from(document.getElementsByClassName('lowestlocation'));
         var requiredlocations = lowestlevel.map(lle => parseInt(lle.id));
         var currentlocations = [] 
         if (this.counts[this.currentinit]){
           currentlocations = this.counts[this.currentinit]['counts'].map(count => count.location)
         }
         var passedCheck = _.difference(requiredlocations, currentlocations);
         if (passedCheck.length == 0 || passedCheck.length == requiredlocations.length) {
           return {'passed': true}
         } else {
           var items = passedCheck.map(elem => document.getElementById(elem).innerText)
           return {'text':items.join('<br>'), 'passed': false};
         }
       } else {
         return {'passed':true};
       }
     }
  },
  filters: {
    unescapeFilter: function (value) {
      return _.unescape(value)
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
$tippy_backgroundcolor: #2c3e50;
$tippy_textcolor: white;

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



#activityButton, .headerbuttons, .resetloccounts{
  text-align:center;
  padding:13px 10px;
  display:inline-block;
  border-radius:4px;
  background: #D7EBF9;
  font-weight: bold;
  border: 1px solid #aed0ea;

  button:not([disabled]) {
    color: #184A67;
  }
}

#activityButton span {
  padding: .8em 1.1em;
  width: auto;
  display: inline-block;
}

#activityButton {
  margin:4px;
  padding: 0px;
}

#activityButton label {
  height:100%;
  display: block;
}

.resetloccounts {
  margin-left: 6px;
}

#current_loc_label span {
  align-self: center;
}

.filler{
  flex-grow:1;
  text-align:center;
}

.headerbuttons {
  font-size: #{$button_fontsize};
  margin: 0px 10px 0px;
}

.datetime {
  text-align: center;
  align-self: center;
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

.instructions {
  margin-top: 1px;
}

.activityTitle {
  padding-bottom: 0px;
  margin-bottom: 0px;
}
i.fa-info-circle {
  margin-left: 10px;
  color: #2c3e50;
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
  max-width: 100%;
  display: inline-flex;
  justify-content: center;
}

#current_loc_label {
  font-size: 1.6em;
  border-bottom: 1px dotted;
  text-align: center;
  margin: 0px;
  padding: .5em;
  display: flex;
  justify-content: center;
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
  display: flex;
  justify-content: center;
}

button {
  touch-action: manipulation;
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
  overflow: auto;
  height: calc(100% - #{$header_height} - #{$select_padding}px);
  position: fixed;
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

@media (max-width: 755px) {
  .headerbuttons:not(.menubutton) {
    font-size: .7em;
  }
}

@media (max-width: 630px) {
  .headerbuttons:not(.menubutton) {
    margin: 0px 2px 0px;
    padding: 10px 5px;
  }
  .datetime {
    font-size: .8em;
  }
  .menubutton {
    margin-left: 0px;
    margin-right: 0px;
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
    font-size: 1em!important;
  }
  ul {
    transform: scale(1);
  }
  ul:not(.toplevel) {
    padding: 1px 5px 1px 10px!important;
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
    padding: 1px 5px 1px 10px!important;
  }
}

ul:not(.toplevel) {
  padding: 1px 5px 1px 20px;
}

.selected {
  font-weight: bold;
}

li {
  color: blue;
  font-size: 19.5px;
  padding-top: .25em;
  padding-bottom: .25em;
}

.noloc {
  padding-top: 20px;
  font-size: 2em;
}

#inputCount {
  width: 10%;
  float: right;
  height: 50px;
  font-size: 2em;
  margin-bottom: 30px;
  text-align: center;
}
.tippy-tooltip.info-theme {
  background-color: #{$tippy_backgroundcolor};
  color: #{$tippy_textcolor};
  * {
    max-width: 100%;
  }
  .tippy-backdrop {
    background-color: #{$tippy_backgroundcolor};
  }
  .tippy-arrow {
    border-top-color: #{$tippy_backgroundcolor};
  }
}

.settingslist {
  display:flex;
  align-items:center;
  justify-content:center;
  flex-direction:column;
}

.closemodal {
  float:right;
  font-size:2em;
  padding:5px;
}
</style>
