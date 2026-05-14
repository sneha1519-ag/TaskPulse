# TaskPulse — AI Task Prioritizer

> Stop guessing what to work on next. TaskPulse analyses your tasks and tells you what matters most.

A web-based productivity tool that uses **natural language processing** to intelligently prioritise tasks by analysing both their descriptions and due dates — giving you a ranked, actionable list instead of an overwhelming backlog.

---

## The problem it solves

Most to-do apps sort by date or manual priority. But urgency and importance aren't the same thing. A task due tomorrow that takes 5 minutes isn't more important than a complex deliverable due next week that needs 3 days of work. TaskPulse reads the *content* of your tasks to understand what actually needs your attention first.

---

**Example input:**
```
Task: "Review Q3 analytics report before stakeholder meeting"  Due: Tomorrow
Task: "Reply to team lunch Slack message"                      Due: Today
Task: "Prepare SQL queries for new dashboard"                  Due: In 5 days
Task: "Update project documentation"                           Due: Next week
```

**TaskPulse output:**
```
Priority 1 ★★★  Prepare SQL queries for new dashboard        (high complexity + deadline proximity)
Priority 2 ★★★  Review Q3 analytics report                   (stakeholder dependency detected)
Priority 3 ★★   Update project documentation                  (important but flexible timing)
Priority 4 ★    Reply to team lunch Slack message             (low effort, low impact)
```

---

## How it works

```
User inputs task + due date
          │
          ▼
  NLP analysis of task description
  • Detects complexity signals ("prepare", "review", "build" vs "reply", "check")
  • Identifies stakeholder dependencies ("meeting", "presentation", "deadline")
  • Estimates effort level from description length and action verbs
          │
          ▼
  Due date urgency scoring
  • Normalised 0–1 scale based on days remaining
          │
          ▼
  Weighted priority score
  • Combined: (0.6 × importance) + (0.4 × urgency)
          │
          ▼
  Ranked task list with reasoning
```

---

## Tech stack

| Component | Technology |
|-----------|-----------|
| Frontend | JavaScript (Vanilla), HTML, CSS |
| NLP logic | Client-side keyword analysis + scoring |
| Priority algorithm | Weighted multi-factor scoring |
| Deployment | Static (no backend needed) |

---

## Getting started

```bash
git clone https://github.com/sneha1519-ag/TaskPulse.git
cd TaskPulse
# Open index.html in your browser — no install needed
open index.html
```

Or use a local server for best results:
```bash
npx serve .
# Visit http://localhost:3000
```

---

## Project structure

```
TaskPulse/
├── index.html          # Main app interface
├── style.css           # UI styling
├── app.js              # Core logic — NLP scoring + priority algorithm
└── README.md
```

---

## What I learned

- Designing a scoring algorithm requires understanding the *business problem* first — what does "priority" actually mean to a user?
- Client-side NLP is limited but powerful for keyword-based intent detection without API costs
- Weighting multiple signals (urgency vs importance) is a classic BI challenge — the same trade-off exists in business dashboards

---

## Roadmap

- [ ] OpenAI integration for richer task understanding
- [ ] Calendar sync — auto-detect existing commitments when scoring urgency
- [ ] Team mode — share prioritised lists with collaborators
- [ ] Export to CSV for integration with project management tools

---

## Related skills demonstrated

`JavaScript` · `NLP` · `Algorithm Design` · `Product Thinking` · `UI/UX` · `Priority Scoring`

---

*Built by [Sneha Agarwal](https://github.com/sneha1519-ag) · Feedback welcome via Issues*
