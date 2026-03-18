# ESG Experiment Frontend

Modern frontend application for the ESG Narrative Spillover experiment.

## Features

- **Welcome Screen**: Experiment overview and consent information
- **Registration**: Demographic data collection with risk and ESG preference assessments
- **News Reading**: Time-limited article reading with attention tracking
- **Prediction & Trading**: Financial predictions and virtual capital allocation
- **Post-Experiment Evaluation**: Cognitive spillover, emotional state, and manipulation checks
- **Completion**: Performance calculation and payment processing

## Technology

- **Vanilla JavaScript ES6 Modules**: No build tools required
- **Modern CSS**: CSS variables, flexbox, grid layout
- **LocalStorage API**: Offline data persistence
- **Fetch API**: RESTful API communication
- **Responsive Design**: Works on desktop and mobile devices

## Quick Start

### Option 1: Simple HTTP Server

1. **Install a simple HTTP server** (if needed):
   ```bash
   # Using Python
   python3 -m http.server 3000

   # Or using Node.js (if installed)
   npx serve -s . -p 3000
   ```

2. **Open in browser**:
   ```
   http://localhost:3000
   ```

### Option 2: Direct File Access

1. **Open `public/index.html`** directly in a modern browser
2. **Enable CORS exceptions** if needed (for API calls to localhost:5000)

## Project Structure

```
frontend/
├── public/
│   ├── index.html          # Main HTML file
│   └── styles.css          # Global styles
├── src/
│   ├── app.js              # Main application class
│   ├── index.js            # Application entry point
│   ├── services/           # Business logic
│   │   ├── api.js          # API communication
│   │   ├── state.js        # Local storage management
│   │   └── router.js       # Client-side routing
│   └── ui/                 # User interface
│       ├── ui.js           # UI manager
│       └── views/          # All application views
│           ├── welcome.js      # Welcome screen
│           ├── registration.js # Registration form
│           ├── news.js         # News reading task
│           ├── prediction.js   # Prediction & trading
│           ├── posttest.js     # Post-experiment evaluation
│           ├── completion.js   # Completion & payment
│           ├── completed.js    # Final thank you
│           └── error.js        # Error handling
└── package.json            # Project metadata
```

## Development

### Adding New Views

1. Create a new view class in `src/ui/views/`
2. Implement `render()` and `init()` methods
3. Register the view in `src/ui/ui.js`
4. Add route configuration in `src/services/router.js`

### Styling

- Use CSS variables defined in `public/styles.css`
- Follow BEM-like naming conventions
- Ensure responsive design for mobile devices

### API Integration

- All API calls go through `src/services/api.js`
- Error handling is centralized in the API service
- Loading states are managed by the UI manager

## Browser Support

- Chrome 60+
- Firefox 55+
- Safari 11+
- Edge 79+

## Notes

- The application uses modern JavaScript features (ES6+)
- No polyfills are included - modern browsers required
- LocalStorage is used for data persistence
- Service workers could be added for offline capability

## Backend Integration

Ensure the backend server is running at `http://localhost:5000` with:
- CORS enabled for `http://localhost:3000`
- PostgreSQL database initialized
- News articles loaded in the database

## Testing

Open the browser console to see:
- Application initialization logs
- API request/response logs
- Error messages for debugging