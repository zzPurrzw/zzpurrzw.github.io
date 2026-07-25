import LazyScratchBlocks from './tw-lazy-scratch-blocks';

/**
 * Connect scratch blocks with the vm
 * @param {VirtualMachine} vm - The scratch vm
 * @return {ScratchBlocks} ScratchBlocks connected with the vm
 */
export default function (vm) {
    const ScratchBlocks = LazyScratchBlocks.get();

    const jsonForMenuBlock = function (name, menuOptionsFn, colors, start) {
        return {
            message0: '%1',
            args0: [
                {
                    type: 'field_dropdown',
                    name: name,
                    options: function () {
                        return start.concat(menuOptionsFn());
                    }
                }
            ],
            inputsInline: true,
            output: 'String',
            colour: colors.secondary,
            colourSecondary: colors.secondary,
            colourTertiary: colors.tertiary,
            outputShape: ScratchBlocks.OUTPUT_SHAPE_ROUND
        };
    };

    const jsonForHatBlockMenu = function (hatName, name, menuOptionsFn, colors, start) {
        return {
            message0: hatName,
            args0: [
                {
                    type: 'field_dropdown',
                    name: name,
                    options: function () {
                        return start.concat(menuOptionsFn());
                    }
                }
            ],
            colour: colors.primary,
            colourSecondary: colors.secondary,
            colourTertiary: colors.tertiary,
            extensions: ['shape_hat']
        };
    };


    const jsonForSensingMenus = function (menuOptionsFn) {
        return {
            message0: ScratchBlocks.Msg.SENSING_OF,
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'PROPERTY',
                    options: function () {
                        return menuOptionsFn();
                    }

                },
                {
                    type: 'input_value',
                    name: 'OBJECT'
                }
            ],
            output: null,
            colour: ScratchBlocks.Colours.sensing.primary,
            colourSecondary: ScratchBlocks.Colours.sensing.secondary,
            colourTertiary: ScratchBlocks.Colours.sensing.tertiary,
            outputShape: ScratchBlocks.OUTPUT_SHAPE_ROUND
        };
    };

    const jsonForSensingSetMenus = function (menuOptionsFn) {
        return {
            message0: 'set %1 of %2 to %3',
            args0: [
                {
                    type: 'field_dropdown',
                    name: 'PROPERTY',
                    options: function () {
                        return menuOptionsFn();
                    }

                },
                {
                    type: 'input_value',
                    name: 'OBJECT'
                },
                {
                    type: 'input_value',
                    name: 'VALUE'
                }
            ],
            colour: ScratchBlocks.Colours.sensing.primary,
            colourSecondary: ScratchBlocks.Colours.sensing.secondary,
            colourTertiary: ScratchBlocks.Colours.sensing.tertiary,
            extensions: ['shape_statement']
        };
    };

    const soundsMenu = function () {
        let menu = [['', '']];
        if (vm.editingTarget && vm.editingTarget.sprite.sounds.length > 0) {
            menu = vm.editingTarget.sprite.sounds.map(sound => [sound.name, sound.name]);
        }
        menu.push([
            ScratchBlocks.ScratchMsgs.translate('SOUND_RECORD', 'record...'),
            ScratchBlocks.recordSoundCallback
        ]);
        return menu;
    };

    const costumesMenu = function () {
        const next = ScratchBlocks.ScratchMsgs.translate('LOOKS_NEXTCOSTUME', 'next costume');
        const previous = "previous costume" //ScratchBlocks.ScratchMsgs.translate('LOOKS_PREVIOUSCOSTUME', 'previous costume');
        // TODO: Add translation index into ScratchBlocks for this.

        const random = "random costume"//ScratchBlocks.ScratchMsgs.translate('LOOKS_RANDOMBACKDROP', 'random costume');
        // TODO: Add translation entry
        if (vm.editingTarget && vm.editingTarget.getCostumes().length > 0) {
            return vm.editingTarget.getCostumes().map(costume => [costume.name, costume.name])
                .concat([
                    [next, "next costume"],
                    [previous, "previous costume"],
                    [random, "random costume"]
                ])
            ;
        }
        return [['', '']];
    };

    const backdropsMenu = function () {
        const next = ScratchBlocks.ScratchMsgs.translate('LOOKS_NEXTBACKDROP', 'next backdrop');
        const previous = ScratchBlocks.ScratchMsgs.translate('LOOKS_PREVIOUSBACKDROP', 'previous backdrop');
        const random = ScratchBlocks.ScratchMsgs.translate('LOOKS_RANDOMBACKDROP', 'random backdrop');
        if (vm.runtime.targets[0] && vm.runtime.targets[0].getCostumes().length > 0) {
            return vm.runtime.targets[0].getCostumes().map(costume => [costume.name, costume.name])
                .concat([[next, 'next backdrop'],
                    [previous, 'previous backdrop'],
                    [random, 'random backdrop']]);
        }
        return [['', '']];
    };

    const backdropNamesMenu = function () {
        const stage = vm.runtime.getTargetForStage();
        if (stage && stage.getCostumes().length > 0) {
            return stage.getCostumes().map(costume => [costume.name, costume.name]);
        }
        return [['', '']];
    };

    const spriteMenu = function () {
        const sprites = [];
        for (const targetId in vm.runtime.targets) {
            if (!vm.runtime.targets.hasOwnProperty(targetId)) continue;
            if (vm.runtime.targets[targetId].isOriginal) {
                if (!vm.runtime.targets[targetId].isStage) {
                    if (vm.runtime.targets[targetId] === vm.editingTarget) {
                        continue;
                    }
                    sprites.push([vm.runtime.targets[targetId].sprite.name, vm.runtime.targets[targetId].sprite.name]);
                }
            }
        }
        return sprites;
    };

    const cloneMenu = function () {
        if (vm.editingTarget && vm.editingTarget.isStage) {
            const menu = spriteMenu();
            if (menu.length === 0) {
                return [['', '']]; // Empty menu matches Scratch 2 behavior
            }
            return menu;
        }
        const myself = ScratchBlocks.ScratchMsgs.translate('CONTROL_CREATECLONEOF_MYSELF', 'myself');
        return [[myself, '_myself_']].concat(spriteMenu());
    };

    const soundColors = ScratchBlocks.Colours.sounds;

    const looksColors = ScratchBlocks.Colours.looks;

    const motionColors = ScratchBlocks.Colours.motion;

    const sensingColors = ScratchBlocks.Colours.sensing;

    const controlColors = ScratchBlocks.Colours.control;

    const eventColors = ScratchBlocks.Colours.event;

    ScratchBlocks.Blocks.sound_sounds_menu.init = function () {
        const json = jsonForMenuBlock('SOUND_MENU', soundsMenu, soundColors, []);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.looks_costume.init = function () {
        const json = jsonForMenuBlock('COSTUME', costumesMenu, looksColors, []);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.looks_backdrops.init = function () {
        const json = jsonForMenuBlock('BACKDROP', backdropsMenu, looksColors, []);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.event_whenbackdropswitchesto.init = function () {
        const json = jsonForHatBlockMenu(
            ScratchBlocks.Msg.EVENT_WHENBACKDROPSWITCHESTO,
            'BACKDROP', backdropNamesMenu, eventColors, []);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.motion_pointtowards_menu.init = function () {
        const random = ScratchBlocks.ScratchMsgs.translate('MOTION_POINTTOWARDS_RANDOM', 'random direction');
        const mouse = ScratchBlocks.ScratchMsgs.translate('MOTION_POINTTOWARDS_POINTER', 'mouse-pointer');
        const json = jsonForMenuBlock('TOWARDS', spriteMenu, motionColors, [
            [mouse, '_mouse_'],
            [random, '_random_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.motion_goto_menu.init = function () {
        const random = ScratchBlocks.ScratchMsgs.translate('MOTION_GOTO_RANDOM', 'random position');
        const mouse = ScratchBlocks.ScratchMsgs.translate('MOTION_GOTO_POINTER', 'mouse-pointer');
        const json = jsonForMenuBlock('TO', spriteMenu, motionColors, [
            [random, '_random_'],
            [mouse, '_mouse_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.motion_glideto_menu.init = function () {
        const random = ScratchBlocks.ScratchMsgs.translate('MOTION_GLIDETO_RANDOM', 'random position');
        const mouse = ScratchBlocks.ScratchMsgs.translate('MOTION_GLIDETO_POINTER', 'mouse-pointer');
        const json = jsonForMenuBlock('TO', spriteMenu, motionColors, [
            [random, '_random_'],
            [mouse, '_mouse_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.sensing_of_object_menu.init = function () {
        const stage = ScratchBlocks.ScratchMsgs.translate('SENSING_OF_STAGE', 'Stage');
        const json = jsonForMenuBlock('OBJECT', spriteMenu, sensingColors, [
            [stage, '_stage_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.sensing_of.init = function () {
        const blockId = this.id;
        const blockType = this.type;

        // Get the sensing_of block from vm.
        let defaultSensingOfBlock;
        const blocks = vm.runtime.flyoutBlocks._blocks;
        Object.keys(blocks).forEach(id => {
            const block = blocks[id];
            if (id === blockType || (block && block.opcode === blockType)) {
                defaultSensingOfBlock = block;
            }
        });

        // Function that fills in menu for the first input in the sensing block.
        // Called every time it opens since it depends on the values in the other block input.
        const menuFn = function () {
            const stageOptions = [
                [ScratchBlocks.Msg.SENSING_OF_BACKDROPNUMBER, 'backdrop #'],
                [ScratchBlocks.Msg.SENSING_OF_BACKDROPNAME, 'backdrop name'],
                [ScratchBlocks.Msg.SENSING_OF_VOLUME, 'volume']
            ];
            const spriteOptions = [
                [ScratchBlocks.Msg.SENSING_OF_XPOSITION, 'x position'],
                [ScratchBlocks.Msg.SENSING_OF_YPOSITION, 'y position'],
                [ScratchBlocks.Msg.SENSING_OF_DIRECTION, 'direction'],
                [ScratchBlocks.Msg.SENSING_OF_COSTUMENUMBER, 'costume #'],
                [ScratchBlocks.Msg.SENSING_OF_COSTUMENAME, 'costume name'],
                ['layer', 'layer'],
                [ScratchBlocks.Msg.SENSING_OF_SIZE, 'size'],
                [ScratchBlocks.Msg.SENSING_OF_VOLUME, 'volume']
            ];
            if (vm.editingTarget) {
                let lookupBlocks = vm.editingTarget.blocks;
                let sensingOfBlock = lookupBlocks.getBlock(blockId);

                // The block doesn't exist, but should be in the flyout. Look there.
                if (!sensingOfBlock) {
                    sensingOfBlock = vm.runtime.flyoutBlocks.getBlock(blockId) || defaultSensingOfBlock;
                    // If we still don't have a block, just return an empty list . This happens during
                    // scratch blocks construction.
                    if (!sensingOfBlock) {
                        return [['', '']];
                    }
                    // The block was in the flyout so look up future block info there.
                    lookupBlocks = vm.runtime.flyoutBlocks;
                }
                const sort = function (options) {
                    options.sort(ScratchBlocks.scratchBlocksUtils.compareStrings);
                };
                // Get all the stage variables (no lists) so we can add them to menu when the stage is selected.
                const stageVariableOptions = vm.runtime.getTargetForStage().getAllVariableNamesInScopeByType('');
                sort(stageVariableOptions);
                const stageVariableMenuItems = stageVariableOptions.map(variable => [variable, variable]);
                if (sensingOfBlock.inputs.OBJECT.shadow !== sensingOfBlock.inputs.OBJECT.block) {
                    // There's a block dropped on top of the menu. It'd be nice to evaluate it and
                    // return the correct list, but that is tricky. Scratch2 just returns stage options
                    // so just do that here too.
                    return stageOptions.concat(stageVariableMenuItems);
                }
                const menuBlock = lookupBlocks.getBlock(sensingOfBlock.inputs.OBJECT.shadow);
                const selectedItem = menuBlock.fields.OBJECT.value;
                if (selectedItem === '_stage_') {
                    return stageOptions.concat(stageVariableMenuItems);
                }
                // Get all the local variables (no lists) and add them to the menu.
                const target = vm.runtime.getSpriteTargetByName(selectedItem);
                let spriteVariableOptions = [];
                // The target should exist, but there are ways for it not to (e.g. #4203).
                if (target) {
                    spriteVariableOptions = target.getAllVariableNamesInScopeByType('', true);
                    sort(spriteVariableOptions);
                }
                const spriteVariableMenuItems = spriteVariableOptions.map(variable => [variable, variable]);
                return spriteOptions.concat(spriteVariableMenuItems);
            }
            return [['', '']];
        };

        const json = jsonForSensingMenus(menuFn);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.sensing_set_of.init = function () {
        const blockId = this.id;
        const blockType = this.type;

        // Get the sensing_of block from vm.
        let defaultSensingOfBlock;
        const blocks = vm.runtime.flyoutBlocks._blocks;
        Object.keys(blocks).forEach(id => {
            const block = blocks[id];
            if (id === blockType || (block && block.opcode === blockType)) {
                defaultSensingOfBlock = block;
            }
        });

        // Function that fills in menu for the first input in the sensing block.
        // Called every time it opens since it depends on the values in the other block input.
        const menuFn = function () {
            const stageOptions = [
                ['backdrop', 'backdrop'],
                [ScratchBlocks.Msg.SENSING_OF_VOLUME, 'volume']
            ];
            const spriteOptions = [
                [ScratchBlocks.Msg.SENSING_OF_XPOSITION, 'x position'],
                [ScratchBlocks.Msg.SENSING_OF_YPOSITION, 'y position'],
                [ScratchBlocks.Msg.SENSING_OF_DIRECTION, 'direction'],
                ['costume', 'costume'],
                [ScratchBlocks.Msg.SENSING_OF_SIZE, 'size'],
                [ScratchBlocks.Msg.SENSING_OF_VOLUME, 'volume']
            ];
            if (vm.editingTarget) {
                let lookupBlocks = vm.editingTarget.blocks;
                let sensingOfBlock = lookupBlocks.getBlock(blockId);

                // The block doesn't exist, but should be in the flyout. Look there.
                if (!sensingOfBlock) {
                    sensingOfBlock = vm.runtime.flyoutBlocks.getBlock(blockId) || defaultSensingOfBlock;
                    // If we still don't have a block, just return an empty list . This happens during
                    // scratch blocks construction.
                    if (!sensingOfBlock) {
                        return [['', '']];
                    }
                    // The block was in the flyout so look up future block info there.
                    lookupBlocks = vm.runtime.flyoutBlocks;
                }
                const sort = function (options) {
                    options.sort(ScratchBlocks.scratchBlocksUtils.compareStrings);
                };
                // Get all the stage variables (no lists) so we can add them to menu when the stage is selected.
                const stageVariableOptions = vm.runtime.getTargetForStage().getAllVariableNamesInScopeByType('');
                sort(stageVariableOptions);
                const stageVariableMenuItems = stageVariableOptions.map(variable => [variable, variable]);
                if (sensingOfBlock.inputs.OBJECT.shadow !== sensingOfBlock.inputs.OBJECT.block) {
                    // There's a block dropped on top of the menu. It'd be nice to evaluate it and
                    // return the correct list, but that is tricky. Scratch2 just returns stage options
                    // so just do that here too.
                    return stageOptions.concat(stageVariableMenuItems);
                }
                const menuBlock = lookupBlocks.getBlock(sensingOfBlock.inputs.OBJECT.shadow);
                const selectedItem = menuBlock.fields.OBJECT.value;
                if (selectedItem === '_stage_') {
                    return stageOptions.concat(stageVariableMenuItems);
                }
                // Get all the local variables (no lists) and add them to the menu.
                const target = vm.runtime.getSpriteTargetByName(selectedItem);
                let spriteVariableOptions = [];
                // The target should exist, but there are ways for it not to (e.g. #4203).
                if (target) {
                    spriteVariableOptions = target.getAllVariableNamesInScopeByType('', true);
                    sort(spriteVariableOptions);
                }
                const spriteVariableMenuItems = spriteVariableOptions.map(variable => [variable, variable]);
                return spriteOptions.concat(spriteVariableMenuItems);
            }
            return [['', '']];
        };

        const json = jsonForSensingSetMenus(menuFn);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.sensing_distancetomenu.init = function () {
        const mouse = ScratchBlocks.ScratchMsgs.translate('SENSING_DISTANCETO_POINTER', 'mouse-pointer');
        const json = jsonForMenuBlock('DISTANCETOMENU', spriteMenu, sensingColors, [
            [mouse, '_mouse_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.sensing_touchingobjectmenu.init = function () {
        const mouse = ScratchBlocks.ScratchMsgs.translate('SENSING_TOUCHINGOBJECT_POINTER', 'mouse-pointer');
        const edge = ScratchBlocks.ScratchMsgs.translate('SENSING_TOUCHINGOBJECT_EDGE', 'edge');
        const json = jsonForMenuBlock('TOUCHINGOBJECTMENU', spriteMenu, sensingColors, [
            [mouse, '_mouse_'],
            [edge, '_edge_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.sensing_fulltouchingobjectmenu.init = function () {
        const mouse = ScratchBlocks.ScratchMsgs.translate('SENSING_TOUCHINGOBJECT_POINTER', 'mouse-pointer');
        const edge = ScratchBlocks.ScratchMsgs.translate('SENSING_TOUCHINGOBJECT_EDGE', 'edge');
        const json = jsonForMenuBlock('FULLTOUCHINGOBJECTMENU', spriteMenu, sensingColors, [
            [mouse, '_mouse_'],
            [edge, '_edge_'],
            ['this sprite', '_myself_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.sensing_touchingobjectmenusprites.init = function () {
        const json = jsonForMenuBlock('SPRITETOUCHINGOBJECTMENU', spriteMenu, sensingColors, [
            ['this sprite', '_myself_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.control_create_clone_of_menu.init = function () {
        const json = jsonForMenuBlock('CLONE_OPTION', cloneMenu, controlColors, []);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.control_run_as_sprite_menu.init = function () {
        const json = jsonForMenuBlock('RUN_AS_OPTION', spriteMenu, controlColors, [
            ['Stage', '_stage_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.control_stop_sprite_menu.init = function () {
        const json = jsonForMenuBlock('STOP_OPTION', spriteMenu, controlColors, [
            ['Stage', '_stage_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.looks_getOtherSpriteVisible_menu.init = function () {
        const json = jsonForMenuBlock('VISIBLE_OPTION', spriteMenu, looksColors, [
            ['this sprite', '_myself_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.Blocks.looks_changeVisibilityOfSprite_menu.init = function () {
        const json = jsonForMenuBlock('VISIBLE_OPTION', spriteMenu, looksColors, [
            ['this sprite', '_myself_']
        ]);
        this.jsonInit(json);
    };

    ScratchBlocks.VerticalFlyout.getCheckboxState = function (blockId, inputList) {
        const monitoredBlock = vm.runtime.monitorBlocks._blocks[blockId];
        if (!monitoredBlock)
            return false;

        const { opcode, fields } = monitoredBlock;

        if (opcode == "data_variable" || opcode == "data_listcontents")
            return monitoredBlock ? monitoredBlock.isMonitored : false;

        const parsedFields = inputList[0].fieldRow
            .filter(({ name }) => name in fields)
            .map(field => {
                if (field.variable_) return field.variable_.name;
                return field.name === "CURRENTMENU" ? field.value_.toLowerCase() : field.value_;
            }).join("_");

        const newBlockId = blockId + (parsedFields.length ? "_" : "") + parsedFields;

        const newMonitoredBlock = vm.runtime.monitorBlocks._blocks[newBlockId];

        return newMonitoredBlock ? newMonitoredBlock.isMonitored : false;
    };

    ScratchBlocks.FlyoutExtensionCategoryHeader.getExtensionState = function (extensionId) {
        if (vm.getPeripheralIsConnected(extensionId)) {
            return ScratchBlocks.StatusButtonState.READY;
        }
        return ScratchBlocks.StatusButtonState.NOT_READY;
    };

    ScratchBlocks.FieldNote.playNote_ = function (noteNum, extensionId) {
        vm.runtime.emit('PLAY_NOTE', noteNum, extensionId);
    };

    // Use a collator's compare instead of localeCompare which internally
    // creates a collator. Using this is a lot faster in browsers that create a
    // collator for every localeCompare call.
    const collator = new Intl.Collator([], {
        sensitivity: 'base',
        numeric: true
    });
    ScratchBlocks.scratchBlocksUtils.compareStrings = function (str1, str2) {
        return collator.compare(str1, str2);
    };

    // Blocks wants to know if 3D CSS transforms are supported. The cross
    // section of browsers Scratch supports and browsers that support 3D CSS
    // transforms will make the return always true.
    //
    // Shortcutting to true lets us skip an expensive style recalculation when
    // first loading the Scratch editor.
    ScratchBlocks.utils.is3dSupported = function () {
        return true;
    };

    // brute force a toolbox update if there are no extensions loaded
    // Someone made a commit that broke initial toolbox populate calls back in the day
    // and no one can find it, this brute fixes the problem...
    vm.runtime.on("PROJECT_LOADED", () => {
        if (vm.extensionManager._loadedExtensions.size > 0) return;

        const workspace = ScratchBlocks.getMainWorkspace();
        const toolbox = workspace.getToolbox();
        if (!toolbox) return;
        const categoryMenu = toolbox.categoryMenu_;
        if (!categoryMenu) return;
        if (categoryMenu.secondTable) return;

        categoryMenu.dispose();
        categoryMenu.createDom();
        toolbox.populate_(workspace.options.languageTree);
        toolbox.position();
    });

    // Define "if on edge" block for motion
    ScratchBlocks.Blocks.motion_ifonedge_branch = {
        init: function() {
            this.jsonInit({
                type: 'motion_ifonedge_branch',
                message0: '%1 if on edge, %2',
                args0: [
                    {
                        type: 'field_image',
                        src: 'data:image/png;base64,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',
                        width: 30,
                        height: 15,
                        alt: 'edge icon'
                    },
                    {
                        type: 'input_statement',
                        name: 'SUBSTACK'
                    }
                ],
                colour: ScratchBlocks.Colours.motion.primary,
                colourSecondary: ScratchBlocks.Colours.motion.secondary,
                colourTertiary: ScratchBlocks.Colours.motion.tertiary,
                extensions: ['shape_statement']
            });
        }
    };

    ScratchBlocks.Blocks.motion_ifonedge_shadow = {
        init: function() {
            this.jsonInit({
                type: 'motion_ifonedge_shadow',
                message0: 'branch',
                colour: ScratchBlocks.Colours.motion.primary,
                colourSecondary: ScratchBlocks.Colours.motion.secondary,
                colourTertiary: ScratchBlocks.Colours.motion.tertiary,
                extensions: ['colours_motion']
            });
        }
    };

    return ScratchBlocks;
}
