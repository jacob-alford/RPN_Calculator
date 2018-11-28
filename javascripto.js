let buttons = [];

class button{
  constructor(title,fn){
    this.title = title;
    this.fn = fn;
    addButton(this);
  }
  execute(stack){
    return this.fn(stack);
  }
}

const addButton = btn => {
    buttons.push(btn);
}

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
});

let roll = new button("roll",arr => {
  let lastVal = arr.pop();
  arr.unshift(lastVal);
  return arr;
});

let mod = new button("mod",arr => {
  let newVal = arr[arr.length-2]%arr[arr.length-1];
  doublePop(arr);
  arr.push(newVal);
  return arr;
});

let div = new button("&#247;",arr => {
  let newVal = arr[arr.length-2]/arr[arr.length-1];
  doublePop(arr);
  arr.push(newVal);
  return arr;
});

let mult = new button("&#215;",arr => {
  let newVal = arr[arr.length-2]*arr[arr.length-1];
  doublePop(arr);
  arr.push(newVal);
  return arr;
});

let sub = new button("-",arr => {
  let newVal = arr[arr.length-2]-arr[arr.length-1];
  doublePop(arr);
  arr.push(newVal);
  return arr;
});

let add = new button("+",arr => {
  let newVal = arr[arr.length-2]+arr[arr.length-1];
  doublePop(arr);
  arr.push(newVal);
  return arr;
});

let enter = new button("enter",arr => {
  arr.push(arr[arr.length-1]);
  return arr;
});

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

});
