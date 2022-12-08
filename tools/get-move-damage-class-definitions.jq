# ~/pokeapi-data/data/api/v2/move-damage-class/

def filterNames($lang):
    .names
    |map(select(.language.name == $lang))
    |map(.name)
;

def getCategory($lang):
    {
        id: .name,
        name: filterNames($lang)[0],
        color #null, set by the glue code
    }
;

. | getCategory("en")