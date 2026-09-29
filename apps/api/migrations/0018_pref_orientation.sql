-- 0018_pref_orientation — Task 60 (fondateur) : orientation recherchée.
-- L'assistant de complétion demande l'orientation (droit/gay/bi/tous) puis
-- « personnes montrées dans ta découverte » (straight/gay/bi/everyone).
-- Défaut 'everyone' : les comptes existants ne changent pas de comportement.

ALTER TABLE user_preferences ADD COLUMN pref_orientation TEXT NOT NULL DEFAULT 'everyone';
