/*!
* Dynamsoft JavaScript Library for Basic Initiation of Dynamic Web TWAIN
* More info on DWT: http://www.dynamsoft.com/Products/WebTWAIN_Overview.aspx
*
* Copyright 2014, Dynamsoft Corporation 
* Author: Dynamsoft Team
* Version: 10.0.1.1010
*/

var _dwtParam = {

    /*==============================================================================================================================*/
    /*************************             Normally you only need to change the following            ********************************/
    /******************'version', 'IEVersion', 'productKey', 'isTrial' 'containerID' , 'width', 'height'*****************************/
    /*------------------------------------------------------------------------------------------------------------------------------*/
    /* DynamLib.product.version is the version of Dynamic Web TWAIN. It's mainly used during upgrade                              /**/
    /* [NOTE] Please DO NOT change this value unless you are trying to use an new version                                         /**/
    'version': '10,0,1,1010',                                                                                                      /**/
    'IEVersion': '10,0,0,820',                                                                                                    /**/
    /*------------------------------------------------------------------------------------------------------------------------------*/
    /* 'productKey' is the product key that is unique in every application. It might be                                           /**/
    /* 1. A temp product key based on a 30-day or 14-day trial license                                                            /**/
    /* 2. A permanent product key based on a production or non-production license that you have purchased                         /**/
    /* 3. A yearly product key based on a cloud license that you purchased                                                        /**/
    /* For more info, please email 'support@dynamsoft.com'.                                                                       /**/
'productKey': '6F76405701ACF1E08269F3903ACE18932DB764ACEA3BEDB761487CC37081AFBD2DB764ACEA3BEDB79E9385F0259B8A682DB764ACEA3BEDB7773AFA0A2EBAEBE430000000',
    /*------------------------------------------------------------------------------------------------------------------------------*/
    /* 'isTrial' means whether you are running a full purchased version or a trial version. The default value is true.            /**/
    /* When you purchase the license, plesae change this value to false after you update the 'productKey' above                   /**/
    'isTrial': true,                                                                                                              /**/
    /*------------------------------------------------------------------------------------------------------------------------------*/
    /* 'containerID' is the ID of the div in HTML which holds the Dynamic Web TWAIN control.                                      /**/
    /* This value is required. The default value is 'dwtcontrolContainer'.                                                        /**/
    /* You can change it if necessary.                                                                                            /**/
    'containerID': 'dwtcontrolContainer',                                                                                         /**/
    /*------------------------------------------------------------------------------------------------------------------------------*/
    /* 'width' and 'height' determines the size of the image viewer                                                               /**/
    /* This value is optional. The default value is '580' & '600'                                                                 /**/
    'width': 580, 'height': 600,                                                                                                  /**/                                                                                         /**/
    /*------------------------------------------------------------------------------------------------------------------------------*/
    /* 'resourcesPath' is the relative path of the essential files of Dynamic Web TWAIN including the MSI, CAB, PKG and JS files  /**/
    /* This value is optional. The default value is 'Resources'.                                                                  /**/
    'resourcesPath': 'Resources',                                                                                                 /**/
    /*==============================================================================================================================*/

    /*==============================================================================================================================*/
    /*************************       Below is where you add event listeners to Dynamic Web TWAIN     ********************************/
    /********************************************************************************************************************************/
    /* To find out all the supported events, please check http://www.dynamsoft.com/help/TWAIN/WebTwain/index.htm                  /**/
    /* Please NOTE that you can't change the event name which are listed on the left like 'onPostTransfer'                        /**/
    /* On the other hand, you can change the function name that is called when the event occurs like 'Dynamsoft_OnPostTransfer'   /**/
    /* [NOTE]                                                                                                                     /**/
    /* If you do uncomment any of the following lines to add that event listener,                                                 /**/
    /* you must make sure the corresponding function is defined in your code before dynamsoft.webtwain.config.js.                 /**/
    //'onAfterOperate':Dynamsoft_OnAfterOperate,                                                                                  /**/
    //'onBeforeOperate':Dynamsoft_OnBeforeOperate,                                                                                /**/
    //'onOperateStatus':Dynamsoft_OnOperateStatus,                                                                                /**/
    //'onBitmapChanged':Dynamsoft_OnBitmapChanged,                                                                                /**/
    //'onGetFilePath':Dynamsoft_OnGetFilePath,                                                                                    /**/
    //'onImageAreaDeSelected':Dynamsoft_OnImageAreaDeSelected,                                                                    /**/
    //'onImageAreaSelected':Dynamsoft_OnImageAreaSelected,                                                                        /**/
    //'onMouseClick':Dynamsoft_OnMouseClick,                                                                                      /**/
    //'onMouseDoubleClick':Dynamsoft_OnMouseDoubleClick,                                                                          /**/
    //'onMouseMove':Dynamsoft_OnMouseMove,                                                                                        /**/
    //'onMouseRightClick':Dynamsoft_OnMouseRightClick,                                                                            /**/
    //'onPreAllTransfers':Dynamsoft_OnPreAllTransfers,                                                                            /**/
    //'onPreTransfer':Dynamsoft_OnPreTransfer,                                                                                    /**/
    //'onPostLoad':Dynamsoft_OnPostLoad,                                                                                          /**/
    //'onPostTransfer':Dynamsoft_OnPostTransfer,                                                                                  /**/
    //'onPostAllTransfers':Dynamsoft_OnPostAllTransfers,                                                                          /**/
    //'onSourceUIClose':Dynamsoft_OnSourceUIClose,                                                                                /**/
    //'onTopImageInTheViewChanged':Dynamsoft_OnTopImageInTheViewChanged,                                                          /**/
    //'onTransferCancelled':Dynamsoft_OnTransferCancelled,                                                                        /**/
    //'onTransferError':Dynamsoft_OnTransferError,                                                                                /**/
    //'onInternetTransferPercentage':Dynamsoft_OnInternetTransferPercentage,                                                      /**/
    //'onInternetTransferPercentageEx':Dynamsoft_OnInternetTransferPercentageEx,                                                  /**/
    /*==============================================================================================================================*/

    /*==============================================================================================================================*/
    /*******************************       In most cases, you can just IGNORE the following       ***********************************/
    /********************************************************************************************************************************/
    /* 'onPrintMsg' is an optional event that occurs when an error happens in Dynamic Web TWAIN in Chrome/Firefox edition         /**/
    /* By default, please just leave it blank                                                                                     /**/
    //'onPrintMsg': Dynamsoft_OnPrintMsg,                                                                                         /**/
    'debug': false,                                                                                                               /**/
    '_divInstallBody': 'InstallBody',                                                                                             /**/
    '_divDWTNonInstallContainerID': 'DWTNonInstallContainerID',                                                                   /**/
    '_divDWTemessageContainer': '',                                                                                               /**/
    /*==============================================================================================================================*/

    /*==============================================================================================================================*/
    /*******************************                  PLEASE IGNORE THE FOLLOWING                 ***********************************/
    /********************************************************************************************************************************/
    /**/'bShowNoControl': false, 'bNotAllowedForChrome': false, 'bReady': false, 'seed': null                                     /**/
    /*==============================================================================================================================*/

}, EmptyFunction = function () { },
	gWebTwain, DWObject;

