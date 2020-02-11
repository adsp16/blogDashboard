const input_file = document.getElementById('file-upload');
const output_path = document.getElementById('file-path-value');


input_file.addEventListener("change", (event) => {
  output_path.innerHTML = event.target.value;
})