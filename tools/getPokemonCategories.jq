def getGenus($lang):
    .genera
    | map(select(.language.name==$lang))
    | map(.genus)[0]
;

def getCategory($lang):
    {
        id,
        category: getGenus($lang)
    }
;

. | getCategory("en")