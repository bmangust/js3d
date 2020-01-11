const canvas = document.querySelector('canvas'); 
const c = canvas.getContext('2d'); 
canvas.width = innerWidth; 
canvas.height = innerHeight; 
addEventListener('resize', () => { 
	canvas.width = innerWidth; 
	canvas.height = innerHeight;
});

const cube = [
	[-1, -1, -1],
	[1, -1, -1],
	[1, 1, -1],
	[-1, 1, -1],
	[-1, -1, 1],
	[1, -1, 1],
	[1, 1, 1],
	[-1, 1, 1],
];

let angle = 0;

const circle = (dot) => {
	c.beginPath();
	c.fillStyle = '#fafafa';
	c.arc(dot[0] + canvas.width / 2, dot[1] + canvas.width / 2, 8, 0, Math.PI * 2, false);
	c.closePath();
	c.fill();
};


const matmul = (a, b) => {
	const rowsA = a.length;
	const rowsB = b.length;
	const colsA = a[0].length === undefined ? 1 : a[0].length;
	const colsB = b[0].length === undefined ? 1 : b[0].length;
	if (colsA != rowsB) {
		console.log("matrix dimentions mismatch");
		return null;
	}
	let result = new Array(rowsA);

	if (colsB == 1) {
		for (let i = 0; i < rowsA; i++) {
			for (let j = 0; j < colsB; j++) {
				result[i] = 0;
				for (let k = 0; k < rowsB; k++) {
					result[i] += a[i][k] * b[k];
				}
			}
		}
		return result;
	}

	for (let i = 0; i < rowsA; i++) {
		result[i] = new Array(colsB);
		for (let j = 0; j < colsB; j++) {
			result[i][j] = 0;
			for (let k = 0; k < rowsB; k++) {
				result[i][j] += a[i][k] * b[k];
			}
		}
	}
	return result;
};

const connect = (a, b, f) => {
	c.strokeStyle = '#fafafa';
	c.lineWidth = 2;
	c.beginPath();
	c.moveTo(f[a][0] + canvas.width / 2 + 4, f[a][1] + canvas.height / 2 + 4);
	c.lineTo(f[b][0] + canvas.width / 2 + 4, f[b][1] + canvas.height / 2 + 4);
	c.stroke();
};

const draw = () => {

	const rotationZ = [
		[Math.cos(angle), -Math.sin(angle), 0],
		[Math.sin(angle), Math.cos(angle), 0],
		[0, 0, 1],
	];
	const rotationX = [
		[1, 0, 0],
		[0, Math.cos(angle), -Math.sin(angle)],
		[0, Math.sin(angle), Math.cos(angle)],
	];
	const rotationY = [
		[Math.cos(angle), 0, -Math.sin(angle)],
		[0, 1, 0],
		[Math.sin(angle), 0, Math.cos(angle)],
	];

	const projected = new Array(8);
	let index = 0;
	cube.forEach( (dot) => {
		let rotated = matmul(rotationZ, dot);
		rotated = matmul(rotationX, rotated);
		rotated = matmul(rotationY, rotated);

		let distance = 3;
		let z = 1 / (distance - rotated[2]);
		const projection = [
			[z, 0, 0],
			[0, z, 0],
		];

		let projected2d = matmul(projection, rotated);
		projected[index] = projected2d.map( (p) => p *= 100 );
		// console.log(projected[index]);
		circle(projected[index]);
		index++;
	});

	for (let i = 0; i < 4; i++) {
		connect(i, (i+1) % 4, projected);
		connect(i + 4, (i+1) % 4 + 4, projected);
		connect(i, i + 4, projected);
	}
	angle += 0.01;
};

const animate = () => {
	requestAnimationFrame(animate);
	c.fillStyle = '#1a202c';
	c.fillRect(0,0,canvas.width, canvas.height);
	draw();
};

animate();