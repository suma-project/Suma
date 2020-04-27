<template>
  <div role="main">
    <div class="header_content">
      <button v-on:click="menuShown = !menuShown" class="menubutton headerbuttons leftalign" v-bind:class="{'fa-stack fa-1x': menuShown}" aria-label="toggle menu">
          <span v-if="!menuShown">
            <i class="fas fa-bars"></i>
          </span>
          <span v-else>
            <i class="fas fa-bars fa-stack-1x"></i>
            <i class="fas fa-caret-left fa-stack-1x barcaret"></i>
            <span class="fa-stack-text arrowpadding">|</span>
          </span>
      </button>
      <button v-on:click="resetCounts()" class="headerbuttons leftalign" aria-label="Abandon all counts" v-bind:disabled="hasNoCounts">
        <span class="buttontext">Abandon All Counts</span>
        <i class="fas fa-trash-alt toolbar-icons"></i>
      </button>
      <button v-on:click="undoLastCount()" class="headerbuttons leftalign" aria-label="Undo last count" v-bind:disabled="compCounts===''">
        <span class="buttontext">Undo Last Count</span>
        <i class="fas fa-undo toolbar-icons"></i>
      </button>
      <div v-if="!settings.hideDateTime" v-html="datetime" class="datetime filler"></div>
      <div v-if="settings.hideDateTime" class="filler"></div>
      <button v-if="ignoreSettings.length < 4" v-on:click="$modal.show('settings')" class="headerbuttons rightalign" aria-label="settings">
        <i class="fas fa-cog"></i>
      </button>
      <button v-on:click="submitCounts()" id="finishcollecting" class="headerbuttons rightalign" aria-label="finish collecting" v-bind:disabled="hasNoCounts">
        <span class="buttontext">Finish collecting</span>
        <i class="fas fa-check-circle toolbar-icons"></i>
      </button>
    </div>
    <modal name="settings">
      <i class="fas fa-times closemodal" v-on:click="$modal.hide('settings')"></i>      
      <h2 class="settingsheader" style="text-align:center;">Settings</h2>
      <div class="settingslist">
        <div v-if="ignoreSettings.indexOf('hideDateTime') == -1">
          <label for="hideDateTime">Hide Date Time</label>
          <input type="checkbox" id="hideDateTime" v-model.lazy="settings['hideDateTime']">
        </div>
        <div v-if="ignoreSettings.indexOf('multiCount') == -1">
          <label for="multiCount">Show Multi Count</label>
          <input type="checkbox" id="multiCount" v-model.lazy="settings['multiCount']">
        </div>
        <div v-if="ignoreSettings.indexOf('lastCount') == -1">
          <label for="lastCount">Show Last Count</label>
          <input type="checkbox" id="lastCount" v-model.lazy="settings['lastCount']">
        </div>
        <div v-if="ignoreSettings.indexOf('requireLocations') == -1">
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
          <button v-if="compCounts" v-on:click="resetInitCountsByLocation(location)" class="resetloccounts">
            <span class="buttontext">Reset location counts</span>
            <i class="fas fa-ban toolbar-icons"></i>
          </button>
          <span v-html="locationtitle"></span> 
          <i class="fas fa-info-circle" :content="locationDescription | unescapeFilter" v-if="locationDescription" v-tippy="{ theme : 'info', arrow: true, interactive : true, placement : 'top', trigger : 'click', 'maxWidth': '1000px'}"></i>     
        </h3>
        <div v-if="settings.lastCount && lastCount">Last count for <span v-html="locationtitle"></span> recorded at: {{lastCount}}</div>
        <form @submit.prevent="addToCount(countNumber)">
          <div v-if="Object.keys(activityGroups).length > 0" class="activityGroups">
            <div v-for="(value, key) in activityGroups" v-bind:key="key" class="activityGroup" v-bind:class="{required: value.required}">
              <h3 class="activityTitle">
                <span v-html="value.title"></span>
                <span v-if="value.required" class="requiredicon">*</span>
                <span v-if="value.allowMulti" class="instructions"> (Choose one or more)</span>
                <span v-else class="instructions"> (Select one)</span> 
                <i class="fas fa-info-circle" :content='value.description | unescapeFilter' v-if="value.description" v-tippy="{ theme : 'info', arrow: true, interactive : true, placement : 'top' }"></i>
              </h3>
              <div id="activityButton" v-for="activity in value.activities" v-bind:key="activity.id">
                <label>
                  <input type="checkbox" v-bind:name="value.id" v-on:click="requiredFieldsCheck()" class="button" v-if="value.allowMulti" v-bind:id="activity.id" v-bind:value="activity.id" v-model="activityvaluesmulti">
                  <input type="radio" v-bind:name="value.id" v-on:click="deselect(activity.id, key)" v-else-if="!value.allowMulti" v-bind:id="activity.id" v-bind:value="activity.id" v-model="activityvalues[key]">
                  <span v-html="activity.title"></span>
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
      activityGroups: {},
      counts: {},
      location: '',
      activityvalues: {},
      activityvaluesmulti: [],
      showcounts: false,
      locationtitle: '',
      buttonClickable: false,
      menuShown: true,
      settings: this.$route.query,
      ignoreSettings: Object.keys(this.$route.query),
      countNumber: 1,
      datetime: '',
      locationDescription: ''
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
        if(!this.settings.hideDateTime){
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
      //Used when an item in the <tree> component is clicked
      //if the link does not have children then set location and show counts
      if (!data.nodes){
        this.location = data.id;
        this.locationDescription = data.description;
        this.locationtitle = data.title;
        this.showcounts = true;
      }
      this.singleLocation(data.nodes);
      this.resetActivityChecks();
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
      //get local forage data from indexDB for each field, load into vue field
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
        .then((savedCounts) => { 
          if(savedCounts && item == 'counts'){this.submitCounts();}
          else if (item == 'settings') {this.settings = Object.assign ( this.settings, this.$route.query )}  
        })
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
      //triggered when dropdown options are changed
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
      this.activityGroups = {};
      for (var key in activities){
        var dictvalue = activitykeys.filter(elem => elem.id == key)[0];
        dictvalue['activities'] = activities[key];
        this.activityGroups[key] = dictvalue;
      }

      //Check to see if any required fields in the activies 
      this.buttonClickable = Object.keys(this.activityGroups).map(elem => this.activityGroups[elem].required).indexOf(true) == -1;
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
    resetActivityChecks: function() {
      //unchecks all activities and scrolls to top of page
      this.activityvalues = {};
      this.activityvaluesmulti = [];
      this.countNumber = 1;
      document.getElementById('countsform').scrollTop = 0;
      this.requiredFieldsCheck();
    },
    sendCounts: function(syncObj, totals) {
      axios.post(this.syncurl, `json=${syncObj}`, {
        headers: { 'content-type': 'application/x-www-form-urlencoded'},
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
            text: `${total} ${pluralize('counts',total)} (including "zero" counts) covering ${locations} ${pluralize('locations', locations)} in ${sessions} ${pluralize('sessions',sessions)} has been sent to the server`,
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
        //merges queued counts (counts that had previously been sent but failed due problem with server/etc)
        //with counts currently in localforage
        var currentcounts = Object.values(this.counts);
        var allcounts = counts ? counts.concat(currentcounts) : currentcounts;
        //sets queued counts to merged counts
        localforage.setItem('queuedcounts', allcounts);
        //checks all counts and gets locals of locations and counts
        var totals = allcounts.reduce(function(total, session) {
            total['counts'] += shared.getCounts(session, false, false);
            total['locations'].push(session.counts.map(count => count.location))
            return total;
          }, {'counts': 0, 'locations': []})
        var locationscheck = this.requiredLocationsCheck;
        //if there are counts and requiredLocationsCheck is passed (auto passes when setting is not enabled) then send counts
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
      this.resetActivityChecks();
    },
    syncError: function(){
      //called when there is a sync error in post request. Clears out counts but preserves queued counts
      this.clearCounts()
      swal.fire(`Sync error`,`Error sending data to server. This may be caused by issues including server outages and Wi-Fi \
            connectivity problems. The data will be retained by the browser. Please contact an administrator if \
            this doesn't resolve itself soon.`, "error");
    },
    clearCounts: function(clearqueue=false) {
      //clears counts and if sent successfully will clear out queued counts. By default will not clear queued counts
      this.counts = {}
      if (clearqueue){
        localforage.setItem('queuedcounts', []);
      }
    },
    resetCounts: function(){
      //Called when "abandon all counts" button is clicked.
      //will not clear queued counts because user has already hit finished collecting or closed the previous session
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
      //removes any initiative data where all the counts have been removed
      //i.e. this.counts[2] = {'startTime': '12345', 'endtime':'12345', 'counts': []}
      this.counts = _.omitBy(this.counts, v => v['counts'].length===0);
    },
    resetInitCountsByLocation: function(locationID){
      //clears counts for a specific location. Called when "reset location counts" button is clicked
      var cleancomp = parseInt(this.compCounts.match(/\d+/)[0])
      swal.fire({
        title: `Reset ${cleancomp} ${pluralize('counts',cleancomp)} for ${this.locationtitle}`,
        text: `Are you sure you want to delete the data you've just collected? All data you've collected for ${this.locationtitle} be deleted permanently.`,
        confirmButtonText: "RESET",
        showCancelButton: true,
      }).then(parameters => {
        if (parameters.value == true) {
          _.remove(this.counts[this.currentinit]['counts'], v => v.location === locationID);
          this.cleanEmptyInitCounts();
        } 
      }).catch(err => {
        console.log(err)
      });
    },
    undoLastCount: function(){
      //undoes the last count on current location. Called when "undo last count" button is clicked
      if (this.counts[this.currentinit] && this.counts[this.currentinit]['counts'].length > 0){
          let localCounts = this.locationCounts();
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
      var countDict = this.counts[this.currentinit] ?? {'counts':[], 'initiativeID': this.currentinit, 'startTime': timestamp}; 
      var location = this.location;
      //remove all zero counts for current location
      _.remove(countDict['counts'], function(elem) {
        return elem.location == location && elem.number == 0;
      });
      // if number is zero and there are already counts at that location do not add a zero count
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
      //builds JSON to get sent across axios request
      var buildDict = JSON.stringify({
        'version': this.appVersion, 'device': this.device, 
        'sessions': counts
      });
      return buildDict;
    },
    getDateTime: function() {
      //used for settings 'dateTime' function.
      var now = Date.now()
      var date = new Date(now);
      return `${date.toDateString()}<br>${date.toLocaleTimeString()}`
    },
    locationCounts: function() {
      //returns a list of counts for current location
      var counts = ''
      if (this.counts[this.currentinit] && this.counts[this.currentinit]['counts']){
        counts = this.counts[this.currentinit]['counts'].filter(elem => elem.location == this.location);
      }
      return counts
    }
  },
  computed: {
    compCounts: function() {
      //gets current location counts. Called for button counts
      return shared.getCounts(this.counts[this.currentinit], this.location)
    },
    hasNoCounts: function() {
      //check to see if location has no counts. Used to disable buttons
      return Object.keys(this.counts).length === 0 && this.counts.constructor === Object;
    },
    lastCount: function(){
      //gets the last count for current location. Used for 'lastCount' setting.
      var counts = this.locationCounts();
      var returnvalue = ''
      if (counts.length > 0){
        var timestamp = new Date(counts.pop().timestamp*1000);
        returnvalue = timestamp.toLocaleTimeString()
      }
      return returnvalue
    },
    requiredLocationsCheck: function() {
      //checks to see if all locations have counts if 'requireLocations' setting is enabled.
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
      //unescapes data from API for desc
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

.activityGroups {
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
  align-items: center;
  
  * {
    margin: 0 0.5em 0 0.5em;
  }

  .fa-info-circle {
    margin: -5px;
  }

  span {
    align-self: center;
  }
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
  height: 1em;
  line-height: 1em;
  border: 0px solid white;
  background: none;
  margin-top: 10px;
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
  li button {
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
  a {
    color: lightblue;
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

  div  {
    padding: 5px;
    font-size: 1.2em;
  }

  label {
    padding-right: 10px;
  }

  input[type=checkbox] {
    transform: scale(1.8);
  }
}

.closemodal {
  float:right;
  font-size:2em;
  padding:5px;
}

.arrowpadding {
  font-size:.40em; 
  color: #A2ADBC; 
  height: 8px; 
  position: relative;
  margin-right:13px;
  vertical-align:top; 
  font-weight:900;
  font-family: Verdana, Arial, Helvetica, sans-serif;
}

.barcaret {
  color:black;
  text-align:left;
  margin-left: 8px;
  font-size:.7em
}
</style>
