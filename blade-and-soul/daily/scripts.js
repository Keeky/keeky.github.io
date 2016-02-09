$(document).ready(function() {

    settings.load();

    settings.data.localTime = new Date();
    settings.data.lastModified = new Date(settings.data.lastModified);

    if (settings.data.version == 2) {
        if(settings.data.resetHour == 23)
            settings.data.resetHour = 12;
    }

    if(settings.data.version < 2) {
        console.log('Detected old version, resetting resetHour and resetDate');
        settings.setToDefault('resetHour');
        settings.setToDefault('resetDate');
    }

    settings.update('version', defaultSettings.version);

    setNextResetTime();
    echoTimeTrackerText();

    ui.tags();
    ui.nightMode();

    //settings.data.localTime = new Date(2016, 1, 10, 18, 55, 0, 0);

    FastClick.attach(document.body);

    var templates = {
        tableRow: _.template($('#tpl-table-row').html()),
        table: _.template($('#tpl-table').html()),
        timeSettingsEdit: _.template($('#tpl-time-settings-edit').html())
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

    function drawTable() {
        $('#daily-table-content').html('');

        var rows = [];

        if(checkIfResetHappened()) {
            settings.data.done = [];
            settings.save();
        }

        $.each(dailies, function(index, daily) {

            var dungeon = '';

            if(daily.dungeon) {
                d = echoDungeon(daily.dungeon);
                dungeon = '<br><span class="difficulty-'+echoDifficulty(d.difficulty)+'">'+d.name+'</span>';
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

            rows.push(templates.tableRow({
                dailyDone: settings.data.done[index],
                dailyValue: daily.moneyReward,
                dailyGold: daily.moneyReward,
                dailyId: index,
                dailyTags: categories,
                dailyName: dailyName + dungeon,
                dailyLocation: daily.location,
                dailyMap: echoMap(daily.map).name,
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
        }).floatThead();

        calculateTotalEarnings();
        calculateCompletedDailies();
    }

    $('#premium-modifier').val(settings.data.goldModifier);
    $('#faction').val(settings.data.faction);
    $('#reset-hour').val(settings.data.resetHour);
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

    $(document).on('click', '.daily-table tbody tr', function() {
        $(this).toggleClass('done');
        if($(this).hasClass('done'))
            ga('send', 'event', 'bnsDaily', 'dailyFinished', $(this).attr('data-id'));
        settings.data.done[$(this).attr('data-id')] = !settings.data.done[$(this).attr('data-id')];
        settings.data.lastModified = new Date();
        settings.save();
        calculateCompletedDailies();
        calculateTotalEarnings();
    })
    .on('click', '#detect-reset-time', function() {

    }).on('click', '#save-reset-time', function() {

    })

    $('.debug-dump').click(function() {
        $('#dump').show().text(btoa(JSON.stringify({'userSettings': settings.data, 'userAgent': navigator.userAgent})));
        $("html, body").animate({ scrollTop: $(document).height() }, "slow");
        selectText('dump');
    });

    $('.reset-settings').click(function() {
        settings.reset();
        ui.tags();
        ui.nightMode();
        changeDisplayDensity();
        drawTable();
    });

    drawTable();
})