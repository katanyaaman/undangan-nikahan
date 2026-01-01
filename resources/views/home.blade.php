<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Pilih Template Undangan - Wedding Invitation</title>
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen bg-gradient-to-br from-primary-50 via-white to-gold-50">
    <!-- Header -->
    <header class="py-12 text-center">
        <div class="container mx-auto px-4">
            <h1 class="font-script text-5xl md:text-7xl text-primary-700 mb-4 animate-fade-in-down">
                Wedding Invitation
            </h1>
            <p class="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto animate-fade-in-up">
                Pilih template undangan pernikahan yang sesuai dengan tema acara Anda
            </p>
        </div>
    </header>

    <!-- Template Grid -->
    <main class="container mx-auto px-4 py-12 max-w-7xl">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <!-- Template 1 - Elegant Modern -->
            <div class="group relative bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 animate-on-scroll"
                 data-animation="fade-in-left">
                <!-- Preview Image -->
                <div class="relative h-96 bg-gradient-to-br from-primary-600 via-primary-500 to-primary-400 overflow-hidden">
                    <!-- Decorative Background -->
                    <div class="absolute inset-0 opacity-20">
                        <div class="absolute top-0 -left-4 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                        <div class="absolute top-0 -right-4 w-72 h-72 bg-gold-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                        <div class="absolute -bottom-8 left-20 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                    </div>

                    <!-- Template Preview Content -->
                    <div class="relative z-10 h-full flex flex-col items-center justify-center text-white p-8">
                        <p class="text-sm tracking-widest uppercase mb-3 opacity-90">THE WEDDING OF</p>
                        <h2 class="font-script text-5xl mb-3">Bride & Groom</h2>
                        <div class="flex items-center my-3">
                            <div class="h-px w-12 bg-white/50"></div>
                            <span class="mx-3 text-xl">&</span>
                            <div class="h-px w-12 bg-white/50"></div>
                        </div>
                        <p class="text-sm opacity-90">31 Desember 2025</p>
                    </div>

                    <!-- Hover Overlay -->
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div class="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <svg class="w-16 h-16 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            <p class="text-white text-lg font-medium">Lihat Template</p>
                        </div>
                    </div>
                </div>

                <!-- Template Info -->
                <div class="p-8">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-2xl font-serif text-gray-800">Elegant Modern</h3>
                        <span class="px-3 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded-full">
                            Template 1
                        </span>
                    </div>

                    <p class="text-gray-600 mb-6 leading-relaxed">
                        Template modern dengan animasi smooth, glassmorphism, dan scroll effects.
                        Dilengkapi dengan gallery, gift section, dan guest book.
                    </p>

                    <!-- Features -->
                    <div class="grid grid-cols-2 gap-3 mb-6">
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            Scroll Animations
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            Glassmorphism
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            Gallery & Gift
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 text-primary-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            Guest Book
                        </div>
                    </div>

                    <!-- CTA Button -->
                    <a href="{{ route('template1.index') }}"
                       class="block w-full bg-gradient-to-r from-primary-600 to-primary-500 text-white text-center py-4 px-6 rounded-xl font-medium hover:shadow-lg hover:from-primary-700 hover:to-primary-600 active:scale-95 transition-all duration-200">
                        <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                        Gunakan Template Ini
                    </a>
                </div>
            </div>

            <!-- Template 2 - Classic Romantic -->
            <div class="group relative bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 animate-on-scroll"
                 data-animation="fade-in-right"
                 data-delay="200">
                <!-- Preview Image -->
                <div class="relative h-96 bg-gradient-to-br from-rose-500 via-pink-500 to-rose-400 overflow-hidden">
                    <!-- Decorative Background -->
                    <div class="absolute inset-0 opacity-20">
                        <div class="absolute top-10 left-10 w-64 h-64 bg-white rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                        <div class="absolute top-20 right-10 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                        <div class="absolute -bottom-8 left-1/2 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                    </div>

                    <!-- Template Preview Content -->
                    <div class="relative z-10 h-full flex flex-col items-center justify-center text-white p-8">
                        <svg class="w-16 h-16 mb-4 opacity-80" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
                        </svg>
                        <p class="text-sm tracking-widest uppercase mb-3 opacity-90">THE WEDDING OF</p>
                        <h2 class="font-script text-5xl mb-3">Couple Names</h2>
                        <p class="text-sm opacity-90 mb-2">31 • 12 • 2025</p>
                        <p class="text-xs opacity-75">#SaveTheDate</p>
                    </div>

                    <!-- Hover Overlay -->
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div class="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <svg class="w-16 h-16 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            <p class="text-white text-lg font-medium">Lihat Template</p>
                        </div>
                    </div>
                </div>

                <!-- Template Info -->
                <div class="p-8">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-2xl font-serif text-gray-800">Classic Romantic</h3>
                        <span class="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-medium rounded-full">
                            Template 2
                        </span>
                    </div>

                    <p class="text-gray-600 mb-6 leading-relaxed">
                        Template klasik dengan nuansa romantis, ornamen floral, dan warna-warna soft.
                        Perfect untuk tema pernikahan traditional dan elegant.
                    </p>

                    <!-- Features -->
                    <div class="grid grid-cols-2 gap-3 mb-6">
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 text-rose-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            Floral Design
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 text-rose-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            Romantic Theme
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 text-rose-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            Elegant Layout
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 text-rose-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            Timeline Story
                        </div>
                    </div>

                    <!-- CTA Button -->
                    <a href="{{ route('template2.index') }}"
                       class="block w-full bg-gradient-to-r from-rose-600 to-pink-600 text-white text-center py-4 px-6 rounded-xl font-medium hover:shadow-lg hover:from-rose-700 hover:to-pink-700 active:scale-95 transition-all duration-200">
                        <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                        Gunakan Template Ini
                    </a>
                </div>
            </div>

            <!-- Template 3 - Elegant Nature -->
            <div class="group relative bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 animate-on-scroll"
                 data-animation="fade-in-up"
                 data-delay="400">
                <!-- Preview Image -->
                <div class="relative h-96 bg-gradient-to-br from-brown-600 via-brown-500 to-brown-400 overflow-hidden">
                    <!-- Decorative Background -->
                    <div class="absolute inset-0 opacity-20">
                        <div class="absolute top-10 left-10 w-64 h-64 bg-cream-200 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                        <div class="absolute top-20 right-10 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                        <div class="absolute -bottom-8 left-1/2 w-64 h-64 bg-cream-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                    </div>

                    <!-- Template Preview Content -->
                    <div class="relative z-10 h-full flex flex-col items-center justify-center text-white p-8">
                        <svg class="w-16 h-16 mb-4 opacity-80" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17 8C8 10 5.9 16.17 3.82 21.34l-.59 1.66 1.66-.59C10.83 20.1 17 18 19 9l1-4-4 1-2 2 2 2c-1 2.5-3.5 5-6.5 6.5l1.5-4.5L17 8z"/>
                        </svg>
                        <p class="text-sm tracking-widest uppercase mb-3 opacity-90">THE WEDDING OF</p>
                        <h2 class="font-script text-5xl mb-3">Couple Names</h2>
                        <div class="flex items-center my-2">
                            <svg class="w-5 h-5 opacity-75" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                            </svg>
                        </div>
                        <p class="text-sm opacity-90">31 Desember 2025</p>
                    </div>

                    <!-- Hover Overlay -->
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div class="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <svg class="w-16 h-16 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            <p class="text-white text-lg font-medium">Lihat Template</p>
                        </div>
                    </div>
                </div>

                <!-- Template Info -->
                <div class="p-8">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-2xl font-serif text-gray-800">Elegant Nature</h3>
                        <span class="px-3 py-1 bg-brown-100 text-brown-700 text-xs font-medium rounded-full">
                            Template 3
                        </span>
                    </div>

                    <p class="text-gray-600 mb-6 leading-relaxed">
                        Template dengan nuansa natural dan earthy, ornamen alam, dan efek parallax.
                        Cocok untuk tema pernikahan outdoor, rustic, atau garden party.
                    </p>

                    <!-- Features -->
                    <div class="grid grid-cols-2 gap-3 mb-6">
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 text-brown-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            Nature Theme
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 text-brown-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            Parallax Effects
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 text-brown-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            Earthy Colors
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 text-brown-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            Rustic Style
                        </div>
                    </div>

                    <!-- CTA Button -->
                    <a href="{{ route('template3.index') }}"
                       class="block w-full bg-gradient-to-r from-brown-600 to-brown-700 text-white text-center py-4 px-6 rounded-xl font-medium hover:shadow-lg hover:from-brown-700 hover:to-brown-800 active:scale-95 transition-all duration-200">
                        <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                        Gunakan Template Ini
                    </a>
                </div>
            </div>

            <!-- Template 4 - Bugis Emerald -->
            <div class="group relative bg-white rounded-3xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-500 hover:-translate-y-2 animate-on-scroll"
                 data-animation="fade-in-up"
                 data-delay="600">
                <!-- Preview Image -->
                <div class="relative h-96 bg-gradient-to-br from-emerald-600 via-emerald-500 to-emerald-400 overflow-hidden">
                    <!-- Decorative Background -->
                    <div class="absolute inset-0 opacity-20">
                        <div class="absolute top-10 left-10 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl animate-blob"></div>
                        <div class="absolute top-20 right-10 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000"></div>
                        <div class="absolute -bottom-8 left-1/2 w-64 h-64 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000"></div>
                    </div>

                    <!-- Template Preview Content -->
                    <div class="relative z-10 h-full flex flex-col items-center justify-center text-white p-8">
                        <p class="text-xs tracking-[0.3em] uppercase mb-3 opacity-90">بِسْمِ اللَّهِ</p>
                        <p class="text-sm tracking-widest uppercase mb-3 opacity-90">THE WEDDING OF</p>
                        <h2 class="font-script text-5xl mb-3">Couple Names</h2>
                        <div class="flex items-center my-2">
                            <span class="text-2xl opacity-75">✤</span>
                        </div>
                        <p class="text-sm opacity-90">31 Desember 2025</p>
                    </div>

                    <!-- Hover Overlay -->
                    <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <div class="text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <svg class="w-16 h-16 text-white mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                            <p class="text-white text-lg font-medium">Lihat Template</p>
                        </div>
                    </div>
                </div>

                <!-- Template Info -->
                <div class="p-8">
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-2xl font-serif text-gray-800">Bugis Emerald</h3>
                        <span class="px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                            Template 4
                        </span>
                    </div>

                    <p class="text-gray-600 mb-6 leading-relaxed">
                        Template tradisional Bugis dengan ornamen khas, warna emerald elegant, dan sentuhan Islamic. Perfect untuk pernikahan adat Bugis atau Makassar.
                    </p>

                    <!-- Features -->
                    <div class="grid grid-cols-2 gap-3 mb-6">
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            Bugis Ornaments
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            Islamic Verses
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            Emerald Theme
                        </div>
                        <div class="flex items-center text-sm text-gray-600">
                            <svg class="w-4 h-4 text-emerald-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                            </svg>
                            Mappatabe'
                        </div>
                    </div>

                    <!-- CTA Button -->
                    <a href="{{ route('template4.index') }}"
                       class="block w-full bg-gradient-to-r from-emerald-700 to-emerald-600 text-white text-center py-4 px-6 rounded-xl font-medium hover:shadow-lg hover:from-emerald-800 hover:to-emerald-700 active:scale-95 transition-all duration-200">
                        <svg class="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                        </svg>
                        Gunakan Template Ini
                    </a>
                </div>
            </div>
        </div>

        <!-- Info Section -->
        <div class="mt-16 text-center max-w-3xl mx-auto animate-on-scroll" data-animation="fade-in-up" data-delay="600">
            <div class="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white">
                <h2 class="text-2xl font-serif text-gray-800 mb-4">Tidak Yakin Memilih?</h2>
                <p class="text-gray-600 mb-6">
                    Anda bisa melihat preview semua template terlebih dahulu sebelum memutuskan.
                    Setiap template dapat dikustomisasi sesuai dengan kebutuhan acara pernikahan Anda.
                </p>
                <div class="flex flex-wrap gap-4 justify-center">
                    <a href="{{ route('template1.index') }}"
                       class="inline-flex items-center px-6 py-3 bg-primary-100 text-primary-700 rounded-lg font-medium hover:bg-primary-200 transition-colors">
                        Preview Template 1
                    </a>
                    <a href="{{ route('template2.index') }}"
                       class="inline-flex items-center px-6 py-3 bg-rose-100 text-rose-700 rounded-lg font-medium hover:bg-rose-200 transition-colors">
                        Preview Template 2
                    </a>
                    <a href="{{ route('template3.index') }}"
                       class="inline-flex items-center px-6 py-3 bg-brown-100 text-brown-700 rounded-lg font-medium hover:bg-brown-200 transition-colors">
                        Preview Template 3
                    </a>
                    <a href="{{ route('template4.index') }}"
                       class="inline-flex items-center px-6 py-3 bg-emerald-100 text-emerald-700 rounded-lg font-medium hover:bg-emerald-200 transition-colors">
                        Preview Template 4
                    </a>
                </div>
            </div>
        </div>
    </main>

    <!-- Footer -->
    <footer class="py-8 text-center text-gray-600">
        <p class="text-sm mb-4">
            Made with
            <svg class="w-4 h-4 inline-block text-rose-500" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd"></path>
            </svg>
            by Wedding Invitation Builder
        </p>
        <a href="https://saweria.co/yusril713" target="_blank" rel="noopener noreferrer"
           class="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
            <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"/>
            </svg>
            <span>Buy Me a Coffee</span>
        </a>
    </footer>

    <script>
        // Scroll-triggered Animations
        const observerOptions = {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        };

        const animateOnScroll = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const element = entry.target;
                    const animation = element.dataset.animation || 'fade-in-up';
                    const delay = element.dataset.delay || 0;

                    setTimeout(() => {
                        element.classList.add('animated');
                    }, delay);

                    animateOnScroll.unobserve(element);
                }
            });
        }, observerOptions);

        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            animateOnScroll.observe(el);
        });
    </script>
</body>
</html>
