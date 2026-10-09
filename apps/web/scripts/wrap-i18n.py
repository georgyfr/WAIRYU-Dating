#!/usr/bin/env python3
"""Wrap content-module exports with avecEN (i18n deep-merge).

For each (file, exportName, kind):
  1. `export const NAME` -> `const NAME_FR`
  2. insert `export const NAME = avecEN(NAME_FR, ENX.NAME);` after the
     declaration block
  3. add the two import lines after the last existing import

kind: 'arr' (ends with a lone `];` at col 0)
      'obj' (ends with a lone `};` at col 0)
      'str' (ends with a line whose stripped content ends with `';`)
      'line' (declaration ends on the same line with `;`)
"""
import re
import pathlib

SRC = pathlib.Path('/home/z/wairyu/apps/web/src/lib')

TARGETS = {
    'quete-1-1.ts': ('EN_Q11', 'quete-1-1', [('ITEMS', 'arr')]),
    'quete-1-2.ts': ('EN_Q12', 'quete-1-2', [('ITEMS', 'arr')]),
    'quete-1-3.ts': ('EN_Q13', 'quete-1-3', [('ITEMS', 'arr')]),
    'quete-1-4.ts': ('EN_Q14', 'quete-1-4', [('ITEMS', 'arr')]),
    'quete-1-5.ts': ('EN_Q15', 'quete-1-5', [('CHOIX', 'arr')]),
    'quete-1-6.ts': ('EN_Q16', 'quete-1-6', [('ITEMS', 'arr'), ('ENIGMES', 'arr')]),
    'quete-1-7.ts': ('EN_Q17', 'quete-1-7', [('QUESTIONS_17', 'arr'), ('ECRAN_17', 'obj')]),
    'quete-1-9.ts': ('EN_Q19', 'quete-1-9', [('ITEMS', 'arr')]),
    'quete-1-10.ts': ('EN_Q110', 'quete-1-10', [('ITEMS', 'arr')]),
    'quete-1-11.ts': ('EN_Q111', 'quete-1-11', [('QUESTIONS_111', 'arr'), ('SORTIES_111', 'obj')]),
    'quete-2-1.ts': ('EN_Q21', 'quete-2-1', [('ITEMS', 'arr')]),
    'quete-2-2.ts': ('EN_Q22', 'quete-2-2', [('ITEMS', 'arr')]),
    'quete-2-3.ts': ('EN_Q23', 'quete-2-3', [('ITEMS', 'arr')]),
    'quete-2-4.ts': ('EN_Q24', 'quete-2-4', [('ITEMS', 'arr')]),
    'quete-2-5.ts': ('EN_Q25', 'quete-2-5', [('ITEMS', 'arr'), ('MESSAGE_DOUX', 'str')]),
    'quete-2-6.ts': ('EN_Q26', 'quete-2-6', [('AXES', 'arr')]),
    'quete-2-7.ts': ('EN_Q27', 'quete-2-7', [('ITEMS', 'arr')]),
    'quete-2-8.ts': (
        'EN_Q28',
        'quete-2-8',
        [
            ('QUESTION_28', 'line'),
            ('SIGNE_OPTIONS', 'arr'),
            ('DISCLAIMER_28', 'str'),
            ('INTRO_28', 'obj'),
            ('ENTETE_ECRAN_28', 'line'),
            ('PIED_ECRAN_28', 'str'),
            ('FENETRE_28', 'obj'),
        ],
    ),
    'quetes-plus.ts': ('EN_ARCHE', 'arches', [('ARCHE', 'obj')]),
}


def find_decl_end(lines, start, kind):
    """Index of the last line of the declaration block (>= start)."""
    if kind == 'line':
        return start
    for j in range(start + 1, len(lines)):
        s = lines[j].strip()
        if kind == 'arr' and s == '];':
            return j
        if kind == 'obj' and s == '};':
            return j
        if kind == 'str' and s.endswith("';") and not s.startswith('export'):
            return j
    raise RuntimeError(f'end not found (kind={kind}) after line {start}')


def wrap_file(path, enx, en_module, names):
    lines = path.read_text(encoding='utf-8').split('\n')
    # 1. add imports after the last top-level `import ...` line (or before
    #    the first export if the file has no imports)
    imp = [
        "import { avecEN } from '../i18n/apply';",
        f"import * as {enx} from '../i18n/content/en/{en_module}';",
    ]
    import_lines = [i for i, l in enumerate(lines) if l.startswith('import ')]
    if import_lines:
        last_import = max(import_lines)
        lines[last_import + 1:last_import + 1] = imp
    else:
        first_export = next(i for i, l in enumerate(lines) if l.startswith('export '))
        lines[first_export:first_export] = imp + ['']

    for name, kind in names:
        # find the declaration line
        idx = None
        for i, l in enumerate(lines):
            if re.match(rf'^export const {re.escape(name)}\b', l):
                idx = i
                break
        if idx is None:
            raise RuntimeError(f'{path.name}: {name} not found')
        lines[idx] = lines[idx].replace(f'export const {name}', f'const {name}_FR', 1)
        end = find_decl_end(lines, idx, kind)
        lines[end + 1:end + 1] = [f'export const {name} = avecEN({name}_FR, {enx}.{name});']

    path.write_text('\n'.join(lines), encoding='utf-8')
    print(f'OK {path.name}')


for fname, (enx, en_module, names) in TARGETS.items():
    wrap_file(SRC / fname, enx, en_module, names)
