export default async function ({addon, console}) {
  const vm = addon.tab.traps.vm;

  // Wait for ScratchBlocks to be loaded
  let ScratchBlocks = window.ScratchBlocks;
  let attempts = 0;
  while (!ScratchBlocks && attempts < 50) {
    await new Promise(resolve => setTimeout(resolve, 100));
    ScratchBlocks = window.ScratchBlocks;
    attempts++;
  }

  if (!ScratchBlocks) {
    console.error('ScratchBlocks not loaded');
    return;
  }

  // Monkey-patch to add run stop block to the toolbox
  const originalGetXML = vm.runtime.getToolboxXML ? vm.runtime.getToolboxXML.bind(vm.runtime) : null;
  
  // Listen for when toolbox needs to be updated
  addon.tab.blockly.workspace.toolbox_ && addon.tab.blockly.workspace.toolbox_.populate_(addon.tab.blockly.workspace.options.languageTree);

  // Create extension that provides the "run stop" block
  class PenguinRunStop {
    getInfo() {
      return {
        id: 'penguin_runStop',
        name: 'Run Stop',
        blocks: [
          {
            opcode: 'stopScript',
            blockType: ScratchBlocks.BlockType.COMMAND,
            text: 'run [STOP]',
            arguments: {
              STOP: {
                type: ScratchBlocks.ArgumentType.STRING,
                defaultValue: 'stop'
              }
            }
          }
        ]
      };
    }

    stopScript() {
      vm.runtime.stopAll();
    }
  }

  // Register the extension
  if (!vm.extensionManager.isExtensionLoaded('penguin_runStop')) {
    vm.extensionManager.registerExtension(new PenguinRunStop());
  }
}
