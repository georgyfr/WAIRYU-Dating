-- 0009_questionnaire.sql — wairyu (Étape 4 : questionnaire progressif & matching)
--
-- 1. q_items : banque de questions VERSIONNÉE (seed D1 — source de vérité).
--    Niveau 1 « Essentiel » : 12 questions (valeurs, objectifs, deal-breakers,
--    style de vie de base — spec §5.2.2). Niveau 2 « Personnalité » :
--    18 questions (communication, Big Five simplifié, attachement/besoins).
--    → ajouter une question = INSERT d'une nouvelle VERSION (version+1) et
--      activation ; l'API ne sert que active=1 de la version max.
-- 2. q_answers : UNE ligne par (utilisateur, question) — sauvegarde à CHAQUE
--    réponse (UPSERT), reprise où on s'est arrêté (spéc §5.2.3).
--
-- Note intégrité : q_answers référence q_items(id) — si une question devient
-- inactive, les réponses restent (l'historique du score est préservé).

-- ---------- 1. Banque de questions ----------
CREATE TABLE q_items (
  id             TEXT PRIMARY KEY,            -- ex. 'n1_q01'
  version        INTEGER NOT NULL DEFAULT 1,
  level          INTEGER NOT NULL CHECK (level IN (1,2)),
  position       INTEGER NOT NULL,
  dimension      TEXT NOT NULL CHECK (dimension IN ('values','goals','communication','personality','attachment')),
  kind           TEXT NOT NULL CHECK (kind IN ('single','multi')),
  prompt         TEXT NOT NULL,
  options_json   TEXT NOT NULL,               -- [{key,label,dbRejects?}]
  max_select     INTEGER,                     -- kind='multi' uniquement
  is_deal_breaker INTEGER NOT NULL DEFAULT 0,
  active         INTEGER NOT NULL DEFAULT 1,
  created_at     INTEGER NOT NULL,
  UNIQUE (level, position, version)
);
CREATE INDEX IF NOT EXISTS idx_q_items_active ON q_items(active, level, position);

-- ---------- 2. Réponses (1 écriture par réponse, upsert) ----------
CREATE TABLE q_answers (
  user_id     TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  item_id     TEXT NOT NULL REFERENCES q_items(id),
  value_json  TEXT NOT NULL,                  -- "cle" ou ["c1","c2"]
  updated_at  INTEGER NOT NULL,
  PRIMARY KEY (user_id, item_id)
);
CREATE INDEX IF NOT EXISTS idx_q_answers_item ON q_answers(item_id);

-- ---------- 3. Seed : NIVEAU 1 — Essentiel (12 questions) ----------
INSERT INTO q_items (id, version, level, position, dimension, kind, prompt, options_json, max_select, is_deal_breaker, active, created_at) VALUES
-- goals (objectifs)
('n1_q01', 1, 1, 1, 'goals', 'single',
 'Quelle est ton intention principale ici ?',
 '[{"key":"serious","label":"Une relation sérieuse"},{"key":"marriage","label":"Le mariage"},{"key":"couple_life","label":"Vivre une belle histoire de couple"},{"key":"open","label":"Découvrir, voir ce qui se présente"},{"key":"friends_first","label":"D''abord des amis"}]',
 NULL, 0, 1, 1790121600),
('n1_q03', 1, 1, 2, 'goals', 'single',
 'Et les enfants, dans tout ça ?',
 '[{"key":"want","label":"J''en veux"},{"key":"have_more","label":"J''en ai, j''en veux encore"},{"key":"have_done","label":"J''en ai, ma tribu est complète"},{"key":"later","label":"Peut-être plus tard"},{"key":"no","label":"Je n''en veux pas"}]',
 NULL, 0, 1, 1790121600),
('n1_q08', 1, 1, 3, 'goals', 'single',
 'Dans 5 ans, tu te vois…',
 '[{"key":"family","label":"Installé·e en famille"},{"key":"career","label":"Concentré·e sur ma carrière"},{"key":"travel","label":"En voyage à travers le monde"},{"key":"business","label":"En train de bâtir mon projet"},{"key":"free","label":"Là où la vie m''emmène"}]',
 NULL, 0, 1, 1790121600),
('n1_q12', 1, 1, 4, 'goals', 'single',
 'Vivre ensemble avant le mariage, pour toi c''est…',
 '[{"key":"important","label":"Important, je veux me connaître avant"},{"key":"no","label":"Non, le mariage d''abord"},{"key":"depends","label":"Cela dépend des circonstances"}]',
 NULL, 0, 1, 1790121600),
-- values (valeurs + deal-breakers)
('n1_q02', 1, 1, 5, 'values', 'multi',
 'Quelles valeurs sont non négociables pour toi ? (3 max)',
 '[{"key":"honesty","label":"L''honnêteté"},{"key":"respect","label":"Le respect"},{"key":"loyalty","label":"La fidélité"},{"key":"family","label":"La famille"},{"key":"ambition","label":"L''ambition"},{"key":"kindness","label":"La bienveillance"},{"key":"freedom","label":"La liberté"},{"key":"faith","label":"La foi"}]',
 3, 0, 1, 1790121600),
('n1_q04', 1, 1, 6, 'values', 'single',
 'Le tabac chez un(e) partenaire ?',
 '[{"key":"ok","label":"Pas un problème"},{"key":"occasionally","label":"Acceptable si occasionnel"},{"key":"incompatible","label":"Rédhibitoire pour moi","dbRejects":["ok","occasionally"]}]',
 NULL, 1, 1, 1790121600),
('n1_q05', 1, 1, 7, 'values', 'single',
 'Une relation ouverte (avec d''autres personnes), tu…',
 '[{"key":"exclusive","label":"Non, exclusivité totale pour moi","dbRejects":["interested"]},{"key":"discussion","label":"Je n''en veux pas, mais à chacun sa vie"},{"key":"interested","label":"Pourquoi pas, cela m''intéresse"}]',
 NULL, 1, 1, 1790121600),
('n1_q09', 1, 1, 8, 'values', 'single',
 'La religion ou la foi, pour toi c''est…',
 '[{"key":"central","label":"Centrale dans ma vie"},{"key":"important","label":"Importante, je pratique"},{"key":"private","label":"Personnelle et privée"},{"key":"not","label":"Pas vraiment importante"}]',
 NULL, 0, 1, 1790121600),
('n1_q11', 1, 1, 9, 'values', 'single',
 'Un(e) partenaire d''une autre religion que la tienne ?',
 '[{"key":"no_problem","label":"Aucun problème"},{"key":"depends","label":"Cela dépend de l''importance de sa foi"},{"key":"same_only","label":"Je préfère partager la même"}]',
 NULL, 0, 1, 1790121600),
-- personality (style de vie de base)
('n1_q06', 1, 1, 10, 'personality', 'single',
 'Ta journée idéale, c''est plutôt…',
 '[{"key":"outdoor","label":"Aventure en plein air"},{"key":"culture","label":"Visites et découvertes culturelles"},{"key":"home","label":"Confort à la maison"},{"key":"social","label":"Repas entre amis ou en famille"},{"key":"work","label":"Je travaille sur mes passions"}]',
 NULL, 0, 1, 1790121600),
('n1_q07', 1, 1, 11, 'personality', 'single',
 'Pour recharger tes batteries, tu as besoin…',
 '[{"key":"alone","label":"De moments seul·e"},{"key":"people","label":"D''entourage et d''ambiance"},{"key":"mix","label":"Un mélange des deux"}]',
 NULL, 0, 1, 1790121600),
('n1_q10', 1, 1, 12, 'personality', 'single',
 'Côté argent, tu es plutôt…',
 '[{"key":"saver","label":"J''épargne, sécurité d''abord"},{"key":"enjoy","label":"Je profite du présent"},{"key":"balanced","label":"Un équilibre des deux"}]',
 NULL, 0, 1, 1790121600);

-- ---------- 4. Seed : NIVEAU 2 — Personnalité (18 questions) ----------
INSERT INTO q_items (id, version, level, position, dimension, kind, prompt, options_json, max_select, is_deal_breaker, active, created_at) VALUES
-- communication
('n2_q01', 1, 2, 1, 'communication', 'single',
 'Quand un conflit surgit, ton premier réflexe…',
 '[{"key":"talk","label":"En parler tout de suite"},{"key":"space","label":"Prendre du recul d''abord"},{"key":"avoid","label":"Éviter le sujet"},{"key":"compromise","label":"Chercher tout de suite un compromis"}]',
 NULL, 0, 1, 1790121600),
('n2_q02', 1, 2, 2, 'communication', 'single',
 'Tu exprimes tes besoins…',
 '[{"key":"direct","label":"Directement, sans détour"},{"key":"hints","label":"Parallèlement, par petites touches"},{"key":"writing","label":"Plus facilement par écrit"},{"key":"time","label":"Avec du temps et de la confiance"}]',
 NULL, 0, 1, 1790121600),
('n2_q03', 1, 2, 3, 'communication', 'single',
 'Un bon débat à deux, c''est…',
 '[{"key":"passionate","label":"Passionné, avec des opinions fortes"},{"key":"calm","label":"Un échange calme et posé"},{"key":"none","label":"Je préfère éviter les débats"}]',
 NULL, 0, 1, 1790121600),
('n2_q04', 1, 2, 4, 'communication', 'single',
 'Côté messages, tu es plutôt…',
 '[{"key":"long","label":"Longs et détaillés"},{"key":"short","label":"Courts et fréquents"},{"key":"voice","label":"Messages vocaux"},{"key":"depends","label":"Cela dépend des moments"}]',
 NULL, 0, 1, 1790121600),
('n2_q05', 1, 2, 5, 'communication', 'single',
 'Quand quelque chose te contrarie…',
 '[{"key":"say","label":"Je le dis sur le moment"},{"key":"first_time","label":"J''ai d''abord besoin de temps"},{"key":"humour","label":"Je dédramatise avec l''humour"},{"key":"withdraw","label":"Je me referme un peu"}]',
 NULL, 0, 1, 1790121600),
('n2_q06', 1, 2, 6, 'communication', 'single',
 'Les silences à deux, pour toi…',
 '[{"key":"comfortable","label":"C''est confortable, pas besoin de parler"},{"key":"uncomfortable","label":"C''est inconfortable"},{"key":"depends","label":"Cela dépend du contexte"}]',
 NULL, 0, 1, 1790121600),
-- personality (Big Five simplifié)
('n2_q07', 1, 2, 7, 'personality', 'single',
 'Dans un groupe, tu es…',
 '[{"key":"center","label":"Au centre de l''attention"},{"key":"observer","label":"L''observateur·rice"},{"key":"organizer","label":"Celui/celle qui organise"},{"key":"listener","label":"À l''écoute de chacun"}]',
 NULL, 0, 1, 1790121600),
('n2_q08', 1, 2, 8, 'personality', 'single',
 'Face à une décision importante, tu fais confiance…',
 '[{"key":"logic","label":"À la logique et aux faits"},{"key":"intuition","label":"À ton intuition"},{"key":"advice","label":"À l''avis de tes proches"}]',
 NULL, 0, 1, 1790121600),
('n2_q09', 1, 2, 9, 'personality', 'single',
 'Les imprévus, ça te…',
 '[{"key":"love","label":"Ravit, c''est ça la vie"},{"key":"minor","label":"Va tant que c''est mineur"},{"key":"stress","label":"Stresse assez vite"}]',
 NULL, 0, 1, 1790121600),
('n2_q10', 1, 2, 10, 'personality', 'single',
 'Tes projets, tu les…',
 '[{"key":"plan","label":"Planifies à l''avance"},{"key":"improvise","label":"Improvises au jour le jour"},{"key":"mix","label":"Un cadre avec de la souplesse"}]',
 NULL, 0, 1, 1790121600),
('n2_q11', 1, 2, 11, 'personality', 'single',
 'Ton énergie au quotidien ressemble à…',
 '[{"key":"high","label":"Une haute tension, toujours en mouvement"},{"key":"steady","label":"Un fleuve calme et régulier"},{"key":"waves","label":"Des vagues, par cycles"}]',
 NULL, 0, 1, 1790121600),
('n2_q12', 1, 2, 12, 'personality', 'single',
 'Face à la nouveauté (plats, lieux, activités), tu…',
 '[{"key":"always","label":"Adore essayer, presque tout le temps"},{"key":"sometimes","label":"Essaie de temps en temps"},{"key":"known","label":"Préfères ce que tu connais"}]',
 NULL, 0, 1, 1790121600),
-- attachment (besoins émotionnels)
('n2_q13', 1, 2, 13, 'attachment', 'single',
 'Dans un couple, tu as besoin de contact…',
 '[{"key":"daily","label":"Chaque jour, c''est vital"},{"key":"few","label":"Quelques fois par semaine suffisent"},{"key":"quality","label":"Peu importe la fréquence, l''essentiel est la qualité"}]',
 NULL, 0, 1, 1790121600),
('n2_q14', 1, 2, 14, 'attachment', 'single',
 'Ton/ta partenaire sort sans toi avec ses amis, tu…',
 '[{"key":"easy","label":"Le vis totalement"},{"key":"slight","label":"Le vis bien, avec un petit pincement"},{"key":"hard","label":"As du mal à le vivre"}]',
 NULL, 0, 1, 1790121600),
('n2_q15', 1, 2, 15, 'attachment', 'multi',
 'Tu montres ton affection par… (2 max)',
 '[{"key":"words","label":"Les mots"},{"key":"touch","label":"Le contact physique"},{"key":"acts","label":"Les actes et l''entraide"},{"key":"gifts","label":"Les attentions et cadeaux"},{"key":"time","label":"Le temps passé ensemble"}]',
 2, 0, 1, 1790121600),
('n2_q16', 1, 2, 16, 'attachment', 'single',
 'Après une dispute, tu as besoin de…',
 '[{"key":"now","label":"Régler ça immédiatement"},{"key":"cool","label":"Souffler un peu, puis en parler"},{"key":"space","label":"Beaucoup d''espace avant de revenir"}]',
 NULL, 0, 1, 1790121600),
('n2_q17', 1, 2, 17, 'attachment', 'single',
 'Les marques d''affection en public, tu…',
 '[{"key":"love","label":"Adore ça"},{"key":"shy","label":"Es un peu timide mais aimes"},{"key":"private","label":"Préfères garder ça pour la sphère privée"}]',
 NULL, 0, 1, 1790121600),
('n2_q18', 1, 2, 18, 'attachment', 'single',
 'Tes émotions, tu les analyses…',
 '[{"key":"always","label":"En continu, j''essaie de me comprendre"},{"key":"needed","label":"Quand c''est nécessaire"},{"key":"rarely","label":"Rarement, je vis et j''avance"}]',
 NULL, 0, 1, 1790121600);
