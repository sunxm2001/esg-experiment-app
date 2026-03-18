/**
 * Router service for handling navigation between views
 */
export class Router {
    constructor() {
        this.routes = {};
        this.currentRoute = null;
        this.app = null;
        this.history = [];
    }

    /**
     * Initialize router
     */
    init(app) {
        this.app = app;
        this.setupRoutes();
        this.setupEventListeners();
        this.handleInitialRoute();
    }

    /**
     * Define all application routes
     */
    setupRoutes() {
        this.routes = {
            'welcome': {
                title: 'Welcome - ESG Experiment',
                view: 'welcome',
                showHeader: false,
                showProgress: false
            },
            'registration': {
                title: 'Registration - ESG Experiment',
                view: 'registration',
                showHeader: true,
                showProgress: true
            },
            'news': {
                title: 'News Reading - ESG Experiment',
                view: 'news',
                showHeader: true,
                showProgress: true
            },
            'prediction': {
                title: 'Prediction & Trading - ESG Experiment',
                view: 'prediction',
                showHeader: true,
                showProgress: true
            },
            'posttest': {
                title: 'Post-Experiment Evaluation - ESG Experiment',
                view: 'posttest',
                showHeader: true,
                showProgress: true
            },
            'completion': {
                title: 'Experiment Complete - ESG Experiment',
                view: 'completion',
                showHeader: true,
                showProgress: true
            },
            'completed': {
                title: 'Thank You - ESG Experiment',
                view: 'completed',
                showHeader: true,
                showProgress: false
            },
            'error': {
                title: 'Error - ESG Experiment',
                view: 'error',
                showHeader: false,
                showProgress: false
            }
        };
    }

    /**
     * Set up event listeners for navigation
     */
    setupEventListeners() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (event) => {
            this.handlePopState(event);
        });

        // Handle internal navigation clicks
        document.addEventListener('click', (event) => {
            const link = event.target.closest('[data-route]');
            if (link) {
                event.preventDefault();
                const route = link.getAttribute('data-route');
                this.navigate(route);
            }
        });
    }

    /**
     * Handle initial route based on current state
     */
    handleInitialRoute() {
        const path = window.location.pathname;
        let route = 'welcome';

        // Extract route from URL hash if present
        if (window.location.hash) {
            const hash = window.location.hash.replace('#', '');
            if (this.routes[hash]) {
                route = hash;
            }
        }

        // Override with app state if user is logged in
        if (this.app && this.app.isLoggedIn()) {
            route = this.app.getCurrentStage();
        }

        this.navigate(route, { replace: true });
    }

    /**
     * Handle browser popstate event (back/forward buttons)
     */
    handlePopState(event) {
        if (event.state && event.state.route) {
            this.loadRoute(event.state.route, { updateHistory: false });
        }
    }

    /**
     * Navigate to a route
     */
    navigate(route, options = {}) {
        if (!this.routes[route]) {
            console.warn(`Route not found: ${route}`);
            route = 'error';
        }

        if (this.currentRoute === route) {
            return; // Already on this route
        }

        // Check if user is authorized for this route
        if (!this.isRouteAuthorized(route)) {
            console.warn(`User not authorized for route: ${route}`);
            this.navigate('welcome');
            return;
        }

        // Update browser history
        if (options.updateHistory !== false) {
            const historyMethod = options.replace ? 'replaceState' : 'pushState';
            window.history[historyMethod](
                { route },
                this.routes[route].title,
                `#${route}`
            );

            if (!options.replace) {
                this.history.push(route);
            }
        }

        // Load the route
        this.loadRoute(route);
    }

    /**
     * Check if user is authorized for a route
     */
    isRouteAuthorized(route) {
        const user = this.app ? this.app.getCurrentUser() : null;

        switch (route) {
            case 'welcome':
                return true; // Always accessible
            case 'registration':
                return !user || !user.completed_pretest;
            case 'news':
                return user && user.completed_pretest && !user.completed_news;
            case 'prediction':
                return user && user.completed_news && !user.completed_prediction;
            case 'posttest':
                return user && user.completed_prediction && !user.completed_posttest;
            case 'completion':
                return user && user.completed_posttest && !user.completed_all;
            case 'completed':
                return user && user.completed_all;
            case 'error':
                return true; // Always accessible
            default:
                return false;
        }
    }

    /**
     * Load a route and update the UI
     */
    async loadRoute(route) {
        console.log(`Loading route: ${route}`);

        this.currentRoute = route;
        const routeConfig = this.routes[route];

        // Update document title
        document.title = routeConfig.title;

        // Update app state if needed
        if (this.app && route !== this.app.getCurrentStage()) {
            this.app.currentStage = route;
        }

        // Render the route
        if (this.app && this.app.ui) {
            await this.app.ui.renderView(route);
        }

        // Scroll to top
        window.scrollTo(0, 0);

        // Dispatch route change event
        this.dispatchRouteChange(route);
    }

    /**
     * Dispatch route change event for other components
     */
    dispatchRouteChange(route) {
        const event = new CustomEvent('routechange', {
            detail: { route, config: this.routes[route] }
        });
        document.dispatchEvent(event);
    }

    /**
     * Go back to previous route
     */
    goBack() {
        if (this.history.length > 1) {
            this.history.pop(); // Remove current route
            const previousRoute = this.history.pop(); // Get previous route
            if (previousRoute) {
                this.navigate(previousRoute, { replace: true });
            }
        } else {
            this.navigate('welcome', { replace: true });
        }
    }

    /**
     * Get current route configuration
     */
    getCurrentRoute() {
        return this.routes[this.currentRoute];
    }

    /**
     * Check if current route requires authentication
     */
    requiresAuth() {
        const currentRoute = this.getCurrentRoute();
        return currentRoute && currentRoute.view !== 'welcome' && currentRoute.view !== 'error';
    }

    /**
     * Get route for a specific experiment stage
     */
    getRouteForStage(stage) {
        const stageMap = {
            'welcome': 'welcome',
            'registration': 'registration',
            'news': 'news',
            'prediction': 'prediction',
            'posttest': 'posttest',
            'completion': 'completion',
            'completed': 'completed'
        };

        return stageMap[stage] || 'welcome';
    }

    /**
     * Navigate to next logical stage based on user progress
     */
    navigateToNextStage() {
        if (!this.app) return;

        const user = this.app.getCurrentUser();
        if (!user) {
            this.navigate('registration');
            return;
        }

        const stage = this.app.determineCurrentStage(user);
        this.navigate(stage);
    }
}