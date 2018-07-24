// This is main process of Electron, started as first thing when your
// app starts. It runs through entire life of your application.
// It doesn't have any windows which you can see on screen, but we can open
// window from here.

import path from "path";
import url from "url";
import { app, Menu } from "electron";
import createMenu from "./menu/edit_menu_template";
import createWindow from "./helpers/window";

// Special module holding environment variables which you declared
// in config/env_xxx.json file.
import env from "env";

const setApplicationMenu = (simpleCalculatorWindow, scientificCalculatorWindow) => {
  const menu = createMenu({
    openSimpleCalculator: () => {
      scientificCalculatorWindow.hide();
      simpleCalculatorWindow.show();
    },
    openScientificCalculator: () => {
      simpleCalculatorWindow.hide();
      scientificCalculatorWindow.show();
    }
  })
  const menus = [menu];

  Menu.setApplicationMenu(Menu.buildFromTemplate(menus));
};

// Save userData in separate folders for each environment.
// Thanks to this you can use production and development versions of the app
// on same machine like those are two separate apps.
if (env.name !== "production") {
  const userDataPath = app.getPath("userData");
  app.setPath("userData", `${userDataPath} (${env.name})`);
}

app.on("ready", () => {
  
  const simpleCalculatorWindow = createWindow("simple", {
    width: 550,
    height: 550,
    webPreferences: {
      nativeWindowOpen: true
    },
    icon: path.join(__dirname, '.icons/Calculator_5122x.png')
  });
  
  const scientificCalculatorWindow = createWindow("scientififc", {
    width: 550,
    height: 550,
    webPreferences: {
      nativeWindowOpen: true
    },
    icon: path.join(__dirname, '/icons/Calculator_5122x.png')
  });
  setApplicationMenu(simpleCalculatorWindow, scientificCalculatorWindow);

  simpleCalculatorWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "simpleCalculator.html"),
      protocol: "file:",
      slashes: true
    })
  );
  scientificCalculatorWindow.hide();
  if (env.name === "development") {
    simpleCalculatorWindow.openDevTools();
  }
  // scientific calculator window


  scientificCalculatorWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "scientificCalculator.html"),
      protocol: "file:",
      slashes: true
    })
  );

  if (env.name === "development") {
    scientificCalculatorWindow.openDevTools();
  }
});

app.on("window-all-closed", () => {
  app.quit();
});
