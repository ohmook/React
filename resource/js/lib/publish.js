var thisContainer = null;


jQuery.event.special.outsideclick = {
    setup: function (data, namespaces, handler) {

        var $this = $(this);
        var namespace = namespaces.join('.');

        function _clickHandler(e) {
            // console.log($(e.target).prop('tagName') + '       ' + $(e.target).prop('className') + '       ' + $(e.target).parent().parent().parent().prop('className'));
            if ($('.select_period').find('.period_contents').hasClass('active') == true) {
                if ($('#ui-datepicker-div').css('display') == 'block') {
                    $('.select_period').focus();
                    return;
                }
            }

            if ($(event.target).closest('.note_list_info').length > 0) {
                return;
            }
            // .note_list_info a

            // jq-toast-wrap
            // 대화방 나가기 클릭시 예외처리	layerPop_alert, ui-widget-overlay
            //if ($(e.target).prop('tagName') != 'INPUT') {
            if (namespaces == 'skip_dialog') {
                if ($(e.target).closest('.layerPop_alert, .jq-toast-wrap').length > 0 || $(e.target).hasClass('ui-widget-overlay') == true || $(e.target).closest('.ui-dialog').length > 0) {
                    return;
                }

                if ($(e.target).closest('.msg_contextmenu').length > 0) {
                    return;
                }

                if ($(e.target).closest('.select_type.type7').length > 0) {
                    return;
                }
            }

            //}


            if ($(e.target).hasClass('view_contacts') == true) {// 주소록 연락처 조회 다이얼로그 예외 처리
                return false;
            }
            var handleClick = true;
            var mouseUsed = 'button' in e;
            if (namespace === 'mouse' && !mouseUsed) {
                handleClick = false;
            } else if (namespace === 'trigger' && mouseUsed) {
                handleClick = false;
            }
            if (handleClick) {
                var clickedKid = !!$this.has(e.target).length;
                if (!clickedKid && $this[0] !== e.target) {
                    $this.trigger('outsideclick');
                }
            }
        }

        function _mouseDownHandler(e) {
            if ($(e.target).hasClass('overflow_contents') == true) {
                $('body').children('.fancytree_list').remove();
                $('body').off('mousedown.outside').off('click.outside');
            }
        }

        // stores handler so it can be properly removed
        // in teardown process
        $this.data('__outsideclickHandler__', _clickHandler);
        $('body').on('mousedown.outside', _clickHandler);//$('body').on('click', _clickHandler);
        //$('body').on('mousedown', _mouseDownHandler);
        return true;
    },
    teardown: function () {
        $('body').off('click.outside', $(this).data('__outsideclickHandler__'));
        return true;
    },
    // prevents duplicate triggers from happening
    // from nested elements with 'outsideclick'
    noBubble: true
};


