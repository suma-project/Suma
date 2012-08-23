(function () {

    var Interface = {

        init: function () {
            var self = this,
                initID = $('#initiatives').val();

            // Retrieve intial display data.
            $.when(self.getDictionary(initID)).then(function (data) {
                // Process locations
                self.processLocations(data.locations, data.fk_root_location);

                // Process activities (conditional is temporary?)
                if (data.activities.length > 0) {
                    // TEMPORARY METHOD UNTIL AG, REVERT TO processActivities
                    self.processActivitiesTemp(data.activities, data.activityGroups);
                } else {
                    $('#activities').html('<option value="all">All</option>');
                }

                // Bind event listeners
                self.bindEvents();
            });

        },

        bindEvents: function () {
            var self = this;

            // Listen for change of initiative
            $('#initiatives').on('change', function (e) {
                // Retrieve updated display data
                $.when(self.getDictionary(this.value)).then(function (data) {

                    // Process locations
                    self.processLocations(data.locations, data.fk_root_location);

                    // Process activities (conditional is temporary?)
                    if (data.activities.length > 0) {
                        // TEMPORARY METHOD UNTIL AG, REVERT TO processActivities
                        self.processActivitiesTemp(data.activities, data.activityGroups);
                    } else {
                        $('#activities').html('<option value="all">All</option>');
                    }
                });
            });
        },

        sortData: function (a, b) {
            return a.rank - b.rank;
        },

        getDictionary: function (initiative) {
            var url = 'interface.php';

            // AJAX call is returned here to take advantage of jQuery promise object
            return $.ajax({
                data: {
                    id: initiative
                },
                dataType: 'json',
                url: url
            });
        },

        // buildOptList and buildActOptList are very similar, 
        // difference is the check for activityGroup in buildActOptList.
        // There is likely a better way to do this.
        buildOptList: function (nestedList, optionsList) {
            var self = this;

            if (!optionsList) {
                optionsList = ['<option value="all">All</option>'];
            }

            _.each(nestedList, function (element, index) {
                optionsList.push('<option value="' + element.id + '">' + element.level + element.title + '</option>');
                if (element.children.length > 0) {
                    self.buildOptList(element.children, optionsList);
                }
            });

            return optionsList;
        },

        buildActOptList: function (nestedList, optionsList) {
            var self = this;

            if (!optionsList) {
                optionsList = ['<option value="all">All</option>'];
            }

            _.each(nestedList, function (element, index) {
                optionsList.push('<option value="' + element.type + '-' + element.id + '">' + element.level + element.title + '</option>');
                if (element.children) {
                    if (element.children.length > 0) {
                        self.buildActOptList(element.children, optionsList);
                    }
                }
            });

            return optionsList;
        },

        getListDepth: function (nestedList) {

            // Recursive function
            function getDepth(children, count) {
                _.each(children, function (element, index) {
                    element.level = count;
                    if (element.children) {
                        if (element.children.length > 0) {
                            getDepth(element.children, count + '&mdash;');
                        }
                    }
                });
            }

            _.each(nestedList, function (element, index) {
                element.level = '';

                if (element.children) {
                    if (element.children.length > 0) {
                        var count = '&mdash;';
                        getDepth(element.children, count);
                    }
                }
            });

            return nestedList;
        },

        processLocations: function (locations, fk_root_location) {
            var self         = this,
                rootParent   = fk_root_location,
                locationList = [],
                finalList,
                html;

            // Recursive function
            function findDescLocs(parentId, locations) {
                var locTree = [];

                _.each(locations, function (element, index) {
                    if (element.fk_parent === parentId) {
                        locTree.push({
                            'id'       : element.id,
                            'title'    : element.title,
                            'rank'     : element.rank,
                            'fk_parent': element.fk_parent,
                            'children' : findDescLocs(element.id, locations)
                        });
                    }
                });

                return locTree;
            }

            _.each(locations, function (element, index) {
                if (element.fk_parent === rootParent) {
                    locationList.push({
                        'id'       : element.id,
                        'title'    : element.title,
                        'rank'     : element.rank,
                        'fk_parent': element.fk_parent,
                        'children' : findDescLocs(element.id, locations)
                    });
                }
            });

            finalList = self.getListDepth(locationList);
            finalList.sort(self.sortData);
            html = self.buildOptList(finalList);

            $('#locations').html(html.join(''));

        },

        processActivities: function (activities, activityGroups) {
            var self           = this,
                activityList   = [],
                finalList,
                html;

            _.each(activityGroups, function (element, index) {
                var childrenArray = [],
                    testID = element.id;

                _.each(activities, function (element, index) {
                    if (element.activityGroup === testID) {
                        childrenArray.push({
                            'id'           : element.id,
                            'rank'         : element.rank,
                            'activityGroup': element.activityGroup,
                            'title'        : element.title,
                            'children'     : [],
                            'type'         : 'activity'
                        });
                    }
                });

                activityList.push({
                    'id'      : element.id,
                    'title'   : element.title,
                    'rank'    : element.rank,
                    'children': childrenArray,
                    'type'    : 'activityGroup'
                });
            });

            finalList = self.getListDepth(activityList);
            finalList.sort(self.sortData);
            html = self.buildActOptList(finalList);

            $('#activities').html(html.join(''));
        },

        // TEMPORARY METHODS UNTIL ACTIVITY GROUPS ARE IMPLEMENTED

        buildActOptListTemp: function (list) {
            var self = this,
                optionsList = ['<option value="all">All</option>'];

            _.each(list, function (element, index) {
                optionsList.push('<option value="' + element.id + '">' + element.title + '</option>');
            });

            return optionsList;
        },
        processActivitiesTemp: function (activities, activityGroups) {
            var self = this,
                activityList   = [],
                finalList,
                html;

            _.each(activities, function (element, index) {
                activityList.push({
                    'id': element.id,
                    'title': element.title
                });
            });

            html = self.buildActOptListTemp(activityList);

            $('#activities').html(html.join(''));

        }
    };
    Interface.init();
}());