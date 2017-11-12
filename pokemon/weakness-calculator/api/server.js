var sqlite3 = require('sqlite3');
var fs = require('fs');
var db = new sqlite3.Database('./api.db');

var results = {}
var dicts = {}
var data = {}
var tracker = {
  pokemon: {},
  forms: {}
}

class Pokemon {
  constructor(id) {
    tracker.pokemon[id] = this;
    this.forms = {}
  }
}

class PokemonForm {
  constructor(id) {
    tracker.forms[id] = this;
    this.identifier = -1;
    this.isMega = -1;
    this.isDefault = -1;
    this.stats = {
      hp: -1,
      atk: -1,
      def: -1,
      spAtk: -1,
      spDef: -1,
      speed: -1
    }
    this.types = [-1, -1],
    this.efficiency = {
      0: [-1],
      25: [-1],
      50: [-1],
      100: [-1],
      200: [-1],
      400: [-1],
    }
    this.abilities = [new Ability()]
  }

  setStats(arr) {
    this.stats.hp = arr[0];
    this.stats.atk = arr[1];
    this.stats.def = arr[2];
    this.stats.spAtk = arr[3];
    this.stats.spDef = arr[4];
    this.stats.speed = arr[5];
  }
}

class Ability {
  constructor(id) {
    this.isHidden = -1;
    this.translations = [-1];
    this.id = id || -1;
  }
}

function addToPokemon(id, cb) {
  if(!data[id])
    data[id] = new Pokemon(id)

    cb(data[id])

    fs.writeFile('../assets/data/json/' + id + '.json', JSON.stringify(data[id]), function() {
      console.log(id, 'done')
    });
}



var typeDict = {
    1: "Normal",
    2: "Fighting",
    3: "Flying",
    4: "Poison",
    5: "Ground",
    6: "Rock",
    7: "Bug",
    8: "Ghost",
    9: "Steel",
    10: "Fire",
    11: "Water",
    12: "Grass",
    13: "Electric",
    14: "Psychic",
    15: "Ice",
    16: "Dragon",
    17: "Dark",
    18: "Fairy",

    Normal: 1,
    Fighting: 2,
    Flying: 3,
    Poison: 4,
    Ground: 5,
    Rock: 6,
    Bug: 7,
    Ghost: 8,
    Steel: 9,
    Fire: 10,
    Water: 11,
    Grass: 12,
    Electric: 13,
    Psychic: 14,
    Ice: 15,
    Dragon: 16,
    Dark: 17,
    Fairy: 18
}

function getWeaknessForType(id) {
  return results.efficiencies[id - 1];
}

function calculateTypeEfficiency(type1, type2) {
  var type1chart = getWeaknessForType(typeDict[type1])

  if(!type2)
      return type1chart

  var type2chart = getWeaknessForType(typeDict[type2])

  var mergedTypeCharts = []

  for(var i in type1chart) {
      mergedTypeCharts[i] = type1chart[i] * type2chart[i]
  }

  return mergedTypeCharts
}

function formatTypeEfficiency(arr) {
  var r = {
    400: [],
    200: [],
    100: [],
    50: [],
    25: [],
    0: [],
  };

  for(var i in arr) {
    var ty = arr[i] * 100

    r[ty].push(typeDict[+i + 1]);
  }

  return r
}


function safeArr(arr, i) {
  if(!arr[i])
    arr[i] = [];

  return arr[i];
}

