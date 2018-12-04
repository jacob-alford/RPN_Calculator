let buttons = {};
let stack = [0];
let tapeLength = [];
let tapeHist = [];
let hasBeenUpdated = false;
let hasEntered = false;
let currentNum = [];
let clearClicks = 0;
let trigState = "deg";

let trigResolve = {
  "sin":x => (trigState == "deg")?Math.sin(x*Math.PI/180)*(180/Math.PI):Math.sin(x),
  "cos":x => (trigState == "deg")?Math.sin(x*Math.PI/180)*(180/Math.PI):Math.cos(x),
  "tan":x => (trigState == "deg")?Math.sin(x*Math.PI/180)*(180/Math.PI):Math.tan(x),
  "asin":x => (trigState == "deg")?Math.asin(x)*(180/Math.PI):Math.asin(x),
  "acos":x => (trigState == "deg")?Math.acos(x)*(180/Math.PI):Math.acos(x),
  "atan":x => (trigState == "deg")?Math.atan(x)*(180/Math.PI):Math.atan(x)
}

class button{
  constructor(title,reqInputs,fn,rd){
    this.title = title;
    this.fn = fn;
    this.readout = rd;
    this.req = reqInputs;
    addButton(this);
  }
  execute(stack,num){
    return this.fn(stack,num);
  }
  print(a,b){
    return this.readout(a,b);
  }
}

const addButton = btn => buttons[btn.title] = btn;

const popArr = arr => {
  arr.pop();
  return arr;
}

const doublePop = arr => {
  arr.pop();
  arr.pop();
  return arr;
}

let swap = new button("swap",2,arr => {
    let temp1 = [];
    for(let c=arr.length-1;c>arr.length-3;c--) temp1.push(arr[c]);
    return popArr(popArr(arr)).concat(temp1);
},() => {
  return [`${stack[stack.length-1]} &leg; ${stack[stack.length-2]}`];
});

let roll = new button("roll",2,arr => {
  let lastVal = arr.pop();
  arr.unshift(lastVal);
  return arr;
},() => {
  return [`ROLL`];
});

let mod = new button("mod",2,arr => {
  let newVal = arr[arr.length-2]%arr[arr.length-1];
  doublePop(arr);
  arr.push(newVal);
  return arr;
},stack => {
  return [`${stack[stack.length-2]} mod(${stack[stack.length-1]})`,stack[stack.length-2]%stack[stack.length-1]];
});

let div = new button("&#247;",2,arr => {
  let newVal = arr[arr.length-2]/arr[arr.length-1];
  doublePop(arr);
  arr.push(newVal);
  return arr;
},stack => {
  return [`${stack[stack.length-2]}/${stack[stack.length-1]}`,stack[stack.length-2] / stack[stack.length-1]];
});

let mult = new button("&#215;",2,arr => {
  let newVal = arr[arr.length-2]*arr[arr.length-1];
  doublePop(arr);
  arr.push(newVal);
  return arr;
},stack => {
  return [`${stack[stack.length-1]}&times;${stack[stack.length-2]}`,stack[stack.length-1] * stack[stack.length-2]];
});

let sub = new button("-",2,arr => {
  let newVal = arr[arr.length-2]-arr[arr.length-1];
  doublePop(arr);
  arr.push(newVal);
  return arr;
},stack => {
  return [`${stack[stack.length-2]}-${stack[stack.length-1]}`,stack[stack.length-2] - stack[stack.length-1]];
});

let add = new button("+",2,arr => {
  let newVal = arr[arr.length-2]+arr[arr.length-1];
  doublePop(arr);
  arr.push(newVal);
  return arr;
},stack => {
  return [`${stack[stack.length-1]}+${stack[stack.length-2]}`,stack[stack.length-1] + stack[stack.length-2]];
});

let enter = new button("enter",0,(arr,num) => {
  if(!hasBeenUpdated){
    arr[0] = num;
    hasBeenUpdated = true;
  }else{
    arr.push(num);
  }
  return arr;
},(stack,num) => {
  return [`ENTER ${preventOverflow(num)}`];
});

let drop = new button("drop",0,arr => {
  arr.pop();
  return arr;
},(stack,num) => {
  return [`DROP ${preventOverflow(stack[stack.length-1])}`];
});

