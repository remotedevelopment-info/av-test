<script lang="ts">
    import { Link } from '@inertiajs/svelte';
    import AppHead from '@/components/AppHead.svelte';
    import { toUrl } from '@/lib/utils';
    import { calculator } from '@/routes';
    import { index as hmrcIndex, method500000 as hmrc500000 } from '@/routes/scenarios/hmrc';
</script>

<AppHead title="Scenarios" />

<section class="flex flex-col gap-6">
    <div class="bg-white/90 dark:bg-slate-950/70 shadow-sm p-6 border border-slate-200/80 dark:border-slate-800 rounded-3xl">
        <p class="font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.2em]">
            Index
        </p>
        <h2 class="mt-2 font-serif text-3xl">Scenario Collections</h2>
        <p class="mt-3 max-w-3xl text-slate-600 dark:text-slate-300 text-sm leading-7">
            Use this page as the top-level index for all scenario groups. Start with HMRC examples, then drill into each scenario page.
        </p>
    </div>

    <div class="gap-4 grid md:grid-cols-2">
        <Link
            href={toUrl(hmrcIndex())}
            class="bg-white/90 dark:bg-slate-950/70 shadow-sm hover:shadow-lg p-6 border border-slate-200/80 dark:border-slate-800 rounded-3xl transition hover:-translate-y-0.5"
        >
            <p class="font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.2em]">
                Category
            </p>
            <h3 class="mt-2 font-semibold text-2xl">HMRC</h3>
            <p class="mt-2 text-slate-600 dark:text-slate-300 text-sm leading-7">
                Browse HMRC scenario pages and compare pasted HMRC output entries.
            </p>
        </Link>

        <Link
            href={toUrl(hmrc500000())}
            class="bg-amber-50/80 dark:bg-amber-950/30 shadow-sm hover:shadow-lg p-6 border border-amber-300/80 dark:border-amber-700/60 rounded-3xl transition hover:-translate-y-0.5"
        >
            <p class="font-semibold text-amber-700 dark:text-amber-300 text-xs uppercase tracking-[0.2em]">
                Featured
            </p>
            <h3 class="mt-2 font-semibold text-2xl">HMRC £500,000</h3>
            <p class="mt-2 text-amber-900/90 dark:text-amber-100/90 text-sm leading-7">
                Jump directly to the current HMRC paste-and-parse scenario.
            </p>
        </Link>
    </div>

    <div class="bg-slate-50/80 dark:bg-slate-900/40 p-5 border border-slate-300 dark:border-slate-700 border-dashed rounded-3xl text-slate-600 dark:text-slate-300 text-sm leading-7">
        Need to run a fresh SDLT value check first? Open the
        <Link href={toUrl(calculator())} class="font-semibold underline underline-offset-2">calculator</Link>.
    </div>
</section>