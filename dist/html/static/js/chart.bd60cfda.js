(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chart"],{"026e":function(t,a,s){"use strict";s.r(a);var e=function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",[s("div",{staticClass:"crumbs"},[s("el-breadcrumb",{attrs:{separator:"/"}},[s("el-breadcrumb-item",[s("i",{staticClass:"el-icon-pie-chart"}),t._v(" schart图表 ")])],1)],1),s("div",{staticClass:"container"},[t._m(0),s("div",{staticClass:"schart-box"},[s("div",{staticClass:"content-title"},[t._v("柱状图")]),s("schart",{staticClass:"schart",attrs:{canvasId:"bar",options:t.options1}})],1),s("div",{staticClass:"schart-box"},[s("div",{staticClass:"content-title"},[t._v("折线图")]),s("schart",{staticClass:"schart",attrs:{canvasId:"line",options:t.options2}})],1),s("div",{staticClass:"schart-box"},[s("div",{staticClass:"content-title"},[t._v("饼状图")]),s("schart",{staticClass:"schart",attrs:{canvasId:"pie",options:t.options3}})],1),s("div",{staticClass:"schart-box"},[s("div",{staticClass:"content-title"},[t._v("环形图")]),s("schart",{staticClass:"schart",attrs:{canvasId:"ring",options:t.options4}})],1)])])},i=[function(){var t=this,a=t.$createElement,s=t._self._c||a;return s("div",{staticClass:"plugins-tips"},[t._v(" vue-schart：vue.js封装sChart.js的图表组件。 访问地址： "),s("a",{attrs:{href:"https://github.com/lin-xin/vue-schart",target:"_blank"}},[t._v("vue-schart")])])}],l=s("f5ac"),c={name:"basecharts",components:{Schart:l["a"]},data:function(){return{options1:{type:"bar",title:{text:"最近一周各品类销售图"},bgColor:"#fbfbfb",labels:["周一","周二","周三","周四","周五"],datasets:[{label:"家电",fillColor:"rgba(241, 49, 74, 0.5)",data:[234,278,270,190,230]},{label:"百货",data:[164,178,190,135,160]},{label:"食品",data:[144,198,150,235,120]}]},options2:{type:"line",title:{text:"最近几个月各品类销售趋势图"},bgColor:"#fbfbfb",labels:["6月","7月","8月","9月","10月"],datasets:[{label:"家电",data:[234,278,270,190,230]},{label:"百货",data:[164,178,150,135,160]},{label:"食品",data:[114,138,200,235,190]}]},options3:{type:"pie",title:{text:"服装品类销售饼状图"},legend:{position:"left"},bgColor:"#fbfbfb",labels:["T恤","牛仔裤","连衣裙","毛衣","七分裤","短裙","羽绒服"],datasets:[{data:[334,278,190,235,260,200,141]}]},options4:{type:"ring",title:{text:"环形三等分"},showValue:!1,legend:{position:"bottom",bottom:40},bgColor:"#fbfbfb",labels:["vue","react","angular"],datasets:[{data:[500,500,500]}]}}}},o=c,n=(s("9770"),s("2877")),r=Object(n["a"])(o,e,i,!1,null,"026bc4e4",null);a["default"]=r.exports},9770:function(t,a,s){"use strict";s("ee76")},ee76:function(t,a,s){}}]);