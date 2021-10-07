const SearchState = require("./searchstate");

const Player = function () {
  this.tiles = [];
  this.yellow = [];
  this.blue = [];
  this.black = [];
  this.red = [];

  // oyuncuya taslari ata
  this.setTiles = function (arr) {
    this.tiles = arr;

    // renkleri ata
    this.setColors();
  };

  // taslari renklere gore ayir
  this.setColors = function () {
    for (let i = 0; i < this.tiles.length; i++) {
      let colorId = Math.floor(this.tiles[i] / 13);
      let tile = (this.tiles[i] % 13) + 1;
      if (colorId == 0) {
        this.yellow.push(tile);
      }

      if (colorId == 1) {
        this.blue.push(tile);
      }

      if (colorId == 2) {
        this.black.push(tile);
      }

      if (colorId == 3) {
        this.red.push(tile);
      }
    }
  };

  // ayni renk taslar uzerinden perleri bul
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
};

module.exports = Player;
