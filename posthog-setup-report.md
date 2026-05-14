<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Āwhina Tech marketing site. A `posthog.astro` snippet component was created and added to the site's `Base.astro` layout, initialising PostHog on every page using environment variables. Six custom events were instrumented across four components to track the full visitor journey from landing to contact.

| Event | Description | File |
|-------|-------------|------|
| `contact_form_submitted` | User submitted the contact form — primary conversion event. Includes `has_charity` property. | `src/components/Contact.astro` |
| `cta_clicked` | User clicked a primary CTA button (Start a conversation / Get in touch). Includes `label` property. | `src/components/Hero.astro` (captures all `data-cta-label` buttons site-wide, including Masthead and Pricing) |
| `case_study_cta_clicked` | User clicked "Talk about a build like this" from a case study card. Includes `case_name` property. | `src/components/CaseStudies.astro` |
| `hero_preview_tab_switched` | User switched the live charity preview tab in the hero showcase. Includes `tab_label` property. | `src/components/Hero.astro` |
| `email_link_clicked` | User clicked the email address link in the contact section. | `src/components/Contact.astro` |
| `phone_link_clicked` | User clicked the phone number link in the contact section. | `src/components/Contact.astro` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1583213)
- [Contact form submissions over time](/insights/nWTnDY6L) — daily line chart of the primary conversion event
- [CTA → Form submission funnel](/insights/Fxvy0XvB) — conversion funnel from CTA click to form submit
- [CTA clicks by button](/insights/i2CyMoSX) — bar chart of which CTA label drives the most clicks
- [Case study CTA clicks by charity](/insights/gpVf0VOx) — bar chart of which case study drives the most interest
- [Direct contact link clicks](/insights/w8CvbPr9) — email and phone link click trends (high-intent signals)

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-astro-static/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
