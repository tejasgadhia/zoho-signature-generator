# Learnings - Zoho Email Signature Generator
Last Updated: 2026-01-24

---

## Session: January 24, 2026 - v0.9.0 Implementation

### What Worked Well

#### Executing Plans Skill for Implementation
**Context**: Used executing-plans skill with 10-task implementation plan
**What we did**: Loaded plan, executed in batches, verified between batches
**Why it worked**:
- Clear task breakdown prevented scope creep
- Batch execution (tasks 1-5, then 6-10) provided natural checkpoints
- File references made edits precise
**Reuse for**: Any multi-file implementation with clear spec

#### Form Data Debugging Pattern
**Context**: LinkedIn/X/Email not appearing in signatures on page load
**What we did**: Traced data flow: `<input id>` → `loadInitialFormData()` → `AppState.formData` → `getFilteredFormData()` → templates
**Why it worked**:
- Found root cause: special input IDs (email-prefix) not mapping to formData keys (email)
- Fix was targeted, didn't require major refactoring
**Pattern**: When data doesn't appear, trace the full data flow from input to output
**Reuse for**: Any "data not showing" bugs

#### Quick Bug Fix Iteration
**Context**: Found 4 bugs during implementation (preview alignment, X/Twitter mapping, form data, accent bar)
**What we did**: Fix → test → commit → next bug
**Why it worked**:
- Small commits make debugging easier
- Each fix was isolated and verifiable
- Didn't batch fixes (harder to test)
**Reuse for**: Bug fix sessions - commit each fix separately

---

### What Didn't Work

#### Working on Main Instead of Worktree
**What we tried**: Made all commits directly to main branch (15 commits)
**Why it failed**: User preference (from CLAUDE.md) is to use worktrees for feature work
**What we did instead**: Pushed all 15 commits to main (worked, but not ideal)
**Lesson**: Read CLAUDE.md workflow preferences BEFORE starting implementation
**Fix for next time**: `git worktree add ../feature-branch` at session start

#### Agent Browser Reliability
**What we tried**: Used agent-browser to test templates and take screenshots
**Why it failed**: Intermittent errors ("Resource temporarily unavailable", "selector: Expected string")
**What we did instead**: Used node syntax validation, relied on user to manually test
**Lesson**: Have fallback verification plan, don't rely solely on agent-browser
**Alternative**: Ask user for screenshots, use simple `node --check` for syntax

---

### Technical Patterns

#### 3-Tier Content Hierarchy Implementation
**Implementation**:
```javascript
// Tier 1: Primary Contact (Phone + Email)
const tier1Links = [];
if (data.phone) tier1Links.push(`<a href="tel:...">`);
if (data.email) tier1Links.push(`<a href="mailto:...">`);
const tier1Html = tier1Links.join(' • ');

// Tier 2: Personal Connections (LinkedIn + X + Bookings)
const tier2Links = [];
if (data.linkedin) tier2Links.push(...);
if (data.twitter) tier2Links.push(...);  // Note: 'twitter' not 'x'
if (data.bookings) tier2Links.push(...);
const tier2Html = tier2Links.join(' • ');

// Tier 3: Zoho Social (passed in as zohoSocialHtml)
```
**Use case**: Any multi-group contact/social display
**Benefits**: Clear visual separation, independent tier rendering

#### Empty Table Cell Prevention
**Problem**: `<td style="width:2px; background:red;">` collapses in some email clients
**Solution**: Add `&nbsp;` as content
```html
<td style="width: 2px; background: #E42527; opacity: 0.3;">&nbsp;</td>
```
**Why it works**: Non-breaking space prevents td collapse while remaining invisible
**Use case**: Any empty decorative table cells in email HTML

#### Form Data Key Mapping
**Problem**: Input IDs don't always match formData keys
```javascript
// Input: <input id="email-prefix">
// Needs to map to: formData.email

// Input: <input id="twitter-username">
// Needs to map to: formData.twitter
```
**Solution**: Map special IDs in loadInitialFormData():
```javascript
if (inputId === 'email-prefix') {
    AppState.formData.email = `${value}@zohocorp.com`;
} else if (inputId === 'twitter-username') {
    AppState.formData.twitter = `@${value}`;
}
```
**Use case**: Any form with computed/prefixed inputs

