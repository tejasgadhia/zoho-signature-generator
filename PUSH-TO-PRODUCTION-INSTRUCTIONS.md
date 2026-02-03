# Push to Production - Instructions
**Priority**: #1 - DO THIS FIRST when you resume

---

## The Problem

Claude Code's OAuth token doesn't have the `workflow` scope required to modify `.github/workflows/` files. This is a GitHub security feature.

**Your commit (89f94c3) is ready** - it just needs to be pushed manually.

---

## Solution: Manual Git Push

### Option 1: Terminal (Simplest)

Open a regular terminal (not Claude Code) and run:

```bash
cd ~/Claude/zoho-signature-generator
git push origin main
```

**If this works** → You're done! Skip to "Verify Deployment" below.

**If you get authentication errors** → Try Option 2.

---

### Option 2: GitHub CLI (If Option 1 Fails)

```bash
cd ~/Claude/zoho-signature-generator

# Authenticate with GitHub CLI (one-time setup)
gh auth login
# Choose: GitHub.com → HTTPS → Yes (authenticate Git) → Login with web browser

# Push
git push origin main
```

---

### Option 3: Personal Access Token (If Both Fail)

**Create PAT**:
1. Go to https://github.com/settings/tokens/new
2. Note: "Push workflow files"
3. Expiration: 30 days (or your preference)
4. Scopes: Check ✅ `workflow` (this is the key one)
5. Click "Generate token"
6. **Copy the token** (you'll only see it once)

**Use PAT to push**:
```bash
cd ~/Claude/zoho-signature-generator

# Set remote URL with PAT (temporary)
git remote set-url origin https://YOUR_TOKEN@github.com/tejasgadhia/zoho-signature-generator.git

# Push
git push origin main

# Reset remote URL (security best practice)
git remote set-url origin https://github.com/tejasgadhia/zoho-signature-generator.git
```

Replace `YOUR_TOKEN` with the token you copied.

---

## Verify Deployment

### 1. Check GitHub Actions (3 minutes)

Go to: https://github.com/tejasgadhia/zoho-signature-generator/actions

**Verify**:
- [ ] "Deploy to GitHub Pages" workflow is running
- [ ] "Test" job runs **before** "Build" job (new!)
- [ ] Both jobs show green checkmarks
- [ ] Deploy completes successfully

**Timeline**: Takes ~3-5 minutes to deploy.

---

### 2. Check Live Site - Encryption (5 minutes)

**Open live site**:
```
https://tejasgadhia.github.io/zoho-signature-generator
```

**Open DevTools** (Cmd+Option+I or F12):
1. Go to **Application** tab
2. Expand **Local Storage** → `https://tejasgadhia.github.io`
3. Look for these keys:

**Expected (ENCRYPTED - Good!)** ✅:
```
signature-accent-color: YWJjZGVmZ2hpams...  (base64 string)
socialChannelOrder: XyZaBc123QwErTy456...  (base64 string)
format-lock-name: MnBvCx345ZxCvBn012...    (base64 string)
format-lock-title: QwErTy789AbCdEf456...   (base64 string)
format-lock-department: ZxCvBn012MnBvCx... (base64 string)
```

**Wrong (PLAINTEXT - Not encrypted)** ❌:
```
signature-accent-color: #E42527  (plaintext hex color)
```

**If you see plaintext** → Clear localStorage and reload:
```javascript
// In DevTools Console:
localStorage.clear();
location.reload();
```

Check console for migration logs:
```
Starting localStorage encryption migration...
Migrated key: signature-accent-color
...
Migration complete. Encrypted 5 keys.
```

---

### 3. Test Functionality (2 minutes)

**Test these features**:
- [ ] Change accent color (red/green/blue/yellow) → Key updates in localStorage
- [ ] Toggle format locks → Keys update in localStorage
- [ ] Generate all 6 signature styles → All work correctly
- [ ] Copy to clipboard → Works
- [ ] Dark mode preview → Works
- [ ] No console errors

---

## Troubleshooting

### "Authentication failed"
**Solution**: Use Option 2 (GitHub CLI) or Option 3 (PAT)

### "rejected - non-fast-forward"
**Someone else pushed to main**:
```bash
git pull --rebase origin main
git push origin main
```

### "Everything up-to-date"
**Already pushed!** → Skip to "Verify Deployment"

### localStorage shows plaintext (not encrypted)
**Migration didn't run**:
1. Clear localStorage: `localStorage.clear()` in console
2. Reload page
3. Check console for migration logs
4. Verify keys are now encrypted

### Tests fail in CI
**Check logs**:
1. Go to failed workflow in GitHub Actions
2. Click "Test" job → "Run unit tests" or "Run Playwright tests"
3. Read error message
4. Most likely: Pre-existing test failures (not related to your changes)

---

## Success Criteria

✅ Push completes without errors
✅ GitHub Actions "Deploy" workflow succeeds
✅ Live site shows encrypted localStorage keys (base64)
✅ All signature features work normally
✅ No console errors

---

## If You Get Stuck

**Come back to Claude Code and say**:

> "Pushed to production but [describe issue]. Here's what I see: [paste error message or describe behavior]"

I'll help troubleshoot!

---

## After Successful Push

**Mark issues as complete**:
1. Close Issue #183 (localStorage encryption)
2. Close Issue #185 (email client testing)

**Optional**: Create release tag
```bash
git tag -a v3.3.0 -m "Security & Testing Infrastructure

- localStorage encryption with HMAC tamper detection
- 102 comprehensive tests with Playwright visual regression
- CI/CD test gates
- Manual email client testing documentation"

git push origin v3.3.0
```

---

## Quick Reference

**Commit**: 89f94c3
**Branch**: main
**Files changed**: 21 (9 new, 12 modified)
**Lines added**: 3,798

**Push command**:
```bash
cd ~/Claude/zoho-signature-generator
git push origin main
```

**Verify URL**:
```
https://tejasgadhia.github.io/zoho-signature-generator
```

---

**That's it! Push, verify, and you're live! 🚀**
