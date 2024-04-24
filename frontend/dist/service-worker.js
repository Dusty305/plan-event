(function(){"use strict";const h="cache-v1",p=[],w=async()=>await(await caches.open(h)).addAll(p),R=async e=>await fetch(e).then(async s=>s.ok?await(await caches.open(h)).put(e,s):s)||await caches.match(e),E="planevent-db",a="events";let c=null;const m=computed(()=>c!==null),u=self.indexedDB.open(E,1);u.onerror=e=>{console.log("Could not open db",e)},u.onsuccess=e=>{c=e.target.result,c.onerror=t=>{console.log("DB error:",t.target)}},u.onupgradeneeded=e=>{e.target.result.createObjectStore(a,{keyPath:"id",autoIncrement:!0})};const l=e=>{if(!m){const t=new Response("DB was not created",{status:500});return e(t)}},g=()=>new Promise(async(e,t)=>{l(t);const s=c.transaction([a],"readonly"),i=s.objectStore(a).getAll();let o;i.onsuccess=r=>{const y=r.target.result;return s.commit(),o=new Response(JSON.stringify(y),{status:200}),e(o)},i.onerror=()=>(s.abort(),o=new Response(null,{status:400}),t(o))}),q=e=>new Promise(async(t,s)=>{l(s);const n=c.transaction([a],"readwrite"),o=n.objectStore(a).add(e);let r;o.onsuccess=()=>(n.commit(),r=new Response(JSON.stringify(e),{status:201}),t(r)),o.onerror=()=>(n.abort(),r=new Response(null,{status:400}),s(r))}),f=e=>new Promise(async(t,s)=>{l(s);const n=c.transaction([a],"readwrite"),o=n.objectStore(a).put(e);let r;o.onsuccess=()=>(n.commit(),r=new Response(null,{status:201}),t(r)),o.onerror=()=>(n.abort(),r=new Response(null,{status:400}),s(r))});class d extends Error{constructor(t){super(t)}}const v="127.0.0.1:8080";class S{constructor(t){this.request=t,this.url=new URL(t.url),this.urlPathnameSegments=this.url.pathname.split("/").slice(1)}async handleRequest(){return await this._prepareRequestBody(),this.url.host===v?await this._handleServerRequest():await this._handleClientRequest()}async _prepareRequestBody(){try{this.requestBody=await this.request.json()}catch{this.requestBody=null}return this.requestBody}_handleServerRequest(){if(this.urlPathnameSegments[0]!=="api")throw new Error('Error parsing server request url. Url has to start with "api/"');switch(this.urlPathnameSegments[1]){case"events":return this._handleEventsApiRequest();default:throw new Error("Error parsing server request url. Wrong api url")}}async _handleEventsApiRequest(){switch(this.urlPathnameSegments[2]){case void 0:return g();case"update_event":return f(this.requestBody);case"save_event":return q(this.requestBody);default:throw new d("API is not defined for "+this.url.pathname)}}_handleClientRequest(){return R(this.request)}}self.addEventListener("install",e=>{e.waitUntil(w()),console.log("Service worker installed",e)}),self.addEventListener("activate",e=>(console.log("Service worker active",e),self.clients.claim())),self.addEventListener("fetch",e=>{console.log("FetchEvent");const s=new S(e.request).handleRequest().catch(n=>{n instanceof d?console.log("Not implemented"):console.log(n)});e.respondWith(s)})})();
