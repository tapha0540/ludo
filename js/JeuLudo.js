class JeuLudo {
  tourTermine = true;
  eventPrécédentEnCours = false;
  dureeTour = 600;
  constructor() {
    this.grille = new LudoGrille();
  }  
  run() {
    this.grille.dessine(this.tourTermine);
    this.eventsListeners();
  }
  eventsListeners() {
    canvas.addEventListener("click", (e) => {
      // Si un l'évènement precédent est toujours en cours ignore le clique.
      if (this.eventPrécédentEnCours) return;
      this.eventPrécédentEnCours = true;
      setTimeout(() => {
        this.eventPrécédentEnCours = false;
      }, this.dureeTour + 50);
      if (this.tourTermine) {
        if (this.isSquareClicked(e, this.grille.dice.carre)) {
          this.grille.dice.nombreAleatoire();
          // tour commencer
          this.tourTermine = false;
        }
      } else {
        const pion = this.trouverPionClique(e);
        if (pion !== -1) {
          console.log(pion);
          this.jouerTour(pion);
        }
      }
      
      // Si un joueur fait 6, il rejoue
      if ( this.tourTermine  && this.grille.dice.n === 6) {
        // Annuler l'incrémentation du tour (le joueur garde la main)
        if (this.grille.dice.tour !== 0) this.grille.dice.tour--;
        else this.grille.dice.tour = 3;
      }
      this.redessine();

    });
    // resize grille
    window.addEventListener("resize", () => {
      resizeCanvas();
      this.grille.box = canvas.height / 15;
      this.redessine();
    });
  }
  redessine() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    this.grille.dessine(this.tourTermine);
  }
  /**
   * @param {PointerEvent} e
   * @param {{x: number, y: number, size: number}} square
   */
  isSquareClicked(e, square) {
    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) / this.grille.box;
    const y = (e.clientY - rect.top) / this.grille.box;
    return (
      x >= square.x &&
      x <= square.x + square.size &&
      y >= square.y &&
      y <= square.y + square.size
    );
  }
  /** 
   * @param {Pion} pionClique
  */
  jouerTour(pionClique) {
    // si le pion selection a dépassé de case de départ
    if (pionClique.depasseCaseDepart) {
      let i = 0;
      const interval = setInterval(() => {
        pionClique.avancer(this.grille.chemin.length);
        
        pionClique.coordonnees = this.grille.chemin[pionClique.positionIndex];
        this.redessine();
        i++;
        if (i >= this.grille.dice.n) {
          clearInterval(interval);
          this.enleverPionsCaptures(pionClique);
          this.TerminerTour();
          this.redessine();
        }
      }, this.dureeTour / 6);
    } else {
      /* s'il n'a pas dépasser la case de départ et que le joueur a eu 6
       le pion pourra maintenant sortir et se positionner à la case de départ de son
       équipe.
       */
      if (this.grille.dice.n === 6) {
        switch (this.grille.dice.tour) {
          case 0:
            pionClique.positionIndex = 0;
            break;
          case 1:
            pionClique.positionIndex = 13;
            break;
          case 2:
            pionClique.positionIndex = 40;
            break;
          case 3:
            pionClique.positionIndex = 27;
            break;
          default:
            throw new Error("dice.tour < 0 || dice.tour > 3");
        }
        pionClique.coordonnees = this.grille.chemin[pionClique.positionIndex];
        pionClique.depasseCaseDepart = true;
        this.TerminerTour();
      }
    }
  }
  trouverPionClique(e) {
    const pionsEquipeJouant = this.grille.equipes[this.grille.dice.tour];
    /* si le jooueur n'a aucun pion hors de la case de départ et qu'il n'a pas eu un 6 en cliquant le dé
     * ne vérifie pas si ses pions sont cliqués pour les deplacer.
     */
    if (
      this.grille.dice.n !== 6 &&
      pionsEquipeJouant.every((pion) => !pion.depasseCaseDepart)
    ) {
      this.TerminerTour();
      return -1;
    }
    const seulPionDeEquipe = this.trouverSeulPionDeEquipe();
    if (seulPionDeEquipe) {
      return seulPionDeEquipe;
    }
    /**
     * détecter quel pion le joueur a cliqué !
     * puis le retourne
     */
    for (const pion of pionsEquipeJouant) {
      if (
        this.isSquareClicked(e, {
          x: pion.coordonnees.x,
          y: pion.coordonnees.y,
          size: 1,
        })
      ) {
        return pion;
      }
    }
    return -1;
  }
  /**
   *
   * @param {Pion} pionsEquipeJouant
   * @returns {Pion}
   */
  trouverSeulPionDeEquipe() {
    const pionsEquipeJouant = this.grille.equipes[this.grille.dice.tour];

    let compterPionsDepasseeCaseDepart = 0;
    let IndexPionQuiAdepasseeCaseDepart = null;
    //compte le nombre de pion du joueur qui ont dépassé la case de départ et stocke l'index
    for (let i = 0, n = pionsEquipeJouant.length; i < n; i++) {
      if (pionsEquipeJouant[i].depasseCaseDepart) {
        compterPionsDepasseeCaseDepart++;
        IndexPionQuiAdepasseeCaseDepart = i;
      }
    }
    // retourne le seul pion qui a dépassé la case de départ
    if (compterPionsDepasseeCaseDepart === 1 && this.grille.dice.n !== 6)
      return pionsEquipeJouant[IndexPionQuiAdepasseeCaseDepart];
  }
  /**
   *
   * @param {Pion} pionClique
   */
  enleverPionsCaptures(pionClique) {
    const n = this.grille.equipes.length;
    for (let i = 0; i < n; i++) {
      const equipePions = this.grille.equipes[i];
      // je saute cette itération si c'est equipePions dans lequel le pionCliqué fait partie.
      if (
        pionClique.couleurEquipe === equipePions[0].couleurEquipe //&&
        // pionClique.coordonnees !== EquipePions[0].coordonnees
      ) {
        continue;
      }
      const m = equipePions.length;
      // je vais vérifier si le pion a capturé un autre pion d'une autre équipe
      // Vérifier si pionClique capture pion
      for (let j = 0; j < m; j++) {
        const pion = equipePions[j];

        const estSurMemeCase =
          pionClique.coordonnees.x === pion.coordonnees.x &&
          pionClique.coordonnees.y === pion.coordonnees.y;

        const estSurCarreProtege = this.grille.carresProteges.some(
          (indexCarre) => {
            return (
              pion.coordonnees.x === this.grille.chemin[indexCarre].x &&
              pion.coordonnees.y === this.grille.chemin[indexCarre].y
            );
          }
        );

        if (estSurMemeCase && !estSurCarreProtege) {
          // On renvoie le pion à sa position par défaut
          const { x, y } = this.grille.coordonneesPionsParDefaut[i][j];
          const rayon = this.grille.box / 2;

          pion.coordonnees = {
            x: x - rayon / this.grille.box,
            y: y - rayon / this.grille.box,
          };
          pion.depasseCaseDepart = false;
        }
      }
    }
  }
  TerminerTour() {
    this.tourTermine = true;
    this.grille.dice.incrementerTour();
  }
}
const jeuLudo = new JeuLudo();
jeuLudo.run();
