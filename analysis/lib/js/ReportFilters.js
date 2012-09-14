var ReportFilters = function (p_options) {

    var options = {
            url: '', // URL for AJAX request (initiative dictionary)
            triggerForm: '', // Form element that triggers AJAX request (CSS ID)
            filterForm: '', // Wrapper element that controls visibility of filters (CSS ID)
            locationsTemplate: '', // CSS ID of locations template
            activitiesTemplate: '', // CSS ID of activities template
            locationsSelect: '', // CSS ID of locations select list
            activitiesSelect: '' // CSS ID of activities select list

        };

    return {

        init: function () {
            // Check passed options. Copied from http://www.engfers.com/code/javascript-module-pattern/
            // Not sure if this is best way
            if (p_options !== null && p_options !== undefined && p_options !== 'undefined') {
                _.each(options, function (element, index) {
                    if (p_options[index] !== null && p_options[index] !== undefined && p_options[index] !== 'undefined') {
                        options[index] = p_options[index];
                    }
                });
            }

            // Bind event listeners
            this.bindEvents();
        },

        bindEvents: function () {
            var self = this;

            // Listen for change of initiative
            $(options.triggerForm).on('change', function (e) {
                if (this.value !== 'default') {
                    // Retrieve updated display data
                    $.when(self.getDictionary(this.value)).then(function (data) {
                        // Process data and populate templates
                        self.buildInterfaceElements(data);
                        // Show new filters
                        $(options.filterForm).fadeIn();
                    });
                } else {
                    // Hide new filters
                    $(options.filterForm).fadeOut();
                }
            });
        },

        buildInterfaceElements: function (data) {
            // Process locations and activities
            var locations = this.processLocations(data.initiative.dictionary.locations),
                activities = this.processActivities(data.initiative.dictionary.activities, data.initiative.dictionary.activityGroups);

            // Populate templates
            this.buildTemplate(locations, options.locationsTemplate, options.locationsSelect);
            this.buildTemplate(activities, options.activitiesTemplate, options.activitiesSelect);
        },

        getDictionary: function (initiative) {
            // AJAX call is returned here to take advantage of jQuery promise object
            return $.ajax({
                // data: {
                //     id: initiative
                // },
                dataType: 'json',
                url: options.url,
                beforeSend: function () {
                    $(options.triggerForm).attr('disabled', 'true');
                },
                complete: function () {
                    $(options.triggerForm).removeAttr('disabled', 'true');
                }
            });
        },

        sortActivities: function (a, b) {
            return a.rank - b.rank;
        },

        propertySort: function (a, b) {
            return a.rank > b.rank ? 1 : (a.rank < b.rank ? -1 : 0);
        },

        sortLocations: function (arr) {
            var len = arr.length;

            while (len > 0) {
                len -= 1;
                if (arr[len].children) {
                    this.sortLocations(arr[len].children);
                }
            }

            arr.sort(this.propertySort);
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
                            'children' : locMemo(_.clone(memo), obj.id, depth + 1)
                        });
                    }
                });

                return locTree;
            }

            return locMemo(locations);
        },

        processLocations: function (locations) {
            var locTree,
                locList;

            // Build location tree from adjacency list
            locTree = this.buildLocTree(locations);

            // Sort locations based on rank at each level of depth
            this.sortLocations(locTree);

            // Flatten tree to sorted array
            locList = this.buildLocList(locTree);

            return locList;
        },

        processActivities: function (activities, activityGroups) {
            var activityList = [];

            // Sort activities and activity groups
            activities.sort(this.sortActivities);
            activityGroups.sort(this.sortActivities);

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
        activitiesTemplateTemp: function (items, templateId, elementId) {
            var json,
                html,
                template;

            // Insert list into object for template iteration
            json = {items: items};

            // Retrieve template from index.php (in script tag)
            html = $(templateId).html();

            // Compile template
            template = Handlebars.compile(html);

            // Populate template with data and insert into DOM
            $(elementId).empty();
            $(elementId).append(template(json));
        },

        processActivitiesTemp: function (activities) {
            var activityList   = [];

            _.each(activities, function (obj) {
                activityList.push({
                    'id'   : obj.id,
                    'title': obj.title
                });
            });

            this.activitiesTemplateTemp(activityList);
        }
    };
};