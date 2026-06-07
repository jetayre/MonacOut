#!/bin/sh
# Installe les hooks Git versionnés de MonacOut dans .git/hooks.
# Lancé automatiquement par `npm install` (script "prepare"),
# ou manuellement : sh scripts/install-hooks.sh
REPO_ROOT="$(git rev-parse --show-toplevel 2>/dev/null)" || exit 0
[ -d "$REPO_ROOT/.git" ] || exit 0
cp "$REPO_ROOT/scripts/hooks/pre-commit" "$REPO_ROOT/.git/hooks/pre-commit"
chmod +x "$REPO_ROOT/.git/hooks/pre-commit"
echo "✓ Hook pre-commit (LE POLICIER) installé."
