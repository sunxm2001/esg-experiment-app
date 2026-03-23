/**
 * Device detection service
 * Detects device type, platform, screen resolution, and other device information
 */

export class DeviceDetector {
  /**
   * Get comprehensive device information
   * @returns {Object} Device information object
   */
  static getDeviceInfo() {
    const userAgent = navigator.userAgent || '';
    const platform = navigator.platform || '';
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;

    // Device type detection
    const isMobile = /iPhone|iPad|iPod|Android|webOS|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    const isTablet = /iPad|Tablet|Android(?!.*Mobile)/i.test(userAgent) ||
                     (isMobile && screenWidth >= 768 && screenWidth <= 1024);
    const isDesktop = !isMobile && !isTablet;

    let deviceType = 'desktop';
    if (isMobile) deviceType = 'mobile';
    if (isTablet) deviceType = 'tablet';

    // Platform detection
    let devicePlatform = 'unknown';
    if (/Windows/i.test(platform)) devicePlatform = 'Windows';
    else if (/Mac/i.test(platform)) devicePlatform = 'macOS';
    else if (/Linux/i.test(platform)) devicePlatform = 'Linux';
    else if (/iPhone|iPad|iPod/i.test(userAgent)) devicePlatform = 'iOS';
    else if (/Android/i.test(userAgent)) devicePlatform = 'Android';

    // Browser detection
    let browser = 'unknown';
    if (/Chrome/i.test(userAgent) && !/Edg/i.test(userAgent)) browser = 'Chrome';
    else if (/Firefox/i.test(userAgent)) browser = 'Firefox';
    else if (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)) browser = 'Safari';
    else if (/Edg/i.test(userAgent)) browser = 'Edge';
    else if (/MSIE|Trident/i.test(userAgent)) browser = 'Internet Explorer';

    // Operating system detection (more detailed)
    let os = 'unknown';
    if (/Windows NT 10/i.test(userAgent)) os = 'Windows 10';
    else if (/Windows NT 6.3/i.test(userAgent)) os = 'Windows 8.1';
    else if (/Windows NT 6.2/i.test(userAgent)) os = 'Windows 8';
    else if (/Windows NT 6.1/i.test(userAgent)) os = 'Windows 7';
    else if (/Mac OS X (\d+)[._](\d+)/i.test(userAgent)) {
      const match = userAgent.match(/Mac OS X (\d+)[._](\d+)/);
      os = `macOS ${match[1]}.${match[2]}`;
    } else if (/Android (\d+)/i.test(userAgent)) {
      const match = userAgent.match(/Android (\d+)/);
      os = `Android ${match[1]}`;
    } else if (/iPhone OS (\d+)/i.test(userAgent)) {
      const match = userAgent.match(/iPhone OS (\d+)/);
      os = `iOS ${match[1]}`;
    } else if (/Linux/i.test(userAgent)) os = 'Linux';

    // Touch screen detection
    const hasTouchScreen = 'ontouchstart' in window ||
                           navigator.maxTouchPoints > 0 ||
                           navigator.msMaxTouchPoints > 0;

    // Language preference
    const language = navigator.language || navigator.userLanguage || 'en';
    const languageCode = language.split('-')[0]; // Get base language code (e.g., 'en' from 'en-US')

    // Connection information
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    let connectionType = 'unknown';
    let effectiveType = 'unknown';

    if (connection) {
      connectionType = connection.type || 'unknown';
      effectiveType = connection.effectiveType || 'unknown';
    }

    // Timezone
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

    // Pixel ratio (for high-DPI screens)
    const pixelRatio = window.devicePixelRatio || 1;

    // Viewport dimensions
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Orientation
    const orientation = screenWidth > screenHeight ? 'landscape' : 'portrait';

