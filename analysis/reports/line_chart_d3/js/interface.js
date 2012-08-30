(function () {

    var Interface = {

        init: function () {
            var self = this;

            // Bind event listeners
            self.bindEvents();
        },

        bindEvents: function () {
            var self = this;

            // Listen for change of initiative
            $('#initiatives').on('change', function (e) {
                if (this.value !== 'default') {
                    // Retrieve updated display data
                    $.when(self.getDictionary(this.value)).then(function (data) {
                        // Process data and populate templates
                        self.buildInterfaceElements(data);
                        // Show new filters
                        $('#secondary-filters').fadeIn();
                    });
                } else {
                    // Hide new filters
                    $('#secondary-filters').fadeOut();
                }
            });
        },

        buildInterfaceElements: function (data) {
            // Process locations and activities
            var self = this,
                locations = self.processLocations(data.initiative.dictionary.locations),
                activities = self.processActivities(data.initiative.dictionary.activities, data.initiative.dictionary.activityGroups);

            // Populate templates
            self.buildTemplate(locations, '#locations-template', '#locations');
            self.buildTemplate(activities, '#activities-template', '#activities');
        },

        getDictionary: function (initiative) {
            //var url = 'interface.php';
            var url = 'ag.json';

            // AJAX call is returned here to take advantage of jQuery promise object
            return $.ajax({
                // data: {
                //     id: initiative
                // },
                dataType: 'json',
                url: url
            });
        },

        sortActivities: function (a, b) {
            return a.rank - b.rank;
        },

        propertySort: function (a, b) {
            return a.rank > b.rank ? 1 : (a.rank < b.rank ? -1 : 0);
        },

        sortLocations: function (arr) {
            var self = this,
                len = arr.length;

            while (len > 0) {
                len -= 1;
                if (arr[len].children) {
                    self.sortLocations(arr[len].children);
                }
            }

            arr.sort(self.propertySort);
        },

        buildLocList: function (nestedList, flatArray) {
            var self = this;
            flatArray = flatArray || [];

            _.each(nestedList, function (obj) {
                flatArray.push(obj);
                if (obj.children) {
                    self.buildLocList(obj.children, flatArray);
                }
            });

            return flatArray;
        },

        buildLocTree: function (locations) {
            var memo = {};

            // Build memo object using location ids as keys
            _.each(locations, function (obj, index) {
                memo[obj.id] = obj;
            });

            function locMemo(locations, parentId, depth) {
                var locTree = [];

                // Set defaults
                parentId = parentId || 1;
                depth    = depth    || 0;

                // Loop over locations
                _.each(locations, function (obj, index) {
                    // Start at top of tree
                    if (obj.fk_parent === parentId) {
                        delete memo[obj.id];

                        // Build object and recursively build children
                        locTree.push({
                            'id'       : obj.id,
                            'title'    : obj.title,
                            'rank'     : obj.rank,
                            'fk_parent': obj.fk_parent,
                            'depth'    : depth,
                            'children' : locMemo(memo, obj.id, depth + 1)
                        });
                    }
                });
                return locTree;
            }

            return locMemo(locations);
        },

        processLocations: function (locations) {
            var self = this,
                locTree,
                locList;

            // Build location tree from adjacency list
            locTree = self.buildLocTree(locations);

            // Sort locations based on rank at each level of depth
            self.sortLocations(locTree);

            // Flatten tree to sorted array
            locList = self.buildLocList(locTree);

            return locList;
        },

        processActivities: function (activities, activityGroups) {
            var self = this,
                activityList = [];

            // Sort activities and activity groups
            activities.sort(self.sortActivities);
            activityGroups.sort(self.sortActivities);

            // For each activity group, build a list of activities
            _.each(activityGroups, function (activityGroup) {

                // Activity group metadata
                var listItem = {
                    'id'   : activityGroup.id,
                    'rank' : activityGroup.rank,
                    'title': activityGroup.title,
                    'type' : 'activityGroup',
                    'depth': 0
                };

                // Add activity group activityList array
                activityList.push(listItem);

                // Loop over activities and add the ones belonging to the current activityGroup
                _.each(activities, function (activity, index) {
                    if (activity.activityGroup === activityGroup.id) {
                        // Activity metadata
                        var listItem = {
                            'id'   : activity.id,
                            'rank' : activity.rank,
                            'title': activity.title,
                            'type' : 'activity',
                            'depth': 1,
                            'activityGroup': activityGroup.id
                        };

                        // Add activities to activityList array behind proper activityGroup
                        activityList.push(listItem);

                        // Remove matching activity from list to reduce later iteration
                        activities.splice(index, 1);
                    }
                });
            });

            return activityList;
        },

        buildTemplate: function (items, templateId, elementId) {
            var html,
                json,
                template;

            // Insert list into object for template iteration
            json = {items: items};

            // Retrieve template from index.php (in script tag)
            html = $(templateId).html();

            // Compile template
            template = Handlebars.compile(html);

            // Template helper to convert depth to emdash
            Handlebars.registerHelper('indent', function (depth) {
                var indent = '';
                while (depth > 0) {
                    depth -= 1;
                    indent += '&mdash;';
                }
                return indent;
            });

            // Populate template with data and insert into DOM
            $(elementId).empty();
            $(elementId).append(template(json));
        },

        // TEMPORARY METHODS UNTIL ACTIVITY GROUPS ARE IMPLEMENTED
        activitiesTemplateTemp: function (activities) {
            var json,
                html,
                template;

            // Insert list into object for template iteration
            json = {activities: activities};

            // Retrieve template from index.php (in script tag)
            html = $('#activitiestemp-template').html();

            // Compile template
            template = Handlebars.compile(html);

            // Populate template with data and insert into DOM
            $('#activities').empty();
            $('#activities').append(template(json));
        },

        processActivitiesTemp: function (activities) {
            var self = this,
                activityList   = [];

            _.each(activities, function (obj) {
                activityList.push({
                    'id'   : obj.id,
                    'title': obj.title
                });
            });

            self.activitiesTemplateTemp(activityList);
        }
    };
    Interface.init();
}());