/**********************************************************************************************************************/
/*===========================You don't need to change the following code in most circumstances========================*/
/**********************************************************************************************************************/

/*Dynamsoft_init is called when all configuration has been passed to the running environment*/
function Dynamsoft_init() {
    if (DynamLib.product.bChromeEdition) {
        _dwtParam.onWSReady = function () {
            //When Web Sockets is ready to use, DWObject points to the Dynamic Web TWAIN object
            DWObject = gWebTwain;
            Dynamsoft__onReady();
        };
    } else {
        if (!_dwtParam.onTopImageInTheViewChanged)
            _dwtParam.onTopImageInTheViewChanged = Dynamsoft__OnTopImageInTheViewChanged;
    }
    /*Create one instance of Dynamic Web TWAIN*/
    gWebTwain = new DynamLib.WebTwain(_dwtParam);

    if (typeof (Dynamsoft_OnLoad) === 'function') {
        /*This event fires now*/
        Dynamsoft_OnLoad();
    }
    if (DynamLib.product.bChromeEdition) {
        /*Start Web Socket Service*/
        DynamLib.startWS();
    } else {
        _dwtParam.seed = setInterval(Dynamsoft_initControl, 500);
    }
}

/* optional Events:

//Dynamsoft_ChangeConfig is used to change configuration outside of dynamsoft.webtwain.config.js
Dynamsoft_ChangeConfig

//Dynamsoft_OnLoad  means the two essential JSs are loaded, all the parameters have been passed into running environment but the object is not necessarily ready
Dynamsoft_OnLoad 

//Dynamsoft_OnReady means Dynamic Web TWAIN is ready to be used. This Event works for all editions
Dynamsoft_OnReady

//Dynamsoft_OnNotReady means Dynamic Web TWAIN is not ready yet. Only works for v9.2 and earlier
Dynamsoft_OnNotReady

*/

