import React, { useContext, useEffect, useState } from 'react';
import { observer } from 'mobx-react';
import { useTranslation } from 'react-i18next';
import SearchResult from './SearchResult';
import RootStore from '../RootStore';
import fleche from '../assets/icone-les-iut.svg';
import Footer from './Footer';
import ModaleDownload from './ModaleDownload';

function ResultView() {
  const { t } = useTranslation();
  const { selectedManager } = useContext(RootStore);
  const [modaleTelechargement, setModaleTelechargement] = useState(false);

  useEffect(() => {
    selectedManager.miseAJour();
  }, [selectedManager, selectedManager.iutSelectionnes]);

  const butSelect = selectedManager.butSelectionnesTab;
  document.addEventListener('keydown', (event) => {
    if (event.code === 'Backspace') { setModaleTelechargement(false); }
  });
  return (
    <>
      {modaleTelechargement
        ? <ModaleDownload onClose={() => setModaleTelechargement(false)} />
        : null}
      <div className="grid justify-center">
        <h1 className="text-center text-xl lg:text-3xl font-bold">{t('recapTitre')}</h1>
        {
            selectedManager.nbIutSelectionnesId > 0 ? (

              <div className="mb-20 grid justify-items-center">
                <div className="max-h-[60vh] gap-2 overflow-auto grid md:grid-cols-3">
                  {selectedManager.iutSelectionnesTab.map((iut) => (
                    <SearchResult butSlct={butSelect} iut={iut} key={iut.site} />
                  ))}
                </div>
                <button type="button" className="border-2 border-blue-900 p-2 w-3/4 mt-2 flex justify-center gap-4" onClick={() => setModaleTelechargement(true)}>
                  <p>{t('recapTelecharger')}</p>
                  <img width={25} src={fleche} alt="fleche" />
                </button>
              </div>
            )
              : <h2 className="sm:text-sm lg:text-base">{t('recapSansChoix')}</h2>
        }
        <Footer
          gauche={{ texte: t('recapRetour'), lien: '/map' }}
          droite={{
            texte: t('recapAvance'), lien: '/mail', disable: selectedManager.nbIutSelectionnesId <= 0, lienActu: '/result',
          }}
        />
      </div>
    </>
  );
}

export default observer(ResultView);
