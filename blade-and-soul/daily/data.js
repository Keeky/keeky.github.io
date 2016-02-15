var alerted = false;

var dungeons = [
    {},
    {
        name: "Blackram Supply Chain",
        difficulty: 3
    },

    {
        name: "E. Fleet Supply Chain",
        difficulty: 3
    },
    {
        name: "Skittering Tunnels",
        difficulty: 2
    },{
        name: "Brightstone Ruins",
        difficulty: 2
    },{
        name: "Hall of Ogong",
        difficulty: 2
    },{
        name: "The Pigstry",
        difficulty: 2
    },{
        name: "Skyhaven Stockade",
        difficulty: 1
    },
    {},{
        name: "Agurite Cavern",
        difficulty: 1
    },{},{},{},{
        name: "Tomb of the Exiles",
        difficulty: 3
    }, {
        name: "Bloodshade Harbor",
        difficulty: 3
    }, {
        name: "Nightshade Harbor",
        difficulty: 3
    }, {
        name: "Mushin's Tower",
        difficulty: 3
    }
]

maps = [
    {
        name: "Arena Match"
    },
    {
        name: "Brightstone Village"
    },

    {
        name: "Lycandi Foothills"
    },

    {
        name: "Greenhollow"
    },

    {
        name: "Hogshead Pastures"
    },

    {
        name: "Hogshead Hamlet"
    },

    // 5

    {
        name: "Sapphire Basin"
    },

    {
        name: "Fishbelly Pub"
    },

    {
        name: "The Highland Necropolis"
    },

    {
        name: "Misty Woods"
    },

    {
        name: "Mushin's Tower"
    }
]

var items = [
    {},
    {
        name: "Soulstone"
    }, {
        name: "Soulstone Pouch"
    }
]

