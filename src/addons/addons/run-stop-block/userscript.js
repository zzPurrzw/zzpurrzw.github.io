export default async function ({addon, console}) {
  const vm = addon.tab.traps.vm;

  // Define a Scratch extension that provides the pm_run_stop functionality
  class RunStopExtension {
    static get EXTENSION_ID() {
      return 'pm_runStop';
    }

    static get BLOCKS() {
      return [
        {
          opcode: 'pm_run_stop',
          blockType: 'command',
          text: 'run [STOP_LABEL]',
          arguments: {
            STOP_LABEL: {
              type: 'string',
              defaultValue: 'stop'
            }
          }
        }
      ];
    }

    getInfo() {
      return {
        id: RunStopExtension.EXTENSION_ID,
        name: 'Run Stop Block',
        blocks: RunStopExtension.BLOCKS,
        menus: {}
      };
    }

    pm_run_stop() {
      // Stop all scripts when this block runs
      vm.runtime.stopAll();
    }
  }

  // Register the extension if not already loaded
  try {
    if (!vm.extensionManager.isExtensionLoaded(RunStopExtension.EXTENSION_ID)) {
      vm.extensionManager.registerExtension(new RunStopExtension());
    }
  } catch (e) {
    console.log('Could not register run-stop extension:', e);
  }
}
