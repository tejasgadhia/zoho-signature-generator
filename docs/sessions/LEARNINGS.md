# Learnings - Zoho Email Signature Generator
Last Updated: 2026-01-24

## What Worked Well

### Quick Tooltip Text Review
**Context**: Issue #7 - review tooltip language/grammar
**What we did**: Read current tooltips, identified issues, proposed improvements in a table, got approval, made all 5 edits
**Why it worked**: Simple copywriting task didn't need elaborate planning - just review, propose, execute
**Reuse for**: Any content/copy editing tasks - skip brainstorming, just analyze and fix

### Separating Feature from Copy
**Context**: User mentioned phone auto-formatting during tooltip review
**What we did**: Recognized it as a separate behavioral feature, logged as new issue (#9) instead of scope-creeping
**Why it worked**: Kept the current task focused, captured the idea for later
**Reuse for**: Any time a tangential feature request comes up - log it, don't mix concerns

## What Didn't Work

### Skipping the /tg-issue Skill
**What we tried**: Created GitHub issue directly with `gh issue create`
**Why it failed**: Bypassed the skill workflow - no preview, no confirmation, no labels initially
**What we did instead**: Added labels after the fact, reviewed the skill to understand it
**Lesson**: Always use `/tg-issue` for creating issues - it ensures preview + confirmation + proper labeling

## Technical Patterns

### Tooltip Best Practices
**Implementation**: Keep tooltips concise but actionable
- Bad: "Min 10 digits, +country code supported" (spec-like, abbreviated)
- Good: "Format: +1 (555) 123-4567. Include country code." (example-driven)
- For complex tasks: Include brief instructions ("Visit LinkedIn, click your profile...")
**Use case**: Any help text or tooltips
**Benefits**: Users understand immediately without guessing

### LinkedIn Username Instructions
**Implementation**: "Your username from your profile URL. Visit LinkedIn, click your profile, and copy the text after /in/ in the address bar."
**Use case**: When users might not know where to find a value
**Benefits**: Reduces friction, prevents support questions

## Efficiency Improvements

### Better Questions to Ask Upfront
- When fixing content: "Are there related behavioral changes needed, or just text?"
- This session caught phone formatting as separate concern early

### Workflow Optimizations
- For content tasks: Skip brainstorming, go straight to analysis
- Always check if a skill exists before doing something manually (like creating issues)

## Skill Usage Reminders

### /tg-issue Workflow
1. Analyze the issue
2. Show preview with title, labels, description
3. Get confirmation
4. Create with proper labels (type + priority)
5. Confirm with URL

### When to Use Which Skill
- `/tg-issue`: Log bugs/ideas/tasks for later
- `/tg-issues`: View open issues backlog
- `/tg-recap`: End of session documentation (this!)
- Brainstorming: Creative/feature work, NOT content editing

## Retrospective

**What went well:**
- Quick, focused session - fixed tooltips and closed issue #7
- Properly separated concerns (logged phone formatting separately)
- Learned about /tg-issue skill workflow

**What could have been faster:**
- Should have used /tg-issue skill from the start

**What to do differently next time:**
- Check for applicable skills BEFORE taking action
- When creating GitHub issues, always use /tg-issue
