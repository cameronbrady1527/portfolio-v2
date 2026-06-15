# Releasing `@cameronbrady/math-components`

Releases are automated with [Changesets](https://github.com/changesets/changesets)
and published to npm via **Trusted Publishing** (OIDC) from
`.github/workflows/release.yml`. No npm token is stored anywhere — GitHub proves
the workflow's identity to npm at publish time, and npm attaches build
provenance automatically.

## One-time setup on npmjs.com

Configure the package to trust this repo's release workflow. Do this once (the
package must already exist on npm — i.e. after the initial `0.1.0` publish):

1. Go to the package page → **Settings** → **Trusted Publisher**
   (npmjs.com/package/@cameronbrady/math-components/access).
2. Choose **GitHub Actions** and enter:
   - **Organization or user:** `cameronbrady1527`
   - **Repository:** `portfolio-v2`
   - **Workflow filename:** `release.yml`
   - **Environment:** _(leave blank)_
3. Save.

Once trusted publishing is on, **delete any classic/granular npm tokens** you
created for manual publishing — they're no longer needed and are the main thing
worth leaking.

## Cutting a release

1. In any PR that changes the package, add a changeset describing the change:
   ```bash
   pnpm changeset
   ```
   Pick the bump (patch/minor/major) and write a human-readable summary. Commit
   the generated file in `.changeset/`.
2. Merge that PR to `main`. The Release workflow opens (or updates) a
   **"Version Packages"** PR that bumps the version and updates `CHANGELOG.md`.
3. Review and merge the **"Version Packages"** PR. The workflow runs again and,
   finding no pending changesets, builds and **publishes the new version to
   npm** with provenance.

That's the whole loop — no local `npm publish`, no tokens, no 2FA prompts.

## Notes

- The workflow upgrades to the latest npm in CI because Trusted Publishing
  requires npm ≥ 11.5.1.
- `pnpm release` runs `turbo run build && changeset publish`. The build step
  builds the whole monorepo (cached by Turborepo); only non-private packages
  with an unpublished version are actually published, so the private `resources`
  and `portfolio` apps are skipped.
- To publish manually in a pinch (not recommended once trusted publishing is
  set up), you need either a 2FA one-time code (`npm publish --otp=XXXXXX`) or a
  granular token with "bypass 2FA" enabled.
