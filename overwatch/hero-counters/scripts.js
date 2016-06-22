var prettyNames = {
    'genji': 'Genji',
    'mccree': 'McCree',
    'pharah': 'Pharah',
    'reaper': 'Reaper',
    'soldier76': 'Soldier 76',
    'tracer': 'Tracer',
    'bastion': 'Bastion',
    'hanzo': 'Hanzo',
    'junkrat': 'Junkrat',
    'mei': 'Mei',
    'torbjorn': 'Torbjorn',
    'widowmaker': 'Widowmaker',
    'dva': 'D.Va',
    'reinhardt': 'Reinhardt',
    'roadhog': 'Roadhog',
    'winston': 'Winston',
    'zarya': 'Zarya',
    'lucio': 'Lucio',
    'mercy': 'Mercy',
    'symmetra': 'Symmetra',
    'zenyatta': 'Zenyatta',

    'offense': 'Offensive',
    'defense': 'Defensive',
    'tank': 'Tank',
    'support': 'Support',

    'strong': 'is strong against',
    'weak': 'is weak against'
}

function pretty(name) {
    if(prettyNames[name])
        return prettyNames[name];
    else
        return null;
}

$(document).ready(function() {
    var append = '';
    var nav = '';

    _.each(couterData, function(heroes, category) {

        append += '<h1 class="category">' + pretty(category) + '</h1>';
        nav += '<span class="category">' + pretty(category) + '</span>';

        _.each(heroes, function(counters, hero) {
            var content = {
                strong: '',
                weak: ''
            }
            nav += '<a class="hero-link" href="#' + hero + '">' + pretty(hero) + '</a>';
            append += '<div id="' + hero + '" class="over-profile over-container">' +
                '<div class="hero-aside over-image" data-hero="' + hero + '"></div>' +
                '<div class="hero-container">' +
                '<h1>' + pretty(hero) + '</h1>';
            _.each(counters, function(counterHeroes, type) {
                _.each(counterHeroes, function(counter) {
                    //console.log(category, hero, type, counter);
                    content[type] += '<a href="#' + counter + '" class="over-portrait over-container hero-link">' +
                        '<div class="over-image" data-hero="' + counter + '"></div>' +
                        '<div class="over-name">' + pretty(counter) + '</div>' +
                        '</a>'
                })
            })
            _.each(content, function(html, type) {
                append += '<h2>' + pretty(type) + '</h2>' + html
            })
            append += '</div></div>';
        })
    })

    $('#profile-wrapper').append(append);
    $('#profile-nav').append(nav);

    var windowHeight, scrollLock = true;

    function getWindowHeight() {
        windowHeight = $(window).height();
    }

    function scrollToProfile(id) {
        scrollLock = false;

        getWindowHeight();

        var hash = id.replace( /^#/, '' );
        //document.location.hash = id;
        var $target = $(id);

        var targetOffset = $target.offset().top;
        var targetHeight = $target.height();

        if(targetHeight >= windowHeight)
            var scrollPos = targetOffset;
        else
            var scrollPos = targetOffset - windowHeight / 2 + targetHeight / 2;

        scrollPos = Math.round(scrollPos);

        $('.over-profile').removeClass('active');
        $target.addClass('active');

        console.log($target);

        $('html, body').stop().animate({scrollTop: scrollPos}, 500, 'swing', function() {
            $target.attr('id', 'defused');

            var $phantom = $('<div></div>')
                .css({
                    position: 'absolute',
                    visibility: 'hidden',
                    top: scrollPos + 'px'
                })
                .attr('id', hash)
                .appendTo(document.body);

            document.location.hash = hash;

            $phantom.remove();
            $target.attr('id', hash);
            scrollLock = scrollPos;
            console.log(scrollLock, $(document).scrollTop(), scrollPos);
        });
    }

    $(window).scroll(function() {
        if(scrollLock != $(document).scrollTop() && scrollLock) {
            $('.over-profile.active').removeClass('active');
        }
    })

    $('#profile-nav-toggle').click(function(e) {
        e.preventDefault();
        $('html').toggleClass('nav-active');
    })

    if(document.location.hash)
        scrollToProfile(document.location.hash);

    $(".hero-link").click(function(e) {
        e.preventDefault();

        $('html').removeClass('nav-active');

        var id = $(this).attr('href');

        scrollToProfile(id);
    });
})
