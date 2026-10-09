/* TrustMeBro: deterministic, dependency-free game rules. Apache-2.0. */
(function (root, factory) {
  'use strict';
  const api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TrustMeBro = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  const CASES = [
    {
      name: 'Chad Scaleington III', short: 'Chad Scaleington', role: 'Founder / Disruptive Disruption Inc.', slug: 'disruptive-disruption', defence: 116,
      intro: 'His product is a landing page. His roadmap is a TED talk. His revenue is a font size.',
      claims: [
        {quote: 'We are profitable if you exclude every cost associated with operating the business.', weakness: 'audit', receipt: 'The profit slide excludes salaries, servers, refunds, and the company. Apply AUDIT.', rebuttal: 'Accounting has declined your invitation to become a thought experiment.'},
        {quote: 'Our AI replaces ten thousand workers. In the demo it replaced a dropdown menu.', weakness: 'factcheck', receipt: 'Demo replay: one hard-coded option, fourteen cuts, zero reproducible tests. Apply FACTCHECK.', rebuttal: 'You automated a select box and declared victory over civilisation. Sit the fuck down.'},
        {quote: 'We have fifty million active users. No, you may not inspect what “active” means.', weakness: 'subpoena', receipt: 'Internal definition: “any email address we have ever looked at”. Apply SUBPOENA.', rebuttal: 'An address book is not a user base, Chad. Your grandmother’s contacts are not product-market fit.'}
      ],
      dodge: 'Chad calls the missing evidence “a category-defining absence”. The category is bullshit.',
      roast: 'ENTERED INTO RECORD: A Patagonia vest wrapped around a permission error. His only successful exit was from the question.',
      verdict: 'ORDER: cease calling a checkout page a civilisational breakthrough. Return the rented aura of genius.'
    },
    {
      name: 'Blaize Pivot', short: 'Blaize Pivot', role: 'Chief Evangelist / Agentic Everything™', slug: 'agentic-everything', defence: 120,
      intro: 'Yesterday: blockchain. Today: agents. Tomorrow: whichever word gets him back on a podcast.',
      claims: [
        {quote: 'Our autonomous agent runs an entire company. A human only intervenes every eight seconds.', weakness: 'factcheck', receipt: 'The “agent” is a support contractor clicking through a queue. Apply FACTCHECK.', rebuttal: 'That is a bloke with a mouse, Blaize. You have invented outsourcing with a loading animation.'},
        {quote: 'We passed every benchmark. The failed runs were spiritually irrelevant.', weakness: 'subpoena', receipt: 'Retained logs: 98 failed runs, 2 screenshots, no disclosed selection rule. Apply SUBPOENA.', rebuttal: 'Produce the whole run history. The screenshot is not a peer reviewer, you confidence-powered screensaver.'},
        {quote: 'Our unit economics improve dramatically once inference becomes free and customers stop asking questions.', weakness: 'audit', receipt: 'Serving costs exceed revenue; the spreadsheet assumes physics accepts exposure. Apply AUDIT.', rebuttal: 'Your margin is a prayer wearing conditional formatting. The spreadsheet has requested a responsible adult.'}
      ],
      dodge: 'Blaize pivots from “provably correct” to “directionally authentic”. The stapler remains unimpressed.',
      roast: 'ENTERED INTO RECORD: A stochastic autocomplete with a podcast microphone. He has pivoted so often his opinions qualify as a ceiling fan.',
      verdict: 'ORDER: surrender the word “agentic” until you can define it without pointing at a funding round.'
    },
    {
      name: 'Ledger McYield', short: 'Ledger McYield', role: 'Decentralisation Officer / Rug & Pull Ventures', slug: 'rug-and-pull', defence: 124,
      intro: 'A trustless ecosystem requiring absolute trust in one man’s Discord announcements.',
      claims: [
        {quote: 'Our protocol is fully decentralised. I alone control the emergency wallet, obviously.', weakness: 'subpoena', receipt: 'Admin register: one key, one owner, one extremely central centre. Apply SUBPOENA.', rebuttal: 'You are the single point of failure wearing a decentralisation hat. Produce the key-control record.'},
        {quote: 'The yield is sustainable because new investors will arrive forever.', weakness: 'audit', receipt: 'Payout source: new deposits. Product revenue: £0, $0, and fuck-all in any other currency. Apply AUDIT.', rebuttal: 'Your business model is a queue in which the last person discovers arithmetic.'},
        {quote: 'The code is law, except when the code does something bad, in which case it is merely a community vibe.', weakness: 'factcheck', receipt: 'The marketing promises immutable rules; the admin can rewrite them. Apply FACTCHECK.', rebuttal: 'Immutability does not have an asterisk shaped like your convenience, Ledger.'}
      ],
      dodge: 'Ledger says the audit is FUD. The department has expanded the acronym to “Facts U Dislike”.',
      roast: 'ENTERED INTO RECORD: He put a casino inside a spreadsheet and called the losses financial inclusion. The rug has more utility than the token.',
      verdict: 'ORDER: decentralise yourself away from other people’s savings. “Community” is not an accounting exemption.'
    },
    {
      name: 'Sterling Vest', short: 'Sterling Vest', role: 'Managing Partner / Other People’s Money Capital', slug: 'other-peoples-money', defence: 128,
      intro: 'He ignored your working prototype, then funded a mate’s diagram of the same thing for eight figures.',
      claims: [
        {quote: 'We invest purely on merit. Merit is when I went to school with your co-founder.', weakness: 'subpoena', receipt: 'Decision notes contain six introductions and zero technical evaluations. Apply SUBPOENA.', rebuttal: 'Your meritocracy is a dinner reservation with a cap table. File the conflicts, Sterling.'},
        {quote: 'A billion-dollar valuation proves the technology works.', weakness: 'audit', receipt: 'Valuation basis: expected future fundraising, multiplied by the size of his LinkedIn announcement. Apply AUDIT.', rebuttal: 'A price tag is not a theorem. You have mistaken the cheque for the experiment.'},
        {quote: 'Independent researchers need institutional credibility. My founder needs a hoodie and conviction.', weakness: 'factcheck', receipt: 'The evaluation standard changes when the applicant already has his number. Apply FACTCHECK.', rebuttal: 'The evidence did not change. Your guest list did. Your due diligence is a fucking seating plan.'}
      ],
      dodge: 'Sterling asks who led your previous round. The question has been returned as unrelated to whether a thing is true.',
      roast: 'ENTERED INTO RECORD: A fleece waistcoat with inherited access. He confuses recognising his own postcode with recognising talent.',
      verdict: 'ORDER: respond to the evidence before asking who introduced it. Your network is not a law of nature.'
    },
    {
      name: 'Nova Moonshot', short: 'Nova Moonshot', role: 'Visionary / Reality Pending Industries', slug: 'reality-pending', defence: 132,
      intro: 'The launch date is public. The prototype is private. The excuses are available in twelve languages.',
      claims: [
        {quote: 'Our revolutionary hardware violates known physical limits. The demo is an animation for accessibility reasons.', weakness: 'factcheck', receipt: 'No measured prototype, no calibration data, and an MP4 with heroic lens flare. Apply FACTCHECK.', rebuttal: 'You cannot render your way through conservation laws. The animation has zero units of evidence.'},
        {quote: 'Third-party validation is underway. The third party is my other company.', weakness: 'subpoena', receipt: 'Validator ownership records route directly back to Nova. Apply SUBPOENA.', rebuttal: 'You have peer-reviewed yourself in a second hat. The hat is not independent.'},
        {quote: 'The product ships next quarter. Deposits are non-refundable this quarter.', weakness: 'audit', receipt: 'Shipping budget: negligible. Deposit intake: substantial. Deadline: migrating south for winter. Apply AUDIT.', rebuttal: 'Your only deliverable is a payment confirmation. The future would like to unsubscribe.'}
      ],
      dodge: 'Nova says you lack imagination. The department says imagination is not a tracking number.',
      roast: 'ENTERED INTO RECORD: A countdown timer that measures the half-life of accountability. Her product exists exclusively in the tense “will”.',
      verdict: 'ORDER: deliver one thing that exists outside a keynote before declaring a new era of human existence.'
    },
    {
      name: 'Dax Alignment', short: 'Dax Alignment', role: 'VP Responsible Innovation / Ethics-as-a-Service™', slug: 'ethics-as-a-service', defence: 148,
      intro: 'FINAL BOSS. Every harm has a working group. Every working group has a launch announcement. None has a stop button.',
      claims: [
        {quote: 'We are committed to transparency. Our transparency report explains why all the useful information is confidential.', weakness: 'subpoena', receipt: 'Report appendix: redacted logs, undisclosed changes, no retained evaluation procedure. Apply SUBPOENA.', rebuttal: 'A black rectangle is not a transparency programme. Produce the records, you laminated apology.'},
        {quote: 'Our safety framework guarantees trust because we wrote “trust” on the framework.', weakness: 'factcheck', receipt: 'No defined failure conditions, no reproducible evaluation, and no test that can fail. Apply FACTCHECK.', rebuttal: 'Your framework is a brochure that has appointed itself a fire extinguisher.'},
        {quote: 'The ethics budget is healthy. It sits between zero and our CEO’s airport lounge allowance.', weakness: 'audit', receipt: 'Public commitments: extensive. Resourced controls: absent. PR retainer: magnificently funded. Apply AUDIT.', rebuttal: 'You funded the apology and forgot the prevention. “Responsible” is doing more work than your entire board.'}
      ],
      dodge: 'Dax convenes a taskforce to consider whether the question was phrased collaboratively enough.',
      roast: 'ENTERED INTO RECORD: The human equivalent of a cookie banner that cannot be declined. He has confused having an ethics department with having ethics.',
      verdict: 'ORDER: stop using safety as a velvet rope around uncheckable claims. Release the evidence, accept the test, and take the fucking result.'
    }
  ];

  const NOTICES = [
    '“Trust me, bro” is not a recognised evidentiary standard.',
    'Confidence is not a checksum. A hoodie is not a qualification.',
    'All claims must be accompanied by something other than a podcast.',
    'The department does not accept “we’re early” as a unit of measurement.',
    'Evidence delayed is evidence still fucking missing.',
    'Your valuation has no jurisdiction over arithmetic.',
    'A reproducible lie is still a lie. Congratulations on your consistency.',
    'No, “proprietary” is not Latin for “you caught us”.',
    'The customer is not a beta tester for your honesty.',
    'Notice: “coming soon” has exceeded its statutory half-life.'
  ];
  const COMMANDS = ['start', 'inspect', 'audit', 'factcheck', 'subpoena', 'coffee', 'roast', 'next', 'status', 'help', 'manifesto', 'clear', 'restart', 'about', 'sudo', 'exit', 'trust', 'funding', 'synergy', 'blockchain', 'agi', 'truth', 'provenance', 'determinism'];
  const ACTIONS = {audit: {cost:7, damage:16}, factcheck: {cost:6, damage:14}, subpoena: {cost:10, damage:20}};
  const line = (text, kind = 'result') => ({text, kind});

  class Game {
    constructor() { this.reset(); }
    reset() {
      this.state = {phase:'briefing', caseIndex:0, claimIndex:0, patience:100, defence:0, evidence:0, forms:0, sanctions:0, contempt:0, attacks:0, matched:0, coffeeUsed:false, roastUsed:false, inspected:[]};
      return this.intro();
    }
    intro() {
      return [line('DEPARTMENT OF UNsubstantiated CONFIDENCE'.toUpperCase(), 'heading'), line('TRUTH OS v1.0 / Loading accountability… found no corporate volunteers.', 'system'), line('You are the auditor. They are the problem. Your weapon is a properly completed form.'), line('Six fictional tech bros await. Reduce their confidence to zero. Keep your patience above zero.'), line('No subscriptions. No tokens. No cloud. Somehow the fucking terminal works.'), line('Type START or click Clock in. HELP opens the field manual. MANIFESTO opens the scorched declaration.', 'receipt')];
    }
    get defendant() { return CASES[this.state.caseIndex]; }
    get claim() { return this.defendant.claims[this.state.claimIndex]; }
    currentClaim() {
      return [line(`CLAIM ${this.state.claimIndex + 1}/3 — ${this.defendant.name}`, 'heading'), line(`“${this.claim.quote}”`, 'quote')];
    }
    openCase() {
      const s = this.state;
      s.phase = 'active'; s.claimIndex = 0; s.defence = this.defendant.defence;
      s.coffeeUsed = false; s.roastUsed = false; s.inspected = [];
      return [line(`CASE TMB-00${s.caseIndex + 1} / ${this.defendant.name.toUpperCase()}`, 'heading'), line(this.defendant.role, 'system'), line(this.defendant.intro), ...this.currentClaim(), line('INSPECT for a receipt, then match AUDIT / FACTCHECK / SUBPOENA to the weakness.', 'system')];
    }
    activeError() {
      if (this.state.phase === 'briefing') return [line('You are not clocked in. Type START. Unpaid overtime remains optional.', 'error')];
      if (this.state.phase === 'between') return [line('This case is closed. Type NEXT to summon the next walking press release.', 'system')];
      if (this.state.phase === 'won') return [line('All six cases are closed. Type RESTART for another shift of public disservice.', 'system')];
      return [line('Your patience is extinct. Type RESTART; human resources will pretend not to notice.', 'error')];
    }
    status() {
      const s = this.state;
      return [line(`SHIFT: ${s.phase.toUpperCase()} | PATIENCE: ${s.patience}/100 | CONFIDENCE: ${s.defence}`, 'heading'), line(`RECEIPTS: ${s.evidence} | FORMS: ${s.forms} | SANCTIONS: ${s.sanctions}/6 | CONTEMPT: ${s.contempt}`), line(s.phase === 'active' ? `Current weakness: ${s.inspected.includes(s.claimIndex) ? this.claim.weakness.toUpperCase() : 'inspect the claim to expose it'}.` : 'Paperwork remains cheaper than a Series B.', 'system')];
    }
    lose() {
      this.state.phase = 'lost';
      return [line('SHIFT TERMINATED: PATIENCE EXHAUSTED', 'error'), line('The bros have won this round. You have been offered an unpaid advisory role on the committee investigating the committee.'), line('Requisition COFFEE sooner next time. Match the instrument to the evidence. Type RESTART.', 'receipt')];
    }
    closeCase() {
      const s = this.state;
      s.defence = 0; s.sanctions += 1; s.forms += 1;
      const restored = Math.min(16, 100 - s.patience);
      s.patience += restored;
      const lines = [line('SANCTIONED / VIBES REVOKED', 'stamp'), line(this.defendant.verdict), line(`Case filed. +${restored} patience. The public service occasionally achieves something.`, 'receipt')];
      if (s.sanctions === CASES.length) {
        s.phase = 'won';
        lines.push(line('FINAL DETERMINATION / FORM GF-001', 'heading'), line('To the self-appointed architects of our inevitable future: goan get farked.'), line('Bring the logs. Bring the methods. Bring the failures. Your confidence has been impounded pending the arrival of a single fucking receipt.'), line(`RANK: ${this.rank()} | ${s.sanctions} sanctions | ${s.forms} forms | ${s.contempt} contempt citations`, 'receipt'), line('Export your receipts. Read the manifesto. The mirror is now operational.', 'system'));
      } else {
        s.phase = 'between';
        lines.push(line('Type NEXT to call the next defendant. Sadly, the supply is renewable.', 'receipt'));
      }
      return lines;
    }
    rank() { return this.state.patience >= 50 ? 'Chief Commissioner of Receipts' : 'Senior Stapler of Uncomfortable Questions'; }
    execute(raw) {
      const command = String(raw).trim().toLowerCase();
      const s = this.state;
      if (!command) return [];
      if (command === 'restart') return this.reset();
      if (command === 'help' || command === '?') return [line('Field manual opened. The bros prefer you skip this bit.', 'system')];
      if (command === 'manifesto') return [line('THE MANIFESTO OF THE UNIMPRESSED / Evidence recovered from a pitch deck fire.', 'heading'), line('Read the scorched declaration →', 'manifesto')];
      if (command === 'clear') return [];
      if (command === 'status') return this.status();
      if (command === 'start') {
        if (s.phase !== 'briefing') return [line('The shift is already underway. Type RESTART if you want new paperwork.', 'system')];
        return this.openCase();
      }
      if (command === 'next') {
        if (s.phase !== 'between') return [line('NEXT requires a closed case. We do not accept skipping accountability as a growth strategy.', 'error')];
        s.caseIndex += 1;
        return this.openCase();
      }
      const extras = {
        about: 'TrustMeBro / a QSOL-IMC public disservice. Fictional defendants, genuine contempt. No network requests, accounts, or analytics from the game. All enforcement is imaginary.',
        exit: 'Exit interview: please explain why you do not find relentless dishonesty exciting. You may leave by closing the tab. No retention team will call.',
        trust: 'Trust is earned. “Bro” is not a cryptographic primitive.',
        funding: 'Your request for funding has been forwarded to a mate who has reinvented your prototype as an infographic.',
        synergy: 'SYNERGY detected. The department has dispatched a dictionary and a bucket.',
        blockchain: 'A linked list has requested not to be implicated in your personality.',
        agi: 'AGI is arriving next quarter, alongside the product, the revenue, and the apology for last quarter.',
        truth: 'Truth does not become false when an underfunded person finds it. It does not become true when a billionaire announces it.',
        provenance: 'Who made the claim? From what evidence? Using which procedure? A hash binds bytes; it does not certify that the author stopped talking shit.',
        determinism: 'Same declared inputs, same defined procedure, same result. Deterministic bullshit is still bullshit. We want a reproducible test that can actually say NO.'
      };
      if (Object.hasOwn(extras, command)) return [line(extras[command])];
      if (command === 'sudo' || command.startsWith('sudo ')) return [line('Permission denied. Wealth is not root access to reality.', 'error')];
      if (!['inspect', 'coffee', 'roast', ...Object.keys(ACTIONS)].includes(command)) return [line(`Unknown command: ${String(raw).trim()}`, 'error'), line('Type HELP. This terminal does not execute shell commands, even if you call them disruptive.', 'system')];
      if (s.phase !== 'active') return this.activeError();
      if (command === 'inspect') {
        if (s.inspected.includes(s.claimIndex)) return [line('This claim is already inspected. Copy-pasting a receipt does not create new evidence.', 'system'), line(this.claim.receipt, 'receipt')];
        if (s.patience <= 3) return [line('Inspection would exhaust your patience. Request COFFEE or choose a finishing move.', 'error')];
        s.patience -= 3; s.evidence += 1; s.inspected.push(s.claimIndex); s.forms += 1;
        return [line(`RECEIPT ACQUIRED / EXHIBIT TMB-${s.caseIndex + 1}.${s.claimIndex + 1}`, 'heading'), line(this.claim.receipt, 'receipt'), line('−3 patience / +1 receipt. The archive is less charismatic than the founder. This is an advantage.', 'system')];
      }
      if (command === 'coffee') {
        if (s.coffeeUsed) return [line('Coffee allocation exhausted. Unlimited caffeine is available only to founders explaining why your break is unaffordable.', 'error')];
        if (s.patience === 100) return [line('You are already at full patience. Preserve the coffee allocation; someone is about to say “ecosystem”.', 'system')];
        s.coffeeUsed = true; s.forms += 3;
        const recovered = Math.min(18, 100 - s.patience); s.patience += recovered;
        return [line(`Form CF-003 approved in triplicate. +${recovered} patience.`, 'receipt'), line('The coffee is bitter, underfunded, and still more useful than their advisory board.')];
      }
      if (command === 'roast') {
        if (s.roastUsed) return [line('Contempt already entered. The department discourages farming outrage; LinkedIn has that market cornered.', 'error')];
        s.roastUsed = true; s.contempt += 1; s.patience = Math.max(0, s.patience - 4); s.defence = Math.max(0, s.defence - 8);
        const lines = [line(this.defendant.roast), line('−8 bro confidence / −4 patience. Contempt citation proudly retained.', 'system')];
        // Simultaneous exhaustion is a loss; sanctions require surviving the attack.
        if (s.patience === 0) return [...lines, ...this.lose()];
        if (s.defence === 0) return [...lines, ...this.closeCase()];
        return lines;
      }
      const action = ACTIONS[command];
      if (command === 'subpoena' && s.evidence === 0) return [line('SUBPOENA needs one receipt. Type INSPECT first. “I reckon” is inadmissible, even when correct.', 'error')];
      if (command === 'subpoena') s.evidence -= 1;
      const matched = command === this.claim.weakness;
      const prepared = s.inspected.includes(s.claimIndex);
      const damage = action.damage + (matched ? 24 : 0) + (prepared ? 8 : 0);
      s.patience = Math.max(0, s.patience - action.cost); s.defence = Math.max(0, s.defence - damage); s.forms += 1; s.attacks += 1;
      if (matched) s.matched += 1;
      const lines = [line(`${command.toUpperCase()} FILED / −${damage} confidence / −${action.cost} patience`, 'heading'), line(matched ? this.claim.rebuttal : this.defendant.dodge), line(matched ? 'Correct instrument. The claim has met a procedure it cannot sweet-talk.' : 'Some damage, but the wrong instrument. Inspect the next claim before swinging again.', matched ? 'receipt' : 'system')];
      if (s.patience === 0) return [...lines, ...this.lose()];
      if (s.defence === 0) return [...lines, ...this.closeCase()];
      s.claimIndex = (s.claimIndex + 1) % this.defendant.claims.length;
      return [...lines, ...this.currentClaim()];
    }
  }
  return {Game, CASES, NOTICES, COMMANDS, ACTIONS};
}));
