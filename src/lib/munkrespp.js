/**
 * Introduction
 * ============
 *
 * The Munkres Plus Plus module provides an upper layer to the Munkres module,
 * which is an implementation of the Munkres algorithm (Hungarian module or 
 * Kuhn-Munkres algorithm).
 * The Munkres algorithm is useful for solving Assignment problems.
 *
 *
 * Assignment Problem
 * ==================
 *
 * Let C be an n×n-matrix representing the costs of each of n workers
 * to perform any of n jobs. The assignment problem is to assign jobs to
 * workers in a way that minimizes the total cost. Since each worker can perform
 * only one job and each job can be assigned to only one worker the assignments
 * represent an independent set of the matrix C.
 *
 * One way to generate the optimal set is to create all permutations of
 * the indices necessary to traverse the matrix so that no row and column
 * are used more than once.
 * While this approach works fine for small matrices, it does not scale. It
 * executes in O(n!) time.
 * The Munkres algorithm runs in O(n³) time, rather than O(n!).
 *
 * source: https://github.com/addaleax/munkres-js/blob/master/munkres.js
 *
 *
 * Specific Problem
 * ==================
 * 
 * This module aims to solve this problem:
 * Let W an nxm-matrix representing the wish list of n students for m courses
 * The values of the matrix are the ranks of the courses, and are in [1; m]
 * Let I an nxm-matrix representing the interest of n student for m courses
 * The values of the matrix are in: {
 *   -2 (not interesting at all);
 *   -1 (not really interesting);
 *    1 (interesting);
 *    2 (very interesting)
 * }
 * Let N an m-array representing the minimum number of students we want to
 * have in each course.
 * Let X an m-array representing the maximum number of students we can
 * have in each course.
 * Let C an m-array representing the costs of assigning students to a course
 * in their wish list.
 *
 *
 * Specific solution
 * =================
 *
 * To use the Munkres algorithm, the matrix given as input must be square,
 * and no other parameter can be added. So we have to transform all the inputs
 * listed in the previous section in a single matrix.
 * 
 * Step 1:
 * We replace every rank in W (the wish matrix) by its cost in the array C.
 *
 * Step 2:
 * We duplicate each column in W, as many times as there are places in the
 * course. So we get an nxl-matrix. l is the sum of the max number of places
 * for each course.
 *
 * Step 3:
 * We add "phantom students" or "fake students" to have a square matrix: 
 * we insert (l-n) rows at the end of the matrix, each row is full of zeros.
 * Which means that to whatever we assign a phantom student, the global penalty
 * doesn't change.
 * 
 * Step 4:
 * In step 3, we have managed the maximum places for each course. Now, for the
 * minimums, the idea is instead of inserting rows full of zeros, to insert 
 * rows with a very high cost for the Ni places of each course. Ni is the
 * minimum number of students we want to have for the course i.
 * This way, we are sure the munkres algorithm will always assign valid 
 * students to the Ni places of each course.
 *
 * Step 5:
 * To consider the interest matrix when creating our new matrix, the idea was
 * to increase the penalties in the matrix a little.
 * The formula which was used is this one:
 *  interest =  2 ("very interesting")          ===> do nothing
 *  interest =  1 ("interesting")               ===> add 33% of the difference
 *              between the actual penalty and the next penalty in the C array
 *  interest = -1 ("not really interesting")    ===>  add 66% of the difference
 *              between the actual penalty and the next penalty in the C array
 *  interest = -2 ("not interesting at all")    ===> add 100% of the difference
 *              between the actual penalty and the next penalty in the C array
 * This way, the cost of assigning a 3rd wish which is considered 
 * "very interesting" and the cost of assigning a 2nd wish which is considered
 * "not interesting at all" are the same.
 *
 * After step 5 is performed, we get a result matrix we can use as input to
 * the munkres algorithm. After that we have to do some postprocessing to 
 * remove the "phantom students".
 *
 *
 * Example:
 * W = [ [1,2, 3], [1, 3, 2], [2,1, 3], [2, 3,1], [3,1,2], [ 3, 2,1] ]
 * I = [ [2,1,-2], [2,-1,-1], [1,1,-2], [2,-2,2], [2,2,2], [-2,-2,2] ]
 * N = [1,1,1]
 * X = [3,4,3]
 * C = [0,1,8]
 *
 * Step 1:
 * R = [ [0,1,8], [0,8,1], [1,0,8], [1,8,0], [8,0,1], [8,1,0] ]
 * Step 2:
 * R = [ [0,0,0,1,1,1,1,8,8,8], 
 *       [0,0,0,8,8,8,8,1,1,1],
 *       [1,1,1,0,0,0,0,8,8,8],
 *       [1,1,1,8,8,8,8,0,0,0],
 *       [8,8,8,0,0,0,0,1,1,1],
 *       [8,8,8,1,1,1,1,0,0,0] ]
 * Step 3:
 * R = [ [0,0,0,1,1,1,1,8,8,8],
 *       [0,0,0,8,8,8,8,1,1,1],
 *       [1,1,1,0,0,0,0,8,8,8],
 *       [1,1,1,8,8,8,8,0,0,0],
 *       [8,8,8,0,0,0,0,1,1,1],
 *       [8,8,8,1,1,1,1,0,0,0],
 *       [0,0,0,0,0,0,0,0,0,0],
 *       [0,0,0,0,0,0,0,0,0,0],
 *       [0,0,0,0,0,0,0,0,0,0],
 *       [0,0,0,0,0,0,0,0,0,0] ]
 * Step 4:
 * R = [ [   0, 0, 0,  1, 1, 1, 1,   8, 8, 8 ], 
 *       [   0, 0, 0,  8, 8, 8, 8,   1, 1, 1 ],
 *       [   1, 1, 1,  0, 0, 0, 0,   8, 8, 8 ],
 *       [   1, 1, 1,  8, 8, 8, 8,   0, 0, 0 ],
 *       [   8, 8, 8,  0, 0, 0, 0,   1, 1, 1 ],
 *       [   8, 8, 8,  1, 1, 1, 1,   0, 0, 0 ],
 *       [ 999, 0, 0,999, 0, 0, 0, 999, 0, 0 ],
 *       [ 999, 0, 0,999, 0, 0, 0, 999, 0, 0 ],
 *       [ 999, 0, 0,999, 0, 0, 0, 999, 0, 0 ],
 *       [ 999, 0, 0,999, 0, 0, 0, 999, 0, 0 ] ]
 * Step 5:
 * R = [ [   0,  0,  0,   3,  3,  3,  3,  16, 16, 16 ], 
 *       [   0,  0,  0,  13, 13, 13, 13,   6,  6,  6 ],
 *       [   3,  3,  3,   0,  0,  0,  0,  16, 16, 16 ],
 *       [   1,  1,  1,  16, 16, 16, 16,   0,  0,  0 ],
 *       [   8,  8,  8,   0,  0,  0,  0,   1,  1,  1 ],
 *       [  16, 16, 16,   8,  8,  8,  8,   0,  0,  0 ],
 *       [ 999,  0,  0, 999,  0,  0,  0, 999,  0,  0 ],
 *       [ 999,  0,  0, 999,  0,  0,  0, 999,  0,  0 ],
 *       [ 999,  0,  0, 999,  0,  0,  0, 999,  0,  0 ],
 *       [ 999,  0,  0, 999,  0,  0,  0, 999,  0,  0 ] ]
 *
 *
 *
 * Notes
 * ======
 *
 * - The number of students must be lower or equal than the sum of the places
 *   of each course
 * - The sum of the minimum places of each course must be lower or equal than
 *   the number of students.
 * - The module operates on a *copy* of the arrays and matrixes.
 * - The caller must not use a linear function as a generator for the penalties
 *   like : [0,100,200,300,400,500]
 * - The caller should use the penalties generated by the function x^3:
 *   [0, 1, 8, 27, 64, 125, 216, 343, 512, 729]
 * - In step 5, as there is not a next penalty in the C-array for the last wish
 *   we use 2 * last penalty as a next penalty.
 * - The munkresspp module needs the munkres module to run. 
 *
 *
 * Example of use
 * ===============
 *
 * wishs = [[1,2,3], [2,3,1], [3,1,2], [3,2,1]];
 * interests = [[1,-2,-2], [2,-1,2], [2,2,1], [-1,1,2]];
 * penalties = [0,1,8]
 * mins = [1,1,0]
 * maxs = [2,2,2]
 *
 * assignments = process( penalties, mins, maxs, wishs, interests );
 * stats = analyze_results(assignments, penalties, mins, maxs, wishs, interests);
 *
 * console.log(assignments);
 * console.log(stats);
 *
 *
 * References
 * ==========
 *
 * 1. http://www.public.iastate.edu/~ddoty/HungarianAlgorithm.html
 *
 * 2. Harold W. Kuhn. The Hungarian Method for the assignment problem.
 *    *Naval Research Logistics Quarterly*, 2:83-97, 1955.
 *
 * 3. Harold W. Kuhn. Variants of the Hungarian method for assignment
 *    problems. *Naval Research Logistics Quarterly*, 3: 253-258, 1956.
 *
 * 4. Munkres, J. Algorithms for the Assignment and Transportation Problems.
 *    *Journal of the Society of Industrial and Applied Mathematics*,
 *    5(1):32-38, March, 1957.
 *
 * 5. https://en.wikipedia.org/wiki/Hungarian_algorithm
 *
 * 6. https://github.com/addaleax/munkres-js
 *
 *
 * Copyright and License
 * =====================
 * 
 * Copyright 2019 Mohamed CHALLAL.
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import computeMunkres from "munkres-js";

// return the sum of the values of an array 
// example : arrSum([20, 10, 5, 10]) -> 45
const arrSum = arr => arr.reduce((a,b) => a + b, 0);

const INF = 999999999;


class MunkressApp {

    /**
     * [Preprocessing]
     * create square matrix containing the penalties of each student for each wish.
     * @param {!Array<Array<int>>} wish_matrix is a matrix, each row is a student,
     *      each column is a course, each value is the rank of the course in the
     *      wish list of the student. The values are in [1 ; number of courses]
     * @param {!Array<Array<int>>} interest_matrix is a matrix, each row is a
     *      student, each column is a course, each value is the interest of the
     *      student for the course. The values are in: {
     *        -2 (not interesting at all);
     *        -1 (not really interesting);
     *         1 (interesting);
     *         2 (very interesting)
     *      }
     * @param {!Array<int>} wish_penalties represents the penalties while assigning
     *      a student to one of its wishs
     * @param {!Array<int>} wish_min_places is the minimum number of students we
     *      must have for each wish
     * @param {!Array<int>} wish_max_places is the maximum number of students we
     *      can have for each wish
     * @return {!Array<Array<int>>} this matrix can be used as an input for the
     *      munkres algorithm
     */

    static create_square_matrix(
        wish_matrix,
        interest_matrix,
        wish_penalties,
        wish_min_places,
        wish_max_places
    ) {
        let new_matrix = [];
        let students_number = wish_matrix.length;
        let wishes_number = wish_penalties.length;
        let total_places = arrSum(wish_max_places);

        for (let student_i = 0; student_i < students_number; student_i++) {
            let student_penalties = [];
            for (let wish_j = 0; wish_j < wishes_number; wish_j++) {
                let wish_rank = wish_matrix[student_i][wish_j];
                let wish_interest = interest_matrix[student_i][wish_j];
                let penalty = wish_penalties[wish_rank - 1];
                let next_penalty = 0;

                if (wish_rank < wish_penalties.length) {
                    next_penalty = wish_penalties[wish_rank];
                } else {
                    next_penalty = 2 * penalty;
                }

                // Lagrange interpolation we cas use instead of the switch bloc
                // coef = −0.0283333x^3 + 0.00166667x^2 − 0.136667x + 0.493333
                let coef = 0;
                switch (wish_interest) {
                    case -2:
                        coef = 1;
                        break;

                    case -1:
                        coef = 0.66;
                        break;

                    case 1:
                        coef = 0.33;
                        break;

                    case 2:
                        coef = 0;
                        break;

                    case null:
                        throw Error("Invalid null value for wish interest !");

                    case undefined:
                        throw Error("Invalid undefined value for wish interest !");

                    default:
                        coef = 0;
                        throw Error("Invalid value for wish interest !\n"
                            + "Wish interest value must be in:\n"
                            + "(very interesting : 2,\n"
                            + " interesting : 1,\n"
                            + " not really interesting : -1,\n"
                            + " not interesting at all : -2)");

                }
                penalty += Math.round(coef * (next_penalty - penalty));

                let places = wish_max_places[wish_j];
                for (let _ = 0; _ < places; _++) {
                    student_penalties.push(penalty);
                }
            }
            new_matrix.push(student_penalties)
        }

        // add phantom students
        for (let i = students_number; i < total_places; i++) {
            let student_penalties = [];
            for (let wish_j = 0; wish_j < wishes_number; wish_j++) {
                for (let place_k = 0; place_k < wish_min_places[wish_j]; place_k++) {
                    student_penalties.push(INF);
                }
                for (let place_k = 0;
                     place_k < wish_max_places[wish_j] - wish_min_places[wish_j];
                     place_k++
                ) {
                    student_penalties.push(0);
                }
            }
            new_matrix.push(student_penalties);
        }

        return new_matrix;
    }


    /**
     * [Preprocessing]
     * create square matrix containing the penalties of each student for each wish.
     * @param {!Array<Array<int>>} wish_matrix is a matrix, each row is a student,
     *      each column is a course, each value is the rank of the course in the
     *      wish list of the student. The values are in [1 ; number of courses]
     * @param {!Array<int>} wish_penalties represents the penalties while assigning
     *      a student to one of its wishs
     * @param {!Array<int>} wish_min_places is the minimum number of students we
     *      must have for each wish
     * @param {!Array<int>} wish_max_places is the maximum number of students we
     *      can have for each wish
     * @return {!Array<Array<int>>} this matrix can be used as an input for the
     *      munkres algorithm
     */
    static create_square_matrix_without_interests(
        wish_matrix,
        wish_penalties,
        wish_min_places,
        wish_max_places
    ) {
        let new_matrix = [];
        let students_number = wish_matrix.length;
        let wishes_number = wish_penalties.length;
        let total_places = arrSum(wish_max_places);

        for (let student_i = 0; student_i < students_number; student_i++) {
            let student_penalties = [];
            for (let wish_j = 0; wish_j < wishes_number; wish_j++) {
                let wish_rank = wish_matrix[student_i][wish_j];
                let penalty = wish_penalties[wish_rank - 1];

                let places = wish_max_places[wish_j];
                for (let _ = 0; _ < places; _++) {
                    student_penalties.push(penalty);
                }
            }
            new_matrix.push(student_penalties)
        }

        // add phantom students
        for (let i = students_number; i < total_places; i++) {
            let student_penalties = [];
            for (let wish_j = 0; wish_j < wishes_number; wish_j++) {
                for (let place_k = 0; place_k < wish_min_places[wish_j]; place_k++) {
                    student_penalties.push(INF);
                }
                for (let place_k = 0;
                     place_k < wish_max_places[wish_j] - wish_min_places[wish_j];
                     place_k++
                ) {
                    student_penalties.push(0);
                }
            }
            new_matrix.push(student_penalties);
        }

        return new_matrix;
    }


    /**
     * generate a random wish matrix and a random interest matrix
     * @param {!int} students_number is the number of rows the matrix will have
     * @param {!int} wish_number is the number of columns the matrix will have
     * @return {!Object} a dictionnary containing the wish matrix
     *      and the interest matrix
     */
    static generate_random_matrix(students_number, wish_number) {
        let wish_matrix = [];
        let interest_matrix = [];
        for (let student_i = 0; student_i < students_number; student_i++) {
            let arr = [];
            for (let wish_j = 0; wish_j < wish_number; wish_j++) {
                arr.push(Math.floor(Math.random() * wish_number) + 1);
            }
            wish_matrix.push(arr);
            interest_matrix.push(new Array(wish_number).fill(-1));
        }
        return {"wish": wish_matrix, "interest": interest_matrix};
    }


    /**
     * [Postprocessing]
     * extract the wish_index (1 indexation) of the students' places
     * @param {!Array<Array<int>>} indexes is an array of arrays with a length of 2
     *      the first value is the index of the student (0 indexation)
     *      the second value is the index of the place (0 indexation)
     * @param {!Array<int>} wish_max_places is the maximum number of students we
     *      can have for each wish
     * @return {!Array<int>}
     *      the index of the array is the index of the student (0 indexation)
     *      the value is the index of the wish (the course) (1 indexation)
     */
    static extract_assignments(indexes, wish_max_places) {
        let assignments = [];
        let wishes_number = wish_max_places.length;

        // wish_range contain the global index of the first place of each course
        // example: places=[10, 20, 5] - wish_range=[0, 10, 30]
        let wish_range = new Array(wishes_number).fill(0);
        let index = 0;
        for (let wish_i = 0; wish_i < wishes_number; wish_i++) {
            wish_range[wish_i] = index;
            index += wish_max_places[wish_i];
        }

        for (let i = 0; i < indexes.length; i++) {
            let wish_i = 0;
            while (wish_i < wishes_number && indexes[i][1] >= wish_range[wish_i]) {
                wish_i += 1;
            }
            assignments.push(wish_i); // 1 indexation
        }
        return assignments;
    }


    /**
     * this function performs some statistics about
     *      the assignments made with the munkres algorithm.
     * @param {!Array<int>} assignments
     *      the index of the array is the index of the student (0 indexation)
     *      the value is the index of the wish (the course) (1 indexation)
     * @param {!Array<int>} wish_penalties represents the penalties while assigning
     *      a student to one of its wishs
     * @param {!Array<int>} wish_min_places is the minimum number of students we
     *      must have for each wish
     * @param {!Array<int>} wish_max_places is the maximum number of students we
     *      can have for each wish
     * @param {!Array<Array<int>>} wish_matrix is a matrix, each row is a student,
     *      each column is a course, each value is the rank of the course in the
     *      wish list of the student. The values are in [1 ; number of courses]
     * @param {Array<Array<int>>} interest_matrix is a matrix, each row is a
     *      student, each column is a course, each value is the interest of the
     *      student for the course. The values are in: {
     *        -2 (not interesting at all);
     *        -1 (not really interesting);
     *         1 (interesting);
     *         2 (very interesting)
     *      }
     *      This parameter is optionnal.
     * @return {!Object} a dictionnary which contains different statistics about
     *      the assignments made with the munkres algorithm.
     *      This is the structure of the result:
     *      {
     *        "penalty1": int, // the global penalty without the interests
     *        "penalty2": int, // the global penalty with the interests
     *        "students": [
     *          {
     *            "assignment": int, //the course to which the student is assigned
     *            "wish_rank": int, // the rank of the wish
     *            "interest": int, // the interest of the student for the course
     *            "penalty1": int, // the penalty without the interest
     *            "penalty2": int, // the penalty with the interest
     *          },
     *          ...
     *        ],
     *        "courses": [
     *          {
     *            "students": int, // number of students assigned to the course
     *            1: int, // number of students who put the course as their
     *                    // first wish and were assigned to the course
     *            ...
     *          },
     *          ...
     *        ],
     *        "wishes": {
     *          1: int, // number of students who got their first wish
     *          ...
     *        }
     *      }
     *      If the interests are disabled (no attribute interest_matrix),
     *      penalty2 will not appear in the result.
     */
     static analyze_results(
        assignments,
        wish_penalties,
        wish_min_places,
        wish_max_places,
        wish_matrix,
        interest_matrix
    ) {
        let students_number = wish_matrix.length;
        let wishes_number = wish_penalties.length;
        let interests_enabled = (typeof interest_matrix !== 'undefined');

        let results = {
            "penalty1": 0,
            "students": [],
            "courses": [],
            "wishes": {}
        };
        if (interests_enabled) {
            results["penalty2"] = 0;
        }

        for (let i = 0; i < wishes_number; i++) {
            results["courses"].push({
                "students": 0,
                "penalty1": 0
            });
            if (interests_enabled) {
                results["courses"][i]["penalty2"] = 0;
            }
        }

        for (let i = 0; i < students_number; i++) {
            let assignment = assignments[i];
            let wish_rank = wish_matrix[i][assignment - 1];
            let penalty1 = wish_penalties[wish_rank - 1];

            results["penalty1"] += penalty1;
            results["students"].push({
                "assignment": assignment,
                "wish_rank": wish_rank,
                "penalty1": penalty1
            });

            if (wish_rank in results["wishes"]) {
                results["wishes"][wish_rank] += 1;
            } else {
                results["wishes"][wish_rank] = 1;
            }

            results["courses"][assignment - 1]["students"] += 1;
            results["courses"][assignment - 1]["penalty1"] += penalty1;
            if (wish_rank in results["courses"][assignment - 1]) {
                results["courses"][assignment - 1][wish_rank] += 1;
            } else {
                results["courses"][assignment - 1][wish_rank] = 1;
            }


            if (interests_enabled) {
                let interest = interest_matrix[i][assignment - 1];
                let penalty2 = penalty1;

                let next_penalty = 0;
                if (wish_rank < wish_penalties.length) {
                    next_penalty = wish_penalties[wish_rank];
                } else {
                    next_penalty = 2 * penalty1;
                }
                let coef = 0;
                switch (interest) {
                    case -2:
                        coef = 1;
                        break;

                    case -1:
                        coef = 0.66;
                        break;

                    case 1:
                        coef = 0.33;
                        break;

                    case 2:
                        coef = 0;
                        break;

                    default:
                        coef = 0;
                        console.log("Invalid value for wish interest !\n"
                            + "Wish interest value must be in:\n"
                            + "(very interesting : 2,\n"
                            + " interesting : 1,\n"
                            + " not really interesting : -1,\n"
                            + " not interesting at all : -2)");
                        break;
                }
                penalty2 += Math.round(coef * (next_penalty - penalty1));

                results["penalty2"] += penalty2;
                results["students"][i]["penalty2"] = penalty2;
                results["students"][i]["interest"] = interest;
                results["courses"][assignment - 1]["penalty2"] += penalty2;
            }

        }

        return results;
    }


    /**
     * run the munkres algorithm and does some postprocessing on the results.
     * @param {!Array<int>} wish_penalties represent the penalties while assigning
     *      a student to one of its wishs
     * @param {!Array<int>} wish_min_places is the minimum number of students we
     *      must have for each wish
     * @param {!Array<int>} wish_max_places is the maximum number of students we
     *      can have for each wish
     * @param {!Array<Array<int>>} wish_matrix is a matrix, each row is a student,
     *      each column is a course, each value is the rank of the course in the
     *      wish list of the student. The values are in [1 ; number of courses]
     * @param {Array<Array<int>>} interest_matrix is a matrix, each row is a
     *      student, each column is a course, each value is the interest of the
     *      student for the course. The values are in: {
     *        -2 (not interesting at all);
     *        -1 (not really interesting);
     *         1 (interesting);
     *         2 (very interesting)
     *      }
     *      This parameter is optional.
     * @return {!Array<int>}
     *      the index of the array is the index of the student (0 indexation)
     *      the value is the index of the wish (the course) (1 indexation)
     */
    static process(
        wish_penalties,
        wish_min_places,
        wish_max_places,
        wish_matrix,
        interest_matrix
    ) {
        // testing the preconditions
        let students_number = wish_matrix.length;
        let total_min_places = arrSum(wish_min_places);
        let total_max_places = arrSum(wish_max_places);
        if (students_number > total_max_places) {
            throw Error("Too many students : The number of students must be lower or equal than the "
                + "sum of the places.");
        }
        if (students_number < total_min_places) {
            throw Error("Too few students : The number of students must be greater or equal than the "
                + "sum of the minimum number of students for each course.");
        }

        let matrix;
        if (typeof interest_matrix !== 'undefined') {
            matrix = this.create_square_matrix(wish_matrix,
                interest_matrix,
                wish_penalties,
                wish_min_places,
                wish_max_places);
        } else {
            matrix = this.create_square_matrix_without_interests(wish_matrix,
                wish_penalties,
                wish_min_places,
                wish_max_places);
        }

        let indices = computeMunkres(matrix);

        let assignments = this.extract_assignments(indices, wish_max_places);
        // remove the phantom students
        assignments = assignments.slice(0, students_number);

        return assignments;
    }

}



/*
 ****************************** Example of use ********************************
 


// obj = generate_random_matrix(300, 5);
// wishs = obj["wish"]
// interests = obj["interest"]

wishs = [[1,2,3], [2,3,1], [3,1,2], [3,2,1]];
interests = [[1,-2,-2], [2,-1,2], [2,2,1], [-1,1,2]];
penalties = [0,1,8]
mins = [1,1,0]
maxs = [2,2,2]

assignments = process( penalties, mins, maxs, wishs, interests );
stats = analyze_results(assignments, penalties, mins, maxs, wishs, interests);
    

console.log(assignments);
console.log(stats);

*/

export default MunkressApp;
