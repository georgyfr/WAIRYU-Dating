/**
 * Couche accompagnement de la quête 1.9 « Ton élan du moment » — Monde 2 « Le Volant ».
 *
 * EntreeRegistre rédigée (couche app, ton Task 35 : tutoiement, simple et littéral,
 * phrases courtes, jamais un diagnostic) — elle explique les barres réelles produites
 * par le scorer du Livrable (quete-1-9.ts). Paliers de lecture : doux < 0.40,
 * équilibré < 0.65, fort (communs quetes.ts).
 *
 * TONALITÉ ÉTAT, systématique : « ces derniers jours », « en ce moment », « ces
 * derniers temps » — jamais « tu es quelqu'un qui… ». Une météo, pas un portrait :
 * aucun niveau n'est un mérite, la lecture est datée et se re-passe au plus tôt à
 * 30 jours. Zéro vocabulaire clinique, zéro normativité de l'élan.
 *
 * Clés des besoins (sans accent, mapping quete-1-9.ts) : 'autonomie' ↔ « autonomie » ·
 * 'competence' ↔ « compétence » (accent au rendu) · 'affiliation' ↔ « affiliation ».
 *
 * Typo : apostrophes ASCII uniquement.
 */
import type { AccompagnementDim, EntreeRegistre } from './quetes';

type Besoin19 = 'autonomie' | 'affiliation' | 'competence';

export const DEF_19: EntreeRegistre = {
  sousTitre: 'La météo du volant : ton élan de ces derniers jours.',

  dims: [
    {
      key: 'autonomie',
      nom: 'Ton autonomie du moment',
      sousLigne: 'ce que tes journées doivent à tes choix',
      genre: 'f',
      lecture:
        'Cette barre dit qui tient le volant ces derniers jours : tes choix, ou les circonstances. Pleine : tes journées te ressemblent — tu décides et tu avances. Légère : le moment décide souvent à ta place. C\'est un état, pas un trait : il bouge avec ta saison.',
    },
    {
      key: 'affiliation',
      nom: 'Ton affiliation du moment',
      sousLigne: 'les vraies conversations, les gens qui comptent',
      genre: 'f',
      lecture:
        'Cette barre dit la place du lien dans tes derniers jours : échanges réels ou journées traversées en silence. Pleine : tu te sens proche des gens qui comptent. Légère : le fil attend un geste — une seule conversation ouverte suffit à le reprendre.',
    },
    {
      key: 'competence',
      nom: 'Ta compétence du moment',
      sousLigne: 'ce que tu entreprends, ce que tu finis',
      genre: 'f',
      lecture:
        'Cette barre dit comment tient ce que tu entreprends en ce moment : ce qui tient, ce que tu finis, ce qui déborde. Pleine : tu termines ce que tu commences, et ça se sent. Légère : les imprévus pilotent la semaine — c\'est une passe, pas un verdict.',
    },
  ],

  accompagnement: {
    autonomie: {
      fort: 'Ces derniers jours, tes journées ressemblent à tes choix : tu décides, tu avances, tu tiens le volant. C\'est une saison où les choses avancent — garde une place vide par semaine pour qu\'elle respire.',
      equilibre: 'Ton autonomie est en deux tons : certaines journées te ressemblent, d\'autres décident à ta place. C\'est l\'état le plus courant — nomme ce qui tient, le reste attend son tour.',
      doux: 'En ce moment, ce sont souvent les circonstances qui décident pour toi. Ce n\'est pas ta façon d\'être : c\'est une météo, datée et passagère — à re-mesurer dans 30 jours.',
    },
    affiliation: {
      fort: 'Ces derniers jours, tu te sens proche des gens qui comptent : les vraies conversations circulent. Ce lien nourrit ton élan plus que tu ne le vois — garde une porte ouverte chaque jour.',
      equilibre: 'Ton lien du moment est en deux tons : des échanges qui portent, des journées qui passent sans vraie conversation. Le fil est là — un geste par jour suffit à le tenir.',
      doux: 'En ce moment, tu traverses des journées sans vraie conversation, et ça se sent. Le besoin d\'affiliation est un besoin d\'échange, pas de présence : une seule conversation ouverte suffit à tenir le fil. Ici, rien n\'est en retard.',
    },
    competence: {
      fort: 'En ce moment, ce que tu entreprends tient debout : tu termines ce que tu commences. Cette efficacité ressentie porte le reste de ton élan — savoure-la sans en rajouter.',
      equilibre: 'Ta compétence du moment est en deux tons : ce que tu avais choisi tient, l\'imprévu prend le reste. Tu n\'es pas inconstant·e — ta saison l\'est, et elle bouge.',
      doux: 'Ces derniers temps, tu te sens démuni·e face aux imprévus. Ce n\'est pas une défaillance : c\'est un état daté, qui se traverse et se re-mesure. Reprends petit : une chose entamée, finie — la continuité revient par là.',
    },
  } as Record<Besoin19, AccompagnementDim>,

  conseils: [
    'Garde un geste de soin par jour — marcher, cuisiner, dormir : l\'élan repart souvent par le quotidien.',
    'Ouvre une vraie conversation par jour : une seule suffit à tenir le fil.',
    'Garde une place vide par semaine : l\'élan y respire, et ta saison pleine n\'emporte pas ta nuit.',
    'Relis ta carte comme une météo : elle date du jour — tu pourras la refaire au plus tôt dans 30 jours.',
  ],

  commentLire:
    'Ces trois barres disent l\'état de tes trois besoins ces derniers jours — une météo, pas un portrait. Une météo se relit, puis elle change : ta passation est datée, et la re-passation arrive au plus tôt dans 30 jours. Aucun niveau n\'est un mérite : un élan bas est une saison, pas une défaillance.',

  ombreRelationnel: {
    V1:
      'À deux, ta météo colore ce que l\'autre rencontre : un élan haut qui en rajoute, un élan bas dont les messages attendent. Le geste qui aide : nommer ta saison à voix haute — l\'autre lit ton aujourd\'hui, pas un désintérêt.',
  } as Record<'V1', string>,

  suivante: '1.10',

  suite: {
    titre: 'Ta météo est prise.',
    intro:
      'Tu sais maintenant où ton élan se trouve ces derniers jours. Mais un voyage à deux ne se mesure pas à ton élan seul : il se mesure à ce que tu y apportes.',
    questions: [
      'Qu\'est-ce que tu apportes, toi, quand deux vies se croisent ?',
      'Qu\'est-ce qui reste de toi quand l\'élan retombe ?',
    ],
    cta: 'Voir ce que j\'apporte',
  },
};