---

### Efficiency Improvements

#### Better Questions to Ask Upfront

**For implementation sessions:**
1. "Should I use a worktree or work directly on main?" (check CLAUDE.md)
2. "Do you want screenshots as I go or just at the end?" (set expectations)
3. "Are there any known issues I should verify while implementing?" (prioritize testing)

#### Workflow Optimizations

**Commit often, commit small:**
- Each bug fix = 1 commit
- Each feature = 1 commit
- Don't batch unrelated changes

**Syntax check before committing:**
```bash
node --check js/*.js && echo "Valid"
```

**Test critical paths:**
- Page load (does default template work?)
- Toggle fields (do they show/hide correctly?)
- Copy button (does clipboard work?)

---

### Dependencies & Tools

#### Executing-Plans Skill
**What it does**: Loads implementation plan, executes tasks in batches with verification
**Why we chose it**: Had detailed 10-task plan ready from design session
**Benefits**:
- Structured execution (didn't miss tasks)
- Built-in checkpoints (user verification between batches)
- Clear completion criteria
**Gotchas**: Need well-structured plan file with specific file paths

---

### Retrospective

#### What Went Well
1. **Template implementation** - All 6 templates working with Verdana and 3-tier hierarchy
2. **Bug fixing** - Found and fixed 4 bugs efficiently (preview alignment, X mapping, form data, accent bar)
3. **Documentation** - Updated CHANGELOG, CLAUDE.md, session status
4. **Deployment** - Pushed to GitHub Pages successfully

#### What Could Have Been Faster
1. **Worktree setup** - Should have used worktree per user preferences
   - **Time lost**: None functionally, but not following preferred workflow
2. **Agent browser issues** - Spent time troubleshooting instead of asking for manual test
   - **Time lost**: ~10 minutes
3. **Context restart** - Previous session hit context limit, lost some state
   - **Mitigation**: Session status doc helped restore context quickly

#### What to Do Differently Next Time
1. **Check CLAUDE.md preferences** before starting any implementation
2. **Use worktrees** for feature work (even if user doesn't explicitly request)
3. **Have fallback testing** ready when agent-browser fails
4. **Create session status** earlier (before context limit warning)

---

### Key Decisions & Rationale

#### Why `data.twitter` Instead of `data.x`
**Problem**: Templates used `data.x` but form stored as `data.twitter`
**Root cause**: Input ID is `twitter-username`, and input events store using ID prefix
**Fix**: Changed all templates to use `data.twitter`
**Alternative rejected**: Renaming input to `x-username` (would break existing code)

#### Why Left-Align Preview Instead of Center
**Problem**: Signatures appeared centered in preview, but emails are left-aligned
**User feedback**: "Doesn't accurately preview what it would look like in email"
**Fix**: Changed `.preview-container` from `justify-content: center` to `flex-start`
**Benefit**: Preview now matches email appearance

#### Why Add `&nbsp;` to Accent Bar
**Problem**: Modern template's 2px accent bar wasn't rendering
**Root cause**: Empty `<td>` with just width/background collapses
**Fix**: Added `&nbsp;` content + CSS opacity for color
**Alternative considered**: Using border instead of td (less email-client compatible)

---

### Patterns to Reuse

#### Data Flow Debugging
```
User input → Event handler → AppState → Filter function → Template → HTML output
```
When data missing: trace each step, find where it breaks

#### Template Function Signature
```javascript
generateXxxStyle(data, websiteUrl, zohoSocialHtml, accentColor, isPreview) {
    // Build tiers
    // Return table HTML
}
```
Consistent signature across all templates makes switch statements clean

#### Session Continuity
- Create `docs/sessions/YYYY-MM-DD-*.md` for long tasks
- Include: completed tasks, remaining tasks, files modified, continuation prompt
- Check for existing status file at session start

---

**End of Learnings Document**