(function ($, window, undefined) {
    var deviceFilter = "win16|win32|win64|mac",
        deviceStr = 'pc';
    if (navigator.platform) {
        if (0 > deviceFilter.indexOf(navigator.platform.toLowerCase())) {
            deviceStr = 'mobile';
        }
        else {
            deviceStr = 'pc';
        }
    }
    //if (deviceStr != 'pc') {
    //	$('html').addClass('mobile');

    // alert($('html').hasClass('mobile'));
    //}


    $.publish = {
        placeholderSet: function (_container) {
            var placeholderObj = _container.find('*[placeholder]');
            var placeholderLength = placeholderObj.length;

            for (var i = 0; i < placeholderLength; i++) {
                var placeholder = _container.find('*[placeholder]:eq(' + i + ')').attr('placeholder');
                if (_container.find('*[placeholder]:eq(' + i + ')').hasClass('calender, time') == false) _container.find('*[placeholder]:eq(' + i + ')').val(placeholder).addClass('placeholder');
            }
            placeholderObj.off('focus.placeholder').on('focus.placeholder', function () {
                if ($(this).hasClass('calender, time') == false) {
                    if ($(this).val() == $(this).attr('placeholder')) {
                        $(this).val('').removeClass('placeholder');
                    }
                }
            });
            placeholderObj.off('blur.placeholder').on('blur.placeholder', function () {
                if ($(this).hasClass('calender, time') == false) {
                    if ($(this).val().length == 0) {
                        $(this).val($(this).attr('placeholder')).addClass('placeholder');
                    }
                }
            });
        },
        textareaAutoresize: function () {// textarea auto height : 게시판 조회, 일정관리 - 일정 레이어의 내용
            setTimeout(function () {




                /*
				jQuery.each(jQuery('textarea[data-autoresize]'), function() {
					var offset = this.offsetHeight - this.clientHeight;

					var resizeTextarea = function(el) {
						jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset);
					};
					jQuery(this).on('keydown', function() { resizeTextarea(this); }).removeAttr('data-autoresize');
				});


				jQuery.each($('textarea[data-autoresize]'), function() {

					console.log(this);
					var offset = this.offsetHeight - this.clientHeight;

					var resizeTextarea = function(el) {
						jQuery(el).css('height', 'auto').css('height', el.scrollHeight + offset + 5);
					};

					$(this).off().on('keyup input keydown', function() {
						resizeTextarea(this);
					}).removeAttr('data-autoresize');

					resizeTextarea(this);
				});
				*/


                jQuery.each($('textarea[data-autoresize]'), function () {
                    var minRows = $(this).attr('rows');

                    if (minRows == 1) minRows = '25px';
                    else minRows = '77px';

                    var resizeTextarea = function (el) {
                        $('#publish_textareaClone').remove();

                        var textareaClone = '<textarea id="publish_textareaClone" style="position: absolute; top: -99999px; left: 0; min-height: ' + minRows + '; padding: 0 10px; margin: 0 0 5px 0; z-index: 999999; overflow-x: hidden; overflow-y: auto; vertical-align: top; line-height: 1.7; background-color: #ddd;"></textarea>';

                        $('body').append(textareaClone);

                        var publish_textareaClone = $('#publish_textareaClone');
                        publish_textareaClone.width($(el).width());
                        publish_textareaClone.val($(el).val());

                        var offset = publish_textareaClone.prop('offsetHeight') - publish_textareaClone.prop('clientHeight')

                        publish_textareaClone.css('height', 'auto').css('height', publish_textareaClone.prop('scrollHeight') + offset);

                        $(el).height(publish_textareaClone.height());

                        $('#publish_textareaClone').remove();

                    };

                    $(this).off().on('keyup input keydown', function () {
                        resizeTextarea(this);

                    }).removeAttr('data-autoresize');

                    resizeTextarea(this);
                });


            }, 10);
        },
        displayPortlet: function (portletObj) {
            var publish_viewPortlet = portletObj,
                li = publish_viewPortlet.children('li'),
                liLength = li.length,
                dotList,
                dotListLiLength,
                thumbList,
                thumbListLiLength,
                widget;

            for (var i = 0; i < liLength; i++) {
                widget = publish_viewPortlet.children('li:eq(' + i + ')');
                dotList = publish_viewPortlet.children('li:eq(' + i + ')').find('.dot_list');
                dotListLiLength = dotList.children('li').length;

                if (dotList.find('.add_col').length > 0) {
                    var widthNum = 0,
                        min_width = 400;
                    if (dotList.hasClass('type4') == true) min_width = 500;
                    else if (dotList.hasClass('type5') == true) min_width = 500;
                    else if (dotList.hasClass('type6') == true) min_width = 500;
                    else if (dotList.hasClass('type7') == true) min_width = 500;

                    /*
					if (widget.outerWidth() > min_width) {
						if (widget.outerWidth() < 600) {
							widget.find('.progress, .state').hide();
							widget.find('.writer').show();
						}
						else if (widget.outerWidth() < 1500) {
							widget.find('.progress, .state , .writer').show();
						}
					}
					else {
						// widget.find('.progress, .state , .writer').hide();
						widget.find('.progress, .state').hide();
						if (widget.find('.date').length == 0) {
							if (widget.find('.writer').length > 0) {
								widget.find('.writer').show();
							}
						}
					}
					*/

                    for (var k = 0; k < dotListLiLength; k++) {
                        if (dotList.children('li:eq(' + k + ')').find('.add_col').outerWidth() > 0) {
                            widthNum = dotList.children('li:eq(' + k + ')').find('.add_col').outerWidth();
                        }
                        dotList.children('li:eq(' + k + ')').children('a').css({'padding-right': widthNum});
                        dotList.children('li:eq(' + k + ')').children('div').children('a').css({'padding-right': widthNum});
                        // dotList.children('li:eq(' + k + ')').find('.txt').css({ 'padding-right' : widthNum}); // , 'padding-left' : '10px' // JUST7 2018_0702
                    }
                }
            }
        },
        msgSet: function (msg, type, width, autoCloseSet, callBack) {


            var filter = "win16|win32|win64|mac",
                device = 'pc';
            if (navigator.platform) {
                if (0 > filter.indexOf(navigator.platform.toLowerCase())) {
                    device = 'mobile';
                }
                else {
                    device = 'pc';
                }
            }
            if (width == undefined) {
                if (device == 'pc') width = 250;
                else if (device == 'mobile') width = $('#publish_wrap').width() - 30;
            }
            else if (width < 250) {
                width = 250;
            }
            else if (width == null) {
                width = 250;
            }

            if (autoCloseSet == undefined) autoCloseSet = null;
            if (callBack == undefined) callBack = null;

            setTimeout(function () {
                $('#publish_layerPopAlert').dialog({
                    autoOpen: false,
                    modal: false,
                    minWidth: width,
                    minHeight: 30,
                    resizable: false,
                    open: function (event, ui) {
                        $(this).removeClass('alert_set complete').children('.icon_alert, .icon_complete').remove();
                        if (type == 'alert') {
                            $(this).addClass('alert_set');
                            $(this).append('<span class="icon_alert"></span>');
                        }
                        else if (type == 'complete') {
                            $(this).addClass('alert_set');
                            $(this).append('<span class="icon_complete"></span>');
                        }
                        $(this).messagesPop({
                            str: '<div>' + msg + '</div>',
                            btnStr: '<a href="javascript:void(0);" class="btn bold">' + common_button_confirm + '</a>',// '<a href="javascript:void(0);" class="btn bold">확인</a>'
                            autoCloseSet: autoCloseSet,
                            callBack: callBack
                        });
                    }
                }).dialog('open');
            }, 1);
        },
        /**
         * 화면 분할
         * @param module (메일:mail, 게시판: board, 쪽지:note 등)
         * @param divisionMode (목록:list, 좌우분할:vertical, 상하분할:horizontal)
         */
        splitter: function (module, divisionMode) {
            //divisionMode = divisionMode ? divisionMode : 'list';
            $('#publish_' + module + '_container').jqxSplitterSet({
                module: module,
                divisionContainerClass: $('#publish_' + module + '_content').prop('className'),
                subDivisionContainer: $('#publish_' + module + '_content'),			// 화면 분할 버튼 클릭 시 분할되는 object
                btnDivisionReset: $('#publish_' + module + '_divisionReset'),		// 화면 분할 초기화 버튼
                btnDivisionVertical: $('#publish_' + module + '_divisionVertical'),	// 화면 분할 가로형 버튼
                btnDivisionHorizontal: $('#publish_' + module + '_divisionHorizontal'),// 화면 분할 세로형 버튼
                pagination: $('#publish_' + module + '_container').find('.pagination'),//$('#publish_' + module + '_pagination'),		// 기본 리스트의 pagination
                listDiv: $('#publish_' + module + '_list_wrap'),			// 목록 object
                divisionMode: divisionMode							        // list, vertical, horizontal
            });
        },
        /**
         * 팝업 컨텐츠 영역의 height 길이가 변할때 : 첫번째 팝업만 기능 처리 되었으며 수정 필요함
         */
        intervalLayerResizeSet: function () {
            var interval = setInterval(intervalSet, 10);

            function intervalSet() {
                $('#publish_pop').css({'min-height': $('#publish_layer').outerHeight()});
                interval = null;
                clearInterval(interval);
            }
        },
        /**
         * 목록에서 좌측 메뉴 트리로 drag 처리하는 공통 함수
         * @param selectorObj
         * @param options
         */
        draggable: function (selector, options) {
            var defaults = {
                zIndex: 10000,
                scroll: false,
                appendTo: 'body',
                containment: 'window',
                cursorAt: {top: 1, left: 1, right: 1, bottom: 1},
                helper: function () {
                    $($(this).context).find("input").prop('checked', true);// prop 바꿈

                    var checkedCnt = $($(this).context.parentNode).find("li :checkbox:checked").length;

                    return $('<div class="drag_icon" style="margin: 22px 0 0 55px"><div class="drag_num">' + checkedCnt + '</div><div class="icon_cursor"></div><div class="icon"></div></div>');
                },
                start: function (event, ui) {
                },
                stop: function (event, ui) {
                    var checkedCnt = $($(this).context.parentNode).find("li :checkbox:checked").length;
                    if (checkedCnt == 1) {
                        event.target.querySelector("input").checked = false;
                    }
                }
            };
            $.extend(defaults, options);
            selector.find("[draggable='true']").draggable(defaults);
        },
        /**
         * drag 해서 drop 처리하는 공통 함수
         * @param selector
         * @param options
         */
        droppable: function (selector, options) {
            var defaults = {
                over: function (event, ui) {
                    $(ui.helper[0]).find(".icon").addClass("active");
                    $(this).addClass("drop-hover");
                },
                out: function (event, ui) {
                    $(ui.helper[0]).find(".icon").removeClass("active");
                    $(this).removeClass("drop-hover");
                }
            };
            $.extend(defaults, options);
            selector.find("[droppable='true']").droppable(defaults);
        },
        /**
         * Layer 오픈
         * @param options
         */
        openLayer: function (html, options) {
            var target = $('#publish_layer'),
                targetLayerWidth = null;
            if (options != undefined && options['addPopup']) {
                options['layerWrap'] = $('#publish_layerWrap');
                options['layerPop'] = $('#publish_pop_add');
                options['targetLayerWrap'] = $('#publish_layer_add');
                target = options['targetLayerWrap'];
            }
            target.html(html);
            if (options != undefined && options['addPopup']) {
                options['targetLayer'] = options['targetLayerWrap'].children('.layerPopup');
            }
            if (options != undefined && options['width']) {
                targetLayerWidth = options['width'];
            }
            var defaults = {
                targetLayer: $('#publish_layer .layerPopup'),
                targetLayerWrap: $('#publish_layer'),
                targetLayerWidth: targetLayerWidth
            };

            $.extend(defaults, options);
            $('#publish_layerWrap').layerOpenClose(defaults);
        },
        /**
         * layer 닫기
         */
        closeLayer: function (targetNum) {
            if (targetNum == undefined) closeLayer();
            else closeLayer(targetNum);

        },
        /**
         * layer로 정보 메세지 출력
         * @param msg
         */
        alertM: function (msg, func) {
            if (func != undefined) {
                layerExplainSet(
                    'bg_complete',
                    182, //시작 좌표 32
                    202, //종료 좌표 52
                    msg,
                    func
                );
            }
            else {
                layerExplainSet(
                    'bg_complete',
                    182, //시작 좌표 32
                    202, //종료 좌표 52
                    msg
                );
                //closeLayer();
            }
        },
        /**
         * layer로 에러 메세지 출력
         * @param msg
         */
        alertE: function (msg) {
            layerExplainSet(
                'bg_alert',
                182, //시작 좌표
                202, //종료 좌표
                msg
            );
        },

        dialogAnimate: function (dialogObj) {
            dialogObj.css({
                top: '130px',
                left: ($('.wrap').outerWidth() / 2) - (dialogObj.outerWidth() / 2),
                opacity: 0
            }).animate({top: '89px', opacity: 1}, 700, 'easeOutExpo').focus();
        },
        dialogOpenSet: function (dialogObj) {
            var dialogContainerHeight = dialogObj.find('.dialog_container').outerHeight() + 48;
            dialogObj.dialog("option", "height", dialogContainerHeight, "minHeight", dialogContainerHeight);
            dialogObj.parent().css({
                top: '130px',
                left: ($('.wrap').outerWidth() / 2) - (dialogObj.parent().outerWidth() / 2),
                opacity: 0
            }).animate({top: '89px', opacity: 1}, 700, 'easeOutExpo').focus();
            // dialogObj.parent().find('.ui-dialog-titlebar-close').attr('title', '');

        }
    };

    $.extend({
        'getInit': function (_this, jsPlugin, config) {
            return _this.each(function () {
                $.fn.extend(this, jsPlugin);
                this.config = config;
                this.init();
            });
        },
        'getThis': function (idName, el) {
            $.data(document.getElementById(idName), '$getThis', el);
        }
    });

    $.fn.inputSetMaxByte = function (defaults) {
        defaults = $.extend(
            {
                maxByte: 2000,
                nowMaxByte: true
            }, defaults);

        $.getInit(this, inputSetMaxByte, $.extend({}, $.fn.inputSetMaxByte.defaults, defaults));
    };
    var inputSetMaxByte = {
        'init': function () {
            var _this = this;
            _this.setting();
        },
        'setting': function () {
            var _this = this,
                nowMaxByte = _this.config.nowMaxByte,
                maxByte = Math.round(_this.config.maxByte / 2);
            $(_this).on('change keyup input', function () {
                var byteCheck = _this.inputByteCheck($(this), maxByte);
                var thisByte = byteCheck.byte;

                if (nowMaxByte == true) {
                    if (byteCheck.textNum == undefined) $(this).closest('.textarea_wrap').find('.now_byte').children('span').text(0);
                    else $(this).closest('.textarea_wrap').find('.now_byte').children('span').text(byteCheck.textNum);
                }

                if (byteCheck.textNum > maxByte) {
                    $(this).val('');
                    $(this).val($.data(document.getElementById($(this).prop('id')), '$getThis'));
                    $.publish.msgSet('글자 수 ' + maxByte + '자를 초과할수 없습니다.', 'alert', 350);
                    if (nowMaxByte == true) $(this).closest('.textarea_wrap').find('.now_byte').children('span').text(maxByte);
                }
            });
        },
        'inputByteCheck': function (obj, maxByte) {
            var str = new String(obj.val());

            if (str.length != 0) {
                var _byte = 0;
                var _textNum = 0;
                for (var i = 0; i < str.length; i++) {
                    _textNum++;
                    var str2 = str.charAt(i);
                    if (escape(str2).length > 4) _byte += 2;
                    else _byte++;
                }
            }
            if (maxByte >= _textNum) $.getThis(obj.prop('id'), str);

            return {byte: _byte, textNum: _textNum};
        }
    };

    /**
     * layer Form Validate
     * @param options
     */
    $.fn.layerFormValidate = function (options) {
        var defaults = {
            highlight: function (element, error) {
                $.publish.intervalLayerResizeSet();
            },
            unhighlight: function (element, error) {
                $.publish.intervalLayerResizeSet();
            },
            errorPlacement: function (error, element) {
                $(element).parent().append(error);
                $.publish.intervalLayerResizeSet();
            }
        };
        $.extend(defaults, options);
        $(this).validate(defaults);
    };
    $.fn.outerHTML = function () {
        return $(this).clone().wrap('<div></div>').parent().html();
    };
    $.fn.confirm = function (msg, callback, blindSet) {
        var layerExplain = $('#publish_layerExplain'),
            layerExplainBlind = $('#publish_explainBlind');
        layerExplainBlind.addClass('active');
        layerExplain.find('.confirm, .cancle').addClass('active');
        //alert(msg)
        layerExplainSet('bg_confirm', 182, 202, msg);
        layerExplain.find('.confirm').off();
        layerExplain.find('.confirm').on('click', function () {
            $(this).off();
            layerExplain.hide();
            layerExplain.find('.cancle').removeClass('active');
            layerExplainBlind.removeClass('active');
            if (typeof callback == "function") {
                callback('ok');
            }
        });
        layerExplain.find('.cancle').on('click', function () {
            $(this).off();
            layerExplain.hide();
            layerExplainBlind.removeClass('active');
            if (typeof callback == "function") {
                callback('cancle');
            }
        });
    };
    $.fn.jqxSplitterSet = function (defaults) {
        defaults = $.extend(
            {
                wrap: $('body'),						// 화면분할 대상의 height 설정 : 부모 - 가변적인 수치 : 고정값으로 설정하면 resizing에 대응 할수 없기 때문에 object로 정의
                compareDivHeight: $('#publish_header').height(),	// 화면분할 대상의 height 설정 : 비교대상 - 고정 수치
                divisionContainer: this,							// 초기 화면 분할 object : 해당 id의 아래 1-depth div 2개(div 갯수 2개 이상일때 오류)
                divisionContainerClass: null,
                divisionSize: [200, 200, '76%'],				// 초기 화면 분할 사이즈 : 초기분할 x좌표, 첫번째(좌측) 패널 min-width, 두번째 패널(우측) min-width
                subDivisionContainer: null,							// 화면 분할 버튼 클릭 시 분할되는 object
                btnDivisionReset: null,							// 화면 분할 초기화 버튼
                btnDivisionVertical: null,							// 화면 분할 가로형 버튼
                btnDivisionHorizontal: null,							// 화면 분할 세로형 버튼
                pagination: null,							// 기본 리스트의 pagination
                listDiv: null,							// 목록 object
                divisionVerticalClassName: 'vertical',						// 화면 분할 가로형일때 listDiv의 style 예외 처리를 위한 class name
                //verticalSize: 				[390, 300, 150],				// 초기분할 x좌표, 첫번째(좌측) 패널 min-width, 두번째 패널(우측) min-width
                verticalSize: [530, 450, 150],				// 초기분할 x좌표, 첫번째(좌측) 패널 min-width, 두번째 패널(우측) min-width
                //horizontalSize: 			[250, 200, 100],				// 초기분할 y좌표, 첫번째(상단) 패널 min-height, 두번째(하단) 패널 min-height
                horizontalSize: ['50%', 200, 100]//,				// 초기분할 y좌표, 첫번째(상단) 패널 min-height, 두번째(하단) 패널 min-height
                //divisionMode:				null							// list, vertical , horizontal
            }, defaults);

        $.getInit(this, jqxSplitterSet, $.extend({}, $.fn.jqxSplitterSet.defaults, defaults));
    };
    var jqxSplitterSet = {
        'init': function () {
            var _this = this;
            _this.setting();

        },
        'setting': function () {
            var _this = this,
                _thisArr = [];
            //alert(_this.config.pagination);
            _this.wrap = _this.config.wrap;
            _this.compareDivHeight = _this.config.compareDivHeight;
            _this.divisionContainer = _this.config.divisionContainer;
            _this.divisionContainerClass = _this.config.divisionContainerClass;
            _this.divisionSize = _this.config.divisionSize;
            _this.divisionVerticalClassName = _this.config.divisionVerticalClassName;
            _this.verticalSize = _this.config.verticalSize;
            _this.horizontalSize = _this.config.horizontalSize;
            _this.divisionMode = _this.config.divisionMode;
            _this.module = _this.config.module;

            if (_this.divisionMode != undefined) {
                if (_this.divisionContainerClass != null) {
                    _this.subDivisionContainer = _this.config.subDivisionContainer;
                    _this.btnDivisionReset = _this.config.btnDivisionReset;
                    _this.btnDivisionVertical = _this.config.btnDivisionVertical;
                    _this.btnDivisionHorizontal = _this.config.btnDivisionHorizontal;
                    _this.pagination = _this.config.pagination;
                    _this.listDiv = _this.config.listDiv;
                    _thisArr = {
                        subDivisionContainer: _this.subDivisionContainer,
                        btnDivisionReset: _this.btnDivisionReset,
                        btnDivisionVertical: _this.btnDivisionVertical,
                        btnDivisionHorizontal: _this.btnDivisionHorizontal,
                        pagination: _this.pagination,
                        listDiv: _this.listDiv
                    };
                    $.getThis($(this).prop('id'), _thisArr);
                }
                else if (_this.divisionContainerClass != $(this).prop('className')) {
                    _thisArr = $.data(document.getElementById($(this).prop('id')), '$getThis');
                    // console.log(_thisArr);
                    _this.subDivisionContainer = _thisArr['subDivisionContainer'];
                    _this.btnDivisionReset = _thisArr['btnDivisionReset'];
                    _this.btnDivisionVertical = _thisArr['btnDivisionVertical'];
                    _this.btnDivisionHorizontal = _thisArr['btnDivisionHorizontal'];
                    _this.pagination = _thisArr['pagination'];
                    _this.listDiv = _thisArr['listDiv'];
                }
            }

            var setDivision = (function ($) {
                var createWidgets = function () {

                    _this.divisionContainer.jqxSplitter({
                        width: '100%',
                        height: _this.wrap.height() - _this.compareDivHeight,
                        panels: [{
                            size: _this.divisionSize[0],
                            min: _this.divisionSize[1]
                        }, {min: _this.divisionSize[2]}],
                        splitBarSize: 8,
                    }).children('.jqx-splitter-splitbar-vertical').children('.jqx-splitter-collapse-button-vertical').attr('title', common_tooltip_closeCategory);// .attr('title', '카테고리 닫기');

                    /*
					if (parent.location.href == location.href) {
						_this.divisionContainer.jqxSplitter({
							width: '100%',
							height: _this.wrap.height() - _this.compareDivHeight,
							panels: [{ size: _this.divisionSize[0], min: _this.divisionSize[1] }, {min: _this.divisionSize[2]}],
							splitBarSize: 8,
						}).children('.jqx-splitter-splitbar-vertical').children('.jqx-splitter-collapse-button-vertical').attr('title', common_tooltip_closeCategory);// .attr('title', '카테고리 닫기');
					}
					else {
						_this.divisionContainer.jqxSplitter({
							width: '100%',
							height: $('body', parent.document).height() - $('#publish_header', parent.document).height(),
							panels: [{ size: _this.divisionSize[0], min: _this.divisionSize[1] }, {min: _this.divisionSize[2]}],
							splitBarSize: 8,
						}).children('.jqx-splitter-splitbar-vertical').children('.jqx-splitter-collapse-button-vertical').attr('title', common_tooltip_closeCategory);// .attr('title', '카테고리 닫기');
					}
					*/
                    //_this.divisionContainer.on('remove', function() {
                    // $(this).jqxSplitter('destroy');
                    // _this.divisionContainer.off('remove');
                    //});

                };

                _this.divisionContainer.on('collapsed', function (event) {
                    $(this).children('.jqx-splitter-splitbar-vertical').children('.jqx-splitter-collapse-button-vertical').addClass('active').attr('title', common_tooltip_showCategory); // .attr('title', '카테고리 보기');
                }).on('expanded', function (event) {
                    $(this).children('.jqx-splitter-splitbar-vertical').children('.jqx-splitter-collapse-button-vertical').removeClass('active').attr('title', common_tooltip_closeCategory); // .attr('title', '카테고리 닫기');
                });

                return {
                    init: function () {
                        createWidgets();
                    }
                };
            }(jQuery));

            setDivision.init();

            $(window).on("orientationchange resize", function () {
                _this.divisionContainer.height(_this.wrap.height() - _this.compareDivHeight);
                /*
				if (parent.location.href == location.href) {
					_this.divisionContainer.height(_this.wrap.height() - _this.compareDivHeight);
				}
				else {
					_this.divisionContainer.height($('body', parent.document).height() - $('#publish_header', parent.document).height());
				}
				*/
            });
            if (parent.location.href != location.href) {
                $(parent.document).on("orientationchange resize", function () {
                    console.log('resize');
                });
            }


            // if (_this.subDivisionContainer != null) this.subDivisionSet();
            this.subDivisionSet();
            return _this;
        },
        'subDivisionSet': function () {
            var _this = this;
            /*
			if (_this.subDivisionContainer != null) _this.divisionEventSet();
			else {
				_this.btnDivisionReset.off();
				_this.btnDivisionVertical.off();
				_this.btnDivisionHorizontal.off();
			}
			*/
            _this.divisionEventSet();


            if (_this.divisionMode == 'vertical') _this.divisionVertical();
            else if (_this.divisionMode == 'horizontal') _this.divisionHorizontal();
            else if (_this.divisionMode == 'list') _this.divisionReset();
            else _this.divisionReset();


        },
        'divisionEventSet': function () {
            var _this = this;


            $(_this).off('click', '.btn_division_reset').on('click', '.btn_division_reset', function () {
                _this.divisionReset();
            });
            $(_this).off('click', '.btn_division_vertical').on('click', '.btn_division_vertical', function () {
                if ($(this).hasClass('inactive') == true) return false;
                _this.divisionVertical();
            });
            $(_this).off('click', '.btn_division_horizontal').on('click', '.btn_division_horizontal', function () {
                if ($(this).hasClass('inactive') == true) return false;
                _this.divisionHorizontal();
            });
        },
        'divisionReset': function () {
            var _this = this;

            // alert($(_this.subDivisionContainer).length);
            if ($('#publish_' + _this.module + '_content').length == 0) return;
            if ($('#publish_' + _this.module + '_content').jqxSplitter('orientation') != undefined) $('#publish_' + _this.module + '_content').jqxSplitter({showSplitBar: false}).jqxSplitter('collapse');
            $(_this).find('.btn_division_reset').addClass('active');
            $(_this).find('.btn_division_vertical').removeClass('active');
            $(_this).find('.btn_division_horizontal').removeClass('active');

            if ($('#publish_' + _this.module + '_list_wrap') != null) {
                $('#publish_' + _this.module + '_list_wrap').removeClass(_this.divisionVerticalClassName)
                    .parent().parent().removeClass('vertical_n_horizontal');
            }
            if ($('#publish_' + _this.module + '_list_wrap').find('.pagination') != null) {
                $('#publish_' + _this.module + '_list_wrap').find('.pagination').removeClass('vertical');
            }
        },
        'divisionVertical': function () {
            var _this = this;
            if ($('#publish_' + _this.module + '_content').length == 0) return;
            $('#publish_' + _this.module + '_content').jqxSplitter({
                width: '100%',
                height: '100%',
                orientation: 'vertical',
                showSplitBar: true,
                splitBarSize: 8,
                panels: [{
                    size: _this.verticalSize[0],
                    min: _this.verticalSize[1],
                    collapsible: false
                },
                    {
                        min: _this.verticalSize[2],
                        collapsible: true
                    }]
            }).jqxSplitter('expand');

            $(_this).find('.btn_division_reset').removeClass('active');
            $(_this).find('.btn_division_vertical').addClass('active');
            $(_this).find('.btn_division_horizontal').removeClass('active');

            if ($('#publish_' + _this.module + '_list_wrap') != null) {
                $('#publish_' + _this.module + '_list_wrap').addClass(_this.divisionVerticalClassName)
                    .parent().parent().addClass('vertical_n_horizontal');
            }
            if ($('#publish_' + _this.module + '_list_wrap').find('.pagination') != null) {
                $('#publish_' + _this.module + '_list_wrap').find('.pagination').addClass('vertical');
            }


            $('#publish_' + _this.module + '_content').on('collapsed', function (event) {
                $(this).children('.jqx-splitter-splitbar-vertical').children('.jqx-splitter-collapse-button-vertical')
                    .removeClass('active')
                    .attr('title', common_tooltip_showExpendVertical);// .attr('title', '좌우분할 확장 영역 보기');
            }).on('expanded', function (event) {
                $(this).children('.jqx-splitter-splitbar-vertical').children('.jqx-splitter-collapse-button-vertical')
                    .addClass('active')
                    .attr('title', common_tooltip_closeExpendVertical); // .attr('title', '좌우분할 확장 영역 닫기');
            }).children('.jqx-splitter-splitbar-vertical').children('.jqx-splitter-collapse-button-vertical')
                .attr('title', common_tooltip_closeExpendVertical)
                .addClass('active'); // .attr('title', '좌우분할 확장 영역 닫기')
        },
        'divisionHorizontal': function () {
            var _this = this;
            if ($('#publish_' + _this.module + '_content').length == 0) return;
            $('#publish_' + _this.module + '_content').jqxSplitter({
                width: '100%',
                height: '100%',
                orientation: 'horizontal',
                showSplitBar: true,
                splitBarSize: 8,
                panels: [{
                    size: _this.horizontalSize[0],
                    min: _this.horizontalSize[1],
                    collapsible: false
                }, {min: _this.horizontalSize[2], collapsible: true}]
            }).jqxSplitter('expand');

            $(_this).find('.btn_division_reset').removeClass('active');
            $(_this).find('.btn_division_vertical').removeClass('active');
            $(_this).find('.btn_division_horizontal').addClass('active');

            if ($('#publish_' + _this.module + '_list_wrap') != null) {

                //alert(_this.listDiv.parent().parent().prop('className'));
                $('#publish_' + _this.module + '_list_wrap').removeClass(_this.divisionVerticalClassName)
                    .parent().parent().addClass('vertical_n_horizontal');
            }
            if ($('#publish_' + _this.module + '_list_wrap').find('.pagination') != null) {
                $('#publish_' + _this.module + '_list_wrap').find('.pagination').removeClass('vertical');
            }
            $('#publish_' + _this.module + '_content').on('collapsed', function (event) {
                $(this).children('.jqx-splitter-splitbar-horizontal').children('.jqx-splitter-collapse-button-horizontal')
                    .removeClass('active')
                    .attr('title', common_tooltip_showExpendHorizontal); // .attr('title', '상하분할 확장 영역 보기');
            }).on('expanded', function (event) {
                $(this).children('.jqx-splitter-splitbar-horizontal').children('.jqx-splitter-collapse-button-horizontal')
                    .addClass('active')
                    .attr('title', common_tooltip_closeExpendHorizontal); // .attr('title', '상하분할 확장 영역 닫기');
            }).children('.jqx-splitter-splitbar-horizontal').children('.jqx-splitter-collapse-button-horizontal')
                .attr('title', common_tooltip_closeExpendHorizontal)
                .addClass('active'); // .attr('title', '상하분할 확장 영역 닫기');
        }
    };

    $.fn.imgToggleList = function (defaults) {
        defaults = $.extend(
            {
                active: null
                // changeText: true,
                // targetObj: null,
                // compareSet : false,
                // mouseLeaveEvent: false,
                // validateFunc: null,
                // radioValue: null,
                // removeEvent: false,
                // callBackFunc: null
            }, defaults);
        $.getInit(this, imgToggleList, $.extend({}, $.fn.imgToggleList.defaults, defaults));

        return $(this);
    };
    var imgToggleList = {
        'init': function () {
            var _this = this;
            _this.setting();
            return _this;
        },
        'setting': function () {
            var _this = this;
            $(_this).off().on('click', function (event) {
                /*
				if ($(_this).hasClass('disabled') == true) {
					return false;
				}
				if ($(_this).hasClass('inactive') == true) {
					return false;
				}
				*/
                $(this).toggleClass('active');
            }).on('mouseleave', function (event) {
                $(this).removeClass('active');
            });
        }
    };

    $.fn.toggleList = function (defaults) {
        defaults = $.extend(
            {
                active: null,
                eventType: 'click',
                changeText: true,
                targetObj: null,
                // compareSet : false,
                // mouseLeaveEvent: false,
                validateFunc: null,
                radioValue: null,
                removeEvent: false,
                callBackFunc: null
            }, defaults);
        $.getInit(this, toggleList, $.extend({}, $.fn.toggleList.defaults, defaults));

        return $(this);
    };
    var toggleList = {
        'init': function () {
            var _this = this;

            // if ($(_this).attr('id') == 'publish_selectApprovalStemp') alert(1111111);

            _this.setting();

            return _this;
        },
        'setting': function () {
            var _this = this,
                radioValue = _this.config.radioValue,
                i = 0;


            if ($(_this).hasClass('select_type_tree') == false) $(_this).removeClass('active').children('ul').removeClass('active').css({display: 'none'});

            if ($(_this).hasClass('active') == true) _this.toggle('active', $(_this).prop('className'));

            $(_this).off().on('click', function (event) {

                if ($(_this).hasClass('disabled') == true) {
                    return false;
                }
                if ($(_this).hasClass('inactive') == true) {
                    return false;
                }

                // 2016-05-23 주석처리
                /*
				if ($(event.target).hasClass('callback') == true) {
					$(_this).children('ul').css({ display : 'none' });
					_this.config.callBackFunc($(event.target));
					return false;
				}
				*/

                var parentObj = $(_this).parent(),
                    parentDep = $(this).parentsUntil('.overflow').length - 1,
                    overflowContainer = $($(this).parentsUntil('.overflow')[parentDep]);

                // overflowContainer = $(this).closest('.overflow');
                // alert(overflowContainer);
                if (parentObj.prop('tagName') == 'LI') {// 메일 조회에서 예외처리
                    parentObj.parent().children('li').css({'z-index': 1});
                    parentObj.css({'z-index': parentObj.parent().children('li').length});
                    var targetWidth = $(_this).position().left + $(_this).children('ul').width(),
                        parentWidth = parentObj.parent().outerWidth();
                    if (targetWidth > parentWidth) {
                        if (parentObj.parent().position().left > 0) $(_this).children('ul').css({left: -1});
                        else $(_this).children('ul').css({left: 0 - (targetWidth - parentWidth)});
                    }
                }

                if ($(_this).closest('li.else_index').length > 0) {
                    $(_this).closest('li.else_index').parent().find('li').css({'z-index': 10});
                    $(_this).closest('li.else_index').css({'z-index': 999});
                }

                if ($(this).hasClass('fixing_position') == false && $(this).hasClass('top_position') == false) {
                    if (overflowContainer.prop('tagName') != 'HTML' && overflowContainer.length > 0) {
                        var containerHeight = overflowContainer.parent().outerHeight();
                        //alert(containerHeight);
                        var containerTop = overflowContainer.parent().offset().top;
                        var thisTop = $(_this).offset().top - containerTop + 23 + $(_this).children('ul').outerHeight();

                        if (containerHeight < thisTop) {
                            if ($(_this).offset().top - containerTop < $(_this).children('ul').outerHeight()) {
                                if ($(_this).children('a').css('display') == 'inline') $(_this).children('ul').css({top: $(_this).children('a').outerHeight() + 2});
                                else $(_this).children('ul').css({top: 0 - $(_this).children('ul').outerHeight()});
                            }
                            else $(_this).children('ul').css({top: 0 - $(_this).children('ul').outerHeight()})
                        }
                        else {
                            if ($(_this).children('a').css('display') == 'inline') $(_this).children('ul').css({top: $(_this).children('a').outerHeight() + 2});
                            else $(_this).children('ul').css({top: 23});
                        }
                    }
                    else {
                        if ($(_this).hasClass('none_border') == true) $(_this).children('ul').css({top: 24});
                        else $(_this).children('ul').css({top: 23});
                    }
                }
                else if ($(this).hasClass('top_position') == true) {
                    $(_this).children('ul').css({top: 0 - $(_this).children('ul').outerHeight()});
                }
                if ($(_this).hasClass('contents_list_option') == true) {// 모든 메일을 클릭시 예외처리
                    $(_this).children('ul').css('top', $(_this).children('a').outerHeight());
                }
                if ($(_this).hasClass('add_portlet_wrap') == true) {// 포틀릿 추가 예외처리
                    $(_this).children('ul').css('top', 24);
                }


                _this.toggle('active', $(event.target).prop('className'));

                if ($(_this).closest('#publish_util').length == 1) $(_this).children('ul').css({top: 24});
                if (parentObj.prop('className') == 'lnb') $(_this).children('ul').css({top: 38});

                // &.type_01
                if ($(_this).hasClass('type_01') == true) {
                    if ($(this).outerWidth() > $(_this).children('ul').outerWidth()) $(_this).children('ul').outerWidth($(this).outerWidth());
                }
            });


            if (_this.config.changeText == true) {
                $(_this).find('li').children('a').on('click', function (event) {
                    if ($(event.target).hasClass('callback') == true) {
                        //_this.toggle();
                        //alert(2);
                        //$(_this).children('ul').css({ display : 'none' });
                        // $(_this).children('ul').hide();
                        _this.config.callBackFunc($(event.target));
                        return false;
                        //return false;
                    }
                    if (_this.config.validateFunc != null) {// toggleList 유효성 체크
                        var validateBoolean = _this.config.validateFunc($(this));
                        if (validateBoolean != '') {
                            $.publish.msgSet(validateBoolean, 'alert');
                            return;
                        }
                    }

                    if ($(this).hasClass('else_type') == true) {
                        // return false;
                    }
                    else {
                        $(_this).children('ul').children('li').removeClass('selected');
                        $(this).parent().addClass('selected');
                        $(_this).children('.arrow').children('span').text($(this).text());
                    }
                });
                $(_this).find('li').children('label').on('click', function (event) {
                    if ($(event.target).hasClass('callback') == true) {
                        //alert(3);
                        $(_this).children('ul').hide();
                        _this.config.callBackFunc($(event.target));
                        return false;
                    }
                    $(_this).children('ul').children('li').removeClass('selected').children('input[type=radio]').prop('checked', false);
                    $(this).parent().addClass('selected').children('input[type=radio]').prop('checked', true);
                    $(_this).children('.arrow').children('span').text($(this).text());

                    if ($(_this).hasClass('type_select_img') == true) {
                        $(_this).children('ul').children('li').removeClass('selected');
                        $(this).parent().addClass('selected');
                        $(_this).children('.arrow').children('span').removeClass().addClass($(this).prop('className')).html($(this).html());
                    }

                    if ($(_this).hasClass('type_calendar') == true) {
                        $(_this).children('.type_calendar_bg').removeClass().addClass('type_calendar_bg ' + $(this).parent().children('.checkbox_label').prop('className')).removeClass('checkbox_label');
                    }
                    event.stopPropagation();
                });
            }

            var listUl = $(_this).children('ul');
            var length = listUl.children('li').length;
            var radioObj;

            if (_this.config.active != null) {
                $(_this).find('li').children('input[type=radio]').prop('checked', false);
                if (radioValue == null) {
                    $(_this).children('.arrow').children('span').text($(_this).find('li:eq(' + (_this.config.active - 1) + ')').addClass('selected').text());
                    $(_this).find('li:eq(' + (_this.config.active - 1) + ')').children('input[type=radio]').prop('checked', true);
                }
                else if (radioValue != null) {
                    for (i = 0; i < length; i++) {
                        radioObj = listUl.children('li:eq(' + i + ')').children('input[type=radio]');
                        listUl.children('li:eq(' + i + ')').removeClass('selected');
                        if (radioObj.val() == radioValue) {
                            listUl.children('li:eq(' + i + ')').addClass('selected');
                            $(_this).children('.arrow').children('span').html(listUl.children('li:eq(' + i + ')').text());
                            radioObj.prop('checked', true);

                            //break;
                        }
                    }
                }
            }
            else if (radioValue != null) {
                $(_this).find('li').children('input[type=radio]').prop('checked', false);
                for (i = 0; i < length; i++) {
                    radioObj = listUl.children('li:eq(' + i + ')').children('input[type=radio]');
                    listUl.children('li:eq(' + i + ')').removeClass('selected');
                    if (radioObj.val() == radioValue) {
                        listUl.children('li:eq(' + i + ')').addClass('selected');
                        $(_this).children('.arrow').children('span').html(listUl.children('li:eq(' + i + ')').text());
                        radioObj.prop('checked', true);

                        if ($(_this).hasClass('type_calendar') == true) {
                            $(_this).children('.arrow').children('span').html(listUl.children('li:eq(' + i + ')').children('.checkbox_label').text())
                                .parent().parent().children('.type_calendar_bg')
                                .removeClass()
                                .addClass('type_calendar_bg ' + listUl.children('li:eq(' + i + ')').children('.checkbox_label').prop('className'))
                                .removeClass('checkbox_label');
                        }


                        if ($(_this).hasClass('type_select_img') == true) {
                            $(_this).children('ul').children('li').removeClass('selected');
                            $(this).parent().addClass('selected');
                            var labelObj = listUl.children('li:eq(' + i + ')').children('label');
                            $(_this).children('.arrow').children('span').removeClass().addClass(labelObj.prop('className')).html(labelObj.html());
                        }
                        //break;
                    }
                }
            }
            else {
                //console.log(listUl.html());
                //listUl.children('li').removeClass('selected');// 2016-05-03 추가
                listUl.children('li:eq(0)').addClass('selected');
                //if (_this.config.changeText == true) {/////////////////////////////////////////////////////// 2016-05-03 추가
                //	$(_this).children('.arrow').children('span').text(listUl.children('li.selected').text());
                //}
            }

            // 타모듈에서 게시글 전달 : mouse_leave_false 클래스가 존재할때 마우스 아웃의 닫기 처리 안함
            if ($(_this).hasClass('mouse_leave_false') == true) {

                if (_this.config.targetObj == null) _this.config.targetObj = $(_this).children('ul');

                $(_this).on('outsideclick', function (event) {
                    //alert(targetObj.prop);
                    if (_this.config.targetObj.css('display') == 'block') _this.toggle('active', $(event.target).prop('className'));
                });
            }

        },
        'toggle': function (eventType, eventTargetClassName) {
            var _this = this,
                listObj = $(_this).children('ul:eq(0)');


            if (_this.config.targetObj != null) listObj = _this.config.targetObj;

            //if ($(_this).hasClass('select_type_tree') == true) {
            //	listObj = $(_this).children('div');
            //}


            $(_this).off('mouseleave', _this.listMouseLeaveHandler);
            $(_this).children('.arrow, button').removeClass('active');


            if (eventType == 'active') {
                if (listObj.css('display') == 'none') {
                    //alert(1);
                    //alert(listObj.outerHTML());

                    // $(_this).addClass('active').children('.arrow, button').addClass('active');

                    //listObj.css({ display : 'block' });
                    //alert(listObj.css('display'));
                }
            }


            if (eventTargetClassName != 'fancytree-expander') {
                listObj.stop();
                listObj.toggle();
                $(_this).toggleClass('active');
                listObj.toggleClass('active');
            }


            //alert(listObj.css('display') + '         ' + eventTargetClassName);


            if (listObj.css('display') == 'block') {
                setTimeout(function () {
                    if ($(_this).hasClass('mouse_leave_false') == false) $(_this).on('mouseleave', _this.listMouseLeaveHandler);
                }, 10);
            }


        },
        'listMouseLeaveHandler': function (event) {
            var _this = this;
            _this.toggle();
            $(_this).off('mouseleave', _this.listMouseLeaveHandler);
        }
    };


    $.fn.lnbSet = function (defaults) {
        defaults = $.extend(
            {
                active: null,
            }, defaults);
        $.getInit(this, lnbSet, $.extend({}, $.fn.lnbSet.defaults, defaults));
    };
    var lnbSet = {
        'init': function () {
            var _this = this;
            _this.activePageSet();
            // _this.windowResize();
        },
        'activePageSet': function () {

            var _this = this;
            if (_this.config.active != null) {

                var activeStr = _this.config.active,
                    activeLi = $('#publish_lnb_' + activeStr);

                $('#publish_lnb').children('li').removeClass('active_page');
                activeLi.addClass('active_page');

                // _this.changeLiSet();
            }

            $('html').css({'overflow-y': 'hidden'});

            //return _this;
        },
        'changeLiSet': function () {
            var _this = this,
                activeLi = $(_this).children('li.active_page'),
                liLength = $(_this).children('li').length;


            if (activeLi.length > 0) {
                //console.log(11111111111111111);
                if (activeLi.offset().top > 30) {
                    for (var i = liLength - 1; i > 0; i--) {
                        var li = $(_this).children('li:eq(' + i + ')');
                        li.css({'visibility': 'hidden'});
                        if (li.offset().top < 30) {
                            activeLi.insertBefore(li);
                            activeLi.css({'visibility': 'visible'});
                            // li.hide();
                            break;
                        }
                    }
                }

            }


            // setTimeout(function(){
            for (var k = 0; k < liLength; k++) {
                var liObj = $(_this).children('li:eq(' + k + ')');
                liObj.removeClass('none');

                //console.log(liObj.text(), liObj.offset().top );

                if (liObj.offset().top > 30) {
                    liObj.css({'visibility': 'hidden'});
                }
                else if (liObj.offset().top < 30) {
                    liObj.css({'visibility': 'visible'});
                }
            }
            // }, 10);


            /*

			if ($(_this).outerHeight() > 30) {




			}

			*/


        },
        'windowResize': function () {
            var _this = this;
            $(window).off('orientationchange.lnbReset2 resize.lnbReset2').on('orientationchange.lnbReset2 resize.lnbReset2', function () {
                _this.changeLiSet();
            });
        }
    }

    /////////////////////////////////////////////////////////////////////////////////////////////
    $.fn.navigation = function (defaults) {

        defaults = $.extend(
            {
                active: null,
                variableObj: [],
                minusWidth: 0,
                compareObj: null,
                eventBoolean: false,
                changeTab: false
                //tabSelect: null
            }, defaults);


        $.getInit(this, navigation, $.extend({}, $.fn.navigation.defaults, defaults));
    };
    var navigation = {
        'init': function () {

            var _this = this;// ul
            if ($(_this).prop('id') == 'publish_lnb') {
                _this.config.variableObj = [$('.btn_all_navi'), $('.comm_navi')];
                _this.config.minusWidth = 30;
                var publish_lnb = $('#publish_lnb');
                if (typeof _this.config.active == 'string') {
                    for (var i = 0; i < publish_lnb.children('li').length; i++) {
                        if (publish_lnb.children('li:eq(' + i + ')').prop('id') == _this.config.active) _this.config.active = i;
                    }
                    _this.resizeSetting();
                }

                $('.wrap').children('.main_container').addClass('none');
                $('.wrap').children('.mypage_container').addClass('none');
                $('.wrap').children('.container').addClass('none');

                $('.main_container').removeClass('active_page');
                if (_this.config.active == 'home') {
                    $('html').css({'overflow-y': 'hidden'});
                    $('.main_container').addClass('active_page');
                    $('.container, .mypage_container').removeClass('active_page');
                }
                else if (_this.config.active == 'mypage') {
                    $('html').css({'overflow-y': 'hidden'});
                    $('.mypage_container').addClass('active_page');
                    $('.container, .main_container').removeClass('active_page');
                }
                else {
                    $('html').css({'overflow-y': 'hidden'});
                }

                if (_this.config.active != null) {
                    if (_this.config.active != 'home' && _this.config.active != 'mypage') _this.activeSetting();
                }

                if (_this.config.eventBoolean == true) {
                    _this.eventHandler();
                    var onLength = publish_lnb.children('.on').length,
                        activeIndex = publish_lnb.children('.active_page').index();
                    if (onLength - 1 < activeIndex) {
                        _this.changeTabEvent(activeIndex - onLength);
                    }
                }
            }


            $(window).on("orientationchange resize", function () {
                _this.resizeSetting();
            });
            $(_this).parent().children('.more_list').toggleList();

            _this.resizeSetting();
        },
        'setting': function () {
            return _this;
        },
        'resizeSetting': function () {
            var _this = this,
                variableArr = _this.config.variableObj,
                variableWidth = 0,
                compareObj = _this.config.compareObj,
                parentObj = $(_this).parent(),
                thisLenght = $(_this).children('li').length,
                checkWidth = 0,
                newList = [],
                newListId = [],
                maxWidth = 0,
                i;

            // console.log(variableArr);

            if (variableArr == undefined) var variableLength = 0;
            else var variableLength = variableArr.length;


            if (variableLength) {
                for (i = 0; i < variableLength; i++) {
                    variableWidth = variableWidth + _this.config.variableObj[i].outerWidth();
                }
                variableWidth = variableWidth + _this.config.minusWidth;
            }
            if (compareObj == null) compareObj = parentObj;
            maxWidth = (variableWidth == 0) ? compareObj.width() - _this.config.minusWidth : compareObj.width() - variableWidth;


            $(_this).children('li').addClass('on');

            for (i = 0; i < thisLenght; i++) {
                checkWidth = checkWidth + $(_this).children('li:eq(' + i + ')').outerWidth();

                if (maxWidth < checkWidth) {
                    if (_this.config.changeTab == true) {// 더보기 클릭시 lnb 메뉴 자리 이동
                        if ($(_this).children('li:eq(' + i + ')').hasClass('active_page') == true) {
                            prevNum = i - 1,
                                prevLi = $(_this).children('li:eq(' + prevNum + ')'),
                                prevCode = prevLi.html();

                            $(_this).children('li:eq(' + i + ')').removeClass('active_page on');
                            prevLi.html($(_this).children('li:eq(' + i + ')').html());
                            prevLi.addClass('active_page on');

                            var prevId = prevLi.prop('id');

                            prevLi.attr({'id': $(_this).children('li:eq(' + i + ')').prop('id')});
                            $(_this).children('li:eq(' + i + ')').attr({'id': prevId}).html(prevCode);
                            _this.config.active = prevNum;
                        }
                        else {
                            $(_this).children('li:eq(' + i + ')').removeClass('on');
                            newList.push($(_this).children('li:eq(' + i + ')').html());
                            newListId.push($(_this).children('li:eq(' + i + ')').prop('id').substr($(_this).children('li:eq(' + i + ')').prop('id').lastIndexOf('_') + 1));
                        }
                    }
                    else {
                        $(_this).children('li:eq(' + i + ')').removeClass('on');
                        newList.push($(_this).children('li:eq(' + i + ')').html());
                    }
                }
            }
            var moreList = parentObj.children('.more_list'),
                moreListArrow = moreList.children('.arrow');
            if (maxWidth < checkWidth) {
                if (!moreList.children('ul').length) {
                    moreList.append('<ul></ul>');
                    if (_this.config.changeTab == true) _this.changeTabEventHandler();
                }
                else moreList.children('ul').html('');
                var moreListUl = moreList.children('ul');
                for (i = 0; i < newList.length; i++) {
                    if (_this.config.changeTab == true) {
                        moreListUl.append('<li id="publish_moreList_' + newListId[i] + '">' + newList[i] + '</li>');//  id="lnb_' + (i + 10) + '" class="history_tab"
                    }
                    else moreListUl.append('<li>' + newList[i] + '</li>');
                }
                moreListArrow.addClass('on');
            }
            else {
                moreList.children('ul').html('');
                moreListArrow.removeClass('on');
            }


            /////////////////////////////////////////////////// 알림, 대화방 목록 관련
            var publish_viewBtnNotifi = $('#publish_viewBtnNotifi, #publish_viewBtnChatting');
            var notice = publish_viewBtnNotifi.children('.notice');
            notice.css({height: $('html').height() - $('#publish_header').outerHeight()});
            ///////////////////////////////////////////////////


        },
        'changeTabEventHandler': function () {
            var _this = this,
                moreList = $('.lnb').children('.more_list').children('ul');
            moreList.on('click', function (event) {
                if ($(event.target).prop('tagName') == 'A') _this.changeTabEvent($(event.target).parent().index());
            });
        },
        'changeTabEvent': function (index) {
            var _this = this,
                moreList = $('.lnb').children('.more_list').children('ul');

            $('.main_container').removeClass('active_page');

            var thisIndex = index,
                listLength = $(_this).children('li').length,
                i,
                ulLastNum,
                displayContainerNum,
                displayCode;

            ulLastNum = listLength - moreList.children('li').length - 1;
            displayContainerNum = ulLastNum + thisIndex + 1;

            eventTargetLi = moreList.children('li:eq(' + index + ')');

            sendTargetLi = $(_this).children('li:eq(' + ulLastNum + ')');

            displayCode = eventTargetLi.html();

            for (i = displayContainerNum; i > ulLastNum; i--) {
                if (i == displayContainerNum) {
                    var prevId = $(_this).children('li:eq(' + i + ')').prop('id');
                }
                $(_this).children('li:eq(' + i + ')').attr({'id': $(_this).children('li:eq(' + (i - 1) + ')').prop('id')}).html($(_this).children('li:eq(' + (i - 1) + ')').html());
            }

            sendTargetLi.html(displayCode).attr({'id': prevId});
            for (i = 0; i < listLength; i++) {
                if (ulLastNum == i) {
                    $(_this).children('li:eq(' + i + ')').addClass('active_page');
                    _this.config.active = i;
                    _this.activeSetting();
                    break;
                }
            }
            _this.resizeSetting();
        },
        'activeSetting': function () {
            var _this = this,
                thisActive = _this.config.active;
            if (thisActive != null) {
                $(_this).children('li').removeClass('active_page');
                $('.container').removeClass('active_page');

                var activeId = $(_this).children('li:eq(' + thisActive + ')').prop('id');
                var containerActiveId = $('.container:eq(' + thisActive + ')').prop('id');
                var activeModuleStr = activeId.substr(activeId.lastIndexOf('_') + 1);

                $(_this).children('li:eq(' + thisActive + ')').addClass('active_page');
                $('#publish_' + activeModuleStr + '_container').addClass('active_page');

                if ($(_this).prop('id') == 'publish_lnb') thisContainer = $('#publish_' + activeModuleStr + '_container');
            }
        },
        'eventHandler': function () {
            var _this = this;
            $(_this).children('li').on('mouseenter', function () {
                $(this).addClass('active');
                $(_this).children('li:eq(' + _this.config.active + ')').removeClass('active_page');
            });
            $(_this).children('li').on('mouseleave', function () {
                $(this).removeClass('active');
                $(_this).children('li:eq(' + _this.config.active + ')').addClass('active_page');
            });

            $(_this).children('li').on('click', function (event) {
                location.href = event.target.href;


                var thisIndex = $(this).index(),
                    listLength = $(_this).children('li').length,
                    _thisActive = _this.config.active,
                    eventTarget = $(event.target),
                    className = eventTarget.prop('className'),
                    I;
                $('.main_container, .mypage_container').removeClass('active_page');
                if (className != 'btn_close') {
                    for (i = 0; i < listLength; i++) {
                        if (thisIndex == i) {
                            _this.config.active = i;
                            _this.activeSetting();
                            break;
                        }
                    }
                    //if (eventTarget.parent().parent().prop('id') == '')
                    //{
                    //alert(eventTarget.parent().parent().parent().children('a:eq(0)').html() + ' ' + '   -    sub index : ' + eventTarget.parent().index());
                    //}
                }
                else if (className == 'btn_close') {
                    var thisActive, activeId, activeModuleStr;

                    if (thisIndex == _this.config.active) {
                        if ($(_this).children('li').length == 1) {
                            $.publish.alertE(common_desc_notDeleteLasyTabPlz);
                            // '마지막 남은 탭은 삭제 하실수 없습니다.'
                        }
                        else {
                            activeId = $(this).prop('id');
                            activeModuleStr = activeId.substr(activeId.lastIndexOf('_') + 1);

                            $(this).remove();
                            $('#publish_' + activeModuleStr + '_container').remove();

                            if ($(_this).children('li').length > _this.config.active) _this.config.active = thisIndex;
                            else if ($(_this).children('li').length > _this.config.active) _this.config.active = thisIndex + 1;
                            else _this.config.active = thisIndex - 1;

                            thisActive = _this.config.active;
                            activeId = $(_this).children('li:eq(' + thisActive + ')').prop('id');
                            activeModuleStr = activeId.substr(activeId.lastIndexOf('_') + 1);
                            $(_this).children('li:eq(' + thisActive + ')').addClass('active_page');
                            $('#publish_' + activeModuleStr + '_container').addClass('active_page');
                        }
                    }
                    else {
                        activeId = $(_this).children('li:eq(' + thisIndex + ')').prop('id');
                        activeModuleStr = activeId.substr(activeId.lastIndexOf('_') + 1);

                        $(_this).children('li:eq(' + thisIndex + ')').remove();
                        $('#publish_' + activeModuleStr + '_container').remove();

                        if (thisIndex < _thisActive) _this.config.active = _this.config.active - 1;
                        else {
                            activeId = $(_this).children('li:eq(' + _thisActive + ')').prop('id');
                            activeModuleStr = activeId.substr(activeId.lastIndexOf('_') + 1);
                            $(_this).children('li:eq(' + _thisActive + ')').addClass('active_page');
                            $('#publish_' + activeModuleStr + '_container').addClass('active_page');
                        }
                    }
                }
                _this.resizeSetting();

            });


            $('.home').on('click', function () {
                $(_this).children('li').removeClass('active_page');
                $('.container, .mypage_container').removeClass('active_page');
                _this.config.active = null;
                _this.resizeSetting();
                $('.main_container').addClass('active_page');
            });

            $('.mypage').on('click', function () {
                $(_this).children('li').removeClass('active_page');
                //$('.container, .main_container').removeClass('active_page');// 2015-12-16 윤태성 차장 요청으로 주석처리
                _this.config.active = null;
                _this.resizeSetting();
                //$('.mypage_container').addClass('active_page');// 2015-12-16 윤태성 차장 요청으로 주석처리
            });
        }
    };


    /////////////////////////////////////////////////////////////////////////////////////////////
    $.fn.navigation2 = function (defaults) {

        defaults = $.extend(
            {
                active: null,
                variableObj: [],
                minusWidth: 0,
                compareObj: null,
                eventBoolean: false,
                changeTab: false
                //tabSelect: null
            }, defaults);


        $.getInit(this, navigation2, $.extend({}, $.fn.navigation2.defaults, defaults));
    };
    var navigation2 = {
        'init': function () {

            var _this = this;// ul
            if ($(_this).prop('id') == 'publish_lnb') {
                _this.config.variableObj = [$('.btn_all_navi'), $('.comm_navi')];
                _this.config.minusWidth = 30;
                var publish_lnb = $('#publish_lnb');
                if (typeof _this.config.active == 'string') {
                    for (var i = 0; i < publish_lnb.children('li').length; i++) {
                        if (publish_lnb.children('li:eq(' + i + ')').prop('id') == _this.config.active) _this.config.active = i;
                    }
                    _this.resizeSetting();
                }
                /*
				$('.wrap').children('.main_container').addClass('none');
				$('.wrap').children('.mypage_container').addClass('none');
				$('.wrap').children('.container').addClass('none');

				$('.main_container').removeClass('active_page');
				if (_this.config.active == 'home') {
					$('html').css({ 'overflow-y' : 'hidden' });
					$('.main_container').addClass('active_page');
					$('.container, .mypage_container').removeClass('active_page');
				}
				else if (_this.config.active == 'mypage') {
					$('html').css({ 'overflow-y' : 'hidden' });
					$('.mypage_container').addClass('active_page');
					$('.container, .main_container').removeClass('active_page');
				}
				else {
					$('html').css({ 'overflow-y' : 'hidden' });
				}
				*/

                $('html').css({'overflow-y': 'hidden'});


                if (_this.config.active != null) {
                    if (_this.config.active != 'home' && _this.config.active != 'mypage') _this.activeSetting();
                }

                if (_this.config.eventBoolean == true) {
                    _this.eventHandler();
                    var onLength = publish_lnb.children('.on').length,
                        activeIndex = publish_lnb.children('.active_page').index();
                    if (onLength - 1 < activeIndex) {
                        _this.changeTabEvent(activeIndex - onLength);
                    }
                }
            }

            $(window).on("orientationchange resize", function () {
                _this.resizeSetting();
            });

            $(_this).parent().children('.more_list').toggleList();

            _this.resizeSetting();
        },
        'setting': function () {
            return _this;
        },
        'resizeSetting': function () {
            var _this = this,
                variableArr = _this.config.variableObj,
                variableLength = variableArr.length,
                variableWidth = 0,
                compareObj = _this.config.compareObj,
                parentObj = $(_this).parent(),
                thisLenght = $(_this).children('li').length,
                checkWidth = 0,
                newList = [],
                newListId = [],
                maxWidth = 0,
                i;
            if (variableLength) {
                for (i = 0; i < variableLength; i++) {
                    variableWidth = variableWidth + _this.config.variableObj[i].outerWidth();
                }
                variableWidth = variableWidth + _this.config.minusWidth;
            }
            if (compareObj == null) compareObj = parentObj;
            maxWidth = (variableWidth == 0) ? compareObj.width() - _this.config.minusWidth : compareObj.width() - variableWidth;


            $(_this).children('li').addClass('on');

            for (i = 0; i < thisLenght; i++) {
                checkWidth = checkWidth + $(_this).children('li:eq(' + i + ')').outerWidth();

                if (maxWidth < checkWidth) {
                    if (_this.config.changeTab == true) {// 더보기 클릭시 lnb 메뉴 자리 이동
                        if ($(_this).children('li:eq(' + i + ')').hasClass('active_page') == true) {
                            prevNum = i - 1,
                                prevLi = $(_this).children('li:eq(' + prevNum + ')'),
                                prevCode = prevLi.html();

                            $(_this).children('li:eq(' + i + ')').removeClass('active_page on');
                            prevLi.html($(_this).children('li:eq(' + i + ')').html());
                            prevLi.addClass('active_page on');

                            var prevId = prevLi.prop('id');

                            prevLi.attr({'id': $(_this).children('li:eq(' + i + ')').prop('id')});
                            $(_this).children('li:eq(' + i + ')').attr({'id': prevId}).html(prevCode);
                            _this.config.active = prevNum;
                        }
                        else {
                            $(_this).children('li:eq(' + i + ')').removeClass('on');
                            newList.push($(_this).children('li:eq(' + i + ')').html());
                            newListId.push($(_this).children('li:eq(' + i + ')').prop('id').substr($(_this).children('li:eq(' + i + ')').prop('id').lastIndexOf('_') + 1));
                        }
                    }
                    else {
                        $(_this).children('li:eq(' + i + ')').removeClass('on');
                        newList.push($(_this).children('li:eq(' + i + ')').html());
                    }
                }
            }
            var moreList = parentObj.children('.more_list'),
                moreListArrow = moreList.children('.arrow');
            if (maxWidth < checkWidth) {
                if (!moreList.children('ul').length) {
                    moreList.append('<ul></ul>');
                    if (_this.config.changeTab == true) _this.changeTabEventHandler();
                }
                else moreList.children('ul').html('');
                var moreListUl = moreList.children('ul');
                for (i = 0; i < newList.length; i++) {
                    if (_this.config.changeTab == true) {
                        moreListUl.append('<li id="publish_moreList_' + newListId[i] + '">' + newList[i] + '</li>');//  id="lnb_' + (i + 10) + '" class="history_tab"
                    }
                    else moreListUl.append('<li>' + newList[i] + '</li>');
                }
                moreListArrow.addClass('on');
            }
            else {
                moreList.children('ul').html('');
                moreListArrow.removeClass('on');
            }
        },
        'changeTabEventHandler': function () {
            var _this = this,
                moreList = $('.lnb').children('.more_list').children('ul');
            moreList.on('click', function (event) {
                if ($(event.target).prop('tagName') == 'A') _this.changeTabEvent($(event.target).parent().index());
            });
        },
        'changeTabEvent': function (index) {
            var _this = this,
                moreList = $('.lnb').children('.more_list').children('ul');

            // $('.main_container').removeClass('active_page');

            var thisIndex = index,
                listLength = $(_this).children('li').length,
                i,
                ulLastNum,
                displayContainerNum,
                displayCode;

            ulLastNum = listLength - moreList.children('li').length - 1;
            displayContainerNum = ulLastNum + thisIndex + 1;

            eventTargetLi = moreList.children('li:eq(' + index + ')');

            sendTargetLi = $(_this).children('li:eq(' + ulLastNum + ')');

            displayCode = eventTargetLi.html();

            for (i = displayContainerNum; i > ulLastNum; i--) {
                if (i == displayContainerNum) {
                    var prevId = $(_this).children('li:eq(' + i + ')').prop('id');
                }
                $(_this).children('li:eq(' + i + ')').attr({'id': $(_this).children('li:eq(' + (i - 1) + ')').prop('id')}).html($(_this).children('li:eq(' + (i - 1) + ')').html());
            }

            sendTargetLi.html(displayCode).attr({'id': prevId});
            for (i = 0; i < listLength; i++) {
                if (ulLastNum == i) {
                    $(_this).children('li:eq(' + i + ')').addClass('active_page');
                    _this.config.active = i;
                    _this.activeSetting();
                    break;
                }
            }
            _this.resizeSetting();
        },
        'activeSetting': function () {
            var _this = this,
                thisActive = _this.config.active;
            if (thisActive != null) {
                $(_this).children('li').removeClass('active_page');
                //$('.container').removeClass('active_page');

                var activeId = $(_this).children('li:eq(' + thisActive + ')').prop('id');
                var containerActiveId = $('.container:eq(' + thisActive + ')').prop('id');
                var activeModuleStr = activeId.substr(activeId.lastIndexOf('_') + 1);

                $(_this).children('li:eq(' + thisActive + ')').addClass('active_page');
                // $('#publish_' + activeModuleStr + '_container').addClass('active_page');

                if ($(_this).prop('id') == 'publish_lnb') thisContainer = $('#publish_' + activeModuleStr + '_container');
            }
        },
        'eventHandler': function () {
            var _this = this;
            $(_this).children('li').on('mouseenter', function () {
                $(this).addClass('active');
                $(_this).children('li:eq(' + _this.config.active + ')').removeClass('active_page');
            });
            $(_this).children('li').on('mouseleave', function () {
                $(this).removeClass('active');
                $(_this).children('li:eq(' + _this.config.active + ')').addClass('active_page');
            });

            $(_this).children('li').on('click', function (event) {
                location.href = event.target.href;


                var thisIndex = $(this).index(),
                    listLength = $(_this).children('li').length,
                    _thisActive = _this.config.active,
                    eventTarget = $(event.target),
                    className = eventTarget.prop('className'),
                    I;
                // $('.main_container, .mypage_container').removeClass('active_page');

                if (className != 'btn_close') {
                    for (i = 0; i < listLength; i++) {
                        if (thisIndex == i) {
                            _this.config.active = i;
                            _this.activeSetting();
                            break;
                        }
                    }
                    //if (eventTarget.parent().parent().prop('id') == '')
                    //{
                    //alert(eventTarget.parent().parent().parent().children('a:eq(0)').html() + ' ' + '   -    sub index : ' + eventTarget.parent().index());
                    //}
                }
                else if (className == 'btn_close') {
                    var thisActive, activeId, activeModuleStr;

                    if (thisIndex == _this.config.active) {
                        if ($(_this).children('li').length == 1) {
                            $.publish.alertE(common_desc_notDeleteLasyTabPlz);
                            // '마지막 남은 탭은 삭제 하실수 없습니다.'
                        }
                        else {
                            activeId = $(this).prop('id');
                            activeModuleStr = activeId.substr(activeId.lastIndexOf('_') + 1);

                            $(this).remove();
                            // $('#publish_' + activeModuleStr + '_container').remove();

                            if ($(_this).children('li').length > _this.config.active) _this.config.active = thisIndex;
                            else if ($(_this).children('li').length > _this.config.active) _this.config.active = thisIndex + 1;
                            else _this.config.active = thisIndex - 1;

                            thisActive = _this.config.active;
                            activeId = $(_this).children('li:eq(' + thisActive + ')').prop('id');
                            activeModuleStr = activeId.substr(activeId.lastIndexOf('_') + 1);
                            $(_this).children('li:eq(' + thisActive + ')').addClass('active_page');
                            // $('#publish_' + activeModuleStr + '_container').addClass('active_page');
                        }
                    }
                    else {
                        activeId = $(_this).children('li:eq(' + thisIndex + ')').prop('id');
                        activeModuleStr = activeId.substr(activeId.lastIndexOf('_') + 1);

                        $(_this).children('li:eq(' + thisIndex + ')').remove();
                        // $('#publish_' + activeModuleStr + '_container').remove();

                        if (thisIndex < _thisActive) _this.config.active = _this.config.active - 1;
                        else {
                            activeId = $(_this).children('li:eq(' + _thisActive + ')').prop('id');
                            activeModuleStr = activeId.substr(activeId.lastIndexOf('_') + 1);
                            $(_this).children('li:eq(' + _thisActive + ')').addClass('active_page');
                            // $('#publish_' + activeModuleStr + '_container').addClass('active_page');
                        }
                    }
                }
                _this.resizeSetting();

            });


            $('.home').on('click', function () {
                $(_this).children('li').removeClass('active_page');
                //$('.container, .mypage_container').removeClass('active_page');
                _this.config.active = null;
                _this.resizeSetting();
                //$('.main_container').addClass('active_page');
            });

            $('.mypage').on('click', function () {
                $(_this).children('li').removeClass('active_page');
                //$('.container, .main_container').removeClass('active_page');// 2015-12-16 윤태성 차장 요청으로 주석처리
                _this.config.active = null;
                _this.resizeSetting();
                //$('.mypage_container').addClass('active_page');// 2015-12-16 윤태성 차장 요청으로 주석처리
            });
        }
    };


    /////////////////////////////////////////////////////////////////////////////////////////////
    $.fn.tabSetting = function (defaults) {
        defaults = $.extend(
            {
                active: 0,
                tabContents: null,
                toggleEvent: false// 양식편집기 3. 결재 상태별 연동 에서 사용
            }, defaults);
        $.getInit(this, tabSetting, $.extend({}, $.fn.tabSetting.defaults, defaults));
    };
    var tabSetting = {
        'init': function () {
            var _this = this;
            _this.setting().eventHandler();
        },
        'setting': function () {
            var _this = this,
                activeNum = _this.config.active,
                tabWrap;
            if (_this.config.tabContents) tabWrap = _this.config.tabContents;
            else tabWrap = $(_this).parent();
            $(_this).children('li').removeClass('tab_active');
            tabWrap.children('.tab_contents').removeClass('tab_active');
            $(_this).children('li:eq(' + activeNum + ')').addClass('tab_active');
            tabWrap.children('.tab_contents:eq(' + activeNum + ')').addClass('tab_active');
            return _this;
        },
        'eventHandler': function () {
            var _this = this,
                toggleEvent = _this.config.toggleEvent;

            $(_this).children('li').off().on('click', function () {
                var tab = $(this).parent(),
                    tabWrap,
                    tabLength = tab.children('li').length,
                    thisIndex = $(this).index(),
                    i;
                if ($(this).hasClass('inActive') == true) {
                    return;
                }
                if (_this.config.tabContents) tabWrap = _this.config.tabContents;
                else tabWrap = tab.parent();

                for (i = 0; i < tabLength; i++) {
                    if (thisIndex == i) {
                        if (toggleEvent == false) {
                            tab.children('li:eq(' + i + ')').addClass('tab_active');
                            tabWrap.children('.tab_contents:eq(' + i + ')').addClass('tab_active');
                        }
                        else if (toggleEvent == true) {
                            if (tab.children('li:eq(' + i + ')').hasClass('tab_active') == true) {
                                tab.children('li:eq(' + i + ')').removeClass('tab_active')
                            }
                            else {
                                tab.children('li:eq(' + i + ')').addClass('tab_active')
                            }
                        }
                    }
                    else {
                        tab.children('li:eq(' + i + ')').removeClass('tab_active');
                        tabWrap.children('.tab_contents:eq(' + i + ')').removeClass('tab_active');
                    }
                }
            });
        }
    };
    $.fn.layerOpenClose = function (defaults) {
        defaults = $.extend(
            {
                title: null,
                openClose: true,	// true = open, false = close
                layerWrap: $('#publish_layerWrap'),
                layerPop: $('#publish_pop'),
                targetLayerWrap: $('#publish_layer'),
                targetLayer: null,
                targetLayerWidth: null,
                backgroundSet: true,
                draggableResizable: true,
                containment: null,
                addPopup: false,
                closeLayer: null
            }, defaults);
        $.getInit(this, layerOpenClose, $.extend({}, $.fn.layerOpenClose.defaults, defaults));
    };
    var layerOpenClose = {
        'init': function () {
            var _this = this,
                targetLayer = _this.config.targetLayer;
            if (_this.config.openClose == true) _this.openSet();
            else _this.closeSet();
        },
        'openSet': function () {
            var _this = this,
                layerWrap = _this.config.layerWrap,
                layerPop = _this.config.layerPop,
                layerBg = $('#publish_layerBg'),
                containment = _this.config.containment,
                targetLayer = _this.config.targetLayer,
                targetLayerWrap = _this.config.targetLayerWrap,
                targetLayerWidth = _this.config.targetLayerWidth,
                title = _this.config.title;
            if (!targetLayer.find('h1').length) {
                targetLayer.prepend('<h1>' + common_label_noTitle + '</h1>')// 제목 없음
            }
            if (targetLayer.css('min-width') == '0px') {
                targetLayer.css('min-width', '500px')
            }
            if (targetLayerWidth != null) {
                targetLayer.css('min-width', targetLayerWidth)
            }
            if (title != null) {
                targetLayer.find('h1').html(title);
            }
            if ($(targetLayer).find('.table_scroll').length) {
                $(targetLayer).tableScrollSet();
            }
            layerWrap.addClass('active');
            if (containment == null) containment = 'document';
            targetLayer.addClass('active');
            layerPop.addClass('active').outerWidth(targetLayer.css('min-width')).outerHeight(targetLayer.css('min-height'));
            layerPop.css({
                'min-width': parseInt(targetLayer.css('min-width')) + 3,
                'min-height': targetLayerWrap.height(),
                'z-index': 50
            });

            if ($(targetLayer).find('.variable').length) {
                if ($(targetLayer).find('.variable').css('display') == 'block') $(targetLayer).children('.variable').next().css({top: $(targetLayer).children('.variable').outerHeight() + 52});
                else $(targetLayer).children('.variable').next().css({top: 52});
            }

            if ($('#publish_layerExplain').css('display') == 'block') $('#publish_layerExplain').css('display', 'none');

            if (_this.config.draggableResizable == true) {
                $(layerPop).draggable({containment: containment, handle: layerPop.find('h1')}).resizable({
                    handles: "se",
                    containment: containment
                }); // n,e,w, $('.contents')
                $(window).on("orientationchange resize", function (event) {
                    if (parseInt(layerPop.position().left) + parseInt(layerPop.outerWidth()) > parseInt($('.wrap').width())) {
                        layerPop.css({width: parseInt($('.wrap').outerWidth()) - parseInt(layerPop.position().left) - 40});
                    }
                    if (parseInt(layerPop.position().top) + parseInt(layerPop.outerHeight()) > parseInt($('.wrap').height())) {
                        layerPop.css({height: parseInt($('.wrap').outerHeight()) - parseInt(layerPop.position().top) - 40});
                    }
                    layerBg.css({'min-height': parseInt(layerPop.css('top')) + $(targetLayer).outerHeight()});
                    if ($(targetLayer).find('.variable').length) {
                        if ($(targetLayer).find('.variable').css('display') == 'block') $(targetLayer).children('.variable').next().css({top: $(targetLayer).children('.variable').outerHeight() + 52});
                        else $(targetLayer).children('.variable').next().css({top: 52});
                    }
                });
            }
            if (_this.config.backgroundSet == true) {
                layerWrap.addClass('background');
                layerPop.css({
                    top: '130px',
                    left: ($('body').outerWidth() / 2) - (layerPop.outerWidth() / 2),
                    opacity: 0
                }).animate({top: '89px', opacity: 1}, 700, 'easeOutExpo');
            }
            else {
                layerPop.css({
                    top: '130px',
                    left: ($('body').outerWidth() / 2) - (layerPop.outerWidth() / 2),
                    opacity: 0
                }).animate({top: '89px', opacity: 1}, 700, 'easeOutExpo');
                $('html, body, .wrap').css({overflow: 'hidden;'});
            }

            layerWrap.find('.layerClose').layerOpenClose({openClose: false});

            layerBg.css({'min-height': parseInt(layerPop.css('top')) + $(targetLayer).outerHeight()});

            layerPop.on('mousedown', function () {
                layerWrap.find('.pop').css({'z-index': 10});
                layerPop.css({'z-index': 50});
            });
        },
        'closeSet': function () {
            var _this = this;
            $(_this).off('click');
            $(_this).on('click', function (event) {
                //alert('closeSet');
                layerPopCloseSet(event);
            });
        }
    };
    /**
     * 위치 변경
     * @param x
     */
    $.fn.sortableSet = function (defaults) {
        defaults = $.extend(
            {
                drag: true,
                toggleEvent: true,
                sortableOpt: null,
                eventFindType: false,
                callBackFunc: null,
                refresh: false,
                btnTarget: null
            }, defaults);
        $.getInit(this, sortableSet, $.extend({}, $.fn.sortableSet.defaults, defaults));
    };
    var sortableSet = {
        'init': function () {
            var _this = this;

            //console.log(_this.config.sortableOpt);

            if (_this.config.refresh == true) {
                //alert(2)
                $(_this).find('ul').sortable('refresh');
                //alert(3)

            }
            else {
                _this.setting();
            }
        },
        'setting': function () {
            var _this = this,
                toggleEvent = _this.config.toggleEvent,
                moveList = $(_this).find('li'),
                callBackFunc = _this.config.callBackFunc;
            i = 0;
            if (_this.config.drag == true) {
                $(_this).find('ul').sortable(_this.config.sortableOpt);
                $(_this).find('ul').disableSelection();
            }


            if (_this.config.eventFindType == false) {
                var moveListUl = $(_this).find('ul');
                /*
				moveListUl.off().on('mousedown', 'li', function (event) {
					var moveListUl = $(_this).find('li').parent(),
						thisIndex = $(this).index();
						moveListLength = moveListUl.children('li').length;

					if (toggleEvent == true) {
						for (i = 0; i < moveListLength; i++) {
							if (thisIndex == i) {
								if (moveListUl.children('li:eq(' + i + ')').hasClass('ui-state-disabled') == true) return;
								// if (moveListUl.children('li:eq(' + i + ')').hasClass('ui-state-disabled') == false)
								moveListUl.children('li:eq(' + i + ')').toggleClass('selected');
							}
							else {
								moveListUl.children('li:eq(' + i + ')').removeClass('selected');
							}
						}
					}
					else {
						for (i = 0; i < moveListLength; i++) {
							if (thisIndex == i) {
								if (moveListUl.children('li:eq(' + i + ')').hasClass('ui-state-disabled') == true) return;
								moveListUl.children('li:eq(' + i + ')').addClass('selected');
							}
							else {
								moveListUl.children('li:eq(' + i + ')').removeClass('selected');
							}
						}
					}
				}
				*/
                moveList.off().on('mousedown', function (event) {
                    // moveListUl.off().on('mousedown', '> li', function (event) {

                    var moveListUl = $(_this).find('li').parent(),
                        thisIndex = $(this).index();
                    moveListLength = moveListUl.children('li').length;

                    if (toggleEvent == true) {
                        for (i = 0; i < moveListLength; i++) {
                            if (thisIndex == i) {
                                if (moveListUl.children('li:eq(' + i + ')').hasClass('ui-state-disabled') == true) return;
                                // if (moveListUl.children('li:eq(' + i + ')').hasClass('ui-state-disabled') == false)
                                moveListUl.children('li:eq(' + i + ')').toggleClass('selected');
                            }
                            else {
                                moveListUl.children('li:eq(' + i + ')').removeClass('selected');
                            }
                        }
                    }
                    else {
                        for (i = 0; i < moveListLength; i++) {
                            if (thisIndex == i) {
                                if (moveListUl.children('li:eq(' + i + ')').hasClass('ui-state-disabled') == true) return;
                                moveListUl.children('li:eq(' + i + ')').addClass('selected');
                            }
                            else {
                                moveListUl.children('li:eq(' + i + ')').removeClass('selected');
                            }
                        }
                    }
                });

                $(_this).off().on('click', '.btn_top_first', function () {
                    _this.moveList('top');
                });
                $(_this).on('click', '.btn_top', function () {
                    _this.moveList('up');
                });
                $(_this).on('click', '.btn_bot', function () {
                    _this.moveList('down');
                });
                $(_this).on('click', '.btn_bot_last', function () {
                    _this.moveList('bottom');
                });
            }
            else {

                $(_this).on('mousedown', 'li', function (event) {

                    var moveListUl = $(_this).find('li').parent(),
                        thisIndex = $(this).index();
                    moveListLength = moveListUl.children('li').length;

                    if (toggleEvent == true) {
                        for (i = 0; i < moveListLength; i++) {
                            if (thisIndex == i) {
                                if (moveListUl.children('li:eq(' + i + ')').hasClass('ui-state-disabled') == true) return;
                                moveListUl.children('li:eq(' + i + ')').toggleClass('selected');
                            }
                            else {
                                moveListUl.children('li:eq(' + i + ')').removeClass('selected');
                            }
                        }
                    }
                    else {
                        for (i = 0; i < moveListLength; i++) {
                            if (thisIndex == i) {
                                if (moveListUl.children('li:eq(' + i + ')').hasClass('ui-state-disabled') == true) return;
                                moveListUl.children('li:eq(' + i + ')').addClass('selected');
                            }
                            else {
                                moveListUl.children('li:eq(' + i + ')').removeClass('selected');
                            }
                        }
                    }
                });
                $(_this).off().on('click', '.btn_top_first', function () {
                    _this.moveList('top');
                    if (callBackFunc != null) _this.config.callBackFunc();
                });
                $(_this).on('click', '.btn_top', function () {
                    _this.moveList('up');
                    if (callBackFunc != null) _this.config.callBackFunc();
                });
                $(_this).on('click', '.btn_bot', function () {
                    _this.moveList('down');
                    if (callBackFunc != null) _this.config.callBackFunc();
                });
                $(_this).on('click', '.btn_bot_last', function () {
                    _this.moveList('bottom');
                    if (callBackFunc != null) _this.config.callBackFunc();
                });
            }

            var btnTarget = _this.config.btnTarget;
            if (btnTarget != null) {
                $(_this).off('click');
                btnTarget.off().on('click', '.btn_top_first', function () {
                    _this.moveList('top');
                    if (callBackFunc != null) _this.config.callBackFunc();
                }).on('click', '.btn_top', function () {
                    _this.moveList('up');
                    if (callBackFunc != null) _this.config.callBackFunc();
                }).on('click', '.btn_bot', function () {
                    _this.moveList('down');
                    if (callBackFunc != null) _this.config.callBackFunc();
                }).on('click', '.btn_bot_last', function () {
                    _this.moveList('bottom');
                    if (callBackFunc != null) _this.config.callBackFunc();
                });
            }


        },
        'moveList': function (direction) {

            var _this = this,
                $_this = $(_this),
                li = $_this.find("li.selected");
            if (li.hasClass('ui-state-disabled') == true) return;

            if (li.length > 0) {
                switch (direction) {
                    case "top":
                        if (li.parent().children('.ui-state-disabled').length > 0) return;
                        /**
                         * @author OhMook
                         * @since 18.08.06
                         **/
                        var ul = $_this.find('ul'),
                            noneLi = $(ul.find('li').first());

                        if (noneLi.is('.none')) {
                            noneLi.after(li);
                        } else {
                            $(li).prependTo(ul);
                        }

                        $_this.find('.move_list').scrollTop(0);
                        break;
                    case "up":
                        if (li.prev().hasClass('ui-state-disabled') == true) return;
                        /**
                         * @author OhMook
                         * @since 18.08.06
                         **/
                        var pli = $(li).prev();

                        if (!pli.is('.none')) {
                            pli.before(li);
                        }
                        break;
                    case "down":
                        /**
                         * @author OhMook
                         * @since 18.08.06
                         **/

                        var nli = $(li).next();

                        if (!nli.is('.none')) {
                            nli.after(li);
                        }
                        break;
                    case "bottom":
                        /**
                         * @author OhMook
                         * @since 18.08.06
                         **/
                        var ul = $_this.find('ul'),
                            noneLi = ul.find('li').last();

                        if (noneLi.is('.none')) {
                            noneLi.before(li);
                        } else {
                            ul.append(li);
                        }

                        $_this.find('.move_list').scrollTop(0);
                        $_this.find('.move_list').scrollTop($(_this).find("li.selected").position().top + $(_this).find("li.selected").outerHeight());

                        break;
                }
            }

        }
    };
    $.fn.timepicker = function (defaults) {
        defaults = $.extend(
            {
                timepicker: null,
                unit: 10
            }, defaults);
        $.getInit(this, timepicker, $.extend({}, $.fn.timepicker.defaults, defaults));

        return $(this);
    };
    var timepicker = {
        'init': function () {
            var _this = this;
            _this.setting();
            _this.eventHandler();

            return $(_this);
        },
        'setting': function () {
            var _this = this,
                parentObj = $(_this).parent(),
                timepicker = null,
                timepickerInput = null,
                i = 0,
                numberString = null;
            parentObj.append('<div class="timepicker" style="display: inline-block;"></div>');
            timepicker = parentObj.children('.timepicker');
            timepicker.html($(_this).outerHTML());
            $(_this).remove();

            timepickerInput = timepicker.children('input');
            if (timepickerInput.val() != '') {
                var hour = timepickerInput.val().substr(0, 2);
                var minute = timepickerInput.val().substr(3, 2);
            }
            timepicker.append('<div class="setting"><select class="select_time" title="time"></select><span>:</span><select class="select_minute" title="minute"></select></div>');
            for (i = 0; i < 24; i++) {
                numberString = String(i);
                if (i < 10) numberString = '0' + String(i);

                if (timepickerInput.val() != '') {
                    if (hour == numberString) timepicker.children('div').children('.select_time').append('<option selected="selected">' + numberString + '</option>');
                    else timepicker.children('div').children('.select_time').append('<option>' + numberString + '</option>');
                }
                else {
                    timepicker.children('div').children('.select_time').append('<option>' + numberString + '</option>');
                }
            }
            numberString = null;
            for (i = 0; i < 60; i++) {
                numberString = String(i);
                if (i < 10) numberString = '0' + String(i);

                if (timepickerInput.val() != '') {
                    if (minute == numberString) timepicker.children('div').children('.select_minute').append('<option selected="selected">' + numberString + '</option>');
                    else timepicker.children('div').children('.select_minute').append('<option>' + numberString + '</option>');
                }
                else {
                    timepicker.children('div').children('.select_minute').append('<option>' + numberString + '</option>');
                }
                i = i + (_this.config.unit - 1);
            }
            _this.config.timepicker = timepicker;
            return _this;
        },
        'eventHandler': function () {
            var _this = this,
                timepicker = _this.config.timepicker,
                input = timepicker.children('input[type=text]'),
                setting = timepicker.children('.setting'),
                selectTime = setting.children('.select_time'),
                selectMinute = setting.children('.select_minute');


            input.on('keyup', function (event) {
                if (event.keyCode == 13) {// enter
                    if ($(this).val().length > 0) {
                        setting.removeClass('active');
                        input.next().focus();
                    }
                    return false;
                }
                else if (event.keyCode == 8) {
                    return false;
                }
                else if (event.keyCode == 37) {
                    return false;
                }
                else if (event.keyCode == 39) {
                    return false;
                }
                else if (event.keyCode == 32) {
                    return false;
                }
                // $(this).val( $(this).val().replace(/[^0-9_\:\ ]/gm,"") );
                $(this).val($(this).val().replace(/[^0-9_\:\ ]/gm, "")).trigger('changeTimePicker');

            }).on('click', function () {
                setting.addClass('active');
                $(document).bind('click', closeTimepicker);
            }).on('focus', function () {
                if ($(this).val() == '') {
                    $(this).val('00:00');
                }
            });
            var closeTimepicker = function () {
                if ($(timepicker).find(':focus').length == 0) {
                    setting.removeClass('active');
                    $(this).unbind('click', closeTimepicker);
                }
            };
            selectTime.on('change', function () {
                input.val($(this).val() + ':' + selectMinute.val()).trigger('changeTimePicker');
                input.parent().focus().blur();
            });
            selectMinute.on('change', function () {
                input.val(selectTime.val() + ':' + $(this).val()).trigger('changeTimePicker');
                input.parent().focus().blur();
            });
        }
    };
    $.fn.tableScrollSet = function (defaults) {
        defaults = $.extend(
            {}, defaults);
        $.getInit(this, tableScrollSet, $.extend({}, $.fn.tableScrollSet.defaults, defaults));
    };
    var tableScrollSet = {
        'init': function () {
            var _this = this;
            _this.setting();
        },
        'setting': function () {
            var _this = this,
                layerWrap = $('#publish_layerWrap'),
                htmlClass = $('html').prop('className');
            layerWrap.addClass('active');
            $(_this).addClass('active');
            if (htmlClass == 'Firefox') $(_this).css({'min-height': $(_this).children('.variable_area').height() + 346});
            else if (htmlClass == 'Chrome') $(_this).css({'min-height': $(_this).children('.variable_area').height() + 346});
            else $(_this).css({'min-height': $(_this).children('.variable_area').height() + 348});
            $(window).on("orientationchange resize", function (event) {
                _this.resize();
            });
            setTimeout(function () {
                _this.resize();
            }, 100);

        },
        'resize': function () {
            var _this = this,
                addYpos = 0,
                htmlClass = $('html').prop('className');
            if (htmlClass == 'Safari') addYpos = -2;
            else if (htmlClass == 'Chrome') addYpos = -2;
            else if (htmlClass == 'Firefox') addYpos = -1;
            $(_this).children('div').children('.table_scroll').css({top: $(_this).children('.variable_area').height() + 87 + addYpos});
        }
    };


    $.fn.emailCheck = function (value, callback) {
        var regex = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-zA-Z]{2,6}(?:\.[a-zA-Z]{2})?)$/;
        return regex.test(value);
    };
    $.fn.selectRange = function (start, end) {
        return this.each(function () {
            if (this.setSelectionRange) {
                this.focus();
                this.setSelectionRange(start, end);
            } else if (this.createTextRange) {
                var range = this.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', start);
                range.select();
            }
        });
    };

    /** 주소자동완성 값 리턴**/
    $.fn.getAutoCompleteValue = function () {
        var liList = $(this).find(".input_list li input");
        var dataList = [];
        $.each(liList, function (index, li) {
            var data = {};
            $.each($(this).data(), function (id, value) {
                data[id] = value;
            });
            dataList.push(data);
        });
        return dataList;
    };

    /** 주소자동완성 JSON 값 리턴(최도영) **/
    $.fn.getAutoCompleteJson = function () {
        var liList = $(this).find(".input_list li");
        var dataList = [];
        $.each(liList, function (index, li) {
            var jsonData = $(this).data('jsonData');
            var liListAlertCheck = $(li).hasClass('alert');

            if (!jsonData || liListAlertCheck) {
                return true; //continue
            }
            dataList.push(jsonData);
        });
        return dataList;
    };

    /** 주소자동완성 값 입력 **/
    $.fn.setAutoCompleteValue = function (dataList) {
        var _this = this;
        $.each(dataList, function (index, data) {
            $(_this).find(".ui-autocomplete-input").val(data.label);
            $(_this).children('.input_area')[0].selectSet($(_this).find(".ui-autocomplete-input")[0], data);
        });
    };

    $.fn.deleteAutoCompleteValue = function (dataList) {
        var _this = this;
        var dataLength = dataList.length;
        var inputList = $(_this).children('.input_area').children('.input_list');
        for (var i = 0; i < dataLength; i++) {
            inputList.find('input[value="' + dataList[i] + '"]').closest('li').remove();
        }
    };


    /** 검색 키워드 bold 처리 **/
    $.ui.autocomplete.prototype._renderItem = function (ul, item) {
        var label = item.label.replace("<", "&lt;").replace(">", "&gt;").replace(/\\/g, '');
        label = label.replace(new RegExp('(?![^&;]+;)(?!<[^<>]*)(' + $.ui.autocomplete.escapeRegex(this.term) + ')(?![^<>]*>)(?![^&;]+;)', "gi"), '<span class="ui-autocomplete-highlight" >$1</span>');
        return $('<li>' + label + '</li>').appendTo(ul);
    };

    $.fn.autoCompleteSet = function (defaults) {

        if (defaults.resetBoolean == true) {// 초기화
            var deleteLength = $(this).find('.input_list').children('li').length;
            for (var i = 0; i < deleteLength; i++) {
                var li = $(this).find('.input_list').children('li:eq(' + i + ')');
                if (li.hasClass('input_zone') == false) li.remove();
            }
            return;
        }


        this.html('<div class="input_area"> ' +
            '<ul class="input_list"> ' +
            '<li class="input_zone"><textarea class="input" rows="1"></textarea></li> ' + //  style="ime-mode:active;"
            '</ul> ' +
            '<div class="auto_complete_list"></div> ' +
            '</div> ');
        this.attr("class", "auto_complete");


        var validateFunc = null;
        if (defaults.type == 1) { // 1: email 표시, 2: 사용자 ID 표시
            validateFunc = function (thisInput) {

                var inputVal = $.trim($(thisInput).val());
                inputVal = inputVal.replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/"/g, '');

                var email = '';
                if (inputVal.indexOf('<') > -1) {
                    email = inputVal.substring(inputVal.indexOf('<') + 1, inputVal.indexOf('>'));
                } else {
                    // 주소록 그룹은 메일 주소 유효성 체크를 안한다.
                    if (inputVal.substring(0, 1) == '[' && inputVal.substring(inputVal.length - 1, inputVal.length) == ']') {
                        return true;
                    }
                    email = inputVal;
                }
                return $(thisInput).emailCheck(email);
            };
        }


        defaults = $.extend({
            minLength: 1,
            autoList: [],
            validateFunc: validateFunc,
            favoriteList: null,
            placeholder: null,
            title: null,
            //pasteCallback : null,
            maxRegistNum: null,
            btnZone: false,
            addContactCallback: false,//,// 연락처 추가
            addCallback: null,
            chainFancytree: null,
            typeAddButton: false,
            placeholderMultiline: false
            //useWrapDoubleQuote: false,// value 값에 쌍따옴표가 있을경우 정상적으로 jquery data value 가 정상적으로 적용되지 않을경우 value 값을 홑따옴표로 감쌀 경우 true로 설정한다.

        }, defaults);
        $.getInit($(this).children('div'), autoCompleteSet, $.extend({}, $.fn.autoCompleteSet.defaults, defaults));
    };
    var autoCompleteSet = {
        'init': function (defaults) {
            var _this = this;
            _this.firstSet().favoriteList().autoCompleteSet().inputEvent().documentEvent().thisEventSet();
        },
        'firstSet': function () {
            var _this = this;

            // $(_this).parent().parent().find('.input_area').removeClass('blind');

            if (_this.config.typeAddButton == true) {
                $(_this).closest('.auto_complete').addClass('add_type_01');
            }

            if (_this.config.btnZone == true) {
                if ($(_this).closest('.td_autocomplete').find('.input_area').outerWidth() > 500) {
                    $(_this).closest('.td_autocomplete').outerWidth(500);
                }
                $(_this).closest('.td_autocomplete').css({'padding-right': $(_this).closest('.td_autocomplete').children('.btn_zone').outerWidth() + 3});
                $(_this).closest('.td_autocomplete').removeClass('opacity_0');
                // alert($(_this).closest('.td_autocomplete').outerWidth());
            }


            // alert($(_this).parent().parent().children('.btn_zone').outerWidth()); // .children('.btn_zone').outerWidth()


            if (_this.config.placeholder != null) {
                // $(_this).append('<input type="text" class="change_auto_complete" placeholder="' + _this.config.placeholder + '" title="' + _this.config.title + '">');
                // $(_this).append('<input type="text" class="change_auto_complete" placeholder="' + _this.config.placeholder + '">');
                if (_this.config.placeholderMultiline == false) {
                    $(_this).append('<input type="text" class="change_auto_complete" placeholder="' + _this.config.placeholder + '">');
                }
                else {// just7 20180212
                    $(_this).closest('.auto_complete').addClass('placeholder_multiline');
                    $(_this).append('<div class="change_auto_complete gray pl_10 pr_10">' + _this.config.placeholder + '</div>');
                }

                if (_this.config.title != null) {
                    $(_this).find('.change_auto_complete').attr({'title': _this.config.title})
                }
            }


            $(_this).find('textarea').val('').attr('id', 'publish_' + $(_this).parent().prop('id') + '_textarea');

            if (_this.config.maxRegistNum == null) {
                $(_this).children('ul').sortable({
                    items: '> li:not(.input_zone)',
                    handle: ".cursor_move",
                    connectWith: ".input_list",
                    remove: function (event, ui) {
                        ui.item.children('.btn_input_modify').off().parent().children('.btn_input_delete').off();
                        $(_this).removeClass('active').find(':focus').blur();
                        $(event.target).sortable('refresh');
                    },
                    receive: function (event, ui) {
                        var receiveObj = event.target;
                        $(receiveObj).parent()[0].inputCheck(ui.item.children('input'));
                        $(receiveObj).parent()[0].subInputEventHandler(ui.item);
                        $(receiveObj).children('.input_zone').insertAfter($(receiveObj).children('li:eq(-1)'));
                        $(receiveObj).parent().addClass('active').find('.input').focus();
                    }
                }).disableSelection();
            }
            else {
                $(_this).children('ul').sortable({
                    items: '> li:not(.input_zone)',
                    handle: ".cursor_move",
                    // connectWith: ".input_list",
                    remove: function (event, ui) {
                        ui.item.children('.btn_input_modify').off().parent().children('.btn_input_delete').off();
                        $(_this).removeClass('active').find(':focus').blur();
                        $(event.target).sortable('refresh');
                    },
                    receive: function (event, ui) {
                        var receiveObj = event.target;
                        $(receiveObj).parent()[0].inputCheck(ui.item.children('input'));
                        $(receiveObj).parent()[0].subInputEventHandler(ui.item);
                        $(receiveObj).children('.input_zone').insertAfter($(receiveObj).children('li:eq(-1)'));
                        $(receiveObj).parent().addClass('active').find('.input').focus();
                    }
                }).disableSelection();
            }

            $(_this).on('remove', function () {
                $('html').off('click, keydown');
            });
            return _this;
        },
        'favoriteList': function () {
            var _this = this,
                favoriteList = _this.config.favoriteList;
            if (favoriteList != null) {
                // common_tooltip_showFavoriteAddress : 자주 사용하는 주소 보기
                // common_tab_favoriteAddress : 자주 사용하는 주소
                // common_tab_autoComplete : 입력완성
                // common_button_confirm : 확인
                // common_button_cancel : 취소
                $(_this).append('<a href="javascript:void(0);" class="btn btn_favorite_toggle" title="' + common_tooltip_showFavoriteAddress + '"><span>' + common_tab_favoriteAddress + '</span></a><div class="btn_area"><div class="tab_area"><a href="javascript:void(0);" class="tab active">' + common_tab_autoComplete + '</a><a href="javascript:void(0);" class="tab btn_favorite">' + common_tab_favoriteAddress + '</a></div><div style="position: absolute; top: 6px; right: 10px;"><a href="javascript:void(0);" class="btn bold" style="margin: 0 1px 0 0;">' + common_button_confirm + '</a><a href="javascript:void(0);" class="btn btn_cancle">' + common_button_cancel + '</a></div></div>');
                $(_this).children('.auto_complete_list').after('<div class="favorite_list"><ul></ul></div>');

                var favoriteListUl = $(_this).find('.favorite_list').children('ul'),
                    thisId = $(_this).parent().prop('id'),
                    i = 0;

                $.each(favoriteList, function (index, item) {
                    favoriteListUl.append('<li><input type="checkbox" id="' + thisId + '_' + index + '" value="' + item.id + '"> <label for="' + thisId + '_' + index + '">' + item.mailTo.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '') + '</label> <a href="javascript:void(0);" title="' + common_button_delete + '" class="btn_delete"><span>' + common_button_delete + '</span></a></li>');// 20150225 : email ---> mailTo 수정
                    // ' + common_button_delete + ' : 삭제
                });

                favoriteListUl.find('.btn_delete').on('click', function (event) {
                    var thisIndex = $(this).parent().index(),
                        favoriteLength = $('.favorite_list').length,
                        item = favoriteList[thisIndex];
                    favoriteList.splice(thisIndex, 1);
                    _this.config.deleteCallback(item.id);
                    for (i = 0; i < favoriteLength; i++) {
                        $('.favorite_list:eq(' + i + ')').children('ul').children('li:eq(' + thisIndex + ')').remove();
                    }

                    if ($('.favorite_list').children('ul').children('li').length == 0) {
                        $('.favorite_list').children('ul').append('<li class="not_read">' + common_desc_notExistFavoriteAddress + '</li>');
                        // common_desc_notExistFavoriteAddress : 등록된 자주 사용하는 주소가 없습니다.
                    }
                    else {
                        $('.favorite_list').children('ul').find('not_read').remove();
                    }
                    return false;
                });
                $(_this).find('.tab').on('click', function (event) {
                    var thisTab = this;
                    setTimeout(function () {
                        if ($(thisTab).hasClass('btn_favorite') == true) {
                            $(_this).find('.favorite_list').css({top: $(_this).height(), 'z-index': 101}).show();
                            $(_this).find('.btn_area').show().css({top: $(_this).find('.favorite_list').outerHeight() + $(_this).find('.favorite_list').position().top - 1});
                            $(thisTab).addClass('active').prev().removeClass('active').parent().parent().addClass('active');
                            favoriteListUl.children('li').children('input').removeAttr('checked');

                            if ($('.favorite_list').children('ul').children('li').length == 0) {
                                $('.favorite_list').children('ul').append('<li class="not_read">' + common_desc_notExistFavoriteAddress + '</li>');
                                // 등록된 자주 사용하는 주소가 없습니다.
                            }
                            else {
                                $('.favorite_list').children('ul').find('not_read').remove();
                            }

                        }
                        else {
                            $(_this).find('.favorite_list').hide();
                            $(_this).find('textarea').autocomplete("search", $(_this).find('textarea').val());
                            $(thisTab).addClass('active').next().removeClass('active').parent().parent().removeClass('active');
                            _this.autoCompleteFocus();
                        }
                    }, 1);
                });
                $(_this).children('.btn_favorite_toggle').on('click', function (event) {
                    if ($(_this).find('.btn_area').css('display') == 'block') {
                        $('.auto_complete_list, .favorite_list, .btn_area').hide();
                        $(this).removeClass('on').attr('title', common_tooltip_showFavoriteAddress);// 자주사용하는 주소 보기
                        return false;
                    }

                    setTimeout(function () {
                        var forLength = ($('.btn_favorite_toggle').length);
                        for (i = 0; i < forLength; i++) {
                            $('.btn_favorite_toggle:eq(' + i + ')').removeClass('on').attr('title', common_tooltip_showFavoriteAddress); // '자주사용하는 주소 보기'
                        }
                        $(_this).children('.btn_favorite_toggle').addClass('on').attr('title', common_tooltip_closeFavoriteAddress); // '자주사용하는 주소 닫기'

                        $('.auto_complete').children('.input_area').removeClass('active');
                        $('.auto_complete_list, .favorite_list, .btn_area').hide();
                        var tabArea = $(_this).find('.tab_area');
                        $(_this).find('.favorite_list').css({top: $(_this).height(), 'z-index': 101}).show();
                        $(_this).find('.btn_area').show().css({top: $(_this).find('.favorite_list').outerHeight() + $(_this).find('.favorite_list').position().top - 1});
                        tabArea.children('.btn_favorite').addClass('active').prev().removeClass('active').parent().parent().addClass('active');
                        favoriteListUl.children('li').children('input').removeAttr('checked');
                        $(_this).addClass('active');

                        if ($('.favorite_list').children('ul').children('li').length == 0) {
                            $('.favorite_list').children('ul').append('<li class="not_read">' + common_desc_notExistFavoriteAddress + '</li>');
                            // 등록된 자주 사용하는 주소가 없습니다.
                        }
                        else {
                            $('.favorite_list').children('ul').find('not_read').remove();
                        }
                    }, 1);
                });
            }
            return _this;
        },
        'autoCompleteSet': function () {
            var _this = this;
            $(_this).find('textarea').autocomplete({
                autoFocus: true,
                delay: 2,
                //	collision: "flip",
                // position: { my: "left top", at: "left bottom", collision: "flip flip" },
                // position: { my: "left top", at: "left bottom", collision: "flip" },
                //position: {  collision: "flip"  },
                minLength: _this.config.minLength,


                appendTo: $(_this).children('.auto_complete_list'),


                source: _this.config.autoList,
                //close: function(event, ui) {
                //	$(_this).closest('td').css({ 'overflow' : 'hidden' });
                //},
                open: function (event, ui) {

                    // console.log($(event.currentTarget).html());
                    // $(_this).find('textarea').autocomplete('option', 'autoFocus', false );
                    //alert(1)
                    //$(_this).closest('td').css({ 'overflow' : 'initial' });


                    if ($(_this).find('.input').val() != '') _this.autoListSet();
                    $(_this).find('.ui-autocomplete').scrollTop(0);


                    //alert(2)
                },
                select: function (event, ui) {
                    setTimeout(function () {
                        if ($(event.target).val().length > 0) {
                            _this.selectSet(event.target, ui.item);
                        }
                    }, 1);
                },
                response: function (event, ui) {
                    /*
					if (ui.content.length == 1) {
						$(_this).find('textarea').autocomplete('option', 'autoFocus', true );
					}
					else {
						$(_this).find('textarea').autocomplete('option', 'autoFocus', false );
					}
					*/
                    setTimeout(function () {
                        var autoCompleteList = $(_this).children('.auto_complete_list');
                        if (autoCompleteList.children('ul:eq(0)').css('display') == 'none') {
                            $(_this).find('.auto_complete_list, .favorite_list, .btn_area').hide();
                        }
                    }, 1);
                }
            });
            return _this;
        },
        'thisEventSet': function () {
            var _this = this;

            $(_this).on('click', function (event) {
                if (_this.config.maxRegistNum != null) {
                    if ($(_this).find('.input_list').children('li').length > _this.config.maxRegistNum) {
                        $(_this).find('.input').blur().parent().hide();
                        //$(_this).parent().next().focus();

                        $(_this).parent().children('.input_area').removeClass('active');
                        //alert(2)
                        return false;
                    }
                    else {
                        $(_this).find('.input').parent().show();
                    }
                }

                var thisParentLi = $(_this).parent().parent(),
                    thisParentUl = thisParentLi.parent(),
                    eventTarget = $(event.target),
                    eventClassName = eventTarget.prop('className'),
                    eventTag = eventTarget.prop('tagName'),
                    inputZone = $(_this).find('.input_zone').children('.input'),
                    tabArea = $(_this).children('.btn_area').children('.tab_area'),
                    zindex = thisParentUl.children('li').length;

                thisParentUl.children('li').css({'z-index': zindex + 888});
                thisParentUl.children('li.else_index').css({'z-index': zindex + 900});
                thisParentLi.css({'z-index': zindex + 889});
                $(this).addClass('active');

                console.log('eventClassName : ' + eventClassName);
                switch (eventClassName) {
                    case 'input_area':
                        inputZone.autocomplete('enable').focus();
                        break;
                    case 'input_zone':
                        inputZone.autocomplete('enable').focus();
                        break;
                    case 'input ui-autocomplete-input':
                        inputZone.autocomplete('enable').focus();
                        break;
                    case 'input_list ui-sortable':
                        inputZone.autocomplete('enable').focus();
                        _this.selectSet(inputZone);
                        break;
                    case 'btn_area':// 내부에 있는 공백
                        if (!_this.config.favoriteList.length == false) {
                            if ($(_this).find('.tab_area').children('.tab:eq(0)').hasClass('active') == true) {
                                _this.autoCompleteFocus();
                            }
                            else {
                                return false;
                            }
                        }
                        break;
                    case 'btn_area active':
                        return false;
                        break;
                    case 'favorite_list':
                        return false;
                        break;
                    case 'auto_complete_list':// 내부에 있는 공백
                        if (!_this.config.favoriteList.length == false) {
                            if ($(_this).find('.tab_area').children('.tab:eq(0)').hasClass('active') == true) _this.autoCompleteFocus();
                        }
                        break;
                    case 'btn btn_cancle':// 취소
                        _this.registAutocompleteReset();
                        break;
                    case 'btn bold':// 확인
                        var targetObj = _this.inputTarget();

                        if ($(_this).children('.btn_area').children('.tab_area').children('.tab:eq(0)').hasClass('active') == true) {// 입력완성 활성화
                            if (targetObj == null) _this.recipientSet($(_this).find('.input')); 				// 일반
                            else _this.registAutocompleteReset();												// 수정
                        }
                        else {// 체크 목록 등록
                            var checkArr = [],
                                checkNum = 0,
                                checkList = $(_this).children('.favorite_list').children('ul'),
                                listLength = checkList.children('li').length;
                            for (var i = 0; i < listLength; i++) {
                                if (checkList.children('li:eq(' + i + ')').children('input[type=checkbox]').is(':checked') == true) {// 자주 사용하는 주소 활성화
                                    checkArr.push(checkList.children('li:eq(' + i + ')').children('label').text());
                                }
                            }
                            if (targetObj == null) {// 일반
                                for (i = 0; i < checkArr.length; i++) {
                                    $(_this).find('textarea').val(checkArr[i]);
                                    _this.selectSet($(_this).find('.input'));
                                }
                            }
                            else {// 수정
                                if (checkArr.length) {
                                    targetObj.children('input').val(checkArr[0]);
                                    if (_this.inputCheck(targetObj.children('input')) != true) targetObj.children('input').focus().blur();
                                    else if (_this.inputCheck(targetObj.children('input')) == true) {
                                        targetObj.remove();
                                        return false;
                                    }

                                    for (i = 1; i < checkArr.length; i++) {
                                        $(_this).find('.input').val(checkArr[i]);
                                        _this.selectSet($(_this).find('.input'));
                                    }
                                }
                                $(_this).find('.input').focus();
                            }
                        }
                        _this.thisHeightSet();
                        $(_this).find('.auto_complete_list, .favorite_list, .btn_area').hide();
                        break;
                    case 'btn btn_favorite_toggle':
                        return false;
                        break;
                    case 'change_auto_complete' :
                        $(_this).find('.change_auto_complete').addClass('none').blur();
                        inputZone.focus();
                        break;
                    case 'change_auto_complete gray pl_10 pr_10' :
                        $(_this).find('.change_auto_complete').addClass('none').blur();
                        inputZone.focus();
                        break;
                    case 'input_area btn_border_reset' :
                        $(_this).find('.change_auto_complete').addClass('none').blur();
                        inputZone.focus();
                        break;
                }
                if (eventTag == 'INPUT' || eventTag == 'LABEL') return;
                if ($(_this).find('.auto_complete_list').css('display') == 'none') {
                    _this.tabReset(inputZone);
                }
            }).on('mousedown', function (event) {
                if ($(event.target).prop('className') == 'auto_complete_list') {
                    setTimeout(function () {
                        var targetObj = _this.inputTarget(),
                            input = $(_this).children('.input_list').find('.input');
                        if (targetObj == null) input.focus().autocomplete('search', input.val());
                        else targetObj.children('input').focus();
                        return false;
                    }, 1);
                }
            });
            return _this;
        },
        'inputEvent': function () {
            var _this = this;
            $(_this).find('.input').on('keydown', function (event) {

                var item = {}, ___this = this;

                if (event.keyCode == 13 || event.keyCode == 186 || event.keyCode == 188) {// enter  186 -> ;, 188 -> ,
                    if ($(this).val().length == 0) return false;


                    //console.info(this);
                    if (event.shiftKey && event.keyCode == 188) {
                        // alert(event.keyCode);
                        return;
                    }
                    if ($(_this).find('.auto_complete_list').css('display') == 'none') {

                        _this.selectSet(this);

                        // alert('---111111111111111111111------->' + event.keyCode);

                    }
                    else {
                        var val;
                        if (event.keyCode == 13) {
                            //var autoCompleteList = $(_this).children('.auto_complete_list');
                            //if (autoCompleteList.find('.ui-menu-item').length == 1) {
                            //	val = autoCompleteList.find('.ui-menu-item').text();
                            //	$(_this).find('.input').val(val);
                            //	item.value = val;
                            //	_this.selectSet(this, item);
                            //}
                        }
                        else if (event.keyCode == 186 || event.keyCode == 188) {
                            // alert('------------>' + event.keyCode);

                            item.id = '';
                            item.type = 9;
                            item.value = $(this).val();

                            val = $(_this).find('.ui-state-focus').text();
                            $(_this).find('.input').val(val);
                            item.value = val;
                            _this.selectSet(this, item);// 2015-06-30 event.keyCode == 188 조건 처리 삭제 되었음
                        }
                    }
                    return false;
                }
                else if (event.keyCode == 220) {// \
                    return false;
                }
                // else if(event.keyCode == 32) {// space bar
                //	return false;
                //}
                else if (event.keyCode == 8) {// back space
                    if ($(this).val().length == 1) {
                        $(_this).find('textarea').autocomplete('close');
                        $(_this).find('.auto_complete_list, .favorite_list, .btn_area').hide();
                    }
                    else if ($(this).val().length == 0) {
                        var prevObj = $(this).parent().prev();
                        if (prevObj.hasClass('active') == true) {
                            prevObj.remove();
                            if (_this.config.addCallback != null) {
                                _this.config.addCallback();
                            }
                        }
                        else if ($(this).val() == '') {
                            prevObj.addClass('active');
                        }
                    }
                }
                else if (event.keyCode == 9) {// tab
                    if ($(this).val().length > 0) {

                        if ($(_this).find('.auto_complete_list').css('display') == 'none') {
                            if ($(this).val().length > 0) _this.selectSet(this);
                        }
                        return false;
                        $(this).focus();
                    }
                }
                else if (event.ctrlKey) {// ctrl + v
                    switch (event.keyCode) {
                        case 86:
                            setTimeout(function () {
                                var mailAddressArray = $(_this).find('.input').val().replace(';', ',').split(',');
                                for (var i = 0; i < mailAddressArray.length; i++) {


                                    var value = mailAddressArray[i].replace(/\s+/, '');//왼쪽 공백제거
                                    value = value.replace(/\s+$/g, '');//오른쪽 공백제거
                                    value = value.replace(/\n/g, '');//행바꿈제거
                                    value = value.replace(/\r/g, '');//엔터제거
                                    //console.log('------------------------' + mailAddressArray[i].length);
                                    //console.log(mailAddressArray[i]);
                                    //console.log('------------------------' + value.length);
                                    //console.log(value);

                                    $(_this).find('.input').val(value);
                                    _this.selectSet(___this);
                                }
                            }, 10);
                            break;
                    }
                    return;
                }
                if (_this.config.useOnlyOrganization == true) {// 전자결재

                    if (event.shiftKey) {
                        switch (event.keyCode) {
                            case 51: // #
                                return false;
                                break;
                            case 52: // $
                                return false;
                                break;
                            case 56: // *
                                return false;
                                break
                            case 57: // (
                                return false;
                                break
                        }
                    }
                    else if (event.keyCode == 219) return false;	// [
                }
            }).on('keyup', function (event) {
                _this.mailAddressInput(this);
                if ($(this).val() != '') $(_this).children('.input_list').children('li').removeClass('active');
            }).on('focus', function (event) {

                if (_this.config.maxRegistNum != null) {
                    if ($(_this).find('.input_list').children('li').length > _this.config.maxRegistNum) {

                        $(_this).find('.input').blur().parent().hide();
                        $(_this).parent().children('.input_area').removeClass('active');
                        //alert(1)
                        return false;
                    }
                    else {
                        $(_this).find('.input').parent().show();
                    }
                }


                if ($(this).val() == '') _this.registAutocompleteReset();
                _this.tabReset(this);
                _this.thisHeightSet();
                $(this).autocomplete('search', $(this).val());
                $(this).parent().css('background', '#fff');
                $(this).parent().parent().children('li').removeClass('active');

                $(_this).addClass('active');

                var thisParentLi = $(_this).parent().parent(),
                    thisParentUl = thisParentLi.parent(),
                    zindex = thisParentUl.children('li').length;

                thisParentUl.children('li').css({'z-index': zindex + 888});
                thisParentUl.children('li.else_index').css({'z-index': zindex + 900});
                thisParentLi.css({'z-index': zindex + 889});

                $(_this).find('.change_auto_complete').addClass('none');
            }).on('blur', function (event) {
                $(_this).closest('.form_auto_complete').css({'z-index': ''});
                // console.log('close');
            });

            var closeAutocomplete = function () {
                setTimeout(function () {
                    if ($(_this).parent().find(':focus').length == 0) {
                        var targetObj = _this.inputTarget();
                        if (targetObj == null) {// 일반
                            if (_this.inputCheck($(_this).find('textarea')) == true) return false;
                            _this.selectSet($(_this).find('.input'));
                        }
                        else {// 수정
                            if (_this.inputCheck(targetObj.children('input')) == true) return false;
                            _this.registAutocompleteReset();
                        }
                        $(_this).removeClass('active');
                        $(_this).find('.auto_complete_list, .favorite_list, .btn_area').hide();

                        $(_this).children('.input_list').children('li').removeClass('active');
                    }
                }, 2);
            };

            return _this;
        },
        'documentEvent': function () {
            var _this = this;
            $('html').on('click', function (event) {// 전체 영역에서 현재 영역에 포커스가 없을때
                var eventTarget = event.target;
                setTimeout(function () {
                    if ($(_this).parent().find(':focus').length == 0) {
                        var targetObj = _this.inputTarget();
                        if (targetObj == null) {// 일반
                            if (_this.inputCheck($(_this).find('textarea')) == true) {
                                return false;
                            }
                            if ($(_this).find('.input').val() != '') {

                                if ($(_this).find('.input').val() == undefined) return false;
                                if ($(_this).find('.input').val().length > 0) _this.selectSet($(_this).find('.input'));
                            }

                            if ($(_this).children('.input_list').children('li').length == 1) {
                                $(_this).find('.change_auto_complete').removeClass('none');
                            }
                            // $(_this).parent().parent().parent().find('.else_index').css({ 'z-index' : 100 });
                        }
                        else {// 수정
                            if (_this.inputCheck(targetObj.children('input')) == true) return false;
                            _this.registAutocompleteReset();
                        }
                        $(_this).removeClass('active');
                        $(_this).find('.auto_complete_list, .favorite_list, .btn_area').hide();

                        $(_this).children('.input_list').children('li').removeClass('active');

                        if ($(eventTarget).hasClass('btn_favorite_toggle') != true) {
                            var forLength = ($('.btn_favorite_toggle').length);
                            for (i = 0; i < forLength; i++) {
                                $('.btn_favorite_toggle:eq(' + i + ')').removeClass('on').attr('title', common_tooltip_showFavoriteAddress);
                                // '자주사용하는 주소 보기'
                            }
                        }
                    }
                }, 2);
            }).on('keydown', function () {
                if (event.keyCode == 46) {// delete
                    if ($(_this).hasClass('active') == true) {
                        $(_this).children('.input_list').children('li.active').remove();
                        if (_this.config.addCallback != null) {
                            _this.config.addCallback();
                        }
                        $(_this).find('.input').focus();
                    }
                }
                else if (event.keyCode == 9) {// tab
                    setTimeout(function () {
                        if ($(_this).parent().find(':focus').length == 0) {
                            $(_this).removeClass('active');
                            $(_this).find('.auto_complete_list, .favorite_list, .btn_area').hide();
                        }
                    }, 2);
                }
            });
            return _this;
        },
        'autoListSet': function () {


            var _this = this,
                autoCompleteList = $(_this).children('.auto_complete_list');

            autoCompleteList.show().css({top: $(_this).height()});

            // console.log(autoCompleteList.html());


            // $(_this).find('textarea').autocomplete('option', 'autoFocus', false);


            //setTimeout(function(){
            if (_this.config.favoriteList != null) {
                var favoriteList = _this.config.favoriteList;
                $(_this).find('.btn_area').show().css({top: $(_this).outerHeight() + 153});
            }
            else {
                $(_this).find('.btn_area').show().css({top: autoCompleteList.outerHeight() + autoCompleteList.position().top - 1});
                // $(_this).find('.btn_area').show().css({ top : $(_this).outerHeight() + 159, left: 380 });
                $(_this).find('.favorite_list').hide().css({top: $(_this).height()});

            }
            //}, 100);

            var parentDep = $(_this).parentsUntil('li').length - 1,
                overflowContainer = $($(_this).parentsUntil('li')[parentDep]);
            overflowContainer.parent().parent().children('li').css({'z-index': 1});
            overflowContainer.parent().css({'z-index': overflowContainer.parent().parent().children('li').length});

            //if (autoCompleteList.find('.ui-menu-item').length == 1) {
            //	autoCompleteList.find('.ui-menu-item:eq(0)').addClass('ui-state-focus');
            // console.log('----------------->   ' + autoCompleteList.find('.ui-menu-item').length);
            //}


        },
        'selectSet': function (thisInput, item) {

            var _this = this;
            var notAutoComplete = false;
            var i = 0;
            var chainFancytree = _this.config.chainFancytree;// Fancytree 연동 유무

            if (item == undefined) {
                item = {};
                item.id = '';
                item.type = 9;
                item.value = $(_this).find('.input').val();
                notAutoComplete = true;
            }

            var thisLiLast = $(thisInput).parent().parent().children('li:eq(' + ($(thisInput).parent().parent().children('li').length - 1) + ')'),
                _thisVal = $(thisInput).val(),
                validateBoolean = null,
                thisUl = $(thisInput).parent().parent(),
                i = 0;

            if (_this.inputCheck($(thisInput)) == true) return false;

            if (_thisVal == null) return false;

            if (_thisVal.length > 0) {
                var inputWidth = 0;

                $(_this).append('<span class="temp" style="letter-spacing: 0;">' + _thisVal.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '').replace(/\\/g, '') + '</span>');
                inputWidth = $(_this).children('span').width();

                $(_this).find('.temp').remove();
                thisLiLast.children('.input').css({width: '100px'});

                if (_this.config.validateFunc != null) {
                    validateBoolean = _this.config.validateFunc(thisLiLast.children('.input'));// , autoCompleteCheckBoolean
                    // alert($(_this).children('.auto_complete_list').css('display'));
                }


                var html5Data = '';
                if (item) {
                    $.each(item, function (key, value) {
                        if (key != 'label') {
                            if (key == 'value') {
                                value = value.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '').replace(/\\/g, '');
                                // html5Data = html5Data + 'data-' + key + '="' + value + '" ';
                            }
                            /*
							if (_this.config.useWrapDoubleQuote == true) {
								html5Data = html5Data + "data-" + key + "='" + String(value).replace(/'/g, '&#39;') + "' ";
							}
							else {
								html5Data = html5Data + 'data-' + key + '="' + value + '" ';
							}
							*/
                            html5Data = html5Data + "data-" + key + "='" + String(value).replace(/'/g, '&#39;') + "' ";
                        }
                    });
                }

                // console.log(item);

                _thisVal = _thisVal.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '').replace(/\\/g, '');

                _thisVal = _thisVal.replace('(^\\p{Z}+|\\p{Z}+$)', '');

                /*
				_thisVal = _thisVal.replace(/\s+/, '')//왼쪽 공백제거
										.replace(/\s+$/g, '')//오른쪽 공백제거
										.replace(/\n/g, '')//행바꿈제거
										.replace(/\r/g, '');//엔터제거
				*/
                // _thisVal = _thisVal.replace(/\s+/, '').replace(/\s+$/g, '');

                if (_thisVal.length == 0) {
                    $(thisInput).val('');
                    return false;
                }

                // console.log(item.id);
                if (item.id != '' && item.id != undefined) {			// <----- just7 수정 : 2017-09-28
                    if (_this.inputCheckDataId(item.id) == true) return false;
                }


                /*
				if (validateBoolean === false) {
					thisLiLast.before('<li class="alert"><input type="text" ' + html5Data + ' value="' + _thisVal + '" readonly="readonly" tabindex="-1"> <a href="javascript:void(0);" title="' + common_button_modify + '" class="btn_input_modify" tabindex="-1"><span>' + common_button_modify + '</span></a> <a href="javascript:void(0);" title="' + '연락처추가' + '" class="btn_input_address" tabindex="-1"><span>' + '연락처추가' + '</span></a> <a href="javascript:void(0);" title="' + common_button_delete + '" class="btn_input_delete" tabindex="-1"><span>' + common_button_delete + '</span></a><a href="javascript:void(0);" class="cursor_move" title="' + common_button_move + '" tabindex="-1"><span>' + common_button_move + '</span></a></li>');
				}
				else {
					thisLiLast.before('<li><input type="text" ' + html5Data + ' value="' + _thisVal + '" readonly="readonly" tabindex="-1"> <a href="javascript:void(0);" title="' + common_button_modify + '" class="btn_input_modify" tabindex="-1"><span>' + common_button_modify + '</span></a> <a href="javascript:void(0);" title="' + '연락처추가' + '" class="btn_input_address" tabindex="-1"><span>' + '연락처추가' + '</span></a> <a href="javascript:void(0);" title="' + common_button_delete + '" class="btn_input_delete" tabindex="-1"><span>' + common_button_delete + '</span></a><a href="javascript:void(0);" class="cursor_move" title="' + common_button_move + '" tabindex="-1"><span>' + common_button_move + '</span></a></li>');
				}
				*/

                // console.log(html5Data);


                if (_this.config.useOnlyOrganization == true) {// 조직도 연동시 하나만 입력되도록

                    if (notAutoComplete == true) {
                        thisLiLast.before('<li class="alert xxxxx"><input type="text" ' + html5Data + ' value="' + _thisVal + '" readonly="readonly" tabindex="-1"> <a href="javascript:void(0);" title="' + common_button_delete + '" class="btn_input_delete" tabindex="-1"><span>' + common_button_delete + '</span></a><a href="javascript:void(0);" class="cursor_move" title="' + common_button_move + '" tabindex="-1"><span>' + common_button_move + '</span></a></li>');
                    }
                    else {
                        thisLiLast.before('<li><input type="text" ' + html5Data + ' value="' + _thisVal + '" readonly="readonly" tabindex="-1"> <a href="javascript:void(0);" title="' + common_button_delete + '" class="btn_input_delete" tabindex="-1"><span>' + common_button_delete + '</span></a><a href="javascript:void(0);" class="cursor_move" title="' + common_button_move + '" tabindex="-1"><span>' + common_button_move + '</span></a></li>');
                    }
                }
                else if (_this.config.addContactCallback != false) {// 연락처 추가
                    if (validateBoolean === false) {
                        thisLiLast.before('<li class="alert add_btn"><input type="text" ' + html5Data + ' value="' + _thisVal + '" readonly="readonly" tabindex="-1"> <a href="javascript:void(0);" title="' + common_button_modify + '" class="btn_input_modify" tabindex="-1"><span>' + common_button_modify + '</span></a> <a href="javascript:void(0);" title="' + '연락처추가' + '" class="btn_input_address" tabindex="-1"><span>' + '연락처추가' + '</span></a> <a href="javascript:void(0);" title="' + common_button_delete + '" class="btn_input_delete" tabindex="-1"><span>' + common_button_delete + '</span></a><a href="javascript:void(0);" class="cursor_move" title="' + common_button_move + '" tabindex="-1"><span>' + common_button_move + '</span></a></li>');
                    }
                    else {
                        thisLiLast.before('<li class="add_btn"><input type="text" ' + html5Data + ' value="' + _thisVal + '" readonly="readonly" tabindex="-1"> <a href="javascript:void(0);" title="' + common_button_modify + '" class="btn_input_modify" tabindex="-1"><span>' + common_button_modify + '</span></a> <a href="javascript:void(0);" title="' + '연락처추가' + '" class="btn_input_address" tabindex="-1"><span>' + '연락처추가' + '</span></a> <a href="javascript:void(0);" title="' + common_button_delete + '" class="btn_input_delete" tabindex="-1"><span>' + common_button_delete + '</span></a><a href="javascript:void(0);" class="cursor_move" title="' + common_button_move + '" tabindex="-1"><span>' + common_button_move + '</span></a></li>');
                    }
                }
                else {
                    if (validateBoolean === false) {
                        thisLiLast.before('<li class="alert"><input type="text" ' + html5Data + ' value="' + _thisVal + '" readonly="readonly" tabindex="-1"> <a href="javascript:void(0);" title="' + common_button_modify + '" class="btn_input_modify" tabindex="-1"><span>' + common_button_modify + '</span></a> <a href="javascript:void(0);" title="' + common_button_delete + '" class="btn_input_delete" tabindex="-1"><span>' + common_button_delete + '</span></a><a href="javascript:void(0);" class="cursor_move" title="' + common_button_move + '" tabindex="-1"><span>' + common_button_move + '</span></a></li>');
                    }
                    else {
                        thisLiLast.before('<li><input type="text" ' + html5Data + ' value="' + _thisVal + '" readonly="readonly" tabindex="-1"> <a href="javascript:void(0);" title="' + common_button_modify + '" class="btn_input_modify" tabindex="-1"><span>' + common_button_modify + '</span></a> <a href="javascript:void(0);" title="' + common_button_delete + '" class="btn_input_delete" tabindex="-1"><span>' + common_button_delete + '</span></a><a href="javascript:void(0);" class="cursor_move" title="' + common_button_move + '" tabindex="-1"><span>' + common_button_move + '</span></a></li>');
                    }
                }

                thisLiLast.prev().data('jsonData', item); //최도영 추가
                $(thisInput).val('');

                if (inputWidth < 50) inputWidth = 50;
                thisUl.children('li:eq(' + (thisUl.children('li').length - 2) + ')').children('input').css({width: _this.inputWidthSet(thisUl.children('li:eq(' + (thisUl.children('li').length - 2) + ')'))}); // + 10

                _this.subInputEventHandler(thisLiLast.prev());
                $(_this).find('.auto_complete_list, .favorite_list, .btn_area').hide();

                if (_this.config.placeholder != null) {
                    if ($(_this).children('.input_list').children('li').length > 1) $(_this).find('.change_auto_complete').addClass('none');
                }
            }
            if (_this.config.maxRegistNum != null) {
                if ($(_this).find('.input_list').children('li').length > _this.config.maxRegistNum) {
                    $(_this).find('.input').blur().parent().hide();
                    $(_this).parent().children('.input_area').removeClass('active');
                    return false;
                }
                else {
                    $(_this).find('.input_zone').show();
                }
            }

            if (_this.config.addCallback != null) {
                _this.config.addCallback();
            }
            $(_this).find('.input_list').scrollTop($(_this).find('.input_list').prop('scrollHeight'));


            if (chainFancytree != null) {// 메신저

                var empId = item.id;
                var node;
                var nodeArr;

                nodeArr = chainFancytree.fancytree('getTree').getNodesByRef(empId);

                if (nodeArr == null) return;
                var nodeArrLength = nodeArr.length;

                if (nodeArrLength == 0) return;
                for (i = 0; i < nodeArrLength; i++) {
                    node = nodeArr[i];
                    node.setSelected(true);
                }

                return false;
            }

        },
        'subInputAutocomplete': function (input) {
            var _this = this;
            input.off().on('focus', function (event) {
                $(_this).find(".input").val('');
                _this.tabReset(this);

                var __this = this;

                $(this).autocomplete({
                    // autoFocus: true,
                    delay: 2,
                    minLength: _this.config.minLength,
                    appendTo: $(_this).children('.auto_complete_list'),
                    source: _this.config.autoList,
                    open: function (event, ui) {
                        _this.autoListSet();
                    },
                    select: function (event, ui) {
                        var targetInput = $(this);
                        setTimeout(function () {
                            if (_this.inputCheck(targetInput) == true) return false;
                            _this.registAutocompleteReset();
                            $(_this).find(".input").autocomplete('enable').focus().selectRange($(_this).find(".input").val().length, $(_this).find(".input").val().length);
                            ;
                        }, 1);
                    },
                    response: function (event, ui) {
                        /*
						if (ui.content.length == 1) {
							$(__this).autocomplete('option', 'autoFocus', true );
						}
						else {
							$(__this).autocomplete('option', 'autoFocus', false );
						}
						*/


                        var index = $(this).parent().index() + 1;
                        var autoCompleteList = $(_this).children('.auto_complete_list');
                        setTimeout(function () {
                            if (autoCompleteList.children('ul:eq(' + index + ')').css('display') == 'none') {
                                $(_this).find('.auto_complete_list, .favorite_list, .btn_area').hide();
                            }
                        }, 1);

                    }
                }).autocomplete("search", $(this).val());

            }).on('blur', function (event) {
                $(this).attr({'value': $(this).val(), 'data-value': $(this).val()});
                $(this).autocomplete('destroy');
            }).on('keyup', function (event) {
                var inputWidth = _this.inputWidthSet($(this).parent());
                $(this).css({width: inputWidth + 42});
                if (event.keyCode == 13) {// enter
                    if (_this.inputCheck($(this)) == true) return false;
                    $(this).attr({'value': $(this).val(), 'data-value': $(this).val()});

                    _this.registAutocompleteReset();

                    $(_this).find(".input").focus();
                    if ($(this).val() == '') {
                        $(this).parent().remove();
                    }
                }
                else if (event.keyCode == 8) {// back space
                    if ($(this).val() == '') $(_this).find('.auto_complete_list, .favorite_list, .btn_area').hide();
                }
                _this.thisHeightSet();
            });
        },
        'subInputEventHandler': function (inputParent) {
            var _this = this;

            inputParent.children('.btn_input_modify').off().on('mousedown', function (event) {			// 수정
                _this.subInputAutocomplete(inputParent.children('input[type=text]'));
                _this.registAutocompleteReset($(this).parent().index());
                $(this).parent().removeClass('active');
            });
            inputParent.children('.btn_input_delete').off().on('click', function (event) {				// 삭제
                $(this).parent().remove();
                $(_this).find(".input").val('').focus();
                $(_this).find('.auto_complete_list, .favorite_list, .btn_area').hide();
                _this.thisHeightSet();

                if (_this.config.addCallback != null) {
                    _this.config.addCallback();
                }

                setTimeout(function () {// 양식편집기에서 사용(테이블에서 자동완성이 다수 일때 index 조정하기 위함)
                    if ($(_this).closest('.form_auto_complete')) {
                        $(_this).closest('.form_auto_complete').css({'z-index': ''});
                        $('body').focus();
                    }
                }, 30);
            });

            var chainFancytree = _this.config.chainFancytree;
            if (chainFancytree != null) {// 메신저 대화초대 fancytree 연동 : 삭제시 체크박스 해제

                //console.log('----------------------------');
                //console.log(chainFancytree);

                inputParent.on('remove', function () {

                    var dataType = $(this).children('input').data('type');
                    var empId = $(this).children('input').data('id');
                    var node;
                    var nodeArr;

                    // console.log('----------------------------');
                    // console.log(dataType);


                    if (dataType == 3) {
                        nodeArr = chainFancytree.fancytree('getTree').getNodesByRef(empId);
                        // console.log(nodeArr);
                        if (nodeArr == null) return;
                        var nodeArrLength = nodeArr.length;
                        var i = 0;
                        if (nodeArrLength == 0) return;
                        for (i = 0; i < nodeArrLength; i++) {
                            node = nodeArr[i];
                            node.setSelected(false);
                        }
                    }
                    else {
                        node = chainFancytree.fancytree('getTree').getNodeByKey(empId);
                        node.setSelected(false);
                    }
                });
            }

            inputParent.children('.btn_input_address').off().on('click', function (event) {			// 연락처 추가
                // console.log($(this).parent());
                var email = $(this).closest('li').children('input').val();
                var firstIndex = email.indexOf('<');
                var lastIndex = email.indexOf('>');
                console.log(firstIndex, lastIndex);

                var jsonData
                if (firstIndex < 0) {
                    jsonData = {
                        email: email
                    };
                }
                else {
                    userName = email.substr(0, firstIndex);
                    email = email.substr((firstIndex + 1), (lastIndex - firstIndex - 1));
                    jsonData = {
                        userName: userName,
                        email: email
                    };
                }


                var options = {
                    url: commonConfig.context + '/data/adr/address/adrAddressInsertOut.do',
                    data: JSON.stringify(jsonData),// JSON.stringify({'userName': userName, 'email': emailOnly}),
                    type: 'POST',
                    dataType: 'html',
                    success: function (res, status) {
                        $.publish.openLayer(res, {
                            draggableResizable: true, //drag, resize 기능 사용 여부
                            backgroundSet: true
                        });
                    }
                };
                $.common.ajax(options);
            });
            inputParent.children('.cursor_move').off().on('mousedown', function (event) {
                _this.registAutocompleteReset();
                $(this).addClass('focus').focus();
                if (event.ctrlKey) {// ctrl
                    $(_this).find(".input").blur();
                    $(_this).focus();
                    $(this).parent().toggleClass('active');
                }
            }).on('mouseup', function (event) {
                $(this).removeClass('focus');
            });
        },
        'thisHeightSet': function () {
            var _this = this;
            if ($(_this).outerHeight() > 26) {
                $(_this).addClass('btn_border_reset');
            }
            else {
                $(_this).removeClass('btn_border_reset');
            }
        },
        'tabReset': function (thisInput) {
            var _this = this;
            var tabArea = $(_this).children('.btn_area').children('.tab_area');
            tabArea.children('.tab').removeClass('active').parent().parent().removeClass('active');
            tabArea.children('.tab:eq(0)').addClass('active');
            $(_this).find('.favorite_list').hide();
        },
        'inputTarget': function () {
            var _this = this;
            var length = $(_this).children('.input_list').children('li').length - 1,
                targetObj = null;
            for (var i = 0; i < length; i++) {
                if ($(_this).children('.input_list').children('li:eq(' + i + ')').children('.cursor_move').css('display') == 'none') {
                    targetObj = $(_this).children('.input_list').children('li:eq(' + i + ')');
                    break;
                }
            }
            return targetObj;
        },
        'autoCompleteFocus': function () {
            var _this = this;
            var targetObj = _this.inputTarget();
            if (targetObj == null) $(_this).find('textarea').focus();
            else targetObj.children('input').focus();
        },
        'mailAddressInput': function (thisInput) {
            var _this = this;
            var inputWidth = 0;
            $(_this).append('<span class="temp" style="letter-spacing: 0;">' + $(thisInput).val().replace('<', 'A') + '</span>');
            inputWidth = $(_this).children('span').outerWidth() + 20;
            if (inputWidth < 50) inputWidth = 50;
            $(thisInput).css({width: inputWidth});
            $(_this).find('.temp').remove();
            _this.thisHeightSet();
        },
        'registAutocompleteReset': function (index) {// 수정 모드 초기화 및 활성화 설정
            var _this = this,
                validateBoolean = null;
            setTimeout(function () {
                if (index == undefined) index = 10000;
                $(_this).find('textarea').val('').autocomplete('close');
                $(_this).children('.input_list').children('li').removeClass('mail_input');
                $(_this).find('.auto_complete_list, .favorite_list, .btn_area').hide();
                var length = $(_this).children('.input_list').children('li').length - 1,
                    inputWidth = 0,
                    liObj = null;
                for (var i = 0; i < length; i++) {
                    liObj = $(_this).children('.input_list').children('li:eq(' + i + ')');
                    inputWidth = _this.inputWidthSet(liObj);
                    if (_this.config.validateFunc != null) validateBoolean = _this.config.validateFunc(liObj.children('input'));
                    if (validateBoolean === false) liObj.addClass('alert');
                    else {
                        if (_this.config.useOnlyOrganization != true) {
                            liObj.removeClass('alert');
                        }
                    }

                    liObj.removeClass('mail_input').children('input').css({width: inputWidth}).attr('readonly', 'readonly');
                    if (index == i) {
                        liObj.children('input').css({width: inputWidth + 43}).removeAttr('readonly').focus().selectRange(liObj.children('input').val().length, liObj.children('input').val().length);
                        // 연락처 추가 63

                        liObj.addClass('mail_input').children('input').removeAttr('readonly').focus();
                    }
                    else {
                        if (liObj.hasClass('alert') == true) liObj.removeClass('mail_input').children('input').css({width: inputWidth - 0}).attr('readonly', 'readonly');
                        else liObj.removeClass('mail_input').children('input').css({width: inputWidth}).attr('readonly', 'readonly');
                    }

                    if (liObj.children('input').val() == '') {
                        liObj.remove();
                    }
                }
            }, 1);
        },
        'inputCheckDataId': function (dataId) {
            var _this = this,
                thisUl = $(_this).children('ul:eq(0)'),
                thisUlLength = $(_this).children('ul:eq(0)').children('li').length - 1;

            for (var i = 0; i < thisUlLength; i++) {
                if (thisUl.children('li:eq(' + i + ')').children('input[type=text]').data('id') == dataId) {
                    $(_this).find('.input').val('').blur().focus();
                    return true;
                }
            }
        },
        'inputCheck': function (input) {

            var _this = this,
                thisUl = $(_this).children('ul:eq(0)');
            var thisUlLength = $(_this).children('ul:eq(0)').children('li').length - 1,
                returnValue = null;


            if (input.hasClass('input') == true) {

                // console.log(input);

                for (var i = 0; i < thisUlLength; i++) {

                    if (thisUl.children('li:eq(' + i + ')').children('input[type=text]').val() == input.val()) {

                        input.val('').blur().focus();
                        returnValue = true;

                        //if (_this.config.useOnlyOrganization == true) {
                        //	returnValue = true;
                        //	alert(1)
                        //}

                        return returnValue;
                    }
                }
            }
            else {

                for (var i = 0; i < thisUlLength; i++) {
                    if (input.parent().index() != i) {
                        if (thisUl.children('li:eq(' + i + ')').children('input[type=text]').val() == input.val()) {
                            input.val('').focus().blur().parent().remove();
                            _this.registAutocompleteReset();
                            return false;
                        }
                    }
                }
            }
            // alert($(_this).find('.input_list').children('li').length);

        },
        'inputWidthSet': function (thisParent) {
            var _this = this,
                inputVal = thisParent.children('input').val();
            $(_this).append('<span class="temp" style="letter-spacing: 0;">' + inputVal.replace('<', 'A') + '</span>');
            var inputWidth = $(_this).children('.temp').outerWidth();
            if (inputWidth < 50) inputWidth = 50;
            $(_this).find('.temp').remove();
            return inputWidth;
        }
    };

    $.fn.ascDesc = function (defaults) {
        defaults = $.extend(
            {
                mode: null,
                callBackFunc: null
            }, defaults);
        $.getInit(this, ascDesc, $.extend({}, $.fn.ascDesc.defaults, defaults));
    };
    var ascDesc = {
        'init': function () {
            var _this = this,
                list = _this.config.list,
                titleStr = $(this).attr('title');

            $(_this).on('click', function () {
                $(this).toggleClass('active');
                var callBackStr = '';
                if ($(this).hasClass('active') == true) {
                    titleStr = titleStr.replace(new RegExp(common_title_descended, 'g'), common_title_ascended);// titleStr = titleStr.replace(/내림/g, '오름');
                    $(this).attr('title', titleStr);
                    callBackStr = 'asc';
                }
                else {
                    titleStr = titleStr.replace(new RegExp(common_title_ascended, 'g'), common_title_descended);// titleStr = titleStr.replace(/오름/g, '내림');
                    $(this).attr('title', titleStr);
                    callBackStr = 'desc';
                }
                _this.config.callBackFunc(callBackStr);
            }).attr('title', titleStr).addClass('active');

            if (_this.config.mode == null) {
                titleStr = titleStr.replace(new RegExp(common_title_descended, 'g'), common_title_ascended);// titleStr = titleStr.replace(/내림/g, '오름');
            }
            else {
                titleStr = titleStr.replace(new RegExp(common_title_ascended, 'g'), common_title_descended);// titleStr = titleStr.replace(/오름/g, '내림');
                $(_this).removeClass('active');
            }
        }
    };

    $.fn.tabPortletDisplaySet = function (defaults) {
        defaults = $.extend(
            {
                active: 0,
                tabListSet: true
            }, defaults);
        $.getInit(this, tabPortletDisplaySet, $.extend({}, $.fn.tabPortletDisplaySet.defaults, defaults));
    };
    var tabPortletDisplaySet = {
        'init': function () {
            var _this = this;
            _this.setting().eventSet();
        },
        'setting': function () {
            var _this = this;
            _this.config.portletContents = $(_this).parent().next();
            _this.config.tabUl = $(_this).children('ul');

            var activeTab = $(_this).children('ul').children('li:eq(' + _this.config.active + ')');
            var activeContents = $(_this).parent().next().children('div:eq(' + _this.config.active + ')');

            activeTab.addClass('tab_active');
            activeContents.addClass('tab_active');

            $(_this).next().children('a').attr({'title': '더보기(' + activeTab.children('a').attr('title') + ')'});

            _this.config.minusWidth = 190;

            if (parseInt($(_this).parent().parent().parent().attr('data-gs-width')) == 3) {
                _this.config.minusWidth = 80;
            }
            if (parseInt($(_this).parent().parent().parent().attr('data-gs-width')) == 4) {
                _this.config.minusWidth = 150;
            }
            if (parseInt($(_this).parent().parent().parent().attr('data-gs-width')) == 5) {
                _this.config.minusWidth = 160;
            }

            return _this;
        },
        'eventSet': function () {
            var _this = this,
                portletContents = _this.config.portletContents,
                tabUl = _this.config.tabUl;

            tabUl.off('click', 'li a').on('click', 'li a', function () {
                var portletId = $(this).prop('id').substr($(this).prop('id').lastIndexOf('_') + 1);
                portletContents.children('div').removeClass('tab_active');
                portletContents.children('#publish_portletContents_' + portletId).addClass('tab_active');

                tabUl.children('li').removeClass('tab_active');
                $(this).parent().addClass('tab_active');

                $(_this).next().children('a').attr({'title': '더보기(' + $(this).attr('title') + ')'});

                $.publish.displayPortlet($('#publish_mainPortlet'));
                $.publish.displayPortlet($('#publish_viewPortlet'));
            });
            // if (_this.config.moreListSet == true) {
            $(window).on("orientationchange resize", windowResizeDisplaySet);

            function windowResizeDisplaySet(event) {
                if ($(_this).width() != 0) _this.displayTabPortlet();
            }

            // }
            // else {
            // $(_this).next().children('a').css({ display:'none' });
            // }

            _this.displayTabPortlet();
        },
        'displayTabPortlet': function () {
            /*
			var _this = this,
				portletContents = $(_this).parent().next(),
				tabUl = $(_this).children('ul'),
				tabLength = tabUl.children('li').length,
				defaultWidth = $(_this).outerWidth(),
				minusWidth = _this.config.minusWidth,
				checkWidth = 0,
				moreListArray = [];
				defaultWidth = defaultWidth - minusWidth;

			for (var i = 0; i < tabLength; i++) {
				checkWidth = checkWidth + tabUl.children('li:eq(' + i + ')').outerWidth();

				if (defaultWidth < checkWidth) {
					if (tabUl.children('li:eq(' + i + ')').hasClass('tab_active') == false) {
						if (_this.config.tabListSet == true) { tabUl.children('li:eq(' + i + ')').removeClass('on'); }
						moreListArray.push(tabUl.children('li:eq(' + i + ')').outerHTML());
					}
				}
				else {
					 tabUl.children('li:eq(' + i + ')').addClass('on');
				}
			}
			// if (_this.config.tabListSet == true) {



			if (defaultWidth < checkWidth) {
				var moreList = $(_this).children('.more_list'),
					moreLength = moreListArray.length,
					moreListUl;

					moreList.addClass('active');
					moreList.children('ul').remove();
					moreList.append('<ul></ul>');
					moreListUl = moreList.children('ul');

				for (i = 0; i < moreLength; i++) {
					moreListUl.append(moreListArray[i]);
					var moreListLi_id = moreListUl.children('li:eq(' + i + ')').children('a').prop('id');
					moreListUl.children('li:eq(' + i + ')').children('a').attr('id' , 'publish_portletMore_' + moreListLi_id.substr(moreListLi_id.lastIndexOf('_') + 1));
				}

				if (moreListUl.children('li').length == 0) moreList.removeClass('active');

				moreList.off('click', '.more').on('click', '.more', function() {
					moreListUl.toggle();
					if (moreListUl.css('display') == 'none') $(this).attr({ 'title' : '탭 보기' });
					else {
						$(this).attr({ 'title' : '탭 닫기' });
						moreListUl.css({ width: $(_this).parent().parent().outerWidth() - $(_this).children('ul').outerWidth() + 6 - 17 });
					}
				});
				moreList.off('click', 'li').on('click', 'li', function() {

					var portletId = $(this).children('a').prop('id').substr( $(this).children('a').prop('id').lastIndexOf('_') + 1);
					portletContents.children('div').removeClass('tab_active');
					portletContents.children('#publish_portletContents_' + portletId).addClass('tab_active');

					$(_this).next().children('a').attr({ 'title' : '더보기(' + $(this).children('a').attr('title') + ')' });

					_this.displayTabPortletReset($(this).children('a'));
				});

				//moreList.off('click', 'li a').on('click', 'li a', function() {
				//	var portletId = $(this).prop('id').substr( $(this).prop('id').lastIndexOf('_') + 1);
				//	portletContents.children('div').removeClass('tab_active');
				//	portletContents.children('#publish_portletContents_' + portletId).addClass('tab_active');

				//	$(_this).next().children('a').attr({ 'title' : '더보기(' + $(this).attr('title') + ')' });

				//	_this.displayTabPortletReset($(this));
				//});

				moreList.off('mouseleave').on('mouseleave', function(event) {
					moreListUl.hide();
					moreList.children('.more').attr({ 'title' : '탭 보기' });
				});
			}
			else {
				$(_this).children('.more_list').removeClass('active');
			}
			*/

            //}
        },
        'displayTabPortletReset': function (thisObj) {
            var _this = this,
                portletContents = $(_this).parent().next(),
                tabUl = $(_this).children('ul'),
                tabLength = tabUl.children('li').length,
                defaultWidth = $(_this).outerWidth(),
                checkWidth = 0,
                allMoreListArray = [],
                moreListArray = [],
                thisObjId = thisObj.prop('id').substr(thisObj.prop('id').lastIndexOf('_') + 1);

            var tabLastNum = null,
                liHtml,
                liTarget,
                liTargetA,
                liId,
                prevId,
                tempId;
            for (var i = 0; i < tabLength; i++) {
                var tabLi = tabUl.children('li:eq(' + i + ')');
                allMoreListArray.push(tabLi);

                if (tabLi.hasClass('on') == false) {
                    if (tabLastNum == null) tabLastNum = i - 1;
                    if (tabLi.prop('id') != thisObjId) moreListArray.push(tabLi);
                }
            }

            for (i = 0; i < moreListArray.length; i++) {
                moreListArray[i].remove();
            }

            liTarget = tabUl.children('li:eq(' + tabLastNum + ')');
            liTargetA = liTarget.children('a');

            prevId = liTargetA.prop('id');
            prevId = prevId.substr(prevId.lastIndexOf('_') + 1);

            liHtml = liTarget.html();

            tempId = liTargetA.prop('id').substr(0, liTargetA.prop('id').length - prevId.length);
            liTarget.html(thisObj.parent().html());

            liTargetA = liTarget.children('a');// 바뀐 a태그로 재정의
            liId = liTargetA.prop('id');
            liId = liId.substr(liId.lastIndexOf('_') + 1);

            tabUl.append('<li>' + liHtml + '</li>');
            for (i = 0; i < moreListArray.length; i++) {
                if (tempId + liId != moreListArray[i].children('a').prop('id')) {
                    tabUl.append(moreListArray[i].outerHTML());
                }
            }
            tabUl.children('li').removeClass('tab_active');
            //liTargetA.attr({ 'id' : tempId + liId }).parent().addClass('tab_active');
            liTargetA.attr({'id': tempId + liId}).parent().addClass('tab_active').children('a:eq(0)').click();

            _this.displayTabPortlet();
        }
    };


    $.fn.selectPeriod = function (defaults) {
        defaults = $.extend(
            {
                reset: false,
                radioValue: null,
                prevYear: 10,
                afterYear: 0,
                callBack: null,
                id: [],// 'year1':'year1_id', 'year2':'year2_id', 'month': 'month_id', 'startDt': 'calender_startDt', 'endDt': 'calender_endDt'
                name: [],// 'year1':'year1_name', 'year2':'year2_name', 'month': 'month_name'
                checkedValue: [],
                year1: null,
                month: null,
                year2: null,
                startDt: null,
                endDt: null

            }, defaults);
        $.getInit(this, selectPeriod, $.extend({}, $.fn.selectPeriod.defaults, defaults));

        return $(this);
    };
    var selectPeriod = {
        'init': function () {
            var _this = this;


            _this.eventHandlerSet();


        },
        'eventHandlerSet': function () {
            var _this = this,
                yearLength = _this.config.prevYear;
            //,
            //yearLength = 10,
            //id = _this.config.id,
            //nameString = _this.config.name;


            // 현재 년, 월 적용
            var dt = new Date();
            var year = dt.getFullYear();
            var month = ("0" + (dt.getMonth() + 1)).slice(-2);
            var day = dt.getDate();


            _this.resetToggleList();// 전체 초기화


            var radioValue = _this.config.radioValue,
                childrenDiv = $(_this).children('div');
            selectListUl = childrenDiv.children('.select_list'),
                selectList = selectListUl.children('li'),
                periodContents = childrenDiv.children('.period_contents'),
                periodContentsUl = periodContents.children('ul'),
                i = 0,
                forLength = selectList.length;


            if (_this.config.reset == false) {

                var callBack = _this.config.callBack,
                    nameString = _this.config.name,
                    prevYear = _this.config.prevYear,
                    afterYear = _this.config.afterYear;

                $(_this).data(_this.config);

                _this.config.settingBoolean = true;
                selectListUl.children('li').removeClass('active selected').children('input[type=radio]').prop('checked', false);

                if (radioValue == null) {
                    selectListUl.children('li:eq(0)').addClass('active').children('input[type=radio]').prop('checked', true);
                    $(_this).children('.arrow').children('span').text((selectListUl.children('li:eq(0)').text()));
                }
                else {
                    selectListUl.children('li').removeClass('active').children('input[type=radio]').prop('checked', false);
                    periodContentsUl.children('li').removeClass('active');

                    for (i = 0; i < forLength; i++) {
                        if (selectListUl.children('li:eq(' + i + ')').children('input[type=radio]').val() == radioValue) {
                            selectListUl.children('li:eq(' + i + ')').addClass('active').prop('checked', true);
                            $(_this).children('.arrow').children('span').text((selectListUl.children('li:eq(' + i + ')').text()));
                            periodContents.addClass('active');
                            periodContentsUl.children('li:eq(' + (i + 1) + ')').addClass('active');
                            break;
                        }
                    }
                }

                if (prevYear == null) prevYear = 10;
                if (afterYear == null) afterYear = 0;

                $(_this).on('outsideclick', function (event) {
                    if (_this.selectListUl) {
                        $(_this).children('div').hide();
                        _this.selectListUl.children('li').removeClass('selected');
                        _this.periodContentsUl.children('li').removeClass('active');// 주석 해제시 기간검색이 두개 이상일때 outsideclick 이벤트로 선택 박스가 사라짐
                    }
                });


                $(_this).off('click', '.btn_check').on('click', '.btn_check', function (event) {

                    selectListUl = $(this).closest('.select_period').find('.select_list');
                    //_this.selectListUl = selectListUl;

                    var thisIndex = selectListUl.children('li.selected').index();


                    console.log(thisIndex);
                    console.log(selectListUl);

                    //alert(_this.config.year2);

                    _this.config.year1 = null;
                    _this.config.month = null;
                    _this.config.year2 = null;
                    _this.config.startDt = null;
                    _this.config.endDt = null;


                    selectListUl.children('li').removeClass('active').children('input[type=radio]').prop('checked', false);
                    selectListUl.children('li:eq(' + thisIndex + ')').addClass('active').children('input[type=radio]').prop('checked', true);

                    $(_this).children('.arrow').children('span').text((selectListUl.children('li.selected').text()));

                    _this.config.checkedValue = [];
                    // periodContents = $(_this).find('.period_contents');
                    periodContents = $(this).closest('.select_period').find('.period_contents');
                    periodContentsUl = periodContents.children('ul');
                    $(this).closest('.select_period')[0].selectListUl = selectListUl;
                    $(this).closest('.select_period')[0].periodContentsUl = periodContentsUl;

                    var activeIndex = selectListUl.children('li.active').index() - 1,
                        periodContentsLi = periodContentsUl.children('li:eq(' + (thisIndex - 1) + ')');

                    if (thisIndex == 1) {
                        _this.config.checkedValue.push(periodContentsLi.children('.select_type:eq(0)').find('li.selected').index());
                        _this.config.checkedValue.push(periodContentsLi.children('.select_type:eq(1)').find('li.selected').index());
                    }
                    else if (thisIndex == 2) {
                        _this.config.checkedValue.push(periodContentsLi.children('.select_type:eq(0)').find('li.selected').index());
                    }
                    else if (thisIndex == 3) {
                        _this.config.checkedValue.push(periodContentsLi.children('.calender:eq(0)').val());
                        _this.config.checkedValue.push(periodContentsLi.children('.calender:eq(1)').val());
                    }


                    selectListUl.children('li').removeClass('selected');
                    $(_this).children('div').hide();

                    //$('#publish_selectSearchPeriod').find(':radio[name="year1_name"]').closest('ul').children('.selected').children('input').val()
                    //$('#test').data('aaaa', 's');


                    if (callBack != null) {
                        callBack();
                    }

                }).children('.arrow').off().on('click', function (event) {

                    selectListUl = $(this).closest('.select_period').find('.select_list');

                    var activeIndex = selectListUl.children('li.active').index() - 1;
                    $(_this).children('div').toggle();

                    console.log($(_this).find('input[type=text].calender'));
                    if ($(window).outerWidth() < 370) {
                        $(_this).find('.period_contents').css({'minWidth': '300px'});
                        $(_this).find('input[type=text].calender').attr('style', 'width: 100px !important');

                    }
                    else {
                        $(_this).find('.period_contents').css({'minWidth': '340px'});
                        $(_this).find('input[type=text].calender').attr('style', 'width: 140px !important');
                    }

                    if ($(_this).children('div').css('display') == 'block') {
                        selectListUl.children('li.active').addClass('selected');
                        var thisIndex = selectListUl.children('li.active').index();

                        if (thisIndex == 0) periodContents.removeClass('active');
                        else {
                            periodContents = $(_this).find('.period_contents');
                            periodContentsUl = periodContents.children('ul');
                            var periodContentsLi = periodContentsUl.children('li:eq(' + (thisIndex - 1) + ')');

                            if (thisIndex == 1) {
                                periodContentsLi.children('.select_type:eq(0)').toggleList({active: (_this.config.checkedValue[0] + 1)});
                                periodContentsLi.children('.select_type:eq(1)').toggleList({active: (_this.config.checkedValue[1] + 1)});
                            }
                            else if (thisIndex == 2) {
                                periodContentsLi.children('.select_type:eq(0)').toggleList({active: (_this.config.checkedValue[0] + 1)});
                            }
                            else if (thisIndex == 3) {
                                periodContentsLi.children('.calender:eq(0)').datepicker("setDate", _this.config.checkedValue[0]);
                                periodContentsLi.children('.calender:eq(1)').datepicker("setDate", _this.config.checkedValue[1]);
                            }
                            periodContentsUl.children('li:eq(' + activeIndex + ')').addClass('active');
                        }
                    }
                    else {
                        selectListUl.children('li').removeClass('selected');
                        periodContentsUl.children('li').removeClass('active');
                    }
                });

                var activeLi = null;

                selectList.off('click', 'label').on('click', 'label', function (event) {
                    // console.log('label');

                    var parent = $(this).parent(),
                        thisIndex = parent.index();
                    /////////////////////////////////////////////
                    periodContents = $(_this).find('.period_contents');
                    periodContentsUl = periodContents.children('ul');
                    var activeIndex = selectListUl.children('li.active').index() - 1,
                        periodContentsLi = periodContentsUl.children('li:eq(' + (thisIndex - 1) + ')');

                    if (selectListUl.children('li:eq(' + thisIndex + ')').hasClass('active') == false) {// 부분 초기화
                        if (thisIndex == 1) {// 년, 월
                            var year1_id = periodContentsLi.children('.select_type:eq(0)').prop('id');
                            var month_id = periodContentsLi.children('.select_type:eq(1)').prop('id');

                            $('#' + year1_id).remove();
                            $('#' + month_id).remove();

                            periodContentsLi.prepend(
                                '<div class="select_type type3 _searchPeriod_year fixing_position" id="' + year1_id + '">' +
                                '<a href="javascript:void(0);" class="arrow" title="년도 선택"><span></span></a>' +
                                '</div> ' +
                                '<div class="select_type type3 _searchPeriod_month fixing_position" id="' + month_id + '">' +
                                '<a href="javascript:void(0);" class="arrow" title="월 선택"><span></span></a>' +
                                '</div>'
                            );

                            var yearId = year1_id,
                                nameStr = nameString['year1'],
                                yearObj = $('#' + yearId),
                                yearObjUL,
                                yearStr,
                                yearIdNum,
                                selectedStr,
                                checkedStr,
                                k;
                            //
                            yearObj.append('<ul></ul>');
                            yearObjUL = yearObj.children('ul');

                            for (k = 0; k < prevYear; k++) {
                                yearStr = year - k;
                                yearIdNum = prevYear - k;
                                selectedStr = '';
                                checkedStr = '';
                                // if (k == 0) checkedStr = 'checked="checked"';

                                if (!_this.config.year1) {
                                    if (k == 0) {
                                        checkedStr = 'checked="checked"';
                                        selectedStr = 'class="selected"';
                                    }
                                }
                                else {
                                    if (yearStr == _this.config.year1) {
                                        checkedStr = 'checked="checked"';
                                        selectedStr = 'class="selected"';
                                    }
                                }

                                yearObjUL.prepend(
                                    '<li ' + selectedStr + '>' +
                                    '<label for="' + yearId + '_' + yearIdNum + '">' + yearStr + ' 년</label>' +
                                    '<input type="radio" class="blind" name="' + nameStr + '" id="' + yearId + '_' + yearIdNum + '" ' + checkedStr + ' value="' + yearStr + '">' +
                                    '</li>'
                                );
                            }
                            yearObjUL.children('.selected').find('input[type=radio]').prop('checked', true);
                            // alert(yearObjUL.outerHTML());


                            // alert(_this.config.afterYear);
                            for (k = 1; k < afterYear + 1; k++) {
                                yearStr = year + k;
                                yearIdNum = prevYear + k;
                                selectedStr = '';
                                checkedStr = '';
                                // if (k == 0) checkedStr = 'checked="checked"';

                                if (!_this.config.year1) {
                                    if (k == 0) {
                                        checkedStr = 'checked="checked"';
                                        selectedStr = 'class="selected"';
                                    }
                                }
                                else {
                                    if (yearStr == _this.config.year1) {
                                        checkedStr = 'checked="checked"';
                                        selectedStr = 'class="selected"';
                                    }
                                }

                                yearObjUL.append(
                                    '<li ' + selectedStr + '>' +
                                    '<label for="' + yearId + '_' + yearIdNum + '">' + yearStr + ' 년</label>' +
                                    '<input type="radio" class="blind" name="' + nameStr + '" id="' + yearId + '_' + yearIdNum + '" ' + checkedStr + ' value="' + yearStr + '">' +
                                    '</li>'
                                );
                            }

                            yearObj.children('.arrow').children('span').text(dt.getFullYear() + ' 년');
                            // yearObj.toggleList();
                            yearObj.toggleList({active: yearObjUL.children('.selected').index() + 1});

                            // alert(yearObjUL.outerHTML());

                            //////////////////////////////////////////////////
                            var monthId = month_id,
                                monthObj = $('#' + month_id),
                                monthNum,
                                monthValue,
                                monthObjUL;

                            monthObj.append('<ul></ul>');
                            monthObjUL = monthObj.children('ul');
                            nameStr = nameString['month'];

                            for (i = 0; i < 12; i++) {
                                monthNum = i + 1;
                                selectedStr = '';
                                checkedStr = '';

                                monthValue = monthNum;
                                if (i < 9) monthValue = '0' + String(monthNum);

                                if (!_this.config.month) {
                                    if (month == monthNum) {
                                        checkedStr = 'checked="checked"';
                                        selectedStr = 'class="selected"';
                                    }
                                }
                                else {
                                    if (monthNum == _this.config.month) {
                                        checkedStr = 'checked="checked"';
                                        selectedStr = 'class="selected"';
                                    }
                                }
                                monthObjUL.append(
                                    '<li ' + selectedStr + '>' +
                                    '<label for="' + monthId + '_' + monthNum + '">' + monthNum + ' 월</label>' +
                                    '<input type="radio" class="blind" name="' + nameStr + '" id="' + monthId + '_' + monthNum + '" ' + checkedStr + ' value="' + monthValue + '">' +
                                    '</li>'
                                );
                            }
                            // monthObj.toggleList();
                            monthObj.children('.arrow').children('span').text(parseInt(month) + ' 월');
                            monthObj.children('.selected').find('input[type=radio]').prop('checked', true);

                            monthObj.toggleList({active: monthObjUL.children('.selected').index() + 1});

                        }
                        else if (thisIndex == 2) {// 년
                            var year2_id = periodContentsLi.children('.select_type:eq(0)').prop('id');

                            $('#' + year2_id).remove();
                            periodContentsLi.prepend(
                                '<div class="select_type type3 _searchPeriod_year fixing_position" id="' + year2_id + '">' +
                                '<a href="javascript:void(0);" class="arrow" title="년도 선택"><span></span></a>' +
                                '</div>'
                            );
                            var year2Id = year2_id,
                                nameStr = nameString['year2'],
                                yearObj = $('#' + year2Id),
                                yearObjUL,
                                yearStr,
                                yearIdNum,
                                selectedStr = '';
                            checkedStr,
                                k;

                            yearObj.append('<ul></ul>');
                            yearObjUL = yearObj.children('ul');

                            for (k = 0; k < prevYear; k++) {
                                yearStr = year - k;
                                yearIdNum = yearLength - k;
                                selectedStr = '';
                                checkedStr = '';

                                if (!_this.config.year2) {
                                    if (k == 0) {
                                        checkedStr = 'checked="checked"';
                                        selectedStr = 'class="selected"';
                                    }
                                }
                                else {
                                    if (yearStr == _this.config.year2) {
                                        checkedStr = 'checked="checked"';
                                        selectedStr = 'class="selected"';
                                    }
                                }

                                //if (k == 0) {
                                //	checkedStr = 'checked="checked"';
                                //	selectedStr = 'class="selected"';
                                //}

                                yearObjUL.prepend(
                                    '<li ' + selectedStr + '>' +
                                    '<label for="' + year2Id + '_' + yearIdNum + '">' + yearStr + ' 년</label>' +
                                    '<input type="radio" class="blind" name="' + nameStr + '" id="' + year2Id + '_' + yearIdNum + '" ' + checkedStr + ' value="' + yearStr + '">' +
                                    '</li>'
                                );
                            }
                            yearObjUL.children('.selected').find('input[type=radio]').prop('checked', true);

                            for (k = 1; k < afterYear + 1; k++) {
                                yearStr = year + k;
                                yearIdNum = prevYear + k;
                                selectedStr = '';
                                checkedStr = '';
                                if (!_this.config.year2) {
                                    if (k == 0) {
                                        checkedStr = 'checked="checked"';
                                        selectedStr = 'class="selected"';
                                    }
                                }
                                else {
                                    if (yearStr == _this.config.year1) {
                                        checkedStr = 'checked="checked"';
                                        selectedStr = 'class="selected"';
                                    }
                                }

                                yearObjUL.append(
                                    '<li ' + selectedStr + '>' +
                                    '<label for="' + yearId + '_' + yearIdNum + '">' + yearStr + ' 년</label>' +
                                    '<input type="radio" class="blind" name="' + nameStr + '" id="' + yearId + '_' + yearIdNum + '" ' + checkedStr + ' value="' + yearStr + '">' +
                                    '</li>'
                                );
                            }
                            yearObj.children('.arrow').children('span').text(dt.getFullYear() + ' 년');
                            // yearObj.toggleList();
                            yearObj.toggleList({active: yearObjUL.children('.selected').index() + 1});
                        }
                        else if (thisIndex == 3) {// 기간 선택
                            periodContentsLi.children('.calender').datepicker("setDate", year + '-' + month + '-' + day);
                            // alert(_this.config.radioValue);
                            // alert(selectListUl.find(':radio[value=' + _this.config.radioValue + ']').parent().index());
                            if (selectListUl.find(':radio[value=' + _this.config.radioValue + ']').parent().index() == thisIndex) {
                                if (_this.config.startDt != null) periodContentsLi.children('.calender:eq(0)').datepicker("setDate", _this.config.startDt);
                                if (_this.config.endDt != null) periodContentsLi.children('.calender:eq(1)').datepicker("setDate", _this.config.endDt);
                            }
                        }
                    }
                    else if (selectListUl.children('li:eq(' + thisIndex + ')').hasClass('active') == true) {
                        if (thisIndex == 1) {
                            periodContentsLi.children('.select_type:eq(0)').toggleList({active: (_this.config.checkedValue[0] + 1)});
                            periodContentsLi.children('.select_type:eq(1)').toggleList({active: (_this.config.checkedValue[1] + 1)});
                        }
                        else if (thisIndex == 2) {
                            periodContentsLi.children('.select_type:eq(0)').toggleList({active: (_this.config.checkedValue[0] + 1)});
                        }
                        else if (thisIndex == 3) {
                            periodContentsLi.children('.calender:eq(0)').datepicker("setDate", _this.config.checkedValue[0]);
                            periodContentsLi.children('.calender:eq(1)').datepicker("setDate", _this.config.checkedValue[1]);
                        }
                    }
                    /////////////////////////////////////////////

                    selectListUl.children('li').removeClass('selected');
                    selectListUl.children('li:eq(' + thisIndex + ')').addClass('selected');

                    if (thisIndex > 0) {
                        periodContents.addClass('active');
                        thisIndex = thisIndex - 1;
                        // periodContentsUl = periodContents.children('ul');
                        periodContentsUl.children('li').removeClass('active');
                        periodContentsUl.children('li:eq(' + thisIndex + ')').addClass('active');
                    }
                    else if (thisIndex == 0) {
                        selectListUl.children('li').removeClass('active').children('input[type=radio]').prop('checked', false);
                        selectListUl.children('li:eq(' + thisIndex + ')').addClass('active').children('input[type=radio]').prop('checked', true);
                        $(_this).children('.arrow').children('span').text((selectListUl.children('li.selected').text()));
                        $(_this).children('div').toggle();
                        if (callBack != null) {
                            callBack();
                        }
                    }
                });

            }
            else {

                selectListUl.children('li').removeClass('active selected').children('input[type=radio]').prop('checked', false);
                selectListUl.children('li:eq(0)').addClass('active selected').children('input[type=radio]').prop('checked', true);
                $(_this).children('.arrow').children('span').text((selectListUl.children('li:eq(0)').text()));

                if (radioValue != null) {
                    periodContentsUl.children('li').removeClass('active');

                    //$(":radio[value=foobar]")
                    //$(':radio[value=' + radioValue + ']')


                    var selectIndex = selectListUl.find(':radio[value=' + radioValue + ']').parent().index();


                    if (selectIndex != 0) {
                        // alert(selectListUl.find(':radio[value=' + radioValue + ']').parent().index());
                        selectListUl.find(':radio[value=' + radioValue + ']').parent().children('label').click();

                        $(_this).find('.btn_check').click();
                    }
                    //if (selectIndex == 1) {
                    //	selectListUl.find(":radio[name='year1_name'][value=2012]").prop('checked', true);
                    //}

                }


            }
        },
        'resetToggleList': function () {
            var _this = this,
                i = 0,
                yearLength = _this.config.prevYear,
                //
                period_contentsUL = $(_this).find('.period_contents').children('ul'),
                period_contentsLength = period_contentsUL.length,
                id = _this.config.id,
                nameString = _this.config.name,
                // 현재 년, 월 적용
                dt = new Date(),
                year = dt.getFullYear(),
                month = ("0" + (dt.getMonth() + 1)).slice(-2),
                day = dt.getDate();


            //var data = $(_this).data();
            //if (data != undefined) {

            //}

            //alert(_this.config.id['year2']);

            //console.log(period_contentsLength);
            //console.log(id['year2']);
            // alert(period_contentsLength);
            if (period_contentsLength == 1) {

                var searchPeriod_year1 = $(_this).find('._searchPeriod_year:eq(0)');
                var searchPeriod_year2 = $(_this).find('._searchPeriod_year:eq(1)');
                var searchPeriod_month = $(_this).find('._searchPeriod_month:eq(0)');
                var startDt = $(_this).find('.calender:eq(0)');
                var endDt = $(_this).find('.calender:eq(1)');

                id = {
                    'year1': searchPeriod_year1.prop('id'),
                    'year2': searchPeriod_year2.prop('id'),
                    'month': searchPeriod_month.prop('id'),
                    'startDt': startDt.prop('id'),
                    'endDt': endDt.prop('id')
                },
                    nameString = {
                        'year1': searchPeriod_year1.children('ul').children('li').children('input').prop('name'),
                        'year2': searchPeriod_year2.children('ul').children('li').children('input').prop('name'),
                        'month': searchPeriod_month.children('ul').children('li').children('input').prop('name')
                    };
                $(_this).find('.period_contents').children('ul').remove();

                // console.log(searchPeriod_year1.prop('id'), searchPeriod_year2.prop('id'), id, nameString);
            }
            //else if (period_contentsLength == 2) {
            //}

            //


            $(_this).find('.period_contents').prepend('<ul></ul>');
            period_contentsUL = $(_this).find('.period_contents').children('ul');
            period_contentsUL.append(
                '<li>' +
                '<div class="select_type type3 _searchPeriod_year fixing_position" id="' + id['year1'] + '">' +
                '<a href="javascript:void(0);" class="arrow" title="년도 선택"><span></span></a>' +
                '</div> ' +
                '<div class="select_type type3 _searchPeriod_month fixing_position" id="' + id['month'] + '">' +
                '<a href="javascript:void(0);" class="arrow" title="월 선택"><span></span></a>' +
                '</div>' +
                '</li>' +
                '<li>' +
                '<div class="select_type type3 _searchPeriod_year fixing_position" id="' + id['year2'] + '">' +
                '<a href="javascript:void(0);" class="arrow" title="년도 선택"><span></span></a>' +
                '</div>' +
                '</li>' +
                '<li>' +
                '<input type="text" title="시작 날짜 설정" class="calender" placeholder="yyyy-mm-dd" id="' + id['startDt'] + '">' +
                '~' +
                '<input type="text" title="종료 날짜 설정" class="calender" placeholder="yyyy-mm-dd" id="' + id['endDt'] + '">' +
                '</li>'
            );

            var yearId = id['year1'],
                nameStr = nameString['year1'],
                yearObj = $('#' + yearId),
                yearObjUL,
                yearStr,
                yearIdNum,
                checkedStr,
                selectedStr,
                k;
            //
            yearObj.append('<ul></ul>');
            yearObjUL = yearObj.children('ul');

            for (k = 0; k < yearLength; k++) {
                yearStr = year - k;
                yearIdNum = yearLength - k;
                selectedStr = '';
                checkedStr = '';
                if (k == 0) {
                    checkedStr = 'checked="checked"';
                    selectedStr = 'class="selected"';
                }

                yearObjUL.prepend(
                    '<li ' + selectedStr + '>' +
                    '<label for="' + yearId + '_' + yearIdNum + '">' + yearStr + ' 년</label>' +
                    '<input type="radio" class="blind" name="' + nameStr + '" id="' + yearId + '_' + yearIdNum + '" ' + checkedStr + ' value="' + yearStr + '">' +
                    '</li>'
                );
            }

            // console.log(dt.getFullYear(), k);

            yearObj.children('.arrow').children('span').text(dt.getFullYear() + ' 년');


            yearObjUL.children('.selected').find('input[type=radio]').prop('checked', true);

            yearObj.toggleList({active: yearObjUL.children('.selected').index() + 1});


            // alert(yearObjUL.children('.selected').outerHTML());

            //////////////////////////////////////////////////
            yearId = null;
            yearObj = null;

            yearId = id['year2'],
                nameStr = nameString['year2'],
                yearObj = $('#' + yearId);
            // alert('#' + yearId)
            yearObj.append('<ul></ul>');
            yearObjUL = yearObj.children('ul');


            //alert(yearId + '         ' + nameStr);

            for (k = 0; k < yearLength; k++) {
                yearStr = year - k;
                yearIdNum = yearLength - k;
                selectedStr = '';
                checkedStr = '';
                if (k == 0) {
                    checkedStr = 'checked="checked"';
                    selectedStr = 'class="selected"';
                }
                yearObjUL.prepend(
                    '<li ' + selectedStr + '>' +
                    '<label for="' + yearId + '_' + yearIdNum + '">' + yearStr + ' 년</label>' +
                    '<input type="radio" class="blind" name="' + nameStr + '" id="' + yearId + '_' + yearIdNum + '" ' + checkedStr + ' value="' + yearStr + '">' +
                    '</li>'
                );
                //console.log(yearObjUL.html());
            }

            // alert(yearObj.outerHTML());

            yearObj.children('.arrow').children('span').text(dt.getFullYear() + ' 년');
            // yearObj.toggleList();

            yearObjUL.children('.selected').find('input[type=radio]').prop('checked', true);

            yearObj.toggleList({active: yearObjUL.children('.selected').index() + 1});


            //////////////////////////////////////////////////
            var monthId = id['month'],
                monthObj = $('#' + monthId),
                monthNum,
                monthValue,
                monthObjUL;

            monthObj.append('<ul></ul>');
            monthObjUL = monthObj.children('ul');
            nameStr = nameString['month'];

            for (i = 0; i < 12; i++) {
                monthNum = i + 1;
                checkedStr = '';
                selectedStr = '';

                monthValue = monthNum;
                if (i < 9) monthValue = '0' + String(monthNum);

                if (month == monthNum) {
                    checkedStr = 'checked="checked"';
                    selectedStr = 'class="selected"';
                }
                monthObjUL.append(
                    '<li ' + selectedStr + '>' +
                    '<label for="' + monthId + '_' + monthNum + '">' + monthNum + ' 월</label>' +
                    '<input type="radio" class="blind" name="' + nameStr + '" id="' + monthId + '_' + monthNum + '" ' + checkedStr + ' value="' + monthValue + '">' +
                    '</li>'
                );
            }
            monthObj.toggleList();
            monthObj.children('.arrow').children('span').text(parseInt(month) + ' 월');

            monthObjUL.children('.selected').find('input[type=radio]').prop('checked', true);

            monthObj.toggleList({active: monthObjUL.children('.selected').index() + 1});

            //alert(monthObjUL.children('.selected').outerHTML());

            //////////////////////////////////////////////////
            $(_this).find('.calender').datepicker({
                changeMonth: true,
                changeYear: true,
                showMonthAfterYear: true
            }).datepicker('option', 'dateFormat', 'yy-mm-dd').datepicker("setDate", year + '-' + month + '-' + day);
        }
    };

    $.fn.messagesPop = function (defaults) {
        defaults = $.extend(
            {
                str: null,
                alert: null,
                callBack: null,
                btnStr: null,
                autoCloseSet: null,
                noneOpacity: false
            }, defaults);
        $.getInit(this, messagesPop, $.extend({}, $.fn.messagesPop.defaults, defaults));
    };

    var messagesPop = {
        'init': function () {
            // alert('messagesPop');
            var __this = this,
                _this = $(this),
                thisParent = _this.parent(),
                btnStr = __this.config.btnStr,
                interval;

            var filter = "win16|win32|win64|mac",
                device = 'pc';
            if (navigator.platform) {
                if (0 > filter.indexOf(navigator.platform.toLowerCase())) {
                    device = 'mobile';
                }
                else {
                    device = 'pc';
                }
            }

            if (btnStr != null) {
                _this.children('.btn_area').html('');
                _this.children('.btn_area').append(btnStr);
            }
            else {
                // _this.children('.btn_area').html('<a href="javascript:void(0);" class="btn confirm bold" id="publish_msgConfirm">' + common_button_confirm + '</a> <a href="javascript:void(0);" class="btn cancle" id="publish_msgCancle">' + common_button_cancel + '</a>');
                _this.children('.btn_area').html('<a href="javascript:void(0);" class="btn confirm bold">' + common_button_confirm + '</a> <a href="javascript:void(0);" class="btn cancle">' + common_button_cancel + '</a>');
            }

            if (this.config.alert == false) {
                _this.children('.msg_container').html(__this.config.str).children('.accent_txt').addClass('bg_complete');
            }
            else if (this.config.alert == true) {
                _this.children('.msg_container').html(__this.config.str).children('.accent_txt').addClass('bg_alert');
            }
            else if (this.config.alert == null) {
                _this.children('.msg_container').html(__this.config.str);
            }
            if (this.config.alert != null) {
                _this.find('.cancle').remove();
            }

            if (__this.config.autoCloseSet == null) {
                if (_this.children('.btn_area').children('a').length == 1) {
                    if (_this.text().length < 39) {
                        interval = setInterval(closeDialog, (_this.text().length * 60));
                    }
                    else {
                        interval = setInterval(closeDialog, (_this.text().length * 80) + 0);
                    }
                }
            }


            if (this.config.noneOpacity == false) {
                thisParent.next().addClass('msg');
            }
            thisParent.addClass('alert').find('a:eq(0)').focus();

            thisParent.addClass('alert').css({'z-index': '9999'}).find('a').off().on('click', function () {

                // closeDialog ();
                _this.removeClass('alert_set');
                $('.icon_alert, .icon_complete').remove();

                thisParent.next().removeClass('msg');
                clearInterval(interval);

                _this.dialog('close');

                if (__this.config.callBack != null) {
                    __this.config.callBack($(this));
                }

            });

            if (device == 'mobile') {
                $(__this).parent().css({'position': 'fixed', top: 40}); // , top : 117

                if ($(window).height() > 500) {
                    $(__this).parent().css({'position': 'fixed', top: 117});
                }
            }

            function closeDialog() {


                //if (__this.config.callBack != null) {
                //	__this.config.callBack($(this));
                //}


                _this.removeClass('alert_set');
                $('.icon_alert, .icon_complete').remove();

                thisParent.next().removeClass('msg');
                clearInterval(interval);

                _this.dialog('close');

                if (__this.config.callBack != null) {
                    __this.config.callBack($(this));
                }
            }
        }
    };


    $.fn.selectFancytreeSet = function (defaults) {
        defaults = $.extend(
            {
                findClass: null,
                htmlString: null,
                offsetParentSet: false
            }, defaults);
        $.getInit(this, selectFancytreeSet, $.extend({}, $.fn.selectFancytreeSet.defaults, defaults));
    };
    var selectFancytreeSet = {
        'init': function () {
            var __this = this,
                findClass = __this.config.findClass,
                htmlString = __this.config.htmlString;
            if (findClass == null || htmlString == null) {
                return false;
            }
            __this.eventSet();
        },
        'eventSet': function () {
            var __this = this,
                body = $('body'),
                findClass = __this.config.findClass,
                htmlString = __this.config.htmlString,
                offsetParentSet = __this.config.offsetParentSet;

            $(__this).find('.' + findClass).on('mouseleave', function (event) {
                var _this = event.currentTarget,
                    fancytreeList = $(_this).children('.fancytree_list');
                if (fancytreeList.prop('className') != undefined) {
                    fancytreeList.remove();
                    $(_this).removeClass('active').children('.arrow').removeClass('active');
                }
            });
            $(__this).find('.' + findClass).children('.arrow').on('click', function (event) {
                var _this = $(this).parent(),
                    fancytreeList = null;

                if (_this.hasClass('active') == false) {
                    $(__this).find('.' + findClass).css({'z-index': 10});
                    _this.append(htmlString).css({'z-index': 100}).addClass('active').children('.arrow').addClass('active');
                    fancytreeList = _this.children('.fancytree_list');
                    fancytreeList.fancytree();

                    if (offsetParentSet == true) {
                        if ((fancytreeList.offset().top + fancytreeList.height() - _this.offsetParent().offset().top) > _this.offsetParent().height()) {
                            fancytreeList.css({top: 0 - fancytreeList.outerHeight()});
                        }
                    }
                }
                else {
                    if ($(event.target).parent().hasClass(findClass) == true) {
                        fancytreeList = _this.children('.fancytree_list');
                        fancytreeList.remove();
                        _this.removeClass('active').children('.arrow').removeClass('active');
                    }
                    if ($(event.target).parent().parent().hasClass(findClass) == true) {
                        fancytreeList = _this.children('.fancytree_list');
                        fancytreeList.remove();
                        _this.removeClass('active').children('.arrow').removeClass('active');
                    }
                }

                fancytreeList = _this.children('.fancytree_list');
                if (fancytreeList != undefined) {
                    fancytreeList.find('.fancytree-node').on('click', function (event) {
                        _this.children('.arrow').removeClass('active').text($(this).children('.fancytree-title').text());
                        _this.removeClass('active');
                        fancytreeList.find('.fancytree-node').removeClass('selected');
                        $(this).addClass('selected').off();
                    });
                }
            });
        }
    };
})(window.jQuery, window);


