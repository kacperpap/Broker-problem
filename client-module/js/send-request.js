import { showResults } from "./output-manager.js";

// POST
export async function send(dataToSend, isBalanced) {
    const loader = document.getElementById("loader-wrapper");
    loader.style.display = "flex";
    try {
      const response = await fetch("http://localhost:3000/calculate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSend),
      });
  
      if (response.status === 400) {
        let errorText = await response.json().then((e) => e.error);
        Swal.fire({
          icon: "warning",
          title: "Oops...",
          text: "Wrong request",
          footer: errorText,
        });
      } else if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: "Response from calculating module was wrong",
          footer: "Try different example",
        });
        // throw new Error("Network response was not ok");
      } else {
        const data = await response.json();
        console.log("Data successfully fetched", data);
        showResults(data, isBalanced);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong",
        footer: "Try again later",
      });
      console.error("Error:", error);
    }
  
    loader.style.display = "none";
  }