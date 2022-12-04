def filterNames($lang):
    .names
    |map(select(.language.name == $lang))
    |map(.name)
;

def getType($lang):
    {
        id,
        name: filterNames($lang)[0],
        color #null, set by the glue code
    }
;

. | getType("en")