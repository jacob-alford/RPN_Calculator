let buttons = {};
let stack = [0];
let tapeLength = [];
let tapeHist = [];
let hasBeenUpdated = false;
let hasEntered = false;
let currentNum = [];
let clearClicks = 0;

class button{
  constructor(title,fn,rd){
    this.title = title;
    this.fn = fn;
    this.readout = rd;
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

let swap = new button("swap",arr => {
    let temp1 = [];
    for(let c=arr.length-1;c>arr.length-3;c--) temp1.push(arr[c]);
    return popArr(popArr(arr)).concat(temp1);
},() => {
  return [`${stack[stack.length-1]} &leg; ${stack[stack.length-2]}`];
});

let roll = new button("roll",arr => {
  let lastVal = arr.pop();
  arr.unshift(lastVal);
  return arr;
},() => {
  return [`ROLL`];
});

let mod = new button("mod",arr => {
  let newVal = arr[arr.length-2]%arr[arr.length-1];
  doublePop(arr);
  arr.push(newVal);
  return arr;
},stack => {
  return [`${stack[stack.length-2]} mod(${stack[stack.length-1]})`,`&emsp;=${stack[stack.length-2]%stack[stack.length-1]}`];
});

let div = new button("&#247;",arr => {
  let newVal = arr[arr.length-2]/arr[arr.length-1];
  doublePop(arr);
  arr.push(newVal);
  return arr;
},stack => {
  return [`${stack[stack.length-1]}/${stack[stack.length-2]}`,`&emsp;=${stack[stack.length-1] / stack[stack.length-2]}`];
});

let mult = new button("&#215;",arr => {
  let newVal = arr[arr.length-2]*arr[arr.length-1];
  doublePop(arr);
  arr.push(newVal);
  return arr;
},stack => {
  return [`${stack[stack.length-1]}&times;${stack[stack.length-2]}`,`&emsp;=${stack[stack.length-1] * stack[stack.length-2]}`];
});

let sub = new button("-",arr => {
  let newVal = arr[arr.length-2]-arr[arr.length-1];
  doublePop(arr);
  arr.push(newVal);
  return arr;
},stack => {
  return [`${stack[stack.length-2]}-${stack[stack.length-1]}`,`&emsp;=${stack[stack.length-2] - stack[stack.length-1]}`];
});

let add = new button("+",arr => {
  let newVal = arr[arr.length-2]+arr[arr.length-1];
  doublePop(arr);
  arr.push(newVal);
  return arr;
},stack => {
  return [`${stack[stack.length-1]}+${stack[stack.length-2]}`,`&emsp;=${stack[stack.length-1] + stack[stack.length-2]}`];
});

let enter = new button("enter",(arr,num) => {
  if(!hasBeenUpdated){
    arr[0] = num;
    hasBeenUpdated = true;
  }else{
    arr.push(num);
  }
  return arr;
},(stack,num) => {
  return [`ENTER ${num}`];
});

let drop = new button("drop",arr => {
  arr.pop();
  return arr;
},(stack,num) => {
  return [`DROP ${stack[stack.length-1]}`];
});

const clearAll = () => {
  ClearDisplay();
  ClearTape();
}

const clearNext = () => {
  if(clearClicks == 0){
    clearClicks++;
    ClearDisplay();
  }else{
    ClearDisplay();
    ClearTape();
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
  //if(!hasEntered) pushStack();
  let tempTape = btn.print(stack,num);
  let check = [true];
  if(!(tempTape[1] === undefined)){
    if(tempTape[1].includes("NaN")){
      ClearDisplay();
      alert("This function requires two numbers!");
      check=[false,tempTape[1].indexOf("NaN")];
    }else{
      tapeLength.push(tapeLength.length);
      if(tapeLength.length < 10) $(`#d${tapeLength.length}`).remove();
      $("#tape").prepend(`<tr><td><h1 style="height:48px;">${tempTape[1]}</h1></td></tr>`);
      $("#tape").prepend(`<tr><td><h1 style="height:48px;">${tempTape[0]}</h1></td></tr>`);
    }
  }else $("#tape").prepend(`<tr><td><h1 style="height:48px;">${tempTape[0]}</h1></td></tr>`);
  tapeLength.push(tapeLength.length);
  if(tapeLength.length < 10 && check[0]) $(`#d${tapeLength.length}`).remove();
  $("#display").html("");
  stack = btn.execute(stack,num);
  let numLines = stack.length;
  if(!check[0]) {
    stack.splice(0, check[1]);
    $("#display").append(`<tr><td><h1 style="height:48px;">0</h1></td></tr>`);
  }
  stack.forEach((c,i) => {
    if(i<6 && check[0]) $("#display").append(`<tr><td><h1 style="height:48px;">${commas(c)}</h1></td></tr>`);
  });
  if(numLines<6){
    for(let i=0;i<6-numLines;i++)  $("#display").prepend(`<tr><td><h1 style="height:48px;"></h1></td></tr>`);
  }
}

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
  Controller(enter,reverseNum(currentNum.reduce((a,c,i) => {
    if(c == 0) return a = a*10;
    else return a += c * Math.pow(10,i);
    })));
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
});
