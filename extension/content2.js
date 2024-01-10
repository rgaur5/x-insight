window.addEventListener('scrollend', function () {
    console.log("Content2 detects scrolling.")
    chrome.runtime.sendMessage({ action: 'scrolling' });
  });

// if (typeof ort !== 'undefined' && ort) {
//     ort.env.wasm.numThreads = 1;
//     console.log('Content Script 2: ort.min.js is available.');
// } else {
//     console.error('Content Script 2: ort.min.js is not available.');
// }

// // Continue with Content Script 2 logic
// console.log('Content Script 2: Executing...');

// try {
//     ort.env.wasm.wasmPaths = {
//     'ort-wasm-simd.wasm': 'extension/onnxruntime-web/dist/ort-wasm-simd.wasm',
//   };
//     ort.env.wasm.numThreads = 1;
//     const model = "./v1.onnx";
//     const session = ort.InferenceSession.create(model);
// } catch (error) {
//     console.error('doidnnt work', error);
// }


//-----------------------------------------------


// function loadWasmModule() {
//     return new Promise((resolve, reject) => {
//         fetch(chrome.runtime.getURL("onnxruntime-web/dist/ort-wasm-simd.wasm"))
//             .then(response => response.arrayBuffer())
//             .then(buffer => {
//                 const base64 = btoa(new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), ''));
//                 const dataUri = 'data:application/wasm;base64,' + base64;

//                 const script = document.createElement('script');
//                 script.textContent = `
//                     (async function() {
//                         const response = await fetch('${dataUri}');
//                         const buffer = await response.arrayBuffer();
//                         const module = await WebAssembly.compile(buffer);
//                         const instance = await WebAssembly.instantiate(module);
//                         window.ort.wasmModule = instance.exports;
//                         console.log('WebAssembly module loaded successfully');
//                         resolve();
//                     })();
//                 `;
//                 document.head.appendChild(script);
//             })
//             .catch(error => {
//                 console.error('Failed to load WebAssembly module:', error);
//                 reject(error);
//             });
//     });
// }

// // Check if ort is available
// if (typeof ort !== 'undefined' && ort) {
//     ort.env.wasm.numThreads = 1;
//     console.log('Content Script 2: ort.min.js is available.');
// } else {
//     console.error('Content Script 2: ort.min.js is not available.');
// }

// // Continue with Content Script 2 logic
// console.log('Content Script 2: Executing...');

// // Load WebAssembly module and then proceed with ort-specific code
// loadWasmModule()
//     .then(() => {
//         try {
//             ort.env.wasm.wasmPaths = {
//                 'ort-wasm-simd.wasm': 'extension/onnxruntime-web/dist/ort-wasm-simd.wasm',
//             };
//             ort.env.wasm.numThreads = 1;
//             const model = "./v1.onnx";
//             const session = ort.InferenceSession.create(model);
//         } catch (error) {
//             console.error('Failed to initialize ort:', error);
//         }
//     });
