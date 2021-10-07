const SearchState = function () {
  this.count = 0;
  this.tiles = [];

  this.add = function (tile) {
    this.tiles.push(tile);
    this.count++;
  };

  this.getSet = function () {
    return {
      tiles: this.tiles,
      count: this.count,
    };
  };
};

module.exports = SearchState;
