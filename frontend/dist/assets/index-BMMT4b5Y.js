(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function n(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=n(r);fetch(r.href,s)}})();var $m={exports:{}},Yl={},qm={exports:{}},Ge={};/**
 * @license React
 * react.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Ya=Symbol.for("react.element"),Jv=Symbol.for("react.portal"),ex=Symbol.for("react.fragment"),tx=Symbol.for("react.strict_mode"),nx=Symbol.for("react.profiler"),ix=Symbol.for("react.provider"),rx=Symbol.for("react.context"),sx=Symbol.for("react.forward_ref"),ax=Symbol.for("react.suspense"),ox=Symbol.for("react.memo"),lx=Symbol.for("react.lazy"),Tf=Symbol.iterator;function cx(t){return t===null||typeof t!="object"?null:(t=Tf&&t[Tf]||t["@@iterator"],typeof t=="function"?t:null)}var Ym={isMounted:function(){return!1},enqueueForceUpdate:function(){},enqueueReplaceState:function(){},enqueueSetState:function(){}},Km=Object.assign,Zm={};function Hs(t,e,n){this.props=t,this.context=e,this.refs=Zm,this.updater=n||Ym}Hs.prototype.isReactComponent={};Hs.prototype.setState=function(t,e){if(typeof t!="object"&&typeof t!="function"&&t!=null)throw Error("setState(...): takes an object of state variables to update or a function which returns an object of state variables.");this.updater.enqueueSetState(this,t,e,"setState")};Hs.prototype.forceUpdate=function(t){this.updater.enqueueForceUpdate(this,t,"forceUpdate")};function Qm(){}Qm.prototype=Hs.prototype;function oh(t,e,n){this.props=t,this.context=e,this.refs=Zm,this.updater=n||Ym}var lh=oh.prototype=new Qm;lh.constructor=oh;Km(lh,Hs.prototype);lh.isPureReactComponent=!0;var Cf=Array.isArray,Jm=Object.prototype.hasOwnProperty,ch={current:null},eg={key:!0,ref:!0,__self:!0,__source:!0};function tg(t,e,n){var i,r={},s=null,a=null;if(e!=null)for(i in e.ref!==void 0&&(a=e.ref),e.key!==void 0&&(s=""+e.key),e)Jm.call(e,i)&&!eg.hasOwnProperty(i)&&(r[i]=e[i]);var o=arguments.length-2;if(o===1)r.children=n;else if(1<o){for(var c=Array(o),h=0;h<o;h++)c[h]=arguments[h+2];r.children=c}if(t&&t.defaultProps)for(i in o=t.defaultProps,o)r[i]===void 0&&(r[i]=o[i]);return{$$typeof:Ya,type:t,key:s,ref:a,props:r,_owner:ch.current}}function ux(t,e){return{$$typeof:Ya,type:t.type,key:e,ref:t.ref,props:t.props,_owner:t._owner}}function uh(t){return typeof t=="object"&&t!==null&&t.$$typeof===Ya}function dx(t){var e={"=":"=0",":":"=2"};return"$"+t.replace(/[=:]/g,function(n){return e[n]})}var bf=/\/+/g;function Sc(t,e){return typeof t=="object"&&t!==null&&t.key!=null?dx(""+t.key):e.toString(36)}function Yo(t,e,n,i,r){var s=typeof t;(s==="undefined"||s==="boolean")&&(t=null);var a=!1;if(t===null)a=!0;else switch(s){case"string":case"number":a=!0;break;case"object":switch(t.$$typeof){case Ya:case Jv:a=!0}}if(a)return a=t,r=r(a),t=i===""?"."+Sc(a,0):i,Cf(r)?(n="",t!=null&&(n=t.replace(bf,"$&/")+"/"),Yo(r,e,n,"",function(h){return h})):r!=null&&(uh(r)&&(r=ux(r,n+(!r.key||a&&a.key===r.key?"":(""+r.key).replace(bf,"$&/")+"/")+t)),e.push(r)),1;if(a=0,i=i===""?".":i+":",Cf(t))for(var o=0;o<t.length;o++){s=t[o];var c=i+Sc(s,o);a+=Yo(s,e,n,c,r)}else if(c=cx(t),typeof c=="function")for(t=c.call(t),o=0;!(s=t.next()).done;)s=s.value,c=i+Sc(s,o++),a+=Yo(s,e,n,c,r);else if(s==="object")throw e=String(t),Error("Objects are not valid as a React child (found: "+(e==="[object Object]"?"object with keys {"+Object.keys(t).join(", ")+"}":e)+"). If you meant to render a collection of children, use an array instead.");return a}function so(t,e,n){if(t==null)return t;var i=[],r=0;return Yo(t,i,"","",function(s){return e.call(n,s,r++)}),i}function hx(t){if(t._status===-1){var e=t._result;e=e(),e.then(function(n){(t._status===0||t._status===-1)&&(t._status=1,t._result=n)},function(n){(t._status===0||t._status===-1)&&(t._status=2,t._result=n)}),t._status===-1&&(t._status=0,t._result=e)}if(t._status===1)return t._result.default;throw t._result}var Jt={current:null},Ko={transition:null},fx={ReactCurrentDispatcher:Jt,ReactCurrentBatchConfig:Ko,ReactCurrentOwner:ch};function ng(){throw Error("act(...) is not supported in production builds of React.")}Ge.Children={map:so,forEach:function(t,e,n){so(t,function(){e.apply(this,arguments)},n)},count:function(t){var e=0;return so(t,function(){e++}),e},toArray:function(t){return so(t,function(e){return e})||[]},only:function(t){if(!uh(t))throw Error("React.Children.only expected to receive a single React element child.");return t}};Ge.Component=Hs;Ge.Fragment=ex;Ge.Profiler=nx;Ge.PureComponent=oh;Ge.StrictMode=tx;Ge.Suspense=ax;Ge.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=fx;Ge.act=ng;Ge.cloneElement=function(t,e,n){if(t==null)throw Error("React.cloneElement(...): The argument must be a React element, but you passed "+t+".");var i=Km({},t.props),r=t.key,s=t.ref,a=t._owner;if(e!=null){if(e.ref!==void 0&&(s=e.ref,a=ch.current),e.key!==void 0&&(r=""+e.key),t.type&&t.type.defaultProps)var o=t.type.defaultProps;for(c in e)Jm.call(e,c)&&!eg.hasOwnProperty(c)&&(i[c]=e[c]===void 0&&o!==void 0?o[c]:e[c])}var c=arguments.length-2;if(c===1)i.children=n;else if(1<c){o=Array(c);for(var h=0;h<c;h++)o[h]=arguments[h+2];i.children=o}return{$$typeof:Ya,type:t.type,key:r,ref:s,props:i,_owner:a}};Ge.createContext=function(t){return t={$$typeof:rx,_currentValue:t,_currentValue2:t,_threadCount:0,Provider:null,Consumer:null,_defaultValue:null,_globalName:null},t.Provider={$$typeof:ix,_context:t},t.Consumer=t};Ge.createElement=tg;Ge.createFactory=function(t){var e=tg.bind(null,t);return e.type=t,e};Ge.createRef=function(){return{current:null}};Ge.forwardRef=function(t){return{$$typeof:sx,render:t}};Ge.isValidElement=uh;Ge.lazy=function(t){return{$$typeof:lx,_payload:{_status:-1,_result:t},_init:hx}};Ge.memo=function(t,e){return{$$typeof:ox,type:t,compare:e===void 0?null:e}};Ge.startTransition=function(t){var e=Ko.transition;Ko.transition={};try{t()}finally{Ko.transition=e}};Ge.unstable_act=ng;Ge.useCallback=function(t,e){return Jt.current.useCallback(t,e)};Ge.useContext=function(t){return Jt.current.useContext(t)};Ge.useDebugValue=function(){};Ge.useDeferredValue=function(t){return Jt.current.useDeferredValue(t)};Ge.useEffect=function(t,e){return Jt.current.useEffect(t,e)};Ge.useId=function(){return Jt.current.useId()};Ge.useImperativeHandle=function(t,e,n){return Jt.current.useImperativeHandle(t,e,n)};Ge.useInsertionEffect=function(t,e){return Jt.current.useInsertionEffect(t,e)};Ge.useLayoutEffect=function(t,e){return Jt.current.useLayoutEffect(t,e)};Ge.useMemo=function(t,e){return Jt.current.useMemo(t,e)};Ge.useReducer=function(t,e,n){return Jt.current.useReducer(t,e,n)};Ge.useRef=function(t){return Jt.current.useRef(t)};Ge.useState=function(t){return Jt.current.useState(t)};Ge.useSyncExternalStore=function(t,e,n){return Jt.current.useSyncExternalStore(t,e,n)};Ge.useTransition=function(){return Jt.current.useTransition()};Ge.version="18.3.1";qm.exports=Ge;var ne=qm.exports;/**
 * @license React
 * react-jsx-runtime.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var px=ne,mx=Symbol.for("react.element"),gx=Symbol.for("react.fragment"),_x=Object.prototype.hasOwnProperty,vx=px.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,xx={key:!0,ref:!0,__self:!0,__source:!0};function ig(t,e,n){var i,r={},s=null,a=null;n!==void 0&&(s=""+n),e.key!==void 0&&(s=""+e.key),e.ref!==void 0&&(a=e.ref);for(i in e)_x.call(e,i)&&!xx.hasOwnProperty(i)&&(r[i]=e[i]);if(t&&t.defaultProps)for(i in e=t.defaultProps,e)r[i]===void 0&&(r[i]=e[i]);return{$$typeof:mx,type:t,key:s,ref:a,props:r,_owner:vx.current}}Yl.Fragment=gx;Yl.jsx=ig;Yl.jsxs=ig;$m.exports=Yl;var l=$m.exports,rg={exports:{}},Tn={},sg={exports:{}},ag={};/**
 * @license React
 * scheduler.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */(function(t){function e(L,O){var V=L.length;L.push(O);e:for(;0<V;){var se=V-1>>>1,fe=L[se];if(0<r(fe,O))L[se]=O,L[V]=fe,V=se;else break e}}function n(L){return L.length===0?null:L[0]}function i(L){if(L.length===0)return null;var O=L[0],V=L.pop();if(V!==O){L[0]=V;e:for(var se=0,fe=L.length,Le=fe>>>1;se<Le;){var $=2*(se+1)-1,re=L[$],ue=$+1,R=L[ue];if(0>r(re,V))ue<fe&&0>r(R,re)?(L[se]=R,L[ue]=V,se=ue):(L[se]=re,L[$]=V,se=$);else if(ue<fe&&0>r(R,V))L[se]=R,L[ue]=V,se=ue;else break e}}return O}function r(L,O){var V=L.sortIndex-O.sortIndex;return V!==0?V:L.id-O.id}if(typeof performance=="object"&&typeof performance.now=="function"){var s=performance;t.unstable_now=function(){return s.now()}}else{var a=Date,o=a.now();t.unstable_now=function(){return a.now()-o}}var c=[],h=[],u=1,f=null,p=3,m=!1,S=!1,x=!1,g=typeof setTimeout=="function"?setTimeout:null,d=typeof clearTimeout=="function"?clearTimeout:null,_=typeof setImmediate<"u"?setImmediate:null;typeof navigator<"u"&&navigator.scheduling!==void 0&&navigator.scheduling.isInputPending!==void 0&&navigator.scheduling.isInputPending.bind(navigator.scheduling);function y(L){for(var O=n(h);O!==null;){if(O.callback===null)i(h);else if(O.startTime<=L)i(h),O.sortIndex=O.expirationTime,e(c,O);else break;O=n(h)}}function E(L){if(x=!1,y(L),!S)if(n(c)!==null)S=!0,H(P);else{var O=n(h);O!==null&&Y(E,O.startTime-L)}}function P(L,O){S=!1,x&&(x=!1,d(N),N=-1),m=!0;var V=p;try{for(y(O),f=n(c);f!==null&&(!(f.expirationTime>O)||L&&!M());){var se=f.callback;if(typeof se=="function"){f.callback=null,p=f.priorityLevel;var fe=se(f.expirationTime<=O);O=t.unstable_now(),typeof fe=="function"?f.callback=fe:f===n(c)&&i(c),y(O)}else i(c);f=n(c)}if(f!==null)var Le=!0;else{var $=n(h);$!==null&&Y(E,$.startTime-O),Le=!1}return Le}finally{f=null,p=V,m=!1}}var b=!1,C=null,N=-1,z=5,v=-1;function M(){return!(t.unstable_now()-v<z)}function I(){if(C!==null){var L=t.unstable_now();v=L;var O=!0;try{O=C(!0,L)}finally{O?j():(b=!1,C=null)}}else b=!1}var j;if(typeof _=="function")j=function(){_(I)};else if(typeof MessageChannel<"u"){var q=new MessageChannel,Z=q.port2;q.port1.onmessage=I,j=function(){Z.postMessage(null)}}else j=function(){g(I,0)};function H(L){C=L,b||(b=!0,j())}function Y(L,O){N=g(function(){L(t.unstable_now())},O)}t.unstable_IdlePriority=5,t.unstable_ImmediatePriority=1,t.unstable_LowPriority=4,t.unstable_NormalPriority=3,t.unstable_Profiling=null,t.unstable_UserBlockingPriority=2,t.unstable_cancelCallback=function(L){L.callback=null},t.unstable_continueExecution=function(){S||m||(S=!0,H(P))},t.unstable_forceFrameRate=function(L){0>L||125<L?console.error("forceFrameRate takes a positive int between 0 and 125, forcing frame rates higher than 125 fps is not supported"):z=0<L?Math.floor(1e3/L):5},t.unstable_getCurrentPriorityLevel=function(){return p},t.unstable_getFirstCallbackNode=function(){return n(c)},t.unstable_next=function(L){switch(p){case 1:case 2:case 3:var O=3;break;default:O=p}var V=p;p=O;try{return L()}finally{p=V}},t.unstable_pauseExecution=function(){},t.unstable_requestPaint=function(){},t.unstable_runWithPriority=function(L,O){switch(L){case 1:case 2:case 3:case 4:case 5:break;default:L=3}var V=p;p=L;try{return O()}finally{p=V}},t.unstable_scheduleCallback=function(L,O,V){var se=t.unstable_now();switch(typeof V=="object"&&V!==null?(V=V.delay,V=typeof V=="number"&&0<V?se+V:se):V=se,L){case 1:var fe=-1;break;case 2:fe=250;break;case 5:fe=1073741823;break;case 4:fe=1e4;break;default:fe=5e3}return fe=V+fe,L={id:u++,callback:O,priorityLevel:L,startTime:V,expirationTime:fe,sortIndex:-1},V>se?(L.sortIndex=V,e(h,L),n(c)===null&&L===n(h)&&(x?(d(N),N=-1):x=!0,Y(E,V-se))):(L.sortIndex=fe,e(c,L),S||m||(S=!0,H(P))),L},t.unstable_shouldYield=M,t.unstable_wrapCallback=function(L){var O=p;return function(){var V=p;p=O;try{return L.apply(this,arguments)}finally{p=V}}}})(ag);sg.exports=ag;var yx=sg.exports;/**
 * @license React
 * react-dom.production.min.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */var Sx=ne,wn=yx;function oe(t){for(var e="https://reactjs.org/docs/error-decoder.html?invariant="+t,n=1;n<arguments.length;n++)e+="&args[]="+encodeURIComponent(arguments[n]);return"Minified React error #"+t+"; visit "+e+" for the full message or use the non-minified dev environment for full errors and additional helpful warnings."}var og=new Set,Na={};function Or(t,e){Rs(t,e),Rs(t+"Capture",e)}function Rs(t,e){for(Na[t]=e,t=0;t<e.length;t++)og.add(e[t])}var Mi=!(typeof window>"u"||typeof window.document>"u"||typeof window.document.createElement>"u"),Cu=Object.prototype.hasOwnProperty,Mx=/^[:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD][:A-Z_a-z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u02FF\u0370-\u037D\u037F-\u1FFF\u200C-\u200D\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD\-.0-9\u00B7\u0300-\u036F\u203F-\u2040]*$/,Af={},Rf={};function Ex(t){return Cu.call(Rf,t)?!0:Cu.call(Af,t)?!1:Mx.test(t)?Rf[t]=!0:(Af[t]=!0,!1)}function wx(t,e,n,i){if(n!==null&&n.type===0)return!1;switch(typeof e){case"function":case"symbol":return!0;case"boolean":return i?!1:n!==null?!n.acceptsBooleans:(t=t.toLowerCase().slice(0,5),t!=="data-"&&t!=="aria-");default:return!1}}function Tx(t,e,n,i){if(e===null||typeof e>"u"||wx(t,e,n,i))return!0;if(i)return!1;if(n!==null)switch(n.type){case 3:return!e;case 4:return e===!1;case 5:return isNaN(e);case 6:return isNaN(e)||1>e}return!1}function en(t,e,n,i,r,s,a){this.acceptsBooleans=e===2||e===3||e===4,this.attributeName=i,this.attributeNamespace=r,this.mustUseProperty=n,this.propertyName=t,this.type=e,this.sanitizeURL=s,this.removeEmptyString=a}var Ht={};"children dangerouslySetInnerHTML defaultValue defaultChecked innerHTML suppressContentEditableWarning suppressHydrationWarning style".split(" ").forEach(function(t){Ht[t]=new en(t,0,!1,t,null,!1,!1)});[["acceptCharset","accept-charset"],["className","class"],["htmlFor","for"],["httpEquiv","http-equiv"]].forEach(function(t){var e=t[0];Ht[e]=new en(e,1,!1,t[1],null,!1,!1)});["contentEditable","draggable","spellCheck","value"].forEach(function(t){Ht[t]=new en(t,2,!1,t.toLowerCase(),null,!1,!1)});["autoReverse","externalResourcesRequired","focusable","preserveAlpha"].forEach(function(t){Ht[t]=new en(t,2,!1,t,null,!1,!1)});"allowFullScreen async autoFocus autoPlay controls default defer disabled disablePictureInPicture disableRemotePlayback formNoValidate hidden loop noModule noValidate open playsInline readOnly required reversed scoped seamless itemScope".split(" ").forEach(function(t){Ht[t]=new en(t,3,!1,t.toLowerCase(),null,!1,!1)});["checked","multiple","muted","selected"].forEach(function(t){Ht[t]=new en(t,3,!0,t,null,!1,!1)});["capture","download"].forEach(function(t){Ht[t]=new en(t,4,!1,t,null,!1,!1)});["cols","rows","size","span"].forEach(function(t){Ht[t]=new en(t,6,!1,t,null,!1,!1)});["rowSpan","start"].forEach(function(t){Ht[t]=new en(t,5,!1,t.toLowerCase(),null,!1,!1)});var dh=/[\-:]([a-z])/g;function hh(t){return t[1].toUpperCase()}"accent-height alignment-baseline arabic-form baseline-shift cap-height clip-path clip-rule color-interpolation color-interpolation-filters color-profile color-rendering dominant-baseline enable-background fill-opacity fill-rule flood-color flood-opacity font-family font-size font-size-adjust font-stretch font-style font-variant font-weight glyph-name glyph-orientation-horizontal glyph-orientation-vertical horiz-adv-x horiz-origin-x image-rendering letter-spacing lighting-color marker-end marker-mid marker-start overline-position overline-thickness paint-order panose-1 pointer-events rendering-intent shape-rendering stop-color stop-opacity strikethrough-position strikethrough-thickness stroke-dasharray stroke-dashoffset stroke-linecap stroke-linejoin stroke-miterlimit stroke-opacity stroke-width text-anchor text-decoration text-rendering underline-position underline-thickness unicode-bidi unicode-range units-per-em v-alphabetic v-hanging v-ideographic v-mathematical vector-effect vert-adv-y vert-origin-x vert-origin-y word-spacing writing-mode xmlns:xlink x-height".split(" ").forEach(function(t){var e=t.replace(dh,hh);Ht[e]=new en(e,1,!1,t,null,!1,!1)});"xlink:actuate xlink:arcrole xlink:role xlink:show xlink:title xlink:type".split(" ").forEach(function(t){var e=t.replace(dh,hh);Ht[e]=new en(e,1,!1,t,"http://www.w3.org/1999/xlink",!1,!1)});["xml:base","xml:lang","xml:space"].forEach(function(t){var e=t.replace(dh,hh);Ht[e]=new en(e,1,!1,t,"http://www.w3.org/XML/1998/namespace",!1,!1)});["tabIndex","crossOrigin"].forEach(function(t){Ht[t]=new en(t,1,!1,t.toLowerCase(),null,!1,!1)});Ht.xlinkHref=new en("xlinkHref",1,!1,"xlink:href","http://www.w3.org/1999/xlink",!0,!1);["src","href","action","formAction"].forEach(function(t){Ht[t]=new en(t,1,!1,t.toLowerCase(),null,!0,!0)});function fh(t,e,n,i){var r=Ht.hasOwnProperty(e)?Ht[e]:null;(r!==null?r.type!==0:i||!(2<e.length)||e[0]!=="o"&&e[0]!=="O"||e[1]!=="n"&&e[1]!=="N")&&(Tx(e,n,r,i)&&(n=null),i||r===null?Ex(e)&&(n===null?t.removeAttribute(e):t.setAttribute(e,""+n)):r.mustUseProperty?t[r.propertyName]=n===null?r.type===3?!1:"":n:(e=r.attributeName,i=r.attributeNamespace,n===null?t.removeAttribute(e):(r=r.type,n=r===3||r===4&&n===!0?"":""+n,i?t.setAttributeNS(i,e,n):t.setAttribute(e,n))))}var bi=Sx.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED,ao=Symbol.for("react.element"),rs=Symbol.for("react.portal"),ss=Symbol.for("react.fragment"),ph=Symbol.for("react.strict_mode"),bu=Symbol.for("react.profiler"),lg=Symbol.for("react.provider"),cg=Symbol.for("react.context"),mh=Symbol.for("react.forward_ref"),Au=Symbol.for("react.suspense"),Ru=Symbol.for("react.suspense_list"),gh=Symbol.for("react.memo"),Oi=Symbol.for("react.lazy"),ug=Symbol.for("react.offscreen"),Pf=Symbol.iterator;function Ys(t){return t===null||typeof t!="object"?null:(t=Pf&&t[Pf]||t["@@iterator"],typeof t=="function"?t:null)}var vt=Object.assign,Mc;function ma(t){if(Mc===void 0)try{throw Error()}catch(n){var e=n.stack.trim().match(/\n( *(at )?)/);Mc=e&&e[1]||""}return`
`+Mc+t}var Ec=!1;function wc(t,e){if(!t||Ec)return"";Ec=!0;var n=Error.prepareStackTrace;Error.prepareStackTrace=void 0;try{if(e)if(e=function(){throw Error()},Object.defineProperty(e.prototype,"props",{set:function(){throw Error()}}),typeof Reflect=="object"&&Reflect.construct){try{Reflect.construct(e,[])}catch(h){var i=h}Reflect.construct(t,[],e)}else{try{e.call()}catch(h){i=h}t.call(e.prototype)}else{try{throw Error()}catch(h){i=h}t()}}catch(h){if(h&&i&&typeof h.stack=="string"){for(var r=h.stack.split(`
`),s=i.stack.split(`
`),a=r.length-1,o=s.length-1;1<=a&&0<=o&&r[a]!==s[o];)o--;for(;1<=a&&0<=o;a--,o--)if(r[a]!==s[o]){if(a!==1||o!==1)do if(a--,o--,0>o||r[a]!==s[o]){var c=`
`+r[a].replace(" at new "," at ");return t.displayName&&c.includes("<anonymous>")&&(c=c.replace("<anonymous>",t.displayName)),c}while(1<=a&&0<=o);break}}}finally{Ec=!1,Error.prepareStackTrace=n}return(t=t?t.displayName||t.name:"")?ma(t):""}function Cx(t){switch(t.tag){case 5:return ma(t.type);case 16:return ma("Lazy");case 13:return ma("Suspense");case 19:return ma("SuspenseList");case 0:case 2:case 15:return t=wc(t.type,!1),t;case 11:return t=wc(t.type.render,!1),t;case 1:return t=wc(t.type,!0),t;default:return""}}function Pu(t){if(t==null)return null;if(typeof t=="function")return t.displayName||t.name||null;if(typeof t=="string")return t;switch(t){case ss:return"Fragment";case rs:return"Portal";case bu:return"Profiler";case ph:return"StrictMode";case Au:return"Suspense";case Ru:return"SuspenseList"}if(typeof t=="object")switch(t.$$typeof){case cg:return(t.displayName||"Context")+".Consumer";case lg:return(t._context.displayName||"Context")+".Provider";case mh:var e=t.render;return t=t.displayName,t||(t=e.displayName||e.name||"",t=t!==""?"ForwardRef("+t+")":"ForwardRef"),t;case gh:return e=t.displayName||null,e!==null?e:Pu(t.type)||"Memo";case Oi:e=t._payload,t=t._init;try{return Pu(t(e))}catch{}}return null}function bx(t){var e=t.type;switch(t.tag){case 24:return"Cache";case 9:return(e.displayName||"Context")+".Consumer";case 10:return(e._context.displayName||"Context")+".Provider";case 18:return"DehydratedFragment";case 11:return t=e.render,t=t.displayName||t.name||"",e.displayName||(t!==""?"ForwardRef("+t+")":"ForwardRef");case 7:return"Fragment";case 5:return e;case 4:return"Portal";case 3:return"Root";case 6:return"Text";case 16:return Pu(e);case 8:return e===ph?"StrictMode":"Mode";case 22:return"Offscreen";case 12:return"Profiler";case 21:return"Scope";case 13:return"Suspense";case 19:return"SuspenseList";case 25:return"TracingMarker";case 1:case 0:case 17:case 2:case 14:case 15:if(typeof e=="function")return e.displayName||e.name||null;if(typeof e=="string")return e}return null}function ir(t){switch(typeof t){case"boolean":case"number":case"string":case"undefined":return t;case"object":return t;default:return""}}function dg(t){var e=t.type;return(t=t.nodeName)&&t.toLowerCase()==="input"&&(e==="checkbox"||e==="radio")}function Ax(t){var e=dg(t)?"checked":"value",n=Object.getOwnPropertyDescriptor(t.constructor.prototype,e),i=""+t[e];if(!t.hasOwnProperty(e)&&typeof n<"u"&&typeof n.get=="function"&&typeof n.set=="function"){var r=n.get,s=n.set;return Object.defineProperty(t,e,{configurable:!0,get:function(){return r.call(this)},set:function(a){i=""+a,s.call(this,a)}}),Object.defineProperty(t,e,{enumerable:n.enumerable}),{getValue:function(){return i},setValue:function(a){i=""+a},stopTracking:function(){t._valueTracker=null,delete t[e]}}}}function oo(t){t._valueTracker||(t._valueTracker=Ax(t))}function hg(t){if(!t)return!1;var e=t._valueTracker;if(!e)return!0;var n=e.getValue(),i="";return t&&(i=dg(t)?t.checked?"true":"false":t.value),t=i,t!==n?(e.setValue(t),!0):!1}function gl(t){if(t=t||(typeof document<"u"?document:void 0),typeof t>"u")return null;try{return t.activeElement||t.body}catch{return t.body}}function Nu(t,e){var n=e.checked;return vt({},e,{defaultChecked:void 0,defaultValue:void 0,value:void 0,checked:n??t._wrapperState.initialChecked})}function Nf(t,e){var n=e.defaultValue==null?"":e.defaultValue,i=e.checked!=null?e.checked:e.defaultChecked;n=ir(e.value!=null?e.value:n),t._wrapperState={initialChecked:i,initialValue:n,controlled:e.type==="checkbox"||e.type==="radio"?e.checked!=null:e.value!=null}}function fg(t,e){e=e.checked,e!=null&&fh(t,"checked",e,!1)}function Lu(t,e){fg(t,e);var n=ir(e.value),i=e.type;if(n!=null)i==="number"?(n===0&&t.value===""||t.value!=n)&&(t.value=""+n):t.value!==""+n&&(t.value=""+n);else if(i==="submit"||i==="reset"){t.removeAttribute("value");return}e.hasOwnProperty("value")?Du(t,e.type,n):e.hasOwnProperty("defaultValue")&&Du(t,e.type,ir(e.defaultValue)),e.checked==null&&e.defaultChecked!=null&&(t.defaultChecked=!!e.defaultChecked)}function Lf(t,e,n){if(e.hasOwnProperty("value")||e.hasOwnProperty("defaultValue")){var i=e.type;if(!(i!=="submit"&&i!=="reset"||e.value!==void 0&&e.value!==null))return;e=""+t._wrapperState.initialValue,n||e===t.value||(t.value=e),t.defaultValue=e}n=t.name,n!==""&&(t.name=""),t.defaultChecked=!!t._wrapperState.initialChecked,n!==""&&(t.name=n)}function Du(t,e,n){(e!=="number"||gl(t.ownerDocument)!==t)&&(n==null?t.defaultValue=""+t._wrapperState.initialValue:t.defaultValue!==""+n&&(t.defaultValue=""+n))}var ga=Array.isArray;function vs(t,e,n,i){if(t=t.options,e){e={};for(var r=0;r<n.length;r++)e["$"+n[r]]=!0;for(n=0;n<t.length;n++)r=e.hasOwnProperty("$"+t[n].value),t[n].selected!==r&&(t[n].selected=r),r&&i&&(t[n].defaultSelected=!0)}else{for(n=""+ir(n),e=null,r=0;r<t.length;r++){if(t[r].value===n){t[r].selected=!0,i&&(t[r].defaultSelected=!0);return}e!==null||t[r].disabled||(e=t[r])}e!==null&&(e.selected=!0)}}function Iu(t,e){if(e.dangerouslySetInnerHTML!=null)throw Error(oe(91));return vt({},e,{value:void 0,defaultValue:void 0,children:""+t._wrapperState.initialValue})}function Df(t,e){var n=e.value;if(n==null){if(n=e.children,e=e.defaultValue,n!=null){if(e!=null)throw Error(oe(92));if(ga(n)){if(1<n.length)throw Error(oe(93));n=n[0]}e=n}e==null&&(e=""),n=e}t._wrapperState={initialValue:ir(n)}}function pg(t,e){var n=ir(e.value),i=ir(e.defaultValue);n!=null&&(n=""+n,n!==t.value&&(t.value=n),e.defaultValue==null&&t.defaultValue!==n&&(t.defaultValue=n)),i!=null&&(t.defaultValue=""+i)}function If(t){var e=t.textContent;e===t._wrapperState.initialValue&&e!==""&&e!==null&&(t.value=e)}function mg(t){switch(t){case"svg":return"http://www.w3.org/2000/svg";case"math":return"http://www.w3.org/1998/Math/MathML";default:return"http://www.w3.org/1999/xhtml"}}function Uu(t,e){return t==null||t==="http://www.w3.org/1999/xhtml"?mg(e):t==="http://www.w3.org/2000/svg"&&e==="foreignObject"?"http://www.w3.org/1999/xhtml":t}var lo,gg=function(t){return typeof MSApp<"u"&&MSApp.execUnsafeLocalFunction?function(e,n,i,r){MSApp.execUnsafeLocalFunction(function(){return t(e,n,i,r)})}:t}(function(t,e){if(t.namespaceURI!=="http://www.w3.org/2000/svg"||"innerHTML"in t)t.innerHTML=e;else{for(lo=lo||document.createElement("div"),lo.innerHTML="<svg>"+e.valueOf().toString()+"</svg>",e=lo.firstChild;t.firstChild;)t.removeChild(t.firstChild);for(;e.firstChild;)t.appendChild(e.firstChild)}});function La(t,e){if(e){var n=t.firstChild;if(n&&n===t.lastChild&&n.nodeType===3){n.nodeValue=e;return}}t.textContent=e}var Ma={animationIterationCount:!0,aspectRatio:!0,borderImageOutset:!0,borderImageSlice:!0,borderImageWidth:!0,boxFlex:!0,boxFlexGroup:!0,boxOrdinalGroup:!0,columnCount:!0,columns:!0,flex:!0,flexGrow:!0,flexPositive:!0,flexShrink:!0,flexNegative:!0,flexOrder:!0,gridArea:!0,gridRow:!0,gridRowEnd:!0,gridRowSpan:!0,gridRowStart:!0,gridColumn:!0,gridColumnEnd:!0,gridColumnSpan:!0,gridColumnStart:!0,fontWeight:!0,lineClamp:!0,lineHeight:!0,opacity:!0,order:!0,orphans:!0,tabSize:!0,widows:!0,zIndex:!0,zoom:!0,fillOpacity:!0,floodOpacity:!0,stopOpacity:!0,strokeDasharray:!0,strokeDashoffset:!0,strokeMiterlimit:!0,strokeOpacity:!0,strokeWidth:!0},Rx=["Webkit","ms","Moz","O"];Object.keys(Ma).forEach(function(t){Rx.forEach(function(e){e=e+t.charAt(0).toUpperCase()+t.substring(1),Ma[e]=Ma[t]})});function _g(t,e,n){return e==null||typeof e=="boolean"||e===""?"":n||typeof e!="number"||e===0||Ma.hasOwnProperty(t)&&Ma[t]?(""+e).trim():e+"px"}function vg(t,e){t=t.style;for(var n in e)if(e.hasOwnProperty(n)){var i=n.indexOf("--")===0,r=_g(n,e[n],i);n==="float"&&(n="cssFloat"),i?t.setProperty(n,r):t[n]=r}}var Px=vt({menuitem:!0},{area:!0,base:!0,br:!0,col:!0,embed:!0,hr:!0,img:!0,input:!0,keygen:!0,link:!0,meta:!0,param:!0,source:!0,track:!0,wbr:!0});function Fu(t,e){if(e){if(Px[t]&&(e.children!=null||e.dangerouslySetInnerHTML!=null))throw Error(oe(137,t));if(e.dangerouslySetInnerHTML!=null){if(e.children!=null)throw Error(oe(60));if(typeof e.dangerouslySetInnerHTML!="object"||!("__html"in e.dangerouslySetInnerHTML))throw Error(oe(61))}if(e.style!=null&&typeof e.style!="object")throw Error(oe(62))}}function ku(t,e){if(t.indexOf("-")===-1)return typeof e.is=="string";switch(t){case"annotation-xml":case"color-profile":case"font-face":case"font-face-src":case"font-face-uri":case"font-face-format":case"font-face-name":case"missing-glyph":return!1;default:return!0}}var Ou=null;function _h(t){return t=t.target||t.srcElement||window,t.correspondingUseElement&&(t=t.correspondingUseElement),t.nodeType===3?t.parentNode:t}var ju=null,xs=null,ys=null;function Uf(t){if(t=Qa(t)){if(typeof ju!="function")throw Error(oe(280));var e=t.stateNode;e&&(e=ec(e),ju(t.stateNode,t.type,e))}}function xg(t){xs?ys?ys.push(t):ys=[t]:xs=t}function yg(){if(xs){var t=xs,e=ys;if(ys=xs=null,Uf(t),e)for(t=0;t<e.length;t++)Uf(e[t])}}function Sg(t,e){return t(e)}function Mg(){}var Tc=!1;function Eg(t,e,n){if(Tc)return t(e,n);Tc=!0;try{return Sg(t,e,n)}finally{Tc=!1,(xs!==null||ys!==null)&&(Mg(),yg())}}function Da(t,e){var n=t.stateNode;if(n===null)return null;var i=ec(n);if(i===null)return null;n=i[e];e:switch(e){case"onClick":case"onClickCapture":case"onDoubleClick":case"onDoubleClickCapture":case"onMouseDown":case"onMouseDownCapture":case"onMouseMove":case"onMouseMoveCapture":case"onMouseUp":case"onMouseUpCapture":case"onMouseEnter":(i=!i.disabled)||(t=t.type,i=!(t==="button"||t==="input"||t==="select"||t==="textarea")),t=!i;break e;default:t=!1}if(t)return null;if(n&&typeof n!="function")throw Error(oe(231,e,typeof n));return n}var zu=!1;if(Mi)try{var Ks={};Object.defineProperty(Ks,"passive",{get:function(){zu=!0}}),window.addEventListener("test",Ks,Ks),window.removeEventListener("test",Ks,Ks)}catch{zu=!1}function Nx(t,e,n,i,r,s,a,o,c){var h=Array.prototype.slice.call(arguments,3);try{e.apply(n,h)}catch(u){this.onError(u)}}var Ea=!1,_l=null,vl=!1,Bu=null,Lx={onError:function(t){Ea=!0,_l=t}};function Dx(t,e,n,i,r,s,a,o,c){Ea=!1,_l=null,Nx.apply(Lx,arguments)}function Ix(t,e,n,i,r,s,a,o,c){if(Dx.apply(this,arguments),Ea){if(Ea){var h=_l;Ea=!1,_l=null}else throw Error(oe(198));vl||(vl=!0,Bu=h)}}function jr(t){var e=t,n=t;if(t.alternate)for(;e.return;)e=e.return;else{t=e;do e=t,e.flags&4098&&(n=e.return),t=e.return;while(t)}return e.tag===3?n:null}function wg(t){if(t.tag===13){var e=t.memoizedState;if(e===null&&(t=t.alternate,t!==null&&(e=t.memoizedState)),e!==null)return e.dehydrated}return null}function Ff(t){if(jr(t)!==t)throw Error(oe(188))}function Ux(t){var e=t.alternate;if(!e){if(e=jr(t),e===null)throw Error(oe(188));return e!==t?null:t}for(var n=t,i=e;;){var r=n.return;if(r===null)break;var s=r.alternate;if(s===null){if(i=r.return,i!==null){n=i;continue}break}if(r.child===s.child){for(s=r.child;s;){if(s===n)return Ff(r),t;if(s===i)return Ff(r),e;s=s.sibling}throw Error(oe(188))}if(n.return!==i.return)n=r,i=s;else{for(var a=!1,o=r.child;o;){if(o===n){a=!0,n=r,i=s;break}if(o===i){a=!0,i=r,n=s;break}o=o.sibling}if(!a){for(o=s.child;o;){if(o===n){a=!0,n=s,i=r;break}if(o===i){a=!0,i=s,n=r;break}o=o.sibling}if(!a)throw Error(oe(189))}}if(n.alternate!==i)throw Error(oe(190))}if(n.tag!==3)throw Error(oe(188));return n.stateNode.current===n?t:e}function Tg(t){return t=Ux(t),t!==null?Cg(t):null}function Cg(t){if(t.tag===5||t.tag===6)return t;for(t=t.child;t!==null;){var e=Cg(t);if(e!==null)return e;t=t.sibling}return null}var bg=wn.unstable_scheduleCallback,kf=wn.unstable_cancelCallback,Fx=wn.unstable_shouldYield,kx=wn.unstable_requestPaint,Et=wn.unstable_now,Ox=wn.unstable_getCurrentPriorityLevel,vh=wn.unstable_ImmediatePriority,Ag=wn.unstable_UserBlockingPriority,xl=wn.unstable_NormalPriority,jx=wn.unstable_LowPriority,Rg=wn.unstable_IdlePriority,Kl=null,ri=null;function zx(t){if(ri&&typeof ri.onCommitFiberRoot=="function")try{ri.onCommitFiberRoot(Kl,t,void 0,(t.current.flags&128)===128)}catch{}}var Kn=Math.clz32?Math.clz32:Vx,Bx=Math.log,Hx=Math.LN2;function Vx(t){return t>>>=0,t===0?32:31-(Bx(t)/Hx|0)|0}var co=64,uo=4194304;function _a(t){switch(t&-t){case 1:return 1;case 2:return 2;case 4:return 4;case 8:return 8;case 16:return 16;case 32:return 32;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return t&4194240;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return t&130023424;case 134217728:return 134217728;case 268435456:return 268435456;case 536870912:return 536870912;case 1073741824:return 1073741824;default:return t}}function yl(t,e){var n=t.pendingLanes;if(n===0)return 0;var i=0,r=t.suspendedLanes,s=t.pingedLanes,a=n&268435455;if(a!==0){var o=a&~r;o!==0?i=_a(o):(s&=a,s!==0&&(i=_a(s)))}else a=n&~r,a!==0?i=_a(a):s!==0&&(i=_a(s));if(i===0)return 0;if(e!==0&&e!==i&&!(e&r)&&(r=i&-i,s=e&-e,r>=s||r===16&&(s&4194240)!==0))return e;if(i&4&&(i|=n&16),e=t.entangledLanes,e!==0)for(t=t.entanglements,e&=i;0<e;)n=31-Kn(e),r=1<<n,i|=t[n],e&=~r;return i}function Gx(t,e){switch(t){case 1:case 2:case 4:return e+250;case 8:case 16:case 32:case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:return e+5e3;case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:return-1;case 134217728:case 268435456:case 536870912:case 1073741824:return-1;default:return-1}}function Wx(t,e){for(var n=t.suspendedLanes,i=t.pingedLanes,r=t.expirationTimes,s=t.pendingLanes;0<s;){var a=31-Kn(s),o=1<<a,c=r[a];c===-1?(!(o&n)||o&i)&&(r[a]=Gx(o,e)):c<=e&&(t.expiredLanes|=o),s&=~o}}function Hu(t){return t=t.pendingLanes&-1073741825,t!==0?t:t&1073741824?1073741824:0}function Pg(){var t=co;return co<<=1,!(co&4194240)&&(co=64),t}function Cc(t){for(var e=[],n=0;31>n;n++)e.push(t);return e}function Ka(t,e,n){t.pendingLanes|=e,e!==536870912&&(t.suspendedLanes=0,t.pingedLanes=0),t=t.eventTimes,e=31-Kn(e),t[e]=n}function Xx(t,e){var n=t.pendingLanes&~e;t.pendingLanes=e,t.suspendedLanes=0,t.pingedLanes=0,t.expiredLanes&=e,t.mutableReadLanes&=e,t.entangledLanes&=e,e=t.entanglements;var i=t.eventTimes;for(t=t.expirationTimes;0<n;){var r=31-Kn(n),s=1<<r;e[r]=0,i[r]=-1,t[r]=-1,n&=~s}}function xh(t,e){var n=t.entangledLanes|=e;for(t=t.entanglements;n;){var i=31-Kn(n),r=1<<i;r&e|t[i]&e&&(t[i]|=e),n&=~r}}var nt=0;function Ng(t){return t&=-t,1<t?4<t?t&268435455?16:536870912:4:1}var Lg,yh,Dg,Ig,Ug,Vu=!1,ho=[],$i=null,qi=null,Yi=null,Ia=new Map,Ua=new Map,Bi=[],$x="mousedown mouseup touchcancel touchend touchstart auxclick dblclick pointercancel pointerdown pointerup dragend dragstart drop compositionend compositionstart keydown keypress keyup input textInput copy cut paste click change contextmenu reset submit".split(" ");function Of(t,e){switch(t){case"focusin":case"focusout":$i=null;break;case"dragenter":case"dragleave":qi=null;break;case"mouseover":case"mouseout":Yi=null;break;case"pointerover":case"pointerout":Ia.delete(e.pointerId);break;case"gotpointercapture":case"lostpointercapture":Ua.delete(e.pointerId)}}function Zs(t,e,n,i,r,s){return t===null||t.nativeEvent!==s?(t={blockedOn:e,domEventName:n,eventSystemFlags:i,nativeEvent:s,targetContainers:[r]},e!==null&&(e=Qa(e),e!==null&&yh(e)),t):(t.eventSystemFlags|=i,e=t.targetContainers,r!==null&&e.indexOf(r)===-1&&e.push(r),t)}function qx(t,e,n,i,r){switch(e){case"focusin":return $i=Zs($i,t,e,n,i,r),!0;case"dragenter":return qi=Zs(qi,t,e,n,i,r),!0;case"mouseover":return Yi=Zs(Yi,t,e,n,i,r),!0;case"pointerover":var s=r.pointerId;return Ia.set(s,Zs(Ia.get(s)||null,t,e,n,i,r)),!0;case"gotpointercapture":return s=r.pointerId,Ua.set(s,Zs(Ua.get(s)||null,t,e,n,i,r)),!0}return!1}function Fg(t){var e=Er(t.target);if(e!==null){var n=jr(e);if(n!==null){if(e=n.tag,e===13){if(e=wg(n),e!==null){t.blockedOn=e,Ug(t.priority,function(){Dg(n)});return}}else if(e===3&&n.stateNode.current.memoizedState.isDehydrated){t.blockedOn=n.tag===3?n.stateNode.containerInfo:null;return}}}t.blockedOn=null}function Zo(t){if(t.blockedOn!==null)return!1;for(var e=t.targetContainers;0<e.length;){var n=Gu(t.domEventName,t.eventSystemFlags,e[0],t.nativeEvent);if(n===null){n=t.nativeEvent;var i=new n.constructor(n.type,n);Ou=i,n.target.dispatchEvent(i),Ou=null}else return e=Qa(n),e!==null&&yh(e),t.blockedOn=n,!1;e.shift()}return!0}function jf(t,e,n){Zo(t)&&n.delete(e)}function Yx(){Vu=!1,$i!==null&&Zo($i)&&($i=null),qi!==null&&Zo(qi)&&(qi=null),Yi!==null&&Zo(Yi)&&(Yi=null),Ia.forEach(jf),Ua.forEach(jf)}function Qs(t,e){t.blockedOn===e&&(t.blockedOn=null,Vu||(Vu=!0,wn.unstable_scheduleCallback(wn.unstable_NormalPriority,Yx)))}function Fa(t){function e(r){return Qs(r,t)}if(0<ho.length){Qs(ho[0],t);for(var n=1;n<ho.length;n++){var i=ho[n];i.blockedOn===t&&(i.blockedOn=null)}}for($i!==null&&Qs($i,t),qi!==null&&Qs(qi,t),Yi!==null&&Qs(Yi,t),Ia.forEach(e),Ua.forEach(e),n=0;n<Bi.length;n++)i=Bi[n],i.blockedOn===t&&(i.blockedOn=null);for(;0<Bi.length&&(n=Bi[0],n.blockedOn===null);)Fg(n),n.blockedOn===null&&Bi.shift()}var Ss=bi.ReactCurrentBatchConfig,Sl=!0;function Kx(t,e,n,i){var r=nt,s=Ss.transition;Ss.transition=null;try{nt=1,Sh(t,e,n,i)}finally{nt=r,Ss.transition=s}}function Zx(t,e,n,i){var r=nt,s=Ss.transition;Ss.transition=null;try{nt=4,Sh(t,e,n,i)}finally{nt=r,Ss.transition=s}}function Sh(t,e,n,i){if(Sl){var r=Gu(t,e,n,i);if(r===null)Fc(t,e,i,Ml,n),Of(t,i);else if(qx(r,t,e,n,i))i.stopPropagation();else if(Of(t,i),e&4&&-1<$x.indexOf(t)){for(;r!==null;){var s=Qa(r);if(s!==null&&Lg(s),s=Gu(t,e,n,i),s===null&&Fc(t,e,i,Ml,n),s===r)break;r=s}r!==null&&i.stopPropagation()}else Fc(t,e,i,null,n)}}var Ml=null;function Gu(t,e,n,i){if(Ml=null,t=_h(i),t=Er(t),t!==null)if(e=jr(t),e===null)t=null;else if(n=e.tag,n===13){if(t=wg(e),t!==null)return t;t=null}else if(n===3){if(e.stateNode.current.memoizedState.isDehydrated)return e.tag===3?e.stateNode.containerInfo:null;t=null}else e!==t&&(t=null);return Ml=t,null}function kg(t){switch(t){case"cancel":case"click":case"close":case"contextmenu":case"copy":case"cut":case"auxclick":case"dblclick":case"dragend":case"dragstart":case"drop":case"focusin":case"focusout":case"input":case"invalid":case"keydown":case"keypress":case"keyup":case"mousedown":case"mouseup":case"paste":case"pause":case"play":case"pointercancel":case"pointerdown":case"pointerup":case"ratechange":case"reset":case"resize":case"seeked":case"submit":case"touchcancel":case"touchend":case"touchstart":case"volumechange":case"change":case"selectionchange":case"textInput":case"compositionstart":case"compositionend":case"compositionupdate":case"beforeblur":case"afterblur":case"beforeinput":case"blur":case"fullscreenchange":case"focus":case"hashchange":case"popstate":case"select":case"selectstart":return 1;case"drag":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"mousemove":case"mouseout":case"mouseover":case"pointermove":case"pointerout":case"pointerover":case"scroll":case"toggle":case"touchmove":case"wheel":case"mouseenter":case"mouseleave":case"pointerenter":case"pointerleave":return 4;case"message":switch(Ox()){case vh:return 1;case Ag:return 4;case xl:case jx:return 16;case Rg:return 536870912;default:return 16}default:return 16}}var Gi=null,Mh=null,Qo=null;function Og(){if(Qo)return Qo;var t,e=Mh,n=e.length,i,r="value"in Gi?Gi.value:Gi.textContent,s=r.length;for(t=0;t<n&&e[t]===r[t];t++);var a=n-t;for(i=1;i<=a&&e[n-i]===r[s-i];i++);return Qo=r.slice(t,1<i?1-i:void 0)}function Jo(t){var e=t.keyCode;return"charCode"in t?(t=t.charCode,t===0&&e===13&&(t=13)):t=e,t===10&&(t=13),32<=t||t===13?t:0}function fo(){return!0}function zf(){return!1}function Cn(t){function e(n,i,r,s,a){this._reactName=n,this._targetInst=r,this.type=i,this.nativeEvent=s,this.target=a,this.currentTarget=null;for(var o in t)t.hasOwnProperty(o)&&(n=t[o],this[o]=n?n(s):s[o]);return this.isDefaultPrevented=(s.defaultPrevented!=null?s.defaultPrevented:s.returnValue===!1)?fo:zf,this.isPropagationStopped=zf,this}return vt(e.prototype,{preventDefault:function(){this.defaultPrevented=!0;var n=this.nativeEvent;n&&(n.preventDefault?n.preventDefault():typeof n.returnValue!="unknown"&&(n.returnValue=!1),this.isDefaultPrevented=fo)},stopPropagation:function(){var n=this.nativeEvent;n&&(n.stopPropagation?n.stopPropagation():typeof n.cancelBubble!="unknown"&&(n.cancelBubble=!0),this.isPropagationStopped=fo)},persist:function(){},isPersistent:fo}),e}var Vs={eventPhase:0,bubbles:0,cancelable:0,timeStamp:function(t){return t.timeStamp||Date.now()},defaultPrevented:0,isTrusted:0},Eh=Cn(Vs),Za=vt({},Vs,{view:0,detail:0}),Qx=Cn(Za),bc,Ac,Js,Zl=vt({},Za,{screenX:0,screenY:0,clientX:0,clientY:0,pageX:0,pageY:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,getModifierState:wh,button:0,buttons:0,relatedTarget:function(t){return t.relatedTarget===void 0?t.fromElement===t.srcElement?t.toElement:t.fromElement:t.relatedTarget},movementX:function(t){return"movementX"in t?t.movementX:(t!==Js&&(Js&&t.type==="mousemove"?(bc=t.screenX-Js.screenX,Ac=t.screenY-Js.screenY):Ac=bc=0,Js=t),bc)},movementY:function(t){return"movementY"in t?t.movementY:Ac}}),Bf=Cn(Zl),Jx=vt({},Zl,{dataTransfer:0}),e0=Cn(Jx),t0=vt({},Za,{relatedTarget:0}),Rc=Cn(t0),n0=vt({},Vs,{animationName:0,elapsedTime:0,pseudoElement:0}),i0=Cn(n0),r0=vt({},Vs,{clipboardData:function(t){return"clipboardData"in t?t.clipboardData:window.clipboardData}}),s0=Cn(r0),a0=vt({},Vs,{data:0}),Hf=Cn(a0),o0={Esc:"Escape",Spacebar:" ",Left:"ArrowLeft",Up:"ArrowUp",Right:"ArrowRight",Down:"ArrowDown",Del:"Delete",Win:"OS",Menu:"ContextMenu",Apps:"ContextMenu",Scroll:"ScrollLock",MozPrintableKey:"Unidentified"},l0={8:"Backspace",9:"Tab",12:"Clear",13:"Enter",16:"Shift",17:"Control",18:"Alt",19:"Pause",20:"CapsLock",27:"Escape",32:" ",33:"PageUp",34:"PageDown",35:"End",36:"Home",37:"ArrowLeft",38:"ArrowUp",39:"ArrowRight",40:"ArrowDown",45:"Insert",46:"Delete",112:"F1",113:"F2",114:"F3",115:"F4",116:"F5",117:"F6",118:"F7",119:"F8",120:"F9",121:"F10",122:"F11",123:"F12",144:"NumLock",145:"ScrollLock",224:"Meta"},c0={Alt:"altKey",Control:"ctrlKey",Meta:"metaKey",Shift:"shiftKey"};function u0(t){var e=this.nativeEvent;return e.getModifierState?e.getModifierState(t):(t=c0[t])?!!e[t]:!1}function wh(){return u0}var d0=vt({},Za,{key:function(t){if(t.key){var e=o0[t.key]||t.key;if(e!=="Unidentified")return e}return t.type==="keypress"?(t=Jo(t),t===13?"Enter":String.fromCharCode(t)):t.type==="keydown"||t.type==="keyup"?l0[t.keyCode]||"Unidentified":""},code:0,location:0,ctrlKey:0,shiftKey:0,altKey:0,metaKey:0,repeat:0,locale:0,getModifierState:wh,charCode:function(t){return t.type==="keypress"?Jo(t):0},keyCode:function(t){return t.type==="keydown"||t.type==="keyup"?t.keyCode:0},which:function(t){return t.type==="keypress"?Jo(t):t.type==="keydown"||t.type==="keyup"?t.keyCode:0}}),h0=Cn(d0),f0=vt({},Zl,{pointerId:0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,pointerType:0,isPrimary:0}),Vf=Cn(f0),p0=vt({},Za,{touches:0,targetTouches:0,changedTouches:0,altKey:0,metaKey:0,ctrlKey:0,shiftKey:0,getModifierState:wh}),m0=Cn(p0),g0=vt({},Vs,{propertyName:0,elapsedTime:0,pseudoElement:0}),_0=Cn(g0),v0=vt({},Zl,{deltaX:function(t){return"deltaX"in t?t.deltaX:"wheelDeltaX"in t?-t.wheelDeltaX:0},deltaY:function(t){return"deltaY"in t?t.deltaY:"wheelDeltaY"in t?-t.wheelDeltaY:"wheelDelta"in t?-t.wheelDelta:0},deltaZ:0,deltaMode:0}),x0=Cn(v0),y0=[9,13,27,32],Th=Mi&&"CompositionEvent"in window,wa=null;Mi&&"documentMode"in document&&(wa=document.documentMode);var S0=Mi&&"TextEvent"in window&&!wa,jg=Mi&&(!Th||wa&&8<wa&&11>=wa),Gf=" ",Wf=!1;function zg(t,e){switch(t){case"keyup":return y0.indexOf(e.keyCode)!==-1;case"keydown":return e.keyCode!==229;case"keypress":case"mousedown":case"focusout":return!0;default:return!1}}function Bg(t){return t=t.detail,typeof t=="object"&&"data"in t?t.data:null}var as=!1;function M0(t,e){switch(t){case"compositionend":return Bg(e);case"keypress":return e.which!==32?null:(Wf=!0,Gf);case"textInput":return t=e.data,t===Gf&&Wf?null:t;default:return null}}function E0(t,e){if(as)return t==="compositionend"||!Th&&zg(t,e)?(t=Og(),Qo=Mh=Gi=null,as=!1,t):null;switch(t){case"paste":return null;case"keypress":if(!(e.ctrlKey||e.altKey||e.metaKey)||e.ctrlKey&&e.altKey){if(e.char&&1<e.char.length)return e.char;if(e.which)return String.fromCharCode(e.which)}return null;case"compositionend":return jg&&e.locale!=="ko"?null:e.data;default:return null}}var w0={color:!0,date:!0,datetime:!0,"datetime-local":!0,email:!0,month:!0,number:!0,password:!0,range:!0,search:!0,tel:!0,text:!0,time:!0,url:!0,week:!0};function Xf(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e==="input"?!!w0[t.type]:e==="textarea"}function Hg(t,e,n,i){xg(i),e=El(e,"onChange"),0<e.length&&(n=new Eh("onChange","change",null,n,i),t.push({event:n,listeners:e}))}var Ta=null,ka=null;function T0(t){Jg(t,0)}function Ql(t){var e=cs(t);if(hg(e))return t}function C0(t,e){if(t==="change")return e}var Vg=!1;if(Mi){var Pc;if(Mi){var Nc="oninput"in document;if(!Nc){var $f=document.createElement("div");$f.setAttribute("oninput","return;"),Nc=typeof $f.oninput=="function"}Pc=Nc}else Pc=!1;Vg=Pc&&(!document.documentMode||9<document.documentMode)}function qf(){Ta&&(Ta.detachEvent("onpropertychange",Gg),ka=Ta=null)}function Gg(t){if(t.propertyName==="value"&&Ql(ka)){var e=[];Hg(e,ka,t,_h(t)),Eg(T0,e)}}function b0(t,e,n){t==="focusin"?(qf(),Ta=e,ka=n,Ta.attachEvent("onpropertychange",Gg)):t==="focusout"&&qf()}function A0(t){if(t==="selectionchange"||t==="keyup"||t==="keydown")return Ql(ka)}function R0(t,e){if(t==="click")return Ql(e)}function P0(t,e){if(t==="input"||t==="change")return Ql(e)}function N0(t,e){return t===e&&(t!==0||1/t===1/e)||t!==t&&e!==e}var Qn=typeof Object.is=="function"?Object.is:N0;function Oa(t,e){if(Qn(t,e))return!0;if(typeof t!="object"||t===null||typeof e!="object"||e===null)return!1;var n=Object.keys(t),i=Object.keys(e);if(n.length!==i.length)return!1;for(i=0;i<n.length;i++){var r=n[i];if(!Cu.call(e,r)||!Qn(t[r],e[r]))return!1}return!0}function Yf(t){for(;t&&t.firstChild;)t=t.firstChild;return t}function Kf(t,e){var n=Yf(t);t=0;for(var i;n;){if(n.nodeType===3){if(i=t+n.textContent.length,t<=e&&i>=e)return{node:n,offset:e-t};t=i}e:{for(;n;){if(n.nextSibling){n=n.nextSibling;break e}n=n.parentNode}n=void 0}n=Yf(n)}}function Wg(t,e){return t&&e?t===e?!0:t&&t.nodeType===3?!1:e&&e.nodeType===3?Wg(t,e.parentNode):"contains"in t?t.contains(e):t.compareDocumentPosition?!!(t.compareDocumentPosition(e)&16):!1:!1}function Xg(){for(var t=window,e=gl();e instanceof t.HTMLIFrameElement;){try{var n=typeof e.contentWindow.location.href=="string"}catch{n=!1}if(n)t=e.contentWindow;else break;e=gl(t.document)}return e}function Ch(t){var e=t&&t.nodeName&&t.nodeName.toLowerCase();return e&&(e==="input"&&(t.type==="text"||t.type==="search"||t.type==="tel"||t.type==="url"||t.type==="password")||e==="textarea"||t.contentEditable==="true")}function L0(t){var e=Xg(),n=t.focusedElem,i=t.selectionRange;if(e!==n&&n&&n.ownerDocument&&Wg(n.ownerDocument.documentElement,n)){if(i!==null&&Ch(n)){if(e=i.start,t=i.end,t===void 0&&(t=e),"selectionStart"in n)n.selectionStart=e,n.selectionEnd=Math.min(t,n.value.length);else if(t=(e=n.ownerDocument||document)&&e.defaultView||window,t.getSelection){t=t.getSelection();var r=n.textContent.length,s=Math.min(i.start,r);i=i.end===void 0?s:Math.min(i.end,r),!t.extend&&s>i&&(r=i,i=s,s=r),r=Kf(n,s);var a=Kf(n,i);r&&a&&(t.rangeCount!==1||t.anchorNode!==r.node||t.anchorOffset!==r.offset||t.focusNode!==a.node||t.focusOffset!==a.offset)&&(e=e.createRange(),e.setStart(r.node,r.offset),t.removeAllRanges(),s>i?(t.addRange(e),t.extend(a.node,a.offset)):(e.setEnd(a.node,a.offset),t.addRange(e)))}}for(e=[],t=n;t=t.parentNode;)t.nodeType===1&&e.push({element:t,left:t.scrollLeft,top:t.scrollTop});for(typeof n.focus=="function"&&n.focus(),n=0;n<e.length;n++)t=e[n],t.element.scrollLeft=t.left,t.element.scrollTop=t.top}}var D0=Mi&&"documentMode"in document&&11>=document.documentMode,os=null,Wu=null,Ca=null,Xu=!1;function Zf(t,e,n){var i=n.window===n?n.document:n.nodeType===9?n:n.ownerDocument;Xu||os==null||os!==gl(i)||(i=os,"selectionStart"in i&&Ch(i)?i={start:i.selectionStart,end:i.selectionEnd}:(i=(i.ownerDocument&&i.ownerDocument.defaultView||window).getSelection(),i={anchorNode:i.anchorNode,anchorOffset:i.anchorOffset,focusNode:i.focusNode,focusOffset:i.focusOffset}),Ca&&Oa(Ca,i)||(Ca=i,i=El(Wu,"onSelect"),0<i.length&&(e=new Eh("onSelect","select",null,e,n),t.push({event:e,listeners:i}),e.target=os)))}function po(t,e){var n={};return n[t.toLowerCase()]=e.toLowerCase(),n["Webkit"+t]="webkit"+e,n["Moz"+t]="moz"+e,n}var ls={animationend:po("Animation","AnimationEnd"),animationiteration:po("Animation","AnimationIteration"),animationstart:po("Animation","AnimationStart"),transitionend:po("Transition","TransitionEnd")},Lc={},$g={};Mi&&($g=document.createElement("div").style,"AnimationEvent"in window||(delete ls.animationend.animation,delete ls.animationiteration.animation,delete ls.animationstart.animation),"TransitionEvent"in window||delete ls.transitionend.transition);function Jl(t){if(Lc[t])return Lc[t];if(!ls[t])return t;var e=ls[t],n;for(n in e)if(e.hasOwnProperty(n)&&n in $g)return Lc[t]=e[n];return t}var qg=Jl("animationend"),Yg=Jl("animationiteration"),Kg=Jl("animationstart"),Zg=Jl("transitionend"),Qg=new Map,Qf="abort auxClick cancel canPlay canPlayThrough click close contextMenu copy cut drag dragEnd dragEnter dragExit dragLeave dragOver dragStart drop durationChange emptied encrypted ended error gotPointerCapture input invalid keyDown keyPress keyUp load loadedData loadedMetadata loadStart lostPointerCapture mouseDown mouseMove mouseOut mouseOver mouseUp paste pause play playing pointerCancel pointerDown pointerMove pointerOut pointerOver pointerUp progress rateChange reset resize seeked seeking stalled submit suspend timeUpdate touchCancel touchEnd touchStart volumeChange scroll toggle touchMove waiting wheel".split(" ");function or(t,e){Qg.set(t,e),Or(e,[t])}for(var Dc=0;Dc<Qf.length;Dc++){var Ic=Qf[Dc],I0=Ic.toLowerCase(),U0=Ic[0].toUpperCase()+Ic.slice(1);or(I0,"on"+U0)}or(qg,"onAnimationEnd");or(Yg,"onAnimationIteration");or(Kg,"onAnimationStart");or("dblclick","onDoubleClick");or("focusin","onFocus");or("focusout","onBlur");or(Zg,"onTransitionEnd");Rs("onMouseEnter",["mouseout","mouseover"]);Rs("onMouseLeave",["mouseout","mouseover"]);Rs("onPointerEnter",["pointerout","pointerover"]);Rs("onPointerLeave",["pointerout","pointerover"]);Or("onChange","change click focusin focusout input keydown keyup selectionchange".split(" "));Or("onSelect","focusout contextmenu dragend focusin keydown keyup mousedown mouseup selectionchange".split(" "));Or("onBeforeInput",["compositionend","keypress","textInput","paste"]);Or("onCompositionEnd","compositionend focusout keydown keypress keyup mousedown".split(" "));Or("onCompositionStart","compositionstart focusout keydown keypress keyup mousedown".split(" "));Or("onCompositionUpdate","compositionupdate focusout keydown keypress keyup mousedown".split(" "));var va="abort canplay canplaythrough durationchange emptied encrypted ended error loadeddata loadedmetadata loadstart pause play playing progress ratechange resize seeked seeking stalled suspend timeupdate volumechange waiting".split(" "),F0=new Set("cancel close invalid load scroll toggle".split(" ").concat(va));function Jf(t,e,n){var i=t.type||"unknown-event";t.currentTarget=n,Ix(i,e,void 0,t),t.currentTarget=null}function Jg(t,e){e=(e&4)!==0;for(var n=0;n<t.length;n++){var i=t[n],r=i.event;i=i.listeners;e:{var s=void 0;if(e)for(var a=i.length-1;0<=a;a--){var o=i[a],c=o.instance,h=o.currentTarget;if(o=o.listener,c!==s&&r.isPropagationStopped())break e;Jf(r,o,h),s=c}else for(a=0;a<i.length;a++){if(o=i[a],c=o.instance,h=o.currentTarget,o=o.listener,c!==s&&r.isPropagationStopped())break e;Jf(r,o,h),s=c}}}if(vl)throw t=Bu,vl=!1,Bu=null,t}function ut(t,e){var n=e[Zu];n===void 0&&(n=e[Zu]=new Set);var i=t+"__bubble";n.has(i)||(e_(e,t,2,!1),n.add(i))}function Uc(t,e,n){var i=0;e&&(i|=4),e_(n,t,i,e)}var mo="_reactListening"+Math.random().toString(36).slice(2);function ja(t){if(!t[mo]){t[mo]=!0,og.forEach(function(n){n!=="selectionchange"&&(F0.has(n)||Uc(n,!1,t),Uc(n,!0,t))});var e=t.nodeType===9?t:t.ownerDocument;e===null||e[mo]||(e[mo]=!0,Uc("selectionchange",!1,e))}}function e_(t,e,n,i){switch(kg(e)){case 1:var r=Kx;break;case 4:r=Zx;break;default:r=Sh}n=r.bind(null,e,n,t),r=void 0,!zu||e!=="touchstart"&&e!=="touchmove"&&e!=="wheel"||(r=!0),i?r!==void 0?t.addEventListener(e,n,{capture:!0,passive:r}):t.addEventListener(e,n,!0):r!==void 0?t.addEventListener(e,n,{passive:r}):t.addEventListener(e,n,!1)}function Fc(t,e,n,i,r){var s=i;if(!(e&1)&&!(e&2)&&i!==null)e:for(;;){if(i===null)return;var a=i.tag;if(a===3||a===4){var o=i.stateNode.containerInfo;if(o===r||o.nodeType===8&&o.parentNode===r)break;if(a===4)for(a=i.return;a!==null;){var c=a.tag;if((c===3||c===4)&&(c=a.stateNode.containerInfo,c===r||c.nodeType===8&&c.parentNode===r))return;a=a.return}for(;o!==null;){if(a=Er(o),a===null)return;if(c=a.tag,c===5||c===6){i=s=a;continue e}o=o.parentNode}}i=i.return}Eg(function(){var h=s,u=_h(n),f=[];e:{var p=Qg.get(t);if(p!==void 0){var m=Eh,S=t;switch(t){case"keypress":if(Jo(n)===0)break e;case"keydown":case"keyup":m=h0;break;case"focusin":S="focus",m=Rc;break;case"focusout":S="blur",m=Rc;break;case"beforeblur":case"afterblur":m=Rc;break;case"click":if(n.button===2)break e;case"auxclick":case"dblclick":case"mousedown":case"mousemove":case"mouseup":case"mouseout":case"mouseover":case"contextmenu":m=Bf;break;case"drag":case"dragend":case"dragenter":case"dragexit":case"dragleave":case"dragover":case"dragstart":case"drop":m=e0;break;case"touchcancel":case"touchend":case"touchmove":case"touchstart":m=m0;break;case qg:case Yg:case Kg:m=i0;break;case Zg:m=_0;break;case"scroll":m=Qx;break;case"wheel":m=x0;break;case"copy":case"cut":case"paste":m=s0;break;case"gotpointercapture":case"lostpointercapture":case"pointercancel":case"pointerdown":case"pointermove":case"pointerout":case"pointerover":case"pointerup":m=Vf}var x=(e&4)!==0,g=!x&&t==="scroll",d=x?p!==null?p+"Capture":null:p;x=[];for(var _=h,y;_!==null;){y=_;var E=y.stateNode;if(y.tag===5&&E!==null&&(y=E,d!==null&&(E=Da(_,d),E!=null&&x.push(za(_,E,y)))),g)break;_=_.return}0<x.length&&(p=new m(p,S,null,n,u),f.push({event:p,listeners:x}))}}if(!(e&7)){e:{if(p=t==="mouseover"||t==="pointerover",m=t==="mouseout"||t==="pointerout",p&&n!==Ou&&(S=n.relatedTarget||n.fromElement)&&(Er(S)||S[Ei]))break e;if((m||p)&&(p=u.window===u?u:(p=u.ownerDocument)?p.defaultView||p.parentWindow:window,m?(S=n.relatedTarget||n.toElement,m=h,S=S?Er(S):null,S!==null&&(g=jr(S),S!==g||S.tag!==5&&S.tag!==6)&&(S=null)):(m=null,S=h),m!==S)){if(x=Bf,E="onMouseLeave",d="onMouseEnter",_="mouse",(t==="pointerout"||t==="pointerover")&&(x=Vf,E="onPointerLeave",d="onPointerEnter",_="pointer"),g=m==null?p:cs(m),y=S==null?p:cs(S),p=new x(E,_+"leave",m,n,u),p.target=g,p.relatedTarget=y,E=null,Er(u)===h&&(x=new x(d,_+"enter",S,n,u),x.target=y,x.relatedTarget=g,E=x),g=E,m&&S)t:{for(x=m,d=S,_=0,y=x;y;y=Hr(y))_++;for(y=0,E=d;E;E=Hr(E))y++;for(;0<_-y;)x=Hr(x),_--;for(;0<y-_;)d=Hr(d),y--;for(;_--;){if(x===d||d!==null&&x===d.alternate)break t;x=Hr(x),d=Hr(d)}x=null}else x=null;m!==null&&ep(f,p,m,x,!1),S!==null&&g!==null&&ep(f,g,S,x,!0)}}e:{if(p=h?cs(h):window,m=p.nodeName&&p.nodeName.toLowerCase(),m==="select"||m==="input"&&p.type==="file")var P=C0;else if(Xf(p))if(Vg)P=P0;else{P=A0;var b=b0}else(m=p.nodeName)&&m.toLowerCase()==="input"&&(p.type==="checkbox"||p.type==="radio")&&(P=R0);if(P&&(P=P(t,h))){Hg(f,P,n,u);break e}b&&b(t,p,h),t==="focusout"&&(b=p._wrapperState)&&b.controlled&&p.type==="number"&&Du(p,"number",p.value)}switch(b=h?cs(h):window,t){case"focusin":(Xf(b)||b.contentEditable==="true")&&(os=b,Wu=h,Ca=null);break;case"focusout":Ca=Wu=os=null;break;case"mousedown":Xu=!0;break;case"contextmenu":case"mouseup":case"dragend":Xu=!1,Zf(f,n,u);break;case"selectionchange":if(D0)break;case"keydown":case"keyup":Zf(f,n,u)}var C;if(Th)e:{switch(t){case"compositionstart":var N="onCompositionStart";break e;case"compositionend":N="onCompositionEnd";break e;case"compositionupdate":N="onCompositionUpdate";break e}N=void 0}else as?zg(t,n)&&(N="onCompositionEnd"):t==="keydown"&&n.keyCode===229&&(N="onCompositionStart");N&&(jg&&n.locale!=="ko"&&(as||N!=="onCompositionStart"?N==="onCompositionEnd"&&as&&(C=Og()):(Gi=u,Mh="value"in Gi?Gi.value:Gi.textContent,as=!0)),b=El(h,N),0<b.length&&(N=new Hf(N,t,null,n,u),f.push({event:N,listeners:b}),C?N.data=C:(C=Bg(n),C!==null&&(N.data=C)))),(C=S0?M0(t,n):E0(t,n))&&(h=El(h,"onBeforeInput"),0<h.length&&(u=new Hf("onBeforeInput","beforeinput",null,n,u),f.push({event:u,listeners:h}),u.data=C))}Jg(f,e)})}function za(t,e,n){return{instance:t,listener:e,currentTarget:n}}function El(t,e){for(var n=e+"Capture",i=[];t!==null;){var r=t,s=r.stateNode;r.tag===5&&s!==null&&(r=s,s=Da(t,n),s!=null&&i.unshift(za(t,s,r)),s=Da(t,e),s!=null&&i.push(za(t,s,r))),t=t.return}return i}function Hr(t){if(t===null)return null;do t=t.return;while(t&&t.tag!==5);return t||null}function ep(t,e,n,i,r){for(var s=e._reactName,a=[];n!==null&&n!==i;){var o=n,c=o.alternate,h=o.stateNode;if(c!==null&&c===i)break;o.tag===5&&h!==null&&(o=h,r?(c=Da(n,s),c!=null&&a.unshift(za(n,c,o))):r||(c=Da(n,s),c!=null&&a.push(za(n,c,o)))),n=n.return}a.length!==0&&t.push({event:e,listeners:a})}var k0=/\r\n?/g,O0=/\u0000|\uFFFD/g;function tp(t){return(typeof t=="string"?t:""+t).replace(k0,`
`).replace(O0,"")}function go(t,e,n){if(e=tp(e),tp(t)!==e&&n)throw Error(oe(425))}function wl(){}var $u=null,qu=null;function Yu(t,e){return t==="textarea"||t==="noscript"||typeof e.children=="string"||typeof e.children=="number"||typeof e.dangerouslySetInnerHTML=="object"&&e.dangerouslySetInnerHTML!==null&&e.dangerouslySetInnerHTML.__html!=null}var Ku=typeof setTimeout=="function"?setTimeout:void 0,j0=typeof clearTimeout=="function"?clearTimeout:void 0,np=typeof Promise=="function"?Promise:void 0,z0=typeof queueMicrotask=="function"?queueMicrotask:typeof np<"u"?function(t){return np.resolve(null).then(t).catch(B0)}:Ku;function B0(t){setTimeout(function(){throw t})}function kc(t,e){var n=e,i=0;do{var r=n.nextSibling;if(t.removeChild(n),r&&r.nodeType===8)if(n=r.data,n==="/$"){if(i===0){t.removeChild(r),Fa(e);return}i--}else n!=="$"&&n!=="$?"&&n!=="$!"||i++;n=r}while(n);Fa(e)}function Ki(t){for(;t!=null;t=t.nextSibling){var e=t.nodeType;if(e===1||e===3)break;if(e===8){if(e=t.data,e==="$"||e==="$!"||e==="$?")break;if(e==="/$")return null}}return t}function ip(t){t=t.previousSibling;for(var e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="$"||n==="$!"||n==="$?"){if(e===0)return t;e--}else n==="/$"&&e++}t=t.previousSibling}return null}var Gs=Math.random().toString(36).slice(2),ii="__reactFiber$"+Gs,Ba="__reactProps$"+Gs,Ei="__reactContainer$"+Gs,Zu="__reactEvents$"+Gs,H0="__reactListeners$"+Gs,V0="__reactHandles$"+Gs;function Er(t){var e=t[ii];if(e)return e;for(var n=t.parentNode;n;){if(e=n[Ei]||n[ii]){if(n=e.alternate,e.child!==null||n!==null&&n.child!==null)for(t=ip(t);t!==null;){if(n=t[ii])return n;t=ip(t)}return e}t=n,n=t.parentNode}return null}function Qa(t){return t=t[ii]||t[Ei],!t||t.tag!==5&&t.tag!==6&&t.tag!==13&&t.tag!==3?null:t}function cs(t){if(t.tag===5||t.tag===6)return t.stateNode;throw Error(oe(33))}function ec(t){return t[Ba]||null}var Qu=[],us=-1;function lr(t){return{current:t}}function ht(t){0>us||(t.current=Qu[us],Qu[us]=null,us--)}function ot(t,e){us++,Qu[us]=t.current,t.current=e}var rr={},Yt=lr(rr),cn=lr(!1),Pr=rr;function Ps(t,e){var n=t.type.contextTypes;if(!n)return rr;var i=t.stateNode;if(i&&i.__reactInternalMemoizedUnmaskedChildContext===e)return i.__reactInternalMemoizedMaskedChildContext;var r={},s;for(s in n)r[s]=e[s];return i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=e,t.__reactInternalMemoizedMaskedChildContext=r),r}function un(t){return t=t.childContextTypes,t!=null}function Tl(){ht(cn),ht(Yt)}function rp(t,e,n){if(Yt.current!==rr)throw Error(oe(168));ot(Yt,e),ot(cn,n)}function t_(t,e,n){var i=t.stateNode;if(e=e.childContextTypes,typeof i.getChildContext!="function")return n;i=i.getChildContext();for(var r in i)if(!(r in e))throw Error(oe(108,bx(t)||"Unknown",r));return vt({},n,i)}function Cl(t){return t=(t=t.stateNode)&&t.__reactInternalMemoizedMergedChildContext||rr,Pr=Yt.current,ot(Yt,t),ot(cn,cn.current),!0}function sp(t,e,n){var i=t.stateNode;if(!i)throw Error(oe(169));n?(t=t_(t,e,Pr),i.__reactInternalMemoizedMergedChildContext=t,ht(cn),ht(Yt),ot(Yt,t)):ht(cn),ot(cn,n)}var gi=null,tc=!1,Oc=!1;function n_(t){gi===null?gi=[t]:gi.push(t)}function G0(t){tc=!0,n_(t)}function cr(){if(!Oc&&gi!==null){Oc=!0;var t=0,e=nt;try{var n=gi;for(nt=1;t<n.length;t++){var i=n[t];do i=i(!0);while(i!==null)}gi=null,tc=!1}catch(r){throw gi!==null&&(gi=gi.slice(t+1)),bg(vh,cr),r}finally{nt=e,Oc=!1}}return null}var ds=[],hs=0,bl=null,Al=0,Pn=[],Nn=0,Nr=null,_i=1,vi="";function vr(t,e){ds[hs++]=Al,ds[hs++]=bl,bl=t,Al=e}function i_(t,e,n){Pn[Nn++]=_i,Pn[Nn++]=vi,Pn[Nn++]=Nr,Nr=t;var i=_i;t=vi;var r=32-Kn(i)-1;i&=~(1<<r),n+=1;var s=32-Kn(e)+r;if(30<s){var a=r-r%5;s=(i&(1<<a)-1).toString(32),i>>=a,r-=a,_i=1<<32-Kn(e)+r|n<<r|i,vi=s+t}else _i=1<<s|n<<r|i,vi=t}function bh(t){t.return!==null&&(vr(t,1),i_(t,1,0))}function Ah(t){for(;t===bl;)bl=ds[--hs],ds[hs]=null,Al=ds[--hs],ds[hs]=null;for(;t===Nr;)Nr=Pn[--Nn],Pn[Nn]=null,vi=Pn[--Nn],Pn[Nn]=null,_i=Pn[--Nn],Pn[Nn]=null}var En=null,Sn=null,ft=!1,Xn=null;function r_(t,e){var n=Dn(5,null,null,0);n.elementType="DELETED",n.stateNode=e,n.return=t,e=t.deletions,e===null?(t.deletions=[n],t.flags|=16):e.push(n)}function ap(t,e){switch(t.tag){case 5:var n=t.type;return e=e.nodeType!==1||n.toLowerCase()!==e.nodeName.toLowerCase()?null:e,e!==null?(t.stateNode=e,En=t,Sn=Ki(e.firstChild),!0):!1;case 6:return e=t.pendingProps===""||e.nodeType!==3?null:e,e!==null?(t.stateNode=e,En=t,Sn=null,!0):!1;case 13:return e=e.nodeType!==8?null:e,e!==null?(n=Nr!==null?{id:_i,overflow:vi}:null,t.memoizedState={dehydrated:e,treeContext:n,retryLane:1073741824},n=Dn(18,null,null,0),n.stateNode=e,n.return=t,t.child=n,En=t,Sn=null,!0):!1;default:return!1}}function Ju(t){return(t.mode&1)!==0&&(t.flags&128)===0}function ed(t){if(ft){var e=Sn;if(e){var n=e;if(!ap(t,e)){if(Ju(t))throw Error(oe(418));e=Ki(n.nextSibling);var i=En;e&&ap(t,e)?r_(i,n):(t.flags=t.flags&-4097|2,ft=!1,En=t)}}else{if(Ju(t))throw Error(oe(418));t.flags=t.flags&-4097|2,ft=!1,En=t}}}function op(t){for(t=t.return;t!==null&&t.tag!==5&&t.tag!==3&&t.tag!==13;)t=t.return;En=t}function _o(t){if(t!==En)return!1;if(!ft)return op(t),ft=!0,!1;var e;if((e=t.tag!==3)&&!(e=t.tag!==5)&&(e=t.type,e=e!=="head"&&e!=="body"&&!Yu(t.type,t.memoizedProps)),e&&(e=Sn)){if(Ju(t))throw s_(),Error(oe(418));for(;e;)r_(t,e),e=Ki(e.nextSibling)}if(op(t),t.tag===13){if(t=t.memoizedState,t=t!==null?t.dehydrated:null,!t)throw Error(oe(317));e:{for(t=t.nextSibling,e=0;t;){if(t.nodeType===8){var n=t.data;if(n==="/$"){if(e===0){Sn=Ki(t.nextSibling);break e}e--}else n!=="$"&&n!=="$!"&&n!=="$?"||e++}t=t.nextSibling}Sn=null}}else Sn=En?Ki(t.stateNode.nextSibling):null;return!0}function s_(){for(var t=Sn;t;)t=Ki(t.nextSibling)}function Ns(){Sn=En=null,ft=!1}function Rh(t){Xn===null?Xn=[t]:Xn.push(t)}var W0=bi.ReactCurrentBatchConfig;function ea(t,e,n){if(t=n.ref,t!==null&&typeof t!="function"&&typeof t!="object"){if(n._owner){if(n=n._owner,n){if(n.tag!==1)throw Error(oe(309));var i=n.stateNode}if(!i)throw Error(oe(147,t));var r=i,s=""+t;return e!==null&&e.ref!==null&&typeof e.ref=="function"&&e.ref._stringRef===s?e.ref:(e=function(a){var o=r.refs;a===null?delete o[s]:o[s]=a},e._stringRef=s,e)}if(typeof t!="string")throw Error(oe(284));if(!n._owner)throw Error(oe(290,t))}return t}function vo(t,e){throw t=Object.prototype.toString.call(e),Error(oe(31,t==="[object Object]"?"object with keys {"+Object.keys(e).join(", ")+"}":t))}function lp(t){var e=t._init;return e(t._payload)}function a_(t){function e(d,_){if(t){var y=d.deletions;y===null?(d.deletions=[_],d.flags|=16):y.push(_)}}function n(d,_){if(!t)return null;for(;_!==null;)e(d,_),_=_.sibling;return null}function i(d,_){for(d=new Map;_!==null;)_.key!==null?d.set(_.key,_):d.set(_.index,_),_=_.sibling;return d}function r(d,_){return d=er(d,_),d.index=0,d.sibling=null,d}function s(d,_,y){return d.index=y,t?(y=d.alternate,y!==null?(y=y.index,y<_?(d.flags|=2,_):y):(d.flags|=2,_)):(d.flags|=1048576,_)}function a(d){return t&&d.alternate===null&&(d.flags|=2),d}function o(d,_,y,E){return _===null||_.tag!==6?(_=Wc(y,d.mode,E),_.return=d,_):(_=r(_,y),_.return=d,_)}function c(d,_,y,E){var P=y.type;return P===ss?u(d,_,y.props.children,E,y.key):_!==null&&(_.elementType===P||typeof P=="object"&&P!==null&&P.$$typeof===Oi&&lp(P)===_.type)?(E=r(_,y.props),E.ref=ea(d,_,y),E.return=d,E):(E=al(y.type,y.key,y.props,null,d.mode,E),E.ref=ea(d,_,y),E.return=d,E)}function h(d,_,y,E){return _===null||_.tag!==4||_.stateNode.containerInfo!==y.containerInfo||_.stateNode.implementation!==y.implementation?(_=Xc(y,d.mode,E),_.return=d,_):(_=r(_,y.children||[]),_.return=d,_)}function u(d,_,y,E,P){return _===null||_.tag!==7?(_=Rr(y,d.mode,E,P),_.return=d,_):(_=r(_,y),_.return=d,_)}function f(d,_,y){if(typeof _=="string"&&_!==""||typeof _=="number")return _=Wc(""+_,d.mode,y),_.return=d,_;if(typeof _=="object"&&_!==null){switch(_.$$typeof){case ao:return y=al(_.type,_.key,_.props,null,d.mode,y),y.ref=ea(d,null,_),y.return=d,y;case rs:return _=Xc(_,d.mode,y),_.return=d,_;case Oi:var E=_._init;return f(d,E(_._payload),y)}if(ga(_)||Ys(_))return _=Rr(_,d.mode,y,null),_.return=d,_;vo(d,_)}return null}function p(d,_,y,E){var P=_!==null?_.key:null;if(typeof y=="string"&&y!==""||typeof y=="number")return P!==null?null:o(d,_,""+y,E);if(typeof y=="object"&&y!==null){switch(y.$$typeof){case ao:return y.key===P?c(d,_,y,E):null;case rs:return y.key===P?h(d,_,y,E):null;case Oi:return P=y._init,p(d,_,P(y._payload),E)}if(ga(y)||Ys(y))return P!==null?null:u(d,_,y,E,null);vo(d,y)}return null}function m(d,_,y,E,P){if(typeof E=="string"&&E!==""||typeof E=="number")return d=d.get(y)||null,o(_,d,""+E,P);if(typeof E=="object"&&E!==null){switch(E.$$typeof){case ao:return d=d.get(E.key===null?y:E.key)||null,c(_,d,E,P);case rs:return d=d.get(E.key===null?y:E.key)||null,h(_,d,E,P);case Oi:var b=E._init;return m(d,_,y,b(E._payload),P)}if(ga(E)||Ys(E))return d=d.get(y)||null,u(_,d,E,P,null);vo(_,E)}return null}function S(d,_,y,E){for(var P=null,b=null,C=_,N=_=0,z=null;C!==null&&N<y.length;N++){C.index>N?(z=C,C=null):z=C.sibling;var v=p(d,C,y[N],E);if(v===null){C===null&&(C=z);break}t&&C&&v.alternate===null&&e(d,C),_=s(v,_,N),b===null?P=v:b.sibling=v,b=v,C=z}if(N===y.length)return n(d,C),ft&&vr(d,N),P;if(C===null){for(;N<y.length;N++)C=f(d,y[N],E),C!==null&&(_=s(C,_,N),b===null?P=C:b.sibling=C,b=C);return ft&&vr(d,N),P}for(C=i(d,C);N<y.length;N++)z=m(C,d,N,y[N],E),z!==null&&(t&&z.alternate!==null&&C.delete(z.key===null?N:z.key),_=s(z,_,N),b===null?P=z:b.sibling=z,b=z);return t&&C.forEach(function(M){return e(d,M)}),ft&&vr(d,N),P}function x(d,_,y,E){var P=Ys(y);if(typeof P!="function")throw Error(oe(150));if(y=P.call(y),y==null)throw Error(oe(151));for(var b=P=null,C=_,N=_=0,z=null,v=y.next();C!==null&&!v.done;N++,v=y.next()){C.index>N?(z=C,C=null):z=C.sibling;var M=p(d,C,v.value,E);if(M===null){C===null&&(C=z);break}t&&C&&M.alternate===null&&e(d,C),_=s(M,_,N),b===null?P=M:b.sibling=M,b=M,C=z}if(v.done)return n(d,C),ft&&vr(d,N),P;if(C===null){for(;!v.done;N++,v=y.next())v=f(d,v.value,E),v!==null&&(_=s(v,_,N),b===null?P=v:b.sibling=v,b=v);return ft&&vr(d,N),P}for(C=i(d,C);!v.done;N++,v=y.next())v=m(C,d,N,v.value,E),v!==null&&(t&&v.alternate!==null&&C.delete(v.key===null?N:v.key),_=s(v,_,N),b===null?P=v:b.sibling=v,b=v);return t&&C.forEach(function(I){return e(d,I)}),ft&&vr(d,N),P}function g(d,_,y,E){if(typeof y=="object"&&y!==null&&y.type===ss&&y.key===null&&(y=y.props.children),typeof y=="object"&&y!==null){switch(y.$$typeof){case ao:e:{for(var P=y.key,b=_;b!==null;){if(b.key===P){if(P=y.type,P===ss){if(b.tag===7){n(d,b.sibling),_=r(b,y.props.children),_.return=d,d=_;break e}}else if(b.elementType===P||typeof P=="object"&&P!==null&&P.$$typeof===Oi&&lp(P)===b.type){n(d,b.sibling),_=r(b,y.props),_.ref=ea(d,b,y),_.return=d,d=_;break e}n(d,b);break}else e(d,b);b=b.sibling}y.type===ss?(_=Rr(y.props.children,d.mode,E,y.key),_.return=d,d=_):(E=al(y.type,y.key,y.props,null,d.mode,E),E.ref=ea(d,_,y),E.return=d,d=E)}return a(d);case rs:e:{for(b=y.key;_!==null;){if(_.key===b)if(_.tag===4&&_.stateNode.containerInfo===y.containerInfo&&_.stateNode.implementation===y.implementation){n(d,_.sibling),_=r(_,y.children||[]),_.return=d,d=_;break e}else{n(d,_);break}else e(d,_);_=_.sibling}_=Xc(y,d.mode,E),_.return=d,d=_}return a(d);case Oi:return b=y._init,g(d,_,b(y._payload),E)}if(ga(y))return S(d,_,y,E);if(Ys(y))return x(d,_,y,E);vo(d,y)}return typeof y=="string"&&y!==""||typeof y=="number"?(y=""+y,_!==null&&_.tag===6?(n(d,_.sibling),_=r(_,y),_.return=d,d=_):(n(d,_),_=Wc(y,d.mode,E),_.return=d,d=_),a(d)):n(d,_)}return g}var Ls=a_(!0),o_=a_(!1),Rl=lr(null),Pl=null,fs=null,Ph=null;function Nh(){Ph=fs=Pl=null}function Lh(t){var e=Rl.current;ht(Rl),t._currentValue=e}function td(t,e,n){for(;t!==null;){var i=t.alternate;if((t.childLanes&e)!==e?(t.childLanes|=e,i!==null&&(i.childLanes|=e)):i!==null&&(i.childLanes&e)!==e&&(i.childLanes|=e),t===n)break;t=t.return}}function Ms(t,e){Pl=t,Ph=fs=null,t=t.dependencies,t!==null&&t.firstContext!==null&&(t.lanes&e&&(ln=!0),t.firstContext=null)}function kn(t){var e=t._currentValue;if(Ph!==t)if(t={context:t,memoizedValue:e,next:null},fs===null){if(Pl===null)throw Error(oe(308));fs=t,Pl.dependencies={lanes:0,firstContext:t}}else fs=fs.next=t;return e}var wr=null;function Dh(t){wr===null?wr=[t]:wr.push(t)}function l_(t,e,n,i){var r=e.interleaved;return r===null?(n.next=n,Dh(e)):(n.next=r.next,r.next=n),e.interleaved=n,wi(t,i)}function wi(t,e){t.lanes|=e;var n=t.alternate;for(n!==null&&(n.lanes|=e),n=t,t=t.return;t!==null;)t.childLanes|=e,n=t.alternate,n!==null&&(n.childLanes|=e),n=t,t=t.return;return n.tag===3?n.stateNode:null}var ji=!1;function Ih(t){t.updateQueue={baseState:t.memoizedState,firstBaseUpdate:null,lastBaseUpdate:null,shared:{pending:null,interleaved:null,lanes:0},effects:null}}function c_(t,e){t=t.updateQueue,e.updateQueue===t&&(e.updateQueue={baseState:t.baseState,firstBaseUpdate:t.firstBaseUpdate,lastBaseUpdate:t.lastBaseUpdate,shared:t.shared,effects:t.effects})}function Si(t,e){return{eventTime:t,lane:e,tag:0,payload:null,callback:null,next:null}}function Zi(t,e,n){var i=t.updateQueue;if(i===null)return null;if(i=i.shared,qe&2){var r=i.pending;return r===null?e.next=e:(e.next=r.next,r.next=e),i.pending=e,wi(t,n)}return r=i.interleaved,r===null?(e.next=e,Dh(i)):(e.next=r.next,r.next=e),i.interleaved=e,wi(t,n)}function el(t,e,n){if(e=e.updateQueue,e!==null&&(e=e.shared,(n&4194240)!==0)){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,xh(t,n)}}function cp(t,e){var n=t.updateQueue,i=t.alternate;if(i!==null&&(i=i.updateQueue,n===i)){var r=null,s=null;if(n=n.firstBaseUpdate,n!==null){do{var a={eventTime:n.eventTime,lane:n.lane,tag:n.tag,payload:n.payload,callback:n.callback,next:null};s===null?r=s=a:s=s.next=a,n=n.next}while(n!==null);s===null?r=s=e:s=s.next=e}else r=s=e;n={baseState:i.baseState,firstBaseUpdate:r,lastBaseUpdate:s,shared:i.shared,effects:i.effects},t.updateQueue=n;return}t=n.lastBaseUpdate,t===null?n.firstBaseUpdate=e:t.next=e,n.lastBaseUpdate=e}function Nl(t,e,n,i){var r=t.updateQueue;ji=!1;var s=r.firstBaseUpdate,a=r.lastBaseUpdate,o=r.shared.pending;if(o!==null){r.shared.pending=null;var c=o,h=c.next;c.next=null,a===null?s=h:a.next=h,a=c;var u=t.alternate;u!==null&&(u=u.updateQueue,o=u.lastBaseUpdate,o!==a&&(o===null?u.firstBaseUpdate=h:o.next=h,u.lastBaseUpdate=c))}if(s!==null){var f=r.baseState;a=0,u=h=c=null,o=s;do{var p=o.lane,m=o.eventTime;if((i&p)===p){u!==null&&(u=u.next={eventTime:m,lane:0,tag:o.tag,payload:o.payload,callback:o.callback,next:null});e:{var S=t,x=o;switch(p=e,m=n,x.tag){case 1:if(S=x.payload,typeof S=="function"){f=S.call(m,f,p);break e}f=S;break e;case 3:S.flags=S.flags&-65537|128;case 0:if(S=x.payload,p=typeof S=="function"?S.call(m,f,p):S,p==null)break e;f=vt({},f,p);break e;case 2:ji=!0}}o.callback!==null&&o.lane!==0&&(t.flags|=64,p=r.effects,p===null?r.effects=[o]:p.push(o))}else m={eventTime:m,lane:p,tag:o.tag,payload:o.payload,callback:o.callback,next:null},u===null?(h=u=m,c=f):u=u.next=m,a|=p;if(o=o.next,o===null){if(o=r.shared.pending,o===null)break;p=o,o=p.next,p.next=null,r.lastBaseUpdate=p,r.shared.pending=null}}while(!0);if(u===null&&(c=f),r.baseState=c,r.firstBaseUpdate=h,r.lastBaseUpdate=u,e=r.shared.interleaved,e!==null){r=e;do a|=r.lane,r=r.next;while(r!==e)}else s===null&&(r.shared.lanes=0);Dr|=a,t.lanes=a,t.memoizedState=f}}function up(t,e,n){if(t=e.effects,e.effects=null,t!==null)for(e=0;e<t.length;e++){var i=t[e],r=i.callback;if(r!==null){if(i.callback=null,i=n,typeof r!="function")throw Error(oe(191,r));r.call(i)}}}var Ja={},si=lr(Ja),Ha=lr(Ja),Va=lr(Ja);function Tr(t){if(t===Ja)throw Error(oe(174));return t}function Uh(t,e){switch(ot(Va,e),ot(Ha,t),ot(si,Ja),t=e.nodeType,t){case 9:case 11:e=(e=e.documentElement)?e.namespaceURI:Uu(null,"");break;default:t=t===8?e.parentNode:e,e=t.namespaceURI||null,t=t.tagName,e=Uu(e,t)}ht(si),ot(si,e)}function Ds(){ht(si),ht(Ha),ht(Va)}function u_(t){Tr(Va.current);var e=Tr(si.current),n=Uu(e,t.type);e!==n&&(ot(Ha,t),ot(si,n))}function Fh(t){Ha.current===t&&(ht(si),ht(Ha))}var pt=lr(0);function Ll(t){for(var e=t;e!==null;){if(e.tag===13){var n=e.memoizedState;if(n!==null&&(n=n.dehydrated,n===null||n.data==="$?"||n.data==="$!"))return e}else if(e.tag===19&&e.memoizedProps.revealOrder!==void 0){if(e.flags&128)return e}else if(e.child!==null){e.child.return=e,e=e.child;continue}if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return null;e=e.return}e.sibling.return=e.return,e=e.sibling}return null}var jc=[];function kh(){for(var t=0;t<jc.length;t++)jc[t]._workInProgressVersionPrimary=null;jc.length=0}var tl=bi.ReactCurrentDispatcher,zc=bi.ReactCurrentBatchConfig,Lr=0,gt=null,Pt=null,Ft=null,Dl=!1,ba=!1,Ga=0,X0=0;function Vt(){throw Error(oe(321))}function Oh(t,e){if(e===null)return!1;for(var n=0;n<e.length&&n<t.length;n++)if(!Qn(t[n],e[n]))return!1;return!0}function jh(t,e,n,i,r,s){if(Lr=s,gt=e,e.memoizedState=null,e.updateQueue=null,e.lanes=0,tl.current=t===null||t.memoizedState===null?K0:Z0,t=n(i,r),ba){s=0;do{if(ba=!1,Ga=0,25<=s)throw Error(oe(301));s+=1,Ft=Pt=null,e.updateQueue=null,tl.current=Q0,t=n(i,r)}while(ba)}if(tl.current=Il,e=Pt!==null&&Pt.next!==null,Lr=0,Ft=Pt=gt=null,Dl=!1,e)throw Error(oe(300));return t}function zh(){var t=Ga!==0;return Ga=0,t}function ei(){var t={memoizedState:null,baseState:null,baseQueue:null,queue:null,next:null};return Ft===null?gt.memoizedState=Ft=t:Ft=Ft.next=t,Ft}function On(){if(Pt===null){var t=gt.alternate;t=t!==null?t.memoizedState:null}else t=Pt.next;var e=Ft===null?gt.memoizedState:Ft.next;if(e!==null)Ft=e,Pt=t;else{if(t===null)throw Error(oe(310));Pt=t,t={memoizedState:Pt.memoizedState,baseState:Pt.baseState,baseQueue:Pt.baseQueue,queue:Pt.queue,next:null},Ft===null?gt.memoizedState=Ft=t:Ft=Ft.next=t}return Ft}function Wa(t,e){return typeof e=="function"?e(t):e}function Bc(t){var e=On(),n=e.queue;if(n===null)throw Error(oe(311));n.lastRenderedReducer=t;var i=Pt,r=i.baseQueue,s=n.pending;if(s!==null){if(r!==null){var a=r.next;r.next=s.next,s.next=a}i.baseQueue=r=s,n.pending=null}if(r!==null){s=r.next,i=i.baseState;var o=a=null,c=null,h=s;do{var u=h.lane;if((Lr&u)===u)c!==null&&(c=c.next={lane:0,action:h.action,hasEagerState:h.hasEagerState,eagerState:h.eagerState,next:null}),i=h.hasEagerState?h.eagerState:t(i,h.action);else{var f={lane:u,action:h.action,hasEagerState:h.hasEagerState,eagerState:h.eagerState,next:null};c===null?(o=c=f,a=i):c=c.next=f,gt.lanes|=u,Dr|=u}h=h.next}while(h!==null&&h!==s);c===null?a=i:c.next=o,Qn(i,e.memoizedState)||(ln=!0),e.memoizedState=i,e.baseState=a,e.baseQueue=c,n.lastRenderedState=i}if(t=n.interleaved,t!==null){r=t;do s=r.lane,gt.lanes|=s,Dr|=s,r=r.next;while(r!==t)}else r===null&&(n.lanes=0);return[e.memoizedState,n.dispatch]}function Hc(t){var e=On(),n=e.queue;if(n===null)throw Error(oe(311));n.lastRenderedReducer=t;var i=n.dispatch,r=n.pending,s=e.memoizedState;if(r!==null){n.pending=null;var a=r=r.next;do s=t(s,a.action),a=a.next;while(a!==r);Qn(s,e.memoizedState)||(ln=!0),e.memoizedState=s,e.baseQueue===null&&(e.baseState=s),n.lastRenderedState=s}return[s,i]}function d_(){}function h_(t,e){var n=gt,i=On(),r=e(),s=!Qn(i.memoizedState,r);if(s&&(i.memoizedState=r,ln=!0),i=i.queue,Bh(m_.bind(null,n,i,t),[t]),i.getSnapshot!==e||s||Ft!==null&&Ft.memoizedState.tag&1){if(n.flags|=2048,Xa(9,p_.bind(null,n,i,r,e),void 0,null),kt===null)throw Error(oe(349));Lr&30||f_(n,e,r)}return r}function f_(t,e,n){t.flags|=16384,t={getSnapshot:e,value:n},e=gt.updateQueue,e===null?(e={lastEffect:null,stores:null},gt.updateQueue=e,e.stores=[t]):(n=e.stores,n===null?e.stores=[t]:n.push(t))}function p_(t,e,n,i){e.value=n,e.getSnapshot=i,g_(e)&&__(t)}function m_(t,e,n){return n(function(){g_(e)&&__(t)})}function g_(t){var e=t.getSnapshot;t=t.value;try{var n=e();return!Qn(t,n)}catch{return!0}}function __(t){var e=wi(t,1);e!==null&&Zn(e,t,1,-1)}function dp(t){var e=ei();return typeof t=="function"&&(t=t()),e.memoizedState=e.baseState=t,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:Wa,lastRenderedState:t},e.queue=t,t=t.dispatch=Y0.bind(null,gt,t),[e.memoizedState,t]}function Xa(t,e,n,i){return t={tag:t,create:e,destroy:n,deps:i,next:null},e=gt.updateQueue,e===null?(e={lastEffect:null,stores:null},gt.updateQueue=e,e.lastEffect=t.next=t):(n=e.lastEffect,n===null?e.lastEffect=t.next=t:(i=n.next,n.next=t,t.next=i,e.lastEffect=t)),t}function v_(){return On().memoizedState}function nl(t,e,n,i){var r=ei();gt.flags|=t,r.memoizedState=Xa(1|e,n,void 0,i===void 0?null:i)}function nc(t,e,n,i){var r=On();i=i===void 0?null:i;var s=void 0;if(Pt!==null){var a=Pt.memoizedState;if(s=a.destroy,i!==null&&Oh(i,a.deps)){r.memoizedState=Xa(e,n,s,i);return}}gt.flags|=t,r.memoizedState=Xa(1|e,n,s,i)}function hp(t,e){return nl(8390656,8,t,e)}function Bh(t,e){return nc(2048,8,t,e)}function x_(t,e){return nc(4,2,t,e)}function y_(t,e){return nc(4,4,t,e)}function S_(t,e){if(typeof e=="function")return t=t(),e(t),function(){e(null)};if(e!=null)return t=t(),e.current=t,function(){e.current=null}}function M_(t,e,n){return n=n!=null?n.concat([t]):null,nc(4,4,S_.bind(null,e,t),n)}function Hh(){}function E_(t,e){var n=On();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Oh(e,i[1])?i[0]:(n.memoizedState=[t,e],t)}function w_(t,e){var n=On();e=e===void 0?null:e;var i=n.memoizedState;return i!==null&&e!==null&&Oh(e,i[1])?i[0]:(t=t(),n.memoizedState=[t,e],t)}function T_(t,e,n){return Lr&21?(Qn(n,e)||(n=Pg(),gt.lanes|=n,Dr|=n,t.baseState=!0),e):(t.baseState&&(t.baseState=!1,ln=!0),t.memoizedState=n)}function $0(t,e){var n=nt;nt=n!==0&&4>n?n:4,t(!0);var i=zc.transition;zc.transition={};try{t(!1),e()}finally{nt=n,zc.transition=i}}function C_(){return On().memoizedState}function q0(t,e,n){var i=Ji(t);if(n={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null},b_(t))A_(e,n);else if(n=l_(t,e,n,i),n!==null){var r=Qt();Zn(n,t,i,r),R_(n,e,i)}}function Y0(t,e,n){var i=Ji(t),r={lane:i,action:n,hasEagerState:!1,eagerState:null,next:null};if(b_(t))A_(e,r);else{var s=t.alternate;if(t.lanes===0&&(s===null||s.lanes===0)&&(s=e.lastRenderedReducer,s!==null))try{var a=e.lastRenderedState,o=s(a,n);if(r.hasEagerState=!0,r.eagerState=o,Qn(o,a)){var c=e.interleaved;c===null?(r.next=r,Dh(e)):(r.next=c.next,c.next=r),e.interleaved=r;return}}catch{}finally{}n=l_(t,e,r,i),n!==null&&(r=Qt(),Zn(n,t,i,r),R_(n,e,i))}}function b_(t){var e=t.alternate;return t===gt||e!==null&&e===gt}function A_(t,e){ba=Dl=!0;var n=t.pending;n===null?e.next=e:(e.next=n.next,n.next=e),t.pending=e}function R_(t,e,n){if(n&4194240){var i=e.lanes;i&=t.pendingLanes,n|=i,e.lanes=n,xh(t,n)}}var Il={readContext:kn,useCallback:Vt,useContext:Vt,useEffect:Vt,useImperativeHandle:Vt,useInsertionEffect:Vt,useLayoutEffect:Vt,useMemo:Vt,useReducer:Vt,useRef:Vt,useState:Vt,useDebugValue:Vt,useDeferredValue:Vt,useTransition:Vt,useMutableSource:Vt,useSyncExternalStore:Vt,useId:Vt,unstable_isNewReconciler:!1},K0={readContext:kn,useCallback:function(t,e){return ei().memoizedState=[t,e===void 0?null:e],t},useContext:kn,useEffect:hp,useImperativeHandle:function(t,e,n){return n=n!=null?n.concat([t]):null,nl(4194308,4,S_.bind(null,e,t),n)},useLayoutEffect:function(t,e){return nl(4194308,4,t,e)},useInsertionEffect:function(t,e){return nl(4,2,t,e)},useMemo:function(t,e){var n=ei();return e=e===void 0?null:e,t=t(),n.memoizedState=[t,e],t},useReducer:function(t,e,n){var i=ei();return e=n!==void 0?n(e):e,i.memoizedState=i.baseState=e,t={pending:null,interleaved:null,lanes:0,dispatch:null,lastRenderedReducer:t,lastRenderedState:e},i.queue=t,t=t.dispatch=q0.bind(null,gt,t),[i.memoizedState,t]},useRef:function(t){var e=ei();return t={current:t},e.memoizedState=t},useState:dp,useDebugValue:Hh,useDeferredValue:function(t){return ei().memoizedState=t},useTransition:function(){var t=dp(!1),e=t[0];return t=$0.bind(null,t[1]),ei().memoizedState=t,[e,t]},useMutableSource:function(){},useSyncExternalStore:function(t,e,n){var i=gt,r=ei();if(ft){if(n===void 0)throw Error(oe(407));n=n()}else{if(n=e(),kt===null)throw Error(oe(349));Lr&30||f_(i,e,n)}r.memoizedState=n;var s={value:n,getSnapshot:e};return r.queue=s,hp(m_.bind(null,i,s,t),[t]),i.flags|=2048,Xa(9,p_.bind(null,i,s,n,e),void 0,null),n},useId:function(){var t=ei(),e=kt.identifierPrefix;if(ft){var n=vi,i=_i;n=(i&~(1<<32-Kn(i)-1)).toString(32)+n,e=":"+e+"R"+n,n=Ga++,0<n&&(e+="H"+n.toString(32)),e+=":"}else n=X0++,e=":"+e+"r"+n.toString(32)+":";return t.memoizedState=e},unstable_isNewReconciler:!1},Z0={readContext:kn,useCallback:E_,useContext:kn,useEffect:Bh,useImperativeHandle:M_,useInsertionEffect:x_,useLayoutEffect:y_,useMemo:w_,useReducer:Bc,useRef:v_,useState:function(){return Bc(Wa)},useDebugValue:Hh,useDeferredValue:function(t){var e=On();return T_(e,Pt.memoizedState,t)},useTransition:function(){var t=Bc(Wa)[0],e=On().memoizedState;return[t,e]},useMutableSource:d_,useSyncExternalStore:h_,useId:C_,unstable_isNewReconciler:!1},Q0={readContext:kn,useCallback:E_,useContext:kn,useEffect:Bh,useImperativeHandle:M_,useInsertionEffect:x_,useLayoutEffect:y_,useMemo:w_,useReducer:Hc,useRef:v_,useState:function(){return Hc(Wa)},useDebugValue:Hh,useDeferredValue:function(t){var e=On();return Pt===null?e.memoizedState=t:T_(e,Pt.memoizedState,t)},useTransition:function(){var t=Hc(Wa)[0],e=On().memoizedState;return[t,e]},useMutableSource:d_,useSyncExternalStore:h_,useId:C_,unstable_isNewReconciler:!1};function Gn(t,e){if(t&&t.defaultProps){e=vt({},e),t=t.defaultProps;for(var n in t)e[n]===void 0&&(e[n]=t[n]);return e}return e}function nd(t,e,n,i){e=t.memoizedState,n=n(i,e),n=n==null?e:vt({},e,n),t.memoizedState=n,t.lanes===0&&(t.updateQueue.baseState=n)}var ic={isMounted:function(t){return(t=t._reactInternals)?jr(t)===t:!1},enqueueSetState:function(t,e,n){t=t._reactInternals;var i=Qt(),r=Ji(t),s=Si(i,r);s.payload=e,n!=null&&(s.callback=n),e=Zi(t,s,r),e!==null&&(Zn(e,t,r,i),el(e,t,r))},enqueueReplaceState:function(t,e,n){t=t._reactInternals;var i=Qt(),r=Ji(t),s=Si(i,r);s.tag=1,s.payload=e,n!=null&&(s.callback=n),e=Zi(t,s,r),e!==null&&(Zn(e,t,r,i),el(e,t,r))},enqueueForceUpdate:function(t,e){t=t._reactInternals;var n=Qt(),i=Ji(t),r=Si(n,i);r.tag=2,e!=null&&(r.callback=e),e=Zi(t,r,i),e!==null&&(Zn(e,t,i,n),el(e,t,i))}};function fp(t,e,n,i,r,s,a){return t=t.stateNode,typeof t.shouldComponentUpdate=="function"?t.shouldComponentUpdate(i,s,a):e.prototype&&e.prototype.isPureReactComponent?!Oa(n,i)||!Oa(r,s):!0}function P_(t,e,n){var i=!1,r=rr,s=e.contextType;return typeof s=="object"&&s!==null?s=kn(s):(r=un(e)?Pr:Yt.current,i=e.contextTypes,s=(i=i!=null)?Ps(t,r):rr),e=new e(n,s),t.memoizedState=e.state!==null&&e.state!==void 0?e.state:null,e.updater=ic,t.stateNode=e,e._reactInternals=t,i&&(t=t.stateNode,t.__reactInternalMemoizedUnmaskedChildContext=r,t.__reactInternalMemoizedMaskedChildContext=s),e}function pp(t,e,n,i){t=e.state,typeof e.componentWillReceiveProps=="function"&&e.componentWillReceiveProps(n,i),typeof e.UNSAFE_componentWillReceiveProps=="function"&&e.UNSAFE_componentWillReceiveProps(n,i),e.state!==t&&ic.enqueueReplaceState(e,e.state,null)}function id(t,e,n,i){var r=t.stateNode;r.props=n,r.state=t.memoizedState,r.refs={},Ih(t);var s=e.contextType;typeof s=="object"&&s!==null?r.context=kn(s):(s=un(e)?Pr:Yt.current,r.context=Ps(t,s)),r.state=t.memoizedState,s=e.getDerivedStateFromProps,typeof s=="function"&&(nd(t,e,s,n),r.state=t.memoizedState),typeof e.getDerivedStateFromProps=="function"||typeof r.getSnapshotBeforeUpdate=="function"||typeof r.UNSAFE_componentWillMount!="function"&&typeof r.componentWillMount!="function"||(e=r.state,typeof r.componentWillMount=="function"&&r.componentWillMount(),typeof r.UNSAFE_componentWillMount=="function"&&r.UNSAFE_componentWillMount(),e!==r.state&&ic.enqueueReplaceState(r,r.state,null),Nl(t,n,r,i),r.state=t.memoizedState),typeof r.componentDidMount=="function"&&(t.flags|=4194308)}function Is(t,e){try{var n="",i=e;do n+=Cx(i),i=i.return;while(i);var r=n}catch(s){r=`
Error generating stack: `+s.message+`
`+s.stack}return{value:t,source:e,stack:r,digest:null}}function Vc(t,e,n){return{value:t,source:null,stack:n??null,digest:e??null}}function rd(t,e){try{console.error(e.value)}catch(n){setTimeout(function(){throw n})}}var J0=typeof WeakMap=="function"?WeakMap:Map;function N_(t,e,n){n=Si(-1,n),n.tag=3,n.payload={element:null};var i=e.value;return n.callback=function(){Fl||(Fl=!0,pd=i),rd(t,e)},n}function L_(t,e,n){n=Si(-1,n),n.tag=3;var i=t.type.getDerivedStateFromError;if(typeof i=="function"){var r=e.value;n.payload=function(){return i(r)},n.callback=function(){rd(t,e)}}var s=t.stateNode;return s!==null&&typeof s.componentDidCatch=="function"&&(n.callback=function(){rd(t,e),typeof i!="function"&&(Qi===null?Qi=new Set([this]):Qi.add(this));var a=e.stack;this.componentDidCatch(e.value,{componentStack:a!==null?a:""})}),n}function mp(t,e,n){var i=t.pingCache;if(i===null){i=t.pingCache=new J0;var r=new Set;i.set(e,r)}else r=i.get(e),r===void 0&&(r=new Set,i.set(e,r));r.has(n)||(r.add(n),t=fy.bind(null,t,e,n),e.then(t,t))}function gp(t){do{var e;if((e=t.tag===13)&&(e=t.memoizedState,e=e!==null?e.dehydrated!==null:!0),e)return t;t=t.return}while(t!==null);return null}function _p(t,e,n,i,r){return t.mode&1?(t.flags|=65536,t.lanes=r,t):(t===e?t.flags|=65536:(t.flags|=128,n.flags|=131072,n.flags&=-52805,n.tag===1&&(n.alternate===null?n.tag=17:(e=Si(-1,1),e.tag=2,Zi(n,e,1))),n.lanes|=1),t)}var ey=bi.ReactCurrentOwner,ln=!1;function Zt(t,e,n,i){e.child=t===null?o_(e,null,n,i):Ls(e,t.child,n,i)}function vp(t,e,n,i,r){n=n.render;var s=e.ref;return Ms(e,r),i=jh(t,e,n,i,s,r),n=zh(),t!==null&&!ln?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Ti(t,e,r)):(ft&&n&&bh(e),e.flags|=1,Zt(t,e,i,r),e.child)}function xp(t,e,n,i,r){if(t===null){var s=n.type;return typeof s=="function"&&!Kh(s)&&s.defaultProps===void 0&&n.compare===null&&n.defaultProps===void 0?(e.tag=15,e.type=s,D_(t,e,s,i,r)):(t=al(n.type,null,i,e,e.mode,r),t.ref=e.ref,t.return=e,e.child=t)}if(s=t.child,!(t.lanes&r)){var a=s.memoizedProps;if(n=n.compare,n=n!==null?n:Oa,n(a,i)&&t.ref===e.ref)return Ti(t,e,r)}return e.flags|=1,t=er(s,i),t.ref=e.ref,t.return=e,e.child=t}function D_(t,e,n,i,r){if(t!==null){var s=t.memoizedProps;if(Oa(s,i)&&t.ref===e.ref)if(ln=!1,e.pendingProps=i=s,(t.lanes&r)!==0)t.flags&131072&&(ln=!0);else return e.lanes=t.lanes,Ti(t,e,r)}return sd(t,e,n,i,r)}function I_(t,e,n){var i=e.pendingProps,r=i.children,s=t!==null?t.memoizedState:null;if(i.mode==="hidden")if(!(e.mode&1))e.memoizedState={baseLanes:0,cachePool:null,transitions:null},ot(ms,xn),xn|=n;else{if(!(n&1073741824))return t=s!==null?s.baseLanes|n:n,e.lanes=e.childLanes=1073741824,e.memoizedState={baseLanes:t,cachePool:null,transitions:null},e.updateQueue=null,ot(ms,xn),xn|=t,null;e.memoizedState={baseLanes:0,cachePool:null,transitions:null},i=s!==null?s.baseLanes:n,ot(ms,xn),xn|=i}else s!==null?(i=s.baseLanes|n,e.memoizedState=null):i=n,ot(ms,xn),xn|=i;return Zt(t,e,r,n),e.child}function U_(t,e){var n=e.ref;(t===null&&n!==null||t!==null&&t.ref!==n)&&(e.flags|=512,e.flags|=2097152)}function sd(t,e,n,i,r){var s=un(n)?Pr:Yt.current;return s=Ps(e,s),Ms(e,r),n=jh(t,e,n,i,s,r),i=zh(),t!==null&&!ln?(e.updateQueue=t.updateQueue,e.flags&=-2053,t.lanes&=~r,Ti(t,e,r)):(ft&&i&&bh(e),e.flags|=1,Zt(t,e,n,r),e.child)}function yp(t,e,n,i,r){if(un(n)){var s=!0;Cl(e)}else s=!1;if(Ms(e,r),e.stateNode===null)il(t,e),P_(e,n,i),id(e,n,i,r),i=!0;else if(t===null){var a=e.stateNode,o=e.memoizedProps;a.props=o;var c=a.context,h=n.contextType;typeof h=="object"&&h!==null?h=kn(h):(h=un(n)?Pr:Yt.current,h=Ps(e,h));var u=n.getDerivedStateFromProps,f=typeof u=="function"||typeof a.getSnapshotBeforeUpdate=="function";f||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==i||c!==h)&&pp(e,a,i,h),ji=!1;var p=e.memoizedState;a.state=p,Nl(e,i,a,r),c=e.memoizedState,o!==i||p!==c||cn.current||ji?(typeof u=="function"&&(nd(e,n,u,i),c=e.memoizedState),(o=ji||fp(e,n,o,i,p,c,h))?(f||typeof a.UNSAFE_componentWillMount!="function"&&typeof a.componentWillMount!="function"||(typeof a.componentWillMount=="function"&&a.componentWillMount(),typeof a.UNSAFE_componentWillMount=="function"&&a.UNSAFE_componentWillMount()),typeof a.componentDidMount=="function"&&(e.flags|=4194308)):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),e.memoizedProps=i,e.memoizedState=c),a.props=i,a.state=c,a.context=h,i=o):(typeof a.componentDidMount=="function"&&(e.flags|=4194308),i=!1)}else{a=e.stateNode,c_(t,e),o=e.memoizedProps,h=e.type===e.elementType?o:Gn(e.type,o),a.props=h,f=e.pendingProps,p=a.context,c=n.contextType,typeof c=="object"&&c!==null?c=kn(c):(c=un(n)?Pr:Yt.current,c=Ps(e,c));var m=n.getDerivedStateFromProps;(u=typeof m=="function"||typeof a.getSnapshotBeforeUpdate=="function")||typeof a.UNSAFE_componentWillReceiveProps!="function"&&typeof a.componentWillReceiveProps!="function"||(o!==f||p!==c)&&pp(e,a,i,c),ji=!1,p=e.memoizedState,a.state=p,Nl(e,i,a,r);var S=e.memoizedState;o!==f||p!==S||cn.current||ji?(typeof m=="function"&&(nd(e,n,m,i),S=e.memoizedState),(h=ji||fp(e,n,h,i,p,S,c)||!1)?(u||typeof a.UNSAFE_componentWillUpdate!="function"&&typeof a.componentWillUpdate!="function"||(typeof a.componentWillUpdate=="function"&&a.componentWillUpdate(i,S,c),typeof a.UNSAFE_componentWillUpdate=="function"&&a.UNSAFE_componentWillUpdate(i,S,c)),typeof a.componentDidUpdate=="function"&&(e.flags|=4),typeof a.getSnapshotBeforeUpdate=="function"&&(e.flags|=1024)):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&p===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&p===t.memoizedState||(e.flags|=1024),e.memoizedProps=i,e.memoizedState=S),a.props=i,a.state=S,a.context=c,i=h):(typeof a.componentDidUpdate!="function"||o===t.memoizedProps&&p===t.memoizedState||(e.flags|=4),typeof a.getSnapshotBeforeUpdate!="function"||o===t.memoizedProps&&p===t.memoizedState||(e.flags|=1024),i=!1)}return ad(t,e,n,i,s,r)}function ad(t,e,n,i,r,s){U_(t,e);var a=(e.flags&128)!==0;if(!i&&!a)return r&&sp(e,n,!1),Ti(t,e,s);i=e.stateNode,ey.current=e;var o=a&&typeof n.getDerivedStateFromError!="function"?null:i.render();return e.flags|=1,t!==null&&a?(e.child=Ls(e,t.child,null,s),e.child=Ls(e,null,o,s)):Zt(t,e,o,s),e.memoizedState=i.state,r&&sp(e,n,!0),e.child}function F_(t){var e=t.stateNode;e.pendingContext?rp(t,e.pendingContext,e.pendingContext!==e.context):e.context&&rp(t,e.context,!1),Uh(t,e.containerInfo)}function Sp(t,e,n,i,r){return Ns(),Rh(r),e.flags|=256,Zt(t,e,n,i),e.child}var od={dehydrated:null,treeContext:null,retryLane:0};function ld(t){return{baseLanes:t,cachePool:null,transitions:null}}function k_(t,e,n){var i=e.pendingProps,r=pt.current,s=!1,a=(e.flags&128)!==0,o;if((o=a)||(o=t!==null&&t.memoizedState===null?!1:(r&2)!==0),o?(s=!0,e.flags&=-129):(t===null||t.memoizedState!==null)&&(r|=1),ot(pt,r&1),t===null)return ed(e),t=e.memoizedState,t!==null&&(t=t.dehydrated,t!==null)?(e.mode&1?t.data==="$!"?e.lanes=8:e.lanes=1073741824:e.lanes=1,null):(a=i.children,t=i.fallback,s?(i=e.mode,s=e.child,a={mode:"hidden",children:a},!(i&1)&&s!==null?(s.childLanes=0,s.pendingProps=a):s=ac(a,i,0,null),t=Rr(t,i,n,null),s.return=e,t.return=e,s.sibling=t,e.child=s,e.child.memoizedState=ld(n),e.memoizedState=od,t):Vh(e,a));if(r=t.memoizedState,r!==null&&(o=r.dehydrated,o!==null))return ty(t,e,a,i,o,r,n);if(s){s=i.fallback,a=e.mode,r=t.child,o=r.sibling;var c={mode:"hidden",children:i.children};return!(a&1)&&e.child!==r?(i=e.child,i.childLanes=0,i.pendingProps=c,e.deletions=null):(i=er(r,c),i.subtreeFlags=r.subtreeFlags&14680064),o!==null?s=er(o,s):(s=Rr(s,a,n,null),s.flags|=2),s.return=e,i.return=e,i.sibling=s,e.child=i,i=s,s=e.child,a=t.child.memoizedState,a=a===null?ld(n):{baseLanes:a.baseLanes|n,cachePool:null,transitions:a.transitions},s.memoizedState=a,s.childLanes=t.childLanes&~n,e.memoizedState=od,i}return s=t.child,t=s.sibling,i=er(s,{mode:"visible",children:i.children}),!(e.mode&1)&&(i.lanes=n),i.return=e,i.sibling=null,t!==null&&(n=e.deletions,n===null?(e.deletions=[t],e.flags|=16):n.push(t)),e.child=i,e.memoizedState=null,i}function Vh(t,e){return e=ac({mode:"visible",children:e},t.mode,0,null),e.return=t,t.child=e}function xo(t,e,n,i){return i!==null&&Rh(i),Ls(e,t.child,null,n),t=Vh(e,e.pendingProps.children),t.flags|=2,e.memoizedState=null,t}function ty(t,e,n,i,r,s,a){if(n)return e.flags&256?(e.flags&=-257,i=Vc(Error(oe(422))),xo(t,e,a,i)):e.memoizedState!==null?(e.child=t.child,e.flags|=128,null):(s=i.fallback,r=e.mode,i=ac({mode:"visible",children:i.children},r,0,null),s=Rr(s,r,a,null),s.flags|=2,i.return=e,s.return=e,i.sibling=s,e.child=i,e.mode&1&&Ls(e,t.child,null,a),e.child.memoizedState=ld(a),e.memoizedState=od,s);if(!(e.mode&1))return xo(t,e,a,null);if(r.data==="$!"){if(i=r.nextSibling&&r.nextSibling.dataset,i)var o=i.dgst;return i=o,s=Error(oe(419)),i=Vc(s,i,void 0),xo(t,e,a,i)}if(o=(a&t.childLanes)!==0,ln||o){if(i=kt,i!==null){switch(a&-a){case 4:r=2;break;case 16:r=8;break;case 64:case 128:case 256:case 512:case 1024:case 2048:case 4096:case 8192:case 16384:case 32768:case 65536:case 131072:case 262144:case 524288:case 1048576:case 2097152:case 4194304:case 8388608:case 16777216:case 33554432:case 67108864:r=32;break;case 536870912:r=268435456;break;default:r=0}r=r&(i.suspendedLanes|a)?0:r,r!==0&&r!==s.retryLane&&(s.retryLane=r,wi(t,r),Zn(i,t,r,-1))}return Yh(),i=Vc(Error(oe(421))),xo(t,e,a,i)}return r.data==="$?"?(e.flags|=128,e.child=t.child,e=py.bind(null,t),r._reactRetry=e,null):(t=s.treeContext,Sn=Ki(r.nextSibling),En=e,ft=!0,Xn=null,t!==null&&(Pn[Nn++]=_i,Pn[Nn++]=vi,Pn[Nn++]=Nr,_i=t.id,vi=t.overflow,Nr=e),e=Vh(e,i.children),e.flags|=4096,e)}function Mp(t,e,n){t.lanes|=e;var i=t.alternate;i!==null&&(i.lanes|=e),td(t.return,e,n)}function Gc(t,e,n,i,r){var s=t.memoizedState;s===null?t.memoizedState={isBackwards:e,rendering:null,renderingStartTime:0,last:i,tail:n,tailMode:r}:(s.isBackwards=e,s.rendering=null,s.renderingStartTime=0,s.last=i,s.tail=n,s.tailMode=r)}function O_(t,e,n){var i=e.pendingProps,r=i.revealOrder,s=i.tail;if(Zt(t,e,i.children,n),i=pt.current,i&2)i=i&1|2,e.flags|=128;else{if(t!==null&&t.flags&128)e:for(t=e.child;t!==null;){if(t.tag===13)t.memoizedState!==null&&Mp(t,n,e);else if(t.tag===19)Mp(t,n,e);else if(t.child!==null){t.child.return=t,t=t.child;continue}if(t===e)break e;for(;t.sibling===null;){if(t.return===null||t.return===e)break e;t=t.return}t.sibling.return=t.return,t=t.sibling}i&=1}if(ot(pt,i),!(e.mode&1))e.memoizedState=null;else switch(r){case"forwards":for(n=e.child,r=null;n!==null;)t=n.alternate,t!==null&&Ll(t)===null&&(r=n),n=n.sibling;n=r,n===null?(r=e.child,e.child=null):(r=n.sibling,n.sibling=null),Gc(e,!1,r,n,s);break;case"backwards":for(n=null,r=e.child,e.child=null;r!==null;){if(t=r.alternate,t!==null&&Ll(t)===null){e.child=r;break}t=r.sibling,r.sibling=n,n=r,r=t}Gc(e,!0,n,null,s);break;case"together":Gc(e,!1,null,null,void 0);break;default:e.memoizedState=null}return e.child}function il(t,e){!(e.mode&1)&&t!==null&&(t.alternate=null,e.alternate=null,e.flags|=2)}function Ti(t,e,n){if(t!==null&&(e.dependencies=t.dependencies),Dr|=e.lanes,!(n&e.childLanes))return null;if(t!==null&&e.child!==t.child)throw Error(oe(153));if(e.child!==null){for(t=e.child,n=er(t,t.pendingProps),e.child=n,n.return=e;t.sibling!==null;)t=t.sibling,n=n.sibling=er(t,t.pendingProps),n.return=e;n.sibling=null}return e.child}function ny(t,e,n){switch(e.tag){case 3:F_(e),Ns();break;case 5:u_(e);break;case 1:un(e.type)&&Cl(e);break;case 4:Uh(e,e.stateNode.containerInfo);break;case 10:var i=e.type._context,r=e.memoizedProps.value;ot(Rl,i._currentValue),i._currentValue=r;break;case 13:if(i=e.memoizedState,i!==null)return i.dehydrated!==null?(ot(pt,pt.current&1),e.flags|=128,null):n&e.child.childLanes?k_(t,e,n):(ot(pt,pt.current&1),t=Ti(t,e,n),t!==null?t.sibling:null);ot(pt,pt.current&1);break;case 19:if(i=(n&e.childLanes)!==0,t.flags&128){if(i)return O_(t,e,n);e.flags|=128}if(r=e.memoizedState,r!==null&&(r.rendering=null,r.tail=null,r.lastEffect=null),ot(pt,pt.current),i)break;return null;case 22:case 23:return e.lanes=0,I_(t,e,n)}return Ti(t,e,n)}var j_,cd,z_,B_;j_=function(t,e){for(var n=e.child;n!==null;){if(n.tag===5||n.tag===6)t.appendChild(n.stateNode);else if(n.tag!==4&&n.child!==null){n.child.return=n,n=n.child;continue}if(n===e)break;for(;n.sibling===null;){if(n.return===null||n.return===e)return;n=n.return}n.sibling.return=n.return,n=n.sibling}};cd=function(){};z_=function(t,e,n,i){var r=t.memoizedProps;if(r!==i){t=e.stateNode,Tr(si.current);var s=null;switch(n){case"input":r=Nu(t,r),i=Nu(t,i),s=[];break;case"select":r=vt({},r,{value:void 0}),i=vt({},i,{value:void 0}),s=[];break;case"textarea":r=Iu(t,r),i=Iu(t,i),s=[];break;default:typeof r.onClick!="function"&&typeof i.onClick=="function"&&(t.onclick=wl)}Fu(n,i);var a;n=null;for(h in r)if(!i.hasOwnProperty(h)&&r.hasOwnProperty(h)&&r[h]!=null)if(h==="style"){var o=r[h];for(a in o)o.hasOwnProperty(a)&&(n||(n={}),n[a]="")}else h!=="dangerouslySetInnerHTML"&&h!=="children"&&h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&h!=="autoFocus"&&(Na.hasOwnProperty(h)?s||(s=[]):(s=s||[]).push(h,null));for(h in i){var c=i[h];if(o=r!=null?r[h]:void 0,i.hasOwnProperty(h)&&c!==o&&(c!=null||o!=null))if(h==="style")if(o){for(a in o)!o.hasOwnProperty(a)||c&&c.hasOwnProperty(a)||(n||(n={}),n[a]="");for(a in c)c.hasOwnProperty(a)&&o[a]!==c[a]&&(n||(n={}),n[a]=c[a])}else n||(s||(s=[]),s.push(h,n)),n=c;else h==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,o=o?o.__html:void 0,c!=null&&o!==c&&(s=s||[]).push(h,c)):h==="children"?typeof c!="string"&&typeof c!="number"||(s=s||[]).push(h,""+c):h!=="suppressContentEditableWarning"&&h!=="suppressHydrationWarning"&&(Na.hasOwnProperty(h)?(c!=null&&h==="onScroll"&&ut("scroll",t),s||o===c||(s=[])):(s=s||[]).push(h,c))}n&&(s=s||[]).push("style",n);var h=s;(e.updateQueue=h)&&(e.flags|=4)}};B_=function(t,e,n,i){n!==i&&(e.flags|=4)};function ta(t,e){if(!ft)switch(t.tailMode){case"hidden":e=t.tail;for(var n=null;e!==null;)e.alternate!==null&&(n=e),e=e.sibling;n===null?t.tail=null:n.sibling=null;break;case"collapsed":n=t.tail;for(var i=null;n!==null;)n.alternate!==null&&(i=n),n=n.sibling;i===null?e||t.tail===null?t.tail=null:t.tail.sibling=null:i.sibling=null}}function Gt(t){var e=t.alternate!==null&&t.alternate.child===t.child,n=0,i=0;if(e)for(var r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags&14680064,i|=r.flags&14680064,r.return=t,r=r.sibling;else for(r=t.child;r!==null;)n|=r.lanes|r.childLanes,i|=r.subtreeFlags,i|=r.flags,r.return=t,r=r.sibling;return t.subtreeFlags|=i,t.childLanes=n,e}function iy(t,e,n){var i=e.pendingProps;switch(Ah(e),e.tag){case 2:case 16:case 15:case 0:case 11:case 7:case 8:case 12:case 9:case 14:return Gt(e),null;case 1:return un(e.type)&&Tl(),Gt(e),null;case 3:return i=e.stateNode,Ds(),ht(cn),ht(Yt),kh(),i.pendingContext&&(i.context=i.pendingContext,i.pendingContext=null),(t===null||t.child===null)&&(_o(e)?e.flags|=4:t===null||t.memoizedState.isDehydrated&&!(e.flags&256)||(e.flags|=1024,Xn!==null&&(_d(Xn),Xn=null))),cd(t,e),Gt(e),null;case 5:Fh(e);var r=Tr(Va.current);if(n=e.type,t!==null&&e.stateNode!=null)z_(t,e,n,i,r),t.ref!==e.ref&&(e.flags|=512,e.flags|=2097152);else{if(!i){if(e.stateNode===null)throw Error(oe(166));return Gt(e),null}if(t=Tr(si.current),_o(e)){i=e.stateNode,n=e.type;var s=e.memoizedProps;switch(i[ii]=e,i[Ba]=s,t=(e.mode&1)!==0,n){case"dialog":ut("cancel",i),ut("close",i);break;case"iframe":case"object":case"embed":ut("load",i);break;case"video":case"audio":for(r=0;r<va.length;r++)ut(va[r],i);break;case"source":ut("error",i);break;case"img":case"image":case"link":ut("error",i),ut("load",i);break;case"details":ut("toggle",i);break;case"input":Nf(i,s),ut("invalid",i);break;case"select":i._wrapperState={wasMultiple:!!s.multiple},ut("invalid",i);break;case"textarea":Df(i,s),ut("invalid",i)}Fu(n,s),r=null;for(var a in s)if(s.hasOwnProperty(a)){var o=s[a];a==="children"?typeof o=="string"?i.textContent!==o&&(s.suppressHydrationWarning!==!0&&go(i.textContent,o,t),r=["children",o]):typeof o=="number"&&i.textContent!==""+o&&(s.suppressHydrationWarning!==!0&&go(i.textContent,o,t),r=["children",""+o]):Na.hasOwnProperty(a)&&o!=null&&a==="onScroll"&&ut("scroll",i)}switch(n){case"input":oo(i),Lf(i,s,!0);break;case"textarea":oo(i),If(i);break;case"select":case"option":break;default:typeof s.onClick=="function"&&(i.onclick=wl)}i=r,e.updateQueue=i,i!==null&&(e.flags|=4)}else{a=r.nodeType===9?r:r.ownerDocument,t==="http://www.w3.org/1999/xhtml"&&(t=mg(n)),t==="http://www.w3.org/1999/xhtml"?n==="script"?(t=a.createElement("div"),t.innerHTML="<script><\/script>",t=t.removeChild(t.firstChild)):typeof i.is=="string"?t=a.createElement(n,{is:i.is}):(t=a.createElement(n),n==="select"&&(a=t,i.multiple?a.multiple=!0:i.size&&(a.size=i.size))):t=a.createElementNS(t,n),t[ii]=e,t[Ba]=i,j_(t,e,!1,!1),e.stateNode=t;e:{switch(a=ku(n,i),n){case"dialog":ut("cancel",t),ut("close",t),r=i;break;case"iframe":case"object":case"embed":ut("load",t),r=i;break;case"video":case"audio":for(r=0;r<va.length;r++)ut(va[r],t);r=i;break;case"source":ut("error",t),r=i;break;case"img":case"image":case"link":ut("error",t),ut("load",t),r=i;break;case"details":ut("toggle",t),r=i;break;case"input":Nf(t,i),r=Nu(t,i),ut("invalid",t);break;case"option":r=i;break;case"select":t._wrapperState={wasMultiple:!!i.multiple},r=vt({},i,{value:void 0}),ut("invalid",t);break;case"textarea":Df(t,i),r=Iu(t,i),ut("invalid",t);break;default:r=i}Fu(n,r),o=r;for(s in o)if(o.hasOwnProperty(s)){var c=o[s];s==="style"?vg(t,c):s==="dangerouslySetInnerHTML"?(c=c?c.__html:void 0,c!=null&&gg(t,c)):s==="children"?typeof c=="string"?(n!=="textarea"||c!=="")&&La(t,c):typeof c=="number"&&La(t,""+c):s!=="suppressContentEditableWarning"&&s!=="suppressHydrationWarning"&&s!=="autoFocus"&&(Na.hasOwnProperty(s)?c!=null&&s==="onScroll"&&ut("scroll",t):c!=null&&fh(t,s,c,a))}switch(n){case"input":oo(t),Lf(t,i,!1);break;case"textarea":oo(t),If(t);break;case"option":i.value!=null&&t.setAttribute("value",""+ir(i.value));break;case"select":t.multiple=!!i.multiple,s=i.value,s!=null?vs(t,!!i.multiple,s,!1):i.defaultValue!=null&&vs(t,!!i.multiple,i.defaultValue,!0);break;default:typeof r.onClick=="function"&&(t.onclick=wl)}switch(n){case"button":case"input":case"select":case"textarea":i=!!i.autoFocus;break e;case"img":i=!0;break e;default:i=!1}}i&&(e.flags|=4)}e.ref!==null&&(e.flags|=512,e.flags|=2097152)}return Gt(e),null;case 6:if(t&&e.stateNode!=null)B_(t,e,t.memoizedProps,i);else{if(typeof i!="string"&&e.stateNode===null)throw Error(oe(166));if(n=Tr(Va.current),Tr(si.current),_o(e)){if(i=e.stateNode,n=e.memoizedProps,i[ii]=e,(s=i.nodeValue!==n)&&(t=En,t!==null))switch(t.tag){case 3:go(i.nodeValue,n,(t.mode&1)!==0);break;case 5:t.memoizedProps.suppressHydrationWarning!==!0&&go(i.nodeValue,n,(t.mode&1)!==0)}s&&(e.flags|=4)}else i=(n.nodeType===9?n:n.ownerDocument).createTextNode(i),i[ii]=e,e.stateNode=i}return Gt(e),null;case 13:if(ht(pt),i=e.memoizedState,t===null||t.memoizedState!==null&&t.memoizedState.dehydrated!==null){if(ft&&Sn!==null&&e.mode&1&&!(e.flags&128))s_(),Ns(),e.flags|=98560,s=!1;else if(s=_o(e),i!==null&&i.dehydrated!==null){if(t===null){if(!s)throw Error(oe(318));if(s=e.memoizedState,s=s!==null?s.dehydrated:null,!s)throw Error(oe(317));s[ii]=e}else Ns(),!(e.flags&128)&&(e.memoizedState=null),e.flags|=4;Gt(e),s=!1}else Xn!==null&&(_d(Xn),Xn=null),s=!0;if(!s)return e.flags&65536?e:null}return e.flags&128?(e.lanes=n,e):(i=i!==null,i!==(t!==null&&t.memoizedState!==null)&&i&&(e.child.flags|=8192,e.mode&1&&(t===null||pt.current&1?Nt===0&&(Nt=3):Yh())),e.updateQueue!==null&&(e.flags|=4),Gt(e),null);case 4:return Ds(),cd(t,e),t===null&&ja(e.stateNode.containerInfo),Gt(e),null;case 10:return Lh(e.type._context),Gt(e),null;case 17:return un(e.type)&&Tl(),Gt(e),null;case 19:if(ht(pt),s=e.memoizedState,s===null)return Gt(e),null;if(i=(e.flags&128)!==0,a=s.rendering,a===null)if(i)ta(s,!1);else{if(Nt!==0||t!==null&&t.flags&128)for(t=e.child;t!==null;){if(a=Ll(t),a!==null){for(e.flags|=128,ta(s,!1),i=a.updateQueue,i!==null&&(e.updateQueue=i,e.flags|=4),e.subtreeFlags=0,i=n,n=e.child;n!==null;)s=n,t=i,s.flags&=14680066,a=s.alternate,a===null?(s.childLanes=0,s.lanes=t,s.child=null,s.subtreeFlags=0,s.memoizedProps=null,s.memoizedState=null,s.updateQueue=null,s.dependencies=null,s.stateNode=null):(s.childLanes=a.childLanes,s.lanes=a.lanes,s.child=a.child,s.subtreeFlags=0,s.deletions=null,s.memoizedProps=a.memoizedProps,s.memoizedState=a.memoizedState,s.updateQueue=a.updateQueue,s.type=a.type,t=a.dependencies,s.dependencies=t===null?null:{lanes:t.lanes,firstContext:t.firstContext}),n=n.sibling;return ot(pt,pt.current&1|2),e.child}t=t.sibling}s.tail!==null&&Et()>Us&&(e.flags|=128,i=!0,ta(s,!1),e.lanes=4194304)}else{if(!i)if(t=Ll(a),t!==null){if(e.flags|=128,i=!0,n=t.updateQueue,n!==null&&(e.updateQueue=n,e.flags|=4),ta(s,!0),s.tail===null&&s.tailMode==="hidden"&&!a.alternate&&!ft)return Gt(e),null}else 2*Et()-s.renderingStartTime>Us&&n!==1073741824&&(e.flags|=128,i=!0,ta(s,!1),e.lanes=4194304);s.isBackwards?(a.sibling=e.child,e.child=a):(n=s.last,n!==null?n.sibling=a:e.child=a,s.last=a)}return s.tail!==null?(e=s.tail,s.rendering=e,s.tail=e.sibling,s.renderingStartTime=Et(),e.sibling=null,n=pt.current,ot(pt,i?n&1|2:n&1),e):(Gt(e),null);case 22:case 23:return qh(),i=e.memoizedState!==null,t!==null&&t.memoizedState!==null!==i&&(e.flags|=8192),i&&e.mode&1?xn&1073741824&&(Gt(e),e.subtreeFlags&6&&(e.flags|=8192)):Gt(e),null;case 24:return null;case 25:return null}throw Error(oe(156,e.tag))}function ry(t,e){switch(Ah(e),e.tag){case 1:return un(e.type)&&Tl(),t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 3:return Ds(),ht(cn),ht(Yt),kh(),t=e.flags,t&65536&&!(t&128)?(e.flags=t&-65537|128,e):null;case 5:return Fh(e),null;case 13:if(ht(pt),t=e.memoizedState,t!==null&&t.dehydrated!==null){if(e.alternate===null)throw Error(oe(340));Ns()}return t=e.flags,t&65536?(e.flags=t&-65537|128,e):null;case 19:return ht(pt),null;case 4:return Ds(),null;case 10:return Lh(e.type._context),null;case 22:case 23:return qh(),null;case 24:return null;default:return null}}var yo=!1,$t=!1,sy=typeof WeakSet=="function"?WeakSet:Set,ye=null;function ps(t,e){var n=t.ref;if(n!==null)if(typeof n=="function")try{n(null)}catch(i){yt(t,e,i)}else n.current=null}function ud(t,e,n){try{n()}catch(i){yt(t,e,i)}}var Ep=!1;function ay(t,e){if($u=Sl,t=Xg(),Ch(t)){if("selectionStart"in t)var n={start:t.selectionStart,end:t.selectionEnd};else e:{n=(n=t.ownerDocument)&&n.defaultView||window;var i=n.getSelection&&n.getSelection();if(i&&i.rangeCount!==0){n=i.anchorNode;var r=i.anchorOffset,s=i.focusNode;i=i.focusOffset;try{n.nodeType,s.nodeType}catch{n=null;break e}var a=0,o=-1,c=-1,h=0,u=0,f=t,p=null;t:for(;;){for(var m;f!==n||r!==0&&f.nodeType!==3||(o=a+r),f!==s||i!==0&&f.nodeType!==3||(c=a+i),f.nodeType===3&&(a+=f.nodeValue.length),(m=f.firstChild)!==null;)p=f,f=m;for(;;){if(f===t)break t;if(p===n&&++h===r&&(o=a),p===s&&++u===i&&(c=a),(m=f.nextSibling)!==null)break;f=p,p=f.parentNode}f=m}n=o===-1||c===-1?null:{start:o,end:c}}else n=null}n=n||{start:0,end:0}}else n=null;for(qu={focusedElem:t,selectionRange:n},Sl=!1,ye=e;ye!==null;)if(e=ye,t=e.child,(e.subtreeFlags&1028)!==0&&t!==null)t.return=e,ye=t;else for(;ye!==null;){e=ye;try{var S=e.alternate;if(e.flags&1024)switch(e.tag){case 0:case 11:case 15:break;case 1:if(S!==null){var x=S.memoizedProps,g=S.memoizedState,d=e.stateNode,_=d.getSnapshotBeforeUpdate(e.elementType===e.type?x:Gn(e.type,x),g);d.__reactInternalSnapshotBeforeUpdate=_}break;case 3:var y=e.stateNode.containerInfo;y.nodeType===1?y.textContent="":y.nodeType===9&&y.documentElement&&y.removeChild(y.documentElement);break;case 5:case 6:case 4:case 17:break;default:throw Error(oe(163))}}catch(E){yt(e,e.return,E)}if(t=e.sibling,t!==null){t.return=e.return,ye=t;break}ye=e.return}return S=Ep,Ep=!1,S}function Aa(t,e,n){var i=e.updateQueue;if(i=i!==null?i.lastEffect:null,i!==null){var r=i=i.next;do{if((r.tag&t)===t){var s=r.destroy;r.destroy=void 0,s!==void 0&&ud(e,n,s)}r=r.next}while(r!==i)}}function rc(t,e){if(e=e.updateQueue,e=e!==null?e.lastEffect:null,e!==null){var n=e=e.next;do{if((n.tag&t)===t){var i=n.create;n.destroy=i()}n=n.next}while(n!==e)}}function dd(t){var e=t.ref;if(e!==null){var n=t.stateNode;switch(t.tag){case 5:t=n;break;default:t=n}typeof e=="function"?e(t):e.current=t}}function H_(t){var e=t.alternate;e!==null&&(t.alternate=null,H_(e)),t.child=null,t.deletions=null,t.sibling=null,t.tag===5&&(e=t.stateNode,e!==null&&(delete e[ii],delete e[Ba],delete e[Zu],delete e[H0],delete e[V0])),t.stateNode=null,t.return=null,t.dependencies=null,t.memoizedProps=null,t.memoizedState=null,t.pendingProps=null,t.stateNode=null,t.updateQueue=null}function V_(t){return t.tag===5||t.tag===3||t.tag===4}function wp(t){e:for(;;){for(;t.sibling===null;){if(t.return===null||V_(t.return))return null;t=t.return}for(t.sibling.return=t.return,t=t.sibling;t.tag!==5&&t.tag!==6&&t.tag!==18;){if(t.flags&2||t.child===null||t.tag===4)continue e;t.child.return=t,t=t.child}if(!(t.flags&2))return t.stateNode}}function hd(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.nodeType===8?n.parentNode.insertBefore(t,e):n.insertBefore(t,e):(n.nodeType===8?(e=n.parentNode,e.insertBefore(t,n)):(e=n,e.appendChild(t)),n=n._reactRootContainer,n!=null||e.onclick!==null||(e.onclick=wl));else if(i!==4&&(t=t.child,t!==null))for(hd(t,e,n),t=t.sibling;t!==null;)hd(t,e,n),t=t.sibling}function fd(t,e,n){var i=t.tag;if(i===5||i===6)t=t.stateNode,e?n.insertBefore(t,e):n.appendChild(t);else if(i!==4&&(t=t.child,t!==null))for(fd(t,e,n),t=t.sibling;t!==null;)fd(t,e,n),t=t.sibling}var zt=null,Wn=!1;function Pi(t,e,n){for(n=n.child;n!==null;)G_(t,e,n),n=n.sibling}function G_(t,e,n){if(ri&&typeof ri.onCommitFiberUnmount=="function")try{ri.onCommitFiberUnmount(Kl,n)}catch{}switch(n.tag){case 5:$t||ps(n,e);case 6:var i=zt,r=Wn;zt=null,Pi(t,e,n),zt=i,Wn=r,zt!==null&&(Wn?(t=zt,n=n.stateNode,t.nodeType===8?t.parentNode.removeChild(n):t.removeChild(n)):zt.removeChild(n.stateNode));break;case 18:zt!==null&&(Wn?(t=zt,n=n.stateNode,t.nodeType===8?kc(t.parentNode,n):t.nodeType===1&&kc(t,n),Fa(t)):kc(zt,n.stateNode));break;case 4:i=zt,r=Wn,zt=n.stateNode.containerInfo,Wn=!0,Pi(t,e,n),zt=i,Wn=r;break;case 0:case 11:case 14:case 15:if(!$t&&(i=n.updateQueue,i!==null&&(i=i.lastEffect,i!==null))){r=i=i.next;do{var s=r,a=s.destroy;s=s.tag,a!==void 0&&(s&2||s&4)&&ud(n,e,a),r=r.next}while(r!==i)}Pi(t,e,n);break;case 1:if(!$t&&(ps(n,e),i=n.stateNode,typeof i.componentWillUnmount=="function"))try{i.props=n.memoizedProps,i.state=n.memoizedState,i.componentWillUnmount()}catch(o){yt(n,e,o)}Pi(t,e,n);break;case 21:Pi(t,e,n);break;case 22:n.mode&1?($t=(i=$t)||n.memoizedState!==null,Pi(t,e,n),$t=i):Pi(t,e,n);break;default:Pi(t,e,n)}}function Tp(t){var e=t.updateQueue;if(e!==null){t.updateQueue=null;var n=t.stateNode;n===null&&(n=t.stateNode=new sy),e.forEach(function(i){var r=my.bind(null,t,i);n.has(i)||(n.add(i),i.then(r,r))})}}function zn(t,e){var n=e.deletions;if(n!==null)for(var i=0;i<n.length;i++){var r=n[i];try{var s=t,a=e,o=a;e:for(;o!==null;){switch(o.tag){case 5:zt=o.stateNode,Wn=!1;break e;case 3:zt=o.stateNode.containerInfo,Wn=!0;break e;case 4:zt=o.stateNode.containerInfo,Wn=!0;break e}o=o.return}if(zt===null)throw Error(oe(160));G_(s,a,r),zt=null,Wn=!1;var c=r.alternate;c!==null&&(c.return=null),r.return=null}catch(h){yt(r,e,h)}}if(e.subtreeFlags&12854)for(e=e.child;e!==null;)W_(e,t),e=e.sibling}function W_(t,e){var n=t.alternate,i=t.flags;switch(t.tag){case 0:case 11:case 14:case 15:if(zn(e,t),Jn(t),i&4){try{Aa(3,t,t.return),rc(3,t)}catch(x){yt(t,t.return,x)}try{Aa(5,t,t.return)}catch(x){yt(t,t.return,x)}}break;case 1:zn(e,t),Jn(t),i&512&&n!==null&&ps(n,n.return);break;case 5:if(zn(e,t),Jn(t),i&512&&n!==null&&ps(n,n.return),t.flags&32){var r=t.stateNode;try{La(r,"")}catch(x){yt(t,t.return,x)}}if(i&4&&(r=t.stateNode,r!=null)){var s=t.memoizedProps,a=n!==null?n.memoizedProps:s,o=t.type,c=t.updateQueue;if(t.updateQueue=null,c!==null)try{o==="input"&&s.type==="radio"&&s.name!=null&&fg(r,s),ku(o,a);var h=ku(o,s);for(a=0;a<c.length;a+=2){var u=c[a],f=c[a+1];u==="style"?vg(r,f):u==="dangerouslySetInnerHTML"?gg(r,f):u==="children"?La(r,f):fh(r,u,f,h)}switch(o){case"input":Lu(r,s);break;case"textarea":pg(r,s);break;case"select":var p=r._wrapperState.wasMultiple;r._wrapperState.wasMultiple=!!s.multiple;var m=s.value;m!=null?vs(r,!!s.multiple,m,!1):p!==!!s.multiple&&(s.defaultValue!=null?vs(r,!!s.multiple,s.defaultValue,!0):vs(r,!!s.multiple,s.multiple?[]:"",!1))}r[Ba]=s}catch(x){yt(t,t.return,x)}}break;case 6:if(zn(e,t),Jn(t),i&4){if(t.stateNode===null)throw Error(oe(162));r=t.stateNode,s=t.memoizedProps;try{r.nodeValue=s}catch(x){yt(t,t.return,x)}}break;case 3:if(zn(e,t),Jn(t),i&4&&n!==null&&n.memoizedState.isDehydrated)try{Fa(e.containerInfo)}catch(x){yt(t,t.return,x)}break;case 4:zn(e,t),Jn(t);break;case 13:zn(e,t),Jn(t),r=t.child,r.flags&8192&&(s=r.memoizedState!==null,r.stateNode.isHidden=s,!s||r.alternate!==null&&r.alternate.memoizedState!==null||(Xh=Et())),i&4&&Tp(t);break;case 22:if(u=n!==null&&n.memoizedState!==null,t.mode&1?($t=(h=$t)||u,zn(e,t),$t=h):zn(e,t),Jn(t),i&8192){if(h=t.memoizedState!==null,(t.stateNode.isHidden=h)&&!u&&t.mode&1)for(ye=t,u=t.child;u!==null;){for(f=ye=u;ye!==null;){switch(p=ye,m=p.child,p.tag){case 0:case 11:case 14:case 15:Aa(4,p,p.return);break;case 1:ps(p,p.return);var S=p.stateNode;if(typeof S.componentWillUnmount=="function"){i=p,n=p.return;try{e=i,S.props=e.memoizedProps,S.state=e.memoizedState,S.componentWillUnmount()}catch(x){yt(i,n,x)}}break;case 5:ps(p,p.return);break;case 22:if(p.memoizedState!==null){bp(f);continue}}m!==null?(m.return=p,ye=m):bp(f)}u=u.sibling}e:for(u=null,f=t;;){if(f.tag===5){if(u===null){u=f;try{r=f.stateNode,h?(s=r.style,typeof s.setProperty=="function"?s.setProperty("display","none","important"):s.display="none"):(o=f.stateNode,c=f.memoizedProps.style,a=c!=null&&c.hasOwnProperty("display")?c.display:null,o.style.display=_g("display",a))}catch(x){yt(t,t.return,x)}}}else if(f.tag===6){if(u===null)try{f.stateNode.nodeValue=h?"":f.memoizedProps}catch(x){yt(t,t.return,x)}}else if((f.tag!==22&&f.tag!==23||f.memoizedState===null||f===t)&&f.child!==null){f.child.return=f,f=f.child;continue}if(f===t)break e;for(;f.sibling===null;){if(f.return===null||f.return===t)break e;u===f&&(u=null),f=f.return}u===f&&(u=null),f.sibling.return=f.return,f=f.sibling}}break;case 19:zn(e,t),Jn(t),i&4&&Tp(t);break;case 21:break;default:zn(e,t),Jn(t)}}function Jn(t){var e=t.flags;if(e&2){try{e:{for(var n=t.return;n!==null;){if(V_(n)){var i=n;break e}n=n.return}throw Error(oe(160))}switch(i.tag){case 5:var r=i.stateNode;i.flags&32&&(La(r,""),i.flags&=-33);var s=wp(t);fd(t,s,r);break;case 3:case 4:var a=i.stateNode.containerInfo,o=wp(t);hd(t,o,a);break;default:throw Error(oe(161))}}catch(c){yt(t,t.return,c)}t.flags&=-3}e&4096&&(t.flags&=-4097)}function oy(t,e,n){ye=t,X_(t)}function X_(t,e,n){for(var i=(t.mode&1)!==0;ye!==null;){var r=ye,s=r.child;if(r.tag===22&&i){var a=r.memoizedState!==null||yo;if(!a){var o=r.alternate,c=o!==null&&o.memoizedState!==null||$t;o=yo;var h=$t;if(yo=a,($t=c)&&!h)for(ye=r;ye!==null;)a=ye,c=a.child,a.tag===22&&a.memoizedState!==null?Ap(r):c!==null?(c.return=a,ye=c):Ap(r);for(;s!==null;)ye=s,X_(s),s=s.sibling;ye=r,yo=o,$t=h}Cp(t)}else r.subtreeFlags&8772&&s!==null?(s.return=r,ye=s):Cp(t)}}function Cp(t){for(;ye!==null;){var e=ye;if(e.flags&8772){var n=e.alternate;try{if(e.flags&8772)switch(e.tag){case 0:case 11:case 15:$t||rc(5,e);break;case 1:var i=e.stateNode;if(e.flags&4&&!$t)if(n===null)i.componentDidMount();else{var r=e.elementType===e.type?n.memoizedProps:Gn(e.type,n.memoizedProps);i.componentDidUpdate(r,n.memoizedState,i.__reactInternalSnapshotBeforeUpdate)}var s=e.updateQueue;s!==null&&up(e,s,i);break;case 3:var a=e.updateQueue;if(a!==null){if(n=null,e.child!==null)switch(e.child.tag){case 5:n=e.child.stateNode;break;case 1:n=e.child.stateNode}up(e,a,n)}break;case 5:var o=e.stateNode;if(n===null&&e.flags&4){n=o;var c=e.memoizedProps;switch(e.type){case"button":case"input":case"select":case"textarea":c.autoFocus&&n.focus();break;case"img":c.src&&(n.src=c.src)}}break;case 6:break;case 4:break;case 12:break;case 13:if(e.memoizedState===null){var h=e.alternate;if(h!==null){var u=h.memoizedState;if(u!==null){var f=u.dehydrated;f!==null&&Fa(f)}}}break;case 19:case 17:case 21:case 22:case 23:case 25:break;default:throw Error(oe(163))}$t||e.flags&512&&dd(e)}catch(p){yt(e,e.return,p)}}if(e===t){ye=null;break}if(n=e.sibling,n!==null){n.return=e.return,ye=n;break}ye=e.return}}function bp(t){for(;ye!==null;){var e=ye;if(e===t){ye=null;break}var n=e.sibling;if(n!==null){n.return=e.return,ye=n;break}ye=e.return}}function Ap(t){for(;ye!==null;){var e=ye;try{switch(e.tag){case 0:case 11:case 15:var n=e.return;try{rc(4,e)}catch(c){yt(e,n,c)}break;case 1:var i=e.stateNode;if(typeof i.componentDidMount=="function"){var r=e.return;try{i.componentDidMount()}catch(c){yt(e,r,c)}}var s=e.return;try{dd(e)}catch(c){yt(e,s,c)}break;case 5:var a=e.return;try{dd(e)}catch(c){yt(e,a,c)}}}catch(c){yt(e,e.return,c)}if(e===t){ye=null;break}var o=e.sibling;if(o!==null){o.return=e.return,ye=o;break}ye=e.return}}var ly=Math.ceil,Ul=bi.ReactCurrentDispatcher,Gh=bi.ReactCurrentOwner,Fn=bi.ReactCurrentBatchConfig,qe=0,kt=null,bt=null,Bt=0,xn=0,ms=lr(0),Nt=0,$a=null,Dr=0,sc=0,Wh=0,Ra=null,an=null,Xh=0,Us=1/0,mi=null,Fl=!1,pd=null,Qi=null,So=!1,Wi=null,kl=0,Pa=0,md=null,rl=-1,sl=0;function Qt(){return qe&6?Et():rl!==-1?rl:rl=Et()}function Ji(t){return t.mode&1?qe&2&&Bt!==0?Bt&-Bt:W0.transition!==null?(sl===0&&(sl=Pg()),sl):(t=nt,t!==0||(t=window.event,t=t===void 0?16:kg(t.type)),t):1}function Zn(t,e,n,i){if(50<Pa)throw Pa=0,md=null,Error(oe(185));Ka(t,n,i),(!(qe&2)||t!==kt)&&(t===kt&&(!(qe&2)&&(sc|=n),Nt===4&&Hi(t,Bt)),dn(t,i),n===1&&qe===0&&!(e.mode&1)&&(Us=Et()+500,tc&&cr()))}function dn(t,e){var n=t.callbackNode;Wx(t,e);var i=yl(t,t===kt?Bt:0);if(i===0)n!==null&&kf(n),t.callbackNode=null,t.callbackPriority=0;else if(e=i&-i,t.callbackPriority!==e){if(n!=null&&kf(n),e===1)t.tag===0?G0(Rp.bind(null,t)):n_(Rp.bind(null,t)),z0(function(){!(qe&6)&&cr()}),n=null;else{switch(Ng(i)){case 1:n=vh;break;case 4:n=Ag;break;case 16:n=xl;break;case 536870912:n=Rg;break;default:n=xl}n=ev(n,$_.bind(null,t))}t.callbackPriority=e,t.callbackNode=n}}function $_(t,e){if(rl=-1,sl=0,qe&6)throw Error(oe(327));var n=t.callbackNode;if(Es()&&t.callbackNode!==n)return null;var i=yl(t,t===kt?Bt:0);if(i===0)return null;if(i&30||i&t.expiredLanes||e)e=Ol(t,i);else{e=i;var r=qe;qe|=2;var s=Y_();(kt!==t||Bt!==e)&&(mi=null,Us=Et()+500,Ar(t,e));do try{dy();break}catch(o){q_(t,o)}while(!0);Nh(),Ul.current=s,qe=r,bt!==null?e=0:(kt=null,Bt=0,e=Nt)}if(e!==0){if(e===2&&(r=Hu(t),r!==0&&(i=r,e=gd(t,r))),e===1)throw n=$a,Ar(t,0),Hi(t,i),dn(t,Et()),n;if(e===6)Hi(t,i);else{if(r=t.current.alternate,!(i&30)&&!cy(r)&&(e=Ol(t,i),e===2&&(s=Hu(t),s!==0&&(i=s,e=gd(t,s))),e===1))throw n=$a,Ar(t,0),Hi(t,i),dn(t,Et()),n;switch(t.finishedWork=r,t.finishedLanes=i,e){case 0:case 1:throw Error(oe(345));case 2:xr(t,an,mi);break;case 3:if(Hi(t,i),(i&130023424)===i&&(e=Xh+500-Et(),10<e)){if(yl(t,0)!==0)break;if(r=t.suspendedLanes,(r&i)!==i){Qt(),t.pingedLanes|=t.suspendedLanes&r;break}t.timeoutHandle=Ku(xr.bind(null,t,an,mi),e);break}xr(t,an,mi);break;case 4:if(Hi(t,i),(i&4194240)===i)break;for(e=t.eventTimes,r=-1;0<i;){var a=31-Kn(i);s=1<<a,a=e[a],a>r&&(r=a),i&=~s}if(i=r,i=Et()-i,i=(120>i?120:480>i?480:1080>i?1080:1920>i?1920:3e3>i?3e3:4320>i?4320:1960*ly(i/1960))-i,10<i){t.timeoutHandle=Ku(xr.bind(null,t,an,mi),i);break}xr(t,an,mi);break;case 5:xr(t,an,mi);break;default:throw Error(oe(329))}}}return dn(t,Et()),t.callbackNode===n?$_.bind(null,t):null}function gd(t,e){var n=Ra;return t.current.memoizedState.isDehydrated&&(Ar(t,e).flags|=256),t=Ol(t,e),t!==2&&(e=an,an=n,e!==null&&_d(e)),t}function _d(t){an===null?an=t:an.push.apply(an,t)}function cy(t){for(var e=t;;){if(e.flags&16384){var n=e.updateQueue;if(n!==null&&(n=n.stores,n!==null))for(var i=0;i<n.length;i++){var r=n[i],s=r.getSnapshot;r=r.value;try{if(!Qn(s(),r))return!1}catch{return!1}}}if(n=e.child,e.subtreeFlags&16384&&n!==null)n.return=e,e=n;else{if(e===t)break;for(;e.sibling===null;){if(e.return===null||e.return===t)return!0;e=e.return}e.sibling.return=e.return,e=e.sibling}}return!0}function Hi(t,e){for(e&=~Wh,e&=~sc,t.suspendedLanes|=e,t.pingedLanes&=~e,t=t.expirationTimes;0<e;){var n=31-Kn(e),i=1<<n;t[n]=-1,e&=~i}}function Rp(t){if(qe&6)throw Error(oe(327));Es();var e=yl(t,0);if(!(e&1))return dn(t,Et()),null;var n=Ol(t,e);if(t.tag!==0&&n===2){var i=Hu(t);i!==0&&(e=i,n=gd(t,i))}if(n===1)throw n=$a,Ar(t,0),Hi(t,e),dn(t,Et()),n;if(n===6)throw Error(oe(345));return t.finishedWork=t.current.alternate,t.finishedLanes=e,xr(t,an,mi),dn(t,Et()),null}function $h(t,e){var n=qe;qe|=1;try{return t(e)}finally{qe=n,qe===0&&(Us=Et()+500,tc&&cr())}}function Ir(t){Wi!==null&&Wi.tag===0&&!(qe&6)&&Es();var e=qe;qe|=1;var n=Fn.transition,i=nt;try{if(Fn.transition=null,nt=1,t)return t()}finally{nt=i,Fn.transition=n,qe=e,!(qe&6)&&cr()}}function qh(){xn=ms.current,ht(ms)}function Ar(t,e){t.finishedWork=null,t.finishedLanes=0;var n=t.timeoutHandle;if(n!==-1&&(t.timeoutHandle=-1,j0(n)),bt!==null)for(n=bt.return;n!==null;){var i=n;switch(Ah(i),i.tag){case 1:i=i.type.childContextTypes,i!=null&&Tl();break;case 3:Ds(),ht(cn),ht(Yt),kh();break;case 5:Fh(i);break;case 4:Ds();break;case 13:ht(pt);break;case 19:ht(pt);break;case 10:Lh(i.type._context);break;case 22:case 23:qh()}n=n.return}if(kt=t,bt=t=er(t.current,null),Bt=xn=e,Nt=0,$a=null,Wh=sc=Dr=0,an=Ra=null,wr!==null){for(e=0;e<wr.length;e++)if(n=wr[e],i=n.interleaved,i!==null){n.interleaved=null;var r=i.next,s=n.pending;if(s!==null){var a=s.next;s.next=r,i.next=a}n.pending=i}wr=null}return t}function q_(t,e){do{var n=bt;try{if(Nh(),tl.current=Il,Dl){for(var i=gt.memoizedState;i!==null;){var r=i.queue;r!==null&&(r.pending=null),i=i.next}Dl=!1}if(Lr=0,Ft=Pt=gt=null,ba=!1,Ga=0,Gh.current=null,n===null||n.return===null){Nt=1,$a=e,bt=null;break}e:{var s=t,a=n.return,o=n,c=e;if(e=Bt,o.flags|=32768,c!==null&&typeof c=="object"&&typeof c.then=="function"){var h=c,u=o,f=u.tag;if(!(u.mode&1)&&(f===0||f===11||f===15)){var p=u.alternate;p?(u.updateQueue=p.updateQueue,u.memoizedState=p.memoizedState,u.lanes=p.lanes):(u.updateQueue=null,u.memoizedState=null)}var m=gp(a);if(m!==null){m.flags&=-257,_p(m,a,o,s,e),m.mode&1&&mp(s,h,e),e=m,c=h;var S=e.updateQueue;if(S===null){var x=new Set;x.add(c),e.updateQueue=x}else S.add(c);break e}else{if(!(e&1)){mp(s,h,e),Yh();break e}c=Error(oe(426))}}else if(ft&&o.mode&1){var g=gp(a);if(g!==null){!(g.flags&65536)&&(g.flags|=256),_p(g,a,o,s,e),Rh(Is(c,o));break e}}s=c=Is(c,o),Nt!==4&&(Nt=2),Ra===null?Ra=[s]:Ra.push(s),s=a;do{switch(s.tag){case 3:s.flags|=65536,e&=-e,s.lanes|=e;var d=N_(s,c,e);cp(s,d);break e;case 1:o=c;var _=s.type,y=s.stateNode;if(!(s.flags&128)&&(typeof _.getDerivedStateFromError=="function"||y!==null&&typeof y.componentDidCatch=="function"&&(Qi===null||!Qi.has(y)))){s.flags|=65536,e&=-e,s.lanes|=e;var E=L_(s,o,e);cp(s,E);break e}}s=s.return}while(s!==null)}Z_(n)}catch(P){e=P,bt===n&&n!==null&&(bt=n=n.return);continue}break}while(!0)}function Y_(){var t=Ul.current;return Ul.current=Il,t===null?Il:t}function Yh(){(Nt===0||Nt===3||Nt===2)&&(Nt=4),kt===null||!(Dr&268435455)&&!(sc&268435455)||Hi(kt,Bt)}function Ol(t,e){var n=qe;qe|=2;var i=Y_();(kt!==t||Bt!==e)&&(mi=null,Ar(t,e));do try{uy();break}catch(r){q_(t,r)}while(!0);if(Nh(),qe=n,Ul.current=i,bt!==null)throw Error(oe(261));return kt=null,Bt=0,Nt}function uy(){for(;bt!==null;)K_(bt)}function dy(){for(;bt!==null&&!Fx();)K_(bt)}function K_(t){var e=J_(t.alternate,t,xn);t.memoizedProps=t.pendingProps,e===null?Z_(t):bt=e,Gh.current=null}function Z_(t){var e=t;do{var n=e.alternate;if(t=e.return,e.flags&32768){if(n=ry(n,e),n!==null){n.flags&=32767,bt=n;return}if(t!==null)t.flags|=32768,t.subtreeFlags=0,t.deletions=null;else{Nt=6,bt=null;return}}else if(n=iy(n,e,xn),n!==null){bt=n;return}if(e=e.sibling,e!==null){bt=e;return}bt=e=t}while(e!==null);Nt===0&&(Nt=5)}function xr(t,e,n){var i=nt,r=Fn.transition;try{Fn.transition=null,nt=1,hy(t,e,n,i)}finally{Fn.transition=r,nt=i}return null}function hy(t,e,n,i){do Es();while(Wi!==null);if(qe&6)throw Error(oe(327));n=t.finishedWork;var r=t.finishedLanes;if(n===null)return null;if(t.finishedWork=null,t.finishedLanes=0,n===t.current)throw Error(oe(177));t.callbackNode=null,t.callbackPriority=0;var s=n.lanes|n.childLanes;if(Xx(t,s),t===kt&&(bt=kt=null,Bt=0),!(n.subtreeFlags&2064)&&!(n.flags&2064)||So||(So=!0,ev(xl,function(){return Es(),null})),s=(n.flags&15990)!==0,n.subtreeFlags&15990||s){s=Fn.transition,Fn.transition=null;var a=nt;nt=1;var o=qe;qe|=4,Gh.current=null,ay(t,n),W_(n,t),L0(qu),Sl=!!$u,qu=$u=null,t.current=n,oy(n),kx(),qe=o,nt=a,Fn.transition=s}else t.current=n;if(So&&(So=!1,Wi=t,kl=r),s=t.pendingLanes,s===0&&(Qi=null),zx(n.stateNode),dn(t,Et()),e!==null)for(i=t.onRecoverableError,n=0;n<e.length;n++)r=e[n],i(r.value,{componentStack:r.stack,digest:r.digest});if(Fl)throw Fl=!1,t=pd,pd=null,t;return kl&1&&t.tag!==0&&Es(),s=t.pendingLanes,s&1?t===md?Pa++:(Pa=0,md=t):Pa=0,cr(),null}function Es(){if(Wi!==null){var t=Ng(kl),e=Fn.transition,n=nt;try{if(Fn.transition=null,nt=16>t?16:t,Wi===null)var i=!1;else{if(t=Wi,Wi=null,kl=0,qe&6)throw Error(oe(331));var r=qe;for(qe|=4,ye=t.current;ye!==null;){var s=ye,a=s.child;if(ye.flags&16){var o=s.deletions;if(o!==null){for(var c=0;c<o.length;c++){var h=o[c];for(ye=h;ye!==null;){var u=ye;switch(u.tag){case 0:case 11:case 15:Aa(8,u,s)}var f=u.child;if(f!==null)f.return=u,ye=f;else for(;ye!==null;){u=ye;var p=u.sibling,m=u.return;if(H_(u),u===h){ye=null;break}if(p!==null){p.return=m,ye=p;break}ye=m}}}var S=s.alternate;if(S!==null){var x=S.child;if(x!==null){S.child=null;do{var g=x.sibling;x.sibling=null,x=g}while(x!==null)}}ye=s}}if(s.subtreeFlags&2064&&a!==null)a.return=s,ye=a;else e:for(;ye!==null;){if(s=ye,s.flags&2048)switch(s.tag){case 0:case 11:case 15:Aa(9,s,s.return)}var d=s.sibling;if(d!==null){d.return=s.return,ye=d;break e}ye=s.return}}var _=t.current;for(ye=_;ye!==null;){a=ye;var y=a.child;if(a.subtreeFlags&2064&&y!==null)y.return=a,ye=y;else e:for(a=_;ye!==null;){if(o=ye,o.flags&2048)try{switch(o.tag){case 0:case 11:case 15:rc(9,o)}}catch(P){yt(o,o.return,P)}if(o===a){ye=null;break e}var E=o.sibling;if(E!==null){E.return=o.return,ye=E;break e}ye=o.return}}if(qe=r,cr(),ri&&typeof ri.onPostCommitFiberRoot=="function")try{ri.onPostCommitFiberRoot(Kl,t)}catch{}i=!0}return i}finally{nt=n,Fn.transition=e}}return!1}function Pp(t,e,n){e=Is(n,e),e=N_(t,e,1),t=Zi(t,e,1),e=Qt(),t!==null&&(Ka(t,1,e),dn(t,e))}function yt(t,e,n){if(t.tag===3)Pp(t,t,n);else for(;e!==null;){if(e.tag===3){Pp(e,t,n);break}else if(e.tag===1){var i=e.stateNode;if(typeof e.type.getDerivedStateFromError=="function"||typeof i.componentDidCatch=="function"&&(Qi===null||!Qi.has(i))){t=Is(n,t),t=L_(e,t,1),e=Zi(e,t,1),t=Qt(),e!==null&&(Ka(e,1,t),dn(e,t));break}}e=e.return}}function fy(t,e,n){var i=t.pingCache;i!==null&&i.delete(e),e=Qt(),t.pingedLanes|=t.suspendedLanes&n,kt===t&&(Bt&n)===n&&(Nt===4||Nt===3&&(Bt&130023424)===Bt&&500>Et()-Xh?Ar(t,0):Wh|=n),dn(t,e)}function Q_(t,e){e===0&&(t.mode&1?(e=uo,uo<<=1,!(uo&130023424)&&(uo=4194304)):e=1);var n=Qt();t=wi(t,e),t!==null&&(Ka(t,e,n),dn(t,n))}function py(t){var e=t.memoizedState,n=0;e!==null&&(n=e.retryLane),Q_(t,n)}function my(t,e){var n=0;switch(t.tag){case 13:var i=t.stateNode,r=t.memoizedState;r!==null&&(n=r.retryLane);break;case 19:i=t.stateNode;break;default:throw Error(oe(314))}i!==null&&i.delete(e),Q_(t,n)}var J_;J_=function(t,e,n){if(t!==null)if(t.memoizedProps!==e.pendingProps||cn.current)ln=!0;else{if(!(t.lanes&n)&&!(e.flags&128))return ln=!1,ny(t,e,n);ln=!!(t.flags&131072)}else ln=!1,ft&&e.flags&1048576&&i_(e,Al,e.index);switch(e.lanes=0,e.tag){case 2:var i=e.type;il(t,e),t=e.pendingProps;var r=Ps(e,Yt.current);Ms(e,n),r=jh(null,e,i,t,r,n);var s=zh();return e.flags|=1,typeof r=="object"&&r!==null&&typeof r.render=="function"&&r.$$typeof===void 0?(e.tag=1,e.memoizedState=null,e.updateQueue=null,un(i)?(s=!0,Cl(e)):s=!1,e.memoizedState=r.state!==null&&r.state!==void 0?r.state:null,Ih(e),r.updater=ic,e.stateNode=r,r._reactInternals=e,id(e,i,t,n),e=ad(null,e,i,!0,s,n)):(e.tag=0,ft&&s&&bh(e),Zt(null,e,r,n),e=e.child),e;case 16:i=e.elementType;e:{switch(il(t,e),t=e.pendingProps,r=i._init,i=r(i._payload),e.type=i,r=e.tag=_y(i),t=Gn(i,t),r){case 0:e=sd(null,e,i,t,n);break e;case 1:e=yp(null,e,i,t,n);break e;case 11:e=vp(null,e,i,t,n);break e;case 14:e=xp(null,e,i,Gn(i.type,t),n);break e}throw Error(oe(306,i,""))}return e;case 0:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Gn(i,r),sd(t,e,i,r,n);case 1:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Gn(i,r),yp(t,e,i,r,n);case 3:e:{if(F_(e),t===null)throw Error(oe(387));i=e.pendingProps,s=e.memoizedState,r=s.element,c_(t,e),Nl(e,i,null,n);var a=e.memoizedState;if(i=a.element,s.isDehydrated)if(s={element:i,isDehydrated:!1,cache:a.cache,pendingSuspenseBoundaries:a.pendingSuspenseBoundaries,transitions:a.transitions},e.updateQueue.baseState=s,e.memoizedState=s,e.flags&256){r=Is(Error(oe(423)),e),e=Sp(t,e,i,n,r);break e}else if(i!==r){r=Is(Error(oe(424)),e),e=Sp(t,e,i,n,r);break e}else for(Sn=Ki(e.stateNode.containerInfo.firstChild),En=e,ft=!0,Xn=null,n=o_(e,null,i,n),e.child=n;n;)n.flags=n.flags&-3|4096,n=n.sibling;else{if(Ns(),i===r){e=Ti(t,e,n);break e}Zt(t,e,i,n)}e=e.child}return e;case 5:return u_(e),t===null&&ed(e),i=e.type,r=e.pendingProps,s=t!==null?t.memoizedProps:null,a=r.children,Yu(i,r)?a=null:s!==null&&Yu(i,s)&&(e.flags|=32),U_(t,e),Zt(t,e,a,n),e.child;case 6:return t===null&&ed(e),null;case 13:return k_(t,e,n);case 4:return Uh(e,e.stateNode.containerInfo),i=e.pendingProps,t===null?e.child=Ls(e,null,i,n):Zt(t,e,i,n),e.child;case 11:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Gn(i,r),vp(t,e,i,r,n);case 7:return Zt(t,e,e.pendingProps,n),e.child;case 8:return Zt(t,e,e.pendingProps.children,n),e.child;case 12:return Zt(t,e,e.pendingProps.children,n),e.child;case 10:e:{if(i=e.type._context,r=e.pendingProps,s=e.memoizedProps,a=r.value,ot(Rl,i._currentValue),i._currentValue=a,s!==null)if(Qn(s.value,a)){if(s.children===r.children&&!cn.current){e=Ti(t,e,n);break e}}else for(s=e.child,s!==null&&(s.return=e);s!==null;){var o=s.dependencies;if(o!==null){a=s.child;for(var c=o.firstContext;c!==null;){if(c.context===i){if(s.tag===1){c=Si(-1,n&-n),c.tag=2;var h=s.updateQueue;if(h!==null){h=h.shared;var u=h.pending;u===null?c.next=c:(c.next=u.next,u.next=c),h.pending=c}}s.lanes|=n,c=s.alternate,c!==null&&(c.lanes|=n),td(s.return,n,e),o.lanes|=n;break}c=c.next}}else if(s.tag===10)a=s.type===e.type?null:s.child;else if(s.tag===18){if(a=s.return,a===null)throw Error(oe(341));a.lanes|=n,o=a.alternate,o!==null&&(o.lanes|=n),td(a,n,e),a=s.sibling}else a=s.child;if(a!==null)a.return=s;else for(a=s;a!==null;){if(a===e){a=null;break}if(s=a.sibling,s!==null){s.return=a.return,a=s;break}a=a.return}s=a}Zt(t,e,r.children,n),e=e.child}return e;case 9:return r=e.type,i=e.pendingProps.children,Ms(e,n),r=kn(r),i=i(r),e.flags|=1,Zt(t,e,i,n),e.child;case 14:return i=e.type,r=Gn(i,e.pendingProps),r=Gn(i.type,r),xp(t,e,i,r,n);case 15:return D_(t,e,e.type,e.pendingProps,n);case 17:return i=e.type,r=e.pendingProps,r=e.elementType===i?r:Gn(i,r),il(t,e),e.tag=1,un(i)?(t=!0,Cl(e)):t=!1,Ms(e,n),P_(e,i,r),id(e,i,r,n),ad(null,e,i,!0,t,n);case 19:return O_(t,e,n);case 22:return I_(t,e,n)}throw Error(oe(156,e.tag))};function ev(t,e){return bg(t,e)}function gy(t,e,n,i){this.tag=t,this.key=n,this.sibling=this.child=this.return=this.stateNode=this.type=this.elementType=null,this.index=0,this.ref=null,this.pendingProps=e,this.dependencies=this.memoizedState=this.updateQueue=this.memoizedProps=null,this.mode=i,this.subtreeFlags=this.flags=0,this.deletions=null,this.childLanes=this.lanes=0,this.alternate=null}function Dn(t,e,n,i){return new gy(t,e,n,i)}function Kh(t){return t=t.prototype,!(!t||!t.isReactComponent)}function _y(t){if(typeof t=="function")return Kh(t)?1:0;if(t!=null){if(t=t.$$typeof,t===mh)return 11;if(t===gh)return 14}return 2}function er(t,e){var n=t.alternate;return n===null?(n=Dn(t.tag,e,t.key,t.mode),n.elementType=t.elementType,n.type=t.type,n.stateNode=t.stateNode,n.alternate=t,t.alternate=n):(n.pendingProps=e,n.type=t.type,n.flags=0,n.subtreeFlags=0,n.deletions=null),n.flags=t.flags&14680064,n.childLanes=t.childLanes,n.lanes=t.lanes,n.child=t.child,n.memoizedProps=t.memoizedProps,n.memoizedState=t.memoizedState,n.updateQueue=t.updateQueue,e=t.dependencies,n.dependencies=e===null?null:{lanes:e.lanes,firstContext:e.firstContext},n.sibling=t.sibling,n.index=t.index,n.ref=t.ref,n}function al(t,e,n,i,r,s){var a=2;if(i=t,typeof t=="function")Kh(t)&&(a=1);else if(typeof t=="string")a=5;else e:switch(t){case ss:return Rr(n.children,r,s,e);case ph:a=8,r|=8;break;case bu:return t=Dn(12,n,e,r|2),t.elementType=bu,t.lanes=s,t;case Au:return t=Dn(13,n,e,r),t.elementType=Au,t.lanes=s,t;case Ru:return t=Dn(19,n,e,r),t.elementType=Ru,t.lanes=s,t;case ug:return ac(n,r,s,e);default:if(typeof t=="object"&&t!==null)switch(t.$$typeof){case lg:a=10;break e;case cg:a=9;break e;case mh:a=11;break e;case gh:a=14;break e;case Oi:a=16,i=null;break e}throw Error(oe(130,t==null?t:typeof t,""))}return e=Dn(a,n,e,r),e.elementType=t,e.type=i,e.lanes=s,e}function Rr(t,e,n,i){return t=Dn(7,t,i,e),t.lanes=n,t}function ac(t,e,n,i){return t=Dn(22,t,i,e),t.elementType=ug,t.lanes=n,t.stateNode={isHidden:!1},t}function Wc(t,e,n){return t=Dn(6,t,null,e),t.lanes=n,t}function Xc(t,e,n){return e=Dn(4,t.children!==null?t.children:[],t.key,e),e.lanes=n,e.stateNode={containerInfo:t.containerInfo,pendingChildren:null,implementation:t.implementation},e}function vy(t,e,n,i,r){this.tag=e,this.containerInfo=t,this.finishedWork=this.pingCache=this.current=this.pendingChildren=null,this.timeoutHandle=-1,this.callbackNode=this.pendingContext=this.context=null,this.callbackPriority=0,this.eventTimes=Cc(0),this.expirationTimes=Cc(-1),this.entangledLanes=this.finishedLanes=this.mutableReadLanes=this.expiredLanes=this.pingedLanes=this.suspendedLanes=this.pendingLanes=0,this.entanglements=Cc(0),this.identifierPrefix=i,this.onRecoverableError=r,this.mutableSourceEagerHydrationData=null}function Zh(t,e,n,i,r,s,a,o,c){return t=new vy(t,e,n,o,c),e===1?(e=1,s===!0&&(e|=8)):e=0,s=Dn(3,null,null,e),t.current=s,s.stateNode=t,s.memoizedState={element:i,isDehydrated:n,cache:null,transitions:null,pendingSuspenseBoundaries:null},Ih(s),t}function xy(t,e,n){var i=3<arguments.length&&arguments[3]!==void 0?arguments[3]:null;return{$$typeof:rs,key:i==null?null:""+i,children:t,containerInfo:e,implementation:n}}function tv(t){if(!t)return rr;t=t._reactInternals;e:{if(jr(t)!==t||t.tag!==1)throw Error(oe(170));var e=t;do{switch(e.tag){case 3:e=e.stateNode.context;break e;case 1:if(un(e.type)){e=e.stateNode.__reactInternalMemoizedMergedChildContext;break e}}e=e.return}while(e!==null);throw Error(oe(171))}if(t.tag===1){var n=t.type;if(un(n))return t_(t,n,e)}return e}function nv(t,e,n,i,r,s,a,o,c){return t=Zh(n,i,!0,t,r,s,a,o,c),t.context=tv(null),n=t.current,i=Qt(),r=Ji(n),s=Si(i,r),s.callback=e??null,Zi(n,s,r),t.current.lanes=r,Ka(t,r,i),dn(t,i),t}function oc(t,e,n,i){var r=e.current,s=Qt(),a=Ji(r);return n=tv(n),e.context===null?e.context=n:e.pendingContext=n,e=Si(s,a),e.payload={element:t},i=i===void 0?null:i,i!==null&&(e.callback=i),t=Zi(r,e,a),t!==null&&(Zn(t,r,a,s),el(t,r,a)),a}function jl(t){if(t=t.current,!t.child)return null;switch(t.child.tag){case 5:return t.child.stateNode;default:return t.child.stateNode}}function Np(t,e){if(t=t.memoizedState,t!==null&&t.dehydrated!==null){var n=t.retryLane;t.retryLane=n!==0&&n<e?n:e}}function Qh(t,e){Np(t,e),(t=t.alternate)&&Np(t,e)}function yy(){return null}var iv=typeof reportError=="function"?reportError:function(t){console.error(t)};function Jh(t){this._internalRoot=t}lc.prototype.render=Jh.prototype.render=function(t){var e=this._internalRoot;if(e===null)throw Error(oe(409));oc(t,e,null,null)};lc.prototype.unmount=Jh.prototype.unmount=function(){var t=this._internalRoot;if(t!==null){this._internalRoot=null;var e=t.containerInfo;Ir(function(){oc(null,t,null,null)}),e[Ei]=null}};function lc(t){this._internalRoot=t}lc.prototype.unstable_scheduleHydration=function(t){if(t){var e=Ig();t={blockedOn:null,target:t,priority:e};for(var n=0;n<Bi.length&&e!==0&&e<Bi[n].priority;n++);Bi.splice(n,0,t),n===0&&Fg(t)}};function ef(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11)}function cc(t){return!(!t||t.nodeType!==1&&t.nodeType!==9&&t.nodeType!==11&&(t.nodeType!==8||t.nodeValue!==" react-mount-point-unstable "))}function Lp(){}function Sy(t,e,n,i,r){if(r){if(typeof i=="function"){var s=i;i=function(){var h=jl(a);s.call(h)}}var a=nv(e,i,t,0,null,!1,!1,"",Lp);return t._reactRootContainer=a,t[Ei]=a.current,ja(t.nodeType===8?t.parentNode:t),Ir(),a}for(;r=t.lastChild;)t.removeChild(r);if(typeof i=="function"){var o=i;i=function(){var h=jl(c);o.call(h)}}var c=Zh(t,0,!1,null,null,!1,!1,"",Lp);return t._reactRootContainer=c,t[Ei]=c.current,ja(t.nodeType===8?t.parentNode:t),Ir(function(){oc(e,c,n,i)}),c}function uc(t,e,n,i,r){var s=n._reactRootContainer;if(s){var a=s;if(typeof r=="function"){var o=r;r=function(){var c=jl(a);o.call(c)}}oc(e,a,t,r)}else a=Sy(n,e,t,r,i);return jl(a)}Lg=function(t){switch(t.tag){case 3:var e=t.stateNode;if(e.current.memoizedState.isDehydrated){var n=_a(e.pendingLanes);n!==0&&(xh(e,n|1),dn(e,Et()),!(qe&6)&&(Us=Et()+500,cr()))}break;case 13:Ir(function(){var i=wi(t,1);if(i!==null){var r=Qt();Zn(i,t,1,r)}}),Qh(t,1)}};yh=function(t){if(t.tag===13){var e=wi(t,134217728);if(e!==null){var n=Qt();Zn(e,t,134217728,n)}Qh(t,134217728)}};Dg=function(t){if(t.tag===13){var e=Ji(t),n=wi(t,e);if(n!==null){var i=Qt();Zn(n,t,e,i)}Qh(t,e)}};Ig=function(){return nt};Ug=function(t,e){var n=nt;try{return nt=t,e()}finally{nt=n}};ju=function(t,e,n){switch(e){case"input":if(Lu(t,n),e=n.name,n.type==="radio"&&e!=null){for(n=t;n.parentNode;)n=n.parentNode;for(n=n.querySelectorAll("input[name="+JSON.stringify(""+e)+'][type="radio"]'),e=0;e<n.length;e++){var i=n[e];if(i!==t&&i.form===t.form){var r=ec(i);if(!r)throw Error(oe(90));hg(i),Lu(i,r)}}}break;case"textarea":pg(t,n);break;case"select":e=n.value,e!=null&&vs(t,!!n.multiple,e,!1)}};Sg=$h;Mg=Ir;var My={usingClientEntryPoint:!1,Events:[Qa,cs,ec,xg,yg,$h]},na={findFiberByHostInstance:Er,bundleType:0,version:"18.3.1",rendererPackageName:"react-dom"},Ey={bundleType:na.bundleType,version:na.version,rendererPackageName:na.rendererPackageName,rendererConfig:na.rendererConfig,overrideHookState:null,overrideHookStateDeletePath:null,overrideHookStateRenamePath:null,overrideProps:null,overridePropsDeletePath:null,overridePropsRenamePath:null,setErrorHandler:null,setSuspenseHandler:null,scheduleUpdate:null,currentDispatcherRef:bi.ReactCurrentDispatcher,findHostInstanceByFiber:function(t){return t=Tg(t),t===null?null:t.stateNode},findFiberByHostInstance:na.findFiberByHostInstance||yy,findHostInstancesForRefresh:null,scheduleRefresh:null,scheduleRoot:null,setRefreshHandler:null,getCurrentFiber:null,reconcilerVersion:"18.3.1-next-f1338f8080-20240426"};if(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__<"u"){var Mo=__REACT_DEVTOOLS_GLOBAL_HOOK__;if(!Mo.isDisabled&&Mo.supportsFiber)try{Kl=Mo.inject(Ey),ri=Mo}catch{}}Tn.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED=My;Tn.createPortal=function(t,e){var n=2<arguments.length&&arguments[2]!==void 0?arguments[2]:null;if(!ef(e))throw Error(oe(200));return xy(t,e,null,n)};Tn.createRoot=function(t,e){if(!ef(t))throw Error(oe(299));var n=!1,i="",r=iv;return e!=null&&(e.unstable_strictMode===!0&&(n=!0),e.identifierPrefix!==void 0&&(i=e.identifierPrefix),e.onRecoverableError!==void 0&&(r=e.onRecoverableError)),e=Zh(t,1,!1,null,null,n,!1,i,r),t[Ei]=e.current,ja(t.nodeType===8?t.parentNode:t),new Jh(e)};Tn.findDOMNode=function(t){if(t==null)return null;if(t.nodeType===1)return t;var e=t._reactInternals;if(e===void 0)throw typeof t.render=="function"?Error(oe(188)):(t=Object.keys(t).join(","),Error(oe(268,t)));return t=Tg(e),t=t===null?null:t.stateNode,t};Tn.flushSync=function(t){return Ir(t)};Tn.hydrate=function(t,e,n){if(!cc(e))throw Error(oe(200));return uc(null,t,e,!0,n)};Tn.hydrateRoot=function(t,e,n){if(!ef(t))throw Error(oe(405));var i=n!=null&&n.hydratedSources||null,r=!1,s="",a=iv;if(n!=null&&(n.unstable_strictMode===!0&&(r=!0),n.identifierPrefix!==void 0&&(s=n.identifierPrefix),n.onRecoverableError!==void 0&&(a=n.onRecoverableError)),e=nv(e,null,t,1,n??null,r,!1,s,a),t[Ei]=e.current,ja(t),i)for(t=0;t<i.length;t++)n=i[t],r=n._getVersion,r=r(n._source),e.mutableSourceEagerHydrationData==null?e.mutableSourceEagerHydrationData=[n,r]:e.mutableSourceEagerHydrationData.push(n,r);return new lc(e)};Tn.render=function(t,e,n){if(!cc(e))throw Error(oe(200));return uc(null,t,e,!1,n)};Tn.unmountComponentAtNode=function(t){if(!cc(t))throw Error(oe(40));return t._reactRootContainer?(Ir(function(){uc(null,null,t,!1,function(){t._reactRootContainer=null,t[Ei]=null})}),!0):!1};Tn.unstable_batchedUpdates=$h;Tn.unstable_renderSubtreeIntoContainer=function(t,e,n,i){if(!cc(n))throw Error(oe(200));if(t==null||t._reactInternals===void 0)throw Error(oe(38));return uc(t,e,n,!1,i)};Tn.version="18.3.1-next-f1338f8080-20240426";function rv(){if(!(typeof __REACT_DEVTOOLS_GLOBAL_HOOK__>"u"||typeof __REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE!="function"))try{__REACT_DEVTOOLS_GLOBAL_HOOK__.checkDCE(rv)}catch(t){console.error(t)}}rv(),rg.exports=Tn;var wy=rg.exports,sv,Dp=wy;sv=Dp.createRoot,Dp.hydrateRoot;async function ct(t,e,n){const i=await fetch(e,{method:t,headers:n===void 0?{}:{"Content-Type":"application/json"},body:n===void 0?void 0:JSON.stringify(n)});if(!i.ok){let r=`${i.status} ${i.statusText}`;try{const s=await i.json();r=typeof s.detail=="string"?s.detail:JSON.stringify(s.detail??s)}catch{}throw new Error(r)}return i.json()}const et={health:()=>ct("GET","/api/health"),appInfo:()=>ct("GET","/api/app/info"),examples:()=>ct("GET","/api/examples"),example:t=>ct("GET",`/api/examples/${t}`),updateCheck:()=>ct("GET","/api/app/update"),updateApply:()=>ct("POST","/api/app/update"),updateStatus:()=>ct("GET","/api/app/update/status"),defaults:()=>ct("GET","/api/defaults"),schema:()=>ct("GET","/api/schema"),components:()=>ct("GET","/api/components"),materials:()=>ct("GET","/api/materials"),run:(t,e="full")=>ct("POST","/api/run",{project:t,level:e}),thermoChart:t=>ct("POST","/api/thermo/chart",t),envelope:t=>ct("POST","/api/thermo/envelope",t),projects:()=>ct("GET","/api/projects"),createProject:(t,e)=>ct("POST","/api/projects",{project:t,note:e}),updateProject:(t,e,n)=>ct("PUT",`/api/projects/${t}`,{project:e,note:n}),getProject:(t,e)=>ct("GET",`/api/projects/${t}${e===void 0?"":`?revision=${e}`}`),revisions:t=>ct("GET",`/api/projects/${t}/revisions`),runSaved:t=>ct("POST",`/api/projects/${t}/run?level=full`),history:t=>ct("GET",`/api/projects/${t}/history`),metrics:()=>ct("GET","/api/studies/metrics"),parametric:t=>ct("POST","/api/studies/parametric",t),sensitivity:t=>ct("POST","/api/studies/sensitivity",t),optimize:t=>ct("POST","/api/studies/optimize",t)};async function Ty(t,e){const n=await fetch(`/api/export/${t}`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({project:e,level:"full"})});if(!n.ok)throw new Error((await n.json()).detail??n.statusText);const i=await n.blob(),r=document.createElement("a");r.href=URL.createObjectURL(i),r.download=`${String(e.name).replace(/\s+/g,"_")}_rev${e.revision}_${t}`,r.click(),URL.revokeObjectURL(r.href)}const Q=(t,e=1)=>t==null?"–":typeof t=="number"?Number.isFinite(t)?t.toLocaleString(void 0,{maximumFractionDigits:e,minimumFractionDigits:e}):"–":typeof t=="boolean"?t?"yes":"no":String(t),tf=[{id:"inputs",label:"Inputs",color:"#0B5CAD"},{id:"process",label:"Process & aero",color:"#0E8A91"},{id:"mechanical",label:"Mechanical",color:"#6D4FC2"},{id:"dynamics",label:"Rotordynamics",color:"#D9822B"},{id:"systems",label:"Materials & systems",color:"#2E9E6B"},{id:"evaluate",label:"Evaluate & report",color:"#C2414B"}],ws=[{id:"project",label:"Design basis",group:"inputs",checks:[],desc:"Project data, driver, speed limits, criteria and the standards basis.",how:"Start here: set the design limits and acceptance criteria every later check uses."},{id:"gas",label:"Gas & operating cases",group:"inputs",checks:[],desc:"Gas composition, property model and all operating cases.",how:"Enter mol % and each case's flow, suction and discharge conditions."},{id:"thermo",label:"Thermodynamics",group:"process",checks:["compression"],desc:"Peng-Robinson / CoolProp properties, phase envelope and compression path.",how:"Check Z, k and the dew-point margin before trusting the compression results."},{id:"compressor",label:"Selection & performance",group:"process",checks:["aero"],desc:"Casing and stage selection, head, power, efficiency and the performance map.",how:"Review surge margin, turndown and power for each case on the map."},{id:"impellers",label:"Impellers & FEA",group:"mechanical",checks:["impeller","structural"],desc:"Impeller geometry, tip speed, axisymmetric FEA and the 3D stress viewer.",how:"Look at peak stress at MCS and 115 % overspeed against yield."},{id:"rotor",label:"Rotor & shaft",group:"mechanical",checks:["mechanical"],desc:"Shaft sizing, rotor layout, masses and the 3D rotor model.",how:"Confirm shaft stress and the bearing span before running rotordynamics."},{id:"bearings",label:"Bearings & seals",group:"mechanical",checks:["bearings","seals"],desc:"Tilting-pad bearings, labyrinth leakage and dry gas seal conditioning.",how:"Check pad temperature, film thickness and seal-gas dew-point margin."},{id:"lateral",label:"Lateral rotordynamics",group:"dynamics",checks:["rotordynamics"],desc:"Critical speeds, Campbell diagram, unbalance response and stability.",how:"Review separation margins, amplification factors and log decrement."},{id:"torsional",label:"Torsional train",group:"dynamics",checks:["torsional"],desc:"Train torsional natural frequencies, interference and motor start-up.",how:"Check margins to 1x and 2x line frequency and the start-up shaft torque."},{id:"materials",label:"Material assessment",group:"systems",checks:["materials"],desc:"Sour and wet service per stage, SSC domains, CO2 corrosion and evidence.",how:"Record each component's material and evidence; nothing passes on a name alone."},{id:"aux",label:"Lube oil & piping",group:"systems",checks:["auxiliary","piping","conditioning"],desc:"Lube oil system sizing and nozzle loads / piping checks.",how:"Size the oil system and check nozzle loads against the allowables."},{id:"optimize",label:"Optimisation",group:"evaluate",checks:[],desc:"Parametric studies, sensitivity and constrained optimisation.",how:"Vary speed, stages or geometry to see what moves power and margins."},{id:"verify",label:"Verification",group:"evaluate",checks:["*"],desc:"The full traceable checklist from every module, with references.",how:"Work through every fail and attention item before issuing results."},{id:"reports",label:"Reports & projects",group:"evaluate",checks:[],desc:"PDF / HTML / Excel reports, CAD and FE exports, saved revisions.",how:"Save a revision, then export the report and data package."}],zl=t=>String(ws.findIndex(e=>e.id===t)+1).padStart(2,"0"),Cy=t=>tf.find(e=>e.id===t.group),by=t=>{const e=Math.round((Date.now()/1e3-t)/60);return e<1?"just now":e<60?`${e} min ago`:`${Math.round(e/60)} h ago`};function Ay(t,e){var s;if(!t||!e.length)return null;const n=((s=t.checklist)==null?void 0:s.items)??[],i=e.includes("*")?n:n.filter(a=>e.some(o=>a.module===o||a.module.startsWith(o+"."))),r=a=>i.filter(o=>o.status===a).length;return{pass:r("pass"),fail:r("fail"),attention:r("attention"),review:r("review"),total:i.length}}function Ry({info:t}){const[e,n]=ne.useState(null),[i,r]=ne.useState(null),[s,a]=ne.useState(!1),o=async()=>{a(!0);try{n(await et.updateCheck())}finally{a(!1)}};ne.useEffect(()=>{o()},[]),ne.useEffect(()=>{if(!i||!["downloading","installing"].includes(i.phase))return;const u=setInterval(async()=>{try{r(await et.updateStatus())}catch{}},600);return()=>clearInterval(u)},[i]);const c=async()=>{try{r(await et.updateApply())}catch(u){r({phase:"error",message:u.message})}},h=e?e.error?["attention","Offline · update check failed"]:e.available?["warn",`Update available · ${e.latest}`]:["ok",t.installed?"Installed · up to date":"Up to date"]:["muted","Checking…"];return l.jsxs("div",{className:"upd",children:[l.jsx("span",{className:`pill ${h[0]}`,children:h[1]}),l.jsxs("div",{className:"mono small muted",children:["Version ",t.version," · ",t.release_date,!t.installed&&" · running from source"]}),(e==null?void 0:e.available)&&e.can_install&&!i&&l.jsxs("button",{className:"btn primary wide",onClick:c,children:["Update to ",e.latest,e.size_mb?` · ${e.size_mb} MB`:""]}),(e==null?void 0:e.available)&&!e.can_install&&l.jsxs("a",{className:"btn primary wide",href:e.url,target:"_blank",rel:"noreferrer",children:["Get ",e.latest," on GitHub ↗"]}),(!e||!e.available)&&l.jsx("button",{className:"btn wide",disabled:s,onClick:o,children:s?"Checking…":"Check for updates"}),i&&l.jsxs("div",{className:"progress",children:[l.jsx("div",{style:{width:`${Math.round((i.progress??0)*100)}%`}}),l.jsx("span",{className:"mono small",children:i.message})]}),(e==null?void 0:e.checked)&&l.jsxs("div",{className:"mono small muted",children:["Checked ",by(e.checked)," · GitHub Releases"]})]})}function Py({a:t}){const[e,n]=ne.useState([]),[i,r]=ne.useState([]);return ne.useEffect(()=>{et.examples().then(n).catch(()=>n([])),et.projects().then(r).catch(()=>r([]))},[]),l.jsxs("section",{className:"start",children:[l.jsxs("div",{className:"cell",children:[l.jsx("div",{className:"mono caps label",children:"Start"}),l.jsx("button",{className:"btn primary wide big-btn",onClick:t.newProject,children:"New project"}),l.jsx("p",{className:"muted small",children:"Guided setup: name, driver, gas and design case. Everything else starts from sensible defaults."}),l.jsxs("label",{className:"btn wide",children:["Import project file",l.jsx("input",{type:"file",accept:".json,application/json",hidden:!0,onChange:async s=>{var o;const a=(o=s.target.files)==null?void 0:o[0];if(a){try{t.importFile(JSON.parse(await a.text()))}catch(c){alert(`Not a CentriForge project file: ${c.message}`)}s.target.value=""}}})]}),t.resume&&l.jsxs("button",{className:"btn wide",style:{marginTop:8},onClick:t.resume,children:["Continue: ",t.resumeName]})]}),l.jsxs("div",{className:"cell",children:[l.jsx("div",{className:"mono caps label",children:"Examples"}),e.map(s=>l.jsxs("button",{className:"excard",onClick:()=>t.openExample(s.id),children:[l.jsx("b",{children:s.title}),l.jsx("span",{className:"muted",children:s.summary}),l.jsx("span",{children:s.tags.map(a=>l.jsx("span",{className:"pill blue",children:a},a))})]},s.id))]}),l.jsxs("div",{className:"cell",children:[l.jsx("div",{className:"mono caps label",children:"Learn"}),l.jsxs("button",{className:"excard",onClick:t.tutorial,children:[l.jsx("b",{children:"Guided tutorial"}),l.jsx("span",{className:"muted",children:"Walks through all 14 modules on the export gas example: what to enter, how to read each result."}),l.jsxs("span",{children:[l.jsx("span",{className:"pill blue",children:"12 steps"})," ",l.jsx("span",{className:"pill blue",children:"10 min"})]})]}),l.jsx("div",{className:"mono caps label",style:{marginTop:14},children:"Recent projects"}),i.length===0?l.jsx("p",{className:"muted small",children:"Saved projects appear here (Reports & projects → Save project)."}):l.jsx("div",{className:"recent",children:i.slice(0,6).map(s=>l.jsxs("button",{onClick:()=>t.openSaved(s.id),children:[l.jsx("b",{children:s.name}),l.jsxs("span",{className:"mono small muted",children:["rev ",s.current_revision," · ",String(s.updated).slice(0,10)]})]},s.id))})]})]})}function Ny({results:t,project:e,open:n,running:i,actions:r}){var S;const[s,a]=ne.useState(null),[o,c]=ne.useState("all"),[h,u]=ne.useState("");ne.useEffect(()=>{et.appInfo().then(a).catch(()=>a(null))},[]);const f=ne.useMemo(()=>ws.filter(x=>(o==="all"||x.group===o)&&(x.label+x.desc).toLowerCase().includes(h.toLowerCase())),[o,h]),p=t==null?void 0:t.summary,m=(S=s==null?void 0:s.changelog)==null?void 0:S[0];return l.jsxs("div",{className:"launcher",children:[l.jsxs("section",{className:"hero",children:[l.jsxs("div",{className:"cell brand",children:[l.jsx("img",{src:"/favicon.svg",alt:"",width:"76",height:"76"}),l.jsxs("div",{children:[l.jsxs("h1",{children:["Centri",l.jsx("span",{children:"Forge"})]}),l.jsx("div",{className:"mono caps muted",children:"Compressor engineering suite"}),l.jsx("p",{className:"muted",children:"Centrifugal compressor thermodynamics, selection, mechanical design, rotordynamics, materials and verification in one traceable workflow. Preliminary engineering - not a certificate of compliance."})]})]}),l.jsxs("div",{className:"cell",children:[l.jsxs("div",{className:"mono caps label",children:["What's new",m&&` in ${m.version}`]}),l.jsx("ul",{className:"news",children:((m==null?void 0:m.items)??[]).map(x=>l.jsx("li",{children:x},x))})]}),l.jsx("div",{className:"cell",children:s?l.jsx(Ry,{info:s}):l.jsx("span",{className:"mono small muted",children:"Loading app info…"})})]}),l.jsx(Py,{a:r}),e&&l.jsxs("section",{className:"hero project",children:[l.jsxs("div",{className:"cell",children:[l.jsx("div",{className:"mono caps label",children:"Current project"}),l.jsxs("div",{className:"pname",children:[(e==null?void 0:e.name)??"–"," ",l.jsxs("span",{className:"mono small muted",children:["rev ",(e==null?void 0:e.revision)??0]})]})]}),[["Configuration",p==null?void 0:p.configuration],["Speed",p&&`${Math.round(p.speed_rpm).toLocaleString()} rpm`],["Shaft power",p&&`${Math.round(p.shaft_power_kw).toLocaleString()} kW`]].map(([x,g])=>l.jsxs("div",{className:"cell",children:[l.jsx("div",{className:"mono caps label",children:x}),l.jsx("div",{className:"big",children:i?"…":g??"–"})]},x)),l.jsxs("div",{className:"cell",children:[l.jsx("div",{className:"mono caps label",children:"Checklist"}),p?l.jsx("div",{className:"counts",children:["pass","fail","attention","review"].map(x=>l.jsxs("span",{className:`pill ${x}`,children:[p.checklist[x]," ",x]},x))}):l.jsx("span",{className:"muted",children:i?"Running analysis…":"Not run yet"})]}),l.jsx("div",{className:"cell",children:l.jsx("button",{className:"btn primary wide",onClick:()=>n("project"),children:"Open workspace"})})]}),l.jsxs("div",{className:"mono caps label",style:{marginTop:22},children:["Modules",!e&&" · start or open a project to use them"]}),l.jsxs("div",{className:"filters",style:{marginTop:6},children:[l.jsxs("div",{className:"seg",children:[l.jsxs("button",{className:o==="all"?"on":"",onClick:()=>c("all"),children:["All ",l.jsx("b",{children:ws.length})]}),tf.map(x=>l.jsxs("button",{className:o===x.id?"on":"",onClick:()=>c(x.id),children:[x.label," ",l.jsx("b",{children:ws.filter(g=>g.group===x.id).length})]},x.id))]}),l.jsx("input",{className:"inp search",placeholder:"Search modules",value:h,onChange:x=>u(x.target.value),"aria-label":"Search modules"})]}),l.jsx("section",{className:"tiles",children:f.map(x=>{const g=Cy(x),d=Ay(t,x.checks);return l.jsxs("article",{className:"tile",children:[l.jsxs("header",{children:[l.jsx("span",{className:"num",style:{background:g.color},children:zl(x.id)}),l.jsx("span",{className:"mono caps muted",children:g.label})]}),l.jsxs("div",{className:"body",children:[l.jsx("h3",{children:x.label}),l.jsx("p",{children:x.desc}),l.jsxs("p",{className:"how",children:[l.jsx("span",{className:"mono caps",children:"How to use"}),x.how]}),l.jsx("div",{className:"tstat",children:d?d.fail?l.jsxs("span",{className:"pill fail",children:[d.fail," fail · ",d.pass," pass"]}):d.attention?l.jsxs("span",{className:"pill attention",children:[d.attention," attention · ",d.pass," pass"]}):d.total?l.jsxs("span",{className:"pill pass",children:[d.pass," pass"]}):l.jsx("span",{className:"pill muted",children:"No checks"}):l.jsx("span",{className:"pill muted",children:t?"Inputs / tools":"Not run yet"})})]}),l.jsx("footer",{children:l.jsx("button",{className:"btn primary wide",disabled:!e,title:e?"":"Start or open a project first",onClick:()=>n(x.id),children:"Open"})})]},x.id)})}),l.jsxs("footer",{className:"foot mono caps",children:[l.jsx("span",{children:s?`Projects saved in ${s.data_dir}`:""}),l.jsx("span",{className:"spacer"}),s&&l.jsx("a",{href:`https://github.com/${s.repo}`,target:"_blank",rel:"noreferrer",children:"GitHub ↗"}),s&&l.jsx("a",{href:`https://github.com/${s.repo}/releases`,target:"_blank",rel:"noreferrer",children:"Releases ↗"}),l.jsx("a",{href:"/docs",target:"_blank",rel:"noreferrer",children:"API ↗"})]})]})}const Ly=[["vfd_motor","Electric motor, variable speed (VFD)"],["fixed_speed_motor_gearbox","Fixed-speed motor + gearbox"],["steam_turbine","Steam turbine"],["gas_turbine","Gas turbine"]],Ip=["CH4","C2H6","C3H8","iC4H10","nC4H10","iC5H12","nC5H12","nC6H14","N2","O2","CO2","H2S","H2","H2O","CO","Ar","He"];function Dy({onCreate:t,onClose:e}){const[n,i]=ne.useState(0),[r,s]=ne.useState("New compressor project"),[a,o]=ne.useState(""),[c,h]=ne.useState("vfd_motor"),[u,f]=ne.useState([["CH4",90],["C2H6",5],["C3H8",2],["N2",1.5],["CO2",1.5]]),[p,m]=ne.useState({suction_pressure_bara:30,suction_temperature_c:35,discharge_pressure_bara:90,flow_value:60,flow_unit:"kg/s"}),S=u.reduce((_,[,y])=>_+(Number(y)||0),0),x=[r.trim().length>0,u.length>0&&S>0,p.discharge_pressure_bara>p.suction_pressure_bara&&p.flow_value>0],g=async()=>{const _=await et.example("blank");_.name=r.trim(),_.description=a,_.design_basis.driver_type=c,_.gas.components=Object.fromEntries(u.filter(([,y])=>Number(y)>0)),_.cases=[{..._.cases[0],...p,name:"Rated",is_design:!0}],t(_)},d=["Project","Gas","Design case"];return l.jsx("div",{className:"modal-bg",onClick:e,children:l.jsxs("div",{className:"modal",onClick:_=>_.stopPropagation(),role:"dialog","aria-label":"New project",children:[l.jsx("div",{className:"seg",children:d.map((_,y)=>l.jsxs("button",{className:y===n?"on":"",onClick:()=>i(y),children:[y+1," · ",_," ",x[y]?"✓":""]},_))}),l.jsxs("div",{className:"mbody",children:[n===0&&l.jsxs("div",{className:"form",children:[l.jsxs("label",{children:["Project name",l.jsx("input",{value:r,onChange:_=>s(_.target.value),autoFocus:!0})]}),l.jsxs("label",{children:["Description",l.jsx("input",{value:a,placeholder:"Service, location, duty",onChange:_=>o(_.target.value)})]}),l.jsxs("label",{children:["Driver",l.jsx("select",{value:c,onChange:_=>h(_.target.value),children:Ly.map(([_,y])=>l.jsx("option",{value:_,children:y},_))})]})]}),n===1&&l.jsxs(l.Fragment,{children:[l.jsxs("table",{className:"t",children:[l.jsx("thead",{children:l.jsxs("tr",{children:[l.jsx("th",{children:"Component"}),l.jsx("th",{children:"mol %"}),l.jsx("th",{})]})}),l.jsx("tbody",{children:u.map(([_,y],E)=>l.jsxs("tr",{children:[l.jsx("td",{children:l.jsx("select",{className:"inp",value:_,onChange:P=>f(u.map((b,C)=>C===E?[P.target.value,b[1]]:b)),children:Ip.map(P=>l.jsx("option",{children:P},P))})}),l.jsx("td",{children:l.jsx("input",{className:"inp",type:"number",step:"any",value:y,onChange:P=>f(u.map((b,C)=>C===E?[b[0],Number(P.target.value)]:b))})}),l.jsx("td",{children:l.jsx("button",{className:"btn",onClick:()=>f(u.filter((P,b)=>b!==E)),children:"Remove"})})]},E))})]}),l.jsxs("div",{className:"row",style:{marginTop:8},children:[l.jsx("button",{className:"btn",onClick:()=>f([...u,[Ip.find(_=>!u.some(([y])=>y===_))??"CH4",0]]),children:"Add component"}),l.jsxs("span",{className:"muted",children:["Total ",S.toFixed(2)," % (normalised automatically)"]})]})]}),n===2&&l.jsxs("div",{className:"form",children:[l.jsxs("label",{children:["Suction pressure (bara)",l.jsx("input",{type:"number",step:"any",value:p.suction_pressure_bara,onChange:_=>m({...p,suction_pressure_bara:Number(_.target.value)})})]}),l.jsxs("label",{children:["Suction temperature (°C)",l.jsx("input",{type:"number",step:"any",value:p.suction_temperature_c,onChange:_=>m({...p,suction_temperature_c:Number(_.target.value)})})]}),l.jsxs("label",{children:["Discharge pressure (bara)",l.jsx("input",{type:"number",step:"any",value:p.discharge_pressure_bara,onChange:_=>m({...p,discharge_pressure_bara:Number(_.target.value)})})]}),l.jsxs("label",{children:["Flow",l.jsx("input",{type:"number",step:"any",value:p.flow_value,onChange:_=>m({...p,flow_value:Number(_.target.value)})})]}),l.jsxs("label",{children:["Flow unit",l.jsx("select",{value:p.flow_unit,onChange:_=>m({...p,flow_unit:_.target.value}),children:["kg/s","kg/h","Am3/h","Nm3/h","Sm3/h","MMSCFD"].map(_=>l.jsx("option",{children:_},_))})]}),l.jsx("p",{className:"muted small",style:{gridColumn:"1 / -1"},children:"Add more operating cases later on the Gas & operating cases page."})]})]}),l.jsxs("div",{className:"row mfoot",children:[l.jsx("button",{className:"btn",onClick:e,children:"Cancel"}),l.jsx("span",{className:"spacer"}),n>0&&l.jsx("button",{className:"btn",onClick:()=>i(n-1),children:"Back"}),n<2?l.jsx("button",{className:"btn primary",onClick:()=>i(n+1),children:"Next"}):l.jsx("button",{className:"btn primary",disabled:!x.every(Boolean),onClick:g,children:"Create project"})]})]})})}const xa=[{page:"project",title:"Design basis",text:"Every project starts with the design basis: driver, tip-speed and Mach limits, temperature limits and the acceptance criteria every check uses. Fields left blank are estimated."},{page:"gas",title:"Gas & operating cases",text:"Enter the gas composition (normalised automatically) and every operating case. Mark one case as the design case; the machine is sized for it and checked against all others."},{page:"gas",title:"Run the analysis",text:"Click Run analysis (top right) whenever inputs change. One run updates every module: thermodynamics, sizing, mechanics, rotordynamics, materials and the checklist.",run:!0},{page:"thermo",title:"Thermodynamics",text:"Check compressibility, k and the phase envelope. The dew-point margin tells you whether liquid can form at suction or in the coolers."},{page:"compressor",title:"Selection & performance",text:"The selected casing, stages and speed, with the performance map. Hover over the chart to read values; use Edit chart to change axes, labels and styles, and export PNG, SVG, PDF or CSV."},{page:"impellers",title:"Impellers & FEA",text:"Impeller geometry and stresses. The 3D viewer shows the FE result: switch result field, load case, cut-away and deformation scale."},{page:"rotor",title:"Rotor & shaft",text:"The shaft layout from impellers, seals, balance piston and bearings. Shaft stresses are checked before rotordynamics."},{page:"bearings",title:"Bearings & seals",text:"Tilting-pad bearing coefficients feed rotordynamics; seal leakage and dry gas seal conditioning are checked here."},{page:"lateral",title:"Lateral rotordynamics",text:"Campbell diagram, critical speeds, unbalance response and stability against API 617-style criteria."},{page:"torsional",title:"Torsional train",text:"Natural frequencies of the whole train, interference with excitations and the motor start-up torque."},{page:"materials",title:"Material assessment",text:"Sour and wet service at every stage: SSC domain, CO2 corrosion and the acceptance criteria per component. A material only passes with recorded evidence."},{page:"verify",title:"Verification",text:"The full traceable checklist. Work through every fail and attention item, then save a revision and export the report in Reports & projects."}];function Iy({step:t,setStep:e,open:n,run:i,running:r}){const s=xa[t],a=o=>{e(o),n(xa[o].page)};return l.jsxs("aside",{className:"tour",role:"dialog","aria-label":"Tutorial",children:[l.jsxs("div",{className:"mono caps muted",children:["Tutorial · ",t+1," / ",xa.length," · module ",zl(s.page)]}),l.jsx("h3",{children:s.title}),l.jsx("p",{children:s.text}),l.jsxs("div",{className:"row",children:[s.run&&l.jsx("button",{className:"btn primary",disabled:r,onClick:i,children:r?"Running…":"Run it for me"}),l.jsx("span",{className:"spacer"}),l.jsx("button",{className:"btn",disabled:t===0,onClick:()=>a(t-1),children:"Back"}),t<xa.length-1?l.jsx("button",{className:"btn primary",onClick:()=>a(t+1),children:"Next"}):l.jsx("button",{className:"btn primary",onClick:()=>e(null),children:"Finish"})]}),l.jsx("button",{className:"tour-x",onClick:()=>e(null),"aria-label":"Close tutorial",children:"×"})]})}const it=["#0B5CAD","#D55E00","#009E73","#CC79A7","#E69F00","#56B4E9","#000000","#7F7F7F"],ia="cf.chart.default",ra=t=>{try{return JSON.parse(localStorage.getItem(t)??"{}")}catch{return{}}},sa=(t,e)=>{try{localStorage.setItem(t,JSON.stringify(e))}catch{}},ol=t=>typeof t=="string"?t:(t==null?void 0:t.text)??"";function Uy(t,e){var i,r;return`cf.chart.${[ol(e==null?void 0:e.title),ol((i=e==null?void 0:e.xaxis)==null?void 0:i.title),ol((r=e==null?void 0:e.yaxis)==null?void 0:r.title),t.map(s=>s.name).join("|")].join("·")}`}async function Up(t,e){const n=await fetch(t,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(e)});if(!n.ok)throw new Error((await n.json().catch(()=>({}))).detail??n.statusText);return n}function Fp(t,e,n){return n?(Math.log10(t)-Math.log10(e[0]))/(Math.log10(e[1])-Math.log10(e[0])):(t-e[0])/(e[1]-e[0])}function kp(t,e,n){return n?10**(Math.log10(e[0])+t*(Math.log10(e[1])-Math.log10(e[0]))):e[0]+t*(e[1]-e[0])}const Ni=t=>Math.abs(t)>=1e5||Math.abs(t)<.001&&t!==0?t.toExponential(3):Number(t.toPrecision(5)).toString(),Fy=["","o","s","D","^","v","P","X","*"],ky={"":"none",o:"circle",s:"square",D:"diamond","^":"triangle up",v:"triangle down",P:"plus",X:"cross","*":"star"};function wt({data:t,layout:e,height:n=340}){const i=ne.useMemo(()=>Uy(t,e),[t,e]),[r,s]=ne.useState(()=>({...ra(ia),...ra(i)})),[a,o]=ne.useState(null),[c,h]=ne.useState(""),[u,f]=ne.useState(!1),[p,m]=ne.useState(null),[S,x]=ne.useState(0),g=ne.useRef(null);ne.useEffect(()=>{s({...ra(ia),...ra(i)})},[i]),ne.useEffect(()=>{const v=g.current;if(!v)return;const M=new ResizeObserver(()=>x(Math.round(v.clientWidth/24)*24));return M.observe(v),()=>M.disconnect()},[]);const d=Number(r.height_px??n),_=ne.useMemo(()=>({spec:{data:t,layout:e??{}},opts:{...r,width_in:Math.max(3,(S||640)/96),height_in:Math.max(2,d/96)}}),[t,e,r,S,d]);ne.useEffect(()=>{if(!S)return;let v=!0;const M=setTimeout(async()=>{try{const I=await(await Up("/api/plot",_)).json();v&&(o(I),h(""))}catch(I){v&&h(I.message)}},120);return()=>{v=!1,clearTimeout(M)}},[_,S]);const y=(v,M)=>{const I={...r,[v]:M===""?void 0:M};s(I),sa(i,I)},E=(v,M,I)=>{var j;return y("series",{...r.series??{},[v]:{...((j=r.series)==null?void 0:j[v])??{},[M]:I}})},P=v=>{var se;const M=a==null?void 0:a.meta,I=(se=g.current)==null?void 0:se.querySelector("svg");if(!M||!I)return;const j=I.getBoundingClientRect(),q=(v.clientX-j.left)/j.width,Z=1-(v.clientY-j.top)/j.height,H=M.axes;if(q<H.left||q>H.right||Z<H.bottom||Z>H.top){m(null);return}const Y=(q-H.left)/(H.right-H.left),L=(Z-H.bottom)/(H.top-H.bottom);let O=null;t.forEach((fe,Le)=>{const $=M.series[Le];!$||!$.visible||$.axis!=="y"||(fe.x??[]).forEach((re,ue)=>{var be;const R=(be=fe.y)==null?void 0:be[ue];if(typeof re!="number"||typeof R!="number")return;const te=Fp(re,M.xlim,M.xlog),de=Fp(R,M.ylim,M.ylog),Te=((te-Y)*j.width)**2+((de-L)*j.height)**2;(!O||Te<O.d)&&(O={d:Te,i:Le,x:re,y:R,px:te,py:de,name:$.name,color:$.color})})});const V=O&&O.d<30**2?O:null;m({fx:q,fy:Z,x:kp(Y,M.xlim,M.xlog),y:kp(L,M.ylim,M.ylog),near:V,a:H})},b=async v=>{var q,Z;const M=(ol(e==null?void 0:e.title)||((Z=(q=a==null?void 0:a.meta)==null?void 0:q.labels)==null?void 0:Z.y)||"chart").replace(/[^\w-]+/g,"_");let I;if(v==="csv"){const H=Math.max(...t.map(O=>(O.x??[]).length)),Y=t.flatMap((O,V)=>[`${O.name??`series ${V+1}`} x`,`${O.name??`series ${V+1}`} y`]),L=Array.from({length:H},(O,V)=>t.flatMap(se=>{var fe,Le;return[((fe=se.x)==null?void 0:fe[V])??"",((Le=se.y)==null?void 0:Le[V])??""]}).join(","));I=new Blob([[Y.map(O=>`"${O}"`).join(","),...L].join(`
`)],{type:"text/csv"})}else I=await(await Up(`/api/plot/export/${v}`,{..._,dpi:Number(r.dpi??600)})).blob();const j=document.createElement("a");j.href=URL.createObjectURL(I),j.download=`${M}.${v}`,j.click(),URL.revokeObjectURL(j.href)},C=a==null?void 0:a.meta,N=(v,M)=>{var I;return((I=r[v])==null?void 0:I[M])??""},z=(v,M,I)=>{const j=[...r[v]??[null,null]];j[M]=I===""?null:Number(I),y(v,j.every(q=>q===null)?void 0:j)};return l.jsxs("div",{className:"pchart",children:[l.jsxs("div",{className:"pbar",children:[l.jsx("button",{className:`chip ${u?"on":""}`,onClick:()=>f(!u),children:"Edit chart"}),["png","svg","pdf","csv"].map(v=>l.jsx("button",{className:"chip",onClick:()=>b(v),children:v.toUpperCase()},v))]}),l.jsxs("div",{ref:g,className:"plot",style:{minHeight:d},onMouseMove:P,onMouseLeave:()=>m(null),children:[a?l.jsx("div",{className:"svg",dangerouslySetInnerHTML:{__html:a.svg}}):l.jsx("div",{className:"ploading",style:{height:d},children:"Drawing chart…"}),p&&l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"xhair v",style:{left:`${p.fx*100}%`,top:`${(1-p.a.top)*100}%`,bottom:`${p.a.bottom*100}%`}}),l.jsx("div",{className:"xhair h",style:{top:`${(1-p.fy)*100}%`,left:`${p.a.left*100}%`,right:`${(1-p.a.right)*100}%`}}),p.near&&l.jsx("div",{className:"xdot",style:{left:`${(p.a.left+p.near.px*(p.a.right-p.a.left))*100}%`,top:`${(1-(p.a.bottom+p.near.py*(p.a.top-p.a.bottom)))*100}%`,borderColor:p.near.color}}),l.jsx("div",{className:"xread mono",style:{left:`${Math.min(p.fx*100+1,70)}%`,top:`${(1-p.a.top)*100+1}%`},children:p.near?l.jsxs(l.Fragment,{children:[l.jsx("b",{style:{color:p.near.color},children:p.near.name}),l.jsx("br",{}),"x ",Ni(p.near.x)," · y ",Ni(p.near.y)]}):l.jsxs(l.Fragment,{children:["x ",Ni(p.x)," · y ",Ni(p.y)]})})]})]}),c&&l.jsx("div",{className:"error",children:c}),u&&C&&l.jsxs("div",{className:"peditor",children:[l.jsxs("div",{className:"form",children:[l.jsxs("label",{children:["Title",l.jsx("input",{value:r.title??"",placeholder:C.labels.title,onChange:v=>y("title",v.target.value)})]}),l.jsxs("label",{children:["X axis title",l.jsx("input",{value:r.xlabel??"",placeholder:C.labels.x,onChange:v=>y("xlabel",v.target.value)})]}),l.jsxs("label",{children:["Y axis title",l.jsx("input",{value:r.ylabel??"",placeholder:C.labels.y,onChange:v=>y("ylabel",v.target.value)})]}),C.labels.y2!==null&&l.jsxs("label",{children:["Right Y axis title",l.jsx("input",{value:r.y2label??"",placeholder:C.labels.y2,onChange:v=>y("y2label",v.target.value)})]}),l.jsxs("label",{children:["X min / max",l.jsxs("span",{className:"pair",children:[l.jsx("input",{type:"number",step:"any",value:N("xlim",0),placeholder:Ni(C.xlim[0]),onChange:v=>z("xlim",0,v.target.value)}),l.jsx("input",{type:"number",step:"any",value:N("xlim",1),placeholder:Ni(C.xlim[1]),onChange:v=>z("xlim",1,v.target.value)})]})]}),l.jsxs("label",{children:["Y min / max",l.jsxs("span",{className:"pair",children:[l.jsx("input",{type:"number",step:"any",value:N("ylim",0),placeholder:Ni(C.ylim[0]),onChange:v=>z("ylim",0,v.target.value)}),l.jsx("input",{type:"number",step:"any",value:N("ylim",1),placeholder:Ni(C.ylim[1]),onChange:v=>z("ylim",1,v.target.value)})]})]}),l.jsxs("label",{children:["Scale",l.jsxs("span",{className:"pair",children:[l.jsxs("select",{value:String(r.xlog??C.xlog),onChange:v=>y("xlog",v.target.value==="true"),children:[l.jsx("option",{value:"false",children:"X linear"}),l.jsx("option",{value:"true",children:"X log"})]}),l.jsxs("select",{value:String(r.ylog??C.ylog),onChange:v=>y("ylog",v.target.value==="true"),children:[l.jsx("option",{value:"false",children:"Y linear"}),l.jsx("option",{value:"true",children:"Y log"})]})]})]}),l.jsxs("label",{children:["Legend",l.jsx("select",{value:r.legend??"best",onChange:v=>y("legend",v.target.value),children:["best","upper right","upper left","lower right","lower left","center right","outside","below","none"].map(v=>l.jsx("option",{children:v},v))})]}),l.jsxs("label",{children:["Axis style",l.jsxs("select",{value:r.axis_style??"prism",onChange:v=>y("axis_style",v.target.value),children:[l.jsx("option",{value:"prism",children:"Prism (open, ticks out)"}),l.jsx("option",{value:"box",children:"Box (closed, ticks in)"})]})]}),l.jsxs("label",{children:["Grid",l.jsxs("select",{value:r.grid??"none",onChange:v=>y("grid",v.target.value),children:[l.jsx("option",{value:"none",children:"None"}),l.jsx("option",{value:"major",children:"Major"}),l.jsx("option",{value:"both",children:"Major + minor"})]})]}),l.jsxs("label",{className:"check",children:[l.jsx("input",{type:"checkbox",checked:!!r.minor_ticks,onChange:v=>y("minor_ticks",v.target.checked)}),"Minor ticks"]}),l.jsxs("label",{className:"check",children:[l.jsx("input",{type:"checkbox",checked:!!r.frame_legend,onChange:v=>y("frame_legend",v.target.checked)}),"Legend frame"]}),l.jsxs("label",{children:["Colour scheme",l.jsx("select",{value:r.palette??"engineering",onChange:v=>y("palette",v.target.value),children:["engineering","prism","colorblind","grayscale"].map(v=>l.jsx("option",{children:v},v))})]}),l.jsxs("label",{children:["Font size ",r.font_size??11," pt",l.jsx("input",{type:"range",min:7,max:18,value:r.font_size??11,onChange:v=>y("font_size",Number(v.target.value))})]}),l.jsxs("label",{children:["Line width ",r.line_width??1.8,l.jsx("input",{type:"range",min:.5,max:4,step:.1,value:r.line_width??1.8,onChange:v=>y("line_width",Number(v.target.value))})]}),l.jsxs("label",{children:["Marker size ",r.marker_size??6,l.jsx("input",{type:"range",min:2,max:14,step:.5,value:r.marker_size??6,onChange:v=>y("marker_size",Number(v.target.value))})]}),l.jsxs("label",{children:["Height ",d," px",l.jsx("input",{type:"range",min:200,max:800,step:20,value:d,onChange:v=>y("height_px",Number(v.target.value))})]}),l.jsxs("label",{children:["PNG resolution",l.jsx("select",{value:String(r.dpi??600),onChange:v=>y("dpi",Number(v.target.value)),children:[150,300,600,1200].map(v=>l.jsxs("option",{value:v,children:[v," dpi"]},v))})]})]}),l.jsxs("table",{className:"t",style:{marginTop:12},children:[l.jsx("thead",{children:l.jsxs("tr",{children:[l.jsx("th",{children:"Show"}),l.jsx("th",{children:"Series"}),l.jsx("th",{children:"Colour"}),l.jsx("th",{children:"Marker"}),l.jsx("th",{children:"Line"})]})}),l.jsx("tbody",{children:C.series.map((v,M)=>{var I,j,q,Z,H,Y;return l.jsxs("tr",{children:[l.jsx("td",{children:l.jsx("input",{type:"checkbox",checked:v.visible,onChange:L=>E(M,"visible",L.target.checked)})}),l.jsx("td",{children:l.jsx("input",{className:"inp",value:((j=(I=r.series)==null?void 0:I[M])==null?void 0:j.name)??"",placeholder:v.name,onChange:L=>E(M,"name",L.target.value)})}),l.jsx("td",{children:l.jsx("input",{type:"color",value:v.color.length===7?v.color:"#000000",onChange:L=>E(M,"color",L.target.value)})}),l.jsx("td",{children:l.jsx("select",{className:"inp",value:((Z=(q=r.series)==null?void 0:q[M])==null?void 0:Z.marker)??v.marker,onChange:L=>E(M,"marker",L.target.value),children:Fy.map(L=>l.jsx("option",{value:L,children:ky[L]},L))})}),l.jsx("td",{children:l.jsx("select",{className:"inp",value:((Y=(H=r.series)==null?void 0:H[M])==null?void 0:Y.dash)??v.dash,onChange:L=>E(M,"dash",L.target.value),children:["solid","dash","dot","dashdot"].map(L=>l.jsx("option",{children:L},L))})})]},M)})})]}),l.jsxs("div",{className:"row",style:{marginTop:10},children:[l.jsx("button",{className:"btn",onClick:()=>{const{series:v,title:M,xlabel:I,ylabel:j,y2label:q,xlim:Z,ylim:H,...Y}=r;sa(ia,Y)},children:"Use style for all charts"}),l.jsx("button",{className:"btn",onClick:()=>{s(ra(ia)),sa(i,{})},children:"Reset this chart"}),l.jsx("button",{className:"btn",onClick:()=>{sa(ia,{}),s({}),sa(i,{})},children:"Reset all styles"}),l.jsx("span",{className:"muted small",children:"Edits are saved automatically on this computer."})]})]})]})}/**
 * @license
 * Copyright 2010-2024 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const nf="169",Ts={ROTATE:0,DOLLY:1,PAN:2},gs={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Oy=0,Op=1,jy=2,av=1,zy=2,pi=3,sr=0,hn=1,Ln=2,tr=0,Cs=1,jp=2,zp=3,Bp=4,By=5,Sr=100,Hy=101,Vy=102,Gy=103,Wy=104,Xy=200,$y=201,qy=202,Yy=203,vd=204,xd=205,Ky=206,Zy=207,Qy=208,Jy=209,eS=210,tS=211,nS=212,iS=213,rS=214,yd=0,Sd=1,Md=2,Fs=3,Ed=4,wd=5,Td=6,Cd=7,ov=0,sS=1,aS=2,nr=0,oS=1,lS=2,cS=3,uS=4,dS=5,hS=6,fS=7,lv=300,ks=301,Os=302,bd=303,Ad=304,dc=306,Rd=1e3,Cr=1001,Pd=1002,In=1003,pS=1004,Eo=1005,$n=1006,$c=1007,br=1008,Ci=1009,cv=1010,uv=1011,qa=1012,rf=1013,Ur=1014,xi=1015,eo=1016,sf=1017,af=1018,js=1020,dv=35902,hv=1021,fv=1022,Yn=1023,pv=1024,mv=1025,bs=1026,zs=1027,gv=1028,of=1029,_v=1030,lf=1031,cf=1033,ll=33776,cl=33777,ul=33778,dl=33779,Nd=35840,Ld=35841,Dd=35842,Id=35843,Ud=36196,Fd=37492,kd=37496,Od=37808,jd=37809,zd=37810,Bd=37811,Hd=37812,Vd=37813,Gd=37814,Wd=37815,Xd=37816,$d=37817,qd=37818,Yd=37819,Kd=37820,Zd=37821,hl=36492,Qd=36494,Jd=36495,vv=36283,eh=36284,th=36285,nh=36286,mS=3200,gS=3201,xv=0,_S=1,Vi="",ti="srgb",ur="srgb-linear",uf="display-p3",hc="display-p3-linear",Bl="linear",dt="srgb",Hl="rec709",Vl="p3",Vr=7680,Hp=519,vS=512,xS=513,yS=514,yv=515,SS=516,MS=517,ES=518,wS=519,Vp=35044,Gp="300 es",yi=2e3,Gl=2001;class zr{addEventListener(e,n){this._listeners===void 0&&(this._listeners={});const i=this._listeners;i[e]===void 0&&(i[e]=[]),i[e].indexOf(n)===-1&&i[e].push(n)}hasEventListener(e,n){if(this._listeners===void 0)return!1;const i=this._listeners;return i[e]!==void 0&&i[e].indexOf(n)!==-1}removeEventListener(e,n){if(this._listeners===void 0)return;const r=this._listeners[e];if(r!==void 0){const s=r.indexOf(n);s!==-1&&r.splice(s,1)}}dispatchEvent(e){if(this._listeners===void 0)return;const i=this._listeners[e.type];if(i!==void 0){e.target=this;const r=i.slice(0);for(let s=0,a=r.length;s<a;s++)r[s].call(this,e);e.target=null}}}const Wt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],fl=Math.PI/180,ih=180/Math.PI;function to(){const t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0,i=Math.random()*4294967295|0;return(Wt[t&255]+Wt[t>>8&255]+Wt[t>>16&255]+Wt[t>>24&255]+"-"+Wt[e&255]+Wt[e>>8&255]+"-"+Wt[e>>16&15|64]+Wt[e>>24&255]+"-"+Wt[n&63|128]+Wt[n>>8&255]+"-"+Wt[n>>16&255]+Wt[n>>24&255]+Wt[i&255]+Wt[i>>8&255]+Wt[i>>16&255]+Wt[i>>24&255]).toLowerCase()}function qt(t,e,n){return Math.max(e,Math.min(n,t))}function TS(t,e){return(t%e+e)%e}function qc(t,e,n){return(1-n)*t+n*e}function aa(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return t/4294967295;case Uint16Array:return t/65535;case Uint8Array:return t/255;case Int32Array:return Math.max(t/2147483647,-1);case Int16Array:return Math.max(t/32767,-1);case Int8Array:return Math.max(t/127,-1);default:throw new Error("Invalid component type.")}}function rn(t,e){switch(e.constructor){case Float32Array:return t;case Uint32Array:return Math.round(t*4294967295);case Uint16Array:return Math.round(t*65535);case Uint8Array:return Math.round(t*255);case Int32Array:return Math.round(t*2147483647);case Int16Array:return Math.round(t*32767);case Int8Array:return Math.round(t*127);default:throw new Error("Invalid component type.")}}const CS={DEG2RAD:fl};class Fe{constructor(e=0,n=0){Fe.prototype.isVector2=!0,this.x=e,this.y=n}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,n){return this.x=e,this.y=n,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const n=this.x,i=this.y,r=e.elements;return this.x=r[0]*n+r[3]*i+r[6],this.y=r[1]*n+r[4]*i+r[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(qt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y;return n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this}rotateAround(e,n){const i=Math.cos(n),r=Math.sin(n),s=this.x-e.x,a=this.y-e.y;return this.x=s*i-a*r+e.x,this.y=s*r+a*i+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Be{constructor(e,n,i,r,s,a,o,c,h){Be.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,c,h)}set(e,n,i,r,s,a,o,c,h){const u=this.elements;return u[0]=e,u[1]=r,u[2]=o,u[3]=n,u[4]=s,u[5]=c,u[6]=i,u[7]=a,u[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],this}extractBasis(e,n,i){return e.setFromMatrix3Column(this,0),n.setFromMatrix3Column(this,1),i.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const n=e.elements;return this.set(n[0],n[4],n[8],n[1],n[5],n[9],n[2],n[6],n[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[3],c=i[6],h=i[1],u=i[4],f=i[7],p=i[2],m=i[5],S=i[8],x=r[0],g=r[3],d=r[6],_=r[1],y=r[4],E=r[7],P=r[2],b=r[5],C=r[8];return s[0]=a*x+o*_+c*P,s[3]=a*g+o*y+c*b,s[6]=a*d+o*E+c*C,s[1]=h*x+u*_+f*P,s[4]=h*g+u*y+f*b,s[7]=h*d+u*E+f*C,s[2]=p*x+m*_+S*P,s[5]=p*g+m*y+S*b,s[8]=p*d+m*E+S*C,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[3]*=e,n[6]*=e,n[1]*=e,n[4]*=e,n[7]*=e,n[2]*=e,n[5]*=e,n[8]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],h=e[7],u=e[8];return n*a*u-n*o*h-i*s*u+i*o*c+r*s*h-r*a*c}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],h=e[7],u=e[8],f=u*a-o*h,p=o*c-u*s,m=h*s-a*c,S=n*f+i*p+r*m;if(S===0)return this.set(0,0,0,0,0,0,0,0,0);const x=1/S;return e[0]=f*x,e[1]=(r*h-u*i)*x,e[2]=(o*i-r*a)*x,e[3]=p*x,e[4]=(u*n-r*c)*x,e[5]=(r*s-o*n)*x,e[6]=m*x,e[7]=(i*c-h*n)*x,e[8]=(a*n-i*s)*x,this}transpose(){let e;const n=this.elements;return e=n[1],n[1]=n[3],n[3]=e,e=n[2],n[2]=n[6],n[6]=e,e=n[5],n[5]=n[7],n[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const n=this.elements;return e[0]=n[0],e[1]=n[3],e[2]=n[6],e[3]=n[1],e[4]=n[4],e[5]=n[7],e[6]=n[2],e[7]=n[5],e[8]=n[8],this}setUvTransform(e,n,i,r,s,a,o){const c=Math.cos(s),h=Math.sin(s);return this.set(i*c,i*h,-i*(c*a+h*o)+a+e,-r*h,r*c,-r*(-h*a+c*o)+o+n,0,0,1),this}scale(e,n){return this.premultiply(Yc.makeScale(e,n)),this}rotate(e){return this.premultiply(Yc.makeRotation(-e)),this}translate(e,n){return this.premultiply(Yc.makeTranslation(e,n)),this}makeTranslation(e,n){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,n,0,0,1),this}makeRotation(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,i,n,0,0,0,1),this}makeScale(e,n){return this.set(e,0,0,0,n,0,0,0,1),this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<9;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<9;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const Yc=new Be;function Sv(t){for(let e=t.length-1;e>=0;--e)if(t[e]>=65535)return!0;return!1}function Wl(t){return document.createElementNS("http://www.w3.org/1999/xhtml",t)}function bS(){const t=Wl("canvas");return t.style.display="block",t}const Wp={};function pl(t){t in Wp||(Wp[t]=!0,console.warn(t))}function AS(t,e,n){return new Promise(function(i,r){function s(){switch(t.clientWaitSync(e,t.SYNC_FLUSH_COMMANDS_BIT,0)){case t.WAIT_FAILED:r();break;case t.TIMEOUT_EXPIRED:setTimeout(s,n);break;default:i()}}setTimeout(s,n)})}function RS(t){const e=t.elements;e[2]=.5*e[2]+.5*e[3],e[6]=.5*e[6]+.5*e[7],e[10]=.5*e[10]+.5*e[11],e[14]=.5*e[14]+.5*e[15]}function PS(t){const e=t.elements;e[11]===-1?(e[10]=-e[10]-1,e[14]=-e[14]):(e[10]=-e[10],e[14]=-e[14]+1)}const Xp=new Be().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),$p=new Be().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),oa={[ur]:{transfer:Bl,primaries:Hl,luminanceCoefficients:[.2126,.7152,.0722],toReference:t=>t,fromReference:t=>t},[ti]:{transfer:dt,primaries:Hl,luminanceCoefficients:[.2126,.7152,.0722],toReference:t=>t.convertSRGBToLinear(),fromReference:t=>t.convertLinearToSRGB()},[hc]:{transfer:Bl,primaries:Vl,luminanceCoefficients:[.2289,.6917,.0793],toReference:t=>t.applyMatrix3($p),fromReference:t=>t.applyMatrix3(Xp)},[uf]:{transfer:dt,primaries:Vl,luminanceCoefficients:[.2289,.6917,.0793],toReference:t=>t.convertSRGBToLinear().applyMatrix3($p),fromReference:t=>t.applyMatrix3(Xp).convertLinearToSRGB()}},NS=new Set([ur,hc]),Je={enabled:!0,_workingColorSpace:ur,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(t){if(!NS.has(t))throw new Error(`Unsupported working color space, "${t}".`);this._workingColorSpace=t},convert:function(t,e,n){if(this.enabled===!1||e===n||!e||!n)return t;const i=oa[e].toReference,r=oa[n].fromReference;return r(i(t))},fromWorkingColorSpace:function(t,e){return this.convert(t,this._workingColorSpace,e)},toWorkingColorSpace:function(t,e){return this.convert(t,e,this._workingColorSpace)},getPrimaries:function(t){return oa[t].primaries},getTransfer:function(t){return t===Vi?Bl:oa[t].transfer},getLuminanceCoefficients:function(t,e=this._workingColorSpace){return t.fromArray(oa[e].luminanceCoefficients)}};function As(t){return t<.04045?t*.0773993808:Math.pow(t*.9478672986+.0521327014,2.4)}function Kc(t){return t<.0031308?t*12.92:1.055*Math.pow(t,.41666)-.055}let Gr;class LS{static getDataURL(e){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{Gr===void 0&&(Gr=Wl("canvas")),Gr.width=e.width,Gr.height=e.height;const i=Gr.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=Gr}return n.width>2048||n.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",e),n.toDataURL("image/jpeg",.6)):n.toDataURL("image/png")}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const n=Wl("canvas");n.width=e.width,n.height=e.height;const i=n.getContext("2d");i.drawImage(e,0,0,e.width,e.height);const r=i.getImageData(0,0,e.width,e.height),s=r.data;for(let a=0;a<s.length;a++)s[a]=As(s[a]/255)*255;return i.putImageData(r,0,0),n}else if(e.data){const n=e.data.slice(0);for(let i=0;i<n.length;i++)n instanceof Uint8Array||n instanceof Uint8ClampedArray?n[i]=Math.floor(As(n[i]/255)*255):n[i]=As(n[i]);return{data:n,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let DS=0;class Mv{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:DS++}),this.uuid=to(),this.data=e,this.dataReady=!0,this.version=0}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const i={uuid:this.uuid,url:""},r=this.data;if(r!==null){let s;if(Array.isArray(r)){s=[];for(let a=0,o=r.length;a<o;a++)r[a].isDataTexture?s.push(Zc(r[a].image)):s.push(Zc(r[a]))}else s=Zc(r);i.url=s}return n||(e.images[this.uuid]=i),i}}function Zc(t){return typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap?LS.getDataURL(t):t.data?{data:Array.from(t.data),width:t.width,height:t.height,type:t.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}let IS=0;class fn extends zr{constructor(e=fn.DEFAULT_IMAGE,n=fn.DEFAULT_MAPPING,i=Cr,r=Cr,s=$n,a=br,o=Yn,c=Ci,h=fn.DEFAULT_ANISOTROPY,u=Vi){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:IS++}),this.uuid=to(),this.name="",this.source=new Mv(e),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=s,this.minFilter=a,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=c,this.offset=new Fe(0,0),this.repeat=new Fe(1,1),this.center=new Fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Be,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.pmremVersion=0}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}toJSON(e){const n=e===void 0||typeof e=="string";if(!n&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const i={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(e.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==lv)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case Rd:e.x=e.x-Math.floor(e.x);break;case Cr:e.x=e.x<0?0:1;break;case Pd:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case Rd:e.y=e.y-Math.floor(e.y);break;case Cr:e.y=e.y<0?0:1;break;case Pd:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}fn.DEFAULT_IMAGE=null;fn.DEFAULT_MAPPING=lv;fn.DEFAULT_ANISOTROPY=1;class St{constructor(e=0,n=0,i=0,r=1){St.prototype.isVector4=!0,this.x=e,this.y=n,this.z=i,this.w=r}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,n,i,r){return this.x=e,this.y=n,this.z=i,this.w=r,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;case 3:this.w=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this.w=e.w+n.w,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this.w+=e.w*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this.w=e.w-n.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=this.w,a=e.elements;return this.x=a[0]*n+a[4]*i+a[8]*r+a[12]*s,this.y=a[1]*n+a[5]*i+a[9]*r+a[13]*s,this.z=a[2]*n+a[6]*i+a[10]*r+a[14]*s,this.w=a[3]*n+a[7]*i+a[11]*r+a[15]*s,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const n=Math.sqrt(1-e.w*e.w);return n<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/n,this.y=e.y/n,this.z=e.z/n),this}setAxisAngleFromRotationMatrix(e){let n,i,r,s;const c=e.elements,h=c[0],u=c[4],f=c[8],p=c[1],m=c[5],S=c[9],x=c[2],g=c[6],d=c[10];if(Math.abs(u-p)<.01&&Math.abs(f-x)<.01&&Math.abs(S-g)<.01){if(Math.abs(u+p)<.1&&Math.abs(f+x)<.1&&Math.abs(S+g)<.1&&Math.abs(h+m+d-3)<.1)return this.set(1,0,0,0),this;n=Math.PI;const y=(h+1)/2,E=(m+1)/2,P=(d+1)/2,b=(u+p)/4,C=(f+x)/4,N=(S+g)/4;return y>E&&y>P?y<.01?(i=0,r=.707106781,s=.707106781):(i=Math.sqrt(y),r=b/i,s=C/i):E>P?E<.01?(i=.707106781,r=0,s=.707106781):(r=Math.sqrt(E),i=b/r,s=N/r):P<.01?(i=.707106781,r=.707106781,s=0):(s=Math.sqrt(P),i=C/s,r=N/s),this.set(i,r,s,n),this}let _=Math.sqrt((g-S)*(g-S)+(f-x)*(f-x)+(p-u)*(p-u));return Math.abs(_)<.001&&(_=1),this.x=(g-S)/_,this.y=(f-x)/_,this.z=(p-u)/_,this.w=Math.acos((h+m+d-1)/2),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this.w=n[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this.w=Math.max(e.w,Math.min(n.w,this.w)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this.w=Math.max(e,Math.min(n,this.w)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this.w+=(e.w-this.w)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this.w=e.w+(n.w-e.w)*i,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this.w=e[n+3],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e[n+3]=this.w,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this.w=e.getW(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class US extends zr{constructor(e=1,n=1,i={}){super(),this.isRenderTarget=!0,this.width=e,this.height=n,this.depth=1,this.scissor=new St(0,0,e,n),this.scissorTest=!1,this.viewport=new St(0,0,e,n);const r={width:e,height:n,depth:1};i=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:$n,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1},i);const s=new fn(r,i.mapping,i.wrapS,i.wrapT,i.magFilter,i.minFilter,i.format,i.type,i.anisotropy,i.colorSpace);s.flipY=!1,s.generateMipmaps=i.generateMipmaps,s.internalFormat=i.internalFormat,this.textures=[];const a=i.count;for(let o=0;o<a;o++)this.textures[o]=s.clone(),this.textures[o].isRenderTargetTexture=!0;this.depthBuffer=i.depthBuffer,this.stencilBuffer=i.stencilBuffer,this.resolveDepthBuffer=i.resolveDepthBuffer,this.resolveStencilBuffer=i.resolveStencilBuffer,this.depthTexture=i.depthTexture,this.samples=i.samples}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}setSize(e,n,i=1){if(this.width!==e||this.height!==n||this.depth!==i){this.width=e,this.height=n,this.depth=i;for(let r=0,s=this.textures.length;r<s;r++)this.textures[r].image.width=e,this.textures[r].image.height=n,this.textures[r].image.depth=i;this.dispose()}this.viewport.set(0,0,e,n),this.scissor.set(0,0,e,n)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let i=0,r=e.textures.length;i<r;i++)this.textures[i]=e.textures[i].clone(),this.textures[i].isRenderTargetTexture=!0;const n=Object.assign({},e.texture.image);return this.texture.source=new Mv(n),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class Fr extends US{constructor(e=1,n=1,i={}){super(e,n,i),this.isWebGLRenderTarget=!0}}class Ev extends fn{constructor(e=null,n=1,i=1,r=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=In,this.minFilter=In,this.wrapR=Cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class FS extends fn{constructor(e=null,n=1,i=1,r=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:n,height:i,depth:r},this.magFilter=In,this.minFilter=In,this.wrapR=Cr,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class kr{constructor(e=0,n=0,i=0,r=1){this.isQuaternion=!0,this._x=e,this._y=n,this._z=i,this._w=r}static slerpFlat(e,n,i,r,s,a,o){let c=i[r+0],h=i[r+1],u=i[r+2],f=i[r+3];const p=s[a+0],m=s[a+1],S=s[a+2],x=s[a+3];if(o===0){e[n+0]=c,e[n+1]=h,e[n+2]=u,e[n+3]=f;return}if(o===1){e[n+0]=p,e[n+1]=m,e[n+2]=S,e[n+3]=x;return}if(f!==x||c!==p||h!==m||u!==S){let g=1-o;const d=c*p+h*m+u*S+f*x,_=d>=0?1:-1,y=1-d*d;if(y>Number.EPSILON){const P=Math.sqrt(y),b=Math.atan2(P,d*_);g=Math.sin(g*b)/P,o=Math.sin(o*b)/P}const E=o*_;if(c=c*g+p*E,h=h*g+m*E,u=u*g+S*E,f=f*g+x*E,g===1-o){const P=1/Math.sqrt(c*c+h*h+u*u+f*f);c*=P,h*=P,u*=P,f*=P}}e[n]=c,e[n+1]=h,e[n+2]=u,e[n+3]=f}static multiplyQuaternionsFlat(e,n,i,r,s,a){const o=i[r],c=i[r+1],h=i[r+2],u=i[r+3],f=s[a],p=s[a+1],m=s[a+2],S=s[a+3];return e[n]=o*S+u*f+c*m-h*p,e[n+1]=c*S+u*p+h*f-o*m,e[n+2]=h*S+u*m+o*p-c*f,e[n+3]=u*S-o*f-c*p-h*m,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,n,i,r){return this._x=e,this._y=n,this._z=i,this._w=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,n=!0){const i=e._x,r=e._y,s=e._z,a=e._order,o=Math.cos,c=Math.sin,h=o(i/2),u=o(r/2),f=o(s/2),p=c(i/2),m=c(r/2),S=c(s/2);switch(a){case"XYZ":this._x=p*u*f+h*m*S,this._y=h*m*f-p*u*S,this._z=h*u*S+p*m*f,this._w=h*u*f-p*m*S;break;case"YXZ":this._x=p*u*f+h*m*S,this._y=h*m*f-p*u*S,this._z=h*u*S-p*m*f,this._w=h*u*f+p*m*S;break;case"ZXY":this._x=p*u*f-h*m*S,this._y=h*m*f+p*u*S,this._z=h*u*S+p*m*f,this._w=h*u*f-p*m*S;break;case"ZYX":this._x=p*u*f-h*m*S,this._y=h*m*f+p*u*S,this._z=h*u*S-p*m*f,this._w=h*u*f+p*m*S;break;case"YZX":this._x=p*u*f+h*m*S,this._y=h*m*f+p*u*S,this._z=h*u*S-p*m*f,this._w=h*u*f-p*m*S;break;case"XZY":this._x=p*u*f-h*m*S,this._y=h*m*f-p*u*S,this._z=h*u*S+p*m*f,this._w=h*u*f+p*m*S;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return n===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,n){const i=n/2,r=Math.sin(i);return this._x=e.x*r,this._y=e.y*r,this._z=e.z*r,this._w=Math.cos(i),this._onChangeCallback(),this}setFromRotationMatrix(e){const n=e.elements,i=n[0],r=n[4],s=n[8],a=n[1],o=n[5],c=n[9],h=n[2],u=n[6],f=n[10],p=i+o+f;if(p>0){const m=.5/Math.sqrt(p+1);this._w=.25/m,this._x=(u-c)*m,this._y=(s-h)*m,this._z=(a-r)*m}else if(i>o&&i>f){const m=2*Math.sqrt(1+i-o-f);this._w=(u-c)/m,this._x=.25*m,this._y=(r+a)/m,this._z=(s+h)/m}else if(o>f){const m=2*Math.sqrt(1+o-i-f);this._w=(s-h)/m,this._x=(r+a)/m,this._y=.25*m,this._z=(c+u)/m}else{const m=2*Math.sqrt(1+f-i-o);this._w=(a-r)/m,this._x=(s+h)/m,this._y=(c+u)/m,this._z=.25*m}return this._onChangeCallback(),this}setFromUnitVectors(e,n){let i=e.dot(n)+1;return i<Number.EPSILON?(i=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=i):(this._x=0,this._y=-e.z,this._z=e.y,this._w=i)):(this._x=e.y*n.z-e.z*n.y,this._y=e.z*n.x-e.x*n.z,this._z=e.x*n.y-e.y*n.x,this._w=i),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(qt(this.dot(e),-1,1)))}rotateTowards(e,n){const i=this.angleTo(e);if(i===0)return this;const r=Math.min(1,n/i);return this.slerp(e,r),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,n){const i=e._x,r=e._y,s=e._z,a=e._w,o=n._x,c=n._y,h=n._z,u=n._w;return this._x=i*u+a*o+r*h-s*c,this._y=r*u+a*c+s*o-i*h,this._z=s*u+a*h+i*c-r*o,this._w=a*u-i*o-r*c-s*h,this._onChangeCallback(),this}slerp(e,n){if(n===0)return this;if(n===1)return this.copy(e);const i=this._x,r=this._y,s=this._z,a=this._w;let o=a*e._w+i*e._x+r*e._y+s*e._z;if(o<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,o=-o):this.copy(e),o>=1)return this._w=a,this._x=i,this._y=r,this._z=s,this;const c=1-o*o;if(c<=Number.EPSILON){const m=1-n;return this._w=m*a+n*this._w,this._x=m*i+n*this._x,this._y=m*r+n*this._y,this._z=m*s+n*this._z,this.normalize(),this}const h=Math.sqrt(c),u=Math.atan2(h,o),f=Math.sin((1-n)*u)/h,p=Math.sin(n*u)/h;return this._w=a*f+this._w*p,this._x=i*f+this._x*p,this._y=r*f+this._y*p,this._z=s*f+this._z*p,this._onChangeCallback(),this}slerpQuaternions(e,n,i){return this.copy(e).slerp(n,i)}random(){const e=2*Math.PI*Math.random(),n=2*Math.PI*Math.random(),i=Math.random(),r=Math.sqrt(1-i),s=Math.sqrt(i);return this.set(r*Math.sin(e),r*Math.cos(e),s*Math.sin(n),s*Math.cos(n))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,n=0){return this._x=e[n],this._y=e[n+1],this._z=e[n+2],this._w=e[n+3],this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._w,e}fromBufferAttribute(e,n){return this._x=e.getX(n),this._y=e.getY(n),this._z=e.getZ(n),this._w=e.getW(n),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class B{constructor(e=0,n=0,i=0){B.prototype.isVector3=!0,this.x=e,this.y=n,this.z=i}set(e,n,i){return i===void 0&&(i=this.z),this.x=e,this.y=n,this.z=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,n){switch(e){case 0:this.x=n;break;case 1:this.y=n;break;case 2:this.z=n;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,n){return this.x=e.x+n.x,this.y=e.y+n.y,this.z=e.z+n.z,this}addScaledVector(e,n){return this.x+=e.x*n,this.y+=e.y*n,this.z+=e.z*n,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,n){return this.x=e.x-n.x,this.y=e.y-n.y,this.z=e.z-n.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,n){return this.x=e.x*n.x,this.y=e.y*n.y,this.z=e.z*n.z,this}applyEuler(e){return this.applyQuaternion(qp.setFromEuler(e))}applyAxisAngle(e,n){return this.applyQuaternion(qp.setFromAxisAngle(e,n))}applyMatrix3(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[3]*i+s[6]*r,this.y=s[1]*n+s[4]*i+s[7]*r,this.z=s[2]*n+s[5]*i+s[8]*r,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const n=this.x,i=this.y,r=this.z,s=e.elements,a=1/(s[3]*n+s[7]*i+s[11]*r+s[15]);return this.x=(s[0]*n+s[4]*i+s[8]*r+s[12])*a,this.y=(s[1]*n+s[5]*i+s[9]*r+s[13])*a,this.z=(s[2]*n+s[6]*i+s[10]*r+s[14])*a,this}applyQuaternion(e){const n=this.x,i=this.y,r=this.z,s=e.x,a=e.y,o=e.z,c=e.w,h=2*(a*r-o*i),u=2*(o*n-s*r),f=2*(s*i-a*n);return this.x=n+c*h+a*f-o*u,this.y=i+c*u+o*h-s*f,this.z=r+c*f+s*u-a*h,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const n=this.x,i=this.y,r=this.z,s=e.elements;return this.x=s[0]*n+s[4]*i+s[8]*r,this.y=s[1]*n+s[5]*i+s[9]*r,this.z=s[2]*n+s[6]*i+s[10]*r,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,n){return this.x=Math.max(e.x,Math.min(n.x,this.x)),this.y=Math.max(e.y,Math.min(n.y,this.y)),this.z=Math.max(e.z,Math.min(n.z,this.z)),this}clampScalar(e,n){return this.x=Math.max(e,Math.min(n,this.x)),this.y=Math.max(e,Math.min(n,this.y)),this.z=Math.max(e,Math.min(n,this.z)),this}clampLength(e,n){const i=this.length();return this.divideScalar(i||1).multiplyScalar(Math.max(e,Math.min(n,i)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,n){return this.x+=(e.x-this.x)*n,this.y+=(e.y-this.y)*n,this.z+=(e.z-this.z)*n,this}lerpVectors(e,n,i){return this.x=e.x+(n.x-e.x)*i,this.y=e.y+(n.y-e.y)*i,this.z=e.z+(n.z-e.z)*i,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,n){const i=e.x,r=e.y,s=e.z,a=n.x,o=n.y,c=n.z;return this.x=r*c-s*o,this.y=s*a-i*c,this.z=i*o-r*a,this}projectOnVector(e){const n=e.lengthSq();if(n===0)return this.set(0,0,0);const i=e.dot(this)/n;return this.copy(e).multiplyScalar(i)}projectOnPlane(e){return Qc.copy(this).projectOnVector(e),this.sub(Qc)}reflect(e){return this.sub(Qc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const n=Math.sqrt(this.lengthSq()*e.lengthSq());if(n===0)return Math.PI/2;const i=this.dot(e)/n;return Math.acos(qt(i,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const n=this.x-e.x,i=this.y-e.y,r=this.z-e.z;return n*n+i*i+r*r}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,n,i){const r=Math.sin(n)*e;return this.x=r*Math.sin(i),this.y=Math.cos(n)*e,this.z=r*Math.cos(i),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,n,i){return this.x=e*Math.sin(n),this.y=i,this.z=e*Math.cos(n),this}setFromMatrixPosition(e){const n=e.elements;return this.x=n[12],this.y=n[13],this.z=n[14],this}setFromMatrixScale(e){const n=this.setFromMatrixColumn(e,0).length(),i=this.setFromMatrixColumn(e,1).length(),r=this.setFromMatrixColumn(e,2).length();return this.x=n,this.y=i,this.z=r,this}setFromMatrixColumn(e,n){return this.fromArray(e.elements,n*4)}setFromMatrix3Column(e,n){return this.fromArray(e.elements,n*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,n=0){return this.x=e[n],this.y=e[n+1],this.z=e[n+2],this}toArray(e=[],n=0){return e[n]=this.x,e[n+1]=this.y,e[n+2]=this.z,e}fromBufferAttribute(e,n){return this.x=e.getX(n),this.y=e.getY(n),this.z=e.getZ(n),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,n=Math.random()*2-1,i=Math.sqrt(1-n*n);return this.x=i*Math.cos(e),this.y=n,this.z=i*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const Qc=new B,qp=new kr;class no{constructor(e=new B(1/0,1/0,1/0),n=new B(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=n}set(e,n){return this.min.copy(e),this.max.copy(n),this}setFromArray(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n+=3)this.expandByPoint(Bn.fromArray(e,n));return this}setFromBufferAttribute(e){this.makeEmpty();for(let n=0,i=e.count;n<i;n++)this.expandByPoint(Bn.fromBufferAttribute(e,n));return this}setFromPoints(e){this.makeEmpty();for(let n=0,i=e.length;n<i;n++)this.expandByPoint(e[n]);return this}setFromCenterAndSize(e,n){const i=Bn.copy(n).multiplyScalar(.5);return this.min.copy(e).sub(i),this.max.copy(e).add(i),this}setFromObject(e,n=!1){return this.makeEmpty(),this.expandByObject(e,n)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,n=!1){e.updateWorldMatrix(!1,!1);const i=e.geometry;if(i!==void 0){const s=i.getAttribute("position");if(n===!0&&s!==void 0&&e.isInstancedMesh!==!0)for(let a=0,o=s.count;a<o;a++)e.isMesh===!0?e.getVertexPosition(a,Bn):Bn.fromBufferAttribute(s,a),Bn.applyMatrix4(e.matrixWorld),this.expandByPoint(Bn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),wo.copy(e.boundingBox)):(i.boundingBox===null&&i.computeBoundingBox(),wo.copy(i.boundingBox)),wo.applyMatrix4(e.matrixWorld),this.union(wo)}const r=e.children;for(let s=0,a=r.length;s<a;s++)this.expandByObject(r[s],n);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,n){return n.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Bn),Bn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let n,i;return e.normal.x>0?(n=e.normal.x*this.min.x,i=e.normal.x*this.max.x):(n=e.normal.x*this.max.x,i=e.normal.x*this.min.x),e.normal.y>0?(n+=e.normal.y*this.min.y,i+=e.normal.y*this.max.y):(n+=e.normal.y*this.max.y,i+=e.normal.y*this.min.y),e.normal.z>0?(n+=e.normal.z*this.min.z,i+=e.normal.z*this.max.z):(n+=e.normal.z*this.max.z,i+=e.normal.z*this.min.z),n<=-e.constant&&i>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(la),To.subVectors(this.max,la),Wr.subVectors(e.a,la),Xr.subVectors(e.b,la),$r.subVectors(e.c,la),Li.subVectors(Xr,Wr),Di.subVectors($r,Xr),hr.subVectors(Wr,$r);let n=[0,-Li.z,Li.y,0,-Di.z,Di.y,0,-hr.z,hr.y,Li.z,0,-Li.x,Di.z,0,-Di.x,hr.z,0,-hr.x,-Li.y,Li.x,0,-Di.y,Di.x,0,-hr.y,hr.x,0];return!Jc(n,Wr,Xr,$r,To)||(n=[1,0,0,0,1,0,0,0,1],!Jc(n,Wr,Xr,$r,To))?!1:(Co.crossVectors(Li,Di),n=[Co.x,Co.y,Co.z],Jc(n,Wr,Xr,$r,To))}clampPoint(e,n){return n.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Bn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Bn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(ci[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),ci[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),ci[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),ci[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),ci[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),ci[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),ci[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),ci[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(ci),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}}const ci=[new B,new B,new B,new B,new B,new B,new B,new B],Bn=new B,wo=new no,Wr=new B,Xr=new B,$r=new B,Li=new B,Di=new B,hr=new B,la=new B,To=new B,Co=new B,fr=new B;function Jc(t,e,n,i,r){for(let s=0,a=t.length-3;s<=a;s+=3){fr.fromArray(t,s);const o=r.x*Math.abs(fr.x)+r.y*Math.abs(fr.y)+r.z*Math.abs(fr.z),c=e.dot(fr),h=n.dot(fr),u=i.dot(fr);if(Math.max(-Math.max(c,h,u),Math.min(c,h,u))>o)return!1}return!0}const kS=new no,ca=new B,eu=new B;class fc{constructor(e=new B,n=-1){this.isSphere=!0,this.center=e,this.radius=n}set(e,n){return this.center.copy(e),this.radius=n,this}setFromPoints(e,n){const i=this.center;n!==void 0?i.copy(n):kS.setFromPoints(e).getCenter(i);let r=0;for(let s=0,a=e.length;s<a;s++)r=Math.max(r,i.distanceToSquared(e[s]));return this.radius=Math.sqrt(r),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const n=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=n*n}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,n){const i=this.center.distanceToSquared(e);return n.copy(e),i>this.radius*this.radius&&(n.sub(this.center).normalize(),n.multiplyScalar(this.radius).add(this.center)),n}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ca.subVectors(e,this.center);const n=ca.lengthSq();if(n>this.radius*this.radius){const i=Math.sqrt(n),r=(i-this.radius)*.5;this.center.addScaledVector(ca,r/i),this.radius+=r}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(eu.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ca.copy(e.center).add(eu)),this.expandByPoint(ca.copy(e.center).sub(eu))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}}const ui=new B,tu=new B,bo=new B,Ii=new B,nu=new B,Ao=new B,iu=new B;class df{constructor(e=new B,n=new B(0,0,-1)){this.origin=e,this.direction=n}set(e,n){return this.origin.copy(e),this.direction.copy(n),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,n){return n.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,ui)),this}closestPointToPoint(e,n){n.subVectors(e,this.origin);const i=n.dot(this.direction);return i<0?n.copy(this.origin):n.copy(this.origin).addScaledVector(this.direction,i)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const n=ui.subVectors(e,this.origin).dot(this.direction);return n<0?this.origin.distanceToSquared(e):(ui.copy(this.origin).addScaledVector(this.direction,n),ui.distanceToSquared(e))}distanceSqToSegment(e,n,i,r){tu.copy(e).add(n).multiplyScalar(.5),bo.copy(n).sub(e).normalize(),Ii.copy(this.origin).sub(tu);const s=e.distanceTo(n)*.5,a=-this.direction.dot(bo),o=Ii.dot(this.direction),c=-Ii.dot(bo),h=Ii.lengthSq(),u=Math.abs(1-a*a);let f,p,m,S;if(u>0)if(f=a*c-o,p=a*o-c,S=s*u,f>=0)if(p>=-S)if(p<=S){const x=1/u;f*=x,p*=x,m=f*(f+a*p+2*o)+p*(a*f+p+2*c)+h}else p=s,f=Math.max(0,-(a*p+o)),m=-f*f+p*(p+2*c)+h;else p=-s,f=Math.max(0,-(a*p+o)),m=-f*f+p*(p+2*c)+h;else p<=-S?(f=Math.max(0,-(-a*s+o)),p=f>0?-s:Math.min(Math.max(-s,-c),s),m=-f*f+p*(p+2*c)+h):p<=S?(f=0,p=Math.min(Math.max(-s,-c),s),m=p*(p+2*c)+h):(f=Math.max(0,-(a*s+o)),p=f>0?s:Math.min(Math.max(-s,-c),s),m=-f*f+p*(p+2*c)+h);else p=a>0?-s:s,f=Math.max(0,-(a*p+o)),m=-f*f+p*(p+2*c)+h;return i&&i.copy(this.origin).addScaledVector(this.direction,f),r&&r.copy(tu).addScaledVector(bo,p),m}intersectSphere(e,n){ui.subVectors(e.center,this.origin);const i=ui.dot(this.direction),r=ui.dot(ui)-i*i,s=e.radius*e.radius;if(r>s)return null;const a=Math.sqrt(s-r),o=i-a,c=i+a;return c<0?null:o<0?this.at(c,n):this.at(o,n)}intersectsSphere(e){return this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const n=e.normal.dot(this.direction);if(n===0)return e.distanceToPoint(this.origin)===0?0:null;const i=-(this.origin.dot(e.normal)+e.constant)/n;return i>=0?i:null}intersectPlane(e,n){const i=this.distanceToPlane(e);return i===null?null:this.at(i,n)}intersectsPlane(e){const n=e.distanceToPoint(this.origin);return n===0||e.normal.dot(this.direction)*n<0}intersectBox(e,n){let i,r,s,a,o,c;const h=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,p=this.origin;return h>=0?(i=(e.min.x-p.x)*h,r=(e.max.x-p.x)*h):(i=(e.max.x-p.x)*h,r=(e.min.x-p.x)*h),u>=0?(s=(e.min.y-p.y)*u,a=(e.max.y-p.y)*u):(s=(e.max.y-p.y)*u,a=(e.min.y-p.y)*u),i>a||s>r||((s>i||isNaN(i))&&(i=s),(a<r||isNaN(r))&&(r=a),f>=0?(o=(e.min.z-p.z)*f,c=(e.max.z-p.z)*f):(o=(e.max.z-p.z)*f,c=(e.min.z-p.z)*f),i>c||o>r)||((o>i||i!==i)&&(i=o),(c<r||r!==r)&&(r=c),r<0)?null:this.at(i>=0?i:r,n)}intersectsBox(e){return this.intersectBox(e,ui)!==null}intersectTriangle(e,n,i,r,s){nu.subVectors(n,e),Ao.subVectors(i,e),iu.crossVectors(nu,Ao);let a=this.direction.dot(iu),o;if(a>0){if(r)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Ii.subVectors(this.origin,e);const c=o*this.direction.dot(Ao.crossVectors(Ii,Ao));if(c<0)return null;const h=o*this.direction.dot(nu.cross(Ii));if(h<0||c+h>a)return null;const u=-o*Ii.dot(iu);return u<0?null:this.at(u/a,s)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class _t{constructor(e,n,i,r,s,a,o,c,h,u,f,p,m,S,x,g){_t.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,n,i,r,s,a,o,c,h,u,f,p,m,S,x,g)}set(e,n,i,r,s,a,o,c,h,u,f,p,m,S,x,g){const d=this.elements;return d[0]=e,d[4]=n,d[8]=i,d[12]=r,d[1]=s,d[5]=a,d[9]=o,d[13]=c,d[2]=h,d[6]=u,d[10]=f,d[14]=p,d[3]=m,d[7]=S,d[11]=x,d[15]=g,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new _t().fromArray(this.elements)}copy(e){const n=this.elements,i=e.elements;return n[0]=i[0],n[1]=i[1],n[2]=i[2],n[3]=i[3],n[4]=i[4],n[5]=i[5],n[6]=i[6],n[7]=i[7],n[8]=i[8],n[9]=i[9],n[10]=i[10],n[11]=i[11],n[12]=i[12],n[13]=i[13],n[14]=i[14],n[15]=i[15],this}copyPosition(e){const n=this.elements,i=e.elements;return n[12]=i[12],n[13]=i[13],n[14]=i[14],this}setFromMatrix3(e){const n=e.elements;return this.set(n[0],n[3],n[6],0,n[1],n[4],n[7],0,n[2],n[5],n[8],0,0,0,0,1),this}extractBasis(e,n,i){return e.setFromMatrixColumn(this,0),n.setFromMatrixColumn(this,1),i.setFromMatrixColumn(this,2),this}makeBasis(e,n,i){return this.set(e.x,n.x,i.x,0,e.y,n.y,i.y,0,e.z,n.z,i.z,0,0,0,0,1),this}extractRotation(e){const n=this.elements,i=e.elements,r=1/qr.setFromMatrixColumn(e,0).length(),s=1/qr.setFromMatrixColumn(e,1).length(),a=1/qr.setFromMatrixColumn(e,2).length();return n[0]=i[0]*r,n[1]=i[1]*r,n[2]=i[2]*r,n[3]=0,n[4]=i[4]*s,n[5]=i[5]*s,n[6]=i[6]*s,n[7]=0,n[8]=i[8]*a,n[9]=i[9]*a,n[10]=i[10]*a,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromEuler(e){const n=this.elements,i=e.x,r=e.y,s=e.z,a=Math.cos(i),o=Math.sin(i),c=Math.cos(r),h=Math.sin(r),u=Math.cos(s),f=Math.sin(s);if(e.order==="XYZ"){const p=a*u,m=a*f,S=o*u,x=o*f;n[0]=c*u,n[4]=-c*f,n[8]=h,n[1]=m+S*h,n[5]=p-x*h,n[9]=-o*c,n[2]=x-p*h,n[6]=S+m*h,n[10]=a*c}else if(e.order==="YXZ"){const p=c*u,m=c*f,S=h*u,x=h*f;n[0]=p+x*o,n[4]=S*o-m,n[8]=a*h,n[1]=a*f,n[5]=a*u,n[9]=-o,n[2]=m*o-S,n[6]=x+p*o,n[10]=a*c}else if(e.order==="ZXY"){const p=c*u,m=c*f,S=h*u,x=h*f;n[0]=p-x*o,n[4]=-a*f,n[8]=S+m*o,n[1]=m+S*o,n[5]=a*u,n[9]=x-p*o,n[2]=-a*h,n[6]=o,n[10]=a*c}else if(e.order==="ZYX"){const p=a*u,m=a*f,S=o*u,x=o*f;n[0]=c*u,n[4]=S*h-m,n[8]=p*h+x,n[1]=c*f,n[5]=x*h+p,n[9]=m*h-S,n[2]=-h,n[6]=o*c,n[10]=a*c}else if(e.order==="YZX"){const p=a*c,m=a*h,S=o*c,x=o*h;n[0]=c*u,n[4]=x-p*f,n[8]=S*f+m,n[1]=f,n[5]=a*u,n[9]=-o*u,n[2]=-h*u,n[6]=m*f+S,n[10]=p-x*f}else if(e.order==="XZY"){const p=a*c,m=a*h,S=o*c,x=o*h;n[0]=c*u,n[4]=-f,n[8]=h*u,n[1]=p*f+x,n[5]=a*u,n[9]=m*f-S,n[2]=S*f-m,n[6]=o*u,n[10]=x*f+p}return n[3]=0,n[7]=0,n[11]=0,n[12]=0,n[13]=0,n[14]=0,n[15]=1,this}makeRotationFromQuaternion(e){return this.compose(OS,e,jS)}lookAt(e,n,i){const r=this.elements;return _n.subVectors(e,n),_n.lengthSq()===0&&(_n.z=1),_n.normalize(),Ui.crossVectors(i,_n),Ui.lengthSq()===0&&(Math.abs(i.z)===1?_n.x+=1e-4:_n.z+=1e-4,_n.normalize(),Ui.crossVectors(i,_n)),Ui.normalize(),Ro.crossVectors(_n,Ui),r[0]=Ui.x,r[4]=Ro.x,r[8]=_n.x,r[1]=Ui.y,r[5]=Ro.y,r[9]=_n.y,r[2]=Ui.z,r[6]=Ro.z,r[10]=_n.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,n){const i=e.elements,r=n.elements,s=this.elements,a=i[0],o=i[4],c=i[8],h=i[12],u=i[1],f=i[5],p=i[9],m=i[13],S=i[2],x=i[6],g=i[10],d=i[14],_=i[3],y=i[7],E=i[11],P=i[15],b=r[0],C=r[4],N=r[8],z=r[12],v=r[1],M=r[5],I=r[9],j=r[13],q=r[2],Z=r[6],H=r[10],Y=r[14],L=r[3],O=r[7],V=r[11],se=r[15];return s[0]=a*b+o*v+c*q+h*L,s[4]=a*C+o*M+c*Z+h*O,s[8]=a*N+o*I+c*H+h*V,s[12]=a*z+o*j+c*Y+h*se,s[1]=u*b+f*v+p*q+m*L,s[5]=u*C+f*M+p*Z+m*O,s[9]=u*N+f*I+p*H+m*V,s[13]=u*z+f*j+p*Y+m*se,s[2]=S*b+x*v+g*q+d*L,s[6]=S*C+x*M+g*Z+d*O,s[10]=S*N+x*I+g*H+d*V,s[14]=S*z+x*j+g*Y+d*se,s[3]=_*b+y*v+E*q+P*L,s[7]=_*C+y*M+E*Z+P*O,s[11]=_*N+y*I+E*H+P*V,s[15]=_*z+y*j+E*Y+P*se,this}multiplyScalar(e){const n=this.elements;return n[0]*=e,n[4]*=e,n[8]*=e,n[12]*=e,n[1]*=e,n[5]*=e,n[9]*=e,n[13]*=e,n[2]*=e,n[6]*=e,n[10]*=e,n[14]*=e,n[3]*=e,n[7]*=e,n[11]*=e,n[15]*=e,this}determinant(){const e=this.elements,n=e[0],i=e[4],r=e[8],s=e[12],a=e[1],o=e[5],c=e[9],h=e[13],u=e[2],f=e[6],p=e[10],m=e[14],S=e[3],x=e[7],g=e[11],d=e[15];return S*(+s*c*f-r*h*f-s*o*p+i*h*p+r*o*m-i*c*m)+x*(+n*c*m-n*h*p+s*a*p-r*a*m+r*h*u-s*c*u)+g*(+n*h*f-n*o*m-s*a*f+i*a*m+s*o*u-i*h*u)+d*(-r*o*u-n*c*f+n*o*p+r*a*f-i*a*p+i*c*u)}transpose(){const e=this.elements;let n;return n=e[1],e[1]=e[4],e[4]=n,n=e[2],e[2]=e[8],e[8]=n,n=e[6],e[6]=e[9],e[9]=n,n=e[3],e[3]=e[12],e[12]=n,n=e[7],e[7]=e[13],e[13]=n,n=e[11],e[11]=e[14],e[14]=n,this}setPosition(e,n,i){const r=this.elements;return e.isVector3?(r[12]=e.x,r[13]=e.y,r[14]=e.z):(r[12]=e,r[13]=n,r[14]=i),this}invert(){const e=this.elements,n=e[0],i=e[1],r=e[2],s=e[3],a=e[4],o=e[5],c=e[6],h=e[7],u=e[8],f=e[9],p=e[10],m=e[11],S=e[12],x=e[13],g=e[14],d=e[15],_=f*g*h-x*p*h+x*c*m-o*g*m-f*c*d+o*p*d,y=S*p*h-u*g*h-S*c*m+a*g*m+u*c*d-a*p*d,E=u*x*h-S*f*h+S*o*m-a*x*m-u*o*d+a*f*d,P=S*f*c-u*x*c-S*o*p+a*x*p+u*o*g-a*f*g,b=n*_+i*y+r*E+s*P;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const C=1/b;return e[0]=_*C,e[1]=(x*p*s-f*g*s-x*r*m+i*g*m+f*r*d-i*p*d)*C,e[2]=(o*g*s-x*c*s+x*r*h-i*g*h-o*r*d+i*c*d)*C,e[3]=(f*c*s-o*p*s-f*r*h+i*p*h+o*r*m-i*c*m)*C,e[4]=y*C,e[5]=(u*g*s-S*p*s+S*r*m-n*g*m-u*r*d+n*p*d)*C,e[6]=(S*c*s-a*g*s-S*r*h+n*g*h+a*r*d-n*c*d)*C,e[7]=(a*p*s-u*c*s+u*r*h-n*p*h-a*r*m+n*c*m)*C,e[8]=E*C,e[9]=(S*f*s-u*x*s-S*i*m+n*x*m+u*i*d-n*f*d)*C,e[10]=(a*x*s-S*o*s+S*i*h-n*x*h-a*i*d+n*o*d)*C,e[11]=(u*o*s-a*f*s-u*i*h+n*f*h+a*i*m-n*o*m)*C,e[12]=P*C,e[13]=(u*x*r-S*f*r+S*i*p-n*x*p-u*i*g+n*f*g)*C,e[14]=(S*o*r-a*x*r-S*i*c+n*x*c+a*i*g-n*o*g)*C,e[15]=(a*f*r-u*o*r+u*i*c-n*f*c-a*i*p+n*o*p)*C,this}scale(e){const n=this.elements,i=e.x,r=e.y,s=e.z;return n[0]*=i,n[4]*=r,n[8]*=s,n[1]*=i,n[5]*=r,n[9]*=s,n[2]*=i,n[6]*=r,n[10]*=s,n[3]*=i,n[7]*=r,n[11]*=s,this}getMaxScaleOnAxis(){const e=this.elements,n=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],i=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],r=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(n,i,r))}makeTranslation(e,n,i){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,n,0,0,1,i,0,0,0,1),this}makeRotationX(e){const n=Math.cos(e),i=Math.sin(e);return this.set(1,0,0,0,0,n,-i,0,0,i,n,0,0,0,0,1),this}makeRotationY(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,0,i,0,0,1,0,0,-i,0,n,0,0,0,0,1),this}makeRotationZ(e){const n=Math.cos(e),i=Math.sin(e);return this.set(n,-i,0,0,i,n,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,n){const i=Math.cos(n),r=Math.sin(n),s=1-i,a=e.x,o=e.y,c=e.z,h=s*a,u=s*o;return this.set(h*a+i,h*o-r*c,h*c+r*o,0,h*o+r*c,u*o+i,u*c-r*a,0,h*c-r*o,u*c+r*a,s*c*c+i,0,0,0,0,1),this}makeScale(e,n,i){return this.set(e,0,0,0,0,n,0,0,0,0,i,0,0,0,0,1),this}makeShear(e,n,i,r,s,a){return this.set(1,i,s,0,e,1,a,0,n,r,1,0,0,0,0,1),this}compose(e,n,i){const r=this.elements,s=n._x,a=n._y,o=n._z,c=n._w,h=s+s,u=a+a,f=o+o,p=s*h,m=s*u,S=s*f,x=a*u,g=a*f,d=o*f,_=c*h,y=c*u,E=c*f,P=i.x,b=i.y,C=i.z;return r[0]=(1-(x+d))*P,r[1]=(m+E)*P,r[2]=(S-y)*P,r[3]=0,r[4]=(m-E)*b,r[5]=(1-(p+d))*b,r[6]=(g+_)*b,r[7]=0,r[8]=(S+y)*C,r[9]=(g-_)*C,r[10]=(1-(p+x))*C,r[11]=0,r[12]=e.x,r[13]=e.y,r[14]=e.z,r[15]=1,this}decompose(e,n,i){const r=this.elements;let s=qr.set(r[0],r[1],r[2]).length();const a=qr.set(r[4],r[5],r[6]).length(),o=qr.set(r[8],r[9],r[10]).length();this.determinant()<0&&(s=-s),e.x=r[12],e.y=r[13],e.z=r[14],Hn.copy(this);const h=1/s,u=1/a,f=1/o;return Hn.elements[0]*=h,Hn.elements[1]*=h,Hn.elements[2]*=h,Hn.elements[4]*=u,Hn.elements[5]*=u,Hn.elements[6]*=u,Hn.elements[8]*=f,Hn.elements[9]*=f,Hn.elements[10]*=f,n.setFromRotationMatrix(Hn),i.x=s,i.y=a,i.z=o,this}makePerspective(e,n,i,r,s,a,o=yi){const c=this.elements,h=2*s/(n-e),u=2*s/(i-r),f=(n+e)/(n-e),p=(i+r)/(i-r);let m,S;if(o===yi)m=-(a+s)/(a-s),S=-2*a*s/(a-s);else if(o===Gl)m=-a/(a-s),S=-a*s/(a-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=m,c[14]=S,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,n,i,r,s,a,o=yi){const c=this.elements,h=1/(n-e),u=1/(i-r),f=1/(a-s),p=(n+e)*h,m=(i+r)*u;let S,x;if(o===yi)S=(a+s)*f,x=-2*f;else if(o===Gl)S=s*f,x=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-p,c[1]=0,c[5]=2*u,c[9]=0,c[13]=-m,c[2]=0,c[6]=0,c[10]=x,c[14]=-S,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const n=this.elements,i=e.elements;for(let r=0;r<16;r++)if(n[r]!==i[r])return!1;return!0}fromArray(e,n=0){for(let i=0;i<16;i++)this.elements[i]=e[i+n];return this}toArray(e=[],n=0){const i=this.elements;return e[n]=i[0],e[n+1]=i[1],e[n+2]=i[2],e[n+3]=i[3],e[n+4]=i[4],e[n+5]=i[5],e[n+6]=i[6],e[n+7]=i[7],e[n+8]=i[8],e[n+9]=i[9],e[n+10]=i[10],e[n+11]=i[11],e[n+12]=i[12],e[n+13]=i[13],e[n+14]=i[14],e[n+15]=i[15],e}}const qr=new B,Hn=new _t,OS=new B(0,0,0),jS=new B(1,1,1),Ui=new B,Ro=new B,_n=new B,Yp=new _t,Kp=new kr;class oi{constructor(e=0,n=0,i=0,r=oi.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,n,i,r=this._order){return this._x=e,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,n=this._order,i=!0){const r=e.elements,s=r[0],a=r[4],o=r[8],c=r[1],h=r[5],u=r[9],f=r[2],p=r[6],m=r[10];switch(n){case"XYZ":this._y=Math.asin(qt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,m),this._z=Math.atan2(-a,s)):(this._x=Math.atan2(p,h),this._z=0);break;case"YXZ":this._x=Math.asin(-qt(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,m),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-f,s),this._z=0);break;case"ZXY":this._x=Math.asin(qt(p,-1,1)),Math.abs(p)<.9999999?(this._y=Math.atan2(-f,m),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(c,s));break;case"ZYX":this._y=Math.asin(-qt(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(p,m),this._z=Math.atan2(c,s)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(qt(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,h),this._y=Math.atan2(-f,s)):(this._x=0,this._y=Math.atan2(o,m));break;case"XZY":this._z=Math.asin(-qt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(p,h),this._y=Math.atan2(o,s)):(this._x=Math.atan2(-u,m),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(e,n,i){return Yp.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Yp,n,i)}setFromVector3(e,n=this._order){return this.set(e.x,e.y,e.z,n)}reorder(e){return Kp.setFromEuler(this),this.setFromQuaternion(Kp,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],n=0){return e[n]=this._x,e[n+1]=this._y,e[n+2]=this._z,e[n+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}oi.DEFAULT_ORDER="XYZ";class wv{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let zS=0;const Zp=new B,Yr=new kr,di=new _t,Po=new B,ua=new B,BS=new B,HS=new kr,Qp=new B(1,0,0),Jp=new B(0,1,0),em=new B(0,0,1),tm={type:"added"},VS={type:"removed"},Kr={type:"childadded",child:null},ru={type:"childremoved",child:null};class Ot extends zr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:zS++}),this.uuid=to(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ot.DEFAULT_UP.clone();const e=new B,n=new oi,i=new kr,r=new B(1,1,1);function s(){i.setFromEuler(n,!1)}function a(){n.setFromQuaternion(i,void 0,!1)}n._onChange(s),i._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new _t},normalMatrix:{value:new Be}}),this.matrix=new _t,this.matrixWorld=new _t,this.matrixAutoUpdate=Ot.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new wv,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,n){this.quaternion.setFromAxisAngle(e,n)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,n){return Yr.setFromAxisAngle(e,n),this.quaternion.multiply(Yr),this}rotateOnWorldAxis(e,n){return Yr.setFromAxisAngle(e,n),this.quaternion.premultiply(Yr),this}rotateX(e){return this.rotateOnAxis(Qp,e)}rotateY(e){return this.rotateOnAxis(Jp,e)}rotateZ(e){return this.rotateOnAxis(em,e)}translateOnAxis(e,n){return Zp.copy(e).applyQuaternion(this.quaternion),this.position.add(Zp.multiplyScalar(n)),this}translateX(e){return this.translateOnAxis(Qp,e)}translateY(e){return this.translateOnAxis(Jp,e)}translateZ(e){return this.translateOnAxis(em,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(di.copy(this.matrixWorld).invert())}lookAt(e,n,i){e.isVector3?Po.copy(e):Po.set(e,n,i);const r=this.parent;this.updateWorldMatrix(!0,!1),ua.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?di.lookAt(ua,Po,this.up):di.lookAt(Po,ua,this.up),this.quaternion.setFromRotationMatrix(di),r&&(di.extractRotation(r.matrixWorld),Yr.setFromRotationMatrix(di),this.quaternion.premultiply(Yr.invert()))}add(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return e===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(tm),Kr.child=e,this.dispatchEvent(Kr),Kr.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}const n=this.children.indexOf(e);return n!==-1&&(e.parent=null,this.children.splice(n,1),e.dispatchEvent(VS),ru.child=e,this.dispatchEvent(ru),ru.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),di.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),di.multiply(e.parent.matrixWorld)),e.applyMatrix4(di),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(tm),Kr.child=e,this.dispatchEvent(Kr),Kr.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,n){if(this[e]===n)return this;for(let i=0,r=this.children.length;i<r;i++){const a=this.children[i].getObjectByProperty(e,n);if(a!==void 0)return a}}getObjectsByProperty(e,n,i=[]){this[e]===n&&i.push(this);const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].getObjectsByProperty(e,n,i);return i}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ua,e,BS),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ua,HS,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const n=this.matrixWorld.elements;return e.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(e){e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(e)}traverseAncestors(e){const n=this.parent;n!==null&&(e(n),n.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(e)}updateWorldMatrix(e,n){const i=this.parent;if(e===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){const r=this.children;for(let s=0,a=r.length;s<a;s++)r[s].updateWorldMatrix(!1,!0)}}toJSON(e){const n=e===void 0||typeof e=="string",i={};n&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});const r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.visibility=this._visibility,r.active=this._active,r.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.geometryCount=this._geometryCount,r.matricesTexture=this._matricesTexture.toJSON(e),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(r.boundingSphere={center:r.boundingSphere.center.toArray(),radius:r.boundingSphere.radius}),this.boundingBox!==null&&(r.boundingBox={min:r.boundingBox.min.toArray(),max:r.boundingBox.max.toArray()}));function s(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(e)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=s(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const c=o.shapes;if(Array.isArray(c))for(let h=0,u=c.length;h<u;h++){const f=c[h];s(e.shapes,f)}else s(e.shapes,c)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(e.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let c=0,h=this.material.length;c<h;c++)o.push(s(e.materials,this.material[c]));r.material=o}else r.material=s(e.materials,this.material);if(this.children.length>0){r.children=[];for(let o=0;o<this.children.length;o++)r.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){r.animations=[];for(let o=0;o<this.animations.length;o++){const c=this.animations[o];r.animations.push(s(e.animations,c))}}if(n){const o=a(e.geometries),c=a(e.materials),h=a(e.textures),u=a(e.images),f=a(e.shapes),p=a(e.skeletons),m=a(e.animations),S=a(e.nodes);o.length>0&&(i.geometries=o),c.length>0&&(i.materials=c),h.length>0&&(i.textures=h),u.length>0&&(i.images=u),f.length>0&&(i.shapes=f),p.length>0&&(i.skeletons=p),m.length>0&&(i.animations=m),S.length>0&&(i.nodes=S)}return i.object=r,i;function a(o){const c=[];for(const h in o){const u=o[h];delete u.metadata,c.push(u)}return c}}clone(e){return new this.constructor().copy(this,e)}copy(e,n=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),n===!0)for(let i=0;i<e.children.length;i++){const r=e.children[i];this.add(r.clone())}return this}}Ot.DEFAULT_UP=new B(0,1,0);Ot.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ot.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const Vn=new B,hi=new B,su=new B,fi=new B,Zr=new B,Qr=new B,nm=new B,au=new B,ou=new B,lu=new B,cu=new St,uu=new St,du=new St;class qn{constructor(e=new B,n=new B,i=new B){this.a=e,this.b=n,this.c=i}static getNormal(e,n,i,r){r.subVectors(i,n),Vn.subVectors(e,n),r.cross(Vn);const s=r.lengthSq();return s>0?r.multiplyScalar(1/Math.sqrt(s)):r.set(0,0,0)}static getBarycoord(e,n,i,r,s){Vn.subVectors(r,n),hi.subVectors(i,n),su.subVectors(e,n);const a=Vn.dot(Vn),o=Vn.dot(hi),c=Vn.dot(su),h=hi.dot(hi),u=hi.dot(su),f=a*h-o*o;if(f===0)return s.set(0,0,0),null;const p=1/f,m=(h*c-o*u)*p,S=(a*u-o*c)*p;return s.set(1-m-S,S,m)}static containsPoint(e,n,i,r){return this.getBarycoord(e,n,i,r,fi)===null?!1:fi.x>=0&&fi.y>=0&&fi.x+fi.y<=1}static getInterpolation(e,n,i,r,s,a,o,c){return this.getBarycoord(e,n,i,r,fi)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(s,fi.x),c.addScaledVector(a,fi.y),c.addScaledVector(o,fi.z),c)}static getInterpolatedAttribute(e,n,i,r,s,a){return cu.setScalar(0),uu.setScalar(0),du.setScalar(0),cu.fromBufferAttribute(e,n),uu.fromBufferAttribute(e,i),du.fromBufferAttribute(e,r),a.setScalar(0),a.addScaledVector(cu,s.x),a.addScaledVector(uu,s.y),a.addScaledVector(du,s.z),a}static isFrontFacing(e,n,i,r){return Vn.subVectors(i,n),hi.subVectors(e,n),Vn.cross(hi).dot(r)<0}set(e,n,i){return this.a.copy(e),this.b.copy(n),this.c.copy(i),this}setFromPointsAndIndices(e,n,i,r){return this.a.copy(e[n]),this.b.copy(e[i]),this.c.copy(e[r]),this}setFromAttributeAndIndices(e,n,i,r){return this.a.fromBufferAttribute(e,n),this.b.fromBufferAttribute(e,i),this.c.fromBufferAttribute(e,r),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return Vn.subVectors(this.c,this.b),hi.subVectors(this.a,this.b),Vn.cross(hi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return qn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,n){return qn.getBarycoord(e,this.a,this.b,this.c,n)}getInterpolation(e,n,i,r,s){return qn.getInterpolation(e,this.a,this.b,this.c,n,i,r,s)}containsPoint(e){return qn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return qn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,n){const i=this.a,r=this.b,s=this.c;let a,o;Zr.subVectors(r,i),Qr.subVectors(s,i),au.subVectors(e,i);const c=Zr.dot(au),h=Qr.dot(au);if(c<=0&&h<=0)return n.copy(i);ou.subVectors(e,r);const u=Zr.dot(ou),f=Qr.dot(ou);if(u>=0&&f<=u)return n.copy(r);const p=c*f-u*h;if(p<=0&&c>=0&&u<=0)return a=c/(c-u),n.copy(i).addScaledVector(Zr,a);lu.subVectors(e,s);const m=Zr.dot(lu),S=Qr.dot(lu);if(S>=0&&m<=S)return n.copy(s);const x=m*h-c*S;if(x<=0&&h>=0&&S<=0)return o=h/(h-S),n.copy(i).addScaledVector(Qr,o);const g=u*S-m*f;if(g<=0&&f-u>=0&&m-S>=0)return nm.subVectors(s,r),o=(f-u)/(f-u+(m-S)),n.copy(r).addScaledVector(nm,o);const d=1/(g+x+p);return a=x*d,o=p*d,n.copy(i).addScaledVector(Zr,a).addScaledVector(Qr,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Tv={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Fi={h:0,s:0,l:0},No={h:0,s:0,l:0};function hu(t,e,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?t+(e-t)*6*n:n<1/2?e:n<2/3?t+(e-t)*6*(2/3-n):t}class He{constructor(e,n,i){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,n,i)}set(e,n,i){if(n===void 0&&i===void 0){const r=e;r&&r.isColor?this.copy(r):typeof r=="number"?this.setHex(r):typeof r=="string"&&this.setStyle(r)}else this.setRGB(e,n,i);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,n=ti){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,Je.toWorkingColorSpace(this,n),this}setRGB(e,n,i,r=Je.workingColorSpace){return this.r=e,this.g=n,this.b=i,Je.toWorkingColorSpace(this,r),this}setHSL(e,n,i,r=Je.workingColorSpace){if(e=TS(e,1),n=qt(n,0,1),i=qt(i,0,1),n===0)this.r=this.g=this.b=i;else{const s=i<=.5?i*(1+n):i+n-i*n,a=2*i-s;this.r=hu(a,s,e+1/3),this.g=hu(a,s,e),this.b=hu(a,s,e-1/3)}return Je.toWorkingColorSpace(this,r),this}setStyle(e,n=ti){function i(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let r;if(r=/^(\w+)\(([^\)]*)\)/.exec(e)){let s;const a=r[1],o=r[2];switch(a){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,n);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,n);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return i(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,n);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(r=/^\#([A-Fa-f\d]+)$/.exec(e)){const s=r[1],a=s.length;if(a===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,n);if(a===6)return this.setHex(parseInt(s,16),n);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,n);return this}setColorName(e,n=ti){const i=Tv[e.toLowerCase()];return i!==void 0?this.setHex(i,n):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=As(e.r),this.g=As(e.g),this.b=As(e.b),this}copyLinearToSRGB(e){return this.r=Kc(e.r),this.g=Kc(e.g),this.b=Kc(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=ti){return Je.fromWorkingColorSpace(Xt.copy(this),e),Math.round(qt(Xt.r*255,0,255))*65536+Math.round(qt(Xt.g*255,0,255))*256+Math.round(qt(Xt.b*255,0,255))}getHexString(e=ti){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,n=Je.workingColorSpace){Je.fromWorkingColorSpace(Xt.copy(this),n);const i=Xt.r,r=Xt.g,s=Xt.b,a=Math.max(i,r,s),o=Math.min(i,r,s);let c,h;const u=(o+a)/2;if(o===a)c=0,h=0;else{const f=a-o;switch(h=u<=.5?f/(a+o):f/(2-a-o),a){case i:c=(r-s)/f+(r<s?6:0);break;case r:c=(s-i)/f+2;break;case s:c=(i-r)/f+4;break}c/=6}return e.h=c,e.s=h,e.l=u,e}getRGB(e,n=Je.workingColorSpace){return Je.fromWorkingColorSpace(Xt.copy(this),n),e.r=Xt.r,e.g=Xt.g,e.b=Xt.b,e}getStyle(e=ti){Je.fromWorkingColorSpace(Xt.copy(this),e);const n=Xt.r,i=Xt.g,r=Xt.b;return e!==ti?`color(${e} ${n.toFixed(3)} ${i.toFixed(3)} ${r.toFixed(3)})`:`rgb(${Math.round(n*255)},${Math.round(i*255)},${Math.round(r*255)})`}offsetHSL(e,n,i){return this.getHSL(Fi),this.setHSL(Fi.h+e,Fi.s+n,Fi.l+i)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,n){return this.r=e.r+n.r,this.g=e.g+n.g,this.b=e.b+n.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,n){return this.r+=(e.r-this.r)*n,this.g+=(e.g-this.g)*n,this.b+=(e.b-this.b)*n,this}lerpColors(e,n,i){return this.r=e.r+(n.r-e.r)*i,this.g=e.g+(n.g-e.g)*i,this.b=e.b+(n.b-e.b)*i,this}lerpHSL(e,n){this.getHSL(Fi),e.getHSL(No);const i=qc(Fi.h,No.h,n),r=qc(Fi.s,No.s,n),s=qc(Fi.l,No.l,n);return this.setHSL(i,r,s),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const n=this.r,i=this.g,r=this.b,s=e.elements;return this.r=s[0]*n+s[3]*i+s[6]*r,this.g=s[1]*n+s[4]*i+s[7]*r,this.b=s[2]*n+s[5]*i+s[8]*r,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,n=0){return this.r=e[n],this.g=e[n+1],this.b=e[n+2],this}toArray(e=[],n=0){return e[n]=this.r,e[n+1]=this.g,e[n+2]=this.b,e}fromBufferAttribute(e,n){return this.r=e.getX(n),this.g=e.getY(n),this.b=e.getZ(n),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Xt=new He;He.NAMES=Tv;let GS=0;class Ws extends zr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:GS++}),this.uuid=to(),this.name="",this.type="Material",this.blending=Cs,this.side=sr,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=vd,this.blendDst=xd,this.blendEquation=Sr,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new He(0,0,0),this.blendAlpha=0,this.depthFunc=Fs,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Hp,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Vr,this.stencilZFail=Vr,this.stencilZPass=Vr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const n in e){const i=e[n];if(i===void 0){console.warn(`THREE.Material: parameter '${n}' has value of undefined.`);continue}const r=this[n];if(r===void 0){console.warn(`THREE.Material: '${n}' is not a property of THREE.${this.type}.`);continue}r&&r.isColor?r.set(i):r&&r.isVector3&&i&&i.isVector3?r.copy(i):this[n]=i}}toJSON(e){const n=e===void 0||typeof e=="string";n&&(e={textures:{},images:{}});const i={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.color&&this.color.isColor&&(i.color=this.color.getHex()),this.roughness!==void 0&&(i.roughness=this.roughness),this.metalness!==void 0&&(i.metalness=this.metalness),this.sheen!==void 0&&(i.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(i.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(i.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(i.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(i.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(i.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(i.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(i.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(i.shininess=this.shininess),this.clearcoat!==void 0&&(i.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(i.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(i.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(i.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(i.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,i.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(i.dispersion=this.dispersion),this.iridescence!==void 0&&(i.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(i.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(i.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(i.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(i.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(i.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(i.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(i.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(i.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(i.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(i.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(i.lightMap=this.lightMap.toJSON(e).uuid,i.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(i.aoMap=this.aoMap.toJSON(e).uuid,i.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(i.bumpMap=this.bumpMap.toJSON(e).uuid,i.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(i.normalMap=this.normalMap.toJSON(e).uuid,i.normalMapType=this.normalMapType,i.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(i.displacementMap=this.displacementMap.toJSON(e).uuid,i.displacementScale=this.displacementScale,i.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(i.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(i.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(i.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(i.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(i.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(i.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(i.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(i.combine=this.combine)),this.envMapRotation!==void 0&&(i.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(i.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(i.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(i.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(i.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(i.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(i.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(i.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(i.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(i.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(i.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(i.size=this.size),this.shadowSide!==null&&(i.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(i.sizeAttenuation=this.sizeAttenuation),this.blending!==Cs&&(i.blending=this.blending),this.side!==sr&&(i.side=this.side),this.vertexColors===!0&&(i.vertexColors=!0),this.opacity<1&&(i.opacity=this.opacity),this.transparent===!0&&(i.transparent=!0),this.blendSrc!==vd&&(i.blendSrc=this.blendSrc),this.blendDst!==xd&&(i.blendDst=this.blendDst),this.blendEquation!==Sr&&(i.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(i.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(i.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(i.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(i.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(i.blendAlpha=this.blendAlpha),this.depthFunc!==Fs&&(i.depthFunc=this.depthFunc),this.depthTest===!1&&(i.depthTest=this.depthTest),this.depthWrite===!1&&(i.depthWrite=this.depthWrite),this.colorWrite===!1&&(i.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(i.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Hp&&(i.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(i.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(i.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Vr&&(i.stencilFail=this.stencilFail),this.stencilZFail!==Vr&&(i.stencilZFail=this.stencilZFail),this.stencilZPass!==Vr&&(i.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(i.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(i.rotation=this.rotation),this.polygonOffset===!0&&(i.polygonOffset=!0),this.polygonOffsetFactor!==0&&(i.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(i.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(i.linewidth=this.linewidth),this.dashSize!==void 0&&(i.dashSize=this.dashSize),this.gapSize!==void 0&&(i.gapSize=this.gapSize),this.scale!==void 0&&(i.scale=this.scale),this.dithering===!0&&(i.dithering=!0),this.alphaTest>0&&(i.alphaTest=this.alphaTest),this.alphaHash===!0&&(i.alphaHash=!0),this.alphaToCoverage===!0&&(i.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(i.premultipliedAlpha=!0),this.forceSinglePass===!0&&(i.forceSinglePass=!0),this.wireframe===!0&&(i.wireframe=!0),this.wireframeLinewidth>1&&(i.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(i.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(i.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(i.flatShading=!0),this.visible===!1&&(i.visible=!1),this.toneMapped===!1&&(i.toneMapped=!1),this.fog===!1&&(i.fog=!1),Object.keys(this.userData).length>0&&(i.userData=this.userData);function r(s){const a=[];for(const o in s){const c=s[o];delete c.metadata,a.push(c)}return a}if(n){const s=r(e.textures),a=r(e.images);s.length>0&&(i.textures=s),a.length>0&&(i.images=a)}return i}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const n=e.clippingPlanes;let i=null;if(n!==null){const r=n.length;i=new Array(r);for(let s=0;s!==r;++s)i[s]=n[s].clone()}return this.clippingPlanes=i,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}onBuild(){console.warn("Material: onBuild() has been removed.")}}class Cv extends Ws{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new He(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.combine=ov,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const Ct=new B,Lo=new Fe;class ai{constructor(e,n,i=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=e,this.itemSize=n,this.count=e!==void 0?e.length/n:0,this.normalized=i,this.usage=Vp,this.updateRanges=[],this.gpuType=xi,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,n){this.updateRanges.push({start:e,count:n})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,n,i){e*=this.itemSize,i*=n.itemSize;for(let r=0,s=this.itemSize;r<s;r++)this.array[e+r]=n.array[i+r];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let n=0,i=this.count;n<i;n++)Lo.fromBufferAttribute(this,n),Lo.applyMatrix3(e),this.setXY(n,Lo.x,Lo.y);else if(this.itemSize===3)for(let n=0,i=this.count;n<i;n++)Ct.fromBufferAttribute(this,n),Ct.applyMatrix3(e),this.setXYZ(n,Ct.x,Ct.y,Ct.z);return this}applyMatrix4(e){for(let n=0,i=this.count;n<i;n++)Ct.fromBufferAttribute(this,n),Ct.applyMatrix4(e),this.setXYZ(n,Ct.x,Ct.y,Ct.z);return this}applyNormalMatrix(e){for(let n=0,i=this.count;n<i;n++)Ct.fromBufferAttribute(this,n),Ct.applyNormalMatrix(e),this.setXYZ(n,Ct.x,Ct.y,Ct.z);return this}transformDirection(e){for(let n=0,i=this.count;n<i;n++)Ct.fromBufferAttribute(this,n),Ct.transformDirection(e),this.setXYZ(n,Ct.x,Ct.y,Ct.z);return this}set(e,n=0){return this.array.set(e,n),this}getComponent(e,n){let i=this.array[e*this.itemSize+n];return this.normalized&&(i=aa(i,this.array)),i}setComponent(e,n,i){return this.normalized&&(i=rn(i,this.array)),this.array[e*this.itemSize+n]=i,this}getX(e){let n=this.array[e*this.itemSize];return this.normalized&&(n=aa(n,this.array)),n}setX(e,n){return this.normalized&&(n=rn(n,this.array)),this.array[e*this.itemSize]=n,this}getY(e){let n=this.array[e*this.itemSize+1];return this.normalized&&(n=aa(n,this.array)),n}setY(e,n){return this.normalized&&(n=rn(n,this.array)),this.array[e*this.itemSize+1]=n,this}getZ(e){let n=this.array[e*this.itemSize+2];return this.normalized&&(n=aa(n,this.array)),n}setZ(e,n){return this.normalized&&(n=rn(n,this.array)),this.array[e*this.itemSize+2]=n,this}getW(e){let n=this.array[e*this.itemSize+3];return this.normalized&&(n=aa(n,this.array)),n}setW(e,n){return this.normalized&&(n=rn(n,this.array)),this.array[e*this.itemSize+3]=n,this}setXY(e,n,i){return e*=this.itemSize,this.normalized&&(n=rn(n,this.array),i=rn(i,this.array)),this.array[e+0]=n,this.array[e+1]=i,this}setXYZ(e,n,i,r){return e*=this.itemSize,this.normalized&&(n=rn(n,this.array),i=rn(i,this.array),r=rn(r,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this}setXYZW(e,n,i,r,s){return e*=this.itemSize,this.normalized&&(n=rn(n,this.array),i=rn(i,this.array),r=rn(r,this.array),s=rn(s,this.array)),this.array[e+0]=n,this.array[e+1]=i,this.array[e+2]=r,this.array[e+3]=s,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Vp&&(e.usage=this.usage),e}}class bv extends ai{constructor(e,n,i){super(new Uint16Array(e),n,i)}}class Av extends ai{constructor(e,n,i){super(new Uint32Array(e),n,i)}}class Lt extends ai{constructor(e,n,i){super(new Float32Array(e),n,i)}}let WS=0;const Rn=new _t,fu=new Ot,Jr=new B,vn=new no,da=new no,Ut=new B;class bn extends zr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:WS++}),this.uuid=to(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Sv(e)?Av:bv)(e,1):this.index=e,this}getAttribute(e){return this.attributes[e]}setAttribute(e,n){return this.attributes[e]=n,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,n,i=0){this.groups.push({start:e,count:n,materialIndex:i})}clearGroups(){this.groups=[]}setDrawRange(e,n){this.drawRange.start=e,this.drawRange.count=n}applyMatrix4(e){const n=this.attributes.position;n!==void 0&&(n.applyMatrix4(e),n.needsUpdate=!0);const i=this.attributes.normal;if(i!==void 0){const s=new Be().getNormalMatrix(e);i.applyNormalMatrix(s),i.needsUpdate=!0}const r=this.attributes.tangent;return r!==void 0&&(r.transformDirection(e),r.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Rn.makeRotationFromQuaternion(e),this.applyMatrix4(Rn),this}rotateX(e){return Rn.makeRotationX(e),this.applyMatrix4(Rn),this}rotateY(e){return Rn.makeRotationY(e),this.applyMatrix4(Rn),this}rotateZ(e){return Rn.makeRotationZ(e),this.applyMatrix4(Rn),this}translate(e,n,i){return Rn.makeTranslation(e,n,i),this.applyMatrix4(Rn),this}scale(e,n,i){return Rn.makeScale(e,n,i),this.applyMatrix4(Rn),this}lookAt(e){return fu.lookAt(e),fu.updateMatrix(),this.applyMatrix4(fu.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Jr).negate(),this.translate(Jr.x,Jr.y,Jr.z),this}setFromPoints(e){const n=[];for(let i=0,r=e.length;i<r;i++){const s=e[i];n.push(s.x,s.y,s.z||0)}return this.setAttribute("position",new Lt(n,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new no);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new B(-1/0,-1/0,-1/0),new B(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),n)for(let i=0,r=n.length;i<r;i++){const s=n[i];vn.setFromBufferAttribute(s),this.morphTargetsRelative?(Ut.addVectors(this.boundingBox.min,vn.min),this.boundingBox.expandByPoint(Ut),Ut.addVectors(this.boundingBox.max,vn.max),this.boundingBox.expandByPoint(Ut)):(this.boundingBox.expandByPoint(vn.min),this.boundingBox.expandByPoint(vn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new fc);const e=this.attributes.position,n=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new B,1/0);return}if(e){const i=this.boundingSphere.center;if(vn.setFromBufferAttribute(e),n)for(let s=0,a=n.length;s<a;s++){const o=n[s];da.setFromBufferAttribute(o),this.morphTargetsRelative?(Ut.addVectors(vn.min,da.min),vn.expandByPoint(Ut),Ut.addVectors(vn.max,da.max),vn.expandByPoint(Ut)):(vn.expandByPoint(da.min),vn.expandByPoint(da.max))}vn.getCenter(i);let r=0;for(let s=0,a=e.count;s<a;s++)Ut.fromBufferAttribute(e,s),r=Math.max(r,i.distanceToSquared(Ut));if(n)for(let s=0,a=n.length;s<a;s++){const o=n[s],c=this.morphTargetsRelative;for(let h=0,u=o.count;h<u;h++)Ut.fromBufferAttribute(o,h),c&&(Jr.fromBufferAttribute(e,h),Ut.add(Jr)),r=Math.max(r,i.distanceToSquared(Ut))}this.boundingSphere.radius=Math.sqrt(r),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,n=this.attributes;if(e===null||n.position===void 0||n.normal===void 0||n.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const i=n.position,r=n.normal,s=n.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new ai(new Float32Array(4*i.count),4));const a=this.getAttribute("tangent"),o=[],c=[];for(let N=0;N<i.count;N++)o[N]=new B,c[N]=new B;const h=new B,u=new B,f=new B,p=new Fe,m=new Fe,S=new Fe,x=new B,g=new B;function d(N,z,v){h.fromBufferAttribute(i,N),u.fromBufferAttribute(i,z),f.fromBufferAttribute(i,v),p.fromBufferAttribute(s,N),m.fromBufferAttribute(s,z),S.fromBufferAttribute(s,v),u.sub(h),f.sub(h),m.sub(p),S.sub(p);const M=1/(m.x*S.y-S.x*m.y);isFinite(M)&&(x.copy(u).multiplyScalar(S.y).addScaledVector(f,-m.y).multiplyScalar(M),g.copy(f).multiplyScalar(m.x).addScaledVector(u,-S.x).multiplyScalar(M),o[N].add(x),o[z].add(x),o[v].add(x),c[N].add(g),c[z].add(g),c[v].add(g))}let _=this.groups;_.length===0&&(_=[{start:0,count:e.count}]);for(let N=0,z=_.length;N<z;++N){const v=_[N],M=v.start,I=v.count;for(let j=M,q=M+I;j<q;j+=3)d(e.getX(j+0),e.getX(j+1),e.getX(j+2))}const y=new B,E=new B,P=new B,b=new B;function C(N){P.fromBufferAttribute(r,N),b.copy(P);const z=o[N];y.copy(z),y.sub(P.multiplyScalar(P.dot(z))).normalize(),E.crossVectors(b,z);const M=E.dot(c[N])<0?-1:1;a.setXYZW(N,y.x,y.y,y.z,M)}for(let N=0,z=_.length;N<z;++N){const v=_[N],M=v.start,I=v.count;for(let j=M,q=M+I;j<q;j+=3)C(e.getX(j+0)),C(e.getX(j+1)),C(e.getX(j+2))}}computeVertexNormals(){const e=this.index,n=this.getAttribute("position");if(n!==void 0){let i=this.getAttribute("normal");if(i===void 0)i=new ai(new Float32Array(n.count*3),3),this.setAttribute("normal",i);else for(let p=0,m=i.count;p<m;p++)i.setXYZ(p,0,0,0);const r=new B,s=new B,a=new B,o=new B,c=new B,h=new B,u=new B,f=new B;if(e)for(let p=0,m=e.count;p<m;p+=3){const S=e.getX(p+0),x=e.getX(p+1),g=e.getX(p+2);r.fromBufferAttribute(n,S),s.fromBufferAttribute(n,x),a.fromBufferAttribute(n,g),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),o.fromBufferAttribute(i,S),c.fromBufferAttribute(i,x),h.fromBufferAttribute(i,g),o.add(u),c.add(u),h.add(u),i.setXYZ(S,o.x,o.y,o.z),i.setXYZ(x,c.x,c.y,c.z),i.setXYZ(g,h.x,h.y,h.z)}else for(let p=0,m=n.count;p<m;p+=3)r.fromBufferAttribute(n,p+0),s.fromBufferAttribute(n,p+1),a.fromBufferAttribute(n,p+2),u.subVectors(a,s),f.subVectors(r,s),u.cross(f),i.setXYZ(p+0,u.x,u.y,u.z),i.setXYZ(p+1,u.x,u.y,u.z),i.setXYZ(p+2,u.x,u.y,u.z);this.normalizeNormals(),i.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let n=0,i=e.count;n<i;n++)Ut.fromBufferAttribute(e,n),Ut.normalize(),e.setXYZ(n,Ut.x,Ut.y,Ut.z)}toNonIndexed(){function e(o,c){const h=o.array,u=o.itemSize,f=o.normalized,p=new h.constructor(c.length*u);let m=0,S=0;for(let x=0,g=c.length;x<g;x++){o.isInterleavedBufferAttribute?m=c[x]*o.data.stride+o.offset:m=c[x]*u;for(let d=0;d<u;d++)p[S++]=h[m++]}return new ai(p,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const n=new bn,i=this.index.array,r=this.attributes;for(const o in r){const c=r[o],h=e(c,i);n.setAttribute(o,h)}const s=this.morphAttributes;for(const o in s){const c=[],h=s[o];for(let u=0,f=h.length;u<f;u++){const p=h[u],m=e(p,i);c.push(m)}n.morphAttributes[o]=c}n.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,c=a.length;o<c;o++){const h=a[o];n.addGroup(h.start,h.count,h.materialIndex)}return n}toJSON(){const e={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const c=this.parameters;for(const h in c)c[h]!==void 0&&(e[h]=c[h]);return e}e.data={attributes:{}};const n=this.index;n!==null&&(e.data.index={type:n.array.constructor.name,array:Array.prototype.slice.call(n.array)});const i=this.attributes;for(const c in i){const h=i[c];e.data.attributes[c]=h.toJSON(e.data)}const r={};let s=!1;for(const c in this.morphAttributes){const h=this.morphAttributes[c],u=[];for(let f=0,p=h.length;f<p;f++){const m=h[f];u.push(m.toJSON(e.data))}u.length>0&&(r[c]=u,s=!0)}s&&(e.data.morphAttributes=r,e.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(e.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const n={};this.name=e.name;const i=e.index;i!==null&&this.setIndex(i.clone(n));const r=e.attributes;for(const h in r){const u=r[h];this.setAttribute(h,u.clone(n))}const s=e.morphAttributes;for(const h in s){const u=[],f=s[h];for(let p=0,m=f.length;p<m;p++)u.push(f[p].clone(n));this.morphAttributes[h]=u}this.morphTargetsRelative=e.morphTargetsRelative;const a=e.groups;for(let h=0,u=a.length;h<u;h++){const f=a[h];this.addGroup(f.start,f.count,f.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const c=e.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const im=new _t,pr=new df,Do=new fc,rm=new B,Io=new B,Uo=new B,Fo=new B,pu=new B,ko=new B,sm=new B,Oo=new B;class Mn extends Ot{constructor(e=new bn,n=new Cv){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}getVertexPosition(e,n){const i=this.geometry,r=i.attributes.position,s=i.morphAttributes.position,a=i.morphTargetsRelative;n.fromBufferAttribute(r,e);const o=this.morphTargetInfluences;if(s&&o){ko.set(0,0,0);for(let c=0,h=s.length;c<h;c++){const u=o[c],f=s[c];u!==0&&(pu.fromBufferAttribute(f,e),a?ko.addScaledVector(pu,u):ko.addScaledVector(pu.sub(n),u))}n.add(ko)}return n}raycast(e,n){const i=this.geometry,r=this.material,s=this.matrixWorld;r!==void 0&&(i.boundingSphere===null&&i.computeBoundingSphere(),Do.copy(i.boundingSphere),Do.applyMatrix4(s),pr.copy(e.ray).recast(e.near),!(Do.containsPoint(pr.origin)===!1&&(pr.intersectSphere(Do,rm)===null||pr.origin.distanceToSquared(rm)>(e.far-e.near)**2))&&(im.copy(s).invert(),pr.copy(e.ray).applyMatrix4(im),!(i.boundingBox!==null&&pr.intersectsBox(i.boundingBox)===!1)&&this._computeIntersections(e,n,pr)))}_computeIntersections(e,n,i){let r;const s=this.geometry,a=this.material,o=s.index,c=s.attributes.position,h=s.attributes.uv,u=s.attributes.uv1,f=s.attributes.normal,p=s.groups,m=s.drawRange;if(o!==null)if(Array.isArray(a))for(let S=0,x=p.length;S<x;S++){const g=p[S],d=a[g.materialIndex],_=Math.max(g.start,m.start),y=Math.min(o.count,Math.min(g.start+g.count,m.start+m.count));for(let E=_,P=y;E<P;E+=3){const b=o.getX(E),C=o.getX(E+1),N=o.getX(E+2);r=jo(this,d,e,i,h,u,f,b,C,N),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=g.materialIndex,n.push(r))}}else{const S=Math.max(0,m.start),x=Math.min(o.count,m.start+m.count);for(let g=S,d=x;g<d;g+=3){const _=o.getX(g),y=o.getX(g+1),E=o.getX(g+2);r=jo(this,a,e,i,h,u,f,_,y,E),r&&(r.faceIndex=Math.floor(g/3),n.push(r))}}else if(c!==void 0)if(Array.isArray(a))for(let S=0,x=p.length;S<x;S++){const g=p[S],d=a[g.materialIndex],_=Math.max(g.start,m.start),y=Math.min(c.count,Math.min(g.start+g.count,m.start+m.count));for(let E=_,P=y;E<P;E+=3){const b=E,C=E+1,N=E+2;r=jo(this,d,e,i,h,u,f,b,C,N),r&&(r.faceIndex=Math.floor(E/3),r.face.materialIndex=g.materialIndex,n.push(r))}}else{const S=Math.max(0,m.start),x=Math.min(c.count,m.start+m.count);for(let g=S,d=x;g<d;g+=3){const _=g,y=g+1,E=g+2;r=jo(this,a,e,i,h,u,f,_,y,E),r&&(r.faceIndex=Math.floor(g/3),n.push(r))}}}}function XS(t,e,n,i,r,s,a,o){let c;if(e.side===hn?c=i.intersectTriangle(a,s,r,!0,o):c=i.intersectTriangle(r,s,a,e.side===sr,o),c===null)return null;Oo.copy(o),Oo.applyMatrix4(t.matrixWorld);const h=n.ray.origin.distanceTo(Oo);return h<n.near||h>n.far?null:{distance:h,point:Oo.clone(),object:t}}function jo(t,e,n,i,r,s,a,o,c,h){t.getVertexPosition(o,Io),t.getVertexPosition(c,Uo),t.getVertexPosition(h,Fo);const u=XS(t,e,n,i,Io,Uo,Fo,sm);if(u){const f=new B;qn.getBarycoord(sm,Io,Uo,Fo,f),r&&(u.uv=qn.getInterpolatedAttribute(r,o,c,h,f,new Fe)),s&&(u.uv1=qn.getInterpolatedAttribute(s,o,c,h,f,new Fe)),a&&(u.normal=qn.getInterpolatedAttribute(a,o,c,h,f,new B),u.normal.dot(i.direction)>0&&u.normal.multiplyScalar(-1));const p={a:o,b:c,c:h,normal:new B,materialIndex:0};qn.getNormal(Io,Uo,Fo,p.normal),u.face=p,u.barycoord=f}return u}class Xs extends bn{constructor(e=1,n=1,i=1,r=1,s=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:n,depth:i,widthSegments:r,heightSegments:s,depthSegments:a};const o=this;r=Math.floor(r),s=Math.floor(s),a=Math.floor(a);const c=[],h=[],u=[],f=[];let p=0,m=0;S("z","y","x",-1,-1,i,n,e,a,s,0),S("z","y","x",1,-1,i,n,-e,a,s,1),S("x","z","y",1,1,e,i,n,r,a,2),S("x","z","y",1,-1,e,i,-n,r,a,3),S("x","y","z",1,-1,e,n,i,r,s,4),S("x","y","z",-1,-1,e,n,-i,r,s,5),this.setIndex(c),this.setAttribute("position",new Lt(h,3)),this.setAttribute("normal",new Lt(u,3)),this.setAttribute("uv",new Lt(f,2));function S(x,g,d,_,y,E,P,b,C,N,z){const v=E/C,M=P/N,I=E/2,j=P/2,q=b/2,Z=C+1,H=N+1;let Y=0,L=0;const O=new B;for(let V=0;V<H;V++){const se=V*M-j;for(let fe=0;fe<Z;fe++){const Le=fe*v-I;O[x]=Le*_,O[g]=se*y,O[d]=q,h.push(O.x,O.y,O.z),O[x]=0,O[g]=0,O[d]=b>0?1:-1,u.push(O.x,O.y,O.z),f.push(fe/C),f.push(1-V/N),Y+=1}}for(let V=0;V<N;V++)for(let se=0;se<C;se++){const fe=p+se+Z*V,Le=p+se+Z*(V+1),$=p+(se+1)+Z*(V+1),re=p+(se+1)+Z*V;c.push(fe,Le,re),c.push(Le,$,re),L+=6}o.addGroup(m,L,z),m+=L,p+=Y}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Xs(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Bs(t){const e={};for(const n in t){e[n]={};for(const i in t[n]){const r=t[n][i];r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)?r.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[n][i]=null):e[n][i]=r.clone():Array.isArray(r)?e[n][i]=r.slice():e[n][i]=r}}return e}function Kt(t){const e={};for(let n=0;n<t.length;n++){const i=Bs(t[n]);for(const r in i)e[r]=i[r]}return e}function $S(t){const e=[];for(let n=0;n<t.length;n++)e.push(t[n].clone());return e}function Rv(t){const e=t.getRenderTarget();return e===null?t.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:Je.workingColorSpace}const qS={clone:Bs,merge:Kt};var YS=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,KS=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class ar extends Ws{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=YS,this.fragmentShader=KS,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Bs(e.uniforms),this.uniformsGroups=$S(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const n=super.toJSON(e);n.glslVersion=this.glslVersion,n.uniforms={};for(const r in this.uniforms){const a=this.uniforms[r].value;a&&a.isTexture?n.uniforms[r]={type:"t",value:a.toJSON(e).uuid}:a&&a.isColor?n.uniforms[r]={type:"c",value:a.getHex()}:a&&a.isVector2?n.uniforms[r]={type:"v2",value:a.toArray()}:a&&a.isVector3?n.uniforms[r]={type:"v3",value:a.toArray()}:a&&a.isVector4?n.uniforms[r]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?n.uniforms[r]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?n.uniforms[r]={type:"m4",value:a.toArray()}:n.uniforms[r]={value:a}}Object.keys(this.defines).length>0&&(n.defines=this.defines),n.vertexShader=this.vertexShader,n.fragmentShader=this.fragmentShader,n.lights=this.lights,n.clipping=this.clipping;const i={};for(const r in this.extensions)this.extensions[r]===!0&&(i[r]=!0);return Object.keys(i).length>0&&(n.extensions=i),n}}class Pv extends Ot{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new _t,this.projectionMatrix=new _t,this.projectionMatrixInverse=new _t,this.coordinateSystem=yi}copy(e,n){return super.copy(e,n),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,n){super.updateWorldMatrix(e,n),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const ki=new B,am=new Fe,om=new Fe;class yn extends Pv{constructor(e=50,n=1,i=.1,r=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=i,this.far=r,this.focus=10,this.aspect=n,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const n=.5*this.getFilmHeight()/e;this.fov=ih*2*Math.atan(n),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(fl*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return ih*2*Math.atan(Math.tan(fl*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,n,i){ki.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(ki.x,ki.y).multiplyScalar(-e/ki.z),ki.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),i.set(ki.x,ki.y).multiplyScalar(-e/ki.z)}getViewSize(e,n){return this.getViewBounds(e,am,om),n.subVectors(om,am)}setViewOffset(e,n,i,r,s,a){this.aspect=e/n,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let n=e*Math.tan(fl*.5*this.fov)/this.zoom,i=2*n,r=this.aspect*i,s=-.5*r;const a=this.view;if(this.view!==null&&this.view.enabled){const c=a.fullWidth,h=a.fullHeight;s+=a.offsetX*r/c,n-=a.offsetY*i/h,r*=a.width/c,i*=a.height/h}const o=this.filmOffset;o!==0&&(s+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+r,n,n-i,e,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.fov=this.fov,n.object.zoom=this.zoom,n.object.near=this.near,n.object.far=this.far,n.object.focus=this.focus,n.object.aspect=this.aspect,this.view!==null&&(n.object.view=Object.assign({},this.view)),n.object.filmGauge=this.filmGauge,n.object.filmOffset=this.filmOffset,n}}const es=-90,ts=1;class ZS extends Ot{constructor(e,n,i){super(),this.type="CubeCamera",this.renderTarget=i,this.coordinateSystem=null,this.activeMipmapLevel=0;const r=new yn(es,ts,e,n);r.layers=this.layers,this.add(r);const s=new yn(es,ts,e,n);s.layers=this.layers,this.add(s);const a=new yn(es,ts,e,n);a.layers=this.layers,this.add(a);const o=new yn(es,ts,e,n);o.layers=this.layers,this.add(o);const c=new yn(es,ts,e,n);c.layers=this.layers,this.add(c);const h=new yn(es,ts,e,n);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){const e=this.coordinateSystem,n=this.children.concat(),[i,r,s,a,o,c]=n;for(const h of n)this.remove(h);if(e===yi)i.up.set(0,1,0),i.lookAt(1,0,0),r.up.set(0,1,0),r.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(e===Gl)i.up.set(0,-1,0),i.lookAt(-1,0,0),r.up.set(0,-1,0),r.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const h of n)this.add(h),h.updateMatrixWorld()}update(e,n){this.parent===null&&this.updateMatrixWorld();const{renderTarget:i,activeMipmapLevel:r}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[s,a,o,c,h,u]=this.children,f=e.getRenderTarget(),p=e.getActiveCubeFace(),m=e.getActiveMipmapLevel(),S=e.xr.enabled;e.xr.enabled=!1;const x=i.texture.generateMipmaps;i.texture.generateMipmaps=!1,e.setRenderTarget(i,0,r),e.render(n,s),e.setRenderTarget(i,1,r),e.render(n,a),e.setRenderTarget(i,2,r),e.render(n,o),e.setRenderTarget(i,3,r),e.render(n,c),e.setRenderTarget(i,4,r),e.render(n,h),i.texture.generateMipmaps=x,e.setRenderTarget(i,5,r),e.render(n,u),e.setRenderTarget(f,p,m),e.xr.enabled=S,i.texture.needsPMREMUpdate=!0}}class Nv extends fn{constructor(e,n,i,r,s,a,o,c,h,u){e=e!==void 0?e:[],n=n!==void 0?n:ks,super(e,n,i,r,s,a,o,c,h,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class QS extends Fr{constructor(e=1,n={}){super(e,e,n),this.isWebGLCubeRenderTarget=!0;const i={width:e,height:e,depth:1},r=[i,i,i,i,i,i];this.texture=new Nv(r,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=n.generateMipmaps!==void 0?n.generateMipmaps:!1,this.texture.minFilter=n.minFilter!==void 0?n.minFilter:$n}fromEquirectangularTexture(e,n){this.texture.type=n.type,this.texture.colorSpace=n.colorSpace,this.texture.generateMipmaps=n.generateMipmaps,this.texture.minFilter=n.minFilter,this.texture.magFilter=n.magFilter;const i={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},r=new Xs(5,5,5),s=new ar({name:"CubemapFromEquirect",uniforms:Bs(i.uniforms),vertexShader:i.vertexShader,fragmentShader:i.fragmentShader,side:hn,blending:tr});s.uniforms.tEquirect.value=n;const a=new Mn(r,s),o=n.minFilter;return n.minFilter===br&&(n.minFilter=$n),new ZS(1,10,this).update(e,a),n.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(e,n,i,r){const s=e.getRenderTarget();for(let a=0;a<6;a++)e.setRenderTarget(this,a),e.clear(n,i,r);e.setRenderTarget(s)}}const mu=new B,JS=new B,eM=new Be;class zi{constructor(e=new B(1,0,0),n=0){this.isPlane=!0,this.normal=e,this.constant=n}set(e,n){return this.normal.copy(e),this.constant=n,this}setComponents(e,n,i,r){return this.normal.set(e,n,i),this.constant=r,this}setFromNormalAndCoplanarPoint(e,n){return this.normal.copy(e),this.constant=-n.dot(this.normal),this}setFromCoplanarPoints(e,n,i){const r=mu.subVectors(i,n).cross(JS.subVectors(e,n)).normalize();return this.setFromNormalAndCoplanarPoint(r,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,n){return n.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,n){const i=e.delta(mu),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(e.start)===0?n.copy(e.start):null;const s=-(e.start.dot(this.normal)+this.constant)/r;return s<0||s>1?null:n.copy(e.start).addScaledVector(i,s)}intersectsLine(e){const n=this.distanceToPoint(e.start),i=this.distanceToPoint(e.end);return n<0&&i>0||i<0&&n>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,n){const i=n||eM.getNormalMatrix(e),r=this.coplanarPoint(mu).applyMatrix4(e),s=this.normal.applyMatrix3(i).normalize();return this.constant=-r.dot(s),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const mr=new fc,zo=new B;class hf{constructor(e=new zi,n=new zi,i=new zi,r=new zi,s=new zi,a=new zi){this.planes=[e,n,i,r,s,a]}set(e,n,i,r,s,a){const o=this.planes;return o[0].copy(e),o[1].copy(n),o[2].copy(i),o[3].copy(r),o[4].copy(s),o[5].copy(a),this}copy(e){const n=this.planes;for(let i=0;i<6;i++)n[i].copy(e.planes[i]);return this}setFromProjectionMatrix(e,n=yi){const i=this.planes,r=e.elements,s=r[0],a=r[1],o=r[2],c=r[3],h=r[4],u=r[5],f=r[6],p=r[7],m=r[8],S=r[9],x=r[10],g=r[11],d=r[12],_=r[13],y=r[14],E=r[15];if(i[0].setComponents(c-s,p-h,g-m,E-d).normalize(),i[1].setComponents(c+s,p+h,g+m,E+d).normalize(),i[2].setComponents(c+a,p+u,g+S,E+_).normalize(),i[3].setComponents(c-a,p-u,g-S,E-_).normalize(),i[4].setComponents(c-o,p-f,g-x,E-y).normalize(),n===yi)i[5].setComponents(c+o,p+f,g+x,E+y).normalize();else if(n===Gl)i[5].setComponents(o,f,x,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+n);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),mr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const n=e.geometry;n.boundingSphere===null&&n.computeBoundingSphere(),mr.copy(n.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(mr)}intersectsSprite(e){return mr.center.set(0,0,0),mr.radius=.7071067811865476,mr.applyMatrix4(e.matrixWorld),this.intersectsSphere(mr)}intersectsSphere(e){const n=this.planes,i=e.center,r=-e.radius;for(let s=0;s<6;s++)if(n[s].distanceToPoint(i)<r)return!1;return!0}intersectsBox(e){const n=this.planes;for(let i=0;i<6;i++){const r=n[i];if(zo.x=r.normal.x>0?e.max.x:e.min.x,zo.y=r.normal.y>0?e.max.y:e.min.y,zo.z=r.normal.z>0?e.max.z:e.min.z,r.distanceToPoint(zo)<0)return!1}return!0}containsPoint(e){const n=this.planes;for(let i=0;i<6;i++)if(n[i].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}function Lv(){let t=null,e=!1,n=null,i=null;function r(s,a){n(s,a),i=t.requestAnimationFrame(r)}return{start:function(){e!==!0&&n!==null&&(i=t.requestAnimationFrame(r),e=!0)},stop:function(){t.cancelAnimationFrame(i),e=!1},setAnimationLoop:function(s){n=s},setContext:function(s){t=s}}}function tM(t){const e=new WeakMap;function n(o,c){const h=o.array,u=o.usage,f=h.byteLength,p=t.createBuffer();t.bindBuffer(c,p),t.bufferData(c,h,u),o.onUploadCallback();let m;if(h instanceof Float32Array)m=t.FLOAT;else if(h instanceof Uint16Array)o.isFloat16BufferAttribute?m=t.HALF_FLOAT:m=t.UNSIGNED_SHORT;else if(h instanceof Int16Array)m=t.SHORT;else if(h instanceof Uint32Array)m=t.UNSIGNED_INT;else if(h instanceof Int32Array)m=t.INT;else if(h instanceof Int8Array)m=t.BYTE;else if(h instanceof Uint8Array)m=t.UNSIGNED_BYTE;else if(h instanceof Uint8ClampedArray)m=t.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+h);return{buffer:p,type:m,bytesPerElement:h.BYTES_PER_ELEMENT,version:o.version,size:f}}function i(o,c,h){const u=c.array,f=c.updateRanges;if(t.bindBuffer(h,o),f.length===0)t.bufferSubData(h,0,u);else{f.sort((m,S)=>m.start-S.start);let p=0;for(let m=1;m<f.length;m++){const S=f[p],x=f[m];x.start<=S.start+S.count+1?S.count=Math.max(S.count,x.start+x.count-S.start):(++p,f[p]=x)}f.length=p+1;for(let m=0,S=f.length;m<S;m++){const x=f[m];t.bufferSubData(h,x.start*u.BYTES_PER_ELEMENT,u,x.start,x.count)}c.clearUpdateRanges()}c.onUploadCallback()}function r(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function s(o){o.isInterleavedBufferAttribute&&(o=o.data);const c=e.get(o);c&&(t.deleteBuffer(c.buffer),e.delete(o))}function a(o,c){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=e.get(o);(!u||u.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const h=e.get(o);if(h===void 0)e.set(o,n(o,c));else if(h.version<o.version){if(h.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");i(h.buffer,o,c),h.version=o.version}}return{get:r,remove:s,update:a}}class pc extends bn{constructor(e=1,n=1,i=1,r=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:n,widthSegments:i,heightSegments:r};const s=e/2,a=n/2,o=Math.floor(i),c=Math.floor(r),h=o+1,u=c+1,f=e/o,p=n/c,m=[],S=[],x=[],g=[];for(let d=0;d<u;d++){const _=d*p-a;for(let y=0;y<h;y++){const E=y*f-s;S.push(E,-_,0),x.push(0,0,1),g.push(y/o),g.push(1-d/c)}}for(let d=0;d<c;d++)for(let _=0;_<o;_++){const y=_+h*d,E=_+h*(d+1),P=_+1+h*(d+1),b=_+1+h*d;m.push(y,E,b),m.push(E,P,b)}this.setIndex(m),this.setAttribute("position",new Lt(S,3)),this.setAttribute("normal",new Lt(x,3)),this.setAttribute("uv",new Lt(g,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new pc(e.width,e.height,e.widthSegments,e.heightSegments)}}var nM=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,iM=`#ifdef USE_ALPHAHASH
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
#endif`,rM=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,sM=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,aM=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,oM=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,lM=`#ifdef USE_AOMAP
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
#endif`,cM=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,uM=`#ifdef USE_BATCHING
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
#endif`,dM=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,hM=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,fM=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,pM=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,mM=`#ifdef USE_IRIDESCENCE
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
#endif`,gM=`#ifdef USE_BUMPMAP
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
#endif`,_M=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,vM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,xM=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,yM=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,SM=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,MM=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,EM=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,wM=`#if defined( USE_COLOR_ALPHA )
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
#endif`,TM=`#define PI 3.141592653589793
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
} // validated`,CM=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,bM=`vec3 transformedNormal = objectNormal;
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
#endif`,AM=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,RM=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,PM=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,NM=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,LM="gl_FragColor = linearToOutputTexel( gl_FragColor );",DM=`
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
}`,IM=`#ifdef USE_ENVMAP
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
#endif`,UM=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,FM=`#ifdef USE_ENVMAP
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
#endif`,kM=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,OM=`#ifdef USE_ENVMAP
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
#endif`,jM=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,zM=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,BM=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,HM=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,VM=`#ifdef USE_GRADIENTMAP
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
}`,GM=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,WM=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,XM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,$M=`uniform bool receiveShadow;
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
#endif`,qM=`#ifdef USE_ENVMAP
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
#endif`,YM=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,KM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ZM=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,QM=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,JM=`PhysicalMaterial material;
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
#endif`,eE=`struct PhysicalMaterial {
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
}`,tE=`
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
#endif`,nE=`#if defined( RE_IndirectDiffuse )
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
#endif`,iE=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,rE=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,sE=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,aE=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,oE=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,lE=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,cE=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,uE=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,dE=`#if defined( USE_POINTS_UV )
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
#endif`,hE=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,fE=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,pE=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,mE=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,gE=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,_E=`#ifdef USE_MORPHTARGETS
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
#endif`,vE=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,xE=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,yE=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,SE=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ME=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,EE=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,wE=`#ifdef USE_NORMALMAP
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
#endif`,TE=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,CE=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,bE=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,AE=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,RE=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,PE=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,NE=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,LE=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,DE=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,IE=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,UE=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,FE=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,kE=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,OE=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,jE=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,zE=`float getShadowMask() {
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
}`,BE=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,HE=`#ifdef USE_SKINNING
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
#endif`,VE=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,GE=`#ifdef USE_SKINNING
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
#endif`,WE=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,XE=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,$E=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,qE=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,YE=`#ifdef USE_TRANSMISSION
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
#endif`,KE=`#ifdef USE_TRANSMISSION
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
#endif`,ZE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,QE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,JE=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ew=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const tw=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,nw=`uniform sampler2D t2D;
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
}`,iw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,rw=`#ifdef ENVMAP_TYPE_CUBE
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
}`,sw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,aw=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ow=`#include <common>
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
}`,lw=`#if DEPTH_PACKING == 3200
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
}`,cw=`#define DISTANCE
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
}`,uw=`#define DISTANCE
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
}`,dw=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,hw=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fw=`uniform float scale;
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
}`,pw=`uniform vec3 diffuse;
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
}`,mw=`#include <common>
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
}`,gw=`uniform vec3 diffuse;
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
}`,_w=`#define LAMBERT
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
}`,vw=`#define LAMBERT
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
}`,xw=`#define MATCAP
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
}`,yw=`#define MATCAP
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
}`,Sw=`#define NORMAL
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
}`,Mw=`#define NORMAL
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
}`,Ew=`#define PHONG
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
}`,ww=`#define PHONG
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
}`,Tw=`#define STANDARD
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
}`,Cw=`#define STANDARD
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
}`,bw=`#define TOON
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
}`,Aw=`#define TOON
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
}`,Rw=`uniform float size;
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
}`,Pw=`uniform vec3 diffuse;
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
}`,Nw=`#include <common>
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
}`,Lw=`uniform vec3 color;
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
}`,Dw=`uniform float rotation;
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
}`,Iw=`uniform vec3 diffuse;
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
}`,ze={alphahash_fragment:nM,alphahash_pars_fragment:iM,alphamap_fragment:rM,alphamap_pars_fragment:sM,alphatest_fragment:aM,alphatest_pars_fragment:oM,aomap_fragment:lM,aomap_pars_fragment:cM,batching_pars_vertex:uM,batching_vertex:dM,begin_vertex:hM,beginnormal_vertex:fM,bsdfs:pM,iridescence_fragment:mM,bumpmap_pars_fragment:gM,clipping_planes_fragment:_M,clipping_planes_pars_fragment:vM,clipping_planes_pars_vertex:xM,clipping_planes_vertex:yM,color_fragment:SM,color_pars_fragment:MM,color_pars_vertex:EM,color_vertex:wM,common:TM,cube_uv_reflection_fragment:CM,defaultnormal_vertex:bM,displacementmap_pars_vertex:AM,displacementmap_vertex:RM,emissivemap_fragment:PM,emissivemap_pars_fragment:NM,colorspace_fragment:LM,colorspace_pars_fragment:DM,envmap_fragment:IM,envmap_common_pars_fragment:UM,envmap_pars_fragment:FM,envmap_pars_vertex:kM,envmap_physical_pars_fragment:qM,envmap_vertex:OM,fog_vertex:jM,fog_pars_vertex:zM,fog_fragment:BM,fog_pars_fragment:HM,gradientmap_pars_fragment:VM,lightmap_pars_fragment:GM,lights_lambert_fragment:WM,lights_lambert_pars_fragment:XM,lights_pars_begin:$M,lights_toon_fragment:YM,lights_toon_pars_fragment:KM,lights_phong_fragment:ZM,lights_phong_pars_fragment:QM,lights_physical_fragment:JM,lights_physical_pars_fragment:eE,lights_fragment_begin:tE,lights_fragment_maps:nE,lights_fragment_end:iE,logdepthbuf_fragment:rE,logdepthbuf_pars_fragment:sE,logdepthbuf_pars_vertex:aE,logdepthbuf_vertex:oE,map_fragment:lE,map_pars_fragment:cE,map_particle_fragment:uE,map_particle_pars_fragment:dE,metalnessmap_fragment:hE,metalnessmap_pars_fragment:fE,morphinstance_vertex:pE,morphcolor_vertex:mE,morphnormal_vertex:gE,morphtarget_pars_vertex:_E,morphtarget_vertex:vE,normal_fragment_begin:xE,normal_fragment_maps:yE,normal_pars_fragment:SE,normal_pars_vertex:ME,normal_vertex:EE,normalmap_pars_fragment:wE,clearcoat_normal_fragment_begin:TE,clearcoat_normal_fragment_maps:CE,clearcoat_pars_fragment:bE,iridescence_pars_fragment:AE,opaque_fragment:RE,packing:PE,premultiplied_alpha_fragment:NE,project_vertex:LE,dithering_fragment:DE,dithering_pars_fragment:IE,roughnessmap_fragment:UE,roughnessmap_pars_fragment:FE,shadowmap_pars_fragment:kE,shadowmap_pars_vertex:OE,shadowmap_vertex:jE,shadowmask_pars_fragment:zE,skinbase_vertex:BE,skinning_pars_vertex:HE,skinning_vertex:VE,skinnormal_vertex:GE,specularmap_fragment:WE,specularmap_pars_fragment:XE,tonemapping_fragment:$E,tonemapping_pars_fragment:qE,transmission_fragment:YE,transmission_pars_fragment:KE,uv_pars_fragment:ZE,uv_pars_vertex:QE,uv_vertex:JE,worldpos_vertex:ew,background_vert:tw,background_frag:nw,backgroundCube_vert:iw,backgroundCube_frag:rw,cube_vert:sw,cube_frag:aw,depth_vert:ow,depth_frag:lw,distanceRGBA_vert:cw,distanceRGBA_frag:uw,equirect_vert:dw,equirect_frag:hw,linedashed_vert:fw,linedashed_frag:pw,meshbasic_vert:mw,meshbasic_frag:gw,meshlambert_vert:_w,meshlambert_frag:vw,meshmatcap_vert:xw,meshmatcap_frag:yw,meshnormal_vert:Sw,meshnormal_frag:Mw,meshphong_vert:Ew,meshphong_frag:ww,meshphysical_vert:Tw,meshphysical_frag:Cw,meshtoon_vert:bw,meshtoon_frag:Aw,points_vert:Rw,points_frag:Pw,shadow_vert:Nw,shadow_frag:Lw,sprite_vert:Dw,sprite_frag:Iw},he={common:{diffuse:{value:new He(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Be}},envmap:{envMap:{value:null},envMapRotation:{value:new Be},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Be}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Be}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Be},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Be},normalScale:{value:new Fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Be},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Be}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Be}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Be}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new He(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new He(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0},uvTransform:{value:new Be}},sprite:{diffuse:{value:new He(16777215)},opacity:{value:1},center:{value:new Fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}}},ni={basic:{uniforms:Kt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.fog]),vertexShader:ze.meshbasic_vert,fragmentShader:ze.meshbasic_frag},lambert:{uniforms:Kt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new He(0)}}]),vertexShader:ze.meshlambert_vert,fragmentShader:ze.meshlambert_frag},phong:{uniforms:Kt([he.common,he.specularmap,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.fog,he.lights,{emissive:{value:new He(0)},specular:{value:new He(1118481)},shininess:{value:30}}]),vertexShader:ze.meshphong_vert,fragmentShader:ze.meshphong_frag},standard:{uniforms:Kt([he.common,he.envmap,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.roughnessmap,he.metalnessmap,he.fog,he.lights,{emissive:{value:new He(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag},toon:{uniforms:Kt([he.common,he.aomap,he.lightmap,he.emissivemap,he.bumpmap,he.normalmap,he.displacementmap,he.gradientmap,he.fog,he.lights,{emissive:{value:new He(0)}}]),vertexShader:ze.meshtoon_vert,fragmentShader:ze.meshtoon_frag},matcap:{uniforms:Kt([he.common,he.bumpmap,he.normalmap,he.displacementmap,he.fog,{matcap:{value:null}}]),vertexShader:ze.meshmatcap_vert,fragmentShader:ze.meshmatcap_frag},points:{uniforms:Kt([he.points,he.fog]),vertexShader:ze.points_vert,fragmentShader:ze.points_frag},dashed:{uniforms:Kt([he.common,he.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ze.linedashed_vert,fragmentShader:ze.linedashed_frag},depth:{uniforms:Kt([he.common,he.displacementmap]),vertexShader:ze.depth_vert,fragmentShader:ze.depth_frag},normal:{uniforms:Kt([he.common,he.bumpmap,he.normalmap,he.displacementmap,{opacity:{value:1}}]),vertexShader:ze.meshnormal_vert,fragmentShader:ze.meshnormal_frag},sprite:{uniforms:Kt([he.sprite,he.fog]),vertexShader:ze.sprite_vert,fragmentShader:ze.sprite_frag},background:{uniforms:{uvTransform:{value:new Be},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ze.background_vert,fragmentShader:ze.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Be}},vertexShader:ze.backgroundCube_vert,fragmentShader:ze.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ze.cube_vert,fragmentShader:ze.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ze.equirect_vert,fragmentShader:ze.equirect_frag},distanceRGBA:{uniforms:Kt([he.common,he.displacementmap,{referencePosition:{value:new B},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ze.distanceRGBA_vert,fragmentShader:ze.distanceRGBA_frag},shadow:{uniforms:Kt([he.lights,he.fog,{color:{value:new He(0)},opacity:{value:1}}]),vertexShader:ze.shadow_vert,fragmentShader:ze.shadow_frag}};ni.physical={uniforms:Kt([ni.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Be},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Be},clearcoatNormalScale:{value:new Fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Be},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Be},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Be},sheen:{value:0},sheenColor:{value:new He(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Be},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Be},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Be},transmissionSamplerSize:{value:new Fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Be},attenuationDistance:{value:0},attenuationColor:{value:new He(0)},specularColor:{value:new He(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Be},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Be},anisotropyVector:{value:new Fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Be}}]),vertexShader:ze.meshphysical_vert,fragmentShader:ze.meshphysical_frag};const Bo={r:0,b:0,g:0},gr=new oi,Uw=new _t;function Fw(t,e,n,i,r,s,a){const o=new He(0);let c=s===!0?0:1,h,u,f=null,p=0,m=null;function S(_){let y=_.isScene===!0?_.background:null;return y&&y.isTexture&&(y=(_.backgroundBlurriness>0?n:e).get(y)),y}function x(_){let y=!1;const E=S(_);E===null?d(o,c):E&&E.isColor&&(d(E,1),y=!0);const P=t.xr.getEnvironmentBlendMode();P==="additive"?i.buffers.color.setClear(0,0,0,1,a):P==="alpha-blend"&&i.buffers.color.setClear(0,0,0,0,a),(t.autoClear||y)&&(i.buffers.depth.setTest(!0),i.buffers.depth.setMask(!0),i.buffers.color.setMask(!0),t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil))}function g(_,y){const E=S(y);E&&(E.isCubeTexture||E.mapping===dc)?(u===void 0&&(u=new Mn(new Xs(1,1,1),new ar({name:"BackgroundCubeMaterial",uniforms:Bs(ni.backgroundCube.uniforms),vertexShader:ni.backgroundCube.vertexShader,fragmentShader:ni.backgroundCube.fragmentShader,side:hn,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(P,b,C){this.matrixWorld.copyPosition(C.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),r.update(u)),gr.copy(y.backgroundRotation),gr.x*=-1,gr.y*=-1,gr.z*=-1,E.isCubeTexture&&E.isRenderTargetTexture===!1&&(gr.y*=-1,gr.z*=-1),u.material.uniforms.envMap.value=E,u.material.uniforms.flipEnvMap.value=E.isCubeTexture&&E.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,u.material.uniforms.backgroundRotation.value.setFromMatrix4(Uw.makeRotationFromEuler(gr)),u.material.toneMapped=Je.getTransfer(E.colorSpace)!==dt,(f!==E||p!==E.version||m!==t.toneMapping)&&(u.material.needsUpdate=!0,f=E,p=E.version,m=t.toneMapping),u.layers.enableAll(),_.unshift(u,u.geometry,u.material,0,0,null)):E&&E.isTexture&&(h===void 0&&(h=new Mn(new pc(2,2),new ar({name:"BackgroundMaterial",uniforms:Bs(ni.background.uniforms),vertexShader:ni.background.vertexShader,fragmentShader:ni.background.fragmentShader,side:sr,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),r.update(h)),h.material.uniforms.t2D.value=E,h.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,h.material.toneMapped=Je.getTransfer(E.colorSpace)!==dt,E.matrixAutoUpdate===!0&&E.updateMatrix(),h.material.uniforms.uvTransform.value.copy(E.matrix),(f!==E||p!==E.version||m!==t.toneMapping)&&(h.material.needsUpdate=!0,f=E,p=E.version,m=t.toneMapping),h.layers.enableAll(),_.unshift(h,h.geometry,h.material,0,0,null))}function d(_,y){_.getRGB(Bo,Rv(t)),i.buffers.color.setClear(Bo.r,Bo.g,Bo.b,y,a)}return{getClearColor:function(){return o},setClearColor:function(_,y=1){o.set(_),c=y,d(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(_){c=_,d(o,c)},render:x,addToRenderList:g}}function kw(t,e){const n=t.getParameter(t.MAX_VERTEX_ATTRIBS),i={},r=p(null);let s=r,a=!1;function o(v,M,I,j,q){let Z=!1;const H=f(j,I,M);s!==H&&(s=H,h(s.object)),Z=m(v,j,I,q),Z&&S(v,j,I,q),q!==null&&e.update(q,t.ELEMENT_ARRAY_BUFFER),(Z||a)&&(a=!1,E(v,M,I,j),q!==null&&t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,e.get(q).buffer))}function c(){return t.createVertexArray()}function h(v){return t.bindVertexArray(v)}function u(v){return t.deleteVertexArray(v)}function f(v,M,I){const j=I.wireframe===!0;let q=i[v.id];q===void 0&&(q={},i[v.id]=q);let Z=q[M.id];Z===void 0&&(Z={},q[M.id]=Z);let H=Z[j];return H===void 0&&(H=p(c()),Z[j]=H),H}function p(v){const M=[],I=[],j=[];for(let q=0;q<n;q++)M[q]=0,I[q]=0,j[q]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:M,enabledAttributes:I,attributeDivisors:j,object:v,attributes:{},index:null}}function m(v,M,I,j){const q=s.attributes,Z=M.attributes;let H=0;const Y=I.getAttributes();for(const L in Y)if(Y[L].location>=0){const V=q[L];let se=Z[L];if(se===void 0&&(L==="instanceMatrix"&&v.instanceMatrix&&(se=v.instanceMatrix),L==="instanceColor"&&v.instanceColor&&(se=v.instanceColor)),V===void 0||V.attribute!==se||se&&V.data!==se.data)return!0;H++}return s.attributesNum!==H||s.index!==j}function S(v,M,I,j){const q={},Z=M.attributes;let H=0;const Y=I.getAttributes();for(const L in Y)if(Y[L].location>=0){let V=Z[L];V===void 0&&(L==="instanceMatrix"&&v.instanceMatrix&&(V=v.instanceMatrix),L==="instanceColor"&&v.instanceColor&&(V=v.instanceColor));const se={};se.attribute=V,V&&V.data&&(se.data=V.data),q[L]=se,H++}s.attributes=q,s.attributesNum=H,s.index=j}function x(){const v=s.newAttributes;for(let M=0,I=v.length;M<I;M++)v[M]=0}function g(v){d(v,0)}function d(v,M){const I=s.newAttributes,j=s.enabledAttributes,q=s.attributeDivisors;I[v]=1,j[v]===0&&(t.enableVertexAttribArray(v),j[v]=1),q[v]!==M&&(t.vertexAttribDivisor(v,M),q[v]=M)}function _(){const v=s.newAttributes,M=s.enabledAttributes;for(let I=0,j=M.length;I<j;I++)M[I]!==v[I]&&(t.disableVertexAttribArray(I),M[I]=0)}function y(v,M,I,j,q,Z,H){H===!0?t.vertexAttribIPointer(v,M,I,q,Z):t.vertexAttribPointer(v,M,I,j,q,Z)}function E(v,M,I,j){x();const q=j.attributes,Z=I.getAttributes(),H=M.defaultAttributeValues;for(const Y in Z){const L=Z[Y];if(L.location>=0){let O=q[Y];if(O===void 0&&(Y==="instanceMatrix"&&v.instanceMatrix&&(O=v.instanceMatrix),Y==="instanceColor"&&v.instanceColor&&(O=v.instanceColor)),O!==void 0){const V=O.normalized,se=O.itemSize,fe=e.get(O);if(fe===void 0)continue;const Le=fe.buffer,$=fe.type,re=fe.bytesPerElement,ue=$===t.INT||$===t.UNSIGNED_INT||O.gpuType===rf;if(O.isInterleavedBufferAttribute){const R=O.data,te=R.stride,de=O.offset;if(R.isInstancedInterleavedBuffer){for(let Te=0;Te<L.locationSize;Te++)d(L.location+Te,R.meshPerAttribute);v.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=R.meshPerAttribute*R.count)}else for(let Te=0;Te<L.locationSize;Te++)g(L.location+Te);t.bindBuffer(t.ARRAY_BUFFER,Le);for(let Te=0;Te<L.locationSize;Te++)y(L.location+Te,se/L.locationSize,$,V,te*re,(de+se/L.locationSize*Te)*re,ue)}else{if(O.isInstancedBufferAttribute){for(let R=0;R<L.locationSize;R++)d(L.location+R,O.meshPerAttribute);v.isInstancedMesh!==!0&&j._maxInstanceCount===void 0&&(j._maxInstanceCount=O.meshPerAttribute*O.count)}else for(let R=0;R<L.locationSize;R++)g(L.location+R);t.bindBuffer(t.ARRAY_BUFFER,Le);for(let R=0;R<L.locationSize;R++)y(L.location+R,se/L.locationSize,$,V,se*re,se/L.locationSize*R*re,ue)}}else if(H!==void 0){const V=H[Y];if(V!==void 0)switch(V.length){case 2:t.vertexAttrib2fv(L.location,V);break;case 3:t.vertexAttrib3fv(L.location,V);break;case 4:t.vertexAttrib4fv(L.location,V);break;default:t.vertexAttrib1fv(L.location,V)}}}}_()}function P(){N();for(const v in i){const M=i[v];for(const I in M){const j=M[I];for(const q in j)u(j[q].object),delete j[q];delete M[I]}delete i[v]}}function b(v){if(i[v.id]===void 0)return;const M=i[v.id];for(const I in M){const j=M[I];for(const q in j)u(j[q].object),delete j[q];delete M[I]}delete i[v.id]}function C(v){for(const M in i){const I=i[M];if(I[v.id]===void 0)continue;const j=I[v.id];for(const q in j)u(j[q].object),delete j[q];delete I[v.id]}}function N(){z(),a=!0,s!==r&&(s=r,h(s.object))}function z(){r.geometry=null,r.program=null,r.wireframe=!1}return{setup:o,reset:N,resetDefaultState:z,dispose:P,releaseStatesOfGeometry:b,releaseStatesOfProgram:C,initAttributes:x,enableAttribute:g,disableUnusedAttributes:_}}function Ow(t,e,n){let i;function r(h){i=h}function s(h,u){t.drawArrays(i,h,u),n.update(u,i,1)}function a(h,u,f){f!==0&&(t.drawArraysInstanced(i,h,u,f),n.update(u,i,f))}function o(h,u,f){if(f===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(i,h,0,u,0,f);let m=0;for(let S=0;S<f;S++)m+=u[S];n.update(m,i,1)}function c(h,u,f,p){if(f===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let S=0;S<h.length;S++)a(h[S],u[S],p[S]);else{m.multiDrawArraysInstancedWEBGL(i,h,0,u,0,p,0,f);let S=0;for(let x=0;x<f;x++)S+=u[x];for(let x=0;x<p.length;x++)n.update(S,i,p[x])}}this.setMode=r,this.render=s,this.renderInstances=a,this.renderMultiDraw=o,this.renderMultiDrawInstances=c}function jw(t,e,n,i){let r;function s(){if(r!==void 0)return r;if(e.has("EXT_texture_filter_anisotropic")===!0){const C=e.get("EXT_texture_filter_anisotropic");r=t.getParameter(C.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else r=0;return r}function a(C){return!(C!==Yn&&i.convert(C)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(C){const N=C===eo&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(C!==Ci&&i.convert(C)!==t.getParameter(t.IMPLEMENTATION_COLOR_READ_TYPE)&&C!==xi&&!N)}function c(C){if(C==="highp"){if(t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.HIGH_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.HIGH_FLOAT).precision>0)return"highp";C="mediump"}return C==="mediump"&&t.getShaderPrecisionFormat(t.VERTEX_SHADER,t.MEDIUM_FLOAT).precision>0&&t.getShaderPrecisionFormat(t.FRAGMENT_SHADER,t.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let h=n.precision!==void 0?n.precision:"highp";const u=c(h);u!==h&&(console.warn("THREE.WebGLRenderer:",h,"not supported, using",u,"instead."),h=u);const f=n.logarithmicDepthBuffer===!0,p=n.reverseDepthBuffer===!0&&e.has("EXT_clip_control");if(p===!0){const C=e.get("EXT_clip_control");C.clipControlEXT(C.LOWER_LEFT_EXT,C.ZERO_TO_ONE_EXT)}const m=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS),S=t.getParameter(t.MAX_VERTEX_TEXTURE_IMAGE_UNITS),x=t.getParameter(t.MAX_TEXTURE_SIZE),g=t.getParameter(t.MAX_CUBE_MAP_TEXTURE_SIZE),d=t.getParameter(t.MAX_VERTEX_ATTRIBS),_=t.getParameter(t.MAX_VERTEX_UNIFORM_VECTORS),y=t.getParameter(t.MAX_VARYING_VECTORS),E=t.getParameter(t.MAX_FRAGMENT_UNIFORM_VECTORS),P=S>0,b=t.getParameter(t.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:c,textureFormatReadable:a,textureTypeReadable:o,precision:h,logarithmicDepthBuffer:f,reverseDepthBuffer:p,maxTextures:m,maxVertexTextures:S,maxTextureSize:x,maxCubemapSize:g,maxAttributes:d,maxVertexUniforms:_,maxVaryings:y,maxFragmentUniforms:E,vertexTextures:P,maxSamples:b}}function zw(t){const e=this;let n=null,i=0,r=!1,s=!1;const a=new zi,o=new Be,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,p){const m=f.length!==0||p||i!==0||r;return r=p,i=f.length,m},this.beginShadows=function(){s=!0,u(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(f,p){n=u(f,p,0)},this.setState=function(f,p,m){const S=f.clippingPlanes,x=f.clipIntersection,g=f.clipShadows,d=t.get(f);if(!r||S===null||S.length===0||s&&!g)s?u(null):h();else{const _=s?0:i,y=_*4;let E=d.clippingState||null;c.value=E,E=u(S,p,y,m);for(let P=0;P!==y;++P)E[P]=n[P];d.clippingState=E,this.numIntersection=x?this.numPlanes:0,this.numPlanes+=_}};function h(){c.value!==n&&(c.value=n,c.needsUpdate=i>0),e.numPlanes=i,e.numIntersection=0}function u(f,p,m,S){const x=f!==null?f.length:0;let g=null;if(x!==0){if(g=c.value,S!==!0||g===null){const d=m+x*4,_=p.matrixWorldInverse;o.getNormalMatrix(_),(g===null||g.length<d)&&(g=new Float32Array(d));for(let y=0,E=m;y!==x;++y,E+=4)a.copy(f[y]).applyMatrix4(_,o),a.normal.toArray(g,E),g[E+3]=a.constant}c.value=g,c.needsUpdate=!0}return e.numPlanes=x,e.numIntersection=0,g}}function Bw(t){let e=new WeakMap;function n(a,o){return o===bd?a.mapping=ks:o===Ad&&(a.mapping=Os),a}function i(a){if(a&&a.isTexture){const o=a.mapping;if(o===bd||o===Ad)if(e.has(a)){const c=e.get(a).texture;return n(c,a.mapping)}else{const c=a.image;if(c&&c.height>0){const h=new QS(c.height);return h.fromEquirectangularTexture(t,a),e.set(a,h),a.addEventListener("dispose",r),n(h.texture,a.mapping)}else return null}}return a}function r(a){const o=a.target;o.removeEventListener("dispose",r);const c=e.get(o);c!==void 0&&(e.delete(o),c.dispose())}function s(){e=new WeakMap}return{get:i,dispose:s}}class Dv extends Pv{constructor(e=-1,n=1,i=1,r=-1,s=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=n,this.top=i,this.bottom=r,this.near=s,this.far=a,this.updateProjectionMatrix()}copy(e,n){return super.copy(e,n),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,n,i,r,s,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=n,this.view.offsetX=i,this.view.offsetY=r,this.view.width=s,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),n=(this.top-this.bottom)/(2*this.zoom),i=(this.right+this.left)/2,r=(this.top+this.bottom)/2;let s=i-e,a=i+e,o=r+n,c=r-n;if(this.view!==null&&this.view.enabled){const h=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=h*this.view.offsetX,a=s+h*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(s,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const n=super.toJSON(e);return n.object.zoom=this.zoom,n.object.left=this.left,n.object.right=this.right,n.object.top=this.top,n.object.bottom=this.bottom,n.object.near=this.near,n.object.far=this.far,this.view!==null&&(n.object.view=Object.assign({},this.view)),n}}const _s=4,lm=[.125,.215,.35,.446,.526,.582],Mr=20,gu=new Dv,cm=new He;let _u=null,vu=0,xu=0,yu=!1;const yr=(1+Math.sqrt(5))/2,ns=1/yr,um=[new B(-yr,ns,0),new B(yr,ns,0),new B(-ns,0,yr),new B(ns,0,yr),new B(0,yr,-ns),new B(0,yr,ns),new B(-1,1,-1),new B(1,1,-1),new B(-1,1,1),new B(1,1,1)];class dm{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,n=0,i=.1,r=100){_u=this._renderer.getRenderTarget(),vu=this._renderer.getActiveCubeFace(),xu=this._renderer.getActiveMipmapLevel(),yu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(256);const s=this._allocateTargets();return s.depthBuffer=!0,this._sceneToCubeUV(e,i,r,s),n>0&&this._blur(s,0,0,n),this._applyPMREM(s),this._cleanup(s),s}fromEquirectangular(e,n=null){return this._fromTexture(e,n)}fromCubemap(e,n=null){return this._fromTexture(e,n)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=pm(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=fm(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(_u,vu,xu),this._renderer.xr.enabled=yu,e.scissorTest=!1,Ho(e,0,0,e.width,e.height)}_fromTexture(e,n){e.mapping===ks||e.mapping===Os?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),_u=this._renderer.getRenderTarget(),vu=this._renderer.getActiveCubeFace(),xu=this._renderer.getActiveMipmapLevel(),yu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const i=n||this._allocateTargets();return this._textureToCubeUV(e,i),this._applyPMREM(i),this._cleanup(i),i}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),n=4*this._cubeSize,i={magFilter:$n,minFilter:$n,generateMipmaps:!1,type:eo,format:Yn,colorSpace:ur,depthBuffer:!1},r=hm(e,n,i);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==n){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=hm(e,n,i);const{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Hw(s)),this._blurMaterial=Vw(s,e,n)}return r}_compileMaterial(e){const n=new Mn(this._lodPlanes[0],e);this._renderer.compile(n,gu)}_sceneToCubeUV(e,n,i,r){const o=new yn(90,1,n,i),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,p=u.toneMapping;u.getClearColor(cm),u.toneMapping=nr,u.autoClear=!1;const m=new Cv({name:"PMREM.Background",side:hn,depthWrite:!1,depthTest:!1}),S=new Mn(new Xs,m);let x=!1;const g=e.background;g?g.isColor&&(m.color.copy(g),e.background=null,x=!0):(m.color.copy(cm),x=!0);for(let d=0;d<6;d++){const _=d%3;_===0?(o.up.set(0,c[d],0),o.lookAt(h[d],0,0)):_===1?(o.up.set(0,0,c[d]),o.lookAt(0,h[d],0)):(o.up.set(0,c[d],0),o.lookAt(0,0,h[d]));const y=this._cubeSize;Ho(r,_*y,d>2?y:0,y,y),u.setRenderTarget(r),x&&u.render(S,o),u.render(e,o)}S.geometry.dispose(),S.material.dispose(),u.toneMapping=p,u.autoClear=f,e.background=g}_textureToCubeUV(e,n){const i=this._renderer,r=e.mapping===ks||e.mapping===Os;r?(this._cubemapMaterial===null&&(this._cubemapMaterial=pm()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=fm());const s=r?this._cubemapMaterial:this._equirectMaterial,a=new Mn(this._lodPlanes[0],s),o=s.uniforms;o.envMap.value=e;const c=this._cubeSize;Ho(n,0,0,3*c,2*c),i.setRenderTarget(n),i.render(a,gu)}_applyPMREM(e){const n=this._renderer,i=n.autoClear;n.autoClear=!1;const r=this._lodPlanes.length;for(let s=1;s<r;s++){const a=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),o=um[(r-s-1)%um.length];this._blur(e,s-1,s,a,o)}n.autoClear=i}_blur(e,n,i,r,s){const a=this._pingPongRenderTarget;this._halfBlur(e,a,n,i,r,"latitudinal",s),this._halfBlur(a,e,i,i,r,"longitudinal",s)}_halfBlur(e,n,i,r,s,a,o){const c=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");const u=3,f=new Mn(this._lodPlanes[r],h),p=h.uniforms,m=this._sizeLods[i]-1,S=isFinite(s)?Math.PI/(2*m):2*Math.PI/(2*Mr-1),x=s/S,g=isFinite(s)?1+Math.floor(u*x):Mr;g>Mr&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${g} samples when the maximum is set to ${Mr}`);const d=[];let _=0;for(let C=0;C<Mr;++C){const N=C/x,z=Math.exp(-N*N/2);d.push(z),C===0?_+=z:C<g&&(_+=2*z)}for(let C=0;C<d.length;C++)d[C]=d[C]/_;p.envMap.value=e.texture,p.samples.value=g,p.weights.value=d,p.latitudinal.value=a==="latitudinal",o&&(p.poleAxis.value=o);const{_lodMax:y}=this;p.dTheta.value=S,p.mipInt.value=y-i;const E=this._sizeLods[r],P=3*E*(r>y-_s?r-y+_s:0),b=4*(this._cubeSize-E);Ho(n,P,b,3*E,2*E),c.setRenderTarget(n),c.render(f,gu)}}function Hw(t){const e=[],n=[],i=[];let r=t;const s=t-_s+1+lm.length;for(let a=0;a<s;a++){const o=Math.pow(2,r);n.push(o);let c=1/o;a>t-_s?c=lm[a-t+_s-1]:a===0&&(c=0),i.push(c);const h=1/(o-2),u=-h,f=1+h,p=[u,u,f,u,f,f,u,u,f,f,u,f],m=6,S=6,x=3,g=2,d=1,_=new Float32Array(x*S*m),y=new Float32Array(g*S*m),E=new Float32Array(d*S*m);for(let b=0;b<m;b++){const C=b%3*2/3-1,N=b>2?0:-1,z=[C,N,0,C+2/3,N,0,C+2/3,N+1,0,C,N,0,C+2/3,N+1,0,C,N+1,0];_.set(z,x*S*b),y.set(p,g*S*b);const v=[b,b,b,b,b,b];E.set(v,d*S*b)}const P=new bn;P.setAttribute("position",new ai(_,x)),P.setAttribute("uv",new ai(y,g)),P.setAttribute("faceIndex",new ai(E,d)),e.push(P),r>_s&&r--}return{lodPlanes:e,sizeLods:n,sigmas:i}}function hm(t,e,n){const i=new Fr(t,e,n);return i.texture.mapping=dc,i.texture.name="PMREM.cubeUv",i.scissorTest=!0,i}function Ho(t,e,n,i,r){t.viewport.set(e,n,i,r),t.scissor.set(e,n,i,r)}function Vw(t,e,n){const i=new Float32Array(Mr),r=new B(0,1,0);return new ar({name:"SphericalGaussianBlur",defines:{n:Mr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/n,CUBEUV_MAX_MIP:`${t}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:i},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:r}},vertexShader:ff(),fragmentShader:`

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
		`,blending:tr,depthTest:!1,depthWrite:!1})}function fm(){return new ar({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ff(),fragmentShader:`

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
		`,blending:tr,depthTest:!1,depthWrite:!1})}function pm(){return new ar({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ff(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:tr,depthTest:!1,depthWrite:!1})}function ff(){return`

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
	`}function Gw(t){let e=new WeakMap,n=null;function i(o){if(o&&o.isTexture){const c=o.mapping,h=c===bd||c===Ad,u=c===ks||c===Os;if(h||u){let f=e.get(o);const p=f!==void 0?f.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==p)return n===null&&(n=new dm(t)),f=h?n.fromEquirectangular(o,f):n.fromCubemap(o,f),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),f.texture;if(f!==void 0)return f.texture;{const m=o.image;return h&&m&&m.height>0||u&&m&&r(m)?(n===null&&(n=new dm(t)),f=h?n.fromEquirectangular(o):n.fromCubemap(o),f.texture.pmremVersion=o.pmremVersion,e.set(o,f),o.addEventListener("dispose",s),f.texture):null}}}return o}function r(o){let c=0;const h=6;for(let u=0;u<h;u++)o[u]!==void 0&&c++;return c===h}function s(o){const c=o.target;c.removeEventListener("dispose",s);const h=e.get(c);h!==void 0&&(e.delete(c),h.dispose())}function a(){e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:a}}function Ww(t){const e={};function n(i){if(e[i]!==void 0)return e[i];let r;switch(i){case"WEBGL_depth_texture":r=t.getExtension("WEBGL_depth_texture")||t.getExtension("MOZ_WEBGL_depth_texture")||t.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":r=t.getExtension("EXT_texture_filter_anisotropic")||t.getExtension("MOZ_EXT_texture_filter_anisotropic")||t.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":r=t.getExtension("WEBGL_compressed_texture_s3tc")||t.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":r=t.getExtension("WEBGL_compressed_texture_pvrtc")||t.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:r=t.getExtension(i)}return e[i]=r,r}return{has:function(i){return n(i)!==null},init:function(){n("EXT_color_buffer_float"),n("WEBGL_clip_cull_distance"),n("OES_texture_float_linear"),n("EXT_color_buffer_half_float"),n("WEBGL_multisampled_render_to_texture"),n("WEBGL_render_shared_exponent")},get:function(i){const r=n(i);return r===null&&pl("THREE.WebGLRenderer: "+i+" extension not supported."),r}}}function Xw(t,e,n,i){const r={},s=new WeakMap;function a(f){const p=f.target;p.index!==null&&e.remove(p.index);for(const S in p.attributes)e.remove(p.attributes[S]);for(const S in p.morphAttributes){const x=p.morphAttributes[S];for(let g=0,d=x.length;g<d;g++)e.remove(x[g])}p.removeEventListener("dispose",a),delete r[p.id];const m=s.get(p);m&&(e.remove(m),s.delete(p)),i.releaseStatesOfGeometry(p),p.isInstancedBufferGeometry===!0&&delete p._maxInstanceCount,n.memory.geometries--}function o(f,p){return r[p.id]===!0||(p.addEventListener("dispose",a),r[p.id]=!0,n.memory.geometries++),p}function c(f){const p=f.attributes;for(const S in p)e.update(p[S],t.ARRAY_BUFFER);const m=f.morphAttributes;for(const S in m){const x=m[S];for(let g=0,d=x.length;g<d;g++)e.update(x[g],t.ARRAY_BUFFER)}}function h(f){const p=[],m=f.index,S=f.attributes.position;let x=0;if(m!==null){const _=m.array;x=m.version;for(let y=0,E=_.length;y<E;y+=3){const P=_[y+0],b=_[y+1],C=_[y+2];p.push(P,b,b,C,C,P)}}else if(S!==void 0){const _=S.array;x=S.version;for(let y=0,E=_.length/3-1;y<E;y+=3){const P=y+0,b=y+1,C=y+2;p.push(P,b,b,C,C,P)}}else return;const g=new(Sv(p)?Av:bv)(p,1);g.version=x;const d=s.get(f);d&&e.remove(d),s.set(f,g)}function u(f){const p=s.get(f);if(p){const m=f.index;m!==null&&p.version<m.version&&h(f)}else h(f);return s.get(f)}return{get:o,update:c,getWireframeAttribute:u}}function $w(t,e,n){let i;function r(p){i=p}let s,a;function o(p){s=p.type,a=p.bytesPerElement}function c(p,m){t.drawElements(i,m,s,p*a),n.update(m,i,1)}function h(p,m,S){S!==0&&(t.drawElementsInstanced(i,m,s,p*a,S),n.update(m,i,S))}function u(p,m,S){if(S===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(i,m,0,s,p,0,S);let g=0;for(let d=0;d<S;d++)g+=m[d];n.update(g,i,1)}function f(p,m,S,x){if(S===0)return;const g=e.get("WEBGL_multi_draw");if(g===null)for(let d=0;d<p.length;d++)h(p[d]/a,m[d],x[d]);else{g.multiDrawElementsInstancedWEBGL(i,m,0,s,p,0,x,0,S);let d=0;for(let _=0;_<S;_++)d+=m[_];for(let _=0;_<x.length;_++)n.update(d,i,x[_])}}this.setMode=r,this.setIndex=o,this.render=c,this.renderInstances=h,this.renderMultiDraw=u,this.renderMultiDrawInstances=f}function qw(t){const e={geometries:0,textures:0},n={frame:0,calls:0,triangles:0,points:0,lines:0};function i(s,a,o){switch(n.calls++,a){case t.TRIANGLES:n.triangles+=o*(s/3);break;case t.LINES:n.lines+=o*(s/2);break;case t.LINE_STRIP:n.lines+=o*(s-1);break;case t.LINE_LOOP:n.lines+=o*s;break;case t.POINTS:n.points+=o*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function r(){n.calls=0,n.triangles=0,n.points=0,n.lines=0}return{memory:e,render:n,programs:null,autoReset:!0,reset:r,update:i}}function Yw(t,e,n){const i=new WeakMap,r=new St;function s(a,o,c){const h=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=u!==void 0?u.length:0;let p=i.get(o);if(p===void 0||p.count!==f){let v=function(){N.dispose(),i.delete(o),o.removeEventListener("dispose",v)};var m=v;p!==void 0&&p.texture.dispose();const S=o.morphAttributes.position!==void 0,x=o.morphAttributes.normal!==void 0,g=o.morphAttributes.color!==void 0,d=o.morphAttributes.position||[],_=o.morphAttributes.normal||[],y=o.morphAttributes.color||[];let E=0;S===!0&&(E=1),x===!0&&(E=2),g===!0&&(E=3);let P=o.attributes.position.count*E,b=1;P>e.maxTextureSize&&(b=Math.ceil(P/e.maxTextureSize),P=e.maxTextureSize);const C=new Float32Array(P*b*4*f),N=new Ev(C,P,b,f);N.type=xi,N.needsUpdate=!0;const z=E*4;for(let M=0;M<f;M++){const I=d[M],j=_[M],q=y[M],Z=P*b*4*M;for(let H=0;H<I.count;H++){const Y=H*z;S===!0&&(r.fromBufferAttribute(I,H),C[Z+Y+0]=r.x,C[Z+Y+1]=r.y,C[Z+Y+2]=r.z,C[Z+Y+3]=0),x===!0&&(r.fromBufferAttribute(j,H),C[Z+Y+4]=r.x,C[Z+Y+5]=r.y,C[Z+Y+6]=r.z,C[Z+Y+7]=0),g===!0&&(r.fromBufferAttribute(q,H),C[Z+Y+8]=r.x,C[Z+Y+9]=r.y,C[Z+Y+10]=r.z,C[Z+Y+11]=q.itemSize===4?r.w:1)}}p={count:f,texture:N,size:new Fe(P,b)},i.set(o,p),o.addEventListener("dispose",v)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)c.getUniforms().setValue(t,"morphTexture",a.morphTexture,n);else{let S=0;for(let g=0;g<h.length;g++)S+=h[g];const x=o.morphTargetsRelative?1:1-S;c.getUniforms().setValue(t,"morphTargetBaseInfluence",x),c.getUniforms().setValue(t,"morphTargetInfluences",h)}c.getUniforms().setValue(t,"morphTargetsTexture",p.texture,n),c.getUniforms().setValue(t,"morphTargetsTextureSize",p.size)}return{update:s}}function Kw(t,e,n,i){let r=new WeakMap;function s(c){const h=i.render.frame,u=c.geometry,f=e.get(c,u);if(r.get(f)!==h&&(e.update(f),r.set(f,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),r.get(c)!==h&&(n.update(c.instanceMatrix,t.ARRAY_BUFFER),c.instanceColor!==null&&n.update(c.instanceColor,t.ARRAY_BUFFER),r.set(c,h))),c.isSkinnedMesh){const p=c.skeleton;r.get(p)!==h&&(p.update(),r.set(p,h))}return f}function a(){r=new WeakMap}function o(c){const h=c.target;h.removeEventListener("dispose",o),n.remove(h.instanceMatrix),h.instanceColor!==null&&n.remove(h.instanceColor)}return{update:s,dispose:a}}class Iv extends fn{constructor(e,n,i,r,s,a,o,c,h,u=bs){if(u!==bs&&u!==zs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");i===void 0&&u===bs&&(i=Ur),i===void 0&&u===zs&&(i=js),super(null,r,s,a,o,c,u,i,h),this.isDepthTexture=!0,this.image={width:e,height:n},this.magFilter=o!==void 0?o:In,this.minFilter=c!==void 0?c:In,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.compareFunction=e.compareFunction,this}toJSON(e){const n=super.toJSON(e);return this.compareFunction!==null&&(n.compareFunction=this.compareFunction),n}}const Uv=new fn,mm=new Iv(1,1),Fv=new Ev,kv=new FS,Ov=new Nv,gm=[],_m=[],vm=new Float32Array(16),xm=new Float32Array(9),ym=new Float32Array(4);function $s(t,e,n){const i=t[0];if(i<=0||i>0)return t;const r=e*n;let s=gm[r];if(s===void 0&&(s=new Float32Array(r),gm[r]=s),e!==0){i.toArray(s,0);for(let a=1,o=0;a!==e;++a)o+=n,t[a].toArray(s,o)}return s}function Dt(t,e){if(t.length!==e.length)return!1;for(let n=0,i=t.length;n<i;n++)if(t[n]!==e[n])return!1;return!0}function It(t,e){for(let n=0,i=e.length;n<i;n++)t[n]=e[n]}function mc(t,e){let n=_m[e];n===void 0&&(n=new Int32Array(e),_m[e]=n);for(let i=0;i!==e;++i)n[i]=t.allocateTextureUnit();return n}function Zw(t,e){const n=this.cache;n[0]!==e&&(t.uniform1f(this.addr,e),n[0]=e)}function Qw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2f(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Dt(n,e))return;t.uniform2fv(this.addr,e),It(n,e)}}function Jw(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3f(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else if(e.r!==void 0)(n[0]!==e.r||n[1]!==e.g||n[2]!==e.b)&&(t.uniform3f(this.addr,e.r,e.g,e.b),n[0]=e.r,n[1]=e.g,n[2]=e.b);else{if(Dt(n,e))return;t.uniform3fv(this.addr,e),It(n,e)}}function e1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4f(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Dt(n,e))return;t.uniform4fv(this.addr,e),It(n,e)}}function t1(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Dt(n,e))return;t.uniformMatrix2fv(this.addr,!1,e),It(n,e)}else{if(Dt(n,i))return;ym.set(i),t.uniformMatrix2fv(this.addr,!1,ym),It(n,i)}}function n1(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Dt(n,e))return;t.uniformMatrix3fv(this.addr,!1,e),It(n,e)}else{if(Dt(n,i))return;xm.set(i),t.uniformMatrix3fv(this.addr,!1,xm),It(n,i)}}function i1(t,e){const n=this.cache,i=e.elements;if(i===void 0){if(Dt(n,e))return;t.uniformMatrix4fv(this.addr,!1,e),It(n,e)}else{if(Dt(n,i))return;vm.set(i),t.uniformMatrix4fv(this.addr,!1,vm),It(n,i)}}function r1(t,e){const n=this.cache;n[0]!==e&&(t.uniform1i(this.addr,e),n[0]=e)}function s1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2i(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Dt(n,e))return;t.uniform2iv(this.addr,e),It(n,e)}}function a1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3i(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Dt(n,e))return;t.uniform3iv(this.addr,e),It(n,e)}}function o1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4i(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Dt(n,e))return;t.uniform4iv(this.addr,e),It(n,e)}}function l1(t,e){const n=this.cache;n[0]!==e&&(t.uniform1ui(this.addr,e),n[0]=e)}function c1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y)&&(t.uniform2ui(this.addr,e.x,e.y),n[0]=e.x,n[1]=e.y);else{if(Dt(n,e))return;t.uniform2uiv(this.addr,e),It(n,e)}}function u1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z)&&(t.uniform3ui(this.addr,e.x,e.y,e.z),n[0]=e.x,n[1]=e.y,n[2]=e.z);else{if(Dt(n,e))return;t.uniform3uiv(this.addr,e),It(n,e)}}function d1(t,e){const n=this.cache;if(e.x!==void 0)(n[0]!==e.x||n[1]!==e.y||n[2]!==e.z||n[3]!==e.w)&&(t.uniform4ui(this.addr,e.x,e.y,e.z,e.w),n[0]=e.x,n[1]=e.y,n[2]=e.z,n[3]=e.w);else{if(Dt(n,e))return;t.uniform4uiv(this.addr,e),It(n,e)}}function h1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r);let s;this.type===t.SAMPLER_2D_SHADOW?(mm.compareFunction=yv,s=mm):s=Uv,n.setTexture2D(e||s,r)}function f1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture3D(e||kv,r)}function p1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTextureCube(e||Ov,r)}function m1(t,e,n){const i=this.cache,r=n.allocateTextureUnit();i[0]!==r&&(t.uniform1i(this.addr,r),i[0]=r),n.setTexture2DArray(e||Fv,r)}function g1(t){switch(t){case 5126:return Zw;case 35664:return Qw;case 35665:return Jw;case 35666:return e1;case 35674:return t1;case 35675:return n1;case 35676:return i1;case 5124:case 35670:return r1;case 35667:case 35671:return s1;case 35668:case 35672:return a1;case 35669:case 35673:return o1;case 5125:return l1;case 36294:return c1;case 36295:return u1;case 36296:return d1;case 35678:case 36198:case 36298:case 36306:case 35682:return h1;case 35679:case 36299:case 36307:return f1;case 35680:case 36300:case 36308:case 36293:return p1;case 36289:case 36303:case 36311:case 36292:return m1}}function _1(t,e){t.uniform1fv(this.addr,e)}function v1(t,e){const n=$s(e,this.size,2);t.uniform2fv(this.addr,n)}function x1(t,e){const n=$s(e,this.size,3);t.uniform3fv(this.addr,n)}function y1(t,e){const n=$s(e,this.size,4);t.uniform4fv(this.addr,n)}function S1(t,e){const n=$s(e,this.size,4);t.uniformMatrix2fv(this.addr,!1,n)}function M1(t,e){const n=$s(e,this.size,9);t.uniformMatrix3fv(this.addr,!1,n)}function E1(t,e){const n=$s(e,this.size,16);t.uniformMatrix4fv(this.addr,!1,n)}function w1(t,e){t.uniform1iv(this.addr,e)}function T1(t,e){t.uniform2iv(this.addr,e)}function C1(t,e){t.uniform3iv(this.addr,e)}function b1(t,e){t.uniform4iv(this.addr,e)}function A1(t,e){t.uniform1uiv(this.addr,e)}function R1(t,e){t.uniform2uiv(this.addr,e)}function P1(t,e){t.uniform3uiv(this.addr,e)}function N1(t,e){t.uniform4uiv(this.addr,e)}function L1(t,e,n){const i=this.cache,r=e.length,s=mc(n,r);Dt(i,s)||(t.uniform1iv(this.addr,s),It(i,s));for(let a=0;a!==r;++a)n.setTexture2D(e[a]||Uv,s[a])}function D1(t,e,n){const i=this.cache,r=e.length,s=mc(n,r);Dt(i,s)||(t.uniform1iv(this.addr,s),It(i,s));for(let a=0;a!==r;++a)n.setTexture3D(e[a]||kv,s[a])}function I1(t,e,n){const i=this.cache,r=e.length,s=mc(n,r);Dt(i,s)||(t.uniform1iv(this.addr,s),It(i,s));for(let a=0;a!==r;++a)n.setTextureCube(e[a]||Ov,s[a])}function U1(t,e,n){const i=this.cache,r=e.length,s=mc(n,r);Dt(i,s)||(t.uniform1iv(this.addr,s),It(i,s));for(let a=0;a!==r;++a)n.setTexture2DArray(e[a]||Fv,s[a])}function F1(t){switch(t){case 5126:return _1;case 35664:return v1;case 35665:return x1;case 35666:return y1;case 35674:return S1;case 35675:return M1;case 35676:return E1;case 5124:case 35670:return w1;case 35667:case 35671:return T1;case 35668:case 35672:return C1;case 35669:case 35673:return b1;case 5125:return A1;case 36294:return R1;case 36295:return P1;case 36296:return N1;case 35678:case 36198:case 36298:case 36306:case 35682:return L1;case 35679:case 36299:case 36307:return D1;case 35680:case 36300:case 36308:case 36293:return I1;case 36289:case 36303:case 36311:case 36292:return U1}}class k1{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.setValue=g1(n.type)}}class O1{constructor(e,n,i){this.id=e,this.addr=i,this.cache=[],this.type=n.type,this.size=n.size,this.setValue=F1(n.type)}}class j1{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,n,i){const r=this.seq;for(let s=0,a=r.length;s!==a;++s){const o=r[s];o.setValue(e,n[o.id],i)}}}const Su=/(\w+)(\])?(\[|\.)?/g;function Sm(t,e){t.seq.push(e),t.map[e.id]=e}function z1(t,e,n){const i=t.name,r=i.length;for(Su.lastIndex=0;;){const s=Su.exec(i),a=Su.lastIndex;let o=s[1];const c=s[2]==="]",h=s[3];if(c&&(o=o|0),h===void 0||h==="["&&a+2===r){Sm(n,h===void 0?new k1(o,t,e):new O1(o,t,e));break}else{let f=n.map[o];f===void 0&&(f=new j1(o),Sm(n,f)),n=f}}}class ml{constructor(e,n){this.seq=[],this.map={};const i=e.getProgramParameter(n,e.ACTIVE_UNIFORMS);for(let r=0;r<i;++r){const s=e.getActiveUniform(n,r),a=e.getUniformLocation(n,s.name);z1(s,a,this)}}setValue(e,n,i,r){const s=this.map[n];s!==void 0&&s.setValue(e,i,r)}setOptional(e,n,i){const r=n[i];r!==void 0&&this.setValue(e,i,r)}static upload(e,n,i,r){for(let s=0,a=n.length;s!==a;++s){const o=n[s],c=i[o.id];c.needsUpdate!==!1&&o.setValue(e,c.value,r)}}static seqWithValue(e,n){const i=[];for(let r=0,s=e.length;r!==s;++r){const a=e[r];a.id in n&&i.push(a)}return i}}function Mm(t,e,n){const i=t.createShader(e);return t.shaderSource(i,n),t.compileShader(i),i}const B1=37297;let H1=0;function V1(t,e){const n=t.split(`
`),i=[],r=Math.max(e-6,0),s=Math.min(e+6,n.length);for(let a=r;a<s;a++){const o=a+1;i.push(`${o===e?">":" "} ${o}: ${n[a]}`)}return i.join(`
`)}function G1(t){const e=Je.getPrimaries(Je.workingColorSpace),n=Je.getPrimaries(t);let i;switch(e===n?i="":e===Vl&&n===Hl?i="LinearDisplayP3ToLinearSRGB":e===Hl&&n===Vl&&(i="LinearSRGBToLinearDisplayP3"),t){case ur:case hc:return[i,"LinearTransferOETF"];case ti:case uf:return[i,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",t),[i,"LinearTransferOETF"]}}function Em(t,e,n){const i=t.getShaderParameter(e,t.COMPILE_STATUS),r=t.getShaderInfoLog(e).trim();if(i&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const a=parseInt(s[1]);return n.toUpperCase()+`

`+r+`

`+V1(t.getShaderSource(e),a)}else return r}function W1(t,e){const n=G1(e);return`vec4 ${t}( vec4 value ) { return ${n[0]}( ${n[1]}( value ) ); }`}function X1(t,e){let n;switch(e){case oS:n="Linear";break;case lS:n="Reinhard";break;case cS:n="Cineon";break;case uS:n="ACESFilmic";break;case hS:n="AgX";break;case fS:n="Neutral";break;case dS:n="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),n="Linear"}return"vec3 "+t+"( vec3 color ) { return "+n+"ToneMapping( color ); }"}const Vo=new B;function $1(){Je.getLuminanceCoefficients(Vo);const t=Vo.x.toFixed(4),e=Vo.y.toFixed(4),n=Vo.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${t}, ${e}, ${n} );`,"	return dot( weights, rgb );","}"].join(`
`)}function q1(t){return[t.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",t.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ya).join(`
`)}function Y1(t){const e=[];for(const n in t){const i=t[n];i!==!1&&e.push("#define "+n+" "+i)}return e.join(`
`)}function K1(t,e){const n={},i=t.getProgramParameter(e,t.ACTIVE_ATTRIBUTES);for(let r=0;r<i;r++){const s=t.getActiveAttrib(e,r),a=s.name;let o=1;s.type===t.FLOAT_MAT2&&(o=2),s.type===t.FLOAT_MAT3&&(o=3),s.type===t.FLOAT_MAT4&&(o=4),n[a]={type:s.type,location:t.getAttribLocation(e,a),locationSize:o}}return n}function ya(t){return t!==""}function wm(t,e){const n=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return t.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,n).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Tm(t,e){return t.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Z1=/^[ \t]*#include +<([\w\d./]+)>/gm;function rh(t){return t.replace(Z1,J1)}const Q1=new Map;function J1(t,e){let n=ze[e];if(n===void 0){const i=Q1.get(e);if(i!==void 0)n=ze[i],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,i);else throw new Error("Can not resolve #include <"+e+">")}return rh(n)}const eT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Cm(t){return t.replace(eT,tT)}function tT(t,e,n,i){let r="";for(let s=parseInt(e);s<parseInt(n);s++)r+=i.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return r}function bm(t){let e=`precision ${t.precision} float;
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
#define LOW_PRECISION`),e}function nT(t){let e="SHADOWMAP_TYPE_BASIC";return t.shadowMapType===av?e="SHADOWMAP_TYPE_PCF":t.shadowMapType===zy?e="SHADOWMAP_TYPE_PCF_SOFT":t.shadowMapType===pi&&(e="SHADOWMAP_TYPE_VSM"),e}function iT(t){let e="ENVMAP_TYPE_CUBE";if(t.envMap)switch(t.envMapMode){case ks:case Os:e="ENVMAP_TYPE_CUBE";break;case dc:e="ENVMAP_TYPE_CUBE_UV";break}return e}function rT(t){let e="ENVMAP_MODE_REFLECTION";if(t.envMap)switch(t.envMapMode){case Os:e="ENVMAP_MODE_REFRACTION";break}return e}function sT(t){let e="ENVMAP_BLENDING_NONE";if(t.envMap)switch(t.combine){case ov:e="ENVMAP_BLENDING_MULTIPLY";break;case sS:e="ENVMAP_BLENDING_MIX";break;case aS:e="ENVMAP_BLENDING_ADD";break}return e}function aT(t){const e=t.envMapCubeUVHeight;if(e===null)return null;const n=Math.log2(e)-2,i=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,n),7*16)),texelHeight:i,maxMip:n}}function oT(t,e,n,i){const r=t.getContext(),s=n.defines;let a=n.vertexShader,o=n.fragmentShader;const c=nT(n),h=iT(n),u=rT(n),f=sT(n),p=aT(n),m=q1(n),S=Y1(s),x=r.createProgram();let g,d,_=n.glslVersion?"#version "+n.glslVersion+`
`:"";n.isRawShaderMaterial?(g=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,S].filter(ya).join(`
`),g.length>0&&(g+=`
`),d=["#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,S].filter(ya).join(`
`),d.length>0&&(d+=`
`)):(g=[bm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,S,n.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",n.batching?"#define USE_BATCHING":"",n.batchingColor?"#define USE_BATCHING_COLOR":"",n.instancing?"#define USE_INSTANCING":"",n.instancingColor?"#define USE_INSTANCING_COLOR":"",n.instancingMorph?"#define USE_INSTANCING_MORPH":"",n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.map?"#define USE_MAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+u:"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.displacementMap?"#define USE_DISPLACEMENTMAP":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.mapUv?"#define MAP_UV "+n.mapUv:"",n.alphaMapUv?"#define ALPHAMAP_UV "+n.alphaMapUv:"",n.lightMapUv?"#define LIGHTMAP_UV "+n.lightMapUv:"",n.aoMapUv?"#define AOMAP_UV "+n.aoMapUv:"",n.emissiveMapUv?"#define EMISSIVEMAP_UV "+n.emissiveMapUv:"",n.bumpMapUv?"#define BUMPMAP_UV "+n.bumpMapUv:"",n.normalMapUv?"#define NORMALMAP_UV "+n.normalMapUv:"",n.displacementMapUv?"#define DISPLACEMENTMAP_UV "+n.displacementMapUv:"",n.metalnessMapUv?"#define METALNESSMAP_UV "+n.metalnessMapUv:"",n.roughnessMapUv?"#define ROUGHNESSMAP_UV "+n.roughnessMapUv:"",n.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+n.anisotropyMapUv:"",n.clearcoatMapUv?"#define CLEARCOATMAP_UV "+n.clearcoatMapUv:"",n.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+n.clearcoatNormalMapUv:"",n.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+n.clearcoatRoughnessMapUv:"",n.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+n.iridescenceMapUv:"",n.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+n.iridescenceThicknessMapUv:"",n.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+n.sheenColorMapUv:"",n.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+n.sheenRoughnessMapUv:"",n.specularMapUv?"#define SPECULARMAP_UV "+n.specularMapUv:"",n.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+n.specularColorMapUv:"",n.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+n.specularIntensityMapUv:"",n.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+n.transmissionMapUv:"",n.thicknessMapUv?"#define THICKNESSMAP_UV "+n.thicknessMapUv:"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.flatShading?"#define FLAT_SHADED":"",n.skinning?"#define USE_SKINNING":"",n.morphTargets?"#define USE_MORPHTARGETS":"",n.morphNormals&&n.flatShading===!1?"#define USE_MORPHNORMALS":"",n.morphColors?"#define USE_MORPHCOLORS":"",n.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+n.morphTextureStride:"",n.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+n.morphTargetsCount:"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.sizeAttenuation?"#define USE_SIZEATTENUATION":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ya).join(`
`),d=[bm(n),"#define SHADER_TYPE "+n.shaderType,"#define SHADER_NAME "+n.shaderName,S,n.useFog&&n.fog?"#define USE_FOG":"",n.useFog&&n.fogExp2?"#define FOG_EXP2":"",n.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",n.map?"#define USE_MAP":"",n.matcap?"#define USE_MATCAP":"",n.envMap?"#define USE_ENVMAP":"",n.envMap?"#define "+h:"",n.envMap?"#define "+u:"",n.envMap?"#define "+f:"",p?"#define CUBEUV_TEXEL_WIDTH "+p.texelWidth:"",p?"#define CUBEUV_TEXEL_HEIGHT "+p.texelHeight:"",p?"#define CUBEUV_MAX_MIP "+p.maxMip+".0":"",n.lightMap?"#define USE_LIGHTMAP":"",n.aoMap?"#define USE_AOMAP":"",n.bumpMap?"#define USE_BUMPMAP":"",n.normalMap?"#define USE_NORMALMAP":"",n.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",n.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",n.emissiveMap?"#define USE_EMISSIVEMAP":"",n.anisotropy?"#define USE_ANISOTROPY":"",n.anisotropyMap?"#define USE_ANISOTROPYMAP":"",n.clearcoat?"#define USE_CLEARCOAT":"",n.clearcoatMap?"#define USE_CLEARCOATMAP":"",n.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",n.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",n.dispersion?"#define USE_DISPERSION":"",n.iridescence?"#define USE_IRIDESCENCE":"",n.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",n.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",n.specularMap?"#define USE_SPECULARMAP":"",n.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",n.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",n.roughnessMap?"#define USE_ROUGHNESSMAP":"",n.metalnessMap?"#define USE_METALNESSMAP":"",n.alphaMap?"#define USE_ALPHAMAP":"",n.alphaTest?"#define USE_ALPHATEST":"",n.alphaHash?"#define USE_ALPHAHASH":"",n.sheen?"#define USE_SHEEN":"",n.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",n.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",n.transmission?"#define USE_TRANSMISSION":"",n.transmissionMap?"#define USE_TRANSMISSIONMAP":"",n.thicknessMap?"#define USE_THICKNESSMAP":"",n.vertexTangents&&n.flatShading===!1?"#define USE_TANGENT":"",n.vertexColors||n.instancingColor||n.batchingColor?"#define USE_COLOR":"",n.vertexAlphas?"#define USE_COLOR_ALPHA":"",n.vertexUv1s?"#define USE_UV1":"",n.vertexUv2s?"#define USE_UV2":"",n.vertexUv3s?"#define USE_UV3":"",n.pointsUvs?"#define USE_POINTS_UV":"",n.gradientMap?"#define USE_GRADIENTMAP":"",n.flatShading?"#define FLAT_SHADED":"",n.doubleSided?"#define DOUBLE_SIDED":"",n.flipSided?"#define FLIP_SIDED":"",n.shadowMapEnabled?"#define USE_SHADOWMAP":"",n.shadowMapEnabled?"#define "+c:"",n.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",n.numLightProbes>0?"#define USE_LIGHT_PROBES":"",n.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",n.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",n.reverseDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",n.toneMapping!==nr?"#define TONE_MAPPING":"",n.toneMapping!==nr?ze.tonemapping_pars_fragment:"",n.toneMapping!==nr?X1("toneMapping",n.toneMapping):"",n.dithering?"#define DITHERING":"",n.opaque?"#define OPAQUE":"",ze.colorspace_pars_fragment,W1("linearToOutputTexel",n.outputColorSpace),$1(),n.useDepthPacking?"#define DEPTH_PACKING "+n.depthPacking:"",`
`].filter(ya).join(`
`)),a=rh(a),a=wm(a,n),a=Tm(a,n),o=rh(o),o=wm(o,n),o=Tm(o,n),a=Cm(a),o=Cm(o),n.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,g=[m,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+g,d=["#define varying in",n.glslVersion===Gp?"":"layout(location = 0) out highp vec4 pc_fragColor;",n.glslVersion===Gp?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+d);const y=_+g+a,E=_+d+o,P=Mm(r,r.VERTEX_SHADER,y),b=Mm(r,r.FRAGMENT_SHADER,E);r.attachShader(x,P),r.attachShader(x,b),n.index0AttributeName!==void 0?r.bindAttribLocation(x,0,n.index0AttributeName):n.morphTargets===!0&&r.bindAttribLocation(x,0,"position"),r.linkProgram(x);function C(M){if(t.debug.checkShaderErrors){const I=r.getProgramInfoLog(x).trim(),j=r.getShaderInfoLog(P).trim(),q=r.getShaderInfoLog(b).trim();let Z=!0,H=!0;if(r.getProgramParameter(x,r.LINK_STATUS)===!1)if(Z=!1,typeof t.debug.onShaderError=="function")t.debug.onShaderError(r,x,P,b);else{const Y=Em(r,P,"vertex"),L=Em(r,b,"fragment");console.error("THREE.WebGLProgram: Shader Error "+r.getError()+" - VALIDATE_STATUS "+r.getProgramParameter(x,r.VALIDATE_STATUS)+`

Material Name: `+M.name+`
Material Type: `+M.type+`

Program Info Log: `+I+`
`+Y+`
`+L)}else I!==""?console.warn("THREE.WebGLProgram: Program Info Log:",I):(j===""||q==="")&&(H=!1);H&&(M.diagnostics={runnable:Z,programLog:I,vertexShader:{log:j,prefix:g},fragmentShader:{log:q,prefix:d}})}r.deleteShader(P),r.deleteShader(b),N=new ml(r,x),z=K1(r,x)}let N;this.getUniforms=function(){return N===void 0&&C(this),N};let z;this.getAttributes=function(){return z===void 0&&C(this),z};let v=n.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return v===!1&&(v=r.getProgramParameter(x,B1)),v},this.destroy=function(){i.releaseStatesOfProgram(this),r.deleteProgram(x),this.program=void 0},this.type=n.shaderType,this.name=n.shaderName,this.id=H1++,this.cacheKey=e,this.usedTimes=1,this.program=x,this.vertexShader=P,this.fragmentShader=b,this}let lT=0;class cT{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const n=e.vertexShader,i=e.fragmentShader,r=this._getShaderStage(n),s=this._getShaderStage(i),a=this._getShaderCacheForMaterial(e);return a.has(r)===!1&&(a.add(r),r.usedTimes++),a.has(s)===!1&&(a.add(s),s.usedTimes++),this}remove(e){const n=this.materialCache.get(e);for(const i of n)i.usedTimes--,i.usedTimes===0&&this.shaderCache.delete(i.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const n=this.materialCache;let i=n.get(e);return i===void 0&&(i=new Set,n.set(e,i)),i}_getShaderStage(e){const n=this.shaderCache;let i=n.get(e);return i===void 0&&(i=new uT(e),n.set(e,i)),i}}class uT{constructor(e){this.id=lT++,this.code=e,this.usedTimes=0}}function dT(t,e,n,i,r,s,a){const o=new wv,c=new cT,h=new Set,u=[],f=r.logarithmicDepthBuffer,p=r.reverseDepthBuffer,m=r.vertexTextures;let S=r.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(v){return h.add(v),v===0?"uv":`uv${v}`}function d(v,M,I,j,q){const Z=j.fog,H=q.geometry,Y=v.isMeshStandardMaterial?j.environment:null,L=(v.isMeshStandardMaterial?n:e).get(v.envMap||Y),O=L&&L.mapping===dc?L.image.height:null,V=x[v.type];v.precision!==null&&(S=r.getMaxPrecision(v.precision),S!==v.precision&&console.warn("THREE.WebGLProgram.getParameters:",v.precision,"not supported, using",S,"instead."));const se=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,fe=se!==void 0?se.length:0;let Le=0;H.morphAttributes.position!==void 0&&(Le=1),H.morphAttributes.normal!==void 0&&(Le=2),H.morphAttributes.color!==void 0&&(Le=3);let $,re,ue,R;if(V){const nn=ni[V];$=nn.vertexShader,re=nn.fragmentShader}else $=v.vertexShader,re=v.fragmentShader,c.update(v),ue=c.getVertexShaderID(v),R=c.getFragmentShaderID(v);const te=t.getRenderTarget(),de=q.isInstancedMesh===!0,Te=q.isBatchedMesh===!0,be=!!v.map,Ne=!!v.matcap,D=!!L,At=!!v.aoMap,Ve=!!v.lightMap,We=!!v.bumpMap,pe=!!v.normalMap,st=!!v.displacementMap,De=!!v.emissiveMap,A=!!v.metalnessMap,w=!!v.roughnessMap,G=v.anisotropy>0,ee=v.clearcoat>0,ae=v.dispersion>0,J=v.iridescence>0,Ae=v.sheen>0,me=v.transmission>0,Se=G&&!!v.anisotropyMap,Ye=ee&&!!v.clearcoatMap,le=ee&&!!v.clearcoatNormalMap,Me=ee&&!!v.clearcoatRoughnessMap,ke=J&&!!v.iridescenceMap,Oe=J&&!!v.iridescenceThicknessMap,Ee=Ae&&!!v.sheenColorMap,Xe=Ae&&!!v.sheenRoughnessMap,je=!!v.specularMap,at=!!v.specularColorMap,U=!!v.specularIntensityMap,ve=me&&!!v.transmissionMap,K=me&&!!v.thicknessMap,ie=!!v.gradientMap,ge=!!v.alphaMap,xe=v.alphaTest>0,$e=!!v.alphaHash,Tt=!!v.extensions;let tn=nr;v.toneMapped&&(te===null||te.isXRRenderTarget===!0)&&(tn=t.toneMapping);const Ke={shaderID:V,shaderType:v.type,shaderName:v.name,vertexShader:$,fragmentShader:re,defines:v.defines,customVertexShaderID:ue,customFragmentShaderID:R,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:S,batching:Te,batchingColor:Te&&q._colorsTexture!==null,instancing:de,instancingColor:de&&q.instanceColor!==null,instancingMorph:de&&q.morphTexture!==null,supportsVertexTextures:m,outputColorSpace:te===null?t.outputColorSpace:te.isXRRenderTarget===!0?te.texture.colorSpace:ur,alphaToCoverage:!!v.alphaToCoverage,map:be,matcap:Ne,envMap:D,envMapMode:D&&L.mapping,envMapCubeUVHeight:O,aoMap:At,lightMap:Ve,bumpMap:We,normalMap:pe,displacementMap:m&&st,emissiveMap:De,normalMapObjectSpace:pe&&v.normalMapType===_S,normalMapTangentSpace:pe&&v.normalMapType===xv,metalnessMap:A,roughnessMap:w,anisotropy:G,anisotropyMap:Se,clearcoat:ee,clearcoatMap:Ye,clearcoatNormalMap:le,clearcoatRoughnessMap:Me,dispersion:ae,iridescence:J,iridescenceMap:ke,iridescenceThicknessMap:Oe,sheen:Ae,sheenColorMap:Ee,sheenRoughnessMap:Xe,specularMap:je,specularColorMap:at,specularIntensityMap:U,transmission:me,transmissionMap:ve,thicknessMap:K,gradientMap:ie,opaque:v.transparent===!1&&v.blending===Cs&&v.alphaToCoverage===!1,alphaMap:ge,alphaTest:xe,alphaHash:$e,combine:v.combine,mapUv:be&&g(v.map.channel),aoMapUv:At&&g(v.aoMap.channel),lightMapUv:Ve&&g(v.lightMap.channel),bumpMapUv:We&&g(v.bumpMap.channel),normalMapUv:pe&&g(v.normalMap.channel),displacementMapUv:st&&g(v.displacementMap.channel),emissiveMapUv:De&&g(v.emissiveMap.channel),metalnessMapUv:A&&g(v.metalnessMap.channel),roughnessMapUv:w&&g(v.roughnessMap.channel),anisotropyMapUv:Se&&g(v.anisotropyMap.channel),clearcoatMapUv:Ye&&g(v.clearcoatMap.channel),clearcoatNormalMapUv:le&&g(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Me&&g(v.clearcoatRoughnessMap.channel),iridescenceMapUv:ke&&g(v.iridescenceMap.channel),iridescenceThicknessMapUv:Oe&&g(v.iridescenceThicknessMap.channel),sheenColorMapUv:Ee&&g(v.sheenColorMap.channel),sheenRoughnessMapUv:Xe&&g(v.sheenRoughnessMap.channel),specularMapUv:je&&g(v.specularMap.channel),specularColorMapUv:at&&g(v.specularColorMap.channel),specularIntensityMapUv:U&&g(v.specularIntensityMap.channel),transmissionMapUv:ve&&g(v.transmissionMap.channel),thicknessMapUv:K&&g(v.thicknessMap.channel),alphaMapUv:ge&&g(v.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(pe||G),vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:q.isPoints===!0&&!!H.attributes.uv&&(be||ge),fog:!!Z,useFog:v.fog===!0,fogExp2:!!Z&&Z.isFogExp2,flatShading:v.flatShading===!0,sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:f,reverseDepthBuffer:p,skinning:q.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:fe,morphTextureStride:Le,numDirLights:M.directional.length,numPointLights:M.point.length,numSpotLights:M.spot.length,numSpotLightMaps:M.spotLightMap.length,numRectAreaLights:M.rectArea.length,numHemiLights:M.hemi.length,numDirLightShadows:M.directionalShadowMap.length,numPointLightShadows:M.pointShadowMap.length,numSpotLightShadows:M.spotShadowMap.length,numSpotLightShadowsWithMaps:M.numSpotLightShadowsWithMaps,numLightProbes:M.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:v.dithering,shadowMapEnabled:t.shadowMap.enabled&&I.length>0,shadowMapType:t.shadowMap.type,toneMapping:tn,decodeVideoTexture:be&&v.map.isVideoTexture===!0&&Je.getTransfer(v.map.colorSpace)===dt,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Ln,flipSided:v.side===hn,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:Tt&&v.extensions.clipCullDistance===!0&&i.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Tt&&v.extensions.multiDraw===!0||Te)&&i.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:i.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return Ke.vertexUv1s=h.has(1),Ke.vertexUv2s=h.has(2),Ke.vertexUv3s=h.has(3),h.clear(),Ke}function _(v){const M=[];if(v.shaderID?M.push(v.shaderID):(M.push(v.customVertexShaderID),M.push(v.customFragmentShaderID)),v.defines!==void 0)for(const I in v.defines)M.push(I),M.push(v.defines[I]);return v.isRawShaderMaterial===!1&&(y(M,v),E(M,v),M.push(t.outputColorSpace)),M.push(v.customProgramCacheKey),M.join()}function y(v,M){v.push(M.precision),v.push(M.outputColorSpace),v.push(M.envMapMode),v.push(M.envMapCubeUVHeight),v.push(M.mapUv),v.push(M.alphaMapUv),v.push(M.lightMapUv),v.push(M.aoMapUv),v.push(M.bumpMapUv),v.push(M.normalMapUv),v.push(M.displacementMapUv),v.push(M.emissiveMapUv),v.push(M.metalnessMapUv),v.push(M.roughnessMapUv),v.push(M.anisotropyMapUv),v.push(M.clearcoatMapUv),v.push(M.clearcoatNormalMapUv),v.push(M.clearcoatRoughnessMapUv),v.push(M.iridescenceMapUv),v.push(M.iridescenceThicknessMapUv),v.push(M.sheenColorMapUv),v.push(M.sheenRoughnessMapUv),v.push(M.specularMapUv),v.push(M.specularColorMapUv),v.push(M.specularIntensityMapUv),v.push(M.transmissionMapUv),v.push(M.thicknessMapUv),v.push(M.combine),v.push(M.fogExp2),v.push(M.sizeAttenuation),v.push(M.morphTargetsCount),v.push(M.morphAttributeCount),v.push(M.numDirLights),v.push(M.numPointLights),v.push(M.numSpotLights),v.push(M.numSpotLightMaps),v.push(M.numHemiLights),v.push(M.numRectAreaLights),v.push(M.numDirLightShadows),v.push(M.numPointLightShadows),v.push(M.numSpotLightShadows),v.push(M.numSpotLightShadowsWithMaps),v.push(M.numLightProbes),v.push(M.shadowMapType),v.push(M.toneMapping),v.push(M.numClippingPlanes),v.push(M.numClipIntersection),v.push(M.depthPacking)}function E(v,M){o.disableAll(),M.supportsVertexTextures&&o.enable(0),M.instancing&&o.enable(1),M.instancingColor&&o.enable(2),M.instancingMorph&&o.enable(3),M.matcap&&o.enable(4),M.envMap&&o.enable(5),M.normalMapObjectSpace&&o.enable(6),M.normalMapTangentSpace&&o.enable(7),M.clearcoat&&o.enable(8),M.iridescence&&o.enable(9),M.alphaTest&&o.enable(10),M.vertexColors&&o.enable(11),M.vertexAlphas&&o.enable(12),M.vertexUv1s&&o.enable(13),M.vertexUv2s&&o.enable(14),M.vertexUv3s&&o.enable(15),M.vertexTangents&&o.enable(16),M.anisotropy&&o.enable(17),M.alphaHash&&o.enable(18),M.batching&&o.enable(19),M.dispersion&&o.enable(20),M.batchingColor&&o.enable(21),v.push(o.mask),o.disableAll(),M.fog&&o.enable(0),M.useFog&&o.enable(1),M.flatShading&&o.enable(2),M.logarithmicDepthBuffer&&o.enable(3),M.reverseDepthBuffer&&o.enable(4),M.skinning&&o.enable(5),M.morphTargets&&o.enable(6),M.morphNormals&&o.enable(7),M.morphColors&&o.enable(8),M.premultipliedAlpha&&o.enable(9),M.shadowMapEnabled&&o.enable(10),M.doubleSided&&o.enable(11),M.flipSided&&o.enable(12),M.useDepthPacking&&o.enable(13),M.dithering&&o.enable(14),M.transmission&&o.enable(15),M.sheen&&o.enable(16),M.opaque&&o.enable(17),M.pointsUvs&&o.enable(18),M.decodeVideoTexture&&o.enable(19),M.alphaToCoverage&&o.enable(20),v.push(o.mask)}function P(v){const M=x[v.type];let I;if(M){const j=ni[M];I=qS.clone(j.uniforms)}else I=v.uniforms;return I}function b(v,M){let I;for(let j=0,q=u.length;j<q;j++){const Z=u[j];if(Z.cacheKey===M){I=Z,++I.usedTimes;break}}return I===void 0&&(I=new oT(t,M,v,s),u.push(I)),I}function C(v){if(--v.usedTimes===0){const M=u.indexOf(v);u[M]=u[u.length-1],u.pop(),v.destroy()}}function N(v){c.remove(v)}function z(){c.dispose()}return{getParameters:d,getProgramCacheKey:_,getUniforms:P,acquireProgram:b,releaseProgram:C,releaseShaderCache:N,programs:u,dispose:z}}function hT(){let t=new WeakMap;function e(a){return t.has(a)}function n(a){let o=t.get(a);return o===void 0&&(o={},t.set(a,o)),o}function i(a){t.delete(a)}function r(a,o,c){t.get(a)[o]=c}function s(){t=new WeakMap}return{has:e,get:n,remove:i,update:r,dispose:s}}function fT(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.material.id!==e.material.id?t.material.id-e.material.id:t.z!==e.z?t.z-e.z:t.id-e.id}function Am(t,e){return t.groupOrder!==e.groupOrder?t.groupOrder-e.groupOrder:t.renderOrder!==e.renderOrder?t.renderOrder-e.renderOrder:t.z!==e.z?e.z-t.z:t.id-e.id}function Rm(){const t=[];let e=0;const n=[],i=[],r=[];function s(){e=0,n.length=0,i.length=0,r.length=0}function a(f,p,m,S,x,g){let d=t[e];return d===void 0?(d={id:f.id,object:f,geometry:p,material:m,groupOrder:S,renderOrder:f.renderOrder,z:x,group:g},t[e]=d):(d.id=f.id,d.object=f,d.geometry=p,d.material=m,d.groupOrder=S,d.renderOrder=f.renderOrder,d.z=x,d.group=g),e++,d}function o(f,p,m,S,x,g){const d=a(f,p,m,S,x,g);m.transmission>0?i.push(d):m.transparent===!0?r.push(d):n.push(d)}function c(f,p,m,S,x,g){const d=a(f,p,m,S,x,g);m.transmission>0?i.unshift(d):m.transparent===!0?r.unshift(d):n.unshift(d)}function h(f,p){n.length>1&&n.sort(f||fT),i.length>1&&i.sort(p||Am),r.length>1&&r.sort(p||Am)}function u(){for(let f=e,p=t.length;f<p;f++){const m=t[f];if(m.id===null)break;m.id=null,m.object=null,m.geometry=null,m.material=null,m.group=null}}return{opaque:n,transmissive:i,transparent:r,init:s,push:o,unshift:c,finish:u,sort:h}}function pT(){let t=new WeakMap;function e(i,r){const s=t.get(i);let a;return s===void 0?(a=new Rm,t.set(i,[a])):r>=s.length?(a=new Rm,s.push(a)):a=s[r],a}function n(){t=new WeakMap}return{get:e,dispose:n}}function mT(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={direction:new B,color:new He};break;case"SpotLight":n={position:new B,direction:new B,color:new He,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":n={position:new B,color:new He,distance:0,decay:0};break;case"HemisphereLight":n={direction:new B,skyColor:new He,groundColor:new He};break;case"RectAreaLight":n={color:new He,position:new B,halfWidth:new B,halfHeight:new B};break}return t[e.id]=n,n}}}function gT(){const t={};return{get:function(e){if(t[e.id]!==void 0)return t[e.id];let n;switch(e.type){case"DirectionalLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"SpotLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe};break;case"PointLight":n={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Fe,shadowCameraNear:1,shadowCameraFar:1e3};break}return t[e.id]=n,n}}}let _T=0;function vT(t,e){return(e.castShadow?2:0)-(t.castShadow?2:0)+(e.map?1:0)-(t.map?1:0)}function xT(t){const e=new mT,n=gT(),i={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let h=0;h<9;h++)i.probe.push(new B);const r=new B,s=new _t,a=new _t;function o(h){let u=0,f=0,p=0;for(let z=0;z<9;z++)i.probe[z].set(0,0,0);let m=0,S=0,x=0,g=0,d=0,_=0,y=0,E=0,P=0,b=0,C=0;h.sort(vT);for(let z=0,v=h.length;z<v;z++){const M=h[z],I=M.color,j=M.intensity,q=M.distance,Z=M.shadow&&M.shadow.map?M.shadow.map.texture:null;if(M.isAmbientLight)u+=I.r*j,f+=I.g*j,p+=I.b*j;else if(M.isLightProbe){for(let H=0;H<9;H++)i.probe[H].addScaledVector(M.sh.coefficients[H],j);C++}else if(M.isDirectionalLight){const H=e.get(M);if(H.color.copy(M.color).multiplyScalar(M.intensity),M.castShadow){const Y=M.shadow,L=n.get(M);L.shadowIntensity=Y.intensity,L.shadowBias=Y.bias,L.shadowNormalBias=Y.normalBias,L.shadowRadius=Y.radius,L.shadowMapSize=Y.mapSize,i.directionalShadow[m]=L,i.directionalShadowMap[m]=Z,i.directionalShadowMatrix[m]=M.shadow.matrix,_++}i.directional[m]=H,m++}else if(M.isSpotLight){const H=e.get(M);H.position.setFromMatrixPosition(M.matrixWorld),H.color.copy(I).multiplyScalar(j),H.distance=q,H.coneCos=Math.cos(M.angle),H.penumbraCos=Math.cos(M.angle*(1-M.penumbra)),H.decay=M.decay,i.spot[x]=H;const Y=M.shadow;if(M.map&&(i.spotLightMap[P]=M.map,P++,Y.updateMatrices(M),M.castShadow&&b++),i.spotLightMatrix[x]=Y.matrix,M.castShadow){const L=n.get(M);L.shadowIntensity=Y.intensity,L.shadowBias=Y.bias,L.shadowNormalBias=Y.normalBias,L.shadowRadius=Y.radius,L.shadowMapSize=Y.mapSize,i.spotShadow[x]=L,i.spotShadowMap[x]=Z,E++}x++}else if(M.isRectAreaLight){const H=e.get(M);H.color.copy(I).multiplyScalar(j),H.halfWidth.set(M.width*.5,0,0),H.halfHeight.set(0,M.height*.5,0),i.rectArea[g]=H,g++}else if(M.isPointLight){const H=e.get(M);if(H.color.copy(M.color).multiplyScalar(M.intensity),H.distance=M.distance,H.decay=M.decay,M.castShadow){const Y=M.shadow,L=n.get(M);L.shadowIntensity=Y.intensity,L.shadowBias=Y.bias,L.shadowNormalBias=Y.normalBias,L.shadowRadius=Y.radius,L.shadowMapSize=Y.mapSize,L.shadowCameraNear=Y.camera.near,L.shadowCameraFar=Y.camera.far,i.pointShadow[S]=L,i.pointShadowMap[S]=Z,i.pointShadowMatrix[S]=M.shadow.matrix,y++}i.point[S]=H,S++}else if(M.isHemisphereLight){const H=e.get(M);H.skyColor.copy(M.color).multiplyScalar(j),H.groundColor.copy(M.groundColor).multiplyScalar(j),i.hemi[d]=H,d++}}g>0&&(t.has("OES_texture_float_linear")===!0?(i.rectAreaLTC1=he.LTC_FLOAT_1,i.rectAreaLTC2=he.LTC_FLOAT_2):(i.rectAreaLTC1=he.LTC_HALF_1,i.rectAreaLTC2=he.LTC_HALF_2)),i.ambient[0]=u,i.ambient[1]=f,i.ambient[2]=p;const N=i.hash;(N.directionalLength!==m||N.pointLength!==S||N.spotLength!==x||N.rectAreaLength!==g||N.hemiLength!==d||N.numDirectionalShadows!==_||N.numPointShadows!==y||N.numSpotShadows!==E||N.numSpotMaps!==P||N.numLightProbes!==C)&&(i.directional.length=m,i.spot.length=x,i.rectArea.length=g,i.point.length=S,i.hemi.length=d,i.directionalShadow.length=_,i.directionalShadowMap.length=_,i.pointShadow.length=y,i.pointShadowMap.length=y,i.spotShadow.length=E,i.spotShadowMap.length=E,i.directionalShadowMatrix.length=_,i.pointShadowMatrix.length=y,i.spotLightMatrix.length=E+P-b,i.spotLightMap.length=P,i.numSpotLightShadowsWithMaps=b,i.numLightProbes=C,N.directionalLength=m,N.pointLength=S,N.spotLength=x,N.rectAreaLength=g,N.hemiLength=d,N.numDirectionalShadows=_,N.numPointShadows=y,N.numSpotShadows=E,N.numSpotMaps=P,N.numLightProbes=C,i.version=_T++)}function c(h,u){let f=0,p=0,m=0,S=0,x=0;const g=u.matrixWorldInverse;for(let d=0,_=h.length;d<_;d++){const y=h[d];if(y.isDirectionalLight){const E=i.directional[f];E.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(g),f++}else if(y.isSpotLight){const E=i.spot[m];E.position.setFromMatrixPosition(y.matrixWorld),E.position.applyMatrix4(g),E.direction.setFromMatrixPosition(y.matrixWorld),r.setFromMatrixPosition(y.target.matrixWorld),E.direction.sub(r),E.direction.transformDirection(g),m++}else if(y.isRectAreaLight){const E=i.rectArea[S];E.position.setFromMatrixPosition(y.matrixWorld),E.position.applyMatrix4(g),a.identity(),s.copy(y.matrixWorld),s.premultiply(g),a.extractRotation(s),E.halfWidth.set(y.width*.5,0,0),E.halfHeight.set(0,y.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),S++}else if(y.isPointLight){const E=i.point[p];E.position.setFromMatrixPosition(y.matrixWorld),E.position.applyMatrix4(g),p++}else if(y.isHemisphereLight){const E=i.hemi[x];E.direction.setFromMatrixPosition(y.matrixWorld),E.direction.transformDirection(g),x++}}}return{setup:o,setupView:c,state:i}}function Pm(t){const e=new xT(t),n=[],i=[];function r(u){h.camera=u,n.length=0,i.length=0}function s(u){n.push(u)}function a(u){i.push(u)}function o(){e.setup(n)}function c(u){e.setupView(n,u)}const h={lightsArray:n,shadowsArray:i,camera:null,lights:e,transmissionRenderTarget:{}};return{init:r,state:h,setupLights:o,setupLightsView:c,pushLight:s,pushShadow:a}}function yT(t){let e=new WeakMap;function n(r,s=0){const a=e.get(r);let o;return a===void 0?(o=new Pm(t),e.set(r,[o])):s>=a.length?(o=new Pm(t),a.push(o)):o=a[s],o}function i(){e=new WeakMap}return{get:n,dispose:i}}class ST extends Ws{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=mS,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class MT extends Ws{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}const ET=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,wT=`uniform sampler2D shadow_pass;
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
}`;function TT(t,e,n){let i=new hf;const r=new Fe,s=new Fe,a=new St,o=new ST({depthPacking:gS}),c=new MT,h={},u=n.maxTextureSize,f={[sr]:hn,[hn]:sr,[Ln]:Ln},p=new ar({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Fe},radius:{value:4}},vertexShader:ET,fragmentShader:wT}),m=p.clone();m.defines.HORIZONTAL_PASS=1;const S=new bn;S.setAttribute("position",new ai(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const x=new Mn(S,p),g=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=av;let d=this.type;this.render=function(b,C,N){if(g.enabled===!1||g.autoUpdate===!1&&g.needsUpdate===!1||b.length===0)return;const z=t.getRenderTarget(),v=t.getActiveCubeFace(),M=t.getActiveMipmapLevel(),I=t.state;I.setBlending(tr),I.buffers.color.setClear(1,1,1,1),I.buffers.depth.setTest(!0),I.setScissorTest(!1);const j=d!==pi&&this.type===pi,q=d===pi&&this.type!==pi;for(let Z=0,H=b.length;Z<H;Z++){const Y=b[Z],L=Y.shadow;if(L===void 0){console.warn("THREE.WebGLShadowMap:",Y,"has no shadow.");continue}if(L.autoUpdate===!1&&L.needsUpdate===!1)continue;r.copy(L.mapSize);const O=L.getFrameExtents();if(r.multiply(O),s.copy(L.mapSize),(r.x>u||r.y>u)&&(r.x>u&&(s.x=Math.floor(u/O.x),r.x=s.x*O.x,L.mapSize.x=s.x),r.y>u&&(s.y=Math.floor(u/O.y),r.y=s.y*O.y,L.mapSize.y=s.y)),L.map===null||j===!0||q===!0){const se=this.type!==pi?{minFilter:In,magFilter:In}:{};L.map!==null&&L.map.dispose(),L.map=new Fr(r.x,r.y,se),L.map.texture.name=Y.name+".shadowMap",L.camera.updateProjectionMatrix()}t.setRenderTarget(L.map),t.clear();const V=L.getViewportCount();for(let se=0;se<V;se++){const fe=L.getViewport(se);a.set(s.x*fe.x,s.y*fe.y,s.x*fe.z,s.y*fe.w),I.viewport(a),L.updateMatrices(Y,se),i=L.getFrustum(),E(C,N,L.camera,Y,this.type)}L.isPointLightShadow!==!0&&this.type===pi&&_(L,N),L.needsUpdate=!1}d=this.type,g.needsUpdate=!1,t.setRenderTarget(z,v,M)};function _(b,C){const N=e.update(x);p.defines.VSM_SAMPLES!==b.blurSamples&&(p.defines.VSM_SAMPLES=b.blurSamples,m.defines.VSM_SAMPLES=b.blurSamples,p.needsUpdate=!0,m.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new Fr(r.x,r.y)),p.uniforms.shadow_pass.value=b.map.texture,p.uniforms.resolution.value=b.mapSize,p.uniforms.radius.value=b.radius,t.setRenderTarget(b.mapPass),t.clear(),t.renderBufferDirect(C,null,N,p,x,null),m.uniforms.shadow_pass.value=b.mapPass.texture,m.uniforms.resolution.value=b.mapSize,m.uniforms.radius.value=b.radius,t.setRenderTarget(b.map),t.clear(),t.renderBufferDirect(C,null,N,m,x,null)}function y(b,C,N,z){let v=null;const M=N.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(M!==void 0)v=M;else if(v=N.isPointLight===!0?c:o,t.localClippingEnabled&&C.clipShadows===!0&&Array.isArray(C.clippingPlanes)&&C.clippingPlanes.length!==0||C.displacementMap&&C.displacementScale!==0||C.alphaMap&&C.alphaTest>0||C.map&&C.alphaTest>0){const I=v.uuid,j=C.uuid;let q=h[I];q===void 0&&(q={},h[I]=q);let Z=q[j];Z===void 0&&(Z=v.clone(),q[j]=Z,C.addEventListener("dispose",P)),v=Z}if(v.visible=C.visible,v.wireframe=C.wireframe,z===pi?v.side=C.shadowSide!==null?C.shadowSide:C.side:v.side=C.shadowSide!==null?C.shadowSide:f[C.side],v.alphaMap=C.alphaMap,v.alphaTest=C.alphaTest,v.map=C.map,v.clipShadows=C.clipShadows,v.clippingPlanes=C.clippingPlanes,v.clipIntersection=C.clipIntersection,v.displacementMap=C.displacementMap,v.displacementScale=C.displacementScale,v.displacementBias=C.displacementBias,v.wireframeLinewidth=C.wireframeLinewidth,v.linewidth=C.linewidth,N.isPointLight===!0&&v.isMeshDistanceMaterial===!0){const I=t.properties.get(v);I.light=N}return v}function E(b,C,N,z,v){if(b.visible===!1)return;if(b.layers.test(C.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&v===pi)&&(!b.frustumCulled||i.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(N.matrixWorldInverse,b.matrixWorld);const j=e.update(b),q=b.material;if(Array.isArray(q)){const Z=j.groups;for(let H=0,Y=Z.length;H<Y;H++){const L=Z[H],O=q[L.materialIndex];if(O&&O.visible){const V=y(b,O,z,v);b.onBeforeShadow(t,b,C,N,j,V,L),t.renderBufferDirect(N,null,j,V,b,L),b.onAfterShadow(t,b,C,N,j,V,L)}}}else if(q.visible){const Z=y(b,q,z,v);b.onBeforeShadow(t,b,C,N,j,Z,null),t.renderBufferDirect(N,null,j,Z,b,null),b.onAfterShadow(t,b,C,N,j,Z,null)}}const I=b.children;for(let j=0,q=I.length;j<q;j++)E(I[j],C,N,z,v)}function P(b){b.target.removeEventListener("dispose",P);for(const N in h){const z=h[N],v=b.target.uuid;v in z&&(z[v].dispose(),delete z[v])}}}const CT={[yd]:Sd,[Md]:Td,[Ed]:Cd,[Fs]:wd,[Sd]:yd,[Td]:Md,[Cd]:Ed,[wd]:Fs};function bT(t){function e(){let U=!1;const ve=new St;let K=null;const ie=new St(0,0,0,0);return{setMask:function(ge){K!==ge&&!U&&(t.colorMask(ge,ge,ge,ge),K=ge)},setLocked:function(ge){U=ge},setClear:function(ge,xe,$e,Tt,tn){tn===!0&&(ge*=Tt,xe*=Tt,$e*=Tt),ve.set(ge,xe,$e,Tt),ie.equals(ve)===!1&&(t.clearColor(ge,xe,$e,Tt),ie.copy(ve))},reset:function(){U=!1,K=null,ie.set(-1,0,0,0)}}}function n(){let U=!1,ve=!1,K=null,ie=null,ge=null;return{setReversed:function(xe){ve=xe},setTest:function(xe){xe?ue(t.DEPTH_TEST):R(t.DEPTH_TEST)},setMask:function(xe){K!==xe&&!U&&(t.depthMask(xe),K=xe)},setFunc:function(xe){if(ve&&(xe=CT[xe]),ie!==xe){switch(xe){case yd:t.depthFunc(t.NEVER);break;case Sd:t.depthFunc(t.ALWAYS);break;case Md:t.depthFunc(t.LESS);break;case Fs:t.depthFunc(t.LEQUAL);break;case Ed:t.depthFunc(t.EQUAL);break;case wd:t.depthFunc(t.GEQUAL);break;case Td:t.depthFunc(t.GREATER);break;case Cd:t.depthFunc(t.NOTEQUAL);break;default:t.depthFunc(t.LEQUAL)}ie=xe}},setLocked:function(xe){U=xe},setClear:function(xe){ge!==xe&&(t.clearDepth(xe),ge=xe)},reset:function(){U=!1,K=null,ie=null,ge=null}}}function i(){let U=!1,ve=null,K=null,ie=null,ge=null,xe=null,$e=null,Tt=null,tn=null;return{setTest:function(Ke){U||(Ke?ue(t.STENCIL_TEST):R(t.STENCIL_TEST))},setMask:function(Ke){ve!==Ke&&!U&&(t.stencilMask(Ke),ve=Ke)},setFunc:function(Ke,nn,li){(K!==Ke||ie!==nn||ge!==li)&&(t.stencilFunc(Ke,nn,li),K=Ke,ie=nn,ge=li)},setOp:function(Ke,nn,li){(xe!==Ke||$e!==nn||Tt!==li)&&(t.stencilOp(Ke,nn,li),xe=Ke,$e=nn,Tt=li)},setLocked:function(Ke){U=Ke},setClear:function(Ke){tn!==Ke&&(t.clearStencil(Ke),tn=Ke)},reset:function(){U=!1,ve=null,K=null,ie=null,ge=null,xe=null,$e=null,Tt=null,tn=null}}}const r=new e,s=new n,a=new i,o=new WeakMap,c=new WeakMap;let h={},u={},f=new WeakMap,p=[],m=null,S=!1,x=null,g=null,d=null,_=null,y=null,E=null,P=null,b=new He(0,0,0),C=0,N=!1,z=null,v=null,M=null,I=null,j=null;const q=t.getParameter(t.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Z=!1,H=0;const Y=t.getParameter(t.VERSION);Y.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(Y)[1]),Z=H>=1):Y.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(Y)[1]),Z=H>=2);let L=null,O={};const V=t.getParameter(t.SCISSOR_BOX),se=t.getParameter(t.VIEWPORT),fe=new St().fromArray(V),Le=new St().fromArray(se);function $(U,ve,K,ie){const ge=new Uint8Array(4),xe=t.createTexture();t.bindTexture(U,xe),t.texParameteri(U,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(U,t.TEXTURE_MAG_FILTER,t.NEAREST);for(let $e=0;$e<K;$e++)U===t.TEXTURE_3D||U===t.TEXTURE_2D_ARRAY?t.texImage3D(ve,0,t.RGBA,1,1,ie,0,t.RGBA,t.UNSIGNED_BYTE,ge):t.texImage2D(ve+$e,0,t.RGBA,1,1,0,t.RGBA,t.UNSIGNED_BYTE,ge);return xe}const re={};re[t.TEXTURE_2D]=$(t.TEXTURE_2D,t.TEXTURE_2D,1),re[t.TEXTURE_CUBE_MAP]=$(t.TEXTURE_CUBE_MAP,t.TEXTURE_CUBE_MAP_POSITIVE_X,6),re[t.TEXTURE_2D_ARRAY]=$(t.TEXTURE_2D_ARRAY,t.TEXTURE_2D_ARRAY,1,1),re[t.TEXTURE_3D]=$(t.TEXTURE_3D,t.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),a.setClear(0),ue(t.DEPTH_TEST),s.setFunc(Fs),Ve(!1),We(Op),ue(t.CULL_FACE),D(tr);function ue(U){h[U]!==!0&&(t.enable(U),h[U]=!0)}function R(U){h[U]!==!1&&(t.disable(U),h[U]=!1)}function te(U,ve){return u[U]!==ve?(t.bindFramebuffer(U,ve),u[U]=ve,U===t.DRAW_FRAMEBUFFER&&(u[t.FRAMEBUFFER]=ve),U===t.FRAMEBUFFER&&(u[t.DRAW_FRAMEBUFFER]=ve),!0):!1}function de(U,ve){let K=p,ie=!1;if(U){K=f.get(ve),K===void 0&&(K=[],f.set(ve,K));const ge=U.textures;if(K.length!==ge.length||K[0]!==t.COLOR_ATTACHMENT0){for(let xe=0,$e=ge.length;xe<$e;xe++)K[xe]=t.COLOR_ATTACHMENT0+xe;K.length=ge.length,ie=!0}}else K[0]!==t.BACK&&(K[0]=t.BACK,ie=!0);ie&&t.drawBuffers(K)}function Te(U){return m!==U?(t.useProgram(U),m=U,!0):!1}const be={[Sr]:t.FUNC_ADD,[Hy]:t.FUNC_SUBTRACT,[Vy]:t.FUNC_REVERSE_SUBTRACT};be[Gy]=t.MIN,be[Wy]=t.MAX;const Ne={[Xy]:t.ZERO,[$y]:t.ONE,[qy]:t.SRC_COLOR,[vd]:t.SRC_ALPHA,[eS]:t.SRC_ALPHA_SATURATE,[Qy]:t.DST_COLOR,[Ky]:t.DST_ALPHA,[Yy]:t.ONE_MINUS_SRC_COLOR,[xd]:t.ONE_MINUS_SRC_ALPHA,[Jy]:t.ONE_MINUS_DST_COLOR,[Zy]:t.ONE_MINUS_DST_ALPHA,[tS]:t.CONSTANT_COLOR,[nS]:t.ONE_MINUS_CONSTANT_COLOR,[iS]:t.CONSTANT_ALPHA,[rS]:t.ONE_MINUS_CONSTANT_ALPHA};function D(U,ve,K,ie,ge,xe,$e,Tt,tn,Ke){if(U===tr){S===!0&&(R(t.BLEND),S=!1);return}if(S===!1&&(ue(t.BLEND),S=!0),U!==By){if(U!==x||Ke!==N){if((g!==Sr||y!==Sr)&&(t.blendEquation(t.FUNC_ADD),g=Sr,y=Sr),Ke)switch(U){case Cs:t.blendFuncSeparate(t.ONE,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case jp:t.blendFunc(t.ONE,t.ONE);break;case zp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Bp:t.blendFuncSeparate(t.ZERO,t.SRC_COLOR,t.ZERO,t.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}else switch(U){case Cs:t.blendFuncSeparate(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA,t.ONE,t.ONE_MINUS_SRC_ALPHA);break;case jp:t.blendFunc(t.SRC_ALPHA,t.ONE);break;case zp:t.blendFuncSeparate(t.ZERO,t.ONE_MINUS_SRC_COLOR,t.ZERO,t.ONE);break;case Bp:t.blendFunc(t.ZERO,t.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",U);break}d=null,_=null,E=null,P=null,b.set(0,0,0),C=0,x=U,N=Ke}return}ge=ge||ve,xe=xe||K,$e=$e||ie,(ve!==g||ge!==y)&&(t.blendEquationSeparate(be[ve],be[ge]),g=ve,y=ge),(K!==d||ie!==_||xe!==E||$e!==P)&&(t.blendFuncSeparate(Ne[K],Ne[ie],Ne[xe],Ne[$e]),d=K,_=ie,E=xe,P=$e),(Tt.equals(b)===!1||tn!==C)&&(t.blendColor(Tt.r,Tt.g,Tt.b,tn),b.copy(Tt),C=tn),x=U,N=!1}function At(U,ve){U.side===Ln?R(t.CULL_FACE):ue(t.CULL_FACE);let K=U.side===hn;ve&&(K=!K),Ve(K),U.blending===Cs&&U.transparent===!1?D(tr):D(U.blending,U.blendEquation,U.blendSrc,U.blendDst,U.blendEquationAlpha,U.blendSrcAlpha,U.blendDstAlpha,U.blendColor,U.blendAlpha,U.premultipliedAlpha),s.setFunc(U.depthFunc),s.setTest(U.depthTest),s.setMask(U.depthWrite),r.setMask(U.colorWrite);const ie=U.stencilWrite;a.setTest(ie),ie&&(a.setMask(U.stencilWriteMask),a.setFunc(U.stencilFunc,U.stencilRef,U.stencilFuncMask),a.setOp(U.stencilFail,U.stencilZFail,U.stencilZPass)),st(U.polygonOffset,U.polygonOffsetFactor,U.polygonOffsetUnits),U.alphaToCoverage===!0?ue(t.SAMPLE_ALPHA_TO_COVERAGE):R(t.SAMPLE_ALPHA_TO_COVERAGE)}function Ve(U){z!==U&&(U?t.frontFace(t.CW):t.frontFace(t.CCW),z=U)}function We(U){U!==Oy?(ue(t.CULL_FACE),U!==v&&(U===Op?t.cullFace(t.BACK):U===jy?t.cullFace(t.FRONT):t.cullFace(t.FRONT_AND_BACK))):R(t.CULL_FACE),v=U}function pe(U){U!==M&&(Z&&t.lineWidth(U),M=U)}function st(U,ve,K){U?(ue(t.POLYGON_OFFSET_FILL),(I!==ve||j!==K)&&(t.polygonOffset(ve,K),I=ve,j=K)):R(t.POLYGON_OFFSET_FILL)}function De(U){U?ue(t.SCISSOR_TEST):R(t.SCISSOR_TEST)}function A(U){U===void 0&&(U=t.TEXTURE0+q-1),L!==U&&(t.activeTexture(U),L=U)}function w(U,ve,K){K===void 0&&(L===null?K=t.TEXTURE0+q-1:K=L);let ie=O[K];ie===void 0&&(ie={type:void 0,texture:void 0},O[K]=ie),(ie.type!==U||ie.texture!==ve)&&(L!==K&&(t.activeTexture(K),L=K),t.bindTexture(U,ve||re[U]),ie.type=U,ie.texture=ve)}function G(){const U=O[L];U!==void 0&&U.type!==void 0&&(t.bindTexture(U.type,null),U.type=void 0,U.texture=void 0)}function ee(){try{t.compressedTexImage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ae(){try{t.compressedTexImage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function J(){try{t.texSubImage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ae(){try{t.texSubImage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function me(){try{t.compressedTexSubImage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Se(){try{t.compressedTexSubImage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Ye(){try{t.texStorage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function le(){try{t.texStorage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Me(){try{t.texImage2D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function ke(){try{t.texImage3D.apply(t,arguments)}catch(U){console.error("THREE.WebGLState:",U)}}function Oe(U){fe.equals(U)===!1&&(t.scissor(U.x,U.y,U.z,U.w),fe.copy(U))}function Ee(U){Le.equals(U)===!1&&(t.viewport(U.x,U.y,U.z,U.w),Le.copy(U))}function Xe(U,ve){let K=c.get(ve);K===void 0&&(K=new WeakMap,c.set(ve,K));let ie=K.get(U);ie===void 0&&(ie=t.getUniformBlockIndex(ve,U.name),K.set(U,ie))}function je(U,ve){const ie=c.get(ve).get(U);o.get(ve)!==ie&&(t.uniformBlockBinding(ve,ie,U.__bindingPointIndex),o.set(ve,ie))}function at(){t.disable(t.BLEND),t.disable(t.CULL_FACE),t.disable(t.DEPTH_TEST),t.disable(t.POLYGON_OFFSET_FILL),t.disable(t.SCISSOR_TEST),t.disable(t.STENCIL_TEST),t.disable(t.SAMPLE_ALPHA_TO_COVERAGE),t.blendEquation(t.FUNC_ADD),t.blendFunc(t.ONE,t.ZERO),t.blendFuncSeparate(t.ONE,t.ZERO,t.ONE,t.ZERO),t.blendColor(0,0,0,0),t.colorMask(!0,!0,!0,!0),t.clearColor(0,0,0,0),t.depthMask(!0),t.depthFunc(t.LESS),t.clearDepth(1),t.stencilMask(4294967295),t.stencilFunc(t.ALWAYS,0,4294967295),t.stencilOp(t.KEEP,t.KEEP,t.KEEP),t.clearStencil(0),t.cullFace(t.BACK),t.frontFace(t.CCW),t.polygonOffset(0,0),t.activeTexture(t.TEXTURE0),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),t.bindFramebuffer(t.READ_FRAMEBUFFER,null),t.useProgram(null),t.lineWidth(1),t.scissor(0,0,t.canvas.width,t.canvas.height),t.viewport(0,0,t.canvas.width,t.canvas.height),h={},L=null,O={},u={},f=new WeakMap,p=[],m=null,S=!1,x=null,g=null,d=null,_=null,y=null,E=null,P=null,b=new He(0,0,0),C=0,N=!1,z=null,v=null,M=null,I=null,j=null,fe.set(0,0,t.canvas.width,t.canvas.height),Le.set(0,0,t.canvas.width,t.canvas.height),r.reset(),s.reset(),a.reset()}return{buffers:{color:r,depth:s,stencil:a},enable:ue,disable:R,bindFramebuffer:te,drawBuffers:de,useProgram:Te,setBlending:D,setMaterial:At,setFlipSided:Ve,setCullFace:We,setLineWidth:pe,setPolygonOffset:st,setScissorTest:De,activeTexture:A,bindTexture:w,unbindTexture:G,compressedTexImage2D:ee,compressedTexImage3D:ae,texImage2D:Me,texImage3D:ke,updateUBOMapping:Xe,uniformBlockBinding:je,texStorage2D:Ye,texStorage3D:le,texSubImage2D:J,texSubImage3D:Ae,compressedTexSubImage2D:me,compressedTexSubImage3D:Se,scissor:Oe,viewport:Ee,reset:at}}function Nm(t,e,n,i){const r=AT(i);switch(n){case hv:return t*e;case pv:return t*e;case mv:return t*e*2;case gv:return t*e/r.components*r.byteLength;case of:return t*e/r.components*r.byteLength;case _v:return t*e*2/r.components*r.byteLength;case lf:return t*e*2/r.components*r.byteLength;case fv:return t*e*3/r.components*r.byteLength;case Yn:return t*e*4/r.components*r.byteLength;case cf:return t*e*4/r.components*r.byteLength;case ll:case cl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case ul:case dl:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Ld:case Id:return Math.max(t,16)*Math.max(e,8)/4;case Nd:case Dd:return Math.max(t,8)*Math.max(e,8)/2;case Ud:case Fd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*8;case kd:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case Od:return Math.floor((t+3)/4)*Math.floor((e+3)/4)*16;case jd:return Math.floor((t+4)/5)*Math.floor((e+3)/4)*16;case zd:return Math.floor((t+4)/5)*Math.floor((e+4)/5)*16;case Bd:return Math.floor((t+5)/6)*Math.floor((e+4)/5)*16;case Hd:return Math.floor((t+5)/6)*Math.floor((e+5)/6)*16;case Vd:return Math.floor((t+7)/8)*Math.floor((e+4)/5)*16;case Gd:return Math.floor((t+7)/8)*Math.floor((e+5)/6)*16;case Wd:return Math.floor((t+7)/8)*Math.floor((e+7)/8)*16;case Xd:return Math.floor((t+9)/10)*Math.floor((e+4)/5)*16;case $d:return Math.floor((t+9)/10)*Math.floor((e+5)/6)*16;case qd:return Math.floor((t+9)/10)*Math.floor((e+7)/8)*16;case Yd:return Math.floor((t+9)/10)*Math.floor((e+9)/10)*16;case Kd:return Math.floor((t+11)/12)*Math.floor((e+9)/10)*16;case Zd:return Math.floor((t+11)/12)*Math.floor((e+11)/12)*16;case hl:case Qd:case Jd:return Math.ceil(t/4)*Math.ceil(e/4)*16;case vv:case eh:return Math.ceil(t/4)*Math.ceil(e/4)*8;case th:case nh:return Math.ceil(t/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${n} format.`)}function AT(t){switch(t){case Ci:case cv:return{byteLength:1,components:1};case qa:case uv:case eo:return{byteLength:2,components:1};case sf:case af:return{byteLength:2,components:4};case Ur:case rf:case xi:return{byteLength:4,components:1};case dv:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${t}.`)}function RT(t,e,n,i,r,s,a){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,c=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),h=new Fe,u=new WeakMap;let f;const p=new WeakMap;let m=!1;try{m=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function S(A,w){return m?new OffscreenCanvas(A,w):Wl("canvas")}function x(A,w,G){let ee=1;const ae=De(A);if((ae.width>G||ae.height>G)&&(ee=G/Math.max(ae.width,ae.height)),ee<1)if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap||typeof VideoFrame<"u"&&A instanceof VideoFrame){const J=Math.floor(ee*ae.width),Ae=Math.floor(ee*ae.height);f===void 0&&(f=S(J,Ae));const me=w?S(J,Ae):f;return me.width=J,me.height=Ae,me.getContext("2d").drawImage(A,0,0,J,Ae),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+ae.width+"x"+ae.height+") to ("+J+"x"+Ae+")."),me}else return"data"in A&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+ae.width+"x"+ae.height+")."),A;return A}function g(A){return A.generateMipmaps&&A.minFilter!==In&&A.minFilter!==$n}function d(A){t.generateMipmap(A)}function _(A,w,G,ee,ae=!1){if(A!==null){if(t[A]!==void 0)return t[A];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+A+"'")}let J=w;if(w===t.RED&&(G===t.FLOAT&&(J=t.R32F),G===t.HALF_FLOAT&&(J=t.R16F),G===t.UNSIGNED_BYTE&&(J=t.R8)),w===t.RED_INTEGER&&(G===t.UNSIGNED_BYTE&&(J=t.R8UI),G===t.UNSIGNED_SHORT&&(J=t.R16UI),G===t.UNSIGNED_INT&&(J=t.R32UI),G===t.BYTE&&(J=t.R8I),G===t.SHORT&&(J=t.R16I),G===t.INT&&(J=t.R32I)),w===t.RG&&(G===t.FLOAT&&(J=t.RG32F),G===t.HALF_FLOAT&&(J=t.RG16F),G===t.UNSIGNED_BYTE&&(J=t.RG8)),w===t.RG_INTEGER&&(G===t.UNSIGNED_BYTE&&(J=t.RG8UI),G===t.UNSIGNED_SHORT&&(J=t.RG16UI),G===t.UNSIGNED_INT&&(J=t.RG32UI),G===t.BYTE&&(J=t.RG8I),G===t.SHORT&&(J=t.RG16I),G===t.INT&&(J=t.RG32I)),w===t.RGB_INTEGER&&(G===t.UNSIGNED_BYTE&&(J=t.RGB8UI),G===t.UNSIGNED_SHORT&&(J=t.RGB16UI),G===t.UNSIGNED_INT&&(J=t.RGB32UI),G===t.BYTE&&(J=t.RGB8I),G===t.SHORT&&(J=t.RGB16I),G===t.INT&&(J=t.RGB32I)),w===t.RGBA_INTEGER&&(G===t.UNSIGNED_BYTE&&(J=t.RGBA8UI),G===t.UNSIGNED_SHORT&&(J=t.RGBA16UI),G===t.UNSIGNED_INT&&(J=t.RGBA32UI),G===t.BYTE&&(J=t.RGBA8I),G===t.SHORT&&(J=t.RGBA16I),G===t.INT&&(J=t.RGBA32I)),w===t.RGB&&G===t.UNSIGNED_INT_5_9_9_9_REV&&(J=t.RGB9_E5),w===t.RGBA){const Ae=ae?Bl:Je.getTransfer(ee);G===t.FLOAT&&(J=t.RGBA32F),G===t.HALF_FLOAT&&(J=t.RGBA16F),G===t.UNSIGNED_BYTE&&(J=Ae===dt?t.SRGB8_ALPHA8:t.RGBA8),G===t.UNSIGNED_SHORT_4_4_4_4&&(J=t.RGBA4),G===t.UNSIGNED_SHORT_5_5_5_1&&(J=t.RGB5_A1)}return(J===t.R16F||J===t.R32F||J===t.RG16F||J===t.RG32F||J===t.RGBA16F||J===t.RGBA32F)&&e.get("EXT_color_buffer_float"),J}function y(A,w){let G;return A?w===null||w===Ur||w===js?G=t.DEPTH24_STENCIL8:w===xi?G=t.DEPTH32F_STENCIL8:w===qa&&(G=t.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===Ur||w===js?G=t.DEPTH_COMPONENT24:w===xi?G=t.DEPTH_COMPONENT32F:w===qa&&(G=t.DEPTH_COMPONENT16),G}function E(A,w){return g(A)===!0||A.isFramebufferTexture&&A.minFilter!==In&&A.minFilter!==$n?Math.log2(Math.max(w.width,w.height))+1:A.mipmaps!==void 0&&A.mipmaps.length>0?A.mipmaps.length:A.isCompressedTexture&&Array.isArray(A.image)?w.mipmaps.length:1}function P(A){const w=A.target;w.removeEventListener("dispose",P),C(w),w.isVideoTexture&&u.delete(w)}function b(A){const w=A.target;w.removeEventListener("dispose",b),z(w)}function C(A){const w=i.get(A);if(w.__webglInit===void 0)return;const G=A.source,ee=p.get(G);if(ee){const ae=ee[w.__cacheKey];ae.usedTimes--,ae.usedTimes===0&&N(A),Object.keys(ee).length===0&&p.delete(G)}i.remove(A)}function N(A){const w=i.get(A);t.deleteTexture(w.__webglTexture);const G=A.source,ee=p.get(G);delete ee[w.__cacheKey],a.memory.textures--}function z(A){const w=i.get(A);if(A.depthTexture&&A.depthTexture.dispose(),A.isWebGLCubeRenderTarget)for(let ee=0;ee<6;ee++){if(Array.isArray(w.__webglFramebuffer[ee]))for(let ae=0;ae<w.__webglFramebuffer[ee].length;ae++)t.deleteFramebuffer(w.__webglFramebuffer[ee][ae]);else t.deleteFramebuffer(w.__webglFramebuffer[ee]);w.__webglDepthbuffer&&t.deleteRenderbuffer(w.__webglDepthbuffer[ee])}else{if(Array.isArray(w.__webglFramebuffer))for(let ee=0;ee<w.__webglFramebuffer.length;ee++)t.deleteFramebuffer(w.__webglFramebuffer[ee]);else t.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&t.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&t.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let ee=0;ee<w.__webglColorRenderbuffer.length;ee++)w.__webglColorRenderbuffer[ee]&&t.deleteRenderbuffer(w.__webglColorRenderbuffer[ee]);w.__webglDepthRenderbuffer&&t.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const G=A.textures;for(let ee=0,ae=G.length;ee<ae;ee++){const J=i.get(G[ee]);J.__webglTexture&&(t.deleteTexture(J.__webglTexture),a.memory.textures--),i.remove(G[ee])}i.remove(A)}let v=0;function M(){v=0}function I(){const A=v;return A>=r.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+A+" texture units while this GPU supports only "+r.maxTextures),v+=1,A}function j(A){const w=[];return w.push(A.wrapS),w.push(A.wrapT),w.push(A.wrapR||0),w.push(A.magFilter),w.push(A.minFilter),w.push(A.anisotropy),w.push(A.internalFormat),w.push(A.format),w.push(A.type),w.push(A.generateMipmaps),w.push(A.premultiplyAlpha),w.push(A.flipY),w.push(A.unpackAlignment),w.push(A.colorSpace),w.join()}function q(A,w){const G=i.get(A);if(A.isVideoTexture&&pe(A),A.isRenderTargetTexture===!1&&A.version>0&&G.__version!==A.version){const ee=A.image;if(ee===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ee.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{Le(G,A,w);return}}n.bindTexture(t.TEXTURE_2D,G.__webglTexture,t.TEXTURE0+w)}function Z(A,w){const G=i.get(A);if(A.version>0&&G.__version!==A.version){Le(G,A,w);return}n.bindTexture(t.TEXTURE_2D_ARRAY,G.__webglTexture,t.TEXTURE0+w)}function H(A,w){const G=i.get(A);if(A.version>0&&G.__version!==A.version){Le(G,A,w);return}n.bindTexture(t.TEXTURE_3D,G.__webglTexture,t.TEXTURE0+w)}function Y(A,w){const G=i.get(A);if(A.version>0&&G.__version!==A.version){$(G,A,w);return}n.bindTexture(t.TEXTURE_CUBE_MAP,G.__webglTexture,t.TEXTURE0+w)}const L={[Rd]:t.REPEAT,[Cr]:t.CLAMP_TO_EDGE,[Pd]:t.MIRRORED_REPEAT},O={[In]:t.NEAREST,[pS]:t.NEAREST_MIPMAP_NEAREST,[Eo]:t.NEAREST_MIPMAP_LINEAR,[$n]:t.LINEAR,[$c]:t.LINEAR_MIPMAP_NEAREST,[br]:t.LINEAR_MIPMAP_LINEAR},V={[vS]:t.NEVER,[wS]:t.ALWAYS,[xS]:t.LESS,[yv]:t.LEQUAL,[yS]:t.EQUAL,[ES]:t.GEQUAL,[SS]:t.GREATER,[MS]:t.NOTEQUAL};function se(A,w){if(w.type===xi&&e.has("OES_texture_float_linear")===!1&&(w.magFilter===$n||w.magFilter===$c||w.magFilter===Eo||w.magFilter===br||w.minFilter===$n||w.minFilter===$c||w.minFilter===Eo||w.minFilter===br)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),t.texParameteri(A,t.TEXTURE_WRAP_S,L[w.wrapS]),t.texParameteri(A,t.TEXTURE_WRAP_T,L[w.wrapT]),(A===t.TEXTURE_3D||A===t.TEXTURE_2D_ARRAY)&&t.texParameteri(A,t.TEXTURE_WRAP_R,L[w.wrapR]),t.texParameteri(A,t.TEXTURE_MAG_FILTER,O[w.magFilter]),t.texParameteri(A,t.TEXTURE_MIN_FILTER,O[w.minFilter]),w.compareFunction&&(t.texParameteri(A,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(A,t.TEXTURE_COMPARE_FUNC,V[w.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===In||w.minFilter!==Eo&&w.minFilter!==br||w.type===xi&&e.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||i.get(w).__currentAnisotropy){const G=e.get("EXT_texture_filter_anisotropic");t.texParameterf(A,G.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,r.getMaxAnisotropy())),i.get(w).__currentAnisotropy=w.anisotropy}}}function fe(A,w){let G=!1;A.__webglInit===void 0&&(A.__webglInit=!0,w.addEventListener("dispose",P));const ee=w.source;let ae=p.get(ee);ae===void 0&&(ae={},p.set(ee,ae));const J=j(w);if(J!==A.__cacheKey){ae[J]===void 0&&(ae[J]={texture:t.createTexture(),usedTimes:0},a.memory.textures++,G=!0),ae[J].usedTimes++;const Ae=ae[A.__cacheKey];Ae!==void 0&&(ae[A.__cacheKey].usedTimes--,Ae.usedTimes===0&&N(w)),A.__cacheKey=J,A.__webglTexture=ae[J].texture}return G}function Le(A,w,G){let ee=t.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(ee=t.TEXTURE_2D_ARRAY),w.isData3DTexture&&(ee=t.TEXTURE_3D);const ae=fe(A,w),J=w.source;n.bindTexture(ee,A.__webglTexture,t.TEXTURE0+G);const Ae=i.get(J);if(J.version!==Ae.__version||ae===!0){n.activeTexture(t.TEXTURE0+G);const me=Je.getPrimaries(Je.workingColorSpace),Se=w.colorSpace===Vi?null:Je.getPrimaries(w.colorSpace),Ye=w.colorSpace===Vi||me===Se?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,w.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ye);let le=x(w.image,!1,r.maxTextureSize);le=st(w,le);const Me=s.convert(w.format,w.colorSpace),ke=s.convert(w.type);let Oe=_(w.internalFormat,Me,ke,w.colorSpace,w.isVideoTexture);se(ee,w);let Ee;const Xe=w.mipmaps,je=w.isVideoTexture!==!0,at=Ae.__version===void 0||ae===!0,U=J.dataReady,ve=E(w,le);if(w.isDepthTexture)Oe=y(w.format===zs,w.type),at&&(je?n.texStorage2D(t.TEXTURE_2D,1,Oe,le.width,le.height):n.texImage2D(t.TEXTURE_2D,0,Oe,le.width,le.height,0,Me,ke,null));else if(w.isDataTexture)if(Xe.length>0){je&&at&&n.texStorage2D(t.TEXTURE_2D,ve,Oe,Xe[0].width,Xe[0].height);for(let K=0,ie=Xe.length;K<ie;K++)Ee=Xe[K],je?U&&n.texSubImage2D(t.TEXTURE_2D,K,0,0,Ee.width,Ee.height,Me,ke,Ee.data):n.texImage2D(t.TEXTURE_2D,K,Oe,Ee.width,Ee.height,0,Me,ke,Ee.data);w.generateMipmaps=!1}else je?(at&&n.texStorage2D(t.TEXTURE_2D,ve,Oe,le.width,le.height),U&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,le.width,le.height,Me,ke,le.data)):n.texImage2D(t.TEXTURE_2D,0,Oe,le.width,le.height,0,Me,ke,le.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){je&&at&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ve,Oe,Xe[0].width,Xe[0].height,le.depth);for(let K=0,ie=Xe.length;K<ie;K++)if(Ee=Xe[K],w.format!==Yn)if(Me!==null)if(je){if(U)if(w.layerUpdates.size>0){const ge=Nm(Ee.width,Ee.height,w.format,w.type);for(const xe of w.layerUpdates){const $e=Ee.data.subarray(xe*ge/Ee.data.BYTES_PER_ELEMENT,(xe+1)*ge/Ee.data.BYTES_PER_ELEMENT);n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,K,0,0,xe,Ee.width,Ee.height,1,Me,$e,0,0)}w.clearLayerUpdates()}else n.compressedTexSubImage3D(t.TEXTURE_2D_ARRAY,K,0,0,0,Ee.width,Ee.height,le.depth,Me,Ee.data,0,0)}else n.compressedTexImage3D(t.TEXTURE_2D_ARRAY,K,Oe,Ee.width,Ee.height,le.depth,0,Ee.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else je?U&&n.texSubImage3D(t.TEXTURE_2D_ARRAY,K,0,0,0,Ee.width,Ee.height,le.depth,Me,ke,Ee.data):n.texImage3D(t.TEXTURE_2D_ARRAY,K,Oe,Ee.width,Ee.height,le.depth,0,Me,ke,Ee.data)}else{je&&at&&n.texStorage2D(t.TEXTURE_2D,ve,Oe,Xe[0].width,Xe[0].height);for(let K=0,ie=Xe.length;K<ie;K++)Ee=Xe[K],w.format!==Yn?Me!==null?je?U&&n.compressedTexSubImage2D(t.TEXTURE_2D,K,0,0,Ee.width,Ee.height,Me,Ee.data):n.compressedTexImage2D(t.TEXTURE_2D,K,Oe,Ee.width,Ee.height,0,Ee.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):je?U&&n.texSubImage2D(t.TEXTURE_2D,K,0,0,Ee.width,Ee.height,Me,ke,Ee.data):n.texImage2D(t.TEXTURE_2D,K,Oe,Ee.width,Ee.height,0,Me,ke,Ee.data)}else if(w.isDataArrayTexture)if(je){if(at&&n.texStorage3D(t.TEXTURE_2D_ARRAY,ve,Oe,le.width,le.height,le.depth),U)if(w.layerUpdates.size>0){const K=Nm(le.width,le.height,w.format,w.type);for(const ie of w.layerUpdates){const ge=le.data.subarray(ie*K/le.data.BYTES_PER_ELEMENT,(ie+1)*K/le.data.BYTES_PER_ELEMENT);n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,ie,le.width,le.height,1,Me,ke,ge)}w.clearLayerUpdates()}else n.texSubImage3D(t.TEXTURE_2D_ARRAY,0,0,0,0,le.width,le.height,le.depth,Me,ke,le.data)}else n.texImage3D(t.TEXTURE_2D_ARRAY,0,Oe,le.width,le.height,le.depth,0,Me,ke,le.data);else if(w.isData3DTexture)je?(at&&n.texStorage3D(t.TEXTURE_3D,ve,Oe,le.width,le.height,le.depth),U&&n.texSubImage3D(t.TEXTURE_3D,0,0,0,0,le.width,le.height,le.depth,Me,ke,le.data)):n.texImage3D(t.TEXTURE_3D,0,Oe,le.width,le.height,le.depth,0,Me,ke,le.data);else if(w.isFramebufferTexture){if(at)if(je)n.texStorage2D(t.TEXTURE_2D,ve,Oe,le.width,le.height);else{let K=le.width,ie=le.height;for(let ge=0;ge<ve;ge++)n.texImage2D(t.TEXTURE_2D,ge,Oe,K,ie,0,Me,ke,null),K>>=1,ie>>=1}}else if(Xe.length>0){if(je&&at){const K=De(Xe[0]);n.texStorage2D(t.TEXTURE_2D,ve,Oe,K.width,K.height)}for(let K=0,ie=Xe.length;K<ie;K++)Ee=Xe[K],je?U&&n.texSubImage2D(t.TEXTURE_2D,K,0,0,Me,ke,Ee):n.texImage2D(t.TEXTURE_2D,K,Oe,Me,ke,Ee);w.generateMipmaps=!1}else if(je){if(at){const K=De(le);n.texStorage2D(t.TEXTURE_2D,ve,Oe,K.width,K.height)}U&&n.texSubImage2D(t.TEXTURE_2D,0,0,0,Me,ke,le)}else n.texImage2D(t.TEXTURE_2D,0,Oe,Me,ke,le);g(w)&&d(ee),Ae.__version=J.version,w.onUpdate&&w.onUpdate(w)}A.__version=w.version}function $(A,w,G){if(w.image.length!==6)return;const ee=fe(A,w),ae=w.source;n.bindTexture(t.TEXTURE_CUBE_MAP,A.__webglTexture,t.TEXTURE0+G);const J=i.get(ae);if(ae.version!==J.__version||ee===!0){n.activeTexture(t.TEXTURE0+G);const Ae=Je.getPrimaries(Je.workingColorSpace),me=w.colorSpace===Vi?null:Je.getPrimaries(w.colorSpace),Se=w.colorSpace===Vi||Ae===me?t.NONE:t.BROWSER_DEFAULT_WEBGL;t.pixelStorei(t.UNPACK_FLIP_Y_WEBGL,w.flipY),t.pixelStorei(t.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),t.pixelStorei(t.UNPACK_ALIGNMENT,w.unpackAlignment),t.pixelStorei(t.UNPACK_COLORSPACE_CONVERSION_WEBGL,Se);const Ye=w.isCompressedTexture||w.image[0].isCompressedTexture,le=w.image[0]&&w.image[0].isDataTexture,Me=[];for(let ie=0;ie<6;ie++)!Ye&&!le?Me[ie]=x(w.image[ie],!0,r.maxCubemapSize):Me[ie]=le?w.image[ie].image:w.image[ie],Me[ie]=st(w,Me[ie]);const ke=Me[0],Oe=s.convert(w.format,w.colorSpace),Ee=s.convert(w.type),Xe=_(w.internalFormat,Oe,Ee,w.colorSpace),je=w.isVideoTexture!==!0,at=J.__version===void 0||ee===!0,U=ae.dataReady;let ve=E(w,ke);se(t.TEXTURE_CUBE_MAP,w);let K;if(Ye){je&&at&&n.texStorage2D(t.TEXTURE_CUBE_MAP,ve,Xe,ke.width,ke.height);for(let ie=0;ie<6;ie++){K=Me[ie].mipmaps;for(let ge=0;ge<K.length;ge++){const xe=K[ge];w.format!==Yn?Oe!==null?je?U&&n.compressedTexSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,ge,0,0,xe.width,xe.height,Oe,xe.data):n.compressedTexImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,ge,Xe,xe.width,xe.height,0,xe.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):je?U&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,ge,0,0,xe.width,xe.height,Oe,Ee,xe.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,ge,Xe,xe.width,xe.height,0,Oe,Ee,xe.data)}}}else{if(K=w.mipmaps,je&&at){K.length>0&&ve++;const ie=De(Me[0]);n.texStorage2D(t.TEXTURE_CUBE_MAP,ve,Xe,ie.width,ie.height)}for(let ie=0;ie<6;ie++)if(le){je?U&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,Me[ie].width,Me[ie].height,Oe,Ee,Me[ie].data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,Xe,Me[ie].width,Me[ie].height,0,Oe,Ee,Me[ie].data);for(let ge=0;ge<K.length;ge++){const $e=K[ge].image[ie].image;je?U&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,ge+1,0,0,$e.width,$e.height,Oe,Ee,$e.data):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,ge+1,Xe,$e.width,$e.height,0,Oe,Ee,$e.data)}}else{je?U&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,0,0,Oe,Ee,Me[ie]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0,Xe,Oe,Ee,Me[ie]);for(let ge=0;ge<K.length;ge++){const xe=K[ge];je?U&&n.texSubImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,ge+1,0,0,Oe,Ee,xe.image[ie]):n.texImage2D(t.TEXTURE_CUBE_MAP_POSITIVE_X+ie,ge+1,Xe,Oe,Ee,xe.image[ie])}}}g(w)&&d(t.TEXTURE_CUBE_MAP),J.__version=ae.version,w.onUpdate&&w.onUpdate(w)}A.__version=w.version}function re(A,w,G,ee,ae,J){const Ae=s.convert(G.format,G.colorSpace),me=s.convert(G.type),Se=_(G.internalFormat,Ae,me,G.colorSpace);if(!i.get(w).__hasExternalTextures){const le=Math.max(1,w.width>>J),Me=Math.max(1,w.height>>J);ae===t.TEXTURE_3D||ae===t.TEXTURE_2D_ARRAY?n.texImage3D(ae,J,Se,le,Me,w.depth,0,Ae,me,null):n.texImage2D(ae,J,Se,le,Me,0,Ae,me,null)}n.bindFramebuffer(t.FRAMEBUFFER,A),We(w)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,ee,ae,i.get(G).__webglTexture,0,Ve(w)):(ae===t.TEXTURE_2D||ae>=t.TEXTURE_CUBE_MAP_POSITIVE_X&&ae<=t.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&t.framebufferTexture2D(t.FRAMEBUFFER,ee,ae,i.get(G).__webglTexture,J),n.bindFramebuffer(t.FRAMEBUFFER,null)}function ue(A,w,G){if(t.bindRenderbuffer(t.RENDERBUFFER,A),w.depthBuffer){const ee=w.depthTexture,ae=ee&&ee.isDepthTexture?ee.type:null,J=y(w.stencilBuffer,ae),Ae=w.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,me=Ve(w);We(w)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,me,J,w.width,w.height):G?t.renderbufferStorageMultisample(t.RENDERBUFFER,me,J,w.width,w.height):t.renderbufferStorage(t.RENDERBUFFER,J,w.width,w.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,Ae,t.RENDERBUFFER,A)}else{const ee=w.textures;for(let ae=0;ae<ee.length;ae++){const J=ee[ae],Ae=s.convert(J.format,J.colorSpace),me=s.convert(J.type),Se=_(J.internalFormat,Ae,me,J.colorSpace),Ye=Ve(w);G&&We(w)===!1?t.renderbufferStorageMultisample(t.RENDERBUFFER,Ye,Se,w.width,w.height):We(w)?o.renderbufferStorageMultisampleEXT(t.RENDERBUFFER,Ye,Se,w.width,w.height):t.renderbufferStorage(t.RENDERBUFFER,Se,w.width,w.height)}}t.bindRenderbuffer(t.RENDERBUFFER,null)}function R(A,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(n.bindFramebuffer(t.FRAMEBUFFER,A),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!i.get(w.depthTexture).__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),q(w.depthTexture,0);const ee=i.get(w.depthTexture).__webglTexture,ae=Ve(w);if(w.depthTexture.format===bs)We(w)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,ee,0,ae):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,ee,0);else if(w.depthTexture.format===zs)We(w)?o.framebufferTexture2DMultisampleEXT(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,ee,0,ae):t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_STENCIL_ATTACHMENT,t.TEXTURE_2D,ee,0);else throw new Error("Unknown depthTexture format")}function te(A){const w=i.get(A),G=A.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==A.depthTexture){const ee=A.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),ee){const ae=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,ee.removeEventListener("dispose",ae)};ee.addEventListener("dispose",ae),w.__depthDisposeCallback=ae}w.__boundDepthTexture=ee}if(A.depthTexture&&!w.__autoAllocateDepthBuffer){if(G)throw new Error("target.depthTexture not supported in Cube render targets");R(w.__webglFramebuffer,A)}else if(G){w.__webglDepthbuffer=[];for(let ee=0;ee<6;ee++)if(n.bindFramebuffer(t.FRAMEBUFFER,w.__webglFramebuffer[ee]),w.__webglDepthbuffer[ee]===void 0)w.__webglDepthbuffer[ee]=t.createRenderbuffer(),ue(w.__webglDepthbuffer[ee],A,!1);else{const ae=A.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,J=w.__webglDepthbuffer[ee];t.bindRenderbuffer(t.RENDERBUFFER,J),t.framebufferRenderbuffer(t.FRAMEBUFFER,ae,t.RENDERBUFFER,J)}}else if(n.bindFramebuffer(t.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=t.createRenderbuffer(),ue(w.__webglDepthbuffer,A,!1);else{const ee=A.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,ae=w.__webglDepthbuffer;t.bindRenderbuffer(t.RENDERBUFFER,ae),t.framebufferRenderbuffer(t.FRAMEBUFFER,ee,t.RENDERBUFFER,ae)}n.bindFramebuffer(t.FRAMEBUFFER,null)}function de(A,w,G){const ee=i.get(A);w!==void 0&&re(ee.__webglFramebuffer,A,A.texture,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,0),G!==void 0&&te(A)}function Te(A){const w=A.texture,G=i.get(A),ee=i.get(w);A.addEventListener("dispose",b);const ae=A.textures,J=A.isWebGLCubeRenderTarget===!0,Ae=ae.length>1;if(Ae||(ee.__webglTexture===void 0&&(ee.__webglTexture=t.createTexture()),ee.__version=w.version,a.memory.textures++),J){G.__webglFramebuffer=[];for(let me=0;me<6;me++)if(w.mipmaps&&w.mipmaps.length>0){G.__webglFramebuffer[me]=[];for(let Se=0;Se<w.mipmaps.length;Se++)G.__webglFramebuffer[me][Se]=t.createFramebuffer()}else G.__webglFramebuffer[me]=t.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){G.__webglFramebuffer=[];for(let me=0;me<w.mipmaps.length;me++)G.__webglFramebuffer[me]=t.createFramebuffer()}else G.__webglFramebuffer=t.createFramebuffer();if(Ae)for(let me=0,Se=ae.length;me<Se;me++){const Ye=i.get(ae[me]);Ye.__webglTexture===void 0&&(Ye.__webglTexture=t.createTexture(),a.memory.textures++)}if(A.samples>0&&We(A)===!1){G.__webglMultisampledFramebuffer=t.createFramebuffer(),G.__webglColorRenderbuffer=[],n.bindFramebuffer(t.FRAMEBUFFER,G.__webglMultisampledFramebuffer);for(let me=0;me<ae.length;me++){const Se=ae[me];G.__webglColorRenderbuffer[me]=t.createRenderbuffer(),t.bindRenderbuffer(t.RENDERBUFFER,G.__webglColorRenderbuffer[me]);const Ye=s.convert(Se.format,Se.colorSpace),le=s.convert(Se.type),Me=_(Se.internalFormat,Ye,le,Se.colorSpace,A.isXRRenderTarget===!0),ke=Ve(A);t.renderbufferStorageMultisample(t.RENDERBUFFER,ke,Me,A.width,A.height),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+me,t.RENDERBUFFER,G.__webglColorRenderbuffer[me])}t.bindRenderbuffer(t.RENDERBUFFER,null),A.depthBuffer&&(G.__webglDepthRenderbuffer=t.createRenderbuffer(),ue(G.__webglDepthRenderbuffer,A,!0)),n.bindFramebuffer(t.FRAMEBUFFER,null)}}if(J){n.bindTexture(t.TEXTURE_CUBE_MAP,ee.__webglTexture),se(t.TEXTURE_CUBE_MAP,w);for(let me=0;me<6;me++)if(w.mipmaps&&w.mipmaps.length>0)for(let Se=0;Se<w.mipmaps.length;Se++)re(G.__webglFramebuffer[me][Se],A,w,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+me,Se);else re(G.__webglFramebuffer[me],A,w,t.COLOR_ATTACHMENT0,t.TEXTURE_CUBE_MAP_POSITIVE_X+me,0);g(w)&&d(t.TEXTURE_CUBE_MAP),n.unbindTexture()}else if(Ae){for(let me=0,Se=ae.length;me<Se;me++){const Ye=ae[me],le=i.get(Ye);n.bindTexture(t.TEXTURE_2D,le.__webglTexture),se(t.TEXTURE_2D,Ye),re(G.__webglFramebuffer,A,Ye,t.COLOR_ATTACHMENT0+me,t.TEXTURE_2D,0),g(Ye)&&d(t.TEXTURE_2D)}n.unbindTexture()}else{let me=t.TEXTURE_2D;if((A.isWebGL3DRenderTarget||A.isWebGLArrayRenderTarget)&&(me=A.isWebGL3DRenderTarget?t.TEXTURE_3D:t.TEXTURE_2D_ARRAY),n.bindTexture(me,ee.__webglTexture),se(me,w),w.mipmaps&&w.mipmaps.length>0)for(let Se=0;Se<w.mipmaps.length;Se++)re(G.__webglFramebuffer[Se],A,w,t.COLOR_ATTACHMENT0,me,Se);else re(G.__webglFramebuffer,A,w,t.COLOR_ATTACHMENT0,me,0);g(w)&&d(me),n.unbindTexture()}A.depthBuffer&&te(A)}function be(A){const w=A.textures;for(let G=0,ee=w.length;G<ee;G++){const ae=w[G];if(g(ae)){const J=A.isWebGLCubeRenderTarget?t.TEXTURE_CUBE_MAP:t.TEXTURE_2D,Ae=i.get(ae).__webglTexture;n.bindTexture(J,Ae),d(J),n.unbindTexture()}}}const Ne=[],D=[];function At(A){if(A.samples>0){if(We(A)===!1){const w=A.textures,G=A.width,ee=A.height;let ae=t.COLOR_BUFFER_BIT;const J=A.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT,Ae=i.get(A),me=w.length>1;if(me)for(let Se=0;Se<w.length;Se++)n.bindFramebuffer(t.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Se,t.RENDERBUFFER,null),n.bindFramebuffer(t.FRAMEBUFFER,Ae.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Se,t.TEXTURE_2D,null,0);n.bindFramebuffer(t.READ_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ae.__webglFramebuffer);for(let Se=0;Se<w.length;Se++){if(A.resolveDepthBuffer&&(A.depthBuffer&&(ae|=t.DEPTH_BUFFER_BIT),A.stencilBuffer&&A.resolveStencilBuffer&&(ae|=t.STENCIL_BUFFER_BIT)),me){t.framebufferRenderbuffer(t.READ_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.RENDERBUFFER,Ae.__webglColorRenderbuffer[Se]);const Ye=i.get(w[Se]).__webglTexture;t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,Ye,0)}t.blitFramebuffer(0,0,G,ee,0,0,G,ee,ae,t.NEAREST),c===!0&&(Ne.length=0,D.length=0,Ne.push(t.COLOR_ATTACHMENT0+Se),A.depthBuffer&&A.resolveDepthBuffer===!1&&(Ne.push(J),D.push(J),t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,D)),t.invalidateFramebuffer(t.READ_FRAMEBUFFER,Ne))}if(n.bindFramebuffer(t.READ_FRAMEBUFFER,null),n.bindFramebuffer(t.DRAW_FRAMEBUFFER,null),me)for(let Se=0;Se<w.length;Se++){n.bindFramebuffer(t.FRAMEBUFFER,Ae.__webglMultisampledFramebuffer),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0+Se,t.RENDERBUFFER,Ae.__webglColorRenderbuffer[Se]);const Ye=i.get(w[Se]).__webglTexture;n.bindFramebuffer(t.FRAMEBUFFER,Ae.__webglFramebuffer),t.framebufferTexture2D(t.DRAW_FRAMEBUFFER,t.COLOR_ATTACHMENT0+Se,t.TEXTURE_2D,Ye,0)}n.bindFramebuffer(t.DRAW_FRAMEBUFFER,Ae.__webglMultisampledFramebuffer)}else if(A.depthBuffer&&A.resolveDepthBuffer===!1&&c){const w=A.stencilBuffer?t.DEPTH_STENCIL_ATTACHMENT:t.DEPTH_ATTACHMENT;t.invalidateFramebuffer(t.DRAW_FRAMEBUFFER,[w])}}}function Ve(A){return Math.min(r.maxSamples,A.samples)}function We(A){const w=i.get(A);return A.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function pe(A){const w=a.render.frame;u.get(A)!==w&&(u.set(A,w),A.update())}function st(A,w){const G=A.colorSpace,ee=A.format,ae=A.type;return A.isCompressedTexture===!0||A.isVideoTexture===!0||G!==ur&&G!==Vi&&(Je.getTransfer(G)===dt?(ee!==Yn||ae!==Ci)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",G)),w}function De(A){return typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement?(h.width=A.naturalWidth||A.width,h.height=A.naturalHeight||A.height):typeof VideoFrame<"u"&&A instanceof VideoFrame?(h.width=A.displayWidth,h.height=A.displayHeight):(h.width=A.width,h.height=A.height),h}this.allocateTextureUnit=I,this.resetTextureUnits=M,this.setTexture2D=q,this.setTexture2DArray=Z,this.setTexture3D=H,this.setTextureCube=Y,this.rebindTextures=de,this.setupRenderTarget=Te,this.updateRenderTargetMipmap=be,this.updateMultisampleRenderTarget=At,this.setupDepthRenderbuffer=te,this.setupFrameBufferTexture=re,this.useMultisampledRTT=We}function PT(t,e){function n(i,r=Vi){let s;const a=Je.getTransfer(r);if(i===Ci)return t.UNSIGNED_BYTE;if(i===sf)return t.UNSIGNED_SHORT_4_4_4_4;if(i===af)return t.UNSIGNED_SHORT_5_5_5_1;if(i===dv)return t.UNSIGNED_INT_5_9_9_9_REV;if(i===cv)return t.BYTE;if(i===uv)return t.SHORT;if(i===qa)return t.UNSIGNED_SHORT;if(i===rf)return t.INT;if(i===Ur)return t.UNSIGNED_INT;if(i===xi)return t.FLOAT;if(i===eo)return t.HALF_FLOAT;if(i===hv)return t.ALPHA;if(i===fv)return t.RGB;if(i===Yn)return t.RGBA;if(i===pv)return t.LUMINANCE;if(i===mv)return t.LUMINANCE_ALPHA;if(i===bs)return t.DEPTH_COMPONENT;if(i===zs)return t.DEPTH_STENCIL;if(i===gv)return t.RED;if(i===of)return t.RED_INTEGER;if(i===_v)return t.RG;if(i===lf)return t.RG_INTEGER;if(i===cf)return t.RGBA_INTEGER;if(i===ll||i===cl||i===ul||i===dl)if(a===dt)if(s=e.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(i===ll)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(i===cl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(i===ul)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(i===dl)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=e.get("WEBGL_compressed_texture_s3tc"),s!==null){if(i===ll)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(i===cl)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(i===ul)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(i===dl)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(i===Nd||i===Ld||i===Dd||i===Id)if(s=e.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(i===Nd)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(i===Ld)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(i===Dd)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(i===Id)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(i===Ud||i===Fd||i===kd)if(s=e.get("WEBGL_compressed_texture_etc"),s!==null){if(i===Ud||i===Fd)return a===dt?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(i===kd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(i===Od||i===jd||i===zd||i===Bd||i===Hd||i===Vd||i===Gd||i===Wd||i===Xd||i===$d||i===qd||i===Yd||i===Kd||i===Zd)if(s=e.get("WEBGL_compressed_texture_astc"),s!==null){if(i===Od)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(i===jd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(i===zd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(i===Bd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(i===Hd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(i===Vd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(i===Gd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(i===Wd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(i===Xd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(i===$d)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(i===qd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(i===Yd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(i===Kd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(i===Zd)return a===dt?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(i===hl||i===Qd||i===Jd)if(s=e.get("EXT_texture_compression_bptc"),s!==null){if(i===hl)return a===dt?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(i===Qd)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(i===Jd)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(i===vv||i===eh||i===th||i===nh)if(s=e.get("EXT_texture_compression_rgtc"),s!==null){if(i===hl)return s.COMPRESSED_RED_RGTC1_EXT;if(i===eh)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(i===th)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(i===nh)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return i===js?t.UNSIGNED_INT_24_8:t[i]!==void 0?t[i]:null}return{convert:n}}class NT extends yn{constructor(e=[]){super(),this.isArrayCamera=!0,this.cameras=e}}class Xi extends Ot{constructor(){super(),this.isGroup=!0,this.type="Group"}}const LT={type:"move"};class Mu{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Xi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Xi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new B,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new B),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Xi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new B,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new B),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const n=this._hand;if(n)for(const i of e.hand.values())this._getHandJoint(n,i)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,n,i){let r=null,s=null,a=null;const o=this._targetRay,c=this._grip,h=this._hand;if(e&&n.session.visibilityState!=="visible-blurred"){if(h&&e.hand){a=!0;for(const x of e.hand.values()){const g=n.getJointPose(x,i),d=this._getHandJoint(h,x);g!==null&&(d.matrix.fromArray(g.transform.matrix),d.matrix.decompose(d.position,d.rotation,d.scale),d.matrixWorldNeedsUpdate=!0,d.jointRadius=g.radius),d.visible=g!==null}const u=h.joints["index-finger-tip"],f=h.joints["thumb-tip"],p=u.position.distanceTo(f.position),m=.02,S=.005;h.inputState.pinching&&p>m+S?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!h.inputState.pinching&&p<=m-S&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else c!==null&&e.gripSpace&&(s=n.getPose(e.gripSpace,i),s!==null&&(c.matrix.fromArray(s.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,s.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(s.linearVelocity)):c.hasLinearVelocity=!1,s.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(s.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(r=n.getPose(e.targetRaySpace,i),r===null&&s!==null&&(r=s),r!==null&&(o.matrix.fromArray(r.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,r.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(r.linearVelocity)):o.hasLinearVelocity=!1,r.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(r.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(LT)))}return o!==null&&(o.visible=r!==null),c!==null&&(c.visible=s!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(e,n){if(e.joints[n.jointName]===void 0){const i=new Xi;i.matrixAutoUpdate=!1,i.visible=!1,e.joints[n.jointName]=i,e.add(i)}return e.joints[n.jointName]}}const DT=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,IT=`
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

}`;class UT{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,n,i){if(this.texture===null){const r=new fn,s=e.properties.get(r);s.__webglTexture=n.texture,(n.depthNear!=i.depthNear||n.depthFar!=i.depthFar)&&(this.depthNear=n.depthNear,this.depthFar=n.depthFar),this.texture=r}}getMesh(e){if(this.texture!==null&&this.mesh===null){const n=e.cameras[0].viewport,i=new ar({vertexShader:DT,fragmentShader:IT,uniforms:{depthColor:{value:this.texture},depthWidth:{value:n.z},depthHeight:{value:n.w}}});this.mesh=new Mn(new pc(20,20),i)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class FT extends zr{constructor(e,n){super();const i=this;let r=null,s=1,a=null,o="local-floor",c=1,h=null,u=null,f=null,p=null,m=null,S=null;const x=new UT,g=n.getContextAttributes();let d=null,_=null;const y=[],E=[],P=new Fe;let b=null;const C=new yn;C.layers.enable(1),C.viewport=new St;const N=new yn;N.layers.enable(2),N.viewport=new St;const z=[C,N],v=new NT;v.layers.enable(1),v.layers.enable(2);let M=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function($){let re=y[$];return re===void 0&&(re=new Mu,y[$]=re),re.getTargetRaySpace()},this.getControllerGrip=function($){let re=y[$];return re===void 0&&(re=new Mu,y[$]=re),re.getGripSpace()},this.getHand=function($){let re=y[$];return re===void 0&&(re=new Mu,y[$]=re),re.getHandSpace()};function j($){const re=E.indexOf($.inputSource);if(re===-1)return;const ue=y[re];ue!==void 0&&(ue.update($.inputSource,$.frame,h||a),ue.dispatchEvent({type:$.type,data:$.inputSource}))}function q(){r.removeEventListener("select",j),r.removeEventListener("selectstart",j),r.removeEventListener("selectend",j),r.removeEventListener("squeeze",j),r.removeEventListener("squeezestart",j),r.removeEventListener("squeezeend",j),r.removeEventListener("end",q),r.removeEventListener("inputsourceschange",Z);for(let $=0;$<y.length;$++){const re=E[$];re!==null&&(E[$]=null,y[$].disconnect(re))}M=null,I=null,x.reset(),e.setRenderTarget(d),m=null,p=null,f=null,r=null,_=null,Le.stop(),i.isPresenting=!1,e.setPixelRatio(b),e.setSize(P.width,P.height,!1),i.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function($){s=$,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function($){o=$,i.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function($){h=$},this.getBaseLayer=function(){return p!==null?p:m},this.getBinding=function(){return f},this.getFrame=function(){return S},this.getSession=function(){return r},this.setSession=async function($){if(r=$,r!==null){if(d=e.getRenderTarget(),r.addEventListener("select",j),r.addEventListener("selectstart",j),r.addEventListener("selectend",j),r.addEventListener("squeeze",j),r.addEventListener("squeezestart",j),r.addEventListener("squeezeend",j),r.addEventListener("end",q),r.addEventListener("inputsourceschange",Z),g.xrCompatible!==!0&&await n.makeXRCompatible(),b=e.getPixelRatio(),e.getSize(P),r.renderState.layers===void 0){const re={antialias:g.antialias,alpha:!0,depth:g.depth,stencil:g.stencil,framebufferScaleFactor:s};m=new XRWebGLLayer(r,n,re),r.updateRenderState({baseLayer:m}),e.setPixelRatio(1),e.setSize(m.framebufferWidth,m.framebufferHeight,!1),_=new Fr(m.framebufferWidth,m.framebufferHeight,{format:Yn,type:Ci,colorSpace:e.outputColorSpace,stencilBuffer:g.stencil})}else{let re=null,ue=null,R=null;g.depth&&(R=g.stencil?n.DEPTH24_STENCIL8:n.DEPTH_COMPONENT24,re=g.stencil?zs:bs,ue=g.stencil?js:Ur);const te={colorFormat:n.RGBA8,depthFormat:R,scaleFactor:s};f=new XRWebGLBinding(r,n),p=f.createProjectionLayer(te),r.updateRenderState({layers:[p]}),e.setPixelRatio(1),e.setSize(p.textureWidth,p.textureHeight,!1),_=new Fr(p.textureWidth,p.textureHeight,{format:Yn,type:Ci,depthTexture:new Iv(p.textureWidth,p.textureHeight,ue,void 0,void 0,void 0,void 0,void 0,void 0,re),stencilBuffer:g.stencil,colorSpace:e.outputColorSpace,samples:g.antialias?4:0,resolveDepthBuffer:p.ignoreDepthValues===!1})}_.isXRRenderTarget=!0,this.setFoveation(c),h=null,a=await r.requestReferenceSpace(o),Le.setContext(r),Le.start(),i.isPresenting=!0,i.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(r!==null)return r.environmentBlendMode},this.getDepthTexture=function(){return x.getDepthTexture()};function Z($){for(let re=0;re<$.removed.length;re++){const ue=$.removed[re],R=E.indexOf(ue);R>=0&&(E[R]=null,y[R].disconnect(ue))}for(let re=0;re<$.added.length;re++){const ue=$.added[re];let R=E.indexOf(ue);if(R===-1){for(let de=0;de<y.length;de++)if(de>=E.length){E.push(ue),R=de;break}else if(E[de]===null){E[de]=ue,R=de;break}if(R===-1)break}const te=y[R];te&&te.connect(ue)}}const H=new B,Y=new B;function L($,re,ue){H.setFromMatrixPosition(re.matrixWorld),Y.setFromMatrixPosition(ue.matrixWorld);const R=H.distanceTo(Y),te=re.projectionMatrix.elements,de=ue.projectionMatrix.elements,Te=te[14]/(te[10]-1),be=te[14]/(te[10]+1),Ne=(te[9]+1)/te[5],D=(te[9]-1)/te[5],At=(te[8]-1)/te[0],Ve=(de[8]+1)/de[0],We=Te*At,pe=Te*Ve,st=R/(-At+Ve),De=st*-At;if(re.matrixWorld.decompose($.position,$.quaternion,$.scale),$.translateX(De),$.translateZ(st),$.matrixWorld.compose($.position,$.quaternion,$.scale),$.matrixWorldInverse.copy($.matrixWorld).invert(),te[10]===-1)$.projectionMatrix.copy(re.projectionMatrix),$.projectionMatrixInverse.copy(re.projectionMatrixInverse);else{const A=Te+st,w=be+st,G=We-De,ee=pe+(R-De),ae=Ne*be/w*A,J=D*be/w*A;$.projectionMatrix.makePerspective(G,ee,ae,J,A,w),$.projectionMatrixInverse.copy($.projectionMatrix).invert()}}function O($,re){re===null?$.matrixWorld.copy($.matrix):$.matrixWorld.multiplyMatrices(re.matrixWorld,$.matrix),$.matrixWorldInverse.copy($.matrixWorld).invert()}this.updateCamera=function($){if(r===null)return;let re=$.near,ue=$.far;x.texture!==null&&(x.depthNear>0&&(re=x.depthNear),x.depthFar>0&&(ue=x.depthFar)),v.near=N.near=C.near=re,v.far=N.far=C.far=ue,(M!==v.near||I!==v.far)&&(r.updateRenderState({depthNear:v.near,depthFar:v.far}),M=v.near,I=v.far);const R=$.parent,te=v.cameras;O(v,R);for(let de=0;de<te.length;de++)O(te[de],R);te.length===2?L(v,C,N):v.projectionMatrix.copy(C.projectionMatrix),V($,v,R)};function V($,re,ue){ue===null?$.matrix.copy(re.matrixWorld):($.matrix.copy(ue.matrixWorld),$.matrix.invert(),$.matrix.multiply(re.matrixWorld)),$.matrix.decompose($.position,$.quaternion,$.scale),$.updateMatrixWorld(!0),$.projectionMatrix.copy(re.projectionMatrix),$.projectionMatrixInverse.copy(re.projectionMatrixInverse),$.isPerspectiveCamera&&($.fov=ih*2*Math.atan(1/$.projectionMatrix.elements[5]),$.zoom=1)}this.getCamera=function(){return v},this.getFoveation=function(){if(!(p===null&&m===null))return c},this.setFoveation=function($){c=$,p!==null&&(p.fixedFoveation=$),m!==null&&m.fixedFoveation!==void 0&&(m.fixedFoveation=$)},this.hasDepthSensing=function(){return x.texture!==null},this.getDepthSensingMesh=function(){return x.getMesh(v)};let se=null;function fe($,re){if(u=re.getViewerPose(h||a),S=re,u!==null){const ue=u.views;m!==null&&(e.setRenderTargetFramebuffer(_,m.framebuffer),e.setRenderTarget(_));let R=!1;ue.length!==v.cameras.length&&(v.cameras.length=0,R=!0);for(let de=0;de<ue.length;de++){const Te=ue[de];let be=null;if(m!==null)be=m.getViewport(Te);else{const D=f.getViewSubImage(p,Te);be=D.viewport,de===0&&(e.setRenderTargetTextures(_,D.colorTexture,p.ignoreDepthValues?void 0:D.depthStencilTexture),e.setRenderTarget(_))}let Ne=z[de];Ne===void 0&&(Ne=new yn,Ne.layers.enable(de),Ne.viewport=new St,z[de]=Ne),Ne.matrix.fromArray(Te.transform.matrix),Ne.matrix.decompose(Ne.position,Ne.quaternion,Ne.scale),Ne.projectionMatrix.fromArray(Te.projectionMatrix),Ne.projectionMatrixInverse.copy(Ne.projectionMatrix).invert(),Ne.viewport.set(be.x,be.y,be.width,be.height),de===0&&(v.matrix.copy(Ne.matrix),v.matrix.decompose(v.position,v.quaternion,v.scale)),R===!0&&v.cameras.push(Ne)}const te=r.enabledFeatures;if(te&&te.includes("depth-sensing")){const de=f.getDepthInformation(ue[0]);de&&de.isValid&&de.texture&&x.init(e,de,r.renderState)}}for(let ue=0;ue<y.length;ue++){const R=E[ue],te=y[ue];R!==null&&te!==void 0&&te.update(R,re,h||a)}se&&se($,re),re.detectedPlanes&&i.dispatchEvent({type:"planesdetected",data:re}),S=null}const Le=new Lv;Le.setAnimationLoop(fe),this.setAnimationLoop=function($){se=$},this.dispose=function(){}}}const _r=new oi,kT=new _t;function OT(t,e){function n(g,d){g.matrixAutoUpdate===!0&&g.updateMatrix(),d.value.copy(g.matrix)}function i(g,d){d.color.getRGB(g.fogColor.value,Rv(t)),d.isFog?(g.fogNear.value=d.near,g.fogFar.value=d.far):d.isFogExp2&&(g.fogDensity.value=d.density)}function r(g,d,_,y,E){d.isMeshBasicMaterial||d.isMeshLambertMaterial?s(g,d):d.isMeshToonMaterial?(s(g,d),f(g,d)):d.isMeshPhongMaterial?(s(g,d),u(g,d)):d.isMeshStandardMaterial?(s(g,d),p(g,d),d.isMeshPhysicalMaterial&&m(g,d,E)):d.isMeshMatcapMaterial?(s(g,d),S(g,d)):d.isMeshDepthMaterial?s(g,d):d.isMeshDistanceMaterial?(s(g,d),x(g,d)):d.isMeshNormalMaterial?s(g,d):d.isLineBasicMaterial?(a(g,d),d.isLineDashedMaterial&&o(g,d)):d.isPointsMaterial?c(g,d,_,y):d.isSpriteMaterial?h(g,d):d.isShadowMaterial?(g.color.value.copy(d.color),g.opacity.value=d.opacity):d.isShaderMaterial&&(d.uniformsNeedUpdate=!1)}function s(g,d){g.opacity.value=d.opacity,d.color&&g.diffuse.value.copy(d.color),d.emissive&&g.emissive.value.copy(d.emissive).multiplyScalar(d.emissiveIntensity),d.map&&(g.map.value=d.map,n(d.map,g.mapTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,n(d.alphaMap,g.alphaMapTransform)),d.bumpMap&&(g.bumpMap.value=d.bumpMap,n(d.bumpMap,g.bumpMapTransform),g.bumpScale.value=d.bumpScale,d.side===hn&&(g.bumpScale.value*=-1)),d.normalMap&&(g.normalMap.value=d.normalMap,n(d.normalMap,g.normalMapTransform),g.normalScale.value.copy(d.normalScale),d.side===hn&&g.normalScale.value.negate()),d.displacementMap&&(g.displacementMap.value=d.displacementMap,n(d.displacementMap,g.displacementMapTransform),g.displacementScale.value=d.displacementScale,g.displacementBias.value=d.displacementBias),d.emissiveMap&&(g.emissiveMap.value=d.emissiveMap,n(d.emissiveMap,g.emissiveMapTransform)),d.specularMap&&(g.specularMap.value=d.specularMap,n(d.specularMap,g.specularMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest);const _=e.get(d),y=_.envMap,E=_.envMapRotation;y&&(g.envMap.value=y,_r.copy(E),_r.x*=-1,_r.y*=-1,_r.z*=-1,y.isCubeTexture&&y.isRenderTargetTexture===!1&&(_r.y*=-1,_r.z*=-1),g.envMapRotation.value.setFromMatrix4(kT.makeRotationFromEuler(_r)),g.flipEnvMap.value=y.isCubeTexture&&y.isRenderTargetTexture===!1?-1:1,g.reflectivity.value=d.reflectivity,g.ior.value=d.ior,g.refractionRatio.value=d.refractionRatio),d.lightMap&&(g.lightMap.value=d.lightMap,g.lightMapIntensity.value=d.lightMapIntensity,n(d.lightMap,g.lightMapTransform)),d.aoMap&&(g.aoMap.value=d.aoMap,g.aoMapIntensity.value=d.aoMapIntensity,n(d.aoMap,g.aoMapTransform))}function a(g,d){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,d.map&&(g.map.value=d.map,n(d.map,g.mapTransform))}function o(g,d){g.dashSize.value=d.dashSize,g.totalSize.value=d.dashSize+d.gapSize,g.scale.value=d.scale}function c(g,d,_,y){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,g.size.value=d.size*_,g.scale.value=y*.5,d.map&&(g.map.value=d.map,n(d.map,g.uvTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,n(d.alphaMap,g.alphaMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest)}function h(g,d){g.diffuse.value.copy(d.color),g.opacity.value=d.opacity,g.rotation.value=d.rotation,d.map&&(g.map.value=d.map,n(d.map,g.mapTransform)),d.alphaMap&&(g.alphaMap.value=d.alphaMap,n(d.alphaMap,g.alphaMapTransform)),d.alphaTest>0&&(g.alphaTest.value=d.alphaTest)}function u(g,d){g.specular.value.copy(d.specular),g.shininess.value=Math.max(d.shininess,1e-4)}function f(g,d){d.gradientMap&&(g.gradientMap.value=d.gradientMap)}function p(g,d){g.metalness.value=d.metalness,d.metalnessMap&&(g.metalnessMap.value=d.metalnessMap,n(d.metalnessMap,g.metalnessMapTransform)),g.roughness.value=d.roughness,d.roughnessMap&&(g.roughnessMap.value=d.roughnessMap,n(d.roughnessMap,g.roughnessMapTransform)),d.envMap&&(g.envMapIntensity.value=d.envMapIntensity)}function m(g,d,_){g.ior.value=d.ior,d.sheen>0&&(g.sheenColor.value.copy(d.sheenColor).multiplyScalar(d.sheen),g.sheenRoughness.value=d.sheenRoughness,d.sheenColorMap&&(g.sheenColorMap.value=d.sheenColorMap,n(d.sheenColorMap,g.sheenColorMapTransform)),d.sheenRoughnessMap&&(g.sheenRoughnessMap.value=d.sheenRoughnessMap,n(d.sheenRoughnessMap,g.sheenRoughnessMapTransform))),d.clearcoat>0&&(g.clearcoat.value=d.clearcoat,g.clearcoatRoughness.value=d.clearcoatRoughness,d.clearcoatMap&&(g.clearcoatMap.value=d.clearcoatMap,n(d.clearcoatMap,g.clearcoatMapTransform)),d.clearcoatRoughnessMap&&(g.clearcoatRoughnessMap.value=d.clearcoatRoughnessMap,n(d.clearcoatRoughnessMap,g.clearcoatRoughnessMapTransform)),d.clearcoatNormalMap&&(g.clearcoatNormalMap.value=d.clearcoatNormalMap,n(d.clearcoatNormalMap,g.clearcoatNormalMapTransform),g.clearcoatNormalScale.value.copy(d.clearcoatNormalScale),d.side===hn&&g.clearcoatNormalScale.value.negate())),d.dispersion>0&&(g.dispersion.value=d.dispersion),d.iridescence>0&&(g.iridescence.value=d.iridescence,g.iridescenceIOR.value=d.iridescenceIOR,g.iridescenceThicknessMinimum.value=d.iridescenceThicknessRange[0],g.iridescenceThicknessMaximum.value=d.iridescenceThicknessRange[1],d.iridescenceMap&&(g.iridescenceMap.value=d.iridescenceMap,n(d.iridescenceMap,g.iridescenceMapTransform)),d.iridescenceThicknessMap&&(g.iridescenceThicknessMap.value=d.iridescenceThicknessMap,n(d.iridescenceThicknessMap,g.iridescenceThicknessMapTransform))),d.transmission>0&&(g.transmission.value=d.transmission,g.transmissionSamplerMap.value=_.texture,g.transmissionSamplerSize.value.set(_.width,_.height),d.transmissionMap&&(g.transmissionMap.value=d.transmissionMap,n(d.transmissionMap,g.transmissionMapTransform)),g.thickness.value=d.thickness,d.thicknessMap&&(g.thicknessMap.value=d.thicknessMap,n(d.thicknessMap,g.thicknessMapTransform)),g.attenuationDistance.value=d.attenuationDistance,g.attenuationColor.value.copy(d.attenuationColor)),d.anisotropy>0&&(g.anisotropyVector.value.set(d.anisotropy*Math.cos(d.anisotropyRotation),d.anisotropy*Math.sin(d.anisotropyRotation)),d.anisotropyMap&&(g.anisotropyMap.value=d.anisotropyMap,n(d.anisotropyMap,g.anisotropyMapTransform))),g.specularIntensity.value=d.specularIntensity,g.specularColor.value.copy(d.specularColor),d.specularColorMap&&(g.specularColorMap.value=d.specularColorMap,n(d.specularColorMap,g.specularColorMapTransform)),d.specularIntensityMap&&(g.specularIntensityMap.value=d.specularIntensityMap,n(d.specularIntensityMap,g.specularIntensityMapTransform))}function S(g,d){d.matcap&&(g.matcap.value=d.matcap)}function x(g,d){const _=e.get(d).light;g.referencePosition.value.setFromMatrixPosition(_.matrixWorld),g.nearDistance.value=_.shadow.camera.near,g.farDistance.value=_.shadow.camera.far}return{refreshFogUniforms:i,refreshMaterialUniforms:r}}function jT(t,e,n,i){let r={},s={},a=[];const o=t.getParameter(t.MAX_UNIFORM_BUFFER_BINDINGS);function c(_,y){const E=y.program;i.uniformBlockBinding(_,E)}function h(_,y){let E=r[_.id];E===void 0&&(S(_),E=u(_),r[_.id]=E,_.addEventListener("dispose",g));const P=y.program;i.updateUBOMapping(_,P);const b=e.render.frame;s[_.id]!==b&&(p(_),s[_.id]=b)}function u(_){const y=f();_.__bindingPointIndex=y;const E=t.createBuffer(),P=_.__size,b=_.usage;return t.bindBuffer(t.UNIFORM_BUFFER,E),t.bufferData(t.UNIFORM_BUFFER,P,b),t.bindBuffer(t.UNIFORM_BUFFER,null),t.bindBufferBase(t.UNIFORM_BUFFER,y,E),E}function f(){for(let _=0;_<o;_++)if(a.indexOf(_)===-1)return a.push(_),_;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function p(_){const y=r[_.id],E=_.uniforms,P=_.__cache;t.bindBuffer(t.UNIFORM_BUFFER,y);for(let b=0,C=E.length;b<C;b++){const N=Array.isArray(E[b])?E[b]:[E[b]];for(let z=0,v=N.length;z<v;z++){const M=N[z];if(m(M,b,z,P)===!0){const I=M.__offset,j=Array.isArray(M.value)?M.value:[M.value];let q=0;for(let Z=0;Z<j.length;Z++){const H=j[Z],Y=x(H);typeof H=="number"||typeof H=="boolean"?(M.__data[0]=H,t.bufferSubData(t.UNIFORM_BUFFER,I+q,M.__data)):H.isMatrix3?(M.__data[0]=H.elements[0],M.__data[1]=H.elements[1],M.__data[2]=H.elements[2],M.__data[3]=0,M.__data[4]=H.elements[3],M.__data[5]=H.elements[4],M.__data[6]=H.elements[5],M.__data[7]=0,M.__data[8]=H.elements[6],M.__data[9]=H.elements[7],M.__data[10]=H.elements[8],M.__data[11]=0):(H.toArray(M.__data,q),q+=Y.storage/Float32Array.BYTES_PER_ELEMENT)}t.bufferSubData(t.UNIFORM_BUFFER,I,M.__data)}}}t.bindBuffer(t.UNIFORM_BUFFER,null)}function m(_,y,E,P){const b=_.value,C=y+"_"+E;if(P[C]===void 0)return typeof b=="number"||typeof b=="boolean"?P[C]=b:P[C]=b.clone(),!0;{const N=P[C];if(typeof b=="number"||typeof b=="boolean"){if(N!==b)return P[C]=b,!0}else if(N.equals(b)===!1)return N.copy(b),!0}return!1}function S(_){const y=_.uniforms;let E=0;const P=16;for(let C=0,N=y.length;C<N;C++){const z=Array.isArray(y[C])?y[C]:[y[C]];for(let v=0,M=z.length;v<M;v++){const I=z[v],j=Array.isArray(I.value)?I.value:[I.value];for(let q=0,Z=j.length;q<Z;q++){const H=j[q],Y=x(H),L=E%P,O=L%Y.boundary,V=L+O;E+=O,V!==0&&P-V<Y.storage&&(E+=P-V),I.__data=new Float32Array(Y.storage/Float32Array.BYTES_PER_ELEMENT),I.__offset=E,E+=Y.storage}}}const b=E%P;return b>0&&(E+=P-b),_.__size=E,_.__cache={},this}function x(_){const y={boundary:0,storage:0};return typeof _=="number"||typeof _=="boolean"?(y.boundary=4,y.storage=4):_.isVector2?(y.boundary=8,y.storage=8):_.isVector3||_.isColor?(y.boundary=16,y.storage=12):_.isVector4?(y.boundary=16,y.storage=16):_.isMatrix3?(y.boundary=48,y.storage=48):_.isMatrix4?(y.boundary=64,y.storage=64):_.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",_),y}function g(_){const y=_.target;y.removeEventListener("dispose",g);const E=a.indexOf(y.__bindingPointIndex);a.splice(E,1),t.deleteBuffer(r[y.id]),delete r[y.id],delete s[y.id]}function d(){for(const _ in r)t.deleteBuffer(r[_]);a=[],r={},s={}}return{bind:c,update:h,dispose:d}}class jv{constructor(e={}){const{canvas:n=bS(),context:i=null,depth:r=!0,stencil:s=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1}=e;this.isWebGLRenderer=!0;let p;if(i!==null){if(typeof WebGLRenderingContext<"u"&&i instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=i.getContextAttributes().alpha}else p=a;const m=new Uint32Array(4),S=new Int32Array(4);let x=null,g=null;const d=[],_=[];this.domElement=n,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=ti,this.toneMapping=nr,this.toneMappingExposure=1;const y=this;let E=!1,P=0,b=0,C=null,N=-1,z=null;const v=new St,M=new St;let I=null;const j=new He(0);let q=0,Z=n.width,H=n.height,Y=1,L=null,O=null;const V=new St(0,0,Z,H),se=new St(0,0,Z,H);let fe=!1;const Le=new hf;let $=!1,re=!1;const ue=new _t,R=new _t,te=new B,de=new St,Te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let be=!1;function Ne(){return C===null?Y:1}let D=i;function At(T,F){return n.getContext(T,F)}try{const T={alpha:!0,depth:r,stencil:s,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in n&&n.setAttribute("data-engine",`three.js r${nf}`),n.addEventListener("webglcontextlost",ie,!1),n.addEventListener("webglcontextrestored",ge,!1),n.addEventListener("webglcontextcreationerror",xe,!1),D===null){const F="webgl2";if(D=At(F,T),D===null)throw At(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(T){throw console.error("THREE.WebGLRenderer: "+T.message),T}let Ve,We,pe,st,De,A,w,G,ee,ae,J,Ae,me,Se,Ye,le,Me,ke,Oe,Ee,Xe,je,at,U;function ve(){Ve=new Ww(D),Ve.init(),je=new PT(D,Ve),We=new jw(D,Ve,e,je),pe=new bT(D),We.reverseDepthBuffer&&pe.buffers.depth.setReversed(!0),st=new qw(D),De=new hT,A=new RT(D,Ve,pe,De,We,je,st),w=new Bw(y),G=new Gw(y),ee=new tM(D),at=new kw(D,ee),ae=new Xw(D,ee,st,at),J=new Kw(D,ae,ee,st),Oe=new Yw(D,We,A),le=new zw(De),Ae=new dT(y,w,G,Ve,We,at,le),me=new OT(y,De),Se=new pT,Ye=new yT(Ve),ke=new Fw(y,w,G,pe,J,p,c),Me=new TT(y,J,We),U=new jT(D,st,We,pe),Ee=new Ow(D,Ve,st),Xe=new $w(D,Ve,st),st.programs=Ae.programs,y.capabilities=We,y.extensions=Ve,y.properties=De,y.renderLists=Se,y.shadowMap=Me,y.state=pe,y.info=st}ve();const K=new FT(y,D);this.xr=K,this.getContext=function(){return D},this.getContextAttributes=function(){return D.getContextAttributes()},this.forceContextLoss=function(){const T=Ve.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Ve.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return Y},this.setPixelRatio=function(T){T!==void 0&&(Y=T,this.setSize(Z,H,!1))},this.getSize=function(T){return T.set(Z,H)},this.setSize=function(T,F,W=!0){if(K.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Z=T,H=F,n.width=Math.floor(T*Y),n.height=Math.floor(F*Y),W===!0&&(n.style.width=T+"px",n.style.height=F+"px"),this.setViewport(0,0,T,F)},this.getDrawingBufferSize=function(T){return T.set(Z*Y,H*Y).floor()},this.setDrawingBufferSize=function(T,F,W){Z=T,H=F,Y=W,n.width=Math.floor(T*W),n.height=Math.floor(F*W),this.setViewport(0,0,T,F)},this.getCurrentViewport=function(T){return T.copy(v)},this.getViewport=function(T){return T.copy(V)},this.setViewport=function(T,F,W,X){T.isVector4?V.set(T.x,T.y,T.z,T.w):V.set(T,F,W,X),pe.viewport(v.copy(V).multiplyScalar(Y).round())},this.getScissor=function(T){return T.copy(se)},this.setScissor=function(T,F,W,X){T.isVector4?se.set(T.x,T.y,T.z,T.w):se.set(T,F,W,X),pe.scissor(M.copy(se).multiplyScalar(Y).round())},this.getScissorTest=function(){return fe},this.setScissorTest=function(T){pe.setScissorTest(fe=T)},this.setOpaqueSort=function(T){L=T},this.setTransparentSort=function(T){O=T},this.getClearColor=function(T){return T.copy(ke.getClearColor())},this.setClearColor=function(){ke.setClearColor.apply(ke,arguments)},this.getClearAlpha=function(){return ke.getClearAlpha()},this.setClearAlpha=function(){ke.setClearAlpha.apply(ke,arguments)},this.clear=function(T=!0,F=!0,W=!0){let X=0;if(T){let k=!1;if(C!==null){const ce=C.texture.format;k=ce===cf||ce===lf||ce===of}if(k){const ce=C.texture.type,_e=ce===Ci||ce===Ur||ce===qa||ce===js||ce===sf||ce===af,we=ke.getClearColor(),Ce=ke.getClearAlpha(),Ie=we.r,Ue=we.g,Re=we.b;_e?(m[0]=Ie,m[1]=Ue,m[2]=Re,m[3]=Ce,D.clearBufferuiv(D.COLOR,0,m)):(S[0]=Ie,S[1]=Ue,S[2]=Re,S[3]=Ce,D.clearBufferiv(D.COLOR,0,S))}else X|=D.COLOR_BUFFER_BIT}F&&(X|=D.DEPTH_BUFFER_BIT,D.clearDepth(this.capabilities.reverseDepthBuffer?0:1)),W&&(X|=D.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),D.clear(X)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){n.removeEventListener("webglcontextlost",ie,!1),n.removeEventListener("webglcontextrestored",ge,!1),n.removeEventListener("webglcontextcreationerror",xe,!1),Se.dispose(),Ye.dispose(),De.dispose(),w.dispose(),G.dispose(),J.dispose(),at.dispose(),U.dispose(),Ae.dispose(),K.dispose(),K.removeEventListener("sessionstart",_f),K.removeEventListener("sessionend",vf),dr.stop()};function ie(T){T.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),E=!0}function ge(){console.log("THREE.WebGLRenderer: Context Restored."),E=!1;const T=st.autoReset,F=Me.enabled,W=Me.autoUpdate,X=Me.needsUpdate,k=Me.type;ve(),st.autoReset=T,Me.enabled=F,Me.autoUpdate=W,Me.needsUpdate=X,Me.type=k}function xe(T){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function $e(T){const F=T.target;F.removeEventListener("dispose",$e),Tt(F)}function Tt(T){tn(T),De.remove(T)}function tn(T){const F=De.get(T).programs;F!==void 0&&(F.forEach(function(W){Ae.releaseProgram(W)}),T.isShaderMaterial&&Ae.releaseShaderCache(T))}this.renderBufferDirect=function(T,F,W,X,k,ce){F===null&&(F=Te);const _e=k.isMesh&&k.matrixWorld.determinant()<0,we=Yv(T,F,W,X,k);pe.setMaterial(X,_e);let Ce=W.index,Ie=1;if(X.wireframe===!0){if(Ce=ae.getWireframeAttribute(W),Ce===void 0)return;Ie=2}const Ue=W.drawRange,Re=W.attributes.position;let tt=Ue.start*Ie,lt=(Ue.start+Ue.count)*Ie;ce!==null&&(tt=Math.max(tt,ce.start*Ie),lt=Math.min(lt,(ce.start+ce.count)*Ie)),Ce!==null?(tt=Math.max(tt,0),lt=Math.min(lt,Ce.count)):Re!=null&&(tt=Math.max(tt,0),lt=Math.min(lt,Re.count));const xt=lt-tt;if(xt<0||xt===1/0)return;at.setup(k,X,we,W,Ce);let mn,Ze=Ee;if(Ce!==null&&(mn=ee.get(Ce),Ze=Xe,Ze.setIndex(mn)),k.isMesh)X.wireframe===!0?(pe.setLineWidth(X.wireframeLinewidth*Ne()),Ze.setMode(D.LINES)):Ze.setMode(D.TRIANGLES);else if(k.isLine){let Pe=X.linewidth;Pe===void 0&&(Pe=1),pe.setLineWidth(Pe*Ne()),k.isLineSegments?Ze.setMode(D.LINES):k.isLineLoop?Ze.setMode(D.LINE_LOOP):Ze.setMode(D.LINE_STRIP)}else k.isPoints?Ze.setMode(D.POINTS):k.isSprite&&Ze.setMode(D.TRIANGLES);if(k.isBatchedMesh)if(k._multiDrawInstances!==null)Ze.renderMultiDrawInstances(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount,k._multiDrawInstances);else if(Ve.get("WEBGL_multi_draw"))Ze.renderMultiDraw(k._multiDrawStarts,k._multiDrawCounts,k._multiDrawCount);else{const Pe=k._multiDrawStarts,jt=k._multiDrawCounts,Qe=k._multiDrawCount,jn=Ce?ee.get(Ce).bytesPerElement:1,Br=De.get(X).currentProgram.getUniforms();for(let gn=0;gn<Qe;gn++)Br.setValue(D,"_gl_DrawID",gn),Ze.render(Pe[gn]/jn,jt[gn])}else if(k.isInstancedMesh)Ze.renderInstances(tt,xt,k.count);else if(W.isInstancedBufferGeometry){const Pe=W._maxInstanceCount!==void 0?W._maxInstanceCount:1/0,jt=Math.min(W.instanceCount,Pe);Ze.renderInstances(tt,xt,jt)}else Ze.render(tt,xt)};function Ke(T,F,W){T.transparent===!0&&T.side===Ln&&T.forceSinglePass===!1?(T.side=hn,T.needsUpdate=!0,ro(T,F,W),T.side=sr,T.needsUpdate=!0,ro(T,F,W),T.side=Ln):ro(T,F,W)}this.compile=function(T,F,W=null){W===null&&(W=T),g=Ye.get(W),g.init(F),_.push(g),W.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(g.pushLight(k),k.castShadow&&g.pushShadow(k))}),T!==W&&T.traverseVisible(function(k){k.isLight&&k.layers.test(F.layers)&&(g.pushLight(k),k.castShadow&&g.pushShadow(k))}),g.setupLights();const X=new Set;return T.traverse(function(k){if(!(k.isMesh||k.isPoints||k.isLine||k.isSprite))return;const ce=k.material;if(ce)if(Array.isArray(ce))for(let _e=0;_e<ce.length;_e++){const we=ce[_e];Ke(we,W,k),X.add(we)}else Ke(ce,W,k),X.add(ce)}),_.pop(),g=null,X},this.compileAsync=function(T,F,W=null){const X=this.compile(T,F,W);return new Promise(k=>{function ce(){if(X.forEach(function(_e){De.get(_e).currentProgram.isReady()&&X.delete(_e)}),X.size===0){k(T);return}setTimeout(ce,10)}Ve.get("KHR_parallel_shader_compile")!==null?ce():setTimeout(ce,10)})};let nn=null;function li(T){nn&&nn(T)}function _f(){dr.stop()}function vf(){dr.start()}const dr=new Lv;dr.setAnimationLoop(li),typeof self<"u"&&dr.setContext(self),this.setAnimationLoop=function(T){nn=T,K.setAnimationLoop(T),T===null?dr.stop():dr.start()},K.addEventListener("sessionstart",_f),K.addEventListener("sessionend",vf),this.render=function(T,F){if(F!==void 0&&F.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(E===!0)return;if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),K.enabled===!0&&K.isPresenting===!0&&(K.cameraAutoUpdate===!0&&K.updateCamera(F),F=K.getCamera()),T.isScene===!0&&T.onBeforeRender(y,T,F,C),g=Ye.get(T,_.length),g.init(F),_.push(g),R.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Le.setFromProjectionMatrix(R),re=this.localClippingEnabled,$=le.init(this.clippingPlanes,re),x=Se.get(T,d.length),x.init(),d.push(x),K.enabled===!0&&K.isPresenting===!0){const ce=y.xr.getDepthSensingMesh();ce!==null&&_c(ce,F,-1/0,y.sortObjects)}_c(T,F,0,y.sortObjects),x.finish(),y.sortObjects===!0&&x.sort(L,O),be=K.enabled===!1||K.isPresenting===!1||K.hasDepthSensing()===!1,be&&ke.addToRenderList(x,T),this.info.render.frame++,$===!0&&le.beginShadows();const W=g.state.shadowsArray;Me.render(W,T,F),$===!0&&le.endShadows(),this.info.autoReset===!0&&this.info.reset();const X=x.opaque,k=x.transmissive;if(g.setupLights(),F.isArrayCamera){const ce=F.cameras;if(k.length>0)for(let _e=0,we=ce.length;_e<we;_e++){const Ce=ce[_e];yf(X,k,T,Ce)}be&&ke.render(T);for(let _e=0,we=ce.length;_e<we;_e++){const Ce=ce[_e];xf(x,T,Ce,Ce.viewport)}}else k.length>0&&yf(X,k,T,F),be&&ke.render(T),xf(x,T,F);C!==null&&(A.updateMultisampleRenderTarget(C),A.updateRenderTargetMipmap(C)),T.isScene===!0&&T.onAfterRender(y,T,F),at.resetDefaultState(),N=-1,z=null,_.pop(),_.length>0?(g=_[_.length-1],$===!0&&le.setGlobalState(y.clippingPlanes,g.state.camera)):g=null,d.pop(),d.length>0?x=d[d.length-1]:x=null};function _c(T,F,W,X){if(T.visible===!1)return;if(T.layers.test(F.layers)){if(T.isGroup)W=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(F);else if(T.isLight)g.pushLight(T),T.castShadow&&g.pushShadow(T);else if(T.isSprite){if(!T.frustumCulled||Le.intersectsSprite(T)){X&&de.setFromMatrixPosition(T.matrixWorld).applyMatrix4(R);const _e=J.update(T),we=T.material;we.visible&&x.push(T,_e,we,W,de.z,null)}}else if((T.isMesh||T.isLine||T.isPoints)&&(!T.frustumCulled||Le.intersectsObject(T))){const _e=J.update(T),we=T.material;if(X&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),de.copy(T.boundingSphere.center)):(_e.boundingSphere===null&&_e.computeBoundingSphere(),de.copy(_e.boundingSphere.center)),de.applyMatrix4(T.matrixWorld).applyMatrix4(R)),Array.isArray(we)){const Ce=_e.groups;for(let Ie=0,Ue=Ce.length;Ie<Ue;Ie++){const Re=Ce[Ie],tt=we[Re.materialIndex];tt&&tt.visible&&x.push(T,_e,tt,W,de.z,Re)}}else we.visible&&x.push(T,_e,we,W,de.z,null)}}const ce=T.children;for(let _e=0,we=ce.length;_e<we;_e++)_c(ce[_e],F,W,X)}function xf(T,F,W,X){const k=T.opaque,ce=T.transmissive,_e=T.transparent;g.setupLightsView(W),$===!0&&le.setGlobalState(y.clippingPlanes,W),X&&pe.viewport(v.copy(X)),k.length>0&&io(k,F,W),ce.length>0&&io(ce,F,W),_e.length>0&&io(_e,F,W),pe.buffers.depth.setTest(!0),pe.buffers.depth.setMask(!0),pe.buffers.color.setMask(!0),pe.setPolygonOffset(!1)}function yf(T,F,W,X){if((W.isScene===!0?W.overrideMaterial:null)!==null)return;g.state.transmissionRenderTarget[X.id]===void 0&&(g.state.transmissionRenderTarget[X.id]=new Fr(1,1,{generateMipmaps:!0,type:Ve.has("EXT_color_buffer_half_float")||Ve.has("EXT_color_buffer_float")?eo:Ci,minFilter:br,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:Je.workingColorSpace}));const ce=g.state.transmissionRenderTarget[X.id],_e=X.viewport||v;ce.setSize(_e.z,_e.w);const we=y.getRenderTarget();y.setRenderTarget(ce),y.getClearColor(j),q=y.getClearAlpha(),q<1&&y.setClearColor(16777215,.5),y.clear(),be&&ke.render(W);const Ce=y.toneMapping;y.toneMapping=nr;const Ie=X.viewport;if(X.viewport!==void 0&&(X.viewport=void 0),g.setupLightsView(X),$===!0&&le.setGlobalState(y.clippingPlanes,X),io(T,W,X),A.updateMultisampleRenderTarget(ce),A.updateRenderTargetMipmap(ce),Ve.has("WEBGL_multisampled_render_to_texture")===!1){let Ue=!1;for(let Re=0,tt=F.length;Re<tt;Re++){const lt=F[Re],xt=lt.object,mn=lt.geometry,Ze=lt.material,Pe=lt.group;if(Ze.side===Ln&&xt.layers.test(X.layers)){const jt=Ze.side;Ze.side=hn,Ze.needsUpdate=!0,Sf(xt,W,X,mn,Ze,Pe),Ze.side=jt,Ze.needsUpdate=!0,Ue=!0}}Ue===!0&&(A.updateMultisampleRenderTarget(ce),A.updateRenderTargetMipmap(ce))}y.setRenderTarget(we),y.setClearColor(j,q),Ie!==void 0&&(X.viewport=Ie),y.toneMapping=Ce}function io(T,F,W){const X=F.isScene===!0?F.overrideMaterial:null;for(let k=0,ce=T.length;k<ce;k++){const _e=T[k],we=_e.object,Ce=_e.geometry,Ie=X===null?_e.material:X,Ue=_e.group;we.layers.test(W.layers)&&Sf(we,F,W,Ce,Ie,Ue)}}function Sf(T,F,W,X,k,ce){T.onBeforeRender(y,F,W,X,k,ce),T.modelViewMatrix.multiplyMatrices(W.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),k.onBeforeRender(y,F,W,X,T,ce),k.transparent===!0&&k.side===Ln&&k.forceSinglePass===!1?(k.side=hn,k.needsUpdate=!0,y.renderBufferDirect(W,F,X,k,T,ce),k.side=sr,k.needsUpdate=!0,y.renderBufferDirect(W,F,X,k,T,ce),k.side=Ln):y.renderBufferDirect(W,F,X,k,T,ce),T.onAfterRender(y,F,W,X,k,ce)}function ro(T,F,W){F.isScene!==!0&&(F=Te);const X=De.get(T),k=g.state.lights,ce=g.state.shadowsArray,_e=k.state.version,we=Ae.getParameters(T,k.state,ce,F,W),Ce=Ae.getProgramCacheKey(we);let Ie=X.programs;X.environment=T.isMeshStandardMaterial?F.environment:null,X.fog=F.fog,X.envMap=(T.isMeshStandardMaterial?G:w).get(T.envMap||X.environment),X.envMapRotation=X.environment!==null&&T.envMap===null?F.environmentRotation:T.envMapRotation,Ie===void 0&&(T.addEventListener("dispose",$e),Ie=new Map,X.programs=Ie);let Ue=Ie.get(Ce);if(Ue!==void 0){if(X.currentProgram===Ue&&X.lightsStateVersion===_e)return Ef(T,we),Ue}else we.uniforms=Ae.getUniforms(T),T.onBeforeCompile(we,y),Ue=Ae.acquireProgram(we,Ce),Ie.set(Ce,Ue),X.uniforms=we.uniforms;const Re=X.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(Re.clippingPlanes=le.uniform),Ef(T,we),X.needsLights=Zv(T),X.lightsStateVersion=_e,X.needsLights&&(Re.ambientLightColor.value=k.state.ambient,Re.lightProbe.value=k.state.probe,Re.directionalLights.value=k.state.directional,Re.directionalLightShadows.value=k.state.directionalShadow,Re.spotLights.value=k.state.spot,Re.spotLightShadows.value=k.state.spotShadow,Re.rectAreaLights.value=k.state.rectArea,Re.ltc_1.value=k.state.rectAreaLTC1,Re.ltc_2.value=k.state.rectAreaLTC2,Re.pointLights.value=k.state.point,Re.pointLightShadows.value=k.state.pointShadow,Re.hemisphereLights.value=k.state.hemi,Re.directionalShadowMap.value=k.state.directionalShadowMap,Re.directionalShadowMatrix.value=k.state.directionalShadowMatrix,Re.spotShadowMap.value=k.state.spotShadowMap,Re.spotLightMatrix.value=k.state.spotLightMatrix,Re.spotLightMap.value=k.state.spotLightMap,Re.pointShadowMap.value=k.state.pointShadowMap,Re.pointShadowMatrix.value=k.state.pointShadowMatrix),X.currentProgram=Ue,X.uniformsList=null,Ue}function Mf(T){if(T.uniformsList===null){const F=T.currentProgram.getUniforms();T.uniformsList=ml.seqWithValue(F.seq,T.uniforms)}return T.uniformsList}function Ef(T,F){const W=De.get(T);W.outputColorSpace=F.outputColorSpace,W.batching=F.batching,W.batchingColor=F.batchingColor,W.instancing=F.instancing,W.instancingColor=F.instancingColor,W.instancingMorph=F.instancingMorph,W.skinning=F.skinning,W.morphTargets=F.morphTargets,W.morphNormals=F.morphNormals,W.morphColors=F.morphColors,W.morphTargetsCount=F.morphTargetsCount,W.numClippingPlanes=F.numClippingPlanes,W.numIntersection=F.numClipIntersection,W.vertexAlphas=F.vertexAlphas,W.vertexTangents=F.vertexTangents,W.toneMapping=F.toneMapping}function Yv(T,F,W,X,k){F.isScene!==!0&&(F=Te),A.resetTextureUnits();const ce=F.fog,_e=X.isMeshStandardMaterial?F.environment:null,we=C===null?y.outputColorSpace:C.isXRRenderTarget===!0?C.texture.colorSpace:ur,Ce=(X.isMeshStandardMaterial?G:w).get(X.envMap||_e),Ie=X.vertexColors===!0&&!!W.attributes.color&&W.attributes.color.itemSize===4,Ue=!!W.attributes.tangent&&(!!X.normalMap||X.anisotropy>0),Re=!!W.morphAttributes.position,tt=!!W.morphAttributes.normal,lt=!!W.morphAttributes.color;let xt=nr;X.toneMapped&&(C===null||C.isXRRenderTarget===!0)&&(xt=y.toneMapping);const mn=W.morphAttributes.position||W.morphAttributes.normal||W.morphAttributes.color,Ze=mn!==void 0?mn.length:0,Pe=De.get(X),jt=g.state.lights;if($===!0&&(re===!0||T!==z)){const An=T===z&&X.id===N;le.setState(X,T,An)}let Qe=!1;X.version===Pe.__version?(Pe.needsLights&&Pe.lightsStateVersion!==jt.state.version||Pe.outputColorSpace!==we||k.isBatchedMesh&&Pe.batching===!1||!k.isBatchedMesh&&Pe.batching===!0||k.isBatchedMesh&&Pe.batchingColor===!0&&k.colorTexture===null||k.isBatchedMesh&&Pe.batchingColor===!1&&k.colorTexture!==null||k.isInstancedMesh&&Pe.instancing===!1||!k.isInstancedMesh&&Pe.instancing===!0||k.isSkinnedMesh&&Pe.skinning===!1||!k.isSkinnedMesh&&Pe.skinning===!0||k.isInstancedMesh&&Pe.instancingColor===!0&&k.instanceColor===null||k.isInstancedMesh&&Pe.instancingColor===!1&&k.instanceColor!==null||k.isInstancedMesh&&Pe.instancingMorph===!0&&k.morphTexture===null||k.isInstancedMesh&&Pe.instancingMorph===!1&&k.morphTexture!==null||Pe.envMap!==Ce||X.fog===!0&&Pe.fog!==ce||Pe.numClippingPlanes!==void 0&&(Pe.numClippingPlanes!==le.numPlanes||Pe.numIntersection!==le.numIntersection)||Pe.vertexAlphas!==Ie||Pe.vertexTangents!==Ue||Pe.morphTargets!==Re||Pe.morphNormals!==tt||Pe.morphColors!==lt||Pe.toneMapping!==xt||Pe.morphTargetsCount!==Ze)&&(Qe=!0):(Qe=!0,Pe.__version=X.version);let jn=Pe.currentProgram;Qe===!0&&(jn=ro(X,F,k));let Br=!1,gn=!1,vc=!1;const Mt=jn.getUniforms(),Ri=Pe.uniforms;if(pe.useProgram(jn.program)&&(Br=!0,gn=!0,vc=!0),X.id!==N&&(N=X.id,gn=!0),Br||z!==T){We.reverseDepthBuffer?(ue.copy(T.projectionMatrix),RS(ue),PS(ue),Mt.setValue(D,"projectionMatrix",ue)):Mt.setValue(D,"projectionMatrix",T.projectionMatrix),Mt.setValue(D,"viewMatrix",T.matrixWorldInverse);const An=Mt.map.cameraPosition;An!==void 0&&An.setValue(D,te.setFromMatrixPosition(T.matrixWorld)),We.logarithmicDepthBuffer&&Mt.setValue(D,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(X.isMeshPhongMaterial||X.isMeshToonMaterial||X.isMeshLambertMaterial||X.isMeshBasicMaterial||X.isMeshStandardMaterial||X.isShaderMaterial)&&Mt.setValue(D,"isOrthographic",T.isOrthographicCamera===!0),z!==T&&(z=T,gn=!0,vc=!0)}if(k.isSkinnedMesh){Mt.setOptional(D,k,"bindMatrix"),Mt.setOptional(D,k,"bindMatrixInverse");const An=k.skeleton;An&&(An.boneTexture===null&&An.computeBoneTexture(),Mt.setValue(D,"boneTexture",An.boneTexture,A))}k.isBatchedMesh&&(Mt.setOptional(D,k,"batchingTexture"),Mt.setValue(D,"batchingTexture",k._matricesTexture,A),Mt.setOptional(D,k,"batchingIdTexture"),Mt.setValue(D,"batchingIdTexture",k._indirectTexture,A),Mt.setOptional(D,k,"batchingColorTexture"),k._colorsTexture!==null&&Mt.setValue(D,"batchingColorTexture",k._colorsTexture,A));const xc=W.morphAttributes;if((xc.position!==void 0||xc.normal!==void 0||xc.color!==void 0)&&Oe.update(k,W,jn),(gn||Pe.receiveShadow!==k.receiveShadow)&&(Pe.receiveShadow=k.receiveShadow,Mt.setValue(D,"receiveShadow",k.receiveShadow)),X.isMeshGouraudMaterial&&X.envMap!==null&&(Ri.envMap.value=Ce,Ri.flipEnvMap.value=Ce.isCubeTexture&&Ce.isRenderTargetTexture===!1?-1:1),X.isMeshStandardMaterial&&X.envMap===null&&F.environment!==null&&(Ri.envMapIntensity.value=F.environmentIntensity),gn&&(Mt.setValue(D,"toneMappingExposure",y.toneMappingExposure),Pe.needsLights&&Kv(Ri,vc),ce&&X.fog===!0&&me.refreshFogUniforms(Ri,ce),me.refreshMaterialUniforms(Ri,X,Y,H,g.state.transmissionRenderTarget[T.id]),ml.upload(D,Mf(Pe),Ri,A)),X.isShaderMaterial&&X.uniformsNeedUpdate===!0&&(ml.upload(D,Mf(Pe),Ri,A),X.uniformsNeedUpdate=!1),X.isSpriteMaterial&&Mt.setValue(D,"center",k.center),Mt.setValue(D,"modelViewMatrix",k.modelViewMatrix),Mt.setValue(D,"normalMatrix",k.normalMatrix),Mt.setValue(D,"modelMatrix",k.matrixWorld),X.isShaderMaterial||X.isRawShaderMaterial){const An=X.uniformsGroups;for(let yc=0,Qv=An.length;yc<Qv;yc++){const wf=An[yc];U.update(wf,jn),U.bind(wf,jn)}}return jn}function Kv(T,F){T.ambientLightColor.needsUpdate=F,T.lightProbe.needsUpdate=F,T.directionalLights.needsUpdate=F,T.directionalLightShadows.needsUpdate=F,T.pointLights.needsUpdate=F,T.pointLightShadows.needsUpdate=F,T.spotLights.needsUpdate=F,T.spotLightShadows.needsUpdate=F,T.rectAreaLights.needsUpdate=F,T.hemisphereLights.needsUpdate=F}function Zv(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return b},this.getRenderTarget=function(){return C},this.setRenderTargetTextures=function(T,F,W){De.get(T.texture).__webglTexture=F,De.get(T.depthTexture).__webglTexture=W;const X=De.get(T);X.__hasExternalTextures=!0,X.__autoAllocateDepthBuffer=W===void 0,X.__autoAllocateDepthBuffer||Ve.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),X.__useRenderToTexture=!1)},this.setRenderTargetFramebuffer=function(T,F){const W=De.get(T);W.__webglFramebuffer=F,W.__useDefaultFramebuffer=F===void 0},this.setRenderTarget=function(T,F=0,W=0){C=T,P=F,b=W;let X=!0,k=null,ce=!1,_e=!1;if(T){const Ce=De.get(T);if(Ce.__useDefaultFramebuffer!==void 0)pe.bindFramebuffer(D.FRAMEBUFFER,null),X=!1;else if(Ce.__webglFramebuffer===void 0)A.setupRenderTarget(T);else if(Ce.__hasExternalTextures)A.rebindTextures(T,De.get(T.texture).__webglTexture,De.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Re=T.depthTexture;if(Ce.__boundDepthTexture!==Re){if(Re!==null&&De.has(Re)&&(T.width!==Re.image.width||T.height!==Re.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");A.setupDepthRenderbuffer(T)}}const Ie=T.texture;(Ie.isData3DTexture||Ie.isDataArrayTexture||Ie.isCompressedArrayTexture)&&(_e=!0);const Ue=De.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(Ue[F])?k=Ue[F][W]:k=Ue[F],ce=!0):T.samples>0&&A.useMultisampledRTT(T)===!1?k=De.get(T).__webglMultisampledFramebuffer:Array.isArray(Ue)?k=Ue[W]:k=Ue,v.copy(T.viewport),M.copy(T.scissor),I=T.scissorTest}else v.copy(V).multiplyScalar(Y).floor(),M.copy(se).multiplyScalar(Y).floor(),I=fe;if(pe.bindFramebuffer(D.FRAMEBUFFER,k)&&X&&pe.drawBuffers(T,k),pe.viewport(v),pe.scissor(M),pe.setScissorTest(I),ce){const Ce=De.get(T.texture);D.framebufferTexture2D(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,D.TEXTURE_CUBE_MAP_POSITIVE_X+F,Ce.__webglTexture,W)}else if(_e){const Ce=De.get(T.texture),Ie=F||0;D.framebufferTextureLayer(D.FRAMEBUFFER,D.COLOR_ATTACHMENT0,Ce.__webglTexture,W||0,Ie)}N=-1},this.readRenderTargetPixels=function(T,F,W,X,k,ce,_e){if(!(T&&T.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let we=De.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&_e!==void 0&&(we=we[_e]),we){pe.bindFramebuffer(D.FRAMEBUFFER,we);try{const Ce=T.texture,Ie=Ce.format,Ue=Ce.type;if(!We.textureFormatReadable(Ie)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!We.textureTypeReadable(Ue)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=T.width-X&&W>=0&&W<=T.height-k&&D.readPixels(F,W,X,k,je.convert(Ie),je.convert(Ue),ce)}finally{const Ce=C!==null?De.get(C).__webglFramebuffer:null;pe.bindFramebuffer(D.FRAMEBUFFER,Ce)}}},this.readRenderTargetPixelsAsync=async function(T,F,W,X,k,ce,_e){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let we=De.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&_e!==void 0&&(we=we[_e]),we){const Ce=T.texture,Ie=Ce.format,Ue=Ce.type;if(!We.textureFormatReadable(Ie))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!We.textureTypeReadable(Ue))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");if(F>=0&&F<=T.width-X&&W>=0&&W<=T.height-k){pe.bindFramebuffer(D.FRAMEBUFFER,we);const Re=D.createBuffer();D.bindBuffer(D.PIXEL_PACK_BUFFER,Re),D.bufferData(D.PIXEL_PACK_BUFFER,ce.byteLength,D.STREAM_READ),D.readPixels(F,W,X,k,je.convert(Ie),je.convert(Ue),0);const tt=C!==null?De.get(C).__webglFramebuffer:null;pe.bindFramebuffer(D.FRAMEBUFFER,tt);const lt=D.fenceSync(D.SYNC_GPU_COMMANDS_COMPLETE,0);return D.flush(),await AS(D,lt,4),D.bindBuffer(D.PIXEL_PACK_BUFFER,Re),D.getBufferSubData(D.PIXEL_PACK_BUFFER,0,ce),D.deleteBuffer(Re),D.deleteSync(lt),ce}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")}},this.copyFramebufferToTexture=function(T,F=null,W=0){T.isTexture!==!0&&(pl("WebGLRenderer: copyFramebufferToTexture function signature has changed."),F=arguments[0]||null,T=arguments[1]);const X=Math.pow(2,-W),k=Math.floor(T.image.width*X),ce=Math.floor(T.image.height*X),_e=F!==null?F.x:0,we=F!==null?F.y:0;A.setTexture2D(T,0),D.copyTexSubImage2D(D.TEXTURE_2D,W,0,0,_e,we,k,ce),pe.unbindTexture()},this.copyTextureToTexture=function(T,F,W=null,X=null,k=0){T.isTexture!==!0&&(pl("WebGLRenderer: copyTextureToTexture function signature has changed."),X=arguments[0]||null,T=arguments[1],F=arguments[2],k=arguments[3]||0,W=null);let ce,_e,we,Ce,Ie,Ue;W!==null?(ce=W.max.x-W.min.x,_e=W.max.y-W.min.y,we=W.min.x,Ce=W.min.y):(ce=T.image.width,_e=T.image.height,we=0,Ce=0),X!==null?(Ie=X.x,Ue=X.y):(Ie=0,Ue=0);const Re=je.convert(F.format),tt=je.convert(F.type);A.setTexture2D(F,0),D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,F.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,F.unpackAlignment);const lt=D.getParameter(D.UNPACK_ROW_LENGTH),xt=D.getParameter(D.UNPACK_IMAGE_HEIGHT),mn=D.getParameter(D.UNPACK_SKIP_PIXELS),Ze=D.getParameter(D.UNPACK_SKIP_ROWS),Pe=D.getParameter(D.UNPACK_SKIP_IMAGES),jt=T.isCompressedTexture?T.mipmaps[k]:T.image;D.pixelStorei(D.UNPACK_ROW_LENGTH,jt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,jt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,we),D.pixelStorei(D.UNPACK_SKIP_ROWS,Ce),T.isDataTexture?D.texSubImage2D(D.TEXTURE_2D,k,Ie,Ue,ce,_e,Re,tt,jt.data):T.isCompressedTexture?D.compressedTexSubImage2D(D.TEXTURE_2D,k,Ie,Ue,jt.width,jt.height,Re,jt.data):D.texSubImage2D(D.TEXTURE_2D,k,Ie,Ue,ce,_e,Re,tt,jt),D.pixelStorei(D.UNPACK_ROW_LENGTH,lt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,xt),D.pixelStorei(D.UNPACK_SKIP_PIXELS,mn),D.pixelStorei(D.UNPACK_SKIP_ROWS,Ze),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Pe),k===0&&F.generateMipmaps&&D.generateMipmap(D.TEXTURE_2D),pe.unbindTexture()},this.copyTextureToTexture3D=function(T,F,W=null,X=null,k=0){T.isTexture!==!0&&(pl("WebGLRenderer: copyTextureToTexture3D function signature has changed."),W=arguments[0]||null,X=arguments[1]||null,T=arguments[2],F=arguments[3],k=arguments[4]||0);let ce,_e,we,Ce,Ie,Ue,Re,tt,lt;const xt=T.isCompressedTexture?T.mipmaps[k]:T.image;W!==null?(ce=W.max.x-W.min.x,_e=W.max.y-W.min.y,we=W.max.z-W.min.z,Ce=W.min.x,Ie=W.min.y,Ue=W.min.z):(ce=xt.width,_e=xt.height,we=xt.depth,Ce=0,Ie=0,Ue=0),X!==null?(Re=X.x,tt=X.y,lt=X.z):(Re=0,tt=0,lt=0);const mn=je.convert(F.format),Ze=je.convert(F.type);let Pe;if(F.isData3DTexture)A.setTexture3D(F,0),Pe=D.TEXTURE_3D;else if(F.isDataArrayTexture||F.isCompressedArrayTexture)A.setTexture2DArray(F,0),Pe=D.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}D.pixelStorei(D.UNPACK_FLIP_Y_WEBGL,F.flipY),D.pixelStorei(D.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),D.pixelStorei(D.UNPACK_ALIGNMENT,F.unpackAlignment);const jt=D.getParameter(D.UNPACK_ROW_LENGTH),Qe=D.getParameter(D.UNPACK_IMAGE_HEIGHT),jn=D.getParameter(D.UNPACK_SKIP_PIXELS),Br=D.getParameter(D.UNPACK_SKIP_ROWS),gn=D.getParameter(D.UNPACK_SKIP_IMAGES);D.pixelStorei(D.UNPACK_ROW_LENGTH,xt.width),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,xt.height),D.pixelStorei(D.UNPACK_SKIP_PIXELS,Ce),D.pixelStorei(D.UNPACK_SKIP_ROWS,Ie),D.pixelStorei(D.UNPACK_SKIP_IMAGES,Ue),T.isDataTexture||T.isData3DTexture?D.texSubImage3D(Pe,k,Re,tt,lt,ce,_e,we,mn,Ze,xt.data):F.isCompressedArrayTexture?D.compressedTexSubImage3D(Pe,k,Re,tt,lt,ce,_e,we,mn,xt.data):D.texSubImage3D(Pe,k,Re,tt,lt,ce,_e,we,mn,Ze,xt),D.pixelStorei(D.UNPACK_ROW_LENGTH,jt),D.pixelStorei(D.UNPACK_IMAGE_HEIGHT,Qe),D.pixelStorei(D.UNPACK_SKIP_PIXELS,jn),D.pixelStorei(D.UNPACK_SKIP_ROWS,Br),D.pixelStorei(D.UNPACK_SKIP_IMAGES,gn),k===0&&F.generateMipmaps&&D.generateMipmap(Pe),pe.unbindTexture()},this.initRenderTarget=function(T){De.get(T).__webglFramebuffer===void 0&&A.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?A.setTextureCube(T,0):T.isData3DTexture?A.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?A.setTexture2DArray(T,0):A.setTexture2D(T,0),pe.unbindTexture()},this.resetState=function(){P=0,b=0,C=null,pe.reset(),at.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return yi}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const n=this.getContext();n.drawingBufferColorSpace=e===uf?"display-p3":"srgb",n.unpackColorSpace=Je.workingColorSpace===hc?"display-p3":"srgb"}}class zv extends Ot{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new oi,this.environmentIntensity=1,this.environmentRotation=new oi,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,n){return super.copy(e,n),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const n=super.toJSON(e);return this.fog!==null&&(n.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(n.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(n.object.backgroundIntensity=this.backgroundIntensity),n.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(n.object.environmentIntensity=this.environmentIntensity),n.object.environmentRotation=this.environmentRotation.toArray(),n}}class pf extends Ws{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new He(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}}const Xl=new B,$l=new B,Lm=new _t,ha=new df,Go=new fc,Eu=new B,Dm=new B;class zT extends Ot{constructor(e=new bn,n=new pf){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=n,this.updateMorphTargets()}copy(e,n){return super.copy(e,n),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[0];for(let r=1,s=n.count;r<s;r++)Xl.fromBufferAttribute(n,r-1),$l.fromBufferAttribute(n,r),i[r]=i[r-1],i[r]+=Xl.distanceTo($l);e.setAttribute("lineDistance",new Lt(i,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,n){const i=this.geometry,r=this.matrixWorld,s=e.params.Line.threshold,a=i.drawRange;if(i.boundingSphere===null&&i.computeBoundingSphere(),Go.copy(i.boundingSphere),Go.applyMatrix4(r),Go.radius+=s,e.ray.intersectsSphere(Go)===!1)return;Lm.copy(r).invert(),ha.copy(e.ray).applyMatrix4(Lm);const o=s/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,h=this.isLineSegments?2:1,u=i.index,p=i.attributes.position;if(u!==null){const m=Math.max(0,a.start),S=Math.min(u.count,a.start+a.count);for(let x=m,g=S-1;x<g;x+=h){const d=u.getX(x),_=u.getX(x+1),y=Wo(this,e,ha,c,d,_);y&&n.push(y)}if(this.isLineLoop){const x=u.getX(S-1),g=u.getX(m),d=Wo(this,e,ha,c,x,g);d&&n.push(d)}}else{const m=Math.max(0,a.start),S=Math.min(p.count,a.start+a.count);for(let x=m,g=S-1;x<g;x+=h){const d=Wo(this,e,ha,c,x,x+1);d&&n.push(d)}if(this.isLineLoop){const x=Wo(this,e,ha,c,S-1,m);x&&n.push(x)}}}updateMorphTargets(){const n=this.geometry.morphAttributes,i=Object.keys(n);if(i.length>0){const r=n[i[0]];if(r!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,a=r.length;s<a;s++){const o=r[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=s}}}}}function Wo(t,e,n,i,r,s){const a=t.geometry.attributes.position;if(Xl.fromBufferAttribute(a,r),$l.fromBufferAttribute(a,s),n.distanceSqToSegment(Xl,$l,Eu,Dm)>i)return;Eu.applyMatrix4(t.matrixWorld);const c=e.ray.origin.distanceTo(Eu);if(!(c<e.near||c>e.far))return{distance:c,point:Dm.clone().applyMatrix4(t.matrixWorld),index:r,face:null,faceIndex:null,barycoord:null,object:t}}const Im=new B,Um=new B;class Bv extends zT{constructor(e,n){super(e,n),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const e=this.geometry;if(e.index===null){const n=e.attributes.position,i=[];for(let r=0,s=n.count;r<s;r+=2)Im.fromBufferAttribute(n,r),Um.fromBufferAttribute(n,r+1),i[r]=r===0?0:i[r-1],i[r+1]=i[r]+Im.distanceTo(Um);e.setAttribute("lineDistance",new Lt(i,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class mf extends bn{constructor(e=[new Fe(0,-.5),new Fe(.5,0),new Fe(0,.5)],n=12,i=0,r=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:e,segments:n,phiStart:i,phiLength:r},n=Math.floor(n),r=qt(r,0,Math.PI*2);const s=[],a=[],o=[],c=[],h=[],u=1/n,f=new B,p=new Fe,m=new B,S=new B,x=new B;let g=0,d=0;for(let _=0;_<=e.length-1;_++)switch(_){case 0:g=e[_+1].x-e[_].x,d=e[_+1].y-e[_].y,m.x=d*1,m.y=-g,m.z=d*0,x.copy(m),m.normalize(),c.push(m.x,m.y,m.z);break;case e.length-1:c.push(x.x,x.y,x.z);break;default:g=e[_+1].x-e[_].x,d=e[_+1].y-e[_].y,m.x=d*1,m.y=-g,m.z=d*0,S.copy(m),m.x+=x.x,m.y+=x.y,m.z+=x.z,m.normalize(),c.push(m.x,m.y,m.z),x.copy(S)}for(let _=0;_<=n;_++){const y=i+_*u*r,E=Math.sin(y),P=Math.cos(y);for(let b=0;b<=e.length-1;b++){f.x=e[b].x*E,f.y=e[b].y,f.z=e[b].x*P,a.push(f.x,f.y,f.z),p.x=_/n,p.y=b/(e.length-1),o.push(p.x,p.y);const C=c[3*b+0]*E,N=c[3*b+1],z=c[3*b+0]*P;h.push(C,N,z)}}for(let _=0;_<n;_++)for(let y=0;y<e.length-1;y++){const E=y+_*e.length,P=E,b=E+e.length,C=E+e.length+1,N=E+1;s.push(P,b,N),s.push(C,N,b)}this.setIndex(s),this.setAttribute("position",new Lt(a,3)),this.setAttribute("uv",new Lt(o,2)),this.setAttribute("normal",new Lt(h,3))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new mf(e.points,e.segments,e.phiStart,e.phiLength)}}class ql extends Ws{constructor(e){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new He(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new He(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=xv,this.normalScale=new Fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oi,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class Hv extends Ot{constructor(e,n=1){super(),this.isLight=!0,this.type="Light",this.color=new He(e),this.intensity=n}dispose(){}copy(e,n){return super.copy(e,n),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const n=super.toJSON(e);return n.object.color=this.color.getHex(),n.object.intensity=this.intensity,this.groundColor!==void 0&&(n.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(n.object.distance=this.distance),this.angle!==void 0&&(n.object.angle=this.angle),this.decay!==void 0&&(n.object.decay=this.decay),this.penumbra!==void 0&&(n.object.penumbra=this.penumbra),this.shadow!==void 0&&(n.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(n.object.target=this.target.uuid),n}}class Vv extends Hv{constructor(e,n,i){super(e,i),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.groundColor=new He(n)}copy(e,n){return super.copy(e,n),this.groundColor.copy(e.groundColor),this}}const wu=new _t,Fm=new B,km=new B;class BT{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Fe(512,512),this.map=null,this.mapPass=null,this.matrix=new _t,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new hf,this._frameExtents=new Fe(1,1),this._viewportCount=1,this._viewports=[new St(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const n=this.camera,i=this.matrix;Fm.setFromMatrixPosition(e.matrixWorld),n.position.copy(Fm),km.setFromMatrixPosition(e.target.matrixWorld),n.lookAt(km),n.updateMatrixWorld(),wu.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(wu),i.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),i.multiply(wu)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class HT extends BT{constructor(){super(new Dv(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Gv extends Hv{constructor(e,n){super(e,n),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ot.DEFAULT_UP),this.updateMatrix(),this.target=new Ot,this.shadow=new HT}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Om{constructor(e=1,n=0,i=0){return this.radius=e,this.phi=n,this.theta=i,this}set(e,n,i){return this.radius=e,this.phi=n,this.theta=i,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,n,i){return this.radius=Math.sqrt(e*e+n*n+i*i),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,i),this.phi=Math.acos(qt(n/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class VT extends Bv{constructor(e=10,n=10,i=4473924,r=8947848){i=new He(i),r=new He(r);const s=n/2,a=e/n,o=e/2,c=[],h=[];for(let p=0,m=0,S=-o;p<=n;p++,S+=a){c.push(-o,0,S,o,0,S),c.push(S,0,-o,S,0,o);const x=p===s?i:r;x.toArray(h,m),m+=3,x.toArray(h,m),m+=3,x.toArray(h,m),m+=3,x.toArray(h,m),m+=3}const u=new bn;u.setAttribute("position",new Lt(c,3)),u.setAttribute("color",new Lt(h,3));const f=new pf({vertexColors:!0,toneMapped:!1});super(u,f),this.type="GridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class GT extends Bv{constructor(e=10,n=16,i=8,r=64,s=4473924,a=8947848){s=new He(s),a=new He(a);const o=[],c=[];if(n>1)for(let f=0;f<n;f++){const p=f/n*(Math.PI*2),m=Math.sin(p)*e,S=Math.cos(p)*e;o.push(0,0,0),o.push(m,0,S);const x=f&1?s:a;c.push(x.r,x.g,x.b),c.push(x.r,x.g,x.b)}for(let f=0;f<i;f++){const p=f&1?s:a,m=e-e/i*f;for(let S=0;S<r;S++){let x=S/r*(Math.PI*2),g=Math.sin(x)*m,d=Math.cos(x)*m;o.push(g,0,d),c.push(p.r,p.g,p.b),x=(S+1)/r*(Math.PI*2),g=Math.sin(x)*m,d=Math.cos(x)*m,o.push(g,0,d),c.push(p.r,p.g,p.b)}}const h=new bn;h.setAttribute("position",new Lt(o,3)),h.setAttribute("color",new Lt(c,3));const u=new pf({vertexColors:!0,toneMapped:!1});super(h,u),this.type="PolarGridHelper"}dispose(){this.geometry.dispose(),this.material.dispose()}}class WT extends zr{constructor(e,n=null){super(),this.object=e,this.domElement=n,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(){}disconnect(){}dispose(){}update(){}}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:nf}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=nf);const jm={type:"change"},gf={type:"start"},Wv={type:"end"},Xo=new df,zm=new zi,XT=Math.cos(70*CS.DEG2RAD),Rt=new B,sn=2*Math.PI,rt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Tu=1e-6;class Xv extends WT{constructor(e,n=null){super(e,n),this.state=rt.NONE,this.enabled=!0,this.target=new B,this.cursor=new B,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Ts.ROTATE,MIDDLE:Ts.DOLLY,RIGHT:Ts.PAN},this.touches={ONE:gs.ROTATE,TWO:gs.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new B,this._lastQuaternion=new kr,this._lastTargetPosition=new B,this._quat=new kr().setFromUnitVectors(e.up,new B(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new Om,this._sphericalDelta=new Om,this._scale=1,this._panOffset=new B,this._rotateStart=new Fe,this._rotateEnd=new Fe,this._rotateDelta=new Fe,this._panStart=new Fe,this._panEnd=new Fe,this._panDelta=new Fe,this._dollyStart=new Fe,this._dollyEnd=new Fe,this._dollyDelta=new Fe,this._dollyDirection=new B,this._mouse=new Fe,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=qT.bind(this),this._onPointerDown=$T.bind(this),this._onPointerUp=YT.bind(this),this._onContextMenu=nC.bind(this),this._onMouseWheel=QT.bind(this),this._onKeyDown=JT.bind(this),this._onTouchStart=eC.bind(this),this._onTouchMove=tC.bind(this),this._onMouseDown=KT.bind(this),this._onMouseMove=ZT.bind(this),this._interceptControlDown=iC.bind(this),this._interceptControlUp=rC.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(jm),this.update(),this.state=rt.NONE}update(e=null){const n=this.object.position;Rt.copy(n).sub(this.target),Rt.applyQuaternion(this._quat),this._spherical.setFromVector3(Rt),this.autoRotate&&this.state===rt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,r=this.maxAzimuthAngle;isFinite(i)&&isFinite(r)&&(i<-Math.PI?i+=sn:i>Math.PI&&(i-=sn),r<-Math.PI?r+=sn:r>Math.PI&&(r-=sn),i<=r?this._spherical.theta=Math.max(i,Math.min(r,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+r)/2?Math.max(i,this._spherical.theta):Math.min(r,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let s=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),s=a!=this._spherical.radius}if(Rt.setFromSpherical(this._spherical),Rt.applyQuaternion(this._quatInverse),n.copy(this.target).add(Rt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Rt.length();a=this._clampDistance(o*this._scale);const c=o-a;this.object.position.addScaledVector(this._dollyDirection,c),this.object.updateMatrixWorld(),s=!!c}else if(this.object.isOrthographicCamera){const o=new B(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const c=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),s=c!==this.object.zoom;const h=new B(this._mouse.x,this._mouse.y,0);h.unproject(this.object),this.object.position.sub(h).add(o),this.object.updateMatrixWorld(),a=Rt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Xo.origin.copy(this.object.position),Xo.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Xo.direction))<XT?this.object.lookAt(this.target):(zm.setFromNormalAndCoplanarPoint(this.object.up,this.target),Xo.intersectPlane(zm,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),s=!0)}return this._scale=1,this._performCursorZoom=!1,s||this._lastPosition.distanceToSquared(this.object.position)>Tu||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Tu||this._lastTargetPosition.distanceToSquared(this.target)>Tu?(this.dispatchEvent(jm),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?sn/60*this.autoRotateSpeed*e:sn/60/60*this.autoRotateSpeed}_getZoomScale(e){const n=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*n)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,n){Rt.setFromMatrixColumn(n,0),Rt.multiplyScalar(-e),this._panOffset.add(Rt)}_panUp(e,n){this.screenSpacePanning===!0?Rt.setFromMatrixColumn(n,1):(Rt.setFromMatrixColumn(n,0),Rt.crossVectors(this.object.up,Rt)),Rt.multiplyScalar(e),this._panOffset.add(Rt)}_pan(e,n){const i=this.domElement;if(this.object.isPerspectiveCamera){const r=this.object.position;Rt.copy(r).sub(this.target);let s=Rt.length();s*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*s/i.clientHeight,this.object.matrix),this._panUp(2*n*s/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(n*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,n){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),r=e-i.left,s=n-i.top,a=i.width,o=i.height;this._mouse.x=r/a*2-1,this._mouse.y=-(s/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(sn*this._rotateDelta.x/n.clientHeight),this._rotateUp(sn*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let n=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(sn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),n=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateUp(-sn*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),n=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(sn*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),n=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this._rotateLeft(-sn*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),n=!0;break}n&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateStart.set(i,r)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._panStart.set(i,r)}}_handleTouchStartDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,r=e.pageY-n.y,s=Math.sqrt(i*i+r*r);this._dollyStart.set(0,s)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const i=this._getSecondPointerPosition(e),r=.5*(e.pageX+i.x),s=.5*(e.pageY+i.y);this._rotateEnd.set(r,s)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const n=this.domElement;this._rotateLeft(sn*this._rotateDelta.x/n.clientHeight),this._rotateUp(sn*this._rotateDelta.y/n.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._panEnd.set(i,r)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const n=this._getSecondPointerPosition(e),i=e.pageX-n.x,r=e.pageY-n.y,s=Math.sqrt(i*i+r*r);this._dollyEnd.set(0,s),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(e.pageX+n.x)*.5,o=(e.pageY+n.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId){this._pointers.splice(n,1);return}}_isTrackingPointer(e){for(let n=0;n<this._pointers.length;n++)if(this._pointers[n]==e.pointerId)return!0;return!1}_trackPointer(e){let n=this._pointerPositions[e.pointerId];n===void 0&&(n=new Fe,this._pointerPositions[e.pointerId]=n),n.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const n=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[n]}_customWheelEvent(e){const n=e.deltaMode,i={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(n){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function $T(t){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(t.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(t)&&(this._addPointer(t),t.pointerType==="touch"?this._onTouchStart(t):this._onMouseDown(t)))}function qT(t){this.enabled!==!1&&(t.pointerType==="touch"?this._onTouchMove(t):this._onMouseMove(t))}function YT(t){switch(this._removePointer(t),this._pointers.length){case 0:this.domElement.releasePointerCapture(t.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Wv),this.state=rt.NONE;break;case 1:const e=this._pointers[0],n=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:n.x,pageY:n.y});break}}function KT(t){let e;switch(t.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Ts.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(t),this.state=rt.DOLLY;break;case Ts.ROTATE:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=rt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=rt.ROTATE}break;case Ts.PAN:if(t.ctrlKey||t.metaKey||t.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(t),this.state=rt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(t),this.state=rt.PAN}break;default:this.state=rt.NONE}this.state!==rt.NONE&&this.dispatchEvent(gf)}function ZT(t){switch(this.state){case rt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(t);break;case rt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(t);break;case rt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(t);break}}function QT(t){this.enabled===!1||this.enableZoom===!1||this.state!==rt.NONE||(t.preventDefault(),this.dispatchEvent(gf),this._handleMouseWheel(this._customWheelEvent(t)),this.dispatchEvent(Wv))}function JT(t){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(t)}function eC(t){switch(this._trackPointer(t),this._pointers.length){case 1:switch(this.touches.ONE){case gs.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(t),this.state=rt.TOUCH_ROTATE;break;case gs.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(t),this.state=rt.TOUCH_PAN;break;default:this.state=rt.NONE}break;case 2:switch(this.touches.TWO){case gs.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(t),this.state=rt.TOUCH_DOLLY_PAN;break;case gs.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(t),this.state=rt.TOUCH_DOLLY_ROTATE;break;default:this.state=rt.NONE}break;default:this.state=rt.NONE}this.state!==rt.NONE&&this.dispatchEvent(gf)}function tC(t){switch(this._trackPointer(t),this.state){case rt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(t),this.update();break;case rt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(t),this.update();break;case rt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(t),this.update();break;case rt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(t),this.update();break;default:this.state=rt.NONE}}function nC(t){this.enabled!==!1&&t.preventDefault()}function iC(t){t.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function rC(t){t.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}const Sa=[[.19,.07,.6],[.07,.45,.9],[.1,.75,.8],[.35,.85,.35],[.98,.8,.15],[.9,.2,.15]],$v=t=>{const e=Math.min(Math.max(t,0),1)*(Sa.length-1),n=Math.min(Math.floor(e),Sa.length-2),i=e-n;return Sa[n].map((r,s)=>r+(Sa[n+1][s]-r)*i)},sh=[["von_mises_mpa","von Mises (MPa)"],["hoop_mpa","Hoop σθ (MPa)"],["radial_mpa","Radial σr (MPa)"],["axial_mpa","Axial σz (MPa)"],["disp_um","Displacement (µm)"],["ur_um","Radial growth (µm)"]];function sC(t,e){const n=t.nodes_mm,i=t.elements,r=t.cases[e.caseName],s=r[e.field],a=Math.min(...s),o=Math.max(...s),c=n.map(([g,d],_)=>[(g+e.scale*r.ur_um[_]/1e3)/1e3,(d+e.scale*r.uz_um[_]/1e3)/1e3]),h=e.cut?1.5*Math.PI:2*Math.PI,u=72,f=[],p=[],m=(g,d,_,y)=>{f.push(g*Math.cos(_),d,g*Math.sin(_)),p.push(...$v((y-a)/(o-a||1)))},S=new Map;i.forEach(g=>g.forEach((d,_)=>{const y=g[(_+1)%4],E=d<y?`${d},${y}`:`${y},${d}`;S.set(E,S.has(E)?[]:[d,y])}));for(const g of S.values()){if(g.length!==2)continue;const[d,_]=g;for(let y=0;y<u;y++){const E=h*y/u,P=h*(y+1)/u;m(c[d][0],c[d][1],E,s[d]),m(c[_][0],c[_][1],E,s[_]),m(c[_][0],c[_][1],P,s[_]),m(c[d][0],c[d][1],E,s[d]),m(c[_][0],c[_][1],P,s[_]),m(c[d][0],c[d][1],P,s[d])}}if(e.cut)for(const g of[0,h])for(const d of i)for(const _ of[[0,1,2],[0,2,3]])_.forEach(y=>m(c[d[y]][0],c[d[y]][1],g,s[d[y]]));const x=new bn;return x.setAttribute("position",new Lt(f,3)),x.setAttribute("color",new Lt(p,3)),x.computeVertexNormals(),{g:x,lo:a,hi:o,sweep:h}}function aC({fea:t}){var c;const e=ne.useRef(null),n=Object.keys(t.model.cases),[i,r]=ne.useState({field:"von_mises_mpa",caseName:n[0],scale:100,cut:!0,wire:!1,blades:!0,spin:!1}),s=ne.useMemo(()=>{const h=t.model.cases[i.caseName][i.field];return[Math.min(...h),Math.max(...h)]},[t,i.caseName,i.field]),a=ne.useRef(i);a.current=i,ne.useEffect(()=>{const h=e.current;if(!h)return;const u=h.clientWidth,f=h.clientHeight,p=new jv({antialias:!0});p.setPixelRatio(Math.min(devicePixelRatio,2)),p.setSize(u,f),h.appendChild(p.domElement);const m=new zv;m.background=new He(725536);const S=t.model.r_tip_mm/1e3,x=new yn(35,u/f,.001,20);x.position.set(S*2.4,S*1.6,S*2.4),m.add(new Vv(16777215,2241348,1.4));const g=new Gv(16777215,1.3);g.position.set(1,2,1.5),m.add(g);const d=new Xi;m.add(d);const{g:_,sweep:y}=sC(t.model,i),E=new ql({vertexColors:!0,side:Ln,roughness:.5,metalness:.15,wireframe:i.wire});if(d.add(new Mn(_,E)),i.blades){const z=t.model.nodes_mm,v=t.model.zones,M=new Map;t.model.elements.forEach((Y,L)=>{v[L]==="passage"&&Y.forEach(O=>{const V=Math.round(z[O][0]*100)/100,se=z[O][1],fe=M.get(V);M.set(V,fe?[Math.min(fe[0],se),Math.max(fe[1],se)]:[se,se])})});const I=[...M.entries()].sort((Y,L)=>Y[0]-L[0]),j=new ql({color:12109782,metalness:.55,roughness:.35,side:Ln}),q=t.model.backsweep_deg*Math.PI/180*1.4,Z=I[0][0],H=I[I.length-1][0];for(let Y=0;Y<t.model.blades;Y++){const L=2*Math.PI*Y/t.model.blades;if(i.cut&&L>y-.05)continue;const O=[],V=(fe,Le,$)=>{const re=L+q*$;O.push(fe/1e3*Math.cos(re),Le/1e3,fe/1e3*Math.sin(re))};for(let fe=0;fe<I.length-1;fe++){const[Le,[$,re]]=I[fe],[ue,[R,te]]=I[fe+1],de=(Le-Z)/(H-Z),Te=(ue-Z)/(H-Z);V(Le,$,de),V(ue,R,Te),V(ue,te,Te),V(Le,$,de),V(ue,te,Te),V(Le,re,de)}const se=new bn;se.setAttribute("position",new Lt(O,3)),se.computeVertexNormals(),d.add(new Mn(se,j))}}d.rotation.y=Math.PI;const P=new GT(S*1.4,12,6,64,2832975,1845302);P.position.y=-.002,m.add(P);const b=new Xv(x,p.domElement);b.enableDamping=!0,b.target.set(0,S*.15,0);let C=0;const N=()=>{a.current.spin&&(d.rotation.y+=.004),b.update(),p.render(m,x),C=requestAnimationFrame(N)};return N(),()=>{cancelAnimationFrame(C),b.dispose(),p.dispose(),_.dispose(),h.removeChild(p.domElement)}},[t,i.field,i.caseName,i.scale,i.cut,i.wire,i.blades]);const o=(h,u)=>r({...i,[h]:u});return l.jsxs("div",{className:"fea",children:[l.jsxs("div",{className:"toolbar",children:[l.jsx("select",{className:"inp",value:i.field,onChange:h=>o("field",h.target.value),"aria-label":"Result",children:sh.map(([h,u])=>l.jsx("option",{value:h,children:u},h))}),l.jsx("select",{className:"inp",value:i.caseName,onChange:h=>o("caseName",h.target.value),"aria-label":"Load case",children:n.map(h=>l.jsx("option",{children:h},h))}),l.jsxs("label",{className:"muted",children:["Deformation ×",i.scale,l.jsx("input",{type:"range",min:0,max:400,step:10,value:i.scale,onChange:h=>o("scale",Number(h.target.value))})]}),[["cut","Cut-away"],["wire","Mesh"],["blades","Blades"],["spin","Rotate"]].map(([h,u])=>l.jsx("button",{className:`chip ${i[h]?"on":""}`,onClick:()=>o(h,!i[h]),children:u},h))]}),l.jsx("div",{ref:e,className:"viewer tall"}),l.jsxs("div",{className:"legend",children:[l.jsx("span",{children:s[0].toFixed(0)}),l.jsx("div",{className:"bar",style:{background:`linear-gradient(90deg, ${Sa.map(h=>`rgb(${h.map(u=>Math.round(u*255)).join(",")})`).join(",")})`}}),l.jsx("span",{children:s[1].toFixed(0)}),l.jsxs("span",{className:"muted",children:[(c=sh.find(h=>h[0]===i.field))==null?void 0:c[1]," · ",i.caseName]})]})]})}function oC({model:t,field:e,caseName:n}){const i=t.nodes_mm,r=t.cases[n][e],s=t.elements.map(x=>x.reduce((g,d)=>g+r[d],0)/4),a=Math.min(...s),o=Math.max(...s),c=i.map(x=>x[0]),h=i.map(x=>x[1]),u=Math.min(...c),f=Math.max(...c),p=Math.min(...h),m=Math.max(...h),S=4;return l.jsx("svg",{viewBox:`${u-S} ${-m-S} ${f-u+2*S} ${m-p+2*S}`,className:"section",role:"img","aria-label":"FE section",children:t.elements.map((x,g)=>{const d=$v((s[g]-a)/(o-a||1)).map(_=>Math.round(_*255));return l.jsx("polygon",{points:x.map(_=>`${i[_][0]},${-i[_][1]}`).join(" "),fill:`rgb(${d.join(",")})`,stroke:"rgba(0,0,0,.25)",strokeWidth:.15,children:l.jsx("title",{children:`${t.zones[g]} · ${s[g].toFixed(0)}`})},g)})})}const is={shaft:10135476,impeller:5214159,piston:13214554,collar:11566159,coupling:8227480,sleeve:7320486,bearing:14715452};function lC(t,e,n){if(n<=t[0])return e[0];for(let i=1;i<t.length;i++)if(n<=t[i])return e[i-1]+(e[i]-e[i-1])*(n-t[i-1])/(t[i]-t[i-1]);return e[e.length-1]}function fa(t,e,n=1){const i=t.map(([a,o])=>new Fe(Math.max(a,1e-4),o)),r=new mf(i,64),s=new ql({color:e,metalness:.55,roughness:.42,side:Ln,transparent:n<1,opacity:n});return new Mn(r,s)}function cC(t){const e=new Xi,n=[],i=(r,s)=>{e.add(r),n.push({obj:r,z:s})};for(const r of t.parts)if(r.type==="cylinder"){const s=Math.max(1,Math.ceil((r.z1-r.z0)/.04));for(let a=0;a<s;a++){const o=r.z0+(r.z1-r.z0)*a/s,c=r.z0+(r.z1-r.z0)*(a+1)/s;i(fa([[r.r_inner,o],[r.r_outer,o],[r.r_outer,c],[r.r_inner,c]],is.shaft),(o+c)/2)}}else if(r.type==="impeller"){const s=r.z_center-r.length/2,a=r.length,o=new Xi;o.add(fa([[r.r_hub,s+a],[r.r2,s+.8*a],[r.r2,s+.7*a],[r.r_hub*1.2,s+.62*a]],is.impeller)),o.add(fa([[r.r2,s+.62*a-r.b2],[(r.r1+r.r2)/2,s+.3*a],[r.r1*1.05,s],[r.r1*.98,s]],is.impeller,.55));const c=new ql({color:3107491,metalness:.5,roughness:.45});for(let h=0;h<r.blades;h++){const u=2*Math.PI*h/r.blades,f=r.r2-r.r1*.9,p=new Mn(new Xs(.004,r.b2*1.2,f),c),m=(r.r2+r.r1*.9)/2;p.position.set(m*Math.sin(u),s+.62*a-r.b2/2,m*Math.cos(u)),p.rotation.y=u+r.backsweep_deg*Math.PI/180/2,o.add(p)}i(o,r.z_center)}else if(r.type==="disk"){const s=r.z_center-r.thickness/2,a=r.z_center+r.thickness/2;i(fa([[.01,s],[r.r_outer,s],[r.r_outer,a],[.01,a]],is[r.material]??is.shaft),r.z_center)}else if(r.type==="bearing"){const s=r.z_center-r.width/2,a=r.z_center+r.width/2,o=fa([[r.r_inner*1.02,s],[r.r_outer*1.6,s],[r.r_outer*1.6,a],[r.r_inner*1.02,a],[r.r_inner*1.02,s]],is.bearing,.45);e.add(o)}return{group:e,pieces:n}}function uC({scene:t,mode:e,amplitude:n=.04}){const i=ne.useRef(null),r=ne.useRef(e??null);return r.current=e??null,ne.useEffect(()=>{const s=i.current;if(!s||!t)return;const a=s.clientWidth,o=s.clientHeight,c=new jv({antialias:!0});c.setPixelRatio(Math.min(window.devicePixelRatio,2)),c.setSize(a,o),s.appendChild(c.domElement);const h=new zv;h.background=new He(988443);const u=new yn(35,a/o,.01,50),f=t.length;u.position.set(f*.3,f*.22,f*.62),h.add(new Vv(14674162,1713200,1.1));const p=new Gv(16777215,1.6);p.position.set(2,3,2),h.add(p);const{group:m,pieces:S}=cC(t),x=new Xi;m.rotation.z=-Math.PI/2,m.position.x=-f/2,x.add(m),h.add(x);const g=new VT(f*1.6,16,2766403,1910577);g.position.y=-.35,h.add(g);const d=new Xv(u,c.domElement);d.target.set(0,0,0),d.enableDamping=!0;let _=0;const y=performance.now(),E=()=>{const b=(performance.now()-y)/1e3,C=r.current;for(const N of S){if(C){const z=n*lC(C.z,C.shape,N.z);N.obj.position.x=z*Math.cos(2*Math.PI*.6*b),N.obj.position.z=z*Math.sin(2*Math.PI*.6*b)}else N.obj.position.x=0,N.obj.position.z=0;N.obj.rotation.y=b*.8}d.update(),c.render(h,u),_=requestAnimationFrame(E)};E();const P=()=>{const b=s.clientWidth,C=s.clientHeight;c.setSize(b,C),u.aspect=b/C,u.updateProjectionMatrix()};return window.addEventListener("resize",P),()=>{cancelAnimationFrame(_),window.removeEventListener("resize",P),d.dispose(),c.dispose(),s.removeChild(c.domElement)}},[t,n]),l.jsx("div",{ref:i,className:"viewer"})}const dC=[["_nm_rad","N·m/rad"],["_nm3_h","Nm³/h"],["_w_m2k","W/m²K"],["_kgm2","kg·m²"],["_l_min","L/min"],["_m3_h","m³/h"],["_m_s","m/s"],["_n_m","N/m"],["_bara","bara"],["_barg","barg"],["_bar","bar"],["_mpa","MPa"],["_pa","Pa"],["_kn","kN"],["_mm","mm"],["_um","µm"],["_kg","kg"],["_rpm","rpm"],["_kw","kW"],["_hz","Hz"],["_pct","%"],["_min","min"],["_c","°C"],["_m","m"]];function hC(t){for(const[e,n]of dC)if(t.endsWith(e)){const i=t.slice(0,-e.length);return{text:Bm(i),unit:n}}return{text:Bm(t),unit:""}}const Bm=t=>{const e=t.replace(/_/g," ");return e.charAt(0).toUpperCase()+e.slice(1)};function fC(t,e){return e!=null&&e.$ref?t.$defs[e.$ref.split("/").pop()]:e}function pC(t){if(t.enum)return{type:"enum",nullable:!1,enum:t.enum};if(t.anyOf){const n=t.anyOf.filter(i=>i.type!=="null")[0]??{};return{type:n.enum?"enum":n.type??(n.$ref?"object":"string"),nullable:!0,enum:n.enum}}return{type:t.type??(t.$ref?"object":"string"),nullable:!1}}function Un({schema:t,def:e,value:n,onChange:i,skip:r=[]}){var o;const s=((o=t==null?void 0:t.$defs)==null?void 0:o[e])??(e==="Project"?t:null);if(!s||!n)return null;const a=s.properties??{};return l.jsx("div",{className:"form",children:Object.keys(a).filter(c=>!r.includes(c)).map(c=>{const h=fC(t,a[c]),u=pC(h);if(u.type==="object"||u.type==="array")return null;const{text:f,unit:p}=hC(c),m=a[c].description??h.description??"",S=n[c],x=d=>i({...n,[c]:d});if(u.type==="boolean")return l.jsxs("label",{className:"check",title:m,children:[l.jsx("input",{type:"checkbox",checked:!!S,onChange:d=>x(d.target.checked)})," ",f]},c);if(u.type==="enum")return l.jsxs("label",{title:m,children:[f,l.jsx("select",{value:S??"",onChange:d=>x(d.target.value),children:u.enum.map(d=>l.jsx("option",{value:d,children:d.replace(/_/g," ")},d))})]},c);const g=u.type==="number"||u.type==="integer";return l.jsxs("label",{title:m,children:[l.jsxs("span",{children:[f,p?` (${p})`:""]}),l.jsx("input",{type:g?"number":"text",step:"any",value:S??"",placeholder:u.nullable?"auto":"",onChange:d=>{const _=d.target.value;if(_===""&&u.nullable)return x(null);x(g?_===""?0:u.type==="integer"?parseInt(_,10):parseFloat(_):_)}})]},c)})})}const $o={outside:["fail","Outside limits"],evidence:["attention","Evidence needed"],within:["pass","Within limits"]},Hm={D0:"#2E9E6B",D1:"#E6C229",D2:"#F28E1C",D3:"#C0392B"},Vm=[["min_temp_c","Min T °C"],["max_temp_c","Max T °C"],["max_hardness_hrc","Max HRC"],["measured_hardness_hrc","Meas. HRC"],["max_wet_ph2s_bar","Wet pH₂S bar"],["max_pco2_bar","pCO₂ bar"],["min_ph","Min pH"],["max_chloride_ppm","Cl⁻ ppm"],["corrosion_allowance_mm","CA mm"]],Gm=[["P_bara","P bara",2],["T_c","T °C",1],["h2o_pct","H₂O %",3],["co2_pct","CO₂ %",2],["h2s_pct","H₂S %",1]],mC=["Service conditions","Charts","Components & selection","Cross-section","Weld overlay & SOP","Contaminants","Criteria & inputs"],ah=t=>{var e;return((e=t==null?void 0:t.acceptance)==null?void 0:e.status)==="fail"?"outside":(t==null?void 0:t.status)??"evidence"};function pa({s:t}){const e=["pass","within","compliant","ok"].includes(t)?"pass":t==="fail"||t==="outside"?"fail":t==="review"?"review":"attention";return l.jsx("span",{className:`pill ${e}`,children:t})}function gC({comps:t,n:e,sel:n,setSel:i,mode:r}){const s=Object.fromEntries(t.map(m=>[m.component,m])),a=m=>{const S=s[m];return S?r==="environment"?S.wet?"#4C9BEA":"#C9CED3":{outside:"#E57368",evidence:"#F2C46D",within:"#7CC69B"}[ah(S)]??"#C9CED3":"#C9CED3"},o=(m,S)=>l.jsxs("g",{className:`xpart ${n===m?"sel":""}`,fill:a(m),onClick:()=>i(m),children:[l.jsxs("title",{children:[m,s[m]?` · ${s[m].material}`:""]}),S]},m+S.key),c=Math.max(1,Math.min(e,10)),h=250,u=690,f=(u-h)/c,p=new Set(t.filter(m=>{var S;return(S=m.selection)==null?void 0:S.overlay}).map(m=>m.component));return l.jsxs("svg",{viewBox:"0 0 1000 360",className:"xsec",role:"img","aria-label":"Compressor cross-section",children:[l.jsx("line",{x1:"20",y1:"335",x2:"980",y2:"335",stroke:"#5B6878",strokeDasharray:"14 5 3 5",strokeWidth:"1"}),o("Shaft",l.jsx("rect",{x:"30",y:"300",width:"940",height:"32"},"s")),o("Casing",l.jsx("path",{d:"M150 40 H850 V82 H820 V8 H760 V82 H262 V8 H202 V82 H150 Z"},"c")),o("Inlet cover",l.jsx("rect",{x:"112",y:"40",width:"40",height:"252"},"ic")),o("Discharge cover",l.jsx("rect",{x:"848",y:"40",width:"40",height:"252"},"dc")),o("Inlet plenum",l.jsx("path",{d:"M168 90 H240 Q252 150 246 214 H222 Q228 150 214 114 H168 Z"},"ip")),Array.from({length:c-1},(m,S)=>o("Diaphragms",l.jsx("rect",{x:h+f*(S+1)-7,y:"96",width:"14",height:"150"},`d${S}`))),Array.from({length:c},(m,S)=>{const x=h+f*S+10,g=x+f-26;return o(S===0?"First impeller":"Other impellers",l.jsx("path",{d:`M${x} 296 L${x} 190 Q${x+4} 150 ${g-6} 140 L${g} 140 L${g} 296 Z`},`i${S}`))}),o("Discharge scroll",l.jsx("rect",{x:"704",y:"100",width:"70",height:"96",rx:"34"},"ds")),o("Balance drum",l.jsx("rect",{x:"784",y:"246",width:"54",height:"52"},"bd")),o("Shaft sleeve",l.jsx("rect",{x:"168",y:"288",width:"72",height:"11"},"sl")),Array.from({length:c},(m,S)=>o("Labyrinths",l.jsx("rect",{x:h+f*S+4,y:"262",width:"8",height:"20"},`l${S}`))),o("Labyrinths",l.jsx("rect",{x:"790",y:"236",width:"42",height:"9"},"lb")),(p.has("Casing")||p.has("Inlet cover"))&&l.jsx("path",{d:"M152 292 V44 M202 82 V8 M262 8 V82 H330",fill:"none",stroke:"#B5D334",strokeWidth:"6",pointerEvents:"none",opacity:".9"}),l.jsx("text",{x:"232",y:"28",className:"xlab",children:"Inlet"}),l.jsx("text",{x:"790",y:"28",className:"xlab",children:"Discharge"})]})}function _C(t){var q,Z,H,Y,L,O,V,se,fe,Le,$,re,ue;const[e,n]=ne.useState(null),[i,r]=ne.useState(0),[s,a]=ne.useState(null),[o,c]=ne.useState("First impeller"),[h,u]=ne.useState("verdict"),[f,p]=ne.useState(!1);ne.useEffect(()=>{et.materials().then(n).catch(()=>{})},[]);const m=t.project,S=m.material_assessment,x=(q=t.results)==null?void 0:q.material_assessment,g=R=>t.setProject({...m,material_assessment:R}),d=(x==null?void 0:x.components)??[],_=S.records.length?S.records:d.map(R=>{const te=["component","material","wetted_surface","evidence_reference","verified","component_class","overlay",...Vm.map(([de])=>de),"max_dry_ph2s_bar","corrosion_resistant"];return Object.fromEntries(te.filter(de=>de in R).map(de=>[de,R[de]]))}),y=(R,te,de)=>g({...S,records:_.map((Te,be)=>be===R?{...Te,[te]:de}:Te)}),E=R=>R===""?null:parseFloat(R),P=(x==null?void 0:x.conditions)??[],b=R=>S.stage_overrides.find(te=>te.location===R)??{},C=(R,te,de)=>{const Te=S.stage_overrides.filter(D=>D.location!==R),be={...b(R),location:R,[te]:de},Ne=Object.entries(be).some(([D,At])=>D!=="location"&&At!==null&&At!==void 0);g({...S,stage_overrides:Ne?[...Te,be]:Te})},N=((H=(Z=t.results)==null?void 0:Z.casings)==null?void 0:H.reduce((R,te)=>R+te.impellers.impellers.length,0))??6,z=async()=>{p(!0);try{const R=await fetch("/api/export/material-selection.pdf",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({project:m,level:"full"})});if(!R.ok)throw new Error((await R.json()).detail??R.statusText);const te=document.createElement("a");te.href=URL.createObjectURL(await R.blob()),te.download=`${String(m.name).replace(/\s+/g,"_")}_material_selection.pdf`,te.click()}catch(R){alert(R.message)}finally{p(!1)}},v=(Y=x==null?void 0:x.charts)==null?void 0:Y.dew_point,M=(L=x==null?void 0:x.charts)==null?void 0:L.ssc,I=d.find(R=>R.component===o),j=P.reduce((R,te)=>Math.max(R,te.domain_index??0),0);return l.jsxs(l.Fragment,{children:[l.jsxs("div",{className:"row",style:{alignItems:"flex-start"},children:[l.jsxs("div",{style:{flex:1},children:[l.jsx("h2",{children:"Material assessment"}),l.jsx("p",{className:"lead",children:"Sour and wet service at every location of the compressor: partial pressures, water dew point, condensed-water pH, SSC severity domain and corrosion rate, checked against the acceptance criteria per component, with an automatic material selection. A material only passes with a recorded, verified service basis."})]}),l.jsx("button",{className:"btn primary",disabled:!x||f,onClick:z,children:f?"Preparing…":"Material selection report (PDF)"})]}),x?l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"kpis",children:[["Wet locations",P.filter(R=>R.wet).map(R=>R.location).join(", ")||"none"],["Highest SSC domain",P.some(R=>R.sour)?`Domain ${j}`:"not sour"],["Corrosion acceptance",`${d.filter(R=>{var te;return((te=R.acceptance)==null?void 0:te.status)==="fail"}).length} fail`],["Evidence needed",String(x.counts.evidence)],["Outside limits",String(x.counts.outside)],["Weld overlay",(O=x.weld_overlay)!=null&&O.required?`required · ${x.weld_overlay.alloy}`:"not required"],["SOP trip setpoint",((V=x.sop)==null?void 0:V.trip_setpoint_c)!=null?`${Q(x.sop.trip_setpoint_c,1)} °C`:"–"]].map(([R,te])=>l.jsxs("div",{className:"kpi",children:[l.jsx("div",{className:`v ${String(te).length>16?"long":""}`,children:te}),l.jsx("div",{className:"l",children:R})]},R))}),l.jsx("div",{className:"seg",style:{marginBottom:14},children:mC.map((R,te)=>l.jsx("button",{className:i===te?"on":"",onClick:()=>r(te),children:R},R))}),i===0&&l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Service conditions by location — edit any input to override the process value"}),l.jsx("div",{className:"scroll",children:l.jsxs("table",{className:"t",children:[l.jsx("thead",{children:l.jsxs("tr",{children:[l.jsx("th",{children:"Location"}),Gm.map(([,R])=>l.jsx("th",{children:R},R)),l.jsx("th",{children:"pH₂S bar"}),l.jsx("th",{children:"pCO₂ bar"}),l.jsx("th",{children:"pH"}),l.jsx("th",{children:"Severity"}),l.jsx("th",{children:"Moisture"}),l.jsx("th",{children:"Dew °C"}),l.jsx("th",{children:"CR mm/y"}),l.jsxs("th",{children:["Loss ",x.design_life_years," y mm"]})]})}),l.jsx("tbody",{children:P.map(R=>l.jsxs("tr",{className:R.sop?"soprow":"",children:[l.jsxs("td",{children:[l.jsx("b",{children:R.location}),R.source==="override"&&l.jsx("span",{className:"pill blue",style:{marginLeft:6},children:"override"})]}),Gm.map(([te,,de])=>l.jsx("td",{children:l.jsx("input",{className:"inp cell",type:"number",step:"any",value:b(R.location)[te]??"",placeholder:Q(R[te],de),onChange:Te=>C(R.location,te,E(Te.target.value))})},te)),l.jsx("td",{className:"n",children:Q(R.ph2s_bar,3)}),l.jsx("td",{className:"n",children:Q(R.pco2_bar,3)}),l.jsx("td",{className:"n",children:Q(R.ph,2)}),l.jsx("td",{children:l.jsx("span",{className:"dom",style:{background:Hm[R.domain]??"#999"},children:R.sour?`Domain ${R.domain_index}`:"Non-sour"})}),l.jsx("td",{children:l.jsx("span",{className:`pill ${R.wet?"fail":"muted"}`,children:R.moisture})}),l.jsx("td",{className:"n",children:Q(R.water_dew_point_c,1)}),l.jsx("td",{className:"n",children:Q(R.cr_mm_y,3)}),l.jsx("td",{className:"n",children:Q(R.cumulative_loss_mm,2)})]},R.location))})]})}),l.jsxs("p",{className:"muted small",children:["Blank inputs use the compressor results; typed values override them (e.g. vendor or measured data). Carbon-steel corrosion rate from de Waard–Milliams × ",S.corrosion_factor," with the O₂ factor; SOP rows ",S.sop.protected?"are protected by the dew-point trip and not counted in component loss":"count towards component loss","."]})]}),i===1&&v&&M&&l.jsxs("div",{className:"grid",children:[l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Water partial pressure vs temperature"}),l.jsx(wt,{height:380,data:[{x:v.saturation.map(R=>R[0]),y:v.saturation.map(R=>R[1]),mode:"lines",name:"Water saturation",line:{color:"#0C1A2B"}},{x:v.margin.map(R=>R[0]),y:v.margin.map(R=>R[1]),mode:"lines",name:`Margin curve (+${v.margin_c} °C)`,line:{color:it[5],dash:"dash"}},...[["Wet",R=>R.wet&&!R.sop,"#C0392B","circle"],["Dry",R=>!R.wet&&!R.sop,it[0],"circle"],["SOP",R=>R.sop,it[4],"square"]].map(([R,te,de,Te])=>{const be=v.points.filter(te);return{x:be.map(Ne=>Ne.x),y:be.map(Ne=>Ne.y),text:be.map(Ne=>Ne.location),mode:"markers+text",name:R,marker:{color:de,symbol:Te,size:9}}})],layout:{xaxis:{title:"Temperature (°C)",range:[0,200]},yaxis:{title:"H₂O partial pressure (bar)",type:v.y_type}}}),l.jsx("p",{className:"muted small",children:v.note})]}),l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"SSC severity domains (pH vs pH₂S)"}),l.jsx(wt,{height:380,data:[...M.boundaries.map(R=>({x:R.points.map(te=>te[0]),y:R.points.map(te=>te[1]),mode:"lines",name:R.name,line:{color:"#2C65B0"},showlegend:!1})),...[["Locations",R=>!R.sop,"#C0392B","circle"],["SOP",R=>R.sop,it[4],"square"]].map(([R,te,de,Te])=>{const be=M.points.filter(te);return{x:be.map(Ne=>Math.max(Ne.x,M.x_range[0])),y:be.map(Ne=>Ne.y),mode:"markers",name:R,marker:{color:de,symbol:Te,size:8}}})],layout:{xaxis:{title:"pH₂S (bar)",type:"log",range:[Math.log10(M.x_range[0]),Math.log10(M.x_range[1])]},yaxis:{title:"pH",range:M.y_range},shapes:[...M.regions.map(R=>({type:"polygon",points:R.polygon,fillcolor:Hm[R.domain],opacity:.16})),{type:"line",x0:M.sour_threshold_bar,x1:M.sour_threshold_bar,yref:"paper",y0:0,y1:1,line:{color:"#2C65B0",width:1.6}}],annotations:M.regions.map(R=>({x:R.label_at[0],y:R.label_at[1],text:`Domain ${R.label}`,color:"#7A1F14",bold:!0,align:"center"}))}}),l.jsx("p",{className:"muted small",children:M.note})]})]}),i===2&&l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Components — automatic selection, corrosion acceptance and evidence"}),l.jsx("div",{className:"scroll",children:l.jsxs("table",{className:"t",children:[l.jsx("thead",{children:l.jsxs("tr",{children:[l.jsx("th",{children:"Component"}),l.jsx("th",{children:"Service"}),l.jsx("th",{children:"Proposed material"}),l.jsx("th",{children:"Overlay"}),l.jsx("th",{children:"NACE"}),l.jsx("th",{children:"Max HRC"}),l.jsx("th",{children:"Min T °C"}),l.jsx("th",{children:"CR / limit mm/y"}),l.jsx("th",{children:"Loss / limit mm"}),l.jsx("th",{children:"Verdict"})]})}),l.jsx("tbody",{children:d.map((R,te)=>{var Ne,D,At,Ve,We;const[de,Te]=$o[ah(R)]??$o.evidence,be=R.selection??{};return l.jsxs(ne.Fragment,{children:[l.jsxs("tr",{className:"click",onClick:()=>a(s===te?null:te),children:[l.jsx("td",{children:l.jsx("b",{children:R.component})}),l.jsxs("td",{children:[l.jsx("span",{className:`pill ${R.wet?"fail":"muted"}`,children:R.wet?"WET":"DRY"})," ",R.domain]}),l.jsx("td",{children:be.designation??R.material}),l.jsx("td",{children:be.overlay??"–"}),l.jsx("td",{children:l.jsx(pa,{s:be.nace??"review"})}),l.jsx("td",{className:"n",children:be.max_hrc??"–"}),l.jsx("td",{className:"n",children:be.min_temp_c??"–"}),l.jsxs("td",{className:"n",children:[Q(R.cr_mm_y,3)," / ",Q(R.limit_cr,3)]}),l.jsxs("td",{className:"n",children:[Q(R.loss_mm,2)," / ",Q(R.limit_total,1)]}),l.jsx("td",{children:l.jsx("span",{className:`badge ${de}`,children:Te})})]}),s===te&&l.jsx("tr",{children:l.jsx("td",{colSpan:10,children:l.jsxs("div",{className:"detail",children:[l.jsxs("div",{children:[l.jsx("div",{className:"mono caps label",children:"Why this material"}),l.jsx("ul",{children:(be.rationale??[]).map(pe=>l.jsx("li",{children:pe},pe))}),((Ne=be.alternatives)==null?void 0:Ne.length)>0&&l.jsxs(l.Fragment,{children:[l.jsx("div",{className:"mono caps label",children:"Alternatives"}),l.jsx("ul",{children:be.alternatives.map(pe=>l.jsx("li",{children:pe},pe))})]}),be.nace_note&&l.jsx("p",{className:"muted small",children:be.nace_note})]}),l.jsxs("div",{children:[l.jsx("div",{className:"mono caps label",children:"Checks"}),l.jsxs("div",{className:"verdict",children:[R.failures.map(pe=>l.jsxs("div",{className:"status fail",children:["✕ ",pe]},pe)),R.missing.map(pe=>l.jsxs("div",{className:"status attention",children:["○ ",pe]},pe)),R.checks.map(pe=>l.jsxs("div",{className:"status pass",children:["✓ ",pe]},pe))]})]}),l.jsxs("div",{children:[l.jsx("div",{className:"mono caps label",children:"Record (your documented limits)"}),l.jsxs("div",{className:"form",children:[l.jsxs("label",{children:["Material",l.jsx("select",{value:(D=_[te])==null?void 0:D.material,onChange:pe=>y(te,"material",pe.target.value),children:((e==null?void 0:e.materials)??[{key:(At=_[te])==null?void 0:At.material}]).map(pe=>l.jsx("option",{children:pe.key},pe.key))})]}),l.jsxs("label",{children:["Evidence reference",l.jsx("input",{value:((Ve=_[te])==null?void 0:Ve.evidence_reference)??"",placeholder:"doc / cert ref",onChange:pe=>y(te,"evidence_reference",pe.target.value)})]}),l.jsxs("label",{className:"check",children:[l.jsx("input",{type:"checkbox",checked:!!((We=_[te])!=null&&We.verified),onChange:pe=>y(te,"verified",pe.target.checked)}),"Verified"]}),Vm.map(([pe,st])=>{var De;return l.jsxs("label",{children:[st,l.jsx("input",{type:"number",step:"any",value:((De=_[te])==null?void 0:De[pe])??"",onChange:A=>y(te,pe,E(A.target.value))})]},pe)})]})]})]})})})]},R.component)})})]})}),l.jsx("p",{className:"muted small",children:"Click a row for the rationale, checks and the record editor. Edit records from qualified documents, then re-run."})]}),i===3&&l.jsxs("div",{className:"grid",children:[l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Cross-section — click a part"}),l.jsx("div",{className:"chips",style:{marginBottom:6},children:[["verdict","Colour by verdict"],["environment","Colour by wet / dry"]].map(([R,te])=>l.jsx("button",{className:`chip ${h===R?"on":""}`,onClick:()=>u(R),children:te},R))}),l.jsx(gC,{comps:d,n:N,sel:o,setSel:c,mode:h}),l.jsxs("div",{className:"legend",children:[h==="verdict"?l.jsxs(l.Fragment,{children:[l.jsx("span",{className:"sw",style:{background:"#7CC69B"}}),"Within ",l.jsx("span",{className:"sw",style:{background:"#F2C46D"}}),"Evidence needed",l.jsx("span",{className:"sw",style:{background:"#E57368"}}),"Outside / acceptance fail"]}):l.jsxs(l.Fragment,{children:[l.jsx("span",{className:"sw",style:{background:"#4C9BEA"}}),"Wet ",l.jsx("span",{className:"sw",style:{background:"#C9CED3"}}),"Dry"]}),l.jsx("span",{className:"sw",style:{background:"#B5D334"}}),"Weld overlay"]})]}),l.jsx("div",{className:"card accent",children:I?l.jsxs(l.Fragment,{children:[l.jsx("h3",{children:I.component}),l.jsx("div",{className:"pname",children:((se=I.selection)==null?void 0:se.designation)??I.material}),l.jsxs("p",{className:"muted",children:[I.location," · ",I.wet?"wet":"dry"," · ",I.domain," · surface ",I.surface]}),l.jsx("table",{className:"t",children:l.jsx("tbody",{children:[["NACE",(fe=I.selection)==null?void 0:fe.nace],["Max hardness",((Le=I.selection)==null?void 0:Le.max_hrc)!=null?`${I.selection.max_hrc} HRC`:"–"],["Min temperature",`${(($=I.selection)==null?void 0:$.min_temp_c)??"–"} °C (MDMT ${((re=I.selection)==null?void 0:re.mdmt_c)??x.mdmt_c} °C)`],["Corrosion rate",`${Q(I.cr_mm_y,3)} mm/y (limit ${Q(I.limit_cr,3)})`],["Loss over life",`${Q(I.loss_mm,2)} mm (limit ${Q(I.limit_total,1)})`],["Verdict",($o[ah(I)]??$o.evidence)[1]]].map(([R,te])=>l.jsxs("tr",{children:[l.jsx("td",{className:"muted",children:R}),l.jsx("td",{children:te})]},R))})}),l.jsx("ul",{children:(((ue=I.selection)==null?void 0:ue.rationale)??[]).map(R=>l.jsx("li",{children:R},R))})]}):l.jsx("p",{className:"muted",children:"Click a part of the section."})})]}),i===4&&l.jsxs("div",{className:"grid",children:[l.jsxs("div",{className:"card",children:[l.jsxs("h3",{children:["Weld overlay ",l.jsx(pa,{s:x.weld_overlay.status})]}),l.jsx("p",{children:x.weld_overlay.statement}),l.jsxs("table",{className:"t",children:[l.jsx("thead",{children:l.jsxs("tr",{children:[l.jsx("th",{children:"Check"}),l.jsx("th",{children:"Criterion"}),l.jsx("th",{children:"Value"}),l.jsx("th",{children:"Status"})]})}),l.jsx("tbody",{children:x.weld_overlay.checks.map(R=>l.jsxs("tr",{children:[l.jsxs("td",{children:[R.check,R.note&&l.jsx("div",{className:"muted small",children:R.note})]}),l.jsx("td",{children:R.criterion}),l.jsx("td",{children:R.value??"–"}),l.jsx("td",{children:l.jsx(pa,{s:R.status})})]},R.check))})]}),l.jsx("div",{className:"mono caps label",style:{marginTop:12},children:"Process steps"}),l.jsx("ol",{children:x.weld_overlay.process_steps.map(R=>l.jsx("li",{children:R},R))}),l.jsx(Un,{schema:t.schema,def:"WeldOverlay",value:S.weld_overlay,onChange:R=>g({...S,weld_overlay:R})})]}),l.jsxs("div",{className:"card",children:[l.jsxs("h3",{children:["Settle-out (SOP) and standstill ",l.jsx(pa,{s:x.sop.status})]}),l.jsx("div",{className:"kpis",children:[["SOP pressure",`${Q(x.sop.pressure_bara,2)} bara`],["SOP water dew point",`${Q(x.sop.dew_point_c,1)} °C`],["Trip setpoint",`${Q(x.sop.trip_setpoint_c,1)} °C`],["Max pressurised standstill",`${x.sop.standstill_hours_max} h`]].map(([R,te])=>l.jsxs("div",{className:"kpi",children:[l.jsx("div",{className:"v",children:te}),l.jsx("div",{className:"l",children:R})]},R))}),l.jsx("ul",{children:x.sop.statements.map(R=>l.jsx("li",{children:R},R))}),l.jsx(Un,{schema:t.schema,def:"SOPSettings",value:S.sop,onChange:R=>g({...S,sop:R})})]})]}),i===5&&l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Contaminants"}),l.jsxs("table",{className:"t",children:[l.jsx("thead",{children:l.jsxs("tr",{children:[l.jsx("th",{children:"Item"}),l.jsx("th",{children:"Value"}),l.jsx("th",{children:"Limit"}),l.jsx("th",{children:"Status"}),l.jsx("th",{children:"Note"})]})}),l.jsx("tbody",{children:x.contaminants.map(R=>l.jsxs("tr",{children:[l.jsx("td",{children:l.jsx("b",{children:R.item})}),l.jsx("td",{children:R.value??"–"}),l.jsx("td",{children:R.limit}),l.jsx("td",{children:l.jsx(pa,{s:R.status})}),l.jsx("td",{className:"muted",children:R.note})]},R.item))})]}),l.jsx("div",{style:{marginTop:14},children:l.jsx(Un,{schema:t.schema,def:"Contaminants",value:S.contaminants,onChange:R=>g({...S,contaminants:R})})})]}),i===6&&l.jsxs(l.Fragment,{children:[l.jsxs("div",{className:"card",children:[l.jsxs("h3",{children:["Corrosion acceptance criteria (blade thickness used: ",Q(x.blade_thickness_mm,1)," mm, ",x.blade_thickness_basis,")"]}),l.jsxs("table",{className:"t",children:[l.jsx("thead",{children:l.jsxs("tr",{children:[l.jsx("th",{children:"Component class"}),l.jsx("th",{children:"Blade thickness"}),l.jsx("th",{children:"Max rate mm/y"}),l.jsx("th",{children:"Max total mm"})]})}),l.jsx("tbody",{children:S.acceptance_criteria.map((R,te)=>{const de=(Te,be)=>g({...S,acceptance_criteria:S.acceptance_criteria.map((Ne,D)=>D===te?{...Ne,[Te]:be}:Ne)});return l.jsxs("tr",{children:[l.jsx("td",{children:R.component_class}),l.jsx("td",{children:R.component_class==="impeller"?`> ${R.blade_min_mm??0}${R.blade_max_mm?` ≤ ${R.blade_max_mm}`:""} mm`:"–"}),l.jsx("td",{children:l.jsx("input",{className:"inp cell",type:"number",step:"any",value:R.max_cr_mm_y,onChange:Te=>de("max_cr_mm_y",E(Te.target.value))})}),l.jsx("td",{children:l.jsx("input",{className:"inp cell",type:"number",step:"any",value:R.max_total_mm,onChange:Te=>de("max_total_mm",E(Te.target.value))})})]},te)})})]})]}),l.jsxs("div",{className:"card",style:{marginTop:14},children:[l.jsx("h3",{children:"Assessment inputs"}),l.jsx(Un,{schema:t.schema,def:"MaterialAssessment",value:S,onChange:g,skip:["records"]})]}),e&&l.jsxs("details",{className:"card",style:{marginTop:14},children:[l.jsxs("summary",{children:["Material database — ",e._notice]}),l.jsx("div",{className:"scroll",children:l.jsxs("table",{className:"t",children:[l.jsx("thead",{children:l.jsx("tr",{children:["Material","Family","Sy MPa","Su MPa","T min °C","T max °C","Sour HRC max","Corrosion"].map(R=>l.jsx("th",{children:R},R))})}),l.jsx("tbody",{children:e.materials.map(R=>l.jsxs("tr",{children:[l.jsx("td",{children:R.key}),l.jsx("td",{children:String(R.family).replace(/_/g," ")}),l.jsx("td",{className:"n",children:R.yield_mpa}),l.jsx("td",{className:"n",children:R.uts_mpa}),l.jsx("td",{className:"n",children:R.min_temp_c}),l.jsx("td",{className:"n",children:R.max_temp_c}),l.jsx("td",{className:"n",children:R.sour_max_hrc??"–"}),l.jsx("td",{children:R.corrosion})]},R.key))})]})})]})]})]}):l.jsx("p",{className:"muted",children:"Run the analysis to see the assessment."})]})}const qv=()=>l.jsx("div",{className:"notice",children:"Preliminary engineering results for design studies and comparisons. Not a certificate of compliance with API 617 / 614 / 692, ISO 15156 or any other standard. Safety-critical conclusions require qualified engineering review."}),Ai=({results:t})=>t?null:l.jsx("p",{className:"muted",children:"Run the analysis to see results."});function qs({items:t}){return l.jsx("div",{className:"kpis",children:t.map(([e,n])=>l.jsxs("div",{className:"kpi",children:[l.jsx("div",{className:`v ${n.length>16?"long":""}`,children:n}),l.jsx("div",{className:"l",children:e})]},e))})}function mt({cols:t,rows:e}){return l.jsx("div",{className:"scroll",children:l.jsxs("table",{className:"t",children:[l.jsx("thead",{children:l.jsx("tr",{children:t.map(([n])=>l.jsx("th",{children:n},n))})}),l.jsx("tbody",{children:e.map((n,i)=>l.jsx("tr",{children:t.map(([r,s,a])=>{const o=s(n);return l.jsx("td",{className:typeof o=="number"?"n":"",children:typeof o=="number"?Q(o,a??1):o??"–"},r)})},i))})]})})}function pn({trace:t}){return t?l.jsxs("details",{className:"card",style:{marginTop:14},children:[l.jsxs("summary",{children:[l.jsx("strong",{children:"Method & assumptions"})," ",l.jsxs("span",{className:"muted",children:["— ",t.module,": ",t.method]})]}),l.jsx("ul",{children:t.assumptions.map(e=>l.jsx("li",{children:e},e))}),t.references.length>0&&l.jsxs("p",{className:"muted",children:["References: ",t.references.join("; ")]}),t.warnings.length>0&&l.jsx("ul",{children:t.warnings.map(e=>l.jsx("li",{className:"status attention",children:e},e))}),l.jsxs("p",{className:"muted",children:["Engine ",t.engine," · v",t.version," · inputs ",t.inputs_hash]})]}):null}const gc=t=>{var e,n,i,r;return((n=(e=t.results)==null?void 0:e.casings)==null?void 0:n[t.casing])??((r=(i=t.results)==null?void 0:i.casings)==null?void 0:r[0])},on=(t,e,n)=>t.setProject({...t.project,[e]:n});function vC(t){const e=t.project;return l.jsxs(l.Fragment,{children:[l.jsx("h2",{children:"Design basis"}),l.jsx("p",{className:"lead",children:"Define the project and the design basis. Fields left blank (“auto”) are estimated by the relevant module and reported in its trace."}),l.jsx(qv,{}),l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Project"}),l.jsx("div",{className:"form",children:l.jsxs("label",{children:["Description",l.jsx("input",{value:e.description,onChange:n=>on(t,"description",n.target.value)})]})})]}),l.jsxs("div",{className:"card",style:{marginTop:14},children:[l.jsx("h3",{children:"Design basis and limits"}),l.jsx(Un,{schema:t.schema,def:"DesignBasis",value:e.design_basis,onChange:n=>on(t,"design_basis",n)})]}),l.jsxs("div",{className:"card",style:{marginTop:14},children:[l.jsx("h3",{children:"Acceptance criteria (version-controlled — verify against the specified edition)"}),l.jsx(Un,{schema:t.schema,def:"Criteria",value:e.criteria,onChange:n=>on(t,"criteria",n)})]})]})}function xC(t){const e=t.project,[n,i]=ne.useState([]);ne.useEffect(()=>{et.components().then(i).catch(()=>{})},[]);const r=e.gas.components,s=Object.values(r).reduce((u,f)=>u+Number(f||0),0),a=u=>on(t,"gas",{...e.gas,components:u}),o=(u,f,p)=>{const m=e.cases.map((S,x)=>x===u?{...S,[f]:p}:f==="is_design"&&p?{...S,is_design:!1}:S);on(t,"cases",m)},c=n.filter(u=>!(u.key in r)),h=u=>u===""?null:parseFloat(u);return l.jsxs(l.Fragment,{children:[l.jsx("h2",{children:"Gas composition & operating cases"}),l.jsx("p",{className:"lead",children:"Mole composition (normalised automatically), property model and all operating cases. The case marked “design” sizes the machine; every case is located on the performance map."}),l.jsxs("div",{className:"grid",children:[l.jsxs("div",{className:"card",children:[l.jsxs("h3",{children:["Composition (mol %) · total ",Q(s,2)]}),l.jsx("table",{className:"t",children:l.jsx("tbody",{children:Object.entries(r).map(([u,f])=>{var p;return l.jsxs("tr",{children:[l.jsx("td",{children:((p=n.find(m=>m.key===u))==null?void 0:p.name)??u}),l.jsx("td",{children:l.jsx("input",{className:"inp",type:"number",step:"any",value:f,"aria-label":`${u} mol %`,onChange:m=>a({...r,[u]:parseFloat(m.target.value||"0")})})}),l.jsx("td",{children:l.jsx("button",{className:"btn",onClick:()=>{const m={...r};delete m[u],a(m)},children:"Remove"})})]},u)})})}),l.jsxs("div",{className:"row",style:{marginTop:8},children:[l.jsxs("select",{className:"inp",id:"addcomp",defaultValue:"",children:[l.jsx("option",{value:"",disabled:!0,children:"Add component…"}),c.map(u=>l.jsx("option",{value:u.key,children:u.name},u.key))]}),l.jsx("button",{className:"btn",onClick:()=>{const u=document.getElementById("addcomp");u.value&&a({...r,[u.value]:1})},children:"Add"}),l.jsxs("label",{className:"muted",children:["Property model"," ",l.jsxs("select",{className:"inp",value:e.gas.backend,onChange:u=>on(t,"gas",{...e.gas,backend:u.target.value}),children:[l.jsx("option",{value:"pr",children:"Peng-Robinson (built-in)"}),l.jsx("option",{value:"coolprop",children:"CoolProp HEOS (reference)"})]})]})]})]}),l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Operating cases"}),l.jsx("div",{className:"scroll",children:l.jsxs("table",{className:"t",children:[l.jsx("thead",{children:l.jsxs("tr",{children:[l.jsx("th",{children:"Design"}),l.jsx("th",{children:"Name"}),l.jsx("th",{children:"Ps bara"}),l.jsx("th",{children:"Ts °C"}),l.jsx("th",{children:"Pd bara"}),l.jsx("th",{children:"Flow"}),l.jsx("th",{children:"Unit"}),l.jsx("th",{children:"ηp (auto)"}),l.jsx("th",{children:"Td meas. °C"}),l.jsx("th",{})]})}),l.jsx("tbody",{children:e.cases.map((u,f)=>l.jsxs("tr",{children:[l.jsx("td",{children:l.jsx("input",{type:"radio",checked:u.is_design,onChange:()=>o(f,"is_design",!0),"aria-label":"design case"})}),l.jsx("td",{children:l.jsx("input",{className:"inp",style:{width:90},value:u.name,onChange:p=>o(f,"name",p.target.value)})}),["suction_pressure_bara","suction_temperature_c","discharge_pressure_bara","flow_value"].map(p=>l.jsx("td",{children:l.jsx("input",{className:"inp",style:{width:70},type:"number",step:"any",value:u[p],onChange:m=>o(f,p,parseFloat(m.target.value||"0"))})},p)),l.jsx("td",{children:l.jsx("select",{className:"inp",value:u.flow_unit,onChange:p=>o(f,"flow_unit",p.target.value),children:["kg/s","kg/h","Am3/h","Nm3/h","Sm3/h","MMSCFD"].map(p=>l.jsx("option",{children:p},p))})}),l.jsx("td",{children:l.jsx("input",{className:"inp",style:{width:60},type:"number",step:"any",placeholder:"auto",value:u.polytropic_efficiency??"",onChange:p=>o(f,"polytropic_efficiency",h(p.target.value))})}),l.jsx("td",{children:l.jsx("input",{className:"inp",style:{width:60},type:"number",step:"any",placeholder:"–",value:u.measured_discharge_temperature_c??"",onChange:p=>o(f,"measured_discharge_temperature_c",h(p.target.value))})}),l.jsx("td",{children:l.jsx("button",{className:"btn",disabled:e.cases.length<2,onClick:()=>on(t,"cases",e.cases.filter((p,m)=>m!==f)),children:"×"})})]},f))})]})}),l.jsx("button",{className:"btn",style:{marginTop:8},onClick:()=>on(t,"cases",[...e.cases,{...e.cases[e.cases.length-1],name:`Case ${e.cases.length+1}`,is_design:!1}]),children:"Add case"})]})]})]})}function yC(t){var S,x;const e=t.results,[n,i]=ne.useState(null),[r,s]=ne.useState(null),[a,o]=ne.useState("Z"),[c,h]=ne.useState(""),u=t.project.gas.components;if(ne.useEffect(()=>{et.thermoChart({components:u,backend:t.project.gas.backend,t_min_c:-20,t_max_c:200,pressures_bara:[10,30,60,90,120]}).then(i).catch(()=>i(null))},[u,t.project.gas.backend]),!e)return l.jsx(Ai,{results:e});const f=e.gas,p=f.suction_state,m=[["Z","Compressibility Z"],["rho","Density (kg/m³)"],["cp","cp (J/kg K)"],["k","cp/cv"],["sound","Speed of sound (m/s)"],["mu","Viscosity (Pa s)"],["h_kj_kg","Enthalpy (kJ/kg)"]];return l.jsxs(l.Fragment,{children:[l.jsx("h2",{children:"Thermodynamics"}),l.jsx("p",{className:"lead",children:"Real-gas properties on the selected equation of state, phase behaviour and compression of every operating case (numerical polytropic path, Schultz method for comparison)."}),l.jsx(qs,{items:[["Molecular weight",Q(f.mw,2)],["Z suction",Q(p.Z,4)],["Density suction",`${Q(p.rho,2)} kg/m³`],["cp/cv",Q(p.k,3)],["Isentropic exponent",Q(p.n_s,3)],["Speed of sound",`${Q(p.sound,0)} m/s`],["HC dew point @ Ps",f.hydrocarbon_dew_point_c===null?"none found":`${Q(f.hydrocarbon_dew_point_c)} °C`],["pH₂S suction",`${Q(f.ph2s_suction_bar,3)} bar`]]}),l.jsxs("div",{className:"grid",children:[l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Property chart"}),l.jsx("div",{className:"chips",children:m.map(([g,d])=>l.jsx("button",{className:`chip ${a===g?"on":""}`,onClick:()=>o(g),children:d},g))}),n&&l.jsx(wt,{data:n.map((g,d)=>({x:g.rows.map(_=>_.T_c),y:g.rows.map(_=>_[a]),name:`${g.P_bara} bara`,mode:"lines",line:{color:it[d]}})),layout:{xaxis:{title:"Temperature (°C)"},yaxis:{title:(S=m.find(g=>g[0]===a))==null?void 0:S[1]}}})]}),l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Phase envelope"}),!r&&l.jsx("button",{className:"btn",disabled:!!c,onClick:async()=>{h("env");try{s(await et.envelope({components:u,p_min_bara:1,p_max_bara:150,points:22}))}finally{h("")}},children:c?"Computing (≈10 s)…":"Compute phase envelope"}),r&&l.jsx(wt,{data:[{x:r.dew.map(g=>g.T_c),y:r.dew.map(g=>g.P_bara),name:"Dew points",mode:"markers",marker:{color:it[0],size:6}},{x:r.bubble.map(g=>g.T_c),y:r.bubble.map(g=>g.P_bara),name:"Bubble points",mode:"markers",marker:{color:it[3],size:6}},...e.cases.map((g,d)=>({x:g.path.map(_=>_[0]),y:g.path.map(_=>_[1]),name:`${g.case} compression path`,mode:"lines",line:{color:it[(d+1)%8],dash:"dot"}}))],layout:{xaxis:{title:"Temperature (°C)"},yaxis:{title:"Pressure (bara)"}}}),r&&l.jsx("p",{className:"muted",children:r.model})]})]}),l.jsxs("div",{className:"card",style:{marginTop:14},children:[l.jsx("h3",{children:"Operating cases on the real-gas model"}),l.jsx(mt,{rows:e.cases,cols:[["Case",g=>g.case],["PR",g=>g.pressure_ratio,3],["Flow kg/s",g=>g.mass_flow_kg_s,2],["Q1 Am³/h",g=>g.suction_volume_flow_m3_s*3600,0],["Hp kJ/kg",g=>g.polytropic_head_j_kg/1e3],["Hs kJ/kg",g=>g.isentropic_head_j_kg/1e3],["ηp",g=>g.polytropic_efficiency,3],["ηs",g=>g.isentropic_efficiency,3],["ηp Schultz",g=>g.schultz.eta_p,3],["Td °C",g=>g.discharge.T-273.15],["Td isen. °C",g=>g.isentropic_discharge_temperature_c],["Z2",g=>g.discharge.Z,4],["Gas kW",g=>g.gas_power_kw,0],["Shaft kW",g=>g.shaft_power_kw,0]]})]}),l.jsx(pn,{trace:(x=e.cases[0])==null?void 0:x.trace})]})}function SC(t){const e=t.results,[n,i]=ne.useState("head");if(!e)return l.jsx(Ai,{results:e});const r=e.sizing,s=e.performance_map,a=n==="head"?"head_kj_kg":n,o={head:"Polytropic head (kJ/kg)",pressure_ratio:"Pressure ratio",eta_p:"Polytropic efficiency",power_kw:"Power (kW)"},c={head:"head_kj_kg",pressure_ratio:"",eta_p:"eta_p",power_kw:"power_kw"},h=e.operating_points.filter(u=>u.q_am3_h);return l.jsxs(l.Fragment,{children:[l.jsx("h2",{children:"Compressor selection & aerodynamic performance"}),l.jsx("p",{className:"lead",children:"Type selection, preliminary sizing (stages, speed, diameter, sections and casings), stage design and the stage-stacked performance map with surge and stonewall limits."}),l.jsx(qs,{items:[["Configuration",r.configuration],["Recommended type",r.type_selection.recommended],["Speed",`${Q(r.speed_rpm,0)} rpm`],["Impeller D2",`${Q(r.impeller_diameter_m*1e3,0)} mm`],["Tip speed",`${Q(r.tip_speed_m_s,1)} m/s`],["Machine Mach",Q(r.machine_mach,3)],["Polytropic head",`${Q(r.polytropic_head_total_j_kg/1e3,1)} kJ/kg`],["ηp overall",Q(r.polytropic_efficiency_overall,3)],["Shaft power",`${Q(r.shaft_power_kw,0)} kW`],["Driver rating",`${Q(r.driver_rating_kw,0)} kW`],["Specific speed Ns",Q(r.specific_speed,3)],["Specific diameter Ds",Q(r.specific_diameter,2)]]}),l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Performance map"}),l.jsx("div",{className:"chips",children:["head","pressure_ratio","eta_p","power_kw"].map(u=>l.jsx("button",{className:`chip ${n===u?"on":""}`,onClick:()=>i(u),children:o[u]},u))}),l.jsx(wt,{height:420,data:[...s.lines.map((u,f)=>({x:u.points.map(p=>p.q_am3_h),y:u.points.map(p=>p[a]),mode:"lines",name:`${Q(u.speed_frac*100,0)} % (${Q(u.speed_rpm,0)} rpm)`,line:{color:it[0],width:1.2+.4*(f%2)}})),{x:s.surge_line.map(u=>u.q_am3_h),y:s.surge_line.map(u=>u[a]),name:"Surge limit",mode:"lines",line:{color:it[3],width:2.2}},{x:s.stonewall_line.map(u=>u.q_am3_h),y:s.stonewall_line.map(u=>u[a]),name:"Stonewall",mode:"lines",line:{color:it[5],dash:"dash"}},...c[n]?[{x:h.map(u=>u.q_am3_h),y:h.map(u=>u[c[n]]),text:h.map(u=>u.case),mode:"markers+text",textposition:"top right",name:"Operating cases",marker:{color:it[1],size:10}}]:[]],layout:{xaxis:{title:"Suction volume flow (Am³/h)"},yaxis:{title:o[n]}}})]}),l.jsxs("div",{className:"grid",style:{marginTop:14},children:[l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Operating cases on the map"}),l.jsx(mt,{rows:e.operating_points,cols:[["Case",u=>u.case],["Speed %",u=>(u.speed_frac??NaN)*100],["rpm",u=>u.speed_rpm,0],["ηp",u=>u.eta_p,3],["Pd bara",u=>u.discharge_bara,2],["Td °C",u=>u.discharge_c],["Power kW",u=>u.power_kw,0],["Surge margin %",u=>(u.surge_margin??NaN)*100],["Notes",u=>(u.notes??[]).join("; ")||(u.feasible?"ok":"")]]})]}),l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Compressor type screening"}),l.jsxs("p",{children:["Suction flow ",Q(r.type_selection.suction_flow_am3_h,0)," Am³/h → ",l.jsx("strong",{children:r.type_selection.recommended})]}),l.jsx(mt,{rows:Object.entries(r.type_selection.ranges_am3_h),cols:[["Type",u=>u[0]],["From Am³/h",u=>u[1][0],0],["To Am³/h",u=>u[1][1],0]]}),r.type_selection.notes.map(u=>l.jsx("p",{className:"muted",children:u},u))]})]}),l.jsxs("div",{className:"card",style:{marginTop:14},children:[l.jsx("h3",{children:"Stage-by-stage design"}),l.jsx(mt,{rows:r.stages,cols:[["Stage",u=>String(u.index+1)],["Section",u=>String(u.section+1)],["φ",u=>u.phi,4],["ψ",u=>u.psi,3],["ηp",u=>u.eta,3],["Q in m³/s",u=>u.Q_in_m3_s,3],["P in",u=>u.P_in_bara,2],["P out",u=>u.P_out_bara,2],["T in °C",u=>u.T_in_c],["T out °C",u=>u.T_out_c],["Power kW",u=>u.power_kw,0]]})]}),l.jsx(pn,{trace:r.trace}),l.jsx(pn,{trace:s.trace})]})}function MC({fea:t}){const[e,n]=ne.useState(0),[i,r]=ne.useState("von_mises_mpa"),s=t.impellers[Math.min(e,t.impellers.length-1)];return l.jsxs("section",{className:"card accent",style:{marginTop:14},children:[l.jsxs("div",{className:"row",children:[l.jsx("h3",{style:{margin:0},children:"Impeller FEA — axisymmetric model, 3D result view"}),l.jsx("div",{className:"chips",style:{margin:0},children:t.impellers.map((a,o)=>l.jsxs("button",{className:`chip ${e===o?"on":""}`,onClick:()=>n(o),children:["Impeller ",a.impeller]},o))})]}),l.jsx(qs,{items:[["Peak σvm at MCS",`${Q(s.max_vm_mcs_mpa,0)} MPa`],["Peak σvm at 115 %",`${Q(s.max_vm_overspeed_mpa,0)} MPa`],["Yield use MCS / 115 %",`${Q(s.yield_utilisation_mcs,2)} / ${Q(s.yield_utilisation_overspeed,2)}`],["Tip radial growth",`${Q(s.tip_radial_growth_um,0)} µm`],["Eye growth / axial shift",`${Q(s.eye_radial_growth_um,0)} / ${Q(s.eye_axial_shift_um,0)} µm`],["Mesh",`${s.elements} elements · ${s.nodes} nodes`]]}),l.jsxs("div",{className:"grid",children:[l.jsx(aC,{fea:s},e),l.jsxs("div",{children:[l.jsx("div",{className:"chips",children:sh.slice(0,5).map(([a,o])=>l.jsx("button",{className:`chip ${i===a?"on":""}`,onClick:()=>r(a),children:o},a))}),l.jsx(oC,{model:s.model,field:i,caseName:"MCS"}),l.jsxs("p",{className:"muted",children:["Meridional section at MCS (",s.elements," quads; hover an element for its value). Range ",Q(Math.min(...s.model.cases.MCS[i]),0),"–",Q(Math.max(...s.model.cases.MCS[i]),0),"."]}),l.jsx("p",{className:"muted",children:"Eye growth and axial shift feed the eye-seal clearance check; blade stresses need a 3D cyclic-sector model."})]})]})]})}function EC(t){const e=gc(t),[n,i]=ne.useState(0);if(!e)return l.jsx(Ai,{results:t.results});const r=e.impellers.impellers,s=e.impeller_stress.impellers,a=s[Math.min(n,s.length-1)].mcs;return l.jsxs(l.Fragment,{children:[l.jsx("h2",{children:"Impeller geometry & stress"}),l.jsx("p",{className:"lead",children:"Impeller dimensions, blade configuration, mass and inertia, centrifugal and thermal stress (axisymmetric rotating-disk FE) and axial thrust."}),l.jsx("div",{className:"card",children:l.jsx(mt,{rows:r,cols:[["Imp.",o=>String(o.index+1)],["D2 mm",o=>o.D2_mm,0],["b2 mm",o=>o.b2_mm],["b2/D2",o=>o.b2_D2,4],["Eye mm",o=>o.D1_eye_mm,0],["Hub mm",o=>o.hub_mm,0],["Blades",o=>String(o.blades)],["Slip σ",o=>o.slip_factor,3],["Work coeff.",o=>o.work_coefficient,3],["W1 tip m/s",o=>o.inlet_w1_tip_m_s,0],["Mrel1",o=>o.inlet_relative_mach,3],["Mass kg",o=>o.mass_kg],["Ip kg·m²",o=>o.ip_kgm2,3],["It kg·m²",o=>o.it_kgm2,3],["Thrust kN",o=>o.thrust_n/1e3,2],["Umax mat. m/s",o=>o.max_tip_speed_for_material_m_s,0]]})}),l.jsxs("div",{className:"grid",style:{marginTop:14},children:[l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Disk stress at MCS"}),l.jsx("div",{className:"chips",children:s.map((o,c)=>l.jsxs("button",{className:`chip ${n===c?"on":""}`,onClick:()=>i(c),children:["Impeller ",o.impeller]},c))}),l.jsx(wt,{data:[{x:a.r_m.map(o=>o*1e3),y:a.sigma_t_pa.map(o=>o/1e6),name:"Tangential",mode:"lines"},{x:a.r_m.map(o=>o*1e3),y:a.sigma_r_pa.map(o=>o/1e6),name:"Radial",mode:"lines"},{x:a.r_m.map(o=>o*1e3),y:a.von_mises_pa.map(o=>o/1e6),name:"von Mises",mode:"lines"}],layout:{xaxis:{title:"Radius (mm)"},yaxis:{title:"Stress (MPa)"}}})]}),l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Stress summary"}),l.jsx(mt,{rows:s,cols:[["Imp.",o=>String(o.impeller)],["σvm MCS MPa",o=>o.max_vm_mcs_mpa,0],["σvm 115 % MPa",o=>o.max_vm_overspeed_mpa,0],["σθ avg 115 % MPa",o=>o.avg_tangential_overspeed_mpa,0],["avg / 0.9 Sy",o=>o.overspeed_average_ratio,2],["Burst rpm",o=>o.burst_speed_rpm,0],["Burst margin",o=>o.burst_margin,2],["Tip growth µm",o=>o.tip_growth_um,0]]})]})]}),e.impeller_fea&&l.jsx(MC,{fea:e.impeller_fea}),l.jsx(pn,{trace:e.impellers.trace}),l.jsx(pn,{trace:e.impeller_stress.trace}),e.impeller_fea&&l.jsx(pn,{trace:e.impeller_fea.trace})]})}function wC(t){const e=gc(t),[n,i]=ne.useState(-1);if(!e)return l.jsx(Ai,{results:t.results});const r=e.rotor,s=e.shaft,a=e.lateral,o=(a.modes_at_mcs??[]).filter(f=>f.whirl==="forward"&&f.shape),c=n>=0&&o[n]?{z:a.z_m,shape:o[n].shape}:null,h=t.results.scene,u=e.mass_properties;return l.jsxs(l.Fragment,{children:[l.jsx("h2",{children:"Rotor assembly & shaft design"}),l.jsx("p",{className:"lead",children:"Parametric stepped shaft with impellers, balance piston, seals, journals, thrust collar and coupling; mass properties, thrust balance, stresses, fatigue and deflection. Override the geometry in the shaft inputs below."}),l.jsx(qs,{items:[["Rotor mass",`${Q(u.mass_kg,0)} kg`],["Centre of gravity",`${Q(u.cg_m*1e3,0)} mm`],["Ip / It(cg)",`${Q(u.ip_kgm2,2)} / ${Q(u.it_cg_kgm2,1)} kg·m²`],["Bearing span",`${Q(r.bearing_span_m*1e3,0)} mm`],["Span / D",Q(r.span_to_diameter,2)],["Shaft at impellers",`${Q(r.shaft_diameter_impellers_m*1e3,0)} mm`],["Journal",`${Q(r.journal_diameter_m*1e3,0)} mm`],["Torque",`${Q(r.casing_torque_nm,0)} N·m`],["Balance piston",`${Q(r.balance_piston_diameter_m*1e3,0)} mm`],["Residual thrust",`${Q(r.thrust.residual_n/1e3,1)} kN`],["Min fatigue SF",Q(s.min_fatigue_safety,2)],["Mid-span sag",`${Q(s.midspan_sag_um,1)} µm`]]}),l.jsxs("div",{className:"card",children:[l.jsxs("div",{className:"row",style:{marginBottom:8},children:[l.jsx("h3",{style:{margin:0},children:"3D rotor"}),l.jsxs("div",{className:"chips",style:{margin:0},children:[l.jsx("button",{className:`chip ${n<0?"on":""}`,onClick:()=>i(-1),children:"Static"}),o.slice(0,4).map((f,p)=>l.jsxs("button",{className:`chip ${n===p?"on":""}`,onClick:()=>i(p),children:["Mode ",p+1,": ",Q(f.freq_cpm,0)," cpm, δ ",Q(f.logdec,2)]},p))]})]}),h&&l.jsx(uC,{scene:h,mode:c}),l.jsx("p",{className:"muted",children:"Drag to orbit, scroll to zoom. Mode animation shows forward whirl of the damped mode shape at MCS (amplitude exaggerated)."})]}),l.jsxs("div",{className:"grid",style:{marginTop:14},children:[l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Bending moment & torque"}),l.jsx(wt,{data:[{x:s.moment_diagram.z_m,y:s.moment_diagram.moment_nm,name:"Gravity bending moment (N·m)",mode:"lines"},{x:s.moment_diagram.z_m,y:s.moment_diagram.torque_nm,name:"Torque (N·m)",mode:"lines",yaxis:"y2"}],layout:{xaxis:{title:"z (m)"},yaxis:{title:"Moment (N·m)"},yaxis2:{overlaying:"y",side:"right",title:"Torque (N·m)"}}})]}),l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Shaft safety factors"}),l.jsx(wt,{data:[{x:s.points.map(f=>f.z_m),y:s.points.map(f=>f.fatigue_safety),name:"Fatigue (DE-Goodman)",mode:"markers+lines"},{x:s.points.map(f=>f.z_m),y:s.points.map(f=>Math.min(f.yield_safety,100)),name:"Yield (transient torque)",mode:"markers+lines"}],layout:{xaxis:{title:"z (m)"},yaxis:{title:"Safety factor",type:"log"},shapes:[{type:"line",xref:"paper",x0:0,x1:1,y0:1.5,y1:1.5,line:{color:it[3],dash:"dash"}}]}})]})]}),l.jsxs("div",{className:"grid",style:{marginTop:14},children:[l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Shaft sections"}),l.jsx(mt,{rows:r.sections,cols:[["Section",f=>f.label],["z0 mm",f=>f.z0_m*1e3,0],["z1 mm",f=>f.z1_m*1e3,0],["OD mm",f=>f.od_m*1e3,0],["ID mm",f=>f.id_m*1e3,0]]})]}),l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Attached masses"}),l.jsx(mt,{rows:r.masses,cols:[["Item",f=>f.label],["z mm",f=>f.z_m*1e3,0],["Mass kg",f=>f.mass_kg],["Ip kg·m²",f=>f.ip_kgm2,3],["It kg·m²",f=>f.it_kgm2,3]]})]})]}),l.jsxs("div",{className:"card",style:{marginTop:14},children:[l.jsx("h3",{children:"Stress at shoulders and sections"}),l.jsx(mt,{rows:s.points,cols:[["z mm",f=>f.z_m*1e3,0],["Type",f=>f.kind],["d mm",f=>f.d_mm,0],["Kt b",f=>f.kt_bending,2],["Kf",f=>f.kf,2],["M N·m",f=>f.moment_nm,0],["T N·m",f=>f.torque_nm,0],["σb MPa",f=>f.bending_mpa,2],["τ MPa",f=>f.torsion_mpa,1],["σvm MPa",f=>f.von_mises_mpa,1],["Se MPa",f=>f.Se_mpa,0],["SF fatigue",f=>f.fatigue_safety,2],["SF yield",f=>f.yield_safety,2]]})]}),l.jsxs("div",{className:"card",style:{marginTop:14},children:[l.jsx("h3",{children:"Shaft design inputs"}),l.jsx(Un,{schema:t.schema,def:"ShaftDesign",value:t.project.shaft,onChange:f=>on(t,"shaft",f)})]}),l.jsx(pn,{trace:r.trace}),l.jsx(pn,{trace:s.trace})]})}function TC(t){const e=gc(t),[n,i]=ne.useState("k");if(!e)return l.jsx(Ai,{results:t.results});const r=e.bearings.bearings,s=e.seals,a=s.end_seals.conditioning,o=[];return Object.entries(r).forEach(([c,h],u)=>{(n==="k"?["kxx","kyy","kxy","kyx"]:["cxx","cyy","cxy","cyx"]).forEach((p,m)=>o.push({x:h.speeds_rpm,y:h.rows.map(S=>S[p]),name:`${c} ${p}`,mode:"lines+markers",line:{color:it[m],dash:u?"dot":"solid"}}))}),l.jsxs(l.Fragment,{children:[l.jsx("h2",{children:"Bearings & seals"}),l.jsx("p",{className:"lead",children:"Hydrodynamic journal bearings (short-bearing Reynolds solution with pad equilibrium), thrust bearing, labyrinths, balance piston, aerodynamic cross-coupling and dry-gas-seal gas conditioning."}),l.jsxs("div",{className:"grid",children:[l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Bearing dynamic coefficients vs speed"}),l.jsxs("div",{className:"chips",children:[l.jsx("button",{className:`chip ${n==="k"?"on":""}`,onClick:()=>i("k"),children:"Stiffness (N/m)"}),l.jsx("button",{className:`chip ${n==="c"?"on":""}`,onClick:()=>i("c"),children:"Damping (N·s/m)"})]}),l.jsx(wt,{data:o,layout:{xaxis:{title:"Speed (rpm)"},yaxis:{title:n==="k"?"Stiffness (N/m)":"Damping (N·s/m)"}}})]}),l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Bearing performance at MCS"}),l.jsx(mt,{rows:Object.entries(e.bearing_rated),cols:[["Bearing",c=>c[0]],["Load N",c=>c[1].load_n,0],["Unit load MPa",c=>c[1].unit_load_mpa,2],["U m/s",c=>c[1].surface_speed_m_s,0],["ε",c=>c[1].eccentricity,3],["hmin µm",c=>c[1].h_min_m*1e6,1],["Loss kW",c=>c[1].power_loss_kw,1],["Oil L/min",c=>c[1].oil_flow_l_min,0],["Babbitt °C (est.)",c=>c[1].babbitt_temperature_est_c,0]]}),l.jsx("h3",{style:{marginTop:12},children:"Thrust bearing"}),l.jsx(mt,{rows:[e.rotor.thrust],cols:[["Gross kN",c=>c.gross_impeller_n/1e3,1],["Piston kN",c=>c.balance_piston_n/1e3,1],["Residual kN",c=>c.residual_n/1e3,1],["Design load kN",c=>c.thrust_bearing_load_n/1e3,1],["Collar mm",c=>c.collar_diameter_m*1e3,0]]})]})]}),l.jsxs("div",{className:"grid",style:{marginTop:14},children:[l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Labyrinths and aerodynamic cross-coupling"}),l.jsx(mt,{rows:s.labyrinths,cols:[["Stage",c=>String(c.stage)],["Eye Ø mm",c=>c.eye_diameter_mm,0],["Clearance mm",c=>c.eye_clearance_mm,3],["Eye leak %",c=>c.eye_leakage_pct,2],["Interstage kg/s",c=>c.interstage_leakage_kg_s,3],["Wachel q MN/m",c=>c.wachel_q_n_m/1e6,3]]}),l.jsxs("p",{children:["Balance piston Ø ",Q(s.balance_piston.diameter_mm,0)," mm · leakage ",Q(s.balance_piston.leakage_pct,2)," % · total Qa ",Q(s.total_wachel_q_n_m/1e6,2)," MN/m"]})]}),l.jsxs("div",{className:"card",children:[l.jsxs("h3",{children:["Shaft-end seals: ",String(s.end_seals.type).replace(/_/g," ")]}),a?l.jsx(mt,{rows:[["Seal pressure",`${Q(s.end_seals.seal_pressure_bara,2)} bara`],["Primary leakage per seal",`${Q(s.end_seals.primary_leakage_nm3_h_per_seal,1)} Nm³/h`],["Seal gas supply (total)",`${Q(s.end_seals.seal_gas_supply_nm3_h_total,0)} Nm³/h`],["Hydrocarbon dew point at supply",`${Q(a.hydrocarbon_dew_point_c)} °C`],["Supply temperature",`${Q(a.supply_temperature_c)} °C`],["Temperature after expansion (JT)",`${Q(a.temperature_after_expansion_c)} °C`],["Superheat margin",`${Q(a.superheat_margin_c)} °C`],["Heater required",a.heater_required?"yes":"no"],["Condensation risk after expansion",a.condensation_risk_after_expansion?"yes":"no"]],cols:[["Item",c=>c[0]],["Value",c=>c[1]]]}):l.jsx("p",{className:"muted",children:"No dry gas seal conditioning for this seal type."})]})]}),l.jsxs("div",{className:"grid",style:{marginTop:14},children:[l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Bearing inputs"}),l.jsx(Un,{schema:t.schema,def:"BearingDesign",value:t.project.bearings,onChange:c=>on(t,"bearings",c)})]}),l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Seal inputs"}),l.jsx(Un,{schema:t.schema,def:"SealDesign",value:t.project.seals,onChange:c=>on(t,"seals",c)})]})]}),l.jsx(pn,{trace:e.bearings.trace}),l.jsx(pn,{trace:s.trace})]})}function CC(t){const e=gc(t),[n,i]=ne.useState(0);if(!e)return l.jsx(Ai,{results:t.results});const r=e.lateral;if(!r.campbell)return l.jsx("p",{className:"muted",children:"Lateral analysis not available for this run level."});const s=r.speeds,a=r.campbell,o=(f,p)=>{const m=[],S=[],x=[];return a.speeds_rpm.forEach((g,d)=>a.modes[d].forEach(_=>{(_.whirl===f||f==="backward"&&_.whirl==="mixed")&&_.logdec>1===p&&(m.push(g),S.push(_.freq_hz*60),x.push(`log dec ${Q(_.logdec,3)}`))})),{x:m,y:S,text:x}},c=[["Min",s.min_rpm],["MCS",s.mcs_rpm],["Trip",s.trip_rpm]].map(([,f])=>({type:"line",x0:f,x1:f,yref:"paper",y0:0,y1:1,line:{color:it[2],dash:"dot",width:1}})),h=r.unbalance_cases[Math.min(n,r.unbalance_cases.length-1)],u=r.stability;return l.jsxs(l.Fragment,{children:[l.jsx("h2",{children:"Lateral rotordynamics"}),l.jsx("p",{className:"lead",children:"Finite-element rotor (Timoshenko beams, gyroscopics, speed-dependent bearings), Campbell diagram, undamped critical-speed map, unbalance response with API 617-style amplification factor / separation margin / amplitude checks, and Level I stability with modified-Wachel cross-coupling."}),l.jsx(qs,{items:[["Speed range",`${Q(s.min_rpm,0)}–${Q(s.mcs_rpm,0)} rpm`],["Trip",`${Q(s.trip_rpm,0)} rpm`],["1st critical (rigid supports)",`${Q(u.first_critical_rigid_rpm,0)} rpm`],["Critical speed ratio",Q(u.critical_speed_ratio,2)],["Qa (Wachel)",`${Q(u.qa_n_m/1e6,2)} MN/m`],["Q0 (zero log dec)",u.q0_n_m?`${Q(u.q0_n_m/1e6,2)} MN/m`:"> range"],["Log dec, no Qa",Q(u.logdec_no_qa,3)],["Log dec with Qa",Q(u.logdec_with_qa,3)],["Level I",u.level1_pass?"pass":"Level II required"],["Amplitude limit",`${Q(r.amplitude_limit_um,1)} µm pk-pk`]]}),l.jsxs("div",{className:"grid",children:[l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Campbell diagram"}),l.jsx(wt,{height:380,data:[{...o("forward",!1),name:"Forward",mode:"markers",marker:{color:it[0],size:6}},{...o("backward",!1),name:"Backward",mode:"markers",marker:{color:it[5],size:6,symbol:"square"}},{...o("forward",!0),name:"Forward (δ > 1)",mode:"markers",marker:{color:it[0],size:5,opacity:.25}},{...o("backward",!0),name:"Backward (δ > 1)",mode:"markers",marker:{color:it[5],size:5,opacity:.25,symbol:"square"}},{x:a.speeds_rpm,y:a.speeds_rpm,name:"1X",mode:"lines",line:{color:it[3]}}],layout:{xaxis:{title:"Rotor speed (rpm)"},yaxis:{title:"Damped natural frequency (cpm)",range:[0,Math.max(...a.speeds_rpm)*2]},shapes:c}})]}),l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Undamped critical-speed map"}),l.jsx(wt,{height:380,data:[0,1,2,3].map(f=>({x:r.undamped_critical_map.k_n_m,y:r.undamped_critical_map.critical_speeds_rpm.map(p=>p[f]),name:`Mode ${f+1}`,mode:"lines"})),layout:{xaxis:{title:"Bearing stiffness (N/m)",type:"log"},yaxis:{title:"Critical speed (rpm)",type:"log"},shapes:[s.mcs_rpm,s.min_rpm].map(f=>({type:"line",xref:"paper",x0:0,x1:1,y0:f,y1:f,line:{color:it[2],dash:"dot"}}))}})]})]}),l.jsxs("div",{className:"card",style:{marginTop:14},children:[l.jsxs("div",{className:"row",children:[l.jsx("h3",{style:{margin:0},children:"Unbalance response"}),l.jsx("div",{className:"chips",style:{margin:0},children:r.unbalance_cases.map((f,p)=>l.jsxs("button",{className:`chip ${n===p?"on":""}`,onClick:()=>i(p),children:["Mode ",f.mode," unbalance"]},p))})]}),h&&l.jsxs(l.Fragment,{children:[l.jsx(wt,{height:360,data:Object.entries(h.response.probes).map(([f,p],m)=>({x:h.response.speeds_rpm,y:p.major_um,name:`z = ${Q(Number(f),3)} m`,mode:"lines",line:{color:it[m%8]}})),layout:{xaxis:{title:"Speed (rpm)"},yaxis:{title:"Response major semi-axis (µm)",type:"log"},shapes:c}}),l.jsxs("p",{className:"muted",children:["Unbalance: ",h.unbalances.map(f=>`${Q(f.g_mm,0)} g·mm at z = ${Q(f.z,3)} m, ${f.phase_deg}°`).join("; ")]}),l.jsxs("div",{className:"grid",children:[l.jsx(mt,{rows:h.peaks,cols:[["Critical rpm",f=>f.speed_rpm,0],["AF",f=>f.af,2],["Method",f=>f.af_method??""],["Amplitude µm",f=>f.amplitude_um,2],["SM %",f=>f.separation_pct],["Required %",f=>f.required_separation_pct??"AF < 2.5"],["Result",f=>f.pass?"pass":"FAIL"]]}),l.jsx(mt,{rows:[...h.amplitude_checks,...h.clearance_checks],cols:[["Location",f=>f.location],["Value",f=>f.pk_pk_um_1x_unbalance??f.max_pk_pk_um],["Limit",f=>f.limit_um??f.diametral_clearance_um*t.project.criteria.clearance_ratio_limit],["Result",f=>f.pass?"pass":"FAIL"]]})]})]})]}),l.jsxs("div",{className:"grid",style:{marginTop:14},children:[l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Forward mode shapes at MCS"}),l.jsx(wt,{data:r.modes_at_mcs.filter(f=>f.whirl==="forward").slice(0,4).map(f=>({x:r.z_m,y:f.shape,name:`${Q(f.freq_cpm,0)} cpm, δ ${Q(f.logdec,2)}`,mode:"lines"})),layout:{xaxis:{title:"z (m)"},yaxis:{title:"Normalised amplitude"},shapes:e.rotor.bearing_z_m.map(f=>({type:"line",x0:f,x1:f,yref:"paper",y0:0,y1:1,line:{color:it[5],dash:"dash"}}))}})]}),l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Level I stability: log dec vs cross-coupling"}),l.jsx(wt,{data:[{x:u.logdec_vs_q.map(f=>f[0]/1e6),y:u.logdec_vs_q.map(f=>f[1]),mode:"lines+markers",name:"First forward mode"},{x:[u.qa_n_m/1e6],y:[u.logdec_with_qa],mode:"markers",name:"Qa",marker:{size:12,color:it[1]}}],layout:{xaxis:{title:"Cross-coupled stiffness Q (MN/m)"},yaxis:{title:"Log decrement"},shapes:[{type:"line",xref:"paper",x0:0,x1:1,y0:t.project.criteria.lateral_logdec_min,y1:t.project.criteria.lateral_logdec_min,line:{color:it[3],dash:"dash"}}]}})]})]}),l.jsx(pn,{trace:r.trace})]})}function bC(t){var o,c,h;const e=t.results,[n,i]=ne.useState(0);if(!e)return l.jsx(Ai,{results:e});const r=e.torsional,s=r.interference,a=r.natural.modes;return l.jsxs(l.Fragment,{children:[l.jsx("h2",{children:"Torsional vibration of the train"}),l.jsx("p",{className:"lead",children:"Driver, coupling(s), gearbox and compressor shaft line as a lumped model referred to compressor speed: natural frequencies, mode shapes, interference diagram with separation checks, forced response and stresses."}),l.jsxs("div",{className:"grid",children:[l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Interference diagram"}),l.jsx(wt,{height:380,data:[...Object.entries(s.lines_hz).map(([u,f],p)=>({x:s.speeds_rpm,y:f,name:u,mode:"lines",line:{color:it[p%8]}})),...a.slice(0,4).map(u=>({x:[0,Math.max(...s.speeds_rpm)],y:[u.freq_hz,u.freq_hz],mode:"lines",name:`${Q(u.freq_hz,1)} Hz`,line:{color:"#888",dash:"dash",width:1}}))],layout:{xaxis:{title:"Compressor speed (rpm)"},yaxis:{title:"Frequency (Hz)",range:[0,Math.min(4e3,(((o=a[3])==null?void 0:o.freq_hz)??1e3)*1.3)]},shapes:[e.casings[0].lateral.speeds.min_rpm,e.casings[0].lateral.speeds.mcs_rpm].map(u=>({type:"line",x0:u,x1:u,yref:"paper",y0:0,y1:1,line:{color:it[2],dash:"dot"}}))}})]}),l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Mode shapes"}),l.jsx("div",{className:"chips",children:a.slice(0,5).map((u,f)=>l.jsxs("button",{className:`chip ${n===f?"on":""}`,onClick:()=>i(f),children:[Q(u.freq_hz,1)," Hz"]},f))}),l.jsx(wt,{data:[{x:r.natural.stations,y:((c=a[n])==null?void 0:c.shape)??[],mode:"lines+markers",name:"Relative twist angle"}],layout:{xaxis:{title:"",tickangle:-30},yaxis:{title:"Normalised angle"},margin:{b:110}}}),l.jsxs("p",{className:"muted",children:["Dominant shaft: ",(h=a[n])==null?void 0:h.dominant_shaft]})]})]}),l.jsxs("div",{className:"grid",style:{marginTop:14},children:[l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Forced response: 1 % rated torque at 1X, applied at the coupling"}),l.jsx(wt,{data:Object.entries(r.forced.dynamic_torque_nm).map(([u,f])=>({x:r.forced.speeds_rpm,y:f,name:u,mode:"lines"})),layout:{xaxis:{title:"Speed (rpm)"},yaxis:{title:"Dynamic torque (N·m)",type:"log"}}})]}),l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Separation checks"}),l.jsx(mt,{rows:s.checks,cols:[["Mode Hz",u=>u.mode_hz,1],["Excitation",u=>u.excitation],["Band Hz",u=>`${Q(u.band_hz[0],0)}–${Q(u.band_hz[1],0)}`],["Separation %",u=>u.separation*100],["Result",u=>u.pass?"pass":u.excitation.includes("VFD")?"evaluate":"FAIL"]]})]})]}),r.startup&&l.jsxs("div",{className:"card",style:{marginTop:14},children:[l.jsx("h3",{children:"Synchronous motor start-up transient"}),l.jsx(wt,{data:Object.entries(r.startup.shaft_torque_nm).map(([u,f])=>({x:r.startup.t_s,y:f,name:u,mode:"lines"})),layout:{xaxis:{title:"Time (s)"},yaxis:{title:"Shaft torque (N·m)"}}})]}),l.jsxs("div",{className:"grid",style:{marginTop:14},children:[l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Shaft stresses"}),l.jsx(mt,{rows:r.stress,cols:[["Shaft",u=>u.shaft],["Ø mm",u=>u.diameter_mm,0],["Mean N·m",u=>u.mean_torque_nm,0],["Max dyn. N·m",u=>u.max_dynamic_torque_nm,0],["τm MPa",u=>u.mean_shear_mpa,1],["τa MPa",u=>u.alternating_shear_mpa,2],["Goodman SF",u=>u.goodman_safety,2]]})]}),l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Train inputs"}),l.jsx(Un,{schema:t.schema,def:"TrainDesign",value:t.project.train,onChange:u=>on(t,"train",u)})]})]}),l.jsx(pn,{trace:r.trace})]})}function AC(t){const e=t.results;if(!e)return l.jsx(Ai,{results:e});const n=e.lube,i=e.piping;return l.jsxs(l.Fragment,{children:[l.jsx("h2",{children:"Lube oil & piping"}),l.jsx("p",{className:"lead",children:"Oil flow from bearing losses, pump, cooler and reservoir sizing (API 614 considerations); suction and discharge line sizing, compressible pressure drop, recycle valve (IEC 60534) and flow meter (ISO 5167); system curve."}),l.jsxs("div",{className:"grid",children:[l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Lube oil system"}),l.jsx(mt,{rows:[["Journal losses",`${Q(n.journal_loss_kw,1)} kW`],["Thrust loss",`${Q(n.thrust_loss_kw,1)} kW`],["Normal oil flow",`${Q(n.normal_flow_l_min,0)} L/min`],["Pump rated flow",`${Q(n.pump_rated_flow_l_min,0)} L/min`],["Pump shaft power",`${Q(n.pump_shaft_kw,1)} kW`],["Cooler duty",`${Q(n.cooler_duty_kw,1)} kW`],["Cooler LMTD",`${Q(n.cooler_lmtd_c,1)} °C`],["Cooler area (incl. fouling)",`${Q(n.cooler_area_m2,2)} m²`],["Cooling water",`${Q(n.cooling_water_m3_h,1)} m³/h`],["Reservoir working volume",`${Q(n.reservoir_working_l,0)} L`],["Oil viscosity at drain",`${Q(n.oil_viscosity_cst_at_drain,1)} cSt`]],cols:[["Item",r=>r[0]],["Value",r=>r[1]]]})]}),l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Process piping"}),l.jsx(mt,{rows:["suction","discharge"].map(r=>({side:r,...i[r]})),cols:[["Line",r=>r.side],["NPS",r=>String(r.nps_in)],["ID mm",r=>r.id_m*1e3,0],["v m/s",r=>r.velocity_m_s],["ρv² Pa",r=>r.rho_v2_pa,0],["Mach",r=>r.mach,3],["Re",r=>r.reynolds,0],["f",r=>r.friction_factor,4],["ΔP bar",r=>r.dp_bar,3]]}),l.jsxs("p",{children:["Recycle valve Cv ",Q(i.recycle_valve.cv,0)," (x = ",Q(i.recycle_valve.x,2),", ",i.recycle_valve.choked?"choked":"not choked",") · Orifice β ",Q(i.flowmeter.beta,2),", C ",Q(i.flowmeter.C,4),", ΔP ",Q(i.flowmeter.dp_pa/1e3,1)," kPa"]})]})]}),l.jsxs("div",{className:"card",style:{marginTop:14},children:[l.jsx("h3",{children:"Compressor and system curves at rated speed"}),l.jsx(wt,{data:[{x:i.system_curve.map(r=>r.q_am3_h),y:i.system_curve.map(r=>r.compressor_head_kj_kg),name:"Compressor (100 %)",mode:"lines"},{x:i.system_curve.map(r=>r.q_am3_h),y:i.system_curve.map(r=>r.system_head_kj_kg),name:"System",mode:"lines",line:{dash:"dash"}}],layout:{xaxis:{title:"Suction flow (Am³/h)"},yaxis:{title:"Head (kJ/kg)"}}})]}),l.jsxs("div",{className:"grid",style:{marginTop:14},children:[l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Lube inputs"}),l.jsx(Un,{schema:t.schema,def:"LubeDesign",value:t.project.lube,onChange:r=>on(t,"lube",r)})]}),l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Piping inputs"}),l.jsx(Un,{schema:t.schema,def:"PipingDesign",value:t.project.piping,onChange:r=>on(t,"piping",r)})]})]}),l.jsx(pn,{trace:n.trace}),l.jsx(pn,{trace:i.trace})]})}const RC=["shaft.shaft_diameter_at_impellers_mm","shaft.journal_diameter_mm","bearings.length_to_diameter","bearings.radial_clearance_ratio","bearings.preload","bearings.pivot_offset","design_basis.head_coefficient","design_basis.first_stage_flow_coefficient","design_basis.max_tip_speed_m_s","design_basis.speed_rpm_override","seals.labyrinth_teeth","train.coupling_torsional_stiffness_nm_rad"];function PC(t){const[e,n]=ne.useState([]),[i,r]=ne.useState("bearings.preload"),[s,a]=ne.useState("0.05, 0.15, 0.25, 0.35, 0.45"),[o,c]=ne.useState(["logdec_with_qa","bearing_loss_kw","min_film_um"]),[h,u]=ne.useState(null),[f,p]=ne.useState(null),[m,S]=ne.useState(null),[x,g]=ne.useState(""),[d,_]=ne.useState(""),[y,E]=ne.useState("logdec_with_qa"),[P,b]=ne.useState("0.05, 0.5");ne.useEffect(()=>{et.metrics().then(n).catch(()=>{})},[]);const C=async(z,v)=>{g(z),_("");try{await v()}catch(M){_(M.message)}finally{g("")}},N=z=>c(o.includes(z)?o.filter(v=>v!==z):[...o,z]);return l.jsxs(l.Fragment,{children:[l.jsx("h2",{children:"Engineering optimisation"}),l.jsx("p",{className:"lead",children:"Parametric studies, sensitivity analysis and constrained optimisation with the full workflow in the loop (fast level: coarser bearing tables, damped modes and Level I stability). Each evaluation takes a few seconds."}),d&&l.jsx("div",{className:"error",children:d}),l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Metrics"}),l.jsx("div",{className:"chips",children:e.map(z=>l.jsx("button",{className:`chip ${o.includes(z)?"on":""}`,onClick:()=>N(z),children:z},z))})]}),l.jsxs("div",{className:"grid",style:{marginTop:14},children:[l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Parametric study"}),l.jsxs("div",{className:"form",children:[l.jsxs("label",{children:["Variable",l.jsx("select",{value:i,onChange:z=>r(z.target.value),children:RC.map(z=>l.jsx("option",{children:z},z))})]}),l.jsxs("label",{children:["Values (comma separated)",l.jsx("input",{value:s,onChange:z=>a(z.target.value)})]})]}),l.jsx("button",{className:"btn primary",style:{marginTop:8},disabled:!!x,onClick:()=>C("p",async()=>{u(await et.parametric({project:t.project,variable:i,values:s.split(",").map(Number).filter(Number.isFinite),metrics:o}))}),children:x==="p"?"Running…":"Run study"}),h&&l.jsx(l.Fragment,{children:h.metrics.map((z,v)=>l.jsx(wt,{height:220,data:[{x:h.rows.map(M=>M.value),y:h.rows.map(M=>M[z]),mode:"lines+markers",name:z,line:{color:it[v%8]}}],layout:{xaxis:{title:h.variable},yaxis:{title:z},margin:{t:10}}},z))})]}),l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Sensitivity (normalised: % change of metric per % change of variable)"}),l.jsx("p",{className:"muted",children:"Uses the variables currently set (auto-estimated variables are skipped)."}),l.jsx("button",{className:"btn",disabled:!!x,onClick:()=>C("s",async()=>{p(await et.sensitivity({project:t.project,variables:["bearings.length_to_diameter","bearings.radial_clearance_ratio","bearings.preload","design_basis.head_coefficient","design_basis.max_tip_speed_m_s"],metrics:o}))}),children:x==="s"?"Running (≈1 min)…":"Run sensitivity"}),f&&l.jsx(mt,{rows:f.sensitivities,cols:[["Variable",z=>z.variable],...f.metrics.map(z=>[z,v=>v[z],2])]}),l.jsx("h3",{style:{marginTop:16},children:"Optimise one variable"}),l.jsxs("div",{className:"form",children:[l.jsxs("label",{children:["Objective (maximise)",l.jsx("select",{value:y,onChange:z=>E(z.target.value),children:e.map(z=>l.jsx("option",{children:z},z))})]}),l.jsxs("label",{children:["Bounds for “",i,"”",l.jsx("input",{value:P,onChange:z=>b(z.target.value)})]})]}),l.jsx("button",{className:"btn",style:{marginTop:8},disabled:!!x,onClick:()=>C("o",async()=>{const[z,v]=P.split(",").map(Number);S(await et.optimize({project:t.project,variables:[{path:i,lower:z,upper:v}],objective:y,sense:"max",constraints:[{metric:"min_film_um",op:">=",value:t.project.criteria.bearing_min_film_um}],max_evals:12}))}),children:x==="o"?"Optimising…":"Optimise (constraint: min film ≥ criterion)"}),m&&l.jsxs("p",{children:["Best ",i," = ",l.jsx("strong",{children:Q(m.best.x[i],4)})," → ",y," = ",Q(m.best[y],4)," ·",m.feasible?" feasible":" infeasible"," · ",m.evaluations," evaluations"]}),m&&l.jsx(wt,{height:220,data:[{x:m.history.map(z=>z.x[i]),y:m.history.map(z=>z[y]),mode:"markers",name:"evaluations"}],layout:{xaxis:{title:i},yaxis:{title:y},margin:{t:10}}})]})]})]})}function NC(t){const e=t.results,[n,i]=ne.useState("all"),r=ne.useMemo(()=>e?e.checklist.items.filter(a=>n==="all"||a.status===n):[],[e,n]);if(!e)return l.jsx(Ai,{results:e});const s=e.checklist.counts;return l.jsxs(l.Fragment,{children:[l.jsx("h2",{children:"Engineering verification"}),l.jsx("p",{className:"lead",children:"Every module's checks against the version-controlled criteria, with source, reference and status. “Review” items are outside the software's scope and need qualified engineering review."}),l.jsx(qv,{}),l.jsx(qs,{items:[["Pass",String(s.pass)],["Fail",String(s.fail)],["Attention",String(s.attention)],["For review",String(s.review)]]}),l.jsx("div",{className:"chips",children:["all","fail","attention","pass","review"].map(a=>l.jsx("button",{className:`chip ${n===a?"on":""}`,onClick:()=>i(a),children:a},a))}),l.jsx("div",{className:"card",children:l.jsx("div",{className:"scroll",children:l.jsxs("table",{className:"t",children:[l.jsx("thead",{children:l.jsxs("tr",{children:[l.jsx("th",{children:"Category"}),l.jsx("th",{children:"Check"}),l.jsx("th",{children:"Criterion"}),l.jsx("th",{children:"Value"}),l.jsx("th",{children:"Status"}),l.jsx("th",{children:"Reference"}),l.jsx("th",{children:"Module"})]})}),l.jsx("tbody",{children:r.map((a,o)=>l.jsxs("tr",{children:[l.jsx("td",{children:a.category}),l.jsxs("td",{children:[a.check,a.note&&l.jsx("div",{className:"muted",children:a.note})]}),l.jsx("td",{children:a.criterion}),l.jsx("td",{children:a.value}),l.jsx("td",{children:l.jsx("span",{className:`status ${a.status}`,children:a.status})}),l.jsx("td",{children:a.reference}),l.jsx("td",{className:"muted",children:a.module})]},o))})]})})}),l.jsxs("p",{className:"muted",children:["Criteria basis: ",e.checklist.criteria_edition]})]})}function LC(t){const[e,n]=ne.useState([]),[i,r]=ne.useState([]),[s,a]=ne.useState([]),[o,c]=ne.useState(""),[h,u]=ne.useState(""),[f,p]=ne.useState(""),m=async()=>{n(await et.projects()),t.savedId&&(r(await et.revisions(t.savedId)),a(await et.history(t.savedId)))};ne.useEffect(()=>{m().catch(()=>{})},[t.savedId]);const S=async d=>{u(d),p("");try{if(d==="report.html"){const _=await fetch("/api/export/report.html",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({project:t.project,level:"full"})}),y=window.open("","_blank");y&&(y.document.write(await _.text()),y.document.close())}else await Ty(d,t.project)}catch(_){p(_.message)}finally{u("")}},x=async()=>{p("");try{const d=t.savedId?await et.updateProject(t.savedId,t.project,o):await et.createProject(t.project,o||"Created");t.setSavedId(d.id),t.setProject(d.project),c(""),await m()}catch(d){p(d.message)}},g=[["report.html","Calculation report (HTML, printable)"],["report.pdf","Calculation report (PDF)"],["results.xlsx","Results workbook (Excel)"],["results.json","Full results (JSON)"],["rotor.stl","Rotor CAD (STL)"],["rotor.step","Rotor CAD (STEP, needs CadQuery)"],["calculix-beam.inp","CalculiX beam deck (frequency check)"],["calculix-axisymmetric.inp","CalculiX axisymmetric deck (centrifugal stress)"],["scene.json","3D scene (JSON)"]];return l.jsxs(l.Fragment,{children:[l.jsx("h2",{children:"Reports, revisions & history"}),l.jsx("p",{className:"lead",children:"Technical documentation with datasheet, figures, checklist and full traceability; CAD and FE exports; project revisions and calculation history stored on the server."}),f&&l.jsx("div",{className:"error",children:f}),l.jsxs("div",{className:"grid",children:[l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Documents & exports"}),g.map(([d,_])=>l.jsxs("div",{className:"row",style:{marginBottom:6},children:[l.jsx("button",{className:"btn",disabled:!!h,onClick:()=>S(d),children:h===d?"Preparing…":"Download"}),l.jsx("span",{children:_})]},d))]}),l.jsxs("div",{className:"card",children:[l.jsx("h3",{children:"Save project revision"}),l.jsxs("div",{className:"row",children:[l.jsx("input",{className:"inp",style:{flex:1},placeholder:"Revision note",value:o,onChange:d=>c(d.target.value)}),l.jsx("button",{className:"btn primary",onClick:x,children:t.savedId?"Save new revision":"Save project"})]}),i.length>0&&l.jsx(mt,{rows:i,cols:[["Rev",d=>String(d.revision)],["Saved",d=>d.created],["Note",d=>d.note],["Input hash",d=>d.input_hash]]}),t.savedId&&l.jsx("button",{className:"btn",style:{marginTop:8},onClick:async()=>{const d=await et.runSaved(t.savedId);t.setResults(d,t.project),await m()},children:"Run saved revision and record in history"}),s.length>0&&l.jsxs(l.Fragment,{children:[l.jsx("h3",{style:{marginTop:12},children:"Calculation history"}),l.jsx(mt,{rows:s,cols:[["Run",d=>String(d.id)],["Rev",d=>String(d.revision)],["When",d=>d.created],["Version",d=>d.software_version],["Speed rpm",d=>d.summary.speed_rpm,0],["Power kW",d=>d.summary.shaft_power_kw,0],["Fails",d=>String(d.summary.checklist.fail)]]})]})]})]}),l.jsxs("div",{className:"card",style:{marginTop:14},children:[l.jsx("h3",{children:"Saved projects"}),l.jsx(mt,{rows:e,cols:[["#",d=>String(d.id)],["Name",d=>d.name],["Revision",d=>String(d.current_revision)],["Updated",d=>d.updated]]}),l.jsxs("div",{className:"row",style:{marginTop:8},children:[e.map(d=>l.jsxs("button",{className:"btn",onClick:async()=>{const _=await et.getProject(d.id);t.setSavedId(d.id),t.setProject(_.project)},children:["Open #",d.id]},d.id)),l.jsx("button",{className:"btn",onClick:async()=>{const d=await et.defaults();t.setSavedId(null),t.setProject(d)},children:"New from example"}),l.jsx("button",{className:"btn",onClick:()=>{const d=document.createElement("a");d.href=URL.createObjectURL(new Blob([JSON.stringify(t.project,null,1)],{type:"application/json"})),d.download=`${String(t.project.name).replace(/\s+/g,"_")}_rev${t.project.revision}.json`,d.click()},children:"Export project file"}),l.jsxs("label",{className:"btn",children:["Import project file",l.jsx("input",{type:"file",accept:".json,application/json",hidden:!0,onChange:async d=>{var y;const _=(y=d.target.files)==null?void 0:y[0];if(_){try{const E=JSON.parse(await _.text());t.setSavedId(null),t.setProject({...await et.defaults(),...E})}catch(E){alert(`Not a CentriForge project file: ${E.message}`)}d.target.value=""}}})]})]})]})]})}const DC={project:t=>l.jsx(vC,{...t}),gas:t=>l.jsx(xC,{...t}),thermo:t=>l.jsx(yC,{...t}),compressor:t=>l.jsx(SC,{...t}),impellers:t=>l.jsx(EC,{...t}),rotor:t=>l.jsx(wC,{...t}),bearings:t=>l.jsx(TC,{...t}),lateral:t=>l.jsx(CC,{...t}),torsional:t=>l.jsx(bC,{...t}),materials:t=>l.jsx(_C,{...t}),aux:t=>l.jsx(AC,{...t}),optimize:t=>l.jsx(PC,{...t}),verify:t=>l.jsx(NC,{...t}),reports:t=>l.jsx(LC,{...t})},Wm="compsuite.draft.v1",Xm=["auto","light","dark"],qo={get:t=>{try{return localStorage.getItem(t)}catch{return null}},set:(t,e)=>{try{localStorage.setItem(t,e)}catch{}}};function IC(){var L;const[t,e]=ne.useState(null),[n,i]=ne.useState(null),[r,s]=ne.useState(null),[a,o]=ne.useState(""),[c,h]=ne.useState(!1),[u,f]=ne.useState(""),[p,m]=ne.useState("home"),[S,x]=ne.useState(null),[g,d]=ne.useState(0),[_,y]=ne.useState(!1),[E,P]=ne.useState(null),[b,C]=ne.useState(null),[N,z]=ne.useState(()=>qo.get("centriforge.theme")??"auto");ne.useEffect(()=>{N==="auto"?document.documentElement.removeAttribute("data-theme"):document.documentElement.setAttribute("data-theme",N),qo.set("centriforge.theme",N)},[N]);const v=ne.useCallback(O=>{i(O),qo.set(Wm,JSON.stringify(O))},[]),M=ne.useCallback(async O=>{h(!0),f("");try{const V=await et.run(O,"full");s(V),o(JSON.stringify(O)),d(0)}catch(V){f(V.message)}finally{h(!1)}},[]);ne.useEffect(()=>{et.schema().then(e).catch(O=>f(`Engineering server not reachable: ${O.message}.`));try{const O=qo.get(Wm);O&&C(JSON.parse(O))}catch{}},[]);const I=ne.useCallback(async(O,V=null,se="project")=>{const fe=await et.defaults();v({...fe,...O}),x(V),s(null),o(""),d(0),m(se)},[v]),j={newProject:()=>y(!0),openExample:async O=>{P(null),I(await et.example(O))},tutorial:async()=>{await I(await et.example("export_gas"),null,xa[0].page),P(0)},openSaved:async O=>{const V=await et.getProject(O);I(V.project,O)},importFile:O=>I(O),resume:b?()=>I(b):null,resumeName:(b==null?void 0:b.name)??""},q=ne.useMemo(()=>!!r&&JSON.stringify(n)!==a,[n,r,a]),Z={schema:t,project:n,setProject:v,results:r,casing:g,setCasing:d,run:M,running:c,savedId:S,setSavedId:x,setResults:(O,V)=>{s(O),o(JSON.stringify(V))}},H=ws.find(O=>O.id===p),Y=O=>{var V;m(O),(V=document.querySelector("main"))==null||V.scrollTo(0,0)};return l.jsxs("div",{className:"shell",children:[l.jsxs("header",{className:"bar",children:[l.jsxs("button",{className:"brand",onClick:()=>Y("home"),"aria-label":"Launcher",children:[l.jsx("img",{src:"/favicon.svg",alt:"",width:"24",height:"24"}),l.jsxs("b",{children:["CENTRI",l.jsx("span",{children:"FORGE"})]})]}),l.jsxs("nav",{className:"tabs",children:[l.jsx("button",{className:p==="home"?"on":"",onClick:()=>Y("home"),children:"Launcher"}),l.jsx("button",{className:p!=="home"?"on":"",disabled:!n,title:n?"":"Start or open a project first",onClick:()=>Y(H?H.id:"project"),children:"Workspace"})]}),l.jsx("span",{className:"mono caps muted hide-sm",children:"Compressor engineering suite"}),l.jsx("span",{className:"spacer"}),c&&l.jsx("span",{className:"pill attention",children:"Running analysis…"}),l.jsxs("button",{className:"tab-btn",onClick:()=>z(Xm[(Xm.indexOf(N)+1)%3]),title:"Theme",children:["Theme · ",N]})]}),_&&l.jsx(Dy,{onClose:()=>y(!1),onCreate:O=>{y(!1),P(null),I(O)}}),E!==null&&p!=="home"&&l.jsx(Iy,{step:E,setStep:P,open:Y,run:()=>n&&M(n),running:c}),p==="home"||!n?l.jsxs("main",{className:"home",children:[u&&l.jsx("div",{className:"error",children:u}),l.jsx(Ny,{results:r,project:n,open:Y,running:c,actions:j})]}):l.jsxs("div",{className:"app",children:[l.jsx("nav",{className:"side","aria-label":"Workflow",children:tf.map(O=>l.jsxs("div",{children:[l.jsxs("div",{className:"group mono caps",children:[l.jsx("i",{style:{background:O.color}}),O.label]}),ws.filter(V=>V.group===O.id).map(V=>l.jsxs("button",{className:V.id===p?"active":"",onClick:()=>Y(V.id),children:[l.jsx("span",{className:"step mono",children:zl(V.id)}),V.label]},V.id))]},O.id))}),l.jsxs("main",{children:[l.jsxs("header",{className:"top",children:[l.jsx("span",{className:"crumb mono caps",children:H&&`${zl(H.id)} · ${H.label}`}),l.jsx("input",{className:"title","aria-label":"Project name",value:(n==null?void 0:n.name)??"",onChange:O=>n&&v({...n,name:O.target.value})}),l.jsxs("span",{className:"muted mono small",children:["rev ",(n==null?void 0:n.revision)??0,S?` · saved #${S}`:" · unsaved draft"]}),l.jsx("span",{className:"spacer"}),r&&((L=r.casings)==null?void 0:L.length)>1&&l.jsx("select",{className:"inp",value:g,onChange:O=>d(Number(O.target.value)),"aria-label":"Casing",children:r.casings.map((O,V)=>l.jsxs("option",{value:V,children:["Casing ",V+1]},V))}),q&&l.jsx("span",{className:"pill attention",children:"Inputs changed"}),l.jsx("button",{className:"btn primary",disabled:c||!n,onClick:()=>M(n),children:c?"Running analysis…":"Run analysis"})]}),l.jsxs("div",{className:"content",children:[u&&l.jsx("div",{className:"error",children:u}),n&&t&&H?DC[H.id](Z):!u&&l.jsx("p",{className:"muted",children:"Loading…"})]})]})]})]})}sv(document.getElementById("root")).render(l.jsx(ne.StrictMode,{children:l.jsx(IC,{})}));
