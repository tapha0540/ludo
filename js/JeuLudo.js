class JeuLudo {
  tourTermine = true;
  // indique si un event click du canvas est entrain d'être processé.
  eventPrécédentEnCours = false;
  dureeTour = 600;
  tour = 0;
  toursEquipesFiniJeu = [];
  constructor() {
    this.grille = new LudoGrille();
  }
  incrementerTour() {
    do {
      this.tour++;
      if (this.tour >= this.grille.nombreEquipes) this.tour = 0;
    } while (this.toursEquipesFiniJeu.includes(this.tour));
  }
  run() {
    this.grille.dessine(this.tourTermine, this.tour);
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
        /**
         *
         * @param {Pion} pionClique
         */
        if (this.carreEstClique(e, this.grille.dice.carre)) {
          this.grille.dice.nombreAleatoire();
          // tour commencer
          this.tourTermine = false;
        }
      } else {
        const pionClique = this.trouverPionClique(e);

        if (pionClique !== -1) {
          const pionDepasseCheminArrivee = (pion) => {
            return (
              pion.aDepasseCaseArrivee &&
              pion.positionIndex + this.grille.dice.n >=
                this.grille.cheminArriveeLength
            );
          };

          if (!pionClique.aFiniJeu && !pionDepasseCheminArrivee(pionClique)) {
            this.jouerTour(pionClique);
          } else {
            const pionSeul = this.trouverSeulPionDeEquipe();
            if (pionSeul && pionDepasseCheminArrivee(pionSeul)) {
              this.terminerTour();
            }
          }
        }
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
    this.grille.dessine(this.tourTermine, this.tour);
  }
  /**
   * @param {PointerEvent} e
   * @param {{x: number, y: number, size: number}} carre
   */
  carreEstClique(e, carre) {
    const rect = canvas.getBoundingClientRect();
    /* je divise par this.grille.box(la taille de chaque carre du grille) 
     parceque les vrais coordonnées carre.x et carre.y du carre sur la pagesont 
     égales à carre.x = carre.x * this.box et y = carre.y * this.box au lieu de ça
     j'ai divisé (e.clientX - rect.left) et (e.clientY - rect.top) par this.grille.box.
     */
    const x = (e.clientX - rect.left) / this.grille.box;
    const y = (e.clientY - rect.top) / this.grille.box;

    return (
      x >= carre.x &&
      x <= carre.x + carre.size &&
      y >= carre.y &&
      y <= carre.y + carre.size
    );
  }
  /**
   * @param {Pion} pionClique
   */
  jouerTour(pionClique) {
    if (pionClique.aDepasseCaseDepart) {
      // si le pion selection a dépassé de case de départ
      let i = 0;
      const interval = setInterval(() => {
        if (!pionClique.aDepasseCaseArrivee) {
          if (this.pionAfiniChemin(pionClique)) {
            console.log("ce pion a fini le chemin");
            pionClique.positionIndex = 0;
            pionClique.aDepasseCaseArrivee = true;
            pionClique.coordonnees =
              this.grille.cheminsArrivee[this.tour][pionClique.positionIndex];
          } else {
            pionClique.positionIndex++;
            // Si le pion dépasse le dernier élément de la variable chemin on réinitialise sa valeur de nouveau à zero.
            if (pionClique.positionIndex >= this.grille.cheminLength)
              pionClique.positionIndex = 0;
            pionClique.coordonnees =
              this.grille.chemin[pionClique.positionIndex];
          }
        } else {
          pionClique.positionIndex++;
          pionClique.coordonnees =
            this.grille.cheminsArrivee[this.tour][pionClique.positionIndex];
          console.log("chemin arrivee");
        }
        this.redessine();
        i++;
        if (i >= this.grille.dice.n) {
          clearInterval(interval);
          this.enleverPionsCaptures(pionClique);
          if (
            pionClique.aDepasseCaseArrivee &&
            pionClique.positionIndex === this.grille.cheminArriveeLength - 1
          ) {
            pionClique.aFiniJeu = true;
            this.equipeAFiniJeu();
          }
          this.terminerTour();
          this.redessine();
        }
      }, this.dureeTour / 6);
    } else {
      /* s'il n'a pas dépasser la case de départ et que le joueur a eu 6
       le pion pourra maintenant sortir et se positionner à la case de départ de son
       équipe.
       */
      if (this.grille.dice.n === 6 && !pionClique.aDepasseCaseArrivee) {
        switch (this.tour) {
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
        pionClique.aDepasseCaseDepart = true;
        this.terminerTour();
      }
    }
  }
  trouverPionClique(e) {
    const pionsEquipeJouant = this.grille.equipes[this.tour];
    /* si le jooueur n'a aucun pion hors de la case de départ et qu'il n'a pas eu un 6 en cliquant le dé
     * ne vérifie pas si ses pions sont cliqués pour les deplacer.
     */
    if (
      this.grille.dice.n !== 6 &&
      pionsEquipeJouant.every(
        (pion) => !pion.aDepasseCaseDepart || pion.aFiniJeu
      )
    ) {
      this.terminerTour();
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
        !pion.aFiniJeu &&
        this.carreEstClique(e, {
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
    const pionsEquipeJouant = this.grille.equipes[this.tour];

    let compterPionsDepasseeCaseDepart = 0;

    let IndexPionQuiAdepasseeCaseDepart = null;
    //compte le nombre de pion du joueur qui ont dépassé la case de départ et stocke l'index
    for (let i = 0, n = pionsEquipeJouant.length; i < n; i++) {
      const pion = pionsEquipeJouant[i];

      if (pion.aDepasseCaseDepart && !pion.aFiniJeu) {
        compterPionsDepasseeCaseDepart++;
        IndexPionQuiAdepasseeCaseDepart = i;
      }
    }
    /**
     * @type {Pion}
     */
    const pion = pionsEquipeJouant[IndexPionQuiAdepasseeCaseDepart];
    // retourne le seul pion qui a dépassé la case de départ
    if (compterPionsDepasseeCaseDepart === 1 && this.grille.dice.n !== 6)
      return pion;
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
          pion.aDepasseCaseDepart = false;
        }
      }
    }
  }
  terminerTour() {
    this.tourTermine = true;
    if (this.grille.dice.n !== 6) {
      this.incrementerTour();
    }
  }
  /**
   *
   * @param {Pion} pionClique
   */
  pionAfiniChemin(pionClique) {
    // index case final d'un pion =  = chemin.length - indexCaseDepart du pion - 3
    const indexCarreArrivee = this.grille.indexCasesArrivee[this.tour];
    const coordonneesCarreFinal = this.grille.chemin[indexCarreArrivee];
    return (
      pionClique.coordonnees.x === coordonneesCarreFinal.x &&
      pionClique.coordonnees.y === coordonneesCarreFinal.y
    );
  }
  equipeAFiniJeu() {
    const equipeJouant = this.grille.equipes[this.tour];
    if (equipeJouant.every((pion) => pion.aFiniJeu)) {
      this.toursEquipesFiniJeu.push(this.tour);
    }
  }
}
const jeuLudo = new JeuLudo();
for (let i = 0; i < 4; i++) {
  const pionVert = jeuLudo.grille.equipes[0][i];
  pionVert.positionIndex = i;
  pionVert.coordonnees = jeuLudo.grille.cheminsArrivee[0][pionVert.positionIndex];
  pionVert.aDepasseCaseDepart = true;
  pionVert.aDepasseCaseArrivee = true;
}

jeuLudo.run();
