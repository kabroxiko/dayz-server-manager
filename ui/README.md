# DayZ Server Manager UI

A modern, responsive web interface for managing DayZ servers built with Angular 16 and Bootstrap 5.

## Features

- **Real-time Dashboard** - Monitor server status, player count, uptime, and performance
- **Player Management** - View online players, kick/ban players, monitor activity  
- **Server Logs** - Real-time log viewing with search and filtering
- **Comprehensive Settings** - Complete DayZ server configuration management with 5 major categories
- **Mock Mode** - Full standalone development mode with simulated data
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile devices
- **Modern UI** - Clean, professional interface using Bootstrap 5 with tabbed navigation

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm 7+

### Installation
```bash
# Install dependencies
npm install

# Start development server (mock mode)
npm start

# Build for production
npm run build:prod
```

## Development Modes

### Mock Mode (Standalone)
Perfect for UI development without needing the DayZ server backend:
```bash
npm start
```
- Simulates all server data
- No backend dependency
- Safe for testing and development
- Available at `http://localhost:4200`

### Production Mode
For deployment with the actual DayZ server:
```bash
npm run build:prod
```
- Optimized bundles
- Connects to real backend
- Production-ready assets in `../dist/ui/`

## Project Structure

```
ui/
├── src/
│   ├── app/
│   │   ├── features/           # Feature modules
│   │   │   ├── dashboard/      # Server overview & stats
│   │   │   ├── players/        # Player management
│   │   │   ├── logs/           # Log viewing
│   │   │   └── settings/       # Comprehensive server configuration
│   │   ├── services/           # API & data services
│   │   └── app.component.*     # Root component
│   ├── environments/           # Environment configs
│   ├── assets/                 # Static assets
│   └── styles.scss             # Global styles
├── package.json
└── README.md
```

## Key Features by Module

### Dashboard
- **Server Status** - Online/offline indicator with uptime
- **Player Count** - Current vs maximum players with progress bar
- **Performance Metrics** - Real-time server performance data
- **Quick Stats** - Map, version, and key server information

### Players
- **Player List** - All connected players with details
- **Player Actions** - Kick, ban, and manage players
- **Connection Info** - IP addresses, ping, playtime
- **Status Indicators** - Online/offline status with badges

### Logs
- **Real-time Logs** - Live server log streaming
- **Terminal Style** - Classic console appearance
- **Auto-refresh** - Automatic log updates
- **Scrollable History** - Browse through log history

### Settings - Comprehensive Configuration
The settings module provides complete DayZ server configuration across **5 major categories**:

#### **1. Basic Settings**
- **Server Information**
  - Server name and branding
  - Maximum player capacity (1-100)
  - Server and admin passwords
  - Instance ID for multi-server setups

- **Time Configuration**
  - Time acceleration multipliers
  - Night time acceleration (separate control)
  - Persistent time (continues when offline)
  - Server time source configuration

- **Login Management**
  - Concurrent login limit
  - Maximum queue size
  - Login queue optimization

#### **2. Security & Anti-Cheat**
- **Signature Verification**
  - Addon signature verification levels
  - Force same build requirements
  - Client version enforcement

- **Voice Communication**
  - Voice over network controls
  - Codec quality settings (8kHz/16kHz/32kHz)
  - Voice chat disable options

- **Gameplay Restrictions**
  - 3rd person view control
  - Crosshair visibility settings
  - Personal light restrictions
  - Enhanced lighting configuration

- **Access Control**
  - Whitelist functionality
  - Player verification requirements

#### **3. Performance & System**
- **CPU & Memory**
  - CPU core allocation (1-32 cores)
  - Memory allocator selection (system/tbb4malloc_bi/tcmalloc/jemalloc)
  - Hyper-threading control
  - FPS limiting (30-300 FPS)

- **Debugging & Logging**
  - Script debugging controls
  - Admin action logging
  - Network event logging
  - Freeze detection monitoring

- **Storage Management**
  - Auto-fix storage issues
  - Data integrity monitoring

