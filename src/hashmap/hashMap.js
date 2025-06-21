const { LinkedList } = require("../linkedList/LinkedList");

class HashMap {
	#loadFactor;
	#length;
	#capacity;
	#buckets;

	constructor() {
		this.#loadFactor = 0.8;
		this.#capacity = 16;
		this.#buckets = new Array(this.#capacity);
		this.#length = 0;
	}

	get length() {
		return this.#length;
	}

	hash(key) {
		let hashCode = 0;

		const primeNumber = 31;
		for (let i = 0; i < key.length; ++i) {
			hashCode = primeNumber * hashCode + key.charCodeAt(i);
		}

		return hashCode;
	}

	set(key, value) {
		if (!this.has(key)) {
			this.#addToMap(key, value);
			++this.#length;
			this.#checkLoadFactor();
		} else {
			this.#replaceValue(key, value);
		}
	}

	get(key) {
		const bucket = this.#getBucket(key);
		if (bucket !== undefined) {
			for (let i = 0; i < bucket.size; ++i) {
				const currPair = bucket.at(i);
				if (currPair.key === key) {
					return currPair.value;
				}
			}
		}
		return null;
	}

	has(key) {
		const bucket = this.#getBucket(key);
		if (bucket !== undefined) {
			for (let i = 0; i < bucket.size; ++i) {
				if (bucket.at(i).key === key) {
					return true;
				}
			}
		}
		return false;
	}

	remove(key) {
		const bucket = this.#getBucket(key);
		if (bucket !== undefined) {
			for (let i = 0; i < bucket.size; ++i) {
				if (bucket.at(i).key === key) {
					bucket.removeAt(i);
					--this.#length;
					return true;
				}
			}
		}
		return false;
	}

	clear() {
		for (let i = 0; i < this.#capacity; ++i) {
			this.#buckets[i] = undefined;
		}
		this.#length = 0;
	}

	keys() {
		return this.#getKeyValues(true, false);
	}

	values() {
		return this.#getKeyValues(false, true);
	}

	entries() {
		return this.#getKeyValues(true, true);
	}

	#createPair(key, value) {
		return { key: key, value: value };
	}

	#getIndex(key) {
		return this.hash(key) % this.#capacity;
	}

	#getBucket(key) {
		const index = this.#getIndex(key);
		return this.#buckets[index];
	}

	#addToMap(key, value) {
		const pair = this.#createPair(key, value);
		const index = this.#getIndex(key);

		if (this.#buckets[index] === undefined) {
			this.#buckets[index] = new LinkedList();
		}
		this.#buckets[index].append(pair);
	}

	#replaceValue(key, value) {
		const bucket = this.#getBucket(key);
		for (let i = 0; i < bucket.size; ++i) {
			if (bucket.at(i).key === key) {
				bucket.at(i).value = value;
				return;
			}
		}
	}

	#checkLoadFactor() {
		if (this.#length > this.#capacity * this.#loadFactor) {
			this.#resize();
		}
	}

	#resize() {
		const oldCapacity = this.#capacity;
		const oldBuckets = this.#buckets;
		this.#capacity = oldCapacity * 2;
		this.#buckets = new Array(this.#capacity);

		for (let i = 0; i < oldCapacity; ++i) {
			const currBucket = oldBuckets[i];
			if (currBucket === undefined) {
				continue;
			}
			for (let j = 0; j < currBucket.size; ++j) {
				const pair = currBucket.at(j);
				this.#addToMap(pair.key, pair.value);
			}
		}
	}

	#getKeyValues(getKeys, getValues) {
		const keyValues = [];
		for (let i = 0; i < this.#capacity; ++i) {
			const currBucket = this.#buckets[i];
			if (currBucket !== undefined) {
				for (let j = 0; j < currBucket.size; ++j) {
					const pair = currBucket.at(j);
					if (getKeys && getValues) {
						keyValues.push([pair.key, pair.value]);
					} else if (getKeys) {
						keyValues.push(pair.key);
					} else {
						keyValues.push(pair.value);
					}
				}
			}
		}
		return keyValues;
	}
}

module.exports = { HashMap };
