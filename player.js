const SearchState = require("./searchstate");

const ColorTile = function (color, number) {
  this.color = color;
  this.number = number;
};

const Player = function () {
  this.tiles = [];
  this.colorTiles = [];
  this.yellow = [];
  this.blue = [];
  this.black = [];
  this.red = [];
  this.colorList = [];
  this.junkTiles = [];
  this.diffColorSets = new Map();
  this.setCount = 0;

  // oyuncuya taslari ata
  this.setTiles = function (arr) {
    this.tiles = arr;

    // renkleri ata
    this.setColors();

    // taslari gercek tas degerleri olarak duzenle 51 -> 13
    this.setTilesReal();
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

  this.setTilesReal = function () {
    for (let i = 0; i < this.tiles.length; i++) {
      //TODO: check
      let colorId = Math.floor(this.tiles[i] / 13);
      this.tiles[i] = (this.tiles[i] % 13) + 1;
      this.colorTiles.push(new ColorTile(colorId, this.tiles[i]));
    }
  };

  // perleri bul
  this.findTileSets = function () {
    // ayni renk perleri bul
    this.findTileSetsByColor = function (arr) {
      let sets = [];

      while (arr.length > 0) {
        let state = new SearchState();

        let result = this.sameColorSearch(
          arr,
          0,
          arr.length - 1,
          arr[0],
          state
        );

        if (result != null) {
          arr = arr.slice(result.count);
          sets.push(result.tiles);

          if (result.tiles.length > 2) {
            this.setCount++;
          } else {
            this.junkTiles.push(result.tiles);
          }
        } else {
          arr = arr.slice(1);
        }
      }
      return sets;
    };

    // ayni renk perler disindaki taslari bul
    this.calculateRestTiles = function (arrList) {
      for (let i = 0; i < arrList.length; i++) {
        for (let j = 0; j < arrList[i].length; j++) {
          for (let z = 0; z < arrList[i][j].length; z++) {
            let indexCt = this.colorTiles.findIndex(
              (item) => item.color == i && item.number == arrList[i][j][z]
            );
            if (indexCt != -1) {
              this.colorTiles.splice(indexCt, 1);
            }
          }
        }
      }
    };

    // farkli renk perleri bul
    this.findTileSetsByKey = function () {
      // 1..13 seklinde perler tutuldu
      let mappedRestTiles = this.mapRestTiles();

      // tek kalan taslar atildi
      this.diffColorSets = this.calcDiffColorSets(mappedRestTiles);
    };

    // ayni renk perler bulunur
    let yellowSets = this.findTileSetsByColor(this.yellow);
    let blueSets = this.findTileSetsByColor(this.blue);
    let blackSets = this.findTileSetsByColor(this.black);
    let redSets = this.findTileSetsByColor(this.red);

    this.colorList = [yellowSets, blueSets, blackSets, redSets];

    // ayni renk perlerin taslari disindaki taslar birakilir
    this.calculateRestTiles(this.colorList);

    // farkli renk ayni sayi taslarin icinde per ara
    this.findTileSetsByKey();
  };

  this.calculate = function () {
    
    // 2li taslar
    let count2 = [];
    // 3 ve uzeri tasli perler
    let count3 = [];
    let avg = 0;
    
    this.calculateArray = function (arr) {
      for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
          let value = arr[i][j];
          if (value.length == 2) {
            count2.push(value);
          } else if (value.length > 2) {
            count3.push(value);
          }
        }
      }
    };

    this.calculateArray(this.colorList);

    if (this.diffColorSets.size != 0)
      for (let i = 1; i <= 13; i++) {
        let value = this.diffColorSets.get(i);
        if (value) {
          if (value.length == 2) {
            count2.push(value);
          } else if (value.length > 2) {
            count3.push(value);
          }
        }
      }

    // ortalama olarak oyuncu durumunu hesapla
    for (let i = 0; i < count3.length; i++) {
      let value = count3[i].length;
      avg += value;
    }

    if (count3.length > 0) {
      avg /= count3.length;
    }

    return {
      count2: count2,
      count3: avg,
      junk: this.junkTiles.length,
    };
  };

  // her sayi üzerinden +1 ini arayarak ikili veya uclu set'ler bul
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

  // farkli renk taslari grupla
  this.mapRestTiles = function () {
    const tileMap = new Map();

    // 1..13 seklinde tum geri kalan taslari grupla
    for (let i = 0; i < this.colorTiles.length; i++) {
      let tempArr = [this.colorTiles[i]];
      for (let j = i + 1; j < this.colorTiles.length - 1; j++) {
        if (this.colorTiles[i].number == this.colorTiles[j].number)
          tempArr.push(this.colorTiles[j]);
      }
      if (!tileMap.get(this.colorTiles[i].number))
        tileMap.set(this.colorTiles[i].number, tempArr);
      tempArr = [];
    }

    // remove duplicates
    for (let i = 1; i <= 13; i++) {
      if (tileMap.get(i)) {
        let unique = tileMap.get(i).filter(
          (el, index, self) =>
            self.findIndex((t) => {
              return t.number === el.number && t.color === el.color;
            }) === index
        );

        tileMap.set(i, unique);
      }
    }

    return tileMap;
  };

  this.calcDiffColorSets = function (tileMap) {
    for (let i = 1; i <= 13; i++) {
      let current = tileMap.get(i);
      if (current) {
        if (current.length < 2) {
          this.junkTiles.push(current);
          tileMap.delete(i);
        } else {
          this.setCount++;
        }
      }
    }

    return tileMap;
  };

  // kucukten buyuge sirala
  this.sortTiles = function (arr) {
    arr.sort((a, b) => a - b);
  };
};

module.exports = Player;
