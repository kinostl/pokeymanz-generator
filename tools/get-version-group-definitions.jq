def getVersionGroup:
    {
        id: .name,
        order,
        versions: .versions | map(.name)
    }
;

. | getVersionGroup