/*-------------------------------------------------------------------------------------------*/
//The following two functions are meant ONLY for version 9.2 and ealier of Dynamic Web TWAIN
function Dynamsoft__OnTopImageInTheViewChanged(index) {
    //This function only works for non-HTML5 edition
    if (DWObject) {
        if (DWObject.CurrentImageIndexInBuffer != index)
            DWObject.CurrentImageIndexInBuffer = index;

        if (typeof (DWObject.__innerRefreshImage) === 'function')
            DWObject.__innerRefreshImage();
    }
}
function Dynamsoft_initControl() {
    var o = gWebTwain.getInstance();
    if (o) {
        if (o.ErrorCode == 0) {
            clearInterval(_dwtParam.seed);
            _dwtParam.seed = null;

            DWObject = o;
            DWObject.BrokerProcessType = 1;
            DWObject.IfAllowLocalCache = true;

            Dynamsoft__onReady();
        } else {
            if (typeof (Dynamsoft_OnNotReady) === 'function') {
                Dynamsoft_OnNotReady();
            }
        }
    }
}
/*-------------------------------------------------------------------------------------------*/

/*Dynamsoft__onReady is called when 
*1. It's running Chrome/Firefox edition and websocket is ready to use
*2. It's running the old plug-in or ActiveX or Mac edition and Dynamic Web TWAIN is ready (errorcode=0)
*/
function Dynamsoft__onReady() {
    if (_dwtParam.bReady)//Only execute once        
        return;
    closetblInstall_onclick();

    if (!DWObject) {
        DWObject = gWebTwain;
    }

    if (DynamLib.product.bChromeEdition) {
		// check websocket version
		var _loglevel = DWObject.LogLevel;
		if(DWObject.ErrorCode == -2207){
			alert(DWObject.ErrorString);
		}
	
        //No more new edition for the old plug-in, so upgrade only makes sense for version 10 and above (new HTML5 edition)
        //If the new HTML5 edition is not installed, the user will get prompted to install it too
        Dynamsoft_NeedUpgrade();
    }

    if (typeof (Dynamsoft_OnReady) === 'function')
        Dynamsoft_OnReady();
    _dwtParam.bReady = true;
}

/****************************************************************************************/
/*=============The following is the supporing code, we can just ignore it===============*/
/****************************************************************************************/

var _strDynamsoftWithClose = "<div style='height:40px;width:350px;position:relative;'><span style='padding-right:60px'><img src=\"" + DynamLib.env.resourcesPath + "/reference/logo.gif\" alt=\"Dynamsoft Corporation\" width=\"159\" height=\"34\" border=\"0\" align=\"left\" id=\"logo\" title=\"10 Years of Experience in TWAIN SDKs and Version Control Solutions\" /></span><div style='height:30px;padding-left:205px; position:absolute; top:0; left:120px'><a href='javascript: void(0)' style='text-decoration:none; padding:15px' class='ClosetblCanNotScan'>X</a></div></div>";
var _strNonInstallDIV = '<div style="width: ' + _dwtParam.width + 'px; height: ' + _dwtParam.height + 'px; margin: 0; border:1px solid #ccc; text-align:center;"' + 'id="' + _dwtParam._divDWTNonInstallContainerID + '">Dynamic Web TWAIN is not Installed.</div>';
var dlgInstall = false;

