const Player = require("./player");

const Okey = function () {
  this.playerCount = 4;
  this.players = [new Player(), new Player(), new Player(), new Player()];
  this.tiles = [];
  this.tilesCount = 52;
  this.okey = null;
  this.fakeOkey = null;

  // taslar olusturulur
  this.initTiles = function () {
    for (let i = 0; i <= this.tilesCount; i++) {
      if (i < this.tilesCount) {
        this.tiles.push(i, i);
      } else {
        this.tiles.push(i, i, i, i);
      }
    }
  };

  // okey tasi secilir
  this.pickOkey = function () {
    // gostergesiz okey taslari dizisi
    let tempArr = this.tiles.slice(0, this.tilesCount - 1);

    // sahte okey sec
    this.fakeOkey = tempArr[Math.floor(Math.random() * tempArr.length)];

    // 13'ten buyukse ayni renk olmasi icin
    if (this.fakeOkey % 13 == 12) {
      this.okey = this.fakeOkey + 1 - 13;
    } else {
      this.okey = this.fakeOkey + 1;
    }
  };

  // taslari dagit
  this.distrubuteTiles = function () {
    // secilen taslarin benzersiz olmasi icin kontrol tutulacak dizi
    let selected = [];
    // 15 tas verilecek oyuncuyu sec
    let randomPlayerIndex = Math.floor(Math.random() * this.players.length);

    // her oyuncuya benzersiz tas sec
    this.selectWithLoop = function (count) {
      while (selected.length < count) {
        // rastgele sayi sec
        let randomIndex = Math.floor(Math.random() * this.tiles.length);
        let random = this.tiles[randomIndex];

        // tas henuz secilmediyse ekle
        if (selected.indexOf(random) == -1) {
          selected.push(random);
          this.tiles.splice(randomIndex, 1);
        }
      }
    };

    // oyunculara dagitilacak taslari hesapla
    for (let playerIndex = 0; playerIndex < 4; playerIndex++) {
      // rastgele secilen oyuncuya 15 tane dagit
      if (playerIndex == randomPlayerIndex) {
        this.selectWithLoop(15);
      } else {
        this.selectWithLoop(14);
      }

      // oyunculara dagitilacak taslari sirala 
      this.sortTiles(selected);
      // oyunculara taslari dagit
      this.players[playerIndex].setTiles(selected);
      // sonraki dongu icin secilen taslari sifirla
      selected = [];
    }
  };

  // kucukten buyuge sirala
  this.sortTiles = function (arr) {
    arr.sort((a, b) => a - b);
  };

  this.test = function () {
    this.initTiles();
    this.pickOkey();
    this.distrubuteTiles();
  };
};

const t = new Okey();
t.test();
