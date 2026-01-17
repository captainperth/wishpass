# WishPass - Game Wishlist Manager

WishPass is a Laravel application with React and Inertia.js that helps gamers manage their video game wishlists. Track games you want to buy, sync with Steam, monitor prices across multiple stores, and see which games are available on subscription services like Xbox Game Pass.

## Features

- **User Authentication**: Secure account creation and login powered by Laravel Breeze
- **Game Wishlist Management**: Create, organize, and manage your personal game wishlist
- **Steam Integration**: Sync your Steam wishlist automatically
- **Price Tracking**: Monitor game prices across multiple digital stores (Steam, Epic, GOG, etc.)
- **Sale Notifications**: See which games on your wishlist are currently on sale
- **Service Availability**: Check if games are available on subscription services like Xbox Game Pass
- **Game Search**: Browse and search for games to add to your wishlist
- **Detailed Game Information**: View comprehensive game details including platforms, genres, developers, and more

## Technology Stack

- **Backend**: Laravel 12
- **Frontend**: React with Inertia.js
- **Styling**: Tailwind CSS
- **Database**: MySQL/SQLite
- **APIs**: 
  - Steam Web API (for game data and wishlist sync)
  - CheapShark API (for price tracking)

## Installation

### Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js and NPM
- MySQL or SQLite database

### Setup Steps

1. Clone the repository:
```bash
git clone https://github.com/captainperth/wishpass.git
cd wishpass
```

2. Install PHP dependencies:
```bash
composer install
```

3. Install Node dependencies:
```bash
npm install
```

4. Copy environment file and configure:
```bash
cp .env.example .env
php artisan key:generate
```

5. Configure your database in `.env`:
```
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=wishpass
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

6. (Optional) Add Steam API key to `.env`:
```
STEAM_API_KEY=your_steam_api_key
```

7. Run migrations:
```bash
php artisan migrate
```

8. Build frontend assets:
```bash
npm run build
```

For development:
```bash
npm run dev
```

9. Start the development server:
```bash
php artisan serve
```

Visit `http://localhost:8000` in your browser.

## Usage

### Creating an Account

1. Click "Register" on the home page
2. Fill in your name, email, and password
3. Click "Register" to create your account

### Adding Games to Your Wishlist

1. Navigate to "Browse Games"
2. Search for games or browse the catalog
3. Click "Add to Wishlist" on any game

### Syncing with Steam

1. Go to your Profile settings
2. Add your Steam ID
3. Navigate to "My Wishlist"
4. Click "Sync with Steam" to import your Steam wishlist

### Checking Prices

1. Go to "My Wishlist"
2. Click "Check Prices" to update prices for all games
3. Games on sale will be highlighted

## API Integrations

### Steam Web API

Used for:
- Fetching game details
- Syncing user wishlists
- Retrieving game prices from Steam

### CheapShark API

Used for:
- Comparing prices across multiple stores
- Tracking sales and deals
- Price history

## Database Schema

### Main Tables

- `users` - User accounts
- `games` - Game catalog
- `wishlists` - User's wishlist items (pivot table)
- `game_prices` - Current prices across stores
- `game_services` - Game availability on subscription services

## Development

### Running Tests

```bash
php artisan test
```

### Code Style

```bash
./vendor/bin/pint
```

### Building for Production

```bash
npm run build
php artisan optimize
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

## Acknowledgments

- Laravel Framework
- Inertia.js
- React
- Steam Web API
- CheapShark API
