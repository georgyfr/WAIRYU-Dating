-- 0019_username_canonical — Task 61 (fondateur) : pseudo avec espaces.
-- Le pseudo SAISI (espaces, accents, majuscules) est AFFICHÉ tel quel dans
-- auth_password.username (COLLATE NOCASE), mais la recherche de connexion
-- passe par la forme CANONIQUE : minuscules, sans accents, tout non
-- [a-z0-9_] retiré — « Marie Claire » et « marieclaire » se connectent
-- pareil. Index de la colonne de recherche.
--
-- Rétro-compatibilité : les pseudos 0001–0018 ([a-z0-9_]{3,20}) ont déjà une
-- forme canonique identique à username — l'UPDATE les aligne sans surprise.

ALTER TABLE auth_password ADD COLUMN username_canonical TEXT;

UPDATE auth_password SET username_canonical = LOWER(username)
WHERE username_canonical IS NULL;

CREATE UNIQUE INDEX idx_auth_password_canonical ON auth_password(username_canonical);
