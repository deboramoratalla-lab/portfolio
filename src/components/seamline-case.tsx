import Image from "next/image"
import type { Project } from "@/data/projects"
import { CaseHero } from "@/components/case-hero"
import { CaseMoreWorks } from "@/components/case-more-works"
import { CaseStudyIndex } from "@/components/case-study-index"
import { CaseSectionLabel } from "@/components/case-section-label"
import { MotionSafeVideo } from "@/components/motion-safe-video"
import { SeamlineHeroStage } from "@/components/seamline-hero-stage"
import { SeamlineMotion } from "@/components/seamline-motion"
import { ArrowLink } from "@/components/ui-links"

const chapters = [
  ["01", "Read the drift"],
  ["02", "Decide the autonomy"],
  ["03", "Design the trust"],
  ["04", "Break it on purpose"],
] as const

const signals = [
  ["39%", "of in-house design systems are rated successful", "Sparkbox 2021"],
  ["59%", "of teams don't measure their design system at all", "Sparkbox 2021"],
  ["84%", "use design tokens, but most struggle to keep them in sync", "zeroheight 2025"],
  ["~10%", "actively use AI in their design system work", "zeroheight 2025"],
] as const

const personas = [
  ["L", "Laura", "Design system lead", "Keep the system used, unbroken, and justify the team to leadership.", "Learns about drift when someone complains. No numbers to defend the investment.", "Figma, GitHub, Slack"],
  ["M", "Marta", "Product designer", "Design fast with components that look like production.", "Won't open another tool. Unsure if Figma matches code.", "Figma"],
  ["D", "Dani", "Frontend engineer", "Ship without arguing with design about values.", "Reviews JSON diffs by hand. Can't tell which design version a release matches.", "GitHub, CI"],
] as const

const changeKinds = [
  ["01", "An urgent hotfix", 5, "Acts alone", "Code shipped first and Figma is behind.", "Blocked if it breaks WCAG AA contrast."],
  ["02", "A value changes on one side", 4, "Acts when sure", "The model reads the commit and the ticket.", "Below 85% confidence, it asks."],
  ["03", "A token is renamed", 3, "Prepares, you confirm", "A small model pairs old and new names.", "A person confirms the pair."],
  ["04", "A new option appears", 2, "Researches, proposes", "It exists on one side only.", "Never created alone."],
  ["05", "Both sides change the same thing", 1, "Explains, never picks", "Designer and engineer disagree.", "Always a person's call."],
] as const

const flowSpine = [
  ["01", "Detect", "Certification finds drift across the four sources"],
  ["02", "Judge", "Rules first. Models only where judgment is needed"],
  ["03", "Check confidence", "Every call carries a number and a reason"],
] as const

const flowPaths = [
  ["ACT", "≥ 85% and reversible", "Apply the fix, log it in the journal, show how to undo it.", "Logged · undoable"],
  ["ASK", "Unsure or new", "Send it to the lead's queue with both values and the evidence.", "The PR stays red"],
  ["NEVER ALONE", "Both sides changed", "Show each person's reason in their own words. Don't pick a side.", "A person decides"],
] as const

const roles = [
  ["Laura · lead", "Notification → Overview", "The whole system and what needs her", "Decide conflicts, approve options, undo"],
  ["Marta · designer", "Figma notice → her item", "Changes that touch Figma", "See her reason on the card, comment on the PR"],
  ["Dani · engineer", "PR comment → his item", "Changes that touch code, and the PR state", "See his commit message, review the diff"],
] as const

const tones = [
  ["Drift found", "Direct · exact", "16 checks out of sync after 5 changes."],
  ["Conflict for a person", "Warm · explicit uncertainty", "Both people changed it. Pick which value stays."],
  ["Applied alone", "Brief · with a number", "Code is right → Figma updated · 95%."],
  ["Agent error", "Slow · plain", "I applied this with the wrong value. Reverted."],
] as const

const failures = [
  ["01", "The small model invented a commit", "So judgment moved to the larger model. The small one only pairs names now."],
  ["02", "The model didn't answer the same way twice", "13 of 13 found, with 3 false alarms in one read. Three reads, a majority vote and a second model confirming took it to zero."],
  ["03", "A guardrail that wasn't running", "The PR check had silently never run on ten pull requests. GitHub was holding them. I only saw it testing end to end."],
  ["04", "The rules missed what looked right", "A heading set to the exact hex of a token, but not linked to it. Now there's a rule for that."],
] as const

