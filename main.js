const { app, BrowserWindow, dialog } = require('electron');
const { autoUpdater } = require('electron-updater'); // Import auto-updater
const url = require('url');
const path = require('path');

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    title: 'Electron',
    width: 1000,
    height: 600,
  });

  // Load your application
  mainWindow.loadURL('https://electron-eye.vercel.app/');

  // Auto-Updater events
  autoUpdater.on('update-available', () => {
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: 'A new update is available. Downloading now...',
    });
  });

  autoUpdater.on('update-downloaded', () => {
    dialog
      .showMessageBox({
        type: 'info',
        title: 'Update Ready',
        message:
          'A new version has been downloaded. Restart the application to apply the update.',
        buttons: ['Restart', 'Later'],
      })
      .then((result) => {
        if (result.response === 0) {
          // 'Restart' button clicked
          autoUpdater.quitAndInstall(); // Installs and restarts the app
        }
      });
  });

  autoUpdater.on('error', (error) => {
    dialog.showMessageBox({
      type: 'error',
      title: 'Update Error',
      message: `Error during update: ${error}`,
    });
  });
}

// Ensure app is ready before creating the main window
app.whenReady().then(createMainWindow);

// Start checking for updates
app.on('ready', () => {
  autoUpdater.checkForUpdatesAndNotify();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
