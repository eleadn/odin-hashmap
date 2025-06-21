class LinkedList {
	#head;
	#tail;
	#length;

	constructor() {
		this.#head = null;
		this.#tail = null;
		this.#length = 0;
	}

	get size() {
		return this.#length;
	}

	get head() {
		return this.#head.data;
	}

	get tail() {
		return this.#tail.data;
	}

	append(data) {
		if (this.#tail === null) {
			this.#createFirst(data);
		} else {
			this.#append(data);
		}
	}

	prepend(data) {
		if (this.#head === null) {
			this.#createFirst(data);
		} else {
			this.#prepend(data);
		}
	}

	at(index) {
		if (typeof index !== "number") {
			throw new TypeError();
		} else if (index < 0 || index >= this.#length) {
			throw new RangeError();
		} else {
			return this.#getNodeAt(index).data;
		}
	}

	shift() {
		this.#popOrShift(false);
	}

	pop() {
		this.#popOrShift(true);
	}

	contains(data) {
		let currentNode = this.#head;
		for (let i = 0; i < this.#length; ++i) {
			if (currentNode.data === data) {
				return true;
			}
			currentNode = currentNode.nextNode;
		}
		return false;
	}

	find(data) {
		let currentNode = this.#head;
		for (let i = 0; i < this.#length; ++i) {
			if (currentNode.data === data) {
				return i;
			}
			currentNode = currentNode.nextNode;
		}
		return null;
	}

	toString() {
		if (this.#length === 0) {
			return "null";
		}

		let result = `( ${this.#head.data} )`;
		let currentNode = this.#head.nextNode;

		for (let i = 1; i < this.#length; ++i) {
			result = `${result} => ( ${currentNode.data} )`;
			currentNode = currentNode.nextNode;
		}

		return `${result} => null`;
	}

	insertAt(data, index) {
		if (index < 0 || index > this.#length) {
			throw new RangeError();
		} else if (index === 0) {
			this.prepend(data);
		} else if (index === this.#length) {
			this.append(data);
		} else {
			this.#insertAt(data, index);
		}
	}

	removeAt(index) {
		if (index < 0 || index >= this.#length) {
			throw new RangeError();
		} else if (index === 0) {
			this.shift();
		} else if (index === this.#length - 1) {
			this.pop();
		} else {
			this.#removeAt(index);
		}
	}

	#createNode(data) {
		this.nextNode = null;
		this.data = data;

		return { nextNode: this.nextNode, data: this.data };
	}

	#createFirst(data) {
		const node = this.#createNode(data);
		this.#head = node;
		this.#tail = node;
		this.#length = 1;
	}

	#append(data) {
		const node = this.#createNode(data);
		this.#tail.nextNode = node;
		this.#tail = node;
		++this.#length;
	}

	#prepend(data) {
		const node = this.#createNode(data);
		node.nextNode = this.#head;
		this.#head = node;
		++this.#length;
	}

	#popOrShift(isPop) {
		if (this.#length === 0) {
			return;
		} else if (this.#length === 1) {
			this.#popHeadTail();
		} else if (isPop) {
			this.#pop();
		} else {
			this.#shift();
		}
	}

	#popHeadTail() {
		this.#head = null;
		this.#tail = null;
		this.#length = 0;
	}

	#shift() {
		const newHead = this.#head.nextNode;
		this.#head.nextNode = null;
		this.#head = newHead;
		--this.#length;
	}

	#pop() {
		const newTail = this.#getNodeAt(this.#length - 2);
		newTail.nextNode = null;
		this.#tail = newTail;
		--this.#length;
	}

	#insertAt(data, index) {
		let newNode = this.#createNode(data);
		let precNode = this.#getNodeAt(index - 1);

		newNode.nextNode = precNode.nextNode;
		precNode.nextNode = newNode;
		++this.#length;

		if (index === this.#length) {
			this.#tail = newNode;
		}
	}

	#removeAt(index) {
		let precNode = this.#getNodeAt(index - 1);
		let toRemove = this.#getNodeAt(index);

		precNode.nextNode = toRemove.nextNode;
		toRemove.nextNode = null;
		--this.#length;
	}

	#getNodeAt(index) {
		if (index === this.#length - 1) {
			return this.#tail.data;
		}

		let currentNode = this.#head;
		for (let i = 0; i < this.#length; ++i) {
			if (i === index) {
				return currentNode;
			}
			currentNode = currentNode.nextNode;
		}
	}
}

module.exports = { LinkedList };
