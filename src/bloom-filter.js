const { NotImplementedError } = require("../extensions/index.js");

module.exports = class BloomFilter {
  constructor(size = 100) {
    this.size = size;
    this.storage = this.createStore(size);
  }

  insert(item) {
    const hashValues = this.getHashValues(item);
    hashValues.forEach(val => this.storage[val] = true);
  }

  mayContain(item) {
    const hashValues = this.getHashValues(item);
    for (let i = 0; i < hashValues.length; i++) {
      if (!this.storage[hashValues[i]]) {
        return false;
      }
    }
    return true;
  }

  createStore(size) {
    let storage = [];
    for (let i = 0; i < size; i++) {
      storage.push(false);
    }
    return storage;
  }

  hash1(item) {
    let hash = 0;
    for (let i = 0; i < item.length; i++) {
      hash = (hash << 5) + hash + item.charCodeAt(i);
      hash = hash & hash;
      hash = Math.abs(hash);
    }
    return hash % this.size;
  }

  hash2(item) {
    let hash = 5381;
    for (let i = 0; i < item.length; i++) {
      hash = ((hash << 5) + hash) + item.charCodeAt(i);
      hash = hash & hash;
      hash = Math.abs(hash);
    }
    return hash % this.size;
  }

  // New Hash Function
  hash3(item) {
    let hash = item.split("").reduce((a, b) => { a=((a<<5)-a)+b.charCodeAt(0); return a&a }, 0);  
    return Math.abs(hash) % this.size;
  }

  getHashValues(item) {
    return [this.hash1(item), this.hash2(item), this.hash3(item)];
  }
};
