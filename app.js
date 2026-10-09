(function () {
  'use strict';
  const {Game, CASES, COMMANDS, NOTICES} = window.TrustMeBro;
  const game = new Game();
  const $ = (id) => document.getElementById(id);
  const transcript = $('transcript');
  const input = $('command');
  const manual = $('manual');
  const history = [];
  let historyIndex = 0;
  let draft = '';
  let archive = [];
  let inputBeforeManual = null;

  function append(lines) {
    const nearBottom = transcript.scrollHeight - transcript.scrollTop - transcript.clientHeight < 70;
    for (const entry of lines) {
      const p = document.createElement('p');
      p.className = `log-line ${entry.kind}`;
      if (entry.kind === 'manifesto') {
        const link = document.createElement('a');
        link.href = './manifesto.html'; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.textContent = entry.text;
        p.appendChild(link);
      } else p.textContent = entry.text;
      transcript.appendChild(p);
      archive.push(entry.text);
    }
    if (nearBottom) transcript.scrollTop = transcript.scrollHeight;
  }
  function openManual() { inputBeforeManual = document.activeElement; if (!manual.open) manual.showModal(); }
  function closeManual() { manual.close(); }
  manual.addEventListener('close', () => { if (inputBeforeManual) inputBeforeManual.focus(); });
  $('help-button').addEventListener('click', openManual);
  $('close-manual').addEventListener('click', closeManual);
  $('manual-done').addEventListener('click', closeManual);

  function render() {
    const s = game.state;
    $('patience-meter').value = s.patience; $('patience-meter').textContent = `${s.patience}%`; $('patience-value').textContent = `${s.patience}%`;
    $('defence-meter').max = game.defendant.defence; $('defence-meter').value = s.defence;
    $('defence-meter').textContent = `${s.defence}/${game.defendant.defence}`;
    $('defence-value').textContent = s.phase === 'briefing' ? '—' : `${s.defence}/${game.defendant.defence}`;
    $('patience-note').textContent = s.patience < 25 ? 'Consider coffee. The next apology is lengthy.' : 'A finite resource. Unlike their seed round.';
    $('bro-note').textContent = s.phase === 'active' ? 'Entirely unsupported. Aggressively monetised.' : s.sanctions ? 'Confidence impounded. Evidence still welcome.' : 'Evidence has not entered the chat.';
    $('evidence-value').textContent = String(s.evidence).padStart(2, '0'); $('forms-value').textContent = String(s.forms).padStart(2, '0'); $('contempt-value').textContent = String(s.contempt).padStart(2, '0');
    $('sanctions-value').replaceChildren(document.createTextNode(String(s.sanctions)));
    const total = document.createElement('span'); total.textContent = '/6'; $('sanctions-value').appendChild(total);
    const phases = {briefing:'NOT CLOCKED IN', active:'IN PROCEEDINGS', between:'CASE CLOSED', won:'SHIFT COMPLETE', lost:'PATIENCE EXTINCT'};
    $('phase-badge').textContent = phases[s.phase];
    $('terminal-path').textContent = s.phase === 'briefing' ? '~/department/onboarding' : `~/department/${game.defendant.slug}`;
    $('case-code').textContent = `TMB-00${s.phase === 'briefing' ? 0 : s.caseIndex + 1}`;
    $('notice').textContent = NOTICES[(s.forms + s.caseIndex) % NOTICES.length];
    $('docket').replaceChildren();
    CASES.forEach((item, i) => {
      const li = document.createElement('li');
      const closed = i < s.sanctions;
      const active = i === s.caseIndex && s.phase === 'active';
      li.className = closed ? 'closed' : active ? 'active' : '';
      if (active) li.setAttribute('aria-current', 'step');
      for (const [cls, text] of [['docket-number',String(i+1).padStart(2,'0')],['docket-name',item.short],['docket-symbol',closed?'FILED':active?'←':'—']]) {
        const span = document.createElement('span'); span.className = cls; span.textContent = text; li.appendChild(span);
      }
      $('docket').appendChild(li);
    });
    document.querySelectorAll('[data-command]').forEach(button => {
      const cmd = button.dataset.command;
      if (button.id === 'primary-action') return;
      button.disabled = s.phase !== 'active' || (cmd === 'coffee' && s.coffeeUsed) || (cmd === 'roast' && s.roastUsed) || (cmd === 'subpoena' && !s.evidence) || (cmd === 'inspect' && (s.inspected.includes(s.claimIndex) || s.patience <= 3));
    });
    const primary = $('primary-action');
    const mode = s.phase === 'briefing' ? ['start','Clock in →'] : s.phase === 'between' ? ['next','File next case →'] : ['restart','Restart shift ↺'];
    primary.dataset.command = mode[0]; primary.textContent = mode[1];
    const hint = s.phase === 'active' ? s.inspected.includes(s.claimIndex) ? `Exhibit acquired. Recommended: ${game.claim.weakness.toUpperCase()}.` : 'Inspect the claim. Find the weakness. File accordingly.' : s.phase === 'between' ? 'Confidence revoked. Call the next defendant.' : s.phase === 'won' ? 'All six sanctioned. The stapler rests.' : s.phase === 'lost' ? 'Patience extinct. Another shift awaits.' : 'Clock in to begin proceedings.';
    $('action-hint').textContent = hint;
    input.placeholder = s.phase === 'briefing' ? 'Type ‘start’ to clock in…' : s.phase === 'active' ? 'inspect, audit, factcheck…' : s.phase === 'between' ? 'Type ‘next’ to continue…' : 'manifesto, status, restart…';
    const outcome = $('outcome'); outcome.hidden = !['won','lost'].includes(s.phase); outcome.replaceChildren();
    outcome.className = `outcome ${s.phase}`;
    if (!outcome.hidden) {
      const kicker = document.createElement('p'); kicker.textContent = s.phase === 'won' ? 'FINAL DETERMINATION / FORM GF-001' : 'HR INCIDENT REPORT / FORM WTF-404';
      const heading = document.createElement('h3'); heading.textContent = s.phase === 'won' ? 'Goan get farked.' : 'Promoted to unpaid advisor.';
      const copy = document.createElement('p'); copy.textContent = s.phase === 'won' ? `${game.rank()}. Six sanctions issued. Export your receipts and go home with your standards intact.` : 'Your patience ran out before their bullshit did. Try coffee, inspect the claims, and make each form count.';
      outcome.append(kicker,heading,copy);
    }
  }
  function run(raw) {
    const command = raw.trim();
    if (!command) return;
    const normal = command.toLowerCase();
    if (normal === 'restart') { archive = []; transcript.replaceChildren(); }
    append([{text:`auditor@tmb:~$ ${command}`,kind:'command'}]);
    history.push(command); historyIndex = history.length; draft = ''; input.value = '';
    if (normal === 'clear') transcript.replaceChildren();
    append(game.execute(command));
    if (normal === 'help' || normal === '?') openManual();
    render();
  }
  $('command-form').addEventListener('submit', event => { event.preventDefault(); run(input.value); });
  document.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click', () => run(button.dataset.command)));
  input.addEventListener('keydown', event => {
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (historyIndex === history.length) draft = input.value;
      historyIndex = Math.max(0, historyIndex - 1); input.value = history[historyIndex] || draft;
      input.setSelectionRange(input.value.length,input.value.length);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault(); historyIndex = Math.min(history.length, historyIndex + 1); input.value = historyIndex === history.length ? draft : history[historyIndex];
      input.setSelectionRange(input.value.length,input.value.length);
    } else if (event.key === 'Tab' && input.value.trim()) {
      const prefix = input.value.trim().toLowerCase();
      const matches = COMMANDS.filter(command => command.startsWith(prefix));
      if (matches.length) {
        event.preventDefault();
        if (matches.length === 1) input.value = matches[0];
        else append([{text:`Completions: ${matches.join(' / ')}`,kind:'system'}]);
      }
    }
  });
  $('export-button').addEventListener('click', () => {
    const text = ['TRUSTMEBRO — DEPARTMENT OF UNsubstantiated CONFIDENCE'.toUpperCase(), 'Fictional proceedings / a QSOL-IMC public disservice', '', ...archive, '', ...game.status().map(entry=>entry.text)].join('\n');
    const url = URL.createObjectURL(new Blob([text],{type:'text/plain;charset=utf-8'}));
    const a = document.createElement('a'); a.href = url; a.download = 'TrustMeBro-receipts.txt'; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),1000);
  });
  append(game.intro()); render();
}());
