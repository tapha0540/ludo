class Pion {
  positionIndex = -1;
  depasseCaseDepart = false;
  status = "normal";

  /**
   * @param { {x: number, y: number} } coordonnees
   * @type {string} couleurEquipe
   */
  constructor(coordonnees, couleurEquipe) {
    this.coordonnees = coordonnees;
    this.couleurEquipe = couleurEquipe;
  }
  dessinerPion(box) {
    this.rayon = box / 2;

    ctx.fillStyle = this.couleurEquipe;
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2.5;

    ctx.beginPath();
    ctx.arc(
      this.coordonnees.x * box + this.rayon,
      this.coordonnees.y * box + this.rayon,
      this.rayon,
      0,
      2 * Math.PI
    );
    ctx.fill();
    ctx.stroke();
  }
  avancer(cheminLength) {
    this.positionIndex++;
    // Si le pion dépasse le dernier élément de la variable chemin on réinitialise sa valeur de nouveau à zero.
    if (this.positionIndex >= cheminLength) this.positionIndex = 0;
  }
}