    return {
      // Basic device info
      device_type: deviceType,
      device_platform: devicePlatform,
      user_agent: userAgent.substring(0, 500), // Limit length for database storage

      // Screen information
      screen_width: screenWidth,
      screen_height: screenHeight,
      viewport_width: viewportWidth,
      viewport_height: viewportHeight,
      pixel_ratio: pixelRatio,
      orientation: orientation,

      // Software info
      browser: browser,
      operating_system: os,
      language: languageCode,
      timezone: timezone,

      // Capabilities
      has_touch_screen: hasTouchScreen,
      max_touch_points: navigator.maxTouchPoints || 0,

      // Connection info
      connection_type: connectionType,
      connection_effective_type: effectiveType,
      connection_downlink: connection ? connection.downlink : null,
      connection_rtt: connection ? connection.rtt : null,

      // Timestamp
      detected_at: new Date().toISOString(),

      // Additional metadata
      is_retina: pixelRatio > 1,
      is_mobile_device: isMobile,
      is_tablet_device: isTablet,
      is_desktop_device: isDesktop,
      supports_local_storage: typeof localStorage !== 'undefined',
      supports_session_storage: typeof sessionStorage !== 'undefined',
      supports_cookies: navigator.cookieEnabled,
      supports_geolocation: 'geolocation' in navigator,
      supports_notifications: 'Notification' in window,
      supports_web_workers: typeof Worker !== 'undefined'
    };
  }

  /**
   * Get simplified device info for registration (only essential fields)
   * @returns {Object} Simplified device info
   */
  static getSimplifiedDeviceInfo() {
    const fullInfo = this.getDeviceInfo();

    return {
      device_type: fullInfo.device_type,
      device_platform: fullInfo.device_platform,
      user_agent: fullInfo.user_agent,
      screen_width: fullInfo.screen_width,
      screen_height: fullInfo.screen_height,
      language: fullInfo.language,
      browser: fullInfo.browser,
      operating_system: fullInfo.operating_system
    };
  }

  /**
   * Get device type classification
   * @returns {string} 'mobile', 'tablet', or 'desktop'
   */
  static getDeviceType() {
    const info = this.getDeviceInfo();
    return info.device_type;
  }

  /**
   * Check if device is mobile
   * @returns {boolean} True if mobile device
   */
  static isMobile() {
    return this.getDeviceType() === 'mobile';
  }

  /**
   * Check if device is tablet
   * @returns {boolean} True if tablet device
   */
  static isTablet() {
    return this.getDeviceType() === 'tablet';
  }

  /**
   * Check if device is desktop
   * @returns {boolean} True if desktop device
   */
  static isDesktop() {
    return this.getDeviceType() === 'desktop';
  }

  /**
   * Get platform (iOS, Android, Windows, macOS, Linux)
   * @returns {string} Platform name
   */
  static getPlatform() {
    const info = this.getDeviceInfo();
    return info.device_platform;
  }

  /**
   * Check if platform is iOS
   * @returns {boolean} True if iOS
   */
  static isIOS() {
    return this.getPlatform() === 'iOS';
  }

  /**
   * Check if platform is Android
   * @returns {boolean} True if Android
   */
  static isAndroid() {
    return this.getPlatform() === 'Android';
  }

  /**
   * Check if platform is macOS
   * @returns {boolean} True if macOS
   */
  static isMacOS() {
    return this.getPlatform() === 'macOS';
  }

  /**
   * Check if platform is Windows
   * @returns {boolean} True if Windows
   */
  static isWindows() {
    return this.getPlatform() === 'Windows';
  }

  /**
   * Get screen resolution as string (e.g., "1920x1080")
   * @returns {string} Screen resolution
   */
  static getScreenResolution() {
    const info = this.getDeviceInfo();
    return `${info.screen_width}x${info.screen_height}`;
  }

  /**
   * Get viewport size as string
   * @returns {string} Viewport size
   */
  static getViewportSize() {
    const info = this.getDeviceInfo();
    return `${info.viewport_width}x${info.viewport_height}`;
  }
}

// Export singleton instance
export const deviceDetector = new DeviceDetector();