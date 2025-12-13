/**
 * Student Matching Logic
 * * Generates matches for students based on availability and blocked lists.
 * Ensures symmetry (if A blocks B, B blocks A) and prioritizes fair distribution.
 */
function generateMatches(students) {
  const ids = students.map(s => s.id);

  // 1. Build symmetric unavailability map
  // We need to ensure that if Student A blocks Student B, 
  // Student B is also treated as having blocked Student A.
  const unavailable = {};
  for (const s of students) {
    unavailable[s.id] = new Set(s.unavailable_ids || []);
  }
  for (const s of students) {
    const a = s.id;
    for (const b of s.unavailable_ids || []) {
      if (!unavailable[b]) {
        unavailable[b] = new Set();
      }
      unavailable[b].add(a);
    }
  }

  // 2. Build initial list of allowed edges
  // An edge exists only if neither student has blocked the other.
  const allowedEdges = [];
  for (let i = 0; i < ids.length; i++) {
    for (let j = i + 1; j < ids.length; j++) {
      const a = ids[i];
      const b = ids[j];
      const aBlocked = unavailable[a] && unavailable[a].has(b);
      const bBlocked = unavailable[b] && unavailable[b].has(a);
      
      if (!aBlocked && !bBlocked) {
        allowedEdges.push({ a, b });
      }
    }
  }

  // Track how many matches each student currently has
  const degree = {};
  for (const id of ids) {
    degree[id] = 0;
  }

  const result = [];

  // 3. Greedy Strategy Loop
  // We keep picking matches until no valid options remain.
  while (true) {
    let bestIndex = -1;
    let bestScore = Infinity;

    for (let i = 0; i < allowedEdges.length; i++) {
      const { a, b } = allowedEdges[i];

      // STOP condition: If either student already has 3 matches, skip this pair.
      if (degree[a] >= 3 || degree[b] >= 3) continue;

      // SCORE: The sum of their current matches.
      // We look for the LOWEST score to prioritize students with few matches.
      const score = degree[a] + degree[b];

      if (score < bestScore) {
        bestScore = score;
        bestIndex = i;
      }
    }

    if (bestIndex === -1) {
      // No more valid edges found
      break;
    }

    // Lock in the best match found
    const chosen = allowedEdges[bestIndex];
    result.push({
      student_id_1: chosen.a,
      student_id_2: chosen.b,
    });

    // Update their match counts
    degree[chosen.a]++;
    degree[chosen.b]++;

    // Remove the used edge so we don't process it again
    allowedEdges.splice(bestIndex, 1);
  }

  return result;
}

// --- DEMO TEST CASE ---
// This runs ONLY if you type 'node matcher.js' in the terminal.
// It is ignored if you import this file into another test script.
if (require.main === module) {
  console.log("--- Running Demo Test Case ---");
  const students = [
    { id: "alice", unavailable_ids: ["dave"] },
    { id: "bob",   unavailable_ids: [] },
    { id: "carol", unavailable_ids: [] },
    { id: "dave",  unavailable_ids: ["alice"] },
    { id: "erin",  unavailable_ids: [] },
    { id: "frank", unavailable_ids: [] },
  ];
  console.log(generateMatches(students));
}

// Export the function so the test file can use it
module.exports = generateMatches;