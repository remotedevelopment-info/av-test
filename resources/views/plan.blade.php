<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>{{ $title }}</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
                background: #f8fafc;
                color: #0f172a;
            }

            main {
                max-width: 56rem;
                margin: 0 auto;
                padding: 3rem 1.5rem 4rem;
            }

            article {
                background: #ffffff;
                border: 1px solid #e2e8f0;
                border-radius: 1rem;
                padding: 2rem;
                box-shadow: 0 10px 30px rgba(15, 23, 42, 0.06);
            }

            h1, h2, h3 {
                line-height: 1.2;
            }

            h1 {
                margin-top: 0;
                font-size: 2rem;
            }

            h2 {
                margin-top: 2rem;
                font-size: 1.5rem;
            }

            h3 {
                margin-top: 1.5rem;
                font-size: 1.125rem;
            }

            p, li {
                line-height: 1.7;
            }

            code {
                padding: 0.125rem 0.375rem;
                border-radius: 0.375rem;
                background: #e2e8f0;
                font-size: 0.9em;
            }

            pre {
                overflow-x: auto;
                padding: 1rem;
                border-radius: 0.75rem;
                background: #0f172a;
                color: #e2e8f0;
            }

            pre code {
                padding: 0;
                background: transparent;
                color: inherit;
            }

            table {
                width: 100%;
                border-collapse: collapse;
                margin: 1.5rem 0;
            }

            th, td {
                padding: 0.75rem;
                text-align: left;
                border: 1px solid #cbd5e1;
            }
        </style>
    </head>
    <body>
        <main>
            <article>{!! $content !!}</article>
        </main>
    </body>
</html>