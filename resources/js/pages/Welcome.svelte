<script lang="ts">
    import { Link, page } from '@inertiajs/svelte';
    import AppHead from '@/components/AppHead.svelte';
    import { toUrl } from '@/lib/utils';
    import { calculator, login, register } from '@/routes';
    import { index as scenariosIndex } from '@/routes/scenarios';

    let {
        canRegister = true,
    }: {
        canRegister: boolean;
    } = $props();

    const auth = $derived(page.props.auth);
</script>

<AppHead title="Home" />

<div class="bg-[linear-gradient(180deg,#fefce8_0%,#ffffff_45%,#ecfeff_100%)] dark:bg-[linear-gradient(180deg,#0f172a_0%,#020617_45%,#111827_100%)] min-h-screen text-slate-900 dark:text-slate-100">
    <main class="flex flex-col gap-8 mx-auto px-6 py-10 lg:py-14 w-full max-w-4xl">
        <section class="bg-white/90 dark:bg-slate-950/70 shadow-sm backdrop-blur p-6 lg:p-8 border border-slate-200/80 dark:border-slate-800 rounded-3xl">
            <p class="font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.2em]">
                Exercise Menu
            </p>
            <h1 class="mt-3 font-serif text-4xl lg:text-5xl leading-tight">
                SDLT Calculator Workspace
            </h1>
            <p class="mt-4 max-w-2xl text-slate-600 dark:text-slate-300 text-sm leading-7">
                Start from the calculator, then use the plan and process documents to track your decisions, progress, and verification steps across the 2-hour exercise.
            </p>
        </section>

        <section class="gap-4 grid md:grid-cols-2">
            <Link
                href={toUrl(calculator())}
                class="group bg-amber-100/70 dark:bg-amber-500/10 hover:shadow-lg p-6 border border-amber-300/60 dark:border-amber-500/30 rounded-3xl transition hover:-translate-y-0.5"
            >
                <p class="font-semibold text-amber-800 dark:text-amber-200 text-xs uppercase tracking-[0.2em]">
                    Primary
                </p>
                <h2 class="mt-2 font-semibold text-2xl">Calculator</h2>
                <p class="mt-2 text-amber-900/90 dark:text-amber-100/90 text-sm leading-7">
                    Open the JSON-driven SDLT calculator and run scenarios.
                </p>
            </Link>

            <a
                href="/plan"
                class="bg-white/90 dark:bg-slate-950/70 hover:shadow-lg p-6 border border-slate-200 dark:border-slate-800 rounded-3xl transition hover:-translate-y-0.5"
            >
                <p class="font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.2em]">
                    Reference
                </p>
                <h2 class="mt-2 font-semibold text-2xl">Plan</h2>
                <p class="mt-2 text-slate-600 dark:text-slate-300 text-sm leading-7">
                    Review scope, constraints, and success criteria.
                </p>
            </a>

            <a
                href="/process"
                class="bg-white/90 dark:bg-slate-950/70 hover:shadow-lg p-6 border border-slate-200 dark:border-slate-800 rounded-3xl transition hover:-translate-y-0.5"
            >
                <p class="font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.2em]">
                    Tracking
                </p>
                <h2 class="mt-2 font-semibold text-2xl">Process Log</h2>
                <p class="mt-2 text-slate-600 dark:text-slate-300 text-sm leading-7">
                    Capture implementation notes, blockers, and outcomes.
                </p>
            </a>

            {#if auth.user}
                <Link
                    href={toUrl(scenariosIndex())}
                    class="bg-white/90 dark:bg-slate-950/70 hover:shadow-lg p-6 border border-slate-200 dark:border-slate-800 rounded-3xl transition hover:-translate-y-0.5"
                >
                    <p class="font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.2em]">
                        Explore
                    </p>
                    <h2 class="mt-2 font-semibold text-2xl">Scenarios</h2>
                    <p class="mt-2 text-slate-600 dark:text-slate-300 text-sm leading-7">
                        Open scenario indexes and jump directly into HMRC case pages.
                    </p>
                </Link>
            {:else}
                <div class="bg-white/90 dark:bg-slate-950/70 p-6 border border-slate-200 dark:border-slate-800 rounded-3xl">
                    <p class="font-semibold text-slate-500 dark:text-slate-400 text-xs uppercase tracking-[0.2em]">
                        Access
                    </p>
                    <h2 class="mt-2 font-semibold text-2xl">Account</h2>
                    <div class="flex flex-wrap gap-3 mt-4">
                        <Link
                            href={toUrl(login())}
                            class="hover:bg-slate-100 dark:hover:bg-slate-900 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-full font-medium text-sm transition"
                        >
                            Log in
                        </Link>
                        {#if canRegister}
                            <Link
                                href={toUrl(register())}
                                class="hover:bg-slate-100 dark:hover:bg-slate-900 px-4 py-2 border border-slate-300 dark:border-slate-700 rounded-full font-medium text-sm transition"
                            >
                                Register
                            </Link>
                        {/if}
                    </div>
                </div>
            {/if}
        </section>

        <section class="bg-slate-50/80 dark:bg-slate-900/40 p-5 border border-slate-300 dark:border-slate-700 border-dashed rounded-3xl text-slate-600 dark:text-slate-300 text-sm leading-7">
            <h3 class="font-semibold text-slate-900 dark:text-slate-100">Suggested order</h3>
            <ol class="space-y-1 mt-2 pl-5 list-decimal">
                <li>Open Calculator and validate core scenarios.</li>
                <li>Confirm assumptions in Plan.</li>
                <li>Record progress and evidence in Process Log.</li>
            </ol>
        </section>
    </main>
</div>