let sin = new button("sin",0,arr => {
  let temp = detectRounding(trigEval("sin",arr[arr.length-1]));
  arr.pop();
  arr.push(temp);
  return arr;
},(stack,num) => {
  return [`sin(${stack[stack.length-1]})`,trigEval("sin",stack[stack.length-1]).toFixed(6)];
});

let cos = new button("cos",0,arr => {
  let temp = detectRounding(trigEval("cos",arr[arr.length-1]));
  arr.pop();
  arr.push(temp);
  return arr;
},(stack,num) => {
  return [`cos(${stack[stack.length-1]})`,trigEval("cos",stack[stack.length-1]).toFixed(6)];
});

let tan = new button("tan",0,arr => {
  let temp = detectRounding(trigEval("tan",arr[arr.length-1]));
  arr.pop();
  arr.push(temp);
  return arr;
},(stack,num) => {
  return [`tan(${stack[stack.length-1]})`,trigEval("tan",stack[stack.length-1]).toFixed(6)];
});

let asin = new button("asin",0,arr => {
  let temp = detectRounding(trigEval("asin",arr[arr.length-1]));
  arr.pop();
  arr.push(temp);
  return arr;
},(stack,num) => {
  return [`asin(${stack[stack.length-1]})`,trigEval("asin",stack[stack.length-1]).toFixed(6)];
});

let acos = new button("acos",0,arr => {
  let temp = detectRounding(trigEval("acos",arr[arr.length-1]));
  arr.pop();
  arr.push(temp);
  return arr;
},(stack,num) => {
  return [`acos(${stack[stack.length-1]})`,trigEval("acos",stack[stack.length-1]).toFixed(6)];
});

let atan = new button("atan",0,arr => {
  let temp = detectRounding(trigEval("atan",arr[arr.length-1]));
  arr.pop();
  arr.push(temp);
  return arr;
},(stack,num) => {
  return [`atan(${stack[stack.length-1]})`,trigEval("atan",stack[stack.length-1]).toFixed(6)];
});

let factorial = new button("factorial",0,arr => {
    let temp = seq(2,arr[arr.length-1]+1).reduce((a,c) => a = a*c);
    arr.pop();
    arr.push(temp);
    return arr;
},(stack,num) => {
  return [`${stack[stack.length-1]}!`,seq(2,stack[stack.length-1]+1).reduce((a,c) => a = a*c)];
});

let invert = new button("invert",0,arr => {
    let temp = 1/arr[arr.length-1];
    arr.pop();
    arr.push(temp);
    return arr;
},(stack,num) => {
  return [`1/${stack[stack.length-1]}`,1/stack[stack.length-1]];
});

let sqrt = new button("sqrt",0,arr => {
    let temp = Math.sqrt(arr[arr.length-1]);
    arr.pop();
    arr.push(temp);
    return arr;
},(stack,num) => {
  return [`sqrt(${stack[stack.length-1]})`,Math.sqrt(stack[stack.length-1])];
});

let xrt = new button("xrt",2,arr => {
    let temp = Math.pow(arr[arr.length-2],1/arr[arr.length-1]);
    doublePop(arr);
    arr.push(temp);
    return arr;
},(stack,num) => {
  return [`${stack[stack.length-2]}^(1/${stack[stack.length-1]})`,Math.pow(stack[stack.length-2],1/stack[stack.length-1])];
});

let y2x = new button("y2x",2,arr => {
    let temp = Math.pow(arr[arr.length-2],arr[arr.length-1]);
    doublePop(arr);
    arr.push(temp);
    return arr;
},(stack,num) => {
  return [`${stack[stack.length-2]}^${stack[stack.length-1]}`,Math.pow(stack[stack.length-2],stack[stack.length-1])];
});

let xsq = new button("xsq",0,arr => {
    let temp = Math.pow(arr[arr.length-1],2);
    arr.pop();
    arr.push(temp);
    return arr;
},(stack,num) => {
  return [`${stack[stack.length-1]}^2`,Math.pow(stack[stack.length-1],2)];
});

let e2x = new button("e2x",0,arr => {
    let temp = Math.exp(arr[arr.length-1]);
    arr.pop();
    arr.push(temp);
    return arr;
},(stack,num) => {
  return [`e^${stack[stack.length-1]}`,Math.exp(stack[stack.length-1])];
});

let t2x = new button("t2x",0,arr => {
    let temp = Math.pow(2,arr[arr.length-1]);
    arr.pop();
    arr.push(temp);
    return arr;
},(stack,num) => {
  return [`2^${stack[stack.length-1]}`,Math.pow(2,stack[stack.length-1])];
});