var dailies = [

    //////////////////////////
    //Blackram Supply
    //////////////////////////

    {
        name: "Breaking the Chain",
        moneyReward: 8100,
        dungeon: 1,
        location: "Blackram Shipyard",
        map: 4,
        categories: ["Dungeon", "Boss"]
    },

    {
        name: "The Chain of Command",
        moneyReward: 4400,
        dungeon: 2,
        location: "Blackram Shipyard",
        map: 4,
        categories: ["Dungeon"]

    },

    {
        name: "Capsize the Captains",
        moneyReward: 4400,
        dungeon: 2,
        location: "Blackram Shipyard",
        map: 4,
        categories: ["Dungeon"]

    },

    {
        name: "Brethren of the Coast",
        moneyReward: 3800,
        dungeon: 2,
        location: "Blackram Shipyard",
        map: 4,
        categories: ["Dungeon"]

    },

    {
        name: "Allies of the Blackram Marauders",
        moneyReward: 3800,
        dungeon: 2,
        location: "Blackram Shipyard",
        map: 4,
        categories: ["Dungeon"]

    },

    {
        name: "Broadside the Blackram",
        moneyReward: 3800,
        dungeon: 2,
        location: "Blackram Shipyard",
        map: 4,
        categories: ["Dungeon"]

    },

    {
        name: "It's the Little things that Kill",
        moneyReward: 4800,
        dungeon: 2,
        location: "Blackram Shipyard",
        map: 4,
        categories: ["Dungeon", "Boss"]

    },

    //////////////////////////
    //Misty Woods
    //////////////////////////

    {
        name: "The Lords of Ruin",
        moneyReward: 2900,
        location: "Skyhaven Perch",
        dungeon: 4,
        map: 9,
        categories: ["Dungeon", "Boss"]

    },


    {
        name: "Ungsum's Hero",
        moneyReward: 1500,
        location: "Skyhaven Perch",
        map: 9,
        categories: ["Open World"]

    },

    {
        name: "Shinyon's Legacy",
        moneyReward: 1600,
        location: "Skyhaven Perch",
        map: 9,
        categories: ["Open World", "Boss"]

    },

    {
        name: "Hard Corps Raiding",
        moneyReward: 1900,
        location: "Skyhaven Perch",
        map: 9,
        categories: ["Open World"]

    },

    {
        name: "The Bastion Must Not Fall",
        moneyReward: 1500,
        location: "The Watchtowers",
        map: 9,
        categories: ["Open World"]

    },

    {
        name: "Might and Mane",
        moneyReward: 2900,
        dungeon: 7,
        location: "The Watchtowers",
        map: 9,
        categories: ["Dungeon"]

    },

    {
        name: "Riled Hunt",
        moneyReward: 1200,
        location: "The Watchtowers",
        map: 9,
        categories: ["Open World", "Boss"]

    },

    {
        name: "The Rising Tide of Darkness",
        moneyReward: 1200,
        location: "Besieged Camp",
        map: 9,
        categories: ["Open World"]

    },

    {
        name: "Far Worse Things",
        moneyReward: 1300,
        location: "Besieged Camp",
        map: 9,
        categories: ["Open World"]

    },

    //////////////////////////
    //Misty Woods PvP
    //////////////////////////

    {
        name: "Soulstone Provider",
        moneyReward: 850,
        miscReward: {
            choose: {
                1: 2,
                2: 1
            }
        },
        location: "Talus Forward Base",
        map: 9,
        categories: ["Open World", "Faction"]

    },

    {
        name: "Supplies and Demand",
        moneyReward: 850,
        miscReward: {
            choose: {
                1: 2,
                2: 1
            }
        },
        location: "Talus Forward Base",
        map: 9,
        categories: ["Open World", "Faction"]

    },

    {
        name: {
            cerulean: "Drawing a Line",
            crimson: "Switching Tactics"
        },
        moneyReward: 850,
        miscReward: {
            choose: {
                1: 4,
                2: 1
            }
        },
        location: "Talus Forward Base",
        map: 9,
        categories: ["Open World", "Faction"]

    },

    {
        name: {
            cerulean: "No Rights for Villians",
            crimson: "Chaos to Order"
        },
        moneyReward: 850,
        miscReward: {
            choose: {
                1: 4,
                2: 1
            }
        },
        location: "Talus Forward Base",
        map: 9,
        categories: ["Open World", "Faction"]

    },

    {
        name: {
            cerulean: "Unlawful Assemblafe",
            crimson: "Freedom Above All"
        },
        moneyReward: 850,
        miscReward: {
            choose: {
                1: 2,
                2: 1
            }
        },
        location: "Talus Forward Base",
        map: 9,
        categories: ["Open World", "Faction"]

    },

    {
        name: {
            cerulean: "Crimson Rage",
            crimson: "Orderly Bashin'"
        },
        moneyReward: 1200,
        miscReward: {
            choose: {
                1: 2,
                2: 1
            }
        },
        location: "Talus Forward Base",
        map: 9,
        categories: ["Open World", "PvP"]

    },

    {
        name: {
            cerulean: "Wyrm Turner",
            crimson: "God Offal"
        },
        moneyReward: 1300,
        location: "Talus Forward Base",
        map: 9,
        categories: ["Open World", "Faction"]
    },

    //////////////////////////
    //The Highland Necropolis
    //////////////////////////

    {
        name: "Dokumo, Queen of the Spiders",
        moneyReward: 3700,
        location: "Bloodscale Post",
        dungeon: 3,
        map: 8,
        categories: ["Dungeon", "Boss"]
    },

    {
        name: "Durlock, Stock, and Barrel",
        moneyReward: 1500,
        location: "Soul Ward",
        map: 8,
        categories: ["Dungeon"]
    },

    {
        name: "Pest Control",
        moneyReward: 750,
        location: "Bloodscale Post",
        map: 8,
        categories: ["Open World"]
    },

    {
        name: "Any Job worth doing is worth doing well",
        moneyReward: 890,
        location: "Bloodscale Post",
        map: 8,
        categories: ["Open World"]
    },

    {
        name: "Jiangshi Riot",
        moneyReward: 750,
        location: "Snapjaw Camp",
        map: 8,
        categories: ["Open World"]
    },

    {
        name: "A Stab in the Dark",
        moneyReward: 890,
        location: "Snapjaw Camp",
        map: 8,
        categories: ["Open World"]
    },

    //////////////////////////
    //Orchard of Souls
    //////////////////////////

    {
        name: "A Recurring Nightmare",
        moneyReward: 1300,
        location: "Spirit's Rest",
        map: 8,
        categories: ["Open World", "Boss"]
    },

    {
        name: "Laid to Rest",
        moneyReward: 1100,
        location: "Spirit's Rest",
        map: 8,
        categories: ["Open World", "Boss"]
    },

    {
        name: "The Meandering Dead",
        moneyReward: 1300,
        location: "Spirit's Rest",
        map: 8,
        categories: ["Open World"]
    },

    //////////////////////////
    //Hogshead Pastures
    //////////////////////////

    {
        name: "I've Got Soul",
        moneyReward: 460,
        location: "Fishing Lodge",
        dungeon: 9,
        map: 4,
        categories: ["Dungeon"]
    },

    {
        name: "The Hog Days are Over",
        moneyReward: 460,
        location: "Hogshead Hamlet",
        map: 4,
        categories: ["Open World"]
    },

    {
        name: "We got a Little Convoy",
        moneyReward: 610,
        location: "Crop Storage",
        map: 4,
        categories: ["Open World"]
    },

    {
        name: "Sorry to Bug You",
        moneyReward: 610,
        location: "Crop Storage",
        map: 4,
        categories: ["Open World"]
    },

    {
        name: "Negotiating with Hogdonny",
        moneyReward: 2700,
        location: "Hogshead Hamlet",
        dungeon: 6,
        map: 4,
        categories: ["Dungeon", "Boss"]
    },

    {
        name: "Legend of the Hujikar",
        moneyReward: 610,
        location: "Hogshead Farmland",
        map: 4,
        categories: ["Open World", "Boss"]
    },

    {
        name: "Catfished",
        moneyReward: 460,
        location: "Stark Workshop",
        map: 4,
        categories: ["Open World"]
    },

    //////////////////////////
    //Hogshead PvP
    //////////////////////////

    {
        name: "Shock and Automation",
        moneyReward: 460,
        location: "Shipwreck Shallows",
        map: 4,
        categories: ["Open World", "Faction"]
    },

    {
        name: {
            cerulean: "Serve the Cerulean",
            crimson: "Crazy in Crimson"
        },
        moneyReward: 460,
        location: "Shipwreck Shallows",
        map: 4,
        categories: ["Open World", "Faction"]
    },

    //////////////////////////
    //Lycandi Foothills
    //////////////////////////

    {
        name: "Into the Tomb",
        moneyReward: 730,
        miscReward: {
            get: {
                1: 2
            }
        },
        location: "Greenhollow",
        dungeon: 13,
        map: 2,
        categories: ["Dungeon", "Boss"]
    },

    {
        name: "By the Shine of the Moon",
        moneyReward: 320,
        location: "Greenhollow",
        map: 2,
        categories: ["Open World"]
    },

    {
        name: "Too Much to Bear",
        moneyReward: 272,
        location: "Twin Wagons",
        map: 2,
        categories: ["Open World", "Boss"]
    },

    {
        name: "The Unforgivable One",
        moneyReward: 320,
        location: "Hunter's Camp",
        map: 2,
        categories: ["Open World"]
    },

    {
        name: "The Hills Have Prizes",
        moneyReward: 243,
        location: "Lilystalk Tradepost",
        map: 2,
        categories: ["Open World"]
    },

    {
        name: "The Bold",
        moneyReward: 320,
        location: "Lilystalk Tradepost",
        map: 2,
        categories: ["Open World"]
    },

    {
        name: "Where Wolves of Lucandi?",
        moneyReward: 320,
        location: "Lilystalk Tradepost",
        map: 2,
        categories: ["Open World", "Boss"]
    },

    {
        name: "A Pack Divided",
        moneyReward: 520,
        location: "Lilystalk Tradepost",
        map: 2,
        categories: ["Open World"]
    },

    {
        name: "Merry-Monkey Drink",
        moneyReward: 1300,
        location: "Monkeystone",
        map: 2,
        categories: ["Open World"]
    },

    {
        name: "If you come at the King, You best not Miss",
        moneyReward: 2900,
        location: "Monkeystone",
        dungeon: 5,
        map: 2,
        categories: ["Dungeon", "Boss"]
    },

    //////////////////////////
    //Sapphire Basin
    //////////////////////////

    {
        name: "The Halfmoon Merrymaker",
        moneyReward: 660,
        location: "Fishbelly Pub",
        map: 6,
        categories: ["Open World"]
    },

    {
        name: "Extrancurricular Festivities",
        moneyReward: 660,
        location: "Fishbelly Pub",
        map: 6,
        categories: ["Open World"]
    },

    {
        name: "Festive Foodstuffs",
        moneyReward: 580,
        location: "Fishbelly Pub",
        map: 6,
        categories: ["Open World"]
    },

    {
        name: "To Catch a Pilferer",
        moneyReward: 660,
        location: "Fishbelly Pub",
        map: 6,
        categories: ["Open World"]
    },

    {
        name: "Yutay Soiree",
        moneyReward: 880,
        location: "Angler's Watch",
        map: 6,
        categories: ["Open World"]
    },

    {
        name: "The Dreadtide Arena",
        moneyReward: 630,
        location: "Dreadtide Arena",
        map: 6,
        categories: ["Dungeon"]
    },

    {
        name: "Rebels without a Plog",
        moneyReward: 740,
        location: "Koki Village",
        map: 6,
        categories: ["Open World"]
    },

    {
        name: "The Once and Future Plog",
        moneyReward: 1200,
        location: "Koki Village",
        map: 6,
        categories: ["Dungeon"]
    },

    {
        name: "Snap, Crackle, Plog",
        moneyReward: 660,
        location: "The Plogstead",
        map: 6,
        categories: ["Open World"]
    },

    {
        name: "Clash at Blood Peak",
        moneyReward: 660,
        location: "The Plogstead",
        map: 6,
        categories: ["Open World"]
    },

    {
        name: "The Fisher King",
        moneyReward: 740,
        location: "The Plogstead",
        map: 6,
        categories: ["Dungeon", "Boss"]
    },

    //////////////////////////
    //PvP
    //////////////////////////

    {
        name: "You Get a Gold Star",
        moneyReward: 300,
        location: "1v1 Arena",
        map: 0,
        categories: ["PvP"]
    },

    {
        name: "One on One",
        moneyReward: 500,
        location: "1v1 Arena",
        map: 0,
        categories: ["PvP"]
    },

    {
        name: "Tag Match Win",
        moneyReward: 3000,
        location: "3v3 Arena",
        map: 0,
        categories: ["PvP"]
    },

    {
        name: "Triple Tag Match",
        moneyReward: 1500,
        location: "3v3 Arena",
        map: 0,
        categories: ["PvP"]
    },

    {
        name: "The World Wartial Arts Tournament",
        moneyReward: 200,
        location: "1v1 Arena",
        map: 0,
        categories: ["PvP"]
    },

    //////////////////////////
    // Mushin's Tower
    //////////////////////////

    {
        name: "The Final Training",
        moneyReward: 11500,
        location: "Mushin's Tower 7F",
        dungeon: 16,
        map: 10,
        categories: ["Dungeon"]
    },

    {
        name: "Monsters and Mayhem",
        moneyReward: 6700,
        location: "Mushin's Tower 5F",
        dungeon: 16,
        map: 10,
        categories: ["Dungeon"]
    },

    {
        name: "The Trial of the Tower",
        moneyReward: 5800,
        location: "Mushin's Tower 1F",
        dungeon: 16,
        map: 10,
        categories: ["Dungeon"]
    },

    //////////////////////////
    // Blood/Nightshade Harbor
    //////////////////////////

    {
        name: "Blood on the Water",
        moneyReward: 8700,
        location: "Blackram Shipyard",
        dungeon: 14,
        map: 4,
        categories: ["Dungeon"]
    },

    {
        name: "Dead Reckoning",
        moneyReward: 3800,
        location: "Blackram Shipyard",
        dungeon: 15,
        map: 4,
        categories: ["Dungeon"]
    },

    {
        name: "A Shadey Alliance",
        moneyReward: 4400,
        location: "Blackram Shipyard",
        dungeon: 15,
        map: 4,
        categories: ["Dungeon"]
    },

    {
        name: "Officers of the Blackram Marauders",
        moneyReward: 4700,
        location: "Blackram Shipyard",
        dungeon: 15,
        map: 4,
        categories: ["Dungeon"]
    },

    //Removed A Shadey Alliance duplicate

    {
        name: "Poaching the Poachers",
        moneyReward: 4000,
        location: "Blackram Shipyard",
        dungeon: 15,
        map: 4,
        categories: ["Dungeon"]
    },

    {
        name: "Where the Dark is Deepest",
        moneyReward: 4400,
        location: "Blackram Shipyard",
        dungeon: 15,
        map: 4,
        categories: ["Dungeon"]
    },

    {
        name: "The Man Behind the Mystery",
        moneyReward: 5300,
        location: "Blackram Shipyard",
        dungeon: 15,
        map: 4,
        categories: ["Dungeon", "Boss"]
    },

    {
        name: "Bashing Buccaneers",
        moneyReward: 4000,
        location: "Blackram Shipyard",
        dungeon: 15,
        map: 4,
        categories: ["Dungeon"]
    }
]