function format() {
  for(var i in results.poke) {
    var poke = results.poke[i];

    addToPokemon(poke.species_id, function(species) {
      var f = new PokemonForm(poke.id);
      f.identifier = results.forms[dicts.form[poke.id]].form_identifier;
      f.isDefault = poke.is_default;
      f.isMega = results.forms[dicts.form[poke.id]].is_mega;

      f.abilities = [];
      for(var abilitySlot in results.abilities[poke.id]) {
        var ability = results.abilities[poke.id][abilitySlot];

        f.abilities[abilitySlot] = new Ability(ability.id)
        f.abilities[abilitySlot].isHidden = ability.isHidden
        f.abilities[abilitySlot].translations = {}
        
        for(var languageID in results.abilityNames[ability.id]) {
          var abilityName = results.abilityNames[ability.id][languageID];

          f.abilities[abilitySlot].translations[dicts.languages[+languageID + 1]] = {
            id: +languageID + 1,
            language: dicts.languages[+languageID + 1],
            name: abilityName,
            description: results.abilityText[ability.id][languageID]
          }
        }
      }
      
      
      f.types = results.types[poke.id];
      var t = calculateTypeEfficiency(f.types[0], f.types[1] || false)
      f.efficiency = formatTypeEfficiency(t);
      f.setStats(results.stats[poke.id]);
      // species.forms[results.forms[dicts.form[poke.id]].form_identifier || 'default'] = f
      // console.log(+f.isDefault ? 'default' : results.forms[dicts.form[poke.id]].form_identifier)
      species.forms[+f.isDefault ? 'default' : results.forms[dicts.form[poke.id]].form_identifier] = f
    })
  }

  // console.log(data)
  fs.writeFile(
    '../assets/data/details.js', 
    'var detailedData = ' + 
    JSON.stringify(data) + 
    // '; var rawResults = ' + 
    // JSON.stringify(results) +
    // '; var dicts = ' +
    // JSON.stringify(dicts) + 
    ''
  );
}

db.serialize(function() {
  db.all("SELECT id FROM pokemon_species", function(err, res) {
    results.ids = res
    console.log(1)
    return true
  })
  
  db.all("SELECT * FROM pokemon_forms", function(err, res) {
    dicts.form = {};
    var r = {}

    for(var i in res) {
      var row = res[i];
      if(row.is_default) {
        dicts.form[row.pokemon_id] = row.id;
      }
      r[row.id] = row
    }

    results.forms = r
    return true
  })
  
  db.all("SELECT * FROM pokemon", function(err, res) {
    dicts.species = {};

    for(var i in res) {
      var row = res[i];
      dicts.species[row.id] = row.species_id;
    }

    results.poke = res
    console.log(3)
    return true
  })
  
  db.all("SELECT * FROM pokemon_abilities", function(err, res) {
    var r = {}

    for(var i in res) {
      var ability = res[i];

      var a = new Ability();
      a.isHidden = ability.is_hidden;
      a.id = ability.ability_id;

      safeArr(r, ability.pokemon_id)[ability.slot - 1] = a
    }

    results.abilities = r
    console.log(4)
    return true
  })
  
  db.all("SELECT * FROM pokemon_types", function(err, res) {
    var r = {}

    for(var i in res) {
      var type = res[i];

      safeArr(r, type.pokemon_id)[type.slot - 1] = typeDict[type.type_id]
    }

    results.types = r
    console.log(5)
    return true
  })
  
  db.all("SELECT * FROM pokemon_stats", function(err, res) {
    var r = {}

    for(var i in res) {
      var stat = res[i];

      safeArr(r, stat.pokemon_id)[stat.stat_id - 1] = stat.base_stat
    }

    results.stats = r
    console.log(6)
    return true
  })
  
  db.all("SELECT * FROM type_efficacy", function(err, res) {
    var r = []

    for(var i in res) {
      var type = res[i];

      safeArr(r, type.target_type_id - 1)[type.damage_type_id - 1] = type.damage_factor / 100
    }

    results.efficiencies = r
    console.log(7)
    return true
  })
  
  db.all("SELECT * FROM ability_names", function(err, res) {
    var r = {}

    for(var i in res) {
      var ability = res[i];

      safeArr(r, ability.ability_id)[ability.local_language_id - 1] = ability.name
    }

    results.abilityNames = r
    console.log(8)
    return true
  })
  
  db.all("SELECT * FROM ability_flavor_text", function(err, res) {
    var r = {}

    for(var i in res) {
      var ability = res[i];

      safeArr(r, ability.ability_id)[ability.language_id - 1] = ability.flavor_text
    }

    results.abilityText = r
    console.log(9)
    return true
  })
  
  db.all("SELECT * FROM languages ORDER BY `order`", function(err, res) {
    var r = {}

    for(var i in res) {
      var language = res[i];

      r[language.id] = language.identifier
      r[language.identifier] = language.id
    }

    dicts.languages = r
    console.log(10)
    return true
  })

  db.all("", function() {
    console.log(0)
    format();
  })
});

db.close();