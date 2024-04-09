import React, { useContext } from 'react';
import { observer } from 'mobx-react';
import Footer from './Footer';
import RootStore from '../RootStore';

function ModifyMailView() {
  const { mailManager } = useContext(RootStore);
  return (
    <>
      <h1 className="text-center text-xl font-bold">Courriel type modifiable</h1>
      <p className="text-center text-xs sm:text-base lg:px-80">
        L&apos;objet n&apos;est pas modifiable, vous pouvez modifier tout
        le corps du courriel. Vous pouvez aussi déposer en pièces jointes vos offres.
      </p>
      <form method="GET">
        <div className="m-2">
          <label htmlFor="object" className="block text-sm font-medium leading-6">
            Objet
            <input type="text" value={mailManager.objet} name="object" id="object" readOnly="readonly" className="block p-1 w-full rounded-md border-0 py-1.5 text-gray-500 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6" />
          </label>
        </div>
        <div className="m-2">
          <label htmlFor="contenu" className="block text-sm font-medium leading-6">
            Contenu
            <textarea id="contenu" value={mailManager.corpsMail} onChange={(evt) => { mailManager.corpsMail = evt.target.value; }} name="contenu" rows="10" className="block w-full p-1 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
          </label>
        </div>
      </form>
      <Footer gauche={{ texte: 'Retour aux informations du courriel', lien: '/mail' }} droite={{ texte: 'Envoyer mon courriel', lien: '/mailSend' }} />
    </>
  );
}
export default observer(ModifyMailView);
