<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

- Keep the public marketing page on `/` and its content data in the page module because the site is a single-page presentation.
- Contact leads go to Netlify Forms (src/lib/netlifyForms.ts + public/__forms.html); there is no database or Supabase in this project, and submissions are only visible in the Netlify dashboard.
