window.addEventListener("load", main) // or document DOMContentLoaded

async function main(){
	let resp = await fetch("my_project.wasm")


	//const importObject = { Math }; //needs unsafe in rust
	// const memory = new WebAssembly.Memory({ //64k
  	// 	initial: 16,
  	// 	maximum: 16,
	// })
	// const view = new Uint8Array(memory.buffer)


	// console.log(memory)
	// console.log(memory.buffer)
	// console.log(`view[0] = ${view[0]}`)

	// const importObject = { js: {mem: memory}, Math: {random: () => Math.random()} };
	const importObject = { Math: {random: () => Math.random()}, console };
	const wasm = await WebAssembly.instantiateStreaming(resp, importObject)


	console.log("add")
	console.log(wasm.instance.exports.add(7, 3))

	console.log("sub")
	console.log(wasm.instance.exports.sub(7, 3))

	console.log("rnd")
	console.log(wasm.instance.exports.rnd())

	console.log("print")
	wasm.instance.exports.print()


	// let wasmMemory = new Uint8Array(wasm.instance.exports.memory.buffer);
	// let ptr = wasm.instance.exports.get_ptr()
	// console.log(wasmMemory[ptr])
	// wasm.instance.exports.put(32)
	// console.log(wasmMemory[ptr])



}