function closeLayer(targetNum) {
    if (targetNum == undefined) {
        $('#publish_layerWrap').removeClass('active');
        $('#publish_layerWrap').children('.pop').children('div').children('div').removeClass('active');
        $('#publish_layer').children('.layerPopup').remove();
    }
    else if (targetNum == 2) {
        $('#publish_layerWrap').children('.pop:eq(1)').css({top: -99999}).children('.layer_area').children('.layerPopup').remove();
    }
    else if (targetNum == 1) {
        $('#publish_layerWrap').children('.pop:eq(0)').css({top: -99999}).children('.layer_area').children('.layerPopup').remove();
    }
    return false;
}

function layerPopCloseSet(event) {
    var eventTargetParent = $(event.currentTarget).parent(),
        eventTargetParent3 = eventTargetParent.parent().parent().parent(),
        eventTargetParent5 = eventTargetParent3.parent().parent();
    if (eventTargetParent.hasClass('pop') == true) {
        eventTargetParent.css({top: -99999}).children('.layer_area').children('.layerPopup').remove();
    }
    else if (eventTargetParent3.hasClass('pop') == true) {
        eventTargetParent3.css({top: -99999}).children('.layer_area').children('.layerPopup').remove();
    }
    else if (eventTargetParent5.hasClass('pop') == true) {
        eventTargetParent5.css({top: -99999}).children('.layer_area').children('.layerPopup').remove();
    }
    if ($('#publish_layerWrap').find('.layer_area > div').length < 1) $('#publish_layerWrap').removeClass('active');
    return false;
}

