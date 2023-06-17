/* @Author: Kizito - kizomanizo@gmail(dot)com */
const memberInput = document.getElementById("member_id");
const checkBalance = document.getElementById("check_balance");
const backEnd = "https://tankeys.com:3001/nssf/";
const alertBox = document.getElementById("alert");
const headingOne = document.getElementById("headingOne");
const headingTwo = document.getElementById("headingTwo");
const balHeading = document.getElementById("balHeading");
const empNumber = document.getElementById("empNumber");
const rightContent = document.getElementById("right-content");

// Clear headings and empNumber then add Loading... placeholder
checkBalance.onclick = function () {
  headingOne.innerHTML = "";
  headingTwo.innerHTML = "";
  empNumber.innerHTML = "";
  balHeading.innerHTML = "Loading...";
  rightContent.innerHTML = "";
  getBalance();
};

// Close the alert box
async function closeAlert() {
  alertBox.style.display = "none";
}

async function getBalance() {
  try {
    const response = await fetch(backEnd + memberInput.value);
    const result = await response.json();
    if (result.success === false || result.status === 500) {
      alertBox.innerHTML = `<strong>ERROR: </strong>${result.message}`;
      alertBox.style.display = "block";
      alertBox.style.backgroundColor = "#ff8300";
      setTimeout(closeAlert, 3000);
    } else if (result.message.data.length === 0) {
      alertBox.innerHTML = "<strong>ERROR: </strong> Member number invalid.";
      alertBox.style.display = "block";
      alertBox.style.backgroundColor = "#0e86d4";
      balHeading.innerHTML = "";
      setTimeout(closeAlert, 3000);
    } else {
      return renderView(result);
    }
  } catch (error) {
    alertBox.innerHTML = "<strong>ERROR: </strong> Backend service error.";
    alertBox.style.display = "block";
    alertBox.style.backgroundColor = "#ff000a";
    balHeading.innerHTML = "";
    setTimeout(closeAlert, 3000);
    console.log(error);
  }
}

async function renderView(result) {
  const message = result.message;
  const data = message.data;

  var totalBalance = 0; // Get total constributions
  for (let i = 0; i < data.length; i++) {
    totalBalance += Math.floor(parseInt(data[i].AMOUNT));
  }

  // Count employers
  const uniqueEmployerId = new Set();
  data.forEach((contrib) => {
    uniqueEmployerId.add(contrib.EMPLOYER_ID);
  });
  const uniqueEmployerCount = uniqueEmployerId.size;

  // List unique employers
  const uniqueEmployers = new Map();
  data.forEach((contrib) => {
    uniqueEmployers.set(contrib.EMPLOYER_ID, contrib.EMPNAME);
  });

  headingOne.innerHTML = "Total NSSF Balance"; // Render the view
  headingTwo.innerHTML = `Member Number: ${memberInput.value}`;
  balHeading.innerHTML = `${totalBalance.toLocaleString()} Shs.`;
  empNumber.innerHTML = `Number of Employers: ${uniqueEmployerCount}`;
  uniqueEmployers.forEach((employerName, employerId) => {
    const span = document.createElement("span");
    span.className = "content-line light";
    span.textContent = `${employerId}:${employerName}`;
    rightContent.appendChild(span);
  });
}
