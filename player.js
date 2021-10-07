const SearchState = require("./searchstate");

const Player = function () {
  this.tiles = [];
  this.yellow = [1, 2, 3, 8, 9, 11, 13];
  this.blue = [];
  this.black = [];
  this.red = [];

  // give tiles to player
  this.setTiles = function () {};

  // add tiles to color arrays
  this.setColors = function () {};

  // find best tile sets by color
  this.findTileSets = function (arr) {
    let sets = [];

    while (arr.length > 0) {
      let state = new SearchState();

      let result = this.sameColorSearch(arr, 0, arr.length - 1, arr[0], state);

      if (result != null) {
        arr = arr.slice(result.count);
        sets.push(result.tiles);
      } else {
        arr = arr.slice(1);
      }
    }

    return sets;
  };

  this.sameColorSearch = function (arr, firstIndex, lastIndex, search, state) {
    if (lastIndex >= 1) {
      this.mid = firstIndex + Math.floor((lastIndex - 1) / 2);
      if (search == arr[this.mid]) {
        state.add(search);
        let temp = arr.filter((i) => i != search);
        return this.sameColorSearch(temp, 0, temp.length, search + 1, state);
      } else if (search > arr[this.mid])
        return this.sameColorSearch(arr, this.mid, lastIndex, search, state);
      else if (search < arr[this.mid])
        return this.sameColorSearch(arr, firstIndex, this.mid, search, state);
    } else {
      if (state.tiles.length <= 1) {
        return null;
      } else return state.getSet();
    }
  };

  return this.findTileSets(this.yellow);
};

module.exports = Player;
