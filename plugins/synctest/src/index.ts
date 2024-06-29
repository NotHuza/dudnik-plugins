import AsyncStorage from '@react-native-async-storage/async-storage';
import { createFileBackend, createMMKVBackend } from "@vendetta/storage";
import { plugins } from "@vendetta/plugins";
import { themes } from "@vendetta/themes";

export async function grabEverything() {
  const sync = {
    themes: [],
    plugins: [],
  };

  for (const x of Object.values(plugins)) {
    const config = vstorage.pluginSettings?.[x.id];
    if (config?.syncPlugin === false) continue;

    const options =
      config?.syncStorage === false
        ? {}
        : ((await createMMKVBackend(x.id).get()) as any);
    sync.plugins.push({
      id: x.id,
      enabled: x.enabled,
      options,
    });
  }
  for (const x of Object.values(themes)) {
    sync.themes.push({
      id: x.id,
      enabled: x.selected,
    });
  }

  return sync;
}

export async function importData(save) {
  if (!save) return;

  const iplugins = [
    ...save.sync.plugins.filter(
      (x) =>
        !plugins[x.id] &&
        canImport(x.id) &&
        options.unproxiedPlugins
    ),
    ...save.sync.plugins.filter(
      (x) =>
        !plugins[x.id] &&
        canImport(x.id) &&
        options.plugins
    ),
  ];
  const ithemes = save.sync.themes.filter(
    (x) => !themes[x.id] && options.themes
  );

  if (!iplugins[0] && !ithemes[0]) {
    return; // Nothing to import
  }

  const status = { plugins: 0, themes: 0, failed: 0 };
  await Promise.all([
    ...iplugins.map(
      async (x) => {
        try {
          await AsyncStorage.setItem(x.id, JSON.stringify(x.options));
          status.plugins++;
        } catch (e) {
          status.failed++;
        }
      }
    ),
    ...ithemes.map(
      async (x) => {
        try {
          status.themes++;
        } catch (e) {
          status.failed++;
        }
      }
    ),
  ]);

  const selectTheme = themes[ithemes.find((x) => x.enabled)?.id];
  if (selectTheme) {
    await createFileBackend("vendetta_theme.json").set(
      Object.assign(selectTheme, {
        selected: true,
      })
    );

    // Perform any additional actions in the background
  }

  // Log the import status or perform other background tasks
  console.log(
    `Finished! Imported ${status.plugins} plugins and ${status.themes} themes. ${status.failed ? `Failed to import ${status.failed} plugins/themes` : "All imports were successful"}`
  );
}
