export default async function ({ addon, msg, console }) {
  const ScratchBlocks = await addon.tab.ScratchBlocks;
  const vm = addon.tab.vm;

  // Extension class
  class RunStopBlocks {
    constructor(runtime) {
      this.runtime = runtime;
    }

    getInfo() {
      return {
        id: 'penguin_runStop',
        name: 'Run Stop',
        blocks: [
          {
            opcode: 'runStop',
            blockType: ScratchBlocks.BlockType.COMMAND,
            text: 'run [STOP_LABEL]',
            arguments: {
              STOP_LABEL: {
                type: ScratchBlocks.ArgumentType.STRING,
                defaultValue: 'stop'
              }
            }
          }
        ],
        menus: {}
      };
    }

    runStop() {
      this.runtime.stopAll();
    }
  }

  // Register the extension
  vm.extensionManager.registerExtension(new RunStopBlocks(vm.runtime));
}
