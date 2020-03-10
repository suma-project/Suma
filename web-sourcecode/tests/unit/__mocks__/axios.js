
module.exports = {
  get: jest.fn((url) => {
  if (url === 'http://localhost:19679/sumaserver/clientinit/') {
    return Promise.resolve({
        data: [{"initiativeId":"2","initiativeTitle":"Sample Headcount Initiative"},{"initiativeId":"1","initiativeTitle":"Sample Reference Initiative"},{"initiativeId":"3","initiativeTitle":"test"}]
    });
  }
  if (url === 'http://localhost:19679/sumaserver/clientinit/load/initiative/1') {
    return Promise.resolve({
        data: {"initiativeId":1,"initiativeTitle":"Sample Reference Initiative","locations":{"id":1,"title":"Sample Library","children":[{"id":4,"title":"West Wing","description":"&lt;img src=&quot;https:\/\/www.lib.ncsu.edu\/sites\/default\/files\/hunt_level-1.jpg&quot;&gt;","children":[{"id":5,"title":"Quiet Reading Room","description":"quiet reading room &lt;a href=&quot;testing....&quot;&gt;testing&lt;\/a&gt;","children":[{"id":12,"title":"below quiet with desc","description":"desc"},{"id":13,"title":"no desc","description":""}]},{"id":6,"title":"IT Teaching Center","description":""}]},{"id":7,"title":"East Wing","description":"east wing desc","children":[{"id":8,"title":"Media Lab","description":"","children":[{"id":14,"title":"New Location","description":"nested"},{"id":15,"title":"New Location no desc","description":""}]},{"id":9,"title":"Learning Commons","description":""}]},{"id":2,"title":"Ground Floor","description":""},{"id":3,"title":"Lobby","description":"test lobby"}]},"activities":[{"id":1,"title":"Reading","rank":0,"groupId":1},{"id":2,"title":"Computing","rank":1,"groupId":1},{"id":3,"title":"Collaborating","rank":2,"groupId":1},{"id":4,"title":"Training\/Class","rank":3,"groupId":1},{"id":5,"title":"In-Person","rank":4,"groupId":2},{"id":6,"title":"Online","rank":5,"groupId":2}],"activityGroups":[{"id":1,"title":"Type","rank":1,"required":true,"allowMulti":true,"description":""},{"id":2,"title":"Medium","rank":2,"required":false,"allowMulti":true,"description":""}]}
    });
  }
  if (url === 'http://localhost:19679/sumaserver/clientinit/load/initiative/2') {
    return Promise.resolve({
        data: {"initiativeId":2,"initiativeTitle":"Sample Headcount Initiative","locations":{"id":1,"title":"Sample Library","children":[{"id":4,"title":"West Wing","description":"&lt;img src=&quot;https:\/\/www.lib.ncsu.edu\/sites\/default\/files\/hunt_level-1.jpg&quot;&gt;","children":[{"id":5,"title":"Quiet Reading Room","description":"quiet reading room &lt;a href=&quot;testing....&quot;&gt;testing&lt;\/a&gt;","children":[{"id":12,"title":"below quiet with desc","description":"desc"},{"id":13,"title":"no desc","description":""}]},{"id":6,"title":"IT Teaching Center","description":""}]},{"id":7,"title":"East Wing","description":"east wing desc","children":[{"id":8,"title":"Media Lab","description":"","children":[{"id":14,"title":"New Location","description":"nested"},{"id":15,"title":"New Location no desc","description":""}]},{"id":9,"title":"Learning Commons","description":""}]},{"id":2,"title":"Ground Floor","description":""},{"id":3,"title":"Lobby","description":"test lobby"}]},"activities":[],"activityGroups":[]}
    });
  }
  if (url === 'http://localhost:19679/sumaserver/clientinit/load/initiative/3') {
    return Promise.resolve({
        data: {"initiativeId":3,"initiativeTitle":"test","locations":{"id":10,"title":"test","children":[{"id":11,"title":"location test"}]},"activities":[{"id":8,"title":"New Activity","rank":0,"groupId":4},{"id":9,"title":"test","rank":1,"groupId":4},{"id":10,"title":"test Activity 2","rank":2,"groupId":4}],"activityGroups":[{"id":4,"title":"New Activity Group","rank":0,"required":true,"allowMulti":true}]}
    });
  }
}),
post: jest.fn((url) => {
  return Promise.resolve({
    data: ''
  });
})
}

