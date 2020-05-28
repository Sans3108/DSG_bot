//const f = require('../functions.js');

module.exports = {
  getIDfromMention: function(a) {
    if (typeof a !== typeof "string")
      return new Error("Param 1 is not a string!");

    if (a.startsWith("<@") && a.endsWith(">")) {
      let id = a.slice(2, -1);
      if (id.startsWith("!")) {
        id = id.slice(1);
      }
      return id;
    } else return new Error("Doesn't start with <@ and end with >");
  },
  randomNumber: function(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  },
  arrayContains: function(needle, arrhaystack) {
    return arrhaystack.includes(needle);
  },
  hasPing: function(id, message) {
    if(!id || !message) return new Error('Missing parameters!');
    
    let v;
    
    if (message.content.includes(`<@${id}>`) || message.content.includes(`<@!${id}>`)) {
      if (message.author.id !== id) {
        v = true;
      } else {
        v = false;
      }
    } else {
      v = false;
    }

    return v;
  },
  arrayRandom: function(arr) {
    if(!Array.isArray(arr)) return Error('Passed argument is not an array!');
    
    return arr[Math.floor((Math.random()*arr.length))];
  },
  chance: function(percentage) {
    let percent = parseInt(percentage);
    
    if(percent >= 0 && percent <= 100) {} else return new Error('Number must be between 0 - 100!');
    
    let arr = [];
    
    for(let i = 0; i < percent; i++) {
      arr.push(true);
    }
    
    let howMuch = parseInt(100 - arr.length);
    
    for(let j = 0; j < howMuch; j++) {
      arr.push(false);
    }
    
    return this.arrayRandom(arr);
  },
  arrayCount: function(what, array) {
    if(!Array.isArray(array)) return Error('Passed argument is not an array!');
    
    var count = 0;
    for (var i = 0; i < array.length; i++) {
        if (array[i] === what) {
            count++;
        }
    }
    return count;
  }
};