#### **4. Gameplay & Connection**
- **Message of the Day (MOTD)**
  - Multiple MOTD lines support
  - Configurable display intervals
  - Dynamic message management

- **Connection Limits**
  - Maximum ping thresholds (50-1000ms)
  - Desync tolerance (50-500ms)
  - Packet loss limits (10-100%)
  - Automatic player kicking for violations

- **Log Configuration**
  - Timestamp format options (none/short/full)
  - Log rotation settings

#### **5. Mods Management**
- **Client Mods**
  - Workshop ID support (10-digit Steam IDs)
  - Local mod support (@ModName format)
  - Load order management
  - Dynamic mod addition/removal

- **Server Mods**
  - Server-side only modifications
  - Independent from client requirements
  - Separate configuration management

- **Mod Configuration Features**
  - Validation for Workshop IDs and mod names
  - Visual feedback for invalid entries
  - Helpful configuration tips and examples
  - Support for both numerical and named mod formats

### Settings Interface Features
- **Tabbed Navigation** - Organized into logical categories with icons
- **Real-time Validation** - Instant feedback on form inputs
- **Mock Data Support** - Pre-configured realistic test data
- **Form Persistence** - Automatic saving and loading
- **Responsive Design** - Works on all screen sizes
- **Visual Feedback** - Clear success/error messages
- **Professional Styling** - Modern Bootstrap 5 interface

## API Integration

The UI automatically detects the environment and switches between:

- **Mock Mode** (`environment.mockMode: true`)
  - Uses simulated data from `ApiService`
  - No network requests
  - Safe for development
  - Includes realistic DayZ server configuration

- **Live Mode** (`environment.mockMode: false`)
  - Connects to backend API at `environment.apiUrl`
  - Real-time data from DayZ server
  - Full functionality with actual server management

## Styling & Theming

- **Bootstrap 5** - Modern component framework with tabbed navigation
- **Bootstrap Icons** - Professional icon set for UI elements
- **Custom CSS Variables** - Easy color customization
- **Responsive Grid** - Mobile-first design with collapsible tabs
- **Dark/Light Support** - Professional color scheme
- **Custom Components** - Consistent design language throughout

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Commands
```bash
npm start              # Development server (mock mode)
npm run build          # Development build
npm run build:prod     # Production build
npm run test           # Run tests
npm run lint           # Lint code
```

### Environment Configuration
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  mockMode: true  // Toggle mock mode
};
```

## Mock Data

The UI includes comprehensive mock data for development:

- **Server Info** - Status, player count, uptime, version
- **Player Data** - Realistic player profiles with activity
- **Log Entries** - Sample server logs with timestamps
- **Settings** - Complete DayZ server configuration with:
  - Realistic server parameters
  - Popular mod configurations (CF MOD, Community-Online-Tools)
  - Performance optimization settings
  - Security configuration examples

## Configuration Examples

### Popular DayZ Mods (Mock Data)
- **1565871491** - CF MOD (Community Framework)
- **1559212036** - Community-Online-Tools
- **1646187754** - Trader
- **1797720064** - BuildAnywhere

### Server Performance Settings
- **Memory Allocator**: `tbb4malloc_bi` (recommended for performance)
- **CPU Cores**: Auto-detected with manual override
- **FPS Limit**: 200 FPS (balanced performance)
- **Time Acceleration**: 2x day, 8x night (popular configuration)

### Security Recommendations
- **Verify Signatures**: Level 2 (with verification on join)
- **Force Same Build**: Enabled
- **Voice Codec**: Standard 16kHz quality
- **Connection Limits**: 150ms ping, 150ms desync tolerance

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly in mock mode
5. Submit a pull request

## License

GPL-3.0 License - see [LICENSE](../LICENSE) file for details.

## Support

For issues and questions:
- [GitHub Issues](https://github.com/GTVolk/DayZ-ServerManager/issues)
- [Documentation](https://github.com/GTVolk/DayZ-ServerManager)

---

Built with ❤️ for the DayZ community 