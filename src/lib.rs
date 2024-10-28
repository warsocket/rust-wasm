// No mangle an dexport name absically doe the same, as do extern and extern "C"
use std::ffi::CString;
use std::ffi::c_char;

static mut mem_from_wasm:[u8;0xFF] = [42;0xFF];

#[no_mangle] //same as  #[export_name = "add"]
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
    unsafe { mem_from_wasm.as_ptr() }
}


#[export_name = "put"]
pub fn put(b:u8) -> () {
    unsafe{
        mem_from_wasm[0] = b;
    }
}


// the following 2 lines are default Module name and type for extern:
// #[link(wasm_import_module = "env")]
// extern "C" {

extern{
    fn console_log(ptr:*const u8, len:usize) -> ();
}

fn wasm_log(str:&str){
    unsafe{
        console_log(str.as_ptr(), str.len());
    }    
}

#[export_name = "print_something_from_wasm"]
pub fn print_something_from_wasm() -> () {
    wasm_log( "Hello World!" );
}



#[link(wasm_import_module = "console")] //our name as defined in wasm start in JS
extern{
    fn log(ptr:&str) -> (); //as you can see rust will translate this &str to *const u8 + usize
}


#[export_name = "print_something_from_wasm_manually"]
pub fn print_something_from_wasm_manually() -> () {
    unsafe{
        log( "Hello World!" );    
    }
}



//somehow these section return an array of memory and you should be able to get multiple in per section, don't know how yet
#[link_section = "CustomSection"]
pub static SECTION_A: [u8; 24] = *b"This is a custom section";    


#[link_section = "CustomSection2"]
pub static SECTION_B: [u8; 26] = *b"This is a custom section 2";