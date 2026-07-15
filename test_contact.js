fetch("https://car-taxi-server-k7sa.onrender.com/api/v1/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name: "test", email: "test@example.com", message: "test message" })
})
.then(res => {
  console.log("Status:", res.status);
  return res.text();
})
.then(text => console.log("Response:", text))
.catch(err => console.error(err));
