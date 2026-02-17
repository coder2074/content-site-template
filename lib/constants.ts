/*

Ah, I see the issue! You're using Tailwind CSS v4 (the new major version), 
which has a completely different plugin system. The @tailwindcss/typography 
plugin isn't compatible with v4 yet in the traditional way.

Need this bcause the injected html did not have proper styling.
*/

export const PROSE_CLASSES = "[&_p]:mb-4 [&_p]:leading-7 [&_strong]:font-bold [&_em]:italic [&_ul]:list-disc [&_ul]:ml-6 [&_ul]:mb-4 [&_li]:mb-2 [&_li]:leading-7"