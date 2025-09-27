class Pion {
  // la position du pion sur le chemin ou sur le chemin final
  positionIndex = -1;
  // indique si le pion a dépassé le carré de depart de son equipe ou non
  aDepasseCaseDepart = false;
  // indique si le pion a dépasser la case d'arrivée
  aDepasseCaseArrivee = false;
  
  aFiniJeu = false;
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
}
