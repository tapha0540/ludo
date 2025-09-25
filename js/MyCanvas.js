/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('my-canvas');
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext('2d');
