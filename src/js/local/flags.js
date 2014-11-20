define(function() {
   return {
                      // 01010101010101010101010101010101 (flag ruler)
        INPCLOS:   1, // 00000000000000000000000000000001 (in player character line of sight)
        NOMOVE:    2, // 00000000000000000000000000000010 (can't move here)
        NOLIGHT:   4, // 00000000000000000000000000000100 (light cannot pass through here)
        ISWALL:    6, // NOMOVE | NOLIGHT
        MAPPED:    8, // 00000000000000000000000000001000 (player has seen this tile before)
        SUNLIT:   16, // 00000000000000000000000000010000 (this tile is sunlit)
        HASOBJ:   32, // 00000000000000000000000000100000 (there's an object here)
        HASMOB:   64, // 00000000000000000000000001000000 (there's a mob here)
        NONEMPTY: 96, // HASOBJ | HASMOB
        HASITM:  128, // 00000000000000000000000010000000 (there's an item here--could be more than 1)
        CANOPN:  256  // 00000000000000000000000100000000 (door or other portal type)
   };
});