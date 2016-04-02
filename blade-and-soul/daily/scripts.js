$(document).ready(function() {

    settings.load();

    settings.data.localTime = new Date();
    settings.data.lastModified = new Date(settings.data.lastModified);

    if (settings.data.version == 2) {
        if(settings.data.resetHour == 23)
            settings.data.resetHour = 12;
        ga('send', 'event', 'bnsDaily', 'legacy', '=2');
    }

    if(settings.data.version < 2) {
        console.log('Detected old version, resetting resetHour and resetDate');
        settings.setToDefault('resetHour');
        settings.setToDefault('resetDate');
        ga('send', 'event', 'bnsDaily', 'legacy', '2');
    }

    if(settings.data.version < 4) {
        console.log('Detected old version, moving the done quests to new location');
        settings.data.done = [{
            name: "Default",
            done: settings.data.done
        }]
        settings.save();
        ga('send', 'event', 'bnsDaily', 'legacy', '4');
    }

    settings.update('version', defaultSettings.version);

    setNextResetTime();
    echoTimeTrackerText();

    ui.tags();
    ui.continents();
    ui.nightMode();

    //settings.data.localTime = new Date(2016, 1, 10, 18, 55, 0, 0);

    //FastClick.attach(document.body);

    var templates = {
        tableRow: _.template($('#tpl-table-row').html()),
        table: _.template($('#tpl-table').html()),
        timeSettingsEdit: _.template($('#tpl-time-settings-edit').html()),
        tab: _.template($('#tpl-tab').html()),
        tabInner: _.template($('#tpl-tab-inner').html()),
        tabEdit: _.template($('#tpl-tab-edit').html())
    }

    var dailyTimer = setInterval(function() {

        settings.data.localTime = new Date();

        echoTimeTrackerText();

        $('#current-time').text(echoCurrentTime() + ' (' + echoCurrentTimezone() + ')');
    }, 1000)

    $('.version').text('v' + settings.data.version);

    $.tablesorter.addParser({
        id: 'gold',
        is: function(s, table, cell, $cell) {
            return false
        },
        format: function(s, table, cell, cellIndex) {
            var $cell = $(cell);

            if(cellIndex == 5) {
                return $cell.attr('data-gold') || s;
            }

            return s;
        },
        parsed: false,
        type: 'numeric'
    })

    var tabs = {
        getById: function(id) {
            return $('.tab[data-tabid=' + id + ']');
        },

        save: function() {
            $('.tab').each(function(index, el) {
                var tab = $(el);
                var id = tab.attr('data-tabid');
                var name = $('.tab-name', tab).text();

                if(!settings.data.done[id])
                    settings.data.done[id] = {
                        done: []
                    };

                settings.data.done[id].name = name;
            });
            
            settings.save();
        },

        load: function() {
            $('.tab').remove();

            _.each(settings.data.done, function(tab) {
                //tabs.add()
                if(tab)
                    tabs.add(tab.name)
            })
            $('.tab:first-child').addClass('active')
        },

        add: function(name) {
            var newTabId = $('.tab').length;
            var newTabName = 'Tab ' + (newTabId + 1);

            if(name)
                newTabName = name

            console.log('Created new tab with ID ', newTabId)

            $('#tabs').append(templates.tab({
                tabId: newTabId,
                tabName: newTabName
            }))

            if(newTabId >= 5)
                $('#add-tab').hide()

            tabs.save();
        },

        remove: function(id) {
            var el = tabs.getById(id);

            console.log('Removed tab with ID  ', id);

            $('.tab').filter(function() {
                return $(this).attr('data-tabid') > id;
            }).each(function(index, el) {
                $(this).attr('data-tabid', $(this).attr('data-tabid') - 1);
            });

            $('#add-tab').show();
            el.remove();

            settings.data.done.splice(id, 1);

            tabs.save();
        },

        edit: function(id) {
            var el = tabs.getById(id);

            console.log('Editing tab with ID ', id);

            el.html(templates.tabEdit({
                tabName: el.attr('data-tabname')
            }))

            $('.tab-name-edit', el).focus();
        },

        update: function(id, value) {
            var el = tabs.getById(id);

            console.log('Updated tab with ID ', id, ' to ', value);

            el.attr('data-tabname', value);

            if(!value)
                value = '&nbsp;';

            el.html(templates.tabInner({
                tabName: value
            }))

            tabs.save();
        },

        change: function(id) {
            var el = tabs.getById(id);

            console.log('Switched to tab ', id);

            activeTab = id;
            drawTable();

            $('.tab').removeClass('active');
            el.addClass('active');
        }
    }

    tabs.load();
    var activeTab = 0;

    function drawTable() {
        $('#daily-table-content').html('');

        var rows = [];

        if(checkIfResetHappened()) {
            settings.data.done[activeTab].done = [];
            settings.save();
        }

        $.each(dailies, function(index, daily) {

            var dungeon = '';

            if(daily.dungeon) {
                d = echoDungeon(daily.dungeon);
                dungeon = '<span class="difficulty-'+echoDifficulty(d.difficulty)+'">'+d.name+'</span>';
            }

            var dailyName = daily.name;

            if(typeof daily.name === 'object') {
                if(settings.data.faction == 'cerulean' || settings.data.faction == 'crimson')
                    dailyName = daily.name[settings.data.faction]
                else {
                    dailyName = '';
                    $.each(daily.name, function(key, value) {
                        dailyName += daily.name[key] + ' / ';
                    })
                    dailyName = dailyName.slice(0, -3);
                }
            }

            var categories = '';
            $.each(daily.categories, function(index, val) {
                categories += '<span class="tag ' + val.toLowerCase() + '">' + val + '</span>'
            });

            if(dungeon)
                daily.location = dungeon

            rows.push(templates.tableRow({
                dailyDone: settings.data.done[activeTab].done[index],
                dailyValue: daily.moneyReward,
                dailyGold: daily.moneyReward,
                dailyId: index,
                dailyTags: categories,
                dailyName: dailyName,
                dailyLocation: daily.location,
                dailyMap: echoMapWithContinent(daily.map),
                dailyGoldRewards: echoGold(Math.round(daily.moneyReward * settings.data.goldModifier)),
                dailyMiscRewards: '&nbsp;'
            }))
        });

        $('#table-wrapper').html(templates.table({
            rows: rows
        }))

        $('.daily-table').tablesorter({
            headers: {
                5: { sorter: 'gold' }
            },
            sortList: [[5, 1]],
            //sortForce: [[5, 1]],
            //sortList: [[4, 1]],
            widgets: ["group"],
            widgetOptions: {
                group_saveGroups: true
            }
        }).stickyTableHeaders();

        calculateTotalEarnings();
        calculateCompletedDailies();
    }

    ui.selects();
    changeDisplayDensity();

    $('#premium-modifier').change(function() {
        settings.update('goldModifier', $(this).val());
        calculateMoneyRewards();
        calculateTotalEarnings();
        ga('send', 'event', 'bnsDaily', 'premiumModifier', $(this).val());
    })

    $('#faction').change(function() {
        settings.update('faction', $(this).val());
        drawTable();
        ga('send', 'event', 'bnsDaily', 'faction', $(this).val());
    })

    $('#reset-hour').change(function() {
        var val = $(this).val();

        if(isInt(val))
            val = parseInt(val);

        setResetHour(val, false);

        setNextResetTime();
        echoTimeTrackerText();

        var region;

        if(val == 6)
            region = 'EU';
        else if(val == 23)
            region == 'NA';
        else
            region == 'unset';

        ga('send', 'event', 'bnsDaily', 'region', region);
    });

    $('.density-select').click(function() {
        settings.update('displayDensity', $(this).attr('data-value'));
        changeDisplayDensity();
    })

    $('#tag-toggle').click(function() {
        settings.toggle('showTags')
        ui.tags();
        $('.daily-table').trigger('reflow');
    })

    $('#continent-toggle').click(function() {
        settings.toggle('showContinents')
        ui.continents();
    })

    $('#night-toggle').click(function() {
        settings.update('nightMode', !$('html').hasClass('night'))
        ui.nightMode();
    })

    $('#edit-time').click(function() {
        $('#time-settings-edit').html(templates.timeSettingsEdit({
            currentTime: settings.data.resetTime.getHours()
        })).toggle();
        $('.daily-table').trigger('reflow');
    })

    $('#add-tab').click(function() {
        tabs.add();
    });

    $(document).on('click', '.daily-table tbody tr', function() {
        $(this).toggleClass('done');
        if($(this).hasClass('done'))
            ga('send', 'event', 'bnsDaily', 'dailyFinished', $(this).attr('data-id'));
        console.log($(this).attr('data-id'));
        settings.data.done[activeTab].done[$(this).attr('data-id')] = !settings.data.done[activeTab].done[$(this).attr('data-id')];
        settings.data.lastModified = new Date();
        settings.save();
        calculateCompletedDailies();
        calculateTotalEarnings();
    }).on('click', '#detect-reset-time', function() {

    }).on('click', '#save-reset-time', function() {

    }).on('click', '.tab', function(e) {
        if(!$(e.target).is('.tab-icon')) {
            tabs.change($(this).attr('data-tabid'));
        }
    }).on('click', '.edit-tab', function() {
        tabs.edit($(this).parent().attr('data-tabid'));
    }).on('click', '.close-tab', function() {
        tabs.remove($(this).parent().attr('data-tabid'))
    })
    // .on('click', '.save-tab', function() {
    //     var parent = $(this).parent();
    //     var newName = $('.tab-name-edit', parent).val();
    //     parent.attr('data-tabname', newName);

    //     parent.html(templates.tabInner({
    //         tabName: newName
    //     }))
    // })
    .on('focusout', '.tab-name-edit', function() {
        tabs.update($(this).parent().attr('data-tabid'), $(this).val())
    });

    $('#table-wrapper').scroll(function(e) {
        console.log();
        $('.daily-table thead').css('left', -$(this).scrollLeft() + $('#table-wrapper').position().left);
    });

    $('.debug-dump').click(function() {
        $('#dump').show().text(btoa(JSON.stringify({'userSettings': settings.data, 'userAgent': navigator.userAgent})));
        $("html, body").animate({ scrollTop: $(document).height() }, "slow");
        selectText('dump');
    });

    $('.reset-settings').click(function() {
        settings.reset();
        settings.save();
        ui.tags();
        ui.continents();
        ui.nightMode();
        ui.selects();
        tabs.load();
        changeDisplayDensity();
        drawTable();
    });

    drawTable();
})