function Dynamsoft__noControl() {
    _dwtParam.bShowNoControl = true;
    ua = (navigator.userAgent.toLowerCase());
    // For mac, create the message to tell the user to install the plugin.
    if (DynamLib.env.bMac) {
        createNonInstallDivMac();
        // Display the message and hide the main control
        KISSY.one('#' + _dwtParam.containerID).before(_strNonInstallDIV);
        DynamLib.show(_dwtParam._divDWTNonInstallContainerID);
        DynamLib.hide(_dwtParam.containerID);
        if (_dwtParam._divDWTemessageContainer != '')
            DynamLib.hide(_dwtParam._divDWTemessageContainer);

        KISSY.use("overlay", function (S, o) {
            dlgInstall = new o.Dialog({
                srcNode: "#J_waiting",
                width: 392,
                height: 277,
                closable: false,
                mask: true,
                align: {
                    points: ['cc', 'cc']
                }
            });
            dlgInstall.show();
        });
    }
        // For none-IE browsers on Windows, create the message to tell the user to install the plugin.
    else if (ua.match(/chrome\/([\d.]+)/) || ua.match(/opera.([\d.]+)/) || ua.match(/version\/([\d.]+).*safari/) || ua.match(/firefox\/([\d.]+)/)) {
        createNonInstallDivPlugin();
        // Display the message and hide the main control
        KISSY.one('#' + _dwtParam.containerID).before(_strNonInstallDIV);
        DynamLib.show(_dwtParam._divDWTNonInstallContainerID);
        DynamLib.hide(_dwtParam.containerID);
        if (_dwtParam._divDWTemessageContainer != '')
            DynamLib.hide(_dwtParam._divDWTemessageContainer);
        KISSY.use("overlay", function (S, o) {
            dlgInstall = new o.Dialog({
                srcNode: "#J_waiting",
                width: 392,
                height: 327,
                closable: false,
                mask: true,
                align: {
                    points: ['cc', 'cc']
                }
            });
            dlgInstall.show();
        });
    }
    for (var i = 0; i < document.links.length; i++) {
        if (document.links[i].className == "ClosetblCanNotScan") {
            document.links[i].onclick = closetblInstall_onclick;
        }
    }
}

function Dynamsoft__notAllowedForChrome() {
    _dwtParam.bNotAllowedForChrome = true;
    ua = (navigator.userAgent.toLowerCase());
    // For mac, create the message to tell the user to install the plugin.
    if (ua.match(/chrome\/([\d.]+)/)) {
        createNonAllowedDivPlugin();
        // Display the message and hide the main control
        KISSY.one('#' + _dwtParam.containerID).before(_strNonInstallDIV);
        DynamLib.show(_dwtParam._divDWTNonInstallContainerID);
        DynamLib.hide(_dwtParam.containerID);
        if (_dwtParam._divDWTemessageContainer != '')
            DynamLib.hide(_dwtParam._divDWTemessageContainer);
        KISSY.use("overlay", function (S, o) {
            dlgInstall = new o.Dialog({
                srcNode: "#J_waiting",
                width: 392,
                height: 227,
                closable: false,
                mask: true,
                align: {
                    points: ['cc', 'cc']
                }
            });
            dlgInstall.show();
        });
    }

    for (var i = 0; i < document.links.length; i++) {
        if (document.links[i].className == "ClosetblCanNotScan") {
            document.links[i].onclick = closetblInstall_onclick;
        }
    }
}

function createNonAllowedDivPlugin() {
    var ObjString = [
		'<div class="D-dialog-body-NotAllowed">',
		_strDynamsoftWithClose,
		'<div class="box_title">',
		DynamLib.product.name,
		' plugin is not allowed to run on this site.</div>',
		'<ul>',
		'<li>Please click "<b>Always run on this site</b>" for the prompt "',
		DynamLib.product.name,
		' Plugin needs your permission to run", then <a href="javascript:void(0);" style="color:blue" class="ClosetblCanNotScan">close</a> this dialog OR refresh/restart the browser and try again.</li>',
		'</ul>',
		'</div>'];
    var msgContainer =
        ['<div id="J_waiting" class="D-dialog ks-dialog-hidden">',
	    '<div class="ks-dialog-header"></div>',
	    '<div class="ks-dialog-body">',
		    '<div class="ks-dialog-content"><div id="' + _dwtParam._divInstallBody + '"></div></div></div>',
	    '<div class="ks-dialog-footer"></div>', '</div>'];

    KISSY.one('body').append(msgContainer.join(''));
    DynamLib.get(_dwtParam._divInstallBody).innerHTML = ObjString.join('');
}

