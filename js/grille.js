class LudoGrille {
  colonnes = 15;
  lignes = 15;
  box = canvas.height / 15;
  nombreEquipes = 4;
  nombrePions = 4;
  /**
   * @type {Pion[][]} equipes
   */
  equipes = [];
  couleurEquipes = ["green", "red", "yellow", "blue"];
  dice = new Dice({ x: 6, y: 6, size: 3 }, this.couleurEquipes, this.nombreEquipes);
  coordonneesPionsParDefaut = [
    [
      { x: 2, y: 2 },
      { x: 4, y: 2 },
      { x: 2, y: 4 },
      { x: 4, y: 4 },
    ],
    [
      { x: 11, y: 2 },
      { x: 13, y: 2 },
      { x: 11, y: 4 },
      { x: 13, y: 4 },
    ],
    [
      { x: 2, y: 11 },
      { x: 4, y: 11 },
      { x: 2, y: 13 },
      { x: 4, y: 13 },
    ],
    [
      { x: 11, y: 11 },
      { x: 13, y: 11 },
      { x: 11, y: 13 },
      { x: 13, y: 13 },
    ],
  ];
  IndexCaseDepart = [0, 13, 40, 27];
  cases = [
    // vert
    {
      grandCarre: { x: 0, y: 0 },
      petitCarre: { x: 1, y: 1 },
      ligne: { x: 1, y: 7, w: 5, h: 1 },
    },
    // deuxième equipe rouge
    {
      grandCarre: { x: 9, y: 0 },
      petitCarre: { x: 10, y: 1 },
      ligne: { x: 7, y: 1, w: 1, h: 5 },
    },
    // troisième equipe jaune
    {
      grandCarre: { x: 0, y: 9 },
      petitCarre: { x: 1, y: 10 },
      ligne: { x: 7, y: 9, w: 1, h: 5 },
    },
    // quatrième equipe bleu
    {
      grandCarre: { x: 9, y: 9 },
      petitCarre: { x: 10, y: 10 },
      ligne: { x: 9, y: 7, w: 5, h: 1 },
    },
  ];
  // les carrés protégés sont les carrés sur lesquels un pion ne peut pas être capturé.
  carresProteges = [
    // les cases de départ sont aussi protégés
    ...this.IndexCaseDepart,
    48,
    8,
    21,
    35,
  ];
  constructor() {
    this.reinitialiserJeu();

    // Préchargement de l'image étoile
    this.etoileImgBlanche = new Image();
    this.etoileImgBlanche.src =
      "data:image/svg+xml;base64," + btoa(etoileBlancheSvgText);
    this.etoileImgStrokeBlack = new Image();
    this.etoileImgStrokeBlack.src =
      "data:image/svg+xml;base64," + btoa(etoileStrokeBlackSvgText);
  }

  dessine(tourTermine) {
    for (let i = 0; i < this.nombreEquipes; i++) {
      const { ligne } = this.cases[i];
      this.dessineLigne(this.couleurEquipes[i], ligne);
    }
    this.dessineGrille();

    for (let i = 0; i < this.nombreEquipes; i++) {
      const { grandCarre, petitCarre } = this.cases[i];

      this.dessinerCase(
        this.couleurEquipes[i],
        grandCarre,
        petitCarre,
        // carre de depart de l'equipe
        this.chemin[this.IndexCaseDepart[i]]
      );
    }

    this.dice.dessinerDice(this.box, tourTermine);
    this.dessinerEtoiles();
    this.dessinerPions();
  }
  dessinerCase(coleurCase, grandCarre, petitCarre, carreDepart) {
    ctx.fillStyle = coleurCase;
    const grandCarreSize = 6;
    const petitCarreSize = 4;
    // grandCarre du case
    ctx.fillRect(
      grandCarre.x * this.box,
      grandCarre.y * this.box,
      grandCarreSize * this.box,
      grandCarreSize * this.box
    );

    // carré de départ
    ctx.fillRect(
      carreDepart.x * this.box,
      carreDepart.y * this.box,
      this.box,
      this.box
    );

    // petit carre du case
    ctx.fillStyle = "white";
    ctx.fillRect(
      petitCarre.x * this.box,
      petitCarre.y * this.box,
      petitCarreSize * this.box,
      petitCarreSize * this.box
    );
    // la ligne entourant le petit carre blanc de chaque cases.
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = "black";
    ctx.strokeRect(
      petitCarre.x * this.box,
      petitCarre.y * this.box,
      petitCarreSize * this.box,
      petitCarreSize * this.box
    );
  }
  dessineLigne(couleur, ligne) {
    ctx.fillStyle = couleur;
    // ligne avec le couleur de chaque équipe hors du carre
    ctx.fillRect(
      ligne.x * this.box,
      ligne.y * this.box,
      ligne.w * this.box,
      ligne.h * this.box
    );
  }
  dessineGrille() {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 0.7;
    for (let i = 0; i < this.lignes; i++) {
      for (let j = 0; j < this.colonnes; j++) {
        ctx.strokeRect(i * this.box, j * this.box, this.box, this.box);
      }
    }
  }
  dessinerEtoiles() {
    if (this.etoileImgBlanche.complete) {
      const n = this.carresProteges.length;
      for (let i = 0; i < n; i++) {
        ctx.drawImage(
          i <= 3 ? this.etoileImgBlanche : this.etoileImgStrokeBlack,
          this.chemin[this.carresProteges[i]].x * this.box,
          this.chemin[this.carresProteges[i]].y * this.box,
          this.box,
          this.box
        );
      }
    }
  }
  dessinerPions() {
    this.equipes.forEach((equipe) => {
      equipe.forEach((pion) => pion.dessinerPion(this.box));
    });
  }
  reinitialiserJeu() {
    this.equipes = [];
    const rayon = this.box / 2;
    for (let i = 0; i < this.nombreEquipes; i++) {
      this.equipes.push([]);
      for (let j = 0; j < this.nombrePions; j++) {
        const { x, y } = this.coordonneesPionsParDefaut[i][j];
        this.equipes[i].push(
          /* 
            5 * 40 - 20 = 180
            x * box - rayon = dx
            x - ( rayon / box ) * box = dx
            5 - (20 / 40) * 40 = 180
          */
          new Pion(
            {
              x: x - rayon / this.box,
              y: y - rayon / this.box,
            },
            this.couleurEquipes[i]
          )
        );
      }
    }
  }
  chemin = [
    // case vert
    {
      x: 1,
      y: 6,
    },
    {
      x: 2,
      y: 6,
    },
    {
      x: 3,
      y: 6,
    },
    {
      x: 4,
      y: 6,
    },
    {
      x: 5,
      y: 6,
    },
    // case rouge
    {
      x: 6,
      y: 5,
    },
    {
      x: 6,
      y: 4,
    },
    {
      x: 6,
      y: 3,
    },
    {
      x: 6,
      y: 2,
    },
    {
      x: 6,
      y: 1,
    },
    {
      x: 6,
      y: 0,
    },
    {
      x: 7,
      y: 0,
    },
    {
      x: 8,
      y: 0,
    },
    {
      x: 8,
      y: 1,
    },
    {
      x: 8,
      y: 2,
    },
    {
      x: 8,
      y: 3,
    },
    {
      x: 8,
      y: 4,
    },
    {
      x: 8,
      y: 5,
    },
    // case bleu
    {
      x: 9,
      y: 6,
    },
    {
      x: 10,
      y: 6,
    },
    {
      x: 11,
      y: 6,
    },
    {
      x: 12,
      y: 6,
    },
    {
      x: 13,
      y: 6,
    },
    {
      x: 14,
      y: 6,
    },
    {
      x: 14,
      y: 7,
    },
    {
      x: 14,
      y: 8,
    },
    {
      x: 14,
      y: 8,
    },
    {
      x: 13,
      y: 8,
    },
    {
      x: 12,
      y: 8,
    },
    {
      x: 11,
      y: 8,
    },
    {
      x: 10,
      y: 8,
    },
    {
      x: 9,
      y: 8,
    },
    // case jaune
    {
      x: 8,
      y: 9,
    },
    {
      x: 8,
      y: 10,
    },
    {
      x: 8,
      y: 11,
    },
    {
      x: 8,
      y: 12,
    },
    {
      x: 8,
      y: 13,
    },
    {
      x: 8,
      y: 14,
    },
    {
      x: 7,
      y: 14,
    },
    {
      x: 6,
      y: 14,
    },
    {
      x: 6,
      y: 13,
    },
    {
      x: 6,
      y: 12,
    },
    {
      x: 6,
      y: 11,
    },
    {
      x: 6,
      y: 10,
    },
    {
      x: 6,
      y: 9,
    },
    {
      x: 5,
      y: 8,
    },
    {
      x: 4,
      y: 8,
    },
    {
      x: 3,
      y: 8,
    },
    {
      x: 2,
      y: 8,
    },
    {
      x: 1,
      y: 8,
    },
    {
      x: 0,
      y: 8,
    },
    {
      x: 0,
      y: 7,
    },
    {
      x: 0,
      y: 6,
    },
  ];
}
