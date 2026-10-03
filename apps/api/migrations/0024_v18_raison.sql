-- 0024_v18_raison.sql — MISSION V18 : « Ta raison d'être ici »
-- Inversion architecturale (demande fondateur, Mission V18) :
--   AVANT : une app de rencontre avec un parcours de connaissance de soi.
--   APRÈS : un parcours de connaissance de soi dont la rencontre est une
--   destination OPTIONNELLE, activée seulement sur décision explicite,
--   bidirectionnelle et réversible à l'infini.
--
-- Contenu :
--   1. users.raison           — 'voyage' | 'rencontre' | 'indecis' (défaut 'indecis')
--   2. users.raison_updated_at — horodatage du dernier changement (epoch s)
--   3. users.raison_activation — mémoire de la proposition d'activation (B.1) :
--                                'declined' (« Pas maintenant » — plus de relance
--                                automatique) | 'later' (« Me le redemander plus
--                                tard » — reproposée au palier suivant : nouvelles
--                                réponses doctrine depuis la dernière proposition)
--   4. users.raison_asked_at   — dernière fois que la proposition d'activation
--                                a été posée (anti-spam : au plus 1 fois par palier)
--   5. users.raison_pause_reason — motif libre (≤ 300 car.) de la mise en pause
--                                  (rencontre → voyage), lisible dans le profil
--
-- VERROU DOCTRINAL V18.D (au niveau SQL) :
--   Le CHECK borne l'enum à TROIS valeurs. Le statut réservé couple_travail
--   est JAMAIS câblé (Monde couple = P3+ SUR CADRAGE) : il est volontairement
--   ABSENT de cette contrainte — l'ajouter exigerait une nouvelle migration
--   explicite, votée. Ce verrou est testé par ci/test_v18_raison.py (T-1).
--
-- CONFIDENTIALITÉ V18.A.4 (par construction) :
--   Aucune donnée existante n'est modifiée : les comptes passent à
--   'indecis' (état par défaut = l'app ne présume RIEN). Les réponses bêta
--   Q2.5-01/02/03 restent dans q_doctrine_answers (aucun DELETE, aucune
--   réécriture — V18.C : données bêta conservées).
--   La découverte (lib/discovery.ts) ne renvoie que raison='rencontre' —
--   verrou D.1, testé machine (T-4). La raison ne participe JAMAIS au score.
--
-- Append-only : ALTER TABLE ADD COLUMN uniquement — jamais destructif.

-- ---------- 1. La raison d'être ici (V18.A.1) ----------
-- Défaut 'indecis' : tout le monde (majeur, célibataire) peut faire le
-- parcours ; personne n'est présumé « en recherche ».
ALTER TABLE users ADD COLUMN raison TEXT NOT NULL DEFAULT 'indecis'
  CHECK (raison IN ('voyage', 'rencontre', 'indecis'));

-- ---------- 2. Horodatage du changement ----------
ALTER TABLE users ADD COLUMN raison_updated_at INTEGER;

-- ---------- 3. Mémoire de la proposition d'activation (B.1) ----------
ALTER TABLE users ADD COLUMN raison_activation TEXT
  CHECK (raison_activation IS NULL OR raison_activation IN ('declined', 'later'));

-- ---------- 4. Anti-spam de la proposition (au plus 1 fois par palier) ----------
ALTER TABLE users ADD COLUMN raison_asked_at INTEGER;

-- ---------- 5. Motif de pause (B.3 — lisible dans le profil) ----------
ALTER TABLE users ADD COLUMN raison_pause_reason TEXT;

-- ---------- Index découverte (verrou D.1 — bassin 'rencontre') ----------
CREATE INDEX IF NOT EXISTS idx_users_raison_rencontre
  ON users(raison) WHERE raison = 'rencontre';
