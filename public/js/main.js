$(document).ready(function() {

	function Crawler() {
		this.template = $('#template').html();
		this.dataList = [];
	}

	Crawler.prototype = {
		init: function() {
			var self = this;

			// 初始化表格
			var emptyObject = {
				index: 1,
				edit: true
			};
			var rendered = Mustache.render(self.template, {
				list: emptyObject
			});
			$('#target-box').html(rendered);

			// 绑定事件
			self.bind();

		},
		bind: function() {
			var self = this;
			var dataList = self.dataList;

			// 添加
			$(document).delegate('.add', 'click', function(e) {
				e.preventDefault();
				var index = parseInt($(this).attr('data-index'));
				var formId = '#J_form_' + index;
				var formData = $.unparam($(formId).serialize());

				$.extend(formData, {
					index: index
				});


				if ($(formId).valid()) {
					dataList.splice(dataList.length - 1, 1);
					dataList.push({
						index: index + 1,
						edit: true
					});
					dataList.splice(dataList.length - 1, 0, formData);
					var rendered = Mustache.render(self.template, {
						list: dataList
					});
					$('#target-box').html(rendered);
					self.submit(formData);
				}

			});

			// 删除
			$(document).delegate('.del', 'click', function(e) {
				e.preventDefault();
				var dataList = self.dataList;
				var index = parseInt($(this).attr('data-index'));
				$(dataList).each(function(v, k) {
					if (k.index == index) {
						dataList.splice(v, 1);
						$(dataList).each(function(v, k) {
							k.index = v + 1;
						});
						return false;
					}
				});

				// 无增加选项，从新创建增加选项
				var len = dataList.length;
				if (!dataList[len - 1].edit) {
					dataList.push({
						index: len + 1,
						edit: true
					});
				}
				var rendered = Mustache.render(self.template, {
					list: dataList
				});
				$('#target-box').html(rendered);
			});

			// 修改
			$(document).delegate('.edit', 'click', function(e) {
				e.preventDefault();
				var dataList = self.dataList;
				var index = parseInt($(this).attr('data-index'));

				$(dataList).each(function(v, k) {
					if (k.index == index) {
						k.edit = true;
						k.save = true;
					}
				});

				var rendered = Mustache.render(self.template, {
					list: dataList
				});
				$('#target-box').html(rendered);
			});

			// 保存
			$(document).delegate('.save', 'click', function(e) {
				e.preventDefault();
				var dataList = self.dataList;
				var index = parseInt($(this).attr('data-index'));
				var formId = '#J_form_' + index;
				var formData = $.unparam($(formId).serialize());

				$.extend(formData, {
					index: index
				});

				if ($(formId).valid()) {
					$(dataList).each(function(v, k) {
	                    if (k.index == index) {
	                        dataList.splice(v, 1);
	                        dataList.splice(v, 0, formData);
	                    }
	                });
	                var rendered = Mustache.render(self.template, {
						list: dataList
					});
					$('#target-box').html(rendered);
					self.submit(formData);
				}

			});
		},
		submit: function(data) {
			var self = this;
			$.ajax({
				url: 'getDoubanPhoto.html',
				dataType: 'json',
				type: 'post',
				data: data,
				success: function(resp) {
					if (resp.status) {
						console.log('submit success ' + data.index + '!');
					}
				}
			});
		}
	};

	var crawler = new Crawler();
	crawler.init();
});