const mockMarks = [
  {
    courseCode: "SE303",
    courseName: "Software Project Management",
    assessments: [
      { name: "Quiz 1", total: 10, obtained: 8, percentage: 80 },
      { name: "Assignment 1", total: 15, obtained: 12, percentage: 80 },
      { name: "Mid Term", total: 25, obtained: 20, percentage: 80 },
      { name: "Final", total: 50, obtained: 41, percentage: 82 },
      { name: "Total", total: 100, obtained: 81, percentage: 81 },
    ],
    grade: "A-",
  },
  {
    courseCode: "CS301",
    courseName: "Database Systems",
    assessments: [
      { name: "Quiz 1", total: 10, obtained: 7, percentage: 70 },
      { name: "Assignment 1", total: 15, obtained: 11, percentage: 73 },
      { name: "Mid Term", total: 25, obtained: 18, percentage: 72 },
      { name: "Final", total: 50, obtained: 35, percentage: 70 },
      { name: "Total", total: 100, obtained: 71, percentage: 71 },
    ],
    grade: "B",
  },
  {
    courseCode: "CS305",
    courseName: "Operating Systems",
    assessments: [
      { name: "Quiz 1", total: 10, obtained: 9, percentage: 90 },
      { name: "Assignment 1", total: 15, obtained: 13, percentage: 87 },
      { name: "Mid Term", total: 25, obtained: 22, percentage: 88 },
      { name: "Final", total: 50, obtained: 44, percentage: 88 },
      { name: "Total", total: 100, obtained: 88, percentage: 88 },
    ],
    grade: "A",
  },
];

export default mockMarks;
