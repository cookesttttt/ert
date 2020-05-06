<template>
  <div>
    <div id="ertDatagrid"></div>
    <button @click="tijiao">提交</button>
  </div>
</template>

<script>
  import axios from '@/libs/api.request'

  export default {
    name: "ooooo",
    data() {
      return {


      }
    },
    methods: {
      getDPI(){
        var arrDPI = new Array();
        if (window.screen.deviceXDPI != undefined) {
          arrDPI[0] = window.screen.deviceXDPI;
          arrDPI[1] = window.screen.deviceYDPI;
        }
        else {
          var tmpNode = document.createElement("DIV");
          tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
          document.body.appendChild(tmpNode);
          arrDPI[0] = parseInt(tmpNode.offsetWidth);
          arrDPI[1] = parseInt(tmpNode.offsetHeight);
          tmpNode.parentNode.removeChild(tmpNode);
        }
        return arrDPI;
      },
      getDta(){
        axios.request({
          url:'/pcm/survey_report/1/%E8%B7%AF%E5%9F%BA%E6%96%BD%E5%B7%A5%E6%A3%80%E9%AA%8C%E6%8A%A5%E5%91%8A(LJB01-01-01)',
          method:'get',
        }).then(res=>{
          $('#ertDatagrid').append(res.data.msgData)
        }).then(res=>{
          this.styleAdd()
        })
      },
      styleAdd(){
        var dpi =this.getDPI();
        var dpiX = dpi[0];
        var dpiY = dpi[1];
        $("#ertDatagrid td").each(function () {

          $(this).removeAttr("width").css("padding", "0px");
          //筛选td宽度
          var w = 60;
          var firstCss = $(this).attr("style").split(";")[0];

          if (firstCss.indexOf("width:") != -1) {
            w = $(this).attr("style").split(";")[0].replace(/width:/, "").replace(/pt/, "")
          }
          var wRate = "90%";
          if (w > 100)
            wRate = "98%";
          //筛选td高度

          var lastCss = $(this).attr("style").split(";").reverse()[1];

          var h = 21;
          if (lastCss.indexOf("height:") !== -1){
            h = $(this).attr("style").split(";").reverse()[1].replace(/height:/, "").replace(/pt/, "") - 1;
          }
          //忽略一些空格，不做处理
          if ($(this).find("span").length== 0) {
          }
          else if ($(this).find("span").html().replace(/&nbsp;/g, "").trim() === "") {
            var fontSize = "10pt";
            if (w < 40){
            fontSize = "8pt";
            }
            $(this).html('<textarea  style="min-width:' + (w - 5) + 'pt; width:' + wRate + ';height:60px;font-size:' + fontSize + ';"></textarea>');
          }
          //下面不能用 else if
          if ($(this).text().trim().match(/^备注|^结论/)) {
            $(this).html($(this).text().trim() + '<br /><textarea  style="min-width:' + (w - 5) + 'pt;width:' + wRate + ';height:150px;padding:1pt;font-size:10pt;"></textarea>');
          }
          else if ($(this).text().trim().match(/图示/)) {
            //动态增加一个隐藏域存储canvas数据
            var hidden = $(' <input id="ertCanvasData" type="hidden" value="" />');
            $("#ertDatagrid").append(hidden);
            //动态增加工具栏和canvas
            var html = '<div id="divDraw" style="background-color:#f8f8f8">' + $(this).text().trim()
              + '<span id="ertDraw" style="padding-left:30pt;padding-right:0pt;font-size:9pt;">  🍀 使用鼠标在下方绘制 🍀  '
              + '<button id="pen">✎ 绘笔</button>&nbsp;'
              + '<button id="eraser">☒ 橡皮擦</button>&nbsp;'
              + '<button id="clear">✘ 清空</button>'
              + '</span>'
              + '<br /><canvas id="ertCanvas" width="' + ((dpiX * w) / 72) + '" height="' + ((dpiY * h) / 72 - 12) + '" style="background-color:white;cursor:crosshair;"></canvas>'
              + '</div>'
            $(this).html(html);

            $("#ertDraw button").css({ "height": "16pt", "font-size": "8pt" });
            $("#pen").css({ "border": "1px solid #7b7b7b" });
            $("#clear").css({ "border": "0px solid #7b7b7b" });
            $("#eraser").css({ "border": "0px solid #7b7b7b" });

            var mycolor = 'black';
            var pen = 1;
            var eraser = 3;
            var oC = document.getElementById("ertCanvas")
            var oGC = oC.getContext("2d");
            oGC.strokeRect(0, 0, oC.width, oC.height);
            oGC.fillStyle = 'white';
            oGC.fillRect(0, 0, oC.width, oC.height);

            oC.onmousedown = function (e) {
              var disX = e.offsetX;
              var disY = e.offsetY;
              oGC.beginPath();
              if (mycolor == 'white') {
                oGC.lineWidth = eraser;
                oGC.strokeStyle = mycolor;
                oGC.moveTo(disX, disY);
              } else {
                oGC.lineWidth = pen;
                oGC.strokeStyle = mycolor;
                oGC.moveTo(disX, disY)
              }
              document.onmousemove = function (e) {
                var disX = e.offsetX;
                var disY = e.offsetY;
                oGC.lineTo(disX, disY);
                oGC.stroke();
              }
              document.onmouseup = function () {
                document.onmousedown = null
                document.onmousemove = null
                document.getElementById("ertCanvasData").value = oC.toDataURL(); //持久化canvas数据到隐藏域
              }

            }
            document.getElementById("eraser").onclick = function () {
              mycolor = "white";
              $("#ertCanvas").css("cursor", "pointer");
              $("#pen").css({ "border": "0px solid #7b7b7b" });
              $("#clear").css({ "border": "0px solid #7b7b7b" });
              $("#eraser").css({ "border": "1px solid #7b7b7b" });
            }
            document.getElementById("clear").onclick = function () {
              oGC.clearRect(0, 0, oC.width, oC.height);
              document.getElementById("ertCanvasData").value = oC.toDataURL(); //持久化canvas数据到隐藏域
              $("#ertCanvas").css("cursor", "crosshair");
              $("#pen").css({ "border": "1px solid #7b7b7b" });
              $("#clear").css({ "border": "0px solid #7b7b7b" });
              $("#eraser").css({ "border": "0px solid #7b7b7b" });
              mycolor = "black";

            }
            document.getElementById("pen").onclick = function () {
              mycolor = "black";
              $("#ertCanvas").css("cursor", "crosshair");
              $("#pen").css({ "border": "1px solid #7b7b7b" });
              $("#clear").css({ "border": "0px solid #7b7b7b" });
              $("#eraser").css({ "border": "0px solid #7b7b7b" });
            }
          }
        });
        //样式调整
        $("#ertDatagrid table td").find("textarea")
          .css({ "resize": "none", "overflow-y": "hidden", "border-width": "1px", "outline": "none", "border-color": "#e9e9e9" })
        //给textarea设置值事件
        $("#ertDatagrid table td").find("textarea").bind('input propertychange', function () {
          var value = $(this).val();
          $(this).text(value);

        })

      },
   /*   getUrl() {
        axios.request({
          url: '/pcm/html/get/2',
          method: 'get'
        }).then(res => {
          $('#ertDatagrid').append(res.data.msgData.content)
          $("#ertDatagrid table td").find("textarea")
            .css({ "resize": "none", "overflow-y": "hidden", "border-width": "1px", "outline": "none", "border-color": "#e9e9e9" })
          //给textarea设置值事件
          $("#ertDatagrid table td").find("textarea").bind('input propertychange', function () {
            var value = $(this).val();
            $(this).text(value);
          })
          console.log(res.data.msgData.content)
        })
      },*/

      tijiao() {
        /*"projectId":1,
"name":"test1",
"content": ""*/
        axios.request({
          url: '/pcm/html/save',
          method: 'post',
          data: {
            "projectId": 1,
            "name": "test1",
            "content": JSON.stringify($("#ertDatagrid").html())
          },
        }).then(res => {
          console.log($("#ertDatagrid").html())
          console.log(res)
        })
      }
    },
    mounted() {
      this.getDta()
    }
  }
</script>

<style scoped>
*{
  text-align: center;
  padding: 0;
  margin: 0;
}
</style>
