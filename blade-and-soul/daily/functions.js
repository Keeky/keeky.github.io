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

function findNextResetTime(date) {
    var tmp = new Date(date);

    if(tmp.getUTCHours() >= settings.data.resetHour)
        tmp.setUTCDate(tmp.getUTCDate() + 1);
    tmp.setUTCHours(settings.data.resetHour,0,0,0);

    return tmp;
}

function checkIfResetHappened() {
    var l = settings.data.lastModified;
    var r = findNextResetTime(l);

    console.log(r.getTime() < settings.data.localTime.getTime(), 'reset:', new Date(r), 'now:', settings.data.localTime);

    return (r.getTime() < settings.data.localTime.getTime());
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