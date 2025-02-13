# Fitness Journey App

A mobile fitness application built with Apache Cordova that helps users track their fitness journey, set goals, and maintain a healthy lifestyle.

## Prerequisites

Before setting up the project, ensure you have the following installed:

1. Node.js and npm (Latest LTS version)
2. Java Development Kit (JDK) 17
   ```bash
   brew install openjdk@17
   ```
3. Android Studio with:
   - Android SDK
   - Android Platform Tools
   - Android Build Tools (version 34.0.0)
4. Apache Cordova
   ```bash
   npm install -g cordova
   ```

## Environment Setup

1. Set up JAVA_HOME:
   ```bash
   echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
   ```

2. Set up Android environment variables:
   ```bash
   echo 'export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   export PATH=$PATH:$ANDROID_HOME/tools
   export PATH=$PATH:$ANDROID_HOME/tools/bin
   export PATH=$PATH:$ANDROID_HOME/build-tools' >> ~/.zshrc
   ```

3. Apply the changes:
   ```bash
   source ~/.zshrc
   ```

## Project Setup

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd FitnessJourney
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Add Android platform:
   ```bash
   cordova platform add android
   ```

4. Build the project:
   ```bash
   cordova build android
   ```

## Running the App

1. Start an Android emulator or connect a physical device

2. Run the app:
   ```bash
   cordova run android
   ```

## Authentication Setup

The app uses Firebase Authentication with the following methods:
- Email/Password authentication
- Google Sign-In

### Firebase Setup

1. Create a Firebase project:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select an existing one
   - Enable Authentication and select the authentication methods (Email/Password and Google)

2. Add Android app to Firebase:
   - In Firebase Console, click "Add app" and select Android
   - Use package name: `com.fitnessjourney.app`
   - Download `google-services.json`
   - Place `google-services.json` in the root directory of your project

3. Configure Google Sign-In:
   - In Firebase Console, go to Authentication > Sign-in method
   - Enable Google Sign-in
   - Add your SHA-1 fingerprint (get it using `keytool -list -v -keystore ~/.android/debug.keystore -alias androiddebugkey -storepass android -keypass android`)

4. Install Firebase plugin:
   ```bash
   cordova plugin add cordova-plugin-firebasex
   ```

### Google Services JSON Template

Create a `google-services.json` file in your project root with the following template structure:

```json
{
  "project_info": {
    "project_number": "YOUR_PROJECT_NUMBER",
    "project_id": "YOUR_PROJECT_ID",
    "storage_bucket": "YOUR_PROJECT_ID.appspot.com"
  },
  "client": [
    {
      "client_info": {
        "mobilesdk_app_id": "1:YOUR_PROJECT_NUMBER:android:YOUR_APP_ID",
        "android_client_info": {
          "package_name": "com.fitnessjourney.app"
        }
      },
      "oauth_client": [
        {
          "client_id": "YOUR_CLIENT_ID.apps.googleusercontent.com",
          "client_type": 3
        }
      ],
      "api_key": [
        {
          "current_key": "YOUR_API_KEY"
        }
      ],
      "services": {
        "appinvite_service": {
          "other_platform_oauth_client": []
        }
      }
    }
  ],
  "configuration_version": "1"
}
```

Replace the following placeholders with your Firebase project details:
- `YOUR_PROJECT_NUMBER`: Your Firebase project number
- `YOUR_PROJECT_ID`: Your Firebase project ID
- `YOUR_APP_ID`: Your Android app ID
- `YOUR_CLIENT_ID`: Your OAuth 2.0 client ID
- `YOUR_API_KEY`: Your Firebase API key

**Important**: Never commit the actual `google-services.json` file with real credentials to version control. Add it to your `.gitignore` file.

## Development

### Making Changes

To modify the app:
1. Edit files in the `www` directory
2. Run `cordova build android` to build
3. Run `cordova run android` to test changes

### Development Workflow

There are several ways to refresh your app during development:

1. **Full Rebuild (Most Reliable)**
   ```bash
   cordova build android && cordova run android
   ```
   This completely rebuilds and reinstalls the app. Use this when:
   - Modifying native code or plugins
   - Changing configuration files
   - Adding new plugins
   - Updating `config.xml`

2. **Live Reload (During Development)**
   ```bash
   cordova run android --live-reload
   ```
   This enables live-reload functionality, automatically refreshing the app when you make changes to:
   - HTML files
   - CSS files
   - JavaScript files
   Note: Live reload requires a working network connection between your development machine and the device/emulator.

3. **Manual Refresh**
   - If live-reload is not working, you can manually refresh by:
     1. In the running app, press and hold the device's back button
     2. Select "Refresh" from the menu
     - Or, in the emulator:
       1. Press `Ctrl + M` (Windows/Linux) or `Cmd + M` (macOS)
       2. Select "Refresh"

### When to Use Each Method

- Use **Full Rebuild** when:
  - Making changes to native code or configuration
  - Adding/removing plugins
  - Changes aren't showing up with live-reload
  - Getting unexpected behavior

- Use **Live Reload** when:
  - Making UI changes (HTML/CSS)
  - Modifying JavaScript logic
  - During active development

- Use **Manual Refresh** when:
  - Live-reload is not set up
  - Making quick UI changes
  - Testing small modifications

**Note**: If you're experiencing caching issues, you can try clearing the app data:
1. Go to Android Settings > Apps
2. Find your app
3. Storage & Cache > Clear Cache

## Troubleshooting

If you encounter any issues:

1. Ensure all environment variables are set correctly:
   ```bash
   echo $JAVA_HOME
   echo $ANDROID_HOME
   ```

2. Verify Android SDK tools are installed:
   ```bash
   $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager --list
   ```

3. Check connected devices:
   ```bash
   adb devices
   ```
