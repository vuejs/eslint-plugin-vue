#!/usr/bin/env sh

set -e
npm run docs:build
cp -R .circleci docs/.vuepress/dist
cd docs/.vuepress/dist

git config --global user.email "circleci@circleci.com"
git config --global user.name "CircleCI"

git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:vuejs/eslint-plugin-vue.git master:gh-pages

cd -
