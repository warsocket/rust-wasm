// No mangle an dexport name absically doe the same, as do extern and extern "C"
use std::ffi::CString;
use std::ffi::c_char;

static mut mem:[u8;0xFF] = [42;0xFF];

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


#[export_name = "get_ptr"]
pub fn get_ptr() -> *const u8 {
    unsafe { mem.as_ptr() }
}


#[export_name = "put"]
pub fn put(b:u8) -> () {
    unsafe{
        mem[0] = b;
    }
}


#[export_name = "print"]
pub fn print() -> () {
    unsafe{
        log( "xxxzzz" );
    }
}


#[link(wasm_import_module = "console")]
extern "C" {
    pub fn log(s:&str);
}


// #[link(wasm_import_module = "Console")]
// extern{
//     fn log(ptr:usize, len:usize) -> ();
// }

