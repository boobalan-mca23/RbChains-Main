export const generateLotName = () => {
  const now = new Date();
  const random = Math.floor(Math.random() * 900) + 100;

  const formatted =
    now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, "0") +
    String(now.getDate()).padStart(2, "0") +
    "_" +
    String(now.getHours()).padStart(2, "0") +
    String(now.getMinutes()).padStart(2, "0") +
    String(now.getSeconds()).padStart(2, "0") +
    "_" +
    random;

  return `lot${formatted}`;
};
