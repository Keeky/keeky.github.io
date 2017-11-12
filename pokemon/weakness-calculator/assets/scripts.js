

// Bezier implementation from http://greweb.me/2012/02/bezier-curve-based-easing-functions-from-concept-to-implementation/


/** MIT License
 *
 * KeySpline - use bezier curve for transition easing function
 * Copyright (c) 2012 Gaetan Renaudeau <renaudeau.gaetan@gmail.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the "Software"),
 * to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense,
 * and/or sell copies of the Software, and to permit persons to whom the
 * Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER
 * DEALINGS IN THE SOFTWARE.
 */
 /*
 * KeySpline - use bezier curve for transition easing function
 * is inspired from Firefox's nsSMILKeySpline.cpp
 * Usage:
 * var spline = new KeySpline(0.25, 0.1, 0.25, 1.0)
 * spline.get(x) => returns the easing value | x must be in [0, 1] range
 */
function cubicBezier(bezier) {
    var mX1 = bezier[0];
    var mY1 = bezier[1];
    var mX2 = bezier[2];
    var mY2 = bezier[3];

    this.get = function(aX) {
        if (mX1 == mY1 && mX2 == mY2) return aX; // linear
        return CalcBezier(GetTForX(aX), mY1, mY2);
    }

    function A(aA1, aA2) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
    function B(aA1, aA2) { return 3.0 * aA2 - 6.0 * aA1; }
    function C(aA1)      { return 3.0 * aA1; }

    // Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
    function CalcBezier(aT, aA1, aA2) {
        return ((A(aA1, aA2)*aT + B(aA1, aA2))*aT + C(aA1))*aT;
    }

    // Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
    function GetSlope(aT, aA1, aA2) {
        return 3.0 * A(aA1, aA2)*aT*aT + 2.0 * B(aA1, aA2) * aT + C(aA1);
    }

    function GetTForX(aX) {
        // Newton raphson iteration
        var aGuessT = aX;
        for (var i = 0; i < 4; ++i) {
            var currentSlope = GetSlope(aGuessT, mX1, mX2);
            if (currentSlope == 0.0) return aGuessT;
            var currentX = CalcBezier(aGuessT, mX1, mX2) - aX;
            aGuessT -= currentX / currentSlope;
        }
        return aGuessT;
    }
}


function loadJSON(file, callback) {   
    var xobj = new XMLHttpRequest();
        xobj.overrideMimeType("application/json");
    xobj.open('GET', file, true); // Replace 'my_data' with the path to your file
    xobj.onreadystatechange = function () {
            if (xobj.readyState == 4 && xobj.status == "200") {
            // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
            callback(xobj.responseText);
            }
    };
    xobj.send(null);  
    }



function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

function getScrollPos() {
    if (window.pageYOffset != undefined) {
        return [pageXOffset, pageYOffset];
    } else {
        var sx, sy, d = document,
            r = d.documentElement,
            b = d.body;
        sx = r.scrollLeft || b.scrollLeft || 0;
        sy = r.scrollTop || b.scrollTop || 0;
        return [sx, sy];
    }
}

function isNumber(obj) { return !isNaN(parseFloat(obj)) }

var loadedSpecies
var details
var dw
var dh
var sr
var sf
var orig
var pos
var clone

var mod = 1

var searchResult = doT.template(''+
'<div class="search-result" data-species="{{=it.id}}">'+
'<div class="sprite-wrapper">'+
'    <i class="sprite sprite-{{=it.id}}" style="background-image: url(./media/pokemon/icons/{{=it.id}}.png)"></i>'+
'</div>'+
'<div class="dex-num">{{=it.id}}</div>'+
'<div class="label">{{=it.name}}</div>'+
'<div class="types">'+
'    <div class="type icon icon--{{=it.types.primary}}"></div>'+
'    <div class="type icon icon--{{=it.types.secondary}}"></div>'+
'</div>'+
'</div>'+
'')

// var t = searchResult({id: 1, name: "Bisasam", types: {primary: "grass", secondary: "poison"}})

function tog(v) {
    return v ? 'add' : 'remove';
}

function range(num, from, to) {
    return Math.min(Math.max(num, from), to);
}


function floating() {
    dw.style.left = orig.rect.left + 'px'
    dw.style.height = clone.offsetHeight + 5 + 'px'
    dw.style.transform = 'translateY(' + orig.rect.top + 'px' + ')'
}

var options = {
    shouldSort: true,
    threshold: 0.3,
    location: 0,
    distance: 100,
    maxPatternLength: 32,
    minMatchCharLength: 1,
    keys: [
      "id", "title"
    ]
};

var fuse = new Fuse(names, options);

