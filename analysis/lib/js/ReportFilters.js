/**
 * Module for display of locations and activities filters
 *
 * @param {object} p_options
 * @author  Bret Davidson <bret_davidson@ncsu.edu>
 */
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
        /**
         * Initializes module
         *
         * @this {ReportFilters}
         */
        init: function () {
            var dfd = $.Deferred();

            // Check passed options. Copied from http://www.engfers.com/code/javascript-module-pattern/
            if (p_options !== null && p_options !== undefined && p_options !== 'undefined') {
                _.each(options, function (element, index) {
                    if (p_options[index] !== null && p_options[index] !== undefined && p_options[index] !== 'undefined') {
                        options[index] = p_options[index];
                    }
                });
            }

            // Bind event listeners
            $.when(this.bindEvents())
                .then(function () {
                    dfd.resolve();
                }, function (e) {
                    dfd.reject(e);
                });

            return dfd.promise();
        },
        /**
         * Binds event listener for AJAX call for dictionary
         * and filter display
         */
        bindEvents: function () {
            var dfd = $.Deferred(),
                self = this;

            // Listen for change of initiative
            $(options.triggerForm).on('change', function (e) {
                if (this.value !== 'default') {
                    $(options.filterForm).hide();
                        $.when(self.getDictionary(this.value))
                        .then(function (data) {
                            self.buildInterfaceElements(data);
                            dfd.resolve();
                        }, function (e) {
                            dfd.reject(e);
                        });
                } else {
                    $(options.filterForm).fadeOut();
                }
            });

            return dfd.promise();
        },
        /**
         * Processes data and populates templates for filters
         *
         * @param {object} data
         * @this {ReportFilters}
         */
        buildInterfaceElements: function (data) {
            // Process locations and activities
            var locations = this.processLocations(data.locations, data.rootLocation),
                activities = this.processActivities(data.activities, data.activityGroups);

            // Set properties to access elsewhere
            this.locations = locations;
            this.activities = activities;

            // Populate templates
            this.buildTemplate(locations, options.locationsTemplate, options.locationsSelect);
            this.buildTemplate(activities, options.activitiesTemplate, options.activitiesSelect);

            // Show new filters
            $(options.filterForm).fadeIn();
        },
        /**
         * AJAX call to retrieve dictionary
         *
         * @param  {string} initiative
         * @return {object} Returns a jQuery promise object.
         */
        getDictionary: function (initiative) {
            // AJAX call is returned here to take advantage of jQuery promise object
            return $.ajax({
                data: {
                    id: initiative
                },
                dataType: 'json',
                url: options.url,
                beforeSend: function () {
                    $(options.triggerForm).attr('disabled', 'true');
                    $('#secondary-loading').show();
                },
                complete: function () {
                    $(options.triggerForm).removeAttr('disabled', 'true');
                    $('#secondary-loading').hide();
                },
                timeout: 60000 // 1 minute
            });
        },
        /**
         * Sort activities by rank, meant to be used
         * with native arr.sort() method
         *
         * @param  {object} a
         * @param  {object} b
         * @return {integer}
         */
        sortActivities: function (a, b) {
            return a.rank - b.rank;
        },
        /**
         * Calculate depth of location in adjacency list
         *
         * @param  {object}  item
         * @param  {array}   list
         * @param  {integer} root
         * @return {integer}
         */
        calculateDepth: function (item, list, root, depth) {
            var parent;

            depth = depth || 0;

            if (item.parent === root) {
                return depth;
            }

            depth += 1;

            parent = _.find(list, {'id': item.parent});

            return this.calculateDepth(parent, list, root, depth);
        },
        /**
         * Build a sorted list of locations
         *
         * @param  {arr} locations
         * @param  {arr} rootLocation
         * @return {arr}
         */
        processLocations: function (locations, rootLocation) {
            var locList,
                self = this;

            locList = d3.nest()
                .sortKeys(function (d) { return d.parent; })
                .sortKeys(function (d) { return d.rank; })
                .rollup(function (values) {
                    _.each(values, function (item, i, list) {
                        item.depth = self.calculateDepth(item, list, rootLocation);
                    });
                    return values;
                })
                .entries(locations);

            return locList;
        },
        /**
         * Build a sorted list of activities
         *
         * @param  {arr} activities
         * @param  {arr} activityGroups
         * @return {arr}
         */
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

                    }
                });
            });

            return activityList;
        },
        /**
         * Build and insert template
         *
         * @param  {arr} items
         * @param  {string} templateId
         * @param  {string} elementId
         */
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
                    indent += '—';
                }
                return indent;
            });

            // Populate template with data and insert into DOM
            $(elementId).empty();
            $(elementId).append(template(json));
        }
    };
};