function createNonInstallDivPlugin() {
    var ObjString = [
        '<div class="D-dialog-body">',
		_strDynamsoftWithClose,
		'<div class="box_title">',
		DynamLib.product.name,
		' is not installed</div>',
		'<ul>',
		'<li>If you have already installed Dynamic Web TWAIN, please wait a few seconds for it to initialize.</li>',
		'<li>If you haven\'t installed Dynamic Web TWAIN, Please click the below button to download it. ',
		'You need to manually install it after the downloading.</li>',
		'</ul>',
		'<p class="red">If you still see this dialog after the installation, please RESTART your browser.</p>',
		'<a id="btnInstall" href="',
		DynamLib.product.bChromeEdition ? DynamLib.product._strChromeEditionPath : DynamLib.product._strMSIPath,
		'" onclick="onClickInstallButton();"><div class="button"></div></a>',
		'</div>'];
    var msgContainer =
        ['<div id="J_waiting" class="D-dialog ks-dialog-hidden">',
	    '<div class="ks-dialog-header"></div>',
	    '<div class="ks-dialog-body">',
		    '<div class="ks-dialog-content"><div id="' + _dwtParam._divInstallBody + '"></div></div></div>',
	    '<div class="ks-dialog-footer"></div>', '</div>'];

    KISSY.one('body').append(msgContainer.join(''));
    DynamLib.get(_dwtParam._divInstallBody).innerHTML = ObjString.join('');
}

function createNonInstallDivMac() {
    var ObjString =
        ['<div class="D-dialog-body-Mac">',
		_strDynamsoftWithClose,
		'<div class="box_title">',
		DynamLib.product.name,
		' is not installed</div>',
		'<ul>',
		'<li>Please click the below button to download and install it.</li>',
		'</ul>',
		'<p class="red">If you still see this dialog after the installation, please RESTART your browser.</p>',
		'If you are using Safari 5.0, you need to <a href="http://kb.dynamsoft.com/questions/666/How+to+run+Safari+5.0+in+32-bit+mode+on+Mac+OS+X"><span class="link">run the browser in 32-bit Mode</span></a>.',
		'<a id="btnInstall" href="',
		DynamLib.product._strPKGPath,
		'" onclick="onClickInstallButton()"><div class="button"></div></a>',
		'</div>'];

    var msgContainer =
        ['<div id="J_waiting" class="D-dialog ks-dialog-hidden">',
	    '<div class="ks-dialog-header"></div>',
	    '<div class="ks-dialog-body">',
		    '<div class="ks-dialog-content"><div id="' + _dwtParam._divInstallBody + '"></div></div></div>',
	    '<div class="ks-dialog-footer"></div>', '</div>'];

    KISSY.one('body').append(msgContainer.join(''));
    DynamLib.get(_dwtParam._divInstallBody).innerHTML = ObjString.join('');
}

function onClickInstallButton() {
    DynamLib.get("btnInstall").style.display = "none";
    //DynamLib.get("txtDetect").style.display = "";
    //DynamLib.get("imgWait").style.display = "";
}

function closetblInstall_onclick() {
    if (dlgInstall) {
        dlgInstall.destroy();
        dlgInstall = false;
    }
    DynamLib.hide(_dwtParam._divDWTNonInstallContainerID);
    KISSY.DOM.remove('#' + _dwtParam._divDWTNonInstallContainerID);
    DynamLib.show(_dwtParam.containerID);
    if (_dwtParam._divDWTemessageContainer != '')
        DynamLib.show(_dwtParam._divDWTemessageContainer);
}

