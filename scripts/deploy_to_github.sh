#!/usr/bin/env bash
# ALBETH TRANSPORT - Quick GitHub Push & Vercel Auto-Deploy Script
#
# Usage:
#   ./scripts/deploy_to_github.sh <YOUR_GITHUB_PERSONAL_ACCESS_TOKEN> [GITHUB_USERNAME_OR_REPO]
#
# Examples:
#   ./scripts/deploy_to_github.sh ghp_xxxxxxxxxxxxxxxxxxxx
#   ./scripts/deploy_to_github.sh ghp_xxxxxxxxxxxxxxxxxxxx dadathegreat1989/albethtranspo_app
#   ./scripts/deploy_to_github.sh ghp_xxxxxxxxxxxxxxxxxxxx squiddy2/albethtranspo_app

set -e

TOKEN="${1:-$GITHUB_TOKEN}"
REPO_ARG="${2:-dadathegreat1989/albethtranspo_app}"

# Clean up repo arg if user passed full URL
REPO_ARG="${REPO_ARG#https://github.com/}"
REPO_ARG="${REPO_ARG%.git}"

if [ -z "$TOKEN" ]; then
  echo "======================================================================"
  echo "ALBETH TRANSPORT: Push to GitHub & Trigger Vercel Deployment"
  echo "======================================================================"
  echo "WHY ACCESS DENIED HAPPENS:"
  echo "1. GitHub no longer accepts account passwords for git push (since Aug 2021)."
  echo "2. You must use a Personal Access Token (Classic) with the 'repo' scope."
  echo "3. The token must belong to an account with write access to the repository."
  echo ""
  echo "HOW TO FIX:"
  echo "1. Go to: https://github.com/settings/tokens"
  echo "2. Click 'Generate new token (classic)'."
  echo "3. Name it 'Vercel Deploy' and CHECK the 'repo' checkbox."
  echo "4. Copy the generated token (starts with ghp_...)."
  echo "5. Run:"
  echo "     ./scripts/deploy_to_github.sh <YOUR_TOKEN> [YOUR_REPO]"
  echo "======================================================================"
  exit 1
fi

REPO_URL="https://${TOKEN}@github.com/${REPO_ARG}.git"

echo "Configuring remote for https://github.com/${REPO_ARG}..."
git remote set-url origin "$REPO_URL" 2>/dev/null || git remote add origin "$REPO_URL"

echo "Pushing to 'main' branch..."
git push -u origin main --force

echo "Pushing to 'master' branch..."
git push origin main:master --force || true

echo ""
echo "======================================================================"
echo "Successfully pushed to https://github.com/${REPO_ARG} !"
echo "Vercel will now automatically trigger a build and deploy to:"
echo "  https://albethtranspo-app.vercel.app/"
echo "======================================================================"