var defaultSettings = {
    version: 5,
    resetTime: null,
    localTime: new Date(),
    lastModified: new Date(),
    resetHour: 'not set',
    editedTime: false,
    showTags: true,
    nightMode: false,
    goldModifier: 1,
    faction: 'false',
    displayDensity: 'cozy',
    done: [
        {
            name: "Default",
            done: [0]
        }
    ],
};

var settings = {
    data: $.extend(true, {}, defaultSettings),

    reset: function() {
        settings.data = $.extend(true, {}, defaultSettings);
        console.log('Reset all settings to default');
    },

    save: function() {
        try {
            localStorage.setItem('bladeAndSoulDailiesSettings', JSON.stringify(settings.data));
        } catch(e) {
            return false;
        }
        console.log('Saved settings: ', settings.data);
    },

    load: function() {
        console.log('Settings load started. Default settings: ', settings.data);
        try {
            if(localStorage.getItem('bladeAndSoulDailiesSettings')) {
                var localOptions = JSON.parse(localStorage.getItem('bladeAndSoulDailiesSettings'));
                for (var option in localOptions) { settings.data[option] = localOptions[option]; }
            } else
                settings.save();
        } catch(e) {
            console.error(e);
            settings.reset();
        }
        console.log('Settings load finished. New settings: ', settings.data)
    },

    update: function(key, value) {
        if(settings.data[key] != value) {
            settings.data[key] = value;
            console.log('Updated', key, ' to ', value, ' New settings: ', settings.data);
            settings.save();
        } else
            console.log('Skipped update of ', key, ' (Same value)', value)
    },

    toggle: function(key) {
        settings.data[key] = !settings.data[key];
        settings.save();
    },

    setToDefault: function(key) {
        console.log('Reset', key, ' to default: ', defaultSettings[key]);
        settings.update(key, defaultSettings[key]);
    }
}