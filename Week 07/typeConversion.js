const HEX_MAP = {
    2: {
      reg:/^(0b)[0-1]+$/g,
      prefix: '0b',
    },
    8:{
      reg: /^(0o)[0-7]+$/g,
      prefix: '0o'
    }, 
    10: {
      reg:/(^\d+$)|(^\.\d+$)|(^\d+e[\+]\d+$)/g,
      prefix: '',
    },
    16: {
      reg: /^(0x)([\da-f])+$/,
      prefix: '0x'
    }
}

const num2String = (num, hex) => {
  if(hex in HEX_MAP) {
    return HEX_MAP[hex].prefix + num.toString(hex);
  }
  return 'NaN';
}


const string2Num = str => {
  for(let hex in HEX_MAP) {
    const {reg} = HEX_MAP[hex];
    if(reg && reg.test(str)) {
      if(hex !== '10') {
        return Number.parseInt(str.slice(2), hex);
      }
      return Number(str);
    }
  }
  return NaN;
}