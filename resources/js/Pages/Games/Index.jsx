import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function Index({ games, filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [onSaleOnly, setOnSaleOnly] = useState(filters.on_sale || false);

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(route('games.index'), { 
            search,
            on_sale: onSaleOnly ? '1' : ''
        }, {
            preserveState: true
        });
    };

    const handleAddToWishlist = (gameId) => {
        router.post(route('wishlist.store'), { game_id: gameId });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Browse Games
                </h2>
            }
        >
            <Head title="Browse Games" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Search Bar */}
                    <div className="mb-6 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search for games..."
                                className="flex-1 rounded-md border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
                            />
                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={onSaleOnly}
                                    onChange={(e) => setOnSaleOnly(e.target.checked)}
                                    className="rounded"
                                />
                                <span className="text-sm text-gray-700 dark:text-gray-300">
                                    On Sale Only
                                </span>
                            </label>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            >
                                Search
                            </button>
                        </form>
                    </div>

                    {/* Games Grid */}
                    {games.data.length === 0 ? (
                        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm text-center">
                            <p className="text-gray-600 dark:text-gray-400">
                                No games found. Try adjusting your search.
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {games.data.map((game) => (
                                    <div
                                        key={game.id}
                                        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden"
                                    >
                                        {game.cover_image && (
                                            <img
                                                src={game.cover_image}
                                                alt={game.title}
                                                className="w-full h-40 object-cover"
                                            />
                                        )}
                                        <div className="p-4">
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                                                {game.title}
                                            </h3>
                                            
                                            {game.description && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-3">
                                                    {game.description}
                                                </p>
                                            )}

                                            {game.is_on_sale && game.current_price && (
                                                <div className="mb-3 p-2 bg-red-100 dark:bg-red-900 rounded">
                                                    <span className="text-red-600 dark:text-red-300 font-bold text-sm">
                                                        ON SALE! ${game.current_price.current_price}
                                                    </span>
                                                </div>
                                            )}

                                            <div className="flex justify-between items-center mt-4">
                                                <Link
                                                    href={route('games.show', game.id)}
                                                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 text-sm"
                                                >
                                                    Details
                                                </Link>
                                                {game.in_wishlist ? (
                                                    <span className="text-green-600 dark:text-green-400 text-sm">
                                                        ✓ In Wishlist
                                                    </span>
                                                ) : (
                                                    <button
                                                        onClick={() => handleAddToWishlist(game.id)}
                                                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                                    >
                                                        Add to Wishlist
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {games.links.length > 3 && (
                                <div className="mt-6 flex justify-center gap-2">
                                    {games.links.map((link, index) => (
                                        <Link
                                            key={index}
                                            href={link.url || '#'}
                                            className={`px-4 py-2 rounded ${
                                                link.active
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            dangerouslySetInnerHTML={{ __html: link.label }}
                                        />
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