function layerExplainSet(bgClass, startYpos, yPos, txt, layerClose, func) {
    var layerExplain = $('#publish_layerExplain'),
        container = $('body'),
        interval = null,
        layerExplainBlind = $('#publish_explainBlind');

    layerExplain.focus();
    if (layerExplain.css('display') == 'none') {
        layerExplain.find('.btn_area').css({display: 'block'});

        $('#publish_bgExplain').attr('class', bgClass);

        layerExplain.stop().find('.txt').removeClass('else').html(txt);

        if (bgClass == 'bg_confirm') {
            layerExplain.find('.txt').addClass('else');
        }
        /*
		if (bgClass == 'bg_confirm') {
			layerExplain.find('.txt').addClass('else');
			layerExplain.find('.cancle').css({ display : 'none' });
		}
		else if (bgClass == 'bg_alert') {
			layerExplain.find('.cancle').css({ display : 'none' });
		}
		*/


        layerExplain.css({
            display: 'block',
            opacity: 0,
            left: container.position().left + (container.outerWidth() / 2) - (layerExplain.outerWidth() / 2),
            top: (container.position().top + startYpos)
        }).animate({opacity: 1, top: (container.position().top + yPos)}, 700, 'easeOutExpo');
        //
        if (bgClass == 'bg_complete' || bgClass == 'bg_alert') {

            layerExplain.find('.confirm, .cancle').removeClass('active');
            layerExplain.find('.confirm').addClass('active');
            // layerExplain.find('.cancle').css({ display : 'none' });
            // layerExplain.find('.confirm, .cancle').off('click', closeLayerExplain);
            layerExplain.find('.confirm, .cancle').off().on('click', closeLayerExplain);
            if (txt.length < 20) interval = setInterval(closeExplain, (txt.length * 220) + 0);
            else interval = setInterval(closeExplain, (txt.length * 170));

            //if (txt.length < 20) interval = setInterval(closeExplain, (txt.length * 100) + 0);
            //else interval = setInterval(closeExplain, (txt.length * 100) + 600);
        }
        layerExplain.find('.btn.bold').focus();
        layerExplainBlind.addClass('active');
    }

    function closeLayerExplain(event) {

        if (func != undefined) {
            func();
        }
        clearInterval(interval);
        layerExplain.stop();
        layerExplain.find('.confirm').off();
        layerExplain.css('display', 'none');
        layerExplainBlind.removeClass('active');
    }

    function closeExplain() {
        clearInterval(interval);
        layerExplain.stop();
        layerExplain.find('.confirm').off();
        layerExplain.css('display', 'none');
        layerExplainBlind.removeClass('active');
        if (layerClose == true) $('#publish_layerWrap').removeClass('active');
    }

    function closeExplainSet() {
        clearInterval(interval);
        layerExplain.stop();
        layerExplain.find('.confirm').off();
        layerExplain.css('display', 'none');
        layerExplainBlind.removeClass('active');
    }
}


