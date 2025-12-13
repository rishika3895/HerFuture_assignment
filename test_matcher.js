const generateMatches = require('./matcher');

function runTests() {
  console.log("Running tests...\n");

  const testCases = [
    {
      name: "Basic scenario: 4 students with no blocks",
      input: [
        { id: "A", unavailable_ids: [] },
        { id: "B", unavailable_ids: [] },
        { id: "C", unavailable_ids: [] },
        { id: "D", unavailable_ids: [] }
      ],
      // With 4 people fully connected, everyone matches everyone else (3 matches each).
      // Total pairs = (4 * 3) / 2 = 6
      expectedMatches: 6
    },
    {
      name: "Edge case: One student blocks everyone",
      input: [
        { id: "A", unavailable_ids: ["B", "C", "D"] },
        { id: "B", unavailable_ids: [] },
        { id: "C", unavailable_ids: [] },
        { id: "D", unavailable_ids: [] }
      ],
      check: (result) => {
        // Flatten the results to see all IDs involved in matches
        const flat = result.flatMap(p => [p.student_id_1, p.student_id_2]);
        // Student A should not be in the list at all
        return !flat.includes("A");
      }
    },
    {
      name: "Odd number of students (3 total)",
      input: [
        { id: "A", unavailable_ids: [] },
        { id: "B", unavailable_ids: [] },
        { id: "C", unavailable_ids: [] }
      ],
      // Max possible is A-B, B-C, C-A (3 pairs total)
      expectedMatches: 3
    },
    {
      name: "Symmetry rule: If A blocks B, B must also block A",
      input: [
        { id: "A", unavailable_ids: ["B"] },
        { id: "B", unavailable_ids: [] }, // B didn't explicitly block A, but A blocked B
        { id: "C", unavailable_ids: [] },
        { id: "D", unavailable_ids: [] }
      ],
      check: (result) => {
        // Ensure no pair exists that connects A and B
        return !result.some(p => 
          (p.student_id_1 === "A" && p.student_id_2 === "B") ||
          (p.student_id_1 === "B" && p.student_id_2 === "A")
        );
      }
    }
  ];

  testCases.forEach(test => {
    console.log(`Test: ${test.name}`);
    const result = generateMatches(test.input);
    let passed = true;
    
    // Check match count if the test specifies it
    if (test.expectedMatches !== undefined) {
      if (result.length !== test.expectedMatches) {
        console.error(`FAILED: Expected ${test.expectedMatches} matches, got ${result.length}`);
        passed = false;
      }
    }

    // Check custom logic if the test specifies it
    if (test.check) {
      if (!test.check(result)) {
        console.error(`FAILED: Logic check failed.`);
        passed = false;
      }
    }

    if (passed) console.log("PASSED");
    console.log("---");
  });
}

runTests();