let ten2x = new button("ten2x",0,arr => {
    let temp = Math.pow(10,arr[arr.length-1]);
    arr.pop();
    arr.push(temp);
    return arr;
},(stack,num) => {
  return [`10^${stack[stack.length-1]}`,Math.pow(10,stack[stack.length-1])];
});

let log10 = new button("log10",0,arr => {
    let temp = Math.log(arr[arr.length-1])/Math.log(10);
    arr.pop();
    arr.push(temp);
    return arr;
},(stack,num) => {
  return [`log(${stack[stack.length-1]})`,Math.log(stack[stack.length-1])/Math.log(10)];
});

let log2 = new button("log2",0,arr => {
    let temp = Math.log(arr[arr.length-1])/Math.log(2);
    arr.pop();
    arr.push(temp);
    return arr;
},(stack,num) => {
  return [`log_2(${stack[stack.length-1]})`,Math.log(stack[stack.length-1])/Math.log(2)];
});

let ellen = new button("ellen",0,arr => {
    let temp = Math.log(arr[arr.length-1]);
    arr.pop();
    arr.push(temp);
    return arr;
},(stack,num) => {
  return [`ln(${stack[stack.length-1]})`,Math.log(stack[stack.length-1])];
});

let average = new button("average",0,arr => {
    let temp = arr.reduce((a,c) => a += c)/arr.length;
    ClearDisplay();
    arr=[];
    arr.push(temp);
    return arr;
},(stack,num) => {
  return [`avg(${stack.toString()})`,stack.reduce((a,c) => a += c)/stack.length];
});

let sum = new button("sum",0,arr => {
    let temp = arr.reduce((a,c) => a += c);
    ClearDisplay();
    arr=[];
    arr.push(temp);
    return arr;
},(stack,num) => {
  return [`sum(${stack.toString()})`,stack.reduce((a,c) => a += c)];
});

let product = new button("product",0,arr => {
    let temp = arr.reduce((a,c) => a = a*c);
    ClearDisplay();
    arr=[];
    arr.push(temp);
    return arr;
},(stack,num) => {
  return [`product(${stack.toString()})`,stack.reduce((a,c) => a = a*c)];
});

const clearAll = () => {
  ClearDisplay();
  ClearTape();
  stack=[0];
}

const clearNext = () => {
  if(clearClicks == 0){
    clearClicks++;
    ClearDisplay();
    $("#topDisplay").html("Enter a number using the keypad below:");
    currentNum = [];
    stack = [0];
  }else{
    ClearDisplay();
    ClearTape();
    $("#topDisplay").html("Enter a number using the keypad below:");
    currentNum = [];
    clearClicks = 0;
  }
}

const ClearDisplay = () => {
  stack = [];
  $("#display").html(`<tr><td><h1 style="height:48px;"></h1></td></tr>
  <tr><td><h1 style="height:48px;"></h1></td></tr>
  <tr><td><h1 style="height:48px;"></h1></td></tr>
  <tr><td><h1 style="height:48px;"></h1></td></tr>
  <tr><td><h1 style="height:48px;"></h1></td></tr>
  <tr><td><h1 style="height:48px;">0</h1></td></tr>`);
}

const ClearTape = () => {
  $("#tape").html(`<tr id="d1"><td><h1 style="height:48px;"></h1></td></tr>
  <tr id="d2"><td><h1 style="height:48px;"></h1></td></tr>
  <tr id="d3"><td><h1 style="height:48px;"></h1></td></tr>
  <tr id="d4"><td><h1 style="height:48px;"></h1></td></tr>
  <tr id="d5"><td><h1 style="height:48px;"></h1></td></tr>
  <tr id="d6"><td><h1 style="height:48px;"></h1></td></tr>
  <tr id="d7"><td><h1 style="height:48px;"></h1></td></tr>
  <tr id="d8"><td><h1 style="height:48px;"></h1></td></tr>
  <tr id="d9"><td><h1 style="height:48px;"></h1></td></tr>
  <tr id="d10"><td><h1 style="height:48px;"></h1></td></tr>`);
}