export function SeamlineCase({ project }: { project: Project }) {
  return <main className="fluxy-story seamline-story" style={{ "--fx-accent": project.accent } as React.CSSProperties}>
    <CaseHero className="fx-hero" kickerClassName="fx-kicker" kicker={<><span>[CASE STUDY / 01]</span><span>&gt; AI AGENT · DESIGN SYSTEMS</span><i/><ArrowLink variant="primary" tone="purple" href="https://seamline-five.vercel.app/" target="_blank" rel="noreferrer">Open the console</ArrowLink></>} title="Seamline — An agent that keeps a design system in sync, and knows when to stop." premiseClassName="fx-premise" premise="I designed and built, on my own, an agent that keeps Figma, code, Storybook and docs in sync for GitHub's Primer, without taking the decision away from the people who own the system." decision="The agent acts alone only when it's sure and the change can be undone. Everything else goes to a person." meta={<div className="fx-meta case-hero-meta-unified"><div><small>ROLE</small><p>Solo · product design, agent behaviour and build</p></div><div><small>CONTEXT</small><p>Nebius × NVIDIA Global AI Hackathon 2026 · results Jan 2027</p></div><div><small>STACK</small><p>Nemotron on Nebius Token Factory · TypeScript · GitHub Actions · Figma</p></div><div className="fx-ownership"><small>MY OWNERSHIP</small><p>{project.ownership}</p></div></div>} />

    <SeamlineHeroStage />

    <CaseStudyIndex introduction="From silent drift to an agent that earns, and can lose, the right to act alone." chapters={chapters} hrefForChapter={number => `#seamline-${number}`} />

    <section className="fx-chapter" id="seamline-01">
      <header><CaseSectionLabel as="p" number="01.00" level="chapter">Read the drift</CaseSectionLabel><h2>Each source was right on its own. Together they disagreed, and nobody owned the gap.</h2></header>
      <article className="fx-reframe"><div><span>THE OBVIOUS BRIEF</span><p>Sync Figma and code automatically.</p></div><i>→</i><div><span>THE QUESTION I CHOSE</span><p>What should an agent be allowed to change in someone else&apos;s work?</p></div></article>
      <article className="fx-burden"><div><span>&gt; WHAT THE DATA SAYS</span><h3>Teams invest in design systems, then lose track of whether they hold.</h3><p>Today&apos;s sync tools pick a winner, Figma first or code first, and quietly overwrite the other side. The drift gets fixed. The decision about whose work counts gets made by a script.</p></div><ol>{signals.map(([value,label,source])=><li key={value}><small>{source}</small><strong>{value}</strong><p>{label}</p></li>)}</ol></article>
      <article className="sl-personas"><span>&gt; WHO IT&apos;S FOR</span><h3>Three people touch the same button. Only one of them should decide.</h3><div>{personas.map(([initial,name,role,job,pain,lives])=><section key={name}><header><i aria-hidden="true">{initial}</i><div><strong>{name}</strong><small>{role}</small></div></header><p><b>Job</b>{job}</p><p><b>Pain</b>{pain}</p><p><b>Lives in</b>{lives}</p></section>)}</div></article>
      <blockquote className="fx-thesis">Drift is data, not an emergency. The emergency is overwriting someone without telling them.</blockquote>
    </section>

    <section className="fx-chapter fx-dark" id="seamline-02">
      <header><CaseSectionLabel as="p" number="02.00" level="chapter" dark>Decide the autonomy</CaseSectionLabel><h2>My first version fixed everything. It worked, and it was the wrong product.</h2></header>
      <article className="fx-why-agent"><div><span>&gt; DAY ONE</span><h3>The agent repaired all five breaks I planted in Button.</h3></div><div><p>Technically, a success. But I kept picturing Laura opening a pull request full of changes she never asked for and can&apos;t easily reverse. Nobody merges that.</p><p>On day three I rebuilt it around a confidence gate, a review queue and an undo journal. The console stopped leading with failures and started leading with what needs a person.</p></div></article>
      <article className="fx-agent-journey">
        <div className="fx-agent-journey-intro"><span>&gt; HOW A CHANGE MOVES</span><h3>One check. Three outcomes.</h3><p>Every change goes through the same path. What happens at the end depends on how sure the agent is, and on whether a person already made a choice there.</p></div>
        <div className="fx-agent-journey-map">
          <div className="fx-agent-spine">{flowSpine.map(([number,title,body])=><div key={number}><small>{number}</small><strong>{title}</strong><p>{body}</p></div>)}</div>
          <div className="fx-agent-fork" aria-hidden="true"><i/><b>CONFIDENCE + AUTHORSHIP</b><i/></div>
          <div className="fx-agent-paths">{flowPaths.map(([mode,title,body,outcome],index)=><div key={mode} className={`fx-agent-path fx-agent-path-${index + 1}`}><small>{mode}</small><strong>{title}</strong><p>{body}</p><b>{outcome}</b></div>)}</div>
        </div>
        <p className="fx-agent-rule">Autonomy is decided per kind of change, not per agent.</p>
      </article>
      <article className="sl-autonomy">
        <header><span>&gt; FIVE KINDS OF CHANGE</span><h3>Some changes are mechanical. One should never be the agent&apos;s call.</h3><p>Each kind of change got its own rule and its own owner, ordered from most to least autonomy.</p></header>
        <div className="sl-autonomy-scale" aria-hidden="true"><span>Agent acts alone</span><i/><span>A person decides</span></div>
        <ol>{changeKinds.map(([number,title,level,label,when,limit])=><li key={number} style={{ "--level": level } as React.CSSProperties}>
          <small>{number}</small>
          <h4>{title}</h4>
          <div className="sl-meter" role="img" aria-label={`Autonomy ${level} of 5: ${label}`}>{[1,2,3,4,5].map(n=><i key={n} className={n <= level ? "is-on" : ""} style={{ "--n": n } as React.CSSProperties}/>)}<b>{label}</b></div>
          <p><em>When</em>{when}</p>
          <p><em>Limit</em>{limit}</p>
        </li>)}</ol>
      </article>
    </section>

    <section className="fx-chapter" id="seamline-03">
      <header><CaseSectionLabel as="p" number="03.00" level="chapter">Design the trust</CaseSectionLabel><h2>If the agent can earn autonomy, it has to be able to lose it.</h2></header>
      <article className="sl-video"><div><span>&gt; THE CONSOLE</span><h3>The lead answers in one place. The pull request does the rest.</h3><p>Laura opens the console from a notification, starts with the conflict, reads both reasons and picks a side. The answer goes to the PR and the check turns green. Engineers never need to open the console.</p><ArrowLink variant="secondary" tone="purple" href="https://seamline-five.vercel.app/" target="_blank" rel="noreferrer">Try it yourself</ArrowLink></div><figure><MotionSafeVideo src="/media/seamline-console-flow.mp4" poster="/media/seamline-overview.jpg" aria-label="Walkthrough of the Seamline console: overview, a conflict decided, the decision tabs and the report" /></figure></article>
      <article className="fx-proof"><div><span>01 / A REAL CONFLICT</span><h3>Both people are right. The lead decides.</h3><p>The designer made invisible buttons blue so they read as actions. The engineer made them grey because blue clashed with links in tables. The agent shows both, as the real component, in each person&apos;s own words.</p></div><figure><Image src="/media/seamline-conflict-card.jpg" alt="Seamline conflict card showing the Figma and code values of the invisible button side by side, each with its author's reason" width={1450} height={1341} sizes="(max-width: 900px) 100vw, 60vw"/></figure></article>
      <article className="fx-proof fx-proof-reverse"><div><span>02 / ONE CLICK BACK</span><h3>Every answer can be changed. Every fix can be undone.</h3><p>Once the lead decides, the card closes, the progress updates and the PR has one less blocker. The toast says exactly what was kept, with a way back. Three rejections of the same kind pause auto-apply for that kind. The agent doesn&apos;t argue. It just stops doing it alone.</p></div><figure><Image src="/media/seamline-decided.jpg" alt="Seamline Decisions view after the lead kept the code value: the conflict is marked done, progress updated and a toast offers to change the answer" width={2880} height={1800} sizes="(max-width: 900px) 100vw, 60vw"/></figure></article>
      <article className="fx-results sl-numbers"><div><span>&gt; THE THREE RULES THAT HOLD IT TOGETHER</span><h3>Small numbers, chosen on purpose.</h3></div><div><p><strong>≥ 85%</strong> confidence before the agent acts alone. Below that, it asks.</p><p><strong>3×</strong> rejected, and auto-apply pauses for that kind of change.</p><p><strong>1 click</strong> to undo anything it did, from the activity log.</p></div></article>
      <article className="sl-roles"><span>&gt; SAME DATA, DIFFERENT DOOR</span><h3>Nobody gets a different version of the truth. They just start in a different place.</h3><div role="table" aria-label="What each role sees in Seamline"><div role="row" className="sl-roles-head"><span role="columnheader"/><b role="columnheader">Enters from</b><b role="columnheader">Sees first</b><b role="columnheader">Can</b></div>{roles.map(([who,enters,sees,can])=><div role="row" key={who}><span role="rowheader">{who}</span><p role="cell">{enters}</p><p role="cell">{sees}</p><p role="cell">{can}</p></div>)}</div></article>
      <article className="sl-voice"><div><span>&gt; VOICE</span><h3>A calm on-call teammate. Never cheerful, never a black box.</h3><p>I wrote the agent&apos;s voice before its screens: precise, honest about certainty, quoting people in their own words. It never says &ldquo;Great news&rdquo;, &ldquo;magic&rdquo; or &ldquo;AI-powered&rdquo;. When it&apos;s wrong, it admits it in one sentence and reverts.</p></div><ul>{tones.map(([context,tone,line])=><li key={context}><small>{context}</small><b>{tone}</b><q>{line}</q></li>)}</ul></article>
      <article className="sl-brand"><div><span>&gt; IDENTITY</span><h3>Two arcs, design and code, closed by a dot: the person who closes the loop.</h3><p>I explored three marks in Figma. The closed loop won because it says what the product does without a single word.</p></div><figure><Image src="/media/seamline-logo-exploration.jpg" alt="Three Seamline logo directions: closed loop, four into one, and two layers aligned, each at several sizes on light and dark" width={1440} height={1025} sizes="(max-width: 800px) 100vw, 60vw"/></figure></article>
    </section>

    <section className="fx-chapter" id="seamline-04">
      <header><CaseSectionLabel as="p" number="04.00" level="chapter">Break it on purpose</CaseSectionLabel><h2>The most useful parts of the project were the failures.</h2></header>
      <article className="fx-insights"><span>&gt; WHAT EACH ROUND OF TESTING EXPOSED</span><ol>{failures.map(([number,title,body])=><li key={number}><small>{number}</small><strong>{title}</strong><p>{body}</p></li>)}</ol></article>
      <article className="fx-proof"><div><span>&gt; BEYOND THE PLANTED BREAKS</span><h3>It reads real screens, not just tokens.</h3><p>Seamline checks how components are used in six GitHub screens: detached instances, colours set by hand, text below AA contrast. It also found problems I didn&apos;t plant, including contrast just under AA in Primer&apos;s own dark dimmed mode.</p></div><figure><Image src="/media/seamline-screens.jpg" alt="Seamline Decisions view listing problems found in real GitHub screens" width={2880} height={1800} sizes="(max-width: 900px) 100vw, 60vw"/></figure></article>
      <article className="fx-results"><div><span>&gt; WHAT IT CAN DO TODAY</span><h3>The full loop runs on real pull requests, with no hand edits in between.</h3><ArrowLink variant="secondary" tone="purple" href="https://github.com/deboramoratalla-lab/ds-lab" target="_blank" rel="noreferrer">Read the code and test log</ArrowLink></div><div><p><strong>6/6</strong> breaks found on a screen I hadn&apos;t tuned for, with 0 false alarms on the decoys.</p><p><strong>343/343</strong> random breaks caught by the screen rules.</p><p><strong>74</strong> Primer components checked on every run, Button in depth.</p></div></article>
      <article className="fx-validation-gap"><span>&gt; WHAT I CAN&apos;T PROVE YET</span><div><h3>It&apos;s a hackathon project. I&apos;d rather say so.</h3><p>Seamline runs on GitHub&apos;s public Primer system, not with a real design system team. Model confidence is the model&apos;s own estimate, not calibrated. Figma is read, not written. The next step is the one that matters: real pull requests from a real team, and seeing which decisions people actually want back.</p><ul><li>Which kinds of change people trust it with</li><li>Whether the pause after three rejections feels fair</li><li>How often the lead overrides the agent</li></ul></div></article>
      <blockquote className="fx-close">The hard part of an agent isn&apos;t what it can do. It&apos;s what it chooses not to.</blockquote>
    </section>

    <CaseMoreWorks previous={{ href: "/projects/civeo", title: "Civeo", description: "A municipal operations surface that preserves context from overview to action." }} next={{ href: "/projects/board", title: "Board", description: "Making workflow state visible across a €1.2B budgeting system." }} />
    <SeamlineMotion />
  </main>
}
