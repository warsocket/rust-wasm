window.addEventListener("load", main) // or document DOMContentLoaded

async function main(){

	let resp

	resp = await fetch("./target/wasm32-unknown-unknown/release/wasm_example.wasm")
	// consol.
	if (!resp.ok){

		// console.log("release build not found, trying debug build.")

		resp = await fetch("./target/wasm32-unknown-unknown/debug/wasm_example.wasm")
		if (!resp.ok){
			// console.log("debug build not found, no WASM module found!")
			document.write("DEBUG an RELEASE build wasm module not found!")
			
		}else{
			document.write("Using DEBUG build wasm module:<br>See console for demo output")
		}
		

	}else{
		document.write("Using RELEASE build wasm module:<br>See console for demo output")
	}



	

	//This wont abe accessible in rust unless we use, link-args=--import-memory, but then rust wont be able to manage memory itself (which is quite convenient)
	const js_memory = new WebAssembly.Memory({ //in 64k chunks, so 640k in this case
  		initial: 10,
  		maximum: 10,
	})


	const importObject = { 
		js: {mem: js_memory}, //default place to import memory
		env:{ //default module when no name is given in rust
			console_log(ptr, len){
				const decoder = new TextDecoder()
				const str = decoder.decode(wasm.instance.exports.memory.buffer.slice(ptr, ptr+len)) //this works because of sort of lazy evaluation of wasm object
				console.log(str)
			},
		},
		Math: {
			random: () => Math.random(),
		},		
		console, //just plainly import console module wich has function log, warm, etc (remember console.log)
	};


	const wasm = await WebAssembly.instantiateStreaming(resp, importObject)



	console.log("add:")
	console.log(wasm.instance.exports.add(7, 3))

	console.log("sub:")
	console.log(wasm.instance.exports.sub(7, 3))

	console.log("rnd:")
	console.log(wasm.instance.exports.rnd())

	////////////////////////////////////////////////////////////////////////////////////////

	console.log("print something from wasm:")
	wasm.instance.exports.print_something_from_wasm()

	console.log("print something from wasm manually, directly invokes console.log with 2 parameters:")
	wasm.instance.exports.print_something_from_wasm_manually()

	////////////////////////////////////////////////////////////////////////////////////////

	console.log("get wasm initialised memory (continuous memory so gets pointer):")
	const ptr = wasm.instance.exports.get_ptr()
	console.log(ptr)

	console.log("write a byte in wasm memory [adress:0 of array in rust] using rust function, and read back using JS:")
	const byte = Math.floor(Math.random()*0x100)

	console.log(`wrinting byte: ${byte}`)
	wasm.instance.exports.put(byte)

	const wasmMemory = new Uint8Array(wasm.instance.exports.memory.buffer);
	console.log(`reading byte: ${wasmMemory[ptr]}`)

	////////////////////////////////////////////////////////////////////////////////////////

	console.log("print wasm memory size is pages (64K):")
	console.log( wasm.instance.exports.memory.buffer.byteLength / 1024 / 64)


	console.log("Read a custom sections from section 'CustomSection':")
	let sections = WebAssembly.Module.customSections(wasm.module, "CustomSection");
	for (const arr of sections){
		const decoder = new TextDecoder();
		const text = decoder.decode(arr);
		console.log(`    ${text}`)
	}
	
	
	console.log("Read a custom sections from section 'CustomSection2':")
	sections = WebAssembly.Module.customSections(wasm.module, "CustomSection2");
	for (const arr of sections){
		const decoder = new TextDecoder();
		const text = decoder.decode(arr);
		console.log(`    ${text}`)
	}
	

	// let wasmMemory = new Uint8Array(wasm.instance.exports.memory.buffer);
	// let ptr = wasm.instance.exports.get_ptr()
	// console.log(wasmMemory[ptr])
	// wasm.instance.exports.put(32)
	// console.log(wasmMemory[ptr])



}
