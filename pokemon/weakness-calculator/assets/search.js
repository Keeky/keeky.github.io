var index = [
    [1, "Bisasam", "Bulbasaur"],
    
]

function search(query) {
    var c = 0;

    var results = index.filter(function(i) {
        var contained = i.indexOf(query)

        if(contained >= 0) {
            c++
            return true
        } else {
            return false
        }
    })

    return results
}

var s = search("Bulbasaur")

console.log(s)