import _ from "lodash"
import {number} from "echarts";

type Currency ={
  money: string,
  suffix: string
}

/**
 * formatter file size
 * @param bytes
 */
const formatterSize = (bytes) =>{
  if(_.isString(bytes)){
    bytes = _.toNumber(bytes);
  }
  if (bytes == 0) return '0 B';
  let k = 1024; //设定基础容量大小
  let sizeStr = ['B','KB','MB','GB','TB','PB','EB','ZB','YB']; //容量单位
  let i = 0; //单位下标和次幂
  for(let l=0;l<8;l++){
    if(bytes / Math.pow(k, l) < 1){
      break;
    }
    i = l;
  }
  return (bytes / Math.pow(k, i)).toFixed(3) + ' ' + sizeStr[i];  //循环结束 或 条件成立 返回字符
}

/**
 * formatter file size from mb
 * @param bytes
 */
const formatterSizeFromMB = (bytes) =>{
  if(_.isString(bytes)){
    bytes = _.toNumber(bytes);
  }
  if (bytes == 0) return '0 MB';
  let k = 1024; //设定基础容量大小
  let sizeStr = ['MB','GB','TB','PB','EB','ZB','YB']; //容量单位
  let i = 0; //单位下标和次幂
  for(let l=0;l<6;l++){
    if(bytes / Math.pow(k, l) < 1){
      break;
    }
    i = l;
  }
  return (bytes / Math.pow(k, i)).toFixed(3) + ' ' + sizeStr[i];  //循环结束 或 条件成立 返回字符
}

/**
 * formatter coin
 * @param coin
 */
const formatterCurrency = (coin:number): Currency =>{
  if(_.isString(coin)){
    coin = _.toNumber(coin);
  }
  if (coin == 0) return {money: '0', suffix: 'TCESS'};
  let k = 1000; //设定基础货币换算比例
  let currencyStr = ['PICO','NANO','MICRO','MILLI','TCESS','KILO','MILL','BILL']; //容量单位
  let i = 0; //单位下标和次幂
  for(let l=0;l<8;l++){
    if(coin / Math.pow(k, l) < 1){
      break;
    }
    i = l;
  }
  return { money: (coin / Math.pow(k, i)).toFixed(3), suffix:currencyStr[i]};
}

/**
 * formatter coin
 * @param coin
 */
const formatterCurrencyStr = (coin:number): string =>{
  if(_.isString(coin)){
    coin = _.toNumber(coin);
  }
  if (coin == 0) return "0 TCESS";
  let k = 1000; //设定基础货币换算比例
    let currencyStr = ['PICO','NANO','MICRO','MILLI','TCESS','KILO','MILL','BILL']; //容量单位
  let i = 0; //单位下标和次幂
  for(let l=0;l<8;l++){
    if(coin / Math.pow(k, l) < 1){
      break;
    }
    i = l;
  }
  return `${(coin / Math.pow(k, i)).toFixed(3)} ${currencyStr[i]}`;
}

/**
 * check is json
 * @param str
 */
const isJson = (str:string): boolean =>{
  let isValid = true;
  if (typeof str == 'string') {
    try {
      let obj=JSON.parse(str);
      if(typeof obj == 'object' && obj ){

      }else{
        isValid = false;
      }

    } catch(e) {
      console.log('error：'+str+'!!!'+e);
      isValid = false;
    }
  }
  return isValid;
}


export {
  formatterSize,
  formatterSizeFromMB,
  formatterCurrency,
  formatterCurrencyStr,
  isJson
}
