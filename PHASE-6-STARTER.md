# Phase 6 Starter Prompt - SignatureGenerator Module

## Context
Refactoring zoho-signature-generator from vanilla JS to Vite + TypeScript (simplified approach). Working in isolated worktree - work autonomously, only check in for questions or phase completions.

## Current Status
- **Branch**: refactor/vite-typescript
- **Location**: `/Users/tejasgadhia/Claude/zoho-signature-generator-refactor`
- **Completed**: Phase 1 (8636aaf), Phase 2 (6608d68), Phase 3 (9d6b4a7), Phase 4 (9a105a9), Phase 5 (d3dd8cf)
- **Plan**: `~/.claude/plans/smooth-toasting-elephant.md`

## Phase 5 Complete ✓
Created utility function modules with full type safety:
- ✅ `src/utils/validation.ts` (4 functions)
- ✅ `src/utils/formatting.ts` (4 functions)
- ✅ `src/utils/url.ts` (4 functions)
- ✅ `src/utils/storage.ts` (8 functions)
- ✅ `src/utils/index.ts` (barrel export)
- ✅ TypeScript compiles without errors
- ✅ All functions extracted match original behavior exactly

## Next Task: Phase 6 - SignatureGenerator Module (~2 hours)

### Goal
Port the SignatureGenerator object from signature.js to TypeScript with full type safety and modular architecture.

### Files to Create

#### 1. `src/signature-generator/styles/` - Style-specific generators
Each signature style gets its own module for maintainability:

- `src/signature-generator/styles/classic.ts`
- `src/signature-generator/styles/professional.ts`
- `src/signature-generator/styles/compact.ts`
- `src/signature-generator/styles/modern.ts`
- `src/signature-generator/styles/creative.ts`
- `src/signature-generator/styles/minimal.ts`
- `src/signature-generator/styles/executive.ts` (legacy)
- `src/signature-generator/styles/bold.ts` (legacy)

Each style module exports:
```typescript
export function generate(
  data: SignatureFormData,
  websiteUrl: string,
  zohoSocialHtml: string,
  accentColor: string,
  isPreview: boolean
): string;
```

#### 2. `src/signature-generator/components/` - Reusable signature components

- `src/signature-generator/components/logos.ts`
  - `getLogoUrls(): { light: string; dark: string }`
  - `generateDualLogos(websiteUrl: string, height: number): string`

- `src/signature-generator/components/dark-mode.ts`
  - `getDarkModeStyles(isPreview: boolean): string`

- `src/signature-generator/components/social-links.ts`
  - `generateSocialLinks(channels: string[], displayType: string, accentColor: string): string`

- `src/signature-generator/components/contact-tiers.ts`
  - `buildTier1Links(data: SignatureFormData, accentColor: string): string` (Phone + Email)
  - `buildTier2Links(data: SignatureFormData, accentColor: string): string` (LinkedIn + X + Bookings)

#### 3. `src/signature-generator/index.ts` - Main entry point
```typescript
export class SignatureGenerator {
  static generate(
    data: SignatureFormData,
    style: SignatureStyle,
    socialOptions: SocialOptions,
    accentColor: string,
    isPreview?: boolean
  ): string;

  static generatePreview(
    data: SignatureFormData,
    style: SignatureStyle,
    socialOptions: SocialOptions,
    accentColor: string
  ): string;
}
```

### Implementation Steps

1. **Read original signature.js** to understand structure
2. **Create component modules** (logos, dark-mode, social-links, contact-tiers)
3. **Create style generators** (one module per style)
4. **Create main SignatureGenerator class** (orchestrates everything)
5. **Verify TypeScript compiles**: `npx tsc --noEmit`
6. **Commit Phase 6** with descriptive message
7. **Create Phase 7 starter prompt**

### Key Design Patterns

**Modular architecture**:
- Each signature style is a separate module (easier to maintain)
- Shared components extracted (logos, dark mode, social links)
- Main class orchestrates and delegates to style modules

**Type safety**:
- Import types from `src/types.ts` (SignatureFormData, SignatureStyle, SocialOptions)
- Import constants from `src/constants.ts` (SOCIAL_CHANNELS)
- Import utils from `src/utils/` (escapeHtml, sanitizePhone, sanitizeSocialUrl)

**Email compatibility**:
- Table-based layouts (not div/flexbox)
- Inline styles (no external CSS)
- Dual logos with CSS media queries for dark mode
- Tested across Gmail, Outlook, Apple Mail, Thunderbird

### Success Criteria
- ✅ All 8 signature styles ported to TypeScript
- ✅ Shared components extracted (logos, dark mode, social, tiers)
- ✅ Main SignatureGenerator class created
- ✅ TypeScript compiles without errors
- ✅ Generated HTML matches original exactly (table structure, inline styles)
- ✅ Dark mode CSS includes both .dark-mode class and media query
- ✅ All functions properly typed with JSDoc
- ✅ Committed to git with clear commit message

### Autonomy
Work through signature generator extraction autonomously. Only stop for questions or completion. Commit when done. Create Phase 7 starter prompt.

---

**Start Phase 6 now.**
