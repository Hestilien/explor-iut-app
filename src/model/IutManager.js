import { makeAutoObservable, runInAction } from 'mobx';
import Iut from './Iut';

class IutManager {
  _iuts;

  _iutSelectionnes;

  _fetchAction;

  _allIutRetrieved;

  constructor() {
    makeAutoObservable(this);
    this._iuts = [];
    this._iutSelectionnes = new Set();
    this._allIutRetrieved = false;
  }

  get iuts() {
    return this._iuts;
  }

  get nbIuts() {
    return this._iuts.length;
  }

  get iutSelectionnes() {
    return this._iutSelectionnes;
  }

  set iutSelectionnes(iut) {
    if (this._iutSelectionnes.has(iut)) {
      this._iutSelectionnes.delete(iut);
    } else {
      this._iutSelectionnes.add(iut);
    }
  }

  get iutSelectionnesTab() {
    return Array.from(this._iutSelectionnes);
  }

  get nbIutSelectionnes() {
    return this._iutSelectionnes.size;
  }

  addIutSelectionnes(iut) {
    const iutIdx = this._iuts.findIndex((b) => b === iut);
    if (iutIdx < 0) {
      throw new Error("Le iut n'existe pas.");
    }
    this._iutSelectionnes.add(iut);
  }

  removeIutSelectionnes(iut) {
    if (!this._iutSelectionnes.delete(iut)) {
      throw new Error("Le iut n'a pas été ajouté.");
    }
  }

  async _getAllIut() {
    if (this._allIutRetrieved) {
      return this._iuts;
    }
    let iuts = await fetch('https://la-lab4ce.univ-lemans.fr/explor-iut/api/v1/iut');
    iuts = await iuts.json();
    return runInAction(() => {
      iuts.forEach((iut) => {
        const unIut = new Iut(iut);
        unIut.getInfo();
        this._iuts.push(unIut);
      });
      this._allIutRetrieved = true;
      return this._iuts;
    });
  }

  async getAllIut() {
    if (!this._fetchAction) {
      this._fetchAction = this._getAllIut();
    }
    return this._fetchAction;
  }

  async load() {
    if (!this._fetchAction) {
      this._fetchAction = await this._getAllIut();
    }
    return this._fetchAction;
  }

  async getIutById(idIut) {
    let iut = this._iuts.find((unIut) => unIut.idIut === idIut && unIut.description);
    if (iut) {
      throw new Error("L'iut a déjà été enregistré");
    }
    iut = await fetch(`https://la-lab4ce.univ-lemans.fr/explor-iut/api/v1/iut/${idIut}`);
    iut = await iut.json();
    runInAction(() => {
      this._iuts.push(new Iut(iut));
    });
  }

  getIutByButs(buts) {
    const iterateur = buts.values();
    console.log(buts.size);
    const iutsBon = [];
    for (let i = 0; i < buts.size; i += 1) {
      console.log(iterateur);
      iutsBon += this._iuts.filter((iut) => iut.departements.find((dep) => dep.code === iterateur.next().value.code));
    }
    return iutsBon;
  }
}

export default IutManager;