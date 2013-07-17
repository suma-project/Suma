$(document).ready(function(){
    var History = window.History; // Note: We are using a capital H instead of a lower h
    if ( !History.enabled ) {
         // History.js is disabled for this browser.
         // This is because we can optionally choose to support HTML4 browsers or not.
        alert("This browser is not supported.");
        return false;
    }

    History.Adapter.bind(window,'statechange',function(){
        var currentState = History.getState();
        if (currentState.data.initID) {
            loadInit(currentState.data.initID);
        } else {
            $("#metadata").empty();
            $("a#createInitLink").show();
        }
    });

    if (recoveredID !== null) {
        var currentState = History.getState();
        if (currentState.data.initID) {
            if (currentState.data.initID === recoveredID) {
                History.replaceState({initID: recoveredID}, "Edit Suma Initiative", "?initID=" + recoveredID);
                loadInit(currentState.data.initID);
            } else {
                History.replaceState({initID: recoveredID}, "Edit Suma Initiative", "?initID=" + recoveredID);
            }
        } else {
            History.replaceState({}, "Suma Initiative Admin Tool", "");
            History.pushState({initID: recoveredID}, "Edit Suma Initiative", "?initID=" + recoveredID);
        }
    }

    function loadInit(initID) {
        $("a#createInitLink").hide();
        $('#initSelect').val(initID);
        // TODO use base path
        $('#metadata').load(basePath + '/admin/initiativeload/id/' + initID, function(response, status, jqXHR) {
            if (status == "error") {
                alert("Error: " + jqXHR.responseText);
                return;
            }

            $('ol.sortable').nestedSortable({
                disableNesting: 'no-nest',
                forcePlaceholderSize: true,
                handle: 'div',
                helper: 'clone',
                items: 'li',
                maxLevels: 2,
                protectRoot: true,
                opacity: 0.6,
                placeholder: 'placeholder',
                revert: 250,
                tabSize: 25,
                tolerance: 'pointer',
                toleranceElement: '> div',
                doNotClear: true
            });
        });
    }

    $("body").on("click", "a#createInitLink", function() {
        var initTitleInput = $("input#newInitTitleInput");
        var initDescInput = $("textarea#newInitDescInput");
        var locRootSel = $("select#locRootSel");

        // Reqs: loc tree is selected, title is not empty

        $("#newInitDialog").dialog({
            bgiframe: true,
            title: "Create Initiative",
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
                    initTitleInput.val('');
                    initDescInput.val('');
                    locRootSel.val('');
                    $(this).dialog("close");
                },
                'Save': function() {
                    var newInitTitle = _.escape($.trim(initTitleInput.val()));
                    var newInitDesc = _.escape($.trim(initDescInput.val()));
                    var newLocTree = $(locRootSel).val();
                    var boundThis = this;

                    if ((newInitTitle.length > 0) && (newLocTree.length > 0)) {
                        $.ajax({
                            type: 'POST',
                            url: basePath + '/admin/createinitiative',
                            data: {title: newInitTitle,
                                   desc: newInitDesc,
                                   locRootID: newLocTree},
                            async: false
                        }).success(function() {
                            initTitleInput.val('');
                            initDescInput.val('');
                            locRootSel.val('');
                            $(boundThis).dialog("close");
                            alert("Created initiative...reloading.");
                            location.reload();
                        }).error(function(jqXHR) {
                            alert("Error: " + jqXHR.responseText);
                        });
                    } else {
                        alert("Initiative title cannot be empty and location tree must be selected");
                    }
                    return false;
                }}
        });

        return false;
    });

    $("body").on("click", "a#editInitMetadata", function() {
        var initTitleSpan, initDescSpan, initTitleInput, initDescInput, initID;

        initTitleSpan = $("span#initTitle");
        initDescSpan = $("span#initDesc");
        initTitleInput = $("input#initTitleInput");
        initDescInput = $("textarea#initDescInput");
        initID = $("div#initID").text();

        initTitleInput.val($(initTitleSpan[0]).text());
        initDescInput.val($(initDescSpan[0]).text());

        $("#initEditDialog").dialog({
            bgiframe: true,
            title: "Edit Initiative",
            autoOpen: true,
            height: 225,
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
                    initTitleInput.val('');
                    initDescInput.val('');
                    $(this).dialog("close");
                },
                'Save': function() {
                    var newInitTitle, newInitDesc, boundThis;
                    newInitTitle = _.escape($.trim(initTitleInput.val()));
                    newInitDesc = _.escape($.trim(initDescInput.val()));
                    boundThis = this;

                    if (newInitTitle.length > 0) {
                        $.ajax({
                            type: 'POST',
                            url: basePath + '/admin/updateinitiative',
                            data: {id: initID,
                                   title: newInitTitle,
                                   desc: newInitDesc},
                            async: false
                        }).success(function() {
                            initTitleSpan.text(_.unescape(newInitTitle));
                            initDescSpan.text(_.unescape(newInitDesc));

                            initTitleInput.val('');
                            initDescInput.val('');
                            $(boundThis).dialog("close");
                        }).error(function(jqXHR) {
                            alert("Error: " + jqXHR.responseText);
                        });
                    } else {
                        alert("Initiative title cannot be empty");
                    }
                }
            }
        });
        return false;
    });

    $("body").on("click", "a.editAct, a.editActGroup", function() {
        var actLi, actEnabledCheck, titleSib, descSib, actTitleInput, actDescInput, actGroupRequiredCheck, actGroupMultiCheck;

        actLi = $(this).closest("li")[0];
        actEnableArea = $("#enableInput")[0];
        actEnabledCheck = $("input#actEnabledCheck")[0];
        actTitleInput = $("input#actTitleInput")[0];
        actDescInput = $("textarea#actDescInput")[0];
        actGroupRequiredCheck = $("#actGroupRequiredCheck");
        actGroupMultiCheck = $("#actGroupMultiCheck");

        if ($(this).hasClass("editActGroup")) {
            titleSib = $(actLi).children("div").children("span.actGroupTitle")[0];
            descSib = $(actLi).children("div").children("span.actGroupDesc")[0];

            $(actEnabledCheck).attr("checked", "checked");
            $(actEnableArea).hide();

            if ($(actLi).hasClass("required-act-group")){
                $(actGroupRequiredCheck).attr("checked", "checked");
            } else {
                $(actGroupRequiredCheck).removeAttr("checked");
            }

            if ($(actLi).hasClass("allowMulti-act-group")){
                $(actGroupMultiCheck).attr("checked", "checked");
            } else {
                $(actGroupMultiCheck).removeAttr("checked");
            }

            $(activityGroupFormContent).show();
        } else {
            titleSib = $(actLi).children("div").children("div > span.actTitle")[0];
            descSib = $(actLi).children("div").children("div > span.actDesc")[0];
            $(activityGroupFormContent).hide();

            if ($(actLi).hasClass("enabled-act")){
                $(actEnabledCheck).attr("checked", "checked");
            } else {
                $(actEnabledCheck).removeAttr("checked");
            }

            $(actEnableArea).show();
        }

        $(actTitleInput).val($(titleSib).text());
        $(actDescInput).val($(descSib).text());

        if ($(actLi).hasClass("enabled-act")){
            $(actEnabledCheck).attr("checked", "checked");
        } else {
            $(actEnabledCheck).removeAttr("checked");
        }

        $("#actEditDialog").dialog({
            bgiframe: true,
            title: "Edit Activity",
            autoOpen: true,
            height: 425,
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
                    $(actTitleInput).val('');
                    $(actDescInput).val('');
                    $(actEnabledCheck).removeAttr("checked");
                    $(this).dialog("close");
                },
                'Save': function() {
                    var newActTitle, newActDesc, boundThis;

                    newActTitle = $.trim($(actTitleInput).val());
                    newActDesc = $.trim($(actDescInput).val());
                    boundThis = this;

                    if (newActTitle.length > 0) {
                        $(titleSib).text(newActTitle);
                        $(descSib).text(newActDesc);

                        if ($(actLi).hasClass("activityGroup")) {

                            if ($(actGroupRequiredCheck).is(":checked")) {
                                $(actLi).addClass("required-act-group");
                            } else {
                                $(actLi).removeClass("required-act-group");
                            }

                            if ($(actGroupMultiCheck).is(":checked")) {
                                $(actLi).addClass("allowMulti-act-group");
                            } else {
                                $(actLi).removeClass("allowMulti-act-group");
                            }

                        } else {

                            if ($(actEnabledCheck).is(":checked")) {
                                $(actLi).removeClass("disabled-act").addClass("enabled-act");
                            } else {
                                $(actLi).removeClass("enabled-act").addClass("disabled-act");
                            }

                        }

                        $(actTitleInput).val('');
                        $(actDescInput).val('');
                        $(boundThis).dialog("close");
                    } else {
                        alert("Activity title cannot be empty");
                    }
                }
            }
        });

        return false;
    });

    $("body").on("click", "div.toggleInit a", function() {
        var initID, boundThis;

        initID = $("div#initID").text();
        boundThis = this;

        if ($(this).hasClass('disableInit')) {
            $.ajax({
                type: 'POST',
                url: basePath + '/admin/disableinitiative',
                data: {id: initID},
                async: false
            }).success(function() {
                $(boundThis).removeClass('disableInit').addClass('enableInit').text("Enable Initiative");
            }).error(function(jqXHR) {
                alert("Error: " + jqXHR.responseText);
            });
        } else if ($(this).hasClass('enableInit')) {
            $.ajax({
                type: 'POST',
                url: basePath + '/admin/enableinitiative',
                data: {id: initID},
                async: false
            }).success(function() {
                $(boundThis).removeClass('enableInit').addClass('disableInit').text("Disable Initiative");
            }).error(function(jqXHR) {
                alert("Error: " + jqXHR.responseText);
            });
        }

        return false;
    });

    $("body").on("click", "#addActivityGroup", function() {
        $('<li class="activityGroup allowMulti-act-group"><div><span class="actGroupTitle">New Activity Group</span>' +
            '<span class="actGroupDesc"></span><span class="actGroupID">new-act-group</span><span class=\"activityControls\">' +
            '<a href=\"#\" class=\"addActivity\">Add Activity</a><a href="#" class="editActGroup">Edit</a></span></div><ol></ol></li>').prependTo('#activities').find('a.addActivity').click();
        $('#activities').nestedSortable('refresh');

        return false;
    });

    $("body").on("click", ".addActivity", function() {
        $(this).closest("li").find('ol').first().prepend('<li class="activity no-nest enabled-act"><div><span class="actTitle">New Activity</span>' +
            '<span class="actDesc"></span><span class="actID">new-act</span><span class=\"activityControls\">' +
            '<a href="#" class="editAct">Edit</a></span></div></li>');
        return false;
    });

    $("body").on("click", "a#saveActs", function() {
        var initID = $("div#initID").text(),
            serActs = [];

        $("ol#activities > li").each(function() {
            var serActGroup;

            serActGroup = {
                id: $(this).find("span.actGroupID").text(),
                title: _.escape($(this).find("span.actGroupTitle").text()),
                desc: _.escape($(this).find("span.actGroupDesc").text()),
                required: $(this).hasClass("required-act-group"),
                allowMulti: $(this).hasClass("allowMulti-act-group"),
                activities: []
            };

            $(this).find('li.activity').each(function() {
                serActGroup.activities.push({
                    id: $(this).find("span.actID").text(),
                    title: _.escape($(this).find("span.actTitle").text()),
                    desc: _.escape($(this).find("span.actDesc").text()),
                    enabled: $(this).hasClass("enabled-act")
                });
            });

            serActs.push(serActGroup);
        });


        $.ajax({
            type: 'POST',
            url: basePath + '/admin/updateactivities',
            data: {init: initID,
                   activities: JSON.stringify(serActs)},
            async: false
        }).success(function() {
            alert("Successfully updated activities");
            var currentState = History.getState();
            if (currentState.data.initID) {
                loadInit(currentState.data.initID);
            }
        }).error(function(jqXHR) {
            alert("Error: " + jqXHR.responseText);
        });


        return false;
    });

    $("body").on("submit", "form#initForm", function() {
        var currentState = History.getState();

        if (currentState.data.initID) {
            History.replaceState({initID: $('#initSelect').val()}, "Edit Suma Initiative", "?initID=" + $('#initSelect').val());
        } else {
            History.pushState({initID: $('#initSelect').val()}, "Edit Suma Initiative", "?initID=" + $('#initSelect').val());
        }
        return false;
    });

    $("body").on("submit", "form.deadForm", function() {
        return false;
    });
});
