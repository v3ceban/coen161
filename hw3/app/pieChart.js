function describeArc(x, y, radius, startAngle, endAngle) {
  let start = polarToCartesian(x, y, radius, endAngle);
  let end = polarToCartesian(x, y, radius, startAngle);
  let largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  let d = [
    "M",
    start.x,
    start.y,
    "A",
    radius,
    radius,
    0,
    largeArcFlag,
    0,
    end.x,
    end.y,
    "L",
    x,
    y,
    "Z",
  ].join(" ");
  return d;
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  let angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians),
  };
}

function getColor() {
  const pastelColors = [
    "#FFC3A0",
    "#FFD3FF",
    "#FFDFD3",
    "#D3E1FF",
    "#FFEDD8",
    "#FFD8E9",
    "#D3FFFC",
    "#E1D3FF",
    "#FFD8B1",
    "#D3F3FF",
  ];
  if (getColor.counter === undefined) {
    getColor.counter = 0;
  }
  if (getColor.counter < pastelColors.length) {
    return pastelColors[getColor.counter++];
  } else {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }
}

async function pieChart() {
  const svg = document.getElementById("pieChart");
  const menu = document.querySelector("div");
  const centerX = svg.clientWidth / 2;
  const centerY = svg.clientHeight / 2;
  const radius = Math.min(centerX, centerY) - 100;
  const data = await fetch("./app/data.json").then((res) => res.json());

  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  let startAngle = 0;

  for (let i = 0; i < data.length; i++) {
    let sliceAngle = (data[i].value / total) * 360;
    let endAngle = startAngle + sliceAngle;
    let middleAngle = (startAngle + endAngle) / 2;
    let middlePoint = polarToCartesian(
      centerX,
      centerY,
      radius * 1.3,
      middleAngle,
    );
    let color = getColor();

    if (data.length === 1) {
      let circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle",
      );
      circle.setAttribute("cx", centerX);
      circle.setAttribute("cy", centerY);
      circle.setAttribute("r", radius);
      circle.setAttribute("fill", color);
      svg.appendChild(circle);

      let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", middlePoint.x);
      text.setAttribute("y", middlePoint.y);
      text.setAttribute("text-anchor", "middle");
      text.textContent =
        data[i].name + " " + ((data[i].value / total) * 100).toFixed(1) + "%";
      svg.appendChild(text);

      let square = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "rect",
      );
      square.setAttribute("width", 15);
      square.setAttribute("height", 15);
      square.setAttribute("fill", color);
      square.setAttribute("x", middlePoint.x + 15);
      square.setAttribute("y", middlePoint.y - 13);
      svg.appendChild(square);

      break;
    }

    let path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      describeArc(centerX, centerY, radius, startAngle, endAngle),
    );
    path.setAttribute("fill", color);
    path.addEventListener("mouseover", () => {
      menu.textContent =
        data[i].name + " " + ((data[i].value / total) * 100).toFixed(1) + "%";
      menu.style.display = "block";
    });
    path.addEventListener("mousemove", (e) => {
      const rect = svg.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      menu.style.left = x + 10 + "px";
      menu.style.top = y + 40 + "px";
    });
    path.addEventListener("mouseout", () => {
      menu.style.display = "none";
    });
    svg.appendChild(path);

    let text = document.createElementNS("http://www.w3.org/2000/svg", "text");
    text.setAttribute("x", middlePoint.x + 10);
    text.setAttribute("y", middlePoint.y);
    text.setAttribute("text-anchor", "end");
    text.textContent = data[i].name;
    svg.appendChild(text);

    let square = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    square.setAttribute("width", 15);
    square.setAttribute("height", 15);
    square.setAttribute("fill", color);
    square.setAttribute("x", middlePoint.x + 15);
    square.setAttribute("y", middlePoint.y - 13);
    svg.appendChild(square);

    startAngle = endAngle;
  }
}

pieChart();
