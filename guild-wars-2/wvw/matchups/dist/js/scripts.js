function percentage(part, full) {
    return Math.floor(part / full * 100);
}

function seperateThousands(number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
}

function prettyTime(time, prepend, append) {
    if(!prepend)
        prepend = '';

    if(!append)
        append = '';

    if(time - 60 >= 0) {
        var text = 'minute';
        var rounded = Math.floor(time / 60);
    } else {
        var text = 'second';
        var rounded = time;
    }

    return prepend + rounded + ' ' + text + (rounded > 1 ? 's' : '') + append;
}

var regions = {
    1: 'na',
    2: 'eu'
}

function fetchNewData() {
    $.ajax({
        url: "proxy-cache.php",
        method: "POST",
        data: {resource: "gw2-wvw-matchups"},
        dataType: "json"
    }).done(function (data) {
        lastUpdate = 0;

        $('.matchup').each(function (num, elem) {
            var $elem = $(elem);

            var id = $elem.attr('data-matchid');

            var region = regions[id.toString()[0]];

            var matchData = data[region][id];

            for(var color in matchData.ppt) {
                $('.server-tick.' + color.toLowerCase(), $elem).css('width', percentage(matchData.ppt[color], 695) + '%');
                $('.server-tick.' + color.toLowerCase() + ' .tick', $elem).text(matchData.ppt[color]);
            }

            for(var color in matchData.scores) {
                $('.server-points.' + color + ' .points', $elem).text(seperateThousands(matchData.scores[color]))
                $('.server-points.' + color + ' .server-points-progress', $elem).css('width', percentage(matchData.scores[color], matchData.highest_score) + '%');
            }

            console.log(elem, matchData);
        })
    })
}

var lastUpdate = 0;

function updateTime() {
    if(lastUpdate >= 300)
        fetchNewData();

    $('#last-update-label').html(prettyTime(lastUpdate));

    lastUpdate++;
}

var worldsResponse, matchesResponse, loadedWorlds, loadedMatches, matchupTemplate, lastUpdateTimer, worlds = {};

var objectiveScore = {
    "Camp": 5,
    "Tower": 10,
    "Keep": 25,
    "Castle": 35
};

$(document).ready(function () {
    loadedWorlds = false;
    loadedMatches = false;

    matchupTemplate = _.template($('#tpl-matchup').html());

    updateTime();

    $.ajax({
        url: "https://api.keeky.net/proxy-cache",
        method: "POST",
        data: {resource: "gw2-wvw-matchups"},
        dataType: "json"
    }).done(function (data) {

        lastUpdateTimer = setInterval(function(){ updateTime() }, 1000);
        $('#loader').fadeOut();

        for(var regionId in data) {
            var region = data[regionId];

            for(var id in region) {
                var match = region[id];

                $('#matches').append(matchupTemplate({
                    matchId: id,

                    region: match.region,

                    serverNames: match.worlds,

                    serverScores: match.scores,

                    highestScore: match.highest_score,

                    tick: match.ppt,

                    highestTick: 695
                }))
            }
        }
    });
});
