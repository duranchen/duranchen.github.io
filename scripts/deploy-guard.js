'use strict';

/**
 * Guard rails around `hexo deploy` -> GitHub Pages.
 *
 * Hexo auto-loads every file in this folder and wraps it as
 *   (function (exports, require, module, __filename, __dirname, hexo) { ... })
 * so `hexo` is simply in scope below.
 * (node_modules/hexo/lib/hexo/load_plugins.js -> loadScripts)
 *
 * ===========================================================================
 * WHY THIS FILE EXISTS
 *
 * On 2026-09-17 `hexo deploy` force-pushed THIS repository's source over the
 * live site repository (duranchen.github.io). GitHub Pages then failed its
 * Jekyll build with:
 *
 *     github-pages 232 | Error: The next theme could not be found.
 *
 * because Jekyll read this project's Hexo `_config.yml` and its `theme: next`.
 * The live site itself kept serving its last good deployment, so nothing was
 * lost — but the site repo ended up holding the wrong content.
 *
 * Root cause, in hexo-deployer-git 0.2.0 / lib/deployer.js:
 *
 *     return fs.exists(deployDir).then(function (exist) {
 *       if (exist) return;         // setup() is the ONLY place that runs `git init`
 *       return setup();
 *     })...
 *
 *     function push(repo) {
 *       return git('add', '-A')
 *         .then(function () { return git('commit', '-m', message); })
 *         .catch(function () {})   // commit failures are swallowed
 *         .then(function () {
 *           return git('push', '-u', repo.url, 'HEAD:' + repo.branch, '--force');
 *         });
 *     }
 *
 * Every git call runs with `cwd: .deploy_git`. So if `.deploy_git` exists but
 * has no `.git` of its own, git resolves upward to the enclosing repository
 * (this one): `git add`/`git commit` operate on THIS repo, and the final push
 * sends `HEAD` — this repo's source — to the site repo with --force.
 *
 * That broken shape is easy to end up in, and it does not announce itself:
 * git cannot store a nested `.git`, so a `.deploy_git` directory that arrives
 * from a checkout (it was committed to this repo back in 2016) has content but
 * no `.git` — exactly the fatal shape. Nothing warns you; the deploy "succeeds".
 *
 * NOTE (2026-09-19): hexo-deployer-git has been removed from package.json and
 * the `deploy` section deleted from _config.yml, so `hexo deploy` now fails
 * with "Deployer not found" and the `deployBefore` event below never fires.
 * This guard is dormant until a deployer is reinstalled — kept as a safety
 * net for that day.
 *
 * ===========================================================================
 * WHAT THIS DOES
 *
 * On `deployBefore` (which fires before the deployer touches .deploy_git):
 *
 *   1. delete a `.deploy_git` that has no `.git`, so the stray state cannot exist
 *   2. create the deploy repo ourselves (`git init`) and make sure an identity
 *      is configured, so `git commit` cannot fail quietly
 *   3. drop a `.nojekyll` into it
 *
 * `.nojekyll` matters because the deployer force-pushes a mirror of the site to
 * the Pages branch, and without `.nojekyll` GitHub Pages runs Jekyll over it.
 * Today's output happens to be Jekyll-safe (no `_`-prefixed paths, no Liquid
 * `{{ }}` anywhere in the rendered pages, no markdown), but that is luck: a
 * future post about e.g. Swig or Go templates would smuggle `{{ }}` into a page
 * and silently break the Pages build.
 *
 * It has to be written into `.deploy_git`, not into `public/`: hexo-fs's
 * emptyDir()/copyDir() skip hidden entries by default
 * (hexo-fs/lib/fs.js — `ignoreHidden == null ? true : options.ignoreHidden`),
 * so a file dropped into `public/` would never reach the deploy repo, while one
 * dropped into `.deploy_git` survives the "Clearing .deploy_git folder" step
 * untouched, because that step also skips hidden entries.
 */

var fs = require('fs');
var pathFn = require('path');
var execFileSync = require('child_process').execFileSync;

var deployDir = pathFn.join(hexo.base_dir, '.deploy_git');
var gitDir = pathFn.join(deployDir, '.git');
var log = hexo.log;

function git(args) {
  return execFileSync('git', args, {
    cwd: deployDir,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });
}

hexo.on('deployBefore', function () {
  // 1. A `.deploy_git` without its own `.git` is the dangerous state, because it
  //    makes the deployer skip `git init` and lets git escape into this repo.
  if (fs.existsSync(deployDir) && !fs.existsSync(gitDir)) {
    log.warn('deploy-guard: .deploy_git exists without a .git of its own. Removing it ' +
             'so the deploy cannot force-push this repo\'s source to the site repo.');
    fs.rmSync(deployDir, { recursive: true, force: true });
  }

  // 2. Bootstrap the deploy repo. Creating the directory makes the deployer skip
  //    its own setup(), so we do the part of setup() that actually matters.
  if (!fs.existsSync(gitDir)) {
    fs.mkdirSync(deployDir, { recursive: true });
    git(['init']);
    log.info('deploy-guard: initialised a fresh git repo in .deploy_git');
  }

  // `git commit` inside .deploy_git inherits the global identity. If there is
  // none, set a local one — otherwise the commit fails, the deployer swallows
  // the error, and the push then dies on an unborn HEAD.
  try {
    git(['config', 'user.email']);
  } catch (err) {
    git(['config', 'user.name', 'Hexo']);
    git(['config', 'user.email', 'hexo@localhost']);
    log.warn('deploy-guard: no git identity configured — set a local one for .deploy_git.');
  }

  // 3. Keep GitHub Pages from running Jekyll over pre-built HTML.
  fs.writeFileSync(pathFn.join(deployDir, '.nojekyll'), '');
});
