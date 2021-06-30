function changeShape(changeOpt){
    var shapeslist = document.getElementById("shapeslist");
    var targetShape = shapeslist.options[shapeslist.selectedIndex];
    if(!targetShape){
        return;
    }
    var targetObj = document.getElementById(targetShape.value);
    console.log(changeOpt.id);
    var opt = changeOpt.id.replace("_change","");
    switch(opt){
        case "size_width":
        case "range_size_width":
            targetObj.style.width = changeOpt.value + "px";
            targetObj.setAttribute("width",changeOpt.value);
            if(targetObj.getAttribute("shapetype") === "triangle"){
                var tr_bw = "0px " + targetObj.getAttribute("width")/2 + "px " + targetObj.getAttribute("height") + "px "+ targetObj.getAttribute("width")/2 + "px";
                targetObj.style.borderWidth = tr_bw;
            }
            break;
        case "size_height":
        case "range_size_height":
            targetObj.style.height = changeOpt.value + "px";
            targetObj.setAttribute("height",changeOpt.value);
            targetObj.style.lineHeight = changeOpt.value/2 + "px";
            if(targetObj.getAttribute("shapetype") === "triangle"){
                var tr_bw = "0px " + targetObj.getAttribute("width")/2 + "px " + targetObj.getAttribute("height") + "px "+ targetObj.getAttribute("width")/2 + "px";
                targetObj.style.borderWidth = tr_bw;
            }
            break;
        case "angle":
        case "range_angle":
            targetObj.style.transform = "rotate(" + changeOpt.value + "deg)";
            break;
        case "shapetype":
            var oldShapeType = targetObj.getAttribute("shapetype");
            targetObj.classList.remove(oldShapeType);
            targetObj.classList.add(changeOpt.value);
            if(changeOpt.value === "triangle"){
                var tr_bw = "0px " + targetObj.getAttribute("width")/2 + "px " + targetObj.getAttribute("height") + "px "+ targetObj.getAttribute("width")/2 + "px";
                var tr_bc = "transparent transparent " + targetObj.getAttribute("color") + " transparent";
                targetObj.style.borderWidth = tr_bw;
                targetObj.style.borderColor = tr_bc;
                targetObj.style.backgroundColor = "transparent";
            }
            else{
                targetObj.style.borderWidth = "";
                targetObj.style.borderColor = "";
            }
            break;
        case "color":
            if(targetObj.getAttribute("shapetype") === "triangle"){
                var tr_bc = "transparent transparent " + changeOpt.value + " transparent";
                targetObj.style.borderColor = tr_bc;
            }
            else{
                obj.style.backgroundColor = changeOpt.value;
            }
            break;
    }
    targetObj.setAttribute(opt,changeOpt.value);
}

function deleteShape(){
    var shapeslist = document.getElementById("shapeslist");
    var targetShape = shapeslist.options[shapeslist.selectedIndex];
    document.getElementById(targetShape.value).remove();
    targetShape.remove();
    if(shapeslist.length > 0){
        shapeslist.options[0].selected = true;
    }
}


