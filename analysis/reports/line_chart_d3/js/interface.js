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

            $.each(nestedList, function (index, value) {
                optionsList.push('<option value="' + value.id + '">' + value.level + value.title + '</option>');
                if (value.children.length > 0) {
                    self.buildOptList(value.children, optionsList);
                }
            });

            return optionsList;
        },

        buildActOptList: function (nestedList, optionsList) {
            var self = this;

            if (!optionsList) {
                optionsList = ['<option value="all">All</option>'];
            }

            $.each(nestedList, function (index, value) {
                optionsList.push('<option value="' + value.type + '-' + value.id + '">' + value.level + value.title + '</option>');
                if (value.children) {
                    if (value.children.length > 0) {
                        self.buildActOptList(value.children, optionsList);
                    }
                }
            });

            return optionsList;
        },

        getListDepth: function (nestedList) {

            // Recursive function
            function getDepth(children, count) {
                $.each(children, function (index, value) {
                    value.level = count;
                    if (value.children) {
                        if (value.children.length > 0) {
                            getDepth(value.children, count + '&mdash;');
                        }
                    }
                });
            }

            $.each(nestedList, function (index, value) {
                value.level = '';

                if (value.children) {
                    if (value.children.length > 0) {
                        var count = '&mdash;';
                        getDepth(value.children, count);
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

                $.each(locations, function (index, value) {
                    if (value.fk_parent === parentId) {
                        locTree.push({
                            'id'       : value.id,
                            'title'    : value.title,
                            'rank'     : value.rank,
                            'fk_parent': value.fk_parent,
                            'children' : findDescLocs(value.id, locations)
                        });
                    }
                });

                return locTree;
            }

            $.each(locations, function (index, value) {
                if (value.fk_parent === rootParent) {
                    locationList.push({
                        'id'       : value.id,
                        'title'    : value.title,
                        'rank'     : value.rank,
                        'fk_parent': value.fk_parent,
                        'children' : findDescLocs(value.id, locations)
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

            $.each(activityGroups, function (index, value) {
                var childrenArray = [],
                    testID = value.id;

                $.each(activities, function (index, value) {
                    if (value.activityGroup === testID) {
                        childrenArray.push({
                            'id'           : value.id,
                            'rank'         : value.rank,
                            'activityGroup': value.activityGroup,
                            'title'        : value.title,
                            'children'     : [],
                            'type'         : 'activity'
                        });
                    }
                });

                activityList.push({
                    'id'      : value.id,
                    'title'   : value.title,
                    'rank'    : value.rank,
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

            $.each(list, function (index, value) {
                optionsList.push('<option value="' + value.id + '">' + value.title + '</option>');
            });

            return optionsList;
        },
        processActivitiesTemp: function (activities, activityGroups) {
            var self = this,
                activityList   = [],
                finalList,
                html;

            $.each(activities, function (index, value) {
                activityList.push({
                    'id': value.id,
                    'title': value.title
                });
            });

            html = self.buildActOptListTemp(activityList);

            $('#activities').html(html.join(''));

        }
    };
    Interface.init();
}());