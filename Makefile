.PHONY: all clean run

all: my_project.wasm
run: server browser
	
server:
	python3 -m http.server &
	sleep 1

browser:
	open http://localhost:8000

clean:
	cargo clean
	rm my_project.wasm

my_project.wasm: target/wasm32-unknown-unknown/release/my_project.wasm
	cp target/wasm32-unknown-unknown/release/my_project.wasm .

target/wasm32-unknown-unknown/release/my_project.wasm:
	cargo build --release --target=wasm32-unknown-unknown
