<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="description" content="IT Support Ticketing System - Politeknik Mitra Industri">

    <title inertia>{{ config('app.name', 'IT Support') }}</title>
    <link rel="icon" type="image/png" href="/images/Logo_POLMIND.png">

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.jsx'])
    @inertiaHead
</head>
<body class="antialiased">
    @inertia
</body>
</html>