const Controller = (btn,num) => {
  clearClicks = 0;
  let inputting = 0;
  let checker = 0;
  if(currentNum.length != 0) inputting = 1;
  if(stack[0] != 0 || stack.length > 1) checker = stack.length;
  if((checker + inputting) < btn.req){
    alert(`${btn.title} requires ${btn.req} present numbers in the stack!`);
  }else{
    if(inputting == 1 && btn.title != "enter") {
      if(stack.length == 1 && stack[0] == 0) stack.pop();
      stack.push(Number(currentNum.toString().replace(/,/g,"")));
      $("#topDisplay").html("Enter a number using the keypad below:");
      currentNum = [];
      inputting = 0;
    }
    if(inputting == 1 && stack[0] == 0 && stack.length == 1 && btn.title == "enter") stack.pop();
    let tempTape = btn.print(stack,num); // Set the tape
    let output = btn.execute(stack,num);
    if(output.includes(NaN)) {
      output[0] = 0;
      $("#topDisplay").html("ERROR");
    }else{
      stack = output;
    }

    if(btn.title == "drop" && stack.length == 0){
      stack[0] = 0;
    }

    // --- Display the Stack ---
    $("#display").html(""); // Reset the stack
    stack.forEach((c,i) => { // Display the stack
      if(i<6) $("#display").append(`<tr><td><h1 style="height:48px;">${commas(c)}</h1></td></tr>`);
    });
    if(stack.length<6){ // Draw empty lines
      for(let i=0;i<6-stack.length;i++)  $("#display").prepend(`<tr><td><h1 style="height:48px;"></h1></td></tr>`);
    }

    // --- Display the tape ---
    tapeLength.push(tapeLength.length);
    if(!(tempTape[1] === undefined)){
      if(tapeLength.length < 11){
        $(`#d${tapeLength.length}`).remove();
          $("#tape").prepend(`<tr><td><h1 style="height:48px;">&emsp;=${preventOverflow(tempTape[1])}</h1></td></tr>`);
        tapeLength.push(tapeLength.length);
        $(`#d${tapeLength.length}`).remove();
          $("#tape").prepend(`<tr><td><h1 style="height:48px;">${tempTape[0]}</h1></td></tr>`);
      }else{
        $("#tape").prepend(`<tr><td><h1 style="height:48px;">&emsp;=${preventOverflow(tempTape[1])}</h1></td></tr>`);
        $("#tape").prepend(`<tr><td><h1 style="height:48px;">${tempTape[0]}</h1></td></tr>`);
      }
    }else{
      if(tapeLength.length < 11){
        $(`#d${tapeLength.length}`).remove();
        $("#tape").prepend(`<tr><td><h1 style="height:48px;">${tempTape[0]}</h1></td></tr>`);
      }else{
        $("#tape").prepend(`<tr><td><h1 style="height:48px;">${tempTape[0]}</h1></td></tr>`);
      }
    }
  }
}

const inputConst = c => {
  if(currentNum.length == 0){
    numInput(c);
  }else{
    let temp=currentNum;
    currentNum = [];
    numInput(Number(temp.toString().replace(/,/g,""))*c);
  }
}

const negate = () => {
  if(currentNum[0] == "-") currentNum.shift();
  else currentNum.unshift("-");
  $("#topDisplay").html(currentNum);
}

const preventOverflow = num => {
  if(num.toString().length > 9){
    console.log(num);
    if(num<1) return num.toExponential(4);
    else return num.toPrecision(4);
  }else return num;
}

const switchTrig = () => {
  if(trigState == "deg"){
    trigState = "rad";
    $("#degRad").html("rad");
  }else{
    trigState = "deg";
    $("#degRad").html("deg");
  }
}

const trigEval = (fn,x) => trigResolve[fn](x);

const backspaceNum = () => {
  currentNum.pop();
  if(currentNum.length != 0){
    $("#topDisplay").html(currentNum);
  }else{
    $("#topDisplay").html("Enter a number using the keypad below:");
  }
}

const numInput = num => {
  if(hasEntered){
    $("#topDisplay").html(num);
    currentNum.push(num);
    hasEntered = false;
  }else{
    if(currentNum.length == 0 || currentNum[0] == 0){
      currentNum[0]=num;
      $("#topDisplay").html(currentNum);
    }else{
      currentNum.push(num);
      $("#topDisplay").html(currentNum);
    }
  }
}

const detectRounding = num => {
  let check1 = num.toString();
  let checkArr = check1.split("");
  if(checkArr.includes("e")){
    if(checkArr.length - check1.indexOf("e") > 2){
      if(checkArr[checkArr.indexOf("e") + 1] == "-"){
        return 0;
      }else{
        return num;
      }
    }else{
      return num;
    }
  }else{
    return num;
  }
}