function search(query) {
    var result = fuse.search(query);

    var resArr = [];
    var dupes = [];

    var c = 0;

    var isDexNum = isNumber(query);
    
    result.filter(function(item) {
        if(dupes.indexOf(item.id) == -1 && c < 20) {
            if(isDexNum) {
                item.title = index[item.id].name
            }
            dupes.push(item.id)
            resArr.push({id: item.id, match: item.title})
            c++
        }
    });

    return resArr
}

function searchResultFor(id) {
    return searchResult(index[id])
}

function barData(phy, spec) {
    var bigger = Math.max(phy, spec);
    var smaller = Math.min(phy, spec);

    var relative = spec / (phy + spec) * 100;

    var direction = 0;
    var width = 0;
    var offset = 50;

    if(phy != spec) {
        if(phy > spec) {
            direction = -1;
            width = range((50 - relative) * 1.5, 0, 50)
            offset = 50 - width
        } else {
            direction = 1;
            width = relative % 50
            offset = 50
        }
    }

    console.log(
        'raw', [phy, spec],
        'sort', [bigger, smaller],
        'rel', relative,
        'dir', direction,
        'width', width,
        'offset', offset
    )

    return {
        width: width,
        direction: direction,
        offset: offset
    }
}

var statCurve = new cubicBezier([.5,.5,.58,1]);

function formDetails(data) {
    console.log(data);

    // console.log(barData(+data.stats.atk, +data.stats.spAtk));
    // console.log(barData(+data.stats.def, +data.stats.spDef));

    var bigAtk = Math.max(+data.stats.atk, +data.stats.spAtk) / 180;
    var bigDef = Math.max(+data.stats.def, +data.stats.spDef) / 180;

    // var relAtk = +data.stats.spAtk / (+data.stats.atk + +data.stats.spAtk) * 100;
    // var relDef = +data.stats.spDef / (+data.stats.def + +data.stats.spDef) * 100;

    // var atkDir = Math.round(range(relAtk - 50, -1, 1));
    // var defDir = Math.round(range(relDef - 50, -1, 1));

    // var atkW = relAtk % 50;
    // var defW = relDef % 50;

    // var atkOffset = relAtk >= 50 ? 50 : 50 - atkW
    // var defOffset = relDef >= 50 ? 50 : 50 - defW

    // console.log(
    //     'relAtk', relAtk, 
    //     'atkW', atkW, 
    //     'atkDir', atkDir, 
    //     'atkOffset', atkOffset, 
    //     'atk', data.stats.atk, 
    //     'spAtk', data.stats.spAtk
    // );
    
    // console.log(
    //     'relDef', relDef, 
    //     'defW', defW, 
    //     'defDir', defDir, 
    //     'defOffset', defOffset, 
    //     'def', data.stats.def, 
    //     'spDef', data.stats.spDef
    // );

    return tForm({
        types: data.types,
        percentages: {
            health: statCurve.get(data.stats.hp / 255) * 100,
            atk: barData(+data.stats.atk, +data.stats.spAtk),
            // {
            //     width: atkW,
            //     direction: atkDir,
            //     offset: atkOffset
            // },
            strength: statCurve.get(bigAtk) * 100,
            def: barData(+data.stats.def, +data.stats.spDef),
            // {
            //     width: defW,
            //     direction: defDir,
            //     offset: defOffset
            // },
            defense: statCurve.get(bigDef) * 100,
            speed: statCurve.get(data.stats.speed / 180) * 100
        },
        abilities: data.abilities,
        efficiencies: data.efficiency,
        stats: data.stats
    })
}

function speciesDetails(speciesID, species) {
    // var species = detailedData[speciesID];

    console.log(speciesID, species);

    var f = formDetails(species.forms.default)

    return tDetails({
        species: speciesID,
        forms: species.forms,
        details: f
    })
}

function closeDetails() {
    document.body.classList.remove('end')
    document.body.classList.remove('show-details')
    window.scrollTo({top: pos[1], left: pos[0]})

    orig.rect = orig.elem.getBoundingClientRect()
    floating()
    
    setTimeout(() => {
        document.body.classList.remove('mid')
    }, 250 * mod)

    setTimeout(() => {
        dh.innerHTML = ''
        dw.style.height = 0
        document.body.classList.remove('start')
    }, 500 * mod)
}

details = document.getElementById('details')
dw = document.getElementById('detail-wrapper')
dh = document.getElementById('header')
tDetails = doT.template(document.getElementById('tpl-details').innerHTML);
tForm = doT.template(document.getElementById('tpl-form').innerHTML);

sr = document.getElementById('search-results');
sf = document.getElementById('search')

var activeSearchResult = 0;

