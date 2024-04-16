window.addEventListener("load", main) // or document DOMContentLoaded

async function main(){
	let resp = await fetch("my_project.wasm")


	//const importObject = { Math }; //needs unsafe in rust
	const importObject = { Math: {random: () => Math.random()} };
	const wasm = await WebAssembly.instantiateStreaming(resp, importObject)

	console.log("add")
	console.log(wasm.instance.exports.add(7, 3))

	console.log("sub")
	console.log(wasm.instance.exports.sub(7, 3))

	console.log("rnd")
	console.log(wasm.instance.exports.rnd())
}