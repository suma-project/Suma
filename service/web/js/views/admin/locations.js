
    function objectifyChildLocs(root_node) {
        var serializedLocs = [];
        $(root_node).children("li.location").each(function(index) {
            var locArr = {id:'unknown',
                        title: '',
                        description: '',
                        enabled: true};

            if ($(this).hasClass("disabled-loc")) {
                locArr.enabled = false;
            }

            var metadata = $(this).children("div").children("span").each(function(index) {
                if ($(this).hasClass("locTitle")) {
                    locArr.title = $(this).text();
                } else if ($(this).hasClass("locDesc")) {
                    locArr.description = $(this).text();
                } else if ($(this).hasClass("locID")) {
                    locArr.id = $(this).text();
                }
            });

            var children = $(this).children('ol');
            if (children.length) {
                locArr.children = objectifyChildLocs(children[0]);
            }
            serializedLocs.push(locArr);
        });

        return serializedLocs;
    }

    $(document).ready(function(){


        $("a#createTreeLink").live('click', function() {
            var treeTitleInput = $("input#newTreeTitleInput");
            var treeDescInput = $("textarea#newTreeDescInput");

            // Reqs: loc tree is selected, title is not empty

            $("#newTreeDialog").dialog({
                bgiframe: true,
                title: "Create Location Tree",
                autoOpen: true,
                height: 400,
                width: 325,
                modal: true,
                closeOnEscape: false,
                resizable: false,
                draggable: false,
                open: function() {
                    $(".ui-dialog").css({overflow: 'visible'});
                },
                buttons: {
                    'Cancel': function() {
                        treeTitleInput.val('');
                        treeDescInput.val('');
                        $(this).dialog("close");
                    },
                    'Save': function() {
                        var newTreeTitle = $.trim(treeTitleInput.val());
                        var newTreeDesc = $.trim(treeDescInput.val());
                        var myThis = this;

                        if (newTreeTitle.length > 0) {
                            $.ajax({
                                type: 'POST',
                                url: basePath + '/admin/createloctree',
                                data: {title: newTreeTitle,
                                    desc: newTreeDesc},
                                async: false
                            }).success(function() {
                                treeTitleInput.val('');
                                treeDescInput.val('');
                                $(myThis).dialog("close");
                                alert("Created tree...reloading.");
                                location.reload();
                            }).error(function() {
                                alert("Unknown error when updating location tree");
                            });
                        } else {
                            alert("Tree title cannot be empty");
                        }
                        return false;
                    }},
            });

            return false;
        });

        $("a#saveLocs").live("click", function(){
            var locTree = {id:$("div#treeID").text(),
                        title:$("span#treeTitle").text(),
                        description:$("span#treeDesc").text(),
                        enabled: true};
            locTree.children = objectifyChildLocs($("ol#locations")[0]);

            console.log(locTree);
            $.ajax({
                type: 'POST',
                async: false,
                url: basePath + '/admin/updateloctree',
                data: {loc_tree: JSON.stringify(locTree)}
            }).success(function(){
                alert("Location tree successfully updated");
                var currentState = History.getState();
                if (currentState.data.locID) {
                    loadLoc(currentState.data.locID);
                }
                loadLoc($("div#treeID").text());
            }).error(function(){alert("Error updating location tree");});

            return false;
        });

        function loadLoc(locID) {
            $('#locArea').load('../locationload/id/'+locID, function() {
                $('ol.sortable').nestedSortable({
                    disableNesting: 'no-nest',
                    forcePlaceholderSize: true,
                    handle: 'div',
                    helper: 'clone',
                    items: 'li',
                    opacity: .6,
                    placeholder: 'placeholder',
                    revert: 250,
                    tabSize: 25,
                    tolerance: 'pointer',
                    toleranceElement: '> div'
                });
            });
        };

        $('#addLoc').live('click', function() {
            $('#locations').prepend('<li class="enabled-loc newLoc location"><div><span class=\"locTitle\">New Location</span> <span class=\"locDesc\"></span><span class="locID">new-loc</span><a href=\"#\" class=\"editLoc\">Edit</a></div></li>');
            $('#locations').sortable('refresh');
            return false;
        });

        $("a#editTree").live('click', function() {
            var treeTitleSpan = $("span#treeTitle");
            var treeDescSpan = $("span#treeDesc");
            var treeTitleInput = $("input#treeTitleInput");
            var treeDescInput = $("textarea#treeDescInput");

            treeTitleInput.val($(treeTitleSpan[0]).text());
            treeDescInput.val($(treeDescSpan[0]).text());

            $("#treeEditDialog").dialog({
                bgiframe: true,
                title: "Edit Location",
                autoOpen: true,
                height: 375,
                width: 325,
                modal: true,
                closeOnEscape: false,
                resizable: false,
                draggable: false,
                open: function() {
                    $(".ui-dialog").css({overflow: 'visible'});
                },
                buttons: {
                    'Cancel': function() {
                        treeTitleInput.val('');
                        treeDescInput.val('');
                        $(this).dialog("close");
                    },
                    'Save': function() {
                        // TODO: Enforce non-empty title
                        treeTitleSpan.text(treeTitleInput.val());
                        treeDescSpan.text(treeDescInput.val());

                        treeTitleInput.val('');
                        treeDescInput.val('');
                        $(this).dialog("close");
                    }
                }
            });
        });

        $("a.editLoc").live('click', function() {
            // var locNode = $(this).closest("div")[0];
            var locLi = $(this).closest("li")[0];
            var titleSib = $(this).siblings("span.locTitle");
            var descSib = $(this).siblings("span.locDesc");
            var locTitleInput = $("input#locTitleInput");
            var locDescInput = $("textarea#locDescInput");
            var locEnabledCheck = $("input#locEnabledCheck");

            locTitleInput.val($(titleSib[0]).text());
            locDescInput.val($(descSib[0]).text());

            if ($(locLi).hasClass("enabled-loc")){
                locEnabledCheck.attr("checked", "checked");
            } else {
                locEnabledCheck.removeAttr("checked");
            }

            $("#locEditDialog").dialog({
                bgiframe: true,
                title: "Edit Location",
                autoOpen: true,
                height: 375,
                width: 325,
                modal: true,
                closeOnEscape: false,
                resizable: false,
                draggable: false,
                open: function() {
                    $(".ui-dialog").css({overflow: 'visible'});
                },
                buttons: {
                    'Cancel': function() {
                        locTitleInput.val('');
                        locDescInput.val('');
                        locEnabledCheck.removeAttr("checked");
                        $(this).dialog("close");
                    },
                    'Save': function() {
                        titleSib.text(locTitleInput.val());
                        // TODO: Enforce non-empty title
                        descSib.text(locDescInput.val());
                        if (locEnabledCheck.is(":checked")) {
                            $(locLi).removeClass("disabled-loc").addClass("enabled-loc");
                        } else {
                            $(locLi).removeClass("enabled-loc").addClass("disabled-loc");
                        }

                        locTitleInput.val('');
                        locDescInput.val('');
                        $(this).dialog("close");
                    }
                }
            });
        });

        var History = window.History; // Note: We are using a capital H instead of a lower h
        if ( !History.enabled ) {
             // History.js is disabled for this browser.
             // This is because we can optionally choose to support HTML4 browsers or not.
            alert("This browser is not supported.");
            return false;
        }


        History.Adapter.bind(window,'statechange',function(){
            var currentState = History.getState();
            if (currentState.data.locID) {
                loadLoc(currentState.data.locID);
            } else {
                $("#locArea").empty();
                $("a#createTreeLink").show();
            }
        });

        if (recoveredID !== null) {
            var currentState = History.getState();
            if (currentState.data.locID) {
                if (currentState.data.locID === recoveredID) {
                    History.replaceState({locID: recoveredID}, "Edit Suma Locations", "?locID=" + recoveredID);
                    loadLoc(currentState.data.locID);
                } else {
                    History.replaceState({locID: recoveredID}, "Edit Suma Locations", "?locID=" + recoveredID);
                }
            } else {
                History.replaceState({}, "Suma Locations Admin Tool", "");
                History.pushState({locID: recoveredID}, "Edit Suma Locations", "?locID=" + recoveredID);
            }
        }

        $('form#locForm').live('submit', function() {
            var currentState = History.getState();
            var newLocID = $('#rootSelect').val();
            $("a#createTreeLink").hide();
            if (currentState.data.locID) {
                History.replaceState({locID: newLocID}, "Edit Suma Location", "?locID=" + newLocID);
            } else {
                History.pushState({locID: newLocID}, "Edit Suma Location", "?locID=" + newLocID);
            }
            return false;
        });

        $('form.deadForm').live('submit', function() {
            return false;
        });
