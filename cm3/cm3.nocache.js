function cm3(){
  var $intern_0 = '', $intern_36 = '" for "gwt:onLoadErrorFn"', $intern_34 = '" for "gwt:onPropertyErrorFn"', $intern_21 = '"><\/script>', $intern_10 = '#', $intern_82 = '.cache.html', $intern_12 = '/', $intern_24 = '//', $intern_71 = '216E044C30AD25817600E8722167CF0D', $intern_73 = '37BB54E34578F598E2F5516EF540ACA9', $intern_74 = '759AAB3C4FC4441A1D5FCF9395CA37A0', $intern_75 = '9CBAE27885BDC09EF8E2BCDBF30435AD', $intern_81 = ':', $intern_72 = ':1', $intern_28 = '::', $intern_95 = '<script defer="defer">cm3.onInjectionDone(\'cm3\')<\/script>', $intern_20 = '<script id="', $intern_93 = '<script language="javascript" src="', $intern_31 = '=', $intern_11 = '?', $intern_76 = 'BA98721753E15D9935F708CF5869219E', $intern_77 = 'BB77A6F374805439F2765B9880252B2F', $intern_33 = 'Bad handler "', $intern_90 = 'CM3.css', $intern_91 = 'DOMContentLoaded', $intern_78 = 'EA04E4FE5A70AEC8937AAB5FB6347A4C', $intern_79 = 'EF7C36562EDA81BC0FD2E5A6F163E6A0', $intern_80 = 'FAFEEF2968CF99CD5EA9088EF4E46BFF', $intern_22 = 'SCRIPT', $intern_19 = '__gwt_marker_cm3', $intern_42 = 'android', $intern_23 = 'base', $intern_15 = 'baseUrl', $intern_4 = 'begin', $intern_46 = 'blackberry', $intern_3 = 'bootstrap', $intern_14 = 'clear.cache.gif', $intern_1 = 'cm3', $intern_17 = 'cm3.nocache.js', $intern_27 = 'cm3::', $intern_30 = 'content', $intern_53 = 'datetime', $intern_9 = 'end', $intern_47 = 'file://', $intern_65 = 'gecko', $intern_66 = 'gecko1_8', $intern_5 = 'gwt.codesvr=', $intern_6 = 'gwt.hosted=', $intern_7 = 'gwt.hybrid', $intern_89 = 'gwt/clean/clean.css', $intern_35 = 'gwt:onLoadErrorFn', $intern_32 = 'gwt:onPropertyErrorFn', $intern_29 = 'gwt:property', $intern_88 = 'head', $intern_69 = 'hosted.html?cm3', $intern_87 = 'href', $intern_64 = 'ie6', $intern_63 = 'ie8', $intern_62 = 'ie9', $intern_37 = 'iframe', $intern_13 = 'img', $intern_51 = 'input', $intern_43 = 'ipad', $intern_45 = 'iphone', $intern_44 = 'ipod', $intern_38 = "javascript:''", $intern_84 = 'link', $intern_68 = 'loadExternalRefs', $intern_25 = 'meta', $intern_40 = 'moduleRequested', $intern_8 = 'moduleStartup', $intern_61 = 'msie', $intern_56 = 'n', $intern_26 = 'name', $intern_49 = 'no', $intern_58 = 'opera', $intern_41 = 'phonegap.env', $intern_39 = 'position:absolute;width:0;height:0;border:none', $intern_85 = 'rel', $intern_60 = 'safari', $intern_16 = 'script', $intern_70 = 'selectingPermutation', $intern_2 = 'startup', $intern_86 = 'stylesheet', $intern_50 = 'supportsDateTimeInput', $intern_54 = 'text', $intern_83 = 'timebox.css', $intern_52 = 'type', $intern_18 = 'undefined', $intern_67 = 'unknown', $intern_57 = 'user.agent', $intern_92 = 'uuid.js', $intern_94 = 'uuid.js"><\/script>', $intern_59 = 'webkit', $intern_55 = 'y', $intern_48 = 'yes';
  var $wnd = window, $doc = document, $stats = $wnd.__gwtStatsEvent?function(a){
    return $wnd.__gwtStatsEvent(a);
  }
  :null, $sessionId = $wnd.__gwtStatsSessionId?$wnd.__gwtStatsSessionId:null, scriptsDone, loadDone, bodyDone, base = $intern_0, metaProps = {}, values = [], providers = [], answers = [], softPermutationId = 0, onLoadErrorFunc, propertyErrorFunc;
  $stats && $stats({moduleName:$intern_1, sessionId:$sessionId, subSystem:$intern_2, evtGroup:$intern_3, millis:(new Date).getTime(), type:$intern_4});
  if (!$wnd.__gwt_stylesLoaded) {
    $wnd.__gwt_stylesLoaded = {};
  }
  if (!$wnd.__gwt_scriptsLoaded) {
    $wnd.__gwt_scriptsLoaded = {};
  }
  function isHostedMode(){
    var result = false;
    try {
      var query = $wnd.location.search;
      return (query.indexOf($intern_5) != -1 || (query.indexOf($intern_6) != -1 || $wnd.external && $wnd.external.gwtOnLoad)) && query.indexOf($intern_7) == -1;
    }
     catch (e) {
    }
    isHostedMode = function(){
      return result;
    }
    ;
    return result;
  }

  function maybeStartModule(){
    if (scriptsDone && loadDone) {
      var iframe = $doc.getElementById($intern_1);
      var frameWnd = iframe.contentWindow;
      if (isHostedMode()) {
        frameWnd.__gwt_getProperty = function(name){
          return computePropValue(name);
        }
        ;
      }
      cm3 = null;
      frameWnd.gwtOnLoad(onLoadErrorFunc, $intern_1, base, softPermutationId);
      $stats && $stats({moduleName:$intern_1, sessionId:$sessionId, subSystem:$intern_2, evtGroup:$intern_8, millis:(new Date).getTime(), type:$intern_9});
    }
  }

  function computeScriptBase(){
    function getDirectoryOfFile(path){
      var hashIndex = path.lastIndexOf($intern_10);
      if (hashIndex == -1) {
        hashIndex = path.length;
      }
      var queryIndex = path.indexOf($intern_11);
      if (queryIndex == -1) {
        queryIndex = path.length;
      }
      var slashIndex = path.lastIndexOf($intern_12, Math.min(queryIndex, hashIndex));
      return slashIndex >= 0?path.substring(0, slashIndex + 1):$intern_0;
    }

    function ensureAbsoluteUrl(url){
      if (url.match(/^\w+:\/\//)) {
      }
       else {
        var img = $doc.createElement($intern_13);
        img.src = url + $intern_14;
        url = getDirectoryOfFile(img.src);
      }
      return url;
    }

    function tryMetaTag(){
      var metaVal = __gwt_getMetaProperty($intern_15);
      if (metaVal != null) {
        return metaVal;
      }
      return $intern_0;
    }

    function tryNocacheJsTag(){
      var scriptTags = $doc.getElementsByTagName($intern_16);
      for (var i = 0; i < scriptTags.length; ++i) {
        if (scriptTags[i].src.indexOf($intern_17) != -1) {
          return getDirectoryOfFile(scriptTags[i].src);
        }
      }
      return $intern_0;
    }

    function tryMarkerScript(){
      var thisScript;
      if (typeof isBodyLoaded == $intern_18 || !isBodyLoaded()) {
        var markerId = $intern_19;
        var markerScript;
        $doc.write($intern_20 + markerId + $intern_21);
        markerScript = $doc.getElementById(markerId);
        thisScript = markerScript && markerScript.previousSibling;
        while (thisScript && thisScript.tagName != $intern_22) {
          thisScript = thisScript.previousSibling;
        }
        if (markerScript) {
          markerScript.parentNode.removeChild(markerScript);
        }
        if (thisScript && thisScript.src) {
          return getDirectoryOfFile(thisScript.src);
        }
      }
      return $intern_0;
    }

    function tryBaseTag(){
      var baseElements = $doc.getElementsByTagName($intern_23);
      if (baseElements.length > 0) {
        return baseElements[baseElements.length - 1].href;
      }
      return $intern_0;
    }

    function isLocationOk(){
      var loc = $doc.location;
      return loc.href == loc.protocol + $intern_24 + loc.host + loc.pathname + loc.search + loc.hash;
    }

    var tempBase = tryMetaTag();
    if (tempBase == $intern_0) {
      tempBase = tryNocacheJsTag();
    }
    if (tempBase == $intern_0) {
      tempBase = tryMarkerScript();
    }
    if (tempBase == $intern_0) {
      tempBase = tryBaseTag();
    }
    if (tempBase == $intern_0 && isLocationOk()) {
      tempBase = getDirectoryOfFile($doc.location.href);
    }
    tempBase = ensureAbsoluteUrl(tempBase);
    base = tempBase;
    return tempBase;
  }

  function processMetas(){
    var metas = document.getElementsByTagName($intern_25);
    for (var i = 0, n = metas.length; i < n; ++i) {
      var meta = metas[i], name = meta.getAttribute($intern_26), content;
      if (name) {
        name = name.replace($intern_27, $intern_0);
        if (name.indexOf($intern_28) >= 0) {
          continue;
        }
        if (name == $intern_29) {
          content = meta.getAttribute($intern_30);
          if (content) {
            var value, eq = content.indexOf($intern_31);
            if (eq >= 0) {
              name = content.substring(0, eq);
              value = content.substring(eq + 1);
            }
             else {
              name = content;
              value = $intern_0;
            }
            metaProps[name] = value;
          }
        }
         else if (name == $intern_32) {
          content = meta.getAttribute($intern_30);
          if (content) {
            try {
              propertyErrorFunc = eval(content);
            }
             catch (e) {
              alert($intern_33 + content + $intern_34);
            }
          }
        }
         else if (name == $intern_35) {
          content = meta.getAttribute($intern_30);
          if (content) {
            try {
              onLoadErrorFunc = eval(content);
            }
             catch (e) {
              alert($intern_33 + content + $intern_36);
            }
          }
        }
      }
    }
  }

  function __gwt_getMetaProperty(name){
    var value = metaProps[name];
    return value == null?null:value;
  }

  function unflattenKeylistIntoAnswers(propValArray, value){
    var answer = answers;
    for (var i = 0, n = propValArray.length - 1; i < n; ++i) {
      answer = answer[propValArray[i]] || (answer[propValArray[i]] = []);
    }
    answer[propValArray[n]] = value;
  }

  function computePropValue(propName){
    var value = providers[propName](), allowedValuesMap = values[propName];
    if (value in allowedValuesMap) {
      return value;
    }
    var allowedValuesList = [];
    for (var k in allowedValuesMap) {
      allowedValuesList[allowedValuesMap[k]] = k;
    }
    if (propertyErrorFunc) {
      propertyErrorFunc(propName, allowedValuesList, value);
    }
    throw null;
  }

  var frameInjected;
  function maybeInjectFrame(){
    if (!frameInjected) {
      frameInjected = true;
      var iframe = $doc.createElement($intern_37);
      iframe.src = $intern_38;
      iframe.id = $intern_1;
      iframe.style.cssText = $intern_39;
      iframe.tabIndex = -1;
      $doc.body.appendChild(iframe);
      $stats && $stats({moduleName:$intern_1, sessionId:$sessionId, subSystem:$intern_2, evtGroup:$intern_8, millis:(new Date).getTime(), type:$intern_40});
      iframe.contentWindow.location.replace(base + initialHtml);
    }
  }

  providers[$intern_41] = function(){
    {
      var ua = window.navigator.userAgent.toLowerCase();
      if (ua.indexOf($intern_42) != -1 || (ua.indexOf($intern_43) != -1 || (ua.indexOf($intern_44) != -1 || (ua.indexOf($intern_45) != -1 || ua.indexOf($intern_46) != -1)))) {
        var url = document.location.href;
        if (url.indexOf($intern_47) === 0) {
          return $intern_48;
        }
      }
      return $intern_49;
    }
  }
  ;
  values[$intern_41] = {no:0, yes:1};
  providers[$intern_50] = function(){
    try {
      var i = document.createElement($intern_51);
      i.setAttribute($intern_52, $intern_53);
      return i.type !== $intern_54?$intern_55:$intern_56;
    }
     catch (e) {
      return $intern_56;
    }
  }
  ;
  values[$intern_50] = {n:0, y:1};
  providers[$intern_57] = function(){
    var ua = navigator.userAgent.toLowerCase();
    var makeVersion = function(result){
      return parseInt(result[1]) * 1000 + parseInt(result[2]);
    }
    ;
    if (function(){
      return ua.indexOf($intern_58) != -1;
    }
    ())
      return $intern_58;
    if (function(){
      return ua.indexOf($intern_59) != -1;
    }
    ())
      return $intern_60;
    if (function(){
      return ua.indexOf($intern_61) != -1 && $doc.documentMode >= 9;
    }
    ())
      return $intern_62;
    if (function(){
      return ua.indexOf($intern_61) != -1 && $doc.documentMode >= 8;
    }
    ())
      return $intern_63;
    if (function(){
      var result = /msie ([0-9]+)\.([0-9]+)/.exec(ua);
      if (result && result.length == 3)
        return makeVersion(result) >= 6000;
    }
    ())
      return $intern_64;
    if (function(){
      return ua.indexOf($intern_65) != -1;
    }
    ())
      return $intern_66;
    return $intern_67;
  }
  ;
  values[$intern_57] = {gecko1_8:0, ie6:1, ie8:2, ie9:3, opera:4, safari:5};
  cm3.onScriptLoad = function(){
    if (frameInjected) {
      loadDone = true;
      maybeStartModule();
    }
  }
  ;
  cm3.onInjectionDone = function(){
    scriptsDone = true;
    $stats && $stats({moduleName:$intern_1, sessionId:$sessionId, subSystem:$intern_2, evtGroup:$intern_68, millis:(new Date).getTime(), type:$intern_9});
    maybeStartModule();
  }
  ;
  processMetas();
  computeScriptBase();
  var strongName;
  var initialHtml;
  if (isHostedMode()) {
    if ($wnd.external && ($wnd.external.initModule && $wnd.external.initModule($intern_1))) {
      $wnd.location.reload();
      return;
    }
    initialHtml = $intern_69;
    strongName = $intern_0;
  }
  $stats && $stats({moduleName:$intern_1, sessionId:$sessionId, subSystem:$intern_2, evtGroup:$intern_3, millis:(new Date).getTime(), type:$intern_70});
  if (!isHostedMode()) {
    try {
      unflattenKeylistIntoAnswers([$intern_49, $intern_56, $intern_62], $intern_71);
      unflattenKeylistIntoAnswers([$intern_49, $intern_55, $intern_62], $intern_71);
      unflattenKeylistIntoAnswers([$intern_49, $intern_56, $intern_62], $intern_71 + $intern_72);
      unflattenKeylistIntoAnswers([$intern_49, $intern_55, $intern_62], $intern_71 + $intern_72);
      unflattenKeylistIntoAnswers([$intern_48, $intern_55, $intern_60], $intern_73);
      unflattenKeylistIntoAnswers([$intern_49, $intern_56, $intern_60], $intern_74);
      unflattenKeylistIntoAnswers([$intern_49, $intern_55, $intern_60], $intern_75);
      unflattenKeylistIntoAnswers([$intern_49, $intern_56, $intern_63], $intern_76);
      unflattenKeylistIntoAnswers([$intern_49, $intern_55, $intern_63], $intern_76);
      unflattenKeylistIntoAnswers([$intern_49, $intern_56, $intern_63], $intern_76 + $intern_72);
      unflattenKeylistIntoAnswers([$intern_49, $intern_55, $intern_63], $intern_76 + $intern_72);
      unflattenKeylistIntoAnswers([$intern_49, $intern_56, $intern_58], $intern_77);
      unflattenKeylistIntoAnswers([$intern_49, $intern_55, $intern_58], $intern_77);
      unflattenKeylistIntoAnswers([$intern_49, $intern_56, $intern_58], $intern_77 + $intern_72);
      unflattenKeylistIntoAnswers([$intern_49, $intern_55, $intern_58], $intern_77 + $intern_72);
      unflattenKeylistIntoAnswers([$intern_49, $intern_56, $intern_64], $intern_78);
      unflattenKeylistIntoAnswers([$intern_49, $intern_55, $intern_64], $intern_78);
      unflattenKeylistIntoAnswers([$intern_49, $intern_56, $intern_64], $intern_78 + $intern_72);
      unflattenKeylistIntoAnswers([$intern_49, $intern_55, $intern_64], $intern_78 + $intern_72);
      unflattenKeylistIntoAnswers([$intern_49, $intern_56, $intern_66], $intern_79);
      unflattenKeylistIntoAnswers([$intern_49, $intern_55, $intern_66], $intern_79);
      unflattenKeylistIntoAnswers([$intern_49, $intern_56, $intern_66], $intern_79 + $intern_72);
      unflattenKeylistIntoAnswers([$intern_49, $intern_55, $intern_66], $intern_79 + $intern_72);
      unflattenKeylistIntoAnswers([$intern_48, $intern_56, $intern_60], $intern_80);
      strongName = answers[computePropValue($intern_41)][computePropValue($intern_50)][computePropValue($intern_57)];
      var idx = strongName.indexOf($intern_81);
      if (idx != -1) {
        softPermutationId = Number(strongName.substring(idx + 1));
        strongName = strongName.substring(0, idx);
      }
      initialHtml = strongName + $intern_82;
    }
     catch (e) {
      return;
    }
  }
  var onBodyDoneTimerId;
  function onBodyDone(){
    if (!bodyDone) {
      bodyDone = true;
      if (!__gwt_stylesLoaded[$intern_83]) {
        var l = $doc.createElement($intern_84);
        __gwt_stylesLoaded[$intern_83] = l;
        l.setAttribute($intern_85, $intern_86);
        l.setAttribute($intern_87, base + $intern_83);
        $doc.getElementsByTagName($intern_88)[0].appendChild(l);
      }
      if (!__gwt_stylesLoaded[$intern_89]) {
        var l = $doc.createElement($intern_84);
        __gwt_stylesLoaded[$intern_89] = l;
        l.setAttribute($intern_85, $intern_86);
        l.setAttribute($intern_87, base + $intern_89);
        $doc.getElementsByTagName($intern_88)[0].appendChild(l);
      }
      if (!__gwt_stylesLoaded[$intern_90]) {
        var l = $doc.createElement($intern_84);
        __gwt_stylesLoaded[$intern_90] = l;
        l.setAttribute($intern_85, $intern_86);
        l.setAttribute($intern_87, base + $intern_90);
        $doc.getElementsByTagName($intern_88)[0].appendChild(l);
      }
      maybeStartModule();
      if ($doc.removeEventListener) {
        $doc.removeEventListener($intern_91, onBodyDone, false);
      }
      if (onBodyDoneTimerId) {
        clearInterval(onBodyDoneTimerId);
      }
    }
  }

  if ($doc.addEventListener) {
    $doc.addEventListener($intern_91, function(){
      maybeInjectFrame();
      onBodyDone();
    }
    , false);
  }
  var onBodyDoneTimerId = setInterval(function(){
    if (/loaded|complete/.test($doc.readyState)) {
      maybeInjectFrame();
      onBodyDone();
    }
  }
  , 50);
  $stats && $stats({moduleName:$intern_1, sessionId:$sessionId, subSystem:$intern_2, evtGroup:$intern_3, millis:(new Date).getTime(), type:$intern_9});
  $stats && $stats({moduleName:$intern_1, sessionId:$sessionId, subSystem:$intern_2, evtGroup:$intern_68, millis:(new Date).getTime(), type:$intern_4});
  if (!__gwt_scriptsLoaded[$intern_92]) {
    __gwt_scriptsLoaded[$intern_92] = true;
    document.write($intern_93 + base + $intern_94);
  }
  $doc.write($intern_95);
}

cm3();
