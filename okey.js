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
      this.tiles.push(i, i);
    }
  };

  // okey tasi secilir
  this.pickOkey = function () {
    // sahte okey sec
    this.fakeOkey =
      this.nonFakeTiles[
        Math.floor(Math.random() * this.nonFakeTiles().length - 2)
      ];

    // 13'ten buyukse ayni renk olmasi icin
    if (this.fakeOkey % 13 == 12) {
      this.okey = this.fakeOkey + 1 - 13;
    } else {
      this.okey = this.fakeOkey + 1;
    }
  };

  // sahte okey harici taslar
  this.nonFakeTiles = function () {
    return this.tiles.slice(0, this.tiles.length - 2);
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
        let randomIndex = Math.floor(
          Math.random() * this.nonFakeTiles().length
        );
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

  // en iyi eli bul
  this.findBest = function (playerStats) {

    // oyunculari sirala
    playerStats.sort(function (a, b) {
      // once 0'nci(ortalama per sayisi) sonra 1'nci(2li tas sayisi) bilgiye gore sirala

      if (a[0] < b[0]) return 1;
      if (a[0] > b[0]) return -1;

      if (a[1] < b[1]) return 1;
      if (a[1] > b[1]) return -1;
    });

    // 0 -> en iyi
    // 2 -> oyuncu indisi
    // sirayla [avg, count2.length, i] olarak girildi
    return playerStats[0][2];
  };

  this.main = function () {
    this.initTiles();
    this.pickOkey();
    this.distrubuteTiles();
    let playerStats = [];

    for (let i = 0; i < this.playerCount; i++) {
      console.log(`\n--PLAYER ${i}--\n`);
      this.players[i].findTileSets();
      console.log(`Sari ${this.players[i].yellow}`);
      console.log(`Mavi ${this.players[i].blue}`);
      console.log(`Siyah ${this.players[i].black}`);
      console.log(`Kirmizi ${this.players[i].red}`);

      let stat = this.players[i].stat;
      console.log(`\n2li sayisi -> ${stat.count2.length}`);
      console.log(`Per sayisi (ortalama) -> ${stat.avg}`);
      console.log("\n- - - - - - - - - - - - -");
      // 0 -> en iyi
      // 2 -> oyuncu indisi
      // sirayla [avg, count2.length, i] olarak girildi
      playerStats.push([stat.avg, stat.count2.length, i]);
    }

    console.log(`en iyi oyuncu => PLAYER ${this.findBest(playerStats)}\n`);
  };
};

const okey = new Okey();
okey.main();
