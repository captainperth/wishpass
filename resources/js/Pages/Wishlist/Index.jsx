import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ wishlist, has_steam_id }) {
    const [refreshing, setRefreshing] = useState(false);

    const handleRemoveFromWishlist = (gameId) => {
        if (confirm('Remove this game from your wishlist?')) {
            router.delete(route('wishlist.destroy', gameId));
        }
    };

    const handleSyncSteam = () => {
        setRefreshing(true);
        router.post(route('wishlist.sync-steam'), {}, {
            onFinish: () => setRefreshing(false)
        });
    };

    const handleCheckSales = () => {
        setRefreshing(true);
        router.post(route('wishlist.check-sales'), {}, {
            onFinish: () => setRefreshing(false)
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        My Wishlist
                    </h2>
                    <div className="flex gap-2">
                        {has_steam_id && (
                            <button
                                onClick={handleSyncSteam}
                                disabled={refreshing}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                            >
                                {refreshing ? 'Syncing...' : 'Sync with Steam'}
                            </button>
                        )}
                        <button
                            onClick={handleCheckSales}
                            disabled={refreshing}
                            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50"
                        >
                            {refreshing ? 'Checking...' : 'Check Prices'}
                        </button>
                        <Link
                            href={route('games.index')}
                            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
                        >
                            Browse Games
                        </Link>
                    </div>
                </div>
            }
        >
            <Head title="My Wishlist" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {wishlist.length === 0 ? (
                        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                            <div className="p-6 text-center text-gray-900 dark:text-gray-100">
                                <p className="text-lg mb-4">Your wishlist is empty</p>
                                <Link
                                    href={route('games.index')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Browse Games
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {wishlist.map((item) => (
                                <div
                                    key={item.id}
                                    className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                                >
                                    {item.cover_image && (
                                        <img
                                            src={item.cover_image}
                                            alt={item.title}
                                            className="w-full h-48 object-cover"
                                        />
                                    )}
                                    <div className="p-4">
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                                            {item.title}
                                        </h3>
                                        
                                        {item.description && (
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                                {item.description}
                                            </p>
                                        )}

                                        {item.is_on_sale && item.current_price && (
                                            <div className="mb-3 p-2 bg-red-100 dark:bg-red-900 rounded">
                                                <span className="text-red-600 dark:text-red-300 font-bold">
                                                    ON SALE! ${item.current_price.current_price}
                                                </span>
                                                {item.current_price.discount_percent > 0 && (
                                                    <span className="ml-2 text-sm">
                                                        (-{item.current_price.discount_percent}%)
                                                    </span>
                                                )}
                                            </div>
                                        )}

                                        {item.services && item.services.length > 0 && (
                                            <div className="mb-3">
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                    Available on:
                                                </p>
                                                <div className="flex flex-wrap gap-1">
                                                    {item.services.map((service, idx) => (
                                                        <span
                                                            key={idx}
                                                            className="px-2 py-1 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded"
                                                        >
                                                            {service.service_name}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {item.platforms && item.platforms.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-3">
                                                {item.platforms.map((platform, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded"
                                                    >
                                                        {platform}
                                                    </span>
                                                ))}
                                            </div>
                                        )}

                                        <div className="flex justify-between items-center mt-4">
                                            <Link
                                                href={route('games.show', item.id)}
                                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm"
                                            >
                                                View Details
                                            </Link>
                                            <button
                                                onClick={() => handleRemoveFromWishlist(item.id)}
                                                className="text-red-600 hover:text-red-800 dark:text-red-400 text-sm"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
