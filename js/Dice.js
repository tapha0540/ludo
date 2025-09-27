class Dice {
  n = null;
  /**
   * @param { {x: number, y: number, size: number} } carre
   * @param {string} couleurEquipe
   */
  constructor(carre, couleurEquipes, nombreEquipes) {
    this.carre = carre;
    this.couleurEquipes = couleurEquipes;
    this.nombreEquipes = nombreEquipes;
    this.nombreAleatoire();
  }
  /**
   *
   * @param {number} box
   * @param {boolean} tourTermine
   */
  dessinerDice(box, tourTermine, tour) {
    const img = new Image();
    const couleurEquipeJouant = this.couleurEquipes[tour];
    let svgText = dicesSvgTexts[this.n - 1].replace(
      'fill="#fff"',
      `fill="${couleurEquipeJouant}"`
    );
    if (tourTermine)
      svgText = svgText.replaceAll(
        'fill="#fff"',
        `fill="${couleurEquipeJouant}"`
      );

    img.src = "data:image/svg+xml;base64," + btoa(svgText);
    img.onload = () => {
      ctx.drawImage(
        img,
        this.carre.x * box,
        this.carre.y * box,
        this.carre.size * box,
        this.carre.size * box
      );
    };
  }
  //  nombre aléatoire entre 1 et 6;
  nombreAleatoire() {
    const max = 6;
    const min = 1;
    this.n = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  
}
