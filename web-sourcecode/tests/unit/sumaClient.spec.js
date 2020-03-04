import { shallowMount, mount, createLocalVue} from '@vue/test-utils'
import VModal from 'vue-js-modal'
import SumaClient from '@/components/SumaClient.vue'
import flushPromises from 'flush-promises'
import VueRouter from 'vue-router'

const localVue = createLocalVue()
localVue.use(VueRouter)
localVue.use(VModal)
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
    
    expect(data.children).toEqual([{"id":4,"title":"West Wing","children":[{"id":5,"title":"Quiet Reading Room"},{"id":6,"title":"IT Teaching Center"}]},{"id":7,"title":"East Wing","children":[{"id":8,"title":"Media Lab"},{"id":9,"title":"Learning Commons"}]},{"id":2,"title":"Ground Floor"},{"id":3,"title":"Lobby"}])
    expect(data.showcounts).toBe(false)

    //select location from items
    const locationselect = wrapper.findAll('.level-1 > li');
    await locationselect.at(0).trigger('click');
    expect(data.currentinit).toBe("2")
    expect(data.children).toEqual([{"id":4,"title":"West Wing","children":[{"id":5,"title":"Quiet Reading Room"},{"id":6,"title":"IT Teaching Center"}]},{"id":7,"title":"East Wing","children":[{"id":8,"title":"Media Lab"},{"id":9,"title":"Learning Commons"}]},{"id":2,"title":"Ground Floor"},{"id":3,"title":"Lobby"}])
    expect(data.location).toBe("")
    expect(data.showcounts).toBe(false)

    //select second location
    const locationselect2 = wrapper.findAll('.level-2 > li');
    await locationselect2.at(0).trigger('click');
    const time = Math.round(Date.now() / 1000);
    var initiativedata = data.counts[data.currentinit];
    expect(data.currentinit).toBe("2")
    expect(data.location).toBe(5)
    expect(data.showcounts).toBe(true)
    expect(data.activities).toEqual({})
    expect(initiativedata['counts'][0]['number']).toEqual(0)
    expect(initiativedata['counts'][0]['location']).toEqual(5)
    expect(initiativedata['counts'].length).toEqual(1)
    expect(initiativedata["startTime"]).toEqual(initiativedata['counts'][0]['timestamp'])
    expect(initiativedata["initiativeID"]).toEqual("2")
    expect(initiativedata['counts']).toEqual([{"activities": [], "location": 5, "number": 0, "timestamp": time}])
    expect(wrapper.find(".countButton").text()).toContain("Count (0)")

    //click on count button
    wrapper.find("form").trigger("submit.prevent")
    await wrapper.vm.$nextTick();
    expect(initiativedata['counts'].length).toEqual(1)
    expect(initiativedata['counts'][0]['number']).toEqual(1)
    expect(initiativedata['counts'][0]['location']).toEqual(5)
    expect(initiativedata['counts'].length).toEqual(1)
    expect(Object.keys(initiativedata)).toEqual(["counts","initiativeID","startTime","endTime"])
    expect(initiativedata["initiativeID"]).toEqual("2")
    expect(wrapper.find(".countButton").text()).toContain("Count (1)")

    //click on count button fourteen times
    for (var i=0; i<14; i++){
      wrapper.find("form").trigger("submit.prevent")
      await wrapper.vm.$nextTick();
    }
    expect(initiativedata['counts'][0]['number']).toEqual(1)
    expect(initiativedata['counts'].length).toEqual(15)
    expect(initiativedata['counts'][0]['location']).toEqual(5)
    expect(Object.keys(initiativedata)).toEqual(["counts","initiativeID","startTime","endTime"])
    expect(initiativedata["initiativeID"]).toEqual("2")
    expect(wrapper.find(".countButton").text()).toContain("Count (15)")

    //choose another location from location tree
    await locationselect2.at(1).trigger('click');
    expect(data.currentinit).toBe("2")
    expect(data.location).toBe(6)
    expect(data.showcounts).toBe(true)
    expect(data.activities).toEqual({})
    expect(initiativedata['counts'][15]['number']).toEqual(0)
    expect(initiativedata['counts'][15]['location']).toEqual(6)
    expect(initiativedata['counts'].length).toEqual(16)
    expect(initiativedata["startTime"]).toEqual(initiativedata['counts'][0]['timestamp'])
    expect(initiativedata["initiativeID"]).toEqual("2")
    expect(wrapper.find(".countButton").text()).toContain("Count (0)")

    //add to counts. Check location count and init count
    wrapper.find("form").trigger("submit.prevent")
    await wrapper.vm.$nextTick();
    expect(initiativedata['counts'].length).toEqual(16)
    expect(Object.keys(initiativedata)).toEqual(["counts","initiativeID","startTime","endTime"])
    expect(initiativedata["initiativeID"]).toEqual("2")
    expect(wrapper.find(".countButton").text()).toContain("Count (1)")

    //click on already clicked initiative (make sure not to add zero count)
    await locationselect2.at(1).trigger('click');
    expect(initiativedata['counts'].length).toEqual(16)

    //switch back to first location clicked
    await locationselect2.at(0).trigger('click');
    expect(initiativedata['counts'].length).toEqual(16)
    expect(Object.keys(initiativedata)).toEqual(["counts","initiativeID","startTime","endTime"])
    expect(initiativedata["initiativeID"]).toEqual("2")
    expect(wrapper.find(".countButton").text()).toContain("Count (15)")
    expect(initiativedata['counts'].length).toEqual(16)

    //change initiative
    select.at(2).element.selected = true;
    wrapper.find('#initiativeDropdown').trigger('change');
    await flushPromises();
    await wrapper.vm.$nextTick();
    expect(data.currentinit).toBe("1")
    expect(data.showcounts).toBe(false)
    expect(data.activities).toEqual({"1": {"allowMulti": true, "id": 1, "options": [{"groupId": 1, "id": 1, "rank": 0, "title": "Reading"}, {"groupId": 1, "id": 2, "rank": 1, "title": "Computing"}, {"groupId": 1, "id": 3, "rank": 2, "title": "Collaborating"}, {"groupId": 1, "id": 4, "rank": 3, "title": "Training/Class"}], "rank": 1, "required": true, "title": "Type"}, "2": {"allowMulti": true, "id": 2, "options": [{"groupId": 2, "id": 5, "rank": 4, "title": "In-Person"}, {"groupId": 2, "id": 6, "rank": 5, "title": "Online"}], "rank": 2, "required": false, "title": "Medium"}})
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
    expect(data.currentinit).toBe("3")
    expect(data.activities).toEqual({"4": {"allowMulti": true, "id": 4, "options": [{"groupId": 4, "id": 8, "rank": 0, "title": "New Activity"}, {"groupId": 4, "id": 9, "rank": 1, "title": "test"}, {"groupId": 4, "id": 10, "rank": 2, "title": "test Activity 2"}], "rank": 0, "required": true, "title": "New Activity Group"}})
    expect(wrapper.find(".countButton").text()).toContain("Count (0)")
    expect(Object.keys(data.counts)).toEqual(["2", "3"])
    expect(data.location).toBe(11)
    expect(initiativedata['counts'][0]['number']).toEqual(0)
    expect(initiativedata['counts'][0]['location']).toEqual(11)
    expect(initiativedata['counts'].length).toEqual(1)
    expect(initiativedata["initiativeID"]).toEqual("3")
    expect(initiativedata['counts']).toEqual([{"activities": [], "location":11, "number": 0, "timestamp": time}])
    expect(wrapper.find(".countButton").text()).toContain("Count (0)")
  })
})