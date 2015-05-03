$(function() {

	// Generate random number between min and max
	var getRandomNumber = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};

	// Individual item model
	var Item = Backbone.Model.extend({
		defaults: {
			'count': 1
		},
		localStorage: new Store('item')
	});

	// Item list
	var ItemList = Backbone.Collection.extend({
		model: Item,
		localStorage: new Store('list')
	});

	// Individual item view
	var ItemView = Backbone.View.extend({
		tagName: 'li',

		className: 'item',

		template: _.template($('#item-template').html()),

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.addClass(this.model.get('pid'));
			return this;
		}
	});

	// Inventory item view
	var InventoryItemView = Backbone.View.extend({
		tagName: 'li',

		className: 'item',

		template: _.template($('#inventory-item-template').html()),

		render: function () {
			this.$el.html(this.template(this.model.toJSON()));
			this.$el.addClass(this.model.get('pid'));
			return this;
		}
	});

	// Item list view
	var ListView = Backbone.View.extend({
		el: $('#container'),

		events: {
			'click li.item': 'take',
			'click button.takeall': 'takeAll',
			'click button.close': 'close'
		},

		initialize: function (options) {
			var self = this;

			this.listenTo(options.dispatcher, {
				'getloot': function (e) {self.getLoot(e) }
			});
		},

		// Does the RNG based on container size/type and returns an item list
		getLoot: function (e) {
			var i,
				size = e.target.dataset.size,
				type = e.target.dataset.type,
				item,
				itemChance,
				typeChance,
				lootAmt,
				minCapacity,
				maxCapacity,
				maxLimit,
				contItemChance,
				container = [];

			switch (size) {
				case 'epic':
					minCapacity = 15;
					maxCapacity = 25;
					maxLimit = 1;
				case 'large':
					minCapacity = 5;
					maxCapacity = 15;
					maxLimit = 25;
					break;
				case 'medium':
					minCapacity = 2;
					maxCapacity = 10;
					maxLimit = 50;
					break;
				case 'small':
				default:
					minCapacity = 0;
					maxCapacity = 5;
					maxLimit = 100;
					break;
			}

			switch (type) {
				case 'deskdrawer':
					contItemChance = containerTypes[0].itemchance;
					break;
				case 'ammocrate':
					contItemChance = containerTypes[1].itemchance;
					break;
			}

			// Randomly generated number of items
			lootAmt = getRandomNumber(minCapacity, maxCapacity);

			// Iterate through items, randomly pulling an item from the lookup each time
			for (i = 0; i < lootAmt; i++) {
				item = getRandomNumber(0, items.length - 1);
				itemChance = getRandomNumber(1, maxLimit);
				typeChance = getRandomNumber(0, 100);

				// Add the item if it passes an individual item chance and container item type chance check
				if (items[item].chance >= itemChance && contItemChance[items[item].type] >= typeChance) {
					container.push(items[item]);
				}
			}

			var uniq = _.uniq(container, false, function (item) {
				return item.pid;
			});

			this.collection = new ItemList(container);
			this.render(e);
		},

		/*	Iterates through the items, looking for a match. Checks localStorage and increments
			item count if found. Saves new model to localStorage if not. */
		saveItem: function (data, count) {
			var saveItem,
				model = {},
				isStored = false;

			// Lookup Item properties and add to model
			for (var i = 0; i < items.length; i++) {
				if (items[i].pid === data) {
					if (localStorage.length) {
						for (var j = 1; j < localStorage.length; j++) {
							var lsid = localStorage.key(j),
								lsitem = JSON.parse(localStorage.getItem(lsid));
							if (lsitem.pid === data) {
								var lscount = parseInt(lsitem.count);
								lsitem.count = count + lscount;
								localStorage.setItem(lsid, JSON.stringify(lsitem));
								isStored = true;
							}
						}
					}

					if (!isStored) {
						model.pid = items[i].pid;
						model.name = items[i].name;
						model.desc = items[i].desc;
						model.count = count > 1 ? count : 1;

						saveItem = new Item();
						saveItem.save(model);
					}
				}
			}
		},

		// Take a single item
		take: function (e) {
			var data = $(e.currentTarget).find('input').val(),
				count = parseInt($(e.currentTarget).find('.count').text());

			this.saveItem(data, count);

			$(e.target).closest('.item').remove();
		},

		// Take all items
		takeAll: function () {
			var self = this,
				data,
				count,
				list = $('#items li.item');

			_.each(list, function (item) {
				data = $(item).find('input').val();
				count = parseInt($(item).find('.count').text());
				self.saveItem(data, count);
			});

			this.el.close();
		},

		close: function () {
			this.el.close();
		},

		render: function (e) {
			var self = this,
				itemView
				itemCount = 1;

			this.$el.find('ul').empty();

			_.each(this.collection.models, function (item) {
				itemView = new ItemView({
					model: item
				});

				if ($('#items li.' + item.get('pid')).length === 0) {
					$('#items').append(itemView.render().el);
				} else {
					itemCount++;
				}

				if (itemCount > 1 && item.get('pid') !== 'trap') {
					$('#items li.' + item.get('pid') + ' .count').text(itemCount);
					itemCount = 1;
				}

			}, this);

			if (this.collection.models.length === 0) {
				this.$el.find('#empty').show();
				this.$el.find('.take, .takeall').hide();
			} else {
				this.$el.find('#empty').hide();
				this.$el.find('.take, .takeall').show();
			}

			this.el.showModal();
		}
	});

	var AppView = Backbone.View.extend({
		el: $('#loot'),

		events: {
			'click button.container': 'getLoot',
			'click button.openinventory': 'openInventory',
			'click button.closeinventory': 'closeInventory',
			'click #inventory li.item': 'deleteItem'
		},

		initialize: function (options) {
			var numberOfContainers = getRandomNumber(0, 8),
				size,
				type,
				chance,
				i,
				self = this;

			this.dispatcher = options.dispatcher;

			for (i = 0; i < numberOfContainers; i++) {
				size = getRandomNumber(0, containerSizes.length - 1);
				type = getRandomNumber(0, containerTypes.length - 1);
				chance = getRandomNumber(0, 100);

				if (containerSizes[size].chance >= chance && containerTypes[type].chance >= chance) {
					$('<button type="button" class="container" data-size="' + containerSizes[size].type + '" data-type="' + containerTypes[type].type + '">' + containerSizes[size].name +  ' ' + containerTypes[type].name + '</button>').prependTo('#loot');
				}
			}

			var list = new ListView({dispatcher: dispatcher});
		},

		getLoot: function (e) {
			this.dispatcher.trigger('getloot', e);
		},

		openInventory: function () {
			$('#inventory #items').empty();

			var c = new Backbone.Collection();
			c.localStorage = new Backbone.LocalStorage('item');
			c.fetch({
				success: function () {
					_.each(c.models, function (item) {
						itemView = new InventoryItemView({
							model: item
						});
						$('#inventory #items').append(itemView.render().el);
					}, this);

					if (c.models.length > 0) {
						$('#inventory #empty').hide();
					} else {
						$('#inventory #empty').show();
					}
				}
			});

			$('#inventory')[0].showModal();
		},

		closeInventory: function () {
			$('#inventory')[0].close();
		},

		deleteItem: function (e) {
			var id = $(e.currentTarget).find('input').val();
			localStorage.removeItem('item-' + id);
			$(e.currentTarget).closest('li').remove();

			// If there are no more items, close the inventory
			if ($('#inventory #items li').length === 0) {
				$('#inventory')[0].close();
			}
		}
	});

	var dispatcher = _.extend({}, Backbone.Events);
	var app = new AppView({dispatcher: dispatcher});

});