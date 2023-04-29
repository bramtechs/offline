import { app, BrowserWindow } from "electron";

const createWindow = () => {
    const win = new BrowserWindow({
        width: 600,
        height: 300,
        resizable: false,
        title: "Offline",
        autoHideMenuBar: true,
    });

    win.loadFile("www/index.html");
};

app.whenReady().then(() => {
    createWindow();
    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
