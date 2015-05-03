	var items = [{
		pid: 'xdm',
		name: 'Springfield X-DM 9mm',
		type: 'weapon',
		desc: 'A Springfield Armory-made hand gun chambered in 9mm.',
		chance: 5
	}, {
		pid: 'p226',
		name: 'Sig-Sauer P226 45ACP',
		type: 'weapon',
		desc: 'Sig-Sauer-manufactured 45mm hand gun.',
		chance: 4
	}, {
		pid: 'm16',
		name: 'M16A2 Assault Rifle',
		type: 'weapon',
		desc: 'US military standard issue assault rifle with fire selection.',
		chance: 2
	}, {
		pid: 'm4a1',
		name: 'M4A1 Carbine',
		type: 'weapon',
		desc: 'US military and police carbine. Compact variant of the M16 best suited for close combat.',
		chance: 3
	}, {
		pid: 'huntingrifle',
		name: 'Hunting Rifle',
		type: 'weapon',
		desc: 'An old hunting rifle with a wooden stock, chambered in .30-06.',
		chance: 5
	}, {
		pid: '8xscope',
		name: '8x Rifle Scope',
		type: 'accessory',
		desc: 'An 8x rifle scope made to fix to a rifle with a Picatinny rail.',
		chance: 6
	}, {
		pid: 'm4foldingstock',
		name: 'M4A1 Folding Stock',
		type: 'accessory',
		desc: 'A replacement folding stock for the M4A1 carbine.',
		chance: 5
	}, {
		pid: 'bat',
		name: 'Baseball Bat',
		type: 'weapon',
		desc: 'A wooden bat that can be used for bludgeoning.',
		chance: 10
	}, {
		pid: 'water',
		name: 'Bottle of Water',
		type: 'consumable',
		desc: 'A cool, clean bottle of water.',
		chance: 20
	}, {
		pid: 'wood',
		name: 'Wood',
		type: 'material',
		desc: 'Wood to build things with.',
		chance: 25
	}, {
		pid: 'apple',
		name: 'Apple',
		type: 'consumable',
		desc: 'A crisp Washington apple.',
		chance: 20
	}, {
		pid: 'soda',
		name: 'Can of Soda',
		type: 'consumable',
		desc: 'A 12oz. can of carbonated goodness.',
		chance: 25
	}, {
		pid: 'crowbar',
		name: 'Crowbar',
		type: 'weapon',
		desc: 'A hefty crowbar handy for opening doors or self-defense.',
		chance: 8
	}, {
		pid: 'trap',
		name: 'TRAP!',
		type: 'explosive',
		desc: 'A spring trap rigged to explode!',
		chance: 1
	}, {
		pid: 'diamonds',
		name: 'Bag of Diamonds',
		type: 'valuable',
		desc: 'A small velvet bag filled with large, intricately cut diamonds.',
		chance: 1
	}];

	var	containerTypes = [{
		type: 'deskdrawer',
		name: 'Desk Drawer',
		chance: 100,
		itemchance: {
			weapon: 20,
			consumable: 90,
			valuable: 50,
			explosive: 5,
			material: 50,
			accessory: 20
		}
	}, {
		type: 'ammocrate',
		name: 'Ammo Crate',
		chance: 50,
		itemchance: {
			weapon: 80,
			consumable: 50,
			valuable: 2,
			explosive: 5,
			material: 50,
			accessory: 90
		}
	}];

	var containerSizes = [{
		type: 'small',
		name: 'Small',
		chance: 100
	}, {
		type: 'medium',
		name: 'Medium',
		chance: 50
	}, {
		type: 'large',
		name: 'Large',
		chance: 25
	}, {
		type: 'epic',
		name: 'Epic',
		chance: 5
	}];