function containsCharsOnly(input, chars) {
    for (var inx = 0; inx <= input.val().length; inx++) {
        if (inx == 0) {//최초입력한 문자
            e = window.event;
            if (window.event) {
                key = e.keyCode;
            } else if (e) {
                key = e.which;
            } else {
                return true;
            }
            keychar = String.fromCharCode(key);
            if (chars.indexOf(keychar) == -1)// window.event 에서 받은 keychar 로 유효성 검사.
                return false;
        }
        else {//최초입력 문자가 아니면, input 의 text를 읽어서 처리한다.
            if (chars.indexOf(input.val().charAt(inx)) == -1) {
                return false;
            }
        }
    }
    return true;
}


$(window).load(function () {
    if (navigator.userAgent.indexOf("Firefox") > 0) {
        $('html').addClass("Firefox"); // Firefox
    } else if (navigator.userAgent.indexOf("Opera") > 0) {
        $('html').addClass("Opera");  // Opera
    } else if (navigator.userAgent.indexOf("Chrome") > 0) {
        $('html').addClass("Chrome"); // Chrome
    } else if (navigator.userAgent.indexOf("Safari") > 0) {
        $('html').addClass("Safari"); // Safari
    }
});


function adminLnbEventSet() {
    var lnbLi = $('#publish_adminLnb > li');
    lnbLi.children('a').on('click', function () {
        adminLnb($(this).parent().index(), 0)
    });
    lnbLi.children('ul').children('li').children('a').on('click', function () {
        var parentLi = $(this).parent();
        adminLnb(parentLi.parent().parent().index(), parentLi.index());
    });
}

function adminLnb(dep1, dep2) {
    var lnb = $('#publish_adminLnb'),
        li = lnb.children('li'),
        thisLi = lnb.children('li:eq(' + dep1 + ')');
    li.removeClass('active');
    if (dep1 == undefined) return false;
    thisLi.addClass('active');
    lnb.children('li').children('ul').children('li').removeClass('active');
    if (dep2 == undefined) return false;
    thisLi.find('li:eq(' + dep2 + ')').addClass('active');
}