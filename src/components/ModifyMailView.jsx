import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import RootStore from '../RootStore';

function ModifyMailView() {
  const { iutManager, mailManager } = useContext(RootStore);
  if (!iutManager.nbIutSelectionnesId) {
    window.location.replace('/');
  }
  return (
    <>
      <h1 className="text-center text-xl">Modification mail</h1>
      <p className="text-center">
        Votre courriel sera envoyé
        {iutManager.nbIutSelectionnesId < 2 ? " à l'IUT sélectionné" : ` aux ${iutManager.nbIutSelectionnesId} IUT sélectionnés`}
        .
      </p>
      <form method="GET">
        <div className="m-2">
          <label htmlFor="object" className="block text-sm font-medium leading-6">
            Objet
            <input type="text" value={mailManager.objet} onChange={() => { mailManager.objet = event.target.value; }} name="object" id="object" autoComplete="object" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </label>
        </div>
        <div className="m-2">
          <label htmlFor="contenu" className="block text-sm font-medium leading-6">
            Contenu
            <textarea id="contenu" value={mailManager.corpsMail} onChange={() => { mailManager.corpsMail = event.target.value; }} name="contenu" rows="10" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </label>
        </div>
        <div className="grid justify-center">
          <Link className="border-2 p-2  flex m-2 justify-center gap-4" to="/mail">Retour aux informations du mail</Link>
          <Link className="border-2 p-2  flex m-2 justify-center gap-4" to="/mailSend">Envoi du mail</Link>
        </div>
      </form>
      <Footer gauche={{ texte: 'Récapitulatif sélection', lien: 'result' }} />
    </>
  );
}

export default observer(ModifyMailView);
