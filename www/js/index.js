document.addEventListener('deviceready', onDeviceReady, false);

function onDeviceReady() {
    // App is ready to use!
    console.log('Running cordova-' + cordova.platformId + '@' + cordova.version);
    
    // Add event listeners after device is ready
    document.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = link.getAttribute('href');
        });
    });
}

// Add this to handle back button
document.addEventListener('backbutton', onBackKeyDown, false);

function onBackKeyDown() {
    if (window.location.href.endsWith('index.html') || window.location.href.endsWith('/www/')) {
        navigator.app.exitApp();
    } else {
        window.history.back();
    }
} 