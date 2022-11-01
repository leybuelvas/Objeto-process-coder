/**
 * Toma un número y un objeto como argumentos, luego recorre el número y genera un número aleatorio
 * entre 0 y 9, luego verifica si el número aleatorio es una clave en el objeto, si lo es, incrementa
 * el valor de ese clave por 1, si no lo es, crea una nueva clave con el número aleatorio como clave y
 * establece el valor en 1
 * @param cantidad - El número de números aleatorios a generar.
 * @param obj - {
 * @returns {
 *   0: 1,
 *   1: 1,
 *   2: 1,
 *   3: 1,
 *   4: 1,
 *   5: 1,
 *   6: 1,
 *   7: 1,
 *   8: 1,
 *   9: 1,
 * }
 */
process.on("message", (msg) => {
  const { cantidad, obj } = msg;
  const result = randomNum(cantidad, obj);
  process.send(result);
});

const randomNum = (cantidad, obj) => {
  for (let i = 0; i < cantidad; i++) {
    const random = Math.floor(Math.random() * 10);
    if (obj[random]) {
      obj[random]++;
      continue;
    }
    obj[random] = 1;
  }
  return obj;
};
