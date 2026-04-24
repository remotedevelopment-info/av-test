<script lang="ts">
    import { Link } from '@inertiajs/svelte';
    import AppHead from '@/components/AppHead.svelte';
    import { toUrl } from '@/lib/utils';
    import { index as scenariosIndex } from '@/routes/scenarios';
    import { method500000 as hmrc500000 } from '@/routes/scenarios/hmrc';
</script>

<AppHead title="HMRC Scenarios" />

<section class="flex flex-col gap-6">
    <div class="bg-white/90 dark:bg-slate-950/70 shadow-sm p-6 border border-slate-200/80 dark:border-slate-800 rounded-3xl">
        <p class="font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.2em]">
            HMRC Index
        </p>
        <h2 class="mt-2 font-serif text-3xl">HMRC Scenario Set</h2>
        <p class="mt-3 max-w-3xl text-slate-600 dark:text-slate-300 text-sm leading-7">
            Pick a scenario page below. Each page is designed to accept pasted HMRC calculator text and display the extracted line entries for quick review.
        </p>
    </div>

    <div class="gap-4 grid md:grid-cols-2">
        <Link
            href={toUrl(hmrc500000())}
            class="bg-white/90 dark:bg-slate-950/70 shadow-sm hover:shadow-lg p-6 border border-slate-200/80 dark:border-slate-800 rounded-3xl transition hover:-translate-y-0.5"
        >
            <p class="font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.2em]">
                Scenario
            </p>
            <h3 class="mt-2 font-semibold text-2xl">Purchase Price: £500,000</h3>
            <p class="mt-2 text-slate-600 dark:text-slate-300 text-sm leading-7">
                Paste HMRC calculator output and review normalized entries line-by-line.
            </p>
        </Link>
    </div>

    <div class="bg-slate-50/80 dark:bg-slate-900/40 p-5 border border-slate-300 dark:border-slate-700 border-dashed rounded-3xl text-slate-600 dark:text-slate-300 text-sm leading-7">
        Back to all scenario groups:
        <Link href={toUrl(scenariosIndex())} class="font-semibold underline underline-offset-2">Scenarios index</Link>
    </div>
</section>