sf.addEventListener('input', function() {
    activeSearchResult = 0;

    document.body.classList[tog(this.value)]('content');
    var results = search(this.value);
    document.body.classList[tog(this.value && results[0])]('results')

    var list = ''

    for(var i in results) {
        var r = results[i]
        var result = index[r.id];
        result.name = r.match

        list += searchResult(result)
    }
    
    sr.innerHTML = list
})

sf.addEventListener('focus', function() {
    document.body.classList.add('searchfocus')
})

sf.addEventListener('blur', function() {
    document.body.classList.remove('searchfocus')
})

$('#search').keyup(function(event) {
    if(sr.children.length) {
        if(event.keyCode == 13)
            $(sr.children[activeSearchResult]).click()
        else if(event.keyCode == 40)
            activeSearchResult++
        else if(event.keyCode == 38)
            activeSearchResult--

        activeSearchResult = range(activeSearchResult, 0, sr.children.length - 1)

        $('.search-result').removeClass('focussed');
        sr.children[activeSearchResult].classList.add('focussed')
    }
})

$(document).keyup(function(event) {
    console.log(event);

    if(event.keyCode == 32 || event.keyCode == 27) {
        event.preventDefault();
        $('#search').focus();

        if(document.body.classList.contains('show-details')) {
            closeDetails();
        }
    }
})

// document.addEventListener('click', '#search-wrapper .search-result', function (e) {
$(document).on('click', '#search-wrapper .search-result', function () {

    // sf.blur()
    document.activeElement.blur();

    var that = this;

    $('.loading-data').removeClass('loading-data')
    this.classList.add('loading-data')

    loadJSON('./assets/data/json/' + this.dataset.species + '.json', function(jsonData) {

        that.classList.remove('loading-data')

        loadedSpecies = JSON.parse(jsonData)

        var b = document.createElement('i')
        b.id = 'back'
        
        dh.innerHTML = ''
    
        // clone = this.cloneNode(true)
        // clone.id = 'flex-header'
        // var wrap = document.getElementById('main-wrapper')
        // dh.appendChild(clone)

        console.log(JSON.parse(jsonData).forms)

        clone = document.createElement('div');
        clone.innerHTML = searchResultFor(that.dataset.species);
        // clone.innerHTML = searchResultFor(that.dataset.species, JSON.parse(jsonData));
        clone = clone.children[0];
        clone.id = 'flex-header';
        clone.insertAdjacentElement('afterbegin', b)
    
        dh.appendChild(clone);
    
    
        orig = {
            elem: that,
            rect: that.getBoundingClientRect()
        }
        pos = getScrollPos()

        floating()

        details.innerHTML = speciesDetails(that.dataset.species, loadedSpecies)

        setTimeout(() => {
            document.body.classList.add('start')
            document.body.classList.add('show-details')
            dw.style.height = '100%'
            dw.style.transform = 'translateY(0)'
        }, 100 * mod)
        
        setTimeout(() => {
            document.body.classList.add('mid')
        }, 250 * mod)
        
        setTimeout(() => {
            document.body.classList.add('end')
            window.scrollTo({top: 0, left: 0})
            dw.style.left = ''
        }, 500 * mod)
    
    });
})

$(document).on('click', '#back', function () {
    closeDetails();
})

$(document).on('click', '.forms-wrapper .form', function() {
    var speciesID = this.dataset.species;
    var formID = this.dataset.form;
    
    // var formData = detailedData[speciesID].forms[formID];
    var formData = loadedSpecies.forms[formID];


    $('.forms-wrapper .form').removeClass('active');
    this.classList.add('active');

    document.getElementById('stats-wrapper').innerHTML = formDetails(formData);
})

$('#FAB').click(function() {
    if($('body').hasClass('show-details')) {
        $('#back').click()
    } else
        $('#search').select()
})

$(document).on('click', '.abilities .show-details', function() {
    var blty = this.dataset.ability;

    console.log($('.ability-details-wrapper[data-ability="' + blty + '"]'), '.ability-details-wrapper[data-ability="' + blty + '"]')
    $('.ability-details-wrapper[data-ability="' + blty + '"]').css('display', 'flex');
    this.remove();
})

function refreshNotice() {
    document.body.classList.remove('whitelisted');
    document.body.classList.remove('considered');
    document.body.classList.remove('show-notice');

    if(document.whitelisted) {
        document.body.classList.add('whitelisted')
    } else if(localStorage.getItem('considered')) {
        document.body.classList.add('considered')
    } else {
        document.body.classList.add('show-notice')
    }
}

document.getElementById('considering').addEventListener('click', function() {
    localStorage.setItem('considered', true)
    refreshNotice();
})

refreshNotice()

// var _pokemonSprites = new Image(400,200) //height and width of the image
// _pokemonSprites.src = "./assets/pokemon.png"; // image source (path)