String.prototype.replaceAll = function (str1, str2) {
    var str = this;
    var result = str.replace(eval('/' + str1 + '/gi'), str2);
    return result;
}
function isDWTVersionLatest(latest) {
    var current = DWObject.VersionInfo.toLowerCase().replace(DynamLib.product.name.toLowerCase() + ' ', '');
    current = current.replace('trial'.toLowerCase(), '');
    current = current.replaceAll('[.]', ',');
    latest = latest.replaceAll('[.]', ',');

    currentArray = current.split(',');
    latestArray = latest.split(',');

    index = currentArray.length > latestArray.length ? currentArray.length : latestArray.length;
    for (var i = 0; i < index; i++) {
        if (currentArray[i] == null)
            currentArray[i] = 0;
        if (latestArray[i] == null)
            latestArray[i] = 0;

        else if (parseInt(currentArray[i]) < parseInt(latestArray[i])) {
            return false;
        }
    }
    return true;
}
function Dynamsoft_NeedUpgrade() {
    if (!isDWTVersionLatest(DynamLib.product.version)) {
        var ObjString =
            ['<div class="D-dialog-body-Upgrade">',
			_strDynamsoftWithClose,
			'<div class="box_title">',
			'A new version is available</div>',
			'<ul>',
			'<li>A new version of ' + DynamLib.product.name + ' is available.</li>',
			'<li>Do you want to upgrade now?</li>',
			'</ul>',
			'<p class="red">If you still see this dialog after the installation, please RESTART your browser.</p>',
			'<a id="btnInstall" href="',
			DynamLib.product.bChromeEdition ? DynamLib.product._strChromeEditionPath : DynamLib.product._strMSIPath,
			'" onclick="onClickInstallButton();"><div class="button"></div></a>',
			'</div>'];
        var msgContainer =
           ['<div id="J_waiting" class="D-dialog ks-dialog-hidden">',
           '<div class="ks-dialog-header"></div>',
           '<div class="ks-dialog-body">',
               '<div class="ks-dialog-content"><div id="' + _dwtParam._divInstallBody + '"></div></div></div>',
           '<div class="ks-dialog-footer"></div>', '</div>'];

        KISSY.one('body').append(msgContainer.join(''));
        DynamLib.get(_dwtParam._divInstallBody).innerHTML = ObjString.join('');

        // Display the message and hide the main control
        KISSY.one('#' + _dwtParam.containerID).before(_strNonInstallDIV);
        DynamLib.show(_dwtParam._divDWTNonInstallContainerID);
        DynamLib.hide(_dwtParam.containerID);
        if (_dwtParam._divDWTemessageContainer != '')
            DynamLib.hide(_dwtParam._divDWTemessageContainer);
        KISSY.use("overlay", function (S, o) {
            dlgInstall = new o.Dialog({
                srcNode: "#J_waiting",
                width: 392,
                height: 227,
                closable: false,
                mask: true,
                align: {
                    points: ['cc', 'cc']
                }
            });
            dlgInstall.show();
        });
    }

    for (var i = 0; i < document.links.length; i++) {
        if (document.links[i].className == "ClosetblCanNotScan") {
            document.links[i].onclick = closetblInstall_onclick;
        }
    }

}

/**********************************************
* This is the entry point of the initilization*
**********************************************/
(function () {
    DynamLib.getCss('reference/hint.css');
    if (typeof (Dynamsoft_ChangeConfig) === 'function') {
        Dynamsoft_ChangeConfig(_dwtParam);
    }
    /*
	if(typeof(g_onWSMessage) === 'function')
		cfg['OnWSMessage'] = g_onWSMessage;
	if(typeof(g_onWSClose) === 'function')
		cfg['OnWSClose'] = g_onWSClose;
	*/
    DynamLib.product.version = _dwtParam.version;
    DynamLib.product.IEVersion = _dwtParam.IEVersion;
    DynamLib.main(Dynamsoft_init, {
        /*env*/
        //basePath:
        //pathType: 1,
        resourcesPath: _dwtParam.resourcesPath,

        /*product info*/
        trial: _dwtParam.isTrial,
        productKey: _dwtParam.productKey,

        /*config*/
        debug: _dwtParam.debug,
        //bDiscardBlankImage: false,
        //msgPrefix: '<span style="color:#cE5E04"><b>',
        //msgSuffix: '</b></span><br />',

        /*detect*/
        //onReady:false,
        //onDetectNext:false,
        //onCreatWS:false,
        onNotAllowedForChrome: Dynamsoft__notAllowedForChrome,
        onNoControl: Dynamsoft__noControl
    });
})();
