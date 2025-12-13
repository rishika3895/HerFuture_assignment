# Student Matching Logic

### Overview
I created this code to solve the challenge of pairing students for 1:1 sessions. The goal was to give every student up to 3 matches while ensuring that we respect their "blocked" lists and keep the distribution fair.

### How to Run the Code
**Important:** Please ensure both `matcher.js` and `test_matcher.js` are in the **same folder** before running.

You can run the solution in two ways using Node.js:

1.  **Run the Demo:**
    To see the output for the specific example provided in the assignment, run the main file directly:
    ```bash
    node matcher.js
    ```

2.  **Run the Test Suite:**
    To verify the logic against edge cases (like odd numbers of students or total blocks), run the test file:
    ```bash
    node test_matcher.js
    ```

### How My Solution Works
My algorithm follows three main steps:

1.  **Safety Check (Symmetry):**
    First, I ensure that blocking is a two-way street. If Student A blocks Student B, I automatically ensure Student B cannot match with Student A either. This prevents any unsafe pairings.

2.  **Building the Network:**
    I create a list of all *possible* valid connections. If two students haven't blocked each other, they are added to the pool of potential matches.

3.  **The "Fairness" Strategy (Greedy Approach):**
    The core challenge was ensuring fairness when a perfect match isn't possible.
    * I track how many matches each student currently has (their "degree").
    * I look at all available pairs and calculate a score based on their current match counts.
    * I always pick the pair with the **lowest score** first.
    * **Why?** This prioritizes students who are currently "starving" (have 0 or 1 match) over those who are already "full" (have 3 matches). It balances the network naturally.

### Complexity Analysis
* **Time Complexity:** $O(N^3)$ (High Level)
    * Building the initial graph takes $O(N^2)$ to check every pair.
    * The matching loop scans the list of available edges to find the best candidate. For typical classroom sizes (e.g., < 1000 students), this runs in milliseconds.
* **Space Complexity:** $O(N^2)$
    * We store a list of allowed edges, which in a dense graph could grow to the square of the number of students.

