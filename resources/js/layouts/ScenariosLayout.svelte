<script lang="ts">
    import { Link } from '@inertiajs/svelte';
    import { toUrl } from '@/lib/utils';
    import { calculator, home } from '@/routes';
    import { index as scenariosIndex } from '@/routes/scenarios';
    import type { Snippet } from 'svelte';

    let { children }: { children?: Snippet } = $props();
</script>

<div class="bg-[linear-gradient(180deg,#f8fafc_0%,#ffffff_55%,#ecfeff_100%)] dark:bg-[linear-gradient(180deg,#0f172a_0%,#020617_50%,#111827_100%)] min-h-screen text-slate-900 dark:text-slate-100">
    <header class="top-0 z-10 sticky bg-white/80 dark:bg-slate-950/75 backdrop-blur border-slate-200/80 dark:border-slate-800 border-b">
        <div class="flex flex-wrap justify-between items-center gap-3 mx-auto px-6 py-4 w-full max-w-6xl">
            <div>
                <p class="font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.2em]">
                    Scenario Navigator
                </p>
                <h1 class="font-serif text-2xl">SDLT Scenario Pages</h1>
            </div>

            <nav class="flex flex-wrap items-center gap-2 text-sm">
                <Link href={toUrl(home())} class="hover:bg-slate-100 dark:hover:bg-slate-900 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-full font-medium transition">
                    Home
                </Link>
                <Link href={toUrl(calculator())} class="hover:bg-slate-100 dark:hover:bg-slate-900 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-full font-medium transition">
                    Calculator
                </Link>
                <Link href={toUrl(scenariosIndex())} class="bg-cyan-50 hover:bg-cyan-100 dark:bg-cyan-900/20 dark:hover:bg-cyan-900/30 px-4 py-2 border border-cyan-300 dark:border-cyan-700 rounded-full font-medium text-cyan-900 dark:text-cyan-100 transition">
                    Scenarios
                </Link>
            </nav>
        </div>
    </header>

    <main class="mx-auto px-6 py-8 w-full max-w-6xl">
        {@render children?.()}
    </main>
</div>