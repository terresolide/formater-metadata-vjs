(window.webpackJsonp=window.webpackJsonp||[]).push([[11],{381:function(e,t){var n={$http:null,parser:null,regex:null,proxy:null,init:function(e,t){$http=e,parser=new DOMParser,t&&(regex=new RegExp(t.regex)),proxy=t.url},loadInfo:function(e,t,n,l){var u=this,r=e.href;regex.test(r)&&proxy&&(search=proxy+"?url="+encodeURIComponent(r)),$http.get(search).then((function(r){return u.extract(r.body,e,t,n,l)}),(function(e){return console.log("CAN NOT GET "+r)}))},extract:function(e,t,n,l,u){var r=parser.parseFromString(e,"text/xml"),a=r.children[0].getAttribute("xmlns"),s=r.children[0].getAttribute("xmlns:xlink"),i=function(e){switch(e){case"xlink":return s;default:return a}},o=this.getUrlGetMap(r,i);if(""===o)return null;n.url=o;var R=null;if((R=r.evaluate('//ns:Layer[ns:Name="'+t.name+'"]',r,i,XPathResult.ANY_TYPE,null)).resultType!==XPathResult.UNORDERED_NODE_ITERATOR_TYPE&&R.resultType!==XPathResult.ORDERED_NODE_ITERATOR_TYPE)return null;var g=R.iterateNext();if(null===g)return null;t.href=o,t.title=this.getTitle(r,g,i),t.options={id:t.id,ESPG:this.getESPG(r,g,i),format:this.getFormat(r,i),opacity:n.opacity,layers:t.name,legend:this.getLegend(r,g,i)},void 0!==u&&u(t,l,n.zoom)},getUrlGetMap:function(e,t){return e.evaluate("//ns:Request/ns:GetMap/ns:DCPType/ns:HTTP/ns:Get/ns:OnlineResource/@xlink:href",e,t,XPathResult.STRING_TYPE,null).stringValue},getESPG:function(e,t,n){return e.evaluate('count(./ns:CRS[text()="EPSG:3857"])',t,n,XPathResult.NUMBER_TYPE,null).numberValue>0?"3857":e.evaluate('count(./ns:CRS[text()="EPSG:4326"])',t,n,XPathResult.NUMBER_TYPE,null).numberValue>0?"4326":e.evaluate('count(./ns:CRS[text()="EPSG:3395"])',t,n,XPathResult.NUMBER_TYPE,null).numberValue>0?"3395":null},getFormat:function(e,t){return e.evaluate('count(//ns:Request/ns:GetMap[ns:Format="image/png"])',e,t,XPathResult.NUMBER_TYPE,null).numberValue>0?"image/png":e.evaluate('count(//ns:Request/ns:GetMap[ns:Format="image/jpeg"])',e,t,XPathResult.NUMBER_TYPE,null).numberValue>0?"image/jpeg":null},getTitle:function(e,t,n){return e.evaluate("./ns:Title/text()",t,n,XPathResult.STRING_TYPE,null).stringValue},getAbstract:function(e,t,n){return e.evaluate("./ns:Abstract/text()",t,n,XPathResult.STRING_TYPE,null).stringValue},getGeographicBoundingBox:function(e,t,n){},getLegend:function(e,t,n){var l=e.evaluate("./ns:Style/ns:LegendURL/ns:OnlineResource/@xlink:href",t,n,XPathResult.STRING_TYPE,null).stringValue,u=e.evaluate("./ns:Style/ns:Title",t,n,XPathResult.STRING_TYPE,null).stringValue;return""!==l?{src:l,title:u}:null}};e.exports=n}}]);
//# sourceMappingURL=11.formater-metadata-vjs.js.map