function addShape(){

    var obj = document.createElement("div");
    obj.setAttribute("ismoving",false);
    var palette = document.getElementById("palette");
    obj.className = "obj";
    
    var txt = document.getElementById("txt").value;
    var shapetype = document.getElementById("shapetype").value;
    var color = document.getElementById("color").value;
    var size_w = document.getElementById("size_width").value;
    var size_h = document.getElementById("size_height").value;
    var angle = document.getElementById("angle").value;
    console.log("txt:"+txt+" shapetype:"+shapetype+" color:"+color+" size_w:"+size_w+" size_h:"+size_h);
    
    //値設定
    obj.setAttribute("txt",txt);
    obj.setAttribute("shapetype",shapetype);
    obj.setAttribute("color",color);
    obj.style.width = size_w + "px";
    obj.style.height = size_h + "px";
    obj.setAttribute("width",size_w + "");
    obj.setAttribute("height",size_h + "");
    obj.style.lineHeight = size_h/2 + "px";
    obj.style.transform = "rotate(" + angle + "deg)";
    obj.classList.add(shapetype);
    obj.style.color = LightenDarkenColor(color,-80);
    if(shapetype === "triangle"){
        var tr_bw = "0px " + size_w/2 + "px " + size_h + "px "+ size_w/2 + "px";
        var tr_bc = "transparent transparent " + color + " transparent";
        obj.style.borderWidth = tr_bw;
        obj.style.borderColor = tr_bc;
    }
    else{
        obj.style.backgroundColor = color;
    }
    
    //イベント設定
    obj.onmousedown = function(event) {
      obj.setAttribute("ismoving",true);
      
      var listObj = document.getElementById("shapeslist").options[obj.id];
      listObj.selected = true;
      listObj.dispatchEvent(new Event('click'));

      let shiftX = event.clientX - obj.getBoundingClientRect().left;
      let shiftY = event.clientY - obj.getBoundingClientRect().top;

      obj.style.position = 'absolute';
      obj.style.zIndex = 1000;
      //document.body.append(obj);
      palette.append(obj);

      moveAt(event.pageX, event.pageY);

      // ボールを（pageX、pageY）座標の中心に置く
      function moveAt(pageX, pageY) {
        obj.style.left = pageX - shiftX + 'px';
        obj.style.top = pageY - shiftY + 'px';
      }

      function onMouseMove(event) {
        if(obj.getAttribute("ismoving") === "true"){
            moveAt(event.pageX, event.pageY);
        }
      }

      // (3) mousemove でボールを移動する
      document.addEventListener('mousemove', onMouseMove);

      // (4) ボールをドロップする。不要なハンドラを削除する
      obj.onmouseup = function() {
        document.removeEventListener('mousemove', onMouseMove);
        obj.onmouseup = null;
        obj.setAttribute("ismoving",false);
      };

    };
    obj.ondragstart = function() {
      return false;
    };
    
    //リスト追加
    var shapeslist = document.getElementById("shapeslist");
    var shape = document.createElement("option");
    shape.text = txt;
    shape.value = shapeslist.length;
    shape.onclick = function() {
        var targetObj = document.getElementById(shape.value);
        document.getElementById("txt_change").value = targetObj.getAttribute("txt");
        document.getElementById("shapetype_change").value = targetObj.getAttribute("shapetype");
        document.getElementById("color_change").value = targetObj.getAttribute("color");
        document.getElementById("size_height_change").value = targetObj.getAttribute("height");
        document.getElementById("size_width_change").value = targetObj.getAttribute("width");
    };
    shapeslist.appendChild(shape);
    shape.selected = true;
    
    //追加
    obj.id = shape.value;
    palette.appendChild(obj);
    
    shape.dispatchEvent(new Event('click'));
}

function getRandomColor(){
    //var color = (Math.random() * 0xFFFFFF | 0).toString(16);
    //var randomColor = "#" + ("000000" + color).slice(-6);
    //return randomColor;
    return hsl2htmlCode( 360 * Math.random(),
             (25 + 70 * Math.random()),
             (85 + 10 * Math.random()));
}
function hsl2htmlCode(h, s, l){
    var max,min;
    var rgb = {'r':0,'g':0,'b':0};

    if (h == 360){
        h = 0;
    }

    if(l <= 49){
        max = 2.55 * (l + l * (s / 100));
        min = 2.55 * (l - l * (s / 100));
    }else{
        max = 2.55 * (l + (100 - l) * (s / 100));
        min = 2.55 * (l - (100 - l) * (s / 100)); 
    }  

    if (h < 60){
        rgb.r = max;
        rgb.g = min + (max - min) * (h / 60) ;
        rgb.b = min;
        }else if (h >= 60 &&  h < 120){
        rgb.r = min + (max - min) * ((120 - h) / 60);
        rgb.g = max ;
        rgb.b = min;    
        }else if (h >= 120 &&  h < 180){
        rgb.r = min;
        rgb.g = max ;
        rgb.b = min + (max - min) * ((h - 120) / 60);
        }else if (h >= 180 &&  h < 240){
        rgb.r = min;
        rgb.g = min + (max - min) * ((240 - h) / 60);
        rgb.b = max;     
        }else if (h >= 240 &&  h < 300){
        rgb.r = min + (max - min) * ((h - 240) / 60);
        rgb.g = min;
        rgb.b = max;     
        }else if (h >= 300 &&  h < 360){
        rgb.r = max;
        rgb.g = min;
        rgb.b = min + (max - min) * ((360 - h) / 60); 
    } 

    rgb.r =  Math.round(rgb.r).toString(16);
    rgb.g =  Math.round(rgb.g).toString(16);
    rgb.b =  Math.round(rgb.b).toString(16);
    return "#" + rgb.r + rgb.g + rgb.b; 
}
function LightenDarkenColor(col,amt) {
    var usePound = false;
    if ( col[0] == "#" ) {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col,16);

    var r = (num >> 16) + amt;

    if ( r > 255 ) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if ( b > 255 ) b = 255;
    else if  (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if ( g > 255 ) g = 255;
    else if  ( g < 0 ) g = 0;

    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}
