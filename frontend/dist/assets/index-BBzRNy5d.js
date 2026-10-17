(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();var Hm={exports:{}},$l={},Vm={exports:{}},je={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var qa=Symbol.for("react.element"),qv=Symbol.for("react.portal"),Yv=Symbol.for("react.fragment"),Kv=Symbol.for("react.strict_mode"),Zv=Symbol.for("react.profiler"),Qv=Symbol.for("react.provider"),Jv=Symbol.for("react.context"),ex=Symbol.for("react.forward_ref"),tx=Symbol.for("react.suspense"),nx=Symbol.for("react.memo"),ix=Symbol.for("react.lazy"),Ef=Symbol.iterator;function rx(t){return t===null||typeof t!="object"?null:(t=Ef&&t[Ef]||t["@@iterator"],typeof t=="function"?t:null)}var Gm={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Wm=Object.assign,Xm={};function Vs(t,e,n){this.props=t,this.context=e,this.refs=Xm,this.updater=n||Gm}Vs.prototype.isReactComponent={};Vs.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Vs.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function $m(){}$m.prototype=Vs.prototype;function sh(t,e,n){this.props=t,this.context=e,this.refs=Xm,this.updater=n||Gm}var ah=sh.prototype=new $m;ah.constructor=sh;Wm(ah,Vs.prototype);ah.isPureReactComponent=!0;var wf=Array.isArray,qm=Object.prototype.hasOwnProperty,oh={current:null},Ym={key:!0,ref:!0,__self:!0,__source:!0};function Km(t,e,n){var i,r={},s=null,a=null;if(e!=null)for(i in e.ref!==void 0&&(a=e.ref),e.key!==void 0&&(s=""+e.key),e)qm.call(e,i)&&!Ym.hasOwnProperty(i)&&(r[i]=e[i]);var o=arguments.length-2;if(o===1)r.children=n;else if(1<o){for(var l=Array(o),h=0;h<o;h++)l[h]=arguments[h+2];r.children=l}if(t&&t.defaultProps)for(i in o=t.defaultProps,o)r[i]===void 0&&(r[i]=o[i]);return{$$typeof:qa,type:t,key:s,ref:a,props:r,_owner:oh.current}}function sx(t,e){return{$$typeof:qa,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function lh(t){return typeof t=="object"&&t!==null&&t.$$typeof===qa}function ax(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var Tf=/\/+/g;function xc(t,e){return typeof t=="object"&&t!==null&&t.key!=null?ax(""+t.key):e.toString(36)}function $o(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var a=!1;if(t===null)a=!0;else switch(s){case"string":case"number":a=!0;break;case"object":switch(t.$$typeof){case qa:case qv:a=!0}}if(a)return a=t,r=r(a),t=i===""?"."+xc(a,0):i,wf(r)?(n="",t!=null&&(n=t.replace(Tf,"$&/")+"/"),$o(r,e,n,"",function(h){return h})):r!=null&&(lh(r)&&(r=sx(r,n+(!r.key||a&&a.key===r.key?"":(""+r.key).replace(Tf,"$&/")+"/")+t)),e.push(r)),1;if(a=0,i=i===""?".":i+":",wf(t))for(var o=0;o<t.length;o++){s=t[o];var l=i+xc(s,o);a+=$o(s,e,n,l,r)}else if(l=rx(t),typeof l=="function")for(t=l.call(t),o=0;!(s=t.next()).done;)s=s.value,l=i+xc(s,o++),a+=$o(s,e,n,l,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return a}function ro(t,e,n){if(t==null)return t;var i=[],r=0;return $o(t,i,"","",function(s){return e.call(n,s,r++)}),i}function ox(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var Jt={current:null},qo={transition:null},lx={ReactCurrentDispatcher:Jt,ReactCurrentBatchConfig:qo,ReactCurrentOwner:oh};function Zm(){throw Error("act(...) is not supported in production builds of React.")}je.Children={map:ro,forEach:function(t,e,n){ro(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return ro(t,function(){e++}),e},toArray:function(t){return ro(t,function(e){return e})||[]},only:function(t){if(!lh(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};je.Component=Vs;je.Fragment=Yv;je.Profiler=Zv;je.PureComponent=sh;je.StrictMode=Kv;je.Suspense=tx;je.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=lx;je.act=Zm;je.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=Wm({},t.props),r=t.key,s=t.ref,a=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,a=oh.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var o=t.type.defaultProps;for(l in e)qm.call(e,l)&&!Ym.hasOwnProperty(l)&&(i[l]=e[l]===void 0&&o!==void 0?o[l]:e[l])}var l=arguments.length-2;if(l===1)i.children=n;else if(1<l){o=Array(l);for(var h=0;h<l;h++)o[h]=arguments[h+2];i.children=o}return{$$typeof:qa,type:t.type,key:r,ref:s,props:i,_owner:a}};je.createContext=function(t){return t={$$typeof:Jv,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:Qv,_context:t},t.Consumer=t};je.createElement=Km;je.createFactory=function(t){var e=Km.bind(null,t);return e.type=t,e};je.createRef=function(){return{current:null}};je.forwardRef=function(t){return{$$typeof:ex,render:t}};je.isValidElement=lh;je.lazy=function(t){return{$$typeof:ix,_payload:{_status:-1,_result:t},_init:ox}};je.memo=function(t,e){return{$$typeof:nx,type:t,compare:e===void 0?null:e}};je.startTransition=function(t){var e=qo.transition;qo.transition={};try{t()}finally{qo.transition=e}};je.unstable_act=Zm;je.useCallback=function(t,e){return Jt.current.useCallback(t,e)};je.useContext=function(t){return Jt.current.useContext(t)};je.useDebugValue=function(){};je.useDeferredValue=function(t){return Jt.current.useDeferredValue(t)};je.useEffect=function(t,e){return Jt.current.useEffect(t,e)};je.useId=function(){return Jt.current.useId()};je.useImperativeHandle=function(t,e,n){return Jt.current.useImperativeHandle(t,e,n)};je.useInsertionEffect=function(t,e){return Jt.current.useInsertionEffect(t,e)};je.useLayoutEffect=function(t,e){return Jt.current.useLayoutEffect(t,e)};je.useMemo=function(t,e){return Jt.current.useMemo(t,e)};je.useReducer=function(t,e,n){return Jt.current.useReducer(t,e,n)};je.useRef=function(t){return Jt.current.useRef(t)};je.useState=function(t){return Jt.current.useState(t)};je.useSyncExternalStore=function(t,e,n){return Jt.current.useSyncExternalStore(t,e,n)};je.useTransition=function(){return Jt.current.useTransition()};je.version="18.3.1";Vm.exports=je;var ee=Vm.exports;/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var cx=ee,ux=Symbol.for("react.element"),dx=Symbol.for("react.fragment"),hx=Object.prototype.hasOwnProperty,fx=cx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,px={key:!0,ref:!0,__self:!0,__source:!0};function Qm(t,e,n){var i,r={},s=null,a=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(a=e.ref);for(i in e)hx.call(e,i)&&!px.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:ux,type:t,key:s,ref:a,props:r,_owner:fx.current}}$l.Fragment=dx;$l.jsx=Qm;$l.jsxs=Qm;Hm.exports=$l;var c=Hm.exports,Jm={exports:{}},Tn={},eg={exports:{}},tg={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(N,F){var V=N.length;N.push(F);e:for(;0<V;){var ne=V-1>>>1,he=N[ne];if(0<r(he,F))N[ne]=F,N[V]=he,V=ne;else break e}}function n(N){return N.length===0?null:N[0]}function i(N){if(N.length===0)return null;var F=N[0],V=N.pop();if(V!==F){N[0]=V;e:for(var ne=0,he=N.length,be=he>>>1;ne<be;){var X=2*(ne+1)-1,te=N[X],le=X+1,ce=N[le];if(0>r(te,V))le<he&&0>r(ce,te)?(N[ne]=ce,N[le]=V,ne=le):(N[ne]=te,N[X]=V,ne=X);else if(le<he&&0>r(ce,V))N[ne]=ce,N[le]=V,ne=le;else break e}}return F}function r(N,F){var V=N.sortIndex-F.sortIndex;return V!==0?V:N.id-F.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var a=Date,o=a.now();t.unstable_now=function(){return a.now()-o}}var l=[],h=[],u=1,f=null,p=3,g=!1,S=!1,y=!1,m=typeof setTimeout=="function"?setTimeout:null,d=typeof clearTimeout=="function"?clearTimeout:null,_=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function v(N){for(var F=n(h);F!==null;){if(F.callback===null)i(h);else if(F.startTime<=N)i(h),F.sortIndex=F.expirationTime,e(l,F);else break;F=n(h)}}function M(N){if(y=!1,v(N),!S)if(n(l)!==null)S=!0,j(R);else{var F=n(h);F!==null&&Y(M,F.startTime-N)}}function R(N,F){S=!1,y&&(y=!1,d(P),P=-1),g=!0;var V=p;try{for(v(F),f=n(l);f!==null&&(!(f.expirationTime>F)||N&&!E());){var ne=f.callback;if(typeof ne=="function"){f.callback=null,p=f.priorityLevel;var he=ne(f.expirationTime<=F);F=t.unstable_now(),typeof he=="function"?f.callback=he:f===n(l)&&i(l),v(F)}else i(l);f=n(l)}if(f!==null)var be=!0;else{var X=n(h);X!==null&&Y(M,X.startTime-F),be=!1}return be}finally{f=null,p=V,g=!1}}var A=!1,C=null,P=-1,B=5,x=-1;function E(){return!(t.unstable_now()-x<B)}function k(){if(C!==null){var N=t.unstable_now();x=N;var F=!0;try{F=C(!0,N)}finally{F?O():(A=!1,C=null)}}else A=!1}var O;if(typeof _=="function")O=function(){_(k)};else if(typeof MessageChannel<"u"){var $=new MessageChannel,K=$.port2;$.port1.onmessage=k,O=function(){K.postMessage(null)}}else O=function(){m(k,0)};function j(N){C=N,A||(A=!0,O())}function Y(N,F){P=m(function(){N(t.unstable_now())},F)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(N){N.callback=null},t.unstable_continueExecution=function(){S||g||(S=!0,j(R))},t.unstable_forceFrameRate=function(N){0>N||125<N?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):B=0<N?Math.floor(1e3/N):5},t.unstable_getCurrentPriorityLevel=function(){return p},t.unstable_getFirstCallbackNode=function(){return n(l)},t.unstable_next=function(N){switch(p){case 1:case 2:case 3:var F=3;break;default:F=p}var V=p;p=F;try{return N()}finally{p=V}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(N,F){switch(N){case 1:case 2:case 3:case 4:case 5:break;default:N=3}var V=p;p=N;try{return F()}finally{p=V}},t.unstable_scheduleCallback=function(N,F,V){var ne=t.unstable_now();switch(typeof V=="object"&&V!==null?(V=V.delay,V=typeof V=="number"&&0<V?ne+V:ne):V=ne,N){case 1:var he=-1;break;case 2:he=250;break;case 5:he=1073741823;break;case 4:he=1e4;break;default:he=5e3}return he=V+he,N={id:u++,callback:F,priorityLevel:N,startTime:V,expirationTime:he,sortIndex:-1},V>ne?(N.sortIndex=V,e(h,N),n(l)===null&&N===n(h)&&(y?(d(P),P=-1):y=!0,Y(M,V-ne))):(N.sortIndex=he,e(l,N),S||g||(S=!0,j(R))),N},t.unstable_shouldYield=E,t.unstable_wrapCallback=function(N){var F=p;return function(){var V=p;p=F;try{return N.apply(this,arguments)}finally{p=V}}}})(tg);eg.exports=tg;var mx=eg.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var gx=ee,wn=mx;function se(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var ng=new Set,Pa={};function Or(t,e){Ps(t,e),Ps(t+"Capture",e)}function Ps(t,e){for(Pa[t]=e,t=0;t<e.length;t++)ng.add(e[t])}var Si=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Tu=Object.prototype.hasOwnProperty,_x=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Cf={},Af={};function vx(t){return Tu.call(Af,t)?!0:Tu.call(Cf,t)?!1:_x.test(t)?Af[t]=!0:(Cf[t]=!0,!1)}function xx(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function yx(t,e,n,i){if(e===null||typeof e>"u"||xx(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function en(t,e,n,i,r,s,a){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=a}var jt={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){jt[t]=new en(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];jt[e]=new en(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){jt[t]=new en(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){jt[t]=new en(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){jt[t]=new en(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){jt[t]=new en(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){jt[t]=new en(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){jt[t]=new en(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){jt[t]=new en(t,5,!1,t.toLowerCase(),null,!1,!1)});var ch=/[\-:]([a-z])/g;function uh(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(ch,uh);jt[e]=new en(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(ch,uh);jt[e]=new en(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(ch,uh);jt[e]=new en(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){jt[t]=new en(t,1,!1,t.toLowerCase(),null,!1,!1)});jt.xlinkHref=new en("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){jt[t]=new en(t,1,!1,t.toLowerCase(),null,!0,!0)});function dh(t,e,n,i){var r=jt.hasOwnProperty(e)?jt[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(yx(e,n,r,i)&&(n=null),i||r===null?vx(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var Ai=gx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,so=Symbol.for("react.element"),ss=Symbol.for("react.portal"),as=Symbol.for("react.fragment"),hh=Symbol.for("react.strict_mode"),Cu=Symbol.for("react.profiler"),ig=Symbol.for("react.provider"),rg=Symbol.for("react.context"),fh=Symbol.for("react.forward_ref"),Au=Symbol.for("react.suspense"),bu=Symbol.for("react.suspense_list"),ph=Symbol.for("react.memo"),Oi=Symbol.for("react.lazy"),sg=Symbol.for("react.offscreen"),bf=Symbol.iterator;function Ys(t){return t===null||typeof t!="object"?null:(t=bf&&t[bf]||t["@@iterator"],typeof t=="function"?t:null)}var vt=Object.assign,yc;function pa(t){if(yc===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);yc=e&&e[1]||""}return`
`+yc+t}var Sc=!1;function Mc(t,e){if(!t||Sc)return"";Sc=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(h){var i=h}Reflect.construct(t,[],e)}else{try{e.call()}catch(h){i=h}t.call(e.prototype)}else{try{throw Error()}catch(h){i=h}t()}}catch(h){if(h&&i&&typeof h.stack=="string"){for(var r=h.stack.split(`
`),s=i.stack.split(`
`),a=r.length-1,o=s.length-1;1<=a&&0<=o&&r[a]!==s[o];)o--;for(;1<=a&&0<=o;a--,o--)if(r[a]!==s[o]){if(a!==1||o!==1)do if(a--,o--,0>o||r[a]!==s[o]){var l=`
`+r[a].replace(" at new "," at ");return t.displayName&&l.includes("<anonymous>")&&(l=l.replace("<anonymous>",t.displayName)),l}while(1<=a&&0<=o);break}}}finally{Sc=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?pa(t):""}function Sx(t){switch(t.tag){case 5:return pa(t.type);case 16:return pa("Lazy");case 13:return pa("Suspense");case 19:return pa("SuspenseList");case 0:case 2:case 15:return t=Mc(t.type,!1),t;case 11:return t=Mc(t.type.render,!1),t;case 1:return t=Mc(t.type,!0),t;default:return""}}function Ru(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case as:return"Fragment";case ss:return"Portal";case Cu:return"Profiler";case hh:return"StrictMode";case Au:return"Suspense";case bu:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case rg:return(t.displayName||"Context")+".Consumer";case ig:return(t._context.displayName||"Context")+".Provider";case fh:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case ph:return e=t.displayName||null,e!==null?e:Ru(t.type)||"Memo";case Oi:e=t._payload,t=t._init;try{return Ru(t(e))}catch{}}return null}function Mx(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Ru(e);case 8:return e===hh?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function ir(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function ag(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function Ex(t){var e=ag(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(a){i=""+a,s.call(this,a)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(a){i=""+a},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function ao(t){t._valueTracker||(t._valueTracker=Ex(t))}function og(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=ag(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function pl(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Pu(t,e){var n=e.checked;return vt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Rf(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=ir(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function lg(t,e){e=e.checked,e!=null&&dh(t,"checked",e,!1)}function Nu(t,e){lg(t,e);var n=ir(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?Lu(t,e.type,n):e.hasOwnProperty("defaultValue")&&Lu(t,e.type,ir(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Pf(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function Lu(t,e,n){(e!=="number"||pl(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var ma=Array.isArray;function xs(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+ir(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function Du(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(se(91));return vt({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Nf(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(se(92));if(ma(n)){if(1<n.length)throw Error(se(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:ir(n)}}function cg(t,e){var n=ir(e.value),i=ir(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function Lf(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function ug(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Iu(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?ug(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var oo,dg=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(oo=oo||document.createElement("div"),oo.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=oo.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function Na(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var Sa={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},wx=["Webkit","ms","Moz","O"];Object.keys(Sa).forEach(function(t){wx.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),Sa[e]=Sa[t]})});function hg(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||Sa.hasOwnProperty(t)&&Sa[t]?(""+e).trim():e+"px"}function fg(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=hg(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var Tx=vt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Uu(t,e){if(e){if(Tx[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(se(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(se(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(se(61))}if(e.style!=null&&typeof e.style!="object")throw Error(se(62))}}function Fu(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var ku=null;function mh(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var Ou=null,ys=null,Ss=null;function Df(t){if(t=Za(t)){if(typeof Ou!="function")throw Error(se(280));var e=t.stateNode;e&&(e=Ql(e),Ou(t.stateNode,t.type,e))}}function pg(t){ys?Ss?Ss.push(t):Ss=[t]:ys=t}function mg(){if(ys){var t=ys,e=Ss;if(Ss=ys=null,Df(t),e)for(t=0;t<e.length;t++)Df(e[t])}}function gg(t,e){return t(e)}function _g(){}var Ec=!1;function vg(t,e,n){if(Ec)return t(e,n);Ec=!0;try{return gg(t,e,n)}finally{Ec=!1,(ys!==null||Ss!==null)&&(_g(),mg())}}function La(t,e){var n=t.stateNode;if(n===null)return null;var i=Ql(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(se(231,e,typeof n));return n}var zu=!1;if(Si)try{var Ks={};Object.defineProperty(Ks,"passive",{get:function(){zu=!0}}),window.addEventListener("test",Ks,Ks),window.removeEventListener("test",Ks,Ks)}catch{zu=!1}function Cx(t,e,n,i,r,s,a,o,l){var h=Array.prototype.slice.call(arguments,3);try{e.apply(n,h)}catch(u){this.onError(u)}}var Ma=!1,ml=null,gl=!1,Bu=null,Ax={onError:function(t){Ma=!0,ml=t}};function bx(t,e,n,i,r,s,a,o,l){Ma=!1,ml=null,Cx.apply(Ax,arguments)}function Rx(t,e,n,i,r,s,a,o,l){if(bx.apply(this,arguments),Ma){if(Ma){var h=ml;Ma=!1,ml=null}else throw Error(se(198));gl||(gl=!0,Bu=h)}}function zr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function xg(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function If(t){if(zr(t)!==t)throw Error(se(188))}function Px(t){var e=t.alternate;if(!e){if(e=zr(t),e===null)throw Error(se(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return If(r),t;if(s===i)return If(r),e;s=s.sibling}throw Error(se(188))}if(n.return!==i.return)n=r,i=s;else{for(var a=!1,o=r.child;o;){if(o===n){a=!0,n=r,i=s;break}if(o===i){a=!0,i=r,n=s;break}o=o.sibling}if(!a){for(o=s.child;o;){if(o===n){a=!0,n=s,i=r;break}if(o===i){a=!0,i=s,n=r;break}o=o.sibling}if(!a)throw Error(se(189))}}if(n.alternate!==i)throw Error(se(190))}if(n.tag!==3)throw Error(se(188));return n.stateNode.current===n?t:e}function yg(t){return t=Px(t),t!==null?Sg(t):null}function Sg(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=Sg(t);if(e!==null)return e;t=t.sibling}return null}var Mg=wn.unstable_scheduleCallback,Uf=wn.unstable_cancelCallback,Nx=wn.unstable_shouldYield,Lx=wn.unstable_requestPaint,Et=wn.unstable_now,Dx=wn.unstable_getCurrentPriorityLevel,gh=wn.unstable_ImmediatePriority,Eg=wn.unstable_UserBlockingPriority,_l=wn.unstable_NormalPriority,Ix=wn.unstable_LowPriority,wg=wn.unstable_IdlePriority,ql=null,ii=null;function Ux(t){if(ii&&typeof ii.onCommitFiberRoot=="function")try{ii.onCommitFiberRoot(ql,t,void 0,(t.current.flags&128)===128)}catch{}}var Yn=Math.clz32?Math.clz32:Ox,Fx=Math.log,kx=Math.LN2;function Ox(t){return t>>>=0,t===0?32:31-(Fx(t)/kx|0)|0}var lo=64,co=4194304;function ga(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function vl(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,a=n&268435455;if(a!==0){var o=a&~r;o!==0?i=ga(o):(s&=a,s!==0&&(i=ga(s)))}else a=n&~r,a!==0?i=ga(a):s!==0&&(i=ga(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-Yn(e),r=1<<n,i|=t[n],e&=~r;return i}function zx(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Bx(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var a=31-Yn(s),o=1<<a,l=r[a];l===-1?(!(o&n)||o&i)&&(r[a]=zx(o,e)):l<=e&&(t.expiredLanes|=o),s&=~o}}function ju(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Tg(){var t=lo;return lo<<=1,!(lo&4194240)&&(lo=64),t}function wc(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function Ya(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-Yn(e),t[e]=n}function jx(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-Yn(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function _h(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-Yn(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var it=0;function Cg(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var Ag,vh,bg,Rg,Pg,Hu=!1,uo=[],$i=null,qi=null,Yi=null,Da=new Map,Ia=new Map,ji=[],Hx="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Ff(t,e){switch(t){case"focusin":case"focusout":$i=null;break;case"dragenter":case"dragleave":qi=null;break;case"mouseover":case"mouseout":Yi=null;break;case"pointerover":case"pointerout":Da.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ia.delete(e.pointerId)}}function Zs(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=Za(e),e!==null&&vh(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function Vx(t,e,n,i,r){switch(e){case"focusin":return $i=Zs($i,t,e,n,i,r),!0;case"dragenter":return qi=Zs(qi,t,e,n,i,r),!0;case"mouseover":return Yi=Zs(Yi,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return Da.set(s,Zs(Da.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,Ia.set(s,Zs(Ia.get(s)||null,t,e,n,i,r)),!0}return!1}function Ng(t){var e=Er(t.target);if(e!==null){var n=zr(e);if(n!==null){if(e=n.tag,e===13){if(e=xg(n),e!==null){t.blockedOn=e,Pg(t.priority,function(){bg(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Yo(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=Vu(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);ku=i,n.target.dispatchEvent(i),ku=null}else return e=Za(n),e!==null&&vh(e),t.blockedOn=n,!1;e.shift()}return!0}function kf(t,e,n){Yo(t)&&n.delete(e)}function Gx(){Hu=!1,$i!==null&&Yo($i)&&($i=null),qi!==null&&Yo(qi)&&(qi=null),Yi!==null&&Yo(Yi)&&(Yi=null),Da.forEach(kf),Ia.forEach(kf)}function Qs(t,e){t.blockedOn===e&&(t.blockedOn=null,Hu||(Hu=!0,wn.unstable_scheduleCallback(wn.unstable_NormalPriority,Gx)))}function Ua(t){function e(r){return Qs(r,t)}if(0<uo.length){Qs(uo[0],t);for(var n=1;n<uo.length;n++){var i=uo[n];i.blockedOn===t&&(i.blockedOn=null)}}for($i!==null&&Qs($i,t),qi!==null&&Qs(qi,t),Yi!==null&&Qs(Yi,t),Da.forEach(e),Ia.forEach(e),n=0;n<ji.length;n++)i=ji[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<ji.length&&(n=ji[0],n.blockedOn===null);)Ng(n),n.blockedOn===null&&ji.shift()}var Ms=Ai.ReactCurrentBatchConfig,xl=!0;function Wx(t,e,n,i){var r=it,s=Ms.transition;Ms.transition=null;try{it=1,xh(t,e,n,i)}finally{it=r,Ms.transition=s}}function Xx(t,e,n,i){var r=it,s=Ms.transition;Ms.transition=null;try{it=4,xh(t,e,n,i)}finally{it=r,Ms.transition=s}}function xh(t,e,n,i){if(xl){var r=Vu(t,e,n,i);if(r===null)Ic(t,e,i,yl,n),Ff(t,i);else if(Vx(r,t,e,n,i))i.stopPropagation();else if(Ff(t,i),e&4&&-1<Hx.indexOf(t)){for(;r!==null;){var s=Za(r);if(s!==null&&Ag(s),s=Vu(t,e,n,i),s===null&&Ic(t,e,i,yl,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else Ic(t,e,i,null,n)}}var yl=null;function Vu(t,e,n,i){if(yl=null,t=mh(i),t=Er(t),t!==null)if(e=zr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=xg(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return yl=t,null}function Lg(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Dx()){case gh:return 1;case Eg:return 4;case _l:case Ix:return 16;case wg:return 536870912;default:return 16}default:return 16}}var Gi=null,yh=null,Ko=null;function Dg(){if(Ko)return Ko;var t,e=yh,n=e.length,i,r="value"in Gi?Gi.value:Gi.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var a=n-t;for(i=1;i<=a&&e[n-i]===r[s-i];i++);return Ko=r.slice(t,1<i?1-i:void 0)}function Zo(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function ho(){return!0}function Of(){return!1}function Cn(t){function e(n,i,r,s,a){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=a,this.currentTarget=null;for(var o in t)t.hasOwnProperty(o)&&(n=t[o],this[o]=n?n(s):s[o]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?ho:Of,this.isPropagationStopped=Of,this}return vt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=ho)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=ho)},persist:function(){},isPersistent:ho}),e}var Gs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Sh=Cn(Gs),Ka=vt({},Gs,{view:0,detail:0}),$x=Cn(Ka),Tc,Cc,Js,Yl=vt({},Ka,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:Mh,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Js&&(Js&&t.type==="mousemove"?(Tc=t.screenX-Js.screenX,Cc=t.screenY-Js.screenY):Cc=Tc=0,Js=t),Tc)},movementY:function(t){return"movementY"in t?t.movementY:Cc}}),zf=Cn(Yl),qx=vt({},Yl,{dataTransfer:0}),Yx=Cn(qx),Kx=vt({},Ka,{relatedTarget:0}),Ac=Cn(Kx),Zx=vt({},Gs,{animationName:0,elapsedTime:0,pseudoElement:0}),Qx=Cn(Zx),Jx=vt({},Gs,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),e0=Cn(Jx),t0=vt({},Gs,{data:0}),Bf=Cn(t0),n0={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},i0={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},r0={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function s0(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=r0[t])?!!e[t]:!1}function Mh(){return s0}var a0=vt({},Ka,{key:function(t){if(t.key){var e=n0[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Zo(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?i0[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:Mh,charCode:function(t){return t.type==="keypress"?Zo(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Zo(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),o0=Cn(a0),l0=vt({},Yl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),jf=Cn(l0),c0=vt({},Ka,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:Mh}),u0=Cn(c0),d0=vt({},Gs,{propertyName:0,elapsedTime:0,pseudoElement:0}),h0=Cn(d0),f0=vt({},Yl,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),p0=Cn(f0),m0=[9,13,27,32],Eh=Si&&"CompositionEvent"in window,Ea=null;Si&&"documentMode"in document&&(Ea=document.documentMode);var g0=Si&&"TextEvent"in window&&!Ea,Ig=Si&&(!Eh||Ea&&8<Ea&&11>=Ea),Hf=" ",Vf=!1;function Ug(t,e){switch(t){case"keyup":return m0.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Fg(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var os=!1;function _0(t,e){switch(t){case"compositionend":return Fg(e);case"keypress":return e.which!==32?null:(Vf=!0,Hf);case"textInput":return t=e.data,t===Hf&&Vf?null:t;default:return null}}function v0(t,e){if(os)return t==="compositionend"||!Eh&&Ug(t,e)?(t=Dg(),Ko=yh=Gi=null,os=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return Ig&&e.locale!=="ko"?null:e.data;default:return null}}var x0={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Gf(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!x0[t.type]:e==="textarea"}function kg(t,e,n,i){pg(i),e=Sl(e,"onChange"),0<e.length&&(n=new Sh("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var wa=null,Fa=null;function y0(t){qg(t,0)}function Kl(t){var e=us(t);if(og(e))return t}function S0(t,e){if(t==="change")return e}var Og=!1;if(Si){var bc;if(Si){var Rc="oninput"in document;if(!Rc){var Wf=document.createElement("div");Wf.setAttribute("oninput","return;"),Rc=typeof Wf.oninput=="function"}bc=Rc}else bc=!1;Og=bc&&(!document.documentMode||9<document.documentMode)}function Xf(){wa&&(wa.detachEvent("onpropertychange",zg),Fa=wa=null)}function zg(t){if(t.propertyName==="value"&&Kl(Fa)){var e=[];kg(e,Fa,t,mh(t)),vg(y0,e)}}function M0(t,e,n){t==="focusin"?(Xf(),wa=e,Fa=n,wa.attachEvent("onpropertychange",zg)):t==="focusout"&&Xf()}function E0(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Kl(Fa)}function w0(t,e){if(t==="click")return Kl(e)}function T0(t,e){if(t==="input"||t==="change")return Kl(e)}function C0(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var Zn=typeof Object.is=="function"?Object.is:C0;function ka(t,e){if(Zn(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!Tu.call(e,r)||!Zn(t[r],e[r]))return!1}return!0}function $f(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function qf(t,e){var n=$f(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=$f(n)}}function Bg(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?Bg(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function jg(){for(var t=window,e=pl();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=pl(t.document)}return e}function wh(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function A0(t){var e=jg(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&Bg(n.ownerDocument.documentElement,n)){if(i!==null&&wh(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=qf(n,s);var a=qf(n,i);r&&a&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==a.node||t.focusOffset!==a.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(a.node,a.offset)):(e.setEnd(a.node,a.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var b0=Si&&"documentMode"in document&&11>=document.documentMode,ls=null,Gu=null,Ta=null,Wu=!1;function Yf(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Wu||ls==null||ls!==pl(i)||(i=ls,"selectionStart"in i&&wh(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),Ta&&ka(Ta,i)||(Ta=i,i=Sl(Gu,"onSelect"),0<i.length&&(e=new Sh("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=ls)))}function fo(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var cs={animationend:fo("Animation","AnimationEnd"),animationiteration:fo("Animation","AnimationIteration"),animationstart:fo("Animation","AnimationStart"),transitionend:fo("Transition","TransitionEnd")},Pc={},Hg={};Si&&(Hg=document.createElement("div").style,"AnimationEvent"in window||(delete cs.animationend.animation,delete cs.animationiteration.animation,delete cs.animationstart.animation),"TransitionEvent"in window||delete cs.transitionend.transition);function Zl(t){if(Pc[t])return Pc[t];if(!cs[t])return t;var e=cs[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in Hg)return Pc[t]=e[n];return t}var Vg=Zl("animationend"),Gg=Zl("animationiteration"),Wg=Zl("animationstart"),Xg=Zl("transitionend"),$g=new Map,Kf="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function or(t,e){$g.set(t,e),Or(e,[t])}for(var Nc=0;Nc<Kf.length;Nc++){var Lc=Kf[Nc],R0=Lc.toLowerCase(),P0=Lc[0].toUpperCase()+Lc.slice(1);or(R0,"on"+P0)}or(Vg,"onAnimationEnd");or(Gg,"onAnimationIteration");or(Wg,"onAnimationStart");or("dblclick","onDoubleClick");or("focusin","onFocus");or("focusout","onBlur");or(Xg,"onTransitionEnd");Ps("onMouseEnter",["mouseout","mouseover"]);Ps("onMouseLeave",["mouseout","mouseover"]);Ps("onPointerEnter",["pointerout","pointerover"]);Ps("onPointerLeave",["pointerout","pointerover"]);Or("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Or("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Or("onBeforeInput",["compositionend","keypress","textInput","paste"]);Or("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Or("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Or("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var _a="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),N0=new Set("cancel close invalid load scroll toggle".split(" ").concat(_a));function Zf(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,Rx(i,e,void 0,t),t.currentTarget=null}function qg(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var a=i.length-1;0<=a;a--){var o=i[a],l=o.instance,h=o.currentTarget;if(o=o.listener,l!==s&&r.isPropagationStopped())break e;Zf(r,o,h),s=l}else for(a=0;a<i.length;a++){if(o=i[a],l=o.instance,h=o.currentTarget,o=o.listener,l!==s&&r.isPropagationStopped())break e;Zf(r,o,h),s=l}}}if(gl)throw t=Bu,gl=!1,Bu=null,t}function ut(t,e){var n=e[Ku];n===void 0&&(n=e[Ku]=new Set);var i=t+"__bubble";n.has(i)||(Yg(e,t,2,!1),n.add(i))}function Dc(t,e,n){var i=0;e&&(i|=4),Yg(n,t,i,e)}var po="_reactListening"+Math.random().toString(36).slice(2);function Oa(t){if(!t[po]){t[po]=!0,ng.forEach(function(n){n!=="selectionchange"&&(N0.has(n)||Dc(n,!1,t),Dc(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[po]||(e[po]=!0,Dc("selectionchange",!1,e))}}function Yg(t,e,n,i){switch(Lg(e)){case 1:var r=Wx;break;case 4:r=Xx;break;default:r=xh}n=r.bind(null,e,n,t),r=void 0,!zu||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function Ic(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var a=i.tag;if(a===3||a===4){var o=i.stateNode.containerInfo;if(o===r||o.nodeType===8&&o.parentNode===r)break;if(a===4)for(a=i.return;a!==null;){var l=a.tag;if((l===3||l===4)&&(l=a.stateNode.containerInfo,l===r||l.nodeType===8&&l.parentNode===r))return;a=a.return}for(;o!==null;){if(a=Er(o),a===null)return;if(l=a.tag,l===5||l===6){i=s=a;continue e}o=o.parentNode}}i=i.return}vg(function(){var h=s,u=mh(n),f=[];e:{var p=$g.get(t);if(p!==void 0){var g=Sh,S=t;switch(t){case"keypress":if(Zo(n)===0)break e;case"keydown":case"keyup":g=o0;break;case"focusin":S="focus",g=Ac;break;case"focusout":S="blur",g=Ac;break;case"beforeblur":case"afterblur":g=Ac;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":g=zf;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":g=Yx;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":g=u0;break;case Vg:case Gg:case Wg:g=Qx;break;case Xg:g=h0;break;case"scroll":g=$x;break;case"wheel":g=p0;break;case"copy":case"cut":case"paste":g=e0;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":g=jf}var y=(e&4)!==0,m=!y&&t==="scroll",d=y?p!==null?p+"Capture":null:p;y=[];for(var _=h,v;_!==null;){v=_;var M=v.stateNode;if(v.tag===5&&M!==null&&(v=M,d!==null&&(M=La(_,d),M!=null&&y.push(za(_,M,v)))),m)break;_=_.return}0<y.length&&(p=new g(p,S,null,n,u),f.push({event:p,listeners:y}))}}if(!(e&7)){e:{if(p=t==="mouseover"||t==="pointerover",g=t==="mouseout"||t==="pointerout",p&&n!==ku&&(S=n.relatedTarget||n.fromElement)&&(Er(S)||S[Mi]))break e;if((g||p)&&(p=u.window===u?u:(p=u.ownerDocument)?p.defaultView||p.parentWindow:window,g?(S=n.relatedTarget||n.toElement,g=h,S=S?Er(S):null,S!==null&&(m=zr(S),S!==m||S.tag!==5&&S.tag!==6)&&(S=null)):(g=null,S=h),g!==S)){if(y=zf,M="onMouseLeave",d="onMouseEnter",_="mouse",(t==="pointerout"||t==="pointerover")&&(y=jf,M="onPointerLeave",d="onPointerEnter",_="pointer"),m=g==null?p:us(g),v=S==null?p:us(S),p=new y(M,_+"leave",g,n,u),p.target=m,p.relatedTarget=v,M=null,Er(u)===h&&(y=new y(d,_+"enter",S,n,u),y.target=v,y.relatedTarget=m,M=y),m=M,g&&S)t:{for(y=g,d=S,_=0,v=y;v;v=Vr(v))_++;for(v=0,M=d;M;M=Vr(M))v++;for(;0<_-v;)y=Vr(y),_--;for(;0<v-_;)d=Vr(d),v--;for(;_--;){if(y===d||d!==null&&y===d.alternate)break t;y=Vr(y),d=Vr(d)}y=null}else y=null;g!==null&&Qf(f,p,g,y,!1),S!==null&&m!==null&&Qf(f,m,S,y,!0)}}e:{if(p=h?us(h):window,g=p.nodeName&&p.nodeName.toLowerCase(),g==="select"||g==="input"&&p.type==="file")var R=S0;else if(Gf(p))if(Og)R=T0;else{R=E0;var A=M0}else(g=p.nodeName)&&g.toLowerCase()==="input"&&(p.type==="checkbox"||p.type==="radio")&&(R=w0);if(R&&(R=R(t,h))){kg(f,R,n,u);break e}A&&A(t,p,h),t==="focusout"&&(A=p._wrapperState)&&A.controlled&&p.type==="number"&&Lu(p,"number",p.value)}switch(A=h?us(h):window,t){case"focusin":(Gf(A)||A.contentEditable==="true")&&(ls=A,Gu=h,Ta=null);break;case"focusout":Ta=Gu=ls=null;break;case"mousedown":Wu=!0;break;case"contextmenu":case"mouseup":case"dragend":Wu=!1,Yf(f,n,u);break;case"selectionchange":if(b0)break;case"keydown":case"keyup":Yf(f,n,u)}var C;if(Eh)e:{switch(t){case"compositionstart":var P="onCompositionStart";break e;case"compositionend":P="onCompositionEnd";break e;case"compositionupdate":P="onCompositionUpdate";break e}P=void 0}else os?Ug(t,n)&&(P="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(P="onCompositionStart");P&&(Ig&&n.locale!=="ko"&&(os||P!=="onCompositionStart"?P==="onCompositionEnd"&&os&&(C=Dg()):(Gi=u,yh="value"in Gi?Gi.value:Gi.textContent,os=!0)),A=Sl(h,P),0<A.length&&(P=new Bf(P,t,null,n,u),f.push({event:P,listeners:A}),C?P.data=C:(C=Fg(n),C!==null&&(P.data=C)))),(C=g0?_0(t,n):v0(t,n))&&(h=Sl(h,"onBeforeInput"),0<h.length&&(u=new Bf("onBeforeInput","beforeinput",null,n,u),f.push({event:u,listeners:h}),u.data=C))}qg(f,e)})}function za(t,e,n){return{instance:t,listener:e,currentTarget:n}}function Sl(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=La(t,n),s!=null&&i.unshift(za(t,s,r)),s=La(t,e),s!=null&&i.push(za(t,s,r))),t=t.return}return i}function Vr(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function Qf(t,e,n,i,r){for(var s=e._reactName,a=[];n!==null&&n!==i;){var o=n,l=o.alternate,h=o.stateNode;if(l!==null&&l===i)break;o.tag===5&&h!==null&&(o=h,r?(l=La(n,s),l!=null&&a.unshift(za(n,l,o))):r||(l=La(n,s),l!=null&&a.push(za(n,l,o)))),n=n.return}a.length!==0&&t.push({event:e,listeners:a})}var L0=/\r\n?/g,D0=/\u0000|\uFFFD/g;function Jf(t){return(typeof t=="string"?t:""+t).replace(L0,`
`).replace(D0,"")}function mo(t,e,n){if(e=Jf(e),Jf(t)!==e&&n)throw Error(se(425))}function Ml(){}var Xu=null,$u=null;function qu(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Yu=typeof setTimeout=="function"?setTimeout:void 0,I0=typeof clearTimeout=="function"?clearTimeout:void 0,ep=typeof Promise=="function"?Promise:void 0,U0=typeof queueMicrotask=="function"?queueMicrotask:typeof ep<"u"?function(t){return ep.resolve(null).then(t).catch(F0)}:Yu;function F0(t){setTimeout(function(){throw t})}function Uc(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),Ua(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);Ua(e)}function Ki(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function tp(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var Ws=Math.random().toString(36).slice(2),ni="__reactFiber$"+Ws,Ba="__reactProps$"+Ws,Mi="__reactContainer$"+Ws,Ku="__reactEvents$"+Ws,k0="__reactListeners$"+Ws,O0="__reactHandles$"+Ws;function Er(t){var e=t[ni];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Mi]||n[ni]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=tp(t);t!==null;){if(n=t[ni])return n;t=tp(t)}return e}t=n,n=t.parentNode}return null}function Za(t){return t=t[ni]||t[Mi],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function us(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(se(33))}function Ql(t){return t[Ba]||null}var Zu=[],ds=-1;function lr(t){return{current:t}}function ht(t){0>ds||(t.current=Zu[ds],Zu[ds]=null,ds--)}function at(t,e){ds++,Zu[ds]=t.current,t.current=e}var rr={},qt=lr(rr),cn=lr(!1),Pr=rr;function Ns(t,e){var n=t.type.contextTypes;if(!n)return rr;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function un(t){return t=t.childContextTypes,t!=null}function El(){ht(cn),ht(qt)}function np(t,e,n){if(qt.current!==rr)throw Error(se(168));at(qt,e),at(cn,n)}function Kg(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(se(108,Mx(t)||"Unknown",r));return vt({},n,i)}function wl(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||rr,Pr=qt.current,at(qt,t),at(cn,cn.current),!0}function ip(t,e,n){var i=t.stateNode;if(!i)throw Error(se(169));n?(t=Kg(t,e,Pr),i.__reactInternalMemoizedMergedChildContext=t,ht(cn),ht(qt),at(qt,t)):ht(cn),at(cn,n)}var mi=null,Jl=!1,Fc=!1;function Zg(t){mi===null?mi=[t]:mi.push(t)}function z0(t){Jl=!0,Zg(t)}function cr(){if(!Fc&&mi!==null){Fc=!0;var t=0,e=it;try{var n=mi;for(it=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}mi=null,Jl=!1}catch(r){throw mi!==null&&(mi=mi.slice(t+1)),Mg(gh,cr),r}finally{it=e,Fc=!1}}return null}var hs=[],fs=0,Tl=null,Cl=0,Pn=[],Nn=0,Nr=null,gi=1,_i="";function vr(t,e){hs[fs++]=Cl,hs[fs++]=Tl,Tl=t,Cl=e}function Qg(t,e,n){Pn[Nn++]=gi,Pn[Nn++]=_i,Pn[Nn++]=Nr,Nr=t;var i=gi;t=_i;var r=32-Yn(i)-1;i&=~(1<<r),n+=1;var s=32-Yn(e)+r;if(30<s){var a=r-r%5;s=(i&(1<<a)-1).toString(32),i>>=a,r-=a,gi=1<<32-Yn(e)+r|n<<r|i,_i=s+t}else gi=1<<s|n<<r|i,_i=t}function Th(t){t.return!==null&&(vr(t,1),Qg(t,1,0))}function Ch(t){for(;t===Tl;)Tl=hs[--fs],hs[fs]=null,Cl=hs[--fs],hs[fs]=null;for(;t===Nr;)Nr=Pn[--Nn],Pn[Nn]=null,_i=Pn[--Nn],Pn[Nn]=null,gi=Pn[--Nn],Pn[Nn]=null}var En=null,Sn=null,pt=!1,Wn=null;function Jg(t,e){var n=Dn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function rp(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,En=t,Sn=Ki(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,En=t,Sn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Nr!==null?{id:gi,overflow:_i}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Dn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,En=t,Sn=null,!0):!1;default:return!1}}function Qu(t){return(t.mode&1)!==0&&(t.flags&128)===0}function Ju(t){if(pt){var e=Sn;if(e){var n=e;if(!rp(t,e)){if(Qu(t))throw Error(se(418));e=Ki(n.nextSibling);var i=En;e&&rp(t,e)?Jg(i,n):(t.flags=t.flags&-4097|2,pt=!1,En=t)}}else{if(Qu(t))throw Error(se(418));t.flags=t.flags&-4097|2,pt=!1,En=t}}}function sp(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;En=t}function go(t){if(t!==En)return!1;if(!pt)return sp(t),pt=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!qu(t.type,t.memoizedProps)),e&&(e=Sn)){if(Qu(t))throw e_(),Error(se(418));for(;e;)Jg(t,e),e=Ki(e.nextSibling)}if(sp(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(se(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){Sn=Ki(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}Sn=null}}else Sn=En?Ki(t.stateNode.nextSibling):null;return!0}function e_(){for(var t=Sn;t;)t=Ki(t.nextSibling)}function Ls(){Sn=En=null,pt=!1}function Ah(t){Wn===null?Wn=[t]:Wn.push(t)}var B0=Ai.ReactCurrentBatchConfig;function ea(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(se(309));var i=n.stateNode}if(!i)throw Error(se(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(a){var o=r.refs;a===null?delete o[s]:o[s]=a},e._stringRef=s,e)}if(typeof t!="string")throw Error(se(284));if(!n._owner)throw Error(se(290,t))}return t}function _o(t,e){throw t=Object.prototype.toString.call(e),Error(se(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function ap(t){var e=t._init;return e(t._payload)}function t_(t){function e(d,_){if(t){var v=d.deletions;v===null?(d.deletions=[_],d.flags|=16):v.push(_)}}function n(d,_){if(!t)return null;for(;_!==null;)e(d,_),_=_.sibling;return null}function i(d,_){for(d=new Map;_!==null;)_.key!==null?d.set(_.key,_):d.set(_.index,_),_=_.sibling;return d}function r(d,_){return d=er(d,_),d.index=0,d.sibling=null,d}function s(d,_,v){return d.index=v,t?(v=d.alternate,v!==null?(v=v.index,v<_?(d.flags|=2,_):v):(d.flags|=2,_)):(d.flags|=1048576,_)}function a(d){return t&&d.alternate===null&&(d.flags|=2),d}function o(d,_,v,M){return _===null||_.tag!==6?(_=Vc(v,d.mode,M),_.return=d,_):(_=r(_,v),_.return=d,_)}function l(d,_,v,M){var R=v.type;return R===as?u(d,_,v.props.children,M,v.key):_!==null&&(_.elementType===R||typeof R=="object"&&R!==null&&R.$$typeof===Oi&&ap(R)===_.type)?(M=r(_,v.props),M.ref=ea(d,_,v),M.return=d,M):(M=rl(v.type,v.key,v.props,null,d.mode,M),M.ref=ea(d,_,v),M.return=d,M)}function h(d,_,v,M){return _===null||_.tag!==4||_.stateNode.containerInfo!==v.containerInfo||_.stateNode.implementation!==v.implementation?(_=Gc(v,d.mode,M),_.return=d,_):(_=r(_,v.children||[]),_.return=d,_)}function u(d,_,v,M,R){return _===null||_.tag!==7?(_=Rr(v,d.mode,M,R),_.return=d,_):(_=r(_,v),_.return=d,_)}function f(d,_,v){if(typeof _=="string"&&_!==""||typeof _=="number")return _=Vc(""+_,d.mode,v),_.return=d,_;if(typeof _=="object"&&_!==null){switch(_.$$typeof){case so:return v=rl(_.type,_.key,_.props,null,d.mode,v),v.ref=ea(d,null,_),v.return=d,v;case ss:return _=Gc(_,d.mode,v),_.return=d,_;case Oi:var M=_._init;return f(d,M(_._payload),v)}if(ma(_)||Ys(_))return _=Rr(_,d.mode,v,null),_.return=d,_;_o(d,_)}return null}function p(d,_,v,M){var R=_!==null?_.key:null;if(typeof v=="string"&&v!==""||typeof v=="number")return R!==null?null:o(d,_,""+v,M);if(typeof v=="object"&&v!==null){switch(v.$$typeof){case so:return v.key===R?l(d,_,v,M):null;case ss:return v.key===R?h(d,_,v,M):null;case Oi:return R=v._init,p(d,_,R(v._payload),M)}if(ma(v)||Ys(v))return R!==null?null:u(d,_,v,M,null);_o(d,v)}return null}function g(d,_,v,M,R){if(typeof M=="string"&&M!==""||typeof M=="number")return d=d.get(v)||null,o(_,d,""+M,R);if(typeof M=="object"&&M!==null){switch(M.$$typeof){case so:return d=d.get(M.key===null?v:M.key)||null,l(_,d,M,R);case ss:return d=d.get(M.key===null?v:M.key)||null,h(_,d,M,R);case Oi:var A=M._init;return g(d,_,v,A(M._payload),R)}if(ma(M)||Ys(M))return d=d.get(v)||null,u(_,d,M,R,null);_o(_,M)}return null}function S(d,_,v,M){for(var R=null,A=null,C=_,P=_=0,B=null;C!==null&&P<v.length;P++){C.index>P?(B=C,C=null):B=C.sibling;var x=p(d,C,v[P],M);if(x===null){C===null&&(C=B);break}t&&C&&x.alternate===null&&e(d,C),_=s(x,_,P),A===null?R=x:A.sibling=x,A=x,C=B}if(P===v.length)return n(d,C),pt&&vr(d,P),R;if(C===null){for(;P<v.length;P++)C=f(d,v[P],M),C!==null&&(_=s(C,_,P),A===null?R=C:A.sibling=C,A=C);return pt&&vr(d,P),R}for(C=i(d,C);P<v.length;P++)B=g(C,d,P,v[P],M),B!==null&&(t&&B.alternate!==null&&C.delete(B.key===null?P:B.key),_=s(B,_,P),A===null?R=B:A.sibling=B,A=B);return t&&C.forEach(function(E){return e(d,E)}),pt&&vr(d,P),R}function y(d,_,v,M){var R=Ys(v);if(typeof R!="function")throw Error(se(150));if(v=R.call(v),v==null)throw Error(se(151));for(var A=R=null,C=_,P=_=0,B=null,x=v.next();C!==null&&!x.done;P++,x=v.next()){C.index>P?(B=C,C=null):B=C.sibling;var E=p(d,C,x.value,M);if(E===null){C===null&&(C=B);break}t&&C&&E.alternate===null&&e(d,C),_=s(E,_,P),A===null?R=E:A.sibling=E,A=E,C=B}if(x.done)return n(d,C),pt&&vr(d,P),R;if(C===null){for(;!x.done;P++,x=v.next())x=f(d,x.value,M),x!==null&&(_=s(x,_,P),A===null?R=x:A.sibling=x,A=x);return pt&&vr(d,P),R}for(C=i(d,C);!x.done;P++,x=v.next())x=g(C,d,P,x.value,M),x!==null&&(t&&x.alternate!==null&&C.delete(x.key===null?P:x.key),_=s(x,_,P),A===null?R=x:A.sibling=x,A=x);return t&&C.forEach(function(k){return e(d,k)}),pt&&vr(d,P),R}function m(d,_,v,M){if(typeof v=="object"&&v!==null&&v.type===as&&v.key===null&&(v=v.props.children),typeof v=="object"&&v!==null){switch(v.$$typeof){case so:e:{for(var R=v.key,A=_;A!==null;){if(A.key===R){if(R=v.type,R===as){if(A.tag===7){n(d,A.sibling),_=r(A,v.props.children),_.return=d,d=_;break e}}else if(A.elementType===R||typeof R=="object"&&R!==null&&R.$$typeof===Oi&&ap(R)===A.type){n(d,A.sibling),_=r(A,v.props),_.ref=ea(d,A,v),_.return=d,d=_;break e}n(d,A);break}else e(d,A);A=A.sibling}v.type===as?(_=Rr(v.props.children,d.mode,M,v.key),_.return=d,d=_):(M=rl(v.type,v.key,v.props,null,d.mode,M),M.ref=ea(d,_,v),M.return=d,d=M)}return a(d);case ss:e:{for(A=v.key;_!==null;){if(_.key===A)if(_.tag===4&&_.stateNode.containerInfo===v.containerInfo&&_.stateNode.implementation===v.implementation){n(d,_.sibling),_=r(_,v.children||[]),_.return=d,d=_;break e}else{n(d,_);break}else e(d,_);_=_.sibling}_=Gc(v,d.mode,M),_.return=d,d=_}return a(d);case Oi:return A=v._init,m(d,_,A(v._payload),M)}if(ma(v))return S(d,_,v,M);if(Ys(v))return y(d,_,v,M);_o(d,v)}return typeof v=="string"&&v!==""||typeof v=="number"?(v=""+v,_!==null&&_.tag===6?(n(d,_.sibling),_=r(_,v),_.return=d,d=_):(n(d,_),_=Vc(v,d.mode,M),_.return=d,d=_),a(d)):n(d,_)}return m}var Ds=t_(!0),n_=t_(!1),Al=lr(null),bl=null,ps=null,bh=null;function Rh(){bh=ps=bl=null}function Ph(t){var e=Al.current;ht(Al),t._currentValue=e}function ed(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function Es(t,e){bl=t,bh=ps=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(ln=!0),t.firstContext=null)}function Fn(t){var e=t._currentValue;if(bh!==t)if(t={context:t,memoizedValue:e,next:null},ps===null){if(bl===null)throw Error(se(308));ps=t,bl.dependencies={lanes:0,firstContext:t}}else ps=ps.next=t;return e}var wr=null;function Nh(t){wr===null?wr=[t]:wr.push(t)}function i_(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,Nh(e)):(n.next=r.next,r.next=n),e.interleaved=n,Ei(t,i)}function Ei(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var zi=!1;function Lh(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function r_(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function yi(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function Zi(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,Xe&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,Ei(t,n)}return r=i.interleaved,r===null?(e.next=e,Nh(i)):(e.next=r.next,r.next=e),i.interleaved=e,Ei(t,n)}function Qo(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,_h(t,n)}}function op(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=a:s=s.next=a,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function Rl(t,e,n,i){var r=t.updateQueue;zi=!1;var s=r.firstBaseUpdate,a=r.lastBaseUpdate,o=r.shared.pending;if(o!==null){r.shared.pending=null;var l=o,h=l.next;l.next=null,a===null?s=h:a.next=h,a=l;var u=t.alternate;u!==null&&(u=u.updateQueue,o=u.lastBaseUpdate,o!==a&&(o===null?u.firstBaseUpdate=h:o.next=h,u.lastBaseUpdate=l))}if(s!==null){var f=r.baseState;a=0,u=h=l=null,o=s;do{var p=o.lane,g=o.eventTime;if((i&p)===p){u!==null&&(u=u.next={eventTime:g,lane:0,tag:o.tag,payload:o.payload,callback:o.callback,next:null});e:{var S=t,y=o;switch(p=e,g=n,y.tag){case 1:if(S=y.payload,typeof S=="function"){f=S.call(g,f,p);break e}f=S;break e;case 3:S.flags=S.flags&-65537|128;case 0:if(S=y.payload,p=typeof S=="function"?S.call(g,f,p):S,p==null)break e;f=vt({},f,p);break e;case 2:zi=!0}}o.callback!==null&&o.lane!==0&&(t.flags|=64,p=r.effects,p===null?r.effects=[o]:p.push(o))}else g={eventTime:g,lane:p,tag:o.tag,payload:o.payload,callback:o.callback,next:null},u===null?(h=u=g,l=f):u=u.next=g,a|=p;if(o=o.next,o===null){if(o=r.shared.pending,o===null)break;p=o,o=p.next,p.next=null,r.lastBaseUpdate=p,r.shared.pending=null}}while(!0);if(u===null&&(l=f),r.baseState=l,r.firstBaseUpdate=h,r.lastBaseUpdate=u,e=r.shared.interleaved,e!==null){r=e;do a|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Dr|=a,t.lanes=a,t.memoizedState=f}}function lp(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(se(191,r));r.call(i)}}}var Qa={},ri=lr(Qa),ja=lr(Qa),Ha=lr(Qa);function Tr(t){if(t===Qa)throw Error(se(174));return t}function Dh(t,e){switch(at(Ha,e),at(ja,t),at(ri,Qa),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Iu(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=Iu(e,t)}ht(ri),at(ri,e)}function Is(){ht(ri),ht(ja),ht(Ha)}function s_(t){Tr(Ha.current);var e=Tr(ri.current),n=Iu(e,t.type);e!==n&&(at(ja,t),at(ri,n))}function Ih(t){ja.current===t&&(ht(ri),ht(ja))}var mt=lr(0);function Pl(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var kc=[];function Uh(){for(var t=0;t<kc.length;t++)kc[t]._workInProgressVersionPrimary=null;kc.length=0}var Jo=Ai.ReactCurrentDispatcher,Oc=Ai.ReactCurrentBatchConfig,Lr=0,gt=null,Rt=null,Ut=null,Nl=!1,Ca=!1,Va=0,j0=0;function Ht(){throw Error(se(321))}function Fh(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!Zn(t[n],e[n]))return!1;return!0}function kh(t,e,n,i,r,s){if(Lr=s,gt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,Jo.current=t===null||t.memoizedState===null?W0:X0,t=n(i,r),Ca){s=0;do{if(Ca=!1,Va=0,25<=s)throw Error(se(301));s+=1,Ut=Rt=null,e.updateQueue=null,Jo.current=$0,t=n(i,r)}while(Ca)}if(Jo.current=Ll,e=Rt!==null&&Rt.next!==null,Lr=0,Ut=Rt=gt=null,Nl=!1,e)throw Error(se(300));return t}function Oh(){var t=Va!==0;return Va=0,t}function Jn(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ut===null?gt.memoizedState=Ut=t:Ut=Ut.next=t,Ut}function kn(){if(Rt===null){var t=gt.alternate;t=t!==null?t.memoizedState:null}else t=Rt.next;var e=Ut===null?gt.memoizedState:Ut.next;if(e!==null)Ut=e,Rt=t;else{if(t===null)throw Error(se(310));Rt=t,t={memoizedState:Rt.memoizedState,baseState:Rt.baseState,baseQueue:Rt.baseQueue,queue:Rt.queue,next:null},Ut===null?gt.memoizedState=Ut=t:Ut=Ut.next=t}return Ut}function Ga(t,e){return typeof e=="function"?e(t):e}function zc(t){var e=kn(),n=e.queue;if(n===null)throw Error(se(311));n.lastRenderedReducer=t;var i=Rt,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var a=r.next;r.next=s.next,s.next=a}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var o=a=null,l=null,h=s;do{var u=h.lane;if((Lr&u)===u)l!==null&&(l=l.next={lane:0,action:h.action,hasEagerState:h.hasEagerState,eagerState:h.eagerState,next:null}),i=h.hasEagerState?h.eagerState:t(i,h.action);else{var f={lane:u,action:h.action,hasEagerState:h.hasEagerState,eagerState:h.eagerState,next:null};l===null?(o=l=f,a=i):l=l.next=f,gt.lanes|=u,Dr|=u}h=h.next}while(h!==null&&h!==s);l===null?a=i:l.next=o,Zn(i,e.memoizedState)||(ln=!0),e.memoizedState=i,e.baseState=a,e.baseQueue=l,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,gt.lanes|=s,Dr|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Bc(t){var e=kn(),n=e.queue;if(n===null)throw Error(se(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var a=r=r.next;do s=t(s,a.action),a=a.next;while(a!==r);Zn(s,e.memoizedState)||(ln=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function a_(){}function o_(t,e){var n=gt,i=kn(),r=e(),s=!Zn(i.memoizedState,r);if(s&&(i.memoizedState=r,ln=!0),i=i.queue,zh(u_.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||Ut!==null&&Ut.memoizedState.tag&1){if(n.flags|=2048,Wa(9,c_.bind(null,n,i,r,e),void 0,null),Ft===null)throw Error(se(349));Lr&30||l_(n,e,r)}return r}function l_(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=gt.updateQueue,e===null?(e={lastEffect:null,stores:null},gt.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function c_(t,e,n,i){e.value=n,e.getSnapshot=i,d_(e)&&h_(t)}function u_(t,e,n){return n(function(){d_(e)&&h_(t)})}function d_(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!Zn(t,n)}catch{return!0}}function h_(t){var e=Ei(t,1);e!==null&&Kn(e,t,1,-1)}function cp(t){var e=Jn();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Ga,lastRenderedState:t},e.queue=t,t=t.dispatch=G0.bind(null,gt,t),[e.memoizedState,t]}function Wa(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=gt.updateQueue,e===null?(e={lastEffect:null,stores:null},gt.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function f_(){return kn().memoizedState}function el(t,e,n,i){var r=Jn();gt.flags|=t,r.memoizedState=Wa(1|e,n,void 0,i===void 0?null:i)}function ec(t,e,n,i){var r=kn();i=i===void 0?null:i;var s=void 0;if(Rt!==null){var a=Rt.memoizedState;if(s=a.destroy,i!==null&&Fh(i,a.deps)){r.memoizedState=Wa(e,n,s,i);return}}gt.flags|=t,r.memoizedState=Wa(1|e,n,s,i)}function up(t,e){return el(8390656,8,t,e)}function zh(t,e){return ec(2048,8,t,e)}function p_(t,e){return ec(4,2,t,e)}function m_(t,e){return ec(4,4,t,e)}function g_(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function __(t,e,n){return n=n!=null?n.concat([t]):null,ec(4,4,g_.bind(null,e,t),n)}function Bh(){}function v_(t,e){var n=kn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Fh(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function x_(t,e){var n=kn();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Fh(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function y_(t,e,n){return Lr&21?(Zn(n,e)||(n=Tg(),gt.lanes|=n,Dr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,ln=!0),t.memoizedState=n)}function H0(t,e){var n=it;it=n!==0&&4>n?n:4,t(!0);var i=Oc.transition;Oc.transition={};try{t(!1),e()}finally{it=n,Oc.transition=i}}function S_(){return kn().memoizedState}function V0(t,e,n){var i=Ji(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},M_(t))E_(e,n);else if(n=i_(t,e,n,i),n!==null){var r=Zt();Kn(n,t,i,r),w_(n,e,i)}}function G0(t,e,n){var i=Ji(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(M_(t))E_(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var a=e.lastRenderedState,o=s(a,n);if(r.hasEagerState=!0,r.eagerState=o,Zn(o,a)){var l=e.interleaved;l===null?(r.next=r,Nh(e)):(r.next=l.next,l.next=r),e.interleaved=r;return}}catch{}finally{}n=i_(t,e,r,i),n!==null&&(r=Zt(),Kn(n,t,i,r),w_(n,e,i))}}function M_(t){var e=t.alternate;return t===gt||e!==null&&e===gt}function E_(t,e){Ca=Nl=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function w_(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,_h(t,n)}}var Ll={readContext:Fn,useCallback:Ht,useContext:Ht,useEffect:Ht,useImperativeHandle:Ht,useInsertionEffect:Ht,useLayoutEffect:Ht,useMemo:Ht,useReducer:Ht,useRef:Ht,useState:Ht,useDebugValue:Ht,useDeferredValue:Ht,useTransition:Ht,useMutableSource:Ht,useSyncExternalStore:Ht,useId:Ht,unstable_isNewReconciler:!1},W0={readContext:Fn,useCallback:function(t,e){return Jn().memoizedState=[t,e===void 0?null:e],t},useContext:Fn,useEffect:up,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,el(4194308,4,g_.bind(null,e,t),n)},useLayoutEffect:function(t,e){return el(4194308,4,t,e)},useInsertionEffect:function(t,e){return el(4,2,t,e)},useMemo:function(t,e){var n=Jn();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=Jn();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=V0.bind(null,gt,t),[i.memoizedState,t]},useRef:function(t){var e=Jn();return t={current:t},e.memoizedState=t},useState:cp,useDebugValue:Bh,useDeferredValue:function(t){return Jn().memoizedState=t},useTransition:function(){var t=cp(!1),e=t[0];return t=H0.bind(null,t[1]),Jn().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=gt,r=Jn();if(pt){if(n===void 0)throw Error(se(407));n=n()}else{if(n=e(),Ft===null)throw Error(se(349));Lr&30||l_(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,up(u_.bind(null,i,s,t),[t]),i.flags|=2048,Wa(9,c_.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=Jn(),e=Ft.identifierPrefix;if(pt){var n=_i,i=gi;n=(i&~(1<<32-Yn(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=Va++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=j0++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},X0={readContext:Fn,useCallback:v_,useContext:Fn,useEffect:zh,useImperativeHandle:__,useInsertionEffect:p_,useLayoutEffect:m_,useMemo:x_,useReducer:zc,useRef:f_,useState:function(){return zc(Ga)},useDebugValue:Bh,useDeferredValue:function(t){var e=kn();return y_(e,Rt.memoizedState,t)},useTransition:function(){var t=zc(Ga)[0],e=kn().memoizedState;return[t,e]},useMutableSource:a_,useSyncExternalStore:o_,useId:S_,unstable_isNewReconciler:!1},$0={readContext:Fn,useCallback:v_,useContext:Fn,useEffect:zh,useImperativeHandle:__,useInsertionEffect:p_,useLayoutEffect:m_,useMemo:x_,useReducer:Bc,useRef:f_,useState:function(){return Bc(Ga)},useDebugValue:Bh,useDeferredValue:function(t){var e=kn();return Rt===null?e.memoizedState=t:y_(e,Rt.memoizedState,t)},useTransition:function(){var t=Bc(Ga)[0],e=kn().memoizedState;return[t,e]},useMutableSource:a_,useSyncExternalStore:o_,useId:S_,unstable_isNewReconciler:!1};function Vn(t,e){if(t&&t.defaultProps){e=vt({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function td(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:vt({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var tc={isMounted:function(t){return(t=t._reactInternals)?zr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=Zt(),r=Ji(t),s=yi(i,r);s.payload=e,n!=null&&(s.callback=n),e=Zi(t,s,r),e!==null&&(Kn(e,t,r,i),Qo(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=Zt(),r=Ji(t),s=yi(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=Zi(t,s,r),e!==null&&(Kn(e,t,r,i),Qo(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=Zt(),i=Ji(t),r=yi(n,i);r.tag=2,e!=null&&(r.callback=e),e=Zi(t,r,i),e!==null&&(Kn(e,t,i,n),Qo(e,t,i))}};function dp(t,e,n,i,r,s,a){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,a):e.prototype&&e.prototype.isPureReactComponent?!ka(n,i)||!ka(r,s):!0}function T_(t,e,n){var i=!1,r=rr,s=e.contextType;return typeof s=="object"&&s!==null?s=Fn(s):(r=un(e)?Pr:qt.current,i=e.contextTypes,s=(i=i!=null)?Ns(t,r):rr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=tc,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function hp(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&tc.enqueueReplaceState(e,e.state,null)}function nd(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},Lh(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=Fn(s):(s=un(e)?Pr:qt.current,r.context=Ns(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(td(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&tc.enqueueReplaceState(r,r.state,null),Rl(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function Us(t,e){try{var n="",i=e;do n+=Sx(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function jc(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function id(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var q0=typeof WeakMap=="function"?WeakMap:Map;function C_(t,e,n){n=yi(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){Il||(Il=!0,fd=i),id(t,e)},n}function A_(t,e,n){n=yi(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){id(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){id(t,e),typeof i!="function"&&(Qi===null?Qi=new Set([this]):Qi.add(this));var a=e.stack;this.componentDidCatch(e.value,{componentStack:a!==null?a:""})}),n}function fp(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new q0;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=ly.bind(null,t,e,n),e.then(t,t))}function pp(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function mp(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=yi(-1,1),e.tag=2,Zi(n,e,1))),n.lanes|=1),t)}var Y0=Ai.ReactCurrentOwner,ln=!1;function Kt(t,e,n,i){e.child=t===null?n_(e,null,n,i):Ds(e,t.child,n,i)}function gp(t,e,n,i,r){n=n.render;var s=e.ref;return Es(e,r),i=kh(t,e,n,i,s,r),n=Oh(),t!==null&&!ln?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,wi(t,e,r)):(pt&&n&&Th(e),e.flags|=1,Kt(t,e,i,r),e.child)}function _p(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!qh(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,b_(t,e,s,i,r)):(t=rl(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var a=s.memoizedProps;if(n=n.compare,n=n!==null?n:ka,n(a,i)&&t.ref===e.ref)return wi(t,e,r)}return e.flags|=1,t=er(s,i),t.ref=e.ref,t.return=e,e.child=t}function b_(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(ka(s,i)&&t.ref===e.ref)if(ln=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(ln=!0);else return e.lanes=t.lanes,wi(t,e,r)}return rd(t,e,n,i,r)}function R_(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},at(gs,xn),xn|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,at(gs,xn),xn|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,at(gs,xn),xn|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,at(gs,xn),xn|=i;return Kt(t,e,r,n),e.child}function P_(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function rd(t,e,n,i,r){var s=un(n)?Pr:qt.current;return s=Ns(e,s),Es(e,r),n=kh(t,e,n,i,s,r),i=Oh(),t!==null&&!ln?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,wi(t,e,r)):(pt&&i&&Th(e),e.flags|=1,Kt(t,e,n,r),e.child)}function vp(t,e,n,i,r){if(un(n)){var s=!0;wl(e)}else s=!1;if(Es(e,r),e.stateNode===null)tl(t,e),T_(e,n,i),nd(e,n,i,r),i=!0;else if(t===null){var a=e.stateNode,o=e.memoizedProps;a.props=o;var l=a.context,h=n.contextType;typeof h=="object"&&h!==null?h=Fn(h):(h=un(n)?Pr:qt.current,h=Ns(e,h));var u=n.getDerivedStateFromProps,f=typeof u=="function"||typeof a.getSnapshotBeforeUpdate=="function";f||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==i||l!==h)&&hp(e,a,i,h),zi=!1;var p=e.memoizedState;a.state=p,Rl(e,i,a,r),l=e.memoizedState,o!==i||p!==l||cn.current||zi?(typeof u=="function"&&(td(e,n,u,i),l=e.memoizedState),(o=zi||dp(e,n,o,i,p,l,h))?(f||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(e.flags|=4194308)):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=l),a.props=i,a.state=l,a.context=h,i=o):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{a=e.stateNode,r_(t,e),o=e.memoizedProps,h=e.type===e.elementType?o:Vn(e.type,o),a.props=h,f=e.pendingProps,p=a.context,l=n.contextType,typeof l=="object"&&l!==null?l=Fn(l):(l=un(n)?Pr:qt.current,l=Ns(e,l));var g=n.getDerivedStateFromProps;(u=typeof g=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==f||p!==l)&&hp(e,a,i,l),zi=!1,p=e.memoizedState,a.state=p,Rl(e,i,a,r);var S=e.memoizedState;o!==f||p!==S||cn.current||zi?(typeof g=="function"&&(td(e,n,g,i),S=e.memoizedState),(h=zi||dp(e,n,h,i,p,S,l)||!1)?(u||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(i,S,l),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(i,S,l)),typeof a.componentDidUpdate=="function"&&(e.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&p===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&p===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=S),a.props=i,a.state=S,a.context=l,i=h):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&p===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&p===t.memoizedState||(e.flags|=1024),i=!1)}return sd(t,e,n,i,s,r)}function sd(t,e,n,i,r,s){P_(t,e);var a=(e.flags&128)!==0;if(!i&&!a)return r&&ip(e,n,!1),wi(t,e,s);i=e.stateNode,Y0.current=e;var o=a&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&a?(e.child=Ds(e,t.child,null,s),e.child=Ds(e,null,o,s)):Kt(t,e,o,s),e.memoizedState=i.state,r&&ip(e,n,!0),e.child}function N_(t){var e=t.stateNode;e.pendingContext?np(t,e.pendingContext,e.pendingContext!==e.context):e.context&&np(t,e.context,!1),Dh(t,e.containerInfo)}function xp(t,e,n,i,r){return Ls(),Ah(r),e.flags|=256,Kt(t,e,n,i),e.child}var ad={dehydrated:null,treeContext:null,retryLane:0};function od(t){return{baseLanes:t,cachePool:null,transitions:null}}function L_(t,e,n){var i=e.pendingProps,r=mt.current,s=!1,a=(e.flags&128)!==0,o;if((o=a)||(o=t!==null&&t.memoizedState===null?!1:(r&2)!==0),o?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),at(mt,r&1),t===null)return Ju(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(a=i.children,t=i.fallback,s?(i=e.mode,s=e.child,a={mode:"hidden",children:a},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=a):s=rc(a,i,0,null),t=Rr(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=od(n),e.memoizedState=ad,t):jh(e,a));if(r=t.memoizedState,r!==null&&(o=r.dehydrated,o!==null))return K0(t,e,a,i,o,r,n);if(s){s=i.fallback,a=e.mode,r=t.child,o=r.sibling;var l={mode:"hidden",children:i.children};return!(a&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=l,e.deletions=null):(i=er(r,l),i.subtreeFlags=r.subtreeFlags&14680064),o!==null?s=er(o,s):(s=Rr(s,a,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,a=t.child.memoizedState,a=a===null?od(n):{baseLanes:a.baseLanes|n,cachePool:null,transitions:a.transitions},s.memoizedState=a,s.childLanes=t.childLanes&~n,e.memoizedState=ad,i}return s=t.child,t=s.sibling,i=er(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function jh(t,e){return e=rc({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function vo(t,e,n,i){return i!==null&&Ah(i),Ds(e,t.child,null,n),t=jh(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function K0(t,e,n,i,r,s,a){if(n)return e.flags&256?(e.flags&=-257,i=jc(Error(se(422))),vo(t,e,a,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=rc({mode:"visible",children:i.children},r,0,null),s=Rr(s,r,a,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&Ds(e,t.child,null,a),e.child.memoizedState=od(a),e.memoizedState=ad,s);if(!(e.mode&1))return vo(t,e,a,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var o=i.dgst;return i=o,s=Error(se(419)),i=jc(s,i,void 0),vo(t,e,a,i)}if(o=(a&t.childLanes)!==0,ln||o){if(i=Ft,i!==null){switch(a&-a){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|a)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,Ei(t,r),Kn(i,t,r,-1))}return $h(),i=jc(Error(se(421))),vo(t,e,a,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=cy.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,Sn=Ki(r.nextSibling),En=e,pt=!0,Wn=null,t!==null&&(Pn[Nn++]=gi,Pn[Nn++]=_i,Pn[Nn++]=Nr,gi=t.id,_i=t.overflow,Nr=e),e=jh(e,i.children),e.flags|=4096,e)}function yp(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),ed(t.return,e,n)}function Hc(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function D_(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(Kt(t,e,i.children,n),i=mt.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&yp(t,n,e);else if(t.tag===19)yp(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(at(mt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&Pl(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),Hc(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&Pl(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}Hc(e,!0,n,null,s);break;case"together":Hc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function tl(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function wi(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Dr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(se(153));if(e.child!==null){for(t=e.child,n=er(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=er(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function Z0(t,e,n){switch(e.tag){case 3:N_(e),Ls();break;case 5:s_(e);break;case 1:un(e.type)&&wl(e);break;case 4:Dh(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;at(Al,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(at(mt,mt.current&1),e.flags|=128,null):n&e.child.childLanes?L_(t,e,n):(at(mt,mt.current&1),t=wi(t,e,n),t!==null?t.sibling:null);at(mt,mt.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return D_(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),at(mt,mt.current),i)break;return null;case 22:case 23:return e.lanes=0,R_(t,e,n)}return wi(t,e,n)}var I_,ld,U_,F_;I_=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};ld=function(){};U_=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,Tr(ri.current);var s=null;switch(n){case"input":r=Pu(t,r),i=Pu(t,i),s=[];break;case"select":r=vt({},r,{value:void 0}),i=vt({},i,{value:void 0}),s=[];break;case"textarea":r=Du(t,r),i=Du(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=Ml)}Uu(n,i);var a;n=null;for(h in r)if(!i.hasOwnProperty(h)&&r.hasOwnProperty(h)&&r[h]!=null)if(h==="style"){var o=r[h];for(a in o)o.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else h!=="dangerouslySetInnerHTML"&&h!=="children"&&h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&h!=="autoFocus"&&(Pa.hasOwnProperty(h)?s||(s=[]):(s=s||[]).push(h,null));for(h in i){var l=i[h];if(o=r!=null?r[h]:void 0,i.hasOwnProperty(h)&&l!==o&&(l!=null||o!=null))if(h==="style")if(o){for(a in o)!o.hasOwnProperty(a)||l&&l.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in l)l.hasOwnProperty(a)&&o[a]!==l[a]&&(n||(n={}),n[a]=l[a])}else n||(s||(s=[]),s.push(h,n)),n=l;else h==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,o=o?o.__html:void 0,l!=null&&o!==l&&(s=s||[]).push(h,l)):h==="children"?typeof l!="string"&&typeof l!="number"||(s=s||[]).push(h,""+l):h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&(Pa.hasOwnProperty(h)?(l!=null&&h==="onScroll"&&ut("scroll",t),s||o===l||(s=[])):(s=s||[]).push(h,l))}n&&(s=s||[]).push("style",n);var h=s;(e.updateQueue=h)&&(e.flags|=4)}};F_=function(t,e,n,i){n!==i&&(e.flags|=4)};function ta(t,e){if(!pt)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function Vt(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function Q0(t,e,n){var i=e.pendingProps;switch(Ch(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Vt(e),null;case 1:return un(e.type)&&El(),Vt(e),null;case 3:return i=e.stateNode,Is(),ht(cn),ht(qt),Uh(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(go(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Wn!==null&&(gd(Wn),Wn=null))),ld(t,e),Vt(e),null;case 5:Ih(e);var r=Tr(Ha.current);if(n=e.type,t!==null&&e.stateNode!=null)U_(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(se(166));return Vt(e),null}if(t=Tr(ri.current),go(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[ni]=e,i[Ba]=s,t=(e.mode&1)!==0,n){case"dialog":ut("cancel",i),ut("close",i);break;case"iframe":case"object":case"embed":ut("load",i);break;case"video":case"audio":for(r=0;r<_a.length;r++)ut(_a[r],i);break;case"source":ut("error",i);break;case"img":case"image":case"link":ut("error",i),ut("load",i);break;case"details":ut("toggle",i);break;case"input":Rf(i,s),ut("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},ut("invalid",i);break;case"textarea":Nf(i,s),ut("invalid",i)}Uu(n,s),r=null;for(var a in s)if(s.hasOwnProperty(a)){var o=s[a];a==="children"?typeof o=="string"?i.textContent!==o&&(s.suppressHydrationWarning!==!0&&mo(i.textContent,o,t),r=["children",o]):typeof o=="number"&&i.textContent!==""+o&&(s.suppressHydrationWarning!==!0&&mo(i.textContent,o,t),r=["children",""+o]):Pa.hasOwnProperty(a)&&o!=null&&a==="onScroll"&&ut("scroll",i)}switch(n){case"input":ao(i),Pf(i,s,!0);break;case"textarea":ao(i),Lf(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=Ml)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{a=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=ug(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=a.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=a.createElement(n,{is:i.is}):(t=a.createElement(n),n==="select"&&(a=t,i.multiple?a.multiple=!0:i.size&&(a.size=i.size))):t=a.createElementNS(t,n),t[ni]=e,t[Ba]=i,I_(t,e,!1,!1),e.stateNode=t;e:{switch(a=Fu(n,i),n){case"dialog":ut("cancel",t),ut("close",t),r=i;break;case"iframe":case"object":case"embed":ut("load",t),r=i;break;case"video":case"audio":for(r=0;r<_a.length;r++)ut(_a[r],t);r=i;break;case"source":ut("error",t),r=i;break;case"img":case"image":case"link":ut("error",t),ut("load",t),r=i;break;case"details":ut("toggle",t),r=i;break;case"input":Rf(t,i),r=Pu(t,i),ut("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=vt({},i,{value:void 0}),ut("invalid",t);break;case"textarea":Nf(t,i),r=Du(t,i),ut("invalid",t);break;default:r=i}Uu(n,r),o=r;for(s in o)if(o.hasOwnProperty(s)){var l=o[s];s==="style"?fg(t,l):s==="dangerouslySetInnerHTML"?(l=l?l.__html:void 0,l!=null&&dg(t,l)):s==="children"?typeof l=="string"?(n!=="textarea"||l!=="")&&Na(t,l):typeof l=="number"&&Na(t,""+l):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Pa.hasOwnProperty(s)?l!=null&&s==="onScroll"&&ut("scroll",t):l!=null&&dh(t,s,l,a))}switch(n){case"input":ao(t),Pf(t,i,!1);break;case"textarea":ao(t),Lf(t);break;case"option":i.value!=null&&t.setAttribute("value",""+ir(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?xs(t,!!i.multiple,s,!1):i.defaultValue!=null&&xs(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=Ml)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Vt(e),null;case 6:if(t&&e.stateNode!=null)F_(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(se(166));if(n=Tr(Ha.current),Tr(ri.current),go(e)){if(i=e.stateNode,n=e.memoizedProps,i[ni]=e,(s=i.nodeValue!==n)&&(t=En,t!==null))switch(t.tag){case 3:mo(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&mo(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[ni]=e,e.stateNode=i}return Vt(e),null;case 13:if(ht(mt),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(pt&&Sn!==null&&e.mode&1&&!(e.flags&128))e_(),Ls(),e.flags|=98560,s=!1;else if(s=go(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(se(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(se(317));s[ni]=e}else Ls(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Vt(e),s=!1}else Wn!==null&&(gd(Wn),Wn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||mt.current&1?Pt===0&&(Pt=3):$h())),e.updateQueue!==null&&(e.flags|=4),Vt(e),null);case 4:return Is(),ld(t,e),t===null&&Oa(e.stateNode.containerInfo),Vt(e),null;case 10:return Ph(e.type._context),Vt(e),null;case 17:return un(e.type)&&El(),Vt(e),null;case 19:if(ht(mt),s=e.memoizedState,s===null)return Vt(e),null;if(i=(e.flags&128)!==0,a=s.rendering,a===null)if(i)ta(s,!1);else{if(Pt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(a=Pl(t),a!==null){for(e.flags|=128,ta(s,!1),i=a.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,a=s.alternate,a===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=a.childLanes,s.lanes=a.lanes,s.child=a.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=a.memoizedProps,s.memoizedState=a.memoizedState,s.updateQueue=a.updateQueue,s.type=a.type,t=a.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return at(mt,mt.current&1|2),e.child}t=t.sibling}s.tail!==null&&Et()>Fs&&(e.flags|=128,i=!0,ta(s,!1),e.lanes=4194304)}else{if(!i)if(t=Pl(a),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),ta(s,!0),s.tail===null&&s.tailMode==="hidden"&&!a.alternate&&!pt)return Vt(e),null}else 2*Et()-s.renderingStartTime>Fs&&n!==1073741824&&(e.flags|=128,i=!0,ta(s,!1),e.lanes=4194304);s.isBackwards?(a.sibling=e.child,e.child=a):(n=s.last,n!==null?n.sibling=a:e.child=a,s.last=a)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Et(),e.sibling=null,n=mt.current,at(mt,i?n&1|2:n&1),e):(Vt(e),null);case 22:case 23:return Xh(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?xn&1073741824&&(Vt(e),e.subtreeFlags&6&&(e.flags|=8192)):Vt(e),null;case 24:return null;case 25:return null}throw Error(se(156,e.tag))}function J0(t,e){switch(Ch(e),e.tag){case 1:return un(e.type)&&El(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Is(),ht(cn),ht(qt),Uh(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Ih(e),null;case 13:if(ht(mt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(se(340));Ls()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return ht(mt),null;case 4:return Is(),null;case 10:return Ph(e.type._context),null;case 22:case 23:return Xh(),null;case 24:return null;default:return null}}var xo=!1,Xt=!1,ey=typeof WeakSet=="function"?WeakSet:Set,_e=null;function ms(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){yt(t,e,i)}else n.current=null}function cd(t,e,n){try{n()}catch(i){yt(t,e,i)}}var Sp=!1;function ty(t,e){if(Xu=xl,t=jg(),wh(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var a=0,o=-1,l=-1,h=0,u=0,f=t,p=null;t:for(;;){for(var g;f!==n||r!==0&&f.nodeType!==3||(o=a+r),f!==s||i!==0&&f.nodeType!==3||(l=a+i),f.nodeType===3&&(a+=f.nodeValue.length),(g=f.firstChild)!==null;)p=f,f=g;for(;;){if(f===t)break t;if(p===n&&++h===r&&(o=a),p===s&&++u===i&&(l=a),(g=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=g}n=o===-1||l===-1?null:{start:o,end:l}}else n=null}n=n||{start:0,end:0}}else n=null;for($u={focusedElem:t,selectionRange:n},xl=!1,_e=e;_e!==null;)if(e=_e,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,_e=t;else for(;_e!==null;){e=_e;try{var S=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(S!==null){var y=S.memoizedProps,m=S.memoizedState,d=e.stateNode,_=d.getSnapshotBeforeUpdate(e.elementType===e.type?y:Vn(e.type,y),m);d.__reactInternalSnapshotBeforeUpdate=_}break;case 3:var v=e.stateNode.containerInfo;v.nodeType===1?v.textContent="":v.nodeType===9&&v.documentElement&&v.removeChild(v.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(se(163))}}catch(M){yt(e,e.return,M)}if(t=e.sibling,t!==null){t.return=e.return,_e=t;break}_e=e.return}return S=Sp,Sp=!1,S}function Aa(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&cd(e,n,s)}r=r.next}while(r!==i)}}function nc(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function ud(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function k_(t){var e=t.alternate;e!==null&&(t.alternate=null,k_(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[ni],delete e[Ba],delete e[Ku],delete e[k0],delete e[O0])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function O_(t){return t.tag===5||t.tag===3||t.tag===4}function Mp(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||O_(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function dd(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=Ml));else if(i!==4&&(t=t.child,t!==null))for(dd(t,e,n),t=t.sibling;t!==null;)dd(t,e,n),t=t.sibling}function hd(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(hd(t,e,n),t=t.sibling;t!==null;)hd(t,e,n),t=t.sibling}var zt=null,Gn=!1;function Pi(t,e,n){for(n=n.child;n!==null;)z_(t,e,n),n=n.sibling}function z_(t,e,n){if(ii&&typeof ii.onCommitFiberUnmount=="function")try{ii.onCommitFiberUnmount(ql,n)}catch{}switch(n.tag){case 5:Xt||ms(n,e);case 6:var i=zt,r=Gn;zt=null,Pi(t,e,n),zt=i,Gn=r,zt!==null&&(Gn?(t=zt,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):zt.removeChild(n.stateNode));break;case 18:zt!==null&&(Gn?(t=zt,n=n.stateNode,t.nodeType===8?Uc(t.parentNode,n):t.nodeType===1&&Uc(t,n),Ua(t)):Uc(zt,n.stateNode));break;case 4:i=zt,r=Gn,zt=n.stateNode.containerInfo,Gn=!0,Pi(t,e,n),zt=i,Gn=r;break;case 0:case 11:case 14:case 15:if(!Xt&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,a=s.destroy;s=s.tag,a!==void 0&&(s&2||s&4)&&cd(n,e,a),r=r.next}while(r!==i)}Pi(t,e,n);break;case 1:if(!Xt&&(ms(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(o){yt(n,e,o)}Pi(t,e,n);break;case 21:Pi(t,e,n);break;case 22:n.mode&1?(Xt=(i=Xt)||n.memoizedState!==null,Pi(t,e,n),Xt=i):Pi(t,e,n);break;default:Pi(t,e,n)}}function Ep(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new ey),e.forEach(function(i){var r=uy.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function zn(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,a=e,o=a;e:for(;o!==null;){switch(o.tag){case 5:zt=o.stateNode,Gn=!1;break e;case 3:zt=o.stateNode.containerInfo,Gn=!0;break e;case 4:zt=o.stateNode.containerInfo,Gn=!0;break e}o=o.return}if(zt===null)throw Error(se(160));z_(s,a,r),zt=null,Gn=!1;var l=r.alternate;l!==null&&(l.return=null),r.return=null}catch(h){yt(r,e,h)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)B_(e,t),e=e.sibling}function B_(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(zn(e,t),Qn(t),i&4){try{Aa(3,t,t.return),nc(3,t)}catch(y){yt(t,t.return,y)}try{Aa(5,t,t.return)}catch(y){yt(t,t.return,y)}}break;case 1:zn(e,t),Qn(t),i&512&&n!==null&&ms(n,n.return);break;case 5:if(zn(e,t),Qn(t),i&512&&n!==null&&ms(n,n.return),t.flags&32){var r=t.stateNode;try{Na(r,"")}catch(y){yt(t,t.return,y)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,a=n!==null?n.memoizedProps:s,o=t.type,l=t.updateQueue;if(t.updateQueue=null,l!==null)try{o==="input"&&s.type==="radio"&&s.name!=null&&lg(r,s),Fu(o,a);var h=Fu(o,s);for(a=0;a<l.length;a+=2){var u=l[a],f=l[a+1];u==="style"?fg(r,f):u==="dangerouslySetInnerHTML"?dg(r,f):u==="children"?Na(r,f):dh(r,u,f,h)}switch(o){case"input":Nu(r,s);break;case"textarea":cg(r,s);break;case"select":var p=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var g=s.value;g!=null?xs(r,!!s.multiple,g,!1):p!==!!s.multiple&&(s.defaultValue!=null?xs(r,!!s.multiple,s.defaultValue,!0):xs(r,!!s.multiple,s.multiple?[]:"",!1))}r[Ba]=s}catch(y){yt(t,t.return,y)}}break;case 6:if(zn(e,t),Qn(t),i&4){if(t.stateNode===null)throw Error(se(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(y){yt(t,t.return,y)}}break;case 3:if(zn(e,t),Qn(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{Ua(e.containerInfo)}catch(y){yt(t,t.return,y)}break;case 4:zn(e,t),Qn(t);break;case 13:zn(e,t),Qn(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(Gh=Et())),i&4&&Ep(t);break;case 22:if(u=n!==null&&n.memoizedState!==null,t.mode&1?(Xt=(h=Xt)||u,zn(e,t),Xt=h):zn(e,t),Qn(t),i&8192){if(h=t.memoizedState!==null,(t.stateNode.isHidden=h)&&!u&&t.mode&1)for(_e=t,u=t.child;u!==null;){for(f=_e=u;_e!==null;){switch(p=_e,g=p.child,p.tag){case 0:case 11:case 14:case 15:Aa(4,p,p.return);break;case 1:ms(p,p.return);var S=p.stateNode;if(typeof S.componentWillUnmount=="function"){i=p,n=p.return;try{e=i,S.props=e.memoizedProps,S.state=e.memoizedState,S.componentWillUnmount()}catch(y){yt(i,n,y)}}break;case 5:ms(p,p.return);break;case 22:if(p.memoizedState!==null){Tp(f);continue}}g!==null?(g.return=p,_e=g):Tp(f)}u=u.sibling}e:for(u=null,f=t;;){if(f.tag===5){if(u===null){u=f;try{r=f.stateNode,h?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(o=f.stateNode,l=f.memoizedProps.style,a=l!=null&&l.hasOwnProperty("display")?l.display:null,o.style.display=hg("display",a))}catch(y){yt(t,t.return,y)}}}else if(f.tag===6){if(u===null)try{f.stateNode.nodeValue=h?"":f.memoizedProps}catch(y){yt(t,t.return,y)}}else if((f.tag!==22&&f.tag!==23||f.memoizedState===null||f===t)&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===t)break e;for(;f.sibling===null;){if(f.return===null||f.return===t)break e;u===f&&(u=null),f=f.return}u===f&&(u=null),f.sibling.return=f.return,f=f.sibling}}break;case 19:zn(e,t),Qn(t),i&4&&Ep(t);break;case 21:break;default:zn(e,t),Qn(t)}}function Qn(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(O_(n)){var i=n;break e}n=n.return}throw Error(se(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(Na(r,""),i.flags&=-33);var s=Mp(t);hd(t,s,r);break;case 3:case 4:var a=i.stateNode.containerInfo,o=Mp(t);dd(t,o,a);break;default:throw Error(se(161))}}catch(l){yt(t,t.return,l)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function ny(t,e,n){_e=t,j_(t)}function j_(t,e,n){for(var i=(t.mode&1)!==0;_e!==null;){var r=_e,s=r.child;if(r.tag===22&&i){var a=r.memoizedState!==null||xo;if(!a){var o=r.alternate,l=o!==null&&o.memoizedState!==null||Xt;o=xo;var h=Xt;if(xo=a,(Xt=l)&&!h)for(_e=r;_e!==null;)a=_e,l=a.child,a.tag===22&&a.memoizedState!==null?Cp(r):l!==null?(l.return=a,_e=l):Cp(r);for(;s!==null;)_e=s,j_(s),s=s.sibling;_e=r,xo=o,Xt=h}wp(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,_e=s):wp(t)}}function wp(t){for(;_e!==null;){var e=_e;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:Xt||nc(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!Xt)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:Vn(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&lp(e,s,i);break;case 3:var a=e.updateQueue;if(a!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}lp(e,a,n)}break;case 5:var o=e.stateNode;if(n===null&&e.flags&4){n=o;var l=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":l.autoFocus&&n.focus();break;case"img":l.src&&(n.src=l.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var h=e.alternate;if(h!==null){var u=h.memoizedState;if(u!==null){var f=u.dehydrated;f!==null&&Ua(f)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(se(163))}Xt||e.flags&512&&ud(e)}catch(p){yt(e,e.return,p)}}if(e===t){_e=null;break}if(n=e.sibling,n!==null){n.return=e.return,_e=n;break}_e=e.return}}function Tp(t){for(;_e!==null;){var e=_e;if(e===t){_e=null;break}var n=e.sibling;if(n!==null){n.return=e.return,_e=n;break}_e=e.return}}function Cp(t){for(;_e!==null;){var e=_e;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{nc(4,e)}catch(l){yt(e,n,l)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(l){yt(e,r,l)}}var s=e.return;try{ud(e)}catch(l){yt(e,s,l)}break;case 5:var a=e.return;try{ud(e)}catch(l){yt(e,a,l)}}}catch(l){yt(e,e.return,l)}if(e===t){_e=null;break}var o=e.sibling;if(o!==null){o.return=e.return,_e=o;break}_e=e.return}}var iy=Math.ceil,Dl=Ai.ReactCurrentDispatcher,Hh=Ai.ReactCurrentOwner,Un=Ai.ReactCurrentBatchConfig,Xe=0,Ft=null,Ct=null,Bt=0,xn=0,gs=lr(0),Pt=0,Xa=null,Dr=0,ic=0,Vh=0,ba=null,an=null,Gh=0,Fs=1/0,pi=null,Il=!1,fd=null,Qi=null,yo=!1,Wi=null,Ul=0,Ra=0,pd=null,nl=-1,il=0;function Zt(){return Xe&6?Et():nl!==-1?nl:nl=Et()}function Ji(t){return t.mode&1?Xe&2&&Bt!==0?Bt&-Bt:B0.transition!==null?(il===0&&(il=Tg()),il):(t=it,t!==0||(t=window.event,t=t===void 0?16:Lg(t.type)),t):1}function Kn(t,e,n,i){if(50<Ra)throw Ra=0,pd=null,Error(se(185));Ya(t,n,i),(!(Xe&2)||t!==Ft)&&(t===Ft&&(!(Xe&2)&&(ic|=n),Pt===4&&Hi(t,Bt)),dn(t,i),n===1&&Xe===0&&!(e.mode&1)&&(Fs=Et()+500,Jl&&cr()))}function dn(t,e){var n=t.callbackNode;Bx(t,e);var i=vl(t,t===Ft?Bt:0);if(i===0)n!==null&&Uf(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&Uf(n),e===1)t.tag===0?z0(Ap.bind(null,t)):Zg(Ap.bind(null,t)),U0(function(){!(Xe&6)&&cr()}),n=null;else{switch(Cg(i)){case 1:n=gh;break;case 4:n=Eg;break;case 16:n=_l;break;case 536870912:n=wg;break;default:n=_l}n=Y_(n,H_.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function H_(t,e){if(nl=-1,il=0,Xe&6)throw Error(se(327));var n=t.callbackNode;if(ws()&&t.callbackNode!==n)return null;var i=vl(t,t===Ft?Bt:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=Fl(t,i);else{e=i;var r=Xe;Xe|=2;var s=G_();(Ft!==t||Bt!==e)&&(pi=null,Fs=Et()+500,br(t,e));do try{ay();break}catch(o){V_(t,o)}while(!0);Rh(),Dl.current=s,Xe=r,Ct!==null?e=0:(Ft=null,Bt=0,e=Pt)}if(e!==0){if(e===2&&(r=ju(t),r!==0&&(i=r,e=md(t,r))),e===1)throw n=Xa,br(t,0),Hi(t,i),dn(t,Et()),n;if(e===6)Hi(t,i);else{if(r=t.current.alternate,!(i&30)&&!ry(r)&&(e=Fl(t,i),e===2&&(s=ju(t),s!==0&&(i=s,e=md(t,s))),e===1))throw n=Xa,br(t,0),Hi(t,i),dn(t,Et()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(se(345));case 2:xr(t,an,pi);break;case 3:if(Hi(t,i),(i&130023424)===i&&(e=Gh+500-Et(),10<e)){if(vl(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){Zt(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=Yu(xr.bind(null,t,an,pi),e);break}xr(t,an,pi);break;case 4:if(Hi(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var a=31-Yn(i);s=1<<a,a=e[a],a>r&&(r=a),i&=~s}if(i=r,i=Et()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*iy(i/1960))-i,10<i){t.timeoutHandle=Yu(xr.bind(null,t,an,pi),i);break}xr(t,an,pi);break;case 5:xr(t,an,pi);break;default:throw Error(se(329))}}}return dn(t,Et()),t.callbackNode===n?H_.bind(null,t):null}function md(t,e){var n=ba;return t.current.memoizedState.isDehydrated&&(br(t,e).flags|=256),t=Fl(t,e),t!==2&&(e=an,an=n,e!==null&&gd(e)),t}function gd(t){an===null?an=t:an.push.apply(an,t)}function ry(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!Zn(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Hi(t,e){for(e&=~Vh,e&=~ic,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-Yn(e),i=1<<n;t[n]=-1,e&=~i}}function Ap(t){if(Xe&6)throw Error(se(327));ws();var e=vl(t,0);if(!(e&1))return dn(t,Et()),null;var n=Fl(t,e);if(t.tag!==0&&n===2){var i=ju(t);i!==0&&(e=i,n=md(t,i))}if(n===1)throw n=Xa,br(t,0),Hi(t,e),dn(t,Et()),n;if(n===6)throw Error(se(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,xr(t,an,pi),dn(t,Et()),null}function Wh(t,e){var n=Xe;Xe|=1;try{return t(e)}finally{Xe=n,Xe===0&&(Fs=Et()+500,Jl&&cr())}}function Ir(t){Wi!==null&&Wi.tag===0&&!(Xe&6)&&ws();var e=Xe;Xe|=1;var n=Un.transition,i=it;try{if(Un.transition=null,it=1,t)return t()}finally{it=i,Un.transition=n,Xe=e,!(Xe&6)&&cr()}}function Xh(){xn=gs.current,ht(gs)}function br(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,I0(n)),Ct!==null)for(n=Ct.return;n!==null;){var i=n;switch(Ch(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&El();break;case 3:Is(),ht(cn),ht(qt),Uh();break;case 5:Ih(i);break;case 4:Is();break;case 13:ht(mt);break;case 19:ht(mt);break;case 10:Ph(i.type._context);break;case 22:case 23:Xh()}n=n.return}if(Ft=t,Ct=t=er(t.current,null),Bt=xn=e,Pt=0,Xa=null,Vh=ic=Dr=0,an=ba=null,wr!==null){for(e=0;e<wr.length;e++)if(n=wr[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var a=s.next;s.next=r,i.next=a}n.pending=i}wr=null}return t}function V_(t,e){do{var n=Ct;try{if(Rh(),Jo.current=Ll,Nl){for(var i=gt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Nl=!1}if(Lr=0,Ut=Rt=gt=null,Ca=!1,Va=0,Hh.current=null,n===null||n.return===null){Pt=1,Xa=e,Ct=null;break}e:{var s=t,a=n.return,o=n,l=e;if(e=Bt,o.flags|=32768,l!==null&&typeof l=="object"&&typeof l.then=="function"){var h=l,u=o,f=u.tag;if(!(u.mode&1)&&(f===0||f===11||f===15)){var p=u.alternate;p?(u.updateQueue=p.updateQueue,u.memoizedState=p.memoizedState,u.lanes=p.lanes):(u.updateQueue=null,u.memoizedState=null)}var g=pp(a);if(g!==null){g.flags&=-257,mp(g,a,o,s,e),g.mode&1&&fp(s,h,e),e=g,l=h;var S=e.updateQueue;if(S===null){var y=new Set;y.add(l),e.updateQueue=y}else S.add(l);break e}else{if(!(e&1)){fp(s,h,e),$h();break e}l=Error(se(426))}}else if(pt&&o.mode&1){var m=pp(a);if(m!==null){!(m.flags&65536)&&(m.flags|=256),mp(m,a,o,s,e),Ah(Us(l,o));break e}}s=l=Us(l,o),Pt!==4&&(Pt=2),ba===null?ba=[s]:ba.push(s),s=a;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var d=C_(s,l,e);op(s,d);break e;case 1:o=l;var _=s.type,v=s.stateNode;if(!(s.flags&128)&&(typeof _.getDerivedStateFromError=="function"||v!==null&&typeof v.componentDidCatch=="function"&&(Qi===null||!Qi.has(v)))){s.flags|=65536,e&=-e,s.lanes|=e;var M=A_(s,o,e);op(s,M);break e}}s=s.return}while(s!==null)}X_(n)}catch(R){e=R,Ct===n&&n!==null&&(Ct=n=n.return);continue}break}while(!0)}function G_(){var t=Dl.current;return Dl.current=Ll,t===null?Ll:t}function $h(){(Pt===0||Pt===3||Pt===2)&&(Pt=4),Ft===null||!(Dr&268435455)&&!(ic&268435455)||Hi(Ft,Bt)}function Fl(t,e){var n=Xe;Xe|=2;var i=G_();(Ft!==t||Bt!==e)&&(pi=null,br(t,e));do try{sy();break}catch(r){V_(t,r)}while(!0);if(Rh(),Xe=n,Dl.current=i,Ct!==null)throw Error(se(261));return Ft=null,Bt=0,Pt}function sy(){for(;Ct!==null;)W_(Ct)}function ay(){for(;Ct!==null&&!Nx();)W_(Ct)}function W_(t){var e=q_(t.alternate,t,xn);t.memoizedProps=t.pendingProps,e===null?X_(t):Ct=e,Hh.current=null}function X_(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=J0(n,e),n!==null){n.flags&=32767,Ct=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Pt=6,Ct=null;return}}else if(n=Q0(n,e,xn),n!==null){Ct=n;return}if(e=e.sibling,e!==null){Ct=e;return}Ct=e=t}while(e!==null);Pt===0&&(Pt=5)}function xr(t,e,n){var i=it,r=Un.transition;try{Un.transition=null,it=1,oy(t,e,n,i)}finally{Un.transition=r,it=i}return null}function oy(t,e,n,i){do ws();while(Wi!==null);if(Xe&6)throw Error(se(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(se(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(jx(t,s),t===Ft&&(Ct=Ft=null,Bt=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||yo||(yo=!0,Y_(_l,function(){return ws(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=Un.transition,Un.transition=null;var a=it;it=1;var o=Xe;Xe|=4,Hh.current=null,ty(t,n),B_(n,t),A0($u),xl=!!Xu,$u=Xu=null,t.current=n,ny(n),Lx(),Xe=o,it=a,Un.transition=s}else t.current=n;if(yo&&(yo=!1,Wi=t,Ul=r),s=t.pendingLanes,s===0&&(Qi=null),Ux(n.stateNode),dn(t,Et()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(Il)throw Il=!1,t=fd,fd=null,t;return Ul&1&&t.tag!==0&&ws(),s=t.pendingLanes,s&1?t===pd?Ra++:(Ra=0,pd=t):Ra=0,cr(),null}function ws(){if(Wi!==null){var t=Cg(Ul),e=Un.transition,n=it;try{if(Un.transition=null,it=16>t?16:t,Wi===null)var i=!1;else{if(t=Wi,Wi=null,Ul=0,Xe&6)throw Error(se(331));var r=Xe;for(Xe|=4,_e=t.current;_e!==null;){var s=_e,a=s.child;if(_e.flags&16){var o=s.deletions;if(o!==null){for(var l=0;l<o.length;l++){var h=o[l];for(_e=h;_e!==null;){var u=_e;switch(u.tag){case 0:case 11:case 15:Aa(8,u,s)}var f=u.child;if(f!==null)f.return=u,_e=f;else for(;_e!==null;){u=_e;var p=u.sibling,g=u.return;if(k_(u),u===h){_e=null;break}if(p!==null){p.return=g,_e=p;break}_e=g}}}var S=s.alternate;if(S!==null){var y=S.child;if(y!==null){S.child=null;do{var m=y.sibling;y.sibling=null,y=m}while(y!==null)}}_e=s}}if(s.subtreeFlags&2064&&a!==null)a.return=s,_e=a;else e:for(;_e!==null;){if(s=_e,s.flags&2048)switch(s.tag){case 0:case 11:case 15:Aa(9,s,s.return)}var d=s.sibling;if(d!==null){d.return=s.return,_e=d;break e}_e=s.return}}var _=t.current;for(_e=_;_e!==null;){a=_e;var v=a.child;if(a.subtreeFlags&2064&&v!==null)v.return=a,_e=v;else e:for(a=_;_e!==null;){if(o=_e,o.flags&2048)try{switch(o.tag){case 0:case 11:case 15:nc(9,o)}}catch(R){yt(o,o.return,R)}if(o===a){_e=null;break e}var M=o.sibling;if(M!==null){M.return=o.return,_e=M;break e}_e=o.return}}if(Xe=r,cr(),ii&&typeof ii.onPostCommitFiberRoot=="function")try{ii.onPostCommitFiberRoot(ql,t)}catch{}i=!0}return i}finally{it=n,Un.transition=e}}return!1}function bp(t,e,n){e=Us(n,e),e=C_(t,e,1),t=Zi(t,e,1),e=Zt(),t!==null&&(Ya(t,1,e),dn(t,e))}function yt(t,e,n){if(t.tag===3)bp(t,t,n);else for(;e!==null;){if(e.tag===3){bp(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(Qi===null||!Qi.has(i))){t=Us(n,t),t=A_(e,t,1),e=Zi(e,t,1),t=Zt(),e!==null&&(Ya(e,1,t),dn(e,t));break}}e=e.return}}function ly(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=Zt(),t.pingedLanes|=t.suspendedLanes&n,Ft===t&&(Bt&n)===n&&(Pt===4||Pt===3&&(Bt&130023424)===Bt&&500>Et()-Gh?br(t,0):Vh|=n),dn(t,e)}function $_(t,e){e===0&&(t.mode&1?(e=co,co<<=1,!(co&130023424)&&(co=4194304)):e=1);var n=Zt();t=Ei(t,e),t!==null&&(Ya(t,e,n),dn(t,n))}function cy(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),$_(t,n)}function uy(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(se(314))}i!==null&&i.delete(e),$_(t,n)}var q_;q_=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||cn.current)ln=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return ln=!1,Z0(t,e,n);ln=!!(t.flags&131072)}else ln=!1,pt&&e.flags&1048576&&Qg(e,Cl,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;tl(t,e),t=e.pendingProps;var r=Ns(e,qt.current);Es(e,n),r=kh(null,e,i,t,r,n);var s=Oh();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,un(i)?(s=!0,wl(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,Lh(e),r.updater=tc,e.stateNode=r,r._reactInternals=e,nd(e,i,t,n),e=sd(null,e,i,!0,s,n)):(e.tag=0,pt&&s&&Th(e),Kt(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(tl(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=hy(i),t=Vn(i,t),r){case 0:e=rd(null,e,i,t,n);break e;case 1:e=vp(null,e,i,t,n);break e;case 11:e=gp(null,e,i,t,n);break e;case 14:e=_p(null,e,i,Vn(i.type,t),n);break e}throw Error(se(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Vn(i,r),rd(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Vn(i,r),vp(t,e,i,r,n);case 3:e:{if(N_(e),t===null)throw Error(se(387));i=e.pendingProps,s=e.memoizedState,r=s.element,r_(t,e),Rl(e,i,null,n);var a=e.memoizedState;if(i=a.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=Us(Error(se(423)),e),e=xp(t,e,i,n,r);break e}else if(i!==r){r=Us(Error(se(424)),e),e=xp(t,e,i,n,r);break e}else for(Sn=Ki(e.stateNode.containerInfo.firstChild),En=e,pt=!0,Wn=null,n=n_(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Ls(),i===r){e=wi(t,e,n);break e}Kt(t,e,i,n)}e=e.child}return e;case 5:return s_(e),t===null&&Ju(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,a=r.children,qu(i,r)?a=null:s!==null&&qu(i,s)&&(e.flags|=32),P_(t,e),Kt(t,e,a,n),e.child;case 6:return t===null&&Ju(e),null;case 13:return L_(t,e,n);case 4:return Dh(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=Ds(e,null,i,n):Kt(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Vn(i,r),gp(t,e,i,r,n);case 7:return Kt(t,e,e.pendingProps,n),e.child;case 8:return Kt(t,e,e.pendingProps.children,n),e.child;case 12:return Kt(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,a=r.value,at(Al,i._currentValue),i._currentValue=a,s!==null)if(Zn(s.value,a)){if(s.children===r.children&&!cn.current){e=wi(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var o=s.dependencies;if(o!==null){a=s.child;for(var l=o.firstContext;l!==null;){if(l.context===i){if(s.tag===1){l=yi(-1,n&-n),l.tag=2;var h=s.updateQueue;if(h!==null){h=h.shared;var u=h.pending;u===null?l.next=l:(l.next=u.next,u.next=l),h.pending=l}}s.lanes|=n,l=s.alternate,l!==null&&(l.lanes|=n),ed(s.return,n,e),o.lanes|=n;break}l=l.next}}else if(s.tag===10)a=s.type===e.type?null:s.child;else if(s.tag===18){if(a=s.return,a===null)throw Error(se(341));a.lanes|=n,o=a.alternate,o!==null&&(o.lanes|=n),ed(a,n,e),a=s.sibling}else a=s.child;if(a!==null)a.return=s;else for(a=s;a!==null;){if(a===e){a=null;break}if(s=a.sibling,s!==null){s.return=a.return,a=s;break}a=a.return}s=a}Kt(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,Es(e,n),r=Fn(r),i=i(r),e.flags|=1,Kt(t,e,i,n),e.child;case 14:return i=e.type,r=Vn(i,e.pendingProps),r=Vn(i.type,r),_p(t,e,i,r,n);case 15:return b_(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Vn(i,r),tl(t,e),e.tag=1,un(i)?(t=!0,wl(e)):t=!1,Es(e,n),T_(e,i,r),nd(e,i,r,n),sd(null,e,i,!0,t,n);case 19:return D_(t,e,n);case 22:return R_(t,e,n)}throw Error(se(156,e.tag))};function Y_(t,e){return Mg(t,e)}function dy(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Dn(t,e,n,i){return new dy(t,e,n,i)}function qh(t){return t=t.prototype,!(!t||!t.isReactComponent)}function hy(t){if(typeof t=="function")return qh(t)?1:0;if(t!=null){if(t=t.$$typeof,t===fh)return 11;if(t===ph)return 14}return 2}function er(t,e){var n=t.alternate;return n===null?(n=Dn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function rl(t,e,n,i,r,s){var a=2;if(i=t,typeof t=="function")qh(t)&&(a=1);else if(typeof t=="string")a=5;else e:switch(t){case as:return Rr(n.children,r,s,e);case hh:a=8,r|=8;break;case Cu:return t=Dn(12,n,e,r|2),t.elementType=Cu,t.lanes=s,t;case Au:return t=Dn(13,n,e,r),t.elementType=Au,t.lanes=s,t;case bu:return t=Dn(19,n,e,r),t.elementType=bu,t.lanes=s,t;case sg:return rc(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case ig:a=10;break e;case rg:a=9;break e;case fh:a=11;break e;case ph:a=14;break e;case Oi:a=16,i=null;break e}throw Error(se(130,t==null?t:typeof t,""))}return e=Dn(a,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function Rr(t,e,n,i){return t=Dn(7,t,i,e),t.lanes=n,t}function rc(t,e,n,i){return t=Dn(22,t,i,e),t.elementType=sg,t.lanes=n,t.stateNode={isHidden:!1},t}function Vc(t,e,n){return t=Dn(6,t,null,e),t.lanes=n,t}function Gc(t,e,n){return e=Dn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function fy(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=wc(0),this.expirationTimes=wc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=wc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Yh(t,e,n,i,r,s,a,o,l){return t=new fy(t,e,n,o,l),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Dn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Lh(s),t}function py(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:ss,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function K_(t){if(!t)return rr;t=t._reactInternals;e:{if(zr(t)!==t||t.tag!==1)throw Error(se(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(un(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(se(171))}if(t.tag===1){var n=t.type;if(un(n))return Kg(t,n,e)}return e}function Z_(t,e,n,i,r,s,a,o,l){return t=Yh(n,i,!0,t,r,s,a,o,l),t.context=K_(null),n=t.current,i=Zt(),r=Ji(n),s=yi(i,r),s.callback=e??null,Zi(n,s,r),t.current.lanes=r,Ya(t,r,i),dn(t,i),t}function sc(t,e,n,i){var r=e.current,s=Zt(),a=Ji(r);return n=K_(n),e.context===null?e.context=n:e.pendingContext=n,e=yi(s,a),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=Zi(r,e,a),t!==null&&(Kn(t,r,a,s),Qo(t,r,a)),a}function kl(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Rp(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function Kh(t,e){Rp(t,e),(t=t.alternate)&&Rp(t,e)}function my(){return null}var Q_=typeof reportError=="function"?reportError:function(t){console.error(t)};function Zh(t){this._internalRoot=t}ac.prototype.render=Zh.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(se(409));sc(t,e,null,null)};ac.prototype.unmount=Zh.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Ir(function(){sc(null,t,null,null)}),e[Mi]=null}};function ac(t){this._internalRoot=t}ac.prototype.unstable_scheduleHydration=function(t){if(t){var e=Rg();t={blockedOn:null,target:t,priority:e};for(var n=0;n<ji.length&&e!==0&&e<ji[n].priority;n++);ji.splice(n,0,t),n===0&&Ng(t)}};function Qh(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function oc(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Pp(){}function gy(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var h=kl(a);s.call(h)}}var a=Z_(e,i,t,0,null,!1,!1,"",Pp);return t._reactRootContainer=a,t[Mi]=a.current,Oa(t.nodeType===8?t.parentNode:t),Ir(),a}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var o=i;i=function(){var h=kl(l);o.call(h)}}var l=Yh(t,0,!1,null,null,!1,!1,"",Pp);return t._reactRootContainer=l,t[Mi]=l.current,Oa(t.nodeType===8?t.parentNode:t),Ir(function(){sc(e,l,n,i)}),l}function lc(t,e,n,i,r){var s=n._reactRootContainer;if(s){var a=s;if(typeof r=="function"){var o=r;r=function(){var l=kl(a);o.call(l)}}sc(e,a,t,r)}else a=gy(n,e,t,r,i);return kl(a)}Ag=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=ga(e.pendingLanes);n!==0&&(_h(e,n|1),dn(e,Et()),!(Xe&6)&&(Fs=Et()+500,cr()))}break;case 13:Ir(function(){var i=Ei(t,1);if(i!==null){var r=Zt();Kn(i,t,1,r)}}),Kh(t,1)}};vh=function(t){if(t.tag===13){var e=Ei(t,134217728);if(e!==null){var n=Zt();Kn(e,t,134217728,n)}Kh(t,134217728)}};bg=function(t){if(t.tag===13){var e=Ji(t),n=Ei(t,e);if(n!==null){var i=Zt();Kn(n,t,e,i)}Kh(t,e)}};Rg=function(){return it};Pg=function(t,e){var n=it;try{return it=t,e()}finally{it=n}};Ou=function(t,e,n){switch(e){case"input":if(Nu(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=Ql(i);if(!r)throw Error(se(90));og(i),Nu(i,r)}}}break;case"textarea":cg(t,n);break;case"select":e=n.value,e!=null&&xs(t,!!n.multiple,e,!1)}};gg=Wh;_g=Ir;var _y={usingClientEntryPoint:!1,Events:[Za,us,Ql,pg,mg,Wh]},na={findFiberByHostInstance:Er,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},vy={bundleType:na.bundleType,version:na.version,rendererPackageName:na.rendererPackageName,rendererConfig:na.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:Ai.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=yg(t),t===null?null:t.stateNode},findFiberByHostInstance:na.findFiberByHostInstance||my,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var So=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!So.isDisabled&&So.supportsFiber)try{ql=So.inject(vy),ii=So}catch{}}Tn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=_y;Tn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!Qh(e))throw Error(se(200));return py(t,e,null,n)};Tn.createRoot=function(t,e){if(!Qh(t))throw Error(se(299));var n=!1,i="",r=Q_;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=Yh(t,1,!1,null,null,n,!1,i,r),t[Mi]=e.current,Oa(t.nodeType===8?t.parentNode:t),new Zh(e)};Tn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(se(188)):(t=Object.keys(t).join(","),Error(se(268,t)));return t=yg(e),t=t===null?null:t.stateNode,t};Tn.flushSync=function(t){return Ir(t)};Tn.hydrate=function(t,e,n){if(!oc(e))throw Error(se(200));return lc(null,t,e,!0,n)};Tn.hydrateRoot=function(t,e,n){if(!Qh(t))throw Error(se(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",a=Q_;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(a=n.onRecoverableError)),e=Z_(e,null,t,1,n??null,r,!1,s,a),t[Mi]=e.current,Oa(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new ac(e)};Tn.render=function(t,e,n){if(!oc(e))throw Error(se(200));return lc(null,t,e,!1,n)};Tn.unmountComponentAtNode=function(t){if(!oc(t))throw Error(se(40));return t._reactRootContainer?(Ir(function(){lc(null,null,t,!1,function(){t._reactRootContainer=null,t[Mi]=null})}),!0):!1};Tn.unstable_batchedUpdates=Wh;Tn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!oc(n))throw Error(se(200));if(t==null||t._reactInternals===void 0)throw Error(se(38));return lc(t,e,n,!1,i)};Tn.version="18.3.1-next-f1338f8080-20240426";function J_(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(J_)}catch(t){console.error(t)}}J_(),Jm.exports=Tn;var xy=Jm.exports,ev,Np=xy;ev=Np.createRoot,Np.hydrateRoot;async function ct(t,e,n){const i=await fetch(e,{method:t,headers:n===void 0?{}:{"Content-Type":"application/json"},body:n===void 0?void 0:JSON.stringify(n)});if(!i.ok){let r=`${i.status} ${i.statusText}`;try{const s=await i.json();r=typeof s.detail=="string"?s.detail:JSON.stringify(s.detail??s)}catch{}throw new Error(r)}return i.json()}const et={health:()=>ct("GET","/api/health"),appInfo:()=>ct("GET","/api/app/info"),examples:()=>ct("GET","/api/examples"),example:t=>ct("GET",`/api/examples/${t}`),updateCheck:()=>ct("GET","/api/app/update"),updateApply:()=>ct("POST","/api/app/update"),updateStatus:()=>ct("GET","/api/app/update/status"),defaults:()=>ct("GET","/api/defaults"),schema:()=>ct("GET","/api/schema"),components:()=>ct("GET","/api/components"),materials:()=>ct("GET","/api/materials"),run:(t,e="full")=>ct("POST","/api/run",{project:t,level:e}),thermoChart:t=>ct("POST","/api/thermo/chart",t),envelope:t=>ct("POST","/api/thermo/envelope",t),projects:()=>ct("GET","/api/projects"),createProject:(t,e)=>ct("POST","/api/projects",{project:t,note:e}),updateProject:(t,e,n)=>ct("PUT",`/api/projects/${t}`,{project:e,note:n}),getProject:(t,e)=>ct("GET",`/api/projects/${t}${e===void 0?"":`?revision=${e}`}`),revisions:t=>ct("GET",`/api/projects/${t}/revisions`),runSaved:t=>ct("POST",`/api/projects/${t}/run?level=full`),history:t=>ct("GET",`/api/projects/${t}/history`),metrics:()=>ct("GET","/api/studies/metrics"),parametric:t=>ct("POST","/api/studies/parametric",t),sensitivity:t=>ct("POST","/api/studies/sensitivity",t),optimize:t=>ct("POST","/api/studies/optimize",t)};async function yy(t,e){const n=await fetch(`/api/export/${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({project:e,level:"full"})});if(!n.ok)throw new Error((await n.json()).detail??n.statusText);const i=await n.blob(),r=document.createElement("a");r.href=URL.createObjectURL(i),r.download=`${String(e.name).replace(/\s+/g,"_")}_rev${e.revision}_${t}`,r.click(),URL.revokeObjectURL(r.href)}const ie=(t,e=1)=>t==null?"–":typeof t=="number"?Number.isFinite(t)?t.toLocaleString(void 0,{maximumFractionDigits:e,minimumFractionDigits:e}):"–":typeof t=="boolean"?t?"yes":"no":String(t),Jh=[{id:"inputs",label:"Inputs",color:"#0B5CAD"},{id:"process",label:"Process & aero",color:"#0E8A91"},{id:"mechanical",label:"Mechanical",color:"#6D4FC2"},{id:"dynamics",label:"Rotordynamics",color:"#D9822B"},{id:"systems",label:"Materials & systems",color:"#2E9E6B"},{id:"evaluate",label:"Evaluate & report",color:"#C2414B"}],Ts=[{id:"project",label:"Design basis",group:"inputs",checks:[],desc:"Project data, driver, speed limits, criteria and the standards basis.",how:"Start here: set the design limits and acceptance criteria every later check uses."},{id:"gas",label:"Gas & operating cases",group:"inputs",checks:[],desc:"Gas composition, property model and all operating cases.",how:"Enter mol % and each case's flow, suction and discharge conditions."},{id:"thermo",label:"Thermodynamics",group:"process",checks:["compression"],desc:"Peng-Robinson / CoolProp properties, phase envelope and compression path.",how:"Check Z, k and the dew-point margin before trusting the compression results."},{id:"compressor",label:"Selection & performance",group:"process",checks:["aero"],desc:"Casing and stage selection, head, power, efficiency and the performance map.",how:"Review surge margin, turndown and power for each case on the map."},{id:"impellers",label:"Impellers & FEA",group:"mechanical",checks:["impeller","structural"],desc:"Impeller geometry, tip speed, axisymmetric FEA and the 3D stress viewer.",how:"Look at peak stress at MCS and 115 % overspeed against yield."},{id:"rotor",label:"Rotor & shaft",group:"mechanical",checks:["mechanical"],desc:"Shaft sizing, rotor layout, masses and the 3D rotor model.",how:"Confirm shaft stress and the bearing span before running rotordynamics."},{id:"bearings",label:"Bearings & seals",group:"mechanical",checks:["bearings","seals"],desc:"Tilting-pad bearings, labyrinth leakage and dry gas seal conditioning.",how:"Check pad temperature, film thickness and seal-gas dew-point margin."},{id:"lateral",label:"Lateral rotordynamics",group:"dynamics",checks:["rotordynamics"],desc:"Critical speeds, Campbell diagram, unbalance response and stability.",how:"Review separation margins, amplification factors and log decrement."},{id:"torsional",label:"Torsional train",group:"dynamics",checks:["torsional"],desc:"Train torsional natural frequencies, interference and motor start-up.",how:"Check margins to 1x and 2x line frequency and the start-up shaft torque."},{id:"materials",label:"Material assessment",group:"systems",checks:["materials"],desc:"Sour and wet service per stage, SSC domains, CO2 corrosion and evidence.",how:"Record each component's material and evidence; nothing passes on a name alone."},{id:"aux",label:"Lube oil & piping",group:"systems",checks:["auxiliary","piping","conditioning"],desc:"Lube oil system sizing and nozzle loads / piping checks.",how:"Size the oil system and check nozzle loads against the allowables."},{id:"optimize",label:"Optimisation",group:"evaluate",checks:[],desc:"Parametric studies, sensitivity and constrained optimisation.",how:"Vary speed, stages or geometry to see what moves power and margins."},{id:"verify",label:"Verification",group:"evaluate",checks:["*"],desc:"The full traceable checklist from every module, with references.",how:"Work through every fail and attention item before issuing results."},{id:"reports",label:"Reports & projects",group:"evaluate",checks:[],desc:"PDF / HTML / Excel reports, CAD and FE exports, saved revisions.",how:"Save a revision, then export the report and data package."}],Ol=t=>String(Ts.findIndex(e=>e.id===t)+1).padStart(2,"0"),Sy=t=>Jh.find(e=>e.id===t.group),My=t=>{const e=Math.round((Date.now()/1e3-t)/60);return e<1?"just now":e<60?`${e} min ago`:`${Math.round(e/60)} h ago`};function Ey(t,e){var s;if(!t||!e.length)return null;const n=((s=t.checklist)==null?void 0:s.items)??[],i=e.includes("*")?n:n.filter(a=>e.some(o=>a.module===o||a.module.startsWith(o+"."))),r=a=>i.filter(o=>o.status===a).length;return{pass:r("pass"),fail:r("fail"),attention:r("attention"),review:r("review"),total:i.length}}function wy({info:t}){const[e,n]=ee.useState(null),[i,r]=ee.useState(null),[s,a]=ee.useState(!1),o=async()=>{a(!0);try{n(await et.updateCheck())}finally{a(!1)}};ee.useEffect(()=>{o()},[]),ee.useEffect(()=>{if(!i||!["downloading","installing"].includes(i.phase))return;const u=setInterval(async()=>{try{r(await et.updateStatus())}catch{}},600);return()=>clearInterval(u)},[i]);const l=async()=>{try{r(await et.updateApply())}catch(u){r({phase:"error",message:u.message})}},h=e?e.error?["attention","Offline · update check failed"]:e.available?["warn",`Update available · ${e.latest}`]:["ok",t.installed?"Installed · up to date":"Up to date"]:["muted","Checking…"];return c.jsxs("div",{className:"upd",children:[c.jsx("span",{className:`pill ${h[0]}`,children:h[1]}),c.jsxs("div",{className:"mono small muted",children:["Version ",t.version," · ",t.release_date,!t.installed&&" · running from source"]}),(e==null?void 0:e.available)&&e.can_install&&!i&&c.jsxs("button",{className:"btn primary wide",onClick:l,children:["Update to ",e.latest,e.size_mb?` · ${e.size_mb} MB`:""]}),(e==null?void 0:e.available)&&!e.can_install&&c.jsxs("a",{className:"btn primary wide",href:e.url,target:"_blank",rel:"noreferrer",children:["Get ",e.latest," on GitHub ↗"]}),(!e||!e.available)&&c.jsx("button",{className:"btn wide",disabled:s,onClick:o,children:s?"Checking…":"Check for updates"}),i&&c.jsxs("div",{className:"progress",children:[c.jsx("div",{style:{width:`${Math.round((i.progress??0)*100)}%`}}),c.jsx("span",{className:"mono small",children:i.message})]}),(e==null?void 0:e.checked)&&c.jsxs("div",{className:"mono small muted",children:["Checked ",My(e.checked)," · GitHub Releases"]})]})}function Ty({a:t}){const[e,n]=ee.useState([]),[i,r]=ee.useState([]);return ee.useEffect(()=>{et.examples().then(n).catch(()=>n([])),et.projects().then(r).catch(()=>r([]))},[]),c.jsxs("section",{className:"start",children:[c.jsxs("div",{className:"cell",children:[c.jsx("div",{className:"mono caps label",children:"Start"}),c.jsx("button",{className:"btn primary wide big-btn",onClick:t.newProject,children:"New project"}),c.jsx("p",{className:"muted small",children:"Guided setup: name, driver, gas and design case. Everything else starts from sensible defaults."}),c.jsxs("label",{className:"btn wide",children:["Import project file",c.jsx("input",{type:"file",accept:".json,application/json",hidden:!0,onChange:async s=>{var o;const a=(o=s.target.files)==null?void 0:o[0];if(a){try{t.importFile(JSON.parse(await a.text()))}catch(l){alert(`Not a CentriForge project file: ${l.message}`)}s.target.value=""}}})]}),t.resume&&c.jsxs("button",{className:"btn wide",style:{marginTop:8},onClick:t.resume,children:["Continue: ",t.resumeName]})]}),c.jsxs("div",{className:"cell",children:[c.jsx("div",{className:"mono caps label",children:"Examples"}),e.map(s=>c.jsxs("button",{className:"excard",onClick:()=>t.openExample(s.id),children:[c.jsx("b",{children:s.title}),c.jsx("span",{className:"muted",children:s.summary}),c.jsx("span",{children:s.tags.map(a=>c.jsx("span",{className:"pill blue",children:a},a))})]},s.id))]}),c.jsxs("div",{className:"cell",children:[c.jsx("div",{className:"mono caps label",children:"Learn"}),c.jsxs("button",{className:"excard",onClick:t.tutorial,children:[c.jsx("b",{children:"Guided tutorial"}),c.jsx("span",{className:"muted",children:"Walks through all 14 modules on the export gas example: what to enter, how to read each result."}),c.jsxs("span",{children:[c.jsx("span",{className:"pill blue",children:"12 steps"})," ",c.jsx("span",{className:"pill blue",children:"10 min"})]})]}),c.jsx("div",{className:"mono caps label",style:{marginTop:14},children:"Recent projects"}),i.length===0?c.jsx("p",{className:"muted small",children:"Saved projects appear here (Reports & projects → Save project)."}):c.jsx("div",{className:"recent",children:i.slice(0,6).map(s=>c.jsxs("button",{onClick:()=>t.openSaved(s.id),children:[c.jsx("b",{children:s.name}),c.jsxs("span",{className:"mono small muted",children:["rev ",s.current_revision," · ",String(s.updated).slice(0,10)]})]},s.id))})]})]})}function Cy({results:t,project:e,open:n,running:i,actions:r}){var S;const[s,a]=ee.useState(null),[o,l]=ee.useState("all"),[h,u]=ee.useState("");ee.useEffect(()=>{et.appInfo().then(a).catch(()=>a(null))},[]);const f=ee.useMemo(()=>Ts.filter(y=>(o==="all"||y.group===o)&&(y.label+y.desc).toLowerCase().includes(h.toLowerCase())),[o,h]),p=t==null?void 0:t.summary,g=(S=s==null?void 0:s.changelog)==null?void 0:S[0];return c.jsxs("div",{className:"launcher",children:[c.jsxs("section",{className:"hero",children:[c.jsxs("div",{className:"cell brand",children:[c.jsx("img",{src:"/favicon.svg",alt:"",width:"76",height:"76"}),c.jsxs("div",{children:[c.jsxs("h1",{children:["Centri",c.jsx("span",{children:"Forge"})]}),c.jsx("div",{className:"mono caps muted",children:"Compressor engineering suite"}),c.jsx("p",{className:"muted",children:"Centrifugal compressor thermodynamics, selection, mechanical design, rotordynamics, materials and verification in one traceable workflow. Preliminary engineering - not a certificate of compliance."})]})]}),c.jsxs("div",{className:"cell",children:[c.jsxs("div",{className:"mono caps label",children:["What's new",g&&` in ${g.version}`]}),c.jsx("ul",{className:"news",children:((g==null?void 0:g.items)??[]).map(y=>c.jsx("li",{children:y},y))})]}),c.jsx("div",{className:"cell",children:s?c.jsx(wy,{info:s}):c.jsx("span",{className:"mono small muted",children:"Loading app info…"})})]}),c.jsx(Ty,{a:r}),e&&c.jsxs("section",{className:"hero project",children:[c.jsxs("div",{className:"cell",children:[c.jsx("div",{className:"mono caps label",children:"Current project"}),c.jsxs("div",{className:"pname",children:[(e==null?void 0:e.name)??"–"," ",c.jsxs("span",{className:"mono small muted",children:["rev ",(e==null?void 0:e.revision)??0]})]})]}),[["Configuration",p==null?void 0:p.configuration],["Speed",p&&`${Math.round(p.speed_rpm).toLocaleString()} rpm`],["Shaft power",p&&`${Math.round(p.shaft_power_kw).toLocaleString()} kW`]].map(([y,m])=>c.jsxs("div",{className:"cell",children:[c.jsx("div",{className:"mono caps label",children:y}),c.jsx("div",{className:"big",children:i?"…":m??"–"})]},y)),c.jsxs("div",{className:"cell",children:[c.jsx("div",{className:"mono caps label",children:"Checklist"}),p?c.jsx("div",{className:"counts",children:["pass","fail","attention","review"].map(y=>c.jsxs("span",{className:`pill ${y}`,children:[p.checklist[y]," ",y]},y))}):c.jsx("span",{className:"muted",children:i?"Running analysis…":"Not run yet"})]}),c.jsx("div",{className:"cell",children:c.jsx("button",{className:"btn primary wide",onClick:()=>n("project"),children:"Open workspace"})})]}),c.jsxs("div",{className:"mono caps label",style:{marginTop:22},children:["Modules",!e&&" · start or open a project to use them"]}),c.jsxs("div",{className:"filters",style:{marginTop:6},children:[c.jsxs("div",{className:"seg",children:[c.jsxs("button",{className:o==="all"?"on":"",onClick:()=>l("all"),children:["All ",c.jsx("b",{children:Ts.length})]}),Jh.map(y=>c.jsxs("button",{className:o===y.id?"on":"",onClick:()=>l(y.id),children:[y.label," ",c.jsx("b",{children:Ts.filter(m=>m.group===y.id).length})]},y.id))]}),c.jsx("input",{className:"inp search",placeholder:"Search modules",value:h,onChange:y=>u(y.target.value),"aria-label":"Search modules"})]}),c.jsx("section",{className:"tiles",children:f.map(y=>{const m=Sy(y),d=Ey(t,y.checks);return c.jsxs("article",{className:"tile",children:[c.jsxs("header",{children:[c.jsx("span",{className:"num",style:{background:m.color},children:Ol(y.id)}),c.jsx("span",{className:"mono caps muted",children:m.label})]}),c.jsxs("div",{className:"body",children:[c.jsx("h3",{children:y.label}),c.jsx("p",{children:y.desc}),c.jsxs("p",{className:"how",children:[c.jsx("span",{className:"mono caps",children:"How to use"}),y.how]}),c.jsx("div",{className:"tstat",children:d?d.fail?c.jsxs("span",{className:"pill fail",children:[d.fail," fail · ",d.pass," pass"]}):d.attention?c.jsxs("span",{className:"pill attention",children:[d.attention," attention · ",d.pass," pass"]}):d.total?c.jsxs("span",{className:"pill pass",children:[d.pass," pass"]}):c.jsx("span",{className:"pill muted",children:"No checks"}):c.jsx("span",{className:"pill muted",children:t?"Inputs / tools":"Not run yet"})})]}),c.jsx("footer",{children:c.jsx("button",{className:"btn primary wide",disabled:!e,title:e?"":"Start or open a project first",onClick:()=>n(y.id),children:"Open"})})]},y.id)})}),c.jsxs("footer",{className:"foot mono caps",children:[c.jsx("span",{children:s?`Projects saved in ${s.data_dir}`:""}),c.jsx("span",{className:"spacer"}),s&&c.jsx("a",{href:`https://github.com/${s.repo}`,target:"_blank",rel:"noreferrer",children:"GitHub ↗"}),s&&c.jsx("a",{href:`https://github.com/${s.repo}/releases`,target:"_blank",rel:"noreferrer",children:"Releases ↗"}),c.jsx("a",{href:"/docs",target:"_blank",rel:"noreferrer",children:"API ↗"})]})]})}const Ay=[["vfd_motor","Electric motor, variable speed (VFD)"],["fixed_speed_motor_gearbox","Fixed-speed motor + gearbox"],["steam_turbine","Steam turbine"],["gas_turbine","Gas turbine"]],Lp=["CH4","C2H6","C3H8","iC4H10","nC4H10","iC5H12","nC5H12","nC6H14","N2","O2","CO2","H2S","H2","H2O","CO","Ar","He"];function by({onCreate:t,onClose:e}){const[n,i]=ee.useState(0),[r,s]=ee.useState("New compressor project"),[a,o]=ee.useState(""),[l,h]=ee.useState("vfd_motor"),[u,f]=ee.useState([["CH4",90],["C2H6",5],["C3H8",2],["N2",1.5],["CO2",1.5]]),[p,g]=ee.useState({suction_pressure_bara:30,suction_temperature_c:35,discharge_pressure_bara:90,flow_value:60,flow_unit:"kg/s"}),S=u.reduce((_,[,v])=>_+(Number(v)||0),0),y=[r.trim().length>0,u.length>0&&S>0,p.discharge_pressure_bara>p.suction_pressure_bara&&p.flow_value>0],m=async()=>{const _=await et.example("blank");_.name=r.trim(),_.description=a,_.design_basis.driver_type=l,_.gas.components=Object.fromEntries(u.filter(([,v])=>Number(v)>0)),_.cases=[{..._.cases[0],...p,name:"Rated",is_design:!0}],t(_)},d=["Project","Gas","Design case"];return c.jsx("div",{className:"modal-bg",onClick:e,children:c.jsxs("div",{className:"modal",onClick:_=>_.stopPropagation(),role:"dialog","aria-label":"New project",children:[c.jsx("div",{className:"seg",children:d.map((_,v)=>c.jsxs("button",{className:v===n?"on":"",onClick:()=>i(v),children:[v+1," · ",_," ",y[v]?"✓":""]},_))}),c.jsxs("div",{className:"mbody",children:[n===0&&c.jsxs("div",{className:"form",children:[c.jsxs("label",{children:["Project name",c.jsx("input",{value:r,onChange:_=>s(_.target.value),autoFocus:!0})]}),c.jsxs("label",{children:["Description",c.jsx("input",{value:a,placeholder:"Service, location, duty",onChange:_=>o(_.target.value)})]}),c.jsxs("label",{children:["Driver",c.jsx("select",{value:l,onChange:_=>h(_.target.value),children:Ay.map(([_,v])=>c.jsx("option",{value:_,children:v},_))})]})]}),n===1&&c.jsxs(c.Fragment,{children:[c.jsxs("table",{className:"t",children:[c.jsx("thead",{children:c.jsxs("tr",{children:[c.jsx("th",{children:"Component"}),c.jsx("th",{children:"mol %"}),c.jsx("th",{})]})}),c.jsx("tbody",{children:u.map(([_,v],M)=>c.jsxs("tr",{children:[c.jsx("td",{children:c.jsx("select",{className:"inp",value:_,onChange:R=>f(u.map((A,C)=>C===M?[R.target.value,A[1]]:A)),children:Lp.map(R=>c.jsx("option",{children:R},R))})}),c.jsx("td",{children:c.jsx("input",{className:"inp",type:"number",step:"any",value:v,onChange:R=>f(u.map((A,C)=>C===M?[A[0],Number(R.target.value)]:A))})}),c.jsx("td",{children:c.jsx("button",{className:"btn",onClick:()=>f(u.filter((R,A)=>A!==M)),children:"Remove"})})]},M))})]}),c.jsxs("div",{className:"row",style:{marginTop:8},children:[c.jsx("button",{className:"btn",onClick:()=>f([...u,[Lp.find(_=>!u.some(([v])=>v===_))??"CH4",0]]),children:"Add component"}),c.jsxs("span",{className:"muted",children:["Total ",S.toFixed(2)," % (normalised automatically)"]})]})]}),n===2&&c.jsxs("div",{className:"form",children:[c.jsxs("label",{children:["Suction pressure (bara)",c.jsx("input",{type:"number",step:"any",value:p.suction_pressure_bara,onChange:_=>g({...p,suction_pressure_bara:Number(_.target.value)})})]}),c.jsxs("label",{children:["Suction temperature (°C)",c.jsx("input",{type:"number",step:"any",value:p.suction_temperature_c,onChange:_=>g({...p,suction_temperature_c:Number(_.target.value)})})]}),c.jsxs("label",{children:["Discharge pressure (bara)",c.jsx("input",{type:"number",step:"any",value:p.discharge_pressure_bara,onChange:_=>g({...p,discharge_pressure_bara:Number(_.target.value)})})]}),c.jsxs("label",{children:["Flow",c.jsx("input",{type:"number",step:"any",value:p.flow_value,onChange:_=>g({...p,flow_value:Number(_.target.value)})})]}),c.jsxs("label",{children:["Flow unit",c.jsx("select",{value:p.flow_unit,onChange:_=>g({...p,flow_unit:_.target.value}),children:["kg/s","kg/h","Am3/h","Nm3/h","Sm3/h","MMSCFD"].map(_=>c.jsx("option",{children:_},_))})]}),c.jsx("p",{className:"muted small",style:{gridColumn:"1 / -1"},children:"Add more operating cases later on the Gas & operating cases page."})]})]}),c.jsxs("div",{className:"row mfoot",children:[c.jsx("button",{className:"btn",onClick:e,children:"Cancel"}),c.jsx("span",{className:"spacer"}),n>0&&c.jsx("button",{className:"btn",onClick:()=>i(n-1),children:"Back"}),n<2?c.jsx("button",{className:"btn primary",onClick:()=>i(n+1),children:"Next"}):c.jsx("button",{className:"btn primary",disabled:!y.every(Boolean),onClick:m,children:"Create project"})]})]})})}const va=[{page:"project",title:"Design basis",text:"Every project starts with the design basis: driver, tip-speed and Mach limits, temperature limits and the acceptance criteria every check uses. Fields left blank are estimated."},{page:"gas",title:"Gas & operating cases",text:"Enter the gas composition (normalised automatically) and every operating case. Mark one case as the design case; the machine is sized for it and checked against all others."},{page:"gas",title:"Run the analysis",text:"Click Run analysis (top right) whenever inputs change. One run updates every module: thermodynamics, sizing, mechanics, rotordynamics, materials and the checklist.",run:!0},{page:"thermo",title:"Thermodynamics",text:"Check compressibility, k and the phase envelope. The dew-point margin tells you whether liquid can form at suction or in the coolers."},{page:"compressor",title:"Selection & performance",text:"The selected casing, stages and speed, with the performance map. Hover over the chart to read values; use Edit chart to change axes, labels and styles, and export PNG, SVG, PDF or CSV."},{page:"impellers",title:"Impellers & FEA",text:"Impeller geometry and stresses. The 3D viewer shows the FE result: switch result field, load case, cut-away and deformation scale."},{page:"rotor",title:"Rotor & shaft",text:"The shaft layout from impellers, seals, balance piston and bearings. Shaft stresses are checked before rotordynamics."},{page:"bearings",title:"Bearings & seals",text:"Tilting-pad bearing coefficients feed rotordynamics; seal leakage and dry gas seal conditioning are checked here."},{page:"lateral",title:"Lateral rotordynamics",text:"Campbell diagram, critical speeds, unbalance response and stability against API 617-style criteria."},{page:"torsional",title:"Torsional train",text:"Natural frequencies of the whole train, interference with excitations and the motor start-up torque."},{page:"materials",title:"Material assessment",text:"Sour and wet service at every stage: SSC domain, CO2 corrosion and the acceptance criteria per component. A material only passes with recorded evidence."},{page:"verify",title:"Verification",text:"The full traceable checklist. Work through every fail and attention item, then save a revision and export the report in Reports & projects."}];function Ry({step:t,setStep:e,open:n,run:i,running:r}){const s=va[t],a=o=>{e(o),n(va[o].page)};return c.jsxs("aside",{className:"tour",role:"dialog","aria-label":"Tutorial",children:[c.jsxs("div",{className:"mono caps muted",children:["Tutorial · ",t+1," / ",va.length," · module ",Ol(s.page)]}),c.jsx("h3",{children:s.title}),c.jsx("p",{children:s.text}),c.jsxs("div",{className:"row",children:[s.run&&c.jsx("button",{className:"btn primary",disabled:r,onClick:i,children:r?"Running…":"Run it for me"}),c.jsx("span",{className:"spacer"}),c.jsx("button",{className:"btn",disabled:t===0,onClick:()=>a(t-1),children:"Back"}),t<va.length-1?c.jsx("button",{className:"btn primary",onClick:()=>a(t+1),children:"Next"}):c.jsx("button",{className:"btn primary",onClick:()=>e(null),children:"Finish"})]}),c.jsx("button",{className:"tour-x",onClick:()=>e(null),"aria-label":"Close tutorial",children:"×"})]})}const nt=["#0B5CAD","#D55E00","#009E73","#CC79A7","#E69F00","#56B4E9","#000000","#7F7F7F"],ia="cf.chart.default",ra=t=>{try{return JSON.parse(localStorage.getItem(t)??"{}")}catch{return{}}},sa=(t,e)=>{try{localStorage.setItem(t,JSON.stringify(e))}catch{}},sl=t=>typeof t=="string"?t:(t==null?void 0:t.text)??"";function Py(t,e){var i,r;return`cf.chart.${[sl(e==null?void 0:e.title),sl((i=e==null?void 0:e.xaxis)==null?void 0:i.title),sl((r=e==null?void 0:e.yaxis)==null?void 0:r.title),t.map(s=>s.name).join("|")].join("·")}`}async function Dp(t,e){const n=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!n.ok)throw new Error((await n.json().catch(()=>({}))).detail??n.statusText);return n}function Ip(t,e,n){return n?(Math.log10(t)-Math.log10(e[0]))/(Math.log10(e[1])-Math.log10(e[0])):(t-e[0])/(e[1]-e[0])}function Up(t,e,n){return n?10**(Math.log10(e[0])+t*(Math.log10(e[1])-Math.log10(e[0]))):e[0]+t*(e[1]-e[0])}const Ni=t=>Math.abs(t)>=1e5||Math.abs(t)<.001&&t!==0?t.toExponential(3):Number(t.toPrecision(5)).toString(),Ny=["","o","s","D","^","v","P","X","*"],Ly={"":"none",o:"circle",s:"square",D:"diamond","^":"triangle up",v:"triangle down",P:"plus",X:"cross","*":"star"};function At({data:t,layout:e,height:n=340}){const i=ee.useMemo(()=>Py(t,e),[t,e]),[r,s]=ee.useState(()=>({...ra(ia),...ra(i)})),[a,o]=ee.useState(null),[l,h]=ee.useState(""),[u,f]=ee.useState(!1),[p,g]=ee.useState(null),[S,y]=ee.useState(0),m=ee.useRef(null);ee.useEffect(()=>{s({...ra(ia),...ra(i)})},[i]),ee.useEffect(()=>{const x=m.current;if(!x)return;const E=new ResizeObserver(()=>y(Math.round(x.clientWidth/24)*24));return E.observe(x),()=>E.disconnect()},[]);const d=Number(r.height_px??n),_=ee.useMemo(()=>({spec:{data:t,layout:e??{}},opts:{...r,width_in:Math.max(3,(S||640)/96),height_in:Math.max(2,d/96)}}),[t,e,r,S,d]);ee.useEffect(()=>{if(!S)return;let x=!0;const E=setTimeout(async()=>{try{const k=await(await Dp("/api/plot",_)).json();x&&(o(k),h(""))}catch(k){x&&h(k.message)}},120);return()=>{x=!1,clearTimeout(E)}},[_,S]);const v=(x,E)=>{const k={...r,[x]:E===""?void 0:E};s(k),sa(i,k)},M=(x,E,k)=>{var O;return v("series",{...r.series??{},[x]:{...((O=r.series)==null?void 0:O[x])??{},[E]:k}})},R=x=>{var ne;const E=a==null?void 0:a.meta,k=(ne=m.current)==null?void 0:ne.querySelector("svg");if(!E||!k)return;const O=k.getBoundingClientRect(),$=(x.clientX-O.left)/O.width,K=1-(x.clientY-O.top)/O.height,j=E.axes;if($<j.left||$>j.right||K<j.bottom||K>j.top){g(null);return}const Y=($-j.left)/(j.right-j.left),N=(K-j.bottom)/(j.top-j.bottom);let F=null;t.forEach((he,be)=>{const X=E.series[be];!X||!X.visible||X.axis!=="y"||(he.x??[]).forEach((te,le)=>{var Ye;const ce=(Ye=he.y)==null?void 0:Ye[le];if(typeof te!="number"||typeof ce!="number")return;const Ae=Ip(te,E.xlim,E.xlog),Ce=Ip(ce,E.ylim,E.ylog),ke=((Ae-Y)*O.width)**2+((Ce-N)*O.height)**2;(!F||ke<F.d)&&(F={d:ke,i:be,x:te,y:ce,px:Ae,py:Ce,name:X.name,color:X.color})})});const V=F&&F.d<30**2?F:null;g({fx:$,fy:K,x:Up(Y,E.xlim,E.xlog),y:Up(N,E.ylim,E.ylog),near:V,a:j})},A=async x=>{var $,K;const E=(sl(e==null?void 0:e.title)||((K=($=a==null?void 0:a.meta)==null?void 0:$.labels)==null?void 0:K.y)||"chart").replace(/[^\w-]+/g,"_");let k;if(x==="csv"){const j=Math.max(...t.map(F=>(F.x??[]).length)),Y=t.flatMap((F,V)=>[`${F.name??`series ${V+1}`} x`,`${F.name??`series ${V+1}`} y`]),N=Array.from({length:j},(F,V)=>t.flatMap(ne=>{var he,be;return[((he=ne.x)==null?void 0:he[V])??"",((be=ne.y)==null?void 0:be[V])??""]}).join(","));k=new Blob([[Y.map(F=>`"${F}"`).join(","),...N].join(`
`)],{type:"text/csv"})}else k=await(await Dp(`/api/plot/export/${x}`,{..._,dpi:Number(r.dpi??600)})).blob();const O=document.createElement("a");O.href=URL.createObjectURL(k),O.download=`${E}.${x}`,O.click(),URL.revokeObjectURL(O.href)},C=a==null?void 0:a.meta,P=(x,E)=>{var k;return((k=r[x])==null?void 0:k[E])??""},B=(x,E,k)=>{const O=[...r[x]??[null,null]];O[E]=k===""?null:Number(k),v(x,O.every($=>$===null)?void 0:O)};return c.jsxs("div",{className:"pchart",children:[c.jsxs("div",{className:"pbar",children:[c.jsx("button",{className:`chip ${u?"on":""}`,onClick:()=>f(!u),children:"Edit chart"}),["png","svg","pdf","csv"].map(x=>c.jsx("button",{className:"chip",onClick:()=>A(x),children:x.toUpperCase()},x))]}),c.jsxs("div",{ref:m,className:"plot",style:{minHeight:d},onMouseMove:R,onMouseLeave:()=>g(null),children:[a?c.jsx("div",{className:"svg",dangerouslySetInnerHTML:{__html:a.svg}}):c.jsx("div",{className:"ploading",style:{height:d},children:"Drawing chart…"}),p&&c.jsxs(c.Fragment,{children:[c.jsx("div",{className:"xhair v",style:{left:`${p.fx*100}%`,top:`${(1-p.a.top)*100}%`,bottom:`${p.a.bottom*100}%`}}),c.jsx("div",{className:"xhair h",style:{top:`${(1-p.fy)*100}%`,left:`${p.a.left*100}%`,right:`${(1-p.a.right)*100}%`}}),p.near&&c.jsx("div",{className:"xdot",style:{left:`${(p.a.left+p.near.px*(p.a.right-p.a.left))*100}%`,top:`${(1-(p.a.bottom+p.near.py*(p.a.top-p.a.bottom)))*100}%`,borderColor:p.near.color}}),c.jsx("div",{className:"xread mono",style:{left:`${Math.min(p.fx*100+1,70)}%`,top:`${(1-p.a.top)*100+1}%`},children:p.near?c.jsxs(c.Fragment,{children:[c.jsx("b",{style:{color:p.near.color},children:p.near.name}),c.jsx("br",{}),"x ",Ni(p.near.x)," · y ",Ni(p.near.y)]}):c.jsxs(c.Fragment,{children:["x ",Ni(p.x)," · y ",Ni(p.y)]})})]})]}),l&&c.jsx("div",{className:"error",children:l}),u&&C&&c.jsxs("div",{className:"peditor",children:[c.jsxs("div",{className:"form",children:[c.jsxs("label",{children:["Title",c.jsx("input",{value:r.title??"",placeholder:C.labels.title,onChange:x=>v("title",x.target.value)})]}),c.jsxs("label",{children:["X axis title",c.jsx("input",{value:r.xlabel??"",placeholder:C.labels.x,onChange:x=>v("xlabel",x.target.value)})]}),c.jsxs("label",{children:["Y axis title",c.jsx("input",{value:r.ylabel??"",placeholder:C.labels.y,onChange:x=>v("ylabel",x.target.value)})]}),C.labels.y2!==null&&c.jsxs("label",{children:["Right Y axis title",c.jsx("input",{value:r.y2label??"",placeholder:C.labels.y2,onChange:x=>v("y2label",x.target.value)})]}),c.jsxs("label",{children:["X min / max",c.jsxs("span",{className:"pair",children:[c.jsx("input",{type:"number",step:"any",value:P("xlim",0),placeholder:Ni(C.xlim[0]),onChange:x=>B("xlim",0,x.target.value)}),c.jsx("input",{type:"number",step:"any",value:P("xlim",1),placeholder:Ni(C.xlim[1]),onChange:x=>B("xlim",1,x.target.value)})]})]}),c.jsxs("label",{children:["Y min / max",c.jsxs("span",{className:"pair",children:[c.jsx("input",{type:"number",step:"any",value:P("ylim",0),placeholder:Ni(C.ylim[0]),onChange:x=>B("ylim",0,x.target.value)}),c.jsx("input",{type:"number",step:"any",value:P("ylim",1),placeholder:Ni(C.ylim[1]),onChange:x=>B("ylim",1,x.target.value)})]})]}),c.jsxs("label",{children:["Scale",c.jsxs("span",{className:"pair",children:[c.jsxs("select",{value:String(r.xlog??C.xlog),onChange:x=>v("xlog",x.target.value==="true"),children:[c.jsx("option",{value:"false",children:"X linear"}),c.jsx("option",{value:"true",children:"X log"})]}),c.jsxs("select",{value:String(r.ylog??C.ylog),onChange:x=>v("ylog",x.target.value==="true"),children:[c.jsx("option",{value:"false",children:"Y linear"}),c.jsx("option",{value:"true",children:"Y log"})]})]})]}),c.jsxs("label",{children:["Legend",c.jsx("select",{value:r.legend??"best",onChange:x=>v("legend",x.target.value),children:["best","upper right","upper left","lower right","lower left","center right","outside","below","none"].map(x=>c.jsx("option",{children:x},x))})]}),c.jsxs("label",{children:["Axis style",c.jsxs("select",{value:r.axis_style??"prism",onChange:x=>v("axis_style",x.target.value),children:[c.jsx("option",{value:"prism",children:"Prism (open, ticks out)"}),c.jsx("option",{value:"box",children:"Box (closed, ticks in)"})]})]}),c.jsxs("label",{children:["Grid",c.jsxs("select",{value:r.grid??"none",onChange:x=>v("grid",x.target.value),children:[c.jsx("option",{value:"none",children:"None"}),c.jsx("option",{value:"major",children:"Major"}),c.jsx("option",{value:"both",children:"Major + minor"})]})]}),c.jsxs("label",{className:"check",children:[c.jsx("input",{type:"checkbox",checked:!!r.minor_ticks,onChange:x=>v("minor_ticks",x.target.checked)}),"Minor ticks"]}),c.jsxs("label",{className:"check",children:[c.jsx("input",{type:"checkbox",checked:!!r.frame_legend,onChange:x=>v("frame_legend",x.target.checked)}),"Legend frame"]}),c.jsxs("label",{children:["Colour scheme",c.jsx("select",{value:r.palette??"engineering",onChange:x=>v("palette",x.target.value),children:["engineering","prism","colorblind","grayscale"].map(x=>c.jsx("option",{children:x},x))})]}),c.jsxs("label",{children:["Font size ",r.font_size??11," pt",c.jsx("input",{type:"range",min:7,max:18,value:r.font_size??11,onChange:x=>v("font_size",Number(x.target.value))})]}),c.jsxs("label",{children:["Line width ",r.line_width??1.8,c.jsx("input",{type:"range",min:.5,max:4,step:.1,value:r.line_width??1.8,onChange:x=>v("line_width",Number(x.target.value))})]}),c.jsxs("label",{children:["Marker size ",r.marker_size??6,c.jsx("input",{type:"range",min:2,max:14,step:.5,value:r.marker_size??6,onChange:x=>v("marker_size",Number(x.target.value))})]}),c.jsxs("label",{children:["Height ",d," px",c.jsx("input",{type:"range",min:200,max:800,step:20,value:d,onChange:x=>v("height_px",Number(x.target.value))})]}),c.jsxs("label",{children:["PNG resolution",c.jsx("select",{value:String(r.dpi??600),onChange:x=>v("dpi",Number(x.target.value)),children:[150,300,600,1200].map(x=>c.jsxs("option",{value:x,children:[x," dpi"]},x))})]})]}),c.jsxs("table",{className:"t",style:{marginTop:12},children:[c.jsx("thead",{children:c.jsxs("tr",{children:[c.jsx("th",{children:"Show"}),c.jsx("th",{children:"Series"}),c.jsx("th",{children:"Colour"}),c.jsx("th",{children:"Marker"}),c.jsx("th",{children:"Line"})]})}),c.jsx("tbody",{children:C.series.map((x,E)=>{var k,O,$,K,j,Y;return c.jsxs("tr",{children:[c.jsx("td",{children:c.jsx("input",{type:"checkbox",checked:x.visible,onChange:N=>M(E,"visible",N.target.checked)})}),c.jsx("td",{children:c.jsx("input",{className:"inp",value:((O=(k=r.series)==null?void 0:k[E])==null?void 0:O.name)??"",placeholder:x.name,onChange:N=>M(E,"name",N.target.value)})}),c.jsx("td",{children:c.jsx("input",{type:"color",value:x.color.length===7?x.color:"#000000",onChange:N=>M(E,"color",N.target.value)})}),c.jsx("td",{children:c.jsx("select",{className:"inp",value:((K=($=r.series)==null?void 0:$[E])==null?void 0:K.marker)??x.marker,onChange:N=>M(E,"marker",N.target.value),children:Ny.map(N=>c.jsx("option",{value:N,children:Ly[N]},N))})}),c.jsx("td",{children:c.jsx("select",{className:"inp",value:((Y=(j=r.series)==null?void 0:j[E])==null?void 0:Y.dash)??x.dash,onChange:N=>M(E,"dash",N.target.value),children:["solid","dash","dot","dashdot"].map(N=>c.jsx("option",{children:N},N))})})]},E)})})]}),c.jsxs("div",{className:"row",style:{marginTop:10},children:[c.jsx("button",{className:"btn",onClick:()=>{const{series:x,title:E,xlabel:k,ylabel:O,y2label:$,xlim:K,ylim:j,...Y}=r;sa(ia,Y)},children:"Use style for all charts"}),c.jsx("button",{className:"btn",onClick:()=>{s(ra(ia)),sa(i,{})},children:"Reset this chart"}),c.jsx("button",{className:"btn",onClick:()=>{sa(ia,{}),s({}),sa(i,{})},children:"Reset all styles"}),c.jsx("span",{className:"muted small",children:"Edits are saved automatically on this computer."})]})]})]})}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const ef="169",Cs={ROTATE:0,DOLLY:1,PAN:2},_s={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Dy=0,Fp=1,Iy=2,tv=1,Uy=2,fi=3,sr=0,hn=1,Ln=2,tr=0,As=1,kp=2,Op=3,zp=4,Fy=5,Sr=100,ky=101,Oy=102,zy=103,By=104,jy=200,Hy=201,Vy=202,Gy=203,_d=204,vd=205,Wy=206,Xy=207,$y=208,qy=209,Yy=210,Ky=211,Zy=212,Qy=213,Jy=214,xd=0,yd=1,Sd=2,ks=3,Md=4,Ed=5,wd=6,Td=7,nv=0,eS=1,tS=2,nr=0,nS=1,iS=2,rS=3,sS=4,aS=5,oS=6,lS=7,iv=300,Os=301,zs=302,Cd=303,Ad=304,cc=306,bd=1e3,Cr=1001,Rd=1002,In=1003,cS=1004,Mo=1005,Xn=1006,Wc=1007,Ar=1008,Ti=1009,rv=1010,sv=1011,$a=1012,tf=1013,Ur=1014,vi=1015,Ja=1016,nf=1017,rf=1018,Bs=1020,av=35902,ov=1021,lv=1022,qn=1023,cv=1024,uv=1025,bs=1026,js=1027,dv=1028,sf=1029,hv=1030,af=1031,of=1033,al=33776,ol=33777,ll=33778,cl=33779,Pd=35840,Nd=35841,Ld=35842,Dd=35843,Id=36196,Ud=37492,Fd=37496,kd=37808,Od=37809,zd=37810,Bd=37811,jd=37812,Hd=37813,Vd=37814,Gd=37815,Wd=37816,Xd=37817,$d=37818,qd=37819,Yd=37820,Kd=37821,ul=36492,Zd=36494,Qd=36495,fv=36283,Jd=36284,eh=36285,th=36286,uS=3200,dS=3201,pv=0,hS=1,Vi="",ei="srgb",ur="srgb-linear",lf="display-p3",uc="display-p3-linear",zl="linear",dt="srgb",Bl="rec709",jl="p3",Gr=7680,Bp=519,fS=512,pS=513,mS=514,mv=515,gS=516,_S=517,vS=518,xS=519,jp=35044,Hp="300 es",xi=2e3,Hl=2001;class Br{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Gt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],dl=Math.PI/180,nh=180/Math.PI;function eo(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Gt[t&255]+Gt[t>>8&255]+Gt[t>>16&255]+Gt[t>>24&255]+"-"+Gt[e&255]+Gt[e>>8&255]+"-"+Gt[e>>16&15|64]+Gt[e>>24&255]+"-"+Gt[n&63|128]+Gt[n>>8&255]+"-"+Gt[n>>16&255]+Gt[n>>24&255]+Gt[i&255]+Gt[i>>8&255]+Gt[i>>16&255]+Gt[i>>24&255]).toLowerCase()}function $t(t,e,n){return Math.max(e,Math.min(n,t))}function yS(t,e){return(t%e+e)%e}function Xc(t,e,n){return(1-n)*t+n*e}function aa(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function rn(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}const SS={DEG2RAD:dl};class Ne{constructor(e=0,n=0){Ne.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos($t(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class ze{constructor(e,n,i,r,s,a,o,l,h){ze.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,h)}set(e,n,i,r,s,a,o,l,h){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=n,u[4]=s,u[5]=l,u[6]=i,u[7]=a,u[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[3],l=i[6],h=i[1],u=i[4],f=i[7],p=i[2],g=i[5],S=i[8],y=r[0],m=r[3],d=r[6],_=r[1],v=r[4],M=r[7],R=r[2],A=r[5],C=r[8];return s[0]=a*y+o*_+l*R,s[3]=a*m+o*v+l*A,s[6]=a*d+o*M+l*C,s[1]=h*y+u*_+f*R,s[4]=h*m+u*v+f*A,s[7]=h*d+u*M+f*C,s[2]=p*y+g*_+S*R,s[5]=p*m+g*v+S*A,s[8]=p*d+g*M+S*C,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],h=e[7],u=e[8];return n*a*u-n*o*h-i*s*u+i*o*l+r*s*h-r*a*l}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],h=e[7],u=e[8],f=u*a-o*h,p=o*l-u*s,g=h*s-a*l,S=n*f+i*p+r*g;if(S===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/S;return e[0]=f*y,e[1]=(r*h-u*i)*y,e[2]=(o*i-r*a)*y,e[3]=p*y,e[4]=(u*n-r*l)*y,e[5]=(r*s-o*n)*y,e[6]=g*y,e[7]=(i*l-h*n)*y,e[8]=(a*n-i*s)*y,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,a,o){const l=Math.cos(s),h=Math.sin(s);return this.set(i*l,i*h,-i*(l*a+h*o)+a+e,-r*h,r*l,-r*(-h*a+l*o)+o+n,0,0,1),this}scale(e,n){return this.premultiply($c.makeScale(e,n)),this}rotate(e){return this.premultiply($c.makeRotation(-e)),this}translate(e,n){return this.premultiply($c.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const $c=new ze;function gv(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function Vl(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function MS(){const t=Vl("canvas");return t.style.display="block",t}const Vp={};function hl(t){t in Vp||(Vp[t]=!0,console.warn(t))}function ES(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}function wS(t){const e=t.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function TS(t){const e=t.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Gp=new ze().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Wp=new ze().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),oa={[ur]:{transfer:zl,primaries:Bl,luminanceCoefficients:[.2126,.7152,.0722],toReference:t=>t,fromReference:t=>t},[ei]:{transfer:dt,primaries:Bl,luminanceCoefficients:[.2126,.7152,.0722],toReference:t=>t.convertSRGBToLinear(),fromReference:t=>t.convertLinearToSRGB()},[uc]:{transfer:zl,primaries:jl,luminanceCoefficients:[.2289,.6917,.0793],toReference:t=>t.applyMatrix3(Wp),fromReference:t=>t.applyMatrix3(Gp)},[lf]:{transfer:dt,primaries:jl,luminanceCoefficients:[.2289,.6917,.0793],toReference:t=>t.convertSRGBToLinear().applyMatrix3(Wp),fromReference:t=>t.applyMatrix3(Gp).convertLinearToSRGB()}},CS=new Set([ur,uc]),Je={enabled:!0,_workingColorSpace:ur,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(t){if(!CS.has(t))throw new Error(`Unsupported working color space, "${t}".`);this._workingColorSpace=t},convert:function(t,e,n){if(this.enabled===!1||e===n||!e||!n)return t;const i=oa[e].toReference,r=oa[n].fromReference;return r(i(t))},fromWorkingColorSpace:function(t,e){return this.convert(t,this._workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this._workingColorSpace)},getPrimaries:function(t){return oa[t].primaries},getTransfer:function(t){return t===Vi?zl:oa[t].transfer},getLuminanceCoefficients:function(t,e=this._workingColorSpace){return t.fromArray(oa[e].luminanceCoefficients)}};function Rs(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function qc(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let Wr;class AS{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Wr===void 0&&(Wr=Vl("canvas")),Wr.width=e.width,Wr.height=e.height;const i=Wr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Wr}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=Vl("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=Rs(s[a]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(Rs(n[i]/255)*255):n[i]=Rs(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let bS=0;class _v{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:bS++}),this.uuid=eo(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Yc(r[a].image)):s.push(Yc(r[a]))}else s=Yc(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function Yc(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?AS.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let RS=0;class fn extends Br{constructor(e=fn.DEFAULT_IMAGE,n=fn.DEFAULT_MAPPING,i=Cr,r=Cr,s=Xn,a=Ar,o=qn,l=Ti,h=fn.DEFAULT_ANISOTROPY,u=Vi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:RS++}),this.uuid=eo(),this.name="",this.source=new _v(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ne(0,0),this.repeat=new Ne(1,1),this.center=new Ne(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new ze,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==iv)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case bd:e.x=e.x-Math.floor(e.x);break;case Cr:e.x=e.x<0?0:1;break;case Rd:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case bd:e.y=e.y-Math.floor(e.y);break;case Cr:e.y=e.y<0?0:1;break;case Rd:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}fn.DEFAULT_IMAGE=null;fn.DEFAULT_MAPPING=iv;fn.DEFAULT_ANISOTROPY=1;class St{constructor(e=0,n=0,i=0,r=1){St.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*n+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*n+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*n+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*n+a[7]*i+a[11]*r+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const l=e.elements,h=l[0],u=l[4],f=l[8],p=l[1],g=l[5],S=l[9],y=l[2],m=l[6],d=l[10];if(Math.abs(u-p)<.01&&Math.abs(f-y)<.01&&Math.abs(S-m)<.01){if(Math.abs(u+p)<.1&&Math.abs(f+y)<.1&&Math.abs(S+m)<.1&&Math.abs(h+g+d-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const v=(h+1)/2,M=(g+1)/2,R=(d+1)/2,A=(u+p)/4,C=(f+y)/4,P=(S+m)/4;return v>M&&v>R?v<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(v),r=A/i,s=C/i):M>R?M<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(M),i=A/r,s=P/r):R<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(R),i=C/s,r=P/s),this.set(i,r,s,n),this}let _=Math.sqrt((m-S)*(m-S)+(f-y)*(f-y)+(p-u)*(p-u));return Math.abs(_)<.001&&(_=1),this.x=(m-S)/_,this.y=(f-y)/_,this.z=(p-u)/_,this.w=Math.acos((h+g+d-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class PS extends Br{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new St(0,0,e,n),this.scissorTest=!1,this.viewport=new St(0,0,e,n);const r={width:e,height:n,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Xn,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new fn(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new _v(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Fr extends PS{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class vv extends fn{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=In,this.minFilter=In,this.wrapR=Cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class NS extends fn{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=In,this.minFilter=In,this.wrapR=Cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class kr{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,a,o){let l=i[r+0],h=i[r+1],u=i[r+2],f=i[r+3];const p=s[a+0],g=s[a+1],S=s[a+2],y=s[a+3];if(o===0){e[n+0]=l,e[n+1]=h,e[n+2]=u,e[n+3]=f;return}if(o===1){e[n+0]=p,e[n+1]=g,e[n+2]=S,e[n+3]=y;return}if(f!==y||l!==p||h!==g||u!==S){let m=1-o;const d=l*p+h*g+u*S+f*y,_=d>=0?1:-1,v=1-d*d;if(v>Number.EPSILON){const R=Math.sqrt(v),A=Math.atan2(R,d*_);m=Math.sin(m*A)/R,o=Math.sin(o*A)/R}const M=o*_;if(l=l*m+p*M,h=h*m+g*M,u=u*m+S*M,f=f*m+y*M,m===1-o){const R=1/Math.sqrt(l*l+h*h+u*u+f*f);l*=R,h*=R,u*=R,f*=R}}e[n]=l,e[n+1]=h,e[n+2]=u,e[n+3]=f}static multiplyQuaternionsFlat(e,n,i,r,s,a){const o=i[r],l=i[r+1],h=i[r+2],u=i[r+3],f=s[a],p=s[a+1],g=s[a+2],S=s[a+3];return e[n]=o*S+u*f+l*g-h*p,e[n+1]=l*S+u*p+h*f-o*g,e[n+2]=h*S+u*g+o*p-l*f,e[n+3]=u*S-o*f-l*p-h*g,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,l=Math.sin,h=o(i/2),u=o(r/2),f=o(s/2),p=l(i/2),g=l(r/2),S=l(s/2);switch(a){case"XYZ":this._x=p*u*f+h*g*S,this._y=h*g*f-p*u*S,this._z=h*u*S+p*g*f,this._w=h*u*f-p*g*S;break;case"YXZ":this._x=p*u*f+h*g*S,this._y=h*g*f-p*u*S,this._z=h*u*S-p*g*f,this._w=h*u*f+p*g*S;break;case"ZXY":this._x=p*u*f-h*g*S,this._y=h*g*f+p*u*S,this._z=h*u*S+p*g*f,this._w=h*u*f-p*g*S;break;case"ZYX":this._x=p*u*f-h*g*S,this._y=h*g*f+p*u*S,this._z=h*u*S-p*g*f,this._w=h*u*f+p*g*S;break;case"YZX":this._x=p*u*f+h*g*S,this._y=h*g*f+p*u*S,this._z=h*u*S-p*g*f,this._w=h*u*f-p*g*S;break;case"XZY":this._x=p*u*f-h*g*S,this._y=h*g*f-p*u*S,this._z=h*u*S+p*g*f,this._w=h*u*f+p*g*S;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],a=n[1],o=n[5],l=n[9],h=n[2],u=n[6],f=n[10],p=i+o+f;if(p>0){const g=.5/Math.sqrt(p+1);this._w=.25/g,this._x=(u-l)*g,this._y=(s-h)*g,this._z=(a-r)*g}else if(i>o&&i>f){const g=2*Math.sqrt(1+i-o-f);this._w=(u-l)/g,this._x=.25*g,this._y=(r+a)/g,this._z=(s+h)/g}else if(o>f){const g=2*Math.sqrt(1+o-i-f);this._w=(s-h)/g,this._x=(r+a)/g,this._y=.25*g,this._z=(l+u)/g}else{const g=2*Math.sqrt(1+f-i-o);this._w=(a-r)/g,this._x=(s+h)/g,this._y=(l+u)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs($t(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,a=e._w,o=n._x,l=n._y,h=n._z,u=n._w;return this._x=i*u+a*o+r*h-s*l,this._y=r*u+a*l+s*o-i*h,this._z=s*u+a*h+i*l-r*o,this._w=a*u-i*o-r*l-s*h,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+i*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;const l=1-o*o;if(l<=Number.EPSILON){const g=1-n;return this._w=g*a+n*this._w,this._x=g*i+n*this._x,this._y=g*r+n*this._y,this._z=g*s+n*this._z,this.normalize(),this}const h=Math.sqrt(l),u=Math.atan2(h,o),f=Math.sin((1-n)*u)/h,p=Math.sin(n*u)/h;return this._w=a*f+this._w*p,this._x=i*f+this._x*p,this._y=r*f+this._y*p,this._z=s*f+this._z*p,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class z{constructor(e=0,n=0,i=0){z.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(Xp.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(Xp.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,l=e.w,h=2*(a*r-o*i),u=2*(o*n-s*r),f=2*(s*i-a*n);return this.x=n+l*h+a*f-o*u,this.y=i+l*u+o*h-s*f,this.z=r+l*f+s*u-a*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,a=n.x,o=n.y,l=n.z;return this.x=r*l-s*o,this.y=s*a-i*l,this.z=i*o-r*a,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Kc.copy(this).projectOnVector(e),this.sub(Kc)}reflect(e){return this.sub(Kc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos($t(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Kc=new z,Xp=new kr;class to{constructor(e=new z(1/0,1/0,1/0),n=new z(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(Bn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(Bn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=Bn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Bn):Bn.fromBufferAttribute(s,a),Bn.applyMatrix4(e.matrixWorld),this.expandByPoint(Bn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Eo.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),Eo.copy(i.boundingBox)),Eo.applyMatrix4(e.matrixWorld),this.union(Eo)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Bn),Bn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(la),wo.subVectors(this.max,la),Xr.subVectors(e.a,la),$r.subVectors(e.b,la),qr.subVectors(e.c,la),Li.subVectors($r,Xr),Di.subVectors(qr,$r),hr.subVectors(Xr,qr);let n=[0,-Li.z,Li.y,0,-Di.z,Di.y,0,-hr.z,hr.y,Li.z,0,-Li.x,Di.z,0,-Di.x,hr.z,0,-hr.x,-Li.y,Li.x,0,-Di.y,Di.x,0,-hr.y,hr.x,0];return!Zc(n,Xr,$r,qr,wo)||(n=[1,0,0,0,1,0,0,0,1],!Zc(n,Xr,$r,qr,wo))?!1:(To.crossVectors(Li,Di),n=[To.x,To.y,To.z],Zc(n,Xr,$r,qr,wo))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Bn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Bn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(li[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),li[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),li[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),li[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),li[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),li[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),li[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),li[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(li),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const li=[new z,new z,new z,new z,new z,new z,new z,new z],Bn=new z,Eo=new to,Xr=new z,$r=new z,qr=new z,Li=new z,Di=new z,hr=new z,la=new z,wo=new z,To=new z,fr=new z;function Zc(t,e,n,i,r){for(let s=0,a=t.length-3;s<=a;s+=3){fr.fromArray(t,s);const o=r.x*Math.abs(fr.x)+r.y*Math.abs(fr.y)+r.z*Math.abs(fr.z),l=e.dot(fr),h=n.dot(fr),u=i.dot(fr);if(Math.max(-Math.max(l,h,u),Math.min(l,h,u))>o)return!1}return!0}const LS=new to,ca=new z,Qc=new z;class dc{constructor(e=new z,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):LS.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ca.subVectors(e,this.center);const n=ca.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(ca,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Qc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ca.copy(e.center).add(Qc)),this.expandByPoint(ca.copy(e.center).sub(Qc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ci=new z,Jc=new z,Co=new z,Ii=new z,eu=new z,Ao=new z,tu=new z;class cf{constructor(e=new z,n=new z(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ci)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=ci.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(ci.copy(this.origin).addScaledVector(this.direction,n),ci.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){Jc.copy(e).add(n).multiplyScalar(.5),Co.copy(n).sub(e).normalize(),Ii.copy(this.origin).sub(Jc);const s=e.distanceTo(n)*.5,a=-this.direction.dot(Co),o=Ii.dot(this.direction),l=-Ii.dot(Co),h=Ii.lengthSq(),u=Math.abs(1-a*a);let f,p,g,S;if(u>0)if(f=a*l-o,p=a*o-l,S=s*u,f>=0)if(p>=-S)if(p<=S){const y=1/u;f*=y,p*=y,g=f*(f+a*p+2*o)+p*(a*f+p+2*l)+h}else p=s,f=Math.max(0,-(a*p+o)),g=-f*f+p*(p+2*l)+h;else p=-s,f=Math.max(0,-(a*p+o)),g=-f*f+p*(p+2*l)+h;else p<=-S?(f=Math.max(0,-(-a*s+o)),p=f>0?-s:Math.min(Math.max(-s,-l),s),g=-f*f+p*(p+2*l)+h):p<=S?(f=0,p=Math.min(Math.max(-s,-l),s),g=p*(p+2*l)+h):(f=Math.max(0,-(a*s+o)),p=f>0?s:Math.min(Math.max(-s,-l),s),g=-f*f+p*(p+2*l)+h);else p=a>0?-s:s,f=Math.max(0,-(a*p+o)),g=-f*f+p*(p+2*l)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(Jc).addScaledVector(Co,p),g}intersectSphere(e,n){ci.subVectors(e.center,this.origin);const i=ci.dot(this.direction),r=ci.dot(ci)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,l=i+a;return l<0?null:o<0?this.at(l,n):this.at(o,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,a,o,l;const h=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,p=this.origin;return h>=0?(i=(e.min.x-p.x)*h,r=(e.max.x-p.x)*h):(i=(e.max.x-p.x)*h,r=(e.min.x-p.x)*h),u>=0?(s=(e.min.y-p.y)*u,a=(e.max.y-p.y)*u):(s=(e.max.y-p.y)*u,a=(e.min.y-p.y)*u),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),f>=0?(o=(e.min.z-p.z)*f,l=(e.max.z-p.z)*f):(o=(e.max.z-p.z)*f,l=(e.min.z-p.z)*f),i>l||o>r)||((o>i||i!==i)&&(i=o),(l<r||r!==r)&&(r=l),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,ci)!==null}intersectTriangle(e,n,i,r,s){eu.subVectors(n,e),Ao.subVectors(i,e),tu.crossVectors(eu,Ao);let a=this.direction.dot(tu),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ii.subVectors(this.origin,e);const l=o*this.direction.dot(Ao.crossVectors(Ii,Ao));if(l<0)return null;const h=o*this.direction.dot(eu.cross(Ii));if(h<0||l+h>a)return null;const u=-o*Ii.dot(tu);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class _t{constructor(e,n,i,r,s,a,o,l,h,u,f,p,g,S,y,m){_t.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,l,h,u,f,p,g,S,y,m)}set(e,n,i,r,s,a,o,l,h,u,f,p,g,S,y,m){const d=this.elements;return d[0]=e,d[4]=n,d[8]=i,d[12]=r,d[1]=s,d[5]=a,d[9]=o,d[13]=l,d[2]=h,d[6]=u,d[10]=f,d[14]=p,d[3]=g,d[7]=S,d[11]=y,d[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new _t().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/Yr.setFromMatrixColumn(e,0).length(),s=1/Yr.setFromMatrixColumn(e,1).length(),a=1/Yr.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),l=Math.cos(r),h=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){const p=a*u,g=a*f,S=o*u,y=o*f;n[0]=l*u,n[4]=-l*f,n[8]=h,n[1]=g+S*h,n[5]=p-y*h,n[9]=-o*l,n[2]=y-p*h,n[6]=S+g*h,n[10]=a*l}else if(e.order==="YXZ"){const p=l*u,g=l*f,S=h*u,y=h*f;n[0]=p+y*o,n[4]=S*o-g,n[8]=a*h,n[1]=a*f,n[5]=a*u,n[9]=-o,n[2]=g*o-S,n[6]=y+p*o,n[10]=a*l}else if(e.order==="ZXY"){const p=l*u,g=l*f,S=h*u,y=h*f;n[0]=p-y*o,n[4]=-a*f,n[8]=S+g*o,n[1]=g+S*o,n[5]=a*u,n[9]=y-p*o,n[2]=-a*h,n[6]=o,n[10]=a*l}else if(e.order==="ZYX"){const p=a*u,g=a*f,S=o*u,y=o*f;n[0]=l*u,n[4]=S*h-g,n[8]=p*h+y,n[1]=l*f,n[5]=y*h+p,n[9]=g*h-S,n[2]=-h,n[6]=o*l,n[10]=a*l}else if(e.order==="YZX"){const p=a*l,g=a*h,S=o*l,y=o*h;n[0]=l*u,n[4]=y-p*f,n[8]=S*f+g,n[1]=f,n[5]=a*u,n[9]=-o*u,n[2]=-h*u,n[6]=g*f+S,n[10]=p-y*f}else if(e.order==="XZY"){const p=a*l,g=a*h,S=o*l,y=o*h;n[0]=l*u,n[4]=-f,n[8]=h*u,n[1]=p*f+y,n[5]=a*u,n[9]=g*f-S,n[2]=S*f-g,n[6]=o*u,n[10]=y*f+p}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(DS,e,IS)}lookAt(e,n,i){const r=this.elements;return _n.subVectors(e,n),_n.lengthSq()===0&&(_n.z=1),_n.normalize(),Ui.crossVectors(i,_n),Ui.lengthSq()===0&&(Math.abs(i.z)===1?_n.x+=1e-4:_n.z+=1e-4,_n.normalize(),Ui.crossVectors(i,_n)),Ui.normalize(),bo.crossVectors(_n,Ui),r[0]=Ui.x,r[4]=bo.x,r[8]=_n.x,r[1]=Ui.y,r[5]=bo.y,r[9]=_n.y,r[2]=Ui.z,r[6]=bo.z,r[10]=_n.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[4],l=i[8],h=i[12],u=i[1],f=i[5],p=i[9],g=i[13],S=i[2],y=i[6],m=i[10],d=i[14],_=i[3],v=i[7],M=i[11],R=i[15],A=r[0],C=r[4],P=r[8],B=r[12],x=r[1],E=r[5],k=r[9],O=r[13],$=r[2],K=r[6],j=r[10],Y=r[14],N=r[3],F=r[7],V=r[11],ne=r[15];return s[0]=a*A+o*x+l*$+h*N,s[4]=a*C+o*E+l*K+h*F,s[8]=a*P+o*k+l*j+h*V,s[12]=a*B+o*O+l*Y+h*ne,s[1]=u*A+f*x+p*$+g*N,s[5]=u*C+f*E+p*K+g*F,s[9]=u*P+f*k+p*j+g*V,s[13]=u*B+f*O+p*Y+g*ne,s[2]=S*A+y*x+m*$+d*N,s[6]=S*C+y*E+m*K+d*F,s[10]=S*P+y*k+m*j+d*V,s[14]=S*B+y*O+m*Y+d*ne,s[3]=_*A+v*x+M*$+R*N,s[7]=_*C+v*E+M*K+R*F,s[11]=_*P+v*k+M*j+R*V,s[15]=_*B+v*O+M*Y+R*ne,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],l=e[9],h=e[13],u=e[2],f=e[6],p=e[10],g=e[14],S=e[3],y=e[7],m=e[11],d=e[15];return S*(+s*l*f-r*h*f-s*o*p+i*h*p+r*o*g-i*l*g)+y*(+n*l*g-n*h*p+s*a*p-r*a*g+r*h*u-s*l*u)+m*(+n*h*f-n*o*g-s*a*f+i*a*g+s*o*u-i*h*u)+d*(-r*o*u-n*l*f+n*o*p+r*a*f-i*a*p+i*l*u)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],l=e[6],h=e[7],u=e[8],f=e[9],p=e[10],g=e[11],S=e[12],y=e[13],m=e[14],d=e[15],_=f*m*h-y*p*h+y*l*g-o*m*g-f*l*d+o*p*d,v=S*p*h-u*m*h-S*l*g+a*m*g+u*l*d-a*p*d,M=u*y*h-S*f*h+S*o*g-a*y*g-u*o*d+a*f*d,R=S*f*l-u*y*l-S*o*p+a*y*p+u*o*m-a*f*m,A=n*_+i*v+r*M+s*R;if(A===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/A;return e[0]=_*C,e[1]=(y*p*s-f*m*s-y*r*g+i*m*g+f*r*d-i*p*d)*C,e[2]=(o*m*s-y*l*s+y*r*h-i*m*h-o*r*d+i*l*d)*C,e[3]=(f*l*s-o*p*s-f*r*h+i*p*h+o*r*g-i*l*g)*C,e[4]=v*C,e[5]=(u*m*s-S*p*s+S*r*g-n*m*g-u*r*d+n*p*d)*C,e[6]=(S*l*s-a*m*s-S*r*h+n*m*h+a*r*d-n*l*d)*C,e[7]=(a*p*s-u*l*s+u*r*h-n*p*h-a*r*g+n*l*g)*C,e[8]=M*C,e[9]=(S*f*s-u*y*s-S*i*g+n*y*g+u*i*d-n*f*d)*C,e[10]=(a*y*s-S*o*s+S*i*h-n*y*h-a*i*d+n*o*d)*C,e[11]=(u*o*s-a*f*s-u*i*h+n*f*h+a*i*g-n*o*g)*C,e[12]=R*C,e[13]=(u*y*r-S*f*r+S*i*p-n*y*p-u*i*m+n*f*m)*C,e[14]=(S*o*r-a*y*r-S*i*l+n*y*l+a*i*m-n*o*m)*C,e[15]=(a*f*r-u*o*r+u*i*l-n*f*l-a*i*p+n*o*p)*C,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,a=e.x,o=e.y,l=e.z,h=s*a,u=s*o;return this.set(h*a+i,h*o-r*l,h*l+r*o,0,h*o+r*l,u*o+i,u*l-r*a,0,h*l-r*o,u*l+r*a,s*l*l+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,a=n._y,o=n._z,l=n._w,h=s+s,u=a+a,f=o+o,p=s*h,g=s*u,S=s*f,y=a*u,m=a*f,d=o*f,_=l*h,v=l*u,M=l*f,R=i.x,A=i.y,C=i.z;return r[0]=(1-(y+d))*R,r[1]=(g+M)*R,r[2]=(S-v)*R,r[3]=0,r[4]=(g-M)*A,r[5]=(1-(p+d))*A,r[6]=(m+_)*A,r[7]=0,r[8]=(S+v)*C,r[9]=(m-_)*C,r[10]=(1-(p+y))*C,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=Yr.set(r[0],r[1],r[2]).length();const a=Yr.set(r[4],r[5],r[6]).length(),o=Yr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],jn.copy(this);const h=1/s,u=1/a,f=1/o;return jn.elements[0]*=h,jn.elements[1]*=h,jn.elements[2]*=h,jn.elements[4]*=u,jn.elements[5]*=u,jn.elements[6]*=u,jn.elements[8]*=f,jn.elements[9]*=f,jn.elements[10]*=f,n.setFromRotationMatrix(jn),i.x=s,i.y=a,i.z=o,this}makePerspective(e,n,i,r,s,a,o=xi){const l=this.elements,h=2*s/(n-e),u=2*s/(i-r),f=(n+e)/(n-e),p=(i+r)/(i-r);let g,S;if(o===xi)g=-(a+s)/(a-s),S=-2*a*s/(a-s);else if(o===Hl)g=-a/(a-s),S=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=p,l[13]=0,l[2]=0,l[6]=0,l[10]=g,l[14]=S,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(e,n,i,r,s,a,o=xi){const l=this.elements,h=1/(n-e),u=1/(i-r),f=1/(a-s),p=(n+e)*h,g=(i+r)*u;let S,y;if(o===xi)S=(a+s)*f,y=-2*f;else if(o===Hl)S=s*f,y=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*h,l[4]=0,l[8]=0,l[12]=-p,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-g,l[2]=0,l[6]=0,l[10]=y,l[14]=-S,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const Yr=new z,jn=new _t,DS=new z(0,0,0),IS=new z(1,1,1),Ui=new z,bo=new z,_n=new z,$p=new _t,qp=new kr;class ai{constructor(e=0,n=0,i=0,r=ai.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],l=r[1],h=r[5],u=r[9],f=r[2],p=r[6],g=r[10];switch(n){case"XYZ":this._y=Math.asin($t(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,g),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(p,h),this._z=0);break;case"YXZ":this._x=Math.asin(-$t(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,g),this._z=Math.atan2(l,h)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin($t(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-f,g),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-$t(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(p,g),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin($t(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,h),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(o,g));break;case"XZY":this._z=Math.asin(-$t(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(p,h),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,g),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return $p.makeRotationFromQuaternion(e),this.setFromRotationMatrix($p,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return qp.setFromEuler(this),this.setFromQuaternion(qp,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}ai.DEFAULT_ORDER="XYZ";class xv{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let US=0;const Yp=new z,Kr=new kr,ui=new _t,Ro=new z,ua=new z,FS=new z,kS=new kr,Kp=new z(1,0,0),Zp=new z(0,1,0),Qp=new z(0,0,1),Jp={type:"added"},OS={type:"removed"},Zr={type:"childadded",child:null},nu={type:"childremoved",child:null};class kt extends Br{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:US++}),this.uuid=eo(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=kt.DEFAULT_UP.clone();const e=new z,n=new ai,i=new kr,r=new z(1,1,1);function s(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new _t},normalMatrix:{value:new ze}}),this.matrix=new _t,this.matrixWorld=new _t,this.matrixAutoUpdate=kt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=kt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new xv,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return Kr.setFromAxisAngle(e,n),this.quaternion.multiply(Kr),this}rotateOnWorldAxis(e,n){return Kr.setFromAxisAngle(e,n),this.quaternion.premultiply(Kr),this}rotateX(e){return this.rotateOnAxis(Kp,e)}rotateY(e){return this.rotateOnAxis(Zp,e)}rotateZ(e){return this.rotateOnAxis(Qp,e)}translateOnAxis(e,n){return Yp.copy(e).applyQuaternion(this.quaternion),this.position.add(Yp.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(Kp,e)}translateY(e){return this.translateOnAxis(Zp,e)}translateZ(e){return this.translateOnAxis(Qp,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(ui.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?Ro.copy(e):Ro.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),ua.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ui.lookAt(ua,Ro,this.up):ui.lookAt(Ro,ua,this.up),this.quaternion.setFromRotationMatrix(ui),r&&(ui.extractRotation(r.matrixWorld),Kr.setFromRotationMatrix(ui),this.quaternion.premultiply(Kr.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Jp),Zr.child=e,this.dispatchEvent(Zr),Zr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(OS),nu.child=e,this.dispatchEvent(nu),nu.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),ui.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),ui.multiply(e.parent.matrixWorld)),e.applyMatrix4(ui),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Jp),Zr.child=e,this.dispatchEvent(Zr),Zr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,n);if(a!==void 0)return a}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ua,e,FS),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ua,kS,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let h=0,u=l.length;h<u;h++){const f=l[h];s(e.shapes,f)}else s(e.shapes,l)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,h=this.material.length;l<h;l++)o.push(s(e.materials,this.material[l]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];r.animations.push(s(e.animations,l))}}if(n){const o=a(e.geometries),l=a(e.materials),h=a(e.textures),u=a(e.images),f=a(e.shapes),p=a(e.skeletons),g=a(e.animations),S=a(e.nodes);o.length>0&&(i.geometries=o),l.length>0&&(i.materials=l),h.length>0&&(i.textures=h),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),p.length>0&&(i.skeletons=p),g.length>0&&(i.animations=g),S.length>0&&(i.nodes=S)}return i.object=r,i;function a(o){const l=[];for(const h in o){const u=o[h];delete u.metadata,l.push(u)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}kt.DEFAULT_UP=new z(0,1,0);kt.DEFAULT_MATRIX_AUTO_UPDATE=!0;kt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Hn=new z,di=new z,iu=new z,hi=new z,Qr=new z,Jr=new z,em=new z,ru=new z,su=new z,au=new z,ou=new St,lu=new St,cu=new St;class $n{constructor(e=new z,n=new z,i=new z){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),Hn.subVectors(e,n),r.cross(Hn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){Hn.subVectors(r,n),di.subVectors(i,n),iu.subVectors(e,n);const a=Hn.dot(Hn),o=Hn.dot(di),l=Hn.dot(iu),h=di.dot(di),u=di.dot(iu),f=a*h-o*o;if(f===0)return s.set(0,0,0),null;const p=1/f,g=(h*l-o*u)*p,S=(a*u-o*l)*p;return s.set(1-g-S,S,g)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,hi)===null?!1:hi.x>=0&&hi.y>=0&&hi.x+hi.y<=1}static getInterpolation(e,n,i,r,s,a,o,l){return this.getBarycoord(e,n,i,r,hi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,hi.x),l.addScaledVector(a,hi.y),l.addScaledVector(o,hi.z),l)}static getInterpolatedAttribute(e,n,i,r,s,a){return ou.setScalar(0),lu.setScalar(0),cu.setScalar(0),ou.fromBufferAttribute(e,n),lu.fromBufferAttribute(e,i),cu.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(ou,s.x),a.addScaledVector(lu,s.y),a.addScaledVector(cu,s.z),a}static isFrontFacing(e,n,i,r){return Hn.subVectors(i,n),di.subVectors(e,n),Hn.cross(di).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Hn.subVectors(this.c,this.b),di.subVectors(this.a,this.b),Hn.cross(di).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return $n.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return $n.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return $n.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return $n.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return $n.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let a,o;Qr.subVectors(r,i),Jr.subVectors(s,i),ru.subVectors(e,i);const l=Qr.dot(ru),h=Jr.dot(ru);if(l<=0&&h<=0)return n.copy(i);su.subVectors(e,r);const u=Qr.dot(su),f=Jr.dot(su);if(u>=0&&f<=u)return n.copy(r);const p=l*f-u*h;if(p<=0&&l>=0&&u<=0)return a=l/(l-u),n.copy(i).addScaledVector(Qr,a);au.subVectors(e,s);const g=Qr.dot(au),S=Jr.dot(au);if(S>=0&&g<=S)return n.copy(s);const y=g*h-l*S;if(y<=0&&h>=0&&S<=0)return o=h/(h-S),n.copy(i).addScaledVector(Jr,o);const m=u*S-g*f;if(m<=0&&f-u>=0&&g-S>=0)return em.subVectors(s,r),o=(f-u)/(f-u+(g-S)),n.copy(r).addScaledVector(em,o);const d=1/(m+y+p);return a=y*d,o=p*d,n.copy(i).addScaledVector(Qr,a).addScaledVector(Jr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const yv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fi={h:0,s:0,l:0},Po={h:0,s:0,l:0};function uu(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class Be{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=ei){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=Je.workingColorSpace){return this.r=e,this.g=n,this.b=i,Je.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=Je.workingColorSpace){if(e=yS(e,1),n=$t(n,0,1),i=$t(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,a=2*i-s;this.r=uu(a,s,e+1/3),this.g=uu(a,s,e),this.b=uu(a,s,e-1/3)}return Je.toWorkingColorSpace(this,r),this}setStyle(e,n=ei){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=ei){const i=yv[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Rs(e.r),this.g=Rs(e.g),this.b=Rs(e.b),this}copyLinearToSRGB(e){return this.r=qc(e.r),this.g=qc(e.g),this.b=qc(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ei){return Je.fromWorkingColorSpace(Wt.copy(this),e),Math.round($t(Wt.r*255,0,255))*65536+Math.round($t(Wt.g*255,0,255))*256+Math.round($t(Wt.b*255,0,255))}getHexString(e=ei){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=Je.workingColorSpace){Je.fromWorkingColorSpace(Wt.copy(this),n);const i=Wt.r,r=Wt.g,s=Wt.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let l,h;const u=(o+a)/2;if(o===a)l=0,h=0;else{const f=a-o;switch(h=u<=.5?f/(a+o):f/(2-a-o),a){case i:l=(r-s)/f+(r<s?6:0);break;case r:l=(s-i)/f+2;break;case s:l=(i-r)/f+4;break}l/=6}return e.h=l,e.s=h,e.l=u,e}getRGB(e,n=Je.workingColorSpace){return Je.fromWorkingColorSpace(Wt.copy(this),n),e.r=Wt.r,e.g=Wt.g,e.b=Wt.b,e}getStyle(e=ei){Je.fromWorkingColorSpace(Wt.copy(this),e);const n=Wt.r,i=Wt.g,r=Wt.b;return e!==ei?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(Fi),this.setHSL(Fi.h+e,Fi.s+n,Fi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(Fi),e.getHSL(Po);const i=Xc(Fi.h,Po.h,n),r=Xc(Fi.s,Po.s,n),s=Xc(Fi.l,Po.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Wt=new Be;Be.NAMES=yv;let zS=0;class Xs extends Br{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:zS++}),this.uuid=eo(),this.name="",this.type="Material",this.blending=As,this.side=sr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=_d,this.blendDst=vd,this.blendEquation=Sr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Be(0,0,0),this.blendAlpha=0,this.depthFunc=ks,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Bp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Gr,this.stencilZFail=Gr,this.stencilZPass=Gr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==As&&(i.blending=this.blending),this.side!==sr&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==_d&&(i.blendSrc=this.blendSrc),this.blendDst!==vd&&(i.blendDst=this.blendDst),this.blendEquation!==Sr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==ks&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Bp&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Gr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Gr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Gr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const l=s[o];delete l.metadata,a.push(l)}return a}if(n){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Sv extends Xs{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Be(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ai,this.combine=nv,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Tt=new z,No=new Ne;class si{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=jp,this.updateRanges=[],this.gpuType=vi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)No.fromBufferAttribute(this,n),No.applyMatrix3(e),this.setXY(n,No.x,No.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Tt.fromBufferAttribute(this,n),Tt.applyMatrix3(e),this.setXYZ(n,Tt.x,Tt.y,Tt.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)Tt.fromBufferAttribute(this,n),Tt.applyMatrix4(e),this.setXYZ(n,Tt.x,Tt.y,Tt.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Tt.fromBufferAttribute(this,n),Tt.applyNormalMatrix(e),this.setXYZ(n,Tt.x,Tt.y,Tt.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Tt.fromBufferAttribute(this,n),Tt.transformDirection(e),this.setXYZ(n,Tt.x,Tt.y,Tt.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=aa(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=rn(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=aa(n,this.array)),n}setX(e,n){return this.normalized&&(n=rn(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=aa(n,this.array)),n}setY(e,n){return this.normalized&&(n=rn(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=aa(n,this.array)),n}setZ(e,n){return this.normalized&&(n=rn(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=aa(n,this.array)),n}setW(e,n){return this.normalized&&(n=rn(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=rn(n,this.array),i=rn(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=rn(n,this.array),i=rn(i,this.array),r=rn(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=rn(n,this.array),i=rn(i,this.array),r=rn(r,this.array),s=rn(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==jp&&(e.usage=this.usage),e}}class Mv extends si{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class Ev extends si{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class Nt extends si{constructor(e,n,i){super(new Float32Array(e),n,i)}}let BS=0;const Rn=new _t,du=new kt,es=new z,vn=new to,da=new to,It=new z;class An extends Br{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:BS++}),this.uuid=eo(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(gv(e)?Ev:Mv)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new ze().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Rn.makeRotationFromQuaternion(e),this.applyMatrix4(Rn),this}rotateX(e){return Rn.makeRotationX(e),this.applyMatrix4(Rn),this}rotateY(e){return Rn.makeRotationY(e),this.applyMatrix4(Rn),this}rotateZ(e){return Rn.makeRotationZ(e),this.applyMatrix4(Rn),this}translate(e,n,i){return Rn.makeTranslation(e,n,i),this.applyMatrix4(Rn),this}scale(e,n,i){return Rn.makeScale(e,n,i),this.applyMatrix4(Rn),this}lookAt(e){return du.lookAt(e),du.updateMatrix(),this.applyMatrix4(du.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(es).negate(),this.translate(es.x,es.y,es.z),this}setFromPoints(e){const n=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];n.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Nt(n,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new to);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new z(-1/0,-1/0,-1/0),new z(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];vn.setFromBufferAttribute(s),this.morphTargetsRelative?(It.addVectors(this.boundingBox.min,vn.min),this.boundingBox.expandByPoint(It),It.addVectors(this.boundingBox.max,vn.max),this.boundingBox.expandByPoint(It)):(this.boundingBox.expandByPoint(vn.min),this.boundingBox.expandByPoint(vn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new dc);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new z,1/0);return}if(e){const i=this.boundingSphere.center;if(vn.setFromBufferAttribute(e),n)for(let s=0,a=n.length;s<a;s++){const o=n[s];da.setFromBufferAttribute(o),this.morphTargetsRelative?(It.addVectors(vn.min,da.min),vn.expandByPoint(It),It.addVectors(vn.max,da.max),vn.expandByPoint(It)):(vn.expandByPoint(da.min),vn.expandByPoint(da.max))}vn.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)It.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(It));if(n)for(let s=0,a=n.length;s<a;s++){const o=n[s],l=this.morphTargetsRelative;for(let h=0,u=o.count;h<u;h++)It.fromBufferAttribute(o,h),l&&(es.fromBufferAttribute(e,h),It.add(es)),r=Math.max(r,i.distanceToSquared(It))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new si(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],l=[];for(let P=0;P<i.count;P++)o[P]=new z,l[P]=new z;const h=new z,u=new z,f=new z,p=new Ne,g=new Ne,S=new Ne,y=new z,m=new z;function d(P,B,x){h.fromBufferAttribute(i,P),u.fromBufferAttribute(i,B),f.fromBufferAttribute(i,x),p.fromBufferAttribute(s,P),g.fromBufferAttribute(s,B),S.fromBufferAttribute(s,x),u.sub(h),f.sub(h),g.sub(p),S.sub(p);const E=1/(g.x*S.y-S.x*g.y);isFinite(E)&&(y.copy(u).multiplyScalar(S.y).addScaledVector(f,-g.y).multiplyScalar(E),m.copy(f).multiplyScalar(g.x).addScaledVector(u,-S.x).multiplyScalar(E),o[P].add(y),o[B].add(y),o[x].add(y),l[P].add(m),l[B].add(m),l[x].add(m))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let P=0,B=_.length;P<B;++P){const x=_[P],E=x.start,k=x.count;for(let O=E,$=E+k;O<$;O+=3)d(e.getX(O+0),e.getX(O+1),e.getX(O+2))}const v=new z,M=new z,R=new z,A=new z;function C(P){R.fromBufferAttribute(r,P),A.copy(R);const B=o[P];v.copy(B),v.sub(R.multiplyScalar(R.dot(B))).normalize(),M.crossVectors(A,B);const E=M.dot(l[P])<0?-1:1;a.setXYZW(P,v.x,v.y,v.z,E)}for(let P=0,B=_.length;P<B;++P){const x=_[P],E=x.start,k=x.count;for(let O=E,$=E+k;O<$;O+=3)C(e.getX(O+0)),C(e.getX(O+1)),C(e.getX(O+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new si(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let p=0,g=i.count;p<g;p++)i.setXYZ(p,0,0,0);const r=new z,s=new z,a=new z,o=new z,l=new z,h=new z,u=new z,f=new z;if(e)for(let p=0,g=e.count;p<g;p+=3){const S=e.getX(p+0),y=e.getX(p+1),m=e.getX(p+2);r.fromBufferAttribute(n,S),s.fromBufferAttribute(n,y),a.fromBufferAttribute(n,m),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),o.fromBufferAttribute(i,S),l.fromBufferAttribute(i,y),h.fromBufferAttribute(i,m),o.add(u),l.add(u),h.add(u),i.setXYZ(S,o.x,o.y,o.z),i.setXYZ(y,l.x,l.y,l.z),i.setXYZ(m,h.x,h.y,h.z)}else for(let p=0,g=n.count;p<g;p+=3)r.fromBufferAttribute(n,p+0),s.fromBufferAttribute(n,p+1),a.fromBufferAttribute(n,p+2),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),i.setXYZ(p+0,u.x,u.y,u.z),i.setXYZ(p+1,u.x,u.y,u.z),i.setXYZ(p+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)It.fromBufferAttribute(e,n),It.normalize(),e.setXYZ(n,It.x,It.y,It.z)}toNonIndexed(){function e(o,l){const h=o.array,u=o.itemSize,f=o.normalized,p=new h.constructor(l.length*u);let g=0,S=0;for(let y=0,m=l.length;y<m;y++){o.isInterleavedBufferAttribute?g=l[y]*o.data.stride+o.offset:g=l[y]*u;for(let d=0;d<u;d++)p[S++]=h[g++]}return new si(p,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new An,i=this.index.array,r=this.attributes;for(const o in r){const l=r[o],h=e(l,i);n.setAttribute(o,h)}const s=this.morphAttributes;for(const o in s){const l=[],h=s[o];for(let u=0,f=h.length;u<f;u++){const p=h[u],g=e(p,i);l.push(g)}n.morphAttributes[o]=l}n.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const h=a[o];n.addGroup(h.start,h.count,h.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const h in l)l[h]!==void 0&&(e[h]=l[h]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const l in i){const h=i[l];e.data.attributes[l]=h.toJSON(e.data)}const r={};let s=!1;for(const l in this.morphAttributes){const h=this.morphAttributes[l],u=[];for(let f=0,p=h.length;f<p;f++){const g=h[f];u.push(g.toJSON(e.data))}u.length>0&&(r[l]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const h in r){const u=r[h];this.setAttribute(h,u.clone(n))}const s=e.morphAttributes;for(const h in s){const u=[],f=s[h];for(let p=0,g=f.length;p<g;p++)u.push(f[p].clone(n));this.morphAttributes[h]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let h=0,u=a.length;h<u;h++){const f=a[h];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const tm=new _t,pr=new cf,Lo=new dc,nm=new z,Do=new z,Io=new z,Uo=new z,hu=new z,Fo=new z,im=new z,ko=new z;class Mn extends kt{constructor(e=new An,n=new Sv){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){Fo.set(0,0,0);for(let l=0,h=s.length;l<h;l++){const u=o[l],f=s[l];u!==0&&(hu.fromBufferAttribute(f,e),a?Fo.addScaledVector(hu,u):Fo.addScaledVector(hu.sub(n),u))}n.add(Fo)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Lo.copy(i.boundingSphere),Lo.applyMatrix4(s),pr.copy(e.ray).recast(e.near),!(Lo.containsPoint(pr.origin)===!1&&(pr.intersectSphere(Lo,nm)===null||pr.origin.distanceToSquared(nm)>(e.far-e.near)**2))&&(tm.copy(s).invert(),pr.copy(e.ray).applyMatrix4(tm),!(i.boundingBox!==null&&pr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,pr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,a=this.material,o=s.index,l=s.attributes.position,h=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,p=s.groups,g=s.drawRange;if(o!==null)if(Array.isArray(a))for(let S=0,y=p.length;S<y;S++){const m=p[S],d=a[m.materialIndex],_=Math.max(m.start,g.start),v=Math.min(o.count,Math.min(m.start+m.count,g.start+g.count));for(let M=_,R=v;M<R;M+=3){const A=o.getX(M),C=o.getX(M+1),P=o.getX(M+2);r=Oo(this,d,e,i,h,u,f,A,C,P),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const S=Math.max(0,g.start),y=Math.min(o.count,g.start+g.count);for(let m=S,d=y;m<d;m+=3){const _=o.getX(m),v=o.getX(m+1),M=o.getX(m+2);r=Oo(this,a,e,i,h,u,f,_,v,M),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}else if(l!==void 0)if(Array.isArray(a))for(let S=0,y=p.length;S<y;S++){const m=p[S],d=a[m.materialIndex],_=Math.max(m.start,g.start),v=Math.min(l.count,Math.min(m.start+m.count,g.start+g.count));for(let M=_,R=v;M<R;M+=3){const A=M,C=M+1,P=M+2;r=Oo(this,d,e,i,h,u,f,A,C,P),r&&(r.faceIndex=Math.floor(M/3),r.face.materialIndex=m.materialIndex,n.push(r))}}else{const S=Math.max(0,g.start),y=Math.min(l.count,g.start+g.count);for(let m=S,d=y;m<d;m+=3){const _=m,v=m+1,M=m+2;r=Oo(this,a,e,i,h,u,f,_,v,M),r&&(r.faceIndex=Math.floor(m/3),n.push(r))}}}}function jS(t,e,n,i,r,s,a,o){let l;if(e.side===hn?l=i.intersectTriangle(a,s,r,!0,o):l=i.intersectTriangle(r,s,a,e.side===sr,o),l===null)return null;ko.copy(o),ko.applyMatrix4(t.matrixWorld);const h=n.ray.origin.distanceTo(ko);return h<n.near||h>n.far?null:{distance:h,point:ko.clone(),object:t}}function Oo(t,e,n,i,r,s,a,o,l,h){t.getVertexPosition(o,Do),t.getVertexPosition(l,Io),t.getVertexPosition(h,Uo);const u=jS(t,e,n,i,Do,Io,Uo,im);if(u){const f=new z;$n.getBarycoord(im,Do,Io,Uo,f),r&&(u.uv=$n.getInterpolatedAttribute(r,o,l,h,f,new Ne)),s&&(u.uv1=$n.getInterpolatedAttribute(s,o,l,h,f,new Ne)),a&&(u.normal=$n.getInterpolatedAttribute(a,o,l,h,f,new z),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const p={a:o,b:l,c:h,normal:new z,materialIndex:0};$n.getNormal(Do,Io,Uo,p.normal),u.face=p,u.barycoord=f}return u}class $s extends An{constructor(e=1,n=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const l=[],h=[],u=[],f=[];let p=0,g=0;S("z","y","x",-1,-1,i,n,e,a,s,0),S("z","y","x",1,-1,i,n,-e,a,s,1),S("x","z","y",1,1,e,i,n,r,a,2),S("x","z","y",1,-1,e,i,-n,r,a,3),S("x","y","z",1,-1,e,n,i,r,s,4),S("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(l),this.setAttribute("position",new Nt(h,3)),this.setAttribute("normal",new Nt(u,3)),this.setAttribute("uv",new Nt(f,2));function S(y,m,d,_,v,M,R,A,C,P,B){const x=M/C,E=R/P,k=M/2,O=R/2,$=A/2,K=C+1,j=P+1;let Y=0,N=0;const F=new z;for(let V=0;V<j;V++){const ne=V*E-O;for(let he=0;he<K;he++){const be=he*x-k;F[y]=be*_,F[m]=ne*v,F[d]=$,h.push(F.x,F.y,F.z),F[y]=0,F[m]=0,F[d]=A>0?1:-1,u.push(F.x,F.y,F.z),f.push(he/C),f.push(1-V/P),Y+=1}}for(let V=0;V<P;V++)for(let ne=0;ne<C;ne++){const he=p+ne+K*V,be=p+ne+K*(V+1),X=p+(ne+1)+K*(V+1),te=p+(ne+1)+K*V;l.push(he,be,te),l.push(be,X,te),N+=6}o.addGroup(g,N,B),g+=N,p+=Y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new $s(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Hs(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function Yt(t){const e={};for(let n=0;n<t.length;n++){const i=Hs(t[n]);for(const r in i)e[r]=i[r]}return e}function HS(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function wv(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}const VS={clone:Hs,merge:Yt};var GS=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,WS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ar extends Xs{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=GS,this.fragmentShader=WS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Hs(e.uniforms),this.uniformsGroups=HS(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?n.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?n.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[r]={type:"m4",value:a.toArray()}:n.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class Tv extends kt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new _t,this.projectionMatrix=new _t,this.projectionMatrixInverse=new _t,this.coordinateSystem=xi}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ki=new z,rm=new Ne,sm=new Ne;class yn extends Tv{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=nh*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(dl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return nh*2*Math.atan(Math.tan(dl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){ki.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ki.x,ki.y).multiplyScalar(-e/ki.z),ki.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ki.x,ki.y).multiplyScalar(-e/ki.z)}getViewSize(e,n){return this.getViewBounds(e,rm,sm),n.subVectors(sm,rm)}setViewOffset(e,n,i,r,s,a){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(dl*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,h=a.fullHeight;s+=a.offsetX*r/l,n-=a.offsetY*i/h,r*=a.width/l,i*=a.height/h}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const ts=-90,ns=1;class XS extends kt{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new yn(ts,ns,e,n);r.layers=this.layers,this.add(r);const s=new yn(ts,ns,e,n);s.layers=this.layers,this.add(s);const a=new yn(ts,ns,e,n);a.layers=this.layers,this.add(a);const o=new yn(ts,ns,e,n);o.layers=this.layers,this.add(o);const l=new yn(ts,ns,e,n);l.layers=this.layers,this.add(l);const h=new yn(ts,ns,e,n);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,a,o,l]=n;for(const h of n)this.remove(h);if(e===xi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===Hl)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of n)this.add(h),h.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,l,h,u]=this.children,f=e.getRenderTarget(),p=e.getActiveCubeFace(),g=e.getActiveMipmapLevel(),S=e.xr.enabled;e.xr.enabled=!1;const y=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,s),e.setRenderTarget(i,1,r),e.render(n,a),e.setRenderTarget(i,2,r),e.render(n,o),e.setRenderTarget(i,3,r),e.render(n,l),e.setRenderTarget(i,4,r),e.render(n,h),i.texture.generateMipmaps=y,e.setRenderTarget(i,5,r),e.render(n,u),e.setRenderTarget(f,p,g),e.xr.enabled=S,i.texture.needsPMREMUpdate=!0}}class Cv extends fn{constructor(e,n,i,r,s,a,o,l,h,u){e=e!==void 0?e:[],n=n!==void 0?n:Os,super(e,n,i,r,s,a,o,l,h,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class $S extends Fr{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Cv(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:Xn}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},r=new $s(5,5,5),s=new ar({name:"CubemapFromEquirect",uniforms:Hs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:hn,blending:tr});s.uniforms.tEquirect.value=n;const a=new Mn(r,s),o=n.minFilter;return n.minFilter===Ar&&(n.minFilter=Xn),new XS(1,10,this).update(e,a),n.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(n,i,r);e.setRenderTarget(s)}}const fu=new z,qS=new z,YS=new ze;class Bi{constructor(e=new z(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=fu.subVectors(i,n).cross(qS.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(fu),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||YS.getNormalMatrix(e),r=this.coplanarPoint(fu).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const mr=new dc,zo=new z;class uf{constructor(e=new Bi,n=new Bi,i=new Bi,r=new Bi,s=new Bi,a=new Bi){this.planes=[e,n,i,r,s,a]}set(e,n,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(n),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=xi){const i=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],l=r[3],h=r[4],u=r[5],f=r[6],p=r[7],g=r[8],S=r[9],y=r[10],m=r[11],d=r[12],_=r[13],v=r[14],M=r[15];if(i[0].setComponents(l-s,p-h,m-g,M-d).normalize(),i[1].setComponents(l+s,p+h,m+g,M+d).normalize(),i[2].setComponents(l+a,p+u,m+S,M+_).normalize(),i[3].setComponents(l-a,p-u,m-S,M-_).normalize(),i[4].setComponents(l-o,p-f,m-y,M-v).normalize(),n===xi)i[5].setComponents(l+o,p+f,m+y,M+v).normalize();else if(n===Hl)i[5].setComponents(o,f,y,v).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),mr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),mr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(mr)}intersectsSprite(e){return mr.center.set(0,0,0),mr.radius=.7071067811865476,mr.applyMatrix4(e.matrixWorld),this.intersectsSphere(mr)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(zo.x=r.normal.x>0?e.max.x:e.min.x,zo.y=r.normal.y>0?e.max.y:e.min.y,zo.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(zo)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Av(){let t=null,e=!1,n=null,i=null;function r(s,a){n(s,a),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function KS(t){const e=new WeakMap;function n(o,l){const h=o.array,u=o.usage,f=h.byteLength,p=t.createBuffer();t.bindBuffer(l,p),t.bufferData(l,h,u),o.onUploadCallback();let g;if(h instanceof Float32Array)g=t.FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?g=t.HALF_FLOAT:g=t.UNSIGNED_SHORT;else if(h instanceof Int16Array)g=t.SHORT;else if(h instanceof Uint32Array)g=t.UNSIGNED_INT;else if(h instanceof Int32Array)g=t.INT;else if(h instanceof Int8Array)g=t.BYTE;else if(h instanceof Uint8Array)g=t.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)g=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:p,type:g,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,l,h){const u=l.array,f=l.updateRanges;if(t.bindBuffer(h,o),f.length===0)t.bufferSubData(h,0,u);else{f.sort((g,S)=>g.start-S.start);let p=0;for(let g=1;g<f.length;g++){const S=f[p],y=f[g];y.start<=S.start+S.count+1?S.count=Math.max(S.count,y.start+y.count-S.start):(++p,f[p]=y)}f.length=p+1;for(let g=0,S=f.length;g<S;g++){const y=f[g];t.bufferSubData(h,y.start*u.BYTES_PER_ELEMENT,u,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(t.deleteBuffer(l.buffer),e.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const h=e.get(o);if(h===void 0)e.set(o,n(o,l));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,o,l),h.version=o.version}}return{get:r,remove:s,update:a}}class hc extends An{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,a=n/2,o=Math.floor(i),l=Math.floor(r),h=o+1,u=l+1,f=e/o,p=n/l,g=[],S=[],y=[],m=[];for(let d=0;d<u;d++){const _=d*p-a;for(let v=0;v<h;v++){const M=v*f-s;S.push(M,-_,0),y.push(0,0,1),m.push(v/o),m.push(1-d/l)}}for(let d=0;d<l;d++)for(let _=0;_<o;_++){const v=_+h*d,M=_+h*(d+1),R=_+1+h*(d+1),A=_+1+h*d;g.push(v,M,A),g.push(M,R,A)}this.setIndex(g),this.setAttribute("position",new Nt(S,3)),this.setAttribute("normal",new Nt(y,3)),this.setAttribute("uv",new Nt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new hc(e.width,e.height,e.widthSegments,e.heightSegments)}}var ZS=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,QS=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,JS=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,eM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,tM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,nM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,iM=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,rM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,sM=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,aM=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,oM=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,lM=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,cM=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,uM=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,dM=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,hM=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,fM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,pM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,mM=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,gM=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,_M=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,vM=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,xM=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,yM=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,SM=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,MM=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,EM=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,wM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,TM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,CM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,AM="gl_FragColor = linearToOutputTexel( gl_FragColor );",bM=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,RM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,PM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,NM=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,LM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,DM=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,IM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,UM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,FM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,kM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,OM=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,zM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,BM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,jM=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,HM=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,VM=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,GM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,WM=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,XM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,$M=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,qM=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,YM=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,KM=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,ZM=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,QM=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,JM=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,eE=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,tE=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,nE=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,iE=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,rE=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,sE=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,aE=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,oE=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,lE=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,cE=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,uE=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,dE=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,hE=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,fE=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,pE=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,mE=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,gE=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_E=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vE=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,xE=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,yE=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,SE=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,ME=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,EE=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,wE=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,TE=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,CE=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,AE=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,bE=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,RE=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,PE=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,NE=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,LE=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,DE=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,IE=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,UE=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,FE=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,kE=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,OE=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,zE=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,BE=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,jE=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,HE=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,VE=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,GE=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,WE=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
		
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
		
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		
		#else
		
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,XE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,$E=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,qE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,YE=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const KE=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,ZE=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,QE=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,JE=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ew=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,tw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,nw=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,iw=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,rw=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,sw=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,aw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,ow=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lw=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,cw=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,uw=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,dw=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hw=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,fw=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,pw=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,mw=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,gw=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,_w=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,vw=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,xw=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yw=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Sw=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mw=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ew=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ww=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Tw=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Cw=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Aw=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,bw=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Rw=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Oe={alphahash_fragment:ZS,alphahash_pars_fragment:QS,alphamap_fragment:JS,alphamap_pars_fragment:eM,alphatest_fragment:tM,alphatest_pars_fragment:nM,aomap_fragment:iM,aomap_pars_fragment:rM,batching_pars_vertex:sM,batching_vertex:aM,begin_vertex:oM,beginnormal_vertex:lM,bsdfs:cM,iridescence_fragment:uM,bumpmap_pars_fragment:dM,clipping_planes_fragment:hM,clipping_planes_pars_fragment:fM,clipping_planes_pars_vertex:pM,clipping_planes_vertex:mM,color_fragment:gM,color_pars_fragment:_M,color_pars_vertex:vM,color_vertex:xM,common:yM,cube_uv_reflection_fragment:SM,defaultnormal_vertex:MM,displacementmap_pars_vertex:EM,displacementmap_vertex:wM,emissivemap_fragment:TM,emissivemap_pars_fragment:CM,colorspace_fragment:AM,colorspace_pars_fragment:bM,envmap_fragment:RM,envmap_common_pars_fragment:PM,envmap_pars_fragment:NM,envmap_pars_vertex:LM,envmap_physical_pars_fragment:VM,envmap_vertex:DM,fog_vertex:IM,fog_pars_vertex:UM,fog_fragment:FM,fog_pars_fragment:kM,gradientmap_pars_fragment:OM,lightmap_pars_fragment:zM,lights_lambert_fragment:BM,lights_lambert_pars_fragment:jM,lights_pars_begin:HM,lights_toon_fragment:GM,lights_toon_pars_fragment:WM,lights_phong_fragment:XM,lights_phong_pars_fragment:$M,lights_physical_fragment:qM,lights_physical_pars_fragment:YM,lights_fragment_begin:KM,lights_fragment_maps:ZM,lights_fragment_end:QM,logdepthbuf_fragment:JM,logdepthbuf_pars_fragment:eE,logdepthbuf_pars_vertex:tE,logdepthbuf_vertex:nE,map_fragment:iE,map_pars_fragment:rE,map_particle_fragment:sE,map_particle_pars_fragment:aE,metalnessmap_fragment:oE,metalnessmap_pars_fragment:lE,morphinstance_vertex:cE,morphcolor_vertex:uE,morphnormal_vertex:dE,morphtarget_pars_vertex:hE,morphtarget_vertex:fE,normal_fragment_begin:pE,normal_fragment_maps:mE,normal_pars_fragment:gE,normal_pars_vertex:_E,normal_vertex:vE,normalmap_pars_fragment:xE,clearcoat_normal_fragment_begin:yE,clearcoat_normal_fragment_maps:SE,clearcoat_pars_fragment:ME,iridescence_pars_fragment:EE,opaque_fragment:wE,packing:TE,premultiplied_alpha_fragment:CE,project_vertex:AE,dithering_fragment:bE,dithering_pars_fragment:RE,roughnessmap_fragment:PE,roughnessmap_pars_fragment:NE,shadowmap_pars_fragment:LE,shadowmap_pars_vertex:DE,shadowmap_vertex:IE,shadowmask_pars_fragment:UE,skinbase_vertex:FE,skinning_pars_vertex:kE,skinning_vertex:OE,skinnormal_vertex:zE,specularmap_fragment:BE,specularmap_pars_fragment:jE,tonemapping_fragment:HE,tonemapping_pars_fragment:VE,transmission_fragment:GE,transmission_pars_fragment:WE,uv_pars_fragment:XE,uv_pars_vertex:$E,uv_vertex:qE,worldpos_vertex:YE,background_vert:KE,background_frag:ZE,backgroundCube_vert:QE,backgroundCube_frag:JE,cube_vert:ew,cube_frag:tw,depth_vert:nw,depth_frag:iw,distanceRGBA_vert:rw,distanceRGBA_frag:sw,equirect_vert:aw,equirect_frag:ow,linedashed_vert:lw,linedashed_frag:cw,meshbasic_vert:uw,meshbasic_frag:dw,meshlambert_vert:hw,meshlambert_frag:fw,meshmatcap_vert:pw,meshmatcap_frag:mw,meshnormal_vert:gw,meshnormal_frag:_w,meshphong_vert:vw,meshphong_frag:xw,meshphysical_vert:yw,meshphysical_frag:Sw,meshtoon_vert:Mw,meshtoon_frag:Ew,points_vert:ww,points_frag:Tw,shadow_vert:Cw,shadow_frag:Aw,sprite_vert:bw,sprite_frag:Rw},ue={common:{diffuse:{value:new Be(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new ze}},envmap:{envMap:{value:null},envMapRotation:{value:new ze},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new ze}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new ze}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new ze},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new ze},normalScale:{value:new Ne(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new ze},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new ze}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new ze}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new ze}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Be(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Be(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0},uvTransform:{value:new ze}},sprite:{diffuse:{value:new Be(16777215)},opacity:{value:1},center:{value:new Ne(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new ze},alphaMap:{value:null},alphaMapTransform:{value:new ze},alphaTest:{value:0}}},ti={basic:{uniforms:Yt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.fog]),vertexShader:Oe.meshbasic_vert,fragmentShader:Oe.meshbasic_frag},lambert:{uniforms:Yt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Be(0)}}]),vertexShader:Oe.meshlambert_vert,fragmentShader:Oe.meshlambert_frag},phong:{uniforms:Yt([ue.common,ue.specularmap,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,ue.lights,{emissive:{value:new Be(0)},specular:{value:new Be(1118481)},shininess:{value:30}}]),vertexShader:Oe.meshphong_vert,fragmentShader:Oe.meshphong_frag},standard:{uniforms:Yt([ue.common,ue.envmap,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.roughnessmap,ue.metalnessmap,ue.fog,ue.lights,{emissive:{value:new Be(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag},toon:{uniforms:Yt([ue.common,ue.aomap,ue.lightmap,ue.emissivemap,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.gradientmap,ue.fog,ue.lights,{emissive:{value:new Be(0)}}]),vertexShader:Oe.meshtoon_vert,fragmentShader:Oe.meshtoon_frag},matcap:{uniforms:Yt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,ue.fog,{matcap:{value:null}}]),vertexShader:Oe.meshmatcap_vert,fragmentShader:Oe.meshmatcap_frag},points:{uniforms:Yt([ue.points,ue.fog]),vertexShader:Oe.points_vert,fragmentShader:Oe.points_frag},dashed:{uniforms:Yt([ue.common,ue.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Oe.linedashed_vert,fragmentShader:Oe.linedashed_frag},depth:{uniforms:Yt([ue.common,ue.displacementmap]),vertexShader:Oe.depth_vert,fragmentShader:Oe.depth_frag},normal:{uniforms:Yt([ue.common,ue.bumpmap,ue.normalmap,ue.displacementmap,{opacity:{value:1}}]),vertexShader:Oe.meshnormal_vert,fragmentShader:Oe.meshnormal_frag},sprite:{uniforms:Yt([ue.sprite,ue.fog]),vertexShader:Oe.sprite_vert,fragmentShader:Oe.sprite_frag},background:{uniforms:{uvTransform:{value:new ze},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Oe.background_vert,fragmentShader:Oe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new ze}},vertexShader:Oe.backgroundCube_vert,fragmentShader:Oe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Oe.cube_vert,fragmentShader:Oe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Oe.equirect_vert,fragmentShader:Oe.equirect_frag},distanceRGBA:{uniforms:Yt([ue.common,ue.displacementmap,{referencePosition:{value:new z},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Oe.distanceRGBA_vert,fragmentShader:Oe.distanceRGBA_frag},shadow:{uniforms:Yt([ue.lights,ue.fog,{color:{value:new Be(0)},opacity:{value:1}}]),vertexShader:Oe.shadow_vert,fragmentShader:Oe.shadow_frag}};ti.physical={uniforms:Yt([ti.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new ze},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new ze},clearcoatNormalScale:{value:new Ne(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new ze},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new ze},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new ze},sheen:{value:0},sheenColor:{value:new Be(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new ze},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new ze},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new ze},transmissionSamplerSize:{value:new Ne},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new ze},attenuationDistance:{value:0},attenuationColor:{value:new Be(0)},specularColor:{value:new Be(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new ze},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new ze},anisotropyVector:{value:new Ne},anisotropyMap:{value:null},anisotropyMapTransform:{value:new ze}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag};const Bo={r:0,b:0,g:0},gr=new ai,Pw=new _t;function Nw(t,e,n,i,r,s,a){const o=new Be(0);let l=s===!0?0:1,h,u,f=null,p=0,g=null;function S(_){let v=_.isScene===!0?_.background:null;return v&&v.isTexture&&(v=(_.backgroundBlurriness>0?n:e).get(v)),v}function y(_){let v=!1;const M=S(_);M===null?d(o,l):M&&M.isColor&&(d(M,1),v=!0);const R=t.xr.getEnvironmentBlendMode();R==="additive"?i.buffers.color.setClear(0,0,0,1,a):R==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(t.autoClear||v)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function m(_,v){const M=S(v);M&&(M.isCubeTexture||M.mapping===cc)?(u===void 0&&(u=new Mn(new $s(1,1,1),new ar({name:"BackgroundCubeMaterial",uniforms:Hs(ti.backgroundCube.uniforms),vertexShader:ti.backgroundCube.vertexShader,fragmentShader:ti.backgroundCube.fragmentShader,side:hn,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(R,A,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),gr.copy(v.backgroundRotation),gr.x*=-1,gr.y*=-1,gr.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(gr.y*=-1,gr.z*=-1),u.material.uniforms.envMap.value=M,u.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=v.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Pw.makeRotationFromEuler(gr)),u.material.toneMapped=Je.getTransfer(M.colorSpace)!==dt,(f!==M||p!==M.version||g!==t.toneMapping)&&(u.material.needsUpdate=!0,f=M,p=M.version,g=t.toneMapping),u.layers.enableAll(),_.unshift(u,u.geometry,u.material,0,0,null)):M&&M.isTexture&&(h===void 0&&(h=new Mn(new hc(2,2),new ar({name:"BackgroundMaterial",uniforms:Hs(ti.background.uniforms),vertexShader:ti.background.vertexShader,fragmentShader:ti.background.fragmentShader,side:sr,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(h)),h.material.uniforms.t2D.value=M,h.material.uniforms.backgroundIntensity.value=v.backgroundIntensity,h.material.toneMapped=Je.getTransfer(M.colorSpace)!==dt,M.matrixAutoUpdate===!0&&M.updateMatrix(),h.material.uniforms.uvTransform.value.copy(M.matrix),(f!==M||p!==M.version||g!==t.toneMapping)&&(h.material.needsUpdate=!0,f=M,p=M.version,g=t.toneMapping),h.layers.enableAll(),_.unshift(h,h.geometry,h.material,0,0,null))}function d(_,v){_.getRGB(Bo,wv(t)),i.buffers.color.setClear(Bo.r,Bo.g,Bo.b,v,a)}return{getClearColor:function(){return o},setClearColor:function(_,v=1){o.set(_),l=v,d(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(_){l=_,d(o,l)},render:y,addToRenderList:m}}function Lw(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=p(null);let s=r,a=!1;function o(x,E,k,O,$){let K=!1;const j=f(O,k,E);s!==j&&(s=j,h(s.object)),K=g(x,O,k,$),K&&S(x,O,k,$),$!==null&&e.update($,t.ELEMENT_ARRAY_BUFFER),(K||a)&&(a=!1,M(x,E,k,O),$!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get($).buffer))}function l(){return t.createVertexArray()}function h(x){return t.bindVertexArray(x)}function u(x){return t.deleteVertexArray(x)}function f(x,E,k){const O=k.wireframe===!0;let $=i[x.id];$===void 0&&($={},i[x.id]=$);let K=$[E.id];K===void 0&&(K={},$[E.id]=K);let j=K[O];return j===void 0&&(j=p(l()),K[O]=j),j}function p(x){const E=[],k=[],O=[];for(let $=0;$<n;$++)E[$]=0,k[$]=0,O[$]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:E,enabledAttributes:k,attributeDivisors:O,object:x,attributes:{},index:null}}function g(x,E,k,O){const $=s.attributes,K=E.attributes;let j=0;const Y=k.getAttributes();for(const N in Y)if(Y[N].location>=0){const V=$[N];let ne=K[N];if(ne===void 0&&(N==="instanceMatrix"&&x.instanceMatrix&&(ne=x.instanceMatrix),N==="instanceColor"&&x.instanceColor&&(ne=x.instanceColor)),V===void 0||V.attribute!==ne||ne&&V.data!==ne.data)return!0;j++}return s.attributesNum!==j||s.index!==O}function S(x,E,k,O){const $={},K=E.attributes;let j=0;const Y=k.getAttributes();for(const N in Y)if(Y[N].location>=0){let V=K[N];V===void 0&&(N==="instanceMatrix"&&x.instanceMatrix&&(V=x.instanceMatrix),N==="instanceColor"&&x.instanceColor&&(V=x.instanceColor));const ne={};ne.attribute=V,V&&V.data&&(ne.data=V.data),$[N]=ne,j++}s.attributes=$,s.attributesNum=j,s.index=O}function y(){const x=s.newAttributes;for(let E=0,k=x.length;E<k;E++)x[E]=0}function m(x){d(x,0)}function d(x,E){const k=s.newAttributes,O=s.enabledAttributes,$=s.attributeDivisors;k[x]=1,O[x]===0&&(t.enableVertexAttribArray(x),O[x]=1),$[x]!==E&&(t.vertexAttribDivisor(x,E),$[x]=E)}function _(){const x=s.newAttributes,E=s.enabledAttributes;for(let k=0,O=E.length;k<O;k++)E[k]!==x[k]&&(t.disableVertexAttribArray(k),E[k]=0)}function v(x,E,k,O,$,K,j){j===!0?t.vertexAttribIPointer(x,E,k,$,K):t.vertexAttribPointer(x,E,k,O,$,K)}function M(x,E,k,O){y();const $=O.attributes,K=k.getAttributes(),j=E.defaultAttributeValues;for(const Y in K){const N=K[Y];if(N.location>=0){let F=$[Y];if(F===void 0&&(Y==="instanceMatrix"&&x.instanceMatrix&&(F=x.instanceMatrix),Y==="instanceColor"&&x.instanceColor&&(F=x.instanceColor)),F!==void 0){const V=F.normalized,ne=F.itemSize,he=e.get(F);if(he===void 0)continue;const be=he.buffer,X=he.type,te=he.bytesPerElement,le=X===t.INT||X===t.UNSIGNED_INT||F.gpuType===tf;if(F.isInterleavedBufferAttribute){const ce=F.data,Ae=ce.stride,Ce=F.offset;if(ce.isInstancedInterleavedBuffer){for(let ke=0;ke<N.locationSize;ke++)d(N.location+ke,ce.meshPerAttribute);x.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=ce.meshPerAttribute*ce.count)}else for(let ke=0;ke<N.locationSize;ke++)m(N.location+ke);t.bindBuffer(t.ARRAY_BUFFER,be);for(let ke=0;ke<N.locationSize;ke++)v(N.location+ke,ne/N.locationSize,X,V,Ae*te,(Ce+ne/N.locationSize*ke)*te,le)}else{if(F.isInstancedBufferAttribute){for(let ce=0;ce<N.locationSize;ce++)d(N.location+ce,F.meshPerAttribute);x.isInstancedMesh!==!0&&O._maxInstanceCount===void 0&&(O._maxInstanceCount=F.meshPerAttribute*F.count)}else for(let ce=0;ce<N.locationSize;ce++)m(N.location+ce);t.bindBuffer(t.ARRAY_BUFFER,be);for(let ce=0;ce<N.locationSize;ce++)v(N.location+ce,ne/N.locationSize,X,V,ne*te,ne/N.locationSize*ce*te,le)}}else if(j!==void 0){const V=j[Y];if(V!==void 0)switch(V.length){case 2:t.vertexAttrib2fv(N.location,V);break;case 3:t.vertexAttrib3fv(N.location,V);break;case 4:t.vertexAttrib4fv(N.location,V);break;default:t.vertexAttrib1fv(N.location,V)}}}}_()}function R(){P();for(const x in i){const E=i[x];for(const k in E){const O=E[k];for(const $ in O)u(O[$].object),delete O[$];delete E[k]}delete i[x]}}function A(x){if(i[x.id]===void 0)return;const E=i[x.id];for(const k in E){const O=E[k];for(const $ in O)u(O[$].object),delete O[$];delete E[k]}delete i[x.id]}function C(x){for(const E in i){const k=i[E];if(k[x.id]===void 0)continue;const O=k[x.id];for(const $ in O)u(O[$].object),delete O[$];delete k[x.id]}}function P(){B(),a=!0,s!==r&&(s=r,h(s.object))}function B(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:P,resetDefaultState:B,dispose:R,releaseStatesOfGeometry:A,releaseStatesOfProgram:C,initAttributes:y,enableAttribute:m,disableUnusedAttributes:_}}function Dw(t,e,n){let i;function r(h){i=h}function s(h,u){t.drawArrays(i,h,u),n.update(u,i,1)}function a(h,u,f){f!==0&&(t.drawArraysInstanced(i,h,u,f),n.update(u,i,f))}function o(h,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,u,0,f);let g=0;for(let S=0;S<f;S++)g+=u[S];n.update(g,i,1)}function l(h,u,f,p){if(f===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let S=0;S<h.length;S++)a(h[S],u[S],p[S]);else{g.multiDrawArraysInstancedWEBGL(i,h,0,u,0,p,0,f);let S=0;for(let y=0;y<f;y++)S+=u[y];for(let y=0;y<p.length;y++)n.update(S,i,p[y])}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Iw(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(C){return!(C!==qn&&i.convert(C)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const P=C===Ja&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Ti&&i.convert(C)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==vi&&!P)}function l(C){if(C==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=n.precision!==void 0?n.precision:"highp";const u=l(h);u!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",u,"instead."),h=u);const f=n.logarithmicDepthBuffer===!0,p=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control");if(p===!0){const C=e.get("EXT_clip_control");C.clipControlEXT(C.LOWER_LEFT_EXT,C.ZERO_TO_ONE_EXT)}const g=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),S=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=t.getParameter(t.MAX_TEXTURE_SIZE),m=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),d=t.getParameter(t.MAX_VERTEX_ATTRIBS),_=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),v=t.getParameter(t.MAX_VARYING_VECTORS),M=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),R=S>0,A=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:f,reverseDepthBuffer:p,maxTextures:g,maxVertexTextures:S,maxTextureSize:y,maxCubemapSize:m,maxAttributes:d,maxVertexUniforms:_,maxVaryings:v,maxFragmentUniforms:M,vertexTextures:R,maxSamples:A}}function Uw(t){const e=this;let n=null,i=0,r=!1,s=!1;const a=new Bi,o=new ze,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,p){const g=f.length!==0||p||i!==0||r;return r=p,i=f.length,g},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,p){n=u(f,p,0)},this.setState=function(f,p,g){const S=f.clippingPlanes,y=f.clipIntersection,m=f.clipShadows,d=t.get(f);if(!r||S===null||S.length===0||s&&!m)s?u(null):h();else{const _=s?0:i,v=_*4;let M=d.clippingState||null;l.value=M,M=u(S,p,v,g);for(let R=0;R!==v;++R)M[R]=n[R];d.clippingState=M,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=_}};function h(){l.value!==n&&(l.value=n,l.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(f,p,g,S){const y=f!==null?f.length:0;let m=null;if(y!==0){if(m=l.value,S!==!0||m===null){const d=g+y*4,_=p.matrixWorldInverse;o.getNormalMatrix(_),(m===null||m.length<d)&&(m=new Float32Array(d));for(let v=0,M=g;v!==y;++v,M+=4)a.copy(f[v]).applyMatrix4(_,o),a.normal.toArray(m,M),m[M+3]=a.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}function Fw(t){let e=new WeakMap;function n(a,o){return o===Cd?a.mapping=Os:o===Ad&&(a.mapping=zs),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===Cd||o===Ad)if(e.has(a)){const l=e.get(a).texture;return n(l,a.mapping)}else{const l=a.image;if(l&&l.height>0){const h=new $S(l.height);return h.fromEquirectangularTexture(t,a),e.set(a,h),a.addEventListener("dispose",r),n(h.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class bv extends Tv{constructor(e=-1,n=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+n,l=r-n;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=h*this.view.offsetX,a=s+h*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const vs=4,am=[.125,.215,.35,.446,.526,.582],Mr=20,pu=new bv,om=new Be;let mu=null,gu=0,_u=0,vu=!1;const yr=(1+Math.sqrt(5))/2,is=1/yr,lm=[new z(-yr,is,0),new z(yr,is,0),new z(-is,0,yr),new z(is,0,yr),new z(0,yr,-is),new z(0,yr,is),new z(-1,1,-1),new z(1,1,-1),new z(-1,1,1),new z(1,1,1)];class cm{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){mu=this._renderer.getRenderTarget(),gu=this._renderer.getActiveCubeFace(),_u=this._renderer.getActiveMipmapLevel(),vu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=hm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=dm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(mu,gu,_u),this._renderer.xr.enabled=vu,e.scissorTest=!1,jo(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===Os||e.mapping===zs?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),mu=this._renderer.getRenderTarget(),gu=this._renderer.getActiveCubeFace(),_u=this._renderer.getActiveMipmapLevel(),vu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:Xn,minFilter:Xn,generateMipmaps:!1,type:Ja,format:qn,colorSpace:ur,depthBuffer:!1},r=um(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=um(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=kw(s)),this._blurMaterial=Ow(s,e,n)}return r}_compileMaterial(e){const n=new Mn(this._lodPlanes[0],e);this._renderer.compile(n,pu)}_sceneToCubeUV(e,n,i,r){const o=new yn(90,1,n,i),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,p=u.toneMapping;u.getClearColor(om),u.toneMapping=nr,u.autoClear=!1;const g=new Sv({name:"PMREM.Background",side:hn,depthWrite:!1,depthTest:!1}),S=new Mn(new $s,g);let y=!1;const m=e.background;m?m.isColor&&(g.color.copy(m),e.background=null,y=!0):(g.color.copy(om),y=!0);for(let d=0;d<6;d++){const _=d%3;_===0?(o.up.set(0,l[d],0),o.lookAt(h[d],0,0)):_===1?(o.up.set(0,0,l[d]),o.lookAt(0,h[d],0)):(o.up.set(0,l[d],0),o.lookAt(0,0,h[d]));const v=this._cubeSize;jo(r,_*v,d>2?v:0,v,v),u.setRenderTarget(r),y&&u.render(S,o),u.render(e,o)}S.geometry.dispose(),S.material.dispose(),u.toneMapping=p,u.autoClear=f,e.background=m}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===Os||e.mapping===zs;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=hm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=dm());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new Mn(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const l=this._cubeSize;jo(n,0,0,3*l,2*l),i.setRenderTarget(n),i.render(a,pu)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=lm[(r-s-1)%lm.length];this._blur(e,s-1,s,a,o)}n.autoClear=i}_blur(e,n,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,n,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,a,o){const l=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new Mn(this._lodPlanes[r],h),p=h.uniforms,g=this._sizeLods[i]-1,S=isFinite(s)?Math.PI/(2*g):2*Math.PI/(2*Mr-1),y=s/S,m=isFinite(s)?1+Math.floor(u*y):Mr;m>Mr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Mr}`);const d=[];let _=0;for(let C=0;C<Mr;++C){const P=C/y,B=Math.exp(-P*P/2);d.push(B),C===0?_+=B:C<m&&(_+=2*B)}for(let C=0;C<d.length;C++)d[C]=d[C]/_;p.envMap.value=e.texture,p.samples.value=m,p.weights.value=d,p.latitudinal.value=a==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:v}=this;p.dTheta.value=S,p.mipInt.value=v-i;const M=this._sizeLods[r],R=3*M*(r>v-vs?r-v+vs:0),A=4*(this._cubeSize-M);jo(n,R,A,3*M,2*M),l.setRenderTarget(n),l.render(f,pu)}}function kw(t){const e=[],n=[],i=[];let r=t;const s=t-vs+1+am.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);n.push(o);let l=1/o;a>t-vs?l=am[a-t+vs-1]:a===0&&(l=0),i.push(l);const h=1/(o-2),u=-h,f=1+h,p=[u,u,f,u,f,f,u,u,f,f,u,f],g=6,S=6,y=3,m=2,d=1,_=new Float32Array(y*S*g),v=new Float32Array(m*S*g),M=new Float32Array(d*S*g);for(let A=0;A<g;A++){const C=A%3*2/3-1,P=A>2?0:-1,B=[C,P,0,C+2/3,P,0,C+2/3,P+1,0,C,P,0,C+2/3,P+1,0,C,P+1,0];_.set(B,y*S*A),v.set(p,m*S*A);const x=[A,A,A,A,A,A];M.set(x,d*S*A)}const R=new An;R.setAttribute("position",new si(_,y)),R.setAttribute("uv",new si(v,m)),R.setAttribute("faceIndex",new si(M,d)),e.push(R),r>vs&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function um(t,e,n){const i=new Fr(t,e,n);return i.texture.mapping=cc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function jo(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function Ow(t,e,n){const i=new Float32Array(Mr),r=new z(0,1,0);return new ar({name:"SphericalGaussianBlur",defines:{n:Mr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:df(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:tr,depthTest:!1,depthWrite:!1})}function dm(){return new ar({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:df(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:tr,depthTest:!1,depthWrite:!1})}function hm(){return new ar({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:df(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:tr,depthTest:!1,depthWrite:!1})}function df(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function zw(t){let e=new WeakMap,n=null;function i(o){if(o&&o.isTexture){const l=o.mapping,h=l===Cd||l===Ad,u=l===Os||l===zs;if(h||u){let f=e.get(o);const p=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==p)return n===null&&(n=new cm(t)),f=h?n.fromEquirectangular(o,f):n.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),f.texture;if(f!==void 0)return f.texture;{const g=o.image;return h&&g&&g.height>0||u&&g&&r(g)?(n===null&&(n=new cm(t)),f=h?n.fromEquirectangular(o):n.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),o.addEventListener("dispose",s),f.texture):null}}}return o}function r(o){let l=0;const h=6;for(let u=0;u<h;u++)o[u]!==void 0&&l++;return l===h}function s(o){const l=o.target;l.removeEventListener("dispose",s);const h=e.get(l);h!==void 0&&(e.delete(l),h.dispose())}function a(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:a}}function Bw(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&hl("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function jw(t,e,n,i){const r={},s=new WeakMap;function a(f){const p=f.target;p.index!==null&&e.remove(p.index);for(const S in p.attributes)e.remove(p.attributes[S]);for(const S in p.morphAttributes){const y=p.morphAttributes[S];for(let m=0,d=y.length;m<d;m++)e.remove(y[m])}p.removeEventListener("dispose",a),delete r[p.id];const g=s.get(p);g&&(e.remove(g),s.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,n.memory.geometries--}function o(f,p){return r[p.id]===!0||(p.addEventListener("dispose",a),r[p.id]=!0,n.memory.geometries++),p}function l(f){const p=f.attributes;for(const S in p)e.update(p[S],t.ARRAY_BUFFER);const g=f.morphAttributes;for(const S in g){const y=g[S];for(let m=0,d=y.length;m<d;m++)e.update(y[m],t.ARRAY_BUFFER)}}function h(f){const p=[],g=f.index,S=f.attributes.position;let y=0;if(g!==null){const _=g.array;y=g.version;for(let v=0,M=_.length;v<M;v+=3){const R=_[v+0],A=_[v+1],C=_[v+2];p.push(R,A,A,C,C,R)}}else if(S!==void 0){const _=S.array;y=S.version;for(let v=0,M=_.length/3-1;v<M;v+=3){const R=v+0,A=v+1,C=v+2;p.push(R,A,A,C,C,R)}}else return;const m=new(gv(p)?Ev:Mv)(p,1);m.version=y;const d=s.get(f);d&&e.remove(d),s.set(f,m)}function u(f){const p=s.get(f);if(p){const g=f.index;g!==null&&p.version<g.version&&h(f)}else h(f);return s.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function Hw(t,e,n){let i;function r(p){i=p}let s,a;function o(p){s=p.type,a=p.bytesPerElement}function l(p,g){t.drawElements(i,g,s,p*a),n.update(g,i,1)}function h(p,g,S){S!==0&&(t.drawElementsInstanced(i,g,s,p*a,S),n.update(g,i,S))}function u(p,g,S){if(S===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,g,0,s,p,0,S);let m=0;for(let d=0;d<S;d++)m+=g[d];n.update(m,i,1)}function f(p,g,S,y){if(S===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let d=0;d<p.length;d++)h(p[d]/a,g[d],y[d]);else{m.multiDrawElementsInstancedWEBGL(i,g,0,s,p,0,y,0,S);let d=0;for(let _=0;_<S;_++)d+=g[_];for(let _=0;_<y.length;_++)n.update(d,i,y[_])}}this.setMode=r,this.setIndex=o,this.render=l,this.renderInstances=h,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function Vw(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(n.calls++,a){case t.TRIANGLES:n.triangles+=o*(s/3);break;case t.LINES:n.lines+=o*(s/2);break;case t.LINE_STRIP:n.lines+=o*(s-1);break;case t.LINE_LOOP:n.lines+=o*s;break;case t.POINTS:n.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function Gw(t,e,n){const i=new WeakMap,r=new St;function s(a,o,l){const h=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=u!==void 0?u.length:0;let p=i.get(o);if(p===void 0||p.count!==f){let x=function(){P.dispose(),i.delete(o),o.removeEventListener("dispose",x)};var g=x;p!==void 0&&p.texture.dispose();const S=o.morphAttributes.position!==void 0,y=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],_=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let M=0;S===!0&&(M=1),y===!0&&(M=2),m===!0&&(M=3);let R=o.attributes.position.count*M,A=1;R>e.maxTextureSize&&(A=Math.ceil(R/e.maxTextureSize),R=e.maxTextureSize);const C=new Float32Array(R*A*4*f),P=new vv(C,R,A,f);P.type=vi,P.needsUpdate=!0;const B=M*4;for(let E=0;E<f;E++){const k=d[E],O=_[E],$=v[E],K=R*A*4*E;for(let j=0;j<k.count;j++){const Y=j*B;S===!0&&(r.fromBufferAttribute(k,j),C[K+Y+0]=r.x,C[K+Y+1]=r.y,C[K+Y+2]=r.z,C[K+Y+3]=0),y===!0&&(r.fromBufferAttribute(O,j),C[K+Y+4]=r.x,C[K+Y+5]=r.y,C[K+Y+6]=r.z,C[K+Y+7]=0),m===!0&&(r.fromBufferAttribute($,j),C[K+Y+8]=r.x,C[K+Y+9]=r.y,C[K+Y+10]=r.z,C[K+Y+11]=$.itemSize===4?r.w:1)}}p={count:f,texture:P,size:new Ne(R,A)},i.set(o,p),o.addEventListener("dispose",x)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(t,"morphTexture",a.morphTexture,n);else{let S=0;for(let m=0;m<h.length;m++)S+=h[m];const y=o.morphTargetsRelative?1:1-S;l.getUniforms().setValue(t,"morphTargetBaseInfluence",y),l.getUniforms().setValue(t,"morphTargetInfluences",h)}l.getUniforms().setValue(t,"morphTargetsTexture",p.texture,n),l.getUniforms().setValue(t,"morphTargetsTextureSize",p.size)}return{update:s}}function Ww(t,e,n,i){let r=new WeakMap;function s(l){const h=i.render.frame,u=l.geometry,f=e.get(l,u);if(r.get(f)!==h&&(e.update(f),r.set(f,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),r.get(l)!==h&&(n.update(l.instanceMatrix,t.ARRAY_BUFFER),l.instanceColor!==null&&n.update(l.instanceColor,t.ARRAY_BUFFER),r.set(l,h))),l.isSkinnedMesh){const p=l.skeleton;r.get(p)!==h&&(p.update(),r.set(p,h))}return f}function a(){r=new WeakMap}function o(l){const h=l.target;h.removeEventListener("dispose",o),n.remove(h.instanceMatrix),h.instanceColor!==null&&n.remove(h.instanceColor)}return{update:s,dispose:a}}class Rv extends fn{constructor(e,n,i,r,s,a,o,l,h,u=bs){if(u!==bs&&u!==js)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===bs&&(i=Ur),i===void 0&&u===js&&(i=Bs),super(null,r,s,a,o,l,u,i,h),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=o!==void 0?o:In,this.minFilter=l!==void 0?l:In,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const Pv=new fn,fm=new Rv(1,1),Nv=new vv,Lv=new NS,Dv=new Cv,pm=[],mm=[],gm=new Float32Array(16),_m=new Float32Array(9),vm=new Float32Array(4);function qs(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=pm[r];if(s===void 0&&(s=new Float32Array(r),pm[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=n,t[a].toArray(s,o)}return s}function Lt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function Dt(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function fc(t,e){let n=mm[e];n===void 0&&(n=new Int32Array(e),mm[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function Xw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function $w(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Lt(n,e))return;t.uniform2fv(this.addr,e),Dt(n,e)}}function qw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Lt(n,e))return;t.uniform3fv(this.addr,e),Dt(n,e)}}function Yw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Lt(n,e))return;t.uniform4fv(this.addr,e),Dt(n,e)}}function Kw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Lt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),Dt(n,e)}else{if(Lt(n,i))return;vm.set(i),t.uniformMatrix2fv(this.addr,!1,vm),Dt(n,i)}}function Zw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Lt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),Dt(n,e)}else{if(Lt(n,i))return;_m.set(i),t.uniformMatrix3fv(this.addr,!1,_m),Dt(n,i)}}function Qw(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Lt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),Dt(n,e)}else{if(Lt(n,i))return;gm.set(i),t.uniformMatrix4fv(this.addr,!1,gm),Dt(n,i)}}function Jw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function e1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Lt(n,e))return;t.uniform2iv(this.addr,e),Dt(n,e)}}function t1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Lt(n,e))return;t.uniform3iv(this.addr,e),Dt(n,e)}}function n1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Lt(n,e))return;t.uniform4iv(this.addr,e),Dt(n,e)}}function i1(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function r1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Lt(n,e))return;t.uniform2uiv(this.addr,e),Dt(n,e)}}function s1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Lt(n,e))return;t.uniform3uiv(this.addr,e),Dt(n,e)}}function a1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Lt(n,e))return;t.uniform4uiv(this.addr,e),Dt(n,e)}}function o1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(fm.compareFunction=mv,s=fm):s=Pv,n.setTexture2D(e||s,r)}function l1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||Lv,r)}function c1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||Dv,r)}function u1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||Nv,r)}function d1(t){switch(t){case 5126:return Xw;case 35664:return $w;case 35665:return qw;case 35666:return Yw;case 35674:return Kw;case 35675:return Zw;case 35676:return Qw;case 5124:case 35670:return Jw;case 35667:case 35671:return e1;case 35668:case 35672:return t1;case 35669:case 35673:return n1;case 5125:return i1;case 36294:return r1;case 36295:return s1;case 36296:return a1;case 35678:case 36198:case 36298:case 36306:case 35682:return o1;case 35679:case 36299:case 36307:return l1;case 35680:case 36300:case 36308:case 36293:return c1;case 36289:case 36303:case 36311:case 36292:return u1}}function h1(t,e){t.uniform1fv(this.addr,e)}function f1(t,e){const n=qs(e,this.size,2);t.uniform2fv(this.addr,n)}function p1(t,e){const n=qs(e,this.size,3);t.uniform3fv(this.addr,n)}function m1(t,e){const n=qs(e,this.size,4);t.uniform4fv(this.addr,n)}function g1(t,e){const n=qs(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function _1(t,e){const n=qs(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function v1(t,e){const n=qs(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function x1(t,e){t.uniform1iv(this.addr,e)}function y1(t,e){t.uniform2iv(this.addr,e)}function S1(t,e){t.uniform3iv(this.addr,e)}function M1(t,e){t.uniform4iv(this.addr,e)}function E1(t,e){t.uniform1uiv(this.addr,e)}function w1(t,e){t.uniform2uiv(this.addr,e)}function T1(t,e){t.uniform3uiv(this.addr,e)}function C1(t,e){t.uniform4uiv(this.addr,e)}function A1(t,e,n){const i=this.cache,r=e.length,s=fc(n,r);Lt(i,s)||(t.uniform1iv(this.addr,s),Dt(i,s));for(let a=0;a!==r;++a)n.setTexture2D(e[a]||Pv,s[a])}function b1(t,e,n){const i=this.cache,r=e.length,s=fc(n,r);Lt(i,s)||(t.uniform1iv(this.addr,s),Dt(i,s));for(let a=0;a!==r;++a)n.setTexture3D(e[a]||Lv,s[a])}function R1(t,e,n){const i=this.cache,r=e.length,s=fc(n,r);Lt(i,s)||(t.uniform1iv(this.addr,s),Dt(i,s));for(let a=0;a!==r;++a)n.setTextureCube(e[a]||Dv,s[a])}function P1(t,e,n){const i=this.cache,r=e.length,s=fc(n,r);Lt(i,s)||(t.uniform1iv(this.addr,s),Dt(i,s));for(let a=0;a!==r;++a)n.setTexture2DArray(e[a]||Nv,s[a])}function N1(t){switch(t){case 5126:return h1;case 35664:return f1;case 35665:return p1;case 35666:return m1;case 35674:return g1;case 35675:return _1;case 35676:return v1;case 5124:case 35670:return x1;case 35667:case 35671:return y1;case 35668:case 35672:return S1;case 35669:case 35673:return M1;case 5125:return E1;case 36294:return w1;case 36295:return T1;case 36296:return C1;case 35678:case 36198:case 36298:case 36306:case 35682:return A1;case 35679:case 36299:case 36307:return b1;case 35680:case 36300:case 36308:case 36293:return R1;case 36289:case 36303:case 36311:case 36292:return P1}}class L1{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=d1(n.type)}}class D1{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=N1(n.type)}}class I1{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,n[o.id],i)}}}const xu=/(\w+)(\])?(\[|\.)?/g;function xm(t,e){t.seq.push(e),t.map[e.id]=e}function U1(t,e,n){const i=t.name,r=i.length;for(xu.lastIndex=0;;){const s=xu.exec(i),a=xu.lastIndex;let o=s[1];const l=s[2]==="]",h=s[3];if(l&&(o=o|0),h===void 0||h==="["&&a+2===r){xm(n,h===void 0?new L1(o,t,e):new D1(o,t,e));break}else{let f=n.map[o];f===void 0&&(f=new I1(o),xm(n,f)),n=f}}}class fl{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),a=e.getUniformLocation(n,s.name);U1(s,a,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,a=n.length;s!==a;++s){const o=n[s],l=i[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in n&&i.push(a)}return i}}function ym(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const F1=37297;let k1=0;function O1(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}function z1(t){const e=Je.getPrimaries(Je.workingColorSpace),n=Je.getPrimaries(t);let i;switch(e===n?i="":e===jl&&n===Bl?i="LinearDisplayP3ToLinearSRGB":e===Bl&&n===jl&&(i="LinearSRGBToLinearDisplayP3"),t){case ur:case uc:return[i,"LinearTransferOETF"];case ei:case lf:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",t),[i,"LinearTransferOETF"]}}function Sm(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+O1(t.getShaderSource(e),a)}else return r}function B1(t,e){const n=z1(e);return`vec4 ${t}( vec4 value ) { return ${n[0]}( ${n[1]}( value ) ); }`}function j1(t,e){let n;switch(e){case nS:n="Linear";break;case iS:n="Reinhard";break;case rS:n="Cineon";break;case sS:n="ACESFilmic";break;case oS:n="AgX";break;case lS:n="Neutral";break;case aS:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const Ho=new z;function H1(){Je.getLuminanceCoefficients(Ho);const t=Ho.x.toFixed(4),e=Ho.y.toFixed(4),n=Ho.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function V1(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(xa).join(`
`)}function G1(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function W1(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),a=s.name;let o=1;s.type===t.FLOAT_MAT2&&(o=2),s.type===t.FLOAT_MAT3&&(o=3),s.type===t.FLOAT_MAT4&&(o=4),n[a]={type:s.type,location:t.getAttribLocation(e,a),locationSize:o}}return n}function xa(t){return t!==""}function Mm(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Em(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const X1=/^[ \t]*#include +<([\w\d./]+)>/gm;function ih(t){return t.replace(X1,q1)}const $1=new Map;function q1(t,e){let n=Oe[e];if(n===void 0){const i=$1.get(e);if(i!==void 0)n=Oe[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return ih(n)}const Y1=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function wm(t){return t.replace(Y1,K1)}function K1(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function Tm(t){let e=`precision ${t.precision} float;
	precision ${t.precision} int;
	precision ${t.precision} sampler2D;
	precision ${t.precision} samplerCube;
	precision ${t.precision} sampler3D;
	precision ${t.precision} sampler2DArray;
	precision ${t.precision} sampler2DShadow;
	precision ${t.precision} samplerCubeShadow;
	precision ${t.precision} sampler2DArrayShadow;
	precision ${t.precision} isampler2D;
	precision ${t.precision} isampler3D;
	precision ${t.precision} isamplerCube;
	precision ${t.precision} isampler2DArray;
	precision ${t.precision} usampler2D;
	precision ${t.precision} usampler3D;
	precision ${t.precision} usamplerCube;
	precision ${t.precision} usampler2DArray;
	`;return t.precision==="highp"?e+=`
#define HIGH_PRECISION`:t.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:t.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Z1(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===tv?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===Uy?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===fi&&(e="SHADOWMAP_TYPE_VSM"),e}function Q1(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case Os:case zs:e="ENVMAP_TYPE_CUBE";break;case cc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function J1(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case zs:e="ENVMAP_MODE_REFRACTION";break}return e}function eT(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case nv:e="ENVMAP_BLENDING_MULTIPLY";break;case eS:e="ENVMAP_BLENDING_MIX";break;case tS:e="ENVMAP_BLENDING_ADD";break}return e}function tT(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function nT(t,e,n,i){const r=t.getContext(),s=n.defines;let a=n.vertexShader,o=n.fragmentShader;const l=Z1(n),h=Q1(n),u=J1(n),f=eT(n),p=tT(n),g=V1(n),S=G1(s),y=r.createProgram();let m,d,_=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(m=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,S].filter(xa).join(`
`),m.length>0&&(m+=`
`),d=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,S].filter(xa).join(`
`),d.length>0&&(d+=`
`)):(m=[Tm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,S,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xa).join(`
`),d=[Tm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,S,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+h:"",n.envMap?"#define "+u:"",n.envMap?"#define "+f:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+l:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==nr?"#define TONE_MAPPING":"",n.toneMapping!==nr?Oe.tonemapping_pars_fragment:"",n.toneMapping!==nr?j1("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",Oe.colorspace_pars_fragment,B1("linearToOutputTexel",n.outputColorSpace),H1(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(xa).join(`
`)),a=ih(a),a=Mm(a,n),a=Em(a,n),o=ih(o),o=Mm(o,n),o=Em(o,n),a=wm(a),o=wm(o),n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,m=[g,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,d=["#define varying in",n.glslVersion===Hp?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Hp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const v=_+m+a,M=_+d+o,R=ym(r,r.VERTEX_SHADER,v),A=ym(r,r.FRAGMENT_SHADER,M);r.attachShader(y,R),r.attachShader(y,A),n.index0AttributeName!==void 0?r.bindAttribLocation(y,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(y,0,"position"),r.linkProgram(y);function C(E){if(t.debug.checkShaderErrors){const k=r.getProgramInfoLog(y).trim(),O=r.getShaderInfoLog(R).trim(),$=r.getShaderInfoLog(A).trim();let K=!0,j=!0;if(r.getProgramParameter(y,r.LINK_STATUS)===!1)if(K=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,y,R,A);else{const Y=Sm(r,R,"vertex"),N=Sm(r,A,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(y,r.VALIDATE_STATUS)+`

Material Name: `+E.name+`
Material Type: `+E.type+`

Program Info Log: `+k+`
`+Y+`
`+N)}else k!==""?console.warn("THREE.WebGLProgram: Program Info Log:",k):(O===""||$==="")&&(j=!1);j&&(E.diagnostics={runnable:K,programLog:k,vertexShader:{log:O,prefix:m},fragmentShader:{log:$,prefix:d}})}r.deleteShader(R),r.deleteShader(A),P=new fl(r,y),B=W1(r,y)}let P;this.getUniforms=function(){return P===void 0&&C(this),P};let B;this.getAttributes=function(){return B===void 0&&C(this),B};let x=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return x===!1&&(x=r.getProgramParameter(y,F1)),x},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(y),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=k1++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=R,this.fragmentShader=A,this}let iT=0;class rT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new sT(e),n.set(e,i)),i}}class sT{constructor(e){this.id=iT++,this.code=e,this.usedTimes=0}}function aT(t,e,n,i,r,s,a){const o=new xv,l=new rT,h=new Set,u=[],f=r.logarithmicDepthBuffer,p=r.reverseDepthBuffer,g=r.vertexTextures;let S=r.precision;const y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function m(x){return h.add(x),x===0?"uv":`uv${x}`}function d(x,E,k,O,$){const K=O.fog,j=$.geometry,Y=x.isMeshStandardMaterial?O.environment:null,N=(x.isMeshStandardMaterial?n:e).get(x.envMap||Y),F=N&&N.mapping===cc?N.image.height:null,V=y[x.type];x.precision!==null&&(S=r.getMaxPrecision(x.precision),S!==x.precision&&console.warn("THREE.WebGLProgram.getParameters:",x.precision,"not supported, using",S,"instead."));const ne=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,he=ne!==void 0?ne.length:0;let be=0;j.morphAttributes.position!==void 0&&(be=1),j.morphAttributes.normal!==void 0&&(be=2),j.morphAttributes.color!==void 0&&(be=3);let X,te,le,ce;if(V){const nn=ti[V];X=nn.vertexShader,te=nn.fragmentShader}else X=x.vertexShader,te=x.fragmentShader,l.update(x),le=l.getVertexShaderID(x),ce=l.getFragmentShaderID(x);const Ae=t.getRenderTarget(),Ce=$.isInstancedMesh===!0,ke=$.isBatchedMesh===!0,Ye=!!x.map,Ge=!!x.matcap,L=!!N,pn=!!x.aoMap,He=!!x.lightMap,$e=!!x.bumpMap,Le=!!x.normalMap,ot=!!x.displacementMap,Ue=!!x.emissiveMap,b=!!x.metalnessMap,w=!!x.roughnessMap,H=x.anisotropy>0,Q=x.clearcoat>0,re=x.dispersion>0,Z=x.iridescence>0,Ee=x.sheen>0,de=x.transmission>0,ve=H&&!!x.anisotropyMap,qe=Q&&!!x.clearcoatMap,ae=Q&&!!x.clearcoatNormalMap,xe=Q&&!!x.clearcoatRoughnessMap,De=Z&&!!x.iridescenceMap,Ie=Z&&!!x.iridescenceThicknessMap,ye=Ee&&!!x.sheenColorMap,Ve=Ee&&!!x.sheenRoughnessMap,Fe=!!x.specularMap,st=!!x.specularColorMap,D=!!x.specularIntensityMap,me=de&&!!x.transmissionMap,q=de&&!!x.thicknessMap,J=!!x.gradientMap,fe=!!x.alphaMap,ge=x.alphaTest>0,We=!!x.alphaHash,wt=!!x.extensions;let tn=nr;x.toneMapped&&(Ae===null||Ae.isXRRenderTarget===!0)&&(tn=t.toneMapping);const Ke={shaderID:V,shaderType:x.type,shaderName:x.name,vertexShader:X,fragmentShader:te,defines:x.defines,customVertexShaderID:le,customFragmentShaderID:ce,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:S,batching:ke,batchingColor:ke&&$._colorsTexture!==null,instancing:Ce,instancingColor:Ce&&$.instanceColor!==null,instancingMorph:Ce&&$.morphTexture!==null,supportsVertexTextures:g,outputColorSpace:Ae===null?t.outputColorSpace:Ae.isXRRenderTarget===!0?Ae.texture.colorSpace:ur,alphaToCoverage:!!x.alphaToCoverage,map:Ye,matcap:Ge,envMap:L,envMapMode:L&&N.mapping,envMapCubeUVHeight:F,aoMap:pn,lightMap:He,bumpMap:$e,normalMap:Le,displacementMap:g&&ot,emissiveMap:Ue,normalMapObjectSpace:Le&&x.normalMapType===hS,normalMapTangentSpace:Le&&x.normalMapType===pv,metalnessMap:b,roughnessMap:w,anisotropy:H,anisotropyMap:ve,clearcoat:Q,clearcoatMap:qe,clearcoatNormalMap:ae,clearcoatRoughnessMap:xe,dispersion:re,iridescence:Z,iridescenceMap:De,iridescenceThicknessMap:Ie,sheen:Ee,sheenColorMap:ye,sheenRoughnessMap:Ve,specularMap:Fe,specularColorMap:st,specularIntensityMap:D,transmission:de,transmissionMap:me,thicknessMap:q,gradientMap:J,opaque:x.transparent===!1&&x.blending===As&&x.alphaToCoverage===!1,alphaMap:fe,alphaTest:ge,alphaHash:We,combine:x.combine,mapUv:Ye&&m(x.map.channel),aoMapUv:pn&&m(x.aoMap.channel),lightMapUv:He&&m(x.lightMap.channel),bumpMapUv:$e&&m(x.bumpMap.channel),normalMapUv:Le&&m(x.normalMap.channel),displacementMapUv:ot&&m(x.displacementMap.channel),emissiveMapUv:Ue&&m(x.emissiveMap.channel),metalnessMapUv:b&&m(x.metalnessMap.channel),roughnessMapUv:w&&m(x.roughnessMap.channel),anisotropyMapUv:ve&&m(x.anisotropyMap.channel),clearcoatMapUv:qe&&m(x.clearcoatMap.channel),clearcoatNormalMapUv:ae&&m(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xe&&m(x.clearcoatRoughnessMap.channel),iridescenceMapUv:De&&m(x.iridescenceMap.channel),iridescenceThicknessMapUv:Ie&&m(x.iridescenceThicknessMap.channel),sheenColorMapUv:ye&&m(x.sheenColorMap.channel),sheenRoughnessMapUv:Ve&&m(x.sheenRoughnessMap.channel),specularMapUv:Fe&&m(x.specularMap.channel),specularColorMapUv:st&&m(x.specularColorMap.channel),specularIntensityMapUv:D&&m(x.specularIntensityMap.channel),transmissionMapUv:me&&m(x.transmissionMap.channel),thicknessMapUv:q&&m(x.thicknessMap.channel),alphaMapUv:fe&&m(x.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(Le||H),vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:$.isPoints===!0&&!!j.attributes.uv&&(Ye||fe),fog:!!K,useFog:x.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:x.flatShading===!0,sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:p,skinning:$.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:he,morphTextureStride:be,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:x.dithering,shadowMapEnabled:t.shadowMap.enabled&&k.length>0,shadowMapType:t.shadowMap.type,toneMapping:tn,decodeVideoTexture:Ye&&x.map.isVideoTexture===!0&&Je.getTransfer(x.map.colorSpace)===dt,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===Ln,flipSided:x.side===hn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:wt&&x.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(wt&&x.extensions.multiDraw===!0||ke)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return Ke.vertexUv1s=h.has(1),Ke.vertexUv2s=h.has(2),Ke.vertexUv3s=h.has(3),h.clear(),Ke}function _(x){const E=[];if(x.shaderID?E.push(x.shaderID):(E.push(x.customVertexShaderID),E.push(x.customFragmentShaderID)),x.defines!==void 0)for(const k in x.defines)E.push(k),E.push(x.defines[k]);return x.isRawShaderMaterial===!1&&(v(E,x),M(E,x),E.push(t.outputColorSpace)),E.push(x.customProgramCacheKey),E.join()}function v(x,E){x.push(E.precision),x.push(E.outputColorSpace),x.push(E.envMapMode),x.push(E.envMapCubeUVHeight),x.push(E.mapUv),x.push(E.alphaMapUv),x.push(E.lightMapUv),x.push(E.aoMapUv),x.push(E.bumpMapUv),x.push(E.normalMapUv),x.push(E.displacementMapUv),x.push(E.emissiveMapUv),x.push(E.metalnessMapUv),x.push(E.roughnessMapUv),x.push(E.anisotropyMapUv),x.push(E.clearcoatMapUv),x.push(E.clearcoatNormalMapUv),x.push(E.clearcoatRoughnessMapUv),x.push(E.iridescenceMapUv),x.push(E.iridescenceThicknessMapUv),x.push(E.sheenColorMapUv),x.push(E.sheenRoughnessMapUv),x.push(E.specularMapUv),x.push(E.specularColorMapUv),x.push(E.specularIntensityMapUv),x.push(E.transmissionMapUv),x.push(E.thicknessMapUv),x.push(E.combine),x.push(E.fogExp2),x.push(E.sizeAttenuation),x.push(E.morphTargetsCount),x.push(E.morphAttributeCount),x.push(E.numDirLights),x.push(E.numPointLights),x.push(E.numSpotLights),x.push(E.numSpotLightMaps),x.push(E.numHemiLights),x.push(E.numRectAreaLights),x.push(E.numDirLightShadows),x.push(E.numPointLightShadows),x.push(E.numSpotLightShadows),x.push(E.numSpotLightShadowsWithMaps),x.push(E.numLightProbes),x.push(E.shadowMapType),x.push(E.toneMapping),x.push(E.numClippingPlanes),x.push(E.numClipIntersection),x.push(E.depthPacking)}function M(x,E){o.disableAll(),E.supportsVertexTextures&&o.enable(0),E.instancing&&o.enable(1),E.instancingColor&&o.enable(2),E.instancingMorph&&o.enable(3),E.matcap&&o.enable(4),E.envMap&&o.enable(5),E.normalMapObjectSpace&&o.enable(6),E.normalMapTangentSpace&&o.enable(7),E.clearcoat&&o.enable(8),E.iridescence&&o.enable(9),E.alphaTest&&o.enable(10),E.vertexColors&&o.enable(11),E.vertexAlphas&&o.enable(12),E.vertexUv1s&&o.enable(13),E.vertexUv2s&&o.enable(14),E.vertexUv3s&&o.enable(15),E.vertexTangents&&o.enable(16),E.anisotropy&&o.enable(17),E.alphaHash&&o.enable(18),E.batching&&o.enable(19),E.dispersion&&o.enable(20),E.batchingColor&&o.enable(21),x.push(o.mask),o.disableAll(),E.fog&&o.enable(0),E.useFog&&o.enable(1),E.flatShading&&o.enable(2),E.logarithmicDepthBuffer&&o.enable(3),E.reverseDepthBuffer&&o.enable(4),E.skinning&&o.enable(5),E.morphTargets&&o.enable(6),E.morphNormals&&o.enable(7),E.morphColors&&o.enable(8),E.premultipliedAlpha&&o.enable(9),E.shadowMapEnabled&&o.enable(10),E.doubleSided&&o.enable(11),E.flipSided&&o.enable(12),E.useDepthPacking&&o.enable(13),E.dithering&&o.enable(14),E.transmission&&o.enable(15),E.sheen&&o.enable(16),E.opaque&&o.enable(17),E.pointsUvs&&o.enable(18),E.decodeVideoTexture&&o.enable(19),E.alphaToCoverage&&o.enable(20),x.push(o.mask)}function R(x){const E=y[x.type];let k;if(E){const O=ti[E];k=VS.clone(O.uniforms)}else k=x.uniforms;return k}function A(x,E){let k;for(let O=0,$=u.length;O<$;O++){const K=u[O];if(K.cacheKey===E){k=K,++k.usedTimes;break}}return k===void 0&&(k=new nT(t,E,x,s),u.push(k)),k}function C(x){if(--x.usedTimes===0){const E=u.indexOf(x);u[E]=u[u.length-1],u.pop(),x.destroy()}}function P(x){l.remove(x)}function B(){l.dispose()}return{getParameters:d,getProgramCacheKey:_,getUniforms:R,acquireProgram:A,releaseProgram:C,releaseShaderCache:P,programs:u,dispose:B}}function oT(){let t=new WeakMap;function e(a){return t.has(a)}function n(a){let o=t.get(a);return o===void 0&&(o={},t.set(a,o)),o}function i(a){t.delete(a)}function r(a,o,l){t.get(a)[o]=l}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function lT(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function Cm(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function Am(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function a(f,p,g,S,y,m){let d=t[e];return d===void 0?(d={id:f.id,object:f,geometry:p,material:g,groupOrder:S,renderOrder:f.renderOrder,z:y,group:m},t[e]=d):(d.id=f.id,d.object=f,d.geometry=p,d.material=g,d.groupOrder=S,d.renderOrder=f.renderOrder,d.z=y,d.group=m),e++,d}function o(f,p,g,S,y,m){const d=a(f,p,g,S,y,m);g.transmission>0?i.push(d):g.transparent===!0?r.push(d):n.push(d)}function l(f,p,g,S,y,m){const d=a(f,p,g,S,y,m);g.transmission>0?i.unshift(d):g.transparent===!0?r.unshift(d):n.unshift(d)}function h(f,p){n.length>1&&n.sort(f||lT),i.length>1&&i.sort(p||Cm),r.length>1&&r.sort(p||Cm)}function u(){for(let f=e,p=t.length;f<p;f++){const g=t[f];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:o,unshift:l,finish:u,sort:h}}function cT(){let t=new WeakMap;function e(i,r){const s=t.get(i);let a;return s===void 0?(a=new Am,t.set(i,[a])):r>=s.length?(a=new Am,s.push(a)):a=s[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}function uT(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new z,color:new Be};break;case"SpotLight":n={position:new z,direction:new z,color:new Be,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new z,color:new Be,distance:0,decay:0};break;case"HemisphereLight":n={direction:new z,skyColor:new Be,groundColor:new Be};break;case"RectAreaLight":n={color:new Be,position:new z,halfWidth:new z,halfHeight:new z};break}return t[e.id]=n,n}}}function dT(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ne,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let hT=0;function fT(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function pT(t){const e=new uT,n=dT(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new z);const r=new z,s=new _t,a=new _t;function o(h){let u=0,f=0,p=0;for(let B=0;B<9;B++)i.probe[B].set(0,0,0);let g=0,S=0,y=0,m=0,d=0,_=0,v=0,M=0,R=0,A=0,C=0;h.sort(fT);for(let B=0,x=h.length;B<x;B++){const E=h[B],k=E.color,O=E.intensity,$=E.distance,K=E.shadow&&E.shadow.map?E.shadow.map.texture:null;if(E.isAmbientLight)u+=k.r*O,f+=k.g*O,p+=k.b*O;else if(E.isLightProbe){for(let j=0;j<9;j++)i.probe[j].addScaledVector(E.sh.coefficients[j],O);C++}else if(E.isDirectionalLight){const j=e.get(E);if(j.color.copy(E.color).multiplyScalar(E.intensity),E.castShadow){const Y=E.shadow,N=n.get(E);N.shadowIntensity=Y.intensity,N.shadowBias=Y.bias,N.shadowNormalBias=Y.normalBias,N.shadowRadius=Y.radius,N.shadowMapSize=Y.mapSize,i.directionalShadow[g]=N,i.directionalShadowMap[g]=K,i.directionalShadowMatrix[g]=E.shadow.matrix,_++}i.directional[g]=j,g++}else if(E.isSpotLight){const j=e.get(E);j.position.setFromMatrixPosition(E.matrixWorld),j.color.copy(k).multiplyScalar(O),j.distance=$,j.coneCos=Math.cos(E.angle),j.penumbraCos=Math.cos(E.angle*(1-E.penumbra)),j.decay=E.decay,i.spot[y]=j;const Y=E.shadow;if(E.map&&(i.spotLightMap[R]=E.map,R++,Y.updateMatrices(E),E.castShadow&&A++),i.spotLightMatrix[y]=Y.matrix,E.castShadow){const N=n.get(E);N.shadowIntensity=Y.intensity,N.shadowBias=Y.bias,N.shadowNormalBias=Y.normalBias,N.shadowRadius=Y.radius,N.shadowMapSize=Y.mapSize,i.spotShadow[y]=N,i.spotShadowMap[y]=K,M++}y++}else if(E.isRectAreaLight){const j=e.get(E);j.color.copy(k).multiplyScalar(O),j.halfWidth.set(E.width*.5,0,0),j.halfHeight.set(0,E.height*.5,0),i.rectArea[m]=j,m++}else if(E.isPointLight){const j=e.get(E);if(j.color.copy(E.color).multiplyScalar(E.intensity),j.distance=E.distance,j.decay=E.decay,E.castShadow){const Y=E.shadow,N=n.get(E);N.shadowIntensity=Y.intensity,N.shadowBias=Y.bias,N.shadowNormalBias=Y.normalBias,N.shadowRadius=Y.radius,N.shadowMapSize=Y.mapSize,N.shadowCameraNear=Y.camera.near,N.shadowCameraFar=Y.camera.far,i.pointShadow[S]=N,i.pointShadowMap[S]=K,i.pointShadowMatrix[S]=E.shadow.matrix,v++}i.point[S]=j,S++}else if(E.isHemisphereLight){const j=e.get(E);j.skyColor.copy(E.color).multiplyScalar(O),j.groundColor.copy(E.groundColor).multiplyScalar(O),i.hemi[d]=j,d++}}m>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=ue.LTC_FLOAT_1,i.rectAreaLTC2=ue.LTC_FLOAT_2):(i.rectAreaLTC1=ue.LTC_HALF_1,i.rectAreaLTC2=ue.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=f,i.ambient[2]=p;const P=i.hash;(P.directionalLength!==g||P.pointLength!==S||P.spotLength!==y||P.rectAreaLength!==m||P.hemiLength!==d||P.numDirectionalShadows!==_||P.numPointShadows!==v||P.numSpotShadows!==M||P.numSpotMaps!==R||P.numLightProbes!==C)&&(i.directional.length=g,i.spot.length=y,i.rectArea.length=m,i.point.length=S,i.hemi.length=d,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=v,i.pointShadowMap.length=v,i.spotShadow.length=M,i.spotShadowMap.length=M,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=v,i.spotLightMatrix.length=M+R-A,i.spotLightMap.length=R,i.numSpotLightShadowsWithMaps=A,i.numLightProbes=C,P.directionalLength=g,P.pointLength=S,P.spotLength=y,P.rectAreaLength=m,P.hemiLength=d,P.numDirectionalShadows=_,P.numPointShadows=v,P.numSpotShadows=M,P.numSpotMaps=R,P.numLightProbes=C,i.version=hT++)}function l(h,u){let f=0,p=0,g=0,S=0,y=0;const m=u.matrixWorldInverse;for(let d=0,_=h.length;d<_;d++){const v=h[d];if(v.isDirectionalLight){const M=i.directional[f];M.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(m),f++}else if(v.isSpotLight){const M=i.spot[g];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),M.direction.setFromMatrixPosition(v.matrixWorld),r.setFromMatrixPosition(v.target.matrixWorld),M.direction.sub(r),M.direction.transformDirection(m),g++}else if(v.isRectAreaLight){const M=i.rectArea[S];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),a.identity(),s.copy(v.matrixWorld),s.premultiply(m),a.extractRotation(s),M.halfWidth.set(v.width*.5,0,0),M.halfHeight.set(0,v.height*.5,0),M.halfWidth.applyMatrix4(a),M.halfHeight.applyMatrix4(a),S++}else if(v.isPointLight){const M=i.point[p];M.position.setFromMatrixPosition(v.matrixWorld),M.position.applyMatrix4(m),p++}else if(v.isHemisphereLight){const M=i.hemi[y];M.direction.setFromMatrixPosition(v.matrixWorld),M.direction.transformDirection(m),y++}}}return{setup:o,setupView:l,state:i}}function bm(t){const e=new pT(t),n=[],i=[];function r(u){h.camera=u,n.length=0,i.length=0}function s(u){n.push(u)}function a(u){i.push(u)}function o(){e.setup(n)}function l(u){e.setupView(n,u)}const h={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:h,setupLights:o,setupLightsView:l,pushLight:s,pushShadow:a}}function mT(t){let e=new WeakMap;function n(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new bm(t),e.set(r,[o])):s>=a.length?(o=new bm(t),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:n,dispose:i}}class gT extends Xs{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=uS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class _T extends Xs{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const vT=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,xT=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function yT(t,e,n){let i=new uf;const r=new Ne,s=new Ne,a=new St,o=new gT({depthPacking:dS}),l=new _T,h={},u=n.maxTextureSize,f={[sr]:hn,[hn]:sr,[Ln]:Ln},p=new ar({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ne},radius:{value:4}},vertexShader:vT,fragmentShader:xT}),g=p.clone();g.defines.HORIZONTAL_PASS=1;const S=new An;S.setAttribute("position",new si(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new Mn(S,p),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=tv;let d=this.type;this.render=function(A,C,P){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||A.length===0)return;const B=t.getRenderTarget(),x=t.getActiveCubeFace(),E=t.getActiveMipmapLevel(),k=t.state;k.setBlending(tr),k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);const O=d!==fi&&this.type===fi,$=d===fi&&this.type!==fi;for(let K=0,j=A.length;K<j;K++){const Y=A[K],N=Y.shadow;if(N===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;r.copy(N.mapSize);const F=N.getFrameExtents();if(r.multiply(F),s.copy(N.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/F.x),r.x=s.x*F.x,N.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/F.y),r.y=s.y*F.y,N.mapSize.y=s.y)),N.map===null||O===!0||$===!0){const ne=this.type!==fi?{minFilter:In,magFilter:In}:{};N.map!==null&&N.map.dispose(),N.map=new Fr(r.x,r.y,ne),N.map.texture.name=Y.name+".shadowMap",N.camera.updateProjectionMatrix()}t.setRenderTarget(N.map),t.clear();const V=N.getViewportCount();for(let ne=0;ne<V;ne++){const he=N.getViewport(ne);a.set(s.x*he.x,s.y*he.y,s.x*he.z,s.y*he.w),k.viewport(a),N.updateMatrices(Y,ne),i=N.getFrustum(),M(C,P,N.camera,Y,this.type)}N.isPointLightShadow!==!0&&this.type===fi&&_(N,P),N.needsUpdate=!1}d=this.type,m.needsUpdate=!1,t.setRenderTarget(B,x,E)};function _(A,C){const P=e.update(y);p.defines.VSM_SAMPLES!==A.blurSamples&&(p.defines.VSM_SAMPLES=A.blurSamples,g.defines.VSM_SAMPLES=A.blurSamples,p.needsUpdate=!0,g.needsUpdate=!0),A.mapPass===null&&(A.mapPass=new Fr(r.x,r.y)),p.uniforms.shadow_pass.value=A.map.texture,p.uniforms.resolution.value=A.mapSize,p.uniforms.radius.value=A.radius,t.setRenderTarget(A.mapPass),t.clear(),t.renderBufferDirect(C,null,P,p,y,null),g.uniforms.shadow_pass.value=A.mapPass.texture,g.uniforms.resolution.value=A.mapSize,g.uniforms.radius.value=A.radius,t.setRenderTarget(A.map),t.clear(),t.renderBufferDirect(C,null,P,g,y,null)}function v(A,C,P,B){let x=null;const E=P.isPointLight===!0?A.customDistanceMaterial:A.customDepthMaterial;if(E!==void 0)x=E;else if(x=P.isPointLight===!0?l:o,t.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){const k=x.uuid,O=C.uuid;let $=h[k];$===void 0&&($={},h[k]=$);let K=$[O];K===void 0&&(K=x.clone(),$[O]=K,C.addEventListener("dispose",R)),x=K}if(x.visible=C.visible,x.wireframe=C.wireframe,B===fi?x.side=C.shadowSide!==null?C.shadowSide:C.side:x.side=C.shadowSide!==null?C.shadowSide:f[C.side],x.alphaMap=C.alphaMap,x.alphaTest=C.alphaTest,x.map=C.map,x.clipShadows=C.clipShadows,x.clippingPlanes=C.clippingPlanes,x.clipIntersection=C.clipIntersection,x.displacementMap=C.displacementMap,x.displacementScale=C.displacementScale,x.displacementBias=C.displacementBias,x.wireframeLinewidth=C.wireframeLinewidth,x.linewidth=C.linewidth,P.isPointLight===!0&&x.isMeshDistanceMaterial===!0){const k=t.properties.get(x);k.light=P}return x}function M(A,C,P,B,x){if(A.visible===!1)return;if(A.layers.test(C.layers)&&(A.isMesh||A.isLine||A.isPoints)&&(A.castShadow||A.receiveShadow&&x===fi)&&(!A.frustumCulled||i.intersectsObject(A))){A.modelViewMatrix.multiplyMatrices(P.matrixWorldInverse,A.matrixWorld);const O=e.update(A),$=A.material;if(Array.isArray($)){const K=O.groups;for(let j=0,Y=K.length;j<Y;j++){const N=K[j],F=$[N.materialIndex];if(F&&F.visible){const V=v(A,F,B,x);A.onBeforeShadow(t,A,C,P,O,V,N),t.renderBufferDirect(P,null,O,V,A,N),A.onAfterShadow(t,A,C,P,O,V,N)}}}else if($.visible){const K=v(A,$,B,x);A.onBeforeShadow(t,A,C,P,O,K,null),t.renderBufferDirect(P,null,O,K,A,null),A.onAfterShadow(t,A,C,P,O,K,null)}}const k=A.children;for(let O=0,$=k.length;O<$;O++)M(k[O],C,P,B,x)}function R(A){A.target.removeEventListener("dispose",R);for(const P in h){const B=h[P],x=A.target.uuid;x in B&&(B[x].dispose(),delete B[x])}}}const ST={[xd]:yd,[Sd]:wd,[Md]:Td,[ks]:Ed,[yd]:xd,[wd]:Sd,[Td]:Md,[Ed]:ks};function MT(t){function e(){let D=!1;const me=new St;let q=null;const J=new St(0,0,0,0);return{setMask:function(fe){q!==fe&&!D&&(t.colorMask(fe,fe,fe,fe),q=fe)},setLocked:function(fe){D=fe},setClear:function(fe,ge,We,wt,tn){tn===!0&&(fe*=wt,ge*=wt,We*=wt),me.set(fe,ge,We,wt),J.equals(me)===!1&&(t.clearColor(fe,ge,We,wt),J.copy(me))},reset:function(){D=!1,q=null,J.set(-1,0,0,0)}}}function n(){let D=!1,me=!1,q=null,J=null,fe=null;return{setReversed:function(ge){me=ge},setTest:function(ge){ge?le(t.DEPTH_TEST):ce(t.DEPTH_TEST)},setMask:function(ge){q!==ge&&!D&&(t.depthMask(ge),q=ge)},setFunc:function(ge){if(me&&(ge=ST[ge]),J!==ge){switch(ge){case xd:t.depthFunc(t.NEVER);break;case yd:t.depthFunc(t.ALWAYS);break;case Sd:t.depthFunc(t.LESS);break;case ks:t.depthFunc(t.LEQUAL);break;case Md:t.depthFunc(t.EQUAL);break;case Ed:t.depthFunc(t.GEQUAL);break;case wd:t.depthFunc(t.GREATER);break;case Td:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}J=ge}},setLocked:function(ge){D=ge},setClear:function(ge){fe!==ge&&(t.clearDepth(ge),fe=ge)},reset:function(){D=!1,q=null,J=null,fe=null}}}function i(){let D=!1,me=null,q=null,J=null,fe=null,ge=null,We=null,wt=null,tn=null;return{setTest:function(Ke){D||(Ke?le(t.STENCIL_TEST):ce(t.STENCIL_TEST))},setMask:function(Ke){me!==Ke&&!D&&(t.stencilMask(Ke),me=Ke)},setFunc:function(Ke,nn,oi){(q!==Ke||J!==nn||fe!==oi)&&(t.stencilFunc(Ke,nn,oi),q=Ke,J=nn,fe=oi)},setOp:function(Ke,nn,oi){(ge!==Ke||We!==nn||wt!==oi)&&(t.stencilOp(Ke,nn,oi),ge=Ke,We=nn,wt=oi)},setLocked:function(Ke){D=Ke},setClear:function(Ke){tn!==Ke&&(t.clearStencil(Ke),tn=Ke)},reset:function(){D=!1,me=null,q=null,J=null,fe=null,ge=null,We=null,wt=null,tn=null}}}const r=new e,s=new n,a=new i,o=new WeakMap,l=new WeakMap;let h={},u={},f=new WeakMap,p=[],g=null,S=!1,y=null,m=null,d=null,_=null,v=null,M=null,R=null,A=new Be(0,0,0),C=0,P=!1,B=null,x=null,E=null,k=null,O=null;const $=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let K=!1,j=0;const Y=t.getParameter(t.VERSION);Y.indexOf("WebGL")!==-1?(j=parseFloat(/^WebGL (\d)/.exec(Y)[1]),K=j>=1):Y.indexOf("OpenGL ES")!==-1&&(j=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),K=j>=2);let N=null,F={};const V=t.getParameter(t.SCISSOR_BOX),ne=t.getParameter(t.VIEWPORT),he=new St().fromArray(V),be=new St().fromArray(ne);function X(D,me,q,J){const fe=new Uint8Array(4),ge=t.createTexture();t.bindTexture(D,ge),t.texParameteri(D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(D,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let We=0;We<q;We++)D===t.TEXTURE_3D||D===t.TEXTURE_2D_ARRAY?t.texImage3D(me,0,t.RGBA,1,1,J,0,t.RGBA,t.UNSIGNED_BYTE,fe):t.texImage2D(me+We,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,fe);return ge}const te={};te[t.TEXTURE_2D]=X(t.TEXTURE_2D,t.TEXTURE_2D,1),te[t.TEXTURE_CUBE_MAP]=X(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),te[t.TEXTURE_2D_ARRAY]=X(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),te[t.TEXTURE_3D]=X(t.TEXTURE_3D,t.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),a.setClear(0),le(t.DEPTH_TEST),s.setFunc(ks),He(!1),$e(Fp),le(t.CULL_FACE),L(tr);function le(D){h[D]!==!0&&(t.enable(D),h[D]=!0)}function ce(D){h[D]!==!1&&(t.disable(D),h[D]=!1)}function Ae(D,me){return u[D]!==me?(t.bindFramebuffer(D,me),u[D]=me,D===t.DRAW_FRAMEBUFFER&&(u[t.FRAMEBUFFER]=me),D===t.FRAMEBUFFER&&(u[t.DRAW_FRAMEBUFFER]=me),!0):!1}function Ce(D,me){let q=p,J=!1;if(D){q=f.get(me),q===void 0&&(q=[],f.set(me,q));const fe=D.textures;if(q.length!==fe.length||q[0]!==t.COLOR_ATTACHMENT0){for(let ge=0,We=fe.length;ge<We;ge++)q[ge]=t.COLOR_ATTACHMENT0+ge;q.length=fe.length,J=!0}}else q[0]!==t.BACK&&(q[0]=t.BACK,J=!0);J&&t.drawBuffers(q)}function ke(D){return g!==D?(t.useProgram(D),g=D,!0):!1}const Ye={[Sr]:t.FUNC_ADD,[ky]:t.FUNC_SUBTRACT,[Oy]:t.FUNC_REVERSE_SUBTRACT};Ye[zy]=t.MIN,Ye[By]=t.MAX;const Ge={[jy]:t.ZERO,[Hy]:t.ONE,[Vy]:t.SRC_COLOR,[_d]:t.SRC_ALPHA,[Yy]:t.SRC_ALPHA_SATURATE,[$y]:t.DST_COLOR,[Wy]:t.DST_ALPHA,[Gy]:t.ONE_MINUS_SRC_COLOR,[vd]:t.ONE_MINUS_SRC_ALPHA,[qy]:t.ONE_MINUS_DST_COLOR,[Xy]:t.ONE_MINUS_DST_ALPHA,[Ky]:t.CONSTANT_COLOR,[Zy]:t.ONE_MINUS_CONSTANT_COLOR,[Qy]:t.CONSTANT_ALPHA,[Jy]:t.ONE_MINUS_CONSTANT_ALPHA};function L(D,me,q,J,fe,ge,We,wt,tn,Ke){if(D===tr){S===!0&&(ce(t.BLEND),S=!1);return}if(S===!1&&(le(t.BLEND),S=!0),D!==Fy){if(D!==y||Ke!==P){if((m!==Sr||v!==Sr)&&(t.blendEquation(t.FUNC_ADD),m=Sr,v=Sr),Ke)switch(D){case As:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case kp:t.blendFunc(t.ONE,t.ONE);break;case Op:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case zp:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}else switch(D){case As:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case kp:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case Op:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case zp:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",D);break}d=null,_=null,M=null,R=null,A.set(0,0,0),C=0,y=D,P=Ke}return}fe=fe||me,ge=ge||q,We=We||J,(me!==m||fe!==v)&&(t.blendEquationSeparate(Ye[me],Ye[fe]),m=me,v=fe),(q!==d||J!==_||ge!==M||We!==R)&&(t.blendFuncSeparate(Ge[q],Ge[J],Ge[ge],Ge[We]),d=q,_=J,M=ge,R=We),(wt.equals(A)===!1||tn!==C)&&(t.blendColor(wt.r,wt.g,wt.b,tn),A.copy(wt),C=tn),y=D,P=!1}function pn(D,me){D.side===Ln?ce(t.CULL_FACE):le(t.CULL_FACE);let q=D.side===hn;me&&(q=!q),He(q),D.blending===As&&D.transparent===!1?L(tr):L(D.blending,D.blendEquation,D.blendSrc,D.blendDst,D.blendEquationAlpha,D.blendSrcAlpha,D.blendDstAlpha,D.blendColor,D.blendAlpha,D.premultipliedAlpha),s.setFunc(D.depthFunc),s.setTest(D.depthTest),s.setMask(D.depthWrite),r.setMask(D.colorWrite);const J=D.stencilWrite;a.setTest(J),J&&(a.setMask(D.stencilWriteMask),a.setFunc(D.stencilFunc,D.stencilRef,D.stencilFuncMask),a.setOp(D.stencilFail,D.stencilZFail,D.stencilZPass)),ot(D.polygonOffset,D.polygonOffsetFactor,D.polygonOffsetUnits),D.alphaToCoverage===!0?le(t.SAMPLE_ALPHA_TO_COVERAGE):ce(t.SAMPLE_ALPHA_TO_COVERAGE)}function He(D){B!==D&&(D?t.frontFace(t.CW):t.frontFace(t.CCW),B=D)}function $e(D){D!==Dy?(le(t.CULL_FACE),D!==x&&(D===Fp?t.cullFace(t.BACK):D===Iy?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):ce(t.CULL_FACE),x=D}function Le(D){D!==E&&(K&&t.lineWidth(D),E=D)}function ot(D,me,q){D?(le(t.POLYGON_OFFSET_FILL),(k!==me||O!==q)&&(t.polygonOffset(me,q),k=me,O=q)):ce(t.POLYGON_OFFSET_FILL)}function Ue(D){D?le(t.SCISSOR_TEST):ce(t.SCISSOR_TEST)}function b(D){D===void 0&&(D=t.TEXTURE0+$-1),N!==D&&(t.activeTexture(D),N=D)}function w(D,me,q){q===void 0&&(N===null?q=t.TEXTURE0+$-1:q=N);let J=F[q];J===void 0&&(J={type:void 0,texture:void 0},F[q]=J),(J.type!==D||J.texture!==me)&&(N!==q&&(t.activeTexture(q),N=q),t.bindTexture(D,me||te[D]),J.type=D,J.texture=me)}function H(){const D=F[N];D!==void 0&&D.type!==void 0&&(t.bindTexture(D.type,null),D.type=void 0,D.texture=void 0)}function Q(){try{t.compressedTexImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function re(){try{t.compressedTexImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Z(){try{t.texSubImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ee(){try{t.texSubImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function de(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ve(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function qe(){try{t.texStorage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function ae(){try{t.texStorage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function xe(){try{t.texImage2D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function De(){try{t.texImage3D.apply(t,arguments)}catch(D){console.error("THREE.WebGLState:",D)}}function Ie(D){he.equals(D)===!1&&(t.scissor(D.x,D.y,D.z,D.w),he.copy(D))}function ye(D){be.equals(D)===!1&&(t.viewport(D.x,D.y,D.z,D.w),be.copy(D))}function Ve(D,me){let q=l.get(me);q===void 0&&(q=new WeakMap,l.set(me,q));let J=q.get(D);J===void 0&&(J=t.getUniformBlockIndex(me,D.name),q.set(D,J))}function Fe(D,me){const J=l.get(me).get(D);o.get(me)!==J&&(t.uniformBlockBinding(me,J,D.__bindingPointIndex),o.set(me,J))}function st(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),h={},N=null,F={},u={},f=new WeakMap,p=[],g=null,S=!1,y=null,m=null,d=null,_=null,v=null,M=null,R=null,A=new Be(0,0,0),C=0,P=!1,B=null,x=null,E=null,k=null,O=null,he.set(0,0,t.canvas.width,t.canvas.height),be.set(0,0,t.canvas.width,t.canvas.height),r.reset(),s.reset(),a.reset()}return{buffers:{color:r,depth:s,stencil:a},enable:le,disable:ce,bindFramebuffer:Ae,drawBuffers:Ce,useProgram:ke,setBlending:L,setMaterial:pn,setFlipSided:He,setCullFace:$e,setLineWidth:Le,setPolygonOffset:ot,setScissorTest:Ue,activeTexture:b,bindTexture:w,unbindTexture:H,compressedTexImage2D:Q,compressedTexImage3D:re,texImage2D:xe,texImage3D:De,updateUBOMapping:Ve,uniformBlockBinding:Fe,texStorage2D:qe,texStorage3D:ae,texSubImage2D:Z,texSubImage3D:Ee,compressedTexSubImage2D:de,compressedTexSubImage3D:ve,scissor:Ie,viewport:ye,reset:st}}function Rm(t,e,n,i){const r=ET(i);switch(n){case ov:return t*e;case cv:return t*e;case uv:return t*e*2;case dv:return t*e/r.components*r.byteLength;case sf:return t*e/r.components*r.byteLength;case hv:return t*e*2/r.components*r.byteLength;case af:return t*e*2/r.components*r.byteLength;case lv:return t*e*3/r.components*r.byteLength;case qn:return t*e*4/r.components*r.byteLength;case of:return t*e*4/r.components*r.byteLength;case al:case ol:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case ll:case cl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Nd:case Dd:return Math.max(t,16)*Math.max(e,8)/4;case Pd:case Ld:return Math.max(t,8)*Math.max(e,8)/2;case Id:case Ud:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case Fd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case kd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Od:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case zd:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Bd:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case jd:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Hd:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Vd:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case Gd:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Wd:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case Xd:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case $d:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case qd:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case Yd:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case Kd:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case ul:case Zd:case Qd:return Math.ceil(t/4)*Math.ceil(e/4)*16;case fv:case Jd:return Math.ceil(t/4)*Math.ceil(e/4)*8;case eh:case th:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function ET(t){switch(t){case Ti:case rv:return{byteLength:1,components:1};case $a:case sv:case Ja:return{byteLength:2,components:1};case nf:case rf:return{byteLength:2,components:4};case Ur:case tf:case vi:return{byteLength:4,components:1};case av:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}function wT(t,e,n,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Ne,u=new WeakMap;let f;const p=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(b,w){return g?new OffscreenCanvas(b,w):Vl("canvas")}function y(b,w,H){let Q=1;const re=Ue(b);if((re.width>H||re.height>H)&&(Q=H/Math.max(re.width,re.height)),Q<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){const Z=Math.floor(Q*re.width),Ee=Math.floor(Q*re.height);f===void 0&&(f=S(Z,Ee));const de=w?S(Z,Ee):f;return de.width=Z,de.height=Ee,de.getContext("2d").drawImage(b,0,0,Z,Ee),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+re.width+"x"+re.height+") to ("+Z+"x"+Ee+")."),de}else return"data"in b&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+re.width+"x"+re.height+")."),b;return b}function m(b){return b.generateMipmaps&&b.minFilter!==In&&b.minFilter!==Xn}function d(b){t.generateMipmap(b)}function _(b,w,H,Q,re=!1){if(b!==null){if(t[b]!==void 0)return t[b];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let Z=w;if(w===t.RED&&(H===t.FLOAT&&(Z=t.R32F),H===t.HALF_FLOAT&&(Z=t.R16F),H===t.UNSIGNED_BYTE&&(Z=t.R8)),w===t.RED_INTEGER&&(H===t.UNSIGNED_BYTE&&(Z=t.R8UI),H===t.UNSIGNED_SHORT&&(Z=t.R16UI),H===t.UNSIGNED_INT&&(Z=t.R32UI),H===t.BYTE&&(Z=t.R8I),H===t.SHORT&&(Z=t.R16I),H===t.INT&&(Z=t.R32I)),w===t.RG&&(H===t.FLOAT&&(Z=t.RG32F),H===t.HALF_FLOAT&&(Z=t.RG16F),H===t.UNSIGNED_BYTE&&(Z=t.RG8)),w===t.RG_INTEGER&&(H===t.UNSIGNED_BYTE&&(Z=t.RG8UI),H===t.UNSIGNED_SHORT&&(Z=t.RG16UI),H===t.UNSIGNED_INT&&(Z=t.RG32UI),H===t.BYTE&&(Z=t.RG8I),H===t.SHORT&&(Z=t.RG16I),H===t.INT&&(Z=t.RG32I)),w===t.RGB_INTEGER&&(H===t.UNSIGNED_BYTE&&(Z=t.RGB8UI),H===t.UNSIGNED_SHORT&&(Z=t.RGB16UI),H===t.UNSIGNED_INT&&(Z=t.RGB32UI),H===t.BYTE&&(Z=t.RGB8I),H===t.SHORT&&(Z=t.RGB16I),H===t.INT&&(Z=t.RGB32I)),w===t.RGBA_INTEGER&&(H===t.UNSIGNED_BYTE&&(Z=t.RGBA8UI),H===t.UNSIGNED_SHORT&&(Z=t.RGBA16UI),H===t.UNSIGNED_INT&&(Z=t.RGBA32UI),H===t.BYTE&&(Z=t.RGBA8I),H===t.SHORT&&(Z=t.RGBA16I),H===t.INT&&(Z=t.RGBA32I)),w===t.RGB&&H===t.UNSIGNED_INT_5_9_9_9_REV&&(Z=t.RGB9_E5),w===t.RGBA){const Ee=re?zl:Je.getTransfer(Q);H===t.FLOAT&&(Z=t.RGBA32F),H===t.HALF_FLOAT&&(Z=t.RGBA16F),H===t.UNSIGNED_BYTE&&(Z=Ee===dt?t.SRGB8_ALPHA8:t.RGBA8),H===t.UNSIGNED_SHORT_4_4_4_4&&(Z=t.RGBA4),H===t.UNSIGNED_SHORT_5_5_5_1&&(Z=t.RGB5_A1)}return(Z===t.R16F||Z===t.R32F||Z===t.RG16F||Z===t.RG32F||Z===t.RGBA16F||Z===t.RGBA32F)&&e.get("EXT_color_buffer_float"),Z}function v(b,w){let H;return b?w===null||w===Ur||w===Bs?H=t.DEPTH24_STENCIL8:w===vi?H=t.DEPTH32F_STENCIL8:w===$a&&(H=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Ur||w===Bs?H=t.DEPTH_COMPONENT24:w===vi?H=t.DEPTH_COMPONENT32F:w===$a&&(H=t.DEPTH_COMPONENT16),H}function M(b,w){return m(b)===!0||b.isFramebufferTexture&&b.minFilter!==In&&b.minFilter!==Xn?Math.log2(Math.max(w.width,w.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?w.mipmaps.length:1}function R(b){const w=b.target;w.removeEventListener("dispose",R),C(w),w.isVideoTexture&&u.delete(w)}function A(b){const w=b.target;w.removeEventListener("dispose",A),B(w)}function C(b){const w=i.get(b);if(w.__webglInit===void 0)return;const H=b.source,Q=p.get(H);if(Q){const re=Q[w.__cacheKey];re.usedTimes--,re.usedTimes===0&&P(b),Object.keys(Q).length===0&&p.delete(H)}i.remove(b)}function P(b){const w=i.get(b);t.deleteTexture(w.__webglTexture);const H=b.source,Q=p.get(H);delete Q[w.__cacheKey],a.memory.textures--}function B(b){const w=i.get(b);if(b.depthTexture&&b.depthTexture.dispose(),b.isWebGLCubeRenderTarget)for(let Q=0;Q<6;Q++){if(Array.isArray(w.__webglFramebuffer[Q]))for(let re=0;re<w.__webglFramebuffer[Q].length;re++)t.deleteFramebuffer(w.__webglFramebuffer[Q][re]);else t.deleteFramebuffer(w.__webglFramebuffer[Q]);w.__webglDepthbuffer&&t.deleteRenderbuffer(w.__webglDepthbuffer[Q])}else{if(Array.isArray(w.__webglFramebuffer))for(let Q=0;Q<w.__webglFramebuffer.length;Q++)t.deleteFramebuffer(w.__webglFramebuffer[Q]);else t.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&t.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&t.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let Q=0;Q<w.__webglColorRenderbuffer.length;Q++)w.__webglColorRenderbuffer[Q]&&t.deleteRenderbuffer(w.__webglColorRenderbuffer[Q]);w.__webglDepthRenderbuffer&&t.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const H=b.textures;for(let Q=0,re=H.length;Q<re;Q++){const Z=i.get(H[Q]);Z.__webglTexture&&(t.deleteTexture(Z.__webglTexture),a.memory.textures--),i.remove(H[Q])}i.remove(b)}let x=0;function E(){x=0}function k(){const b=x;return b>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+r.maxTextures),x+=1,b}function O(b){const w=[];return w.push(b.wrapS),w.push(b.wrapT),w.push(b.wrapR||0),w.push(b.magFilter),w.push(b.minFilter),w.push(b.anisotropy),w.push(b.internalFormat),w.push(b.format),w.push(b.type),w.push(b.generateMipmaps),w.push(b.premultiplyAlpha),w.push(b.flipY),w.push(b.unpackAlignment),w.push(b.colorSpace),w.join()}function $(b,w){const H=i.get(b);if(b.isVideoTexture&&Le(b),b.isRenderTargetTexture===!1&&b.version>0&&H.__version!==b.version){const Q=b.image;if(Q===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(Q.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{be(H,b,w);return}}n.bindTexture(t.TEXTURE_2D,H.__webglTexture,t.TEXTURE0+w)}function K(b,w){const H=i.get(b);if(b.version>0&&H.__version!==b.version){be(H,b,w);return}n.bindTexture(t.TEXTURE_2D_ARRAY,H.__webglTexture,t.TEXTURE0+w)}function j(b,w){const H=i.get(b);if(b.version>0&&H.__version!==b.version){be(H,b,w);return}n.bindTexture(t.TEXTURE_3D,H.__webglTexture,t.TEXTURE0+w)}function Y(b,w){const H=i.get(b);if(b.version>0&&H.__version!==b.version){X(H,b,w);return}n.bindTexture(t.TEXTURE_CUBE_MAP,H.__webglTexture,t.TEXTURE0+w)}const N={[bd]:t.REPEAT,[Cr]:t.CLAMP_TO_EDGE,[Rd]:t.MIRRORED_REPEAT},F={[In]:t.NEAREST,[cS]:t.NEAREST_MIPMAP_NEAREST,[Mo]:t.NEAREST_MIPMAP_LINEAR,[Xn]:t.LINEAR,[Wc]:t.LINEAR_MIPMAP_NEAREST,[Ar]:t.LINEAR_MIPMAP_LINEAR},V={[fS]:t.NEVER,[xS]:t.ALWAYS,[pS]:t.LESS,[mv]:t.LEQUAL,[mS]:t.EQUAL,[vS]:t.GEQUAL,[gS]:t.GREATER,[_S]:t.NOTEQUAL};function ne(b,w){if(w.type===vi&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===Xn||w.magFilter===Wc||w.magFilter===Mo||w.magFilter===Ar||w.minFilter===Xn||w.minFilter===Wc||w.minFilter===Mo||w.minFilter===Ar)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(b,t.TEXTURE_WRAP_S,N[w.wrapS]),t.texParameteri(b,t.TEXTURE_WRAP_T,N[w.wrapT]),(b===t.TEXTURE_3D||b===t.TEXTURE_2D_ARRAY)&&t.texParameteri(b,t.TEXTURE_WRAP_R,N[w.wrapR]),t.texParameteri(b,t.TEXTURE_MAG_FILTER,F[w.magFilter]),t.texParameteri(b,t.TEXTURE_MIN_FILTER,F[w.minFilter]),w.compareFunction&&(t.texParameteri(b,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(b,t.TEXTURE_COMPARE_FUNC,V[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===In||w.minFilter!==Mo&&w.minFilter!==Ar||w.type===vi&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||i.get(w).__currentAnisotropy){const H=e.get("EXT_texture_filter_anisotropic");t.texParameterf(b,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,r.getMaxAnisotropy())),i.get(w).__currentAnisotropy=w.anisotropy}}}function he(b,w){let H=!1;b.__webglInit===void 0&&(b.__webglInit=!0,w.addEventListener("dispose",R));const Q=w.source;let re=p.get(Q);re===void 0&&(re={},p.set(Q,re));const Z=O(w);if(Z!==b.__cacheKey){re[Z]===void 0&&(re[Z]={texture:t.createTexture(),usedTimes:0},a.memory.textures++,H=!0),re[Z].usedTimes++;const Ee=re[b.__cacheKey];Ee!==void 0&&(re[b.__cacheKey].usedTimes--,Ee.usedTimes===0&&P(w)),b.__cacheKey=Z,b.__webglTexture=re[Z].texture}return H}function be(b,w,H){let Q=t.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(Q=t.TEXTURE_2D_ARRAY),w.isData3DTexture&&(Q=t.TEXTURE_3D);const re=he(b,w),Z=w.source;n.bindTexture(Q,b.__webglTexture,t.TEXTURE0+H);const Ee=i.get(Z);if(Z.version!==Ee.__version||re===!0){n.activeTexture(t.TEXTURE0+H);const de=Je.getPrimaries(Je.workingColorSpace),ve=w.colorSpace===Vi?null:Je.getPrimaries(w.colorSpace),qe=w.colorSpace===Vi||de===ve?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,w.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,qe);let ae=y(w.image,!1,r.maxTextureSize);ae=ot(w,ae);const xe=s.convert(w.format,w.colorSpace),De=s.convert(w.type);let Ie=_(w.internalFormat,xe,De,w.colorSpace,w.isVideoTexture);ne(Q,w);let ye;const Ve=w.mipmaps,Fe=w.isVideoTexture!==!0,st=Ee.__version===void 0||re===!0,D=Z.dataReady,me=M(w,ae);if(w.isDepthTexture)Ie=v(w.format===js,w.type),st&&(Fe?n.texStorage2D(t.TEXTURE_2D,1,Ie,ae.width,ae.height):n.texImage2D(t.TEXTURE_2D,0,Ie,ae.width,ae.height,0,xe,De,null));else if(w.isDataTexture)if(Ve.length>0){Fe&&st&&n.texStorage2D(t.TEXTURE_2D,me,Ie,Ve[0].width,Ve[0].height);for(let q=0,J=Ve.length;q<J;q++)ye=Ve[q],Fe?D&&n.texSubImage2D(t.TEXTURE_2D,q,0,0,ye.width,ye.height,xe,De,ye.data):n.texImage2D(t.TEXTURE_2D,q,Ie,ye.width,ye.height,0,xe,De,ye.data);w.generateMipmaps=!1}else Fe?(st&&n.texStorage2D(t.TEXTURE_2D,me,Ie,ae.width,ae.height),D&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,ae.width,ae.height,xe,De,ae.data)):n.texImage2D(t.TEXTURE_2D,0,Ie,ae.width,ae.height,0,xe,De,ae.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){Fe&&st&&n.texStorage3D(t.TEXTURE_2D_ARRAY,me,Ie,Ve[0].width,Ve[0].height,ae.depth);for(let q=0,J=Ve.length;q<J;q++)if(ye=Ve[q],w.format!==qn)if(xe!==null)if(Fe){if(D)if(w.layerUpdates.size>0){const fe=Rm(ye.width,ye.height,w.format,w.type);for(const ge of w.layerUpdates){const We=ye.data.subarray(ge*fe/ye.data.BYTES_PER_ELEMENT,(ge+1)*fe/ye.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,q,0,0,ge,ye.width,ye.height,1,xe,We,0,0)}w.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,q,0,0,0,ye.width,ye.height,ae.depth,xe,ye.data,0,0)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,q,Ie,ye.width,ye.height,ae.depth,0,ye.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Fe?D&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,q,0,0,0,ye.width,ye.height,ae.depth,xe,De,ye.data):n.texImage3D(t.TEXTURE_2D_ARRAY,q,Ie,ye.width,ye.height,ae.depth,0,xe,De,ye.data)}else{Fe&&st&&n.texStorage2D(t.TEXTURE_2D,me,Ie,Ve[0].width,Ve[0].height);for(let q=0,J=Ve.length;q<J;q++)ye=Ve[q],w.format!==qn?xe!==null?Fe?D&&n.compressedTexSubImage2D(t.TEXTURE_2D,q,0,0,ye.width,ye.height,xe,ye.data):n.compressedTexImage2D(t.TEXTURE_2D,q,Ie,ye.width,ye.height,0,ye.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Fe?D&&n.texSubImage2D(t.TEXTURE_2D,q,0,0,ye.width,ye.height,xe,De,ye.data):n.texImage2D(t.TEXTURE_2D,q,Ie,ye.width,ye.height,0,xe,De,ye.data)}else if(w.isDataArrayTexture)if(Fe){if(st&&n.texStorage3D(t.TEXTURE_2D_ARRAY,me,Ie,ae.width,ae.height,ae.depth),D)if(w.layerUpdates.size>0){const q=Rm(ae.width,ae.height,w.format,w.type);for(const J of w.layerUpdates){const fe=ae.data.subarray(J*q/ae.data.BYTES_PER_ELEMENT,(J+1)*q/ae.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,J,ae.width,ae.height,1,xe,De,fe)}w.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,ae.width,ae.height,ae.depth,xe,De,ae.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,Ie,ae.width,ae.height,ae.depth,0,xe,De,ae.data);else if(w.isData3DTexture)Fe?(st&&n.texStorage3D(t.TEXTURE_3D,me,Ie,ae.width,ae.height,ae.depth),D&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,ae.width,ae.height,ae.depth,xe,De,ae.data)):n.texImage3D(t.TEXTURE_3D,0,Ie,ae.width,ae.height,ae.depth,0,xe,De,ae.data);else if(w.isFramebufferTexture){if(st)if(Fe)n.texStorage2D(t.TEXTURE_2D,me,Ie,ae.width,ae.height);else{let q=ae.width,J=ae.height;for(let fe=0;fe<me;fe++)n.texImage2D(t.TEXTURE_2D,fe,Ie,q,J,0,xe,De,null),q>>=1,J>>=1}}else if(Ve.length>0){if(Fe&&st){const q=Ue(Ve[0]);n.texStorage2D(t.TEXTURE_2D,me,Ie,q.width,q.height)}for(let q=0,J=Ve.length;q<J;q++)ye=Ve[q],Fe?D&&n.texSubImage2D(t.TEXTURE_2D,q,0,0,xe,De,ye):n.texImage2D(t.TEXTURE_2D,q,Ie,xe,De,ye);w.generateMipmaps=!1}else if(Fe){if(st){const q=Ue(ae);n.texStorage2D(t.TEXTURE_2D,me,Ie,q.width,q.height)}D&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,xe,De,ae)}else n.texImage2D(t.TEXTURE_2D,0,Ie,xe,De,ae);m(w)&&d(Q),Ee.__version=Z.version,w.onUpdate&&w.onUpdate(w)}b.__version=w.version}function X(b,w,H){if(w.image.length!==6)return;const Q=he(b,w),re=w.source;n.bindTexture(t.TEXTURE_CUBE_MAP,b.__webglTexture,t.TEXTURE0+H);const Z=i.get(re);if(re.version!==Z.__version||Q===!0){n.activeTexture(t.TEXTURE0+H);const Ee=Je.getPrimaries(Je.workingColorSpace),de=w.colorSpace===Vi?null:Je.getPrimaries(w.colorSpace),ve=w.colorSpace===Vi||Ee===de?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,w.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve);const qe=w.isCompressedTexture||w.image[0].isCompressedTexture,ae=w.image[0]&&w.image[0].isDataTexture,xe=[];for(let J=0;J<6;J++)!qe&&!ae?xe[J]=y(w.image[J],!0,r.maxCubemapSize):xe[J]=ae?w.image[J].image:w.image[J],xe[J]=ot(w,xe[J]);const De=xe[0],Ie=s.convert(w.format,w.colorSpace),ye=s.convert(w.type),Ve=_(w.internalFormat,Ie,ye,w.colorSpace),Fe=w.isVideoTexture!==!0,st=Z.__version===void 0||Q===!0,D=re.dataReady;let me=M(w,De);ne(t.TEXTURE_CUBE_MAP,w);let q;if(qe){Fe&&st&&n.texStorage2D(t.TEXTURE_CUBE_MAP,me,Ve,De.width,De.height);for(let J=0;J<6;J++){q=xe[J].mipmaps;for(let fe=0;fe<q.length;fe++){const ge=q[fe];w.format!==qn?Ie!==null?Fe?D&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,fe,0,0,ge.width,ge.height,Ie,ge.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,fe,Ve,ge.width,ge.height,0,ge.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Fe?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,fe,0,0,ge.width,ge.height,Ie,ye,ge.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,fe,Ve,ge.width,ge.height,0,Ie,ye,ge.data)}}}else{if(q=w.mipmaps,Fe&&st){q.length>0&&me++;const J=Ue(xe[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,me,Ve,J.width,J.height)}for(let J=0;J<6;J++)if(ae){Fe?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,xe[J].width,xe[J].height,Ie,ye,xe[J].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Ve,xe[J].width,xe[J].height,0,Ie,ye,xe[J].data);for(let fe=0;fe<q.length;fe++){const We=q[fe].image[J].image;Fe?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,fe+1,0,0,We.width,We.height,Ie,ye,We.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,fe+1,Ve,We.width,We.height,0,Ie,ye,We.data)}}else{Fe?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,Ie,ye,xe[J]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,Ve,Ie,ye,xe[J]);for(let fe=0;fe<q.length;fe++){const ge=q[fe];Fe?D&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,fe+1,0,0,Ie,ye,ge.image[J]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+J,fe+1,Ve,Ie,ye,ge.image[J])}}}m(w)&&d(t.TEXTURE_CUBE_MAP),Z.__version=re.version,w.onUpdate&&w.onUpdate(w)}b.__version=w.version}function te(b,w,H,Q,re,Z){const Ee=s.convert(H.format,H.colorSpace),de=s.convert(H.type),ve=_(H.internalFormat,Ee,de,H.colorSpace);if(!i.get(w).__hasExternalTextures){const ae=Math.max(1,w.width>>Z),xe=Math.max(1,w.height>>Z);re===t.TEXTURE_3D||re===t.TEXTURE_2D_ARRAY?n.texImage3D(re,Z,ve,ae,xe,w.depth,0,Ee,de,null):n.texImage2D(re,Z,ve,ae,xe,0,Ee,de,null)}n.bindFramebuffer(t.FRAMEBUFFER,b),$e(w)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,Q,re,i.get(H).__webglTexture,0,He(w)):(re===t.TEXTURE_2D||re>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&re<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,Q,re,i.get(H).__webglTexture,Z),n.bindFramebuffer(t.FRAMEBUFFER,null)}function le(b,w,H){if(t.bindRenderbuffer(t.RENDERBUFFER,b),w.depthBuffer){const Q=w.depthTexture,re=Q&&Q.isDepthTexture?Q.type:null,Z=v(w.stencilBuffer,re),Ee=w.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,de=He(w);$e(w)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,de,Z,w.width,w.height):H?t.renderbufferStorageMultisample(t.RENDERBUFFER,de,Z,w.width,w.height):t.renderbufferStorage(t.RENDERBUFFER,Z,w.width,w.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,Ee,t.RENDERBUFFER,b)}else{const Q=w.textures;for(let re=0;re<Q.length;re++){const Z=Q[re],Ee=s.convert(Z.format,Z.colorSpace),de=s.convert(Z.type),ve=_(Z.internalFormat,Ee,de,Z.colorSpace),qe=He(w);H&&$e(w)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,qe,ve,w.width,w.height):$e(w)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,qe,ve,w.width,w.height):t.renderbufferStorage(t.RENDERBUFFER,ve,w.width,w.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function ce(b,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,b),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(w.depthTexture).__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),$(w.depthTexture,0);const Q=i.get(w.depthTexture).__webglTexture,re=He(w);if(w.depthTexture.format===bs)$e(w)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,Q,0,re):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,Q,0);else if(w.depthTexture.format===js)$e(w)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,Q,0,re):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,Q,0);else throw new Error("Unknown depthTexture format")}function Ae(b){const w=i.get(b),H=b.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==b.depthTexture){const Q=b.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),Q){const re=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,Q.removeEventListener("dispose",re)};Q.addEventListener("dispose",re),w.__depthDisposeCallback=re}w.__boundDepthTexture=Q}if(b.depthTexture&&!w.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");ce(w.__webglFramebuffer,b)}else if(H){w.__webglDepthbuffer=[];for(let Q=0;Q<6;Q++)if(n.bindFramebuffer(t.FRAMEBUFFER,w.__webglFramebuffer[Q]),w.__webglDepthbuffer[Q]===void 0)w.__webglDepthbuffer[Q]=t.createRenderbuffer(),le(w.__webglDepthbuffer[Q],b,!1);else{const re=b.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Z=w.__webglDepthbuffer[Q];t.bindRenderbuffer(t.RENDERBUFFER,Z),t.framebufferRenderbuffer(t.FRAMEBUFFER,re,t.RENDERBUFFER,Z)}}else if(n.bindFramebuffer(t.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=t.createRenderbuffer(),le(w.__webglDepthbuffer,b,!1);else{const Q=b.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,re=w.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,re),t.framebufferRenderbuffer(t.FRAMEBUFFER,Q,t.RENDERBUFFER,re)}n.bindFramebuffer(t.FRAMEBUFFER,null)}function Ce(b,w,H){const Q=i.get(b);w!==void 0&&te(Q.__webglFramebuffer,b,b.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),H!==void 0&&Ae(b)}function ke(b){const w=b.texture,H=i.get(b),Q=i.get(w);b.addEventListener("dispose",A);const re=b.textures,Z=b.isWebGLCubeRenderTarget===!0,Ee=re.length>1;if(Ee||(Q.__webglTexture===void 0&&(Q.__webglTexture=t.createTexture()),Q.__version=w.version,a.memory.textures++),Z){H.__webglFramebuffer=[];for(let de=0;de<6;de++)if(w.mipmaps&&w.mipmaps.length>0){H.__webglFramebuffer[de]=[];for(let ve=0;ve<w.mipmaps.length;ve++)H.__webglFramebuffer[de][ve]=t.createFramebuffer()}else H.__webglFramebuffer[de]=t.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){H.__webglFramebuffer=[];for(let de=0;de<w.mipmaps.length;de++)H.__webglFramebuffer[de]=t.createFramebuffer()}else H.__webglFramebuffer=t.createFramebuffer();if(Ee)for(let de=0,ve=re.length;de<ve;de++){const qe=i.get(re[de]);qe.__webglTexture===void 0&&(qe.__webglTexture=t.createTexture(),a.memory.textures++)}if(b.samples>0&&$e(b)===!1){H.__webglMultisampledFramebuffer=t.createFramebuffer(),H.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let de=0;de<re.length;de++){const ve=re[de];H.__webglColorRenderbuffer[de]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,H.__webglColorRenderbuffer[de]);const qe=s.convert(ve.format,ve.colorSpace),ae=s.convert(ve.type),xe=_(ve.internalFormat,qe,ae,ve.colorSpace,b.isXRRenderTarget===!0),De=He(b);t.renderbufferStorageMultisample(t.RENDERBUFFER,De,xe,b.width,b.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+de,t.RENDERBUFFER,H.__webglColorRenderbuffer[de])}t.bindRenderbuffer(t.RENDERBUFFER,null),b.depthBuffer&&(H.__webglDepthRenderbuffer=t.createRenderbuffer(),le(H.__webglDepthRenderbuffer,b,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(Z){n.bindTexture(t.TEXTURE_CUBE_MAP,Q.__webglTexture),ne(t.TEXTURE_CUBE_MAP,w);for(let de=0;de<6;de++)if(w.mipmaps&&w.mipmaps.length>0)for(let ve=0;ve<w.mipmaps.length;ve++)te(H.__webglFramebuffer[de][ve],b,w,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+de,ve);else te(H.__webglFramebuffer[de],b,w,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+de,0);m(w)&&d(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Ee){for(let de=0,ve=re.length;de<ve;de++){const qe=re[de],ae=i.get(qe);n.bindTexture(t.TEXTURE_2D,ae.__webglTexture),ne(t.TEXTURE_2D,qe),te(H.__webglFramebuffer,b,qe,t.COLOR_ATTACHMENT0+de,t.TEXTURE_2D,0),m(qe)&&d(t.TEXTURE_2D)}n.unbindTexture()}else{let de=t.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(de=b.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(de,Q.__webglTexture),ne(de,w),w.mipmaps&&w.mipmaps.length>0)for(let ve=0;ve<w.mipmaps.length;ve++)te(H.__webglFramebuffer[ve],b,w,t.COLOR_ATTACHMENT0,de,ve);else te(H.__webglFramebuffer,b,w,t.COLOR_ATTACHMENT0,de,0);m(w)&&d(de),n.unbindTexture()}b.depthBuffer&&Ae(b)}function Ye(b){const w=b.textures;for(let H=0,Q=w.length;H<Q;H++){const re=w[H];if(m(re)){const Z=b.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:t.TEXTURE_2D,Ee=i.get(re).__webglTexture;n.bindTexture(Z,Ee),d(Z),n.unbindTexture()}}}const Ge=[],L=[];function pn(b){if(b.samples>0){if($e(b)===!1){const w=b.textures,H=b.width,Q=b.height;let re=t.COLOR_BUFFER_BIT;const Z=b.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Ee=i.get(b),de=w.length>1;if(de)for(let ve=0;ve<w.length;ve++)n.bindFramebuffer(t.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,Ee.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer);for(let ve=0;ve<w.length;ve++){if(b.resolveDepthBuffer&&(b.depthBuffer&&(re|=t.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&(re|=t.STENCIL_BUFFER_BIT)),de){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,Ee.__webglColorRenderbuffer[ve]);const qe=i.get(w[ve]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,qe,0)}t.blitFramebuffer(0,0,H,Q,0,0,H,Q,re,t.NEAREST),l===!0&&(Ge.length=0,L.length=0,Ge.push(t.COLOR_ATTACHMENT0+ve),b.depthBuffer&&b.resolveDepthBuffer===!1&&(Ge.push(Z),L.push(Z),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,L)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,Ge))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),de)for(let ve=0;ve<w.length;ve++){n.bindFramebuffer(t.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.RENDERBUFFER,Ee.__webglColorRenderbuffer[ve]);const qe=i.get(w[ve]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,Ee.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+ve,t.TEXTURE_2D,qe,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.resolveDepthBuffer===!1&&l){const w=b.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[w])}}}function He(b){return Math.min(r.maxSamples,b.samples)}function $e(b){const w=i.get(b);return b.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function Le(b){const w=a.render.frame;u.get(b)!==w&&(u.set(b,w),b.update())}function ot(b,w){const H=b.colorSpace,Q=b.format,re=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||H!==ur&&H!==Vi&&(Je.getTransfer(H)===dt?(Q!==qn||re!==Ti)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),w}function Ue(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(h.width=b.naturalWidth||b.width,h.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(h.width=b.displayWidth,h.height=b.displayHeight):(h.width=b.width,h.height=b.height),h}this.allocateTextureUnit=k,this.resetTextureUnits=E,this.setTexture2D=$,this.setTexture2DArray=K,this.setTexture3D=j,this.setTextureCube=Y,this.rebindTextures=Ce,this.setupRenderTarget=ke,this.updateRenderTargetMipmap=Ye,this.updateMultisampleRenderTarget=pn,this.setupDepthRenderbuffer=Ae,this.setupFrameBufferTexture=te,this.useMultisampledRTT=$e}function TT(t,e){function n(i,r=Vi){let s;const a=Je.getTransfer(r);if(i===Ti)return t.UNSIGNED_BYTE;if(i===nf)return t.UNSIGNED_SHORT_4_4_4_4;if(i===rf)return t.UNSIGNED_SHORT_5_5_5_1;if(i===av)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===rv)return t.BYTE;if(i===sv)return t.SHORT;if(i===$a)return t.UNSIGNED_SHORT;if(i===tf)return t.INT;if(i===Ur)return t.UNSIGNED_INT;if(i===vi)return t.FLOAT;if(i===Ja)return t.HALF_FLOAT;if(i===ov)return t.ALPHA;if(i===lv)return t.RGB;if(i===qn)return t.RGBA;if(i===cv)return t.LUMINANCE;if(i===uv)return t.LUMINANCE_ALPHA;if(i===bs)return t.DEPTH_COMPONENT;if(i===js)return t.DEPTH_STENCIL;if(i===dv)return t.RED;if(i===sf)return t.RED_INTEGER;if(i===hv)return t.RG;if(i===af)return t.RG_INTEGER;if(i===of)return t.RGBA_INTEGER;if(i===al||i===ol||i===ll||i===cl)if(a===dt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===al)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===ol)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ll)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===cl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===al)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===ol)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ll)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===cl)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Pd||i===Nd||i===Ld||i===Dd)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Pd)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Nd)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Ld)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Dd)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Id||i===Ud||i===Fd)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Id||i===Ud)return a===dt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===Fd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===kd||i===Od||i===zd||i===Bd||i===jd||i===Hd||i===Vd||i===Gd||i===Wd||i===Xd||i===$d||i===qd||i===Yd||i===Kd)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===kd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===Od)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===zd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Bd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===jd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Hd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Vd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Gd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Wd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===Xd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===$d)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===qd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Yd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Kd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===ul||i===Zd||i===Qd)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===ul)return a===dt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Zd)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Qd)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===fv||i===Jd||i===eh||i===th)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===ul)return s.COMPRESSED_RED_RGTC1_EXT;if(i===Jd)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===eh)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===th)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===Bs?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}class CT extends yn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Xi extends kt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const AT={type:"move"};class yu{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Xi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Xi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new z,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new z),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Xi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new z,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new z),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,a=null;const o=this._targetRay,l=this._grip,h=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(h&&e.hand){a=!0;for(const y of e.hand.values()){const m=n.getJointPose(y,i),d=this._getHandJoint(h,y);m!==null&&(d.matrix.fromArray(m.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=m.radius),d.visible=m!==null}const u=h.joints["index-finger-tip"],f=h.joints["thumb-tip"],p=u.position.distanceTo(f.position),g=.02,S=.005;h.inputState.pinching&&p>g+S?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&p<=g-S&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(AT)))}return o!==null&&(o.visible=r!==null),l!==null&&(l.visible=s!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new Xi;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const bT=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,RT=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class PT{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,i){if(this.texture===null){const r=new fn,s=e.properties.get(r);s.__webglTexture=n.texture,(n.depthNear!=i.depthNear||n.depthFar!=i.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new ar({vertexShader:bT,fragmentShader:RT,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Mn(new hc(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class NT extends Br{constructor(e,n){super();const i=this;let r=null,s=1,a=null,o="local-floor",l=1,h=null,u=null,f=null,p=null,g=null,S=null;const y=new PT,m=n.getContextAttributes();let d=null,_=null;const v=[],M=[],R=new Ne;let A=null;const C=new yn;C.layers.enable(1),C.viewport=new St;const P=new yn;P.layers.enable(2),P.viewport=new St;const B=[C,P],x=new CT;x.layers.enable(1),x.layers.enable(2);let E=null,k=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(X){let te=v[X];return te===void 0&&(te=new yu,v[X]=te),te.getTargetRaySpace()},this.getControllerGrip=function(X){let te=v[X];return te===void 0&&(te=new yu,v[X]=te),te.getGripSpace()},this.getHand=function(X){let te=v[X];return te===void 0&&(te=new yu,v[X]=te),te.getHandSpace()};function O(X){const te=M.indexOf(X.inputSource);if(te===-1)return;const le=v[te];le!==void 0&&(le.update(X.inputSource,X.frame,h||a),le.dispatchEvent({type:X.type,data:X.inputSource}))}function $(){r.removeEventListener("select",O),r.removeEventListener("selectstart",O),r.removeEventListener("selectend",O),r.removeEventListener("squeeze",O),r.removeEventListener("squeezestart",O),r.removeEventListener("squeezeend",O),r.removeEventListener("end",$),r.removeEventListener("inputsourceschange",K);for(let X=0;X<v.length;X++){const te=M[X];te!==null&&(M[X]=null,v[X].disconnect(te))}E=null,k=null,y.reset(),e.setRenderTarget(d),g=null,p=null,f=null,r=null,_=null,be.stop(),i.isPresenting=!1,e.setPixelRatio(A),e.setSize(R.width,R.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(X){s=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(X){o=X,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(X){h=X},this.getBaseLayer=function(){return p!==null?p:g},this.getBinding=function(){return f},this.getFrame=function(){return S},this.getSession=function(){return r},this.setSession=async function(X){if(r=X,r!==null){if(d=e.getRenderTarget(),r.addEventListener("select",O),r.addEventListener("selectstart",O),r.addEventListener("selectend",O),r.addEventListener("squeeze",O),r.addEventListener("squeezestart",O),r.addEventListener("squeezeend",O),r.addEventListener("end",$),r.addEventListener("inputsourceschange",K),m.xrCompatible!==!0&&await n.makeXRCompatible(),A=e.getPixelRatio(),e.getSize(R),r.renderState.layers===void 0){const te={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};g=new XRWebGLLayer(r,n,te),r.updateRenderState({baseLayer:g}),e.setPixelRatio(1),e.setSize(g.framebufferWidth,g.framebufferHeight,!1),_=new Fr(g.framebufferWidth,g.framebufferHeight,{format:qn,type:Ti,colorSpace:e.outputColorSpace,stencilBuffer:m.stencil})}else{let te=null,le=null,ce=null;m.depth&&(ce=m.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,te=m.stencil?js:bs,le=m.stencil?Bs:Ur);const Ae={colorFormat:n.RGBA8,depthFormat:ce,scaleFactor:s};f=new XRWebGLBinding(r,n),p=f.createProjectionLayer(Ae),r.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),_=new Fr(p.textureWidth,p.textureHeight,{format:qn,type:Ti,depthTexture:new Rv(p.textureWidth,p.textureHeight,le,void 0,void 0,void 0,void 0,void 0,void 0,te),stencilBuffer:m.stencil,colorSpace:e.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(l),h=null,a=await r.requestReferenceSpace(o),be.setContext(r),be.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return y.getDepthTexture()};function K(X){for(let te=0;te<X.removed.length;te++){const le=X.removed[te],ce=M.indexOf(le);ce>=0&&(M[ce]=null,v[ce].disconnect(le))}for(let te=0;te<X.added.length;te++){const le=X.added[te];let ce=M.indexOf(le);if(ce===-1){for(let Ce=0;Ce<v.length;Ce++)if(Ce>=M.length){M.push(le),ce=Ce;break}else if(M[Ce]===null){M[Ce]=le,ce=Ce;break}if(ce===-1)break}const Ae=v[ce];Ae&&Ae.connect(le)}}const j=new z,Y=new z;function N(X,te,le){j.setFromMatrixPosition(te.matrixWorld),Y.setFromMatrixPosition(le.matrixWorld);const ce=j.distanceTo(Y),Ae=te.projectionMatrix.elements,Ce=le.projectionMatrix.elements,ke=Ae[14]/(Ae[10]-1),Ye=Ae[14]/(Ae[10]+1),Ge=(Ae[9]+1)/Ae[5],L=(Ae[9]-1)/Ae[5],pn=(Ae[8]-1)/Ae[0],He=(Ce[8]+1)/Ce[0],$e=ke*pn,Le=ke*He,ot=ce/(-pn+He),Ue=ot*-pn;if(te.matrixWorld.decompose(X.position,X.quaternion,X.scale),X.translateX(Ue),X.translateZ(ot),X.matrixWorld.compose(X.position,X.quaternion,X.scale),X.matrixWorldInverse.copy(X.matrixWorld).invert(),Ae[10]===-1)X.projectionMatrix.copy(te.projectionMatrix),X.projectionMatrixInverse.copy(te.projectionMatrixInverse);else{const b=ke+ot,w=Ye+ot,H=$e-Ue,Q=Le+(ce-Ue),re=Ge*Ye/w*b,Z=L*Ye/w*b;X.projectionMatrix.makePerspective(H,Q,re,Z,b,w),X.projectionMatrixInverse.copy(X.projectionMatrix).invert()}}function F(X,te){te===null?X.matrixWorld.copy(X.matrix):X.matrixWorld.multiplyMatrices(te.matrixWorld,X.matrix),X.matrixWorldInverse.copy(X.matrixWorld).invert()}this.updateCamera=function(X){if(r===null)return;let te=X.near,le=X.far;y.texture!==null&&(y.depthNear>0&&(te=y.depthNear),y.depthFar>0&&(le=y.depthFar)),x.near=P.near=C.near=te,x.far=P.far=C.far=le,(E!==x.near||k!==x.far)&&(r.updateRenderState({depthNear:x.near,depthFar:x.far}),E=x.near,k=x.far);const ce=X.parent,Ae=x.cameras;F(x,ce);for(let Ce=0;Ce<Ae.length;Ce++)F(Ae[Ce],ce);Ae.length===2?N(x,C,P):x.projectionMatrix.copy(C.projectionMatrix),V(X,x,ce)};function V(X,te,le){le===null?X.matrix.copy(te.matrixWorld):(X.matrix.copy(le.matrixWorld),X.matrix.invert(),X.matrix.multiply(te.matrixWorld)),X.matrix.decompose(X.position,X.quaternion,X.scale),X.updateMatrixWorld(!0),X.projectionMatrix.copy(te.projectionMatrix),X.projectionMatrixInverse.copy(te.projectionMatrixInverse),X.isPerspectiveCamera&&(X.fov=nh*2*Math.atan(1/X.projectionMatrix.elements[5]),X.zoom=1)}this.getCamera=function(){return x},this.getFoveation=function(){if(!(p===null&&g===null))return l},this.setFoveation=function(X){l=X,p!==null&&(p.fixedFoveation=X),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=X)},this.hasDepthSensing=function(){return y.texture!==null},this.getDepthSensingMesh=function(){return y.getMesh(x)};let ne=null;function he(X,te){if(u=te.getViewerPose(h||a),S=te,u!==null){const le=u.views;g!==null&&(e.setRenderTargetFramebuffer(_,g.framebuffer),e.setRenderTarget(_));let ce=!1;le.length!==x.cameras.length&&(x.cameras.length=0,ce=!0);for(let Ce=0;Ce<le.length;Ce++){const ke=le[Ce];let Ye=null;if(g!==null)Ye=g.getViewport(ke);else{const L=f.getViewSubImage(p,ke);Ye=L.viewport,Ce===0&&(e.setRenderTargetTextures(_,L.colorTexture,p.ignoreDepthValues?void 0:L.depthStencilTexture),e.setRenderTarget(_))}let Ge=B[Ce];Ge===void 0&&(Ge=new yn,Ge.layers.enable(Ce),Ge.viewport=new St,B[Ce]=Ge),Ge.matrix.fromArray(ke.transform.matrix),Ge.matrix.decompose(Ge.position,Ge.quaternion,Ge.scale),Ge.projectionMatrix.fromArray(ke.projectionMatrix),Ge.projectionMatrixInverse.copy(Ge.projectionMatrix).invert(),Ge.viewport.set(Ye.x,Ye.y,Ye.width,Ye.height),Ce===0&&(x.matrix.copy(Ge.matrix),x.matrix.decompose(x.position,x.quaternion,x.scale)),ce===!0&&x.cameras.push(Ge)}const Ae=r.enabledFeatures;if(Ae&&Ae.includes("depth-sensing")){const Ce=f.getDepthInformation(le[0]);Ce&&Ce.isValid&&Ce.texture&&y.init(e,Ce,r.renderState)}}for(let le=0;le<v.length;le++){const ce=M[le],Ae=v[le];ce!==null&&Ae!==void 0&&Ae.update(ce,te,h||a)}ne&&ne(X,te),te.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:te}),S=null}const be=new Av;be.setAnimationLoop(he),this.setAnimationLoop=function(X){ne=X},this.dispose=function(){}}}const _r=new ai,LT=new _t;function DT(t,e){function n(m,d){m.matrixAutoUpdate===!0&&m.updateMatrix(),d.value.copy(m.matrix)}function i(m,d){d.color.getRGB(m.fogColor.value,wv(t)),d.isFog?(m.fogNear.value=d.near,m.fogFar.value=d.far):d.isFogExp2&&(m.fogDensity.value=d.density)}function r(m,d,_,v,M){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(m,d):d.isMeshToonMaterial?(s(m,d),f(m,d)):d.isMeshPhongMaterial?(s(m,d),u(m,d)):d.isMeshStandardMaterial?(s(m,d),p(m,d),d.isMeshPhysicalMaterial&&g(m,d,M)):d.isMeshMatcapMaterial?(s(m,d),S(m,d)):d.isMeshDepthMaterial?s(m,d):d.isMeshDistanceMaterial?(s(m,d),y(m,d)):d.isMeshNormalMaterial?s(m,d):d.isLineBasicMaterial?(a(m,d),d.isLineDashedMaterial&&o(m,d)):d.isPointsMaterial?l(m,d,_,v):d.isSpriteMaterial?h(m,d):d.isShadowMaterial?(m.color.value.copy(d.color),m.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(m,d){m.opacity.value=d.opacity,d.color&&m.diffuse.value.copy(d.color),d.emissive&&m.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(m.map.value=d.map,n(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,n(d.alphaMap,m.alphaMapTransform)),d.bumpMap&&(m.bumpMap.value=d.bumpMap,n(d.bumpMap,m.bumpMapTransform),m.bumpScale.value=d.bumpScale,d.side===hn&&(m.bumpScale.value*=-1)),d.normalMap&&(m.normalMap.value=d.normalMap,n(d.normalMap,m.normalMapTransform),m.normalScale.value.copy(d.normalScale),d.side===hn&&m.normalScale.value.negate()),d.displacementMap&&(m.displacementMap.value=d.displacementMap,n(d.displacementMap,m.displacementMapTransform),m.displacementScale.value=d.displacementScale,m.displacementBias.value=d.displacementBias),d.emissiveMap&&(m.emissiveMap.value=d.emissiveMap,n(d.emissiveMap,m.emissiveMapTransform)),d.specularMap&&(m.specularMap.value=d.specularMap,n(d.specularMap,m.specularMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest);const _=e.get(d),v=_.envMap,M=_.envMapRotation;v&&(m.envMap.value=v,_r.copy(M),_r.x*=-1,_r.y*=-1,_r.z*=-1,v.isCubeTexture&&v.isRenderTargetTexture===!1&&(_r.y*=-1,_r.z*=-1),m.envMapRotation.value.setFromMatrix4(LT.makeRotationFromEuler(_r)),m.flipEnvMap.value=v.isCubeTexture&&v.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=d.reflectivity,m.ior.value=d.ior,m.refractionRatio.value=d.refractionRatio),d.lightMap&&(m.lightMap.value=d.lightMap,m.lightMapIntensity.value=d.lightMapIntensity,n(d.lightMap,m.lightMapTransform)),d.aoMap&&(m.aoMap.value=d.aoMap,m.aoMapIntensity.value=d.aoMapIntensity,n(d.aoMap,m.aoMapTransform))}function a(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,d.map&&(m.map.value=d.map,n(d.map,m.mapTransform))}function o(m,d){m.dashSize.value=d.dashSize,m.totalSize.value=d.dashSize+d.gapSize,m.scale.value=d.scale}function l(m,d,_,v){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.size.value=d.size*_,m.scale.value=v*.5,d.map&&(m.map.value=d.map,n(d.map,m.uvTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,n(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function h(m,d){m.diffuse.value.copy(d.color),m.opacity.value=d.opacity,m.rotation.value=d.rotation,d.map&&(m.map.value=d.map,n(d.map,m.mapTransform)),d.alphaMap&&(m.alphaMap.value=d.alphaMap,n(d.alphaMap,m.alphaMapTransform)),d.alphaTest>0&&(m.alphaTest.value=d.alphaTest)}function u(m,d){m.specular.value.copy(d.specular),m.shininess.value=Math.max(d.shininess,1e-4)}function f(m,d){d.gradientMap&&(m.gradientMap.value=d.gradientMap)}function p(m,d){m.metalness.value=d.metalness,d.metalnessMap&&(m.metalnessMap.value=d.metalnessMap,n(d.metalnessMap,m.metalnessMapTransform)),m.roughness.value=d.roughness,d.roughnessMap&&(m.roughnessMap.value=d.roughnessMap,n(d.roughnessMap,m.roughnessMapTransform)),d.envMap&&(m.envMapIntensity.value=d.envMapIntensity)}function g(m,d,_){m.ior.value=d.ior,d.sheen>0&&(m.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),m.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(m.sheenColorMap.value=d.sheenColorMap,n(d.sheenColorMap,m.sheenColorMapTransform)),d.sheenRoughnessMap&&(m.sheenRoughnessMap.value=d.sheenRoughnessMap,n(d.sheenRoughnessMap,m.sheenRoughnessMapTransform))),d.clearcoat>0&&(m.clearcoat.value=d.clearcoat,m.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(m.clearcoatMap.value=d.clearcoatMap,n(d.clearcoatMap,m.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,n(d.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(m.clearcoatNormalMap.value=d.clearcoatNormalMap,n(d.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===hn&&m.clearcoatNormalScale.value.negate())),d.dispersion>0&&(m.dispersion.value=d.dispersion),d.iridescence>0&&(m.iridescence.value=d.iridescence,m.iridescenceIOR.value=d.iridescenceIOR,m.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(m.iridescenceMap.value=d.iridescenceMap,n(d.iridescenceMap,m.iridescenceMapTransform)),d.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=d.iridescenceThicknessMap,n(d.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),d.transmission>0&&(m.transmission.value=d.transmission,m.transmissionSamplerMap.value=_.texture,m.transmissionSamplerSize.value.set(_.width,_.height),d.transmissionMap&&(m.transmissionMap.value=d.transmissionMap,n(d.transmissionMap,m.transmissionMapTransform)),m.thickness.value=d.thickness,d.thicknessMap&&(m.thicknessMap.value=d.thicknessMap,n(d.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=d.attenuationDistance,m.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(m.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(m.anisotropyMap.value=d.anisotropyMap,n(d.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=d.specularIntensity,m.specularColor.value.copy(d.specularColor),d.specularColorMap&&(m.specularColorMap.value=d.specularColorMap,n(d.specularColorMap,m.specularColorMapTransform)),d.specularIntensityMap&&(m.specularIntensityMap.value=d.specularIntensityMap,n(d.specularIntensityMap,m.specularIntensityMapTransform))}function S(m,d){d.matcap&&(m.matcap.value=d.matcap)}function y(m,d){const _=e.get(d).light;m.referencePosition.value.setFromMatrixPosition(_.matrixWorld),m.nearDistance.value=_.shadow.camera.near,m.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function IT(t,e,n,i){let r={},s={},a=[];const o=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function l(_,v){const M=v.program;i.uniformBlockBinding(_,M)}function h(_,v){let M=r[_.id];M===void 0&&(S(_),M=u(_),r[_.id]=M,_.addEventListener("dispose",m));const R=v.program;i.updateUBOMapping(_,R);const A=e.render.frame;s[_.id]!==A&&(p(_),s[_.id]=A)}function u(_){const v=f();_.__bindingPointIndex=v;const M=t.createBuffer(),R=_.__size,A=_.usage;return t.bindBuffer(t.UNIFORM_BUFFER,M),t.bufferData(t.UNIFORM_BUFFER,R,A),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,v,M),M}function f(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(_){const v=r[_.id],M=_.uniforms,R=_.__cache;t.bindBuffer(t.UNIFORM_BUFFER,v);for(let A=0,C=M.length;A<C;A++){const P=Array.isArray(M[A])?M[A]:[M[A]];for(let B=0,x=P.length;B<x;B++){const E=P[B];if(g(E,A,B,R)===!0){const k=E.__offset,O=Array.isArray(E.value)?E.value:[E.value];let $=0;for(let K=0;K<O.length;K++){const j=O[K],Y=y(j);typeof j=="number"||typeof j=="boolean"?(E.__data[0]=j,t.bufferSubData(t.UNIFORM_BUFFER,k+$,E.__data)):j.isMatrix3?(E.__data[0]=j.elements[0],E.__data[1]=j.elements[1],E.__data[2]=j.elements[2],E.__data[3]=0,E.__data[4]=j.elements[3],E.__data[5]=j.elements[4],E.__data[6]=j.elements[5],E.__data[7]=0,E.__data[8]=j.elements[6],E.__data[9]=j.elements[7],E.__data[10]=j.elements[8],E.__data[11]=0):(j.toArray(E.__data,$),$+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,k,E.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function g(_,v,M,R){const A=_.value,C=v+"_"+M;if(R[C]===void 0)return typeof A=="number"||typeof A=="boolean"?R[C]=A:R[C]=A.clone(),!0;{const P=R[C];if(typeof A=="number"||typeof A=="boolean"){if(P!==A)return R[C]=A,!0}else if(P.equals(A)===!1)return P.copy(A),!0}return!1}function S(_){const v=_.uniforms;let M=0;const R=16;for(let C=0,P=v.length;C<P;C++){const B=Array.isArray(v[C])?v[C]:[v[C]];for(let x=0,E=B.length;x<E;x++){const k=B[x],O=Array.isArray(k.value)?k.value:[k.value];for(let $=0,K=O.length;$<K;$++){const j=O[$],Y=y(j),N=M%R,F=N%Y.boundary,V=N+F;M+=F,V!==0&&R-V<Y.storage&&(M+=R-V),k.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=M,M+=Y.storage}}}const A=M%R;return A>0&&(M+=R-A),_.__size=M,_.__cache={},this}function y(_){const v={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(v.boundary=4,v.storage=4):_.isVector2?(v.boundary=8,v.storage=8):_.isVector3||_.isColor?(v.boundary=16,v.storage=12):_.isVector4?(v.boundary=16,v.storage=16):_.isMatrix3?(v.boundary=48,v.storage=48):_.isMatrix4?(v.boundary=64,v.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),v}function m(_){const v=_.target;v.removeEventListener("dispose",m);const M=a.indexOf(v.__bindingPointIndex);a.splice(M,1),t.deleteBuffer(r[v.id]),delete r[v.id],delete s[v.id]}function d(){for(const _ in r)t.deleteBuffer(r[_]);a=[],r={},s={}}return{bind:l,update:h,dispose:d}}class Iv{constructor(e={}){const{canvas:n=MS(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:h=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const g=new Uint32Array(4),S=new Int32Array(4);let y=null,m=null;const d=[],_=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ei,this.toneMapping=nr,this.toneMappingExposure=1;const v=this;let M=!1,R=0,A=0,C=null,P=-1,B=null;const x=new St,E=new St;let k=null;const O=new Be(0);let $=0,K=n.width,j=n.height,Y=1,N=null,F=null;const V=new St(0,0,K,j),ne=new St(0,0,K,j);let he=!1;const be=new uf;let X=!1,te=!1;const le=new _t,ce=new _t,Ae=new z,Ce=new St,ke={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Ye=!1;function Ge(){return C===null?Y:1}let L=i;function pn(T,I){return n.getContext(T,I)}try{const T={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:h,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${ef}`),n.addEventListener("webglcontextlost",J,!1),n.addEventListener("webglcontextrestored",fe,!1),n.addEventListener("webglcontextcreationerror",ge,!1),L===null){const I="webgl2";if(L=pn(I,T),L===null)throw pn(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let He,$e,Le,ot,Ue,b,w,H,Q,re,Z,Ee,de,ve,qe,ae,xe,De,Ie,ye,Ve,Fe,st,D;function me(){He=new Bw(L),He.init(),Fe=new TT(L,He),$e=new Iw(L,He,e,Fe),Le=new MT(L),$e.reverseDepthBuffer&&Le.buffers.depth.setReversed(!0),ot=new Vw(L),Ue=new oT,b=new wT(L,He,Le,Ue,$e,Fe,ot),w=new Fw(v),H=new zw(v),Q=new KS(L),st=new Lw(L,Q),re=new jw(L,Q,ot,st),Z=new Ww(L,re,Q,ot),Ie=new Gw(L,$e,b),ae=new Uw(Ue),Ee=new aT(v,w,H,He,$e,st,ae),de=new DT(v,Ue),ve=new cT,qe=new mT(He),De=new Nw(v,w,H,Le,Z,p,l),xe=new yT(v,Z,$e),D=new IT(L,ot,$e,Le),ye=new Dw(L,He,ot),Ve=new Hw(L,He,ot),ot.programs=Ee.programs,v.capabilities=$e,v.extensions=He,v.properties=Ue,v.renderLists=ve,v.shadowMap=xe,v.state=Le,v.info=ot}me();const q=new NT(v,L);this.xr=q,this.getContext=function(){return L},this.getContextAttributes=function(){return L.getContextAttributes()},this.forceContextLoss=function(){const T=He.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=He.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(T){T!==void 0&&(Y=T,this.setSize(K,j,!1))},this.getSize=function(T){return T.set(K,j)},this.setSize=function(T,I,G=!0){if(q.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}K=T,j=I,n.width=Math.floor(T*Y),n.height=Math.floor(I*Y),G===!0&&(n.style.width=T+"px",n.style.height=I+"px"),this.setViewport(0,0,T,I)},this.getDrawingBufferSize=function(T){return T.set(K*Y,j*Y).floor()},this.setDrawingBufferSize=function(T,I,G){K=T,j=I,Y=G,n.width=Math.floor(T*G),n.height=Math.floor(I*G),this.setViewport(0,0,T,I)},this.getCurrentViewport=function(T){return T.copy(x)},this.getViewport=function(T){return T.copy(V)},this.setViewport=function(T,I,G,W){T.isVector4?V.set(T.x,T.y,T.z,T.w):V.set(T,I,G,W),Le.viewport(x.copy(V).multiplyScalar(Y).round())},this.getScissor=function(T){return T.copy(ne)},this.setScissor=function(T,I,G,W){T.isVector4?ne.set(T.x,T.y,T.z,T.w):ne.set(T,I,G,W),Le.scissor(E.copy(ne).multiplyScalar(Y).round())},this.getScissorTest=function(){return he},this.setScissorTest=function(T){Le.setScissorTest(he=T)},this.setOpaqueSort=function(T){N=T},this.setTransparentSort=function(T){F=T},this.getClearColor=function(T){return T.copy(De.getClearColor())},this.setClearColor=function(){De.setClearColor.apply(De,arguments)},this.getClearAlpha=function(){return De.getClearAlpha()},this.setClearAlpha=function(){De.setClearAlpha.apply(De,arguments)},this.clear=function(T=!0,I=!0,G=!0){let W=0;if(T){let U=!1;if(C!==null){const oe=C.texture.format;U=oe===of||oe===af||oe===sf}if(U){const oe=C.texture.type,pe=oe===Ti||oe===Ur||oe===$a||oe===Bs||oe===nf||oe===rf,Se=De.getClearColor(),Me=De.getClearAlpha(),Re=Se.r,Pe=Se.g,we=Se.b;pe?(g[0]=Re,g[1]=Pe,g[2]=we,g[3]=Me,L.clearBufferuiv(L.COLOR,0,g)):(S[0]=Re,S[1]=Pe,S[2]=we,S[3]=Me,L.clearBufferiv(L.COLOR,0,S))}else W|=L.COLOR_BUFFER_BIT}I&&(W|=L.DEPTH_BUFFER_BIT,L.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),G&&(W|=L.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),L.clear(W)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",J,!1),n.removeEventListener("webglcontextrestored",fe,!1),n.removeEventListener("webglcontextcreationerror",ge,!1),ve.dispose(),qe.dispose(),Ue.dispose(),w.dispose(),H.dispose(),Z.dispose(),st.dispose(),D.dispose(),Ee.dispose(),q.dispose(),q.removeEventListener("sessionstart",mf),q.removeEventListener("sessionend",gf),dr.stop()};function J(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),M=!0}function fe(){console.log("THREE.WebGLRenderer: Context Restored."),M=!1;const T=ot.autoReset,I=xe.enabled,G=xe.autoUpdate,W=xe.needsUpdate,U=xe.type;me(),ot.autoReset=T,xe.enabled=I,xe.autoUpdate=G,xe.needsUpdate=W,xe.type=U}function ge(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function We(T){const I=T.target;I.removeEventListener("dispose",We),wt(I)}function wt(T){tn(T),Ue.remove(T)}function tn(T){const I=Ue.get(T).programs;I!==void 0&&(I.forEach(function(G){Ee.releaseProgram(G)}),T.isShaderMaterial&&Ee.releaseShaderCache(T))}this.renderBufferDirect=function(T,I,G,W,U,oe){I===null&&(I=ke);const pe=U.isMesh&&U.matrixWorld.determinant()<0,Se=Gv(T,I,G,W,U);Le.setMaterial(W,pe);let Me=G.index,Re=1;if(W.wireframe===!0){if(Me=re.getWireframeAttribute(G),Me===void 0)return;Re=2}const Pe=G.drawRange,we=G.attributes.position;let tt=Pe.start*Re,lt=(Pe.start+Pe.count)*Re;oe!==null&&(tt=Math.max(tt,oe.start*Re),lt=Math.min(lt,(oe.start+oe.count)*Re)),Me!==null?(tt=Math.max(tt,0),lt=Math.min(lt,Me.count)):we!=null&&(tt=Math.max(tt,0),lt=Math.min(lt,we.count));const xt=lt-tt;if(xt<0||xt===1/0)return;st.setup(U,W,Se,G,Me);let mn,Ze=ye;if(Me!==null&&(mn=Q.get(Me),Ze=Ve,Ze.setIndex(mn)),U.isMesh)W.wireframe===!0?(Le.setLineWidth(W.wireframeLinewidth*Ge()),Ze.setMode(L.LINES)):Ze.setMode(L.TRIANGLES);else if(U.isLine){let Te=W.linewidth;Te===void 0&&(Te=1),Le.setLineWidth(Te*Ge()),U.isLineSegments?Ze.setMode(L.LINES):U.isLineLoop?Ze.setMode(L.LINE_LOOP):Ze.setMode(L.LINE_STRIP)}else U.isPoints?Ze.setMode(L.POINTS):U.isSprite&&Ze.setMode(L.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)Ze.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(He.get("WEBGL_multi_draw"))Ze.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const Te=U._multiDrawStarts,Ot=U._multiDrawCounts,Qe=U._multiDrawCount,On=Me?Q.get(Me).bytesPerElement:1,Hr=Ue.get(W).currentProgram.getUniforms();for(let gn=0;gn<Qe;gn++)Hr.setValue(L,"_gl_DrawID",gn),Ze.render(Te[gn]/On,Ot[gn])}else if(U.isInstancedMesh)Ze.renderInstances(tt,xt,U.count);else if(G.isInstancedBufferGeometry){const Te=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,Ot=Math.min(G.instanceCount,Te);Ze.renderInstances(tt,xt,Ot)}else Ze.render(tt,xt)};function Ke(T,I,G){T.transparent===!0&&T.side===Ln&&T.forceSinglePass===!1?(T.side=hn,T.needsUpdate=!0,io(T,I,G),T.side=sr,T.needsUpdate=!0,io(T,I,G),T.side=Ln):io(T,I,G)}this.compile=function(T,I,G=null){G===null&&(G=T),m=qe.get(G),m.init(I),_.push(m),G.traverseVisible(function(U){U.isLight&&U.layers.test(I.layers)&&(m.pushLight(U),U.castShadow&&m.pushShadow(U))}),T!==G&&T.traverseVisible(function(U){U.isLight&&U.layers.test(I.layers)&&(m.pushLight(U),U.castShadow&&m.pushShadow(U))}),m.setupLights();const W=new Set;return T.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const oe=U.material;if(oe)if(Array.isArray(oe))for(let pe=0;pe<oe.length;pe++){const Se=oe[pe];Ke(Se,G,U),W.add(Se)}else Ke(oe,G,U),W.add(oe)}),_.pop(),m=null,W},this.compileAsync=function(T,I,G=null){const W=this.compile(T,I,G);return new Promise(U=>{function oe(){if(W.forEach(function(pe){Ue.get(pe).currentProgram.isReady()&&W.delete(pe)}),W.size===0){U(T);return}setTimeout(oe,10)}He.get("KHR_parallel_shader_compile")!==null?oe():setTimeout(oe,10)})};let nn=null;function oi(T){nn&&nn(T)}function mf(){dr.stop()}function gf(){dr.start()}const dr=new Av;dr.setAnimationLoop(oi),typeof self<"u"&&dr.setContext(self),this.setAnimationLoop=function(T){nn=T,q.setAnimationLoop(T),T===null?dr.stop():dr.start()},q.addEventListener("sessionstart",mf),q.addEventListener("sessionend",gf),this.render=function(T,I){if(I!==void 0&&I.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(M===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),q.enabled===!0&&q.isPresenting===!0&&(q.cameraAutoUpdate===!0&&q.updateCamera(I),I=q.getCamera()),T.isScene===!0&&T.onBeforeRender(v,T,I,C),m=qe.get(T,_.length),m.init(I),_.push(m),ce.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),be.setFromProjectionMatrix(ce),te=this.localClippingEnabled,X=ae.init(this.clippingPlanes,te),y=ve.get(T,d.length),y.init(),d.push(y),q.enabled===!0&&q.isPresenting===!0){const oe=v.xr.getDepthSensingMesh();oe!==null&&mc(oe,I,-1/0,v.sortObjects)}mc(T,I,0,v.sortObjects),y.finish(),v.sortObjects===!0&&y.sort(N,F),Ye=q.enabled===!1||q.isPresenting===!1||q.hasDepthSensing()===!1,Ye&&De.addToRenderList(y,T),this.info.render.frame++,X===!0&&ae.beginShadows();const G=m.state.shadowsArray;xe.render(G,T,I),X===!0&&ae.endShadows(),this.info.autoReset===!0&&this.info.reset();const W=y.opaque,U=y.transmissive;if(m.setupLights(),I.isArrayCamera){const oe=I.cameras;if(U.length>0)for(let pe=0,Se=oe.length;pe<Se;pe++){const Me=oe[pe];vf(W,U,T,Me)}Ye&&De.render(T);for(let pe=0,Se=oe.length;pe<Se;pe++){const Me=oe[pe];_f(y,T,Me,Me.viewport)}}else U.length>0&&vf(W,U,T,I),Ye&&De.render(T),_f(y,T,I);C!==null&&(b.updateMultisampleRenderTarget(C),b.updateRenderTargetMipmap(C)),T.isScene===!0&&T.onAfterRender(v,T,I),st.resetDefaultState(),P=-1,B=null,_.pop(),_.length>0?(m=_[_.length-1],X===!0&&ae.setGlobalState(v.clippingPlanes,m.state.camera)):m=null,d.pop(),d.length>0?y=d[d.length-1]:y=null};function mc(T,I,G,W){if(T.visible===!1)return;if(T.layers.test(I.layers)){if(T.isGroup)G=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(I);else if(T.isLight)m.pushLight(T),T.castShadow&&m.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||be.intersectsSprite(T)){W&&Ce.setFromMatrixPosition(T.matrixWorld).applyMatrix4(ce);const pe=Z.update(T),Se=T.material;Se.visible&&y.push(T,pe,Se,G,Ce.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||be.intersectsObject(T))){const pe=Z.update(T),Se=T.material;if(W&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Ce.copy(T.boundingSphere.center)):(pe.boundingSphere===null&&pe.computeBoundingSphere(),Ce.copy(pe.boundingSphere.center)),Ce.applyMatrix4(T.matrixWorld).applyMatrix4(ce)),Array.isArray(Se)){const Me=pe.groups;for(let Re=0,Pe=Me.length;Re<Pe;Re++){const we=Me[Re],tt=Se[we.materialIndex];tt&&tt.visible&&y.push(T,pe,tt,G,Ce.z,we)}}else Se.visible&&y.push(T,pe,Se,G,Ce.z,null)}}const oe=T.children;for(let pe=0,Se=oe.length;pe<Se;pe++)mc(oe[pe],I,G,W)}function _f(T,I,G,W){const U=T.opaque,oe=T.transmissive,pe=T.transparent;m.setupLightsView(G),X===!0&&ae.setGlobalState(v.clippingPlanes,G),W&&Le.viewport(x.copy(W)),U.length>0&&no(U,I,G),oe.length>0&&no(oe,I,G),pe.length>0&&no(pe,I,G),Le.buffers.depth.setTest(!0),Le.buffers.depth.setMask(!0),Le.buffers.color.setMask(!0),Le.setPolygonOffset(!1)}function vf(T,I,G,W){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;m.state.transmissionRenderTarget[W.id]===void 0&&(m.state.transmissionRenderTarget[W.id]=new Fr(1,1,{generateMipmaps:!0,type:He.has("EXT_color_buffer_half_float")||He.has("EXT_color_buffer_float")?Ja:Ti,minFilter:Ar,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace}));const oe=m.state.transmissionRenderTarget[W.id],pe=W.viewport||x;oe.setSize(pe.z,pe.w);const Se=v.getRenderTarget();v.setRenderTarget(oe),v.getClearColor(O),$=v.getClearAlpha(),$<1&&v.setClearColor(16777215,.5),v.clear(),Ye&&De.render(G);const Me=v.toneMapping;v.toneMapping=nr;const Re=W.viewport;if(W.viewport!==void 0&&(W.viewport=void 0),m.setupLightsView(W),X===!0&&ae.setGlobalState(v.clippingPlanes,W),no(T,G,W),b.updateMultisampleRenderTarget(oe),b.updateRenderTargetMipmap(oe),He.has("WEBGL_multisampled_render_to_texture")===!1){let Pe=!1;for(let we=0,tt=I.length;we<tt;we++){const lt=I[we],xt=lt.object,mn=lt.geometry,Ze=lt.material,Te=lt.group;if(Ze.side===Ln&&xt.layers.test(W.layers)){const Ot=Ze.side;Ze.side=hn,Ze.needsUpdate=!0,xf(xt,G,W,mn,Ze,Te),Ze.side=Ot,Ze.needsUpdate=!0,Pe=!0}}Pe===!0&&(b.updateMultisampleRenderTarget(oe),b.updateRenderTargetMipmap(oe))}v.setRenderTarget(Se),v.setClearColor(O,$),Re!==void 0&&(W.viewport=Re),v.toneMapping=Me}function no(T,I,G){const W=I.isScene===!0?I.overrideMaterial:null;for(let U=0,oe=T.length;U<oe;U++){const pe=T[U],Se=pe.object,Me=pe.geometry,Re=W===null?pe.material:W,Pe=pe.group;Se.layers.test(G.layers)&&xf(Se,I,G,Me,Re,Pe)}}function xf(T,I,G,W,U,oe){T.onBeforeRender(v,I,G,W,U,oe),T.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),U.onBeforeRender(v,I,G,W,T,oe),U.transparent===!0&&U.side===Ln&&U.forceSinglePass===!1?(U.side=hn,U.needsUpdate=!0,v.renderBufferDirect(G,I,W,U,T,oe),U.side=sr,U.needsUpdate=!0,v.renderBufferDirect(G,I,W,U,T,oe),U.side=Ln):v.renderBufferDirect(G,I,W,U,T,oe),T.onAfterRender(v,I,G,W,U,oe)}function io(T,I,G){I.isScene!==!0&&(I=ke);const W=Ue.get(T),U=m.state.lights,oe=m.state.shadowsArray,pe=U.state.version,Se=Ee.getParameters(T,U.state,oe,I,G),Me=Ee.getProgramCacheKey(Se);let Re=W.programs;W.environment=T.isMeshStandardMaterial?I.environment:null,W.fog=I.fog,W.envMap=(T.isMeshStandardMaterial?H:w).get(T.envMap||W.environment),W.envMapRotation=W.environment!==null&&T.envMap===null?I.environmentRotation:T.envMapRotation,Re===void 0&&(T.addEventListener("dispose",We),Re=new Map,W.programs=Re);let Pe=Re.get(Me);if(Pe!==void 0){if(W.currentProgram===Pe&&W.lightsStateVersion===pe)return Sf(T,Se),Pe}else Se.uniforms=Ee.getUniforms(T),T.onBeforeCompile(Se,v),Pe=Ee.acquireProgram(Se,Me),Re.set(Me,Pe),W.uniforms=Se.uniforms;const we=W.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(we.clippingPlanes=ae.uniform),Sf(T,Se),W.needsLights=Xv(T),W.lightsStateVersion=pe,W.needsLights&&(we.ambientLightColor.value=U.state.ambient,we.lightProbe.value=U.state.probe,we.directionalLights.value=U.state.directional,we.directionalLightShadows.value=U.state.directionalShadow,we.spotLights.value=U.state.spot,we.spotLightShadows.value=U.state.spotShadow,we.rectAreaLights.value=U.state.rectArea,we.ltc_1.value=U.state.rectAreaLTC1,we.ltc_2.value=U.state.rectAreaLTC2,we.pointLights.value=U.state.point,we.pointLightShadows.value=U.state.pointShadow,we.hemisphereLights.value=U.state.hemi,we.directionalShadowMap.value=U.state.directionalShadowMap,we.directionalShadowMatrix.value=U.state.directionalShadowMatrix,we.spotShadowMap.value=U.state.spotShadowMap,we.spotLightMatrix.value=U.state.spotLightMatrix,we.spotLightMap.value=U.state.spotLightMap,we.pointShadowMap.value=U.state.pointShadowMap,we.pointShadowMatrix.value=U.state.pointShadowMatrix),W.currentProgram=Pe,W.uniformsList=null,Pe}function yf(T){if(T.uniformsList===null){const I=T.currentProgram.getUniforms();T.uniformsList=fl.seqWithValue(I.seq,T.uniforms)}return T.uniformsList}function Sf(T,I){const G=Ue.get(T);G.outputColorSpace=I.outputColorSpace,G.batching=I.batching,G.batchingColor=I.batchingColor,G.instancing=I.instancing,G.instancingColor=I.instancingColor,G.instancingMorph=I.instancingMorph,G.skinning=I.skinning,G.morphTargets=I.morphTargets,G.morphNormals=I.morphNormals,G.morphColors=I.morphColors,G.morphTargetsCount=I.morphTargetsCount,G.numClippingPlanes=I.numClippingPlanes,G.numIntersection=I.numClipIntersection,G.vertexAlphas=I.vertexAlphas,G.vertexTangents=I.vertexTangents,G.toneMapping=I.toneMapping}function Gv(T,I,G,W,U){I.isScene!==!0&&(I=ke),b.resetTextureUnits();const oe=I.fog,pe=W.isMeshStandardMaterial?I.environment:null,Se=C===null?v.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:ur,Me=(W.isMeshStandardMaterial?H:w).get(W.envMap||pe),Re=W.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,Pe=!!G.attributes.tangent&&(!!W.normalMap||W.anisotropy>0),we=!!G.morphAttributes.position,tt=!!G.morphAttributes.normal,lt=!!G.morphAttributes.color;let xt=nr;W.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(xt=v.toneMapping);const mn=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,Ze=mn!==void 0?mn.length:0,Te=Ue.get(W),Ot=m.state.lights;if(X===!0&&(te===!0||T!==B)){const bn=T===B&&W.id===P;ae.setState(W,T,bn)}let Qe=!1;W.version===Te.__version?(Te.needsLights&&Te.lightsStateVersion!==Ot.state.version||Te.outputColorSpace!==Se||U.isBatchedMesh&&Te.batching===!1||!U.isBatchedMesh&&Te.batching===!0||U.isBatchedMesh&&Te.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Te.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Te.instancing===!1||!U.isInstancedMesh&&Te.instancing===!0||U.isSkinnedMesh&&Te.skinning===!1||!U.isSkinnedMesh&&Te.skinning===!0||U.isInstancedMesh&&Te.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Te.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Te.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Te.instancingMorph===!1&&U.morphTexture!==null||Te.envMap!==Me||W.fog===!0&&Te.fog!==oe||Te.numClippingPlanes!==void 0&&(Te.numClippingPlanes!==ae.numPlanes||Te.numIntersection!==ae.numIntersection)||Te.vertexAlphas!==Re||Te.vertexTangents!==Pe||Te.morphTargets!==we||Te.morphNormals!==tt||Te.morphColors!==lt||Te.toneMapping!==xt||Te.morphTargetsCount!==Ze)&&(Qe=!0):(Qe=!0,Te.__version=W.version);let On=Te.currentProgram;Qe===!0&&(On=io(W,I,U));let Hr=!1,gn=!1,gc=!1;const Mt=On.getUniforms(),Ri=Te.uniforms;if(Le.useProgram(On.program)&&(Hr=!0,gn=!0,gc=!0),W.id!==P&&(P=W.id,gn=!0),Hr||B!==T){$e.reverseDepthBuffer?(le.copy(T.projectionMatrix),wS(le),TS(le),Mt.setValue(L,"projectionMatrix",le)):Mt.setValue(L,"projectionMatrix",T.projectionMatrix),Mt.setValue(L,"viewMatrix",T.matrixWorldInverse);const bn=Mt.map.cameraPosition;bn!==void 0&&bn.setValue(L,Ae.setFromMatrixPosition(T.matrixWorld)),$e.logarithmicDepthBuffer&&Mt.setValue(L,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(W.isMeshPhongMaterial||W.isMeshToonMaterial||W.isMeshLambertMaterial||W.isMeshBasicMaterial||W.isMeshStandardMaterial||W.isShaderMaterial)&&Mt.setValue(L,"isOrthographic",T.isOrthographicCamera===!0),B!==T&&(B=T,gn=!0,gc=!0)}if(U.isSkinnedMesh){Mt.setOptional(L,U,"bindMatrix"),Mt.setOptional(L,U,"bindMatrixInverse");const bn=U.skeleton;bn&&(bn.boneTexture===null&&bn.computeBoneTexture(),Mt.setValue(L,"boneTexture",bn.boneTexture,b))}U.isBatchedMesh&&(Mt.setOptional(L,U,"batchingTexture"),Mt.setValue(L,"batchingTexture",U._matricesTexture,b),Mt.setOptional(L,U,"batchingIdTexture"),Mt.setValue(L,"batchingIdTexture",U._indirectTexture,b),Mt.setOptional(L,U,"batchingColorTexture"),U._colorsTexture!==null&&Mt.setValue(L,"batchingColorTexture",U._colorsTexture,b));const _c=G.morphAttributes;if((_c.position!==void 0||_c.normal!==void 0||_c.color!==void 0)&&Ie.update(U,G,On),(gn||Te.receiveShadow!==U.receiveShadow)&&(Te.receiveShadow=U.receiveShadow,Mt.setValue(L,"receiveShadow",U.receiveShadow)),W.isMeshGouraudMaterial&&W.envMap!==null&&(Ri.envMap.value=Me,Ri.flipEnvMap.value=Me.isCubeTexture&&Me.isRenderTargetTexture===!1?-1:1),W.isMeshStandardMaterial&&W.envMap===null&&I.environment!==null&&(Ri.envMapIntensity.value=I.environmentIntensity),gn&&(Mt.setValue(L,"toneMappingExposure",v.toneMappingExposure),Te.needsLights&&Wv(Ri,gc),oe&&W.fog===!0&&de.refreshFogUniforms(Ri,oe),de.refreshMaterialUniforms(Ri,W,Y,j,m.state.transmissionRenderTarget[T.id]),fl.upload(L,yf(Te),Ri,b)),W.isShaderMaterial&&W.uniformsNeedUpdate===!0&&(fl.upload(L,yf(Te),Ri,b),W.uniformsNeedUpdate=!1),W.isSpriteMaterial&&Mt.setValue(L,"center",U.center),Mt.setValue(L,"modelViewMatrix",U.modelViewMatrix),Mt.setValue(L,"normalMatrix",U.normalMatrix),Mt.setValue(L,"modelMatrix",U.matrixWorld),W.isShaderMaterial||W.isRawShaderMaterial){const bn=W.uniformsGroups;for(let vc=0,$v=bn.length;vc<$v;vc++){const Mf=bn[vc];D.update(Mf,On),D.bind(Mf,On)}}return On}function Wv(T,I){T.ambientLightColor.needsUpdate=I,T.lightProbe.needsUpdate=I,T.directionalLights.needsUpdate=I,T.directionalLightShadows.needsUpdate=I,T.pointLights.needsUpdate=I,T.pointLightShadows.needsUpdate=I,T.spotLights.needsUpdate=I,T.spotLightShadows.needsUpdate=I,T.rectAreaLights.needsUpdate=I,T.hemisphereLights.needsUpdate=I}function Xv(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(T,I,G){Ue.get(T.texture).__webglTexture=I,Ue.get(T.depthTexture).__webglTexture=G;const W=Ue.get(T);W.__hasExternalTextures=!0,W.__autoAllocateDepthBuffer=G===void 0,W.__autoAllocateDepthBuffer||He.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),W.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,I){const G=Ue.get(T);G.__webglFramebuffer=I,G.__useDefaultFramebuffer=I===void 0},this.setRenderTarget=function(T,I=0,G=0){C=T,R=I,A=G;let W=!0,U=null,oe=!1,pe=!1;if(T){const Me=Ue.get(T);if(Me.__useDefaultFramebuffer!==void 0)Le.bindFramebuffer(L.FRAMEBUFFER,null),W=!1;else if(Me.__webglFramebuffer===void 0)b.setupRenderTarget(T);else if(Me.__hasExternalTextures)b.rebindTextures(T,Ue.get(T.texture).__webglTexture,Ue.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const we=T.depthTexture;if(Me.__boundDepthTexture!==we){if(we!==null&&Ue.has(we)&&(T.width!==we.image.width||T.height!==we.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");b.setupDepthRenderbuffer(T)}}const Re=T.texture;(Re.isData3DTexture||Re.isDataArrayTexture||Re.isCompressedArrayTexture)&&(pe=!0);const Pe=Ue.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Pe[I])?U=Pe[I][G]:U=Pe[I],oe=!0):T.samples>0&&b.useMultisampledRTT(T)===!1?U=Ue.get(T).__webglMultisampledFramebuffer:Array.isArray(Pe)?U=Pe[G]:U=Pe,x.copy(T.viewport),E.copy(T.scissor),k=T.scissorTest}else x.copy(V).multiplyScalar(Y).floor(),E.copy(ne).multiplyScalar(Y).floor(),k=he;if(Le.bindFramebuffer(L.FRAMEBUFFER,U)&&W&&Le.drawBuffers(T,U),Le.viewport(x),Le.scissor(E),Le.setScissorTest(k),oe){const Me=Ue.get(T.texture);L.framebufferTexture2D(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,L.TEXTURE_CUBE_MAP_POSITIVE_X+I,Me.__webglTexture,G)}else if(pe){const Me=Ue.get(T.texture),Re=I||0;L.framebufferTextureLayer(L.FRAMEBUFFER,L.COLOR_ATTACHMENT0,Me.__webglTexture,G||0,Re)}P=-1},this.readRenderTargetPixels=function(T,I,G,W,U,oe,pe){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Se=Ue.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&pe!==void 0&&(Se=Se[pe]),Se){Le.bindFramebuffer(L.FRAMEBUFFER,Se);try{const Me=T.texture,Re=Me.format,Pe=Me.type;if(!$e.textureFormatReadable(Re)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!$e.textureTypeReadable(Pe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=T.width-W&&G>=0&&G<=T.height-U&&L.readPixels(I,G,W,U,Fe.convert(Re),Fe.convert(Pe),oe)}finally{const Me=C!==null?Ue.get(C).__webglFramebuffer:null;Le.bindFramebuffer(L.FRAMEBUFFER,Me)}}},this.readRenderTargetPixelsAsync=async function(T,I,G,W,U,oe,pe){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Se=Ue.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&pe!==void 0&&(Se=Se[pe]),Se){const Me=T.texture,Re=Me.format,Pe=Me.type;if(!$e.textureFormatReadable(Re))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!$e.textureTypeReadable(Pe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(I>=0&&I<=T.width-W&&G>=0&&G<=T.height-U){Le.bindFramebuffer(L.FRAMEBUFFER,Se);const we=L.createBuffer();L.bindBuffer(L.PIXEL_PACK_BUFFER,we),L.bufferData(L.PIXEL_PACK_BUFFER,oe.byteLength,L.STREAM_READ),L.readPixels(I,G,W,U,Fe.convert(Re),Fe.convert(Pe),0);const tt=C!==null?Ue.get(C).__webglFramebuffer:null;Le.bindFramebuffer(L.FRAMEBUFFER,tt);const lt=L.fenceSync(L.SYNC_GPU_COMMANDS_COMPLETE,0);return L.flush(),await ES(L,lt,4),L.bindBuffer(L.PIXEL_PACK_BUFFER,we),L.getBufferSubData(L.PIXEL_PACK_BUFFER,0,oe),L.deleteBuffer(we),L.deleteSync(lt),oe}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(T,I=null,G=0){T.isTexture!==!0&&(hl("WebGLRenderer: copyFramebufferToTexture function signature has changed."),I=arguments[0]||null,T=arguments[1]);const W=Math.pow(2,-G),U=Math.floor(T.image.width*W),oe=Math.floor(T.image.height*W),pe=I!==null?I.x:0,Se=I!==null?I.y:0;b.setTexture2D(T,0),L.copyTexSubImage2D(L.TEXTURE_2D,G,0,0,pe,Se,U,oe),Le.unbindTexture()},this.copyTextureToTexture=function(T,I,G=null,W=null,U=0){T.isTexture!==!0&&(hl("WebGLRenderer: copyTextureToTexture function signature has changed."),W=arguments[0]||null,T=arguments[1],I=arguments[2],U=arguments[3]||0,G=null);let oe,pe,Se,Me,Re,Pe;G!==null?(oe=G.max.x-G.min.x,pe=G.max.y-G.min.y,Se=G.min.x,Me=G.min.y):(oe=T.image.width,pe=T.image.height,Se=0,Me=0),W!==null?(Re=W.x,Pe=W.y):(Re=0,Pe=0);const we=Fe.convert(I.format),tt=Fe.convert(I.type);b.setTexture2D(I,0),L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,I.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,I.unpackAlignment);const lt=L.getParameter(L.UNPACK_ROW_LENGTH),xt=L.getParameter(L.UNPACK_IMAGE_HEIGHT),mn=L.getParameter(L.UNPACK_SKIP_PIXELS),Ze=L.getParameter(L.UNPACK_SKIP_ROWS),Te=L.getParameter(L.UNPACK_SKIP_IMAGES),Ot=T.isCompressedTexture?T.mipmaps[U]:T.image;L.pixelStorei(L.UNPACK_ROW_LENGTH,Ot.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Ot.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Se),L.pixelStorei(L.UNPACK_SKIP_ROWS,Me),T.isDataTexture?L.texSubImage2D(L.TEXTURE_2D,U,Re,Pe,oe,pe,we,tt,Ot.data):T.isCompressedTexture?L.compressedTexSubImage2D(L.TEXTURE_2D,U,Re,Pe,Ot.width,Ot.height,we,Ot.data):L.texSubImage2D(L.TEXTURE_2D,U,Re,Pe,oe,pe,we,tt,Ot),L.pixelStorei(L.UNPACK_ROW_LENGTH,lt),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,xt),L.pixelStorei(L.UNPACK_SKIP_PIXELS,mn),L.pixelStorei(L.UNPACK_SKIP_ROWS,Ze),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Te),U===0&&I.generateMipmaps&&L.generateMipmap(L.TEXTURE_2D),Le.unbindTexture()},this.copyTextureToTexture3D=function(T,I,G=null,W=null,U=0){T.isTexture!==!0&&(hl("WebGLRenderer: copyTextureToTexture3D function signature has changed."),G=arguments[0]||null,W=arguments[1]||null,T=arguments[2],I=arguments[3],U=arguments[4]||0);let oe,pe,Se,Me,Re,Pe,we,tt,lt;const xt=T.isCompressedTexture?T.mipmaps[U]:T.image;G!==null?(oe=G.max.x-G.min.x,pe=G.max.y-G.min.y,Se=G.max.z-G.min.z,Me=G.min.x,Re=G.min.y,Pe=G.min.z):(oe=xt.width,pe=xt.height,Se=xt.depth,Me=0,Re=0,Pe=0),W!==null?(we=W.x,tt=W.y,lt=W.z):(we=0,tt=0,lt=0);const mn=Fe.convert(I.format),Ze=Fe.convert(I.type);let Te;if(I.isData3DTexture)b.setTexture3D(I,0),Te=L.TEXTURE_3D;else if(I.isDataArrayTexture||I.isCompressedArrayTexture)b.setTexture2DArray(I,0),Te=L.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}L.pixelStorei(L.UNPACK_FLIP_Y_WEBGL,I.flipY),L.pixelStorei(L.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),L.pixelStorei(L.UNPACK_ALIGNMENT,I.unpackAlignment);const Ot=L.getParameter(L.UNPACK_ROW_LENGTH),Qe=L.getParameter(L.UNPACK_IMAGE_HEIGHT),On=L.getParameter(L.UNPACK_SKIP_PIXELS),Hr=L.getParameter(L.UNPACK_SKIP_ROWS),gn=L.getParameter(L.UNPACK_SKIP_IMAGES);L.pixelStorei(L.UNPACK_ROW_LENGTH,xt.width),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,xt.height),L.pixelStorei(L.UNPACK_SKIP_PIXELS,Me),L.pixelStorei(L.UNPACK_SKIP_ROWS,Re),L.pixelStorei(L.UNPACK_SKIP_IMAGES,Pe),T.isDataTexture||T.isData3DTexture?L.texSubImage3D(Te,U,we,tt,lt,oe,pe,Se,mn,Ze,xt.data):I.isCompressedArrayTexture?L.compressedTexSubImage3D(Te,U,we,tt,lt,oe,pe,Se,mn,xt.data):L.texSubImage3D(Te,U,we,tt,lt,oe,pe,Se,mn,Ze,xt),L.pixelStorei(L.UNPACK_ROW_LENGTH,Ot),L.pixelStorei(L.UNPACK_IMAGE_HEIGHT,Qe),L.pixelStorei(L.UNPACK_SKIP_PIXELS,On),L.pixelStorei(L.UNPACK_SKIP_ROWS,Hr),L.pixelStorei(L.UNPACK_SKIP_IMAGES,gn),U===0&&I.generateMipmaps&&L.generateMipmap(Te),Le.unbindTexture()},this.initRenderTarget=function(T){Ue.get(T).__webglFramebuffer===void 0&&b.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?b.setTextureCube(T,0):T.isData3DTexture?b.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?b.setTexture2DArray(T,0):b.setTexture2D(T,0),Le.unbindTexture()},this.resetState=function(){R=0,A=0,C=null,Le.reset(),st.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return xi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=e===lf?"display-p3":"srgb",n.unpackColorSpace=Je.workingColorSpace===uc?"display-p3":"srgb"}}class Uv extends kt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new ai,this.environmentIntensity=1,this.environmentRotation=new ai,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}class hf extends Xs{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Be(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Gl=new z,Wl=new z,Pm=new _t,ha=new cf,Vo=new dc,Su=new z,Nm=new z;class UT extends kt{constructor(e=new An,n=new hf){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)Gl.fromBufferAttribute(n,r-1),Wl.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=Gl.distanceTo(Wl);e.setAttribute("lineDistance",new Nt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Vo.copy(i.boundingSphere),Vo.applyMatrix4(r),Vo.radius+=s,e.ray.intersectsSphere(Vo)===!1)return;Pm.copy(r).invert(),ha.copy(e.ray).applyMatrix4(Pm);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,h=this.isLineSegments?2:1,u=i.index,p=i.attributes.position;if(u!==null){const g=Math.max(0,a.start),S=Math.min(u.count,a.start+a.count);for(let y=g,m=S-1;y<m;y+=h){const d=u.getX(y),_=u.getX(y+1),v=Go(this,e,ha,l,d,_);v&&n.push(v)}if(this.isLineLoop){const y=u.getX(S-1),m=u.getX(g),d=Go(this,e,ha,l,y,m);d&&n.push(d)}}else{const g=Math.max(0,a.start),S=Math.min(p.count,a.start+a.count);for(let y=g,m=S-1;y<m;y+=h){const d=Go(this,e,ha,l,y,y+1);d&&n.push(d)}if(this.isLineLoop){const y=Go(this,e,ha,l,S-1,g);y&&n.push(y)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Go(t,e,n,i,r,s){const a=t.geometry.attributes.position;if(Gl.fromBufferAttribute(a,r),Wl.fromBufferAttribute(a,s),n.distanceSqToSegment(Gl,Wl,Su,Nm)>i)return;Su.applyMatrix4(t.matrixWorld);const l=e.ray.origin.distanceTo(Su);if(!(l<e.near||l>e.far))return{distance:l,point:Nm.clone().applyMatrix4(t.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:t}}const Lm=new z,Dm=new z;class Fv extends UT{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let r=0,s=n.count;r<s;r+=2)Lm.fromBufferAttribute(n,r),Dm.fromBufferAttribute(n,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+Lm.distanceTo(Dm);e.setAttribute("lineDistance",new Nt(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class ff extends An{constructor(e=[new Ne(0,-.5),new Ne(.5,0),new Ne(0,.5)],n=12,i=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:n,phiStart:i,phiLength:r},n=Math.floor(n),r=$t(r,0,Math.PI*2);const s=[],a=[],o=[],l=[],h=[],u=1/n,f=new z,p=new Ne,g=new z,S=new z,y=new z;let m=0,d=0;for(let _=0;_<=e.length-1;_++)switch(_){case 0:m=e[_+1].x-e[_].x,d=e[_+1].y-e[_].y,g.x=d*1,g.y=-m,g.z=d*0,y.copy(g),g.normalize(),l.push(g.x,g.y,g.z);break;case e.length-1:l.push(y.x,y.y,y.z);break;default:m=e[_+1].x-e[_].x,d=e[_+1].y-e[_].y,g.x=d*1,g.y=-m,g.z=d*0,S.copy(g),g.x+=y.x,g.y+=y.y,g.z+=y.z,g.normalize(),l.push(g.x,g.y,g.z),y.copy(S)}for(let _=0;_<=n;_++){const v=i+_*u*r,M=Math.sin(v),R=Math.cos(v);for(let A=0;A<=e.length-1;A++){f.x=e[A].x*M,f.y=e[A].y,f.z=e[A].x*R,a.push(f.x,f.y,f.z),p.x=_/n,p.y=A/(e.length-1),o.push(p.x,p.y);const C=l[3*A+0]*M,P=l[3*A+1],B=l[3*A+0]*R;h.push(C,P,B)}}for(let _=0;_<n;_++)for(let v=0;v<e.length-1;v++){const M=v+_*e.length,R=M,A=M+e.length,C=M+e.length+1,P=M+1;s.push(R,A,P),s.push(C,P,A)}this.setIndex(s),this.setAttribute("position",new Nt(a,3)),this.setAttribute("uv",new Nt(o,2)),this.setAttribute("normal",new Nt(h,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ff(e.points,e.segments,e.phiStart,e.phiLength)}}class Xl extends Xs{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new Be(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Be(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=pv,this.normalScale=new Ne(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new ai,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class kv extends kt{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new Be(e),this.intensity=n}dispose(){}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(n.object.target=this.target.uuid),n}}class Ov extends kv{constructor(e,n,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(kt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Be(n)}copy(e,n){return super.copy(e,n),this.groundColor.copy(e.groundColor),this}}const Mu=new _t,Im=new z,Um=new z;class FT{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ne(512,512),this.map=null,this.mapPass=null,this.matrix=new _t,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new uf,this._frameExtents=new Ne(1,1),this._viewportCount=1,this._viewports=[new St(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;Im.setFromMatrixPosition(e.matrixWorld),n.position.copy(Im),Um.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(Um),n.updateMatrixWorld(),Mu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Mu),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(Mu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class kT extends FT{constructor(){super(new bv(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class zv extends kv{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(kt.DEFAULT_UP),this.updateMatrix(),this.target=new kt,this.shadow=new kT}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Fm{constructor(e=1,n=0,i=0){return this.radius=e,this.phi=n,this.theta=i,this}set(e,n,i){return this.radius=e,this.phi=n,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,i){return this.radius=Math.sqrt(e*e+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos($t(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class OT extends Fv{constructor(e=10,n=10,i=4473924,r=8947848){i=new Be(i),r=new Be(r);const s=n/2,a=e/n,o=e/2,l=[],h=[];for(let p=0,g=0,S=-o;p<=n;p++,S+=a){l.push(-o,0,S,o,0,S),l.push(S,0,-o,S,0,o);const y=p===s?i:r;y.toArray(h,g),g+=3,y.toArray(h,g),g+=3,y.toArray(h,g),g+=3,y.toArray(h,g),g+=3}const u=new An;u.setAttribute("position",new Nt(l,3)),u.setAttribute("color",new Nt(h,3));const f=new hf({vertexColors:!0,toneMapped:!1});super(u,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class zT extends Fv{constructor(e=10,n=16,i=8,r=64,s=4473924,a=8947848){s=new Be(s),a=new Be(a);const o=[],l=[];if(n>1)for(let f=0;f<n;f++){const p=f/n*(Math.PI*2),g=Math.sin(p)*e,S=Math.cos(p)*e;o.push(0,0,0),o.push(g,0,S);const y=f&1?s:a;l.push(y.r,y.g,y.b),l.push(y.r,y.g,y.b)}for(let f=0;f<i;f++){const p=f&1?s:a,g=e-e/i*f;for(let S=0;S<r;S++){let y=S/r*(Math.PI*2),m=Math.sin(y)*g,d=Math.cos(y)*g;o.push(m,0,d),l.push(p.r,p.g,p.b),y=(S+1)/r*(Math.PI*2),m=Math.sin(y)*g,d=Math.cos(y)*g,o.push(m,0,d),l.push(p.r,p.g,p.b)}}const h=new An;h.setAttribute("position",new Nt(o,3)),h.setAttribute("color",new Nt(l,3));const u=new hf({vertexColors:!0,toneMapped:!1});super(h,u),this.type="PolarGridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class BT extends Br{constructor(e,n=null){super(),this.object=e,this.domElement=n,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:ef}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=ef);const km={type:"change"},pf={type:"start"},Bv={type:"end"},Wo=new cf,Om=new Bi,jT=Math.cos(70*SS.DEG2RAD),bt=new z,sn=2*Math.PI,rt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Eu=1e-6;class jv extends BT{constructor(e,n=null){super(e,n),this.state=rt.NONE,this.enabled=!0,this.target=new z,this.cursor=new z,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Cs.ROTATE,MIDDLE:Cs.DOLLY,RIGHT:Cs.PAN},this.touches={ONE:_s.ROTATE,TWO:_s.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new z,this._lastQuaternion=new kr,this._lastTargetPosition=new z,this._quat=new kr().setFromUnitVectors(e.up,new z(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Fm,this._sphericalDelta=new Fm,this._scale=1,this._panOffset=new z,this._rotateStart=new Ne,this._rotateEnd=new Ne,this._rotateDelta=new Ne,this._panStart=new Ne,this._panEnd=new Ne,this._panDelta=new Ne,this._dollyStart=new Ne,this._dollyEnd=new Ne,this._dollyDelta=new Ne,this._dollyDirection=new z,this._mouse=new Ne,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=VT.bind(this),this._onPointerDown=HT.bind(this),this._onPointerUp=GT.bind(this),this._onContextMenu=ZT.bind(this),this._onMouseWheel=$T.bind(this),this._onKeyDown=qT.bind(this),this._onTouchStart=YT.bind(this),this._onTouchMove=KT.bind(this),this._onMouseDown=WT.bind(this),this._onMouseMove=XT.bind(this),this._interceptControlDown=QT.bind(this),this._interceptControlUp=JT.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(km),this.update(),this.state=rt.NONE}update(e=null){const n=this.object.position;bt.copy(n).sub(this.target),bt.applyQuaternion(this._quat),this._spherical.setFromVector3(bt),this.autoRotate&&this.state===rt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=sn:i>Math.PI&&(i-=sn),r<-Math.PI?r+=sn:r>Math.PI&&(r-=sn),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=a!=this._spherical.radius}if(bt.setFromSpherical(this._spherical),bt.applyQuaternion(this._quatInverse),n.copy(this.target).add(bt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=bt.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),s=!!l}else if(this.object.isOrthographicCamera){const o=new z(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=l!==this.object.zoom;const h=new z(this._mouse.x,this._mouse.y,0);h.unproject(this.object),this.object.position.sub(h).add(o),this.object.updateMatrixWorld(),a=bt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Wo.origin.copy(this.object.position),Wo.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Wo.direction))<jT?this.object.lookAt(this.target):(Om.setFromNormalAndCoplanarPoint(this.object.up,this.target),Wo.intersectPlane(Om,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>Eu||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Eu||this._lastTargetPosition.distanceToSquared(this.target)>Eu?(this.dispatchEvent(km),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?sn/60*this.autoRotateSpeed*e:sn/60/60*this.autoRotateSpeed}_getZoomScale(e){const n=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,n){bt.setFromMatrixColumn(n,0),bt.multiplyScalar(-e),this._panOffset.add(bt)}_panUp(e,n){this.screenSpacePanning===!0?bt.setFromMatrixColumn(n,1):(bt.setFromMatrixColumn(n,0),bt.crossVectors(this.object.up,bt)),bt.multiplyScalar(e),this._panOffset.add(bt)}_pan(e,n){const i=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;bt.copy(r).sub(this.target);let s=bt.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/i.clientHeight,this.object.matrix),this._panUp(2*n*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),r=e-i.left,s=n-i.top,a=i.width,o=i.height;this._mouse.x=r/a*2-1,this._mouse.y=-(s/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(sn*this._rotateDelta.x/n.clientHeight),this._rotateUp(sn*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let n=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(sn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-sn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(sn*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-sn*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._panStart.set(i,r)}}_handleTouchStartDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,r=e.pageY-n.y,s=Math.sqrt(i*i+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),s=.5*(e.pageY+i.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(sn*this._rotateDelta.x/n.clientHeight),this._rotateUp(sn*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,r=e.pageY-n.y,s=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+n.x)*.5,o=(e.pageY+n.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(e){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId)return!0;return!1}_trackPointer(e){let n=this._pointerPositions[e.pointerId];n===void 0&&(n=new Ne,this._pointerPositions[e.pointerId]=n),n.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const n=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(e){const n=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function HT(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t)))}function VT(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function GT(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Bv),this.state=rt.NONE;break;case 1:const e=this._pointers[0],n=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:n.x,pageY:n.y});break}}function WT(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Cs.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=rt.DOLLY;break;case Cs.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=rt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=rt.ROTATE}break;case Cs.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=rt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=rt.PAN}break;default:this.state=rt.NONE}this.state!==rt.NONE&&this.dispatchEvent(pf)}function XT(t){switch(this.state){case rt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case rt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case rt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function $T(t){this.enabled===!1||this.enableZoom===!1||this.state!==rt.NONE||(t.preventDefault(),this.dispatchEvent(pf),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(Bv))}function qT(t){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(t)}function YT(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case _s.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(t),this.state=rt.TOUCH_ROTATE;break;case _s.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(t),this.state=rt.TOUCH_PAN;break;default:this.state=rt.NONE}break;case 2:switch(this.touches.TWO){case _s.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=rt.TOUCH_DOLLY_PAN;break;case _s.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=rt.TOUCH_DOLLY_ROTATE;break;default:this.state=rt.NONE}break;default:this.state=rt.NONE}this.state!==rt.NONE&&this.dispatchEvent(pf)}function KT(t){switch(this._trackPointer(t),this.state){case rt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case rt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case rt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case rt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=rt.NONE}}function ZT(t){this.enabled!==!1&&t.preventDefault()}function QT(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function JT(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const ya=[[.19,.07,.6],[.07,.45,.9],[.1,.75,.8],[.35,.85,.35],[.98,.8,.15],[.9,.2,.15]],Hv=t=>{const e=Math.min(Math.max(t,0),1)*(ya.length-1),n=Math.min(Math.floor(e),ya.length-2),i=e-n;return ya[n].map((r,s)=>r+(ya[n+1][s]-r)*i)},rh=[["von_mises_mpa","von Mises (MPa)"],["hoop_mpa","Hoop σθ (MPa)"],["radial_mpa","Radial σr (MPa)"],["axial_mpa","Axial σz (MPa)"],["disp_um","Displacement (µm)"],["ur_um","Radial growth (µm)"]];function eC(t,e){const n=t.nodes_mm,i=t.elements,r=t.cases[e.caseName],s=r[e.field],a=Math.min(...s),o=Math.max(...s),l=n.map(([m,d],_)=>[(m+e.scale*r.ur_um[_]/1e3)/1e3,(d+e.scale*r.uz_um[_]/1e3)/1e3]),h=e.cut?1.5*Math.PI:2*Math.PI,u=72,f=[],p=[],g=(m,d,_,v)=>{f.push(m*Math.cos(_),d,m*Math.sin(_)),p.push(...Hv((v-a)/(o-a||1)))},S=new Map;i.forEach(m=>m.forEach((d,_)=>{const v=m[(_+1)%4],M=d<v?`${d},${v}`:`${v},${d}`;S.set(M,S.has(M)?[]:[d,v])}));for(const m of S.values()){if(m.length!==2)continue;const[d,_]=m;for(let v=0;v<u;v++){const M=h*v/u,R=h*(v+1)/u;g(l[d][0],l[d][1],M,s[d]),g(l[_][0],l[_][1],M,s[_]),g(l[_][0],l[_][1],R,s[_]),g(l[d][0],l[d][1],M,s[d]),g(l[_][0],l[_][1],R,s[_]),g(l[d][0],l[d][1],R,s[d])}}if(e.cut)for(const m of[0,h])for(const d of i)for(const _ of[[0,1,2],[0,2,3]])_.forEach(v=>g(l[d[v]][0],l[d[v]][1],m,s[d[v]]));const y=new An;return y.setAttribute("position",new Nt(f,3)),y.setAttribute("color",new Nt(p,3)),y.computeVertexNormals(),{g:y,lo:a,hi:o,sweep:h}}function tC({fea:t}){var l;const e=ee.useRef(null),n=Object.keys(t.model.cases),[i,r]=ee.useState({field:"von_mises_mpa",caseName:n[0],scale:100,cut:!0,wire:!1,blades:!0,spin:!1}),s=ee.useMemo(()=>{const h=t.model.cases[i.caseName][i.field];return[Math.min(...h),Math.max(...h)]},[t,i.caseName,i.field]),a=ee.useRef(i);a.current=i,ee.useEffect(()=>{const h=e.current;if(!h)return;const u=h.clientWidth,f=h.clientHeight,p=new Iv({antialias:!0});p.setPixelRatio(Math.min(devicePixelRatio,2)),p.setSize(u,f),h.appendChild(p.domElement);const g=new Uv;g.background=new Be(725536);const S=t.model.r_tip_mm/1e3,y=new yn(35,u/f,.001,20);y.position.set(S*2.4,S*1.6,S*2.4),g.add(new Ov(16777215,2241348,1.4));const m=new zv(16777215,1.3);m.position.set(1,2,1.5),g.add(m);const d=new Xi;g.add(d);const{g:_,sweep:v}=eC(t.model,i),M=new Xl({vertexColors:!0,side:Ln,roughness:.5,metalness:.15,wireframe:i.wire});if(d.add(new Mn(_,M)),i.blades){const B=t.model.nodes_mm,x=t.model.zones,E=new Map;t.model.elements.forEach((Y,N)=>{x[N]==="passage"&&Y.forEach(F=>{const V=Math.round(B[F][0]*100)/100,ne=B[F][1],he=E.get(V);E.set(V,he?[Math.min(he[0],ne),Math.max(he[1],ne)]:[ne,ne])})});const k=[...E.entries()].sort((Y,N)=>Y[0]-N[0]),O=new Xl({color:12109782,metalness:.55,roughness:.35,side:Ln}),$=t.model.backsweep_deg*Math.PI/180*1.4,K=k[0][0],j=k[k.length-1][0];for(let Y=0;Y<t.model.blades;Y++){const N=2*Math.PI*Y/t.model.blades;if(i.cut&&N>v-.05)continue;const F=[],V=(he,be,X)=>{const te=N+$*X;F.push(he/1e3*Math.cos(te),be/1e3,he/1e3*Math.sin(te))};for(let he=0;he<k.length-1;he++){const[be,[X,te]]=k[he],[le,[ce,Ae]]=k[he+1],Ce=(be-K)/(j-K),ke=(le-K)/(j-K);V(be,X,Ce),V(le,ce,ke),V(le,Ae,ke),V(be,X,Ce),V(le,Ae,ke),V(be,te,Ce)}const ne=new An;ne.setAttribute("position",new Nt(F,3)),ne.computeVertexNormals(),d.add(new Mn(ne,O))}}d.rotation.y=Math.PI;const R=new zT(S*1.4,12,6,64,2832975,1845302);R.position.y=-.002,g.add(R);const A=new jv(y,p.domElement);A.enableDamping=!0,A.target.set(0,S*.15,0);let C=0;const P=()=>{a.current.spin&&(d.rotation.y+=.004),A.update(),p.render(g,y),C=requestAnimationFrame(P)};return P(),()=>{cancelAnimationFrame(C),A.dispose(),p.dispose(),_.dispose(),h.removeChild(p.domElement)}},[t,i.field,i.caseName,i.scale,i.cut,i.wire,i.blades]);const o=(h,u)=>r({...i,[h]:u});return c.jsxs("div",{className:"fea",children:[c.jsxs("div",{className:"toolbar",children:[c.jsx("select",{className:"inp",value:i.field,onChange:h=>o("field",h.target.value),"aria-label":"Result",children:rh.map(([h,u])=>c.jsx("option",{value:h,children:u},h))}),c.jsx("select",{className:"inp",value:i.caseName,onChange:h=>o("caseName",h.target.value),"aria-label":"Load case",children:n.map(h=>c.jsx("option",{children:h},h))}),c.jsxs("label",{className:"muted",children:["Deformation ×",i.scale,c.jsx("input",{type:"range",min:0,max:400,step:10,value:i.scale,onChange:h=>o("scale",Number(h.target.value))})]}),[["cut","Cut-away"],["wire","Mesh"],["blades","Blades"],["spin","Rotate"]].map(([h,u])=>c.jsx("button",{className:`chip ${i[h]?"on":""}`,onClick:()=>o(h,!i[h]),children:u},h))]}),c.jsx("div",{ref:e,className:"viewer tall"}),c.jsxs("div",{className:"legend",children:[c.jsx("span",{children:s[0].toFixed(0)}),c.jsx("div",{className:"bar",style:{background:`linear-gradient(90deg, ${ya.map(h=>`rgb(${h.map(u=>Math.round(u*255)).join(",")})`).join(",")})`}}),c.jsx("span",{children:s[1].toFixed(0)}),c.jsxs("span",{className:"muted",children:[(l=rh.find(h=>h[0]===i.field))==null?void 0:l[1]," · ",i.caseName]})]})]})}function nC({model:t,field:e,caseName:n}){const i=t.nodes_mm,r=t.cases[n][e],s=t.elements.map(y=>y.reduce((m,d)=>m+r[d],0)/4),a=Math.min(...s),o=Math.max(...s),l=i.map(y=>y[0]),h=i.map(y=>y[1]),u=Math.min(...l),f=Math.max(...l),p=Math.min(...h),g=Math.max(...h),S=4;return c.jsx("svg",{viewBox:`${u-S} ${-g-S} ${f-u+2*S} ${g-p+2*S}`,className:"section",role:"img","aria-label":"FE section",children:t.elements.map((y,m)=>{const d=Hv((s[m]-a)/(o-a||1)).map(_=>Math.round(_*255));return c.jsx("polygon",{points:y.map(_=>`${i[_][0]},${-i[_][1]}`).join(" "),fill:`rgb(${d.join(",")})`,stroke:"rgba(0,0,0,.25)",strokeWidth:.15,children:c.jsx("title",{children:`${t.zones[m]} · ${s[m].toFixed(0)}`})},m)})})}const rs={shaft:10135476,impeller:5214159,piston:13214554,collar:11566159,coupling:8227480,sleeve:7320486,bearing:14715452};function iC(t,e,n){if(n<=t[0])return e[0];for(let i=1;i<t.length;i++)if(n<=t[i])return e[i-1]+(e[i]-e[i-1])*(n-t[i-1])/(t[i]-t[i-1]);return e[e.length-1]}function fa(t,e,n=1){const i=t.map(([a,o])=>new Ne(Math.max(a,1e-4),o)),r=new ff(i,64),s=new Xl({color:e,metalness:.55,roughness:.42,side:Ln,transparent:n<1,opacity:n});return new Mn(r,s)}function rC(t){const e=new Xi,n=[],i=(r,s)=>{e.add(r),n.push({obj:r,z:s})};for(const r of t.parts)if(r.type==="cylinder"){const s=Math.max(1,Math.ceil((r.z1-r.z0)/.04));for(let a=0;a<s;a++){const o=r.z0+(r.z1-r.z0)*a/s,l=r.z0+(r.z1-r.z0)*(a+1)/s;i(fa([[r.r_inner,o],[r.r_outer,o],[r.r_outer,l],[r.r_inner,l]],rs.shaft),(o+l)/2)}}else if(r.type==="impeller"){const s=r.z_center-r.length/2,a=r.length,o=new Xi;o.add(fa([[r.r_hub,s+a],[r.r2,s+.8*a],[r.r2,s+.7*a],[r.r_hub*1.2,s+.62*a]],rs.impeller)),o.add(fa([[r.r2,s+.62*a-r.b2],[(r.r1+r.r2)/2,s+.3*a],[r.r1*1.05,s],[r.r1*.98,s]],rs.impeller,.55));const l=new Xl({color:3107491,metalness:.5,roughness:.45});for(let h=0;h<r.blades;h++){const u=2*Math.PI*h/r.blades,f=r.r2-r.r1*.9,p=new Mn(new $s(.004,r.b2*1.2,f),l),g=(r.r2+r.r1*.9)/2;p.position.set(g*Math.sin(u),s+.62*a-r.b2/2,g*Math.cos(u)),p.rotation.y=u+r.backsweep_deg*Math.PI/180/2,o.add(p)}i(o,r.z_center)}else if(r.type==="disk"){const s=r.z_center-r.thickness/2,a=r.z_center+r.thickness/2;i(fa([[.01,s],[r.r_outer,s],[r.r_outer,a],[.01,a]],rs[r.material]??rs.shaft),r.z_center)}else if(r.type==="bearing"){const s=r.z_center-r.width/2,a=r.z_center+r.width/2,o=fa([[r.r_inner*1.02,s],[r.r_outer*1.6,s],[r.r_outer*1.6,a],[r.r_inner*1.02,a],[r.r_inner*1.02,s]],rs.bearing,.45);e.add(o)}return{group:e,pieces:n}}function sC({scene:t,mode:e,amplitude:n=.04}){const i=ee.useRef(null),r=ee.useRef(e??null);return r.current=e??null,ee.useEffect(()=>{const s=i.current;if(!s||!t)return;const a=s.clientWidth,o=s.clientHeight,l=new Iv({antialias:!0});l.setPixelRatio(Math.min(window.devicePixelRatio,2)),l.setSize(a,o),s.appendChild(l.domElement);const h=new Uv;h.background=new Be(988443);const u=new yn(35,a/o,.01,50),f=t.length;u.position.set(f*.3,f*.22,f*.62),h.add(new Ov(14674162,1713200,1.1));const p=new zv(16777215,1.6);p.position.set(2,3,2),h.add(p);const{group:g,pieces:S}=rC(t),y=new Xi;g.rotation.z=-Math.PI/2,g.position.x=-f/2,y.add(g),h.add(y);const m=new OT(f*1.6,16,2766403,1910577);m.position.y=-.35,h.add(m);const d=new jv(u,l.domElement);d.target.set(0,0,0),d.enableDamping=!0;let _=0;const v=performance.now(),M=()=>{const A=(performance.now()-v)/1e3,C=r.current;for(const P of S){if(C){const B=n*iC(C.z,C.shape,P.z);P.obj.position.x=B*Math.cos(2*Math.PI*.6*A),P.obj.position.z=B*Math.sin(2*Math.PI*.6*A)}else P.obj.position.x=0,P.obj.position.z=0;P.obj.rotation.y=A*.8}d.update(),l.render(h,u),_=requestAnimationFrame(M)};M();const R=()=>{const A=s.clientWidth,C=s.clientHeight;l.setSize(A,C),u.aspect=A/C,u.updateProjectionMatrix()};return window.addEventListener("resize",R),()=>{cancelAnimationFrame(_),window.removeEventListener("resize",R),d.dispose(),l.dispose(),s.removeChild(l.domElement)}},[t,n]),c.jsx("div",{ref:i,className:"viewer"})}const aC=[["_nm_rad","N·m/rad"],["_nm3_h","Nm³/h"],["_w_m2k","W/m²K"],["_kgm2","kg·m²"],["_l_min","L/min"],["_m3_h","m³/h"],["_m_s","m/s"],["_n_m","N/m"],["_bara","bara"],["_barg","barg"],["_bar","bar"],["_mpa","MPa"],["_pa","Pa"],["_kn","kN"],["_mm","mm"],["_um","µm"],["_kg","kg"],["_rpm","rpm"],["_kw","kW"],["_hz","Hz"],["_pct","%"],["_min","min"],["_c","°C"],["_m","m"]];function oC(t){for(const[e,n]of aC)if(t.endsWith(e)){const i=t.slice(0,-e.length);return{text:zm(i),unit:n}}return{text:zm(t),unit:""}}const zm=t=>{const e=t.replace(/_/g," ");return e.charAt(0).toUpperCase()+e.slice(1)};function lC(t,e){return e!=null&&e.$ref?t.$defs[e.$ref.split("/").pop()]:e}function cC(t){if(t.enum)return{type:"enum",nullable:!1,enum:t.enum};if(t.anyOf){const n=t.anyOf.filter(i=>i.type!=="null")[0]??{};return{type:n.enum?"enum":n.type??(n.$ref?"object":"string"),nullable:!0,enum:n.enum}}return{type:t.type??(t.$ref?"object":"string"),nullable:!1}}function Ci({schema:t,def:e,value:n,onChange:i,skip:r=[]}){var o;const s=((o=t==null?void 0:t.$defs)==null?void 0:o[e])??(e==="Project"?t:null);if(!s||!n)return null;const a=s.properties??{};return c.jsx("div",{className:"form",children:Object.keys(a).filter(l=>!r.includes(l)).map(l=>{const h=lC(t,a[l]),u=cC(h);if(u.type==="object"||u.type==="array")return null;const{text:f,unit:p}=oC(l),g=a[l].description??h.description??"",S=n[l],y=d=>i({...n,[l]:d});if(u.type==="boolean")return c.jsxs("label",{className:"check",title:g,children:[c.jsx("input",{type:"checkbox",checked:!!S,onChange:d=>y(d.target.checked)})," ",f]},l);if(u.type==="enum")return c.jsxs("label",{title:g,children:[f,c.jsx("select",{value:S??"",onChange:d=>y(d.target.value),children:u.enum.map(d=>c.jsx("option",{value:d,children:d.replace(/_/g," ")},d))})]},l);const m=u.type==="number"||u.type==="integer";return c.jsxs("label",{title:g,children:[c.jsxs("span",{children:[f,p?` (${p})`:""]}),c.jsx("input",{type:m?"number":"text",step:"any",value:S??"",placeholder:u.nullable?"auto":"",onChange:d=>{const _=d.target.value;if(_===""&&u.nullable)return y(null);y(m?_===""?0:u.type==="integer"?parseInt(_,10):parseFloat(_):_)}})]},l)})})}const Vv=()=>c.jsx("div",{className:"notice",children:"Preliminary engineering results for design studies and comparisons. Not a certificate of compliance with API 617 / 614 / 692, ISO 15156 or any other standard. Safety-critical conclusions require qualified engineering review."}),bi=({results:t})=>t?null:c.jsx("p",{className:"muted",children:"Run the analysis to see results."});function jr({items:t}){return c.jsx("div",{className:"kpis",children:t.map(([e,n])=>c.jsxs("div",{className:"kpi",children:[c.jsx("div",{className:`v ${n.length>16?"long":""}`,children:n}),c.jsx("div",{className:"l",children:e})]},e))})}function ft({cols:t,rows:e}){return c.jsx("div",{className:"scroll",children:c.jsxs("table",{className:"t",children:[c.jsx("thead",{children:c.jsx("tr",{children:t.map(([n])=>c.jsx("th",{children:n},n))})}),c.jsx("tbody",{children:e.map((n,i)=>c.jsx("tr",{children:t.map(([r,s,a])=>{const o=s(n);return c.jsx("td",{className:typeof o=="number"?"n":"",children:typeof o=="number"?ie(o,a??1):o??"–"},r)})},i))})]})})}function Qt({trace:t}){return t?c.jsxs("details",{className:"card",style:{marginTop:14},children:[c.jsxs("summary",{children:[c.jsx("strong",{children:"Method & assumptions"})," ",c.jsxs("span",{className:"muted",children:["— ",t.module,": ",t.method]})]}),c.jsx("ul",{children:t.assumptions.map(e=>c.jsx("li",{children:e},e))}),t.references.length>0&&c.jsxs("p",{className:"muted",children:["References: ",t.references.join("; ")]}),t.warnings.length>0&&c.jsx("ul",{children:t.warnings.map(e=>c.jsx("li",{className:"status attention",children:e},e))}),c.jsxs("p",{className:"muted",children:["Engine ",t.engine," · v",t.version," · inputs ",t.inputs_hash]})]}):null}const pc=t=>{var e,n,i,r;return((n=(e=t.results)==null?void 0:e.casings)==null?void 0:n[t.casing])??((r=(i=t.results)==null?void 0:i.casings)==null?void 0:r[0])},on=(t,e,n)=>t.setProject({...t.project,[e]:n});function uC(t){const e=t.project;return c.jsxs(c.Fragment,{children:[c.jsx("h2",{children:"Design basis"}),c.jsx("p",{className:"lead",children:"Define the project and the design basis. Fields left blank (“auto”) are estimated by the relevant module and reported in its trace."}),c.jsx(Vv,{}),c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Project"}),c.jsx("div",{className:"form",children:c.jsxs("label",{children:["Description",c.jsx("input",{value:e.description,onChange:n=>on(t,"description",n.target.value)})]})})]}),c.jsxs("div",{className:"card",style:{marginTop:14},children:[c.jsx("h3",{children:"Design basis and limits"}),c.jsx(Ci,{schema:t.schema,def:"DesignBasis",value:e.design_basis,onChange:n=>on(t,"design_basis",n)})]}),c.jsxs("div",{className:"card",style:{marginTop:14},children:[c.jsx("h3",{children:"Acceptance criteria (version-controlled — verify against the specified edition)"}),c.jsx(Ci,{schema:t.schema,def:"Criteria",value:e.criteria,onChange:n=>on(t,"criteria",n)})]})]})}function dC(t){const e=t.project,[n,i]=ee.useState([]);ee.useEffect(()=>{et.components().then(i).catch(()=>{})},[]);const r=e.gas.components,s=Object.values(r).reduce((u,f)=>u+Number(f||0),0),a=u=>on(t,"gas",{...e.gas,components:u}),o=(u,f,p)=>{const g=e.cases.map((S,y)=>y===u?{...S,[f]:p}:f==="is_design"&&p?{...S,is_design:!1}:S);on(t,"cases",g)},l=n.filter(u=>!(u.key in r)),h=u=>u===""?null:parseFloat(u);return c.jsxs(c.Fragment,{children:[c.jsx("h2",{children:"Gas composition & operating cases"}),c.jsx("p",{className:"lead",children:"Mole composition (normalised automatically), property model and all operating cases. The case marked “design” sizes the machine; every case is located on the performance map."}),c.jsxs("div",{className:"grid",children:[c.jsxs("div",{className:"card",children:[c.jsxs("h3",{children:["Composition (mol %) · total ",ie(s,2)]}),c.jsx("table",{className:"t",children:c.jsx("tbody",{children:Object.entries(r).map(([u,f])=>{var p;return c.jsxs("tr",{children:[c.jsx("td",{children:((p=n.find(g=>g.key===u))==null?void 0:p.name)??u}),c.jsx("td",{children:c.jsx("input",{className:"inp",type:"number",step:"any",value:f,"aria-label":`${u} mol %`,onChange:g=>a({...r,[u]:parseFloat(g.target.value||"0")})})}),c.jsx("td",{children:c.jsx("button",{className:"btn",onClick:()=>{const g={...r};delete g[u],a(g)},children:"Remove"})})]},u)})})}),c.jsxs("div",{className:"row",style:{marginTop:8},children:[c.jsxs("select",{className:"inp",id:"addcomp",defaultValue:"",children:[c.jsx("option",{value:"",disabled:!0,children:"Add component…"}),l.map(u=>c.jsx("option",{value:u.key,children:u.name},u.key))]}),c.jsx("button",{className:"btn",onClick:()=>{const u=document.getElementById("addcomp");u.value&&a({...r,[u.value]:1})},children:"Add"}),c.jsxs("label",{className:"muted",children:["Property model"," ",c.jsxs("select",{className:"inp",value:e.gas.backend,onChange:u=>on(t,"gas",{...e.gas,backend:u.target.value}),children:[c.jsx("option",{value:"pr",children:"Peng-Robinson (built-in)"}),c.jsx("option",{value:"coolprop",children:"CoolProp HEOS (reference)"})]})]})]})]}),c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Operating cases"}),c.jsx("div",{className:"scroll",children:c.jsxs("table",{className:"t",children:[c.jsx("thead",{children:c.jsxs("tr",{children:[c.jsx("th",{children:"Design"}),c.jsx("th",{children:"Name"}),c.jsx("th",{children:"Ps bara"}),c.jsx("th",{children:"Ts °C"}),c.jsx("th",{children:"Pd bara"}),c.jsx("th",{children:"Flow"}),c.jsx("th",{children:"Unit"}),c.jsx("th",{children:"ηp (auto)"}),c.jsx("th",{children:"Td meas. °C"}),c.jsx("th",{})]})}),c.jsx("tbody",{children:e.cases.map((u,f)=>c.jsxs("tr",{children:[c.jsx("td",{children:c.jsx("input",{type:"radio",checked:u.is_design,onChange:()=>o(f,"is_design",!0),"aria-label":"design case"})}),c.jsx("td",{children:c.jsx("input",{className:"inp",style:{width:90},value:u.name,onChange:p=>o(f,"name",p.target.value)})}),["suction_pressure_bara","suction_temperature_c","discharge_pressure_bara","flow_value"].map(p=>c.jsx("td",{children:c.jsx("input",{className:"inp",style:{width:70},type:"number",step:"any",value:u[p],onChange:g=>o(f,p,parseFloat(g.target.value||"0"))})},p)),c.jsx("td",{children:c.jsx("select",{className:"inp",value:u.flow_unit,onChange:p=>o(f,"flow_unit",p.target.value),children:["kg/s","kg/h","Am3/h","Nm3/h","Sm3/h","MMSCFD"].map(p=>c.jsx("option",{children:p},p))})}),c.jsx("td",{children:c.jsx("input",{className:"inp",style:{width:60},type:"number",step:"any",placeholder:"auto",value:u.polytropic_efficiency??"",onChange:p=>o(f,"polytropic_efficiency",h(p.target.value))})}),c.jsx("td",{children:c.jsx("input",{className:"inp",style:{width:60},type:"number",step:"any",placeholder:"–",value:u.measured_discharge_temperature_c??"",onChange:p=>o(f,"measured_discharge_temperature_c",h(p.target.value))})}),c.jsx("td",{children:c.jsx("button",{className:"btn",disabled:e.cases.length<2,onClick:()=>on(t,"cases",e.cases.filter((p,g)=>g!==f)),children:"×"})})]},f))})]})}),c.jsx("button",{className:"btn",style:{marginTop:8},onClick:()=>on(t,"cases",[...e.cases,{...e.cases[e.cases.length-1],name:`Case ${e.cases.length+1}`,is_design:!1}]),children:"Add case"})]})]})]})}function hC(t){var S,y;const e=t.results,[n,i]=ee.useState(null),[r,s]=ee.useState(null),[a,o]=ee.useState("Z"),[l,h]=ee.useState(""),u=t.project.gas.components;if(ee.useEffect(()=>{et.thermoChart({components:u,backend:t.project.gas.backend,t_min_c:-20,t_max_c:200,pressures_bara:[10,30,60,90,120]}).then(i).catch(()=>i(null))},[u,t.project.gas.backend]),!e)return c.jsx(bi,{results:e});const f=e.gas,p=f.suction_state,g=[["Z","Compressibility Z"],["rho","Density (kg/m³)"],["cp","cp (J/kg K)"],["k","cp/cv"],["sound","Speed of sound (m/s)"],["mu","Viscosity (Pa s)"],["h_kj_kg","Enthalpy (kJ/kg)"]];return c.jsxs(c.Fragment,{children:[c.jsx("h2",{children:"Thermodynamics"}),c.jsx("p",{className:"lead",children:"Real-gas properties on the selected equation of state, phase behaviour and compression of every operating case (numerical polytropic path, Schultz method for comparison)."}),c.jsx(jr,{items:[["Molecular weight",ie(f.mw,2)],["Z suction",ie(p.Z,4)],["Density suction",`${ie(p.rho,2)} kg/m³`],["cp/cv",ie(p.k,3)],["Isentropic exponent",ie(p.n_s,3)],["Speed of sound",`${ie(p.sound,0)} m/s`],["HC dew point @ Ps",f.hydrocarbon_dew_point_c===null?"none found":`${ie(f.hydrocarbon_dew_point_c)} °C`],["pH₂S suction",`${ie(f.ph2s_suction_bar,3)} bar`]]}),c.jsxs("div",{className:"grid",children:[c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Property chart"}),c.jsx("div",{className:"chips",children:g.map(([m,d])=>c.jsx("button",{className:`chip ${a===m?"on":""}`,onClick:()=>o(m),children:d},m))}),n&&c.jsx(At,{data:n.map((m,d)=>({x:m.rows.map(_=>_.T_c),y:m.rows.map(_=>_[a]),name:`${m.P_bara} bara`,mode:"lines",line:{color:nt[d]}})),layout:{xaxis:{title:"Temperature (°C)"},yaxis:{title:(S=g.find(m=>m[0]===a))==null?void 0:S[1]}}})]}),c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Phase envelope"}),!r&&c.jsx("button",{className:"btn",disabled:!!l,onClick:async()=>{h("env");try{s(await et.envelope({components:u,p_min_bara:1,p_max_bara:150,points:22}))}finally{h("")}},children:l?"Computing (≈10 s)…":"Compute phase envelope"}),r&&c.jsx(At,{data:[{x:r.dew.map(m=>m.T_c),y:r.dew.map(m=>m.P_bara),name:"Dew points",mode:"markers",marker:{color:nt[0],size:6}},{x:r.bubble.map(m=>m.T_c),y:r.bubble.map(m=>m.P_bara),name:"Bubble points",mode:"markers",marker:{color:nt[3],size:6}},...e.cases.map((m,d)=>({x:m.path.map(_=>_[0]),y:m.path.map(_=>_[1]),name:`${m.case} compression path`,mode:"lines",line:{color:nt[(d+1)%8],dash:"dot"}}))],layout:{xaxis:{title:"Temperature (°C)"},yaxis:{title:"Pressure (bara)"}}}),r&&c.jsx("p",{className:"muted",children:r.model})]})]}),c.jsxs("div",{className:"card",style:{marginTop:14},children:[c.jsx("h3",{children:"Operating cases on the real-gas model"}),c.jsx(ft,{rows:e.cases,cols:[["Case",m=>m.case],["PR",m=>m.pressure_ratio,3],["Flow kg/s",m=>m.mass_flow_kg_s,2],["Q1 Am³/h",m=>m.suction_volume_flow_m3_s*3600,0],["Hp kJ/kg",m=>m.polytropic_head_j_kg/1e3],["Hs kJ/kg",m=>m.isentropic_head_j_kg/1e3],["ηp",m=>m.polytropic_efficiency,3],["ηs",m=>m.isentropic_efficiency,3],["ηp Schultz",m=>m.schultz.eta_p,3],["Td °C",m=>m.discharge.T-273.15],["Td isen. °C",m=>m.isentropic_discharge_temperature_c],["Z2",m=>m.discharge.Z,4],["Gas kW",m=>m.gas_power_kw,0],["Shaft kW",m=>m.shaft_power_kw,0]]})]}),c.jsx(Qt,{trace:(y=e.cases[0])==null?void 0:y.trace})]})}function fC(t){const e=t.results,[n,i]=ee.useState("head");if(!e)return c.jsx(bi,{results:e});const r=e.sizing,s=e.performance_map,a=n==="head"?"head_kj_kg":n,o={head:"Polytropic head (kJ/kg)",pressure_ratio:"Pressure ratio",eta_p:"Polytropic efficiency",power_kw:"Power (kW)"},l={head:"head_kj_kg",pressure_ratio:"",eta_p:"eta_p",power_kw:"power_kw"},h=e.operating_points.filter(u=>u.q_am3_h);return c.jsxs(c.Fragment,{children:[c.jsx("h2",{children:"Compressor selection & aerodynamic performance"}),c.jsx("p",{className:"lead",children:"Type selection, preliminary sizing (stages, speed, diameter, sections and casings), stage design and the stage-stacked performance map with surge and stonewall limits."}),c.jsx(jr,{items:[["Configuration",r.configuration],["Recommended type",r.type_selection.recommended],["Speed",`${ie(r.speed_rpm,0)} rpm`],["Impeller D2",`${ie(r.impeller_diameter_m*1e3,0)} mm`],["Tip speed",`${ie(r.tip_speed_m_s,1)} m/s`],["Machine Mach",ie(r.machine_mach,3)],["Polytropic head",`${ie(r.polytropic_head_total_j_kg/1e3,1)} kJ/kg`],["ηp overall",ie(r.polytropic_efficiency_overall,3)],["Shaft power",`${ie(r.shaft_power_kw,0)} kW`],["Driver rating",`${ie(r.driver_rating_kw,0)} kW`],["Specific speed Ns",ie(r.specific_speed,3)],["Specific diameter Ds",ie(r.specific_diameter,2)]]}),c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Performance map"}),c.jsx("div",{className:"chips",children:["head","pressure_ratio","eta_p","power_kw"].map(u=>c.jsx("button",{className:`chip ${n===u?"on":""}`,onClick:()=>i(u),children:o[u]},u))}),c.jsx(At,{height:420,data:[...s.lines.map((u,f)=>({x:u.points.map(p=>p.q_am3_h),y:u.points.map(p=>p[a]),mode:"lines",name:`${ie(u.speed_frac*100,0)} % (${ie(u.speed_rpm,0)} rpm)`,line:{color:nt[0],width:1.2+.4*(f%2)}})),{x:s.surge_line.map(u=>u.q_am3_h),y:s.surge_line.map(u=>u[a]),name:"Surge limit",mode:"lines",line:{color:nt[3],width:2.2}},{x:s.stonewall_line.map(u=>u.q_am3_h),y:s.stonewall_line.map(u=>u[a]),name:"Stonewall",mode:"lines",line:{color:nt[5],dash:"dash"}},...l[n]?[{x:h.map(u=>u.q_am3_h),y:h.map(u=>u[l[n]]),text:h.map(u=>u.case),mode:"markers+text",textposition:"top right",name:"Operating cases",marker:{color:nt[1],size:10}}]:[]],layout:{xaxis:{title:"Suction volume flow (Am³/h)"},yaxis:{title:o[n]}}})]}),c.jsxs("div",{className:"grid",style:{marginTop:14},children:[c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Operating cases on the map"}),c.jsx(ft,{rows:e.operating_points,cols:[["Case",u=>u.case],["Speed %",u=>(u.speed_frac??NaN)*100],["rpm",u=>u.speed_rpm,0],["ηp",u=>u.eta_p,3],["Pd bara",u=>u.discharge_bara,2],["Td °C",u=>u.discharge_c],["Power kW",u=>u.power_kw,0],["Surge margin %",u=>(u.surge_margin??NaN)*100],["Notes",u=>(u.notes??[]).join("; ")||(u.feasible?"ok":"")]]})]}),c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Compressor type screening"}),c.jsxs("p",{children:["Suction flow ",ie(r.type_selection.suction_flow_am3_h,0)," Am³/h → ",c.jsx("strong",{children:r.type_selection.recommended})]}),c.jsx(ft,{rows:Object.entries(r.type_selection.ranges_am3_h),cols:[["Type",u=>u[0]],["From Am³/h",u=>u[1][0],0],["To Am³/h",u=>u[1][1],0]]}),r.type_selection.notes.map(u=>c.jsx("p",{className:"muted",children:u},u))]})]}),c.jsxs("div",{className:"card",style:{marginTop:14},children:[c.jsx("h3",{children:"Stage-by-stage design"}),c.jsx(ft,{rows:r.stages,cols:[["Stage",u=>String(u.index+1)],["Section",u=>String(u.section+1)],["φ",u=>u.phi,4],["ψ",u=>u.psi,3],["ηp",u=>u.eta,3],["Q in m³/s",u=>u.Q_in_m3_s,3],["P in",u=>u.P_in_bara,2],["P out",u=>u.P_out_bara,2],["T in °C",u=>u.T_in_c],["T out °C",u=>u.T_out_c],["Power kW",u=>u.power_kw,0]]})]}),c.jsx(Qt,{trace:r.trace}),c.jsx(Qt,{trace:s.trace})]})}function pC({fea:t}){const[e,n]=ee.useState(0),[i,r]=ee.useState("von_mises_mpa"),s=t.impellers[Math.min(e,t.impellers.length-1)];return c.jsxs("section",{className:"card accent",style:{marginTop:14},children:[c.jsxs("div",{className:"row",children:[c.jsx("h3",{style:{margin:0},children:"Impeller FEA — axisymmetric model, 3D result view"}),c.jsx("div",{className:"chips",style:{margin:0},children:t.impellers.map((a,o)=>c.jsxs("button",{className:`chip ${e===o?"on":""}`,onClick:()=>n(o),children:["Impeller ",a.impeller]},o))})]}),c.jsx(jr,{items:[["Peak σvm at MCS",`${ie(s.max_vm_mcs_mpa,0)} MPa`],["Peak σvm at 115 %",`${ie(s.max_vm_overspeed_mpa,0)} MPa`],["Yield use MCS / 115 %",`${ie(s.yield_utilisation_mcs,2)} / ${ie(s.yield_utilisation_overspeed,2)}`],["Tip radial growth",`${ie(s.tip_radial_growth_um,0)} µm`],["Eye growth / axial shift",`${ie(s.eye_radial_growth_um,0)} / ${ie(s.eye_axial_shift_um,0)} µm`],["Mesh",`${s.elements} elements · ${s.nodes} nodes`]]}),c.jsxs("div",{className:"grid",children:[c.jsx(tC,{fea:s},e),c.jsxs("div",{children:[c.jsx("div",{className:"chips",children:rh.slice(0,5).map(([a,o])=>c.jsx("button",{className:`chip ${i===a?"on":""}`,onClick:()=>r(a),children:o},a))}),c.jsx(nC,{model:s.model,field:i,caseName:"MCS"}),c.jsxs("p",{className:"muted",children:["Meridional section at MCS (",s.elements," quads; hover an element for its value). Range ",ie(Math.min(...s.model.cases.MCS[i]),0),"–",ie(Math.max(...s.model.cases.MCS[i]),0),"."]}),c.jsx("p",{className:"muted",children:"Eye growth and axial shift feed the eye-seal clearance check; blade stresses need a 3D cyclic-sector model."})]})]})]})}function mC(t){const e=pc(t),[n,i]=ee.useState(0);if(!e)return c.jsx(bi,{results:t.results});const r=e.impellers.impellers,s=e.impeller_stress.impellers,a=s[Math.min(n,s.length-1)].mcs;return c.jsxs(c.Fragment,{children:[c.jsx("h2",{children:"Impeller geometry & stress"}),c.jsx("p",{className:"lead",children:"Impeller dimensions, blade configuration, mass and inertia, centrifugal and thermal stress (axisymmetric rotating-disk FE) and axial thrust."}),c.jsx("div",{className:"card",children:c.jsx(ft,{rows:r,cols:[["Imp.",o=>String(o.index+1)],["D2 mm",o=>o.D2_mm,0],["b2 mm",o=>o.b2_mm],["b2/D2",o=>o.b2_D2,4],["Eye mm",o=>o.D1_eye_mm,0],["Hub mm",o=>o.hub_mm,0],["Blades",o=>String(o.blades)],["Slip σ",o=>o.slip_factor,3],["Work coeff.",o=>o.work_coefficient,3],["W1 tip m/s",o=>o.inlet_w1_tip_m_s,0],["Mrel1",o=>o.inlet_relative_mach,3],["Mass kg",o=>o.mass_kg],["Ip kg·m²",o=>o.ip_kgm2,3],["It kg·m²",o=>o.it_kgm2,3],["Thrust kN",o=>o.thrust_n/1e3,2],["Umax mat. m/s",o=>o.max_tip_speed_for_material_m_s,0]]})}),c.jsxs("div",{className:"grid",style:{marginTop:14},children:[c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Disk stress at MCS"}),c.jsx("div",{className:"chips",children:s.map((o,l)=>c.jsxs("button",{className:`chip ${n===l?"on":""}`,onClick:()=>i(l),children:["Impeller ",o.impeller]},l))}),c.jsx(At,{data:[{x:a.r_m.map(o=>o*1e3),y:a.sigma_t_pa.map(o=>o/1e6),name:"Tangential",mode:"lines"},{x:a.r_m.map(o=>o*1e3),y:a.sigma_r_pa.map(o=>o/1e6),name:"Radial",mode:"lines"},{x:a.r_m.map(o=>o*1e3),y:a.von_mises_pa.map(o=>o/1e6),name:"von Mises",mode:"lines"}],layout:{xaxis:{title:"Radius (mm)"},yaxis:{title:"Stress (MPa)"}}})]}),c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Stress summary"}),c.jsx(ft,{rows:s,cols:[["Imp.",o=>String(o.impeller)],["σvm MCS MPa",o=>o.max_vm_mcs_mpa,0],["σvm 115 % MPa",o=>o.max_vm_overspeed_mpa,0],["σθ avg 115 % MPa",o=>o.avg_tangential_overspeed_mpa,0],["avg / 0.9 Sy",o=>o.overspeed_average_ratio,2],["Burst rpm",o=>o.burst_speed_rpm,0],["Burst margin",o=>o.burst_margin,2],["Tip growth µm",o=>o.tip_growth_um,0]]})]})]}),e.impeller_fea&&c.jsx(pC,{fea:e.impeller_fea}),c.jsx(Qt,{trace:e.impellers.trace}),c.jsx(Qt,{trace:e.impeller_stress.trace}),e.impeller_fea&&c.jsx(Qt,{trace:e.impeller_fea.trace})]})}function gC(t){const e=pc(t),[n,i]=ee.useState(-1);if(!e)return c.jsx(bi,{results:t.results});const r=e.rotor,s=e.shaft,a=e.lateral,o=(a.modes_at_mcs??[]).filter(f=>f.whirl==="forward"&&f.shape),l=n>=0&&o[n]?{z:a.z_m,shape:o[n].shape}:null,h=t.results.scene,u=e.mass_properties;return c.jsxs(c.Fragment,{children:[c.jsx("h2",{children:"Rotor assembly & shaft design"}),c.jsx("p",{className:"lead",children:"Parametric stepped shaft with impellers, balance piston, seals, journals, thrust collar and coupling; mass properties, thrust balance, stresses, fatigue and deflection. Override the geometry in the shaft inputs below."}),c.jsx(jr,{items:[["Rotor mass",`${ie(u.mass_kg,0)} kg`],["Centre of gravity",`${ie(u.cg_m*1e3,0)} mm`],["Ip / It(cg)",`${ie(u.ip_kgm2,2)} / ${ie(u.it_cg_kgm2,1)} kg·m²`],["Bearing span",`${ie(r.bearing_span_m*1e3,0)} mm`],["Span / D",ie(r.span_to_diameter,2)],["Shaft at impellers",`${ie(r.shaft_diameter_impellers_m*1e3,0)} mm`],["Journal",`${ie(r.journal_diameter_m*1e3,0)} mm`],["Torque",`${ie(r.casing_torque_nm,0)} N·m`],["Balance piston",`${ie(r.balance_piston_diameter_m*1e3,0)} mm`],["Residual thrust",`${ie(r.thrust.residual_n/1e3,1)} kN`],["Min fatigue SF",ie(s.min_fatigue_safety,2)],["Mid-span sag",`${ie(s.midspan_sag_um,1)} µm`]]}),c.jsxs("div",{className:"card",children:[c.jsxs("div",{className:"row",style:{marginBottom:8},children:[c.jsx("h3",{style:{margin:0},children:"3D rotor"}),c.jsxs("div",{className:"chips",style:{margin:0},children:[c.jsx("button",{className:`chip ${n<0?"on":""}`,onClick:()=>i(-1),children:"Static"}),o.slice(0,4).map((f,p)=>c.jsxs("button",{className:`chip ${n===p?"on":""}`,onClick:()=>i(p),children:["Mode ",p+1,": ",ie(f.freq_cpm,0)," cpm, δ ",ie(f.logdec,2)]},p))]})]}),h&&c.jsx(sC,{scene:h,mode:l}),c.jsx("p",{className:"muted",children:"Drag to orbit, scroll to zoom. Mode animation shows forward whirl of the damped mode shape at MCS (amplitude exaggerated)."})]}),c.jsxs("div",{className:"grid",style:{marginTop:14},children:[c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Bending moment & torque"}),c.jsx(At,{data:[{x:s.moment_diagram.z_m,y:s.moment_diagram.moment_nm,name:"Gravity bending moment (N·m)",mode:"lines"},{x:s.moment_diagram.z_m,y:s.moment_diagram.torque_nm,name:"Torque (N·m)",mode:"lines",yaxis:"y2"}],layout:{xaxis:{title:"z (m)"},yaxis:{title:"Moment (N·m)"},yaxis2:{overlaying:"y",side:"right",title:"Torque (N·m)"}}})]}),c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Shaft safety factors"}),c.jsx(At,{data:[{x:s.points.map(f=>f.z_m),y:s.points.map(f=>f.fatigue_safety),name:"Fatigue (DE-Goodman)",mode:"markers+lines"},{x:s.points.map(f=>f.z_m),y:s.points.map(f=>Math.min(f.yield_safety,100)),name:"Yield (transient torque)",mode:"markers+lines"}],layout:{xaxis:{title:"z (m)"},yaxis:{title:"Safety factor",type:"log"},shapes:[{type:"line",xref:"paper",x0:0,x1:1,y0:1.5,y1:1.5,line:{color:nt[3],dash:"dash"}}]}})]})]}),c.jsxs("div",{className:"grid",style:{marginTop:14},children:[c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Shaft sections"}),c.jsx(ft,{rows:r.sections,cols:[["Section",f=>f.label],["z0 mm",f=>f.z0_m*1e3,0],["z1 mm",f=>f.z1_m*1e3,0],["OD mm",f=>f.od_m*1e3,0],["ID mm",f=>f.id_m*1e3,0]]})]}),c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Attached masses"}),c.jsx(ft,{rows:r.masses,cols:[["Item",f=>f.label],["z mm",f=>f.z_m*1e3,0],["Mass kg",f=>f.mass_kg],["Ip kg·m²",f=>f.ip_kgm2,3],["It kg·m²",f=>f.it_kgm2,3]]})]})]}),c.jsxs("div",{className:"card",style:{marginTop:14},children:[c.jsx("h3",{children:"Stress at shoulders and sections"}),c.jsx(ft,{rows:s.points,cols:[["z mm",f=>f.z_m*1e3,0],["Type",f=>f.kind],["d mm",f=>f.d_mm,0],["Kt b",f=>f.kt_bending,2],["Kf",f=>f.kf,2],["M N·m",f=>f.moment_nm,0],["T N·m",f=>f.torque_nm,0],["σb MPa",f=>f.bending_mpa,2],["τ MPa",f=>f.torsion_mpa,1],["σvm MPa",f=>f.von_mises_mpa,1],["Se MPa",f=>f.Se_mpa,0],["SF fatigue",f=>f.fatigue_safety,2],["SF yield",f=>f.yield_safety,2]]})]}),c.jsxs("div",{className:"card",style:{marginTop:14},children:[c.jsx("h3",{children:"Shaft design inputs"}),c.jsx(Ci,{schema:t.schema,def:"ShaftDesign",value:t.project.shaft,onChange:f=>on(t,"shaft",f)})]}),c.jsx(Qt,{trace:r.trace}),c.jsx(Qt,{trace:s.trace})]})}function _C(t){const e=pc(t),[n,i]=ee.useState("k");if(!e)return c.jsx(bi,{results:t.results});const r=e.bearings.bearings,s=e.seals,a=s.end_seals.conditioning,o=[];return Object.entries(r).forEach(([l,h],u)=>{(n==="k"?["kxx","kyy","kxy","kyx"]:["cxx","cyy","cxy","cyx"]).forEach((p,g)=>o.push({x:h.speeds_rpm,y:h.rows.map(S=>S[p]),name:`${l} ${p}`,mode:"lines+markers",line:{color:nt[g],dash:u?"dot":"solid"}}))}),c.jsxs(c.Fragment,{children:[c.jsx("h2",{children:"Bearings & seals"}),c.jsx("p",{className:"lead",children:"Hydrodynamic journal bearings (short-bearing Reynolds solution with pad equilibrium), thrust bearing, labyrinths, balance piston, aerodynamic cross-coupling and dry-gas-seal gas conditioning."}),c.jsxs("div",{className:"grid",children:[c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Bearing dynamic coefficients vs speed"}),c.jsxs("div",{className:"chips",children:[c.jsx("button",{className:`chip ${n==="k"?"on":""}`,onClick:()=>i("k"),children:"Stiffness (N/m)"}),c.jsx("button",{className:`chip ${n==="c"?"on":""}`,onClick:()=>i("c"),children:"Damping (N·s/m)"})]}),c.jsx(At,{data:o,layout:{xaxis:{title:"Speed (rpm)"},yaxis:{title:n==="k"?"Stiffness (N/m)":"Damping (N·s/m)"}}})]}),c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Bearing performance at MCS"}),c.jsx(ft,{rows:Object.entries(e.bearing_rated),cols:[["Bearing",l=>l[0]],["Load N",l=>l[1].load_n,0],["Unit load MPa",l=>l[1].unit_load_mpa,2],["U m/s",l=>l[1].surface_speed_m_s,0],["ε",l=>l[1].eccentricity,3],["hmin µm",l=>l[1].h_min_m*1e6,1],["Loss kW",l=>l[1].power_loss_kw,1],["Oil L/min",l=>l[1].oil_flow_l_min,0],["Babbitt °C (est.)",l=>l[1].babbitt_temperature_est_c,0]]}),c.jsx("h3",{style:{marginTop:12},children:"Thrust bearing"}),c.jsx(ft,{rows:[e.rotor.thrust],cols:[["Gross kN",l=>l.gross_impeller_n/1e3,1],["Piston kN",l=>l.balance_piston_n/1e3,1],["Residual kN",l=>l.residual_n/1e3,1],["Design load kN",l=>l.thrust_bearing_load_n/1e3,1],["Collar mm",l=>l.collar_diameter_m*1e3,0]]})]})]}),c.jsxs("div",{className:"grid",style:{marginTop:14},children:[c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Labyrinths and aerodynamic cross-coupling"}),c.jsx(ft,{rows:s.labyrinths,cols:[["Stage",l=>String(l.stage)],["Eye Ø mm",l=>l.eye_diameter_mm,0],["Clearance mm",l=>l.eye_clearance_mm,3],["Eye leak %",l=>l.eye_leakage_pct,2],["Interstage kg/s",l=>l.interstage_leakage_kg_s,3],["Wachel q MN/m",l=>l.wachel_q_n_m/1e6,3]]}),c.jsxs("p",{children:["Balance piston Ø ",ie(s.balance_piston.diameter_mm,0)," mm · leakage ",ie(s.balance_piston.leakage_pct,2)," % · total Qa ",ie(s.total_wachel_q_n_m/1e6,2)," MN/m"]})]}),c.jsxs("div",{className:"card",children:[c.jsxs("h3",{children:["Shaft-end seals: ",String(s.end_seals.type).replace(/_/g," ")]}),a?c.jsx(ft,{rows:[["Seal pressure",`${ie(s.end_seals.seal_pressure_bara,2)} bara`],["Primary leakage per seal",`${ie(s.end_seals.primary_leakage_nm3_h_per_seal,1)} Nm³/h`],["Seal gas supply (total)",`${ie(s.end_seals.seal_gas_supply_nm3_h_total,0)} Nm³/h`],["Hydrocarbon dew point at supply",`${ie(a.hydrocarbon_dew_point_c)} °C`],["Supply temperature",`${ie(a.supply_temperature_c)} °C`],["Temperature after expansion (JT)",`${ie(a.temperature_after_expansion_c)} °C`],["Superheat margin",`${ie(a.superheat_margin_c)} °C`],["Heater required",a.heater_required?"yes":"no"],["Condensation risk after expansion",a.condensation_risk_after_expansion?"yes":"no"]],cols:[["Item",l=>l[0]],["Value",l=>l[1]]]}):c.jsx("p",{className:"muted",children:"No dry gas seal conditioning for this seal type."})]})]}),c.jsxs("div",{className:"grid",style:{marginTop:14},children:[c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Bearing inputs"}),c.jsx(Ci,{schema:t.schema,def:"BearingDesign",value:t.project.bearings,onChange:l=>on(t,"bearings",l)})]}),c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Seal inputs"}),c.jsx(Ci,{schema:t.schema,def:"SealDesign",value:t.project.seals,onChange:l=>on(t,"seals",l)})]})]}),c.jsx(Qt,{trace:e.bearings.trace}),c.jsx(Qt,{trace:s.trace})]})}function vC(t){const e=pc(t),[n,i]=ee.useState(0);if(!e)return c.jsx(bi,{results:t.results});const r=e.lateral;if(!r.campbell)return c.jsx("p",{className:"muted",children:"Lateral analysis not available for this run level."});const s=r.speeds,a=r.campbell,o=(f,p)=>{const g=[],S=[],y=[];return a.speeds_rpm.forEach((m,d)=>a.modes[d].forEach(_=>{(_.whirl===f||f==="backward"&&_.whirl==="mixed")&&_.logdec>1===p&&(g.push(m),S.push(_.freq_hz*60),y.push(`log dec ${ie(_.logdec,3)}`))})),{x:g,y:S,text:y}},l=[["Min",s.min_rpm],["MCS",s.mcs_rpm],["Trip",s.trip_rpm]].map(([,f])=>({type:"line",x0:f,x1:f,yref:"paper",y0:0,y1:1,line:{color:nt[2],dash:"dot",width:1}})),h=r.unbalance_cases[Math.min(n,r.unbalance_cases.length-1)],u=r.stability;return c.jsxs(c.Fragment,{children:[c.jsx("h2",{children:"Lateral rotordynamics"}),c.jsx("p",{className:"lead",children:"Finite-element rotor (Timoshenko beams, gyroscopics, speed-dependent bearings), Campbell diagram, undamped critical-speed map, unbalance response with API 617-style amplification factor / separation margin / amplitude checks, and Level I stability with modified-Wachel cross-coupling."}),c.jsx(jr,{items:[["Speed range",`${ie(s.min_rpm,0)}–${ie(s.mcs_rpm,0)} rpm`],["Trip",`${ie(s.trip_rpm,0)} rpm`],["1st critical (rigid supports)",`${ie(u.first_critical_rigid_rpm,0)} rpm`],["Critical speed ratio",ie(u.critical_speed_ratio,2)],["Qa (Wachel)",`${ie(u.qa_n_m/1e6,2)} MN/m`],["Q0 (zero log dec)",u.q0_n_m?`${ie(u.q0_n_m/1e6,2)} MN/m`:"> range"],["Log dec, no Qa",ie(u.logdec_no_qa,3)],["Log dec with Qa",ie(u.logdec_with_qa,3)],["Level I",u.level1_pass?"pass":"Level II required"],["Amplitude limit",`${ie(r.amplitude_limit_um,1)} µm pk-pk`]]}),c.jsxs("div",{className:"grid",children:[c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Campbell diagram"}),c.jsx(At,{height:380,data:[{...o("forward",!1),name:"Forward",mode:"markers",marker:{color:nt[0],size:6}},{...o("backward",!1),name:"Backward",mode:"markers",marker:{color:nt[5],size:6,symbol:"square"}},{...o("forward",!0),name:"Forward (δ > 1)",mode:"markers",marker:{color:nt[0],size:5,opacity:.25}},{...o("backward",!0),name:"Backward (δ > 1)",mode:"markers",marker:{color:nt[5],size:5,opacity:.25,symbol:"square"}},{x:a.speeds_rpm,y:a.speeds_rpm,name:"1X",mode:"lines",line:{color:nt[3]}}],layout:{xaxis:{title:"Rotor speed (rpm)"},yaxis:{title:"Damped natural frequency (cpm)",range:[0,Math.max(...a.speeds_rpm)*2]},shapes:l}})]}),c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Undamped critical-speed map"}),c.jsx(At,{height:380,data:[0,1,2,3].map(f=>({x:r.undamped_critical_map.k_n_m,y:r.undamped_critical_map.critical_speeds_rpm.map(p=>p[f]),name:`Mode ${f+1}`,mode:"lines"})),layout:{xaxis:{title:"Bearing stiffness (N/m)",type:"log"},yaxis:{title:"Critical speed (rpm)",type:"log"},shapes:[s.mcs_rpm,s.min_rpm].map(f=>({type:"line",xref:"paper",x0:0,x1:1,y0:f,y1:f,line:{color:nt[2],dash:"dot"}}))}})]})]}),c.jsxs("div",{className:"card",style:{marginTop:14},children:[c.jsxs("div",{className:"row",children:[c.jsx("h3",{style:{margin:0},children:"Unbalance response"}),c.jsx("div",{className:"chips",style:{margin:0},children:r.unbalance_cases.map((f,p)=>c.jsxs("button",{className:`chip ${n===p?"on":""}`,onClick:()=>i(p),children:["Mode ",f.mode," unbalance"]},p))})]}),h&&c.jsxs(c.Fragment,{children:[c.jsx(At,{height:360,data:Object.entries(h.response.probes).map(([f,p],g)=>({x:h.response.speeds_rpm,y:p.major_um,name:`z = ${ie(Number(f),3)} m`,mode:"lines",line:{color:nt[g%8]}})),layout:{xaxis:{title:"Speed (rpm)"},yaxis:{title:"Response major semi-axis (µm)",type:"log"},shapes:l}}),c.jsxs("p",{className:"muted",children:["Unbalance: ",h.unbalances.map(f=>`${ie(f.g_mm,0)} g·mm at z = ${ie(f.z,3)} m, ${f.phase_deg}°`).join("; ")]}),c.jsxs("div",{className:"grid",children:[c.jsx(ft,{rows:h.peaks,cols:[["Critical rpm",f=>f.speed_rpm,0],["AF",f=>f.af,2],["Method",f=>f.af_method??""],["Amplitude µm",f=>f.amplitude_um,2],["SM %",f=>f.separation_pct],["Required %",f=>f.required_separation_pct??"AF < 2.5"],["Result",f=>f.pass?"pass":"FAIL"]]}),c.jsx(ft,{rows:[...h.amplitude_checks,...h.clearance_checks],cols:[["Location",f=>f.location],["Value",f=>f.pk_pk_um_1x_unbalance??f.max_pk_pk_um],["Limit",f=>f.limit_um??f.diametral_clearance_um*t.project.criteria.clearance_ratio_limit],["Result",f=>f.pass?"pass":"FAIL"]]})]})]})]}),c.jsxs("div",{className:"grid",style:{marginTop:14},children:[c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Forward mode shapes at MCS"}),c.jsx(At,{data:r.modes_at_mcs.filter(f=>f.whirl==="forward").slice(0,4).map(f=>({x:r.z_m,y:f.shape,name:`${ie(f.freq_cpm,0)} cpm, δ ${ie(f.logdec,2)}`,mode:"lines"})),layout:{xaxis:{title:"z (m)"},yaxis:{title:"Normalised amplitude"},shapes:e.rotor.bearing_z_m.map(f=>({type:"line",x0:f,x1:f,yref:"paper",y0:0,y1:1,line:{color:nt[5],dash:"dash"}}))}})]}),c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Level I stability: log dec vs cross-coupling"}),c.jsx(At,{data:[{x:u.logdec_vs_q.map(f=>f[0]/1e6),y:u.logdec_vs_q.map(f=>f[1]),mode:"lines+markers",name:"First forward mode"},{x:[u.qa_n_m/1e6],y:[u.logdec_with_qa],mode:"markers",name:"Qa",marker:{size:12,color:nt[1]}}],layout:{xaxis:{title:"Cross-coupled stiffness Q (MN/m)"},yaxis:{title:"Log decrement"},shapes:[{type:"line",xref:"paper",x0:0,x1:1,y0:t.project.criteria.lateral_logdec_min,y1:t.project.criteria.lateral_logdec_min,line:{color:nt[3],dash:"dash"}}]}})]})]}),c.jsx(Qt,{trace:r.trace})]})}function xC(t){var o,l,h;const e=t.results,[n,i]=ee.useState(0);if(!e)return c.jsx(bi,{results:e});const r=e.torsional,s=r.interference,a=r.natural.modes;return c.jsxs(c.Fragment,{children:[c.jsx("h2",{children:"Torsional vibration of the train"}),c.jsx("p",{className:"lead",children:"Driver, coupling(s), gearbox and compressor shaft line as a lumped model referred to compressor speed: natural frequencies, mode shapes, interference diagram with separation checks, forced response and stresses."}),c.jsxs("div",{className:"grid",children:[c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Interference diagram"}),c.jsx(At,{height:380,data:[...Object.entries(s.lines_hz).map(([u,f],p)=>({x:s.speeds_rpm,y:f,name:u,mode:"lines",line:{color:nt[p%8]}})),...a.slice(0,4).map(u=>({x:[0,Math.max(...s.speeds_rpm)],y:[u.freq_hz,u.freq_hz],mode:"lines",name:`${ie(u.freq_hz,1)} Hz`,line:{color:"#888",dash:"dash",width:1}}))],layout:{xaxis:{title:"Compressor speed (rpm)"},yaxis:{title:"Frequency (Hz)",range:[0,Math.min(4e3,(((o=a[3])==null?void 0:o.freq_hz)??1e3)*1.3)]},shapes:[e.casings[0].lateral.speeds.min_rpm,e.casings[0].lateral.speeds.mcs_rpm].map(u=>({type:"line",x0:u,x1:u,yref:"paper",y0:0,y1:1,line:{color:nt[2],dash:"dot"}}))}})]}),c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Mode shapes"}),c.jsx("div",{className:"chips",children:a.slice(0,5).map((u,f)=>c.jsxs("button",{className:`chip ${n===f?"on":""}`,onClick:()=>i(f),children:[ie(u.freq_hz,1)," Hz"]},f))}),c.jsx(At,{data:[{x:r.natural.stations,y:((l=a[n])==null?void 0:l.shape)??[],mode:"lines+markers",name:"Relative twist angle"}],layout:{xaxis:{title:"",tickangle:-30},yaxis:{title:"Normalised angle"},margin:{b:110}}}),c.jsxs("p",{className:"muted",children:["Dominant shaft: ",(h=a[n])==null?void 0:h.dominant_shaft]})]})]}),c.jsxs("div",{className:"grid",style:{marginTop:14},children:[c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Forced response: 1 % rated torque at 1X, applied at the coupling"}),c.jsx(At,{data:Object.entries(r.forced.dynamic_torque_nm).map(([u,f])=>({x:r.forced.speeds_rpm,y:f,name:u,mode:"lines"})),layout:{xaxis:{title:"Speed (rpm)"},yaxis:{title:"Dynamic torque (N·m)",type:"log"}}})]}),c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Separation checks"}),c.jsx(ft,{rows:s.checks,cols:[["Mode Hz",u=>u.mode_hz,1],["Excitation",u=>u.excitation],["Band Hz",u=>`${ie(u.band_hz[0],0)}–${ie(u.band_hz[1],0)}`],["Separation %",u=>u.separation*100],["Result",u=>u.pass?"pass":u.excitation.includes("VFD")?"evaluate":"FAIL"]]})]})]}),r.startup&&c.jsxs("div",{className:"card",style:{marginTop:14},children:[c.jsx("h3",{children:"Synchronous motor start-up transient"}),c.jsx(At,{data:Object.entries(r.startup.shaft_torque_nm).map(([u,f])=>({x:r.startup.t_s,y:f,name:u,mode:"lines"})),layout:{xaxis:{title:"Time (s)"},yaxis:{title:"Shaft torque (N·m)"}}})]}),c.jsxs("div",{className:"grid",style:{marginTop:14},children:[c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Shaft stresses"}),c.jsx(ft,{rows:r.stress,cols:[["Shaft",u=>u.shaft],["Ø mm",u=>u.diameter_mm,0],["Mean N·m",u=>u.mean_torque_nm,0],["Max dyn. N·m",u=>u.max_dynamic_torque_nm,0],["τm MPa",u=>u.mean_shear_mpa,1],["τa MPa",u=>u.alternating_shear_mpa,2],["Goodman SF",u=>u.goodman_safety,2]]})]}),c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Train inputs"}),c.jsx(Ci,{schema:t.schema,def:"TrainDesign",value:t.project.train,onChange:u=>on(t,"train",u)})]})]}),c.jsx(Qt,{trace:r.trace})]})}function yC(t){const e=t.results;if(!e)return c.jsx(bi,{results:e});const n=e.lube,i=e.piping;return c.jsxs(c.Fragment,{children:[c.jsx("h2",{children:"Lube oil & piping"}),c.jsx("p",{className:"lead",children:"Oil flow from bearing losses, pump, cooler and reservoir sizing (API 614 considerations); suction and discharge line sizing, compressible pressure drop, recycle valve (IEC 60534) and flow meter (ISO 5167); system curve."}),c.jsxs("div",{className:"grid",children:[c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Lube oil system"}),c.jsx(ft,{rows:[["Journal losses",`${ie(n.journal_loss_kw,1)} kW`],["Thrust loss",`${ie(n.thrust_loss_kw,1)} kW`],["Normal oil flow",`${ie(n.normal_flow_l_min,0)} L/min`],["Pump rated flow",`${ie(n.pump_rated_flow_l_min,0)} L/min`],["Pump shaft power",`${ie(n.pump_shaft_kw,1)} kW`],["Cooler duty",`${ie(n.cooler_duty_kw,1)} kW`],["Cooler LMTD",`${ie(n.cooler_lmtd_c,1)} °C`],["Cooler area (incl. fouling)",`${ie(n.cooler_area_m2,2)} m²`],["Cooling water",`${ie(n.cooling_water_m3_h,1)} m³/h`],["Reservoir working volume",`${ie(n.reservoir_working_l,0)} L`],["Oil viscosity at drain",`${ie(n.oil_viscosity_cst_at_drain,1)} cSt`]],cols:[["Item",r=>r[0]],["Value",r=>r[1]]]})]}),c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Process piping"}),c.jsx(ft,{rows:["suction","discharge"].map(r=>({side:r,...i[r]})),cols:[["Line",r=>r.side],["NPS",r=>String(r.nps_in)],["ID mm",r=>r.id_m*1e3,0],["v m/s",r=>r.velocity_m_s],["ρv² Pa",r=>r.rho_v2_pa,0],["Mach",r=>r.mach,3],["Re",r=>r.reynolds,0],["f",r=>r.friction_factor,4],["ΔP bar",r=>r.dp_bar,3]]}),c.jsxs("p",{children:["Recycle valve Cv ",ie(i.recycle_valve.cv,0)," (x = ",ie(i.recycle_valve.x,2),", ",i.recycle_valve.choked?"choked":"not choked",") · Orifice β ",ie(i.flowmeter.beta,2),", C ",ie(i.flowmeter.C,4),", ΔP ",ie(i.flowmeter.dp_pa/1e3,1)," kPa"]})]})]}),c.jsxs("div",{className:"card",style:{marginTop:14},children:[c.jsx("h3",{children:"Compressor and system curves at rated speed"}),c.jsx(At,{data:[{x:i.system_curve.map(r=>r.q_am3_h),y:i.system_curve.map(r=>r.compressor_head_kj_kg),name:"Compressor (100 %)",mode:"lines"},{x:i.system_curve.map(r=>r.q_am3_h),y:i.system_curve.map(r=>r.system_head_kj_kg),name:"System",mode:"lines",line:{dash:"dash"}}],layout:{xaxis:{title:"Suction flow (Am³/h)"},yaxis:{title:"Head (kJ/kg)"}}})]}),c.jsxs("div",{className:"grid",style:{marginTop:14},children:[c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Lube inputs"}),c.jsx(Ci,{schema:t.schema,def:"LubeDesign",value:t.project.lube,onChange:r=>on(t,"lube",r)})]}),c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Piping inputs"}),c.jsx(Ci,{schema:t.schema,def:"PipingDesign",value:t.project.piping,onChange:r=>on(t,"piping",r)})]})]}),c.jsx(Qt,{trace:n.trace}),c.jsx(Qt,{trace:i.trace})]})}const SC={outside:["fail","Outside recorded limits"],evidence:["attention","Evidence needed"],within:["pass","Within recorded limits · conditional"]},wu=[["min_temp_c","Min T °C"],["max_temp_c","Max T °C"],["max_hardness_hrc","Max HRC"],["measured_hardness_hrc","Meas. HRC"],["max_wet_ph2s_bar","Wet pH₂S bar"],["max_dry_ph2s_bar","Dry pH₂S bar"],["max_pco2_bar","pCO₂ bar"],["min_ph","Min pH"],["max_chloride_ppm","Cl⁻ ppm"],["corrosion_allowance_mm","CA mm"]];function MC(t){const[e,n]=ee.useState(null),[i,r]=ee.useState(null);ee.useEffect(()=>{et.materials().then(n).catch(()=>{})},[]);const s=t.results,a=t.project,o=a.material_assessment,l=s==null?void 0:s.material_assessment,h=o.records.length?o.records:((l==null?void 0:l.components)??[]).map(m=>{const{status:d,failures:_,missing:v,checks:M,...R}=m;return R}),u=m=>t.setProject({...a,material_assessment:m}),f=(m,d,_)=>u({...o,records:h.map((v,M)=>M===m?{...v,[d]:_}:v)}),p=m=>m===""?null:parseFloat(m),g=(l==null?void 0:l.conditions)??[],S=[.003,.01,.03,.1,.3,1,3,10],y=m=>Math.log10(m);return c.jsxs(c.Fragment,{children:[c.jsx("h2",{children:"Material assessment"}),c.jsxs("p",{className:"lead",children:["Sour and wet service screening at every stage, driven by the compressor design: partial pressures, water dew point, condensed-water pH, SSC severity domain and CO₂ corrosion, checked against each component's ",c.jsx("strong",{children:"recorded, verified"})," limits. A material name alone never passes."]}),l&&c.jsx(jr,{items:[["Outside limits",String(l.counts.outside)],["Evidence needed",String(l.counts.evidence)],["Within limits",String(l.counts.within)],["Sour",g.some(m=>m.sour)?"yes (pH₂S ≥ 0.3 kPa)":"no"],["Wet locations",g.filter(m=>m.wet).map(m=>m.location).join(", ")||"none"]]}),c.jsxs("div",{className:"grid",children:[c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Service conditions by location"}),c.jsx(ft,{rows:g,cols:[["Location",m=>m.location],["P bara",m=>m.P_bara,1],["T °C",m=>m.T_c,0],["pH₂S bar",m=>m.ph2s_bar,3],["pCO₂ bar",m=>m.pco2_bar,2],["Water dew °C",m=>m.water_dew_point_c,1],["State",m=>m.wet?"WET":"dry"],["pH",m=>m.ph,2],["Domain",m=>m.domain],["CO₂ mm/y",m=>m.co2_rate_mm_y,2]]})]}),c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"SSC severity map (illustrative domains, not ISO 15156 limits)"}),c.jsx(At,{height:300,data:[{x:S,y:S.map(m=>Math.min(6.5,4+y(m)-y(.003))),mode:"lines",name:"D1 / D2",line:{color:nt[2],dash:"dash"}},{x:S,y:S.map(m=>Math.min(5.5,3.5+y(m)-y(.01))),mode:"lines",name:"D2 / D3",line:{color:nt[3],dash:"dash"}},{x:g.map(m=>Math.max(m.ph2s_bar,1e-4)),y:g.map(m=>m.ph),text:g.map(m=>m.location),mode:"markers+text",textposition:"top center",name:"Locations",marker:{size:11,color:g.map(m=>m.wet?nt[3]:nt[0])}}],layout:{xaxis:{title:"pH₂S (bar)",type:"log"},yaxis:{title:"pH",range:[2.5,7]},shapes:[{type:"line",x0:.003,x1:.003,yref:"paper",y0:0,y1:1,line:{color:nt[5],dash:"dot"}}]}})]})]}),c.jsxs("div",{className:"card",style:{marginTop:14},children:[c.jsx("h3",{children:"Components — recorded limits and verdicts"}),c.jsx("div",{className:"scroll",children:c.jsxs("table",{className:"t",children:[c.jsx("thead",{children:c.jsxs("tr",{children:[c.jsx("th",{children:"Component"}),c.jsx("th",{children:"Material"}),c.jsx("th",{children:"Evidence ref."}),c.jsx("th",{children:"Verified"}),wu.map(([,m])=>c.jsx("th",{children:m},m)),c.jsx("th",{children:"Verdict"})]})}),c.jsx("tbody",{children:h.map((m,d)=>{var R;const _=(R=l==null?void 0:l.components)==null?void 0:R[d],[v,M]=SC[(_==null?void 0:_.status)??"evidence"];return c.jsxs(ee.Fragment,{children:[c.jsxs("tr",{children:[c.jsx("td",{children:m.component}),c.jsx("td",{children:c.jsx("select",{className:"inp",value:m.material,onChange:A=>f(d,"material",A.target.value),children:((e==null?void 0:e.materials)??[{key:m.material}]).map(A=>c.jsx("option",{children:A.key},A.key))})}),c.jsx("td",{children:c.jsx("input",{className:"inp",style:{width:110},value:m.evidence_reference,placeholder:"doc / cert ref",onChange:A=>f(d,"evidence_reference",A.target.value)})}),c.jsx("td",{children:c.jsx("input",{type:"checkbox",checked:m.verified,onChange:A=>f(d,"verified",A.target.checked)})}),wu.map(([A])=>c.jsx("td",{children:c.jsx("input",{className:"inp",style:{width:64},type:"number",step:"any",value:m[A]??"",onChange:C=>f(d,A,p(C.target.value))})},A)),c.jsx("td",{children:c.jsx("button",{className:`badge ${v}`,onClick:()=>r(i===d?null:d),children:M})})]}),i===d&&_&&c.jsx("tr",{children:c.jsx("td",{colSpan:wu.length+5,children:c.jsxs("div",{className:"verdict",children:[_.failures.map(A=>c.jsxs("div",{className:"status fail",children:["✕ ",A]},A)),_.missing.map(A=>c.jsxs("div",{className:"status attention",children:["○ ",A]},A)),_.checks.map(A=>c.jsxs("div",{className:"status pass",children:["✓ ",A]},A))]})})})]},d)})})]})}),c.jsx("p",{className:"muted",children:"Edit limits from your qualified documents, then re-run. Click a verdict for the detailed checks."})]}),c.jsxs("div",{className:"card",style:{marginTop:14},children:[c.jsx("h3",{children:"Assessment inputs"}),c.jsx(Ci,{schema:t.schema,def:"MaterialAssessment",value:o,onChange:u,skip:["records"]})]}),e&&c.jsxs("details",{className:"card",style:{marginTop:14},children:[c.jsxs("summary",{children:[c.jsx("strong",{children:"Material database"})," ",c.jsxs("span",{className:"muted",children:["— ",e._notice]})]}),c.jsx(ft,{rows:e.materials,cols:[["Material",m=>m.key],["Family",m=>m.family.replace(/_/g," ")],["ρ kg/m³",m=>m.density_kg_m3,0],["E GPa",m=>m.E_gpa,0],["Sy MPa",m=>m.yield_mpa,0],["Su MPa",m=>m.uts_mpa,0],["T min °C",m=>m.min_temp_c,0],["T max °C",m=>m.max_temp_c,0],["Sour HRC max",m=>m.sour_max_hrc??"–"],["Corrosion",m=>m.corrosion]]})]}),l&&c.jsx(Qt,{trace:l.trace})]})}const EC=["shaft.shaft_diameter_at_impellers_mm","shaft.journal_diameter_mm","bearings.length_to_diameter","bearings.radial_clearance_ratio","bearings.preload","bearings.pivot_offset","design_basis.head_coefficient","design_basis.first_stage_flow_coefficient","design_basis.max_tip_speed_m_s","design_basis.speed_rpm_override","seals.labyrinth_teeth","train.coupling_torsional_stiffness_nm_rad"];function wC(t){const[e,n]=ee.useState([]),[i,r]=ee.useState("bearings.preload"),[s,a]=ee.useState("0.05, 0.15, 0.25, 0.35, 0.45"),[o,l]=ee.useState(["logdec_with_qa","bearing_loss_kw","min_film_um"]),[h,u]=ee.useState(null),[f,p]=ee.useState(null),[g,S]=ee.useState(null),[y,m]=ee.useState(""),[d,_]=ee.useState(""),[v,M]=ee.useState("logdec_with_qa"),[R,A]=ee.useState("0.05, 0.5");ee.useEffect(()=>{et.metrics().then(n).catch(()=>{})},[]);const C=async(B,x)=>{m(B),_("");try{await x()}catch(E){_(E.message)}finally{m("")}},P=B=>l(o.includes(B)?o.filter(x=>x!==B):[...o,B]);return c.jsxs(c.Fragment,{children:[c.jsx("h2",{children:"Engineering optimisation"}),c.jsx("p",{className:"lead",children:"Parametric studies, sensitivity analysis and constrained optimisation with the full workflow in the loop (fast level: coarser bearing tables, damped modes and Level I stability). Each evaluation takes a few seconds."}),d&&c.jsx("div",{className:"error",children:d}),c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Metrics"}),c.jsx("div",{className:"chips",children:e.map(B=>c.jsx("button",{className:`chip ${o.includes(B)?"on":""}`,onClick:()=>P(B),children:B},B))})]}),c.jsxs("div",{className:"grid",style:{marginTop:14},children:[c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Parametric study"}),c.jsxs("div",{className:"form",children:[c.jsxs("label",{children:["Variable",c.jsx("select",{value:i,onChange:B=>r(B.target.value),children:EC.map(B=>c.jsx("option",{children:B},B))})]}),c.jsxs("label",{children:["Values (comma separated)",c.jsx("input",{value:s,onChange:B=>a(B.target.value)})]})]}),c.jsx("button",{className:"btn primary",style:{marginTop:8},disabled:!!y,onClick:()=>C("p",async()=>{u(await et.parametric({project:t.project,variable:i,values:s.split(",").map(Number).filter(Number.isFinite),metrics:o}))}),children:y==="p"?"Running…":"Run study"}),h&&c.jsx(c.Fragment,{children:h.metrics.map((B,x)=>c.jsx(At,{height:220,data:[{x:h.rows.map(E=>E.value),y:h.rows.map(E=>E[B]),mode:"lines+markers",name:B,line:{color:nt[x%8]}}],layout:{xaxis:{title:h.variable},yaxis:{title:B},margin:{t:10}}},B))})]}),c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Sensitivity (normalised: % change of metric per % change of variable)"}),c.jsx("p",{className:"muted",children:"Uses the variables currently set (auto-estimated variables are skipped)."}),c.jsx("button",{className:"btn",disabled:!!y,onClick:()=>C("s",async()=>{p(await et.sensitivity({project:t.project,variables:["bearings.length_to_diameter","bearings.radial_clearance_ratio","bearings.preload","design_basis.head_coefficient","design_basis.max_tip_speed_m_s"],metrics:o}))}),children:y==="s"?"Running (≈1 min)…":"Run sensitivity"}),f&&c.jsx(ft,{rows:f.sensitivities,cols:[["Variable",B=>B.variable],...f.metrics.map(B=>[B,x=>x[B],2])]}),c.jsx("h3",{style:{marginTop:16},children:"Optimise one variable"}),c.jsxs("div",{className:"form",children:[c.jsxs("label",{children:["Objective (maximise)",c.jsx("select",{value:v,onChange:B=>M(B.target.value),children:e.map(B=>c.jsx("option",{children:B},B))})]}),c.jsxs("label",{children:["Bounds for “",i,"”",c.jsx("input",{value:R,onChange:B=>A(B.target.value)})]})]}),c.jsx("button",{className:"btn",style:{marginTop:8},disabled:!!y,onClick:()=>C("o",async()=>{const[B,x]=R.split(",").map(Number);S(await et.optimize({project:t.project,variables:[{path:i,lower:B,upper:x}],objective:v,sense:"max",constraints:[{metric:"min_film_um",op:">=",value:t.project.criteria.bearing_min_film_um}],max_evals:12}))}),children:y==="o"?"Optimising…":"Optimise (constraint: min film ≥ criterion)"}),g&&c.jsxs("p",{children:["Best ",i," = ",c.jsx("strong",{children:ie(g.best.x[i],4)})," → ",v," = ",ie(g.best[v],4)," ·",g.feasible?" feasible":" infeasible"," · ",g.evaluations," evaluations"]}),g&&c.jsx(At,{height:220,data:[{x:g.history.map(B=>B.x[i]),y:g.history.map(B=>B[v]),mode:"markers",name:"evaluations"}],layout:{xaxis:{title:i},yaxis:{title:v},margin:{t:10}}})]})]})]})}function TC(t){const e=t.results,[n,i]=ee.useState("all"),r=ee.useMemo(()=>e?e.checklist.items.filter(a=>n==="all"||a.status===n):[],[e,n]);if(!e)return c.jsx(bi,{results:e});const s=e.checklist.counts;return c.jsxs(c.Fragment,{children:[c.jsx("h2",{children:"Engineering verification"}),c.jsx("p",{className:"lead",children:"Every module's checks against the version-controlled criteria, with source, reference and status. “Review” items are outside the software's scope and need qualified engineering review."}),c.jsx(Vv,{}),c.jsx(jr,{items:[["Pass",String(s.pass)],["Fail",String(s.fail)],["Attention",String(s.attention)],["For review",String(s.review)]]}),c.jsx("div",{className:"chips",children:["all","fail","attention","pass","review"].map(a=>c.jsx("button",{className:`chip ${n===a?"on":""}`,onClick:()=>i(a),children:a},a))}),c.jsx("div",{className:"card",children:c.jsx("div",{className:"scroll",children:c.jsxs("table",{className:"t",children:[c.jsx("thead",{children:c.jsxs("tr",{children:[c.jsx("th",{children:"Category"}),c.jsx("th",{children:"Check"}),c.jsx("th",{children:"Criterion"}),c.jsx("th",{children:"Value"}),c.jsx("th",{children:"Status"}),c.jsx("th",{children:"Reference"}),c.jsx("th",{children:"Module"})]})}),c.jsx("tbody",{children:r.map((a,o)=>c.jsxs("tr",{children:[c.jsx("td",{children:a.category}),c.jsxs("td",{children:[a.check,a.note&&c.jsx("div",{className:"muted",children:a.note})]}),c.jsx("td",{children:a.criterion}),c.jsx("td",{children:a.value}),c.jsx("td",{children:c.jsx("span",{className:`status ${a.status}`,children:a.status})}),c.jsx("td",{children:a.reference}),c.jsx("td",{className:"muted",children:a.module})]},o))})]})})}),c.jsxs("p",{className:"muted",children:["Criteria basis: ",e.checklist.criteria_edition]})]})}function CC(t){const[e,n]=ee.useState([]),[i,r]=ee.useState([]),[s,a]=ee.useState([]),[o,l]=ee.useState(""),[h,u]=ee.useState(""),[f,p]=ee.useState(""),g=async()=>{n(await et.projects()),t.savedId&&(r(await et.revisions(t.savedId)),a(await et.history(t.savedId)))};ee.useEffect(()=>{g().catch(()=>{})},[t.savedId]);const S=async d=>{u(d),p("");try{if(d==="report.html"){const _=await fetch("/api/export/report.html",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({project:t.project,level:"full"})}),v=window.open("","_blank");v&&(v.document.write(await _.text()),v.document.close())}else await yy(d,t.project)}catch(_){p(_.message)}finally{u("")}},y=async()=>{p("");try{const d=t.savedId?await et.updateProject(t.savedId,t.project,o):await et.createProject(t.project,o||"Created");t.setSavedId(d.id),t.setProject(d.project),l(""),await g()}catch(d){p(d.message)}},m=[["report.html","Calculation report (HTML, printable)"],["report.pdf","Calculation report (PDF)"],["results.xlsx","Results workbook (Excel)"],["results.json","Full results (JSON)"],["rotor.stl","Rotor CAD (STL)"],["rotor.step","Rotor CAD (STEP, needs CadQuery)"],["calculix-beam.inp","CalculiX beam deck (frequency check)"],["calculix-axisymmetric.inp","CalculiX axisymmetric deck (centrifugal stress)"],["scene.json","3D scene (JSON)"]];return c.jsxs(c.Fragment,{children:[c.jsx("h2",{children:"Reports, revisions & history"}),c.jsx("p",{className:"lead",children:"Technical documentation with datasheet, figures, checklist and full traceability; CAD and FE exports; project revisions and calculation history stored on the server."}),f&&c.jsx("div",{className:"error",children:f}),c.jsxs("div",{className:"grid",children:[c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Documents & exports"}),m.map(([d,_])=>c.jsxs("div",{className:"row",style:{marginBottom:6},children:[c.jsx("button",{className:"btn",disabled:!!h,onClick:()=>S(d),children:h===d?"Preparing…":"Download"}),c.jsx("span",{children:_})]},d))]}),c.jsxs("div",{className:"card",children:[c.jsx("h3",{children:"Save project revision"}),c.jsxs("div",{className:"row",children:[c.jsx("input",{className:"inp",style:{flex:1},placeholder:"Revision note",value:o,onChange:d=>l(d.target.value)}),c.jsx("button",{className:"btn primary",onClick:y,children:t.savedId?"Save new revision":"Save project"})]}),i.length>0&&c.jsx(ft,{rows:i,cols:[["Rev",d=>String(d.revision)],["Saved",d=>d.created],["Note",d=>d.note],["Input hash",d=>d.input_hash]]}),t.savedId&&c.jsx("button",{className:"btn",style:{marginTop:8},onClick:async()=>{const d=await et.runSaved(t.savedId);t.setResults(d,t.project),await g()},children:"Run saved revision and record in history"}),s.length>0&&c.jsxs(c.Fragment,{children:[c.jsx("h3",{style:{marginTop:12},children:"Calculation history"}),c.jsx(ft,{rows:s,cols:[["Run",d=>String(d.id)],["Rev",d=>String(d.revision)],["When",d=>d.created],["Version",d=>d.software_version],["Speed rpm",d=>d.summary.speed_rpm,0],["Power kW",d=>d.summary.shaft_power_kw,0],["Fails",d=>String(d.summary.checklist.fail)]]})]})]})]}),c.jsxs("div",{className:"card",style:{marginTop:14},children:[c.jsx("h3",{children:"Saved projects"}),c.jsx(ft,{rows:e,cols:[["#",d=>String(d.id)],["Name",d=>d.name],["Revision",d=>String(d.current_revision)],["Updated",d=>d.updated]]}),c.jsxs("div",{className:"row",style:{marginTop:8},children:[e.map(d=>c.jsxs("button",{className:"btn",onClick:async()=>{const _=await et.getProject(d.id);t.setSavedId(d.id),t.setProject(_.project)},children:["Open #",d.id]},d.id)),c.jsx("button",{className:"btn",onClick:async()=>{const d=await et.defaults();t.setSavedId(null),t.setProject(d)},children:"New from example"}),c.jsx("button",{className:"btn",onClick:()=>{const d=document.createElement("a");d.href=URL.createObjectURL(new Blob([JSON.stringify(t.project,null,1)],{type:"application/json"})),d.download=`${String(t.project.name).replace(/\s+/g,"_")}_rev${t.project.revision}.json`,d.click()},children:"Export project file"}),c.jsxs("label",{className:"btn",children:["Import project file",c.jsx("input",{type:"file",accept:".json,application/json",hidden:!0,onChange:async d=>{var v;const _=(v=d.target.files)==null?void 0:v[0];if(_){try{const M=JSON.parse(await _.text());t.setSavedId(null),t.setProject({...await et.defaults(),...M})}catch(M){alert(`Not a CentriForge project file: ${M.message}`)}d.target.value=""}}})]})]})]})]})}const AC={project:t=>c.jsx(uC,{...t}),gas:t=>c.jsx(dC,{...t}),thermo:t=>c.jsx(hC,{...t}),compressor:t=>c.jsx(fC,{...t}),impellers:t=>c.jsx(mC,{...t}),rotor:t=>c.jsx(gC,{...t}),bearings:t=>c.jsx(_C,{...t}),lateral:t=>c.jsx(vC,{...t}),torsional:t=>c.jsx(xC,{...t}),materials:t=>c.jsx(MC,{...t}),aux:t=>c.jsx(yC,{...t}),optimize:t=>c.jsx(wC,{...t}),verify:t=>c.jsx(TC,{...t}),reports:t=>c.jsx(CC,{...t})},Bm="compsuite.draft.v1",jm=["auto","light","dark"],Xo={get:t=>{try{return localStorage.getItem(t)}catch{return null}},set:(t,e)=>{try{localStorage.setItem(t,e)}catch{}}};function bC(){var N;const[t,e]=ee.useState(null),[n,i]=ee.useState(null),[r,s]=ee.useState(null),[a,o]=ee.useState(""),[l,h]=ee.useState(!1),[u,f]=ee.useState(""),[p,g]=ee.useState("home"),[S,y]=ee.useState(null),[m,d]=ee.useState(0),[_,v]=ee.useState(!1),[M,R]=ee.useState(null),[A,C]=ee.useState(null),[P,B]=ee.useState(()=>Xo.get("centriforge.theme")??"auto");ee.useEffect(()=>{P==="auto"?document.documentElement.removeAttribute("data-theme"):document.documentElement.setAttribute("data-theme",P),Xo.set("centriforge.theme",P)},[P]);const x=ee.useCallback(F=>{i(F),Xo.set(Bm,JSON.stringify(F))},[]),E=ee.useCallback(async F=>{h(!0),f("");try{const V=await et.run(F,"full");s(V),o(JSON.stringify(F)),d(0)}catch(V){f(V.message)}finally{h(!1)}},[]);ee.useEffect(()=>{et.schema().then(e).catch(F=>f(`Engineering server not reachable: ${F.message}.`));try{const F=Xo.get(Bm);F&&C(JSON.parse(F))}catch{}},[]);const k=ee.useCallback(async(F,V=null,ne="project")=>{const he=await et.defaults();x({...he,...F}),y(V),s(null),o(""),d(0),g(ne)},[x]),O={newProject:()=>v(!0),openExample:async F=>{R(null),k(await et.example(F))},tutorial:async()=>{await k(await et.example("export_gas"),null,va[0].page),R(0)},openSaved:async F=>{const V=await et.getProject(F);k(V.project,F)},importFile:F=>k(F),resume:A?()=>k(A):null,resumeName:(A==null?void 0:A.name)??""},$=ee.useMemo(()=>!!r&&JSON.stringify(n)!==a,[n,r,a]),K={schema:t,project:n,setProject:x,results:r,casing:m,setCasing:d,run:E,running:l,savedId:S,setSavedId:y,setResults:(F,V)=>{s(F),o(JSON.stringify(V))}},j=Ts.find(F=>F.id===p),Y=F=>{var V;g(F),(V=document.querySelector("main"))==null||V.scrollTo(0,0)};return c.jsxs("div",{className:"shell",children:[c.jsxs("header",{className:"bar",children:[c.jsxs("button",{className:"brand",onClick:()=>Y("home"),"aria-label":"Launcher",children:[c.jsx("img",{src:"/favicon.svg",alt:"",width:"24",height:"24"}),c.jsxs("b",{children:["CENTRI",c.jsx("span",{children:"FORGE"})]})]}),c.jsxs("nav",{className:"tabs",children:[c.jsx("button",{className:p==="home"?"on":"",onClick:()=>Y("home"),children:"Launcher"}),c.jsx("button",{className:p!=="home"?"on":"",disabled:!n,title:n?"":"Start or open a project first",onClick:()=>Y(j?j.id:"project"),children:"Workspace"})]}),c.jsx("span",{className:"mono caps muted hide-sm",children:"Compressor engineering suite"}),c.jsx("span",{className:"spacer"}),l&&c.jsx("span",{className:"pill attention",children:"Running analysis…"}),c.jsxs("button",{className:"tab-btn",onClick:()=>B(jm[(jm.indexOf(P)+1)%3]),title:"Theme",children:["Theme · ",P]})]}),_&&c.jsx(by,{onClose:()=>v(!1),onCreate:F=>{v(!1),R(null),k(F)}}),M!==null&&p!=="home"&&c.jsx(Ry,{step:M,setStep:R,open:Y,run:()=>n&&E(n),running:l}),p==="home"||!n?c.jsxs("main",{className:"home",children:[u&&c.jsx("div",{className:"error",children:u}),c.jsx(Cy,{results:r,project:n,open:Y,running:l,actions:O})]}):c.jsxs("div",{className:"app",children:[c.jsx("nav",{className:"side","aria-label":"Workflow",children:Jh.map(F=>c.jsxs("div",{children:[c.jsxs("div",{className:"group mono caps",children:[c.jsx("i",{style:{background:F.color}}),F.label]}),Ts.filter(V=>V.group===F.id).map(V=>c.jsxs("button",{className:V.id===p?"active":"",onClick:()=>Y(V.id),children:[c.jsx("span",{className:"step mono",children:Ol(V.id)}),V.label]},V.id))]},F.id))}),c.jsxs("main",{children:[c.jsxs("header",{className:"top",children:[c.jsx("span",{className:"crumb mono caps",children:j&&`${Ol(j.id)} · ${j.label}`}),c.jsx("input",{className:"title","aria-label":"Project name",value:(n==null?void 0:n.name)??"",onChange:F=>n&&x({...n,name:F.target.value})}),c.jsxs("span",{className:"muted mono small",children:["rev ",(n==null?void 0:n.revision)??0,S?` · saved #${S}`:" · unsaved draft"]}),c.jsx("span",{className:"spacer"}),r&&((N=r.casings)==null?void 0:N.length)>1&&c.jsx("select",{className:"inp",value:m,onChange:F=>d(Number(F.target.value)),"aria-label":"Casing",children:r.casings.map((F,V)=>c.jsxs("option",{value:V,children:["Casing ",V+1]},V))}),$&&c.jsx("span",{className:"pill attention",children:"Inputs changed"}),c.jsx("button",{className:"btn primary",disabled:l||!n,onClick:()=>E(n),children:l?"Running analysis…":"Run analysis"})]}),c.jsxs("div",{className:"content",children:[u&&c.jsx("div",{className:"error",children:u}),n&&t&&j?AC[j.id](K):!u&&c.jsx("p",{className:"muted",children:"Loading…"})]})]})]})]})}ev(document.getElementById("root")).render(c.jsx(ee.StrictMode,{children:c.jsx(bC,{})}));
