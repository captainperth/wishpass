import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Wishlist Card */}
                        <Link
                            href={route('wishlist.index')}
                            className="block p-6 bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg hover:shadow-md transition"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        My Wishlist
                                    </h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                                        View and manage your game wishlist
                                    </p>
                                </div>
                                <svg
                                    className="w-12 h-12 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                </svg>
                            </div>
                        </Link>

                        {/* Browse Games Card */}
                        <Link
                            href={route('games.index')}
                            className="block p-6 bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg hover:shadow-md transition"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                        Browse Games
                                    </h3>
                                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                                        Discover new games and check prices
                                    </p>
                                </div>
                                <svg
                                    className="w-12 h-12 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </div>
                        </Link>
                    </div>

                    {/* Welcome Message */}
                    <div className="mt-6 bg-white dark:bg-gray-800 shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                Welcome to WishPass!
                            </h3>
                            <div className="text-gray-700 dark:text-gray-300 space-y-2">
                                <p>
                                    WishPass helps you track and manage your video game wishlist:
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-4">
                                    <li>Create and organize your game wishlist</li>
                                    <li>Sync with your Steam wishlist</li>
                                    <li>Track game prices across multiple stores</li>
                                    <li>Get notified when games go on sale</li>
                                    <li>See which games are available on Game Pass and other services</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}

