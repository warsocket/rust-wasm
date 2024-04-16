// No mangle an dexport name absically doe the same, as do extern and extern "C"

#[no_mangle]
pub fn add(left: usize, right: usize) -> usize {
    left + right
}


#[export_name = "sub"]
pub extern "C" fn sub(left: usize, right: usize) -> usize {
    left - right
}


//Using Math.random from JavaScript
#[link(wasm_import_module = "Math")]
extern{
    fn random() -> f64;
}

#[export_name = "rnd"]
pub extern fn rnd() -> usize {
    (unsafe{random()}*0xFFFFFF as f64).floor() as usize
}    
