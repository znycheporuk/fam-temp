var p=class extends Event{constructor(o,{oldState:i="",newState:r="",...l}={}){super(o,l);this.oldState=String(i||""),this.newState=String(r||"")}},A=new WeakMap;function b(e,t,o){A.set(e,setTimeout(()=>{A.has(e)&&e.dispatchEvent(new p("toggle",{cancelable:!1,oldState:t,newState:o}))},0))}var x=globalThis.ShadowRoot||function(){},O=globalThis.HTMLDialogElement||function(){},h=new WeakMap,a=new WeakMap,d=new WeakMap;function T(e){return d.get(e)||"hidden"}var M=new WeakMap;function I(e){let t=e.popoverTargetElement;if(!t)return;let o=T(t);e.popoverTargetAction==="show"&&o==="showing"||e.popoverTargetAction==="hide"&&o==="hidden"||(o==="showing"?v(t,!0,!0):f(t,!1)&&(M.set(t,e),H(t)))}function f(e,t){return!(e.popover!=="auto"&&e.popover!=="manual"||!e.isConnected||t&&T(e)!=="showing"||!t&&T(e)!=="hidden"||e instanceof O&&e.hasAttribute("open")||document.fullscreenElement===e)}function k(e){return e?Array.from(a.get(e.ownerDocument)||[]).indexOf(e)+1:0}function q(e){let t=N(e),o=C(e);return k(t)>k(o)?t:o}function L(e){let t=a.get(e);for(let o of t||[])if(!o.isConnected)t.delete(o);else return o;return null}function g(e){return typeof e.getRootNode=="function"?e.getRootNode():e.parentNode?g(e.parentNode):e}function N(e){for(;e;){if(e instanceof HTMLElement&&e.popover==="auto"&&d.get(e)==="showing")return e;if(e=e.parentElement||g(e),e instanceof x&&(e=e.host),e instanceof Document)return}}function C(e){for(;e;){let t=e.popoverTargetElement;if(t)return t;if(e=e.parentElement||g(e),e instanceof x&&(e=e.host),e instanceof Document)return}}function K(e){let t=new Map,o=0,i=e.ownerDocument;for(let n of a.get(i)||[])t.set(n,o),o+=1;t.set(e,o),o+=1;let r=null;function l(n){let s=N(n);if(s===null)return null;let u=t.get(s);(r===null||t.get(r)<u)&&(r=s)}return l(e?.parentElement),r}function V(e){return e.hidden||(e instanceof HTMLButtonElement||e instanceof HTMLInputElement||e instanceof HTMLSelectElement||e instanceof HTMLTextAreaElement||e instanceof HTMLOptGroupElement||e instanceof HTMLOptionElement||e instanceof HTMLFieldSetElement)&&e.disabled||e instanceof HTMLInputElement&&e.type==="hidden"||e instanceof HTMLAnchorElement&&e.href===""?!1:e.tabIndex!==-1}function j(e){if(e.shadowRoot&&e.shadowRoot.delegatesFocus!==!0)return null;let t=e;t.shadowRoot&&(t=t.shadowRoot);let o=t.querySelector("[autofocus]");if(o)return o;let i=e.ownerDocument.createTreeWalker(t,NodeFilter.SHOW_ELEMENT),r=i.currentNode;for(;r;){if(V(r))return r;r=i.nextNode()}}function U(e){j(e)?.focus()}var w=new WeakMap;function H(e){if(!f(e,!1))return;let t=e.ownerDocument;if(!e.dispatchEvent(new p("beforetoggle",{cancelable:!0,oldState:"closed",newState:"open"}))||!f(e,!1))return;let o=!1;if(e.popover==="auto"){let r=e.getAttribute("popover"),l=K(e)||t;if(m(l,!1,!0),r!==e.getAttribute("popover")||!f(e,!1))return}L(t)||(o=!0),w.delete(e);let i=t.activeElement;e.classList.add(":popover-open"),d.set(e,"showing"),h.has(t)||h.set(t,new Set),h.get(t).add(e),U(e),e.popover==="auto"&&(a.has(t)||a.set(t,new Set),a.get(t).add(e),R(M.get(e),!0)),o&&i&&e.popover==="auto"&&w.set(e,i),b(e,"closed","open")}function v(e,t=!1,o=!1){if(!f(e,!0))return;let i=e.ownerDocument;if(e.popover==="auto"&&(m(e,t,o),!f(e,!0))||(R(M.get(e),!1),M.delete(e),o&&(e.dispatchEvent(new p("beforetoggle",{oldState:"open",newState:"closed"})),!f(e,!0))))return;h.get(i)?.delete(e),a.get(i)?.delete(e),e.classList.remove(":popover-open"),d.set(e,"hidden"),o&&b(e,"open","closed");let r=w.get(e);r&&(w.delete(e),t&&r.focus())}function D(e,t=!1,o=!1){let i=L(e);for(;i;)v(i,t,o),i=L(e)}function m(e,t,o){let i=e.ownerDocument||e;if(e instanceof Document)return D(i,t,o);let r=null,l=!1;for(let n of a.get(i)||[])if(n===e)l=!0;else if(l){r=n;break}if(!l)return D(i,t,o);for(;r&&T(r)==="showing"&&a.get(i)?.size;)v(r,t,o)}var y=new WeakMap;function S(e){if(!e.isTrusted)return;let t=e.composedPath()[0];if(!t)return;let o=t.ownerDocument;if(!L(o))return;let r=q(t);if(r&&e.type==="pointerdown")y.set(o,r);else if(e.type==="pointerup"){let l=y.get(o)===r;y.delete(o),l&&m(r||o,!1,!0)}}var P=new WeakMap;function R(e,t=!1){if(!e)return;P.has(e)||P.set(e,e.getAttribute("aria-expanded"));let o=e.popoverTargetElement;if(o&&o.popover==="auto")e.setAttribute("aria-expanded",String(t));else{let i=P.get(e);i?e.setAttribute("aria-expanded",i):e.removeAttribute("aria-expanded")}}var F=globalThis.ShadowRoot||function(){};function W(){return typeof HTMLElement<"u"&&typeof HTMLElement.prototype=="object"&&"popover"in HTMLElement.prototype}function c(e,t,o){let i=e[t];Object.defineProperty(e,t,{value(r){return i.call(this,o(r))}})}var z=/(^|[^\\]):popover-open\b/g;function B(){window.ToggleEvent=window.ToggleEvent||p;function e(n){return n?.includes(":popover-open")&&(n=n.replace(z,"$1.\\:popover-open")),n}c(Document.prototype,"querySelector",e),c(Document.prototype,"querySelectorAll",e),c(Element.prototype,"querySelector",e),c(Element.prototype,"querySelectorAll",e),c(Element.prototype,"matches",e),c(Element.prototype,"closest",e),c(DocumentFragment.prototype,"querySelectorAll",e),c(DocumentFragment.prototype,"querySelectorAll",e),Object.defineProperties(HTMLElement.prototype,{popover:{enumerable:!0,configurable:!0,get(){if(!this.hasAttribute("popover"))return null;let n=(this.getAttribute("popover")||"").toLowerCase();return n===""||n=="auto"?"auto":"manual"},set(n){this.setAttribute("popover",n)}},showPopover:{enumerable:!0,configurable:!0,value(){H(this)}},hidePopover:{enumerable:!0,configurable:!0,value(){v(this,!0,!0)}},togglePopover:{enumerable:!0,configurable:!0,value(n){d.get(this)==="showing"&&n===void 0||n===!1?v(this,!0,!0):(n===void 0||n===!0)&&H(this)}}});let t=new WeakMap;function o(n){Object.defineProperties(n.prototype,{popoverTargetElement:{enumerable:!0,configurable:!0,set(s){if(s===null)this.removeAttribute("popovertarget"),t.delete(this);else if(s instanceof Element)this.setAttribute("popovertarget",""),t.set(this,s);else throw new TypeError("popoverTargetElement must be an element or null")},get(){if(this.localName!=="button"&&this.localName!=="input"||this.localName==="input"&&this.type!=="reset"&&this.type!=="image"&&this.type!=="button"||this.disabled||this.form&&this.type==="submit")return null;let s=t.get(this);if(s&&s.isConnected)return s;if(s&&!s.isConnected)return t.delete(this),null;let u=g(this),E=this.getAttribute("popovertarget");return(u instanceof Document||u instanceof F)&&E&&u.getElementById(E)||null}},popoverTargetAction:{enumerable:!0,configurable:!0,get(){let s=(this.getAttribute("popovertargetaction")||"").toLowerCase();return s==="show"||s==="hide"?s:"toggle"},set(s){this.setAttribute("popovertargetaction",s)}}})}o(HTMLButtonElement),o(HTMLInputElement);let i=n=>{if(!n.isTrusted)return;let s=n.composedPath()[0];if(!(s instanceof Element)||s?.shadowRoot)return;let u=g(s);if(!(u instanceof F||u instanceof Document))return;let E=s.closest("[popovertargetaction],[popovertarget]");if(E){I(E);return}},r=n=>{let s=n.key,u=n.target;u&&(s==="Escape"||s==="Esc")&&m(u.ownerDocument,!0,!0)};(n=>{n.addEventListener("click",i),n.addEventListener("keydown",r),n.addEventListener("pointerdown",S),n.addEventListener("pointerup",S)})(document)}W()||B();