function generateOrderId() {
  const datePart = new Date().toISOString().slice(2, 8).replace(/-/g, ''); // e.g., '241030' for Oct 30, 2024
  const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase(); // random alphanumeric
  return `${datePart}${randomPart}`;
}

function generateTrackingOrder() {
  const datePart = new Date().toISOString().slice(2, 8).replace(/-/g, ''); // e.g., '241030' for Oct 30, 2024
  const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase(); // random alphanumeric
  return `SP${datePart}${randomPart}`;
}

module.exports = {
  generateOrderId,
  generateTrackingOrder
};