const reverseNum = num => {
  let temp = num + "";
  let temp2 = temp.split("");
  temp2.forEach((c,i) => temp2[i] = Number(temp2[i]));
  let temp3 = temp2.reduce((a,c,i) => {
    if(c == 0) return a = a*10;
    else return a += c * Math.pow(10,i);
  });
  return temp3;
}

const enterNumber = () => {
  if(currentNum.length == 0 && stack.length != 0){
    Controller(enter,stack[stack.length-1]);
  }else if(currentNum.length == 0 && stack.length == 0){
    Controller(enter,0);
  }else{
      let wrkStr = currentNum.toString().replace(/,/g,"");
      Controller(enter,Number(wrkStr));
  }
    $("#topDisplay").html("Enter a number using the keypad below:");
    hasEntered = true;
    currentNum = [];
}
const pushStack = () => {
  enter.execute(stack,reverseNum(currentNum.reduce((a,c,i) => {
    if(c == 0) return a = a*10;
    else return a += c * Math.pow(10,i);
  })));
}

function commas(str) {
  return (str + "").replace(/\b(\d+)((\.\d+)*)\b/g, function(a, b, c) {
    return (b.charAt(0) > 0 && !(c || ".").lastIndexOf(".") ? b.replace(/(\d)(?=(\d{3})+$)/g, "$1,") : b) + c;
  });
}

const seq = (i,e) => {
  let outputArr = [];
  for(let c=i;c<e;c++) outputArr.push(c);
  return outputArr;
}

const ones = n => {
  let outputArr = [];
  for(let c=0;c<n;c++) outputArr.push(1);
  return outputArr;
}

const rand = (min,max,n) => {
  let outputArr = [];
  for(let c=0;c<n;c++) outputArr.push(Math.random()*(max-min+1) + min);
  return outputArr;
}

const matrix = (shape,arr) => {
  let outputArr = [];
  if(shape.reduce((a,c) => a*c) != arr.length) console.error("Input shape doesn't match input array!");
  else{
    if(shape.length == 3) {
      for(let c=0;c<shape[2];c++) outputArr.push([]);
      for(let c=0;c<shape[2];c++){
        for(let d=0;d<shape[1];d++) outputArr[c].push([]);
      }
      for(let a=0;a<shape[2];a++){
        for(let b=0;b<shape[1];b++){
          for(let c=0;c<shape[0];c++){
            outputArr[a][b].push(arr[shape[2]*a + b + c]);
          }
        }
      }
    }else if(shape.length == 2){
      for(c=0;c<shape[1];c++) outputArr.push([]);
      for(let j=0;j<arr.length;j++){
          outputArr[Math.floor(j/shape[0])].push(arr[j]);
      }
    }
  }
  if(outputArr.length == 0) return false;
  else return outputArr;
}

$(document).ready(function(){
  $(".linkFade").hover(
    function(){ $(this).stop().animate({opacity:.5},"fast") },
    function(){ $(this).stop().animate({opacity:1},"fast") }
  );
  $(document).keypress(function(e){
    var checkWebkitandIE=(e.which==26 ? 1 : 0);
    var checkMoz=(e.which==122 && e.ctrlKey ? 1 : 0);
    e.preventDefault();
    switch(e.originalEvent.key){
      case "1":
        numInput(1);
        break;
      case "2":
        numInput(2);
        break;
      case '3':
        numInput(3);
        break;
      case '4':
        numInput(4);
        break;
      case '5':
        numInput(5);
        break;
        case '6':
        numInput(6);
        break;
      case '7':
        numInput(7);
        break;
      case '8':
        numInput(8);
        break;
      case '9':
        numInput(9);
        break;
      case '0':
        numInput(0);
        break;
      case ".":
        numInput(".");
        break;
      case "+":
        Controller(add);
        break;
      case "-":
        Controller(sub);
        break;
      case "/":
        Controller(div);
        break;
      case "*":
        Controller(mult);
        break;
      case "Enter":
        enterNumber();
        break;
      case "Delete":
        Controller(drop);
        break;
      case "Backspace":
        backspaceNum();
        break;
      case "End":
        clearAll();
        break;
      case "PageDown":
        Controller(swap);
        break;
      case "PageUp":
        Controller(roll);
        break;

    }
});
});
