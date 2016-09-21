// @Wed April 20, 2016
/*!===================================
* Dynamsoft JavaScript Library
* Product: Dynamsoft Image Viewer
* Web Site: http://www.dynamsoft.com
*-------------------------------------
* Copyright 2016, Dynamsoft Corporation
* Author: Dynamsoft Support Team - Tom
* Version: 2.0
* Tested Against: DWT 11.3
*-------------------------------------
* Support: 
* Please send your queries to support@dynamsoft.com and 
* mark it 'Queries about dynamsoft.webtwain.viewer.js'
*-------------------------------------
* Dependencies
* 1.KISSY in dynamsoft.webtwain.initiate.js
* 2.The following CSS rules in 'Resources\referencehtml5_editor.css'
*~~~~~~~~CSS~~~~~~~~
.thumbContainer > ul {
    list-style: none;
    padding: 0;
    margin: 0;
}
.thinborder {
    border: solid 1px #AAAAAA;
}
.noPaddingnoMargin {
    padding: 0;
    margin: 0;
}
*~~~~~~~~CSS~~~~~~~~
===================================*/

/*!===========Options=================
---------------
aryImages 
---------------
_Type: Array
_Default:[]
_Description: This array holds all the image objects which are to be shown in the viewer
_Remarks: 
+Only increases when {.add } is called
+Only decrease when { .remove, .add } are called
---------------
debug
---------------
_Type: Bool
_Default: false
_Description: Whether or not to print out debugging information
---------------
selectedClass
---------------
_Type: String
_Default: "D-ImageUI-selected"
_Description: This class determines how a selected image would look like, you can use your own. But make sure you change it before any image is acquired
----------------
UIViewList
----------------
An object that contains the ul element inside which all images are attached.
UIViewList[0] will return the ul element (HTML)

===================================*/

/*!===========Methods================
---------------
ChangeSize (w,h)
---------------
_Parameter: w - new width; h - new height
_Description: Changes the size of the viewer and update all images inside

---------------
GetViewModeH(),
GetViewModeV()
---------------
_Parameter: None
_Description: Returns how many images are shown horizontally/vertically

---------------
SetViewMode(H,V)
---------------
_Parameter: H,V: How many pages are/should shown/show horizontally/vertically
_Description: Sets how many images are shown horizontally/vertically

---------------
SwitchImage(origin, target)
---------------
_Parameter: origin, target: indexes to switch between
_Description: Switches two images in the viewer
When you call DWT's own SwitchImage, it doesn't trigger OnBitmapChanged. So manual switching is needed

---------------
add(objImage, index)
---------------
_Parameter: 
    +objImage: an object which has at leat the properties 
      {
          src: an URL from which you get the image data 
          width: the width of the image
          height: the height of the image
          bNew: whether the image is newly added/inserted
      }
    +index: where this image should be added/inserted
_Description: adds an image to the viewer's aryImages object, but it won't show the image right away

---------------
clear
---------------
_Parameter: None
_Description: Remove all images from the viewer. The images will remain in the service's cache

---------------
count
---------------
_Parameter: None
_Description: Returns how many images are on the viewer. Equals to .aryImages.length. It has nothing to do with HowManyImagesInBuffer

---------------
fire
---------------
_Parameter: (eventName, arguments)
_Description: Executes the callback function with 'arguments' for the event specified by eventName.

---------------
get
---------------
_Parameter: (index)
_Description: Get the object with the index.

---------------
go
---------------
_Parameter: (index, callback)
_Description: Selects the image specified by 'index', then execute callback

---------------
hide   <--> show
---------------
_Parameter: None
_Description: hides the viewer (display = none);

---------------
show
---------------
_Parameter: None
_Description: shows the viewer (display = '');

---------------
isFirst, isLast
---------------
_Parameter: None
_Description: returns whether the currently selected image is the first or the last

---------------
MoveImage(from, to)
---------------
_Parameter: from, to, 2 indexes
_Description: exchange the positions of two images

---------------
next,nextDown, previous, previousUp, pgaeDown,pageUp
---------------
_Parameter: none
_Description: moves the selection around

---------------
refresh
---------------
_Parameter: none
_Description: refresh and redisplay all images already in the viewer (won't get images from the service)

---------------
remove(index)
---------------
_Parameter: index
_Description: removes an image in the viewer. It doesn't change the cached image

---------------
setBackgroundColor (color)
---------------
_Parameter: a number represents the color like '#ff0000' (red)
_Description: changes the color for the background of each image

---------------
setSelectionImageBorderColor
---------------
_Parameter: a number represents the color like '#ff0000' (red)
_Description: changes the color for the border of selected images

---------------
unhighlightAll
---------------
_Parameter: none
_Description: removes all highlight effect
===================================*/

/*!===========Events================
onMouseClick
onMouseDoubleClick
onMouseMove
onMouseRightClick
onRefreshUI: it's triggerred when the image in the view is navigated
onSelected
onViewerItemsChanged: it's triggerred when an item is changed in the UL that holds the images. add, remove, clear, set, etc.
===================================*/

