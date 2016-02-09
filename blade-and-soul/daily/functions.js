function pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

function prettyDate(date, startDate) {
    var secs = Math.floor((date.getTime() - startDate.getTime()) / 1000);
    if (secs < 0) return false;
    if (secs < 60) return secs + " seconds(s)";
    if (secs < 3600) return Math.floor(secs / 60) + " minutes(s)";
    if (secs < 86400) return Math.floor(secs / 3600) + " hour(s)";
    if (secs < 604800) return Math.floor(secs / 86400) + " day(s)";
    return date.toDateString();
}

function isInt(n){
    return !isNaN(n)
}

function leadingRange(number) {
    if(number > 0)
        return '+' + number;
    else
        return number.toString();
}

function selectText(element) {
    var doc = document,
    text = doc.getElementById(element),
    range,
    selection;

    console.log('Selecting text');

    if (doc.body.createTextRange) {
        range = document.body.createTextRange();
        range.moveToElementText(text);
        range.select();
    } else if (window.getSelection) {
        selection = window.getSelection();
        range = document.createRange();
        range.selectNodeContents(text);
        selection.removeAllRanges();
        selection.addRange(range);
    }
}

function echoGold(amount) {
    amount = Math.round(amount);
    var copper = amount % 100;
    amount = (amount - copper) / 100
    var silver = amount % 100;
    var gold = (amount - silver) / 100
    var g = '', s = '', c = '';
    if(gold > 0)
        g = '<span class="currency gold">' + gold + '</span>'
    if(/*gold > 0 || */silver > 0)
        s = '<span class="currency silver">' + silver + '</span>'
    if(/*silver > 0 || */copper > 0)
        c = '<span class="currency copper">' + copper + '</span>'
    return g + ' ' + s + ' ' + c;
}

function echoDifficulty(difficulty) {
    if(difficulty == 0)
        return 'easy';
    if(difficulty == 1)
        return 'normal';
    if(difficulty == 2)
        return 'challenging';
    if(difficulty == 3)
        return 'heroic';
}

function echoDungeon(id) {
    return dungeons[id];
}

function echoMap(id) {
    return maps[id];
}

function echoCurrentTime() {
    return pad(settings.data.localTime.getHours(), 2) + ':' + pad(settings.data.localTime.getMinutes(), 2);
}

function echoCurrentTimezone() {
    return 'UTC' + (leadingRange(-settings.data.localTime.getTimezoneOffset() / 60));
}

function echoTimeTrackerText() {

    //Debug
    $('.d').each(function() {
        $(this).text(settings.data[$(this).attr('data-d')])
    });

    //console.log(settings.data.resetHour, typeof settings.data.resetHour, typeof settings.data.resetHour === 'number')

    if(typeof settings.data.resetHour === 'number') {
        var toGo = prettyDate(settings.data.resetTime, settings.data.localTime)

        if(!toGo) {
            if(!alerted) {
                alert('The dailies just reset. Reload the site to reset your data');
                alerted = true;
            }
            toGo = 'the past';
        }

        //console.log(toGo);

        $('#daily-reset').text('In ' + toGo  + ' (' + pad(settings.data.resetTime.getHours(), 2) + ':' + pad(settings.data.resetTime.getMinutes(), 2) + ')');
        //$('#edit-time').show();
    } else {
        $('#daily-reset').text('Please select a region');
        //$('#edit-time').hide();
    }
}

function modified() {
    settings.data.lastModified = new Date();
}

function findNextResetTime(date) {
    console.log('Looking for the next reset time of ', date);
    if(settings.data.resetHour === "not set") {
        console.log('Skipped because no resetHour is set');
        return false;
    }

    var tmp = new Date(date);

    if(tmp.getUTCHours() >= settings.data.resetHour)
        tmp.setUTCDate(tmp.getUTCDate() + 1);
    tmp.setUTCHours(settings.data.resetHour,0,0,0);

    console.log('Found reset time of ', date, ' : ',  tmp)

    return tmp;
}

function setNextResetTime() {
    console.log('Setting a new global reset time');
    if(settings.data.resetHour === "not set") {
        console.log('Skipped because no resetHour is set');
        settings.setToDefault('resetTime');
        return false;
    }

    settings.data.resetTime = new Date(settings.data.resetTime);

    if(!settings.data.editedTime) {
        settings.data.resetTime = findNextResetTime(settings.data.localTime);
    } else {
        var nextReset = new Date();
        nextReset.setHours(settings.data.resetHour);
        settings.data.resetTime = findNextResetTime(nextReset);
    }

    console.log('New global reset time: ', settings.data.resetTime);
}

function checkIfResetHappened() {
    console.log('Checking if a reset happened using lastModified', settings.data.lastModified);

    if(settings.data.resetHour === "not set") {
        console.log('Skipped because no resetHour is set');
        return false;
    }

    var l = settings.data.lastModified;
    var r = findNextResetTime(l);

    var didReset = r.getTime() < settings.data.localTime.getTime();

    console.log('Reset happened: ', didReset);

    return (r.getTime() < settings.data.localTime.getTime());
}

function setResetHour(hour, edited) {
    var e = true;

    settings.data.resetHour = hour;

    if(edited == false)
        e = false;
    
    settings.data.editedTime = e;
    settings.save();
}

function changeDisplayDensity() {
    $('html').attr('data-density', settings.data.displayDensity);
}

function calculateMoneyRewards() {
    $('.daily-gold').each(function(index, el) {
        $(this).html(echoGold(parseInt($(this).attr('data-gold')) * settings.data.goldModifier))
    });
}

function calculateTotalEarnings() {
    var dailyValue = 0;
    $('.daily-table tbody tr.done .daily-gold').each(function(index, el) {
        dailyValue = dailyValue + (parseInt($(el).attr('data-gold')) * settings.data.goldModifier);
    });
    $('#total-value').html('Total earnings: ' + echoGold(dailyValue));
}

function calculateCompletedDailies () {
    if($('.done').length > 40)
        $('.daily-progress').addClass('warning');
    else
        $('.daily-progress').removeClass('warning');

    $('.daily-progress').text($('.done').length + ' / 40');
}

var ui = {
    nightMode: function() {
        if(settings.data.nightMode == true) {
            $('html').addClass('night');
            $('#night-toggle > .checkbox').addClass('checked');
        } else {
            $('html').removeClass('night');
            $('#night-toggle > .checkbox').removeClass('checked');
        }

    },
    tags: function() {
        if(settings.data.showTags == false) {
            $('html').addClass('hide-tags')
            $('#tag-toggle > .checkbox').removeClass('checked');
        } else {
            $('html').removeClass('hide-tags')
            $('#tag-toggle > .checkbox').addClass('checked');
        }
    }
}