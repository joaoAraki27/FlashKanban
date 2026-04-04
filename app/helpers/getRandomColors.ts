export const getRandomColors = () => {
  const colors = [
    { bg: "#fee2e2", text: "#991b1b" },
    { bg: "#fef9c3", text: "#854d0e" },
    { bg: "#dcfce7", text: "#166534" },
    { bg: "#dbeafe", text: "#1e40af" },
    { bg: "#f3e8ff", text: "#6b21a8" },
    { bg: "#fce7f3", text: "#9d174d" },
    { bg: "#ffedd5", text: "#9a3412" },
    { bg: "#e0f2fe", text: "#075985" },
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};
