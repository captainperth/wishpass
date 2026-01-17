import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';

export default function Show({ game }) {
    const handleAddToWishlist = () => {
        router.post(route('wishlist.store'), { game_id: game.id });
    };

    const handleRemoveFromWishlist = () => {
        if (confirm('Remove this game from your wishlist?')) {
            router.delete(route('wishlist.destroy', game.id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                        {game.title}
                    </h2>
                    <Link
                        href={route('games.index')}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400"
                    >
                        ← Back to Games
                    </Link>
                </div>
            }
        >
            <Head title={game.title} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6">
                            <div className="grid md:grid-cols-3 gap-6">
                                {/* Left Column - Image */}
                                <div className="md:col-span-1">
                                    {game.cover_image && (
                                        <img
                                            src={game.cover_image}
                                            alt={game.title}
                                            className="w-full rounded-lg shadow-md"
                                        />
                                    )}
                                    
                                    <div className="mt-4">
                                        {game.in_wishlist ? (
                                            <button
                                                onClick={handleRemoveFromWishlist}
                                                className="w-full px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                                            >
                                                Remove from Wishlist
                                            </button>
                                        ) : (
                                            <button
                                                onClick={handleAddToWishlist}
                                                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                            >
                                                Add to Wishlist
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Right Column - Details */}
                                <div className="md:col-span-2">
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                                        {game.title}
                                    </h1>

                                    {game.description && (
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                                Description
                                            </h3>
                                            <p className="text-gray-700 dark:text-gray-300">
                                                {game.description}
                                            </p>
                                        </div>
                                    )}

                                    {/* Game Info */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        {game.developer && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                                    Developer
                                                </h4>
                                                <p className="text-gray-900 dark:text-gray-100">
                                                    {game.developer}
                                                </p>
                                            </div>
                                        )}
                                        {game.publisher && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                                    Publisher
                                                </h4>
                                                <p className="text-gray-900 dark:text-gray-100">
                                                    {game.publisher}
                                                </p>
                                            </div>
                                        )}
                                        {game.release_date && (
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                                                    Release Date
                                                </h4>
                                                <p className="text-gray-900 dark:text-gray-100">
                                                    {game.release_date}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Genres */}
                                    {game.genres && game.genres.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                                Genres
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {game.genres.map((genre, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-full text-sm"
                                                    >
                                                        {genre}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Platforms */}
                                    {game.platforms && game.platforms.length > 0 && (
                                        <div className="mb-6">
                                            <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">
                                                Platforms
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {game.platforms.map((platform, idx) => (
                                                    <span
                                                        key={idx}
                                                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                                                    >
                                                        {platform}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Prices */}
                                    {game.prices && game.prices.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                                Where to Buy
                                            </h3>
                                            <div className="space-y-2">
                                                {game.prices.map((price, idx) => (
                                                    <div
                                                        key={idx}
                                                        className={`p-3 rounded-lg ${
                                                            price.is_on_sale
                                                                ? 'bg-red-100 dark:bg-red-900'
                                                                : 'bg-gray-100 dark:bg-gray-700'
                                                        }`}
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <div>
                                                                <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                                    {price.store}
                                                                </span>
                                                                {price.is_on_sale && (
                                                                    <span className="ml-2 px-2 py-1 bg-red-600 text-white text-xs rounded">
                                                                        SALE
                                                                    </span>
                                                                )}
                                                            </div>
                                                            <div className="text-right">
                                                                <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                                                                    ${price.current_price}
                                                                </div>
                                                                {price.is_on_sale && (
                                                                    <div className="text-sm text-gray-600 dark:text-gray-400 line-through">
                                                                        ${price.original_price}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {price.store_url && (
                                                            <a
                                                                href={price.store_url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block"
                                                            >
                                                                View on {price.store} →
                                                            </a>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Services */}
                                    {game.services && game.services.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
                                                Available on Subscription Services
                                            </h3>
                                            <div className="space-y-2">
                                                {game.services.map((service, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="p-3 bg-green-100 dark:bg-green-900 rounded-lg"
                                                    >
                                                        <div className="flex justify-between items-center">
                                                            <span className="font-semibold text-gray-900 dark:text-gray-100">
                                                                {service.service_name}
                                                            </span>
                                                            {service.tier && (
                                                                <span className="px-2 py-1 bg-green-600 text-white text-xs rounded">
                                                                    {service.tier}
                                                                </span>
                                                            )}
                                                        </div>
                                                        {service.available_until && (
                                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                Available until: {service.available_until}
                                                            </p>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