var DynamsoftViewerInner = DynamsoftViewerInner || {};
KISSY.use(['io', 'json', 'node', 'overlay', 'dom', 'event'], function (S, IO, JSON, Node, O, DOM, EVENT) {
    //imagesArray contains all the image data
    DynamsoftViewerInner.imagesArray = [];
    DynamsoftViewerInner.___ii = ___ii || 10000;
    (function (D, S) {
        //S --> KISSY, it's a modulized JavaScript framework that works across platforms with high performance.
        var doc = document,
		registeredOBJs = [],
		EVENT = S.Event,
		Funs = {
		    isFunction: function (_fun) {
		        return _fun && typeof (_fun) === 'function';
		    },
		    //getHex is used by getColor for converting decimal numbers to heximal numbers
		    getHex: function (_num) {
		        var tmp;
		        tmp = Number(_num).toString(16).toUpperCase();
		        if (tmp.length == 1)
		            tmp = ['0', tmp].join('');
		        return tmp;
		    },
		    //getColor updates an decimal into a 16bit color representation
		    getColor: function (_in) {
		        var tmp, b, g, r;
		        b = _in >> 16;
		        g = (_in & 0xFF00) >> 8;
		        r = _in & 0xFF;
		        tmp = ['#', Funs.getHex(r), Funs.getHex(g), Funs.getHex(b)].join('');
		        return tmp;
		    },
		    //__adjustImageSize fits an image inside a container (here it's a div)
		    __adjustImageSize: function (img, maxW, maxH) {
		        // D.log(['image info:', img.width, ',', img.height, '; max is ', maxW, ',', maxH].join(''));
		        if (maxW <= img.width || maxH <= img.height) {
		            // image exceed max size
		            if (maxW <= img.width && maxH <= img.height) {
		                // both exceed
		                var wratio = maxW / img.width,
							hratio = maxH / img.height,
							minRatio;
		                if (wratio < hratio) {
		                    img.width = Math.floor(img.width * wratio);
		                    img.height = Math.floor(img.height * wratio);
		                } else {
		                    img.width = Math.floor(img.width * hratio);
		                    img.height = Math.floor(img.height * hratio);
		                }
		            } else if (maxW <= img.width) {
		                img.height = Math.floor((maxW / img.width) * img.height);
		                img.width = maxW;
		            }
		            else if (maxH <= img.height) {
		                img.width = Math.floor((maxH / img.height) * img.width);
		                img.height = maxH;
		            }
		        }
		    },
		    //init initiate the Viewer with the configuration data passed in
		    init: function (_ImageBaseUI, cfg) {
		        var _this = _ImageBaseUI, config = cfg || {}, randomId = Math.floor(Math.random() * 100000 + 1);
		        //Fixed values
		        _this.defaultScrollWidth = 20;
		        _this.scrollWidth = 0;
		        _this.selectionImageBorderColor = false;
		        _this.backgroundColor = false;

		        //Configurable
		        _this.DWObject = config.DWObject;
		        _this.containerID = config.containerID || ('dwt-container-' + randomId);
		        _this.width = config.width || 580;
		        _this.height = config.height || 600;
		        _this.debug = config.debug ? true : false;
		        _this['onMouseClick'] = config['onMouseClick'] || false;
		        _this['onMouseDoubleClick'] = config['onMouseDoubleClick'] || false;
		        _this['onMouseMove'] = config['onMouseMove'] || false;
		        _this['onMouseRightClick'] = config['onMouseRightClick'] || false;
		        _this['onRefreshUI'] = config['onRefreshUI'] || false;
		        _this['onSelected'] = config['onSelected'] || false;
		        _this['onViewerItemsChanged'] = config['onViewerItemsChanged'] || false;
		        registeredOBJs.push(_this);
		    },
		    //Used only for setting/changing the size of the viewer
		    setImageUIViewSize: function (_imageUIViewer, w, h) {
		        //_swtwain is an instance of ImageUIView
		        var _this = _imageUIViewer;
		        if (_this.imagesPerRow * _this.imagesPerColumn <= _this.aryImages.length) {
		            _this.scrollWidth = _this.defaultScrollWidth;
		        }
		        else {
		            _this.scrollWidth = 0;
		        }
		        // remember containerWidth & containerHeight
		        _this.containerWidth = w;
		        _this.containerHeight = h;
		        // set width & height
		        _this.width = _this.containerWidth - _this.viewerBorderThickness;
		        _this.height = _this.containerHeight - _this.viewerBorderThickness;
		        // set one Image div wraper size
		        _this.widthPerImage = Math.floor((_this.width - _this.scrollWidth - _this.ImageMargin) / _this.imagesPerRow) - _this.ImageMargin;
		        _this.heightPerImage = Math.floor((_this.height - _this.ImageMargin) / _this.imagesPerColumn) - _this.ImageMargin;
		        // set <UL> size
		        //.css is a custom method defined in dynamsoft.webtwain.initiate.js
		        _this.UIViewList.css({
		            'width': (w - _this.viewerBorderThickness) + 'px',
		            'height': (h - _this.viewerBorderThickness) + 'px',
		            'overflow-x': 'hidden',
		            'overflow-y': 'auto'
		        });
		    },
		    addClass: function (el, _css) {
		        S.one(el).addClass(_css);
		    },
		    removeClass: function (el, _css) {
		        S.one(el).removeClass(_css);
		    },
		    //outputs a message in the console
		    output: function (_ImageBaseUI, msg) {
		        if (_ImageBaseUI.debug) {
		            console.log(msg);
		        }
		    },
		    getImageURLByIndex: function (_Object, _index, _width, _height) {
		        if (_Object._UIManager) {
		            var strDimention = '&width=1&height=1&ticks=';
		            if (typeof (_width) === "number" && typeof (_height) === "number") {
		                strDimention = '&width=' + parseInt(_width) + '1&height=' + parseInt(_height) + '&ticks='
		            }
		            var imageURL = _Object._UIManager._UIView.BaseUrl + '&index=' + _index + strDimention + (DynamsoftViewerInner.___ii++);
		            return imageURL;
		        } else {
		            return false;
		        }
		    }
		};

        function ImageUIView(cfg) {
            var _this = this, config = cfg || {}, container,
				divUI = '<ul class="D_ImageUIView_List"></ul>';

            Funs.init(_this, config);
            if (_this.DWObject) {
                _this.DWObject.RegisterEvent('OnBitmapChanged', function (aryPicID, OpType, cIndex, maxIndex) {
                    //aryPicID, an array of all the changed picture IDs
                    //OpType, the operation type
                    //cIndex, current index
                    //maxIndex, maximum index in buffer
                    var _thisDWObject = this;
                    if (OpType == 5) return;
                    var _aryPicID = aryPicID, _OpType = OpType, _cIndex = cIndex, _maxIndex = maxIndex;
                    if (_OpType == 1 || _OpType == 2) {
                        // append / insert
                        KISSY.each(_aryPicID, function (szItem) {
                            var _index = parseInt(szItem);
                            if (isNaN(_index) || _index < 0) {
                                return true;
                            }
                            var objImageToAddOrUpdate = {};
                            objImageToAddOrUpdate.src = Funs.getImageURLByIndex(_thisDWObject, _index);
                            objImageToAddOrUpdate.width = -1;
                            objImageToAddOrUpdate.height = -1;
                            objImageToAddOrUpdate.bNew = true;
                            _this.add(objImageToAddOrUpdate, _index);
                        });
                    }
                    else if (_OpType == 3) {
                        if (_aryPicID.length == 1 && _aryPicID[0] == -1 || _maxIndex == 0) {
                            //remove all images
                            _this.clear();
                        } else {
                            KISSY.each(_aryPicID, function (szItem, item) {
                                var _index = parseInt(szItem);
                                if (isNaN(_index) || _index < 0) {
                                    return true;
                                }
                                _this.remove(_index);
                            });
                        }
                    }
                    else if (_OpType == 4) {
                        KISSY.each(_aryPicID, function (szItem, item) {
                            var _index = parseInt(szItem);
                            if (isNaN(_index) || _index < 0) {
                                return true;
                            }
                            if (_index >= 0) {
                                var objImg = _this.aryImages[_index];
                                objImg.src = Funs.getImageURLByIndex(_this.DWObject, _index);
                                _this.set(objImg, _index);
                            }
                        });
                    }
                });
            }
            //Set the border width of the viewer
            _this.viewerBorderThickness = 2;
            //set border width so that images don't go over the border
            _this.verticalBorderThickness = 2;
            _this.horizontalBorderThickness = 2;
            // cIndex: current image index
            _this.cIndex = -1;
            _this.bFocus = false;
            // aryImages: all image array
            _this.aryImages = [];
            _this.selectedIndexes = [];
            // selectedClass: (String) default is 't-selected'
            _this.selectedClass = 'D-ImageUI-selected';
            // highlightClass: (String) default is 't-highlight'
            _this.highlightClass = 'D-ImageUI-highlight';
            //Set default view mode
            _this.imagesPerRow = 3;
            _this.imagesPerColumn = 3;
            _this.bYScroll = true;
            _this.ImageMargin = 10;
            //one & append & attr are KISSY methods
            //one gets a list of elements using the selector
            //append append an element to the end of a parent element
            //attr gives a element a special attriute like 'class'
            container = S.one('#' + _this.containerID);
            container.append(divUI);
            _this.UIViewList = container.one('.D_ImageUIView_List');
            _this.UIViewList.attr('class', 'noPaddingnoMargin thinborder thumbContainer');
            // set size
            Funs.setImageUIViewSize(_this, config.width, config.height);
            // bind events
            EVENT.on(_this.UIViewList, "mouseup", function (r) {
                if (r.which ? r.which == 3 : r.button == 2) {
                    _this.fire("onMouseRightClick", _this.cIndex)
                } else {
                    _this.fire("onMouseClick", _this.cIndex)
                }
            });
            EVENT.on(_this.UIViewList, "dblclick", function (r) {
                _this.fire("onMouseDoubleClick", _this.cIndex)
            });
            EVENT.on(_this.UIViewList, "mouseenter", function (r) {
                _this.bFocus = true;
                _this.fire("onMouseMove", _this.cIndex)
            });
            EVENT.on(_this.UIViewList, "mouseleave", function (r) {
                _this.bFocus = false;
                _this.fire("onMouseMove", -1)
            });
            EVENT.on(_this.UIViewList, 'mousewheel', function (e) {
                if (!_this.bFocus)
                    return true;

                var delta = e.delta;

                if (delta < 0) {
                    _this.next();
                    _this.fire('onRefreshUI', _this.cIndex);
                } else if (delta > 0) {
                    _this.previous();
                    _this.fire('onRefreshUI', _this.cIndex);
                }

                return false;
            });
        };
        //fire triggers an event with parameters
        ImageUIView.prototype.fire = function (evtName, params) {
            var _this = this;
            if (Funs.isFunction(_this[evtName])) {
                _this[evtName](params);
            }
        }
        //previous, previousUp, pageUp, next nextDown, pageDown go all navigate images
        ImageUIView.prototype.previous = function (_callback) {
            var _this = this, _count = _this.count();
            if (_count == 0) {
                _this.cIndex = -1;
                return;
            }
            if (_this.cIndex <= 0) {
                _this.cIndex = 0;
            } else {
                _this.cIndex--;
            }
            _this.selectedIndexes = [];
            if (_this.cIndex >= 0 && _this.cIndex < _count) {
                _this.selectedIndexes.push(_this.cIndex);
            }
            _this._refreshSelection();
            _this._refreshScroll();
            if (Funs.isFunction(_callback)) {
                _callback();
            }
        }
        ImageUIView.prototype.previousUp = function () {
            var _this = this, _count = _this.count();
            if (_count == 0) {
                _this.cIndex = -1;
                return;
            }
            if (_this.bYScroll) {
                _this.cIndex -= _this.imagesPerRow;
            } else {
                _this.cIndex--;
            }
            if (_this.cIndex <= 0) {
                _this.cIndex = 0;
            }
            _this.selectedIndexes = [];
            if (_this.cIndex >= 0 && _this.cIndex < _count) {
                _this.selectedIndexes.push(_this.cIndex);
            }
            _this._refreshSelection();
            _this._refreshScroll();
        }
        ImageUIView.prototype.pageUp = function () {
            var _this = this, _count = _this.count();
            if (_count == 0) {
                _this.cIndex = -1;
                return;
            }
            if (_this.bYScroll) {
                _this.cIndex -= _this.imagesPerRow * _this.imagesPerColumn;
            } else {
                _this.cIndex--;
            }
            if (_this.cIndex <= 0) {
                _this.cIndex = 0;
            }
            _this.selectedIndexes = [];
            if (_this.cIndex >= 0 && _this.cIndex < _count) {
                _this.selectedIndexes.push(_this.cIndex);
            }
            _this._refreshSelection();
            _this._refreshScroll();
        }
        ImageUIView.prototype.next = function (_callback) {
            var _this = this, _count = _this.count();
            if (_count == 0) {
                _this.cIndex = -1;
                return;
            }

            if (_this.cIndex >= _count - 1) {
                _this.cIndex = _count - 1;
            } else {
                _this.cIndex++;
            }

            _this.selectedIndexes = [];
            if (_this.cIndex >= 0 && _this.cIndex < _count) {
                _this.selectedIndexes.push(_this.cIndex);
            }

            _this._refreshSelection();
            _this._refreshScroll();

            if (Funs.isFunction(_callback)) {
                _callback();
            }
        }
        ImageUIView.prototype.nextDown = function () {
            var _this = this, _count = _this.count();
            if (_count == 0) {
                _this.cIndex = -1;
                return;
            }

            if (_this.bYScroll) {
                _this.cIndex += _this.imagesPerRow;
            } else {
                _this.cIndex++;
            }

            if (_this.cIndex >= _count - 1) {
                _this.cIndex = _count - 1;
            }

            _this.selectedIndexes = [];
            if (_this.cIndex >= 0 && _this.cIndex < _count) {
                _this.selectedIndexes.push(_this.cIndex);
            }

            _this._refreshSelection();
            _this._refreshScroll();

        }
        ImageUIView.prototype.pageDown = function () {
            var _this = this, _count = _this.count();
            if (_count == 0) {
                _this.cIndex = -1;
                return;
            }

            if (_this.bYScroll) {
                _this.cIndex += _this.imagesPerRow * _this.imagesPerColumn;
            } else {
                _this.cIndex++;
            }

            if (_this.cIndex >= _count - 1) {
                _this.cIndex = _count - 1;
            }

            _this.selectedIndexes = [];
            if (_this.cIndex >= 0 && _this.cIndex < _count) {
                _this.selectedIndexes.push(_this.cIndex);
            }

            _this._refreshSelection();
            _this._refreshScroll();
        }
        ImageUIView.prototype.go = function (_i, bDontRefreshScroll, _callback) {
            var _this = this, _index = _i, _count = _this.count();
            if (S.isUndefined(_index) || _index < 0 || _index >= _count) {
                _index = _this.cIndex;
            }
            _this.cIndex = _index;
            _this.selectedIndexes = [];
            if (_this.cIndex >= 0 && _this.cIndex < _count) {
                _this.selectedIndexes.push(_this.cIndex);
            }
            _this._refreshSelection();
            if (!bDontRefreshScroll)
                _this._refreshScroll();
            if (Funs.isFunction(_callback)) {
                _callback();
            }
        }
        //clear removes all images in the viewer		
        ImageUIView.prototype.clear = function () {
            var _this = this;

            _this.aryImages = [];
            _this.cIndex = -1;
            _this.selectedIndexes = [];
            _this.UIViewList.children().remove();
            _this.fire("onViewerItemsChanged", { op: 'clear', ary: [] });
        }
        //remove removes an image with a specified index
        ImageUIView.prototype.remove = function (_i) {
            var _this = this, _index = _i * 1, _count = _this.count();
            if (S.isUndefined(_index) || _index < 0) {
                return;
            }
            if (_index >= _count) {
                _index = _count - 1;
            }
            _this.aryImages.splice(_index, 1);
            _this.UIViewList.children().item(_index).remove();
            var ____index = _this.cIndex;
            for (var i = _index; i < _this.count() ; i++) {
                var objImg = _this.aryImages[i];
                objImg.src = Funs.getImageURLByIndex(_this.DWObject, i);
                _this.set(objImg, i);
            }
            _this.cIndex = ____index;
            if (_this.cIndex >= _this.aryImages.length) {
                _this.cIndex = _this.aryImages.length - 1;
            }
            // change tag
            S.each(_this.UIViewList.children(), function (item, i) {
                var oLi = S.one(item);
                if (oLi) {
                    var oDivTag = oLi.one('.imgTag');
                    if (oDivTag) {
                        oDivTag.html(i * 1 + 1);
                        S.DOM.data(oDivTag, 'n', i * 1);
                    }
                }
            });
            _this.selectedIndexes = [];
            if (_this.cIndex >= 0 && _this.cIndex < _count) {
                _this.selectedIndexes.push(_this.cIndex);
            }
            _this._refreshSelection();
            _this.fire("onViewerItemsChanged", { op: 'remove', ary: [_index] });
        }
        //refresh clears the view and redisplay them
        ImageUIView.prototype.refresh = function () {
            var _this = this;
            _this.UIViewList.children().remove();
            DynamsoftViewerInner.imagesArray = [];
            for (var i = 0; i < _this.aryImages.length; i++) {
                _this.aryImages[i].bNew = true;
				var ____oldSRC = _this.aryImages[i].src;
				var ____oldIndex = ____oldSRC.substring(____oldSRC.indexOf('index=') + 6, ____oldSRC.indexOf('width=') - 1);
				if(parseInt(____oldIndex) != i){
					_this.aryImages[i].src = ____oldSRC.substring(0, ____oldSRC.indexOf('index=') + 6) 
						+ i.toString() + ____oldSRC.substring(____oldSRC.indexOf('width=') - 1);
				}					
				console.log(_this.aryImages[i].src);
                _this.showImage(i);
            }
        }
        //show & hide shows or hides the image list <ul>
        ImageUIView.prototype.show = function () {
            var _this = this;
            _this.UIViewList.style('display', '');
        }
        ImageUIView.prototype.hide = function () {
            var _this = this;
            _this.UIViewList.style('display', 'none');
        }
        //SetViewMode, GetViewModeH, GetViewModeV are for view mode
        ImageUIView.prototype.SetViewMode = function (hCount, vCount) {
            if (hCount < 0 || vCount < -1) {
                Funs.output(_this, 'Invalid numbers provided');
                return false;
            }
            var _this = this, _cIndex = _this.cIndex, o, preM, curM;
            preM = _this.imagesPerRow * _this.imagesPerColumn;
            if (preM < 0)
                preM = 1;
            curM = hCount * vCount;
            if (curM < 0)
                curM = 1;
            _this.imagesPerRow = hCount;
            _this.imagesPerColumn = vCount;
            if (vCount == -1) {
                // x-scroll
                _this.bYScroll = false;
                _this.imagesPerRow = 1;
                _this.imagesPerColumn = 1;
                _this.width = _this.containerWidth - _this.viewerBorderThickness;
                _this.height = _this.containerHeight - _this.viewerBorderThickness;

                if (_this.selectionImageBorderColor) {
                    _this.width -= _this.viewerBorderThickness;
                    _this.height -= _this.viewerBorderThickness;
                }

                _this.UIViewList.style('overflow-x', 'auto');
                _this.UIViewList.style('overflow-y', 'hidden');

                _this.widthPerImage = Math.floor((_this.width) / _this.imagesPerRow) - _this.ImageMargin;
                _this.heightPerImage = Math.floor((_this.height - _this.scrollWidth) / _this.imagesPerColumn) - _this.ImageMargin;

                var container = S.one('#' + _this.containerID);
                container.style('white-space', 'nowrap');

            } else {
                _this.bYScroll = true;
                // y-scroll
                _this.width = _this.containerWidth - _this.viewerBorderThickness;
                _this.height = _this.containerHeight - _this.viewerBorderThickness;

                if (_this.selectionImageBorderColor) {
                    _this.width -= _this.viewerBorderThickness;
                    _this.height -= _this.viewerBorderThickness;
                }

                _this.UIViewList.style('overflow-y', 'auto');
                _this.UIViewList.style('overflow-x', 'hidden');

                _this.widthPerImage = Math.floor((_this.width - _this.scrollWidth) / _this.imagesPerRow) - _this.ImageMargin;
                _this.heightPerImage = Math.floor(_this.height / _this.imagesPerColumn) - _this.ImageMargin;

                var container = S.one('#' + _this.containerID);
                container.style('white-space', '');

            }
            S.each(_this.UIViewList.children(), function (item) {
                // change width & height & tag
                var oLi = S.one(item);
                if (oLi) {
                    var oDiv = oLi.one('.imgwrap'),
						oImg = oDiv.one('img'),
						oDivTag = oLi.one('.imgTag'),
						tagLineWidth = _this.widthPerImage / 25 < 30 ? 30 : _this.widthPerImage / 25;
                    if (_this.bYScroll) {
                        oLi.style('float', 'left').style('display', 'inline');
                        oDivTag.style('display', 'none');
                    } else {
                        oLi.style('float', '').style('display', 'inline-block');
                        oDivTag.style('display', 'none');
                    }
                    oLi.style('height', _this.heightPerImage + 'px');
                    oLi.style('width', _this.widthPerImage + 'px');
                    oDiv.style('height', _this.heightPerImage - _this.verticalBorderThickness + 'px');
                    oDiv.style('width', _this.widthPerImage - _this.horizontalBorderThickness + 'px');

                    if (oDivTag) {
                        oDivTag.style('width', tagLineWidth + 'px');
                    }
                    if (oImg) {
                        // get original width & height
                        var imgSize, data;
                        if (preM < curM) {
                            imgSize = { width: oImg[0].width, height: oImg[0].height };
                        } else {
                            data = S.DOM.data(oDiv);
                            if (!data)
                                return true;
                            imgSize = { width: data.w, height: data.h };
                        }
                        if (imgSize) {
                            Funs.__adjustImageSize(imgSize, _this.widthPerImage - _this.horizontalBorderThickness, _this.heightPerImage - _this.verticalBorderThickness);
                            // set back to image
                            oImg[0].width = imgSize.width;
                            oImg[0].height = imgSize.height;
                        }
                    }
                }
            });
            o = _this.UIViewList.children().item(_cIndex);
            if (o) {
                if (_this.bYScroll) {
                    S.DOM.scrollIntoView(o, [container = _this.UIViewList, top = true]);
                } else {
                    S.DOM.scrollIntoView(o, [container = _this.UIViewList, top = true, hscroll = true]);
                }
            }
        }
        ImageUIView.prototype.GetViewModeH = function () {
            var _this = this;
            return _this.imagesPerRow;
        }
        ImageUIView.prototype.GetViewModeV = function () {
            var _this = this;
            return _this.imagesPerColumn;
        }
        //isFirst, isLast finds ount whether the current image is the first one or the last one. count gets how many images there are in the viewer
        ImageUIView.prototype.isFirst = function () {
            var _this = this;
            return _this.cIndex === 0;
        }
        ImageUIView.prototype.isLast = function () {
            var _this = this, size = _this.count();
            return _this.cIndex !== -1 && _this.cIndex === (size - 1);
        }
        ImageUIView.prototype.count = function () {
            var _this = this;
            return _this.aryImages.length;
        }
        //_refreshSelection simply highlights the correct files
        ImageUIView.prototype._refreshSelection = function () {
            var _this = this;
            _this.unHighlightAll();
            _this.highlight(_this.selectedIndexes);
        }
        //_refreshScroll tries to always show the current image correctly
        ImageUIView.prototype._refreshScroll = function () {
            var _this = this, scrollPos = 0, DOM = S.DOM, o;

            if (_this.cIndex >= 0 && _this.cIndex < _this.count()) {
                o = _this.UIViewList.children().item(_this.cIndex);
            }
            //If the current image exists, then show it
            if (o) {
                if (_this.bYScroll) {
                    DOM.scrollIntoView(o, [container = _this.UIViewList, top = true]);
                } else {
                    DOM.scrollIntoView(o, [container = _this.UIViewList, top = true, hscroll = true]);
                }
            } else {//If the current image doesn't exist, then show the first image
                if (_this.bYScroll) {
                    DOM.scrollTop(_this.UIViewList, 0);
                } else {
                    DOM.scrollLeft(_this.UIViewList, 0);
                }
            }
        }

        ImageUIView.prototype.highlight = function (_indexes) {
            var _this = this, o;
            if (typeof _indexes === 'object') {
                if (_this.DWObject) {
                    _this.DWObject.SelectedImagesCount = _indexes.length;
                }
                for (var i = 0; i < _indexes.length; i++) {
                    if (_this.DWObject) {
                        _this.DWObject.SetSelectedImageIndex(i, _indexes[i]);
                    }
                    o = _this.UIViewList.children().item(_indexes[i]);
                    if (o) {
                        o.addClass(_this.selectedClass);
                        if (_this.selectionImageBorderColor) {
                            o.one('.imgwrap').style('border', ['1px solid ', _this.selectionImageBorderColor].join(''));
                        }
                    }
                }
            }
        }
        ImageUIView.prototype.unHighlightAll = function () {
            var _this = this;

            _this.UIViewList.all('.' + _this.selectedClass).removeClass(_this.selectedClass);
            _this.UIViewList.all('.imgwrap').style('border', '');

        }

        //showImage is the core function
        ImageUIView.prototype.showImage = function (_index) {
            var _this = this,
				_index = parseInt(_index),
				tagLineWidth, oImage, bNew, img;
            tagLineWidth = _this.widthPerImage / 25 < 30 ? 30 : _this.widthPerImage / 25;
            oImage = _this.aryImages[_index];
            bNew = oImage.bNew;
            if (bNew) {
                //If it's a new image, put it in a new DIV
                var newDiv = document.createElement('div'), oNewDiv = S.one(newDiv);
                newDiv.innerHTML = "<span style='color:black;'>Loading...</span>";
                oNewDiv.addClass('imgwrap').addClass('imgBox');
                if (_this.backgroundColor) {
                    newDiv.style.backgroundColor = _this.backgroundColor;
                }
                img = new Image();
                img.onload = function () {
                    var data = S.DOM.data(oNewDiv);
                    data.w = img.width;
                    data.h = img.height;
                    Funs.__adjustImageSize(img, _this.widthPerImage - _this.horizontalBorderThickness, _this.heightPerImage - _this.verticalBorderThickness);
                    oNewDiv.html('');
                    oNewDiv.append(img);
                };
                DynamsoftViewerInner.imagesArray.push({ 'image': img, 'url': _this.aryImages[_index].src, 'bNew': true });
                var tagDiv = document.createElement('div');
                tagDiv.innerHTML = (_index * 1 + 1);
                tagDiv.className = 'imgTag';
                tagDiv.style.width = tagLineWidth + 'px';
                S.DOM.data(tagDiv, 'n', _index);

                var newLi = document.createElement('li');
                newLi.className = 'thumb';
                newLi.style.height = _this.heightPerImage + 'px';
                newLi.style.width = _this.widthPerImage + 'px';
                newLi.style.margin = [_this.ImageMargin / 2.0, 'px'].join('');
                oNewDiv.style('height', _this.heightPerImage - _this.verticalBorderThickness + 'px');
                oNewDiv.style('width', _this.widthPerImage - _this.horizontalBorderThickness + 'px');
                if (_this.bYScroll) {
                    S.one(newLi).style('float', 'left').style('display', 'inline');
                    tagDiv.style.display = 'none';
                } else {
                    newLi.style.display = 'inline';
                    tagDiv.style.display = 'none';
                }
                newLi.appendChild(newDiv);
                newLi.appendChild(tagDiv);
                EVENT.on(newLi, 'mouseenter', function (e) {
                    var _nIndex = S.DOM.data(tagDiv, 'n');
                    _this.bFocus = true;
                    _this.fire('onMouseMove', _nIndex);
                });
                EVENT.on(newLi, 'mouseleave', function (e) {
                    _this.bFocus = false;
                    _this.fire('onMouseMove', -1);
                });
                EVENT.on(newLi, 'dblclick', function (e) {
                    var _nIndex = S.DOM.data(tagDiv, 'n');
                    _this.fire('onMouseDoubleClick', _nIndex);
                });
                EVENT.on(newLi, 'click contextmenu', function (e) {
                    var _nIndex = S.DOM.data(tagDiv, 'n');
                    var indexOfID = _this.selectedIndexes.indexOf(_nIndex), multiSelectByCtrl = e.ctrlKey, multiSelectByShift = e.shiftKey;
                    if (indexOfID == -1) {
                        if (multiSelectByCtrl || multiSelectByShift || _this.selectedIndexes.length < 1)
                            _this.selectedIndexes.push(_nIndex);
                        else if (_this.selectedIndexes.length == 1) {
                            _this.selectedIndexes[0] = _nIndex;
                        }
                        else {
                            _this.selectedIndexes = [];
                            _this.selectedIndexes.push(_nIndex);
                        }
                    }
                    else {
                        if (multiSelectByCtrl && _this.selectedIndexes.length > 1) {
                            _this.selectedIndexes.splice(indexOfID, 1);
                        }
                        else if (multiSelectByShift) {
                            _this.selectedIndexes.push(_nIndex);
                        }
                        else if (e.which && e.which == 3/*right click*/) {
                            //right click on one of the selected images will not update the selected indexes
                        }
                        else {
                            _this.selectedIndexes = [];
                            _this.selectedIndexes.push(_nIndex);
                        }
                    }
                    if (multiSelectByShift) {
                        var startIndex = _this.selectedIndexes[0], endIndex = _this.selectedIndexes[_this.selectedIndexes.length - 1];
                        _this.selectedIndexes = [];
                        if (endIndex == startIndex) {
                            //only one remaining                    
                            _this.selectedIndexes.push(parseInt(startIndex));
                        }
                        else if (endIndex > startIndex) {
                            var indexesCount = endIndex - startIndex + 1;
                            for (var i = 0; i < indexesCount; i++) {
                                _this.selectedIndexes.push(parseInt(startIndex + i));
                            }
                        }
                        else {
                            var indexesCount = startIndex - endIndex + 1;
                            _this.selectedIndexes.push(parseInt(startIndex));
                            for (var i = 0; i < indexesCount - 1; i++) {
                                _this.selectedIndexes.push(parseInt(endIndex + i));
                            }
                        }
                    }
                    if (_this.selectedIndexes.length == 1) {
                        _this.cIndex = _nIndex;
                    }
                    _this._refreshSelection();
                    _this.fire('onSelected', _this.selectedIndexes);
                    if (e.which ? e.which == 3 : e.button == 2) {
                        _this.fire('onMouseRightClick', _nIndex);
                    } else {
                        _this.fire('onMouseClick', _nIndex);
                    }
                });
                _this.UIViewList.append(newLi);
                oImage.bNew = false;
            } else {
                //if it's an existing image, reload it(change its width | height | tag)
                var oLi = _this.UIViewList.children().item(_index);

                if (oLi) {
                    var oDiv = oLi.one('.imgwrap'),
						oDivTag = oLi.one('.imgTag');
                    oLi.style('height', _this.heightPerImage - _this.verticalBorderThickness + 'px');
                    oLi.style('width', _this.widthPerImage - _this.horizontalBorderThickness + 'px');
                    if (oDivTag) {
                        oDivTag.style('width', tagLineWidth + 'px');
                        oDivTag.html(_index * 1 + 1);
                    }
                    if (oDiv) {
                        oDiv.style('height', _this.heightPerImage - _this.verticalBorderThickness + 'px');
                        oDiv.style('width', _this.widthPerImage - _this.horizontalBorderThickness + 'px');
                        img = new Image();
                        img.onload = function () {
                            var data = S.DOM.data(oDiv);
                            data.w = img.width;
                            data.h = img.height;
                            Funs.__adjustImageSize(img, _this.widthPerImage - _this.horizontalBorderThickness, _this.heightPerImage - _this.verticalBorderThickness);
                            oDiv.html('');
                            oDiv.append(img);
                        };
                        DynamsoftViewerInner.imagesArray.push({ 'image': img, 'url': _this.aryImages[_index].src, 'bNew': false });
                    }
                }
            }
            if (_this.UIViewList.children().length == _this.aryImages.length) {
                _this._refreshSelection();
            }
            _this._refreshScroll();
        }
        //the method 'add' adds an image to the collection from the service storage
        ImageUIView.prototype.add = function (objImg, _index) {
            // insert before _index
            var _this = this, _count = _this.aryImages.length;
            if (_index != 0 && !_index) _index = _count;
            var curIndex = parseInt(_index);
            if (objImg.bNew == false) {
                objImg.bNew = true;
            }
            if (curIndex >= _count) {
                _this.aryImages.push(objImg);
                _this.cIndex = _count;
                _this.showImage(_this.cIndex);
            } else {
                if (curIndex < 0)
                    curIndex = 0;
                _this.cIndex = curIndex;
                //insert the image 
                _this.aryImages.splice(curIndex, 0, objImg);
                _this.refresh();
            }
            if (_this.imagesPerRow * _this.imagesPerColumn <= _this.aryImages.length) {
                Funs.setImageUIViewSize(_this, _this.containerWidth, _this.containerHeight);
                _this.SetViewMode(_this.imagesPerRow, _this.imagesPerColumn);
            }
            _this.selectedIndexes = [];
            _this.selectedIndexes.push(_this.cIndex);
            _this._refreshSelection();
            _this._refreshScroll();
            _this.fire("onViewerItemsChanged", { op: 'add', ary: [curIndex] });
            return true;
        }
        //set updates an image at a specified index with the image object passed in. This only changes the images in the viewer, the actual images in DWT buffer are not changed
        ImageUIView.prototype.set = function (objImg, _index) {
            var _this = this, curIndex = parseInt(_index), img, oLi, oDiv;
            if (curIndex < 0 || curIndex > _this.aryImages.length)
                return false;
            _this.cIndex = curIndex;
            _this.aryImages[curIndex] = objImg;
            oLi = _this.UIViewList.children().item(curIndex);
            oDiv = oLi.one('.imgwrap');
            img = new Image();
            img.onload = function () {
                var data = S.DOM.data(oDiv);
                data.w = img.width;
                data.h = img.height;
                Funs.__adjustImageSize(img, _this.widthPerImage - _this.horizontalBorderThickness, _this.heightPerImage - _this.verticalBorderThickness);
                oDiv.html('');
                oDiv.append(img);
            };
            DynamsoftViewerInner.imagesArray.push({ 'image': img, 'url': objImg.src, 'bNew': false });
            _this.fire("onViewerItemsChanged", { op: 'set', ary: [curIndex] });
            return true;
        }
        //get return the img objection in the viewer buffer
        ImageUIView.prototype.get = function (index) {
            var _this = this;
            if (index < 0 || index > _this.aryImages.length)
                return false;
            return _this.aryImages[index];
        }
        //SwitchImage is used to switch two images
        ImageUIView.prototype.SwitchImage = function (index1, index2) {
            var _this = this, _count = _this.count(), _firstImage, _secondImage, _firstImgContent, _secondImgContent, r, m;
            if (index1 >= 0 && index1 < _count && index2 >= 0 && index2 < _count) {
                _firstImage = _this.UIViewList.children().item(index1);
                _secondImage = _this.UIViewList.children().item(index2);
                _firstImgContent = _firstImage.one("img");
                _secondImgContent = _secondImage.one("img");
                if (_firstImgContent && _secondImgContent) {
                    r = _firstImgContent.parent();
                    m = _secondImgContent.parent();
                    m.append(_firstImgContent);
                    r.append(_secondImgContent);
                    _this.fire("onViewerItemsChanged", { op: 'switch', ary: [index1, index2] });
                    _firstImage = _secondImage = _firstImgContent = _secondImgContent = r = m = null;
                }
            }
        };
        //MoveImage is used to move an images
        ImageUIView.prototype.MoveImage = function (index1, index2) {
            if (index1 == index2) return;
            var _this = this, _count = _this.count(), _firstImage, _secondImage, _firstImgContent, _secondImgContent, r, m;
            var switchNeighbors = function (____indexA, ____indexB) {
                _firstImage = _this.UIViewList.children().item(__indexA__);
                _secondImage = _this.UIViewList.children().item(__indexB__);
                _firstImgContent = _firstImage.one("img");
                _secondImgContent = _secondImage.one("img");
                if (_firstImgContent && _secondImgContent) {
                    r = _firstImgContent.parent();
                    m = _secondImgContent.parent();
                    m.append(_firstImgContent);
                    r.append(_secondImgContent);
                    _firstImage = _secondImage = _firstImgContent = _secondImgContent = r = m = null;
                }
            }
            if (index1 >= 0 && index1 < _count && index2 >= 0 && index2 < _count) {
                var __indexA__, __indexB__;
                if (index1 > index2) {//move front
                    for (__indexA__ = index1; __indexA__ > index2; __indexA__--) {
                        __indexB__ = __indexA__ - 1;
                        switchNeighbors(__indexA__, __indexB__);
                    }
                }
                else { //move back
                    for (__indexA__ = index1 + 1; __indexA__ <= index2; __indexA__++) {
                        __indexB__ = __indexA__ - 1;
                        switchNeighbors(__indexA__, __indexB__);
                    }
                }
            }
            _this.fire("onViewerItemsChanged", { op: 'move', ary: [index1, index2] });
        };
        //The follwoing 6 methods update the viewer 
        ImageUIView.prototype.getImageMargin = function () {
            var _this = this;
            return _this.ImageMargin;
        }
        ImageUIView.prototype.setImageMargin = function (v) {
            var _this = this, vCol = -1;
            _this.ImageMargin = v;
            if (_this.bYScroll) {
                vCol = _this.imagesPerColumn;
            }
            // recalculate width/height
            _this.SetViewMode(_this.imagesPerRow, vCol);
        };
        ImageUIView.prototype.getSelectionImageBorderColor = function () {
            var _this = this;
            return _this.selectionImageBorderColor;
        };
        ImageUIView.prototype.setSelectionImageBorderColor = function (_v) {
            var _this = this, v = _v, vCol = -1;
            if (S.isNumber(v)) {
                v = Funs.getColor(v);
            }
            _this.selectionImageBorderColor = v;
            if (_this.bYScroll) {
                vCol = _this.imagesPerColumn;
            }
            // recalculate width/height
            _this.SetViewMode(_this.imagesPerRow, vCol);
        };
        ImageUIView.prototype.setBackgroundColor = function (_v) {
            var _this = this, v = _v;
            if (S.isNumber(v)) {
                v = Funs.getColor(v);
            }
            _this.backgroundColor = v;
            _this.UIViewList.all('.imgwrap').style('background-color', v);
        };
        ImageUIView.prototype.ChangeSize = function (w, h) {
            var _this = this;
            Funs.setImageUIViewSize(_this, w, h);
            // refresh UI
            for (var i = 0; i < _this.aryImages.length; i++) {
                _this.showImage(i);
            }
        };
        //handlerKeyDown adds support for keyboard events
        ImageUIView.prototype.handlerKeyDown = function (e) {
            var _this = this, bGoOn = true;
            if (!_this.bFocus)
                return bGoOn;

            switch (e.keyCode) {
                case 37: //left arrow
                    bGoOn = false;
                    _this.previous();
                    _this.fire('onRefreshUI', _this.cIndex);
                    break;
                case 39: //right arrow
                    bGoOn = false;
                    _this.next();
                    _this.fire('onRefreshUI', _this.cIndex);
                    break;
                case 38: //up arrow
                    bGoOn = false;
                    _this.previousUp();
                    _this.fire('onRefreshUI', _this.cIndex);
                    break;
                case 40: //down arrow
                    bGoOn = false;
                    _this.nextDown();
                    _this.fire('onRefreshUI', _this.cIndex);
                    break;
                case 33: //page up
                    bGoOn = false;
                    _this.pageUp();
                    _this.fire('onRefreshUI', _this.cIndex);
                    break;
                case 34: //page down
                    bGoOn = false;
                    _this.pageDown();
                    _this.fire('onRefreshUI', _this.cIndex);
                    break;
                case 35: //end
                    bGoOn = false;
                    _this.go(_this.count() - 1);
                    _this.fire('onRefreshUI', _this.cIndex);
                    break;
                case 36: //home
                    bGoOn = false;
                    _this.go(0);
                    _this.fire('onRefreshUI', _this.cIndex);
                    break;
            }

            return bGoOn;
        }
        //Add keydown Events
        var handlerKeydownEvent = function (e) {
            var _ret = true;
            S.each(registeredOBJs, function (item) {
                if (item instanceof ImageUIView) {
                    if (item.bFocus) {
                        _ret = item.handlerKeyDown(e);
                        if (!_ret)
                            return false;
                    }
                }
            });
            return _ret;
        };
        EVENT.on(doc.documentElement, 'keydown', handlerKeydownEvent);
        //D -->DynamsoftViewerInner
        D.UI = {
            'ImageUIView': ImageUIView
        };
    })(DynamsoftViewerInner, KISSY);
    /*Dynamsoft_fetchImageLoop constantly updates the images in the viewer*/
    DynamsoftViewerInner.Dynamsoft_fetchImageLoop =
    function () {
        var b, a = 500;
        if (DynamsoftViewerInner.imagesArray.length >= 1) {
            b = DynamsoftViewerInner.imagesArray.splice(0, 1)[0];
            if (DynamsoftViewerInner.imagesArray.length > 1) {
                if (b.bNew) {
                    a = 300
                } else {
                    a = 10
                }
            }
            b.image.src = b.url;
        }
        setTimeout(function () {
            DynamsoftViewerInner.Dynamsoft_fetchImageLoop();
        }, a)
    };
    DynamsoftViewerInner.Dynamsoft_fetchImageLoop();
});