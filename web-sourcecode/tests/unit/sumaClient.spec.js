import { shallowMount, mount, createLocalVue} from '@vue/test-utils'
import VModal from 'vue-js-modal'
import SumaClient from '@/components/SumaClient.vue'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router'
import VueTippy from 'vue-tippy';

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(VModal)
localVue.use(VueTippy)
const router = new VueRouter()

let consoleSpy;
jest.mock('./__mocks__/axios');

describe('SumaClient.vue', () => {
  test('Testing Suma Client on Load', async () => {
    const wrapper = shallowMount(SumaClient, {localVue, router});
    await flushPromises();
    var data = wrapper.vm.$data;
    expect(data.currentinit).toBe('')
    expect(data.appVersion).toBe("1.1.0")
    expect(data.children).toEqual([])
    expect(data.initresults).toEqual([{"initiativeId":"2","initiativeTitle":"Sample Headcount Initiative"},{"initiativeId":"1","initiativeTitle":"Sample Reference Initiative"},{"initiativeId":"3","initiativeTitle":"test"}])
  })
  test('Update select options', async () => {
    const wrapper = mount(SumaClient, {localVue, router, attachToDocument: true});
    await flushPromises();

    var data = wrapper.vm.$data;

    //Select initiative from dropdown
    const select = wrapper.findAll('#initiativeDropdown > option');
    select.at(1).element.selected = true;
    wrapper.find('#initiativeDropdown').trigger('change');
    await flushPromises();
    await wrapper.vm.$nextTick()
    expect(data.currentinit).toBe("2")
    
    expect(data.children).toEqual([{"id":4,"title":"West Wing","description":"&lt;img src=&quot;https://www.lib.ncsu.edu/sites/default/files/hunt_level-1.jpg&quot;&gt;","children":[{"id":5,"title":"Quiet Reading Room","description":"quiet reading room &lt;a href=&quot;testing....&quot;&gt;testing&lt;/a&gt;","children":[{"id":12,"title":"below quiet with desc","description":"desc"},{"id":13,"title":"no desc","description":""}]},{"id":6,"title":"IT Teaching Center","description":""}]},{"id":7,"title":"East Wing","description":"east wing desc","children":[{"id":8,"title":"Media Lab","description":"","children":[{"id":14,"title":"New Location","description":"nested"},{"id":15,"title":"New Location no desc","description":""}]},{"id":9,"title":"Learning Commons","description":""}]},{"id":2,"title":"Ground Floor","description":""},{"id":3,"title":"Lobby","description":"test lobby"}])
    expect(data.showcounts).toBe(false)
    expect(data.locationtitle).toBe("")
    expect(data.locationDescription).toBe("")

    //select location from items
    const locationselect = wrapper.findAll('.level-1 .menuelement');
    await locationselect.at(0).trigger('click');
    expect(data.currentinit).toBe("2")
    expect(data.location).toBe("")
    expect(data.showcounts).toBe(false)
    expect(data.locationtitle).toBe("")
    expect(data.locationDescription).toBe("")

    //select second location
    const locationselect2 = wrapper.findAll('.level-2 .menuelement');
    await locationselect2.at(0).trigger('click');
    const locationselect3 = wrapper.findAll('.level-3 .menuelement');
    await locationselect3.at(0).trigger('click');

    const time = Math.round(Date.now() / 1000);
    var initiativedata = data.counts[data.currentinit];
    expect(data.currentinit).toBe("2")
    expect(data.location).toBe(12)
    expect(data.showcounts).toBe(true)
    expect(data.locationtitle).toBe("West Wing | Quiet Reading Room | below quiet with desc")
    expect(data.locationDescription).toBe('desc')
    expect(data.activityGroups).toEqual({})
    expect(initiativedata['counts'][0]['number']).toEqual(0)
    expect(initiativedata['counts'][0]['location']).toEqual(12)
    expect(initiativedata['counts'].length).toEqual(1)
    expect(initiativedata["initiativeID"]).toEqual("2")
    expect(initiativedata['counts']).toEqual([{"activities": [], "location": 12, "number": 0, "timestamp": time}])
    expect(wrapper.find(".countButton").text()).toBe("Count (0)")

    //click on count button
    wrapper.find("form").trigger("submit.prevent")
    await wrapper.vm.$nextTick();
    expect(initiativedata['counts'].length).toEqual(1)
    expect(initiativedata['counts'][0]['number']).toEqual(1)
    expect(initiativedata['counts'][0]['location']).toEqual(12)
    expect(initiativedata['counts'].length).toEqual(1)
    expect(Object.keys(initiativedata)).toEqual(["counts","initiativeID","startTime","endTime"])
    expect(initiativedata["initiativeID"]).toEqual("2")
    expect(wrapper.find(".countButton").text()).toBe("Count (1)")

    //click on count button fourteen times
    for (var i=0; i<14; i++){
      wrapper.find("form").trigger("submit.prevent")
      await wrapper.vm.$nextTick();
    }
    expect(initiativedata['counts'][0]['number']).toEqual(1)
    expect(initiativedata['counts'].length).toEqual(15)
    expect(initiativedata['counts'][0]['location']).toEqual(12)
    expect(Object.keys(initiativedata)).toEqual(["counts","initiativeID","startTime","endTime"])
    expect(initiativedata["initiativeID"]).toEqual("2")
    expect(wrapper.find(".countButton").text()).toBe("Count (15)")

    //choose another location from location tree
    await locationselect3.at(1).trigger('click');
    expect(data.currentinit).toBe("2")
    expect(data.location).toBe(13)
    expect(data.showcounts).toBe(true)
    expect(data.locationtitle).toBe("West Wing | Quiet Reading Room | no desc")
    expect(data.locationDescription).toBe("quiet reading room &lt;a href=&quot;testing....&quot;&gt;testing&lt;/a&gt;")
    expect(data.activityGroups).toEqual({})
    expect(initiativedata['counts'][15]['number']).toEqual(0)
    expect(initiativedata['counts'][15]['location']).toEqual(13)
    expect(initiativedata['counts'].length).toEqual(16)
    expect(initiativedata["startTime"]).toEqual(initiativedata['counts'][0]['timestamp'])
    expect(initiativedata["initiativeID"]).toEqual("2")
    expect(wrapper.find(".countButton").text()).toBe("Count (0)")

    //add to counts. Check location count and init count
    wrapper.find("form").trigger("submit.prevent")
    await wrapper.vm.$nextTick();
    expect(initiativedata['counts'].length).toEqual(16)
    expect(Object.keys(initiativedata)).toEqual(["counts","initiativeID","startTime","endTime"])
    expect(initiativedata["initiativeID"]).toEqual("2")
    expect(wrapper.find(".countButton").text()).toBe("Count (1)")

    //click on already clicked initiative (make sure not to add zero count)
    await locationselect3.at(1).trigger('click');
    expect(initiativedata['counts'].length).toEqual(16)

    //switch back to first location clicked
    await locationselect3.at(0).trigger('click');
    expect(initiativedata['counts'].length).toEqual(16)
    expect(Object.keys(initiativedata)).toEqual(["counts","initiativeID","startTime","endTime"])
    expect(initiativedata["initiativeID"]).toEqual("2")
    expect(wrapper.find(".countButton").text()).toBe("Count (15)")
    expect(initiativedata['counts'].length).toEqual(16)

    //change initiative
    select.at(2).element.selected = true;
    wrapper.find('#initiativeDropdown').trigger('change');
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(data.currentinit).toBe("1")
    expect(data.location).toBe("")
    expect(data.showcounts).toBe(false)
    expect(data.activityGroups).toEqual({"1":{"id":1,"title":"Type","rank":1,"required":true,"allowMulti":true,"description":"","activities":[{"id":1,"title":"Reading","rank":0,"groupId":1},{"id":2,"title":"Computing","rank":1,"groupId":1},{"id":3,"title":"Collaborating","rank":2,"groupId":1},{"id":4,"title":"Training/Class","rank":3,"groupId":1}]},"2":{"id":2,"title":"Medium","rank":2,"required":false,"allowMulti":true,"description":"","activities":[{"id":5,"title":"In-Person","rank":4,"groupId":2},{"id":6,"title":"Online","rank":5,"groupId":2}]}})
    expect(wrapper.findAll(".countButton").length).toBe(0)
    expect(data.counts[data.currentinit]).toBe(undefined)
    expect(Object.keys(data.counts)).toEqual(["2"])

    //change initiative with one location
    select.at(3).element.selected = true;
    wrapper.find('#initiativeDropdown').trigger('change');
    await flushPromises();
    await wrapper.vm.$nextTick();
    initiativedata = data.counts[data.currentinit];
    expect(data.showcounts).toBe(true)
    expect(data.locationtitle).toBe("location test")
    expect(data.locationDescription).toBe("")
    expect(data.currentinit).toBe("3")
    expect(data.activityGroups).toEqual({"4": {"allowMulti": true, "id": 4, "activities": [{"groupId": 4, "id": 8, "rank": 0, "title": "New Activity"}, {"groupId": 4, "id": 9, "rank": 1, "title": "test"}, {"groupId": 4, "id": 10, "rank": 2, "title": "test Activity 2"}], "rank": 0, "required": true, "title": "New Activity Group"}})
    expect(wrapper.find(".countButton").text()).toBe("Count (0)")
    expect(Object.keys(data.counts)).toEqual(["2", "3"])
    expect(data.location).toBe(11)
    expect(initiativedata['counts'][0]['number']).toEqual(0)
    expect(initiativedata['counts'][0]['location']).toEqual(11)
    expect(initiativedata['counts'].length).toEqual(1)
    expect(initiativedata["initiativeID"]).toEqual("3")
    expect(initiativedata['counts']).toEqual([{"activities": [], "location":11, "number": 0, "timestamp": time}])
    expect(wrapper.find(".countButton").text()).toBe("Count (0)")

    const rightalignbuttons = wrapper.findAll('.rightalign').at(1).trigger('click')
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(data.counts).toEqual({})
    expect(data.currentinit).toBe("3")
    expect(data.children).toEqual([{"id": 11, "title": "location test"}])
    expect(data.location).toBe(11)
    expect(data.showcounts).toBe(true)
    expect(data.locationtitle).toBe("location test")
    expect(data.locationDescription).toBe("")
    expect(wrapper.find(".countButton").text()).toEqual("Count")
  })
})