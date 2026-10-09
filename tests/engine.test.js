'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {Game, CASES, ACTIONS, COMMANDS} = require('../engine.js');

function snapshot(game) { return structuredClone(game.state); }
function assertValid(game) {
  const s = game.state;
  assert.ok(s.patience >= 0 && s.patience <= 100);
  assert.ok(s.defence >= 0 && s.defence <= game.defendant.defence);
  assert.ok(s.caseIndex >= 0 && s.caseIndex < CASES.length);
  assert.ok(s.claimIndex >= 0 && s.claimIndex < game.defendant.claims.length);
  assert.ok(s.evidence >= 0 && Number.isInteger(s.evidence));
  assert.ok(s.sanctions >= 0 && s.sanctions <= CASES.length);
  assert.equal(new Set(s.inspected).size, s.inspected.length);
  if (s.phase === 'won') assert.equal(s.sanctions, CASES.length);
  if (s.phase === 'lost') assert.equal(s.patience, 0);
}

test('onboarding and the next command cannot skip accountability', () => {
  const game = new Game(); const before = snapshot(game);
  for (const command of ['next','audit','factcheck','subpoena','inspect','roast','coffee']) {
    assert.ok(game.execute(command).length);
    assert.deepEqual(game.state, before);
  }
  game.execute('start'); const active = snapshot(game);
  game.execute('next'); game.execute('start');
  assert.deepEqual(game.state, active);
});

test('a receipt is collected once per claim and invalid subpoenas spend nothing', () => {
  const game = new Game(); game.execute('start');
  const before = snapshot(game); game.execute('subpoena'); assert.deepEqual(game.state, before);
  game.execute('inspect'); assert.equal(game.state.evidence, 1); assert.equal(game.state.patience, 97);
  const inspected = snapshot(game); game.execute('inspect'); assert.deepEqual(game.state, inspected);
  game.execute('subpoena'); assert.equal(game.state.evidence, 0);
  assert.equal(game.state.claimIndex, 1);
});

test('prepared and correctly matched attacks do more damage', () => {
  const matched = new Game(); matched.execute('start');
  const wrong = new Game(); wrong.execute('start');
  matched.execute('audit'); wrong.execute('factcheck');
  assert.equal(CASES[0].defence - matched.state.defence, ACTIONS.audit.damage + 24);
  assert.equal(CASES[0].defence - wrong.state.defence, ACTIONS.factcheck.damage);
  const prepared = new Game(); prepared.execute('start'); prepared.execute('inspect'); prepared.execute('audit');
  assert.equal(CASES[0].defence - prepared.state.defence, ACTIONS.audit.damage + 24 + 8);
});

test('coffee and contempt cannot be farmed, and full patience does not waste coffee', () => {
  const game = new Game(); game.execute('start'); game.execute('coffee');
  assert.equal(game.state.coffeeUsed, false);
  game.execute('roast'); assert.equal(game.state.contempt, 1);
  const roasted = snapshot(game); game.execute('roast'); assert.deepEqual(game.state, roasted);
  game.execute('coffee'); assert.equal(game.state.patience, 100);
  const caffeinated = snapshot(game); game.execute('coffee'); assert.deepEqual(game.state, caffeinated);
});

test('all six cases can be sanctioned with legitimate actions; case boundaries reset allowances', () => {
  const game = new Game(); game.execute('start');
  let turns = 0;
  while (game.state.phase !== 'won') {
    assert.ok(turns++ < 50, 'campaign must terminate');
    if (game.state.phase === 'between') {
      const receipts = game.state.evidence;
      game.execute('next');
      assert.equal(game.state.evidence, receipts);
      assert.equal(game.state.coffeeUsed, false);
      assert.equal(game.state.roastUsed, false);
      assert.deepEqual(game.state.inspected, []);
    }
    if (game.state.patience <= 82 && !game.state.coffeeUsed) game.execute('coffee');
    game.execute('inspect');
    game.execute(game.claim.weakness);
    assertValid(game);
    assert.notEqual(game.state.phase, 'lost');
  }
  assert.equal(game.state.sanctions, 6);
  assert.equal(game.state.matched, game.state.attacks);
  const finished = snapshot(game);
  for (const command of ['next','audit','inspect','coffee','roast']) game.execute(command);
  assert.deepEqual(game.state, finished);
});

test('exhaustion is a loss, even when the final blow would close a case', () => {
  const game = new Game(); game.execute('start');
  // Reach a real, nonterminal low-patience state with deliberately bad moves.
  for (let i = 0; i < 2; i++) {
    while (game.state.phase === 'active') game.execute('factcheck');
    if (game.state.phase === 'between') game.execute('next');
  }
  while (game.state.phase === 'active' || game.state.phase === 'between') {
    if (game.state.phase === 'between') game.execute('next');
    else game.execute('factcheck');
  }
  assert.equal(game.state.phase, 'lost');
  assert.equal(game.state.patience, 0);
  const lost = snapshot(game); game.execute('coffee'); assert.deepEqual(game.state, lost);
  const tie = new Game(); tie.execute('start'); tie.state.patience = 7; tie.state.defence = 1;
  tie.execute('audit'); assert.equal(tie.state.phase, 'lost'); assert.equal(tie.state.sanctions, 0);
  game.execute('restart'); assert.deepEqual(game.state, new Game().state);
});

test('identical command streams give identical state and events', () => {
  const left = new Game(); const right = new Game();
  const stream = [' START ','inspect','audit','coffee','inspect','factcheck','inspect','subpoena','next','manifesto','roast','status','sudo reality','__proto__','clear','restart'];
  for (const command of stream) {
    assert.deepEqual(left.execute(command), right.execute(command));
    assert.deepEqual(left.state, right.state);
  }
});

test('informational and unknown commands do not mutate proceedings', () => {
  const game = new Game(); game.execute('start'); const before = snapshot(game);
  for (const command of ['manifesto','provenance','determinism','truth','help','clear','about','exit','status','sudo rm -rf /','<img src=x onerror=alert(1)>','__proto__','constructor','']) {
    game.execute(command); assert.deepEqual(game.state, before);
  }
});

test('mixed command streams preserve bounded resources and valid case progression', () => {
  const game = new Game(); let seed = 20261009;
  for (let i = 0; i < 10000; i++) {
    seed = (Math.imul(seed,1664525) + 1013904223) >>> 0;
    game.execute(COMMANDS[seed % COMMANDS.length]);
    assertValid(game);
  }
});
