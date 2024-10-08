import { makeAutoObservable } from 'mobx';
import XLSX from 'xlsx';
import { dateToLocalDateTimeString } from '../services/timeService';

class SelectedManager {
  _butSelectionnes;

  _iutSelectionnes;

  _iutSelectionnesId;
  // On enregistre les id à la place car lors de la comparaison, on compare l'iut et son wrapper

  _ready;

  _initializationResolver;

  _dateEnvoi;

  _alreadySend;

  _mapVisited;

  constructor() {
    makeAutoObservable(this);
    this._butSelectionnes = new Set();
    this._iutSelectionnes = new Set();
    this._iutSelectionnesId = new Set();
    this._dateEnvoi = null;
    this._mapVisited = false;
    this._alreadySend = false;
    this._ready = new Promise((resolve) => {
      this._initializationResolver = resolve;
    });
  }

  get butSelectionnes() {
    return this._butSelectionnes;
  }

  set butSelectionnes(butSelectionnes) {
    this._butSelectionnes = butSelectionnes;
  }

  get butSelectionnesId() {
    const tabBut = Array.from(this._butSelectionnes);
    tabBut.map((b) => b.id);
    return tabBut;
  }

  get butSelectionnesTab() {
    return Array.from(this._butSelectionnes);
  }

  get nbButSelectionnes() {
    return this._butSelectionnes.size;
  }

  get iutSelectionnes() {
    return this._iutSelectionnes;
  }

  set iutSelectionnes(iutSelectionnes) {
    this._iutSelectionnes = iutSelectionnes;
  }

  get iutSelectionnesTab() {
    return Array.from(this._iutSelectionnes);
  }

  get iutSelectionnesId() {
    return this._iutSelectionnesId;
  }

  get iutSelectionnesIdTab() {
    return Array.from(this._iutSelectionnesId);
  }

  get nbIutSelectionnesId() {
    return this._iutSelectionnesId.size;
  }

  get dateEnvoi() {
    return this._dateEnvoi;
  }

  set dateEnvoi(dateEnvoi) {
    this._dateEnvoi = dateEnvoi;
  }

  get ready() {
    return this._ready;
  }

  set ready(ready) {
    this._ready = ready;
  }

  get mapVisited() {
    return this._mapVisited;
  }

  set mapVisited(visited) {
    this._mapVisited = visited;
  }

  switchButSelectionnes(but) {
    this._alreadySend = false;
    if (this._butSelectionnes.has(but)) {
      this._butSelectionnes.delete(but);
    } else if (this._butSelectionnes.size < 3) {
      this._butSelectionnes.add(but);
    }
  }

  switchIutSelectionnes(iut) {
    this._alreadySend = false;
    if (this._iutSelectionnesId.has(iut.idIut)) {
      this._iutSelectionnes.delete(iut);
      this._iutSelectionnesId.delete(iut.idIut);
    } else {
      this._iutSelectionnes.add(iut);
      this._iutSelectionnesId.add(iut.idIut);
    }
  }

  switchIutSelectionnesIdByBut() {
    const oldIutRecherches = this._iutSelectionnes;
    this._iutSelectionnes.clear();
    this._iutSelectionnesId.clear();
    this._butSelectionnes.forEach((but) => {
      oldIutRecherches.forEach((i) => {
        if (i.departements.find((d) => d.codesButDispenses[0] === but.code)) {
          this._iutSelectionnes.add(i);
          this._iutSelectionnesId.add(i.idIut);
        }
      });
    });
  }

  async miseAJour() {
    this.iutSelectionnes.forEach(async (i) => {
      await i.getInfo();
    });
  }

  async telecharger(typefile) {
    const now = dateToLocalDateTimeString(Date.now());
    const tab = this.iutSelectionnesTab
      .flatMap((iut) => iut.departements.map((dep) => [iut, dep]))
      .filter(([, d]) => this.butSelectionnesTab.some((b) => b.code === d.butDispenses[0].codeBut))
      .map(([iut, dep]) => ({
        'Filière métiers': this.butSelectionnesTab.find((b) => b.code === dep.butDispenses[0].codeBut).prettyPrintFiliere,
        IUT: iut.nom,
        Site: iut.site,
        'Nom de la formation': this.butSelectionnesTab.find((b) => b.code === dep.butDispenses[0].codeBut).nom,
        Courriel: iut.mel,
        Téléphone: iut.tel,
        "Date de l'extraction": now,
        Suivi: '',
      }));
    const worksheet = XLSX.utils.json_to_sheet(tab);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Récapitulatif');
    XLSX.writeFile(workbook, `Récapitulatif-IUT-alternance.${typefile}`, { bookType: typefile, compression: true });
  }

  loadState(buts, iuts, hasAlreadyVisit) {
    this._butSelectionnes = buts;
    this._iutSelectionnes = iuts;
    this._iutSelectionnesId = iuts.map((iut) => iut.idIut);
    this._firstVisitMap = !hasAlreadyVisit;
  }
}

export default SelectedManager;
